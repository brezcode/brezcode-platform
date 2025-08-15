import { db } from "./db";
import { 
  conversationHistory, 
  userLearningProfile, 
  extractedKnowledge, 
  failedApproaches, 
  conversationFeedback,
  type InsertConversationHistory,
  type ConversationHistory,
  type UserLearningProfile,
  type InsertUserLearningProfile,
  type ExtractedKnowledge,
  type InsertExtractedKnowledge,
  type InsertFailedApproach,
  type InsertConversationFeedback
} from "@shared/schema";
import { eq, desc, and, sql, avg, count } from "drizzle-orm";
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const DEFAULT_MODEL_STR = "claude-sonnet-4-20250514";

export class ConversationLearningService {
  
  // STEP 1: Store every real conversation
  async recordConversation(data: {
    userId: number;
    sessionId: string;
    userMessage: string;
    aiResponse: string;
    messageType?: string;
    technology?: string;
    problemType?: string;
    userAgent?: string;
    ipAddress?: string;
  }): Promise<ConversationHistory> {
    console.log("📝 Recording real conversation for learning analysis");
    
    // Auto-detect technology and problem type if not provided
    const technology = data.technology || this.detectTechnology(data.userMessage + " " + data.aiResponse);
    const problemType = data.problemType || this.classifyProblemType(data.userMessage);
    const messageType = data.messageType || this.classifyMessageType(data.userMessage);
    
    const conversation = await db.insert(conversationHistory).values({
      userId: data.userId,
      sessionId: data.sessionId,
      userMessage: data.userMessage,
      aiResponse: data.aiResponse,
      messageType,
      technology,
      problemType,
      responseLength: data.aiResponse.length,
      codeExamplesCount: this.countCodeBlocks(data.aiResponse),
      userAgent: data.userAgent,
      ipAddress: data.ipAddress,
    }).returning();
    
    // Update user's conversation count
    await this.updateUserLearningStats(data.userId);
    
    return conversation[0];
  }
  
