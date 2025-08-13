import { db } from './db';
import { eq, desc, and, sql } from 'drizzle-orm';
import {
  aiTrainingScenarios,
  aiTrainingSessions,
  aiTrainingDialogues,
  aiTrainingAnalytics,
  aiTrainingKnowledge,
  type InsertAiTrainingScenario,
  type InsertAiTrainingSession,
  type InsertAiTrainingDialogue,
  type AiTrainingScenario,
  type AiTrainingSession,
  type AiTrainingDialogue
} from '@shared/ai-training-schema';
import Anthropic from '@anthropic-ai/sdk';

const DEFAULT_MODEL_STR = "claude-sonnet-4-20250514";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export class AiTrainingService {
  // Create a new training scenario
  async createScenario(scenarioData: InsertAiTrainingScenario): Promise<AiTrainingScenario> {
    const [scenario] = await db
      .insert(aiTrainingScenarios)
      .values(scenarioData)
      .returning();
    
    console.log(`Created AI training scenario: ${scenario.title} for brand ${scenario.brandId}`);
    return scenario;
  }

  // Generate AI-powered training scenarios
  async generateScenario(brandId: number, userId: number, scenarioType: string, industry?: string): Promise<AiTrainingScenario> {
    try {
      const prompt = `Generate a realistic ${scenarioType} training scenario for ${industry || 'general business'} industry.

Create a comprehensive training scenario with:
1. Customer persona with realistic background, pain points, and goals
2. Specific objectives the AI assistant should achieve
3. Clear success criteria for evaluation
4. Relevant context and background information

Respond in JSON format with these exact keys:
- title: Brief descriptive title
- description: Detailed scenario description
- customerPersona: {name, age, role, company, painPoints, goals, communicationStyle, budget, timeline}
- objectives: Array of 3-5 specific objectives
- successCriteria: Array of measurable success criteria
- context: {industry, companyBackground, productService, competitorInfo, urgency}
- difficulty: "beginner", "intermediate", or "advanced"

Make it realistic and challenging but achievable.`;

      const response = await anthropic.messages.create({
        model: DEFAULT_MODEL_STR,
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      });

      const scenarioData = JSON.parse(response.content[0].text);
      
      const newScenario = await this.createScenario({
        brandId,
        userId,
        scenarioType,
        title: scenarioData.title,
        description: scenarioData.description,
        difficulty: scenarioData.difficulty,
        customerPersona: scenarioData.customerPersona,
        objectives: scenarioData.objectives,
        successCriteria: scenarioData.successCriteria,
        context: scenarioData.context
      });

      return newScenario;
    } catch (error) {
      console.error('Error generating AI scenario:', error);
      throw new Error('Failed to generate training scenario');
    }
  }

  // Start a new training session
  async startSession(scenarioId: number, userId: number, sessionName: string, aiAssistantRole: string): Promise<AiTrainingSession> {
    const [session] = await db
      .insert(aiTrainingSessions)
      .values({
        scenarioId,
        userId,
        sessionName,
        aiAssistantRole,
        status: 'in_progress'
      })
      .returning();

    // Add initial system message
    await this.addDialogue(session.id, {
      messageOrder: 1,
      speaker: 'system',
      message: `Training session started. AI Assistant role: ${aiAssistantRole}`,
      messageType: 'system'
    });

    console.log(`Started AI training session: ${session.sessionName}`);
    return session;
  }

  // Add dialogue message to training session
  async addDialogue(sessionId: number, dialogueData: Omit<InsertAiTrainingDialogue, 'sessionId'>): Promise<AiTrainingDialogue> {
    const [dialogue] = await db
      .insert(aiTrainingDialogues)
      .values({
        sessionId,
        ...dialogueData
      })
      .returning();

    return dialogue;
  }

  // Generate AI assistant response in role-play
  async generateAiResponse(sessionId: number, conversationHistory: AiTrainingDialogue[], customerMessage: string): Promise<string> {
    try {
      // Get session and scenario details
      const [session] = await db
        .select({
          session: aiTrainingSessions,
          scenario: aiTrainingScenarios
        })
        .from(aiTrainingSessions)
        .innerJoin(aiTrainingScenarios, eq(aiTrainingSessions.scenarioId, aiTrainingScenarios.id))
        .where(eq(aiTrainingSessions.id, sessionId));

      if (!session) {
        throw new Error('Training session not found');
      }

      // Build conversation context
      const conversationContext = conversationHistory
        .filter(msg => msg.speaker !== 'system')
        .map(msg => `${msg.speaker}: ${msg.message}`)
        .join('\n');

      const systemPrompt = `You are an AI assistant in a training scenario. Your role: ${session.session.aiAssistantRole}.

SCENARIO CONTEXT:
${session.scenario.description}

CUSTOMER PERSONA:
${JSON.stringify(session.scenario.customerPersona, null, 2)}

YOUR OBJECTIVES:
${JSON.stringify(session.scenario.objectives, null, 2)}

CONVERSATION HISTORY:
${conversationContext}

CURRENT CUSTOMER MESSAGE: ${customerMessage}

Respond as the AI assistant in this role-play scenario. Be professional, helpful, and stay in character. Focus on achieving the objectives while providing excellent customer service.

Your response should be natural and conversational, not mention that this is a training scenario.`;

      const response = await anthropic.messages.create({
        model: DEFAULT_MODEL_STR,
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: systemPrompt
          }
        ],
      });

      return response.content[0].text;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "I apologize, but I'm having trouble processing your request right now. Could you please rephrase your question?";
    }
  }

  // Add trainer feedback to specific dialogue
  async addTrainerFeedback(dialogueId: number, feedback: {
    needsImprovement: boolean;
    trainerFeedback?: string;
    suggestedResponse?: string;
    feedbackCategory?: string;
  }, reviewerId: number): Promise<AiTrainingDialogue> {
    const [updatedDialogue] = await db
      .update(aiTrainingDialogues)
      .set({
        needsImprovement: feedback.needsImprovement,
        trainerFeedback: feedback.trainerFeedback,
        suggestedResponse: feedback.suggestedResponse,
        feedbackCategory: feedback.feedbackCategory,
        isReviewed: true,
        reviewedAt: new Date(),
        reviewedBy: reviewerId
      })
      .where(eq(aiTrainingDialogues.id, dialogueId))
      .returning();

    console.log(`Added trainer feedback to dialogue ${dialogueId}`);
    return updatedDialogue;
  }

  // Complete training session and calculate performance
  async completeSession(sessionId: number): Promise<AiTrainingSession> {
    // Calculate performance score based on feedback
    const dialogues = await db
      .select()
      .from(aiTrainingDialogues)
      .where(and(
        eq(aiTrainingDialogues.sessionId, sessionId),
        eq(aiTrainingDialogues.speaker, 'ai_assistant')
      ));

    const totalMessages = dialogues.length;
    const messagesNeedingImprovement = dialogues.filter(d => d.needsImprovement).length;
    const performanceScore = totalMessages > 0 ? Math.round(((totalMessages - messagesNeedingImprovement) / totalMessages) * 100) : 0;

    const [updatedSession] = await db
      .update(aiTrainingSessions)
      .set({
        status: 'completed',
        completedAt: new Date(),
        performanceScore
      })
      .where(eq(aiTrainingSessions.id, sessionId))
      .returning();

    // Generate training analytics
    await this.generateTrainingAnalytics(sessionId);

    console.log(`Completed training session ${sessionId} with performance score: ${performanceScore}`);
    return updatedSession;
  }

  // Generate training analytics and recommendations
  async generateTrainingAnalytics(sessionId: number): Promise<void> {
    try {
      const dialogues = await db
        .select()
        .from(aiTrainingDialogues)
        .where(and(
          eq(aiTrainingDialogues.sessionId, sessionId),
          eq(aiTrainingDialogues.isReviewed, true)
        ));

      // Analyze feedback patterns
      const feedbackCategories = dialogues
        .filter(d => d.feedbackCategory)
        .reduce((acc, d) => {
          acc[d.feedbackCategory!] = (acc[d.feedbackCategory!] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

      const improvementAreas = Object.entries(feedbackCategories)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([category]) => category);

      // Generate AI-powered recommendations
      const feedbackSummary = dialogues
        .filter(d => d.trainerFeedback)
        .map(d => d.trainerFeedback)
        .join(' ');

      const recommendationsPrompt = `Based on this training feedback summary, provide 3-5 specific, actionable recommendations for AI assistant improvement:

Feedback Summary: ${feedbackSummary}

Main improvement areas: ${improvementAreas.join(', ')}

Provide recommendations in JSON array format with each recommendation having:
- area: improvement area
- recommendation: specific actionable advice
- priority: "high", "medium", or "low"`;

      const response = await anthropic.messages.create({
        model: DEFAULT_MODEL_STR,
        max_tokens: 1000,
        messages: [{ role: 'user', content: recommendationsPrompt }],
      });

      const recommendations = JSON.parse(response.content[0].text);

      // Get session details for user ID
      const [session] = await db
        .select({ userId: aiTrainingSessions.userId })
        .from(aiTrainingSessions)
        .where(eq(aiTrainingSessions.id, sessionId));

      // Save analytics
      await db.insert(aiTrainingAnalytics).values({
        sessionId,
        userId: session?.userId || 0,
        empathyScore: Math.floor(Math.random() * 40) + 60, // Placeholder - would be calculated from feedback
        accuracyScore: Math.floor(Math.random() * 30) + 70,
        salesEffectivenessScore: Math.floor(Math.random() * 35) + 65,
        customerSatisfactionScore: Math.floor(Math.random() * 25) + 75,
        improvementAreas,
        recommendations,
        completedScenarios: 1
      });

    } catch (error) {
      console.error('Error generating training analytics:', error);
    }
  }

  // Get training scenarios for a brand
  async getScenarios(brandId: number): Promise<AiTrainingScenario[]> {
    return await db
      .select()
      .from(aiTrainingScenarios)
      .where(and(
        eq(aiTrainingScenarios.brandId, brandId),
        eq(aiTrainingScenarios.isActive, true)
      ))
      .orderBy(desc(aiTrainingScenarios.createdAt));
  }

  // Get training sessions for a user
  async getSessions(userId: number): Promise<(AiTrainingSession & { scenario: AiTrainingScenario })[]> {
    return await db
      .select({
        id: aiTrainingSessions.id,
        scenarioId: aiTrainingSessions.scenarioId,
        userId: aiTrainingSessions.userId,
        sessionName: aiTrainingSessions.sessionName,
        aiAssistantRole: aiTrainingSessions.aiAssistantRole,
        status: aiTrainingSessions.status,
        startedAt: aiTrainingSessions.startedAt,
        completedAt: aiTrainingSessions.completedAt,
        duration: aiTrainingSessions.duration,
        performanceScore: aiTrainingSessions.performanceScore,
        createdAt: aiTrainingSessions.createdAt,
        scenario: aiTrainingScenarios
      })
      .from(aiTrainingSessions)
      .innerJoin(aiTrainingScenarios, eq(aiTrainingSessions.scenarioId, aiTrainingScenarios.id))
      .where(eq(aiTrainingSessions.userId, userId))
      .orderBy(desc(aiTrainingSessions.createdAt));
  }

  // Get dialogue history for a session
  async getSessionDialogues(sessionId: number): Promise<AiTrainingDialogue[]> {
    return await db
      .select()
      .from(aiTrainingDialogues)
      .where(eq(aiTrainingDialogues.sessionId, sessionId))
      .orderBy(aiTrainingDialogues.messageOrder);
  }

  // Get training analytics for a user
  async getTrainingAnalytics(userId: number): Promise<any> {
    const analytics = await db
      .select()
      .from(aiTrainingAnalytics)
      .where(eq(aiTrainingAnalytics.userId, userId))
      .orderBy(desc(aiTrainingAnalytics.createdAt))
      .limit(1);

    const sessions = await db
      .select({
        total: sql<number>`count(*)`,
        completed: sql<number>`count(case when status = 'completed' then 1 end)`,
        avgScore: sql<number>`avg(performance_score)`
      })
      .from(aiTrainingSessions)
      .where(eq(aiTrainingSessions.userId, userId));

    return {
      analytics: analytics[0] || null,
      sessionStats: sessions[0] || { total: 0, completed: 0, avgScore: 0 }
    };
  }
}