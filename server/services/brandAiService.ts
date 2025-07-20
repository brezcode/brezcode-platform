import { db } from '../db';
import { 
  brandKnowledgeBase, 
  brandChatSessions, 
  brandChatMessages, 
  brandAiConfig,
  type BrandKnowledgeBase,
  type BrandChatMessage,
  type BrandAiConfig,
  type InsertBrandKnowledgeBase,
  type InsertBrandChatSession,
  type InsertBrandChatMessage,
  type InsertBrandAiConfig
} from '@shared/schema';
import { eq, and, desc } from 'drizzle-orm';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class BrandAiService {
  // Initialize AI configuration for a brand
  async initializeBrandAi(brandId: string, expertise: string, personality?: string): Promise<BrandAiConfig> {
    const existingConfig = await this.getBrandAiConfig(brandId);
    if (existingConfig) {
      return existingConfig;
    }

    const systemPrompt = this.generateSystemPrompt(expertise, personality);
    
    const [config] = await db.insert(brandAiConfig).values({
      brandId,
      expertise,
      personality,
      systemPrompt,
      assistantName: `${expertise.charAt(0).toUpperCase() + expertise.slice(1)} AI Assistant`,
      disclaimers: [
        'This is educational information only. Always consult your healthcare provider for medical advice.',
        'AI-generated content should not replace professional medical consultation.',
        'If you have urgent health concerns, please contact emergency services.'
      ]
    }).returning();

    return config;
  }

  // Get AI configuration for a brand
  async getBrandAiConfig(brandId: string): Promise<BrandAiConfig | undefined> {
    const [config] = await db
      .select()
      .from(brandAiConfig)
      .where(and(eq(brandAiConfig.brandId, brandId), eq(brandAiConfig.isActive, true)));
    
    return config;
  }

  // Add knowledge to brand's knowledge base
  async addKnowledge(brandId: string, knowledge: Omit<InsertBrandKnowledgeBase, 'id' | 'brandId' | 'createdAt' | 'updatedAt'>): Promise<BrandKnowledgeBase> {
    const [entry] = await db.insert(brandKnowledgeBase).values({
      ...knowledge,
      brandId,
    }).returning();

    return entry;
  }

  // Search brand's knowledge base
  async searchKnowledge(brandId: string, query: string, category?: string): Promise<BrandKnowledgeBase[]> {
    let dbQuery = db
      .select()
      .from(brandKnowledgeBase)
      .where(and(
        eq(brandKnowledgeBase.brandId, brandId),
        eq(brandKnowledgeBase.isActive, true)
      ));

    if (category) {
      dbQuery = dbQuery.where(eq(brandKnowledgeBase.category, category));
    }

    const knowledge = await dbQuery;
    
    // Simple text matching - in production, you'd use vector search
    return knowledge.filter(k => 
      k.content.toLowerCase().includes(query.toLowerCase()) ||
      k.title.toLowerCase().includes(query.toLowerCase()) ||
      k.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }

  // Create or get chat session
  async getOrCreateChatSession(brandId: string, sessionId: string, userId?: string): Promise<void> {
    const existing = await db
      .select()
      .from(brandChatSessions)
      .where(and(
        eq(brandChatSessions.brandId, brandId),
        eq(brandChatSessions.sessionId, sessionId)
      ));

    if (existing.length === 0) {
      await db.insert(brandChatSessions).values({
        brandId,
        sessionId,
        userId,
      });
    } else {
      // Update last active time
      await db
        .update(brandChatSessions)
        .set({ lastActiveAt: new Date() })
        .where(and(
          eq(brandChatSessions.brandId, brandId),
          eq(brandChatSessions.sessionId, sessionId)
        ));
    }
  }

  // Get chat history for session
  async getChatHistory(brandId: string, sessionId: string, limit: number = 10): Promise<BrandChatMessage[]> {
    return await db
      .select()
      .from(brandChatMessages)
      .where(and(
        eq(brandChatMessages.brandId, brandId),
        eq(brandChatMessages.sessionId, sessionId)
      ))
      .orderBy(desc(brandChatMessages.timestamp))
      .limit(limit);
  }

  // Save chat message
  async saveChatMessage(
    brandId: string, 
    sessionId: string, 
    role: 'user' | 'assistant', 
    content: string,
    knowledgeUsed?: string[]
  ): Promise<BrandChatMessage> {
    const [message] = await db.insert(brandChatMessages).values({
      brandId,
      sessionId,
      role,
      content,
      knowledgeUsed,
    }).returning();

    return message;
  }

  // Generate AI response using brand's knowledge and configuration
  async generateResponse(
    brandId: string, 
    sessionId: string, 
    userMessage: string, 
    userId?: string
  ): Promise<{ response: string; knowledgeUsed: string[] }> {
    // Ensure session exists
    await this.getOrCreateChatSession(brandId, sessionId, userId);

    // Save user message
    await this.saveChatMessage(brandId, sessionId, 'user', userMessage);

    // Get brand AI configuration
    const config = await this.getBrandAiConfig(brandId);
    if (!config) {
      throw new Error('Brand AI configuration not found');
    }

    // Search relevant knowledge
    const relevantKnowledge = await this.searchKnowledge(brandId, userMessage);
    
    // Get recent chat history for context
    const chatHistory = await this.getChatHistory(brandId, sessionId, 5);
    
    // Build enhanced system prompt with knowledge
    const enhancedPrompt = this.buildEnhancedPrompt(config, relevantKnowledge);
    
    // Build conversation messages
    const messages = [
      { role: 'system' as const, content: enhancedPrompt },
      ...chatHistory.reverse().map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user' as const, content: userMessage }
    ];

    let aiResponse: string;
    const knowledgeUsed: string[] = relevantKnowledge.map(k => k.id);

    try {
      const completion = await openai.chat.completions.create({
        model: config.model,
        messages,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
      });

      aiResponse = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
    } catch (error: any) {
      console.log("OpenAI API unavailable, providing fallback response");
      
      // Provide fallback response based on brand expertise
      aiResponse = this.generateFallbackResponse(config.expertise, userMessage, relevantKnowledge);
    }

    // Save AI response
    await this.saveChatMessage(brandId, sessionId, 'assistant', aiResponse, knowledgeUsed);

    return { response: aiResponse, knowledgeUsed };
  }

  // Generate system prompt based on expertise
  private generateSystemPrompt(expertise: string, personality?: string): string {
    const basePrompt = `You are a helpful AI assistant specializing in ${expertise}.`;
    
    const expertisePrompts = {
      'breast_health': `
You are a specialized breast health AI assistant. Your role is to provide:
- Educational guidance about breast health
- Step-by-step self-examination instructions
- Lifestyle recommendations for breast health
- Information about screening guidelines
- Support and encouragement for healthy habits

Always include appropriate medical disclaimers and encourage professional medical consultation.`,
      
      'general_health': `
You are a general health and wellness AI assistant. Provide guidance on:
- Nutrition and diet planning
- Exercise and fitness routines
- Preventive health measures
- Stress management techniques
- Sleep and recovery optimization`,
      
      'fitness': `
You are a fitness and exercise AI assistant. Focus on:
- Workout planning and programming
- Exercise form and technique
- Injury prevention
- Nutrition for fitness goals
- Progressive training methods`,
      
      'nutrition': `
You are a nutrition and dietary AI assistant. Provide advice on:
- Meal planning and preparation
- Nutritional requirements
- Healthy eating habits
- Special dietary considerations
- Food safety and preparation`
    };

    const expertisePrompt = expertisePrompts[expertise as keyof typeof expertisePrompts] || basePrompt;
    
    const personalityAddition = personality ? `\n\nPersonality traits: ${personality}` : '';
    
    return expertisePrompt + personalityAddition + `

Key guidelines:
- Be supportive and encouraging
- Provide evidence-based information
- Use clear, easy-to-understand language
- Always recommend professional consultation for medical concerns
- Be conversational and empathetic`;
  }

  // Build enhanced prompt with knowledge base
  private buildEnhancedPrompt(config: BrandAiConfig, knowledge: BrandKnowledgeBase[]): string {
    let prompt = config.systemPrompt || this.generateSystemPrompt(config.expertise, config.personality);

    if (knowledge.length > 0) {
      prompt += '\n\nRelevant knowledge base information:\n';
      knowledge.forEach(k => {
        prompt += `\n- ${k.title}: ${k.content.substring(0, 300)}...`;
      });
      prompt += '\n\nUse this information to provide accurate, helpful responses.';
    }

    if (config.disclaimers && config.disclaimers.length > 0) {
      prompt += '\n\nImportant disclaimers to remember:\n';
      config.disclaimers.forEach(disclaimer => {
        prompt += `- ${disclaimer}\n`;
      });
    }

    return prompt;
  }

  // Generate fallback response when OpenAI is unavailable
  private generateFallbackResponse(expertise: string, message: string, knowledge: BrandKnowledgeBase[]): string {
    const lowerMessage = message.toLowerCase();
    
    // Use knowledge base for fallback if available
    if (knowledge.length > 0) {
      const relevantKnowledge = knowledge[0]; // Use most relevant
      return `Based on our knowledge base: ${relevantKnowledge.content.substring(0, 500)}...

Please remember: This is educational information only. Always consult your healthcare provider for medical advice.`;
    }

    // Expertise-specific fallback responses
    const fallbackResponses = {
      'breast_health': `I'm here to help with breast health guidance. I can provide information about self-examinations, lifestyle recommendations, and general breast health education. For specific medical concerns, please consult with your healthcare provider.`,
      
      'general_health': `I'm your health and wellness assistant. I can help with nutrition guidance, exercise recommendations, and general wellness tips. For specific health concerns, please consult with a healthcare professional.`,
      
      'fitness': `I'm here to help with your fitness journey. I can assist with workout planning, exercise techniques, and fitness goals. Let me know what specific area you'd like to focus on.`,
      
      'nutrition': `I'm your nutrition assistant. I can help with meal planning, nutritional guidance, and healthy eating tips. What specific nutrition topic would you like to explore?`
    };

    return fallbackResponses[expertise as keyof typeof fallbackResponses] || 
           `I'm here to help with ${expertise} related questions. How can I assist you today?`;
  }

  // Bulk upload knowledge from file content
  async uploadKnowledgeFromFile(
    brandId: string, 
    fileName: string, 
    fileType: string, 
    content: string, 
    category: string = 'general'
  ): Promise<BrandKnowledgeBase[]> {
    // Split content into chunks (you might want to use more sophisticated chunking)
    const chunks = this.chunkContent(content, 1000);
    
    const knowledgeEntries: BrandKnowledgeBase[] = [];
    
    for (let i = 0; i < chunks.length; i++) {
      const entry = await this.addKnowledge(brandId, {
        title: `${fileName} - Part ${i + 1}`,
        content: chunks[i],
        category,
        fileType,
        fileName,
        tags: [fileType, category, 'uploaded'],
      });
      
      knowledgeEntries.push(entry);
    }
    
    return knowledgeEntries;
  }

  // Simple content chunking (can be improved with semantic chunking)
  private chunkContent(content: string, maxChunkSize: number): string[] {
    const chunks: string[] = [];
    const sentences = content.split(/[.!?]+/);
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > maxChunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence + '. ';
      }
    }
    
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  }
}

export const brandAiService = new BrandAiService();