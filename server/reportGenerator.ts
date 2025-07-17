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

// SECTION 1: DEMOGRAPHIC FACTORS
const SECTION1_FACTORS: RiskFactor[] = [
  // Q1: Age (now included per CSV)
  { question: "age", answer: "50-59", relativeRisk: 1.14, category: "demographic", explanation: "Age 50-59: RR = 1.14" },
  { question: "age", answer: "60-69", relativeRisk: 1.67, category: "demographic", explanation: "Age 60-69: RR = 1.67" },
  { question: "age", answer: "70+", relativeRisk: 3.33, category: "demographic", explanation: "Age 70+: RR = 3.33" },
  // Q3: Ethnicity (now included per CSV)
  { question: "ethnicity", answer: "White (non-Hispanic)", relativeRisk: 1.64, category: "demographic", explanation: "White (non-Hispanic): RR = 1.64 vs Asian" },
  { question: "ethnicity", answer: "Black", relativeRisk: 2.25, category: "demographic", explanation: "Black: RR = 2.25 vs Asian" },
  { question: "ethnicity", answer: "American Indian", relativeRisk: 1.74, category: "demographic", explanation: "American Indian: RR = 1.74 vs Asian" },
  { question: "ethnicity", answer: "Hispanic/Latino", relativeRisk: 1.15, category: "demographic", explanation: "Hispanic/Latino: RR = 1.15 vs Asian" },
];

// SECTION 2: FAMILY HISTORY AND GENETICS
const SECTION2_FACTORS: RiskFactor[] = [
  // Q4: Family History
  { question: "family_history", answer: "Yes, I have first-degree relative with BC", relativeRisk: 2.0, category: "genetic", explanation: "First-degree family history: RR = 2.0" },
  { question: "family_history", answer: "Yes, I have second-degree relative with BC", relativeRisk: 1.5, category: "genetic", explanation: "Second-degree family history: RR = 1.5" },
  { question: "family_history", answer: "Yes, I have both first-degree relative and second-degree relative with BC", relativeRisk: 2.0, category: "genetic", explanation: "First-degree family history: RR = 2.0" },
  // Q5: BRCA Testing
  { question: "brca_test", answer: "BRCA1/2", relativeRisk: 1.7, category: "genetic", explanation: "BRCA1/2 mutation: RR = 1.7" },
];

// SECTION 3: REPRODUCTIVE AND HORMONAL FACTORS
const SECTION3_FACTORS: RiskFactor[] = [
  // Q6: Menstrual Age
  { question: "menstrual_age", answer: "Before 12 years old", relativeRisk: 1.15, category: "hormonal", explanation: "Early menarche: RR = 1.15" },
  // Q7: Pregnancy Age
  { question: "pregnancy_age", answer: "Never had a full-term pregnancy", relativeRisk: 1.27, category: "hormonal", explanation: "Nulliparity: RR = 1.27" },
  { question: "pregnancy_age", answer: "Age 30 or older", relativeRisk: 1.3, category: "hormonal", explanation: "First pregnancy ≥30: RR = 1.3" },
  { question: "pregnancy_age", answer: "Age 25-29", relativeRisk: 1.15, category: "hormonal", explanation: "First pregnancy 25-29: RR = 1.15" },
  // Q8: Oral Contraceptives
  { question: "oral_contraceptives", answer: "Yes, currently using", relativeRisk: 1.24, category: "hormonal", explanation: "Current oral contraceptive: RR = 1.24" },
  { question: "oral_contraceptives", answer: "Yes, used in the past", relativeRisk: 1.07, category: "hormonal", explanation: "Past oral contraceptive: RR = 1.07" },
  // Q9: Menopause
  { question: "menopause", answer: "Yes, at age 55 or older", relativeRisk: 1.75, category: "hormonal", explanation: "Late menopause: RR = 1.75" },
  // Q12: HRT
  { question: "hrt", answer: "Yes", relativeRisk: 1.25, category: "hormonal", explanation: "HRT >5 years: RR = 1.25" },
];

