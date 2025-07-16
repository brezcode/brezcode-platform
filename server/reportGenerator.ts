import type { HealthReport, InsertHealthReport } from "@shared/schema";

// Risk factor definitions based on BC Assessment Quiz
interface RiskFactor {
  question: string;
  answer: string;
  relativeRisk: number;
  category: string;
  explanation: string;
}

// User profile definitions
export type UserProfile = 'teenager' | 'premenopausal' | 'postmenopausal' | 'current_patient' | 'survivor';

interface ProfileCharacteristics {
  ageRange: string;
  description: string;
  keyFocusAreas: string[];
  preventionPriorities: string[];
}

// Risk scoring system based on BC Assessment
const RISK_FACTORS: Record<string, RiskFactor[]> = {
  age: [
    { question: "age", answer: "under_20", relativeRisk: 0.1, category: "demographic", explanation: "Very low risk due to young age" },
    { question: "age", answer: "20-29", relativeRisk: 0.3, category: "demographic", explanation: "Low risk, early reproductive years" },
    { question: "age", answer: "30-39", relativeRisk: 1.0, category: "demographic", explanation: "Baseline risk reference" },
    { question: "age", answer: "40-49", relativeRisk: 1.5, category: "demographic", explanation: "Moderately increased risk" },
    { question: "age", answer: "50-59", relativeRisk: 3.0, category: "demographic", explanation: "Significantly increased risk" },
    { question: "age", answer: "60-69", relativeRisk: 4.5, category: "demographic", explanation: "High risk group" },
    { question: "age", answer: "70_plus", relativeRisk: 6.0, category: "demographic", explanation: "Highest risk group" },
  ],
  familyHistory: [
    { question: "family_history_breast", answer: "mother_sister", relativeRisk: 2.0, category: "genetic", explanation: "First-degree relative with breast cancer doubles risk" },
    { question: "family_history_breast", answer: "aunt_grandmother", relativeRisk: 1.5, category: "genetic", explanation: "Second-degree relative moderately increases risk" },
    { question: "family_history_ovarian", answer: "yes", relativeRisk: 1.7, category: "genetic", explanation: "Family history of ovarian cancer increases breast cancer risk" },
    { question: "brca_mutation", answer: "positive", relativeRisk: 10.0, category: "genetic", explanation: "BRCA mutation significantly increases lifetime risk" },
  ],
  reproductive: [
    { question: "age_first_period", answer: "under_12", relativeRisk: 1.3, category: "hormonal", explanation: "Early menarche increases lifetime estrogen exposure" },
    { question: "age_first_birth", answer: "never", relativeRisk: 1.4, category: "hormonal", explanation: "Nulliparity increases risk" },
    { question: "age_first_birth", answer: "after_30", relativeRisk: 1.2, category: "hormonal", explanation: "Late first pregnancy slightly increases risk" },
    { question: "breastfeeding", answer: "never", relativeRisk: 1.1, category: "hormonal", explanation: "Never breastfeeding slightly increases risk" },
    { question: "menopause_age", answer: "after_55", relativeRisk: 1.3, category: "hormonal", explanation: "Late menopause increases estrogen exposure" },
  ],
  lifestyle: [
    { question: "alcohol_consumption", answer: "daily", relativeRisk: 1.5, category: "lifestyle", explanation: "Daily alcohol consumption increases risk" },
    { question: "alcohol_consumption", answer: "weekly", relativeRisk: 1.2, category: "lifestyle", explanation: "Regular alcohol consumption moderately increases risk" },
    { question: "exercise_frequency", answer: "never", relativeRisk: 1.2, category: "lifestyle", explanation: "Sedentary lifestyle increases risk" },
    { question: "bmi", answer: "obese", relativeRisk: 1.3, category: "lifestyle", explanation: "Obesity increases risk, especially post-menopause" },
    { question: "smoking", answer: "current", relativeRisk: 1.2, category: "lifestyle", explanation: "Current smoking increases risk" },
  ],
  medical: [
    { question: "hormone_therapy", answer: "current", relativeRisk: 1.25, category: "medical", explanation: "Hormone replacement therapy increases risk" },
    { question: "birth_control", answer: "current", relativeRisk: 1.08, category: "medical", explanation: "Current oral contraceptive use slightly increases risk" },
    { question: "breast_density", answer: "dense", relativeRisk: 2.0, category: "medical", explanation: "Dense breast tissue significantly increases risk" },
    { question: "previous_biopsy", answer: "atypical", relativeRisk: 4.0, category: "medical", explanation: "Atypical hyperplasia substantially increases risk" },
  ]
};