  // STEP 2: Analyze what the user actually struggles with
  async analyzeUserPatterns(userId: number, limitDays: number = 30): Promise<{
    commonMistakes: string[];
    successfulPatterns: string[];
    preferredTechnologies: string[];
    difficultyAreas: string[];
    communicationPreferences: any;
  }> {
    console.log("🧠 Analyzing user conversation patterns for personalized learning");
    
    // Get recent conversations
    const recentConversations = await db
      .select()
      .from(conversationHistory)
      .where(eq(conversationHistory.userId, userId))
      .orderBy(desc(conversationHistory.timestamp))
      .limit(100);
    
    if (recentConversations.length < 3) {
      return {
        commonMistakes: [],
        successfulPatterns: [],
        preferredTechnologies: [],
        difficultyAreas: [],
        communicationPreferences: { needsMoreData: true }
      };
    }
    
    // Use Claude to analyze patterns
    const analysisPrompt = `
Analyze these coding conversations to understand this user's learning patterns and preferences:

${recentConversations.map((conv, i) => `
Conversation ${i + 1}:
User: ${conv.userMessage.substring(0, 300)}
AI: ${conv.aiResponse.substring(0, 300)}
Technology: ${conv.technology}
Problem Type: ${conv.problemType}
Helpful: ${conv.wasHelpful ?? 'unknown'}
Follow-up needed: ${conv.followupNeeded ?? 'unknown'}
---
`).join('\n')}

Provide detailed analysis in JSON format:
{
  "commonMistakes": ["specific mistakes this user makes repeatedly"],
  "successfulPatterns": ["approaches that work well for this user"],
  "preferredTechnologies": ["technologies user works with most"],
  "difficultyAreas": ["concepts user struggles with"],
  "communicationPreferences": {
    "prefersDetailedExplanations": boolean,
    "needsMoreCodeExamples": boolean,
    "respondsWellToStepByStep": boolean,
    "skillLevel": "beginner|intermediate|advanced",
    "learningStyle": "visual|practical|theoretical"
  },
  "avoidRecommending": ["approaches that didn't work for this user"],
  "personalizedTips": ["specific advice for helping this user learn better"]
}`;

    try {
      const response = await anthropic.messages.create({
        model: DEFAULT_MODEL_STR,
        max_tokens: 2000,
        messages: [{ role: 'user', content: analysisPrompt }]
      });

      let cleanResponse = response.content[0].text.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      }

      const analysis = JSON.parse(cleanResponse);
      
      // Store the analysis in user learning profile
      await this.updateUserLearningProfile(userId, analysis);
      
      return analysis;
    } catch (error) {
      console.error("Error analyzing user patterns:", error);
      return {
        commonMistakes: [],
        successfulPatterns: [],
        preferredTechnologies: [],
        difficultyAreas: [],
        communicationPreferences: { error: true }
      };
    }
  }
  
  // STEP 3: Extract knowledge that actually works
  async extractAndValidateKnowledge(userId: number): Promise<ExtractedKnowledge[]> {
    console.log("💡 Extracting validated knowledge from successful conversations");
    
    // Get conversations marked as helpful
    const successfulConversations = await db
      .select()
      .from(conversationHistory)
      .where(
        and(
          eq(conversationHistory.userId, userId),
          eq(conversationHistory.wasHelpful, true),
          eq(conversationHistory.errorResolved, true)
        )
      )
      .orderBy(desc(conversationHistory.timestamp))
      .limit(50);
    
    if (successfulConversations.length === 0) {
      return [];
    }
    
    const extractionPrompt = `
Extract reusable knowledge from these successful coding conversations.
Only extract patterns that actually worked and resolved the user's problems:

${successfulConversations.map((conv, i) => `
Successful Resolution ${i + 1}:
User Problem: ${conv.userMessage}
Working Solution: ${conv.aiResponse}
Technology: ${conv.technology}
---
`).join('\n')}

Extract validated knowledge in JSON format:
{
  "patterns": [
    {
      "title": "specific pattern name",
      "description": "what makes this pattern effective",
      "technology": "primary technology",
      "codeExample": "working code example",
      "tags": ["relevant", "tags"],
      "confidence": 0.9,
      "useCase": "when to apply this pattern"
    }
  ],
  "antiPatterns": [
    {
      "title": "what not to do",
      "description": "why this approach fails",
      "technology": "technology",
      "badExample": "problematic code",
      "betterApproach": "recommended alternative"
    }
  ]
}

Only include patterns that were actually proven to work for this specific user.`;

    try {
      const response = await anthropic.messages.create({
        model: DEFAULT_MODEL_STR,
        max_tokens: 3000,
        messages: [{ role: 'user', content: extractionPrompt }]
      });

      let cleanResponse = response.content[0].text.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      }

      const extracted = JSON.parse(cleanResponse);
      const storedKnowledge: ExtractedKnowledge[] = [];
      
      // Store successful patterns
      if (extracted.patterns) {
        for (const pattern of extracted.patterns) {
          const knowledge = await db.insert(extractedKnowledge).values({
            userId,
            knowledgeType: 'pattern',
            title: pattern.title,
            description: pattern.description,
            content: pattern,
            codeExample: pattern.codeExample,
            technology: pattern.technology,
            tags: pattern.tags,
            confidence: pattern.confidence || 0.8,
            sourceConversationId: successfulConversations[0].id,
          }).returning();
          
          storedKnowledge.push(knowledge[0]);
        }
      }
      
      // Store anti-patterns (what not to do)
      if (extracted.antiPatterns) {
        for (const antiPattern of extracted.antiPatterns) {
          await db.insert(failedApproaches).values({
            userId,
            approachDescription: antiPattern.title,
            technology: antiPattern.technology,
            failureReason: antiPattern.description,
            alternativeSuggestion: antiPattern.betterApproach,
            context: antiPattern,
          });
        }
      }
      
      return storedKnowledge;
    } catch (error) {
      console.error("Error extracting knowledge:", error);
      return [];
    }
  }
  
  // STEP 4: Record what doesn't work to avoid repeating mistakes
  async recordFailedApproach(data: {
    userId: number;
    conversationId: number;
    approachDescription: string;
    errorMessage?: string;
    technology: string;
    failureReason?: string;
    userFeedback?: string;
    alternativeSuggestion?: string;
  }): Promise<void> {
    console.log("❌ Recording failed approach to avoid future repetition");
    
    await db.insert(failedApproaches).values({
      userId: data.userId,
      conversationId: data.conversationId,
      approachDescription: data.approachDescription,
      errorMessage: data.errorMessage,
      technology: data.technology,
      failureReason: data.failureReason,
      userFeedback: data.userFeedback,
      alternativeSuggestion: data.alternativeSuggestion,
    });
    
    // Update user learning profile to avoid this approach
    const profile = await this.getUserLearningProfile(data.userId);
    if (profile) {
      const avoidedApproaches = profile.avoidedApproaches || [];
      if (!avoidedApproaches.includes(data.approachDescription)) {
        avoidedApproaches.push(data.approachDescription);
        
        await db.update(userLearningProfile)
          .set({ 
            avoidedApproaches,
            updatedAt: new Date()
          })
          .where(eq(userLearningProfile.userId, data.userId));
      }
    }
  }
  
  // STEP 5: Get personalized recommendations based on learning history
  async getPersonalizedRecommendations(userId: number, currentProblem: string): Promise<{
    recommendations: string[];
    avoidApproaches: string[];
    personalizedTips: string[];
    relevantKnowledge: ExtractedKnowledge[];
  }> {
    console.log("🎯 Generating personalized recommendations based on learning history");
    
    // Get user's learning profile
    const profile = await this.getUserLearningProfile(userId);
    
    // Get approaches that failed for this user
    const failedForUser = await db
      .select()
      .from(failedApproaches)
      .where(eq(failedApproaches.userId, userId))
      .limit(20);
    
    // Get knowledge that worked for this user
    const successfulKnowledge = await db
      .select()
      .from(extractedKnowledge)
      .where(
        and(
          eq(extractedKnowledge.userId, userId),
          eq(extractedKnowledge.isActive, true)
        )
      )
      .orderBy(desc(extractedKnowledge.averageHelpfulness))
      .limit(10);
    
    const technology = this.detectTechnology(currentProblem);
    const relevantKnowledge = successfulKnowledge.filter(k => 
      k.technology === technology || 
      k.tags?.some(tag => currentProblem.toLowerCase().includes(tag.toLowerCase()))
    );
    
    return {
      recommendations: this.generateContextualRecommendations(currentProblem, profile, successfulKnowledge),
      avoidApproaches: failedForUser.map(f => f.approachDescription),
      personalizedTips: this.generatePersonalizedTips(profile, currentProblem),
      relevantKnowledge
    };
  }
  
  // Get user's learning profile
  async getUserLearningProfile(userId: number): Promise<UserLearningProfile | null> {
    const profiles = await db
      .select()
      .from(userLearningProfile)
      .where(eq(userLearningProfile.userId, userId));
    
    return profiles[0] || null;
  }
  
  // Update user learning profile with new insights
  private async updateUserLearningProfile(userId: number, analysis: any): Promise<void> {
    const existing = await this.getUserLearningProfile(userId);
    
    if (existing) {
      await db.update(userLearningProfile)
        .set({
          frequentMistakes: analysis.commonMistakes,
          successfulPatterns: analysis.successfulPatterns,
          avoidedApproaches: analysis.avoidRecommending,
          communicationStyle: analysis.communicationPreferences.learningStyle,
          prefersDetailedExplanations: analysis.communicationPreferences.prefersDetailedExplanations,
          prefersCodeExamples: analysis.communicationPreferences.needsMoreCodeExamples,
          prefersStepByStep: analysis.communicationPreferences.respondsWellToStepByStep,
          updatedAt: new Date()
        })
        .where(eq(userLearningProfile.userId, userId));
    } else {
      await db.insert(userLearningProfile).values({
        userId,
        primaryLanguages: analysis.preferredTechnologies,
        experienceLevel: analysis.communicationPreferences.skillLevel,
        frequentMistakes: analysis.commonMistakes,
        successfulPatterns: analysis.successfulPatterns,
        avoidedApproaches: analysis.avoidRecommending,
        communicationStyle: analysis.communicationPreferences.learningStyle,
        prefersDetailedExplanations: analysis.communicationPreferences.prefersDetailedExplanations,
        prefersCodeExamples: analysis.communicationPreferences.needsMoreCodeExamples,
        prefersStepByStep: analysis.communicationPreferences.respondsWellToStepByStep,
      });
    }
  }
  
  // Update conversation count and stats
  private async updateUserLearningStats(userId: number): Promise<void> {
    const profile = await this.getUserLearningProfile(userId);
    if (profile) {
      await db.update(userLearningProfile)
        .set({ 
          totalConversations: (profile.totalConversations || 0) + 1,
          updatedAt: new Date()
        })
        .where(eq(userLearningProfile.userId, userId));
    }
  }
  
  // Helper methods for analysis
  private detectTechnology(content: string): string {
    const lower = content.toLowerCase();
    const technologies = {
      'react': ['react', 'jsx', 'useeffect', 'usestate', 'component'],
      'javascript': ['javascript', 'js', 'async', 'await', 'function'],
      'typescript': ['typescript', 'ts', 'interface', 'type'],
      'node.js': ['express', 'node', 'npm', 'server'],
      'python': ['python', 'py', 'django', 'flask'],
      'css': ['css', 'styling', 'flexbox', 'grid']
    };
    
    for (const [tech, keywords] of Object.entries(technologies)) {
      if (keywords.some(keyword => lower.includes(keyword))) {
        return tech;
      }
    }
    return 'general';
  }
  
  private classifyProblemType(userMessage: string): string {
    const lower = userMessage.toLowerCase();
    if (lower.includes('error') || lower.includes('bug') || lower.includes('fix')) return 'debugging';
    if (lower.includes('how') || lower.includes('tutorial') || lower.includes('learn')) return 'learning';
    if (lower.includes('optimize') || lower.includes('performance')) return 'optimization';
    if (lower.includes('best practice') || lower.includes('recommend')) return 'best-practices';
    return 'general';
  }
  
  private classifyMessageType(userMessage: string): string {
    const lower = userMessage.toLowerCase();
    if (lower.includes('code') || lower.includes('function') || lower.includes('class')) return 'coding';
    if (lower.includes('error') || lower.includes('debug')) return 'debugging';
    if (lower.includes('explain') || lower.includes('understand')) return 'explanation';
    return 'general';
  }
  
  private countCodeBlocks(text: string): number {
    return (text.match(/```/g) || []).length / 2;
  }
  
  private generateContextualRecommendations(problem: string, profile: UserLearningProfile | null, knowledge: ExtractedKnowledge[]): string[] {
    // This would use Claude to generate personalized recommendations
    // based on the user's profile and successful knowledge
    return [
      "Based on your previous successes, try this approach...",
      "Given your learning style, I recommend...",
      "Since you struggled with similar issues before, avoid..."
    ];
  }
  
  private generatePersonalizedTips(profile: UserLearningProfile | null, problem: string): string[] {
    if (!profile) return [];
    
    const tips = [];
    if (profile.prefersCodeExamples) {
      tips.push("I'll provide detailed code examples as you prefer");
    }
    if (profile.prefersStepByStep) {
      tips.push("Let me break this down step-by-step");
    }
    if (profile.frequentMistakes?.length) {
      tips.push(`Watch out for: ${profile.frequentMistakes[0]} (you've encountered this before)`);
    }
    
    return tips;
  }
}

export const conversationLearningService = new ConversationLearningService();