import { motion } from 'framer-motion';
import { Sun, Moon, Home, BarChart2, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export default function Navbar({ isDarkMode, setIsDarkMode }: NavbarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <motion.div
              className="flex-shrink-0 font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400"
              whileHover={{ scale: 1.05 }}
            >
              <Link to="/">EQ Coach AI</Link>
            </motion.div>

            <div className="hidden md:block ml-10">
              <div className="flex space-x-4">
                <NavLink to="/" label="Home" icon={<Home size={18} />} isActive={isActive('/')} />
                <NavLink to="/journey" label="Journey" icon={<BarChart2 size={18} />} isActive={isActive('/journey')} />
                <NavLink to="/chat" label="Chat" icon={<MessageCircle size={18} />} isActive={isActive('/chat')} />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-2">
          <div className="flex justify-around">
            <MobileNavLink to="/" label="Home" icon={<Home size={18} />} isActive={isActive('/')} />
            <MobileNavLink to="/journey" label="Journey" icon={<BarChart2 size={18} />} isActive={isActive('/journey')} />
            <MobileNavLink to="/chat" label="Chat" icon={<MessageCircle size={18} />} isActive={isActive('/chat')} />
          </div>
        </div>
      </div>
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
      className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out ${
        isActive
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </Link>
  );
}

// Mobile Navigation Link
function MobileNavLink({ to, label, icon, isActive }: NavLinkProps) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center px-2 py-1 text-xs font-medium"
    >
      <motion.div
        className={`p-2 rounded-full mb-1 ${
          isActive
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
            : 'text-gray-700 dark:text-gray-300'
        }`}
        whileTap={{ scale: 0.9 }}
      >
        {icon}
      </motion.div>
      <span className={isActive ? 'text-purple-500 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'}>
        {label}
      </span>
    </Link>
  );
}