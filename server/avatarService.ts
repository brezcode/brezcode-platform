import { db } from "./db";
import { 
  brandCustomers,
  brandCustomerChats,
  type BrandCustomer,
} from "@shared/brand-schema";
import {
  avatarConfigs,
  avatarMemory,
  avatarAnalytics,
  type AvatarConfig,
} from "@shared/avatar-schema";
import { eq, and, desc } from "drizzle-orm";
import { AvatarRequirementsService } from "./avatarRequirementsService";
import OpenAI from "openai";

// HeyGen API configuration
const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
const HEYGEN_BASE_URL = "https://api.heygen.com/v2";

// OpenAI for conversation handling
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export class AvatarService {
  // Create a new interactive avatar session
  static async createAvatarSession(brandId: string, customerId: string, avatarId?: string): Promise<any> {
    if (!HEYGEN_API_KEY) {
      throw new Error("HeyGen API key not configured");
    }

    try {
      const response = await fetch(`${HEYGEN_BASE_URL}/streaming.create_token`, {
        method: "POST",
        headers: {
          "X-API-KEY": HEYGEN_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quality: "high",
          avatar_name: avatarId || "default_avatar",
          voice: {
            voice_id: "en-US-AriaNeural",
            rate: 1.0,
            emotion: "friendly"
          },
          knowledge_base: `You are a helpful AI assistant for this brand. Provide supportive guidance while maintaining a professional tone.`,
          language: "en"
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`HeyGen API error: ${data.message || response.statusText}`);
      }

      // Store session in database
      await db.insert(brandCustomerChats).values({
        brandId,
        customerId,
        sessionId: data.session_id,
        messages: [],
        isActive: true,
      });

      return {
        sessionId: data.session_id,
        accessToken: data.access_token,
        serverUrl: data.server_url,
      };
    } catch (error) {
      console.error("Error creating HeyGen avatar session:", error);
      throw error;
    }
  }

  // Send message to avatar and get response with memory and knowledge
  static async sendMessageToAvatar(
    brandId: string, 
    customerId: string, 
    sessionId: string, 
    message: string,
    language: string = "en"
  ): Promise<any> {
    try {
      // Get conversation history
      const [chat] = await db
        .select()
        .from(brandCustomerChats)
        .where(and(
          eq(brandCustomerChats.brandId, brandId),
          eq(brandCustomerChats.customerId, customerId),
          eq(brandCustomerChats.sessionId, sessionId)
        ))
        .limit(1);

      if (!chat) {
        throw new Error("Chat session not found");
      }

      // Get avatar configuration and memory
      const [config] = await db
        .select()
        .from(avatarConfigs)
        .where(and(
          eq(avatarConfigs.brandId, brandId),
          eq(avatarConfigs.isActive, true)
        ))
        .limit(1);

      if (!config) {
        throw new Error("Avatar configuration not found");
      }

      // Get customer info and memory
      const [customer] = await db
        .select()
        .from(brandCustomers)
        .where(and(
          eq(brandCustomers.brandId, brandId),
          eq(brandCustomers.id, customerId)
        ))
        .limit(1);

      // Get customer memory for this avatar
      const [memory] = await db
        .select()
        .from(avatarMemory)
        .where(and(
          eq(avatarMemory.brandId, brandId),
          eq(avatarMemory.customerId, customerId),
          eq(avatarMemory.configId, config.id)
        ))
        .limit(1);

      // Search knowledge base for relevant information
      const relevantKnowledge = await AvatarRequirementsService.searchKnowledge(
        brandId,
        config.id,
        message
      );

      // Build enhanced conversation context
      const systemPrompt = this.buildEnhancedSystemPrompt(
        config,
        customer,
        memory,
        relevantKnowledge
      );

      const messages = [
        { role: "system", content: systemPrompt },
        ...(chat.messages as any[] || []),
        { role: "user", content: message }
      ];

      // Get AI response
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages as any,
        max_tokens: 500,
        temperature: 0.7,
      });

      const aiResponse = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";

      // Update customer memory
      await this.updateCustomerMemory(
        brandId,
        customerId,
        config.id,
        sessionId,
        message,
        aiResponse,
        memory
      );

      // Send to HeyGen for avatar animation
      if (HEYGEN_API_KEY) {
        const heygenResponse = await fetch(`${HEYGEN_BASE_URL}/streaming.task`, {
          method: "POST",
          headers: {
            "X-API-KEY": HEYGEN_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: sessionId,
            text: aiResponse,
            task_type: "repeat",
          }),
        });

        if (!heygenResponse.ok) {
          console.error("HeyGen streaming error:", await heygenResponse.text());
        }
      }

      // Update conversation history
      const updatedMessages = [
        ...(chat.messages as any[] || []),
        { role: "user", content: message, timestamp: new Date().toISOString() },
        { role: "assistant", content: aiResponse, timestamp: new Date().toISOString() }
      ];

      await db
        .update(brandCustomerChats)
        .set({
          messages: updatedMessages,
          lastMessageAt: new Date(),
        })
        .where(eq(brandCustomerChats.id, chat.id));

      // Track analytics
      await this.trackInteraction(brandId, config.id, customerId, sessionId, 'text', aiResponse);

      return {
        response: aiResponse,
        sessionId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error processing avatar message:", error);
      throw error;
    }
  }

  // Build enhanced system prompt with memory and knowledge  
  private static buildEnhancedSystemPrompt(
    config: AvatarConfig,
    customer: any,
    memory: any,
    relevantKnowledge: any[]
  ): string {
    let prompt = config.systemPrompt || "You are a helpful AI assistant.";

    // Add customer context
    if (customer) {
      prompt += `\n\nCustomer Information:
- Name: ${customer.firstName || 'Customer'}
- Preferences: ${JSON.stringify(customer.preferences || {})}`;
    }

    // Add memory context
    if (memory) {
      prompt += `\n\nCustomer Memory:
- Previous interactions: ${JSON.stringify(memory.memories || {})}
- Learned preferences: ${JSON.stringify(memory.preferences || {})}
- Context: ${JSON.stringify(memory.context || {})}`;
    }

    // Add relevant knowledge
    if (relevantKnowledge.length > 0) {
      prompt += `\n\nRelevant Knowledge:`;
      relevantKnowledge.slice(0, 3).forEach((item, index) => {
        prompt += `\n${index + 1}. ${item.title}: ${item.content}`;
      });
    }

    prompt += `\n\nRemember to:
- Use the customer's name when appropriate
- Reference past conversations if relevant
- Apply learned preferences from memory
- Use knowledge base information when applicable
- Maintain your assigned personality and communication style`;

    return prompt;
  }

  // Update customer memory based on conversation
  private static async updateCustomerMemory(
    brandId: string,
    customerId: string,
    configId: string,
    sessionId: string,
    userMessage: string,
    aiResponse: string,
    existingMemory: any
  ): Promise<void> {
    try {
      // Analyze conversation for memory updates
      const memoryUpdate = await this.analyzeForMemory(userMessage, aiResponse);

      const newMemories = {
        ...(existingMemory?.memories || {}),
        ...memoryUpdate.memories,
      };

      const newPreferences = {
        ...(existingMemory?.preferences || {}),
        ...memoryUpdate.preferences,
      };

      const newContext = {
        lastTopic: memoryUpdate.topic,
        lastSentiment: memoryUpdate.sentiment,
        interactionCount: (existingMemory?.context?.interactionCount || 0) + 1,
        updatedAt: new Date().toISOString(),
      };

      if (existingMemory) {
        // Update existing memory
        await db
          .update(avatarMemory)
          .set({
            memories: newMemories,
            preferences: newPreferences,
            context: newContext,
            lastInteraction: new Date(),
          })
          .where(eq(avatarMemory.id, existingMemory.id));
      } else {
        // Create new memory record
        await db
          .insert(avatarMemory)
          .values({
            brandId,
            customerId,
            configId,
            sessionId,
            memories: newMemories,
            preferences: newPreferences,
            context: newContext,
          });
      }
    } catch (error) {
      console.error("Error updating customer memory:", error);
    }
  }

  // Analyze conversation for memory extraction
  private static async analyzeForMemory(
    userMessage: string,
    aiResponse: string
  ): Promise<any> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{
          role: "user",
          content: `Analyze this conversation for memory extraction:

User: ${userMessage}
Assistant: ${aiResponse}

Extract and return JSON with:
{
  "memories": {}, // Important facts to remember about this customer
  "preferences": {}, // Customer preferences discovered
  "topic": "", // Main topic discussed
  "sentiment": "" // Customer sentiment (positive/neutral/negative)
}

Only include meaningful information that would be useful for future conversations.`
        }],
        max_tokens: 200,
        temperature: 0.3,
      });

      const response = completion.choices[0]?.message?.content;
      return JSON.parse(response || '{}');
    } catch (error) {
      console.error("Error analyzing for memory:", error);
      return {
        memories: {},
        preferences: {},
        topic: "general",
        sentiment: "neutral"
      };
    }
  }

  // Track interaction analytics
  private static async trackInteraction(
    brandId: string,
    configId: string,
    customerId: string,
    sessionId: string,
    interactionType: string,
    response: string
  ): Promise<void> {
    try {
      // Analyze customer satisfaction from response
      const satisfaction = await this.analyzeSatisfaction(response);

      await db
        .insert(avatarAnalytics)
        .values({
          brandId,
          configId,
          customerId,
          sessionId,
          interactionType,
          customerSatisfaction: satisfaction,
          metadata: {
            responseLength: response.length,
            timestamp: new Date().toISOString(),
          },
        });
    } catch (error) {
      console.error("Error tracking interaction:", error);
    }
  }

  // Analyze customer satisfaction
  private static async analyzeSatisfaction(response: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{
          role: "user",
          content: `Analyze the sentiment of this AI response and predict customer satisfaction:

"${response}"

Return only one word: positive, neutral, or negative`
        }],
        max_tokens: 10,
        temperature: 0.1,
      });

      return completion.choices[0]?.message?.content?.trim() || "neutral";
    } catch (error) {
      return "neutral";
    }
  }

  // Get available avatars for a brand
  static async getAvailableAvatars(): Promise<any[]> {
    if (!HEYGEN_API_KEY) {
      return [];
    }

    try {
      const response = await fetch(`${HEYGEN_BASE_URL}/avatars`, {
        headers: {
          "X-API-KEY": HEYGEN_API_KEY,
        },
      });

      const data = await response.json();
      return data.avatars || [];
    } catch (error) {
      console.error("Error fetching HeyGen avatars:", error);
      return [];
    }
  }

  // Create custom avatar from image
  static async createCustomAvatar(brandId: string, name: string, imageUrl: string): Promise<any> {
    if (!HEYGEN_API_KEY) {
      throw new Error("HeyGen API key not configured");
    }

    try {
      const response = await fetch(`${HEYGEN_BASE_URL}/avatars`, {
        method: "POST",
        headers: {
          "X-API-KEY": HEYGEN_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          avatar_name: `${brandId}_${name}`,
          image_url: imageUrl,
          voice_id: "en-US-AriaNeural",
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`HeyGen API error: ${data.message || response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error("Error creating custom avatar:", error);
      throw error;
    }
  }

  // Close avatar session
  static async closeAvatarSession(sessionId: string): Promise<void> {
    if (!HEYGEN_API_KEY) return;

    try {
      await fetch(`${HEYGEN_BASE_URL}/streaming.stop`, {
        method: "POST",
        headers: {
          "X-API-KEY": HEYGEN_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
        }),
      });

      // Mark session as inactive in database
      await db
        .update(brandCustomerChats)
        .set({ isActive: false })
        .where(eq(brandCustomerChats.sessionId, sessionId));
    } catch (error) {
      console.error("Error closing avatar session:", error);
    }
  }

  // Get chat history for customer
  static async getChatHistory(brandId: string, customerId: string): Promise<any[]> {
    const chats = await db
      .select()
      .from(brandCustomerChats)
      .where(and(
        eq(brandCustomerChats.brandId, brandId),
        eq(brandCustomerChats.customerId, customerId)
      ))
      .orderBy(desc(brandCustomerChats.createdAt))
      .limit(10);

    return chats;
  }

  // Voice call integration preparation
  static async prepareVoiceCall(brandId: string, phoneNumber: string, language: string = "en"): Promise<any> {
    // This will be used with Twilio Voice API
    return {
      brandId,
      phoneNumber,
      language,
      timestamp: new Date().toISOString(),
      instructions: `Prepare voice call with HeyGen avatar integration for brand ${brandId}`,
    };
  }
}