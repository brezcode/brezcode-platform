import { OpenAI } from 'openai';
import { skincoachDb, skincoachAvatars, skincoachConversations, skincoachUsers, skinAnalysisResults } from '../skincoach-db';
import { eq, and, desc } from 'drizzle-orm';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ConversationContext {
  skinAnalysis?: any;
  userProfile?: any;
  currentConcerns?: string[];
  recommendedProducts?: any[];
}

class SkinCoachAvatarService {
  
  // Get avatar configuration
  async getAvatarConfig(avatarId: string) {
    try {
      const avatar = await skincoachDb
        .select()
        .from(skincoachAvatars)
        .where(eq(skincoachAvatars.avatar_id, avatarId))
        .limit(1);

      if (!avatar.length) {
        throw new Error(`Avatar ${avatarId} not found`);
      }

      return avatar[0];
    } catch (error) {
      console.error('Error fetching avatar config:', error);
      throw error;
    }
  }

  // Create or get conversation
  async getOrCreateConversation(userId: number, avatarId: string) {
    try {
      // Look for existing active conversation
      const existing = await skincoachDb
        .select()
        .from(skincoachConversations)
        .where(
          and(
            eq(skincoachConversations.user_id, userId),
            eq(skincoachConversations.status, 'active')
          )
        )
        .orderBy(desc(skincoachConversations.created_at))
        .limit(1);

      if (existing.length > 0) {
        return existing[0];
      }

      // Create new conversation
      const avatar = await skincoachDb
        .select()
        .from(skincoachAvatars)
        .where(eq(skincoachAvatars.avatar_id, avatarId))
        .limit(1);

      if (!avatar.length) {
        throw new Error(`Avatar ${avatarId} not found`);
      }

      // Get user profile and latest skin analysis for context
      const userProfile = await skincoachDb
        .select()
        .from(skincoachUsers)
        .where(eq(skincoachUsers.id, userId))
        .limit(1);

      const latestAnalysis = await skincoachDb
        .select()
        .from(skinAnalysisResults)
        .where(eq(skinAnalysisResults.user_id, userId))
        .orderBy(desc(skinAnalysisResults.created_at))
        .limit(1);

      const conversationId = `conv_${userId}_${Date.now()}`;

      const context: ConversationContext = {
        userProfile: userProfile[0] || null,
        skinAnalysis: latestAnalysis[0] || null,
        currentConcerns: userProfile[0]?.concerns || [],
        recommendedProducts: [],
      };

      const newConversation = await skincoachDb
        .insert(skincoachConversations)
        .values({
          user_id: userId,
          avatar_id: avatar[0].id,
          conversation_id: conversationId,
          messages: [],
          context,
          status: 'active',
        })
        .returning();

      return newConversation[0];
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  // Generate AI response
  async generateResponse(
    conversationId: string,
    userMessage: string,
    context: ConversationContext
  ): Promise<string> {
    try {
      // Get conversation and avatar details
      const conversation = await skincoachDb
        .select()
        .from(skincoachConversations)
        .where(eq(skincoachConversations.conversation_id, conversationId))
        .limit(1);

      if (!conversation.length) {
        throw new Error('Conversation not found');
      }

      const avatar = await skincoachDb
        .select()
        .from(skincoachAvatars)
        .where(eq(skincoachAvatars.id, conversation[0].avatar_id!))
        .limit(1);

      if (!avatar.length) {
        throw new Error('Avatar not found');
      }

      const avatarConfig = avatar[0];

      // Build system prompt based on avatar configuration and user context
      const systemPrompt = this.buildSystemPrompt(avatarConfig, context);

      // Get conversation history
      const messages = conversation[0].messages || [];
      const conversationHistory = messages.slice(-10); // Last 10 messages for context

      // Prepare messages for OpenAI
      const openaiMessages = [
        { role: 'system' as const, content: systemPrompt },
        ...conversationHistory.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
        { role: 'user' as const, content: userMessage }
      ];

      // Generate response using OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: openaiMessages,
        max_tokens: 500,
        temperature: 0.7,
      });

      const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response at this time. Please try again.';

      return aiResponse;

    } catch (error) {
      console.error('Error generating AI response:', error);
      return 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.';
    }
  }

