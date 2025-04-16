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
    <>
      {/* Navbar Background Blur Effect */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-16 z-40 bg-white/5 dark:bg-gray-950/5 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Subtle top border gradient */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <motion.div
                className="flex-shrink-0 font-bold text-lg md:text-xl"
                whileHover={{ scale: 1.05 }}
              >
                <Link to="/" className="flex items-center group">
                  <div className="relative">
                    <GraduationCap className="mr-1 text-purple-600 dark:text-purple-400 transition-transform group-hover:scale-110" size={24} />
                    <motion.div
                      className="absolute inset-0 bg-purple-600/20 dark:bg-purple-400/20 rounded-full blur-md"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.2, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    />
                  </div>
                  <span className="hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                    EQ Coach AI
                  </span>
                  <span className="sm:hidden bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                    EQ AI
                  </span>
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
                className="group relative"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className={`relative flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out ${
                  isActive('/auth')
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/50 backdrop-blur-sm'
                }`}>
                  <LogIn size={16} className="mr-1.5" />
                  <span className="hidden sm:inline">Login</span>
                </div>
              </Link>
              
              {/* Theme Toggle Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="relative p-2 rounded-lg bg-white/10 dark:bg-gray-800/50 hover:bg-white/20 dark:hover:bg-gray-700/50 backdrop-blur-sm transition-colors group"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </div>
              </motion.button>
              
              {/* Mobile menu button */}
              <div className="lg:hidden">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="relative p-2 rounded-lg bg-white/10 dark:bg-gray-800/50 hover:bg-white/20 dark:hover:bg-gray-700/50 backdrop-blur-sm transition-colors group"
                >
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation Menu - Glass effect */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="lg:hidden absolute top-16 inset-x-4 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-xl border border-gray-200/50 dark:border-gray-800/50 z-50"
              >
                <div className="p-4 space-y-1 max-h-[70vh] overflow-auto">
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
            </>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}

// Desktop Navigation Link
interface NavLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

// Mobile Navigation Link
interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

// Desktop Navigation Link Component
function NavLink({ to, label, icon, isActive }: NavLinkProps) {
  return (
    <Link
      to={to}
      className="group relative"
    >
      <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className={`relative flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out ${
        isActive
          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
          : 'text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/50 backdrop-blur-sm'
      }`}>
        <span className="mr-1.5">{icon}</span>
        {label}
      </div>
    </Link>
  );
}

// Mobile Navigation Link Component
function MobileNavLink({ to, label, icon, isActive, onClick }: MobileNavLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="group block"
    >
      <div className={`flex items-center px-3 py-2.5 rounded-lg text-base font-medium transition-all duration-200 ease-in-out ${
        isActive
          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
          : 'text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/50'
      }`}>
        <span className="mr-3">{icon}</span>
        {label}
      </div>
    </Link>
  );
}