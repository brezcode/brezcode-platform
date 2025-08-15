import { db } from '../db';
import { 
  userConversations, 
  userKnowledgeBase, 
  conversationLearningAnalytics,
  type InsertUserConversation,
  type InsertUserKnowledgeBase,
  type InsertConversationLearningAnalytics,
  type UserConversation,
  type UserKnowledgeBase,
  type ConversationLearningAnalytics
} from '@shared/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export class ConversationStorageService {
  // Store conversation message in database
  async storeConversationMessage(messageData: InsertUserConversation): Promise<UserConversation> {
    try {
      const [conversation] = await db
        .insert(userConversations)
        .values(messageData)
        .returning();
      
      console.log(`💾 Stored conversation message: ${messageData.role} - ${messageData.content.substring(0, 50)}...`);
      return conversation;
    } catch (error) {
      console.error('❌ Failed to store conversation message:', error);
      throw error;
    }
  }

  // Extract and store knowledge from conversation
  async extractKnowledgeFromConversation(
    userId: number, 
    conversationId: number, 
    sessionId: string,
    messageContent: string,
    role: string,
    context: any
  ): Promise<UserKnowledgeBase[]> {
    try {
      console.log('🧠 Extracting knowledge from conversation...');
      
      // Use Claude to extract key learning points
      const knowledgeExtractionPrompt = `
Analyze this conversation message and extract valuable knowledge points that should be stored in the user's knowledge base.

Message Role: ${role}
Message Content: ${messageContent}
Context: ${JSON.stringify(context)}

Extract 1-3 key knowledge points from this message. For each knowledge point, provide:
1. Title (brief, descriptive)
2. Category (health, communication, technical, business, personal)
3. Content (detailed explanation)
4. Summary (one sentence)
5. Tags (3-5 relevant keywords)
6. Keywords (searchable terms)
7. Related Topics (connected concepts)
8. Importance (1-10, how important is this knowledge)

Focus on actionable insights, medical information, communication techniques, problem-solving approaches, or learning points that would be valuable for future reference.

Respond in JSON format:
{
  "knowledgePoints": [
    {
      "title": "Knowledge Title",
      "category": "health",
      "content": "Detailed explanation...",
      "summary": "Brief summary",
      "tags": ["tag1", "tag2", "tag3"],
      "keywords": ["keyword1", "keyword2"],
      "relatedTopics": ["topic1", "topic2"],
      "importance": 7
    }
  ]
}
`;

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        messages: [{
          role: "user",
          content: knowledgeExtractionPrompt
        }]
      });

      let responseText = (response.content[0] as any).text;
      
      // Clean up Claude's response if it includes markdown code blocks
      if (responseText.includes('```json')) {
        responseText = responseText.replace(/```json\n?/, '').replace(/\n?```/, '');
      }
      
      const extractedData = JSON.parse(responseText.trim());
      const knowledgeEntries: UserKnowledgeBase[] = [];

      for (const point of extractedData.knowledgePoints) {
        const knowledgeData: InsertUserKnowledgeBase = {
          userId,
          title: point.title,
          category: point.category,
          content: point.content,
          summary: point.summary,
          sourceType: 'conversation',
          sourceConversationId: conversationId,
          sourceSessionId: sessionId,
          tags: point.tags,
          keywords: point.keywords,
          relatedTopics: point.relatedTopics,
          importance: point.importance,
        };

        const [knowledgeEntry] = await db
          .insert(userKnowledgeBase)
          .values(knowledgeData)
          .returning();
          
        knowledgeEntries.push(knowledgeEntry);
        console.log(`📚 Added knowledge: ${point.title}`);
      }

      return knowledgeEntries;
    } catch (error) {
      console.error('❌ Failed to extract knowledge:', error);
      return [];
    }
  }

  // Get user's conversation history
  async getUserConversations(userId: number, limit: number = 50): Promise<UserConversation[]> {
    try {
      const conversations = await db
        .select()
        .from(userConversations)
        .where(eq(userConversations.userId, userId))
        .orderBy(desc(userConversations.createdAt))
        .limit(limit);

      return conversations;
    } catch (error) {
      console.error('❌ Failed to get user conversations:', error);
      return [];
    }
  }

  // Get user's knowledge base
  async getUserKnowledgeBase(userId: number, category?: string): Promise<UserKnowledgeBase[]> {
    try {
      let query = db
        .select()
        .from(userKnowledgeBase)
        .where(eq(userKnowledgeBase.userId, userId));

      if (category) {
        return await db
          .select()
          .from(userKnowledgeBase)
          .where(and(
            eq(userKnowledgeBase.userId, userId),
            eq(userKnowledgeBase.category, category)
          ))
          .orderBy(desc(userKnowledgeBase.importance), desc(userKnowledgeBase.createdAt));
      }

      const knowledge = await query
        .orderBy(desc(userKnowledgeBase.importance), desc(userKnowledgeBase.createdAt));

      return knowledge;
    } catch (error) {
      console.error('❌ Failed to get user knowledge base:', error);
      return [];
    }
  }

  // Search knowledge base
  async searchKnowledgeBase(userId: number, searchQuery: string): Promise<UserKnowledgeBase[]> {
    try {
      const knowledge = await db
        .select()
        .from(userKnowledgeBase)
        .where(and(
          eq(userKnowledgeBase.userId, userId),
          sql`(
            ${userKnowledgeBase.title} ILIKE ${`%${searchQuery}%`} OR
            ${userKnowledgeBase.content} ILIKE ${`%${searchQuery}%`} OR
            ${userKnowledgeBase.summary} ILIKE ${`%${searchQuery}%`}
          )`
        ))
        .orderBy(desc(userKnowledgeBase.importance));

      return knowledge;
    } catch (error) {
      console.error('❌ Failed to search knowledge base:', error);
      return [];
    }
  }

  // Update session analytics
  async updateSessionAnalytics(
    userId: number,
    sessionId: string,
    avatarId: string,
    scenarioId: string,
    businessContext: string,
    sessionData: any
  ): Promise<ConversationLearningAnalytics> {
    try {
      // Check if analytics entry exists for this session
      const existing = await db
        .select()
        .from(conversationLearningAnalytics)
        .where(and(
          eq(conversationLearningAnalytics.userId, userId),
          eq(conversationLearningAnalytics.sessionId, sessionId)
        ));

      const analyticsData: InsertConversationLearningAnalytics = {
        userId,
        sessionId,
        avatarId,
        scenarioId,
        businessContext,
        totalMessages: sessionData.totalMessages || 0,
        averageQualityScore: sessionData.averageQualityScore || '0',
        improvementCount: sessionData.improvementCount || 0,
        knowledgePointsGenerated: sessionData.knowledgePointsGenerated || 0,
        topicsLearned: sessionData.topicsLearned || [],
        skillsImproved: sessionData.skillsImproved || [],
        weaknessesIdentified: sessionData.weaknessesIdentified || [],
        strengthsReinforced: sessionData.strengthsReinforced || [],
        sessionSummary: sessionData.sessionSummary || '',
        learningOutcomes: sessionData.learningOutcomes || [],
        nextRecommendations: sessionData.nextRecommendations || [],
        sessionDuration: sessionData.sessionDuration || 0,
      };

      let analytics: ConversationLearningAnalytics;

      if (existing.length > 0) {
        // Update existing
        [analytics] = await db
          .update(conversationLearningAnalytics)
          .set({
            ...analyticsData,
            updatedAt: new Date(),
          })
          .where(eq(conversationLearningAnalytics.id, existing[0].id))
          .returning();
      } else {
        // Create new
        [analytics] = await db
          .insert(conversationLearningAnalytics)
          .values(analyticsData)
          .returning();
      }

      console.log(`📊 Updated session analytics: ${sessionId}`);
      return analytics;
    } catch (error) {
      console.error('❌ Failed to update session analytics:', error);
      throw error;
    }
  }

  // Get learning analytics for user
  async getUserLearningAnalytics(userId: number): Promise<ConversationLearningAnalytics[]> {
    try {
      const analytics = await db
        .select()
        .from(conversationLearningAnalytics)
        .where(eq(conversationLearningAnalytics.userId, userId))
        .orderBy(desc(conversationLearningAnalytics.createdAt));

      return analytics;
    } catch (error) {
      console.error('❌ Failed to get learning analytics:', error);
      return [];
    }
  }

  // Generate session summary using Claude
  async generateSessionSummary(sessionId: string, userId: number): Promise<string> {
    try {
      // Get all messages from this session
      const messages = await db
        .select()
        .from(userConversations)
        .where(and(
          eq(userConversations.userId, userId),
          eq(userConversations.sessionId, sessionId)
        ))
        .orderBy(userConversations.createdAt);

      if (messages.length === 0) {
        return 'No messages found for this session.';
      }

      const conversationText = messages.map(msg => 
        `${msg.role.toUpperCase()}: ${msg.content}`
      ).join('\n\n');

      const summaryPrompt = `
Analyze this conversation session and provide a comprehensive learning summary.

Conversation:
${conversationText}

Provide a detailed summary including:
1. Key topics discussed
2. Learning outcomes achieved
3. Skills demonstrated or improved
4. Areas for further development
5. Overall session quality and effectiveness

Write a professional, insightful summary that captures the educational value of this conversation.
`;

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: summaryPrompt
        }]
      });

      return (response.content[0] as any).text;
    } catch (error) {
      console.error('❌ Failed to generate session summary:', error);
      return 'Failed to generate session summary.';
    }
  }
}

export const conversationStorageService = new ConversationStorageService();