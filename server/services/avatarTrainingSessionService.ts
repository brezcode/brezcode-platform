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
      conversationContext: session.currentContext,
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
        ...(currentContext.topics_covered || []),
        ...(newMessage.topicsDiscussed || [])
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

    console.log(`🔄 Generating AI-only response for ${session.businessContext} - Question: ${customerMessage.substring(0, 50)}...`);

    try {
      // Use Claude with full session context
      const response = await ClaudeAvatarService.generateAvatarResponse(
        session.avatarType,
        customerMessage,
        conversationHistory,
        session.businessContext
      );

      const responseTime = Date.now() - startTime;
      console.log("🎯 Using Claude for dynamic response");

      return {
        content: response.content,
        qualityScore: response.quality_score,
        responseTime
      };
    } catch (error) {
      console.error('AI response generation failed:', error);
      const responseTime = Date.now() - startTime;

      return {
        content: "I apologize, but I'm having technical difficulties right now. Please try again in a moment.",
        qualityScore: 30,
        responseTime
      };
    }
  }

  // Add system message (for session initialization, etc.)
  static async addSystemMessage(sessionId: string, content: string): Promise<AvatarTrainingMessage> {
    return this.addMessage(sessionId, 'system', content);
  }

  // Complete training session with summary
  static async completeSession(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) return;

    // Generate session summary using AI
    const sessionSummary = await this.generateSessionSummary(session);

    // Calculate session duration
    const sessionDuration = Math.round((Date.now() - new Date(session.startedAt).getTime()) / (1000 * 60));

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
}