// Profile characteristics based on life stages
const USER_PROFILES: Record<UserProfile, ProfileCharacteristics> = {
  teenager: {
    ageRange: "13-19",
    description: "Building healthy habits for lifelong breast health",
    keyFocusAreas: ["breast awareness", "healthy lifestyle", "education"],
    preventionPriorities: ["nutrition", "exercise", "stress management", "avoiding toxins"]
  },
  premenopausal: {
    ageRange: "20-49",
    description: "Active reproductive years with changing hormone levels",
    keyFocusAreas: ["regular screening", "lifestyle optimization", "family planning considerations"],
    preventionPriorities: ["maintain healthy weight", "limit alcohol", "regular exercise", "stress reduction"]
  },
  postmenopausal: {
    ageRange: "50+",
    description: "Post-menopause with increased baseline risk",
    keyFocusAreas: ["enhanced screening", "hormone balance", "bone health"],
    preventionPriorities: ["weight management", "calcium/vitamin D", "strength training", "heart health"]
  },
  current_patient: {
    ageRange: "Any",
    description: "Currently undergoing breast cancer treatment",
    keyFocusAreas: ["treatment support", "side effect management", "nutrition during treatment"],
    preventionPriorities: ["immune support", "energy management", "emotional wellness", "treatment compliance"]
  },
  survivor: {
    ageRange: "Any",
    description: "Breast cancer survivor focused on recurrence prevention",
    keyFocusAreas: ["surveillance", "recurrence prevention", "long-term health"],
    preventionPriorities: ["regular follow-ups", "anti-inflammatory diet", "stress management", "immune support"]
  }
};

export class BreastHealthReportGenerator {
  
  calculateRiskScore(quizAnswers: Record<string, any>): number {
    let totalRisk = 1.0; // Start with baseline risk
    
    // Apply multiplicative risk model
    Object.entries(RISK_FACTORS).forEach(([category, factors]) => {
      factors.forEach(factor => {
        const answer = quizAnswers[factor.question];
        if (answer === factor.answer) {
          totalRisk *= factor.relativeRisk;
        }
      });
    });
    
    // Convert to percentage and normalize
    return Math.min(totalRisk * 10, 100); // Cap at 100%
  }
  
  categorizeRisk(riskScore: number): 'low' | 'moderate' | 'high' {
    if (riskScore < 15) return 'low';
    if (riskScore < 30) return 'moderate';
    return 'high';
  }
  
  determineUserProfile(quizAnswers: Record<string, any>): UserProfile {
    const age = parseInt(quizAnswers.age || "30");
    const isMenstruating = quizAnswers.menstrual_status !== 'postmenopausal';
    const hasHistory = quizAnswers.personal_bc_history === 'yes';
    const currentPatient = quizAnswers.current_treatment === 'yes';
    
    if (currentPatient) return 'current_patient';
    if (hasHistory) return 'survivor';
    if (age < 20) return 'teenager';
    if (age >= 50 || !isMenstruating) return 'postmenopausal';
    return 'premenopausal';
  }
  
