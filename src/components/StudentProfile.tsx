import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Award, Clock, Calendar, ChevronDown, ChevronUp, LogOut } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { useNavigate } from 'react-router-dom';

interface StudentProfileProps {
  isDarkMode: boolean;
}

export default function StudentProfile({ isDarkMode }: StudentProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [studentInfo, setStudentInfo] = useState({
    level: 'Novice',
    practiceSessions: 0,
    streak: 0,
    nextCompetition: 'Not scheduled',
    skillPoints: 0
  });
  
  // Load student info from localStorage
  useEffect(() => {
    if (!user?.id) return;
    
    const savedInfo = localStorage.getItem(`student-profile-${user.id}`);
    if (savedInfo) {
      try {
        setStudentInfo({...JSON.parse(savedInfo)});
      } catch (err) {
        console.error('Error parsing student info:', err);
      }
    }
  }, [user?.id]);
  
  // Close profile dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = () => setIsOpen(false);
    if (isOpen) {
      document.addEventListener('click', closeDropdown);
    }
    return () => document.removeEventListener('click', closeDropdown);
  }, [isOpen]);

  // Handle logout
  const handleLogout = () => {
    signOut();
    navigate('/auth');
    setIsOpen(false);
  };

  // Example levels based on skill points
  const getLevelBadge = () => {
    const { skillPoints } = studentInfo;
    
    if (skillPoints < 100) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          Novice
        </span>
      );
    } else if (skillPoints < 500) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200">
          Intermediate
        </span>
      );
    } else if (skillPoints < 1000) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
          Advanced
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
          Expert
        </span>
      );
    }
  };

  // Create initials from user name
  const getInitials = () => {
    if (!user?.name) return 'S';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  if (!user) return null;

  return (
    <div className="relative">
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center space-x-1 px-2 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
          {getInitials()}
        </div>
        <span className="font-medium text-xs hidden sm:block truncate max-w-[60px]">
          {user.name.split(' ')[0]}
        </span>
        <span className="hidden sm:block">
          {isOpen ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          )}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg py-2 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                {user.email}
              </p>
              <div className="mt-2 flex items-center">
                <Award className="h-4 w-4 text-purple-500 mr-1" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Student ID: ST-{user.id.substring(0, 5)}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700"></div>
            
            <div className="px-4 py-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Level</span>
                {getLevelBadge()}
              </div>
              
              <div className="mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Skill Points</span>
                <div className="mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(studentInfo.skillPoints / 10, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{studentInfo.skillPoints} points</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {studentInfo.skillPoints < 1000 
                      ? `${1000 - studentInfo.skillPoints} to next level` 
                      : 'Max level'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center mb-2">
                <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Practice Sessions: {studentInfo.practiceSessions}
                </span>
              </div>
              
              <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Next Competition: {studentInfo.nextCompetition}
                </span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 flex justify-between">
              <button 
                onClick={handleLogout}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center"
              >
                <LogOut size={14} className="mr-1" />
                Sign Out
              </button>
              
              <button
                className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
              >
                Edit Profile
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}