import { db } from "./db";
import { 
  codingSessions, 
  codePatterns, 
  debuggingSolutions, 
  promptingStrategies,
  codingContext,
  codingMetrics,
  type InsertCodingSession,
  type InsertCodePattern,
  type InsertDebuggingSolution,
  type InsertPromptingStrategy,
  type InsertCodingContext,
  type InsertCodingMetric
} from "@shared/coding-assistant-schema";
import { eq, desc, and, sql } from "drizzle-orm";

export class CodingAssistantService {
  // Session Management
  async createSession(userId: number, data: Omit<InsertCodingSession, "userId">) {
    const [session] = await db.insert(codingSessions)
      .values({ ...data, userId })
      .returning();
    return session;
  }

  async getActiveSessions(userId: number) {
    return await db.select()
      .from(codingSessions)
      .where(and(eq(codingSessions.userId, userId), eq(codingSessions.status, "active")))
      .orderBy(desc(codingSessions.updatedAt));
  }

  async updateSession(sessionId: number, updates: Partial<InsertCodingSession>) {
    await db.update(codingSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(codingSessions.id, sessionId));
  }

  // Code Pattern Learning
  async saveCodePattern(userId: number, pattern: Omit<InsertCodePattern, "userId">) {
    // Check if similar pattern exists
    const existing = await db.select()
      .from(codePatterns)
      .where(and(
        eq(codePatterns.userId, userId),
        eq(codePatterns.patternName, pattern.patternName),
        eq(codePatterns.technology, pattern.technology)
      ));

    if (existing.length > 0) {
      // Update existing pattern
      await db.update(codePatterns)
        .set({ 
          useCount: sql`${codePatterns.useCount} + 1`,
          codeExample: pattern.codeExample,
          description: pattern.description
        })
        .where(eq(codePatterns.id, existing[0].id));
      return existing[0];
    } else {
      // Create new pattern
      const [newPattern] = await db.insert(codePatterns)
        .values({ ...pattern, userId })
        .returning();
      return newPattern;
    }
  }

  async getCodePatterns(userId: number, technology?: string, category?: string) {
    let query = db.select().from(codePatterns).where(eq(codePatterns.userId, userId));
    
    if (technology) {
      query = query.where(eq(codePatterns.technology, technology)) as any;
    }
    if (category) {
      query = query.where(eq(codePatterns.category, category)) as any;
    }
    
    return await query.orderBy(desc(codePatterns.useCount), desc(codePatterns.successRate));
  }

  async searchPatterns(userId: number, searchTerm: string) {
    return await db.select()
      .from(codePatterns)
      .where(and(
        eq(codePatterns.userId, userId),
        sql`${codePatterns.description} ILIKE ${`%${searchTerm}%`} OR ${codePatterns.patternName} ILIKE ${`%${searchTerm}%`}`
      ))
      .orderBy(desc(codePatterns.useCount));
  }

  // Debugging Solutions
  async saveDebuggingSolution(userId: number, solution: Omit<InsertDebuggingSolution, "userId">) {
    const [saved] = await db.insert(debuggingSolutions)
      .values({ ...solution, userId })
      .returning();
    return saved;
  }

  async getSimilarProblems(userId: number, problemDescription: string, technology: string) {
    return await db.select()
      .from(debuggingSolutions)
      .where(and(
        eq(debuggingSolutions.userId, userId),
        eq(debuggingSolutions.technology, technology),
        sql`${debuggingSolutions.problemDescription} ILIKE ${`%${problemDescription}%`}`
      ))
      .orderBy(desc(debuggingSolutions.createdAt));
  }

  async getDebuggingHistory(userId: number, limit = 20) {
    return await db.select()
      .from(debuggingSolutions)
      .where(eq(debuggingSolutions.userId, userId))
      .orderBy(desc(debuggingSolutions.createdAt))
      .limit(limit);
  }

  // Prompting Strategies
  async savePromptingStrategy(userId: number, strategy: Omit<InsertPromptingStrategy, "userId">) {
    const [saved] = await db.insert(promptingStrategies)
      .values({ ...strategy, userId })
      .returning();
    return saved;
  }

  async getPromptingStrategies(userId: number, useCase?: string) {
    let query = db.select().from(promptingStrategies).where(eq(promptingStrategies.userId, userId));
    
    if (useCase) {
      query = query.where(eq(promptingStrategies.useCase, useCase)) as any;
    }
    
    return await query.orderBy(desc(promptingStrategies.effectiveness), desc(promptingStrategies.timesUsed));
  }

