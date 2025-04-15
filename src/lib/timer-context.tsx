import React, { createContext, useContext, useState, useEffect } from 'react';

interface TimerContextType {
  time: number;
  isActive: boolean;
  isBreak: boolean;
  completedSessions: number;
  breakTime: number;
  setTime: (time: number) => void;
  setIsActive: (isActive: boolean) => void;
  setIsBreak: (isBreak: boolean) => void;
  setCompletedSessions: (sessions: number) => void;
  setBreakTime: (time: number) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const TIMER_STORAGE_KEY = 'eq_coach_timer_state';

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [breakTime, setBreakTime] = useState(5 * 60); // 5 minutes break

  // Load timer state from localStorage on initial load
  useEffect(() => {
    const savedTimerState = localStorage.getItem(TIMER_STORAGE_KEY);
    if (savedTimerState) {
      try {
        const parsedState = JSON.parse(savedTimerState);
        setTime(parsedState.time);
        setIsActive(parsedState.isActive);
        setIsBreak(parsedState.isBreak);
        setCompletedSessions(parsedState.completedSessions);
        setBreakTime(parsedState.breakTime);
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
      breakTime
    };
    localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(timerState));
  }, [time, isActive, isBreak, completedSessions, breakTime]);

  // Handle timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (isActive && time === 0) {
      if (!isBreak) {
        // Study session completed
        setCompletedSessions(prev => prev + 1);
        setTime(breakTime);
        setIsBreak(true);
      } else {
        // Break completed
        setTime(25 * 60);
        setIsBreak(false);
      }
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, isBreak, breakTime]);

  return (
    <TimerContext.Provider value={{
      time,
      isActive,
      isBreak,
      completedSessions,
      breakTime,
      setTime,
      setIsActive,
      setIsBreak,
      setCompletedSessions,
      setBreakTime
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