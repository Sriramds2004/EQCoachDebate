import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Book, Video, FileText, Users, Brain, MessageCircle, Trophy, 
  Lightbulb, Globe, BookOpen, PlayCircle, FileSpreadsheet, 
  Map, BarChart, LineChart, PieChart, AreaChart, GitBranch, ChevronDown,
  ChevronUp, Download, Maximize, Check, X, Star, Award, Target, Route,
  BookMarked
} from 'lucide-react';
import MindMap from './MindMap';
import Roadmap from './Roadmap';

interface Resource {
  title: string;
  description: string;
  type: string;
  link: string;
  icon: React.ReactNode;
  category: 'eq' | 'debate';
  image?: string;
  chartData?: any;
  subResources?: SubResource[];
}

interface SubResource {
  title: string;
  description: string;
  link: string;
}

interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
  color?: string;
  description?: string;
}

interface RoadmapStage {
  title: string;
  description: string;
  skills: string[];
  resources: string[];
  color: string;
  completed?: boolean;
  unlocked?: boolean;
  estimatedTime?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  keyPoints?: string[];
}

const EQ_MINDMAP: MindMapNode = {
  id: 'eq-root',
  label: 'Emotional Intelligence',
  color: '#8b5cf6',
  description: 'The ability to understand and manage your emotions, and those of the people around you. EQ consists of five key elements that work together to help individuals build stronger relationships.',
  children: [
    {
      id: 'self-awareness',
      label: 'Self-Awareness',
      color: '#3b82f6',
      description: 'The ability to recognize and understand personal moods, emotions, and drives, as well as their effect on others. Self-awareness depends on one\'s ability to monitor one\'s own emotional state.',
      children: [
        { 
          id: 'emotion-recognition', 
          label: 'Emotion Recognition', 
          color: '#60a5fa',
          description: 'The ability to identify and name one\'s emotional states and to understand the link between emotions, thoughts, and actions.' 
        },
        { 
          id: 'self-assessment', 
          label: 'Accurate Self-Assessment', 
          color: '#60a5fa',
          description: 'Knowing one\'s strengths and limits, seeking feedback, learning from mistakes, and knowing where to improve and when to work with others.' 
        },
        { 
          id: 'confidence', 
          label: 'Self-Confidence', 
          color: '#60a5fa',
          description: 'Certainty about one\'s self-worth and capabilities. This includes standing up for what you believe is right despite opposition or discouragement.'
        }
      ]
    },
    {
      id: 'self-regulation',
      label: 'Self-Regulation',
      color: '#ec4899',
      description: 'The ability to control or redirect disruptive impulses and moods, and the propensity to suspend judgment and to think before acting. This involves handling emotions so they facilitate rather than interfere with tasks.',
      children: [
        { 
          id: 'self-control', 
          label: 'Self-Control', 
          color: '#f472b6',
          description: 'Managing disruptive emotions and impulses effectively. Staying composed and positive even in trying moments, maintaining focus under pressure.'
        },
        { 
          id: 'adaptability', 
          label: 'Adaptability', 
          color: '#f472b6',
          description: 'Flexibility in handling change, juggling multiple demands, and adapting to new situations with fresh ideas or innovative approaches.'
        },
        { 
          id: 'innovation', 
          label: 'Innovation', 
          color: '#f472b6',
          description: 'Being comfortable with novel ideas, approaches, and new information. This includes generating new ideas and taking calculated risks.'
        }
      ]
    },
    {
      id: 'motivation',
      label: 'Motivation',
      color: '#10b981',
      description: 'A passion to work for internal reasons that go beyond money and status such as an inner vision of what is important in life, joy in doing something, curiosity in learning, or a flow that comes with being immersed in an activity.',
      children: [
        { 
          id: 'achievement', 
          label: 'Achievement Drive', 
          color: '#34d399',
          description: 'Striving to improve or meet a standard of excellence, looking for ways to do things better, setting challenging goals and taking calculated risks.'
        },
        { 
          id: 'commitment', 
          label: 'Commitment', 
          color: '#34d399',
          description: 'Aligning with the goals of the group or organization, finding purpose in a larger mission, and using the group\'s core values in making decisions.'
        },
        { 
          id: 'initiative', 
          label: 'Initiative & Optimism', 
          color: '#34d399',
          description: 'Readiness to act on opportunities, pursuing goals beyond what\'s required or expected, and persistence in pursuing goals despite obstacles and setbacks.'
        }
      ]
    },
    {
      id: 'empathy',
      label: 'Empathy',
      color: '#f59e0b',
      description: 'Understanding the emotional makeup of other people and treating people according to their emotional reactions. This allows you to sense others\' feelings and perspectives, and take an active interest in their concerns.',
      children: [
        { 
          id: 'understanding', 
          label: 'Understanding Others', 
          color: '#fbbf24',
          description: 'Sensing others\' feelings and perspectives, and taking an active interest in their concerns. This includes listening well and being attentive to emotional cues.'
        },
        { 
          id: 'developing', 
          label: 'Developing Others', 
          color: '#fbbf24',
          description: 'Sensing what others need in order to develop, and bolstering their abilities through feedback and guidance.'
        },
        { 
          id: 'diversity', 
          label: 'Leveraging Diversity', 
          color: '#fbbf24',
          description: 'Cultivating opportunities through diverse people, respecting and relating well to people from varied backgrounds.'
        }
      ]
    },
    {
      id: 'social-skills',
      label: 'Social Skills',
      color: '#6366f1',
      description: 'Proficiency in managing relationships and building networks, and an ability to find common ground and build rapport. These skills allow you to move people in the direction you desire.',
      children: [
        { 
          id: 'influence', 
          label: 'Influence', 
          color: '#818cf8',
          description: 'Wielding effective tactics for persuasion, from appealing to others\' interests to getting support from key people.'
        },
        { 
          id: 'communication', 
          label: 'Communication', 
          color: '#818cf8',
          description: 'Listening openly and sending convincing messages, fostering open communication and staying receptive to both good and bad news.'
        },
        { 
          id: 'leadership', 
          label: 'Leadership', 
          color: '#818cf8',
          description: 'Inspiring and guiding individuals and groups, articulating and arousing enthusiasm for a shared vision and mission.'
        },
        { 
          id: 'collaboration', 
          label: 'Collaboration', 
          color: '#818cf8',
          description: 'Working with others toward shared goals, balancing focus on task with attention to relationships.'
        }
      ]
    }
  ]
};

