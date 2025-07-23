import { Router } from "express";
import { conversationLearningService } from "../conversationLearningService";
import { z } from "zod";
import { insertConversationHistorySchema, insertConversationFeedbackSchema } from "@shared/schema";

const router = Router();

// Record a real conversation for learning analysis
router.post("/record-conversation", async (req, res) => {
  try {
    const data = req.body;
    
    // Validate required fields
    if (!data.userId || !data.sessionId || !data.userMessage || !data.aiResponse) {
      return res.status(400).json({ 
        error: "Missing required fields: userId, sessionId, userMessage, aiResponse" 
      });
    }
    
    const conversation = await conversationLearningService.recordConversation({
      userId: parseInt(data.userId),
      sessionId: data.sessionId,
      userMessage: data.userMessage,
      aiResponse: data.aiResponse,
      messageType: data.messageType,
      technology: data.technology,
      problemType: data.problemType,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
    });
    
    console.log("✅ Recorded conversation for learning:", {
      id: conversation.id,
      technology: conversation.technology,
      problemType: conversation.problemType
    });
    
    res.json({ success: true, conversationId: conversation.id, conversation });
  } catch (error) {
    console.error("Error recording conversation:", error);
    res.status(500).json({ error: "Failed to record conversation" });
  }
});

// Analyze user's learning patterns and preferences
router.get("/analyze-patterns/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const limitDays = parseInt(req.query.days as string) || 30;
    
    const patterns = await conversationLearningService.analyzeUserPatterns(userId, limitDays);
    
    console.log("🧠 Generated user learning analysis:", {
      userId,
      mistakes: patterns.commonMistakes.length,
      successes: patterns.successfulPatterns.length,
      technologies: patterns.preferredTechnologies.length
    });
    
    res.json({
      success: true,
      userId,
      analysisScope: `${limitDays} days`,
      patterns
    });
  } catch (error) {
    console.error("Error analyzing user patterns:", error);
    res.status(500).json({ error: "Failed to analyze patterns" });
  }
});

// Extract validated knowledge from successful conversations
router.post("/extract-knowledge/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    const extractedKnowledge = await conversationLearningService.extractAndValidateKnowledge(userId);
    
    console.log("💡 Extracted validated knowledge:", {
      userId,
      patternsExtracted: extractedKnowledge.length
    });
    
    res.json({
      success: true,
      userId,
      extractedKnowledge,
      count: extractedKnowledge.length
    });
  } catch (error) {
    console.error("Error extracting knowledge:", error);
    res.status(500).json({ error: "Failed to extract knowledge" });
  }
});

// Record a failed approach to avoid repetition
router.post("/record-failure", async (req, res) => {
  try {
    const data = req.body;
    
    // Validate required fields
    if (!data.userId || !data.conversationId || !data.approachDescription || !data.technology) {
      return res.status(400).json({ 
        error: "Missing required fields: userId, conversationId, approachDescription, technology" 
      });
    }
    
    await conversationLearningService.recordFailedApproach({
      userId: parseInt(data.userId),
      conversationId: parseInt(data.conversationId),
      approachDescription: data.approachDescription,
      errorMessage: data.errorMessage,
      technology: data.technology,
      failureReason: data.failureReason,
      userFeedback: data.userFeedback,
      alternativeSuggestion: data.alternativeSuggestion,
    });
    
    console.log("❌ Recorded failed approach:", {
      userId: data.userId,
      approach: data.approachDescription.substring(0, 50) + "...",
      technology: data.technology
    });
    
    res.json({ success: true, message: "Failed approach recorded for future avoidance" });
  } catch (error) {
    console.error("Error recording failed approach:", error);
    res.status(500).json({ error: "Failed to record failure" });
  }
});

// Get personalized recommendations based on learning history
router.post("/get-recommendations/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { currentProblem } = req.body;
    
    if (!currentProblem) {
      return res.status(400).json({ error: "currentProblem is required" });
    }
    
    const recommendations = await conversationLearningService.getPersonalizedRecommendations(
      userId, 
      currentProblem
    );
    
    console.log("🎯 Generated personalized recommendations:", {
      userId,
      problem: currentProblem.substring(0, 50) + "...",
      recommendationCount: recommendations.recommendations.length,
      avoidCount: recommendations.avoidApproaches.length,
      relevantKnowledge: recommendations.relevantKnowledge.length
    });
    
    res.json({
      success: true,
      userId,
      currentProblem,
      recommendations
    });
  } catch (error) {
    console.error("Error getting recommendations:", error);
    res.status(500).json({ error: "Failed to get recommendations" });
  }
});

// Get user's learning profile
router.get("/learning-profile/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    const profile = await conversationLearningService.getUserLearningProfile(userId);
    
    if (!profile) {
      return res.json({
        success: true,
        userId,
        profile: null,
        message: "No learning profile found. Profile will be created after first conversation analysis."
      });
    }
    
    console.log("📊 Retrieved learning profile:", {
      userId,
      totalConversations: profile.totalConversations,
      experienceLevel: profile.experienceLevel,
      primaryLanguages: profile.primaryLanguages?.length || 0
    });
    
    res.json({
      success: true,
      userId,
      profile
    });
  } catch (error) {
    console.error("Error getting learning profile:", error);
    res.status(500).json({ error: "Failed to get learning profile" });
  }
});

// Submit conversation feedback to improve learning
router.post("/feedback", async (req, res) => {
  try {
    const feedbackData = insertConversationFeedbackSchema.parse(req.body);
    
    // This would store feedback in the conversationFeedback table
    // For now, just log it as the table insertion logic would go here
    console.log("📝 Received conversation feedback:", {
      conversationId: feedbackData.conversationId,
      userId: feedbackData.userId,
      helpfulnessRating: feedbackData.helpfulnessRating,
      solutionWorked: feedbackData.solutionWorked
    });
    
    res.json({ 
      success: true, 
      message: "Feedback recorded for learning improvement",
      feedbackId: Date.now() // Placeholder - would be real DB ID
    });
  } catch (error) {
    console.error("Error recording feedback:", error);
    res.status(500).json({ error: "Failed to record feedback" });
  }
});

// Debug endpoint to see recent conversations
router.get("/debug/recent-conversations/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const limit = parseInt(req.query.limit as string) || 10;
    
    // This would query the conversationHistory table
    // For now, return empty as demonstration
    res.json({
      success: true,
      userId,
      conversations: [],
      message: "Debug endpoint - would show recent conversations from database"
    });
  } catch (error) {
    console.error("Error getting recent conversations:", error);
    res.status(500).json({ error: "Failed to get conversations" });
  }
});

export default router;