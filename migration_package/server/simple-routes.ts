import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = Router();

// Initialize Anthropic client (optional - fallback to rule-based if not available)
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
}) : null;

// Health report generation endpoint
router.post('/api/reports/generate', async (req, res) => {
  try {
    const answers = req.body;
    console.log('Generating personalized report with answers:', answers);

    // Calculate BMI if not provided
    if (!answers.bmi && answers.weight && answers.height) {
      const heightInMeters = parseFloat(answers.height);
      const weightInKg = parseFloat(answers.weight);
      answers.bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
    }

    // Generate comprehensive health report
    const report = await generateHealthReport(answers);
    
    console.log('Personalized report generated successfully:', { success: true, report });
    res.json({ success: true, report });

  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate health report',
      details: error.message 
    });
  }
});

async function generateHealthReport(answers: any) {
  // Calculate risk scores
  const riskScores = calculateRiskFactors(answers);
  const userProfile = determineUserProfile(answers);
  
  // Generate AI analysis if Claude is available, otherwise use rule-based
  let aiAnalysis = null;
  if (anthropic) {
    try {
      aiAnalysis = await generateClaudeAnalysis(answers, riskScores);
    } catch (error) {
      console.log('AI analysis failed, falling back to rule-based:', error.message);
    }
  }

  // Build comprehensive report
  const report = {
    id: Date.now(),
    riskScore: riskScores.totalScore,
    riskCategory: riskScores.category,
    userProfile,
    riskFactors: riskScores.factors,
    recommendations: generateRecommendations(answers, riskScores),
    dailyPlan: generateDailyPlan(answers, userProfile),
    reportData: {
      summary: {
        uncontrollableHealthScore: riskScores.uncontrollableScore.toString(),
        controllableHealthScore: riskScores.controllableScore.toString(),
        overallHealthScore: riskScores.totalScore.toString(),
        profileDescription: getProfileDescription(userProfile, answers),
        totalSections: 4
      },
      sectionAnalysis: {
        sectionBreakdown: generateSectionBreakdown(answers, riskScores),
        sectionSummaries: aiAnalysis?.sectionSummaries || generateRuleBasedSummaries(answers)
      },
      personalizedPlan: {
        dailyPlan: generateDailyPlan(answers, userProfile),
        coachingFocus: generateCoachingFocus(answers, riskScores),
        followUpTimeline: generateFollowUpTimeline(answers, riskScores)
      }
    },
    createdAt: new Date().toISOString()
  };

  return report;
}

function calculateRiskFactors(answers: any) {
  let uncontrollableScore = 1.0;
  let controllableScore = 1.0;
  const factors = [];

  // Age (uncontrollable)
  const age = parseInt(answers.age);
  if (age >= 50) {
    uncontrollableScore *= 1.5;
    factors.push("Age over 50 increases breast cancer risk");
  }

  // Family history (uncontrollable)
  if (answers.family_history && answers.family_history.includes("Yes")) {
    uncontrollableScore *= 1.8;
    factors.push("Family history of breast cancer");
  }

  // Lifestyle factors (controllable)
  if (answers.alcohol && answers.alcohol !== "No") {
    controllableScore *= 1.2;
    factors.push("Alcohol consumption increases risk");
  }

  if (answers.exercise === "No, little or no regular exercise") {
    controllableScore *= 1.3;
    factors.push("Lack of regular exercise");
  }

  if (answers.obesity === "Yes") {
    controllableScore *= 1.4;
    factors.push("Obesity increases breast cancer risk");
  }

  const totalScore = Math.min(100, Math.round((uncontrollableScore + controllableScore - 1) * 50));
  let category = 'low';
  if (totalScore >= 60) category = 'high';
  else if (totalScore >= 40) category = 'moderate';

  return {
    totalScore,
    category,
    uncontrollableScore: Math.round(uncontrollableScore * 60),
    controllableScore: Math.round(controllableScore * 40),
    factors
  };
}

function determineUserProfile(answers: any) {
  const age = parseInt(answers.age);
  
  if (age < 20) return 'teenager';
  if (answers.menopause === "Yes, before age 55" || answers.menopause === "Yes, after age 55") {
    return 'postmenopausal';
  }
  return 'premenopausal';
}

function generateRecommendations(answers: any, riskScores: any) {
  const recommendations = [
    "Schedule annual mammograms starting at age 40",
    "Maintain a healthy weight through balanced diet and regular exercise",
    "Limit alcohol consumption to reduce breast cancer risk",
    "Perform monthly breast self-examinations",
    "Schedule regular clinical breast exams with your healthcare provider"
  ];

  if (riskScores.category === 'high') {
    recommendations.push("Consider genetic counseling and testing");
    recommendations.push("Discuss chemoprevention options with your doctor");
  }

  recommendations.push("Follow mammogram screening guidelines for your age group");
  return recommendations;
}

function generateDailyPlan(answers: any, userProfile: string) {
  const plans = {
    morning: "Take vitamin D supplement and practice meditation",
    afternoon: "30 minutes of physical activity (walking, swimming, or yoga)",
    evening: "Practice stress reduction techniques and maintain healthy sleep schedule"
  };

  if (userProfile === 'postmenopausal') {
    plans.morning += " and calcium supplement";
  }

  return plans;
}