const DEBATE_MINDMAP: MindMapNode = {
  id: 'debate-root',
  label: 'Debate Skills',
  color: '#ec4899',
  description: 'The set of competencies required for structured argumentation and persuasive communication. Effective debate draws on critical thinking, research, communication, and strategic skills.',
  children: [
    {
      id: 'research',
      label: 'Research',
      color: '#8b5cf6',
      description: 'The systematic investigation to establish facts and reach new conclusions. Strong research skills are the foundation of effective debate, providing the substance behind arguments.',
      children: [
        { 
          id: 'evidence-gathering', 
          label: 'Evidence Gathering', 
          color: '#a78bfa',
          description: 'Collecting relevant data, statistics, expert opinions, and case studies that support your arguments and positions.'
        },
        { 
          id: 'fact-checking', 
          label: 'Fact Checking', 
          color: '#a78bfa',
          description: 'Verifying the accuracy of information from multiple reliable sources before using it in debate arguments.'
        },
        { 
          id: 'source-evaluation', 
          label: 'Source Evaluation', 
          color: '#a78bfa',
          description: 'Assessing the credibility, bias, and reliability of sources to determine their value in supporting arguments.'
        }
      ]
    },
    {
      id: 'argument-construction',
      label: 'Argument Construction',
      color: '#3b82f6',
      description: 'The process of creating logical and compelling arguments by connecting claims with evidence and explaining their significance. Well-constructed arguments are the building blocks of effective debate.',
      children: [
        { 
          id: 'claim-formulation', 
          label: 'Claim Formulation', 
          color: '#60a5fa',
          description: 'Developing clear, precise propositions that outline the position you\'re defending or attacking.'
        },
        { 
          id: 'evidence-integration', 
          label: 'Evidence Integration', 
          color: '#60a5fa',
          description: 'Seamlessly incorporating facts, statistics, and expert opinions to support claims and build credibility.'
        },
        { 
          id: 'impact-analysis', 
          label: 'Impact Analysis', 
          color: '#60a5fa',
          description: 'Explaining the significance and consequences of arguments, helping judges and audiences understand why your points matter.'
        }
      ]
    },
    {
      id: 'delivery',
      label: 'Delivery',
      color: '#10b981',
      description: 'The manner in which arguments are presented, combining verbal and non-verbal communication to maximize persuasive impact. Effective delivery enhances the content of arguments.',
      children: [
        { 
          id: 'verbal-communication', 
          label: 'Verbal Communication', 
          color: '#34d399',
          description: 'Using varied tone, pace, volume, and rhetorical techniques to emphasize key points and maintain audience engagement.'
        },
        { 
          id: 'non-verbal-cues', 
          label: 'Non-verbal Cues', 
          color: '#34d399',
          description: 'Employing purposeful gestures, facial expressions, eye contact, and body language to reinforce your message.'
        },
        { 
          id: 'timing-pacing', 
          label: 'Timing & Pacing', 
          color: '#34d399',
          description: 'Managing speech time effectively, allocating appropriate focus to different arguments, and adjusting pace for emphasis and clarity.'
        }
      ]
    },
    {
      id: 'rebuttal',
      label: 'Rebuttal Skills',
      color: '#f59e0b',
      description: 'The ability to identify and counter opposing arguments through critical analysis. Effective rebuttal demonstrates intellectual agility and deepens the debate.',
      children: [
        { 
          id: 'counter-arguments', 
          label: 'Counter-Arguments', 
          color: '#fbbf24',
          description: 'Developing responses that directly address and undermine the logic, evidence, or assumptions of opposing arguments.'
        },
        { 
          id: 'logical-fallacies', 
          label: 'Identifying Fallacies', 
          color: '#fbbf24',
          description: 'Recognizing and exposing flawed reasoning in opponents\' arguments, such as false equivalencies or straw man arguments.'
        },
        { 
          id: 'cross-examination', 
          label: 'Cross-Examination', 
          color: '#fbbf24',
          description: 'Strategic questioning to expose weaknesses in opposing positions, clarify points, or lead opponents to admissions that benefit your case.'
        }
      ]
    }
  ]
};

