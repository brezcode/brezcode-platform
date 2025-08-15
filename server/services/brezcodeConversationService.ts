import { brezcodeDb } from '../brezcode-db';
import { brezcodeUsers } from '../../shared/brezcode-schema';
import { eq, desc } from 'drizzle-orm';

export interface ConversationMessage {
  id: string;
  userId: number;
  role: 'user' | 'avatar';
  content: string;
  timestamp: Date;
  metadata?: {
    empathy?: number;
    medicalAccuracy?: number;
    qualityScore?: number;
    sessionId?: string;
  };
}

export class BrezcodeConversationService {
  // Store conversation message in database
  static async storeMessage(
    userId: number,
    role: 'user' | 'avatar',
    content: string,
    metadata?: any
  ): Promise<void> {
    try {
      // Get or create user's conversation history
      const [user] = await brezcodeDb
        .select()
        .from(brezcodeUsers)
        .where(eq(brezcodeUsers.id, userId));

      if (!user) {
        console.warn(`User ${userId} not found for conversation storage`);
        return;
      }

      // Parse existing conversation history
      let conversationHistory = [];
      if (user.healthProfile) {
        try {
          const healthData = JSON.parse(user.healthProfile as string);
          conversationHistory = healthData.conversationHistory || [];
        } catch (e) {
          console.warn('Error parsing existing health profile:', e);
        }
      }

      // Add new message
      const newMessage: ConversationMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        role,
        content,
        timestamp: new Date(),
        metadata
      };

      conversationHistory.push(newMessage);

      // Keep only last 100 messages to prevent database bloat
      if (conversationHistory.length > 100) {
        conversationHistory = conversationHistory.slice(-100);
      }

      // Update user's health profile with conversation history
      const healthData = user.healthProfile ? JSON.parse(user.healthProfile as string) : {};
      healthData.conversationHistory = conversationHistory;
      healthData.lastConversationUpdate = new Date().toISOString();

      await brezcodeDb
        .update(brezcodeUsers)
        .set({ 
          healthProfile: JSON.stringify(healthData),
          updatedAt: new Date()
        })
        .where(eq(brezcodeUsers.id, userId));

      console.log(`💾 Stored ${role} message for user ${userId} in conversation history`);
    } catch (error) {
      console.error('Error storing conversation message:', error);
    }
  }

  // Get conversation history for a user
  static async getConversationHistory(userId: number): Promise<ConversationMessage[]> {
    try {
      const [user] = await brezcodeDb
        .select()
        .from(brezcodeUsers)
        .where(eq(brezcodeUsers.id, userId));

      if (!user || !user.healthProfile) {
        return [];
      }

      const healthData = JSON.parse(user.healthProfile as string);
      return healthData.conversationHistory || [];
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      return [];
    }
  }

  // Get recent conversation context for AI
  static async getRecentContext(userId: number, messageCount: number = 10): Promise<string> {
    try {
      const history = await this.getConversationHistory(userId);
      const recentMessages = history.slice(-messageCount);

      if (recentMessages.length === 0) {
        return '';
      }

      const contextMessages = recentMessages.map(msg => 
        `${msg.role === 'user' ? 'Patient' : 'Dr. Sakura'}: ${msg.content}`
      ).join('\n');

      return `
📝 RECENT CONVERSATION CONTEXT:
${contextMessages}

Continue this conversation naturally, remembering the previous exchanges.`;
    } catch (error) {
      console.error('Error getting recent context:', error);
      return '';
    }
  }

  // Get conversation statistics
  static async getConversationStats(userId: number): Promise<{
    totalMessages: number;
    userMessages: number;
    avatarMessages: number;
    averageEmpathy?: number;
    averageMedicalAccuracy?: number;
    firstConversation?: Date;
    lastConversation?: Date;
  }> {
    try {
      const history = await this.getConversationHistory(userId);
      
      if (history.length === 0) {
        return {
          totalMessages: 0,
          userMessages: 0,
          avatarMessages: 0
        };
      }

      const userMessages = history.filter(msg => msg.role === 'user').length;
      const avatarMessages = history.filter(msg => msg.role === 'avatar').length;
      
      const avatarMessagesWithScores = history.filter(msg => 
        msg.role === 'avatar' && msg.metadata?.empathy
      );

      const averageEmpathy = avatarMessagesWithScores.length > 0 
        ? avatarMessagesWithScores.reduce((sum, msg) => sum + (msg.metadata?.empathy || 0), 0) / avatarMessagesWithScores.length
        : undefined;

      const averageMedicalAccuracy = avatarMessagesWithScores.length > 0
        ? avatarMessagesWithScores.reduce((sum, msg) => sum + (msg.metadata?.medicalAccuracy || 0), 0) / avatarMessagesWithScores.length
        : undefined;

      return {
        totalMessages: history.length,
        userMessages,
        avatarMessages,
        averageEmpathy,
        averageMedicalAccuracy,
        firstConversation: new Date(history[0].timestamp),
        lastConversation: new Date(history[history.length - 1].timestamp)
      };
    } catch (error) {
      console.error('Error getting conversation stats:', error);
      return {
        totalMessages: 0,
        userMessages: 0,
        avatarMessages: 0
      };
    }
  }
}