import { db } from '../db';
import { 
  avatarTrainingSessions, 
  avatarTrainingMessages, 
  avatarSessionKnowledge,
  type InsertAvatarTrainingSession,
  type InsertAvatarTrainingMessage,
  type InsertAvatarSessionKnowledge,
  type AvatarTrainingSession,
  type AvatarTrainingMessage
} from '@shared/schema';
import { eq, desc, and } from 'drizzle-orm';
import { ClaudeAvatarService } from './claudeAvatarService';

export class AvatarTrainingSessionService {

  // Create new training session with complete scenario memory
  static async createSession(
    userId: number,
    avatarId: string,
    scenarioId: string,
    businessContext: string,
    scenarioDetails: any
  ): Promise<AvatarTrainingSession> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const sessionData: InsertAvatarTrainingSession = {
      sessionId,
      userId,
      avatarId,
      avatarType: avatarId.replace(/_.*/, ''), // Extract base avatar type
      scenarioId,
      scenarioName: scenarioDetails.name || scenarioId,
      businessContext,
      status: 'active',
      totalMessages: 0,
      scenarioDetails: scenarioDetails, // Store complete scenario configuration
      conversationHistory: [], // Initialize empty conversation history
      currentContext: { 
        phase: 'introduction',
        topics_covered: [],
        customer_mood: scenarioDetails.customerMood || 'neutral',
        objectives_remaining: scenarioDetails.objectives || []
      },
      customerPersona: {
        name: scenarioDetails.customerPersona || 'Anonymous Customer',
        mood: scenarioDetails.customerMood || 'neutral',
        background: scenarioDetails.description || '',
        concerns: scenarioDetails.objectives || []
      },
      performanceMetrics: {
        average_quality: 0,
        response_count: 0,
        improvement_count: 0,
        knowledge_applied: 0
      }
    };

    const [session] = await db.insert(avatarTrainingSessions).values(sessionData).returning();

    // Add system message to initialize session
    await this.addSystemMessage(sessionId, `Training session started with ${avatarId} for scenario: ${scenarioDetails.name}`);