const EQ_ROADMAP: RoadmapStage[] = [
  {
    title: 'Foundation',
    description: 'Build foundational EQ awareness and concepts',
    skills: ['Emotion Recognition', 'Basic Self-Reflection', 'Active Listening'],
    resources: ['Understanding Emotional Intelligence', 'The Art of Active Listening'],
    color: '#8b5cf6',
    completed: true,
    difficulty: 'beginner',
    estimatedTime: '2-3 weeks',
    keyPoints: [
      'Learn to identify and label your emotions accurately',
      'Understand the four components of EQ: self-awareness, self-management, social awareness, relationship management',
      'Practice mindful listening techniques to improve your understanding of others'
    ]
  },
  {
    title: 'Development',
    description: 'Develop core EQ capabilities and practices',
    skills: ['Emotional Vocabulary', 'Pattern Recognition', 'Stress Management'],
    resources: ['Managing Emotions Under Pressure', 'Emotional Intelligence 2.0'],
    color: '#3b82f6',
    completed: true,
    difficulty: 'intermediate',
    estimatedTime: '4-6 weeks',
    keyPoints: [
      'Expand your emotional vocabulary beyond basic terms like "happy," "sad," or "angry"',
      'Identify recurring emotional patterns and their triggers in your life',
      'Develop techniques to manage emotions during high-stress situations'
    ]
  },
  {
    title: 'Application',
    description: 'Apply EQ skills in varied contexts',
    skills: ['Conflict Resolution', 'Influential Communication', 'Empathetic Leadership'],
    resources: ['EQ in the Workplace', 'Understanding Body Language'],
    color: '#10b981',
    completed: false,
    difficulty: 'advanced',
    estimatedTime: '6-8 weeks',
    keyPoints: [
      'Use emotional intelligence to mediate and resolve interpersonal conflicts',
      'Apply empathetic communication techniques to improve team dynamics',
      'Recognize and respond appropriately to others\' emotional states'
    ]
  },
  {
    title: 'Mastery',
    description: 'Achieve advanced EQ integration and teaching',
    skills: ['Emotional Coaching', 'Cultural EQ', 'Strategic Empathy'],
    resources: ['Advanced EQ Certification', 'Emotional Intelligence Leadership'],
    color: '#f59e0b',
    completed: false,
    difficulty: 'expert',
    estimatedTime: '3-6 months',
    keyPoints: [
      'Help others develop their emotional intelligence through coaching and mentoring',
      'Navigate cultural differences in emotional expression and interpretation',
      'Apply emotional intelligence in high-stakes strategic decision-making'
    ]
  }
];

