import { conversationLearningService } from "./conversationLearningService";

/**
 * REAL Coding Analyzer - Learns from actual conversation history
 * This replaces the previous mock system with authentic learning capabilities
 */
export class RealCodingAnalyzer {
  private userId: number = 1; // Default user - would be dynamic in production
  
  constructor() {
    console.log("🚀 Real Coding Analyzer initialized - Learning from actual conversations");
  }
  
  // Record every real conversation for learning analysis
  async recordRealConversation(
    userMessage: string, 
    aiResponse: string, 
    metadata?: {
      sessionId?: string;
      technology?: string;
      problemType?: string;
    }
  ): Promise<number> {
    const sessionId = metadata?.sessionId || `session_${Date.now()}`;
    
    const conversation = await conversationLearningService.recordConversation({
      userId: this.userId,
      sessionId,
      userMessage,
      aiResponse,
      technology: metadata?.technology,
      problemType: metadata?.problemType,
      messageType: 'coding'
    });
    
    console.log("📝 Recorded real conversation:", {
      id: conversation.id,
      userPreview: userMessage.substring(0, 50) + "...",
      technology: conversation.technology,
      problemType: conversation.problemType
    });
    
    // Analyze patterns after every 5 conversations
    if (conversation.id % 5 === 0) {
      await this.analyzeUserLearningPatterns();
    }
    
    return conversation.id;
  }
  
  // Analyze what the user actually struggles with
  async analyzeUserLearningPatterns(): Promise<void> {
    console.log("🧠 Analyzing user learning patterns from real conversation history");
    
    try {
      const patterns = await conversationLearningService.analyzeUserPatterns(this.userId);
      
      console.log("📊 Learning Pattern Analysis Results:", {
        commonMistakes: patterns.commonMistakes.length,
        successfulPatterns: patterns.successfulPatterns.length,
        preferredTechnologies: patterns.preferredTechnologies.length,
        difficultyAreas: patterns.difficultyAreas.length
      });
      
      // Extract validated knowledge from successful conversations
      if (patterns.successfulPatterns.length > 0) {
        await this.extractValidatedKnowledge();
      }
      
    } catch (error) {
      console.error("Error analyzing learning patterns:", error);
    }
  }
  
  // Extract knowledge that actually works for this user
  async extractValidatedKnowledge(): Promise<void> {
    console.log("💡 Extracting validated knowledge from successful conversations");
    
    try {
      const extractedKnowledge = await conversationLearningService.extractAndValidateKnowledge(this.userId);
      
      console.log("🎯 Extracted Knowledge:", {
        patternsExtracted: extractedKnowledge.length,
        knowledge: extractedKnowledge.map(k => ({
          title: k.title,
          technology: k.technology,
          confidence: k.confidence
        }))
      });
      
    } catch (error) {
      console.error("Error extracting knowledge:", error);
    }
  }
  
  // Get personalized recommendations for current problem
  async getPersonalizedSuggestions(currentProblem: string): Promise<{
    recommendations: string[];
    avoidApproaches: string[];
    personalizedTips: string[];
    relevantKnowledge: any[];
  }> {
    console.log("🎯 Getting personalized recommendations based on learning history");
    
    try {
      const recommendations = await conversationLearningService.getPersonalizedRecommendations(
        this.userId, 
        currentProblem
      );
      
      console.log("📋 Generated personalized recommendations:", {
        recommendationCount: recommendations.recommendations.length,
        avoidCount: recommendations.avoidApproaches.length,
        relevantKnowledge: recommendations.relevantKnowledge.length
      });
      
      return recommendations;
    } catch (error) {
      console.error("Error getting personalized recommendations:", error);
      return {
        recommendations: [],
        avoidApproaches: [],
        personalizedTips: [],
        relevantKnowledge: []
      };
    }
  }
  
  // Record what didn't work to avoid repetition
  async recordFailure(
    conversationId: number,
    approachDescription: string,
    errorMessage?: string,
    technology?: string,
    userFeedback?: string
  ): Promise<void> {
    console.log("❌ Recording failed approach to prevent repetition");
    
    try {
      await conversationLearningService.recordFailedApproach({
        userId: this.userId,
        conversationId,
        approachDescription,
        errorMessage,
        technology: technology || 'general',
        userFeedback,
        failureReason: "User reported this approach didn't work"
      });
      
      console.log("⚠️ Failed approach recorded:", {
        approach: approachDescription.substring(0, 50) + "...",
        technology,
        conversationId
      });
      
    } catch (error) {
      console.error("Error recording failed approach:", error);
    }
  }
  
  // Get user's learning profile
  async getLearningProfile(): Promise<any> {
    try {
      const profile = await conversationLearningService.getUserLearningProfile(this.userId);
      
      if (profile) {
        console.log("📊 Retrieved learning profile:", {
          totalConversations: profile.totalConversations,
          experienceLevel: profile.experienceLevel,
          primaryLanguages: profile.primaryLanguages?.length || 0,
          frequentMistakes: profile.frequentMistakes?.length || 0
        });
      }
      
      return profile;
    } catch (error) {
      console.error("Error getting learning profile:", error);
      return null;
    }
  }
  
  // Simulate the interface of the old analyzer for backward compatibility
  async recordCodingInteraction(userMessage: string, aiResponse: string, metadata?: any): Promise<void> {
    // This now records REAL conversations instead of just storing in memory
    await this.recordRealConversation(userMessage, aiResponse, metadata);
  }
  
  // Load conversation history - now from database
  async loadConversationHistory(): Promise<void> {
    console.log("🔄 Loading conversation history from database for analysis");
    
    // Trigger analysis of existing patterns
    await this.analyzeUserLearningPatterns();
  }
  
  // Get recent interactions - now from database
  async getRecentInteractions(limit: number = 10): Promise<any[]> {
    // This would query the database for recent conversations
    // For now, return empty array as placeholder
    return [];
  }
  
  // Get insights - now based on real learning data
  async getInsights(): Promise<any> {
    const profile = await this.getLearningProfile();
    
    return {
      totalInteractions: profile?.totalConversations || 0,
      preferredTechnologies: profile?.primaryLanguages || [],
      commonMistakes: profile?.frequentMistakes || [],
      successfulPatterns: profile?.successfulPatterns || [],
      learningTips: "Based on your conversation history, focus on the areas where you've shown repeated questions"
    };
  }
}

export const realCodingAnalyzer = new RealCodingAnalyzer();