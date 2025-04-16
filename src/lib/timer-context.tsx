import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { createNotificationSound } from './sounds';

interface TimerPreset {
  id: string;
  name: string;
  duration: number;
  breakDuration: number;
}

interface Task {
  id: string;
  name: string;
  completed: boolean;
  timeSpent: number;
}

interface TimerContextType {
  time: number;
  isActive: boolean;
  isBreak: boolean;
  completedSessions: number;
  breakTime: number;
  currentTask: Task | null;
  tasks: Task[];
  presets: TimerPreset[];
  soundEnabled: boolean;
  setTime: (time: number) => void;
  setIsActive: (isActive: boolean) => void;
  setIsBreak: (isBreak: boolean) => void;
  setCompletedSessions: (sessions: number) => void;
  setBreakTime: (time: number) => void;
  addTask: (name: string) => void;
  removeTask: (id: string) => void;
  setCurrentTask: (task: Task | null) => void;
  toggleTaskComplete: (id: string) => void;
  addPreset: (preset: Omit<TimerPreset, 'id'>) => void;
  removePreset: (id: string) => void;
  applyPreset: (id: string) => void;
  toggleSound: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const DEFAULT_PRESETS: TimerPreset[] = [
  { id: 'short', name: 'Short Focus', duration: 15 * 60, breakDuration: 3 * 60 },
  { id: 'default', name: 'Classic Pomodoro', duration: 25 * 60, breakDuration: 5 * 60 },
  { id: 'long', name: 'Long Focus', duration: 45 * 60, breakDuration: 10 * 60 },
];

const TIMER_STORAGE_KEY = 'eq_coach_timer_state';

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [presets, setPresets] = useState<TimerPreset[]>(DEFAULT_PRESETS);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Ref to store notification sound URL
  const soundUrlRef = useRef<string | null>(null);
  
  // Initialize sound on component mount
  useEffect(() => {
    try {
      soundUrlRef.current = createNotificationSound();
    } catch (error) {
      console.error('Failed to create notification sound:', error);
    }
    
    // Cleanup sound URL on unmount
    return () => {
      if (soundUrlRef.current) {
        URL.revokeObjectURL(soundUrlRef.current);
      }
    };
  }, []);

  // Sound effects
  const playNotificationSound = useCallback(() => {
    if (soundEnabled && soundUrlRef.current) {
      try {
        const audio = new Audio(soundUrlRef.current);
        audio.volume = 0.5; // Set volume to 50%
        audio.play().catch(error => {
          console.error('Error playing sound:', error);
        });
      } catch (error) {
        console.error('Error creating audio element:', error);
      }
    }
  }, [soundEnabled]);

  // Task management
  const addTask = useCallback((name: string) => {
    setTasks(prev => [...prev, {
      id: Date.now().toString(),
      name,
      completed: false,
      timeSpent: 0
    }]);
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    if (currentTask?.id === id) setCurrentTask(null);
  }, [currentTask]);

  const toggleTaskComplete = useCallback((id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }, []);

  // Preset management
  const addPreset = useCallback((preset: Omit<TimerPreset, 'id'>) => {
    const newPreset = { ...preset, id: `custom-${Date.now()}` };
    setPresets(prev => [...prev, newPreset]);
  }, []);

  const removePreset = useCallback((id: string) => {
    setPresets(prev => prev.filter(preset => preset.id !== id));
  }, []);

  const applyPreset = useCallback((id: string) => {
    const preset = presets.find(p => p.id === id);
    if (preset) {
      setTime(preset.duration);
      setBreakTime(preset.breakDuration);
      setIsActive(false);
      setIsBreak(false);
    }
  }, [presets]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  // Load timer state from localStorage
  useEffect(() => {
    const savedTimerState = localStorage.getItem(TIMER_STORAGE_KEY);
    if (savedTimerState) {
      try {
        const parsedState = JSON.parse(savedTimerState);
        setTime(parsedState.time || 25 * 60);
        setIsActive(!!parsedState.isActive);
        setIsBreak(!!parsedState.isBreak);
        setCompletedSessions(parsedState.completedSessions || 0);
        setBreakTime(parsedState.breakTime || 5 * 60);
        
        // Handle tasks
        if (Array.isArray(parsedState.tasks)) {
          setTasks(parsedState.tasks);
        }
        
        // Handle current task
        if (parsedState.currentTask) {
          setCurrentTask(parsedState.currentTask);
        }
        
        // Handle presets - merge with defaults to ensure we always have the standard presets
        if (Array.isArray(parsedState.presets)) {
          // Get default preset IDs
          const defaultPresetIds = DEFAULT_PRESETS.map(p => p.id);
          
          // Filter out custom presets (non-default presets)
          const customPresets = parsedState.presets.filter(
            (p: TimerPreset) => !defaultPresetIds.includes(p.id)
          );
          
          // Combine default presets with custom presets
          setPresets([...DEFAULT_PRESETS, ...customPresets]);
        }
        
        setSoundEnabled(parsedState.soundEnabled ?? true);
      } catch (err) {
        console.error('Error parsing saved timer state:', err);
        localStorage.removeItem(TIMER_STORAGE_KEY);
      }
    }
  }, []);

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    const timerState = {
      time,
      isActive,
      isBreak,
      completedSessions,
      breakTime,
      tasks,
      currentTask,
      presets,
      soundEnabled
    };
    
    try {
      localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(timerState));
    } catch (error) {
      console.error('Error saving timer state to localStorage:', error);
    }
  }, [time, isActive, isBreak, completedSessions, breakTime, tasks, currentTask, presets, soundEnabled]);

  // Handle timer countdown and task tracking
  useEffect(() => {
    let interval: number | null = null;

    if (isActive && time > 0) {
      interval = window.setInterval(() => {
        setTime(time => time - 1);
        if (currentTask && !isBreak) {
          setTasks(prev => prev.map(task =>
            task.id === currentTask.id
              ? { ...task, timeSpent: task.timeSpent + 1 }
              : task
          ));
        }
      }, 1000);
    } else if (isActive && time === 0) {
      playNotificationSound();
      
      if (!isBreak) {
        setCompletedSessions(prev => prev + 1);
        setTime(breakTime);
        setIsBreak(true);
      } else {
        setTime(25 * 60);
        setIsBreak(false);
      }
      setIsActive(false);
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isActive, time, isBreak, breakTime, currentTask, playNotificationSound]);

  return (
    <TimerContext.Provider value={{
      time,
      isActive,
      isBreak,
      completedSessions,
      breakTime,
      currentTask,
      tasks,
      presets,
      soundEnabled,
      setTime,
      setIsActive,
      setIsBreak,
      setCompletedSessions,
      setBreakTime,
      addTask,
      removeTask,
      setCurrentTask,
      toggleTaskComplete,
      addPreset,
      removePreset,
      applyPreset,
      toggleSound
    }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}