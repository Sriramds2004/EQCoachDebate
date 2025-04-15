import React from 'react';
import { motion } from 'framer-motion';
import { Timer, Play, Pause, RotateCcw, Check, Plus } from 'lucide-react';
import { useTimer } from '../lib/timer-context';
import { useAuth } from '../lib/auth-context';

export default function StudyTimer() {
  const { 
    time, 
    isActive, 
    breakTime, 
    isBreak, 
    completedSessions,
    setTime, 
    setIsActive, 
    setBreakTime, 
    setIsBreak, 
    setCompletedSessions 
  } = useTimer();

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

  const addFiveMinutes = () => {
    setTime(time + 5 * 60);
  };

  // Update local storage with timer stats when a session completes
  const updateStudyStats = () => {
    const { user } = useAuth();
    if (!user) return;
    
    const statsKey = `study-stats-${user.id}`;
    let stats = localStorage.getItem(statsKey);
    let studyStats = stats ? JSON.parse(stats) : { 
      totalSessions: 0,
      totalMinutes: 0,
      lastStudyDate: null
    };
    
    studyStats.totalSessions += 1;
    studyStats.totalMinutes += 25; // Assuming 25 min pomodoro session
    studyStats.lastStudyDate = new Date().toISOString();
    
    localStorage.setItem(statsKey, JSON.stringify(studyStats));
  };

  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <Timer className="mr-2" size={20} />
          Study Timer
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Sessions: {completedSessions}
          </span>
          {completedSessions > 0 && (
            <Check className="h-4 w-4 text-green-500" />
          )}
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="text-5xl font-bold text-gray-900 dark:text-white mb-4 font-mono">
          {formatTime(time)}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {isBreak ? 'Break Time!' : 'Focus Time'}
        </div>
      </div>

      <div className="flex justify-center items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTimer}
          className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center"
        >
          {isActive ? <Pause className="mr-2" size={16} /> : <Play className="mr-2" size={16} />}
          {isActive ? 'Pause' : 'Start'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetTimer}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
        >
          <RotateCcw size={16} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addFiveMinutes}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
        >
          <Plus size={16} />
        </motion.button>
      </div>
    </div>
  );
}