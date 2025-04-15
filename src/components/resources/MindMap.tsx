import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';

interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
  color?: string;
  description?: string;
}

interface MindMapProps {
  data: MindMapNode;
  width?: number;
  height?: number;
}

const MindMap: React.FC<MindMapProps> = ({ data, width = 800, height = 600 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [nodeInfo, setNodeInfo] = useState<{ x: number; y: number; node: MindMapNode } | null>(null);
  const [transform, setTransform] = useState<{ x: number; y: number; k: number }>({ x: 0, y: 0, k: 1 });

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    // Create hierarchy
    const root = d3.hierarchy(data);

    // Create tree layout
    const treeLayout = d3.tree()
      .size([height - 100, width - 160])
      .nodeSize([60, 160]);

    const tree = treeLayout(root);

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setTransform({ x: event.transform.x, y: event.transform.y, k: event.transform.k });
        
        // Hide node info when zooming
        setNodeInfo(null);
      });

    svg.call(zoom as any);

    // Draw links with gradient effect
    const links = g.selectAll(".link")
      .data(tree.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.linkHorizontal()
        .x((d: any) => d.y)
        .y((d: any) => d.x)
      )
      .style("fill", "none")
      .style("stroke", (d: any) => {
        // Create gradient for links
        const linkId = `link-gradient-${d.source.data.id}-${d.target.data.id}`;
        const gradient = svg.append("defs")
          .append("linearGradient")
          .attr("id", linkId)
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("x1", d.source.y)
          .attr("y1", d.source.x)
          .attr("x2", d.target.y)
          .attr("y2", d.target.x);
          
        gradient.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", d.source.data.color || "#999");
          
        gradient.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", d.target.data.color || "#999");
          
        return `url(#${linkId})`;
      })
      .style("stroke-width", (d: any) => 3 - d.source.depth * 0.5)
      .style("opacity", 0.7)
      .style("stroke-dasharray", (d: any) => d.target.data.id === selectedNode ? "none" : "none")
      .style("animation", (d: any) => d.target.data.id === selectedNode ? "dash 5s linear infinite" : "none");

    // Add drop shadow filter for nodes
    const filter = svg.append("defs")
      .append("filter")
      .attr("id", "drop-shadow")
      .attr("height", "130%");

    filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 3)
      .attr("result", "blur");

    filter.append("feOffset")
      .attr("in", "blur")
      .attr("dx", 2)
      .attr("dy", 2)
      .attr("result", "offsetBlur");

    const feComponentTransfer = filter.append("feComponentTransfer")
      .attr("in", "offsetBlur")
      .attr("result", "shadow");

    feComponentTransfer.append("feFuncA")
      .attr("type", "linear")
      .attr("slope", 0.3);

    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode")
      .attr("in", "shadow");
    feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");

    // Draw nodes
    const nodes = g.selectAll(".node")
      .data(tree.descendants())
      .enter()
      .append("g")
      .attr("class", (d: any) => `node ${d.data.id === selectedNode ? 'selected' : ''}`)
      .attr("transform", (d: any) => `translate(${d.y},${d.x})`)
      .style("cursor", "pointer")
      .on("click", (event: any, d: any) => {
        setSelectedNode(selectedNode === d.data.id ? null : d.data.id);
        if (selectedNode !== d.data.id) {
          setNodeInfo({
            x: d.y,
            y: d.x,
            node: d.data
          });
        } else {
          setNodeInfo(null);
        }
        event.stopPropagation();
      });

    // Node circles with pulsing animation for root
    nodes.append("circle")
      .attr("r", (d: any) => d.depth === 0 ? 35 : 25 - d.depth * 3)
      .style("fill", (d: any) => d.data.color || "#999")
      .style("stroke", "#fff")
      .style("stroke-width", 2)
      .style("filter", "url(#drop-shadow)")
      .attr("class", (d: any) => d.depth === 0 ? "pulse" : "")
      .on("mouseover", function(event: any, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", (d: any) => (d.depth === 0 ? 40 : 30 - d.depth * 3));
      })
      .on("mouseout", function(event: any, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", (d: any) => (d.depth === 0 ? 35 : 25 - d.depth * 3));
      });

    // Add soft glow effect for nodes
    nodes.append("circle")
      .attr("r", (d: any) => d.depth === 0 ? 50 : 35 - d.depth * 3)
      .style("fill", (d: any) => d.data.color || "#999")
      .style("opacity", 0.2)
      .style("pointer-events", "none");

    // Node labels - background for better visibility
    nodes.append("rect")
      .attr("x", (d: any) => {
        const textAnchor = d.children ? "end" : "start";
        return textAnchor === "end" ? -90 : 15;
      })
      .attr("y", -10)
      .attr("width", 80)
      .attr("height", 20)
      .attr("rx", 5)
      .attr("ry", 5)
      .style("fill", (d: any) => d.depth === 0 ? d.data.color : "#fff")
      .style("opacity", (d: any) => d.depth === 0 ? 1 : 0.7)
      .style("pointer-events", "none");

    // Node labels
    nodes.append("text")
      .attr("dy", "0.31em")
      .attr("x", (d: any) => d.children ? -45 : 45)
      .attr("text-anchor", (d: any) => d.children ? "end" : "start")
      .text((d: any) => d.data.label)
      .style("fill", (d: any) => d.depth === 0 ? "#fff" : "#333")
      .style("font-size", (d: any) => d.depth === 0 ? "16px" : "14px")
      .style("font-weight", (d: any) => d.depth === 0 ? "bold" : "medium")
      .style("pointer-events", "none")
      .each(function(d: any) {
        // Break text into multiple lines if needed
        const text = d3.select(this);
        const words = d.data.label.split(/\s+/);
        
        if (words.length <= 1) return;
        
        text.text("");
        
        const lineHeight = 1.2;
        
        words.forEach((word: string, i: number) => {
          text.append("tspan")
            .attr("x", d.children ? -45 : 45)
            .attr("dy", i === 0 ? "0em" : `${lineHeight}em`)
            .attr("text-anchor", d.children ? "end" : "start")
            .text(word);
        });
      });

    // Small icons for expandable nodes
    nodes.filter((d: any) => d.children || d._children)
      .append("circle")
      .attr("r", 8)
      .attr("cx", (d: any) => d.children ? -80 : 80)
      .attr("cy", 0)
      .style("fill", "#fff")
      .style("stroke", (d: any) => d.data.color || "#999")
      .style("stroke-width", 1.5);

    nodes.filter((d: any) => d.children || d._children)
      .append("text")
      .attr("x", (d: any) => d.children ? -80 : 80)
      .attr("y", 0)
      .attr("dy", "0.3em")
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .style("fill", (d: any) => d.data.color || "#999")
      .style("pointer-events", "none")
      .text((d: any) => d.children ? "-" : "+");

    // Center the initial view
    const initialTransform = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(0.7);
    svg.call(zoom.transform as any, initialTransform);

    // Click outside to clear selection
    svg.on("click", () => {
      setSelectedNode(null);
      setNodeInfo(null);
    });

  }, [data, width, height, selectedNode]);

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="bg-gray-50 dark:bg-gray-900/50 rounded-xl"
      />
      
      {/* Node info popup */}
      {nodeInfo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-10 max-w-xs"
          style={{
            left: `${nodeInfo.x + transform.x + 30}px`,
            top: `${nodeInfo.y + transform.y - 70}px`,
            borderLeft: `4px solid ${nodeInfo.node.color || '#999'}`
          }}
        >
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{nodeInfo.node.label}</h4>
          {nodeInfo.node.description && (
            <p className="text-sm text-gray-700 dark:text-gray-300">{nodeInfo.node.description}</p>
          )}
        </motion.div>
      )}
      
      <div className="absolute bottom-4 right-4 space-x-2 flex">
        <button
          onClick={() => {
            const svg = d3.select(svgRef.current);
            const zoom = d3.zoom().scaleExtent([0.3, 3]);
            svg.transition().duration(750).call(
              zoom.transform as any,
              d3.zoomIdentity.translate(width / 2, height / 2).scale(0.7)
            );
          }}
          className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 rounded-md text-sm shadow-lg hover:bg-white dark:hover:bg-gray-700"
        >
          Reset View
        </button>
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0% { r: 35; opacity: 1; }
          70% { r: 45; opacity: 0.7; }
          100% { r: 35; opacity: 1; }
        }
        
        @keyframes dash {
          to {
            stroke-dashoffset: 1000;
          }
        }
        
        .pulse {
          animation: pulse 2s infinite;
        }
        
        .selected {
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default MindMap;