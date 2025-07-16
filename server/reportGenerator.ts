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

// UNCHANGEABLE FACTORS (Q3,4,5,6,7,9,18) - excluding age and ethnicity
const UNCHANGEABLE_FACTORS: RiskFactor[] = [
  // Q3: Family History
  { question: "family_history", answer: "Yes, I have first-degree relative with BC", relativeRisk: 2.0, category: "genetic", explanation: "First-degree family history: RR = 2.0" },
  { question: "family_history", answer: "Yes, I have second-degree relative with BC", relativeRisk: 1.5, category: "genetic", explanation: "Second-degree family history: RR = 1.5" },
  { question: "family_history", answer: "Yes, I have both first-degree relative and second-degree relative with BC", relativeRisk: 2.0, category: "genetic", explanation: "First-degree family history: RR = 2.0" },
  // Q4: BRCA1/2
  { question: "brca_test", answer: "BRCA1/2", relativeRisk: 1.7, category: "genetic", explanation: "BRCA1/2 mutation: RR = 1.7" },
  // Q5: Dense Breast
  { question: "dense_breast", answer: "Yes", relativeRisk: 2.0, category: "medical", explanation: "Dense breast tissue: RR = 2.0" },
  // Q6: Menstrual Age
  { question: "menstrual_age", answer: "Before 12 years old", relativeRisk: 1.15, category: "hormonal", explanation: "Early menarche: RR = 1.15 (midpoint 1.1-1.2)" },
  // Q7: Pregnancy Age
  { question: "pregnancy_age", answer: "Never had a full-term pregnancy", relativeRisk: 1.27, category: "hormonal", explanation: "Nulliparity: RR = 1.27" },
  { question: "pregnancy_age", answer: "Age 30 or older", relativeRisk: 1.3, category: "hormonal", explanation: "First pregnancy ≥30: RR = 1.3 (midpoint 1.2-1.4)" },
  { question: "pregnancy_age", answer: "Age 25-29", relativeRisk: 1.15, category: "hormonal", explanation: "First pregnancy 25-29: RR = 1.15 (midpoint 1.1-1.2)" },
  // Q9: Menopause
  { question: "menopause", answer: "Yes, at age 55 or later", relativeRisk: 1.75, category: "hormonal", explanation: "Late menopause: RR = 1.75 (midpoint 1.5-2.0)" },
  // Q18: Benign Conditions (medical diagnoses)
  { question: "benign_condition", answer: "Yes, Atypical Hyperplasia (ADH/ALH)", relativeRisk: 4.5, category: "medical", explanation: "Atypical hyperplasia: RR = 4.5 (midpoint 4.0-5.0)" },
];

