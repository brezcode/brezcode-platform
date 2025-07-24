import { useState, useCallback } from 'react';

export interface Milestone {
  type: 'first_feedback' | 'helpful_trainer' | 'ai_improvement' | 'learning_streak' | 'expert_trainer' | 'master_trainer';
  title: string;
  description: string;
  points: number;
}

export interface TrainingStats {
  totalFeedback: number;
  helpfulFeedback: number;
  aiImprovements: number;
  consecutiveDays: number;
  totalPoints: number;
}

const milestoneDefinitions: Record<string, Milestone> = {
  first_feedback: {
    type: 'first_feedback',
    title: 'First Trainer',
    description: 'Provided your first training feedback to help improve AI responses',
    points: 50,
  },
  helpful_trainer: {
    type: 'helpful_trainer',
    title: 'Helpful Trainer',
    description: 'Provided 5 helpful feedback comments that improved AI responses',
    points: 150,
  },
  ai_improvement: {
    type: 'ai_improvement',
    title: 'AI Improver',
    description: 'Successfully improved AI response quality by 20+ points',
    points: 100,
  },
  learning_streak: {
    type: 'learning_streak',
    title: 'Learning Streak',
    description: 'Trained the AI for 3 consecutive days',
    points: 200,
  },
  expert_trainer: {
    type: 'expert_trainer',
    title: 'Expert Trainer',
    description: 'Provided 20+ helpful training sessions with consistent improvements',
    points: 500,
  },
  master_trainer: {
    type: 'master_trainer',
    title: 'Master Trainer',
    description: 'Achieved expert-level AI training with 50+ successful improvements',
    points: 1000,
  },
};

export const useMilestoneTracker = () => {
  const [stats, setStats] = useState<TrainingStats>({
    totalFeedback: 0,
    helpfulFeedback: 0,
    aiImprovements: 0,
    consecutiveDays: 1,
    totalPoints: 0,
  });

  const [unlockedMilestones, setUnlockedMilestones] = useState<Set<string>>(new Set());
  const [pendingCelebration, setPendingCelebration] = useState<Milestone | null>(null);

  const checkMilestones = useCallback((newStats: TrainingStats): Milestone | null => {
    // Check for first feedback
    if (newStats.totalFeedback === 1 && !unlockedMilestones.has('first_feedback')) {
      const milestone = milestoneDefinitions.first_feedback;
      setUnlockedMilestones(prev => new Set([...prev, 'first_feedback']));
      return milestone;
    }

    // Check for helpful trainer (5 helpful feedback)
    if (newStats.helpfulFeedback >= 5 && !unlockedMilestones.has('helpful_trainer')) {
      const milestone = milestoneDefinitions.helpful_trainer;
      setUnlockedMilestones(prev => new Set([...prev, 'helpful_trainer']));
      return milestone;
    }

    // Check for AI improvement (significant improvements)
    if (newStats.aiImprovements >= 3 && !unlockedMilestones.has('ai_improvement')) {
      const milestone = milestoneDefinitions.ai_improvement;
      setUnlockedMilestones(prev => new Set([...prev, 'ai_improvement']));
      return milestone;
    }

    // Check for learning streak (3+ consecutive days)
    if (newStats.consecutiveDays >= 3 && !unlockedMilestones.has('learning_streak')) {
      const milestone = milestoneDefinitions.learning_streak;
      setUnlockedMilestones(prev => new Set([...prev, 'learning_streak']));
      return milestone;
    }

    // Check for expert trainer (20+ helpful sessions)
    if (newStats.helpfulFeedback >= 20 && !unlockedMilestones.has('expert_trainer')) {
      const milestone = milestoneDefinitions.expert_trainer;
      setUnlockedMilestones(prev => new Set([...prev, 'expert_trainer']));
      return milestone;
    }

    // Check for master trainer (50+ improvements)
    if (newStats.aiImprovements >= 50 && !unlockedMilestones.has('master_trainer')) {
      const milestone = milestoneDefinitions.master_trainer;
      setUnlockedMilestones(prev => new Set([...prev, 'master_trainer']));
      return milestone;
    }

    return null;
  }, [unlockedMilestones]);

  const recordFeedback = useCallback((isHelpful: boolean = true, qualityImprovement: number = 0) => {
    const newStats: TrainingStats = {
      ...stats,
      totalFeedback: stats.totalFeedback + 1,
      helpfulFeedback: stats.helpfulFeedback + (isHelpful ? 1 : 0),
      aiImprovements: stats.aiImprovements + (qualityImprovement > 15 ? 1 : 0),
      totalPoints: stats.totalPoints,
    };

    const milestone = checkMilestones(newStats);
    if (milestone) {
      newStats.totalPoints += milestone.points;
      setPendingCelebration(milestone);
    }

    setStats(newStats);
    
    // Store in localStorage for persistence
    localStorage.setItem('trainingStats', JSON.stringify(newStats));
    localStorage.setItem('unlockedMilestones', JSON.stringify([...unlockedMilestones]));

    return milestone;
  }, [stats, checkMilestones, unlockedMilestones]);

  const clearPendingCelebration = useCallback(() => {
    setPendingCelebration(null);
  }, []);

  const loadStoredStats = useCallback(() => {
    try {
      const storedStats = localStorage.getItem('trainingStats');
      const storedMilestones = localStorage.getItem('unlockedMilestones');
      
      if (storedStats) {
        setStats(JSON.parse(storedStats));
      }
      
      if (storedMilestones) {
        setUnlockedMilestones(new Set(JSON.parse(storedMilestones)));
      }
    } catch (error) {
      console.error('Error loading stored training stats:', error);
    }
  }, []);

  const getProgress = useCallback(() => {
    const milestones = Object.values(milestoneDefinitions);
    const totalPossiblePoints = milestones.reduce((sum, m) => sum + m.points, 0);
    const progressPercentage = Math.round((stats.totalPoints / totalPossiblePoints) * 100);
    
    return {
      level: Math.floor(stats.totalPoints / 100) + 1,
      progressPercentage,
      nextMilestone: milestones.find(m => !unlockedMilestones.has(m.type)),
      unlockedCount: unlockedMilestones.size,
      totalMilestones: milestones.length,
    };
  }, [stats.totalPoints, unlockedMilestones]);

  return {
    stats,
    pendingCelebration,
    unlockedMilestones: Array.from(unlockedMilestones),
    recordFeedback,
    clearPendingCelebration,
    loadStoredStats,
    getProgress,
  };
};