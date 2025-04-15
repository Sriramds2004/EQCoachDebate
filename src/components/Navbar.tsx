import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Home, BarChart2, MessageCircle, BookOpen, LineChart, Timer, FileText, GraduationCap, Menu, X, LogIn } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import StudentProfile from './StudentProfile';

interface NavbarProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export default function Navbar({ isDarkMode, setIsDarkMode }: NavbarProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <motion.div
              className="flex-shrink-0 font-bold text-lg md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400"
              whileHover={{ scale: 1.05 }}
            >
              <Link to="/" className="flex items-center">
                <GraduationCap className="mr-1" size={20} />
                <span className="hidden sm:inline">EQ Coach AI</span>
                <span className="sm:hidden">EQ AI</span>
              </Link>
            </motion.div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:block ml-6">
              <div className="flex space-x-2">
                <NavLink to="/" label="Home" icon={<Home size={16} />} isActive={isActive('/')} />
                <NavLink to="/journey" label="Journey" icon={<BarChart2 size={16} />} isActive={isActive('/journey')} />
                <NavLink to="/chat" label="Chat" icon={<MessageCircle size={16} />} isActive={isActive('/chat')} />
                <NavLink to="/analytics" label="Analytics" icon={<LineChart size={16} />} isActive={isActive('/analytics')} />
                <NavLink to="/resources" label="Resources" icon={<BookOpen size={16} />} isActive={isActive('/resources')} />
                <NavLink to="/notes" label="Notes" icon={<FileText size={16} />} isActive={isActive('/notes')} />
                <NavLink to="/timer" label="Timer" icon={<Timer size={16} />} isActive={isActive('/timer')} />
              </div>
            </div>
          </div>
          
          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            <StudentProfile isDarkMode={isDarkMode} />
            
            {/* Login Button */}
            <Link
              to="/auth"
              className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${
                isActive('/auth')
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <LogIn size={16} className="mr-1.5" />
              <span className="hidden sm:inline">Login</span>
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu - Overlay style */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-gray-900 shadow-lg"
          >
            <div className="px-2 py-3 space-y-1 sm:px-3 max-h-[70vh] overflow-auto">
              <MobileNavLink to="/" label="Home" icon={<Home size={18} />} isActive={isActive('/')} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/journey" label="Journey" icon={<BarChart2 size={18} />} isActive={isActive('/journey')} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/chat" label="Chat" icon={<MessageCircle size={18} />} isActive={isActive('/chat')} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/analytics" label="Analytics" icon={<LineChart size={18} />} isActive={isActive('/analytics')} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/resources" label="Resources" icon={<BookOpen size={18} />} isActive={isActive('/resources')} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/notes" label="Notes" icon={<FileText size={18} />} isActive={isActive('/notes')} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/timer" label="Timer" icon={<Timer size={18} />} isActive={isActive('/timer')} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/auth" label="Login" icon={<LogIn size={18} />} isActive={isActive('/auth')} onClick={() => setMobileMenuOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// Desktop Navigation Link
interface NavLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

function NavLink({ to, label, icon, isActive }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${
        isActive
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      <span className="mr-1.5">{icon}</span>
      {label}
    </Link>
  );
}

// Mobile Navigation Link
interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

function MobileNavLink({ to, label, icon, isActive, onClick }: MobileNavLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center px-3 py-2.5 rounded-md text-base font-medium ${
        isActive
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </Link>
  );
}