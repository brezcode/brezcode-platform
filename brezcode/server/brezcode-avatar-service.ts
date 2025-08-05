// BREZCODE AVATAR SERVICE
// Adapted from LeadGen avatar service for BrezCode health coaching
// Manages Dr. Sakura and health coaching avatars

import { db } from './brezcode-db'
import { brezcodeAiCoachingSessions, brezcodeUsers, brezcodeHealthAssessments } from '../../shared/brezcode-schema'
import { eq, desc, and } from 'drizzle-orm'

export interface BrezcodeAvatarConfig {
  id: string
  name: string
  specialty: 'breast_health' | 'general_wellness' | 'mental_health' | 'nutrition'
  personality: {
    empathy: number // 1-10
    formality: number // 1-10
    encouragement: number // 1-10
    directness: number // 1-10
  }
  expertise: string[]
  communicationStyle: string
  systemPrompt: string
  avatarImageUrl?: string
}

export interface BrezcodeConversationContext {
  userId: number
  userProfile: {
    name: string
    age: number
    riskLevel: 'low' | 'moderate' | 'high'
    concerns: string[]
    lastAssessment?: Date
  }
  conversationHistory: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    emotion?: string
  }>
  currentFocus: 'assessment' | 'coaching' | 'support' | 'education'
  sessionGoals: string[]
}

class BrezcodeAvatarService {
  private avatarConfigs: Map<string, BrezcodeAvatarConfig> = new Map()

  constructor() {
    this.initializeAvatars()
  }

  private initializeAvatars() {
    // Dr. Sakura - Primary breast health specialist
    this.avatarConfigs.set('dr-sakura', {
      id: 'dr-sakura',
      name: 'Dr. Sakura',
      specialty: 'breast_health',
      personality: {
        empathy: 9,
        formality: 6,
        encouragement: 8,
        directness: 7
      },
      expertise: [
        'Breast health assessment',
        'Risk factor analysis',
        'Preventive care guidance',
        'Emotional support',
        'Self-examination techniques',
        'Screening recommendations'
      ],
      communicationStyle: 'Warm, professional, and reassuring with a focus on empowerment and education',
      systemPrompt: `You are Dr. Sakura, a compassionate breast health specialist. You provide personalized guidance, emotional support, and evidence-based health recommendations. Always prioritize patient comfort, understanding, and empowerment. Use warm, encouraging language while maintaining medical accuracy.`
    })

    // Wellness Coach Maya - General wellness and lifestyle
    this.avatarConfigs.set('coach-maya', {
      id: 'coach-maya',
      name: 'Coach Maya',
      specialty: 'general_wellness',
      personality: {
        empathy: 8,
        formality: 4,
        encouragement: 10,
        directness: 6
      },
      expertise: [
        'Lifestyle modification',
        'Exercise planning',
        'Stress management',
        'Habit formation',
        'Goal setting',
        'Motivation coaching'
      ],
      communicationStyle: 'Energetic, supportive, and motivational with practical approach to wellness',
      systemPrompt: `You are Coach Maya, an enthusiastic wellness coach focused on helping people create sustainable healthy habits. You're encouraging, practical, and always ready to help break down big goals into manageable steps.`
    })

    // Nutritionist Elena - Diet and nutrition guidance
    this.avatarConfigs.set('nutritionist-elena', {
      id: 'nutritionist-elena',
      name: 'Elena',
      specialty: 'nutrition',
      personality: {
        empathy: 7,
        formality: 5,
        encouragement: 8,
        directness: 8
      },
      expertise: [
        'Breast health nutrition',
        'Anti-inflammatory diets',
        'Meal planning',
        'Nutritional supplements',
        'Weight management',
        'Food analysis'
      ],
      communicationStyle: 'Knowledgeable, practical, and focused on sustainable nutrition changes',
      systemPrompt: `You are Elena, a registered nutritionist specializing in breast health nutrition. You provide evidence-based dietary recommendations, meal planning, and nutritional guidance tailored to individual needs and preferences.`
    })

    // Counselor Sarah - Mental health and emotional support
    this.avatarConfigs.set('counselor-sarah', {
      id: 'counselor-sarah',
      name: 'Sarah',
      specialty: 'mental_health',
      personality: {
        empathy: 10,
        formality: 3,
        encouragement: 9,
        directness: 5
      },
      expertise: [
        'Anxiety management',
        'Emotional support',
        'Coping strategies',
        'Mindfulness techniques',
        'Stress reduction',
        'Mental wellness'
      ],
      communicationStyle: 'Deeply empathetic, patient, and skilled in emotional validation and support',
      systemPrompt: `You are Sarah, a licensed counselor specializing in health-related anxiety and emotional wellness. You provide a safe space for emotional expression and practical coping strategies.`
    })
  }

  async getAvailableAvatars(): Promise<BrezcodeAvatarConfig[]> {
    return Array.from(this.avatarConfigs.values())
  }

  async getAvatarById(avatarId: string): Promise<BrezcodeAvatarConfig | null> {
    return this.avatarConfigs.get(avatarId) || null
  }

  async startConversation(
    userId: number,
    avatarId: string,
    initialMessage?: string
  ): Promise<string> {
    const avatar = this.avatarConfigs.get(avatarId)
    if (!avatar) {
      throw new Error('Avatar not found')
    }

    // Get user context
    const userContext = await this.getUserContext(userId)
    const sessionId = `brezcode-${avatarId}-${Date.now()}-${userId}`

    // Create new coaching session
    await db.insert(brezcodeAiCoachingSessions).values({
      userId,
      sessionId,
      aiCoachName: avatar.name,
      sessionFocus: this.getSessionFocus(avatar.specialty),
      conversationHistory: initialMessage ? [
        { role: 'user', content: initialMessage, timestamp: new Date() }
      ] : [],
      startedAt: new Date()
    })

    // Generate contextual greeting
    const greeting = this.generateGreeting(avatar, userContext, initialMessage)
    
    // Update session with greeting
    await this.addMessageToSession(sessionId, 'assistant', greeting)

    return sessionId
  }

  async sendMessage(
    sessionId: string,
    userMessage: string
  ): Promise<string> {
    // Get session data
    const sessions = await db
      .select()
      .from(brezcodeAiCoachingSessions)
      .where(eq(brezcodeAiCoachingSessions.sessionId, sessionId))
      .limit(1)

    if (sessions.length === 0) {
      throw new Error('Conversation session not found')
    }

    const session = sessions[0]
    const avatar = Array.from(this.avatarConfigs.values())
      .find(a => a.name === session.aiCoachName)

    if (!avatar) {
      throw new Error('Avatar configuration not found')
    }

    // Add user message to session
    await this.addMessageToSession(sessionId, 'user', userMessage)

    // Get user context for personalized response
    const userContext = await this.getUserContext(session.userId)
    
    // Generate avatar response
    const response = await this.generateAvatarResponse(
      avatar,
      userContext,
      userMessage,
      session.conversationHistory as any[]
    )

    // Add avatar response to session
    await this.addMessageToSession(sessionId, 'assistant', response)

    // Update session insights and action items
    await this.updateSessionInsights(sessionId, userMessage, response)

    return response
  }

  private async getUserContext(userId: number): Promise<BrezcodeConversationContext> {
    // Get user data
    const users = await db
      .select()
      .from(brezcodeUsers)
      .where(eq(brezcodeUsers.id, userId))
      .limit(1)

    // Get latest health assessment
    const assessments = await db
      .select()
      .from(brezcodeHealthAssessments)
      .where(eq(brezcodeHealthAssessments.userId, userId))
      .orderBy(desc(brezcodeHealthAssessments.completedAt))
      .limit(1)

    const user = users[0]
    const latestAssessment = assessments[0]

    return {
      userId,
      userProfile: {
        name: `${user?.firstName || 'User'}`,
        age: 30, // Default or calculate from birth date
        riskLevel: (latestAssessment?.riskCategory as any) || 'low',
        concerns: ['breast health', 'prevention'],
        lastAssessment: latestAssessment?.completedAt
      },
      conversationHistory: [],
      currentFocus: 'coaching',
      sessionGoals: ['Provide health guidance', 'Emotional support']
    }
  }

  private generateGreeting(
    avatar: BrezcodeAvatarConfig,
    userContext: BrezcodeConversationContext,
    initialMessage?: string
  ): string {
    const timeOfDay = new Date().getHours()
    const greeting = timeOfDay < 12 ? 'Good morning' : timeOfDay < 18 ? 'Good afternoon' : 'Good evening'

    switch (avatar.specialty) {
      case 'breast_health':
        return initialMessage 
          ? `${greeting}, ${userContext.userProfile.name}! I'm Dr. Sakura, and I'm here to support you with your breast health journey. I see you mentioned: "${initialMessage}". I'm here to help address your concerns with care and expertise.`
          : `${greeting}, ${userContext.userProfile.name}! I'm Dr. Sakura, your dedicated breast health specialist. I'm here to provide you with personalized guidance, answer your questions, and support you on your health journey. How can I help you today?`

      case 'general_wellness':
        return `${greeting}! I'm Coach Maya, your wellness partner! I'm excited to help you create healthy habits and achieve your wellness goals. What would you like to work on today?`

      case 'nutrition':
        return `${greeting}! I'm Elena, your nutrition specialist. I'm here to help you nourish your body with foods that support your health and well-being. What questions do you have about nutrition today?`

      case 'mental_health':
        return `${greeting}, ${userContext.userProfile.name}. I'm Sarah, and I'm here to provide a safe, supportive space for you. Whether you're feeling anxious, stressed, or just need someone to talk to, I'm here to listen and help. How are you feeling today?`

      default:
        return `${greeting}! I'm ${avatar.name}, and I'm here to support you. How can I help you today?`
    }
  }

  private async generateAvatarResponse(
    avatar: BrezcodeAvatarConfig,
    userContext: BrezcodeConversationContext,
    userMessage: string,
    conversationHistory: any[]
  ): Promise<string> {
    // For now, using rule-based responses
    // In production, this would integrate with Claude/OpenAI

    const messageType = this.classifyMessage(userMessage)
    
    switch (messageType) {
      case 'question_about_risk':
        return this.generateRiskResponse(avatar, userContext, userMessage)
      
      case 'emotional_concern':
        return this.generateEmotionalResponse(avatar, userContext, userMessage)
      
      case 'lifestyle_question':
        return this.generateLifestyleResponse(avatar, userContext, userMessage)
      
      case 'assessment_request':
        return this.generateAssessmentResponse(avatar, userContext, userMessage)
      
      default:
        return this.generateGeneralResponse(avatar, userContext, userMessage)
    }
  }

  private classifyMessage(message: string): string {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('risk') || lowerMessage.includes('chance') || lowerMessage.includes('probability')) {
      return 'question_about_risk'
    }
    
    if (lowerMessage.includes('scared') || lowerMessage.includes('worried') || lowerMessage.includes('anxious')) {
      return 'emotional_concern'
    }
    
    if (lowerMessage.includes('diet') || lowerMessage.includes('exercise') || lowerMessage.includes('lifestyle')) {
      return 'lifestyle_question'
    }
    
    if (lowerMessage.includes('assessment') || lowerMessage.includes('quiz') || lowerMessage.includes('test')) {
      return 'assessment_request'
    }
    
    return 'general'
  }

  private generateRiskResponse(avatar: BrezcodeAvatarConfig, userContext: BrezcodeConversationContext, message: string): string {
    if (avatar.specialty === 'breast_health') {
      return `I understand you're asking about risk factors. Based on your profile, you're currently in the ${userContext.userProfile.riskLevel} risk category. This means you can focus on prevention through healthy lifestyle choices, regular self-exams, and appropriate screening. Remember, even with risk factors, most people don't develop breast cancer. Would you like me to explain what specific factors contribute to your risk level?`
    }
    return `That's a great question about risk. Let me help you understand the factors involved and what you can do to maintain your health.`
  }

  private generateEmotionalResponse(avatar: BrezcodeAvatarConfig, userContext: BrezcodeConversationContext, message: string): string {
    if (avatar.specialty === 'mental_health') {
      return `I hear that you're feeling anxious, and I want you to know that what you're experiencing is completely normal and valid. Many people feel worried about their health, and it shows that you care about taking care of yourself. Let's work together to address these feelings. Can you tell me more about what specifically is causing you the most concern?`
    }
    
    if (avatar.specialty === 'breast_health') {
      return `I completely understand your concerns, and I want you to know that feeling worried about your health is very normal. These feelings show that you're taking an active role in your health, which is wonderful. Let's address your concerns with facts and create a plan that helps you feel more confident and in control. What specific aspect would you like to discuss first?`
    }
    
    return `I understand you're feeling concerned, and that's completely natural. Let's work through this together and focus on what you can control to feel more empowered about your health.`
  }

  private generateLifestyleResponse(avatar: BrezcodeAvatarConfig, userContext: BrezcodeConversationContext, message: string): string {
    if (avatar.specialty === 'nutrition') {
      return `Great question about nutrition! For breast health, I recommend focusing on a diet rich in fruits, vegetables, whole grains, and lean proteins. Foods high in antioxidants like berries, leafy greens, and colorful vegetables are particularly beneficial. Would you like me to help you create a specific meal plan that fits your preferences and lifestyle?`
    }
    
    if (avatar.specialty === 'general_wellness') {
      return `I love that you're thinking about lifestyle changes! Small, sustainable changes can make a big difference in your overall health. Let's start with one area you'd like to focus on - whether that's nutrition, exercise, sleep, or stress management. Which feels most important to you right now?`
    }
    
    return `Lifestyle factors play a crucial role in maintaining good health. Regular exercise, a balanced diet, adequate sleep, and stress management all contribute to your overall well-being. What specific area would you like to focus on?`
  }

  private generateAssessmentResponse(avatar: BrezcodeAvatarConfig, userContext: BrezcodeConversationContext, message: string): string {
    if (avatar.specialty === 'breast_health') {
      return `I'd be happy to help you with a health assessment! Our comprehensive assessment looks at various factors including family history, lifestyle, and personal health information to provide you with personalized recommendations. The assessment takes about 10-15 minutes and gives you a detailed report with actionable insights. Would you like to start the assessment now, or do you have any questions about what it covers?`
    }
    
    return `Assessments are a great way to understand your current health status and get personalized recommendations. I can help guide you through the process and explain what the results mean for you.`
  }

  private generateGeneralResponse(avatar: BrezcodeAvatarConfig, userContext: BrezcodeConversationContext, message: string): string {
    return `Thank you for sharing that with me. I'm here to help you with any questions or concerns you might have about your health. What would you like to explore together today?`
  }

  private getSessionFocus(specialty: string): string {
    switch (specialty) {
      case 'breast_health': return 'risk_discussion'
      case 'general_wellness': return 'lifestyle_coaching'
      case 'nutrition': return 'dietary_guidance'
      case 'mental_health': return 'emotional_support'
      default: return 'general_support'
    }
  }

  private async addMessageToSession(sessionId: string, role: 'user' | 'assistant', content: string): Promise<void> {
    const sessions = await db
      .select()
      .from(brezcodeAiCoachingSessions)
      .where(eq(brezcodeAiCoachingSessions.sessionId, sessionId))
      .limit(1)

    if (sessions.length > 0) {
      const session = sessions[0]
      const history = (session.conversationHistory as any[]) || []
      
      history.push({
        role,
        content,
        timestamp: new Date()
      })

      await db
        .update(brezcodeAiCoachingSessions)
        .set({ conversationHistory: history })
        .where(eq(brezcodeAiCoachingSessions.sessionId, sessionId))
    }
  }

  private async updateSessionInsights(sessionId: string, userMessage: string, avatarResponse: string): Promise<void> {
    const insights = [`User discussed: ${userMessage.substring(0, 50)}...`]
    const actionItems = [`Provided guidance on user's concern`]

    const sessions = await db
      .select()
      .from(brezcodeAiCoachingSessions)
      .where(eq(brezcodeAiCoachingSessions.sessionId, sessionId))
      .limit(1)

    if (sessions.length > 0) {
      const session = sessions[0]
      
      await db
        .update(brezcodeAiCoachingSessions)
        .set({
          keyInsights: [...(session.keyInsights || []), ...insights],
          actionItems: [...(session.actionItems || []), ...actionItems]
        })
        .where(eq(brezcodeAiCoachingSessions.sessionId, sessionId))
    }
  }

  async endConversation(sessionId: string, userFeedback?: string): Promise<void> {
    await db
      .update(brezcodeAiCoachingSessions)
      .set({
        endedAt: new Date(),
        satisfactionRating: userFeedback ? 5 : 4,
        followUpNeeded: true
      })
      .where(eq(brezcodeAiCoachingSessions.sessionId, sessionId))
  }

  async getUserConversations(userId: number): Promise<any[]> {
    return db
      .select()
      .from(brezcodeAiCoachingSessions)
      .where(eq(brezcodeAiCoachingSessions.userId, userId))
      .orderBy(desc(brezcodeAiCoachingSessions.startedAt))
  }
}

export const brezcodeAvatarService = new BrezcodeAvatarService()