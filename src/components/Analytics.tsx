import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Activity, TrendingUp, BarChart2, Award, Clock, Calendar, Star, MessageSquare } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { 
  fetchStudentAnalytics, 
  fetchStudentProgress, 
  calculateXpBreakdown,
  AnalyticsData,
  StudentProgressData
} from '../lib/analytics-service';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [studentProgress, setStudentProgress] = useState<StudentProgressData | null>(null);
  const [xpBreakdown, setXpBreakdown] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch analytics data in parallel
        const [analyticsResult, progressResult] = await Promise.all([
          fetchStudentAnalytics(user),
          fetchStudentProgress(user)
        ]);
        
        setAnalyticsData(analyticsResult);
        setStudentProgress(progressResult);
        
        // Calculate XP breakdown
        const breakdown = calculateXpBreakdown(progressResult);
        setXpBreakdown(breakdown);
        
      } catch (err) {
        console.error('Error loading analytics data:', err);
        setError('Failed to load analytics data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Novice':
        return 'from-gray-400 to-gray-600';
      case 'Intermediate':
        return 'from-green-400 to-green-600';
      case 'Advanced':
        return 'from-blue-400 to-blue-600';
      case 'Expert':
        return 'from-purple-400 to-pink-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen pt-16 pb-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 max-w-6xl flex items-center justify-center flex-1">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen pt-16 pb-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 max-w-6xl flex items-center justify-center flex-1">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <div className="text-red-600 dark:text-red-400 mb-2 text-xl">Error Loading Data</div>
            <p className="text-red-700 dark:text-red-300">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData || !studentProgress || !user) {
    return (
      <div className="flex flex-col min-h-screen pt-16 pb-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 max-w-6xl flex items-center justify-center flex-1">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Analytics Data Available</h2>
            <p className="text-gray-600 dark:text-gray-400">Please sign in to view your analytics.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pt-16 pb-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            {user.name}'s Analytics Dashboard
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-6xl flex-1">
        {/* Student Level Progress */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
                {studentProgress.level.charAt(0)}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {studentProgress.level} Level
                </h2>
                <span className={`px-3 py-1 text-sm font-medium text-white rounded-full bg-gradient-to-r ${getLevelColor(studentProgress.level)}`}>
                  {studentProgress.skillPoints} XP
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                {studentProgress.xpToNextLevel > 0 
                  ? `${studentProgress.xpToNextLevel} XP needed for next level` 
                  : 'Maximum level reached!'}
              </p>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500" 
                  style={{ width: `${Math.min((studentProgress.skillPoints / 1000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Overall Scores */}
          <div className="col-span-full grid grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-500" />
                  EQ Score
                </h3>
                <span className="text-2xl font-bold text-purple-600">{analyticsData.eqScore}/100</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-purple-600 h-2.5 rounded-full"
                  style={{ width: `${analyticsData.eqScore}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-pink-500" />
                  Debate Score
                </h3>
                <span className="text-2xl font-bold text-pink-600">{analyticsData.debateScore}/100</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-pink-600 h-2.5 rounded-full"
                  style={{ width: `${analyticsData.debateScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* EQ Category Scores */}
          <div className="col-span-full lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart className="w-5 h-5 text-purple-500" />
              EQ Dimensions
            </h3>
            <div className="space-y-4">
              {Object.entries(analyticsData.categoryScores).map(([category, data]) => (
                <div key={category}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {category.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-medium text-purple-600">{data.score}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${data.score}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{data.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Debates */}
          <div className="col-span-full lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-pink-500" />
              Recent Debates
            </h3>
            <div className="space-y-4">
              {analyticsData.recentDebates.length > 0 ? (
                analyticsData.recentDebates.map((debate, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{debate.topic}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {debate.date} • Argued {debate.side}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 text-sm font-medium text-pink-600 bg-pink-100 dark:bg-pink-900/30 rounded-full">
                        {debate.score}/100
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No debate history available yet
                </div>
              )}
            </div>
          </div>

          {/* Student Progress Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Award className="h-6 w-6" />
                Progress Stats
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Practice Sessions</span>
                  </div>
                  <p className="text-xl font-bold mt-1">{studentProgress.practiceSessions}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Day Streak</span>
                  </div>
                  <p className="text-xl font-bold mt-1">{studentProgress.streak} days</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Challenges</span>
                  </div>
                  <p className="text-xl font-bold mt-1">{studentProgress.completedChallenges}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Next Event</span>
                  </div>
                  <p className="text-base font-medium mt-1 truncate">{studentProgress.nextCompetition}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Earned Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Award className="h-6 w-6" />
                Earned Badges
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {studentProgress.badges.length > 0 ? (
                  studentProgress.badges.map((badge, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs">
                        {badge.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{badge}</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-4 text-gray-500 dark:text-gray-400">
                    No badges earned yet
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Activity Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Activity className="h-6 w-6" />
                XP Breakdown
              </h2>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {Object.entries(xpBreakdown).map(([category, xp], index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{category}</span>
                    <span className="font-semibold text-gray-800 dark:text-white">{xp} XP</span>
                  </li>
                ))}
                <li className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Total XP</span>
                  <span className="font-bold text-gray-900 dark:text-white">{studentProgress.skillPoints} XP</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;