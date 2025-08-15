import { storage } from './storage';
import { HealthMetrics, HealthDataSync } from '@shared/schema';

// Apple Health data types mapping
export interface AppleHealthData {
  heartRate?: {
    resting: number;
    max: number;
    variability: number;
  };
  activity?: {
    steps: number;
    distance: number; // km
    caloriesBurned: number;
    activeMinutes: number;
    exerciseMinutes: number;
    standHours: number;
  };
  sleep?: {
    duration: number; // hours
    quality: 'poor' | 'fair' | 'good' | 'excellent';
  };
  vitals?: {
    weight: number; // kg
    bodyFat: number; // percentage
    bloodPressure: {
      systolic: number;
      diastolic: number;
    };
  };
  wellness?: {
    stressLevel: 'low' | 'moderate' | 'high';
    recoveryScore: number; // 0-100
  };
  rawData?: any;
}

export class AppleHealthService {
  
  /**
   * Process and store Apple Health data
   */
  async processHealthData(userId: number, appleHealthData: AppleHealthData): Promise<HealthMetrics> {
    const healthMetrics = {
      userId,
      date: new Date(),
      // Heart Rate
      heartRateResting: appleHealthData.heartRate?.resting,
      heartRateMax: appleHealthData.heartRate?.max,
      heartRateVariability: appleHealthData.heartRate?.variability,
      // Activity
      steps: appleHealthData.activity?.steps,
      distanceWalking: appleHealthData.activity?.distance,
      caloriesBurned: appleHealthData.activity?.caloriesBurned,
      activeMinutes: appleHealthData.activity?.activeMinutes,
      exerciseMinutes: appleHealthData.activity?.exerciseMinutes,
      standHours: appleHealthData.activity?.standHours,
      // Sleep
      sleepDuration: appleHealthData.sleep?.duration,
      sleepQuality: appleHealthData.sleep?.quality,
      // Vitals
      weight: appleHealthData.vitals?.weight,
      bodyFat: appleHealthData.vitals?.bodyFat,
      bloodPressureSystolic: appleHealthData.vitals?.bloodPressure?.systolic,
      bloodPressureDiastolic: appleHealthData.vitals?.bloodPressure?.diastolic,
      // Wellness
      stressLevel: appleHealthData.wellness?.stressLevel,
      recoveryScore: appleHealthData.wellness?.recoveryScore,
      // Raw data for future analysis
      rawHealthData: appleHealthData.rawData || appleHealthData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return storage.createHealthMetrics(healthMetrics);
  }

  /**
   * Get health data trends for analysis
   */
  async getHealthTrends(userId: number, days: number = 30): Promise<HealthMetrics[]> {
    return storage.getHealthMetricsByUser(userId, days);
  }

  /**
   * Generate health insights based on Apple Watch data
   */
  generateHealthInsights(healthData: HealthMetrics): string[] {
    const insights: string[] = [];

    // Heart rate analysis
    if (healthData.heartRateResting) {
      if (healthData.heartRateResting < 60) {
        insights.push("Your resting heart rate indicates excellent cardiovascular fitness");
      } else if (healthData.heartRateResting > 80) {
        insights.push("Consider cardiovascular exercises to improve your resting heart rate");
      } else {
        insights.push("Your heart rate is within a healthy range");
      }
    }

    // Activity analysis
    if (healthData.steps) {
      if (healthData.steps >= 10000) {
        insights.push("Excellent! You're exceeding the recommended daily step goal");
      } else if (healthData.steps >= 7500) {
        insights.push("Good progress on your daily steps - aim for 10,000 for optimal health");
      } else {
        insights.push("Try to increase your daily movement - even short walks help");
      }
    }

    // Sleep analysis
    if (healthData.sleepDuration) {
      if (healthData.sleepDuration >= 7 && healthData.sleepDuration <= 9) {
        insights.push("Your sleep duration is optimal for recovery and health");
      } else if (healthData.sleepDuration < 7) {
        insights.push("Consider prioritizing sleep - aim for 7-9 hours for better health");
      } else {
        insights.push("You might be getting too much sleep - quality matters more than quantity");
      }
    }

    // Activity minutes analysis
    if (healthData.activeMinutes) {
      if (healthData.activeMinutes >= 150) {
        insights.push("You're meeting weekly activity guidelines - great for breast health");
      } else {
        insights.push("Try to reach 150 minutes of activity per week for optimal health benefits");
      }
    }

    return insights;
  }

  /**
   * Create personalized recommendations based on health data
   */
  generatePersonalizedRecommendations(healthData: HealthMetrics, healthGoals: string[]): string[] {
    const recommendations: string[] = [];

    // Breast cancer risk reduction recommendations
    if (healthGoals.includes('Reduce breast cancer risk')) {
      if (healthData.steps && healthData.steps < 8000) {
        recommendations.push("Increase daily walking to 8,000+ steps to reduce breast cancer risk by up to 10%");
      }
      
      if (healthData.exerciseMinutes && healthData.exerciseMinutes < 150) {
        recommendations.push("Aim for 150 minutes of moderate exercise weekly - studies show this reduces breast cancer risk");
      }

      if (healthData.weight && healthData.bodyFat && healthData.bodyFat > 30) {
        recommendations.push("Maintaining a healthy weight can reduce post-menopausal breast cancer risk");
      }
    }

    // Stress management recommendations
    if (healthGoals.includes('Better stress management')) {
      if (healthData.heartRateVariability && healthData.heartRateVariability < 30) {
        recommendations.push("Practice deep breathing exercises to improve heart rate variability and reduce stress");
      }

      if (healthData.sleepQuality === 'poor') {
        recommendations.push("Improve sleep hygiene - quality sleep is crucial for stress management and hormone balance");
      }

      if (healthData.stressLevel === 'high') {
        recommendations.push("Consider meditation or yoga - your Apple Watch shows elevated stress levels");
      }
    }

    // General health recommendations
    if (healthData.activeMinutes && healthData.activeMinutes < 30) {
      recommendations.push("Add short bursts of activity throughout the day - even 2-minute walks help");
    }

    return recommendations;
  }

  /**
   * Update sync settings for a user
   */
  async updateSyncSettings(userId: number, settings: Partial<HealthDataSync>): Promise<HealthDataSync> {
    return storage.updateHealthDataSync(userId, settings);
  }

  /**
   * Get user's health data sync settings
   */
  async getSyncSettings(userId: number): Promise<HealthDataSync | null> {
    return storage.getHealthDataSyncByUser(userId);
  }

  /**
   * Calculate health score based on multiple metrics
   */
  calculateHealthScore(healthData: HealthMetrics): number {
    let score = 0;
    let factors = 0;

    // Steps contribution (30%)
    if (healthData.steps) {
      score += Math.min(100, (healthData.steps / 10000) * 30);
      factors++;
    }

    // Sleep contribution (25%)
    if (healthData.sleepDuration) {
      const sleepScore = healthData.sleepDuration >= 7 && healthData.sleepDuration <= 9 ? 25 : 
                        Math.max(0, 25 - Math.abs(healthData.sleepDuration - 8) * 5);
      score += sleepScore;
      factors++;
    }

    // Heart rate contribution (20%)
    if (healthData.heartRateResting) {
      const hrScore = healthData.heartRateResting <= 70 ? 20 : 
                     Math.max(0, 20 - (healthData.heartRateResting - 70) * 0.5);
      score += hrScore;
      factors++;
    }

    // Active minutes contribution (25%)
    if (healthData.activeMinutes) {
      score += Math.min(25, (healthData.activeMinutes / 60) * 25);
      factors++;
    }

    return factors > 0 ? Math.round(score / factors * (factors / 4)) : 0;
  }
}

export const appleHealthService = new AppleHealthService();