  identifyRiskFactors(quizAnswers: Record<string, any>): string[] {
    const identifiedFactors: string[] = [];
    
    Object.entries(RISK_FACTORS).forEach(([category, factors]) => {
      factors.forEach(factor => {
        const answer = quizAnswers[factor.question];
        if (answer === factor.answer && factor.relativeRisk > 1.0) {
          identifiedFactors.push(factor.explanation);
        }
      });
    });
    
    return identifiedFactors;
  }
  
  generateRecommendations(
    userProfile: UserProfile, 
    riskCategory: 'low' | 'moderate' | 'high',
    riskFactors: string[]
  ): string[] {
    const profile = USER_PROFILES[userProfile];
    const baseRecommendations: string[] = [];
    
    // Screening recommendations based on age and risk
    if (userProfile === 'teenager') {
      baseRecommendations.push(
        "Learn breast self-awareness through monthly self-exams",
        "Focus on building healthy lifestyle habits early",
        "Understand your family history and genetic risks"
      );
    } else if (userProfile === 'premenopausal') {
      if (riskCategory === 'high') {
        baseRecommendations.push(
          "Consider annual mammograms starting at age 40 or 10 years before youngest affected relative",
          "Discuss genetic counseling and testing with your doctor",
          "Consider MRI screening if BRCA positive or very high risk"
        );
      } else {
        baseRecommendations.push(
          "Begin annual mammograms at age 40-50 based on risk factors",
          "Continue monthly self-exams and annual clinical exams"
        );
      }
    } else if (userProfile === 'postmenopausal') {
      baseRecommendations.push(
        "Annual mammograms are essential",
        "Focus on maintaining healthy weight post-menopause",
        "Consider bone density screening alongside breast health"
      );
    }
    
    // Lifestyle recommendations based on risk factors
    if (riskFactors.some(f => f.includes('alcohol'))) {
      baseRecommendations.push("Limit alcohol consumption to reduce breast cancer risk");
    }
    
    if (riskFactors.some(f => f.includes('weight') || f.includes('exercise'))) {
      baseRecommendations.push(
        "Maintain healthy weight through balanced nutrition",
        "Engage in regular physical activity (150 minutes moderate exercise weekly)"
      );
    }
    
    if (riskFactors.some(f => f.includes('hormone'))) {
      baseRecommendations.push(
        "Discuss hormone therapy risks and benefits with your healthcare provider",
        "Consider natural hormone balance support through diet and lifestyle"
      );
    }
    
    // Universal recommendations
    baseRecommendations.push(
      "Eat a diet rich in fruits, vegetables, and omega-3 fatty acids",
      "Manage stress through meditation, yoga, or other relaxation techniques",
      "Maintain regular sleep schedule (7-9 hours nightly)",
      "Avoid environmental toxins when possible"
    );
    
    return baseRecommendations;
  }
  
  createDailyPlan(userProfile: UserProfile, riskCategory: 'low' | 'moderate' | 'high'): Record<string, any> {
    const profile = USER_PROFILES[userProfile];
    
    return {
      morning: {
        selfCare: "5-minute breast awareness check (weekly)",
        nutrition: "Green tea and antioxidant-rich breakfast",
        movement: "20 minutes of cardio or strength training"
      },
      afternoon: {
        nutrition: "Omega-3 rich lunch with leafy greens",
        hydration: "Aim for 8 glasses of water daily",
        movement: "Take walking breaks every 2 hours"
      },
      evening: {
        relaxation: "10 minutes meditation or deep breathing",
        nutrition: "Anti-inflammatory dinner with cruciferous vegetables",
        preparation: "Lay out exercise clothes for tomorrow"
      },
      weekly: {
        selfExam: userProfile === 'teenager' ? "Breast self-awareness practice" : "Breast self-examination",
        meal_prep: "Prepare healthy snacks and meals",
        exercise: "Mix cardio, strength training, and flexibility work"
      },
      monthly: profile.keyFocusAreas,
      supplements: riskCategory === 'high' ? 
        ["Vitamin D3", "Omega-3", "Folate", "Consider curcumin"] :
        ["Vitamin D3", "Omega-3", "Multivitamin"]
    };
  }
  
