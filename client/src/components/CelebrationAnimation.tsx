import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Award, Target, Brain } from 'lucide-react';

interface CelebrationAnimationProps {
  isVisible: boolean;
  milestone: {
    type: 'first_feedback' | 'helpful_trainer' | 'ai_improvement' | 'learning_streak' | 'expert_trainer' | 'master_trainer';
    title: string;
    description: string;
    points?: number;
  };
  onAnimationComplete: () => void;
}

const CelebrationAnimation: React.FC<CelebrationAnimationProps> = ({
  isVisible,
  milestone,
  onAnimationComplete
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
        onAnimationComplete();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onAnimationComplete]);

  const getBadgeIcon = () => {
    switch (milestone.type) {
      case 'first_feedback':
        return <Star className="w-8 h-8 text-yellow-400" />;
      case 'helpful_trainer':
        return <Trophy className="w-8 h-8 text-amber-500" />;
      case 'ai_improvement':
        return <Brain className="w-8 h-8 text-purple-500" />;
      case 'learning_streak':
        return <Zap className="w-8 h-8 text-blue-500" />;
      case 'expert_trainer':
        return <Award className="w-8 h-8 text-green-500" />;
      case 'master_trainer':
        return <Target className="w-8 h-8 text-red-500" />;
      default:
        return <Star className="w-8 h-8 text-yellow-400" />;
    }
  };

  const getBadgeColor = () => {
    switch (milestone.type) {
      case 'first_feedback':
        return 'from-yellow-400 to-yellow-600';
      case 'helpful_trainer':
        return 'from-amber-400 to-amber-600';
      case 'ai_improvement':
        return 'from-purple-400 to-purple-600';
      case 'learning_streak':
        return 'from-blue-400 to-blue-600';
      case 'expert_trainer':
        return 'from-green-400 to-green-600';
      case 'master_trainer':
        return 'from-red-400 to-red-600';
      default:
        return 'from-yellow-400 to-yellow-600';
    }
  };

  // Confetti particles
  const confettiColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
  const confettiParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    x: Math.random() * 100,
    rotation: Math.random() * 360,
  }));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        >
          {/* Confetti */}
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
              {confettiParticles.map((particle) => (
                <motion.div
                  key={particle.id}
                  initial={{
                    opacity: 0,
                    y: -20,
                    x: `${particle.x}vw`,
                    rotate: 0,
                    scale: 0,
                  }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: '100vh',
                    rotate: particle.rotation,
                    scale: [0, 1, 1, 0.5],
                  }}
                  transition={{
                    duration: particle.duration,
                    delay: particle.delay,
                    ease: 'easeOut',
                  }}
                  className="absolute w-3 h-3 rounded-sm"
                  style={{ backgroundColor: particle.color }}
                />
              ))}
            </div>
          )}

          {/* Achievement Modal */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
              className={`mx-auto w-20 h-20 rounded-full bg-gradient-to-br ${getBadgeColor()} flex items-center justify-center mb-4 shadow-lg`}
            >
              {getBadgeIcon()}
            </motion.div>

            {/* Achievement Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Achievement Unlocked!
              </h2>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {milestone.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {milestone.description}
              </p>
              
              {milestone.points && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: 'spring' }}
                  className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-semibold"
                >
                  <Star className="w-4 h-4 mr-2" />
                  +{milestone.points} Training Points
                </motion.div>
              )}
            </motion.div>

            {/* Sparkle Effects */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 2,
                    delay: 0.8 + i * 0.1,
                    repeat: 1,
                  }}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    left: `${20 + (i * 10)}%`,
                    top: `${15 + (i % 2) * 70}%`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CelebrationAnimation;