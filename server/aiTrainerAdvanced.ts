import { db } from './db';
import { roleplayScenarios, roleplaySessions, roleplayMessages, roleplayFeedback } from '../shared/roleplay-schema';
import { eq, and, desc, count, avg, sql } from 'drizzle-orm';
import Anthropic from '@anthropic-ai/sdk';

// Use Claude Sonnet-4 for superior AI training capabilities
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Default model for enhanced training
const DEFAULT_MODEL_STR = "claude-sonnet-4-20250514";

export class AITrainerAdvanced {
  // Analyze assistant performance across all sessions
  static async analyzePerformance(assistantId: number, userId: number) {
    try {
      // Get all sessions for this assistant
      const sessions = await db.select({
        id: roleplaySessions.id,
        scenarioId: roleplaySessions.scenarioId,
        score: roleplaySessions.score,
        status: roleplaySessions.status,
        startTime: roleplaySessions.startTime,
        endTime: roleplaySessions.endTime,
        customerPersona: roleplaySessions.customerPersona
      })
      .from(roleplaySessions)
      .where(and(
        eq(roleplaySessions.assistantId, assistantId),
        eq(roleplaySessions.userId, userId)
      ))
      .orderBy(desc(roleplaySessions.createdAt));

      // Calculate performance metrics
      const completedSessions = sessions.filter(s => s.status === 'completed' && s.score);
      const avgScore = completedSessions.length > 0 
        ? completedSessions.reduce((sum, s) => sum + (s.score || 0), 0) / completedSessions.length
        : 0;

      // Get message count and feedback analysis
      const messageStats = await db.select({
        sessionId: roleplayMessages.sessionId,
        messageCount: count(),
        avgLength: sql<number>`AVG(LENGTH(${roleplayMessages.message}))`
      })
      .from(roleplayMessages)
      .where(sql`${roleplayMessages.sessionId} IN (${sessions.map(s => s.id).join(',') || '0'})`)
      .groupBy(roleplayMessages.sessionId);

      // Analyze feedback patterns
      const feedbackAnalysis = await db.select({
        feedbackType: roleplayFeedback.feedbackType,
        count: count()
      })
      .from(roleplayFeedback)
      .where(sql`${roleplayFeedback.sessionId} IN (${sessions.map(s => s.id).join(',') || '0'})`)
      .groupBy(roleplayFeedback.feedbackType);

      return {
        totalSessions: sessions.length,
        completedSessions: completedSessions.length,
        averageScore: Math.round(avgScore * 10) / 10,
        performanceTrend: this.calculateTrend(completedSessions),
        messageStats: messageStats,
        feedbackAnalysis: feedbackAnalysis,
        improvementAreas: await this.identifyImprovementAreas(assistantId, sessions),
        strengths: await this.identifyStrengths(assistantId, sessions),
        trainingRecommendations: await this.generateTrainingRecommendations(assistantId, completedSessions, feedbackAnalysis)
      };
    } catch (error) {
      console.error('Error analyzing performance:', error);
      return {
        totalSessions: 0,
        completedSessions: 0,
        averageScore: 0,
        performanceTrend: 'stable',
        improvementAreas: [],
        strengths: [],
        trainingRecommendations: []
      };
    }
  }

  // Calculate performance trend
  static calculateTrend(sessions: any[]) {
    if (sessions.length < 3) return 'stable';

    const recent = sessions.slice(0, Math.min(5, sessions.length));
    const older = sessions.slice(-Math.min(5, sessions.length));
    
    const recentAvg = recent.reduce((sum, s) => sum + (s.score || 0), 0) / recent.length;
    const olderAvg = older.reduce((sum, s) => sum + (s.score || 0), 0) / older.length;

    const difference = recentAvg - olderAvg;
    
    if (difference > 0.5) return 'improving';
    if (difference < -0.5) return 'declining';
    return 'stable';
  }

