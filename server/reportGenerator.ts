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

// Risk scoring system with CORRECT RR values from Column D reference
const RISK_FACTORS: Record<string, RiskFactor[]> = {
  genetic: [
    { question: "family_history", answer: "Yes, I have first-degree relative with BC", relativeRisk: 2.0, category: "genetic", explanation: "First-degree family history: RR = 2.0" },
    { question: "family_history", answer: "Yes, I have second-degree relative with BC", relativeRisk: 1.5, category: "genetic", explanation: "Second-degree family history: RR = 1.5" },
    { question: "family_history", answer: "Yes, I have both first-degree relative and second-degree relative with BC", relativeRisk: 2.0, category: "genetic", explanation: "First-degree family history: RR = 2.0" },
    { question: "brca_test", answer: "BRCA1/2", relativeRisk: 1.7, category: "genetic", explanation: "BRCA1/2 mutation: RR = 1.7" },
    { question: "ethnicity", answer: "White (non-Hispanic)", relativeRisk: 1.64, category: "genetic", explanation: "White (non-Hispanic): RR = 1.64 vs Asian" },
    { question: "ethnicity", answer: "Black", relativeRisk: 2.25, category: "genetic", explanation: "Black: RR = 2.25 vs Asian" },
    { question: "ethnicity", answer: "American Indian", relativeRisk: 1.74, category: "genetic", explanation: "American Indian: RR = 1.74 vs Asian" },
    { question: "ethnicity", answer: "Hispanic/Latino", relativeRisk: 1.15, category: "genetic", explanation: "Hispanic/Latino: RR = 1.15 vs Asian" },
  ],
  hormonal: [
    { question: "menstrual_age", answer: "Before 12 years old", relativeRisk: 1.15, category: "hormonal", explanation: "Early menarche: RR = 1.15 (midpoint 1.1-1.2)" },
    { question: "pregnancy_age", answer: "Never had a full-term pregnancy", relativeRisk: 1.27, category: "hormonal", explanation: "Nulliparity: RR = 1.27" },
    { question: "pregnancy_age", answer: "Age 30 or older", relativeRisk: 1.3, category: "hormonal", explanation: "First pregnancy ≥30: RR = 1.3 (midpoint 1.2-1.4)" },
    { question: "pregnancy_age", answer: "Age 25-29", relativeRisk: 1.15, category: "hormonal", explanation: "First pregnancy 25-29: RR = 1.15 (midpoint 1.1-1.2)" },
    { question: "oral_contraceptives", answer: "Yes, currently using", relativeRisk: 1.24, category: "hormonal", explanation: "Current oral contraceptive: RR = 1.24" },
    { question: "oral_contraceptives", answer: "Yes, used in the past", relativeRisk: 1.07, category: "hormonal", explanation: "Past oral contraceptive: RR = 1.07" },
    { question: "menopause", answer: "Yes, at age 55 or later", relativeRisk: 1.75, category: "hormonal", explanation: "Late menopause: RR = 1.75 (midpoint 1.5-2.0)" },
    { question: "hrt", answer: "Yes", relativeRisk: 1.25, category: "hormonal", explanation: "HRT >5 years: RR = 1.25 (midpoint 1.2-1.3)" },
  ],
  lifestyle: [
    { question: "alcohol", answer: "2 or more drinks", relativeRisk: 1.175, category: "lifestyle", explanation: "2+ drinks daily: RR = 1.175 (midpoint 1.15-1.2)" },
    { question: "alcohol", answer: "1 drink", relativeRisk: 1.085, category: "lifestyle", explanation: "1 drink daily: RR = 1.085 (midpoint 1.07-1.1)" },
    { question: "smoke", answer: "Yes", relativeRisk: 1.125, category: "lifestyle", explanation: "Current smoking: RR = 1.125 (midpoint 1.1-1.15)" },
    { question: "western_diet", answer: "Yes, Western diet", relativeRisk: 1.33, category: "lifestyle", explanation: "Western diet: RR = 1.33" },
    { question: "night_shift", answer: "Yes", relativeRisk: 1.105, category: "lifestyle", explanation: "Night shift work: RR = 1.105 (midpoint 1.08-1.13)" },
  ],
  medical: [
    { question: "dense_breast", answer: "Yes", relativeRisk: 2.0, category: "medical", explanation: "Dense breast tissue: RR = 2.0" },
    { question: "benign_condition", answer: "Yes, Atypical Hyperplasia (ADH/ALH)", relativeRisk: 4.5, category: "medical", explanation: "Atypical hyperplasia: RR = 4.5 (midpoint 4.0-5.0)" },
    { question: "benign_condition", answer: "Yes, Lobular Carcinoma in Situ (LCIS)", relativeRisk: 2.75, category: "medical", explanation: "LCIS: RR = 2.75 (midpoint 2.5-3.0)" },
    { question: "benign_condition", answer: "Yes, Fibroadenoma or cysts", relativeRisk: 1.25, category: "medical", explanation: "Complex cysts: RR = 1.25 (midpoint 1.0-1.5)" },
    { question: "precancerous_condition", answer: "Yes, I am currently receiving treatment for breast cancer", relativeRisk: 4.5, category: "medical", explanation: "Current cancer treatment: RR = 4.5 (midpoint 4.0-5.0)" },
    { question: "precancerous_condition", answer: "Yes, I have been diagnosed with DCIS", relativeRisk: 4.5, category: "medical", explanation: "DCIS history: RR = 4.5 (midpoint 4.0-5.0)" },
  ],
  environmental: [
    { question: "stressful_events", answer: "Yes, striking life events", relativeRisk: 1.585, category: "environmental", explanation: "Striking life events: RR = 1.585 (midpoint 1.1-2.07)" },
    { question: "stressful_events", answer: "Yes, stressful life events", relativeRisk: 1.585, category: "environmental", explanation: "Stressful life events: RR = 1.585 (midpoint 1.1-2.07)" },
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
    let baselineRisk = 1.0;
    let riskMultiplier = 1.0;
    let riskPoints = 0;
    const appliedFactors: string[] = [];
    const calculationLog: string[] = [];
    
    // Age-based baseline risk
    const age = parseInt(quizAnswers.age || "30");
    if (age < 30) baselineRisk = 0.5;
    else if (age < 40) baselineRisk = 1.0;
    else if (age < 50) baselineRisk = 2.0;
    else if (age < 60) baselineRisk = 4.0;
    else if (age < 70) baselineRisk = 6.0;
    else baselineRisk = 8.0;
    
    calculationLog.push(`Age ${age}: Baseline risk = ${baselineRisk}`);
    
    // Apply risk factors using evidence-based scoring
    Object.entries(RISK_FACTORS).forEach(([category, factors]) => {
      factors.forEach(factor => {
        const answer = quizAnswers[factor.question];
        if (answer === factor.answer) {
          const oldMultiplier = riskMultiplier;
          riskMultiplier *= factor.relativeRisk;
          riskPoints += (factor.relativeRisk - 1.0) * 10; // Convert to points
          appliedFactors.push(factor.explanation);
          calculationLog.push(`${factor.question}: "${answer}" → Risk multiplier: ${oldMultiplier.toFixed(2)} × ${factor.relativeRisk} = ${riskMultiplier.toFixed(2)}`);
        }
      });
    });
    
    // Special handling for current cancer patients
    if (quizAnswers.precancerous_condition === "Yes, I am currently receiving treatment for breast cancer") {
      // For current patients, provide supportive score focused on treatment success
      const stage = quizAnswers.cancer_stage;
      calculationLog.push(`Current treatment detected: ${stage}`);
      calculationLog.push(`Treatment-focused scoring applied (not prevention-based)`);
      
      if (stage === "Stage 1") {
        calculationLog.push(`Stage 1: Risk score = 15 (excellent prognosis)`);
        return 15;
      }
      if (stage === "Stage 2") {
        calculationLog.push(`Stage 2: Risk score = 25 (good prognosis with treatment)`);
        return 25;
      }
      if (stage === "Stage 3") {
        calculationLog.push(`Stage 3: Risk score = 35 (moderate, treatment-focused)`);
        return 35;
      }
      if (stage === "Stage 4") {
        calculationLog.push(`Stage 4: Risk score = 45 (advanced, supportive care focus)`);
        return 45;
      }
      return 35; // Default for current patients
    }
    
    // BMI-based obesity adjustment (only for postmenopausal women)
    const bmi = parseFloat(quizAnswers.bmi || "25");
    const isPostmenopausal = quizAnswers.menopause === "Yes, at age 55 or older" || quizAnswers.menopause === "Yes, before age 55";
    
    if (bmi >= 30 && isPostmenopausal) {
      riskMultiplier *= 1.3;
      calculationLog.push(`BMI ${bmi} (obese) + postmenopausal: Risk multiplier × 1.3 = ${riskMultiplier.toFixed(2)}`);
    }
    
    // Calculate final risk score using proper epidemiological method
    let finalScore = baselineRisk * Math.sqrt(riskMultiplier);
    calculationLog.push(`Final calculation: ${baselineRisk} × √${riskMultiplier.toFixed(2)} = ${finalScore.toFixed(2)}`);
    
    // Cap and normalize score (0-100 scale)
    const cappedScore = Math.min(Math.max(finalScore, 1), 100);
    calculationLog.push(`Final score (capped 1-100): ${cappedScore.toFixed(1)}`);
    
    // Log the full calculation for debugging
    console.log('\n=== CORRECTED RISK SCORE CALCULATION ===');
    calculationLog.forEach(log => console.log(log));
    console.log('==========================================\n');
    
    return cappedScore;
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