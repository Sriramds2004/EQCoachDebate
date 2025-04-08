import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import Navbar from './components/Navbar';
import Journey from './components/journey/Journey';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <Router>
      <div className={isDarkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-background">
          <motion.div
            className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900"
            animate={{
              background: isDarkMode
                ? 'linear-gradient(to right bottom, rgb(49, 46, 129), rgb(88, 28, 135), rgb(136, 19, 55))'
                : 'linear-gradient(to right bottom, rgb(199, 210, 254), rgb(233, 213, 255), rgb(251, 207, 232))',
            }}
            transition={{ duration: 0.5 }}
          />
          <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/journey" element={<Journey />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;