// SECTION 4: SYMPTOM RISK FACTORS (these don't contribute to RR calculation but affect recommendations)
const SECTION4_FACTORS: RiskFactor[] = [
  // Symptoms are for screening recommendations, not risk calculation
];

// SECTION 5: SCREENING AND PRECANCEROUS RISK FACTORS
const SECTION5_FACTORS: RiskFactor[] = [
  // Q18: Dense Breast
  { question: "dense_breast", answer: "Yes", relativeRisk: 2.0, category: "medical", explanation: "Dense breast tissue: RR = 2.0" },
  // Q19: Benign/Precancerous Conditions
  { question: "benign_condition", answer: "Yes, Atypical Hyperplasia (ADH/ALH)", relativeRisk: 4.5, category: "medical", explanation: "Atypical hyperplasia: RR = 4.5" },
  { question: "benign_condition", answer: "Yes, LCIS", relativeRisk: 2.75, category: "medical", explanation: "LCIS: RR = 2.75" },
  { question: "benign_condition", answer: "Yes, complex/complicated cysts", relativeRisk: 1.25, category: "medical", explanation: "Complex cysts: RR = 1.25" },
  // Q20: Cancer History
  { question: "cancer_history", answer: "Yes, I am a Breast Cancer Patient currently undergoing treatment", relativeRisk: 4.5, category: "medical", explanation: "Current cancer treatment: RR = 4.5" },
  { question: "cancer_history", answer: "Yes, I am a Breast Cancer Survivor taking medication to lower the risk of recurrence", relativeRisk: 4.5, category: "medical", explanation: "Cancer survivor: RR = 4.5" },
];

// SECTION 6: LIFESTYLE AND ENVIRONMENTAL FACTORS
const SECTION6_FACTORS: RiskFactor[] = [
  // Q22: Western Diet
  { question: "western_diet", answer: "Yes, Western diet", relativeRisk: 1.33, category: "lifestyle", explanation: "Western diet: RR = 1.33" },
  // Q23: Smoking
  { question: "smoke", answer: "Yes", relativeRisk: 1.125, category: "lifestyle", explanation: "Current smoking: RR = 1.125" },
  // Q24: Alcohol
  { question: "alcohol", answer: "2 or more drinks", relativeRisk: 1.175, category: "lifestyle", explanation: "2+ drinks daily: RR = 1.175" },
  { question: "alcohol", answer: "1 drink", relativeRisk: 1.085, category: "lifestyle", explanation: "1 drink daily: RR = 1.085" },
  // Q25: Night Shift
  { question: "night_shift", answer: "Yes", relativeRisk: 1.105, category: "lifestyle", explanation: "Night shift work: RR = 1.105" },
  // Q26: Stressful Events
  { question: "stressful_events", answer: "Yes, striking life events", relativeRisk: 1.585, category: "lifestyle", explanation: "Striking life events: RR = 1.585" },
  { question: "stressful_events", answer: "Yes, stressful life events", relativeRisk: 1.585, category: "lifestyle", explanation: "Stressful life events: RR = 1.585" },
  // Q27: Chronic Stress
  { question: "chronic_stress", answer: "Yes, chronic high stress", relativeRisk: 1.15, category: "lifestyle", explanation: "Chronic high stress: RR = 1.15" },
  { question: "chronic_stress", answer: "Yes, occasional moderate stress", relativeRisk: 1.05, category: "lifestyle", explanation: "Moderate stress: RR = 1.05" },
  // Q28: Sugar
  { question: "sugar_diet", answer: "Yes, high sugar diet", relativeRisk: 1.15, category: "lifestyle", explanation: "High sugar diet: RR = 1.15" },
  { question: "sugar_diet", answer: "Yes, moderate sugar diet", relativeRisk: 1.05, category: "lifestyle", explanation: "Moderate sugar diet: RR = 1.05" },
  // Q29: Exercise (protective factor)
  { question: "exercise", answer: "No, little or no regular exercise", relativeRisk: 1.2, category: "lifestyle", explanation: "Sedentary lifestyle: RR = 1.2" },
  { question: "exercise", answer: "Yes, occasional light exercise", relativeRisk: 1.1, category: "lifestyle", explanation: "Light exercise: RR = 1.1" },
];

