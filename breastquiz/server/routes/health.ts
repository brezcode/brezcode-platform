import { Router } from "express";
import { db } from "../db";
import { healthReports, quizResponses } from "@shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

// Save quiz session progress
router.post("/quiz/save", async (req, res) => {
  try {
    const { userId, sessionData, currentStep } = req.body;
    
    const [session] = await db.insert(quizResponses).values({
      userId,
      sessionId: Date.now().toString(),
      answers: sessionData
    }).returning();
    
    res.json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error("Error saving quiz session:", error);
    res.status(500).json({ error: "Failed to save quiz session" });
  }
});

// Complete quiz and generate health report
router.post("/quiz/complete", async (req, res) => {
  try {
    const { userId, quizAnswers } = req.body;
    
    // Calculate risk score (simplified version)
    let riskScore = 0;
    
    // Age factor
    if (quizAnswers.age >= 50) riskScore += 2;
    else if (quizAnswers.age >= 40) riskScore += 1;
    
    // Family history
    if (quizAnswers.family_history === "Multiple family members") riskScore += 3;
    else if (quizAnswers.family_history === "Mother or sister") riskScore += 2;
    else if (quizAnswers.family_history === "Grandmother or aunt") riskScore += 1;
    
    // Screening frequency
    if (quizAnswers.mammogram_frequency === "Never") riskScore += 2;
    else if (quizAnswers.mammogram_frequency === "Irregularly") riskScore += 1;
    
    // Lifestyle factors
    if (quizAnswers.lifestyle_factors === "None of the above") riskScore += 2;
    
    // Hormonal factors
    if (quizAnswers.hormonal_factors === "Yes") riskScore += 1;
    
    // Determine risk category
    let riskCategory = "Low Risk";
    let userProfile = "health-conscious";
    
    if (riskScore <= 2) {
      riskCategory = "Low Risk";
      userProfile = "health-conscious";
    } else if (riskScore <= 5) {
      riskCategory = "Moderate Risk";
      userProfile = "moderate-risk";
    } else {
      riskCategory = "Higher Risk";
      userProfile = "higher-risk";
    }
    
    // Generate recommendations
    const baseRecommendations = [
      "Schedule regular mammogram screenings",
      "Maintain a healthy diet rich in fruits and vegetables",
      "Exercise regularly - aim for 150 minutes per week",
      "Limit alcohol consumption",
      "Maintain a healthy weight"
    ];
    
    const recommendations = riskCategory === "Higher Risk" ? [
      "Consult with your healthcare provider about your risk factors",
      "Consider genetic counseling if you have significant family history",
      "Discuss earlier or more frequent screening options",
      ...baseRecommendations
    ] : baseRecommendations;
    
    // Save health report
    const [report] = await db.insert(healthReports).values({
      userId,
      quizResponseId: 1, // This would come from the quiz response
      reportData: {
        quizAnswers,
        riskScore,
        riskCategory,
        userProfile,
        riskFactors: { calculated_factors: quizAnswers },
        recommendations: { list: recommendations }
      }
    }).returning();
    
    res.json({ 
      success: true, 
      reportId: report.id,
      riskScore,
      riskCategory,
      userProfile,
      recommendations
    });
  } catch (error) {
    console.error("Error completing quiz:", error);
    res.status(500).json({ error: "Failed to complete quiz" });
  }
});

// Get health report
router.get("/report/:reportId", async (req, res) => {
  try {
    const { reportId } = req.params;
    
    const [report] = await db.select()
      .from(healthReports)
      .where(eq(healthReports.id, parseInt(reportId)));
    
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    
    res.json(report);
  } catch (error) {
    console.error("Error fetching health report:", error);
    res.status(500).json({ error: "Failed to fetch health report" });
  }
});

export default router;