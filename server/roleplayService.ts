import { db } from './db';
import { 
  roleplayScenarios, 
  roleplaySessions, 
  roleplayMessages, 
  roleplayFeedback,
  type InsertRoleplayScenario,
  type InsertRoleplaySession,
  type InsertRoleplayMessage,
  type InsertRoleplayFeedback 
} from '../shared/roleplay-schema';
import { eq, and, desc } from 'drizzle-orm';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class RoleplayService {
  // Create a new roleplay scenario
  static async createScenario(scenario: InsertRoleplayScenario) {
    const [newScenario] = await db.insert(roleplayScenarios).values([scenario]).returning();
    return newScenario;
  }

  // Get scenarios for a user
  static async getScenarios(userId: number, assistantId?: number) {
    if (assistantId) {
      return await db.select().from(roleplayScenarios)
        .where(and(eq(roleplayScenarios.userId, userId), eq(roleplayScenarios.assistantId, assistantId)));
    }
    
    return await db.select().from(roleplayScenarios)
      .where(eq(roleplayScenarios.userId, userId));
  }

  // Start a roleplay session
  static async startSession(sessionData: InsertRoleplaySession) {
    const [newSession] = await db.insert(roleplaySessions).values([{
      ...sessionData,
      status: 'running'
    }]).returning();
    return newSession;
  }

  // Get roleplay sessions
  static async getSessions(userId: number, scenarioId?: number) {
    if (scenarioId) {
      return await db.select().from(roleplaySessions)
        .where(and(eq(roleplaySessions.userId, userId), eq(roleplaySessions.scenarioId, scenarioId)))
        .orderBy(desc(roleplaySessions.createdAt));
    }

    return await db.select().from(roleplaySessions)
      .where(eq(roleplaySessions.userId, userId))
      .orderBy(desc(roleplaySessions.createdAt));
  }

  // Get session with messages
  static async getSessionWithMessages(sessionId: number, userId: number) {
    // Get session
    const [session] = await db.select().from(roleplaySessions)
      .where(and(
        eq(roleplaySessions.id, sessionId),
        eq(roleplaySessions.userId, userId)
      ));

    if (!session) {
      throw new Error('Session not found');
    }

    // Get messages
    const messages = await db.select().from(roleplayMessages)
      .where(eq(roleplayMessages.sessionId, sessionId))
      .orderBy(roleplayMessages.timestamp);

    // Get feedback for messages
    const feedback = await db.select().from(roleplayFeedback)
      .where(eq(roleplayFeedback.sessionId, sessionId));

    return {
      session,
      messages: messages.map(msg => ({
        ...msg,
        feedback: feedback.filter(f => f.messageId === msg.id)
      }))
    };
  }

  // Generate customer AI response
  static async generateCustomerResponse(
    customerPersona: string,
    scenario: string,
    conversationHistory: string[],
    objectives: string[]
  ): Promise<string> {
    try {
      const systemPrompt = `You are role-playing as a customer with the following persona: ${customerPersona}

Scenario: ${scenario}

Your objectives as a customer:
${objectives.map(obj => `- ${obj}`).join('\n')}

Stay in character throughout the conversation. Be realistic and challenging but not impossible to help. 
Respond naturally as this type of customer would, showing their personality, concerns, and communication style.

Conversation history:
${conversationHistory.join('\n')}

Generate the next customer response (keep it concise, 1-2 sentences):`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate the customer's next response:" }
        ],
        max_tokens: 150,
        temperature: 0.8,
      });

      return response.choices[0].message.content || "I need more help with this.";
    } catch (error) {
      console.error('Error generating customer response:', error);
      return "Could you please help me with my issue?";
    }
  }

  // Generate assistant response (using existing assistant logic)
  static async generateAssistantResponse(
    assistantId: number,
    customerMessage: string,
    conversationHistory: string[]
  ): Promise<string> {
    try {
      // This would integrate with your existing assistant service
      // For now, using OpenAI directly
      const systemPrompt = `You are a professional customer service assistant. Be helpful, empathetic, and solution-focused.

Conversation history:
${conversationHistory.join('\n')}

Customer message: ${customerMessage}

Provide a professional and helpful response:`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: customerMessage }
        ],
        max_tokens: 200,
        temperature: 0.7,
      });

      return response.choices[0].message.content || "I'm here to help you with that.";
    } catch (error) {
      console.error('Error generating assistant response:', error);
      return "I'm here to help you. Could you please provide more details?";
    }
  }

  // Add message to session
  static async addMessage(messageData: InsertRoleplayMessage) {
    const [newMessage] = await db.insert(roleplayMessages).values([messageData]).returning();
    return newMessage;
  }

  // Complete session
  static async completeSession(sessionId: number, score?: number, notes?: string) {
    const [updatedSession] = await db.update(roleplaySessions)
      .set({
        status: 'completed',
        endTime: new Date(),
        score: score,
        sessionNotes: notes
      })
      .where(eq(roleplaySessions.id, sessionId))
      .returning();

    return updatedSession;
  }

  // Add feedback to message
  static async addFeedback(feedbackData: InsertRoleplayFeedback) {
    const [newFeedback] = await db.insert(roleplayFeedback).values([feedbackData]).returning();
    return newFeedback;
  }

  // Get session statistics
  static async getSessionStats(userId: number) {
    const sessions = await db.select().from(roleplaySessions)
      .where(eq(roleplaySessions.userId, userId));

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const averageScore = sessions
      .filter(s => s.score !== null)
      .reduce((acc, s) => acc + (s.score || 0), 0) / sessions.filter(s => s.score !== null).length || 0;

    return {
      totalSessions,
      completedSessions,
      averageScore: Math.round(averageScore * 10) / 10,
      successRate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0
    };
  }

  // Delete scenario
  static async deleteScenario(scenarioId: number, userId: number) {
    await db.delete(roleplayScenarios)
      .where(and(
        eq(roleplayScenarios.id, scenarioId),
        eq(roleplayScenarios.userId, userId)
      ));
  }

  // Get predefined scenarios
  static getDefaultScenarios() {
    return [
      {
        name: "Angry Customer - Product Issue",
        customerType: "angry",
        scenario: "Customer received a defective product and is frustrated about wasting time and money",
        objectives: ["Resolve the product issue", "Calm the customer", "Offer appropriate compensation"],
        timeframeMins: 15,
      },
      {
        name: "Confused Customer - Technical Support",
        customerType: "confused",
        scenario: "Customer can't figure out how to use a feature and is getting frustrated",
        objectives: ["Understand the specific issue", "Provide clear step-by-step guidance", "Ensure customer success"],
        timeframeMins: 20,
      },
      {
        name: "Price-Sensitive Customer - Sales",
        customerType: "price-sensitive",
        scenario: "Potential customer is interested but thinks the price is too high",
        objectives: ["Demonstrate value proposition", "Find suitable pricing option", "Close the sale"],
        timeframeMins: 25,
      },
      {
        name: "Tech-Savvy Customer - Advanced Features",
        customerType: "tech-savvy",
        scenario: "Customer wants to know about advanced features and integrations",
        objectives: ["Provide detailed technical information", "Suggest optimal configuration", "Upsell premium features"],
        timeframeMins: 30,
      }
    ];
  }
}