  async updateStrategyEffectiveness(strategyId: number, timeTaken: number, successful: boolean) {
    const strategy = await db.select().from(promptingStrategies).where(eq(promptingStrategies.id, strategyId));
    
    if (strategy.length > 0) {
      const current = strategy[0];
      const newTimesUsed = current.timesUsed + 1;
      const newEffectiveness = successful 
        ? Math.min(100, current.effectiveness + 5)
        : Math.max(0, current.effectiveness - 10);
      
      const newAvgTime = current.avgTimeToSolution
        ? Math.round((current.avgTimeToSolution * current.timesUsed + timeTaken) / newTimesUsed)
        : timeTaken;

      await db.update(promptingStrategies)
        .set({
          timesUsed: newTimesUsed,
          effectiveness: newEffectiveness,
          avgTimeToSolution: newAvgTime
        })
        .where(eq(promptingStrategies.id, strategyId));
    }
  }

  // Context Management
  async saveContext(userId: number, context: Omit<InsertCodingContext, "userId">) {
    // Remove existing context with same key if it exists
    await db.delete(codingContext)
      .where(and(
        eq(codingContext.userId, userId),
        eq(codingContext.contextKey, context.contextKey),
        eq(codingContext.contextType, context.contextType)
      ));

    const [saved] = await db.insert(codingContext)
      .values({ ...context, userId })
      .returning();
    return saved;
  }

  async getContext(userId: number, contextType?: string, sessionId?: number) {
    let query = db.select().from(codingContext).where(eq(codingContext.userId, userId));
    
    if (contextType) {
      query = query.where(eq(codingContext.contextType, contextType)) as any;
    }
    if (sessionId) {
      query = query.where(eq(codingContext.sessionId, sessionId)) as any;
    }
    
    return await query.orderBy(desc(codingContext.priority), desc(codingContext.updatedAt));
  }

  // Analytics and Metrics
  async recordMetric(userId: number, metric: Omit<InsertCodingMetric, "userId">) {
    const [saved] = await db.insert(codingMetrics)
      .values({ ...metric, userId })
      .returning();
    return saved;
  }

  async getCodingStats(userId: number, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const stats = await db.select({
      totalSessions: sql<number>`count(distinct ${codingSessions.id})`,
      totalPatterns: sql<number>`count(distinct ${codePatterns.id})`,
      totalSolutions: sql<number>`count(distinct ${debuggingSolutions.id})`,
      avgTimeToSolve: sql<number>`avg(${debuggingSolutions.timeToSolve})`,
      successRate: sql<number>`avg(case when ${debuggingSolutions.isVerified} then 100 else 0 end)`
    })
    .from(codingSessions)
    .leftJoin(codePatterns, eq(codePatterns.sessionId, codingSessions.id))
    .leftJoin(debuggingSolutions, eq(debuggingSolutions.sessionId, codingSessions.id))
    .where(and(
      eq(codingSessions.userId, userId),
      sql`${codingSessions.createdAt} >= ${since}`
    ));

    return stats[0];
  }

  // AI Assistant Intelligence
  async getContextualSuggestions(userId: number, currentProblem: string, technology: string) {
    // Get similar patterns
    const patterns = await this.searchPatterns(userId, currentProblem);
    
    // Get similar debugging solutions
    const solutions = await this.getSimilarProblems(userId, currentProblem, technology);
    
    // Get relevant prompting strategies
    const strategies = await this.getPromptingStrategies(userId, "debugging");
    
    return {
      suggestedPatterns: patterns.slice(0, 3),
      similarSolutions: solutions.slice(0, 3),
      recommendedStrategies: strategies.slice(0, 2)
    };
  }

  async generateLearningInsights(userId: number) {
    const patterns = await this.getCodePatterns(userId);
    const solutions = await this.getDebuggingHistory(userId, 50);
    const stats = await this.getCodingStats(userId);

    // Analyze most effective patterns
    const topPatterns = patterns
      .filter(p => p.useCount > 1)
      .sort((a, b) => (b.successRate * b.useCount) - (a.successRate * a.useCount))
      .slice(0, 5);

    // Analyze common problem areas
    const problemAreas = solutions.reduce((acc, sol) => {
      acc[sol.technology] = (acc[sol.technology] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Analyze improvement trends
    const recentSolutions = solutions.slice(0, 10);
    const averageRecentTime = recentSolutions.reduce((sum, sol) => sum + (sol.timeToSolve || 0), 0) / recentSolutions.length;

    return {
      stats,
      topPatterns,
      problemAreas,
      averageRecentTime,
      insights: {
        mostProductiveTechnology: Object.keys(problemAreas).reduce((a, b) => problemAreas[a] > problemAreas[b] ? a : b, ''),
        patternReuseRate: (patterns.filter(p => p.useCount > 1).length / patterns.length) * 100,
        improvementTrend: averageRecentTime < 30 ? 'improving' : averageRecentTime > 60 ? 'declining' : 'stable'
      }
    };
  }
}

export const codingAssistantService = new CodingAssistantService();