import { User } from './auth-context';

// Define the analytics data structure
export interface AnalyticsData {
  eqScore: number;
  debateScore: number;
  categoryScores: {
    [key: string]: {
      score: number;
      comment: string;
    };
  };
  recentDebates: {
    topic: string;
    date: string;
    score: number;
    side: string;
  }[];
}

export interface StudentProgressData {
  level: string;
  practiceSessions: number;
  streak: number;
  nextCompetition: string;
  skillPoints: number;
  xpToNextLevel: number;
  badges: string[];
  completedChallenges: number;
}

// Function to fetch analytics data from various sources
export async function fetchStudentAnalytics(user: User): Promise<AnalyticsData> {
  try {
    // This would be a real API call in production
    // For now, we'll generate realistic data based on the user's ID to make it unique per user
    
    // Create a simple hash from the user ID
    const hash = Array.from(user.id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Generate more realistic EQ score between 65-95 based on user ID
    const eqScore = 65 + (hash % 30);
    
    // Generate debate score between 60-98 based on user ID
    const debateScore = 60 + (hash % 38);
    
    // Get persisted debate records if available
    const debatesKey = `debate-history-${user.id}`;
    let recentDebates = localStorage.getItem(debatesKey);
    let debateHistory = recentDebates 
      ? JSON.parse(recentDebates)
      : [
          { 
            topic: "AI Ethics in Education", 
            date: formatDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)), 
            score: 70 + (hash % 25), 
            side: hash % 2 === 0 ? "for" : "against" 
          },
          { 
            topic: "Climate Change Policy", 
            date: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)), 
            score: 65 + (hash % 30), 
            side: hash % 2 === 0 ? "against" : "for" 
          },
          { 
            topic: "Digital Privacy Rights", 
            date: formatDate(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)), 
            score: 75 + (hash % 20), 
            side: hash % 2 === 0 ? "for" : "against" 
          }
        ];
    
    // Get persisted category scores if available
    const categoriesKey = `eq-scores-${user.id}`;
    let categoryData = localStorage.getItem(categoriesKey);
    let categoryScores = categoryData
      ? JSON.parse(categoryData)
      : {
          "Self_Awareness": { 
            score: 70 + (hash % 25), 
            comment: getCommentForScore("Self_Awareness", 70 + (hash % 25)) 
          },
          "Emotional_Expression": { 
            score: 65 + (hash % 30), 
            comment: getCommentForScore("Emotional_Expression", 65 + (hash % 30)) 
          },
          "Empathy": { 
            score: 75 + (hash % 20), 
            comment: getCommentForScore("Empathy", 75 + (hash % 20)) 
          },
          "Self_Regulation": { 
            score: 60 + (hash % 35), 
            comment: getCommentForScore("Self_Regulation", 60 + (hash % 35)) 
          },
          "Social_Awareness": { 
            score: 68 + (hash % 27), 
            comment: getCommentForScore("Social_Awareness", 68 + (hash % 27)) 
          }
        };
    
    return {
      eqScore,
      debateScore,
      categoryScores,
      recentDebates: debateHistory.slice(0, 3) // Show only the 3 most recent debates
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
}

