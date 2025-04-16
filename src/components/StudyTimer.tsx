import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Timer, Play, Pause, RotateCcw, Plus, Volume2, VolumeX,
  Check, List, Settings, X, Clock, Save, Trash2
} from 'lucide-react';
import { useTimer } from '../lib/timer-context';
import useSound from 'use-sound';

export default function StudyTimer() {
  const [showTasks, setShowTasks] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDuration, setNewPresetDuration] = useState(25);
  const [newPresetBreak, setNewPresetBreak] = useState(5);
  const [customMinutes, setCustomMinutes] = useState('');
  const [showMinuteInput, setShowMinuteInput] = useState(false);

  const { 
    time, isActive, breakTime, isBreak, completedSessions,
    tasks, currentTask, presets, soundEnabled,
    setTime, setIsActive, setBreakTime, setIsBreak,
    addTask, removeTask, setCurrentTask, toggleTaskComplete,
    addPreset, removePreset, applyPreset, toggleSound
  } = useTimer();

  // Test sound effect on first mount
  useEffect(() => {
    // Uncomment to play a test sound when component mounts
    // if (soundEnabled) {
    //   setTimeout(() => {
    //     const audio = new Audio('/sounds/notification.mp3');
    //     audio.volume = 0.2;
    //     audio.play().catch(console.error);
    //   }, 500);
    // }
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTime(25 * 60);
    setIsBreak(false);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskName.trim()) {
      addTask(newTaskName.trim());
      setNewTaskName('');
    }
  };

  const handleAddPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPresetName.trim()) {
      addPreset({
        name: newPresetName.trim(),
        duration: newPresetDuration * 60,
        breakDuration: newPresetBreak * 60
      });
      setNewPresetName('');
      setNewPresetDuration(25);
      setNewPresetBreak(5);
    }
  };

  const handleCustomTimeSet = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(customMinutes);
    if (!isNaN(mins) && mins > 0) {
      setTime(mins * 60);
      setShowMinuteInput(false);
      setCustomMinutes('');
    }
  };

  const calcProgress = () => {
    if (isBreak) {
      return (breakTime - time) / breakTime;
    }
    
    // If we're in focus mode, use the current time to calculate progress
    // This handles custom durations better
    const totalDuration = presets.find(p => p.id === 'default')?.duration || 25 * 60;
    const elapsedPercent = 1 - (time / totalDuration);
    
    // Clamp between 0 and 1
    return Math.max(0, Math.min(1, elapsedPercent));
  };

  const progress = calcProgress();
  const circumference = 2 * Math.PI * 45; // radius = 45

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
        {/* Timer Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Timer className="mr-2" />
            Study Timer
          </h2>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSound}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTasks(true)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              aria-label="View tasks"
            >
              <List size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPresets(true)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              aria-label="Timer settings"
            >
              <Settings size={20} />
            </motion.button>
          </div>
        </div>

        {/* Timer Display */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-64 h-64">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-gray-200 dark:text-gray-700"
              />
              {/* Progress circle */}
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                className="text-purple-600 dark:text-purple-400"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {showMinuteInput ? (
                <form onSubmit={handleCustomTimeSet} className="flex flex-col items-center space-y-2">
                  <input
                    type="number"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(e.target.value)}
                    className="w-24 px-3 py-2 text-center text-2xl font-bold rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="mins"
                    autoFocus
                    min="1"
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="px-2 py-1 text-xs rounded-md bg-purple-600 text-white"
                    >
                      Set
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMinuteInput(false)}
                      className="px-2 py-1 text-xs rounded-md bg-gray-400 text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button 
                  onClick={() => setShowMinuteInput(true)}
                  className="text-5xl font-bold text-gray-900 dark:text-white font-mono hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  title="Click to set custom time"
                >
                  {formatTime(time)}
                </button>
              )}
              <span className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {isBreak ? 'Break Time!' : currentTask?.name || 'Focus Time'}
              </span>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="mt-4 flex items-center space-x-2 mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Quick Set:</span>
            <button
              onClick={() => setTime(15 * 60)}
              className="px-2 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"
            >
              15min
            </button>
            <button
              onClick={() => setTime(25 * 60)}
              className="px-2 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"
            >
              25min
            </button>
            <button
              onClick={() => setTime(45 * 60)}
              className="px-2 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"
            >
              45min
            </button>
          </div>

          {/* Session Counter */}
          <div className="mt-4 flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Sessions Completed: {completedSessions}
            </span>
            {completedSessions > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-500"
              >
                <Check size={16} />
              </motion.div>
            )}
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex justify-center items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTimer}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center shadow-lg hover:shadow-xl transition-shadow"
          >
            {isActive ? <Pause className="mr-2" size={20} /> : <Play className="mr-2" size={20} />}
            {isActive ? 'Pause' : 'Start'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetTimer}
            className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <RotateCcw size={20} />
          </motion.button>
        </div>

        {/* Tasks Modal */}
        <AnimatePresence>
          {showTasks && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
              onClick={() => setShowTasks(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Tasks</h3>
                  <button
                    onClick={() => setShowTasks(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleAddTask} className="mb-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTaskName}
                      onChange={e => setNewTaskName(e.target.value)}
                      placeholder="New task..."
                      className="flex-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </form>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {tasks.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                      No tasks yet. Add a task to get started.
                    </p>
                  ) : (
                    tasks.map(task => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                      >
                        <div className="flex items-center space-x-3">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleTaskComplete(task.id)}
                            className={`p-1 rounded-md ${
                              task.completed
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-600'
                            }`}
                          >
                            <Check size={16} />
                          </motion.button>
                          <span className={`${
                            task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'
                          }`}>
                            {task.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {Math.floor(task.timeSpent / 60)}m
                          </span>
                          <button
                            onClick={() => setCurrentTask(currentTask?.id === task.id ? null : task)}
                            className={`p-1 rounded-md ${
                              currentTask?.id === task.id
                                ? 'text-purple-600 dark:text-purple-400'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                            }`}
                            title={currentTask?.id === task.id ? "Unset active task" : "Set as active task"}
                          >
                            <Clock size={16} />
                          </button>
                          <button
                            onClick={() => removeTask(task.id)}
                            className="p-1 rounded-md text-gray-400 hover:text-red-500"
                            title="Delete task"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Presets Modal */}
        <AnimatePresence>
          {showPresets && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
              onClick={() => setShowPresets(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Timer Presets</h3>
                  <button
                    onClick={() => setShowPresets(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleAddPreset} className="mb-4 space-y-3">
                  <input
                    type="text"
                    value={newPresetName}
                    onChange={e => setNewPresetName(e.target.value)}
                    placeholder="Preset name..."
                    className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <label className="text-sm text-gray-600 dark:text-gray-400">Focus (min)</label>
                      <input
                        type="number"
                        value={newPresetDuration}
                        onChange={e => setNewPresetDuration(parseInt(e.target.value) || 25)}
                        min="1"
                        className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-gray-600 dark:text-gray-400">Break (min)</label>
                      <input
                        type="number"
                        value={newPresetBreak}
                        onChange={e => setNewPresetBreak(parseInt(e.target.value) || 5)}
                        min="1"
                        className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 flex items-center justify-center"
                  >
                    <Save size={20} className="mr-2" />
                    Save Preset
                  </button>
                </form>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {presets.map(preset => (
                    <div
                      key={preset.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                    >
                      <div>
                        <div className="text-gray-900 dark:text-white font-medium">
                          {preset.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {Math.floor(preset.duration / 60)}m focus, {Math.floor(preset.breakDuration / 60)}m break
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => applyPreset(preset.id)}
                          className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                          title="Apply preset"
                        >
                          <Play size={16} />
                        </motion.button>
                        {!['short', 'default', 'long'].includes(preset.id) && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => removePreset(preset.id)}
                            className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                            title="Delete preset"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}