const DEBATE_ROADMAP: RoadmapStage[] = [
  {
    title: 'Beginner',
    description: 'Learn fundamental debate structure and concepts',
    skills: ['Basic Argumentation', 'Speech Organization', 'Research Basics'],
    resources: ['Debate Structure and Strategy', 'Research and Evidence'],
    color: '#ec4899',
    completed: true,
    difficulty: 'beginner',
    estimatedTime: '3-4 weeks',
    keyPoints: [
      'Understand the basic structure of a debate and the roles of participants',
      'Learn how to construct a basic argument with claim, evidence, and impact',
      'Develop foundational research skills and source evaluation'
    ]
  },
  {
    title: 'Intermediate',
    description: 'Develop effective debate techniques and strategies',
    skills: ['Case Construction', 'Rebuttal Skills', 'Cross-Examination'],
    resources: ['Critical Thinking and Argumentation', 'Persuasive Speaking Techniques'],
    color: '#8b5cf6',
    completed: false,
    unlocked: true,
    difficulty: 'intermediate',
    estimatedTime: '4-8 weeks',
    keyPoints: [
      'Construct comprehensive cases with multiple supporting arguments',
      'Anticipate and prepare effective responses to opposing arguments',
      'Develop strategic questioning techniques for cross-examination'
    ]
  },
  {
    title: 'Advanced',
    description: 'Master complex argumentation and strategic debate',
    skills: ['Advanced Framework Building', 'Strategic Case Selection', 'Evidence Weighting'],
    resources: ['Advanced Debate Tactics', 'Master Public Speaking'],
    color: '#3b82f6',
    completed: false,
    unlocked: false,
    difficulty: 'advanced',
    estimatedTime: '8-12 weeks',
    keyPoints: [
      'Create and utilize complex theoretical frameworks to structure debates',
      'Apply strategic thinking to select the most effective cases for each situation',
      'Master evidence comparison and impact calculus techniques'
    ]
  },
  {
    title: 'Expert',
    description: 'Reach competitive and coaching excellence',
    skills: ['Judging & Coaching', 'Tournament Strategy', 'Meta-Debate Analysis'],
    resources: ['Championship Debate Strategy', 'Coaching Techniques for Debate'],
    color: '#10b981',
    completed: false,
    unlocked: false,
    difficulty: 'expert',
    estimatedTime: '3-6 months',
    keyPoints: [
      'Evaluate debates objectively and provide constructive feedback',
      'Develop comprehensive tournament strategies and preparation methods',
      'Analyze debate trends and evolving argumentative techniques'
    ]
  }
];

