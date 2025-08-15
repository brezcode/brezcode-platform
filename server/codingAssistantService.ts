import { db } from "./db";
import { 
  codePatterns, 
  debuggingSolutions, 
  promptingStrategies,
  codingContext,
  codingMetrics,
  codingSessions,
  type InsertCodePattern,
  type InsertDebuggingSolution,
  type InsertPromptingStrategy,
  type InsertCodingContext,
  type InsertCodingMetric,
  type InsertCodingSession
} from "@shared/coding-assistant-schema";
import { eq, desc, and } from "drizzle-orm";

export class CodingAssistantService {
  
  // Context and memory management
  async storeContext(userId: number, contextType: string, contextKey: string, contextValue: any) {
    try {
      const [contextEntry] = await db.insert(codingContext).values({
        contextType,
        contextKey,
        contextValue,
        priority: 1
      }).returning();
      
      return contextEntry;
    } catch (error) {
      console.error("Error storing context:", error);
      throw error;
    }
  }

  async getContext(userId: number, contextType?: string) {
    try {
      let query = db.select().from(codingContext);
      
      if (contextType) {
        query = query.where(eq(codingContext.contextType, contextType));
      }
      
      return await query.orderBy(desc(codingContext.updatedAt));
    } catch (error) {
      console.error("Error retrieving context:", error);
      return [];
    }
  }

  // Metrics tracking
  async recordMetric(userId: number, metricType: string, metricValue: number, technology?: string) {
    try {
      const existingMetric = await db.select().from(codingMetrics)
        .where(and(
          eq(codingMetrics.metricType, metricType),
          eq(codingMetrics.technology, technology || '')
        ));

      if (existingMetric.length > 0) {
        // Update existing metric
        return await db.update(codingMetrics)
          .set({ 
            metricValue,
            date: new Date()
          })
          .where(eq(codingMetrics.id, existingMetric[0].id))
          .returning();
      } else {
        // Create new metric
        return await db.insert(codingMetrics).values({
          metricType,
          metricValue,
          technology,
          date: new Date()
        }).returning();
      }
    } catch (error) {
      console.error("Error recording metric:", error);
      throw error;
    }
  }