// Combined sections for analysis
const ALL_SECTIONS = [SECTION1_FACTORS, SECTION2_FACTORS, SECTION3_FACTORS, SECTION4_FACTORS, SECTION5_FACTORS, SECTION6_FACTORS];
const SECTION_NAMES = ['Demographic', 'Genetic', 'Hormonal', 'Symptom', 'Screening', 'Lifestyle'];

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
  
  calculateSectionHealthScores(quizAnswers: Record<string, any>): { 
    sectionScores: { [key: string]: { score: number, factors: string[] } },
    totalScore: number,
    uncontrollableScore: number,
    overallHealthCategory: string
  } {
    const calculationLog: string[] = [];
    const sectionScores: { [key: string]: { score: number, factors: string[] } } = {};
    
    // Special handling for current cancer patients
    if (quizAnswers.cancer_history === "Yes, I am a Breast Cancer Patient currently undergoing treatment" ||
        quizAnswers.cancer_history === "Yes, I am a Breast Cancer Survivor taking medication to lower the risk of recurrence") {
      const stage = quizAnswers.cancer_stage || "Unknown";
      let treatmentScore = 35;
      if (stage === "Stage 1") treatmentScore = 15;
      else if (stage === "Stage 2") treatmentScore = 25;
      else if (stage === "Stage 3") treatmentScore = 35;
      else if (stage === "Stage 4") treatmentScore = 45;
      
      return {
        sectionScores: {
          'Treatment-focused': { score: treatmentScore, factors: [`${stage} breast cancer`] }
        },
        totalScore: treatmentScore,
        uncontrollableScore: treatmentScore,
        overallHealthCategory: this.categorizeHealth(treatmentScore)
      };
    }

    let totalMultiplier = 1.0;
    
    // Calculate scores for each section
    ALL_SECTIONS.forEach((sectionFactors, index) => {
      const sectionName = SECTION_NAMES[index];
      let sectionMultiplier = 1.0;
      const appliedFactors: string[] = [];
      
      calculationLog.push(`\n=== SECTION ${index + 1}: ${sectionName.toUpperCase()} ===`);
      calculationLog.push(`Starting baseline: 1.0`);
      
      // Apply factors from this section
      sectionFactors.forEach(factor => {
        const answer = quizAnswers[factor.question];
        if (answer === factor.answer) {
          const oldMultiplier = sectionMultiplier;
          sectionMultiplier *= factor.relativeRisk;
          appliedFactors.push(factor.explanation);
          calculationLog.push(`${factor.question}: "${answer}" → ${oldMultiplier.toFixed(2)} × ${factor.relativeRisk} = ${sectionMultiplier.toFixed(2)}`);
        }
      });
      
      // Special handling for BMI in Section 3 (Hormonal)
      if (sectionName === 'Hormonal') {
        const bmi = parseFloat(quizAnswers.bmi || "25");
        const isPostmenopausal = quizAnswers.menopause === "Yes, at age 55 or older" || quizAnswers.menopause === "Yes, before age 55";
        
        if (bmi >= 30 && isPostmenopausal) {
          const oldMultiplier = sectionMultiplier;
          sectionMultiplier *= 1.3;
          appliedFactors.push(`BMI ${bmi} (obese) + postmenopausal: RR = 1.3`);
          calculationLog.push(`BMI ${bmi} (obese) + postmenopausal: ${oldMultiplier.toFixed(2)} × 1.3 = ${sectionMultiplier.toFixed(2)}`);
        }
      }
      
      // Calculate section health score directly (higher = healthier)
      const sectionFinalScore = Math.sqrt(sectionMultiplier);
      const normalizedHealthScore = this.convertToHealthScore(sectionFinalScore);
      
      sectionScores[sectionName] = {
        score: Math.round(normalizedHealthScore * 10) / 10,
        factors: appliedFactors
      };
      
      calculationLog.push(`Section ${index + 1} final: √${sectionMultiplier.toFixed(2)} = ${sectionFinalScore.toFixed(2)} → ${normalizedHealthScore.toFixed(1)}/100 health score`);
      
      // Contribute to total score
      totalMultiplier *= sectionMultiplier;
    });
    
    // Calculate uncontrollable health score (Demographic + Genetic + Hormonal + Screening)
    const uncontrollableMultiplier = (sectionScores['Demographic']?.score ? (100 / sectionScores['Demographic'].score) : 1.0) *
                                     (sectionScores['Genetic']?.score ? (100 / sectionScores['Genetic'].score) : 1.0) *
                                     (sectionScores['Hormonal']?.score ? (100 / sectionScores['Hormonal'].score) : 1.0) *
                                     (sectionScores['Screening']?.score ? (100 / sectionScores['Screening'].score) : 1.0);
    const uncontrollableFinalScore = Math.sqrt(uncontrollableMultiplier);
    const uncontrollableHealthScore = this.convertToHealthScore(uncontrollableFinalScore);

    // Calculate controllable health score (Symptom + Lifestyle sections)
    const controllableMultiplier = (sectionScores['Symptom']?.score ? (100 / sectionScores['Symptom'].score) : 1.0) * 
                                   (sectionScores['Lifestyle']?.score ? (100 / sectionScores['Lifestyle'].score) : 1.0);
    const controllableFinalScore = Math.sqrt(controllableMultiplier);
    const controllableHealthScore = this.convertToHealthScore(controllableFinalScore);
    
    calculationLog.push(`\n=== UNCONTROLLABLE HEALTH SCORE (Demographic + Genetic + Hormonal + Screening) ===`);
    calculationLog.push(`Uncontrollable multiplier: ${uncontrollableMultiplier.toFixed(2)}`);
    calculationLog.push(`Uncontrollable final score: √${uncontrollableMultiplier.toFixed(2)} = ${uncontrollableFinalScore.toFixed(2)} → ${uncontrollableHealthScore.toFixed(1)}/100 health score`);
    
    calculationLog.push(`\n=== CONTROLLABLE HEALTH SCORE (Symptom + Lifestyle Only) ===`);
    calculationLog.push(`Controllable multiplier: ${controllableMultiplier.toFixed(2)}`);
    calculationLog.push(`Controllable final score: √${controllableMultiplier.toFixed(2)} = ${controllableFinalScore.toFixed(2)} → ${controllableHealthScore.toFixed(1)}/100 health score`);
    
    // Log the full calculation for debugging
    console.log('\n=== 6-SECTION HEALTH SCORE CALCULATION ===');
    console.log('Health Score: Higher = Healthier | 100 = Perfect Health | Lower = More Risk Factors Present');
    calculationLog.forEach(log => console.log(log.replace('RISK SCORE', 'HEALTH SCORE')));
    console.log(`Uncontrollable Health Score: ${Math.round(uncontrollableHealthScore * 10) / 10}/100 (Higher = Healthier)`);
    console.log(`Controllable Health Score: ${Math.round(controllableHealthScore * 10) / 10}/100 (Higher = Healthier)`);
    console.log('==========================================\n');
    
    return {
      sectionScores: sectionScores,
      totalScore: Math.round(controllableHealthScore * 10) / 10,
      uncontrollableScore: Math.round(uncontrollableHealthScore * 10) / 10,
      overallHealthCategory: this.categorizeHealth(controllableHealthScore)
    };
  }

  private convertToHealthScore(riskMultiplierSqrt: number): number {
    // Convert risk multiplier square root to health score
    // Risk Multiplier 1.0 (no risk factors) → sqrt = 1.0 → Health Score = 100
    // Risk Multiplier 4.0 (high risk) → sqrt = 2.0 → Health Score = 50
    // Risk Multiplier 16.0 (very high risk) → sqrt = 4.0 → Health Score = 25
    
    // Simple inverse relationship: Health Score = 100 / riskMultiplierSqrt
    const healthScore = Math.min(100, Math.max(5, 100 / riskMultiplierSqrt));
    return healthScore;
  }

  categorizeHealth(healthScore: number): string {
    if (healthScore >= 80) return 'excellent';
    if (healthScore >= 65) return 'good';
    if (healthScore >= 50) return 'fair';
    return 'needs_attention';
  }

  categorizeRisk(healthScore: number): string {
    // For health scores: lower scores = higher risk
    if (healthScore >= 80) return 'low';       // 80-100: low risk (excellent health)
    if (healthScore >= 65) return 'moderate';  // 65-79: moderate risk (good health)  
    if (healthScore >= 50) return 'high';      // 50-64: high risk (fair health)
    return 'very_high';                        // <50: very high risk (needs attention)
  }

  generateSectionSummary(sectionName: string, sectionData: { score: number, factors: string[] }, quizAnswers: Record<string, any>): string {
    const age = parseInt(quizAnswers.age || "30");
    const country = quizAnswers.country || "United States";
    const hasFactors = sectionData.factors.length > 0;
    
    switch (sectionName) {
      case 'Demographic':
        const ethnicity = quizAnswers.ethnicity || 'not specified';
        const isPostmenopausal = quizAnswers.menopause?.includes('Yes');
        
        return `As a ${age}-year-old ${ethnicity} woman living in ${country}, you are in an age group where breast cancer incidence increases significantly. ${ethnicity.includes('White') ? 'White women have higher breast cancer risk compared to Asian women, with higher overall incidence rates.' : ''} 

At ${age}, regular annual mammograms and clinical breast exams are essential for early detection. ${isPostmenopausal ? 'As you are postmenopausal, we recommend maintaining your body weight below BMI 30, as excess weight after menopause increases estrogen production and breast cancer risk.' : ''} Continue with consistent screening schedules and stay informed about any family history changes that might affect your risk profile.

While demographic factors like age and ethnicity cannot be changed, maintaining a healthy lifestyle becomes increasingly important as we age. Focus on regular exercise, balanced nutrition, and stress management to support your overall health and potentially reduce risk factors within your control.`;
        
      case 'Genetic':
        if (!hasFactors) {
          return `Great news about your family history! Your health score here is ${sectionData.score}/100, which means you don't have major genetic risk factors. This is really encouraging - about 85% of women who get breast cancer don't have a family history of it either.

Even though your genes look good, it's still important to take care of yourself. Keep living a healthy lifestyle with regular exercise, limit alcohol, and maintain a healthy weight. These habits are powerful tools for preventing many types of cancer.

It's worth keeping track of your family's health history and updating it as you learn new information. If anything changes in your family (like a relative being diagnosed), let your doctor know. You might want to talk to a genetic counselor if you ever have questions about your family history. For now though, you can feel confident that your genetics are working in your favor!`
        } else {
          const hasBRCA = quizAnswers.brca_test?.includes('BRCA');
          const familyHistory = quizAnswers.family_history;
          
          return `As you have first-degree relative with breast cancer and positive BRCA1/2 test results, this is considered very high risk requiring intensive surveillance and risk reduction strategies. Your health score for this section is ${sectionData.score}/100.

With your positive BRCA mutation, you have significantly elevated lifetime risk and should work closely with a high-risk breast clinic for specialized care including enhanced screening protocols with both mammography and breast MRI starting at age 25-30. Your family history combined with genetic mutation creates a hereditary cancer syndrome requiring comprehensive management.

Risk reduction options include prophylactic medications, enhanced surveillance, and in some cases surgical prevention strategies. Discuss with your oncology team about chemoprevention options like tamoxifen or aromatase inhibitors. Share this genetic information with your female relatives so they can also receive appropriate risk assessment and genetic counseling.`
        }
        
      case 'Hormonal':
        const menarcheAge = quizAnswers.menstrual_age;
        const pregnancy = quizAnswers.pregnancy_age;
        const oralContraceptives = quizAnswers.oral_contraceptives;
        const menopause = quizAnswers.menopause;
        const hrt = quizAnswers.hrt;
        const bmi = parseFloat(quizAnswers.bmi || "25");
        
        return `Your hormonal risk profile shows a score of ${sectionData.score}/100. ${menarcheAge?.includes('Before 12') ? 'You experienced early menarche which increases lifetime estrogen exposure.' : ''} ${pregnancy?.includes('Never') ? 'Never having a full-term pregnancy increases estrogen exposure as pregnancy provides protective hormonal changes.' : ''} ${oralContraceptives?.includes('Yes') ? 'Current oral contraceptive use provides additional estrogen exposure.' : ''} ${menopause?.includes('55 or older') ? 'Late menopause extends your reproductive years and estrogen exposure.' : ''} ${hrt?.includes('Yes') ? 'Hormone replacement therapy adds additional estrogen exposure during postmenopausal years.' : ''} ${bmi >= 30 ? 'Your elevated BMI contributes to increased estrogen production from fat tissue, particularly important after menopause.' : ''}

Most breast cancers are estrogen-driven, making hormonal balance crucial for prevention. To optimize hormonal health, maintain a healthy weight through balanced nutrition and regular exercise, as fat tissue produces estrogen. Limit alcohol consumption, which can increase estrogen levels and interfere with hormone metabolism. Include cruciferous vegetables (broccoli, kale, cabbage) in your diet, as they support healthy estrogen metabolism. Manage stress through meditation, yoga, or other relaxation techniques, as chronic stress can disrupt hormonal balance.`;
        
      case 'Symptom':
        const symptoms = quizAnswers.breast_symptoms;
        const lumpCharacteristics = quizAnswers.lump_characteristics;
        const hasSymptoms = symptoms !== "No, I don't have any symptoms";
        
        if (hasSymptoms) {
          const isGrowingLump = lumpCharacteristics?.includes('Growing') && lumpCharacteristics?.includes('over 2cm');
          return `${isGrowingLump ? 'As you have a growing lump with size over 2cm, this is serious and requires immediate professional evaluation.' : `You have reported ${symptoms?.toLowerCase()}${lumpCharacteristics ? ` with characteristics of ${lumpCharacteristics?.toLowerCase()}` : ''}.`} While most breast symptoms are benign, any persistent changes warrant immediate professional evaluation. We recommend therapeutic treatment including regular self-massage using gentle circular motions to improve lymphatic drainage and reduce discomfort. Consider dietary supplements such as evening primrose oil, vitamin E, and omega-3 fatty acids which may help reduce breast tenderness and inflammation. Follow our daily coaching plan to improve your health score through targeted lifestyle modifications. Schedule immediate clinical evaluation with your healthcare provider for proper diagnostic workup. Track your symptoms carefully and maintain detailed records for your medical team. Most importantly, any new or changing breast symptoms require prompt medical attention for appropriate diagnosis and treatment planning.`;
        } else {
          return `You have not reported any current breast symptoms, which provides an excellent baseline for ongoing monitoring. Continue performing monthly breast self-examinations to maintain familiarity with your normal breast tissue patterns. Regular self-massage during examinations can promote lymphatic drainage and help maintain breast health. Follow our daily coaching plan to maintain your symptom-free status through optimal lifestyle choices. Schedule annual clinical breast exams with your healthcare provider as part of your preventive care routine. If you ever notice new lumps, persistent pain, nipple discharge, or changes in size or shape, seek immediate professional evaluation.`;
        }
        
      case 'Screening':
        const denseBreast = quizAnswers.dense_breast;
        const benignCondition = quizAnswers.benign_condition;
        const mammogramFreq = quizAnswers.mammogram_frequency;
        
        return `You have ${denseBreast?.includes('Yes') ? 'dense breast tissue' : 'average breast density'}${benignCondition?.includes('Yes') ? ` and ${benignCondition?.toLowerCase().replace('yes, ', '')}` : ''} from your screening results, and these findings necessitate enhanced surveillance protocols beyond standard screening guidelines. At age ${age}, you should maintain annual mammograms with consideration for supplemental breast MRI due to your high-risk findings. Dense breast tissue can mask tumors on standard mammography, making additional imaging modalities essential for optimal detection. ${benignCondition?.includes('Atypical') ? 'Your atypical hyperplasia represents a high-risk lesion requiring discussion of chemoprevention options with your oncologist, including medications like tamoxifen or aromatase inhibitors.' : ''} 

Maintain strict adherence to your enhanced screening schedule and ensure your imaging is performed at centers with expertise in high-risk breast surveillance. Partner closely with your healthcare team to develop a personalized screening protocol that optimizes early detection while considering your individual risk factors and preferences.`;
        
      case 'Lifestyle':
        const diet = quizAnswers.western_diet;
        const smoking = quizAnswers.smoke;
        const alcohol = quizAnswers.alcohol;
        const nightShift = quizAnswers.night_shift;
        const stress = quizAnswers.chronic_stress;
        const exercise = quizAnswers.exercise;
        
        if (hasFactors) {
          return `Your lifestyle analysis shows multiple modifiable risk factors including ${diet?.includes('Yes') ? 'Western diet consumption, ' : ''}${smoking?.includes('Yes') ? 'smoking, ' : ''}${alcohol?.includes('2 or more') ? 'regular alcohol consumption, ' : ''}${nightShift?.includes('Yes') ? 'night shift work, ' : ''}${stress?.includes('Yes') ? 'chronic high stress, ' : ''}${exercise?.includes('No') ? 'sedentary lifestyle' : ''}. Your health score for this section is ${sectionData.score}/100. These are areas where you have complete control and can make immediate positive changes to improve your health score toward the maximum of 100. Focus on transitioning to a Mediterranean-style diet rich in fruits, vegetables, and omega-3 fatty acids. Eliminate smoking and limit alcohol to no more than 3-4 drinks per week. Implement stress management techniques including meditation, yoga, or regular counseling. Establish a regular exercise routine combining cardiovascular activity with strength training for at least 150 minutes per week. Follow our daily coaching plan to systematically address these factors and track your progress toward optimal health.`;
        } else {
          return `Your lifestyle assessment shows excellent health habits with a score of ${sectionData.score}/100. You demonstrate healthy lifestyle choices including balanced nutrition, regular exercise, stress management, and avoiding harmful substances. Continue maintaining these positive habits and follow our daily coaching plan to sustain these behaviors long-term. Your strong lifestyle foundation provides optimal protection and supports your overall health score of 100. Focus on consistency and continue using your healthy lifestyle as a model for family and friends.`;
        }
        
      default:
        return `Section assessment complete with score ${sectionData.score}/100. Continue following evidence-based breast health recommendations.`;
    }
  }
  
  categorizeRiskOld(riskScore: number): 'low' | 'moderate' | 'high' {
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
  
  createDailyPlan(userProfile: UserProfile, healthCategory: 'excellent' | 'good' | 'fair' | 'needs_attention'): Record<string, any> {
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
      supplements: healthCategory === 'needs_attention' ? 
        ["Vitamin D3", "Omega-3", "Folate", "Consider curcumin"] :
        ["Vitamin D3", "Omega-3", "Multivitamin"]
    };
  }
  
  generateComprehensiveReport(quizAnswers: Record<string, any>): InsertHealthReport {
    const sectionAnalysis = this.calculateSectionHealthScores(quizAnswers);
    const userProfile = this.determineUserProfile(quizAnswers);
    const dailyPlan = this.createDailyPlan(userProfile, sectionAnalysis.overallHealthCategory as 'excellent' | 'good' | 'fair' | 'needs_attention');
    
    // Generate 300-word summaries for each section
    const sectionSummaries: { [key: string]: string } = {};
    Object.entries(sectionAnalysis.sectionScores).forEach(([sectionName, sectionData]) => {
      sectionSummaries[sectionName] = this.generateSectionSummary(sectionName, sectionData, quizAnswers);
    });
    
    const reportData = {
      summary: {
        totalHealthScore: sectionAnalysis.totalScore.toFixed(1),
        uncontrollableHealthScore: sectionAnalysis.uncontrollableScore.toFixed(1),
        overallHealthCategory: sectionAnalysis.overallHealthCategory,
        userProfile,
        profileDescription: USER_PROFILES[userProfile].description,
        totalSections: Object.keys(sectionAnalysis.sectionScores).length
      },
      sectionAnalysis: {
        sectionScores: sectionAnalysis.sectionScores,
        sectionSummaries,
        sectionBreakdown: Object.entries(sectionAnalysis.sectionScores).map(([name, data]) => ({
          name,
          score: data.score,
          factorCount: data.factors.length,
          riskLevel: this.categorizeRisk(data.score)
        }))
      },
      personalizedPlan: {
        dailyPlan,
        coachingFocus: this.generateCoachingFocus(sectionAnalysis.sectionScores),
        followUpTimeline: this.generateFollowUpPlan(userProfile, sectionAnalysis.overallHealthCategory as 'excellent' | 'good' | 'fair' | 'needs_attention')
      }
    };
    
    return {
      quizAnswers,
      riskScore: sectionAnalysis.totalScore.toString(),
      riskCategory: sectionAnalysis.overallHealthCategory,
      userProfile,
      riskFactors: [], // Deprecated - now in section analysis
      recommendations: [], // Deprecated - now in section summaries
      dailyPlan,
      reportData,
      userId: 0 // Will be set when saving
    };
  }

  generateCoachingFocus(sectionScores: { [key: string]: { score: number, factors: string[] } }): string[] {
    const focus: string[] = [];
    
    // Prioritize sections with highest scores for coaching intervention
    const sortedSections = Object.entries(sectionScores)
      .sort(([,a], [,b]) => b.score - a.score)
      .slice(0, 3); // Top 3 priority areas
    
    console.log('Generating coaching focus from sections:', sortedSections.map(([name, data]) => `${name}: ${data.score}`));
    
    sortedSections.forEach(([sectionName, data]) => {
      if (data.score > 25) { // Only include sections needing intervention
        switch (sectionName) {
          case 'Lifestyle':
            focus.push('Personalized lifestyle optimization program focusing on nutrition, exercise, and stress management');
            break;
          case 'Hormonal':
            focus.push('Hormonal balance support through diet, supplements, and lifestyle modifications');
            break;
          case 'Screening':
            focus.push('Enhanced screening schedule coordination and health monitoring support');
            break;
          case 'Genetic':
            focus.push('Enhanced prevention strategies for individuals with genetic risk factors');
            break;
          case 'Demographic':
            focus.push('Age-appropriate prevention strategies and screening optimization');
            break;
          case 'Symptom':
            focus.push('Symptom monitoring guidance and self-examination technique training');
            break;
        }
      }
    });
    
    if (focus.length === 0) {
      focus.push('Maintain current healthy practices with periodic check-ins and optimization');
    }
    
    console.log('Final coaching focus array:', focus);
    return focus;
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
      "3_months": "Assess progress on lifestyle changes and health metrics",
      "6_months": "Complete follow-up health assessment"
    };
    
    if (riskCategory === 'high') {
      basePlan["2_weeks"] = "Schedule appointment with healthcare provider to discuss findings";
      basePlan["1_month"] = "Begin enhanced screening protocol if recommended";
    } else {
      basePlan["1_month"] = "Review daily plan implementation and adjust as needed";
    }
    
    if (userProfile === 'current_patient' || userProfile === 'survivor') {
      basePlan["1_month"] = "Review plan with oncology team";
      basePlan["3_months"] = "Coordinate with regular surveillance schedule";
    }
    
    console.log('Generated follow-up plan:', basePlan);
    return basePlan;
  }
}

export const reportGenerator = new BreastHealthReportGenerator();