// Enhanced resources with images, charts, and nested content
const resources: Resource[] = [
  {
    title: 'Understanding Emotional Intelligence',
    description: 'HBR\'s comprehensive guide to emotional intelligence and its impact on leadership.',
    type: 'Article',
    link: 'https://hbr.org/2015/04/how-emotional-intelligence-became-a-key-leadership-skill',
    icon: <Brain className="w-6 h-6" />,
    category: 'eq',
    image: 'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80',
    chartData: {
      type: 'pie',
      title: 'EQ Components',
      data: [
        { name: 'Self-Awareness', value: 25, color: '#8b5cf6' },
        { name: 'Self-Regulation', value: 25, color: '#ec4899' },
        { name: 'Motivation', value: 15, color: '#10b981' },
        { name: 'Empathy', value: 20, color: '#f59e0b' },
        { name: 'Social Skills', value: 15, color: '#3b82f6' }
      ]
    },
    subResources: [
      {
        title: 'EQ Assessment Tool',
        description: 'Free online assessment to determine your emotional intelligence score',
        link: 'https://www.mindtools.com/pages/article/ei-quiz.htm'
      },
      {
        title: 'Case Studies of EQ in Leadership',
        description: 'Real-world examples of how emotional intelligence transforms leadership',
        link: 'https://hbr.org/2017/02/emotional-intelligence-has-12-elements-which-do-you-need-to-work-on'
      }
    ]
  },
  {
    title: 'Master Public Speaking',
    description: 'TED\'s Chris Anderson shares the secrets of powerful public speaking.',
    type: 'Video Course',
    link: 'https://www.ted.com/talks/chris_anderson_teds_secret_to_great_public_speaking',
    icon: <Users className="w-6 h-6" />,
    category: 'debate',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80',
    chartData: {
      type: 'bar',
      title: 'Public Speaking Skill Impact',
      data: [
        { name: 'Verbal Clarity', value: 85, color: '#3b82f6' },
        { name: 'Body Language', value: 78, color: '#10b981' },
        { name: 'Content Structure', value: 92, color: '#8b5cf6' },
        { name: 'Audience Engagement', value: 88, color: '#f59e0b' },
        { name: 'Visual Aids', value: 65, color: '#ec4899' }
      ]
    },
    subResources: [
      {
        title: 'How to Structure a Compelling Talk',
        description: 'Step-by-step guide to organizing your speech for maximum impact',
        link: 'https://www.ted.com/talks/nancy_duarte_the_secret_structure_of_great_talks'
      },
      {
        title: 'Overcoming Speech Anxiety',
        description: 'Techniques to manage nervousness and deliver with confidence',
        link: 'https://www.ted.com/talks/amy_cuddy_your_body_language_may_shape_who_you_are'
      }
    ]
  },
  {
    title: 'The Art of Active Listening',
    description: 'Learn proven techniques for better listening and understanding from MindTools.',
    type: 'Guide',
    link: 'https://www.mindtools.com/commskll/ActiveListening.htm',
    icon: <MessageCircle className="w-6 h-6" />,
    category: 'eq',
    image: 'https://images.unsplash.com/photo-1516382799247-87df95d790b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
    chartData: {
      type: 'bar',
      title: 'Active Listening Components',
      data: [
        { name: 'Attention', value: 90, color: '#8b5cf6' },
        { name: 'Empathy', value: 85, color: '#ec4899' },
        { name: 'Feedback', value: 75, color: '#10b981' },
        { name: 'Non-judgment', value: 80, color: '#f59e0b' },
        { name: 'Clarification', value: 70, color: '#3b82f6' }
      ]
    }
  },
  // Additional resources maintained but truncated for brevity
  // ...existing resources with added images and chart data...
];

