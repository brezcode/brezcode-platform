import { db } from "./db";
import { 
  avatarRequirements,
  avatarConfigs,
  avatarKnowledge,
  type InsertAvatarRequirements,
  type InsertAvatarConfig,
} from "@shared/avatar-schema";
import { eq, and } from "drizzle-orm";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export class AvatarRequirementsService {
  // Save customer requirements and generate system prompt
  static async saveRequirements(
    brandId: string, 
    customerId: string, 
    requirements: any
  ): Promise<{ id: string; generatedPrompt: string }> {
    try {
      // Generate AI system prompt based on requirements
      const generatedPrompt = await this.generateSystemPrompt(requirements);

      // Save requirements to database
      const [savedRequirement] = await db
        .insert(avatarRequirements)
        .values({
          brandId,
          customerId,
          businessType: requirements.businessType,
          primaryUseCase: requirements.primaryUseCase,
          targetAudience: requirements.targetAudience,
          communicationStyle: requirements.communicationStyle,
          expertise: requirements.expertise,
          languages: requirements.languages,
          personalityTraits: requirements.personalityTraits,
          restrictions: requirements.restrictions || [],
          customInstructions: requirements.customInstructions || '',
          generatedPrompt,
          isCompleted: true,
        })
        .returning();

      return {
        id: savedRequirement.id,
        generatedPrompt,
      };
    } catch (error) {
      console.error("Error saving avatar requirements:", error);
      throw error;
    }
  }

  // Generate personalized system prompt
  static async generateSystemPrompt(requirements: any): Promise<string> {
    const promptGenerationRequest = `
Create a comprehensive system prompt for an AI avatar assistant based on these requirements:

Business Type: ${requirements.businessType}
Primary Use Case: ${requirements.primaryUseCase}
Target Audience: ${requirements.targetAudience}
Communication Style: ${requirements.communicationStyle}
Areas of Expertise: ${requirements.expertise.join(', ')}
Languages: ${requirements.languages.join(', ')}
Personality Traits: ${requirements.personalityTraits.join(', ')}
${requirements.restrictions?.length ? `Restrictions: ${requirements.restrictions.join(', ')}` : ''}
${requirements.customInstructions ? `Custom Instructions: ${requirements.customInstructions}` : ''}

Generate a detailed system prompt that:
1. Defines the avatar's role and expertise
2. Establishes the communication style and personality
3. Sets clear guidelines for interactions
4. Includes any restrictions or limitations
5. Provides context for the target audience
6. Emphasizes brand consistency

The prompt should be professional, comprehensive, and ready to use for training an AI assistant.
`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{
          role: "user",
          content: promptGenerationRequest
        }],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || "Default avatar assistant prompt";
    } catch (error) {
      console.error("Error generating system prompt:", error);
      return this.getDefaultPrompt(requirements);
    }
  }

  // Fallback default prompt if OpenAI fails
  private static getDefaultPrompt(requirements: any): string {
    return `You are a ${requirements.communicationStyle.replace('_', ' ')} AI assistant specializing in ${requirements.primaryUseCase.replace('_', ' ')} for ${requirements.businessType.replace('_', ' ')} businesses.

Your personality traits include: ${requirements.personalityTraits.join(', ')}.

You are knowledgeable in: ${requirements.expertise.join(', ')}.

Your primary audience is: ${requirements.targetAudience.replace('_', ' ')}.

You can communicate in: ${requirements.languages.join(', ')}.

${requirements.restrictions?.length ? `You should NOT: ${requirements.restrictions.join(', ')}.` : ''}

${requirements.customInstructions ? `Special instructions: ${requirements.customInstructions}` : ''}

Always be helpful, accurate, and maintain a professional tone while staying true to your assigned personality and communication style.`;
  }

  // Create avatar configuration from requirements
  static async createAvatarConfig(
    brandId: string,
    requirementsId: string,
    avatarName: string,
    heygenAvatarId?: string
  ): Promise<string> {
    try {
      // Get the requirements
      const [requirement] = await db
        .select()
        .from(avatarRequirements)
        .where(eq(avatarRequirements.id, requirementsId))
        .limit(1);

      if (!requirement) {
        throw new Error("Requirements not found");
      }

      // Create avatar configuration
      const [config] = await db
        .insert(avatarConfigs)
        .values({
          brandId,
          avatarName,
          heygenAvatarId: heygenAvatarId || 'default_avatar',
          voiceId: this.getVoiceId(requirement.languages[0] as string),
          personality: {
            traits: requirement.personalityTraits,
            communicationStyle: requirement.communicationStyle,
            targetAudience: requirement.targetAudience,
          },
          knowledgeBase: {
            expertise: requirement.expertise,
            restrictions: requirement.restrictions,
            customInstructions: requirement.customInstructions,
          },
          systemPrompt: requirement.generatedPrompt || '',
          languages: requirement.languages,
          isActive: true,
        })
        .returning();

      // Create default knowledge entries
      await this.createDefaultKnowledge(brandId, config.id, requirement.expertise as string[]);

      return config.id;
    } catch (error) {
      console.error("Error creating avatar config:", error);
      throw error;
    }
  }

  // Create default knowledge base entries
  private static async createDefaultKnowledge(
    brandId: string,
    configId: string,
    expertise: string[]
  ): Promise<void> {
    const defaultKnowledge = [
      {
        title: "Welcome & Introduction",
        content: "I'm your AI assistant, here to help you with any questions or concerns you may have. I'm knowledgeable in various areas and ready to provide personalized assistance.",
        category: "general",
        tags: ["welcome", "introduction"],
      },
      {
        title: "How I Can Help",
        content: `I specialize in ${expertise.join(', ')} and can assist you with a wide range of topics. Feel free to ask me questions, request information, or seek guidance on any relevant matters.`,
        category: "capabilities",
        tags: ["help", "services"],
      },
      {
        title: "Getting Started",
        content: "To get the best assistance, please feel free to ask specific questions or describe what you need help with. I'm here to provide accurate, helpful information tailored to your needs.",
        category: "onboarding",
        tags: ["getting-started", "tips"],
      },
    ];

    const knowledgeEntries = defaultKnowledge.map(entry => ({
      brandId,
      configId,
      title: entry.title,
      content: entry.content,
      category: entry.category,
      tags: entry.tags,
      isActive: true,
    }));

    await db.insert(avatarKnowledge).values(knowledgeEntries);
  }

  // Get voice ID based on language
  private static getVoiceId(language: string): string {
    const voiceMap: { [key: string]: string } = {
      'en': 'en-US-AriaNeural',
      'es': 'es-ES-AlvaroNeural',
      'fr': 'fr-FR-DeniseNeural',
      'de': 'de-DE-KatjaNeural',
      'zh': 'zh-CN-XiaoxiaoNeural',
      'ja': 'ja-JP-NanamiNeural',
      'ko': 'ko-KR-SunHiNeural',
      'pt': 'pt-BR-FranciscaNeural',
      'it': 'it-IT-ElsaNeural',
      'ru': 'ru-RU-SvetlanaNeural',
      'ar': 'ar-SA-ZariyahNeural',
      'hi': 'hi-IN-SwaraNeural',
    };

    return voiceMap[language] || 'en-US-AriaNeural';
  }

  // Get requirements by customer
  static async getCustomerRequirements(
    brandId: string,
    customerId: string
  ): Promise<any[]> {
    const requirements = await db
      .select()
      .from(avatarRequirements)
      .where(and(
        eq(avatarRequirements.brandId, brandId),
        eq(avatarRequirements.customerId, customerId)
      ))
      .orderBy(avatarRequirements.createdAt);

    return requirements;
  }

  // Update knowledge base
  static async addKnowledge(
    brandId: string,
    configId: string,
    knowledge: {
      title: string;
      content: string;
      category: string;
      tags?: string[];
    }
  ): Promise<string> {
    const [entry] = await db
      .insert(avatarKnowledge)
      .values({
        brandId,
        configId,
        title: knowledge.title,
        content: knowledge.content,
        category: knowledge.category,
        tags: knowledge.tags || [],
        isActive: true,
      })
      .returning();

    return entry.id;
  }

  // Get knowledge base for avatar
  static async getKnowledgeBase(
    brandId: string,
    configId: string
  ): Promise<any[]> {
    const knowledge = await db
      .select()
      .from(avatarKnowledge)
      .where(and(
        eq(avatarKnowledge.brandId, brandId),
        eq(avatarKnowledge.configId, configId),
        eq(avatarKnowledge.isActive, true)
      ))
      .orderBy(avatarKnowledge.category, avatarKnowledge.title);

    return knowledge;
  }

  // Search knowledge base
  static async searchKnowledge(
    brandId: string,
    configId: string,
    query: string
  ): Promise<any[]> {
    try {
      const knowledge = await db
        .select()
        .from(avatarKnowledge)
        .where(and(
          eq(avatarKnowledge.brandId, brandId),
          eq(avatarKnowledge.isActive, true)
        ));

      // Filter by content matching query
      return knowledge.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.content.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))
      );
    } catch (error) {
      console.error("Error searching knowledge:", error);
      return [];
    }
  }
}