  // Session management
  async createSession(userId: number, title: string, description?: string, technologies?: string[]) {
    try {
      const [session] = await db.insert(codingSessions).values({
        title,
        description,
        technologies: technologies || [],
        status: "active",
        updatedAt: new Date()
      }).returning();
      
      return session;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  }

  async updateSession(sessionId: number, updates: Partial<InsertCodingSession>) {
    try {
      return await db.update(codingSessions)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(eq(codingSessions.id, sessionId))
        .returning();
    } catch (error) {
      console.error("Error updating session:", error);
      throw error;
    }
  }

  // Code patterns
  async addCodePattern(userId: number, pattern: Omit<InsertCodePattern, 'userId'>) {
    try {
      const [newPattern] = await db.insert(codePatterns).values({
        patternName: pattern.patternName,
        description: pattern.description,
        codeExample: pattern.codeExample,
        technology: pattern.technology,
        category: pattern.category,
        tags: pattern.tags || [],
        useCount: 0,
        successRate: 100
      }).returning();
      
      // Record pattern creation metric
      await this.recordMetric(userId, 'patterns_created', 1, pattern.technology);
      
      return newPattern;
    } catch (error) {
      console.error("Error adding code pattern:", error);
      throw error;
    }
  }

  async getCodePatterns(userId: number, technology?: string) {
    try {
      let query = db.select().from(codePatterns);
      
      if (technology) {
        query = query.where(eq(codePatterns.technology, technology));
      }
      
      return await query.orderBy(desc(codePatterns.createdAt));
    } catch (error) {
      console.error("Error retrieving code patterns:", error);
      return [];
    }
  }

  // Debugging solutions
  async addDebuggingSolution(userId: number, solution: Omit<InsertDebuggingSolution, 'userId'>) {
    try {
      const [newSolution] = await db.insert(debuggingSolutions).values({
        problemDescription: solution.problemDescription,
        errorMessage: solution.errorMessage,
        solution: solution.solution,
        codeBeforefix: solution.codeBeforefix,
        codeAfterFix: solution.codeAfterFix,
        technology: solution.technology,
        timeToSolve: solution.timeToSolve,
        difficulty: solution.difficulty || 'medium',
        isVerified: false,
        tags: solution.tags || []
      }).returning();
      
      // Record solution metric
      await this.recordMetric(userId, 'solutions_created', 1, solution.technology);
      
      return newSolution;
    } catch (error) {
      console.error("Error adding debugging solution:", error);
      throw error;
    }
  }

  async getDebuggingSolutions(userId: number, technology?: string) {
    try {
      let query = db.select().from(debuggingSolutions);
      
      if (technology) {
        query = query.where(eq(debuggingSolutions.technology, technology));
      }
      
      return await query.orderBy(desc(debuggingSolutions.createdAt));
    } catch (error) {
      console.error("Error retrieving debugging solutions:", error);
      return [];
    }
  }

  // Prompting strategies
  async addPromptingStrategy(userId: number, strategy: Omit<InsertPromptingStrategy, 'userId'>) {
    try {
      const [newStrategy] = await db.insert(promptingStrategies).values({
        strategyName: strategy.strategyName,
        promptTemplate: strategy.promptTemplate,
        description: strategy.description,
        useCase: strategy.useCase,
        successExamples: strategy.successExamples || [],
        effectiveness: 50,
        timesUsed: 0,
        avgTimeToSolution: strategy.avgTimeToSolution,
        tags: strategy.tags || []
      }).returning();
      
      return newStrategy;
    } catch (error) {
      console.error("Error adding prompting strategy:", error);
      throw error;
    }
  }

  async getPromptingStrategies(userId: number) {
    try {
      return await db.select().from(promptingStrategies)
        .orderBy(desc(promptingStrategies.createdAt));
    } catch (error) {
      console.error("Error retrieving prompting strategies:", error);
      return [];
    }
  }

  async updateStrategyEffectiveness(strategyId: number, wasEffective: boolean, timeToSolution?: number) {
    try {
      const current = await db.select().from(promptingStrategies)
        .where(eq(promptingStrategies.id, strategyId));
      
      if (current.length === 0) return null;
      
      const strategy = current[0];
      const timesUsed = (strategy.timesUsed || 0) + 1;
      const currentEffectiveness = strategy.effectiveness || 50;
      
      // Calculate new effectiveness (weighted average)
      const newEffectiveness = Math.round(
        (currentEffectiveness * (strategy.timesUsed || 0) + (wasEffective ? 100 : 0)) / timesUsed
      );
      
      const updates: any = {
        timesUsed,
        effectiveness: newEffectiveness
      };
      
      if (timeToSolution) {
        const currentAvgTime = strategy.avgTimeToSolution || 0;
        updates.avgTimeToSolution = Math.round(
          (currentAvgTime * (strategy.timesUsed || 0) + timeToSolution) / timesUsed
        );
      }
      
      return await db.update(promptingStrategies)
        .set(updates)
        .where(eq(promptingStrategies.id, strategyId))
        .returning();
    } catch (error) {
      console.error("Error updating strategy effectiveness:", error);
      throw error;
    }
  }

  // Analytics and insights
  async getPerformanceMetrics(userId: number) {
    try {
      const patterns = await db.select().from(codePatterns);
      const solutions = await db.select().from(debuggingSolutions);
      const strategies = await db.select().from(promptingStrategies);
      const metrics = await db.select().from(codingMetrics);
      
      const totalPatterns = patterns.length;
      const totalSolutions = solutions.length;
      const totalStrategies = strategies.length;
      
      const avgEffectiveness = strategies.length > 0 
        ? Math.round(strategies.reduce((sum, s) => sum + (s.effectiveness || 50), 0) / strategies.length)
        : 50;
      
      const totalUseCount = patterns.reduce((sum, p) => sum + (p.useCount || 0), 0);
      
      return {
        totalPatterns,
        totalSolutions,
        totalStrategies,
        avgEffectiveness,
        totalUseCount,
        metrics
      };
    } catch (error) {
      console.error("Error getting performance metrics:", error);
      throw error;
    }
  }

  async getBestPractices() {
    try {
      const topPatterns = await db.select().from(codePatterns)
        .orderBy(desc(codePatterns.useCount))
        .limit(5);
      
      const topStrategies = await db.select().from(promptingStrategies)
        .orderBy(desc(promptingStrategies.effectiveness))
        .limit(5);
      
      return {
        topPatterns,
        topStrategies
      };
    } catch (error) {
      console.error("Error getting best practices:", error);
      return { topPatterns: [], topStrategies: [] };
    }
  }
}

export const codingAssistantService = new CodingAssistantService();