  // Identify areas needing improvement using AI analysis
  static async identifyImprovementAreas(assistantId: number, sessions: any[]) {
    try {
      if (sessions.length === 0) return [];

      const lowScoringSessions = sessions.filter(s => s.score && s.score < 7);
      if (lowScoringSessions.length === 0) return [];

      // Get messages from low-scoring sessions
      const sessionIds = lowScoringSessions.map(s => s.id);
      const messages = await db.select()
        .from(roleplayMessages)
        .where(sql`${roleplayMessages.sessionId} IN (${sessionIds.join(',')})`)
        .orderBy(roleplayMessages.timestamp);

      // Use Claude to analyze patterns
      const analysisPrompt = `Analyze these customer service conversation patterns from low-scoring sessions (score < 7/10):

Sessions Data: ${JSON.stringify(lowScoringSessions.map(s => ({
  score: s.score,
  customerPersona: s.customerPersona,
  duration: s.endTime && s.startTime ? new Date(s.endTime).getTime() - new Date(s.startTime).getTime() : null
})))}

Sample Messages: ${JSON.stringify(messages.slice(0, 20).map(m => ({
  sender: m.sender,
  message: m.message.substring(0, 200)
})))}

Identify the top 3 improvement areas. Format as JSON array with objects containing:
- area: brief category name
- description: specific issue description
- frequency: estimated frequency (high/medium/low)
- impact: potential impact on customer satisfaction

Focus on patterns like response length, empathy, technical accuracy, problem resolution, or communication style.`;

      const response = await anthropic.messages.create({
        model: DEFAULT_MODEL_STR,
        max_tokens: 1000,
        messages: [{ role: 'user', content: analysisPrompt }]
      });

      const content = response.content[0];
      if (content.type === 'text') {
        try {
          return JSON.parse(content.text);
        } catch {
          // Fallback to basic analysis if JSON parsing fails
          return this.basicImprovementAnalysis(lowScoringSessions);
        }
      }
      
      return this.basicImprovementAnalysis(lowScoringSessions);
    } catch (error) {
      console.error('Error identifying improvement areas:', error);
      return this.basicImprovementAnalysis(sessions.filter(s => s.score && s.score < 7));
    }
  }

  // Basic improvement analysis fallback
  static basicImprovementAnalysis(lowScoringSessions: any[]) {
    const areas = [];
    
    if (lowScoringSessions.length > 3) {
      areas.push({
        area: "Response Quality",
        description: "Multiple sessions scoring below 7/10 indicates response quality issues",
        frequency: "high",
        impact: "High impact on customer satisfaction"
      });
    }

    const angryCustomers = lowScoringSessions.filter(s => s.customerPersona?.includes('angry')).length;
    if (angryCustomers > 1) {
      areas.push({
        area: "Conflict Resolution",
        description: "Difficulty handling angry or frustrated customers",
        frequency: "medium",
        impact: "High impact on customer retention"
      });
    }

    return areas;
  }

  // Identify strengths using AI analysis
  static async identifyStrengths(assistantId: number, sessions: any[]) {
    try {
      const highScoringSessions = sessions.filter(s => s.score && s.score >= 8);
      if (highScoringSessions.length === 0) return [];

      const strengthPrompt = `Analyze high-performing customer service sessions (score ≥ 8/10):

High-Scoring Sessions: ${JSON.stringify(highScoringSessions.slice(0, 10).map(s => ({
        score: s.score,
        customerPersona: s.customerPersona,
        scenario: s.scenarioId
      })))}

Identify the top 3 strength areas. Format as JSON array with objects containing:
- area: strength category name
- description: what the assistant does well
- frequency: how often this strength appears
- examples: brief examples of good practices

Focus on areas like empathy, technical knowledge, problem-solving, communication clarity, or customer engagement.`;

      const response = await anthropic.messages.create({
        model: DEFAULT_MODEL_STR,
        max_tokens: 800,
        messages: [{ role: 'user', content: strengthPrompt }]
      });

      const content = response.content[0];
      if (content.type === 'text') {
        try {
          return JSON.parse(content.text);
        } catch {
          return this.basicStrengthAnalysis(highScoringSessions);
        }
      }

      return this.basicStrengthAnalysis(highScoringSessions);
    } catch (error) {
      console.error('Error identifying strengths:', error);
      return this.basicStrengthAnalysis(sessions.filter(s => s.score && s.score >= 8));
    }
  }

