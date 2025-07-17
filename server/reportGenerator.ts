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
        overallRiskCategory: this.categorizeRisk(treatmentScore)
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
    
    // Calculate overall total health score
    const totalFinalScore = Math.sqrt(totalMultiplier);
    const overallHealthScore = this.convertToHealthScore(totalFinalScore);
    
    calculationLog.push(`\n=== OVERALL TOTAL ===`);
    calculationLog.push(`Combined multiplier: ${totalMultiplier.toFixed(2)}`);
    calculationLog.push(`Total final score: √${totalMultiplier.toFixed(2)} = ${totalFinalScore.toFixed(2)} → ${overallHealthScore.toFixed(1)}/100 health score`);
    
    // Log the full calculation for debugging
    console.log('\n=== 6-SECTION HEALTH SCORE CALCULATION ===');
    console.log('Health Score: Higher = Healthier | 100 = Perfect Health | Lower = More Risk Factors Present');
    calculationLog.forEach(log => console.log(log.replace('RISK SCORE', 'HEALTH SCORE')));
    console.log(`Final Health Score: ${Math.round(overallHealthScore * 10) / 10}/100 (Higher = Healthier)`);
    console.log('==========================================\n');
    
    return {
      sectionScores: sectionScores,
      totalScore: Math.round(overallHealthScore * 10) / 10,
      overallHealthCategory: this.categorizeHealth(overallHealthScore)
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

  generateSectionSummary(sectionName: string, sectionData: { score: number, factors: string[] }, quizAnswers: Record<string, any>): string {
    const age = parseInt(quizAnswers.age || "30");
    const country = quizAnswers.country || "United States";
    const hasFactors = sectionData.factors.length > 0;
    
    switch (sectionName) {
      case 'Demographic':
        const isYoung = age < 40;
        const isMiddleAge = age >= 40 && age < 60;
        const isOlder = age >= 60;
        
        return `Hi there! As a ${age}-year-old woman living in ${country}, your health score for this section is ${sectionData.score}/100. ${hasFactors ? `The factors we're watching include: ${sectionData.factors.join(', ')}.` : 'Great news - no major demographic concerns here!'} 

${isYoung ? `At your age, breast cancer is less common, but it's still smart to start good habits now. Begin doing monthly breast self-checks to get familiar with how your breasts normally feel. You don't need mammograms yet unless you have a strong family history.` : 
isMiddleAge ? `You're at an age where regular screening becomes really important. If you haven't started mammograms yet, now's the time to begin (around age 40-50). Keep up with yearly mammograms and clinical breast exams.` :
`At ${age}, you're in an age group where breast cancer becomes more common, but don't worry - regular screening catches most cancers early when they're very treatable. Keep up with your mammograms every 1-2 years as your doctor recommends.`}

The good news is that no matter your age or background, you have real power to protect your health. Eat colorful fruits and vegetables, stay active, and keep a healthy weight. These simple steps can make a big difference in your overall health and may help reduce your risk.`;
        
      case 'Genetic':
        if (!hasFactors) {
          return `Great news about your family history! Your health score here is ${sectionData.score}/100, which means you don't have major genetic risk factors. This is really encouraging - about 85% of women who get breast cancer don't have a family history of it either.

Even though your genes look good, it's still important to take care of yourself. Keep living a healthy lifestyle with regular exercise, limit alcohol, and maintain a healthy weight. These habits are powerful tools for preventing many types of cancer.

It's worth keeping track of your family's health history and updating it as you learn new information. If anything changes in your family (like a relative being diagnosed), let your doctor know. You might want to talk to a genetic counselor if you ever have questions about your family history. For now though, you can feel confident that your genetics are working in your favor!`
        } else {
          return `Your family history shows some important factors we need to watch: ${sectionData.factors.join(', ')}. Your health score for this section is ${sectionData.score}/100. I know this might feel scary, but having this knowledge is actually a gift - it means you can take action to protect yourself.

Because of your family history, you'll likely need to start screening earlier than other women. ${age < 40 ? 'Even though you\'re young, talk to your doctor about starting mammograms 10 years before the age your relative was diagnosed, or at age 30-35, whichever comes first.' : age < 50 ? 'You may need mammograms yearly instead of every other year.' : 'Make sure you\'re getting mammograms yearly, and ask your doctor if you need additional screening like breast MRI.'}

Consider talking to a genetic counselor about BRCA testing if you haven't already. This isn't something to fear - it's information that can help you make the best choices for your health. Share this information with your sisters, daughters, and other female relatives too, so they can also be proactive about their health.`
        }
        
      case 'Hormonal':
        return `Your hormonal risk profile shows a score of ${sectionData.score}/100. ${hasFactors ? `Key factors affecting your estrogen exposure include: ${sectionData.factors.join(', ')}.` : 'Your hormonal profile shows minimal risk factors.'} Most breast cancers are estrogen-driven, making hormonal balance crucial for prevention. ${hasFactors ? 'Your current factors suggest prolonged or elevated estrogen exposure, which increases cellular proliferation in breast tissue.' : 'Your hormonal profile is relatively favorable for breast cancer prevention.'} To optimize hormonal health, maintain a healthy weight through balanced nutrition and regular exercise, as fat tissue produces estrogen. Limit alcohol consumption, which can increase estrogen levels and interfere with hormone metabolism. Consider discussing hormone replacement therapy risks and benefits with your healthcare provider if applicable. Include cruciferous vegetables (broccoli, kale, cabbage) in your diet, as they support healthy estrogen metabolism. Manage stress through meditation, yoga, or other relaxation techniques, as chronic stress can disrupt hormonal balance. Ensure adequate vitamin D levels, which may help regulate cell growth. Regular sleep patterns support healthy hormone production and regulation.`;
        
      case 'Symptom':
        const hasSymptoms = quizAnswers.breast_symptoms !== "No, I don't have any symptoms";
        if (hasSymptoms) {
          return `You've reported breast symptoms that require attention and monitoring. While most breast symptoms are benign, any persistent changes warrant professional evaluation. We strongly recommend monthly breast self-examinations 7 days after your menstrual period (or on the same date each month if post-menopausal) to familiarize yourself with normal tissue patterns and detect changes early. Perform self-massage using gentle circular motions, which can help reduce symptoms like tenderness and improve lymphatic drainage. Schedule a clinical breast exam with your healthcare provider to discuss your symptoms and determine if additional imaging or evaluation is needed. Track your symptoms in relation to your menstrual cycle, as many breast changes are hormone-related and cyclical. Wear a well-fitted, supportive bra to reduce discomfort. Apply warm or cool compresses as needed for pain relief. Limit caffeine and salt intake, which may worsen breast tenderness. Most importantly, trust your body awareness – you know your body best, and any persistent or concerning changes should be evaluated promptly by a healthcare professional for peace of mind and appropriate care.`;
        } else {
          return `Excellent news – you haven't reported any current breast symptoms. This provides a wonderful baseline for ongoing breast health monitoring. Continue performing monthly breast self-examinations 7 days after your period to maintain familiarity with your normal breast tissue patterns. Even without symptoms, self-massage during these examinations can promote lymphatic drainage and help you stay connected with your breast health. Regular self-exams are your first line of defense for early detection of any future changes. Maintain this symptom-free status through healthy lifestyle choices including regular exercise, balanced nutrition, adequate hydration, and stress management. Schedule annual clinical breast exams with your healthcare provider as part of your preventive care routine. Remember that breast tissue naturally changes throughout your menstrual cycle and life stages, so familiarizing yourself with these normal variations is key. If you ever notice new lumps, persistent pain, nipple discharge, or changes in size or shape, don't hesitate to seek professional evaluation. Your current symptom-free status is an asset – use it as motivation to maintain excellent breast health practices and stay vigilant about any future changes that may arise.`;
        }
        
      case 'Screening':
        const hasHighRiskScreeningFactors = sectionData.factors.some(f => f.includes('Dense breast') || f.includes('Atypical') || f.includes('LCIS') || f.includes('cancer'));
        if (hasHighRiskScreeningFactors) {
          return `Your screening risk assessment shows a score of ${sectionData.score}/100 with significant factors requiring enhanced surveillance: ${sectionData.factors.join(', ')}. These findings necessitate a more intensive screening protocol than standard guidelines. We recommend annual mammograms starting earlier than age 40, potentially supplemented with breast MRI for enhanced detection capabilities. Dense breast tissue can mask tumors on mammograms, making additional imaging modalities crucial. If you have precancerous conditions like atypical hyperplasia or LCIS, discuss chemoprevention options with your oncologist. For cancer patients or survivors, maintaining optimal health through nutrition, exercise, and stress management becomes even more critical for preventing recurrence and supporting overall wellness. Regular follow-up appointments and adherence to your medical team's recommendations are essential. Stay current with emerging screening technologies and consider participating in clinical trials if appropriate. Your elevated screening risk profile requires vigilance, but modern surveillance methods provide excellent opportunities for early detection and successful intervention. Partner closely with your healthcare team to develop a personalized screening schedule that balances thorough monitoring with quality of life considerations.`;
        } else {
          return `Your screening risk profile shows a score of ${sectionData.score}/100 with standard risk factors. This suggests you can follow conventional screening guidelines while remaining vigilant about breast health. Begin annual mammograms at age 40, or earlier if recommended by your healthcare provider based on other risk factors. Perform monthly breast self-examinations consistently, as you are your own best advocate for detecting changes. Schedule annual clinical breast exams with your healthcare provider as part of your routine preventive care. Even with standard screening risk, maintain awareness of breast cancer symptoms and don't hesitate to report any concerns between scheduled screenings. Stay informed about advances in screening technology and discuss with your provider whether you might benefit from 3D mammography or other enhanced imaging techniques. Maintain detailed records of your screening results and share any family history changes with your healthcare team. While your current screening risk is manageable with standard protocols, consistency in screening adherence is crucial for early detection. Remember that guidelines may evolve based on new research, so stay connected with your healthcare team for the most current recommendations tailored to your individual risk profile.`;
        }
        
      case 'Lifestyle':
        if (hasFactors) {
          return `Your lifestyle risk assessment shows a score of ${sectionData.score}/100 with modifiable factors: ${sectionData.factors.join(', ')}. The encouraging news is that these are areas where you have complete control and can make immediate positive changes. This is where our personalized coaching program can provide the most significant impact on reducing your breast cancer risk. We'll help you develop a tailored daily and weekly plan to address these specific lifestyle factors systematically. Focus on gradual, sustainable changes rather than dramatic overhauls – small consistent improvements compound over time. Prioritize stress management through mindfulness, meditation, or other relaxation techniques, as chronic stress affects immune function and hormone levels. Improve your diet by incorporating more plant-based foods, reducing processed foods, and limiting alcohol consumption. Establish a regular exercise routine combining cardiovascular activity with strength training. Create better sleep hygiene for hormonal balance and cellular repair. We'll provide ongoing support, tracking tools, and accountability to help these changes become lasting habits. Your lifestyle factors represent the greatest opportunity for risk reduction and overall wellness improvement. Together, we'll create a sustainable plan that fits your schedule, preferences, and goals while significantly impacting your breast health trajectory.`;
        } else {
          return `Excellent work! Your lifestyle risk assessment shows a score of ${sectionData.score}/100 with minimal modifiable risk factors. You're already demonstrating healthy lifestyle choices that support breast cancer prevention. Continue maintaining these positive habits while remaining open to further optimization. Our coaching program can help you sustain these healthy behaviors long-term and identify additional opportunities for wellness enhancement. Even with good baseline habits, small refinements can yield significant benefits for your overall health and spiritual well-being. Focus on consistency rather than perfection – maintaining your current healthy patterns through life's inevitable changes and challenges. Consider sharing your success strategies with friends and family, as social support strengthens healthy behaviors. Regularly reassess your lifestyle as circumstances change, such as work stress, family demands, or aging-related factors. Stay informed about emerging research on lifestyle factors and breast cancer prevention. Use your strong lifestyle foundation to support others in their health journeys. Remember that wellness encompasses physical, mental, and spiritual health – continue nurturing all aspects. Your commitment to healthy living serves as an inspiring example and provides the best foundation for long-term breast health and overall vitality.`;
        }
        
      default:
        return `Section assessment complete with score ${sectionData.score}/100. Continue following evidence-based breast health recommendations.`;
    }
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
            focus.push('Genetic counseling coordination and family history management');
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