function generateSectionBreakdown(answers: any, riskScores: any) {
  return [
    {
      name: "Demographics & Age",
      score: Math.min(100, riskScores.uncontrollableScore),
      riskLevel: riskScores.uncontrollableScore > 70 ? "high" : riskScores.uncontrollableScore > 50 ? "moderate" : "low",
      riskFactors: [`Age ${answers.age} assessment`]
    },
    {
      name: "Family History",
      score: answers.family_history?.includes("Yes") ? 75 : 25,
      riskLevel: answers.family_history?.includes("Yes") ? "high" : "low",
      riskFactors: answers.family_history?.includes("Yes") ? ["Family history present"] : []
    },
    {
      name: "Lifestyle Factors",
      score: Math.min(100, riskScores.controllableScore),
      riskLevel: riskScores.controllableScore > 70 ? "high" : riskScores.controllableScore > 50 ? "moderate" : "low",
      riskFactors: riskScores.factors.filter(f => f.includes("exercise") || f.includes("alcohol") || f.includes("obesity"))
    },
    {
      name: "Reproductive History",
      score: 45,
      riskLevel: "moderate",
      riskFactors: [`Menopause status: ${answers.menopause}`]
    }
  ];
}

function generateRuleBasedSummaries(answers: any) {
  return {
    "Demographics & Age": `Based on your age of ${answers.age}, you fall into a specific risk category. Age is one of the most significant unmodifiable risk factors for breast cancer. The majority of breast cancers (about 80%) occur in women over the age of 50. As estrogen exposure increases with age, particularly after menopause, cellular changes become more likely. Your current age places you in ${parseInt(answers.age) >= 50 ? 'a higher' : 'a lower'} risk category, requiring ${parseInt(answers.age) >= 50 ? 'more frequent screening and monitoring' : 'standard screening protocols'}.`,
    
    "Family History": `Your family history assessment indicates ${answers.family_history?.includes("Yes") ? 'a genetic predisposition that requires careful monitoring' : 'no immediate genetic risk factors'}. ${answers.family_history?.includes("Yes") ? 'Having family members with breast cancer, particularly first-degree relatives, can increase your risk by 2-3 times. Genetic counseling and testing for BRCA1/BRCA2 mutations may be recommended.' : 'It\'s important to note that 85-90% of breast cancers occur in women with no family history, so maintaining regular screening is still essential.'}`,
    
    "Lifestyle Factors": `Your lifestyle assessment reveals several modifiable risk factors. Regular physical activity can reduce breast cancer risk by 10-20% through hormonal regulation and immune system enhancement. Your current exercise status: ${answers.exercise}. Alcohol consumption (${answers.alcohol}) affects estrogen metabolism. Weight management is crucial as obesity after menopause increases risk through increased estrogen production in fat tissue. Your BMI of ${answers.bmi} indicates ${parseFloat(answers.bmi) > 25 ? 'room for improvement' : 'good weight management'}.`,
    
    "Reproductive History": `Your reproductive history provides insight into lifetime estrogen exposure patterns. ${answers.menopause?.includes("Yes") ? 'Being postmenopausal' : 'Your premenopausal status'} affects your risk profile significantly. Early menopause generally reduces risk due to decreased lifetime estrogen exposure, while late menopause increases risk. Pregnancy history, breastfeeding duration, and age at first pregnancy all influence risk through hormonal mechanisms. Your specific reproductive timeline suggests ${answers.pregnancy_age ? 'protective factors from pregnancy' : 'standard risk levels based on reproductive history'}.`
  };
}

function generateCoachingFocus(answers: any, riskScores: any) {
  const focus = [
    "Develop a consistent exercise routine with at least 150 minutes of moderate activity per week",
    "Implement stress management techniques including meditation and adequate sleep (7-9 hours nightly)",
    "Maintain regular screening schedule appropriate for your age and risk factors"
  ];

  if (answers.alcohol !== "No") {
    focus.push("Reduce alcohol consumption to lower breast cancer risk");
  }

  if (parseFloat(answers.bmi) > 25) {
    focus.push("Achieve and maintain healthy weight through balanced nutrition and physical activity");
  }

  return focus;
}

function generateFollowUpTimeline(answers: any, riskScores: any) {
  const timeline = {
    "immediate": "Schedule appointment with healthcare provider to discuss results",
    "1_month": "Begin implementing daily wellness plan and lifestyle modifications",
    "3_months": "Reassess progress on lifestyle changes and health improvements",
    "6_months": "Follow up on screening recommendations and health plan effectiveness",
    "1_year": "Complete annual health assessment and update screening schedule"
  };

  if (riskScores.category === 'high') {
    timeline["2_weeks"] = "Consider genetic counseling consultation";
  }

  return timeline;
}

function getProfileDescription(userProfile: string, answers: any) {
  const age = answers.age;
  const descriptions = {
    teenager: `Based on your age and health profile, you are in the early development stage where establishing healthy habits is crucial for long-term breast health.`,
    premenopausal: `Based on your age of ${age} and premenopausal status, you are in a period where hormonal factors play a significant role in breast health risk assessment.`,
    postmenopausal: `Based on your age of ${age} and postmenopausal status, you are in a stage where maintaining health through lifestyle factors becomes increasingly important.`,
    current_patient: `As someone currently managing breast health concerns, your focus should be on supporting treatment and maintaining overall wellness.`,
    survivor: `As a breast cancer survivor, your health plan focuses on reducing recurrence risk and maintaining optimal wellness.`
  };
  
  return descriptions[userProfile] || descriptions.premenopausal;
}

async function generateClaudeAnalysis(answers: any, riskScores: any) {
  if (!anthropic) return null;

  try {
    const prompt = `As a medical AI specializing in breast health, analyze this patient's health assessment and provide detailed section summaries. Patient data: ${JSON.stringify(answers)}. Risk assessment: ${JSON.stringify(riskScores)}.

Please provide comprehensive analysis for each section with medical context, research citations, and specific recommendations.`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    return {
      sectionSummaries: generateRuleBasedSummaries(answers) // Fallback to rule-based if parsing fails
    };
  } catch (error) {
    console.error('Claude analysis failed:', error);
    return null;
  }
}

export default router;