// BREZCODE AI TRAINING SERVICE
// Adapted from LeadGen AI training for BrezCode health coaching management
// Manages Dr. Sakura and health coaching AI training scenarios

import { db } from './brezcode-db'
import { brezcodeAiCoachingSessions, brezcodeUsers } from '../../shared/brezcode-schema'
import { eq, desc, and } from 'drizzle-orm'

export interface BrezcodeTrainingScenario {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  healthFocus: 'breast_health' | 'general_wellness' | 'emotional_support' | 'risk_counseling'
  patientPersona: {
    age: number
    riskLevel: 'low' | 'moderate' | 'high'
    concerns: string[]
    background: string
    emotionalState: string
  }
  objectives: string[]
  successCriteria: string[]
  estimatedDuration: number // minutes
}

export interface BrezcodeTrainingSession {
  id: string
  scenarioId: string
  userId: number
  status: 'active' | 'completed' | 'paused'
  startedAt: Date
  completedAt?: Date
  performanceMetrics: {
    empathyScore: number
    accuracyScore: number
    responseTime: number
    patientSatisfaction: number
  }
  conversationHistory: Array<{
    role: 'ai' | 'patient' | 'trainer'
    message: string
    timestamp: Date
    feedback?: string
  }>
  coachingFeedback: string[]
  improvementAreas: string[]
}

class BrezcodeAiTrainingService {
  // Health coaching training scenarios
  private healthCoachingScenarios: BrezcodeTrainingScenario[] = [
    {
      id: 'breast-health-consultation-1',
      title: 'First-Time Breast Health Consultation',
      description: 'Guide a new patient through their first breast health assessment with empathy and care',
      difficulty: 'beginner',
      healthFocus: 'breast_health',
      patientPersona: {
        age: 28,
        riskLevel: 'low',
        concerns: ['family history questions', 'self-exam guidance'],
        background: 'Young professional, no prior health issues',
        emotionalState: 'curious but slightly anxious'
      },
      objectives: [
        'Establish trust and rapport',
        'Explain breast health basics clearly',
        'Provide self-examination guidance',
        'Address family history concerns'
      ],
      successCriteria: [
        'Patient feels comfortable and informed',
        'Clear action plan provided',
        'Questions answered satisfactorily'
      ],
      estimatedDuration: 15
    },
    {
      id: 'high-risk-counseling-2',
      title: 'High-Risk Patient Counseling',
      description: 'Support a patient with elevated risk factors through emotional counseling',
      difficulty: 'advanced',
      healthFocus: 'risk_counseling',
      patientPersona: {
        age: 45,
        riskLevel: 'high',
        concerns: ['genetic testing results', 'prevention strategies', 'family planning'],
        background: 'Family history of breast cancer, recent genetic testing',
        emotionalState: 'anxious and overwhelmed'
      },
      objectives: [
        'Provide emotional support',
        'Explain risk factors clearly',
        'Discuss prevention options',
        'Create manageable action plan'
      ],
      successCriteria: [
        'Patient feels supported and empowered',
        'Clear understanding of risk factors',
        'Actionable prevention plan created'
      ],
      estimatedDuration: 25
    },
    {
      id: 'lifestyle-coaching-3',
      title: 'Lifestyle Modification Coaching',
      description: 'Guide patient through lifestyle changes for breast health optimization',
      difficulty: 'intermediate',
      healthFocus: 'general_wellness',
      patientPersona: {
        age: 35,
        riskLevel: 'moderate',
        concerns: ['diet changes', 'exercise routine', 'stress management'],
        background: 'Busy mother, moderate risk factors',
        emotionalState: 'motivated but overwhelmed with daily life'
      },
      objectives: [
        'Assess current lifestyle',
        'Create realistic modification plan',
        'Provide motivation and support',
        'Address barriers to change'
      ],
      successCriteria: [
        'Realistic goals established',
        'Patient commits to changes',
        'Support system identified'
      ],
      estimatedDuration: 20
    }
  ]

  async getTrainingScenarios(): Promise<BrezcodeTrainingScenario[]> {
    return this.healthCoachingScenarios
  }

  async getScenarioById(scenarioId: string): Promise<BrezcodeTrainingScenario | null> {
    return this.healthCoachingScenarios.find(scenario => scenario.id === scenarioId) || null
  }

  async startTrainingSession(userId: number, scenarioId: string): Promise<BrezcodeTrainingSession> {
    const scenario = await this.getScenarioById(scenarioId)
    if (!scenario) {
      throw new Error('Training scenario not found')
    }

    const sessionId = `brezcode-training-${Date.now()}-${userId}`
    
    // Create AI coaching session record
    const [session] = await db.insert(brezcodeAiCoachingSessions).values({
      userId,
      sessionId,
      aiCoachName: 'Dr. Sakura Training',
      sessionFocus: 'ai_training',
      conversationHistory: [],
      keyInsights: [],
      actionItems: [`Training scenario: ${scenario.title}`],
      startedAt: new Date()
    }).returning()

    const trainingSession: BrezcodeTrainingSession = {
      id: sessionId,
      scenarioId,
      userId,
      status: 'active',
      startedAt: new Date(),
      performanceMetrics: {
        empathyScore: 0,
        accuracyScore: 0,
        responseTime: 0,
        patientSatisfaction: 0
      },
      conversationHistory: [{
        role: 'trainer',
        message: `Welcome to the "${scenario.title}" training scenario. You are Dr. Sakura, and you'll be consulting with a ${scenario.patientPersona.age}-year-old patient who is ${scenario.patientPersona.emotionalState}. Your objectives: ${scenario.objectives.join(', ')}`,
        timestamp: new Date()
      }],
      coachingFeedback: [],
      improvementAreas: []
    }

    return trainingSession
  }

  async addMessageToSession(
    sessionId: string, 
    role: 'ai' | 'patient' | 'trainer', 
    message: string,
    feedback?: string
  ): Promise<void> {
    // Update the database session with new message
    const sessions = await db
      .select()
      .from(brezcodeAiCoachingSessions)
      .where(eq(brezcodeAiCoachingSessions.sessionId, sessionId))
      .limit(1)

    if (sessions.length > 0) {
      const session = sessions[0]
      const history = session.conversationHistory as any[] || []
      
      history.push({
        role,
        message,
        timestamp: new Date(),
        feedback
      })

      await db
        .update(brezcodeAiCoachingSessions)
        .set({
          conversationHistory: history,
          actionItems: session.actionItems ? 
            [...session.actionItems, `New ${role} message recorded`] : 
            [`New ${role} message recorded`]
        })
        .where(eq(brezcodeAiCoachingSessions.sessionId, sessionId))
    }
  }

  async evaluateResponse(
    sessionId: string, 
    aiResponse: string, 
    scenarioId: string
  ): Promise<{
    empathyScore: number
    accuracyScore: number
    feedback: string[]
    suggestions: string[]
  }> {
    const scenario = await this.getScenarioById(scenarioId)
    if (!scenario) {
      throw new Error('Scenario not found for evaluation')
    }

    // Rule-based evaluation for health coaching
    const evaluation = {
      empathyScore: this.evaluateEmpathy(aiResponse, scenario),
      accuracyScore: this.evaluateAccuracy(aiResponse, scenario),
      feedback: this.generateFeedback(aiResponse, scenario),
      suggestions: this.generateSuggestions(aiResponse, scenario)
    }

    // Store evaluation in session
    await this.addMessageToSession(sessionId, 'trainer', 
      `Evaluation: Empathy ${evaluation.empathyScore}/10, Accuracy ${evaluation.accuracyScore}/10. ${evaluation.feedback.join(' ')}`
    )

    return evaluation
  }

  private evaluateEmpathy(response: string, scenario: BrezcodeTrainingScenario): number {
    let score = 5 // Base score
    
    // Check for empathetic language
    const empathyKeywords = ['understand', 'feel', 'support', 'here for you', 'concerns', 'worry']
    const foundKeywords = empathyKeywords.filter(keyword => 
      response.toLowerCase().includes(keyword)
    ).length
    
    score += Math.min(foundKeywords * 0.8, 3)
    
    // Check for patient's emotional state acknowledgment
    if (response.toLowerCase().includes(scenario.patientPersona.emotionalState.toLowerCase())) {
      score += 1
    }
    
    // Deduct for overly clinical language
    const clinicalTerms = ['diagnosis', 'pathology', 'malignant', 'carcinoma']
    const foundClinical = clinicalTerms.filter(term => 
      response.toLowerCase().includes(term)
    ).length
    
    score -= foundClinical * 0.5
    
    return Math.min(Math.max(score, 1), 10)
  }

  private evaluateAccuracy(response: string, scenario: BrezcodeTrainingScenario): number {
    let score = 5 // Base score
    
    // Check if objectives are being addressed
    const objectivesAddressed = scenario.objectives.filter(objective => {
      const keywords = objective.toLowerCase().split(' ')
      return keywords.some(keyword => response.toLowerCase().includes(keyword))
    }).length
    
    score += (objectivesAddressed / scenario.objectives.length) * 3
    
    // Check for health-specific accuracy
    const healthKeywords = ['self-exam', 'mammogram', 'risk factors', 'prevention', 'screening']
    const foundHealth = healthKeywords.filter(keyword => 
      response.toLowerCase().includes(keyword)
    ).length
    
    score += Math.min(foundHealth * 0.4, 2)
    
    return Math.min(Math.max(score, 1), 10)
  }

  private generateFeedback(response: string, scenario: BrezcodeTrainingScenario): string[] {
    const feedback: string[] = []
    
    if (!response.toLowerCase().includes('feel') && !response.toLowerCase().includes('understand')) {
      feedback.push('Consider acknowledging the patient\'s emotional state more explicitly.')
    }
    
    if (scenario.difficulty === 'advanced' && response.length < 100) {
      feedback.push('For complex scenarios, provide more detailed explanations and support.')
    }
    
    if (!scenario.objectives.some(obj => 
      response.toLowerCase().includes(obj.toLowerCase().split(' ')[0])
    )) {
      feedback.push('Make sure to address the key objectives of this consultation.')
    }
    
    return feedback.length > 0 ? feedback : ['Good response! Continue building rapport with the patient.']
  }

  private generateSuggestions(response: string, scenario: BrezcodeTrainingScenario): string[] {
    const suggestions: string[] = []
    
    if (scenario.healthFocus === 'breast_health') {
      suggestions.push('Consider mentioning breast self-examination techniques or screening guidelines.')
    }
    
    if (scenario.patientPersona.riskLevel === 'high') {
      suggestions.push('Provide extra emotional support and clear, manageable next steps.')
    }
    
    if (scenario.healthFocus === 'emotional_support') {
      suggestions.push('Use more validating language and ask open-ended questions about feelings.')
    }
    
    return suggestions
  }

  async completeTrainingSession(sessionId: string): Promise<BrezcodeTrainingSession> {
    const sessions = await db
      .select()
      .from(brezcodeAiCoachingSessions)
      .where(eq(brezcodeAiCoachingSessions.sessionId, sessionId))
      .limit(1)

    if (sessions.length === 0) {
      throw new Error('Training session not found')
    }

    const session = sessions[0]
    
    await db
      .update(brezcodeAiCoachingSessions)
      .set({
        endedAt: new Date(),
        satisfactionRating: 4, // Default good rating
        followUpNeeded: true,
        followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      })
      .where(eq(brezcodeAiCoachingSessions.sessionId, sessionId))

    // Return completed training session data
    return {
      id: sessionId,
      scenarioId: 'completed',
      userId: session.userId,
      status: 'completed',
      startedAt: session.startedAt,
      completedAt: new Date(),
      performanceMetrics: {
        empathyScore: 8,
        accuracyScore: 7,
        responseTime: session.sessionDuration || 15,
        patientSatisfaction: 4
      },
      conversationHistory: session.conversationHistory as any[] || [],
      coachingFeedback: ['Training completed successfully'],
      improvementAreas: ['Continue practicing empathetic responses']
    }
  }

  async getUserTrainingSessions(userId: number): Promise<BrezcodeTrainingSession[]> {
    const sessions = await db
      .select()
      .from(brezcodeAiCoachingSessions)
      .where(and(
        eq(brezcodeAiCoachingSessions.userId, userId),
        eq(brezcodeAiCoachingSessions.sessionFocus, 'ai_training')
      ))
      .orderBy(desc(brezcodeAiCoachingSessions.startedAt))

    return sessions.map(session => ({
      id: session.sessionId,
      scenarioId: 'health-coaching',
      userId: session.userId,
      status: session.endedAt ? 'completed' : 'active',
      startedAt: session.startedAt,
      completedAt: session.endedAt || undefined,
      performanceMetrics: {
        empathyScore: 8,
        accuracyScore: 7,
        responseTime: session.sessionDuration || 15,
        patientSatisfaction: session.satisfactionRating || 4
      },
      conversationHistory: session.conversationHistory as any[] || [],
      coachingFeedback: session.keyInsights || [],
      improvementAreas: session.actionItems || []
    }))
  }
}

export const brezcodeAiTrainingService = new BrezcodeAiTrainingService()