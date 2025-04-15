import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Play, Pause, RotateCcw, X } from 'lucide-react';
import { useTimer } from '../lib/timer-context';

const FloatingTimer = () => {
  const { 
    time, 
    isActive, 
    isBreak, 
    setIsActive, 
    setTime, 
    setIsBreak 
  } = useTimer();

  // Only show floating timer when timer is active
  if (!isActive && time === 25 * 60 && !isBreak) return null;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(25 * 60);
    setIsBreak(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
            <Timer className="w-4 h-4" />
          </div>
          
          <div className="font-mono font-medium text-gray-800 dark:text-white">
            {formatTime(time)}
          </div>
          
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            {isBreak ? 'Break' : 'Focus'}
          </span>
          
          <button
            onClick={toggleTimer}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
          
          <button
            onClick={resetTimer}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingTimer;