import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Lock, Star, Award, BookOpen, Trophy, Target, Zap, Clock, ArrowRight, Info } from 'lucide-react';

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

interface RoadmapProps {
  stages: RoadmapStage[];
  title: string;
  description?: string;
  currentProgress: number;
}

const Roadmap: React.FC<RoadmapProps> = ({
  stages,
  title,
  description,
  currentProgress
}) => {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [stageInView, setStageInView] = useState<number | null>(null);

  // Animate the progress bar
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(currentProgress);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentProgress]);

  // Helper function to get the difficulty color
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-blue-500';
      case 'advanced': return 'bg-purple-500';
      case 'expert': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  // Helper function to get the difficulty icon
  const getDifficultyIcon = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return <Target size={12} />;
      case 'intermediate': return <BookOpen size={12} />;
      case 'advanced': return <Zap size={12} />;
      case 'expert': return <Trophy size={12} />;
      default: return null;
    }
  };

  const handleStageClick = (index: number) => {
    if (stages[index].unlocked !== false) {
      setSelectedStage(selectedStage === index ? null : index);
      setStageInView(selectedStage === index ? null : index);
    }
  };

  // Calculate which stages are active and completed
  const getCompletionStatus = (index: number) => {
    const stage = stages[index];
    
    if (stage.completed) return 'completed';
    if (stage.unlocked === false) return 'locked';
    
    // Find the last completed stage
    const lastCompletedIndex = stages.findLastIndex(s => s.completed);
    
    // If this stage is the next one after the last completed, it's active
    if (index === lastCompletedIndex + 1) return 'active';
    
    // Otherwise it's just available
    return 'available';
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          {title}
        </h2>
        {description && (
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">{description}</p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative h-5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ width: 0 }}
          animate={{ width: `${animatedProgress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <span className="text-xs font-medium text-white drop-shadow">
            {Math.round(animatedProgress)}% Complete
          </span>
        </div>
        
        {/* Milestone Markers */}
        {[25, 50, 75, 100].map(milestone => (
          <div 
            key={milestone}
            className={`absolute top-0 bottom-0 w-px bg-white/50 ${animatedProgress >= milestone ? 'hidden' : ''}`}
            style={{ left: `${milestone}%` }}
          >
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400">
              {milestone}%
            </div>
          </div>
        ))}
      </div>

      {/* Journey Path */}
      <div className="relative mt-12 pt-12">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full transform -translate-y-1/2 overflow-hidden">
          <motion.div
            className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${(100 / (stages.length - 1)) * (stages.filter(s => s.completed).length)}%` }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          />
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stages.map((stage, index) => {
            const status = getCompletionStatus(index);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.15, 
                  duration: 0.5,
                  ease: "easeOut"
                }}
                className="relative"
              >
                {/* Milestone Node */}
                <motion.div
                  className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center cursor-pointer relative z-10
                    ${status === 'locked' ? 'bg-gray-400 dark:bg-gray-600' : ''}`}
                  style={{
                    backgroundColor: status === 'locked' ? undefined : stage.color,
                    boxShadow: '0 0 0 6px rgba(255, 255, 255, 0.5), 0 0 20px rgba(0, 0, 0, 0.15)'
                  }}
                  whileHover={{ 
                    scale: 1.15,
                    boxShadow: '0 0 0 8px rgba(255, 255, 255, 0.7), 0 0 30px rgba(0, 0, 0, 0.2)'
                  }}
                  onClick={() => handleStageClick(index)}
                  onHoverStart={() => setHoveredStage(index)}
                  onHoverEnd={() => setHoveredStage(null)}
                >
                  {status === 'completed' ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.15 + 0.5, type: "spring" }}
                    >
                      <Check className="text-white" size={32} />
                    </motion.div>
                  ) : status === 'locked' ? (
                    <Lock className="text-white" size={24} />
                  ) : status === 'active' ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2,
                        repeatType: "reverse" 
                      }}
                    >
                      <Zap className="text-white" size={28} />
                    </motion.div>
                  ) : (
                    <span className="text-white font-bold text-xl">{index + 1}</span>
                  )}
                  
                  {/* Pulsing animation for active stage */}
                  {status === 'active' && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-white opacity-20"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2,
                        repeatType: "reverse" 
                      }}
                    />
                  )}
                </motion.div>

                {/* Bottom Line Connector (Mobile only) */}
                {index < stages.length - 1 && (
                  <div className="absolute h-8 w-px bg-gray-200 dark:bg-gray-700 bottom-0 left-1/2 transform -translate-x-1/2 block md:hidden" />
                )}

                {/* Stage Card */}
                <motion.div
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border-t-4 h-full
                    ${selectedStage === index ? 'ring-2 ring-purple-500 dark:ring-purple-400' : ''}
                    ${status === 'locked' ? 'opacity-70' : ''}
                  `}
                  style={{ 
                    borderColor: stage.color,
                    boxShadow: selectedStage === index 
                      ? `0 10px 25px -5px ${stage.color}40` 
                      : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  initial={false}
                  animate={{
                    scale: selectedStage === index ? 1.03 : 1,
                    opacity: hoveredStage === null || hoveredStage === index || selectedStage === index ? 1 : 0.7,
                  }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                      {stage.title}
                    </h3>
                    
                    {/* Stage Status Badge */}
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full inline-flex items-center ${
                        status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : status === 'locked'
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          : status === 'active'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 animate-pulse'
                          : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                      }`}
                    >
                      {status === 'completed' ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Completed
                        </>
                      ) : status === 'locked' ? (
                        <>
                          <Lock className="w-3 h-3 mr-1" />
                          Locked
                        </>
                      ) : status === 'active' ? (
                        <>
                          <Zap className="w-3 h-3 mr-1" />
                          Current
                        </>
                      ) : (
                        'Available'
                      )}
                    </span>
                  </div>
                  
                  {/* Difficulty and time indicators */}
                  <div className="flex gap-2 mb-3">
                    {stage.difficulty && (
                      <span className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 text-white ${getDifficultyColor(stage.difficulty)}`}>
                        {getDifficultyIcon(stage.difficulty)}
                        {stage.difficulty.charAt(0).toUpperCase() + stage.difficulty.slice(1)}
                      </span>
                    )}
                    
                    {stage.estimatedTime && (
                      <span className="text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        <Clock className="w-3 h-3" />
                        {stage.estimatedTime}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {stage.description}
                  </p>

                  <AnimatePresence>
                    {selectedStage === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 border-t border-gray-100 dark:border-gray-700 pt-4"
                      >
                        {/* Key Points */}
                        {stage.keyPoints && stage.keyPoints.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                              <Info className="w-4 h-4 mr-1 text-purple-500" />
                              Key Learning Points
                            </h4>
                            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                              {stage.keyPoints.map((point, i) => (
                                <li key={i} className="flex items-start">
                                  <ArrowRight className="w-3 h-3 text-purple-500 mt-1 mr-2 flex-shrink-0" />
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Skills */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                            <Zap className="w-4 h-4 mr-1 text-purple-500" />
                            Skills You'll Develop
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {stage.skills.map((skill, i) => (
                              <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 
                                  dark:from-purple-900/30 dark:to-pink-900/30 text-purple-800 dark:text-purple-300 
                                  flex items-center shadow-sm"
                              >
                                <Star className="w-3 h-3 mr-1" />
                                {skill}
                              </motion.span>
                            ))}
                          </div>
                        </div>

                        {/* Resources */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                            <BookOpen className="w-4 h-4 mr-1 text-purple-500" />
                            Learning Resources
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {stage.resources.map((resource, i) => (
                              <motion.a
                                key={i}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                href="#"
                                className="text-sm flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50
                                  text-purple-600 dark:text-purple-400 hover:underline transition-colors group"
                              >
                                <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-2 
                                  group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                                  <ChevronRight className="w-4 h-4" />
                                </div>
                                {resource}
                              </motion.a>
                            ))}
                          </div>
                        </div>

                        {/* Achievement Badge for completed stages */}
                        {stage.completed && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center p-3 bg-gradient-to-r from-green-100 to-teal-100 
                              dark:from-green-900/30 dark:to-teal-900/30 rounded-lg shadow-inner"
                          >
                            <div className="bg-white dark:bg-gray-800 rounded-full p-1.5 mr-3">
                              <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-green-800 dark:text-green-300">
                                Stage Completed!
                              </h4>
                              <p className="text-xs text-green-700 dark:text-green-400">
                                Great job mastering these skills
                              </p>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Next Step Button - only for current active stage */}
                        {status === 'active' && (
                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="w-full py-2 px-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-sm
                              text-white font-medium flex items-center justify-center mt-2 hover:from-purple-700
                              hover:to-pink-700 transition-colors"
                          >
                            Continue Learning
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </motion.button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Expand/Collapse Button */}
                  <div className="mt-3 flex justify-center">
                    <motion.button
                      onClick={() => handleStageClick(index)}
                      className={`flex items-center justify-center text-xs font-medium w-8 h-8 rounded-full
                        ${status === 'locked' ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' :
                          'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800/50'
                        }`}
                      disabled={status === 'locked'}
                      whileHover={status !== 'locked' ? { y: -3 } : {}}
                      whileTap={status !== 'locked' ? { y: 0 } : {}}
                      animate={{ rotate: selectedStage === index ? 180 : 0 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;