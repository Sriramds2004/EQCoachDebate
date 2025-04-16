import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';
import { ArrowRight, BarChart2, Brain, MessageSquare, Sparkles, Zap } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartJourney = () => {
    navigate('/journey');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="pt-16 min-h-screen relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-950 dark:to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-200/20 via-transparent to-transparent dark:from-purple-800/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-pink-200/20 via-transparent to-transparent dark:from-pink-800/10" />
        <motion.div
          className="absolute inset-0"
          initial={{ backgroundPosition: '0% 0%' }}
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
          }}
          transition={{ 
            duration: 20,
            ease: "linear",
            repeat: Infinity
          }}
          style={{
            background: 'repeating-linear-gradient(45deg, transparent, transparent 100px, rgba(168, 85, 247, 0.05) 100px, rgba(168, 85, 247, 0.05) 200px)'
          }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative">
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-purple-300/30 to-pink-300/30 dark:from-purple-500/10 dark:to-pink-500/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute top-40 right-1/4 w-72 h-72 rounded-full bg-gradient-to-r from-pink-300/30 to-purple-300/30 dark:from-pink-500/10 dark:to-purple-500/10 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center relative"
          >
            {/* Welcome Icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-block p-3 bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl backdrop-blur-sm"
            >
              <div className="relative">
                <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-purple-600/20 dark:bg-purple-400/20"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                />
              </div>
            </motion.div>

            {/* Welcome Text */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative z-10"
              >
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-6xl mb-6">
                  Welcome back,{' '}
                  <span className="inline-block">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                      {user?.email?.split('@')[0] || 'Champion'}
                    </span>
                    <motion.div
                      className="h-1 mt-1 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    />
                  </span>
                </h1>
                <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Ready to enhance your emotional intelligence and debate skills? Let's continue your journey to excellence.
                </p>
              </motion.div>
            </div>

            {/* Quick Stats with Glass Effect */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {quickStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                    <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                      {stat.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Feature Cards with Glass Morphism */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="relative group cursor-pointer"
              onClick={() => navigate(feature.link)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100/80 dark:bg-purple-900/80 rounded-xl">
                      <feature.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  <div className="flex items-center text-purple-600 dark:text-purple-400">
                    <span className="text-sm font-medium">Learn more</span>
                    <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action with Enhanced Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <motion.button
            onClick={handleStartJourney}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative inline-flex items-center px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg group"
          >
            <span className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-300" />
            <span className="relative flex items-center space-x-2">
              Continue Your Journey
              <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

const quickStats = [
  { label: 'Practice Sessions', value: '12' },
  { label: 'Hours Practiced', value: '24' },
  { label: 'Skills Improved', value: '8' },
  { label: 'Achievements', value: '5' },
];

const features = [
  {
    title: 'Emotional Intelligence',
    description: 'Develop your EQ through personalized AI-guided exercises and feedback.',
    icon: Brain,
    link: '/journey'
  },
  {
    title: 'Debate Practice',
    description: 'Master persuasive argumentation with real-time AI coaching.',
    icon: MessageSquare,
    link: '/chat'
  },
  {
    title: 'Progress Tracking',
    description: 'Monitor your growth with detailed analytics and insights.',
    icon: BarChart2,
    link: '/analytics'
  }
];