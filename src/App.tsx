import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import Navbar from './components/Navbar';
import Journey from './components/journey/Journey';
import Auth from './components/auth/Auth';
import Resources from './components/resources/Resources';
import Analytics from './components/Analytics';
import Notes from './components/Notes';
import StudyTimer from './components/StudyTimer';
import FloatingTimer from './components/FloatingTimer';
import { AuthProvider, useAuth } from './lib/auth-context';
import { TimerProvider } from './lib/timer-context';

// Protected route wrapper component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="pt-20 flex justify-center">Loading...</div>;
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

// Auth redirect component (redirects to dashboard if logged in)
function AuthRedirect() {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="pt-20 flex justify-center">Loading...</div>;
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Auth />;
}

function AppRoutes() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
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
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
          
          {/* Auth route (redirects to dashboard if logged in) */}
          <Route path="/auth" element={<AuthRedirect />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/journey" element={<ProtectedRoute><Journey /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
          <Route path="/timer" element={<ProtectedRoute><StudyTimer /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <TimerProvider>
        <Router>
          <AppRoutes />
          <FloatingTimer />
        </Router>
      </TimerProvider>
    </AuthProvider>
  );
}

export default App;