    console.log(`🚀 Starting training session: ${JSON.stringify({ avatarId, scenarioId, businessContext })}`);
    return session;
  }

  // Get session with full conversation history and context
  static async getSession(sessionId: string): Promise<AvatarTrainingSession | null> {
    const [session] = await db
      .select()
      .from(avatarTrainingSessions)
      .where(eq(avatarTrainingSessions.sessionId, sessionId));

    if (!session) return null;

    // Load all messages for this session
    const messages = await db
      .select()
      .from(avatarTrainingMessages)
      .where(eq(avatarTrainingMessages.sessionId, sessionId))
      .orderBy(avatarTrainingMessages.sequenceNumber);

    // Attach messages to session object
    (session as any).messages = messages;

    return session;
  }

    // Get session by numeric ID (for backwards compatibility)
  static async getSessionByNumericId(numericId: number): Promise<AvatarTrainingSession | null> {
      return null;
  }

  // Add message to session with proper memory management
  static async addMessage(
    sessionId: string,
    role: 'customer' | 'avatar' | 'patient' | 'system',
    content: string,
    emotion?: string,
    aiResponseData?: {
      qualityScore?: number;
      responseTime?: number;
      aiModel?: string;
    }
  ): Promise<AvatarTrainingMessage> {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Get current session to update context
    const session = await this.getSession(sessionId);
    if (!session) throw new Error('Session not found');

    // Get current message count for sequence number
    const messageCount = await db
      .select({ count: avatarTrainingMessages.sequenceNumber })
      .from(avatarTrainingMessages)
      .where(eq(avatarTrainingMessages.sessionId, sessionId));

    const sequenceNumber = (messageCount.length || 0) + 1;

    // Prepare message data
    const messageData: InsertAvatarTrainingMessage = {
      sessionId,
      messageId,
      role,
      content,
      emotion,
      sequenceNumber,
      qualityScore: aiResponseData?.qualityScore,
      responseTime: aiResponseData?.responseTime,
      aiModel: aiResponseData?.aiModel,
      conversationContext: session.currentContext as any,
      topicsDiscussed: this.extractTopics(content),
    };

    const [message] = await db.insert(avatarTrainingMessages).values(messageData).returning();

    // Update session with new message and context
    await this.updateSessionContext(sessionId, message);

    return message;
  }

  // Update session context and conversation history
  private static async updateSessionContext(sessionId: string, newMessage: AvatarTrainingMessage): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) return;

    // Update conversation history
    const currentHistory = Array.isArray(session.conversationHistory) ? session.conversationHistory : [];
    const updatedHistory = [...currentHistory, {
      role: newMessage.role,
      content: newMessage.content,
      emotion: newMessage.emotion,
      timestamp: newMessage.createdAt,
      sequenceNumber: newMessage.sequenceNumber
    }];

    // Update current context
    const currentContext = session.currentContext || {};
    const updatedContext = {
      ...currentContext,
      last_message_role: newMessage.role,
      last_message_time: newMessage.createdAt,
      topics_covered: [
        ...((currentContext as any).topics_covered || []),
        ...(Array.isArray(newMessage.topicsDiscussed) ? newMessage.topicsDiscussed : [])
      ].filter((topic, index, arr) => arr.indexOf(topic) === index), // Remove duplicates
      message_count: newMessage.sequenceNumber
    };

    // Update session in database
    await db
      .update(avatarTrainingSessions)
      .set({
        conversationHistory: updatedHistory,
        currentContext: updatedContext,
        totalMessages: newMessage.sequenceNumber,
        lastActiveAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(avatarTrainingSessions.sessionId, sessionId));
  }

  // Generate AI response with full session memory
  static async generateResponse(
    sessionId: string,
    customerMessage: string,
    emotion: string = 'neutral'
  ): Promise<{ content: string; qualityScore: number; responseTime: number }> {
    const startTime = Date.now();

    // Get session with full context
    const session = await this.getSession(sessionId);
    if (!session) throw new Error('Session not found');

    // Build conversation history for AI context
    const conversationHistory = Array.isArray(session.conversationHistory) ? session.conversationHistory : [];

    console.log(`🔄 Generating AI response for ${session.avatarType} - Customer question: "${customerMessage}"`);
    console.log(`🎯 Session context: ${session.businessContext}, Avatar: ${session.avatarType}`);

    try {
      // Fetch scenario data for context
      const scenarioData = await this.getScenarioById(session.scenarioId);
      
      // Get all training memory for this avatar
      const allTrainingMemory = await this.getAllTrainingMemoryForAvatar(session.avatarId, session.userId);

      // Use Claude with full session context, customer message, scenario context, training memory, and knowledge base
      const response = await ClaudeAvatarService.generateAvatarResponse(
        session.avatarType,
        customerMessage,
        conversationHistory,
        session.businessContext,
        scenarioData,
        allTrainingMemory, // Pass complete training history
        session.avatarId // Pass avatar ID for knowledge base search
      );

      const responseTime = Date.now() - startTime;
      console.log(`🎯 Claude generated response for question: "${customerMessage.substring(0, 100)}..."`);

      return {
        content: response.content,
        qualityScore: response.quality_score,
        responseTime
      };
    } catch (error) {
      console.error('AI response generation failed:', error);
      const responseTime = Date.now() - startTime;

      return {
        content: `I apologize, but I'm having technical difficulties right now. Regarding your question "${customerMessage}", please try again in a moment when my systems are restored.`,
        qualityScore: 30,
        responseTime
      };
    }
  }

  // Add system message (for session initialization, etc.)
  static async addSystemMessage(sessionId: string, content: string): Promise<AvatarTrainingMessage> {
    return this.addMessage(sessionId, 'system', content);
  }

  // Continue conversation with AI-generated patient question and Dr. Sakura response
  static async continueConversation(sessionId: string): Promise<AvatarTrainingSession> {
    const session = await this.getSession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const scenario = await this.getScenarioById(session.scenarioId);
    // Get conversation history from database
    const conversationHistory = await db
      .select()
      .from(avatarTrainingMessages) 
      .where(eq(avatarTrainingMessages.sessionId, sessionId))
      .orderBy(avatarTrainingMessages.createdAt);

    // Generate AI patient question using Claude
    const { ClaudeAvatarService } = await import('./claudeAvatarService');
    const patientQuestion = await ClaudeAvatarService.generatePatientQuestion(
      conversationHistory,
      scenario,
      session.avatarId
    );

    // Add the AI-generated patient question to the database
    const customerMessage = await this.addMessage(
      sessionId,
      'customer',
      patientQuestion.question,
      patientQuestion.emotion
    );

    // Generate Dr. Sakura's response to the patient question
    const aiResponse = await this.generateResponse(sessionId, patientQuestion.question);

    // Save Dr. Sakura's response to the database  
    const avatarMessage = await this.addMessage(
      sessionId,
      'avatar',
      aiResponse.content,
      'neutral',
      {
        qualityScore: aiResponse.qualityScore,
        responseTime: aiResponse.responseTime,
        aiModel: 'claude-sonnet-4'
      }
    );

    console.log(`✅ AI Continue conversation completed for session ${sessionId}`);

    // Return updated session
    const updatedSession = await this.getSession(sessionId);
    if (!updatedSession) throw new Error('Failed to retrieve updated session');
    return updatedSession;
  }

  // Complete training session with summary
  static async completeSession(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) return;

    // Generate session summary using AI
    const sessionSummary = await this.generateSessionSummary(session);

    // Calculate session duration
    const sessionDuration = Math.round((Date.now() - new Date(session.startedAt || new Date()).getTime()) / (1000 * 60));

    // Update session as completed
    await db
      .update(avatarTrainingSessions)
      .set({
        status: 'completed',
        completedAt: new Date(),
        sessionDuration,
        sessionSummary: sessionSummary.summary,
        keyAchievements: sessionSummary.achievements,
        areasForImprovement: sessionSummary.improvements,
        nextRecommendations: sessionSummary.recommendations,
        updatedAt: new Date(),
      })
      .where(eq(avatarTrainingSessions.sessionId, sessionId));

    console.log(`✅ Session completed successfully: ${sessionId} (Total sessions: ${await this.getTotalSessionsCount()})`);

    // EVENT-DRIVEN KNOWLEDGE TRANSFER: Only transfer knowledge when session is completed
    try {
      const { KnowledgeTransferService } = await import('./knowledgeTransferService');
      await KnowledgeTransferService.onTrainingSessionCompleted(sessionId, session.userId);
    } catch (error) {
      // Don't fail session completion if knowledge transfer fails
      console.warn('Knowledge transfer failed but session completed successfully:', error);
    }
  }

  // Generate session summary using AI
  private static async generateSessionSummary(session: AvatarTrainingSession): Promise<{
    summary: string;
    achievements: string[];
    improvements: string[];
    recommendations: string[];
  }> {
    try {
      const conversationHistory = Array.isArray(session.conversationHistory) ? session.conversationHistory : [];
      const messageCount = conversationHistory.length;

      return {
        summary: `Training session with ${session.avatarId} focused on ${session.scenarioName}. ${messageCount} messages exchanged with focus on practical application and skill development.`,
        achievements: [
          "Completed scenario-based training",
          "Practiced real-world customer interactions",
          "Applied knowledge in context"
        ],
        improvements: [
          "Continue practicing similar scenarios",
          "Focus on response quality and empathy",
          "Build knowledge base further"
        ],
        recommendations: [
          "Try more challenging scenarios",
          "Practice different customer types",
          "Review session learnings"
        ]
      };
    } catch (error) {
      console.error('Failed to generate session summary:', error);
      return {
        summary: "Training session completed successfully.",
        achievements: ["Completed training scenario"],
        improvements: ["Continue practicing"],
        recommendations: ["Try additional scenarios"]
      };
    }
  }

  // Get all sessions for a user
  static async getUserSessions(userId: number): Promise<AvatarTrainingSession[]> {
    return db
      .select()
      .from(avatarTrainingSessions)
      .where(eq(avatarTrainingSessions.userId, userId))
      .orderBy(desc(avatarTrainingSessions.createdAt));
  }

  // Get total sessions count
  static async getTotalSessionsCount(): Promise<number> {
    const result = await db.select().from(avatarTrainingSessions);
    return result.length;
  }

  // Get scenario by ID from static training scenarios
  static async getScenarioById(scenarioId: string): Promise<any> {
    const { TRAINING_SCENARIOS } = await import('../avatarTrainingScenarios');
    return TRAINING_SCENARIOS.find(scenario => scenario.id === scenarioId) || null;
  }

  // Extract topics from message content
  private static extractTopics(content: string): string[] {
    const topics: string[] = [];
    const topicKeywords = [
      'breast health', 'self-exam', 'mammogram', 'screening', 'lumps',
      'anxiety', 'health concerns', 'prevention', 'early detection',
      'medical advice', 'health coaching', 'wellness', 'symptoms'
    ];

    const lowerContent = content.toLowerCase();
    topicKeywords.forEach(keyword => {
      if (lowerContent.includes(keyword)) {
        topics.push(keyword);
      }
    });

    return topics;
  }

  // Get all training memory for a specific avatar and user (for memory integration)
  static async getAllTrainingMemoryForAvatar(avatarId: string, userId: number): Promise<any[]> {
    try {
      const sessions = await db
        .select()
        .from(avatarTrainingSessions)
        .where(and(
          eq(avatarTrainingSessions.avatarId, avatarId),
          eq(avatarTrainingSessions.userId, userId),
          eq(avatarTrainingSessions.status, 'completed')
        ))
        .orderBy(desc(avatarTrainingSessions.completedAt));

      console.log(`🧠 Retrieved ${sessions.length} completed training sessions for avatar ${avatarId}`);
      return sessions;
    } catch (error) {
      console.error('Error retrieving training memory:', error);
      return [];
    }
  }

  // Get completed sessions for Performance page display
  static async getCompletedSessionsForPerformance(userId: number, businessContext: string = 'brezcode'): Promise<{
    sessionId: string;
    sessionNumber: number;
    scenarioName: string;
    avatarType: string;
    completedAt: Date | null;
    sessionDuration: number | null;
    averageQuality: number;
    totalMessages: number | null;
  }[]> {
    const sessions = await db
      .select()
      .from(avatarTrainingSessions)
      .where(and(
        eq(avatarTrainingSessions.userId, userId),
        eq(avatarTrainingSessions.businessContext, businessContext),
        eq(avatarTrainingSessions.status, 'completed')
      ))
      .orderBy(avatarTrainingSessions.completedAt);

    return sessions.map((session, index) => {
      const performanceMetrics = session.performanceMetrics as any || {};
      return {
        sessionId: session.sessionId,
        sessionNumber: index + 1,
        scenarioName: session.scenarioName || 'Training Session',
        avatarType: session.avatarType,
        completedAt: session.completedAt,
        sessionDuration: session.sessionDuration,
        averageQuality: performanceMetrics.average_quality || 0,
        totalMessages: session.totalMessages
      };
    });
  }

  // Get full session details for Performance page click-through
  static async getSessionDetailsForPerformance(sessionId: string): Promise<{
    session: AvatarTrainingSession;
    messages: AvatarTrainingMessage[];
    scenarioDetails: any;
  } | null> {
    try {
      const session = await this.getSession(sessionId);
      if (!session) return null;

      const messages = await db
        .select()
        .from(avatarTrainingMessages)
        .where(eq(avatarTrainingMessages.sessionId, sessionId))
        .orderBy(avatarTrainingMessages.sequenceNumber);

      const scenarioDetails = session.scenarioDetails;

      return {
        session,
        messages,
        scenarioDetails
      };
    } catch (error) {
      console.error('Error retrieving session details:', error);
      return null;
    }
  }
}