// Function to fetch student progress data
export async function fetchStudentProgress(user: User): Promise<StudentProgressData> {
  try {
    // Get existing student profile data
    const profileKey = `student-profile-${user.id}`;
    const savedInfo = localStorage.getItem(profileKey);
    let profileData;
    
    if (savedInfo) {
      profileData = JSON.parse(savedInfo);
    } else {
      // If no profile exists, create a new one with realistic data based on user ID
      const hash = Array.from(user.id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      // Generate appropriate level and skill points
      const skillPoints = 100 + (hash % 900);
      let level;
      
      if (skillPoints < 250) {
        level = 'Novice';
      } else if (skillPoints < 500) {
        level = 'Intermediate';
      } else if (skillPoints < 750) {
        level = 'Advanced';
      } else {
        level = 'Expert';
      }
      
      profileData = {
        level,
        practiceSessions: 10 + (hash % 30),
        streak: 1 + (hash % 10),
        nextCompetition: hash % 4 === 0 ? 'National Finals - May 15, 2025' : 
                        hash % 3 === 0 ? 'Regional Debate - April 28, 2025' : 
                        hash % 2 === 0 ? 'School Tournament - April 22, 2025' : 
                        'Not scheduled',
        skillPoints
      };
      
      // Save the new profile
      localStorage.setItem(profileKey, JSON.stringify(profileData));
    }
    
    // Calculate XP needed for next level
    const xpToNextLevel = profileData.skillPoints < 1000 ? (1000 - profileData.skillPoints) : 0;
    
    // Get badges from badge system if available
    const badgesKey = `badges-${user.id}`;
    const savedBadges = localStorage.getItem(badgesKey);
    let badges;
    
    if (savedBadges) {
      badges = JSON.parse(savedBadges);
    } else {
      // Generate badges based on user ID
      const hash = Array.from(user.id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const allBadges = [
        'Critical Thinker', 'Eloquent Speaker', 'Empathy Master', 
        'Logic Expert', 'Research Scholar', 'Debate Champion',
        'Persuasive Voice', 'Ethical Reasoner', 'Emotional Intelligence'
      ];
      
      // Assign 2-4 badges based on user ID
      const badgeCount = 2 + (hash % 3);
      badges = [];
      
      for (let i = 0; i < badgeCount; i++) {
        const idx = (hash + i) % allBadges.length;
        badges.push(allBadges[idx]);
      }
      
      // Save the badges
      localStorage.setItem(badgesKey, JSON.stringify(badges));
    }
    
    // Get challenges data if available
    const challengesKey = `challenges-${user.id}`;
    const savedChallenges = localStorage.getItem(challengesKey);
    let completedChallenges;
    
    if (savedChallenges) {
      completedChallenges = JSON.parse(savedChallenges).completed;
    } else {
      // Generate completed challenges based on user ID
      const hash = Array.from(user.id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
      completedChallenges = 5 + (hash % 15);
      
      // Save the challenges data
      localStorage.setItem(challengesKey, JSON.stringify({ completed: completedChallenges }));
    }
    
    return {
      ...profileData,
      badges,
      completedChallenges,
      xpToNextLevel
    };
  } catch (error) {
    console.error('Error fetching student progress data:', error);
    throw error;
  }
}

// Helper function to format dates
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}

// Helper function to generate appropriate comments based on score
function getCommentForScore(category: string, score: number): string {
  if (score < 70) {
    return getCategoryComment(category, 'low');
  } else if (score < 85) {
    return getCategoryComment(category, 'medium');
  } else {
    return getCategoryComment(category, 'high');
  }
}

// Helper function to get specific comments for each category and level
function getCategoryComment(category: string, level: 'low' | 'medium' | 'high'): string {
  const comments = {
    "Self_Awareness": {
      low: "Developing emotional vocabulary and self-reflection skills",
      medium: "Good emotional vocabulary and self-reflection",
      high: "Excellent emotional vocabulary and deep self-reflection"
    },
    "Emotional_Expression": {
      low: "Working on effective communication of feelings",
      medium: "Good communication of feelings and needs",
      high: "Excellent ability to express emotions appropriately"
    },
    "Empathy": {
      low: "Building perspective-taking abilities",
      medium: "Good perspective-taking abilities",
      high: "Outstanding perspective-taking and empathetic response"
    },
    "Self_Regulation": {
      low: "Developing emotion management strategies",
      medium: "Effective emotion management in most contexts",
      high: "Exceptional emotion management in high-pressure situations"
    },
    "Social_Awareness": {
      low: "Growing understanding of social dynamics",
      medium: "Good understanding of social dynamics",
      high: "Sophisticated understanding of complex social dynamics"
    }
  };
  
  return comments[category as keyof typeof comments][level];
}

// Function to calculate XP breakdown
export function calculateXpBreakdown(studentProgress: StudentProgressData): Record<string, number> {
  const totalXp = studentProgress.skillPoints;
  
  // Create a realistic breakdown based on total XP and some randomization
  const seed = studentProgress.badges.length + studentProgress.completedChallenges;
  
  // Calculate debate performance XP (35-45% of total)
  const debatePerformancePercent = 0.35 + (seed % 10) / 100;
  const debatePerformanceXP = Math.round(totalXp * debatePerformancePercent);
  
  // Calculate challenge XP (20-30% of total)
  const challengePercent = 0.2 + (seed % 10) / 100;
  const challengeXP = Math.round(totalXp * challengePercent);
  
  // Calculate practice streak XP (10-20% of total)
  const streakPercent = 0.1 + (seed % 10) / 100;
  const streakXP = Math.round(totalXp * streakPercent);
  
  // Calculate chat completion XP (remainder, approximately 15-25%)
  const chatXP = totalXp - debatePerformanceXP - challengeXP - streakXP;
  
  return {
    "Debate Performances": debatePerformanceXP,
    "Challenges": challengeXP,
    "Daily Streaks": streakXP,
    "Chat Completions": chatXP
  };
}