  // Build system prompt based on avatar config and user context
  private buildSystemPrompt(avatarConfig: any, context: ConversationContext): string {
    let prompt = `You are ${avatarConfig.name}, a ${avatarConfig.role}. 

PERSONALITY TRAITS:
${avatarConfig.personality?.empathetic ? '- You are highly empathetic and understanding' : ''}
${avatarConfig.personality?.professional ? '- You maintain a professional demeanor' : ''}
${avatarConfig.personality?.encouraging ? '- You are encouraging and supportive' : ''}
${avatarConfig.personality?.scientificApproach ? '- You base recommendations on scientific evidence' : ''}

EXPERTISE AREAS:
${avatarConfig.expertise?.map((area: string) => `- ${area}`).join('\n') || ''}

COMMUNICATION STYLE: ${avatarConfig.communication_style}

`;

    // Add user context if available
    if (context.userProfile) {
      const user = context.userProfile;
      prompt += `
USER PROFILE:
- Age: ${user.age_range || 'Not specified'}
- Gender: ${user.gender || 'Not specified'}
- Skin Type: ${user.skin_type || 'Not specified'}
- Main Concerns: ${user.concerns?.join(', ') || 'Not specified'}
- Skin Goals: ${user.goals?.join(', ') || 'Not specified'}
- Current Routine: ${user.routine || 'Not specified'}
- Budget: ${user.budget || 'Not specified'}
- Allergies: ${user.allergies || 'None mentioned'}

`;
    }

    // Add skin analysis context if available
    if (context.skinAnalysis) {
      const analysis = context.skinAnalysis;
      prompt += `
RECENT SKIN ANALYSIS RESULTS:
- Overall Score: ${analysis.overall_score}/100
- Key Concerns: ${analysis.concerns?.join(', ') || 'None identified'}
- Improvement Areas: ${analysis.improvements?.join(', ') || 'None noted'}
- Analysis Date: ${new Date(analysis.created_at).toLocaleDateString()}

SKIN SCORES:
${Object.entries(analysis.scores || {}).map(([key, value]) => `- ${key}: ${value}/100`).join('\n')}

`;
    }

    prompt += `
GUIDELINES:
1. Always provide personalized advice based on the user's specific profile and analysis
2. Reference specific skin scores and concerns when relevant
3. Recommend products that match their skin type, concerns, and budget
4. Explain the science behind your recommendations when appropriate
5. Be encouraging about their skin journey and progress
6. Ask follow-up questions to better understand their needs
7. If asked about specific products, provide evidence-based opinions
8. Always recommend patch testing new products
9. Remind users to consult a dermatologist for serious concerns
10. Keep responses concise but informative (under 200 words typically)

Remember: You are a supportive AI coach, not a replacement for professional medical advice.
`;

    return prompt;
  }

  // Add message to conversation
  async addMessageToConversation(
    conversationId: string,
    message: ChatMessage
  ) {
    try {
      const conversation = await skincoachDb
        .select()
        .from(skincoachConversations)
        .where(eq(skincoachConversations.conversation_id, conversationId))
        .limit(1);

      if (!conversation.length) {
        throw new Error('Conversation not found');
      }

      const currentMessages = conversation[0].messages || [];
      const updatedMessages = [...currentMessages, message];

      await skincoachDb
        .update(skincoachConversations)
        .set({
          messages: updatedMessages,
          updated_at: new Date(),
        })
        .where(eq(skincoachConversations.conversation_id, conversationId));

      return true;
    } catch (error) {
      console.error('Error adding message to conversation:', error);
      throw error;
    }
  }

  // Get conversation history
  async getConversationHistory(conversationId: string) {
    try {
      const conversation = await skincoachDb
        .select()
        .from(skincoachConversations)
        .where(eq(skincoachConversations.conversation_id, conversationId))
        .limit(1);

      if (!conversation.length) {
        throw new Error('Conversation not found');
      }

      return {
        conversation: conversation[0],
        messages: conversation[0].messages || [],
      };
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      throw error;
    }
  }

  // Process chat message (main method)
  async processMessage(
    userId: number,
    avatarId: string,
    userMessage: string
  ) {
    try {
      // Get or create conversation
      const conversation = await this.getOrCreateConversation(userId, avatarId);

      // Create user message
      const userMessageObj: ChatMessage = {
        id: `msg_${Date.now()}_user`,
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString(),
      };

      // Add user message to conversation
      await this.addMessageToConversation(conversation.conversation_id, userMessageObj);

      // Generate AI response
      const aiResponse = await this.generateResponse(
        conversation.conversation_id,
        userMessage,
        conversation.context
      );

      // Create assistant message
      const assistantMessageObj: ChatMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };

      // Add AI response to conversation
      await this.addMessageToConversation(conversation.conversation_id, assistantMessageObj);

      return {
        conversationId: conversation.conversation_id,
        userMessage: userMessageObj,
        assistantMessage: assistantMessageObj,
      };

    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }

  // Get user's recent conversations
  async getUserConversations(userId: number, limit: number = 10) {
    try {
      const conversations = await skincoachDb
        .select()
        .from(skincoachConversations)
        .where(eq(skincoachConversations.user_id, userId))
        .orderBy(desc(skincoachConversations.updated_at))
        .limit(limit);

      return conversations;
    } catch (error) {
      console.error('Error fetching user conversations:', error);
      throw error;
    }
  }
}

export const skincoachAvatarService = new SkinCoachAvatarService();