// CHANGEABLE FACTORS - processed second
const CHANGEABLE_FACTORS: RiskFactor[] = [
  // Q8: Oral Contraceptives
  { question: "oral_contraceptives", answer: "Yes, currently using", relativeRisk: 1.24, category: "hormonal", explanation: "Current oral contraceptive: RR = 1.24" },
  { question: "oral_contraceptives", answer: "Yes, used in the past", relativeRisk: 1.07, category: "hormonal", explanation: "Past oral contraceptive: RR = 1.07" },
  // Q10: Weight/BMI - handled separately with obesity logic
  // Q12: HRT
  { question: "hrt", answer: "Yes", relativeRisk: 1.25, category: "hormonal", explanation: "HRT >5 years: RR = 1.25 (midpoint 1.2-1.3)" },
  // Q13: Western Diet
  { question: "western_diet", answer: "Yes, Western diet", relativeRisk: 1.33, category: "lifestyle", explanation: "Western diet: RR = 1.33" },
  // Q14: Smoking
  { question: "smoke", answer: "Yes", relativeRisk: 1.125, category: "lifestyle", explanation: "Current smoking: RR = 1.125 (midpoint 1.1-1.15)" },
  // Q15: Alcohol
  { question: "alcohol", answer: "2 or more drinks", relativeRisk: 1.175, category: "lifestyle", explanation: "2+ drinks daily: RR = 1.175 (midpoint 1.15-1.2)" },
  { question: "alcohol", answer: "1 drink", relativeRisk: 1.085, category: "lifestyle", explanation: "1 drink daily: RR = 1.085 (midpoint 1.07-1.1)" },
  // Q16: Night Shift
  { question: "night_shift", answer: "Yes", relativeRisk: 1.105, category: "lifestyle", explanation: "Night shift work: RR = 1.105 (midpoint 1.08-1.13)" },
  // Q17: Stressful Events (moved from unchangeable)
  { question: "stressful_events", answer: "Yes, striking life events", relativeRisk: 1.585, category: "lifestyle", explanation: "Striking life events: RR = 1.585 (midpoint 1.1-2.07)" },
  { question: "stressful_events", answer: "Yes, stressful life events", relativeRisk: 1.585, category: "lifestyle", explanation: "Stressful life events: RR = 1.585 (midpoint 1.1-2.07)" },
  // Q18: Other Benign Conditions (atypical hyperplasia moved to unchangeable)
  { question: "benign_condition", answer: "Yes, Lobular Carcinoma in Situ (LCIS)", relativeRisk: 2.75, category: "medical", explanation: "LCIS: RR = 2.75 (midpoint 2.5-3.0)" },
  { question: "benign_condition", answer: "Yes, Fibroadenoma or cysts", relativeRisk: 1.25, category: "medical", explanation: "Complex cysts: RR = 1.25 (midpoint 1.0-1.5)" },
  // Q19: Cancer History
  { question: "precancerous_condition", answer: "Yes, I am currently receiving treatment for breast cancer", relativeRisk: 4.5, category: "medical", explanation: "Current cancer treatment: RR = 4.5 (midpoint 4.0-5.0)" },
  { question: "precancerous_condition", answer: "Yes, I have been diagnosed with DCIS", relativeRisk: 4.5, category: "medical", explanation: "DCIS history: RR = 4.5 (midpoint 4.0-5.0)" },
];

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
  
  calculateRiskScore(quizAnswers: Record<string, any>): { unchangeableScore: number, changeableScore: number, totalScore: number } {
    const calculationLog: string[] = [];
    
    // Special handling for current cancer patients first
    if (quizAnswers.precancerous_condition === "Yes, I am currently receiving treatment for breast cancer") {
      const stage = quizAnswers.cancer_stage;
      calculationLog.push(`Current treatment detected: ${stage}`);
      calculationLog.push(`Treatment-focused scoring applied (not prevention-based)`);
      
      let treatmentScore = 35;
      if (stage === "Stage 1") treatmentScore = 15;
      else if (stage === "Stage 2") treatmentScore = 25;
      else if (stage === "Stage 3") treatmentScore = 35;
      else if (stage === "Stage 4") treatmentScore = 45;
      
      calculationLog.push(`${stage}: Risk score = ${treatmentScore} (treatment-focused)`);
      console.log('\n=== TREATMENT PATIENT SCORING ===');
      calculationLog.forEach(log => console.log(log));
      console.log('==========================================\n');
      
      return { unchangeableScore: treatmentScore, changeableScore: 0, totalScore: treatmentScore };
    }

    // STEP 1: Calculate UNCHANGEABLE risk score (excluding age and ethnicity)
    let unchangeableMultiplier = 1.0;
    
    calculationLog.push(`=== UNCHANGEABLE RISK FACTORS ===`);
    calculationLog.push(`Starting baseline: 1.0 (age and ethnicity excluded)`);
    
    // Apply UNCHANGEABLE factors (family history, BRCA, dense breasts, etc.)
    UNCHANGEABLE_FACTORS.forEach(factor => {
      const answer = quizAnswers[factor.question];
      if (answer === factor.answer) {
        const oldMultiplier = unchangeableMultiplier;
        unchangeableMultiplier *= factor.relativeRisk;
        calculationLog.push(`${factor.question}: "${answer}" → ${oldMultiplier.toFixed(2)} × ${factor.relativeRisk} = ${unchangeableMultiplier.toFixed(2)}`);
      }
    });

    // Calculate unchangeable score using epidemiological method
    const unchangeableFinalScore = Math.sqrt(unchangeableMultiplier);
    calculationLog.push(`Unchangeable final: √${unchangeableMultiplier.toFixed(2)} = ${unchangeableFinalScore.toFixed(2)}`);
    
    // STEP 2: Calculate CHANGEABLE risk score independently (starting from baseline 1)
    let changeableMultiplier = 1.0; // Independent calculation starting from baseline
    
    calculationLog.push(`\n=== CHANGEABLE RISK FACTORS ===`);
    calculationLog.push(`Starting from baseline: 1.0 (independent calculation)`);
    
    // Apply CHANGEABLE factors
    CHANGEABLE_FACTORS.forEach(factor => {
      const answer = quizAnswers[factor.question];
      if (answer === factor.answer) {
        const oldMultiplier = changeableMultiplier;
        changeableMultiplier *= factor.relativeRisk;
        calculationLog.push(`${factor.question}: "${answer}" → ${oldMultiplier.toFixed(2)} × ${factor.relativeRisk} = ${changeableMultiplier.toFixed(2)}`);
      }
    });

    // BMI-based obesity adjustment (only for postmenopausal women)
    const bmi = parseFloat(quizAnswers.bmi || "25");
    const isPostmenopausal = quizAnswers.menopause === "Yes, at age 55 or older" || quizAnswers.menopause === "Yes, before age 55";
    
    if (bmi >= 30 && isPostmenopausal) {
      const oldMultiplier = changeableMultiplier;
      changeableMultiplier *= 1.3;
      calculationLog.push(`BMI ${bmi} (obese) + postmenopausal: ${oldMultiplier.toFixed(2)} × 1.3 = ${changeableMultiplier.toFixed(2)}`);
    }

    // Calculate final scores
    const changeableFinalScore = Math.sqrt(changeableMultiplier);
    calculationLog.push(`Changeable final: √${changeableMultiplier.toFixed(2)} = ${changeableFinalScore.toFixed(2)}`);
    
    // Normalize scores to 1-100 scale
    const normalizeScore = (score: number): number => {
      if (score <= 2) {
        return Math.max(score * 12.5, 1); // 1-25 range for low risk
      } else if (score <= 10) {
        return 25 + ((score - 2) / 8) * 25; // 26-50 range for moderate risk  
      } else {
        return Math.min(50 + ((score - 10) / 40) * 50, 100); // 51-100 range for high risk
      }
    };

    const unchangeableScore = normalizeScore(unchangeableFinalScore);
    const changeableScore = normalizeScore(changeableFinalScore);
    const totalScore = Math.sqrt(unchangeableMultiplier * changeableMultiplier); // Combined effect for total
    const totalScoreNormalized = normalizeScore(totalScore);
    
    calculationLog.push(`\n=== FINAL SCORES ===`);
    calculationLog.push(`Unchangeable score: ${unchangeableFinalScore.toFixed(2)} → ${unchangeableScore.toFixed(1)}/100`);
    calculationLog.push(`Changeable score: ${changeableFinalScore.toFixed(2)} → ${changeableScore.toFixed(1)}/100`);
    calculationLog.push(`Total combined score: ${totalScore.toFixed(2)} → ${totalScoreNormalized.toFixed(1)}/100`);
    
    // Log the full calculation for debugging
    console.log('\n=== INDEPENDENT RISK SCORE CALCULATION ===');
    calculationLog.forEach(log => console.log(log));
    console.log('==========================================\n');
    
    return {
      unchangeableScore: Math.round(unchangeableScore * 10) / 10,
      changeableScore: Math.round(changeableScore * 10) / 10,
      totalScore: Math.round(totalScoreNormalized * 10) / 10
    };
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
    
    // Check UNCHANGEABLE_FACTORS
    UNCHANGEABLE_FACTORS.forEach(factor => {
      const answer = quizAnswers[factor.question];
      if (answer === factor.answer && factor.relativeRisk > 1.0) {
        identifiedFactors.push(factor.explanation);
      }
    });
    
    // Check CHANGEABLE_FACTORS
    CHANGEABLE_FACTORS.forEach(factor => {
      const answer = quizAnswers[factor.question];
      if (answer === factor.answer && factor.relativeRisk > 1.0) {
        identifiedFactors.push(factor.explanation);
      }
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
    const riskScores = this.calculateRiskScore(quizAnswers);
    const riskCategory = this.categorizeRisk(riskScores.totalScore);
    const userProfile = this.determineUserProfile(quizAnswers);
    const riskFactors = this.identifyRiskFactors(quizAnswers);
    const recommendations = this.generateRecommendations(userProfile, riskCategory, riskFactors);
    const dailyPlan = this.createDailyPlan(userProfile, riskCategory);
    
    const reportData = {
      summary: {
        riskScore: riskScores.totalScore.toFixed(1),
        unchangeableScore: riskScores.unchangeableScore.toFixed(1),
        changeableScore: riskScores.changeableScore.toFixed(1),
        riskCategory,
        userProfile,
        profileDescription: USER_PROFILES[userProfile].description,
        totalRiskFactors: riskFactors.length
      },
      riskAnalysis: {
        identifiedFactors: riskFactors,
        protectiveFactors: this.identifyProtectiveFactors(quizAnswers),
        riskBreakdown: this.categorizeRiskFactors(riskFactors),
        riskSeparation: {
          unchangeableFactors: riskFactors.filter(f => this.isUnchangeableFactor(f)),
          changeableFactors: riskFactors.filter(f => !this.isUnchangeableFactor(f))
        }
      },
      actionPlan: {
        immediate: recommendations.slice(0, 3),
        ongoing: recommendations.slice(3),
        followUp: this.generateFollowUpPlan(userProfile, riskCategory)
      }
    };
    
    return {
      quizAnswers,
      riskScore: riskScores.totalScore.toString(),
      riskCategory,
      userProfile,
      riskFactors,
      recommendations,
      dailyPlan,
      reportData,
      userId: 0 // Will be set when saving
    };
  }
  
  private isUnchangeableFactor(factorExplanation: string): boolean {
    // Check if this factor is from the unchangeable list
    return UNCHANGEABLE_FACTORS.some(factor => factor.explanation === factorExplanation);
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