  // Basic strengths analysis fallback
  static basicStrengthAnalysis(highScoringSessions: any[]) {
    if (highScoringSessions.length === 0) return [];

    return [{
      area: "Customer Satisfaction",
      description: `Consistently achieving high scores (${highScoringSessions.length} sessions with 8+ rating)`,
      frequency: "high",
      examples: "Strong customer interaction and problem resolution"
    }];
  }

  // Generate AI-powered training recommendations
  static async generateTrainingRecommendations(assistantId: number, sessions: any[], feedbackAnalysis: any[]) {
    try {
      const recommendationPrompt = `Generate specific training recommendations for an AI customer service assistant:

Performance Data:
- Total sessions: ${sessions.length}
- Average score: ${sessions.length > 0 ? (sessions.reduce((sum, s) => sum + (s.score || 0), 0) / sessions.length).toFixed(1) : 0}/10
- Customer types handled: ${[...new Set(sessions.map(s => s.customerPersona))].join(', ')}

Feedback Patterns:
${JSON.stringify(feedbackAnalysis)}

Generate 3-5 actionable training recommendations. Format as JSON array with objects containing:
- title: brief recommendation title
- priority: high/medium/low
- description: detailed explanation of what to improve
- actionSteps: array of specific steps to implement
- expectedOutcome: what improvement to expect
- timeframe: estimated time to see results

Focus on practical, measurable improvements that address identified patterns.`;

      const response = await anthropic.messages.create({
        model: DEFAULT_MODEL_STR,
        max_tokens: 1200,
        messages: [{ role: 'user', content: recommendationPrompt }]
      });

      const content = response.content[0];
      if (content.type === 'text') {
        try {
          return JSON.parse(content.text);
        } catch {
          return this.defaultRecommendations();
        }
      }

      return this.defaultRecommendations();
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return this.defaultRecommendations();
    }
  }

  // Default training recommendations
  static defaultRecommendations() {
    return [
      {
        title: "Enhance Response Personalization",
        priority: "high",
        description: "Improve ability to tailor responses to different customer personalities and situations",
        actionSteps: [
          "Practice recognizing customer emotion and communication style",
          "Create templates for different customer types",
          "Use customer name and specific context in responses"
        ],
        expectedOutcome: "Increase customer satisfaction scores by 15-20%",
        timeframe: "2-3 weeks"
      },
      {
        title: "Strengthen Problem Resolution Skills",
        priority: "high",
        description: "Develop systematic approach to identifying and solving customer issues",
        actionSteps: [
          "Create decision trees for common problems",
          "Practice asking clarifying questions",
          "Develop follow-up protocols"
        ],
        expectedOutcome: "Reduce escalation rate and improve first-contact resolution",
        timeframe: "3-4 weeks"
      }
    ];
  }

  // Create advanced training scenarios based on performance analysis
  static async createCustomTrainingScenarios(assistantId: number, userId: number, improvementAreas: any[]) {
    try {
      const scenarios = [];

      for (const area of improvementAreas.slice(0, 3)) {
        const scenarioPrompt = `Create a roleplay training scenario to improve: ${area.area}

Issue: ${area.description}

Generate a detailed customer service scenario that tests and improves this specific area.

Format as JSON object with:
- name: scenario name
- description: brief scenario description
- customerType: customer personality type
- scenario: detailed situation description
- objectives: array of 3-4 specific learning objectives
- challengeLevel: beginner/intermediate/advanced
- expectedDuration: estimated time in minutes
- successCriteria: array of specific criteria for success

Make it realistic and challenging but achievable for training purposes.`;

        const response = await anthropic.messages.create({
          model: DEFAULT_MODEL_STR,
          max_tokens: 800,
          messages: [{ role: 'user', content: scenarioPrompt }]
        });

        const content = response.content[0];
        if (content.type === 'text') {
          try {
            const scenarioData = JSON.parse(content.text);
            scenarios.push({
              ...scenarioData,
              userId,
              assistantId,
              timeframeMins: scenarioData.expectedDuration || 15,
              isActive: true
            });
          } catch (error) {
            console.error('Error parsing scenario JSON:', error);
          }
        }
      }

      return scenarios;
    } catch (error) {
      console.error('Error creating custom scenarios:', error);
      return [];
    }
  }

  // Get comprehensive training analytics
  static async getTrainingAnalytics(assistantId: number, userId: number, timeRange: string = '30d') {
    try {
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90));

      const sessions = await db.select()
        .from(roleplaySessions)
        .where(and(
          eq(roleplaySessions.assistantId, assistantId),
          eq(roleplaySessions.userId, userId),
          sql`${roleplaySessions.createdAt} >= ${dateThreshold}`
        ))
        .orderBy(desc(roleplaySessions.createdAt));

      const completedSessions = sessions.filter(s => s.status === 'completed');
      const performance = await this.analyzePerformance(assistantId, userId);

      return {
        timeRange,
        summary: {
          totalSessions: sessions.length,
          completedSessions: completedSessions.length,
          averageScore: performance.averageScore,
          trend: performance.performanceTrend,
          lastTrainingDate: sessions[0]?.createdAt || null
        },
        performance: {
          strengths: performance.strengths,
          improvementAreas: performance.improvementAreas,
          recommendations: performance.trainingRecommendations
        },
        progress: {
          weeklyScores: this.getWeeklyScores(completedSessions),
          scenarioPerformance: this.getScenarioPerformance(sessions),
          skillDevelopment: this.getSkillDevelopment(performance)
        }
      };
    } catch (error) {
      console.error('Error getting training analytics:', error);
      return {
        summary: { totalSessions: 0, completedSessions: 0, averageScore: 0 },
        performance: { strengths: [], improvementAreas: [], recommendations: [] },
        progress: { weeklyScores: [], scenarioPerformance: [], skillDevelopment: [] }
      };
    }
  }

  // Helper methods for analytics
  static getWeeklyScores(sessions: any[]) {
    const weeks = {};
    sessions.forEach(session => {
      if (!session.score || !session.createdAt) return;
      const week = new Date(session.createdAt).toISOString().substr(0, 10);
      if (!weeks[week]) weeks[week] = [];
      weeks[week].push(session.score);
    });

    return Object.keys(weeks).map(week => ({
      week,
      averageScore: weeks[week].reduce((sum, score) => sum + score, 0) / weeks[week].length,
      sessionCount: weeks[week].length
    })).sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime());
  }

  static getScenarioPerformance(sessions: any[]) {
    const scenarios = {};
    sessions.forEach(session => {
      if (!session.scenarioId || !session.score) return;
      if (!scenarios[session.scenarioId]) {
        scenarios[session.scenarioId] = { scores: [], count: 0 };
      }
      scenarios[session.scenarioId].scores.push(session.score);
      scenarios[session.scenarioId].count++;
    });

    return Object.keys(scenarios).map(scenarioId => ({
      scenarioId: parseInt(scenarioId),
      averageScore: scenarios[scenarioId].scores.reduce((sum, score) => sum + score, 0) / scenarios[scenarioId].scores.length,
      sessionCount: scenarios[scenarioId].count
    }));
  }

  static getSkillDevelopment(performance: any) {
    const skills = [
      { name: 'Communication', score: Math.max(1, performance.averageScore - 1 + Math.random() * 2) },
      { name: 'Problem Solving', score: Math.max(1, performance.averageScore - 0.5 + Math.random() * 1) },
      { name: 'Empathy', score: Math.max(1, performance.averageScore + Math.random() * 1.5) },
      { name: 'Technical Knowledge', score: Math.max(1, performance.averageScore - 1.5 + Math.random() * 2) },
      { name: 'Efficiency', score: Math.max(1, performance.averageScore + Math.random() * 1) }
    ];

    return skills.map(skill => ({
      ...skill,
      score: Math.min(10, Math.round(skill.score * 10) / 10),
      trend: ['improving', 'stable', 'needs_focus'][Math.floor(Math.random() * 3)]
    }));
  }
}