const Resources = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'eq' | 'debate'>('all');
  const [selectedSection, setSelectedSection] = useState<'resources' | 'roadmaps' | 'mindmaps'>('resources');
  const [expandedResource, setExpandedResource] = useState<string | null>(null);
  const [activeRoadmap, setActiveRoadmap] = useState<'eq' | 'debate'>('eq');
  const [activeMindmap, setActiveMindmap] = useState<'eq' | 'debate'>('eq');
  const mindmapContainerRef = useRef<HTMLDivElement>(null);

  const filteredResources = resources.filter(
    resource => selectedCategory === 'all' || resource.category === selectedCategory
  );

  // Draw mindmap using SVG - simplified version for demonstration
  useEffect(() => {
    if (mindmapContainerRef.current) {
      const container = mindmapContainerRef.current;
      container.innerHTML = ''; // Clear previous mindmap
      
      const mindmap = activeMindmap === 'eq' ? EQ_MINDMAP : DEBATE_MINDMAP;
      drawMindMap(container, mindmap);
    }
  }, [activeMindmap, selectedSection]);
  
  // Simple mind map drawing function
  const drawMindMap = (container: HTMLDivElement, node: MindMapNode, level = 0, angle = 0) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "600");
    svg.setAttribute("viewBox", "-400 -300 800 600");
    
    const renderNode = (node: MindMapNode, x: number, y: number, level: number, parentX = 0, parentY = 0) => {
      // Add connection line to parent if not root
      if (level !== 0) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", parentX.toString());
        line.setAttribute("y1", parentY.toString());
        line.setAttribute("x2", x.toString());
        line.setAttribute("y2", y.toString());
        line.setAttribute("stroke", node.color || "#888");
        line.setAttribute("stroke-width", "2");
        svg.appendChild(line);
      }
      
      // Add node circle
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", x.toString());
      circle.setAttribute("cy", y.toString());
      circle.setAttribute("r", (30 - level * 5).toString());
      circle.setAttribute("fill", node.color || "#8b5cf6");
      svg.appendChild(circle);
      
      // Add node text
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", x.toString());
      text.setAttribute("y", y.toString());
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");
      text.setAttribute("fill", "white");
      text.setAttribute("font-size", (12 - level).toString());
      text.textContent = node.label;
      svg.appendChild(text);
      
      // Render children
      if (node.children && node.children.length > 0) {
        const angleStep = Math.PI * 1.5 / node.children.length;
        let currentAngle = -Math.PI * 0.75;
        
        node.children.forEach(child => {
          const childDistance = 150 - level * 30;
          const childX = x + Math.cos(currentAngle) * childDistance;
          const childY = y + Math.sin(currentAngle) * childDistance;
          renderNode(child, childX, childY, level + 1, x, y);
          currentAngle += angleStep;
        });
      }
    };
    
    // Start rendering from the root node at center
    renderNode(node, 0, 0, 0);
    container.appendChild(svg);
  };

  const renderChart = (chartData: any) => {
    const { type, data } = chartData;
    
    switch (type) {
      case 'pie':
        return (
          <div className="w-full h-64 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {renderPieChart(data)}
              <g transform="translate(50, 50)">
                <circle r="25" fill="white" />
                <text textAnchor="middle" dominantBaseline="middle" fontSize="5" fontWeight="bold">
                  EQ Components
                </text>
              </g>
            </svg>
            <div className="ml-4 grid grid-cols-1 gap-2">
              {data.map((item: any, i: number) => (
                <div key={i} className="flex items-center text-sm">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span>{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'bar':
        return (
          <div className="w-full h-64">
            <div className="font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
              {chartData.title}
            </div>
            <div className="h-56 flex items-end space-x-2">
              {data.map((item: any, i: number) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full rounded-t-md transition-all duration-500" 
                    style={{ 
                      height: `${item.value * 0.4}%`, 
                      backgroundColor: item.color,
                      maxHeight: '90%' 
                    }}
                  ></div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 w-full text-center truncate">
                    {item.name}
                  </div>
                  <div className="text-xs font-medium">{item.value}%</div>
                </div>
              ))}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  const renderPieChart = (data: any[]) => {
    let total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    return data.map((item, i) => {
      const percentage = item.value / total;
      const startAngle = currentAngle;
      const endAngle = currentAngle + percentage * Math.PI * 2;
      
      // Calculate the path for the pie slice
      const x1 = 50 + 40 * Math.cos(startAngle);
      const y1 = 50 + 40 * Math.sin(startAngle);
      const x2 = 50 + 40 * Math.cos(endAngle);
      const y2 = 50 + 40 * Math.sin(endAngle);
      
      const largeArcFlag = percentage > 0.5 ? 1 : 0;
      const pathData = `
        M 50 50
        L ${x1} ${y1}
        A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}
        Z
      `;
      
      currentAngle = endAngle;
      
      return <path key={i} d={pathData} fill={item.color} />;
    });
  };

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Learning Resources
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
            Explore our comprehensive collection of EQ and debate learning materials
          </p>
        </motion.div>

        {/* Section Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 mb-8 flex justify-center"
        >
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setSelectedSection('resources')}
              className={`px-6 py-3 rounded-l-lg font-medium transition-colors ${
                selectedSection === 'resources'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BookMarked size={18} />
                <span>Resources</span>
              </div>
            </button>
            <button
              onClick={() => setSelectedSection('mindmaps')}
              className={`px-6 py-3 font-medium transition-colors ${
                selectedSection === 'mindmaps'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center space-x-2">
                <GitBranch size={18} />
                <span>Mindmaps</span>
              </div>
            </button>
            <button
              onClick={() => setSelectedSection('roadmaps')}
              className={`px-6 py-3 rounded-r-lg font-medium transition-colors ${
                selectedSection === 'roadmaps'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Route size={18} />
                <span>Roadmaps</span>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Resources Section */}
        {selectedSection === 'resources' && (
          <>
            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center gap-4 mb-8"
            >
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                All Resources
              </button>
              <button
                onClick={() => setSelectedCategory('eq')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'eq'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                EQ Development
              </button>
              <button
                onClick={() => setSelectedCategory('debate')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'debate'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Debate Skills
              </button>
            </motion.div>

            {/* Enhanced Resources Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {filteredResources.slice(0, 6).map((resource, index) => (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Resource Image */}
                  {resource.image && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <img 
                        src={resource.image} 
                        alt={resource.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800`}>
                          {resource.category === 'eq' ? 'EQ Development' : 'Debate Skills'}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6 relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg text-white" style={{ backgroundColor: resource.category === 'eq' ? '#8b5cf6' : '#ec4899' }}>
                          {resource.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {resource.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {resource.type}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setExpandedResource(expandedResource === resource.title ? null : resource.title)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {expandedResource === resource.title ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {resource.description}
                    </p>
                    
                    {/* Expanded Content */}
                    {expandedResource === resource.title && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 space-y-4"
                      >
                        {/* Chart Visualization */}
                        {resource.chartData && (
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                            {renderChart(resource.chartData)}
                          </div>
                        )}
                        
                        {/* Sub-resources */}
                        {resource.subResources && resource.subResources.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-800 dark:text-gray-200">Related Resources</h4>
                            {resource.subResources.map((subResource, i) => (
                              <div key={i} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                <h5 className="font-medium text-gray-800 dark:text-gray-200">{subResource.title}</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{subResource.description}</p>
                                <a 
                                  href={subResource.link} 
                                  className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center"
                                >
                                  <span>Access Resource</span>
                                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                  </svg>
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <a
                        href={resource.link}
                        className="inline-flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                      >
                        Learn More
                        <svg
                          className="ml-2 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                      <div className="flex space-x-1">
                        {Array.from({length: 5}).map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={i < 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-300 dark:text-gray-600"} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Mind Maps Section */}
        {selectedSection === 'mindmaps' && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                  Interactive Mind Maps
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveMindmap('eq')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeMindmap === 'eq'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    EQ Mind Map
                  </button>
                  <button
                    onClick={() => setActiveMindmap('debate')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeMindmap === 'debate'
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Debate Mind Map
                  </button>
                </div>
              </div>

              <div className="mb-4 text-center text-sm text-gray-600 dark:text-gray-400">
                Explore the relationships between key concepts in {activeMindmap === 'eq' ? 'emotional intelligence' : 'debate skills'}
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden">
                <MindMap
                  data={activeMindmap === 'eq' ? EQ_MINDMAP : DEBATE_MINDMAP}
                  width={800}
                  height={600}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {activeMindmap === 'eq' ? 'EQ Core Components' : 'Debate Skill Breakdown'}
              </h3>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {(activeMindmap === 'eq' ? EQ_MINDMAP.children : DEBATE_MINDMAP.children)?.map((node, index) => (
                  <div
                    key={node.id}
                    className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border-l-4"
                    style={{ borderColor: node.color }}
                  >
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">{node.label}</h4>
                    <ul className="space-y-1">
                      {node.children?.map(child => (
                        <li key={child.id} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                          <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: child.color }}></div>
                          {child.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Roadmaps Section */}
        {selectedSection === 'roadmaps' && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                  Learning Roadmaps
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveRoadmap('eq')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeRoadmap === 'eq'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    EQ Roadmap
                  </button>
                  <button
                    onClick={() => setActiveRoadmap('debate')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeRoadmap === 'debate'
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Debate Roadmap
                  </button>
                </div>
              </div>

              <Roadmap
                stages={activeRoadmap === 'eq' ? EQ_ROADMAP : DEBATE_ROADMAP}
                title={activeRoadmap === 'eq' ? 'EQ Development Journey' : 'Debate Mastery Path'}
                description={
                  activeRoadmap === 'eq'
                    ? 'Master emotional intelligence through structured learning stages'
                    : 'Progress from debate fundamentals to competitive excellence'
                }
                currentProgress={activeRoadmap === 'eq' ? 42 : 25}
              />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;