  generateComprehensiveReport(quizAnswers: Record<string, any>): InsertHealthReport {
    const riskScore = this.calculateRiskScore(quizAnswers);
    const riskCategory = this.categorizeRisk(riskScore);
    const userProfile = this.determineUserProfile(quizAnswers);
    const riskFactors = this.identifyRiskFactors(quizAnswers);
    const recommendations = this.generateRecommendations(userProfile, riskCategory, riskFactors);
    const dailyPlan = this.createDailyPlan(userProfile, riskCategory);
    
    const reportData = {
      summary: {
        riskScore: riskScore.toFixed(1),
        riskCategory,
        userProfile,
        profileDescription: USER_PROFILES[userProfile].description,
        totalRiskFactors: riskFactors.length
      },
      riskAnalysis: {
        identifiedFactors: riskFactors,
        protectiveFactors: this.identifyProtectiveFactors(quizAnswers),
        riskBreakdown: this.categorizeRiskFactors(riskFactors)
      },
      actionPlan: {
        immediate: recommendations.slice(0, 3),
        ongoing: recommendations.slice(3),
        followUp: this.generateFollowUpPlan(userProfile, riskCategory)
      }
    };
    
    return {
      quizAnswers,
      riskScore: riskScore.toString(),
      riskCategory,
      userProfile,
      riskFactors,
      recommendations,
      dailyPlan,
      reportData,
      userId: 0 // Will be set when saving
    };
  }
  
  private identifyProtectiveFactors(quizAnswers: Record<string, any>): string[] {
    const protective: string[] = [];
    
    if (quizAnswers.breastfeeding === 'yes') {
      protective.push("Breastfeeding history provides protective benefit");
    }
    
    if (quizAnswers.exercise_frequency === 'daily' || quizAnswers.exercise_frequency === 'most_days') {
      protective.push("Regular exercise significantly reduces risk");
    }
    
    if (quizAnswers.alcohol_consumption === 'never' || quizAnswers.alcohol_consumption === 'rarely') {
      protective.push("Low/no alcohol consumption is protective");
    }
    
    if (quizAnswers.diet_quality === 'excellent' || quizAnswers.diet_quality === 'good') {
      protective.push("Healthy diet rich in fruits and vegetables is protective");
    }
    
    return protective;
  }
  
  private categorizeRiskFactors(riskFactors: string[]): Record<string, string[]> {
    return {
      genetic: riskFactors.filter(f => f.includes('family') || f.includes('BRCA') || f.includes('mutation')),
      hormonal: riskFactors.filter(f => f.includes('estrogen') || f.includes('hormone') || f.includes('period')),
      lifestyle: riskFactors.filter(f => f.includes('alcohol') || f.includes('exercise') || f.includes('weight')),
      medical: riskFactors.filter(f => f.includes('therapy') || f.includes('density') || f.includes('biopsy'))
    };
  }
  
  private generateFollowUpPlan(userProfile: UserProfile, riskCategory: 'low' | 'moderate' | 'high'): Record<string, string> {
    const basePlan = {
      "1_month": "Review daily plan implementation and adjust as needed",
      "3_months": "Assess progress on lifestyle changes and health metrics",
      "6_months": "Complete follow-up health assessment"
    };
    
    if (riskCategory === 'high') {
      basePlan["2_weeks"] = "Schedule appointment with healthcare provider to discuss findings";
      basePlan["1_month"] = "Begin enhanced screening protocol if recommended";
    }
    
    if (userProfile === 'current_patient' || userProfile === 'survivor') {
      basePlan["1_month"] = "Review plan with oncology team";
      basePlan["3_months"] = "Coordinate with regular surveillance schedule";
    }
    
    return basePlan;
  }
}

export const reportGenerator = new BreastHealthReportGenerator();