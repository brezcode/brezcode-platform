import { db } from "./db";
import { knowledgeBase, userFeedback, type InsertKnowledgeBase } from "@shared/schema";
import { eq, and, like, inArray } from "drizzle-orm";

export class KnowledgeBaseManager {
  // Initialize knowledge base with medical facts from the uploaded book
  async initializeKnowledgeBase() {
    const medicalFacts = [
      {
        category: 'medical_facts' as const,
        title: 'Age 30 Risk Assessment',
        content: 'Age 30 is NOT in an age group where breast cancer incidence increases significantly. Breast cancer risk increases substantially after age 50, with the highest risk in women over 60-70.',
        sourceFile: 'Code Chapter 1 to 14 20250606_1752745332982.pdf',
        pageNumber: 1,
        evidenceLevel: 'high' as const,
        tags: ['age', 'risk_assessment', 'demographics']
      },
      {
        category: 'medical_facts' as const,
        title: 'Family History Reality',
        content: '85% of breast cancer patients do NOT have a family history of breast cancer. Having no family history does not mean you are safe - be alert and maintain regular screening.',
        sourceFile: 'Code Chapter 1 to 14 20250606_1752745332982.pdf',
        pageNumber: 1,
        evidenceLevel: 'high' as const,
        tags: ['family_history', 'genetics', 'prevention']
      },
      {
        category: 'medical_facts' as const,
        title: 'Breast Density Screening Reality',
        content: 'Never assume average breast density from screening results if the user has never had screening. Breast density can only be determined through mammography or other imaging.',
        sourceFile: 'Code Chapter 1 to 14 20250606_1752745332982.pdf',
        pageNumber: 1,
        evidenceLevel: 'high' as const,
        tags: ['screening', 'breast_density', 'mammography']
      },
      {
        category: 'medical_facts' as const,
        title: 'Breast Cancer Risk by Age',
        content: 'From the book: Age 50-59: RR = 1.14, Age 60-69: RR = 1.67, Age 70+: RR = 3.33. Risk increases significantly after age 50.',
        sourceFile: 'Code Chapter 1 to 14 20250606_1752745332982.pdf',
        pageNumber: 1,
        evidenceLevel: 'high' as const,
        tags: ['age', 'risk_factors', 'statistics']
      },
      {
        category: 'medical_facts' as const,
        title: 'RAPID Defense System',
        content: 'Your body has RAPID defense mechanisms: tumor suppressor genes, apoptosis (cell death), immune cells patrolling 24/7, and DNA repair teams.',
        sourceFile: 'Code Chapter 1 to 14 20250606_1752745332982.pdf',
        pageNumber: 1,
        evidenceLevel: 'high' as const,
        tags: ['defense_mechanisms', 'immunity', 'prevention']
      }
    ];

    // Insert medical facts into knowledge base
    for (const fact of medicalFacts) {
      await db.insert(knowledgeBase).values(fact).onConflictDoNothing();
    }
  }

  // Search knowledge base for relevant information
  async searchKnowledgeBase(query: string, tags?: string[]) {
    let searchQuery = db.select().from(knowledgeBase).where(eq(knowledgeBase.isActive, true));
    
    if (tags && tags.length > 0) {
      searchQuery = searchQuery.where(
        and(
          eq(knowledgeBase.isActive, true),
          like(knowledgeBase.tags, `%${tags.join('%')}%`)
        )
      );
    }

    const results = await searchQuery.execute();
    
    // Filter results based on query relevance
    return results.filter(kb => 
      kb.title.toLowerCase().includes(query.toLowerCase()) ||
      kb.content.toLowerCase().includes(query.toLowerCase()) ||
      (kb.tags && kb.tags.some(tag => query.toLowerCase().includes(tag.toLowerCase())))
    );
  }

  // Add user correction to knowledge base
  async addUserCorrection(userId: number, correction: {
    reportId: number;
    originalContent: string;
    correctedContent?: string;
    userComment: string;
    feedbackType: 'correction' | 'improvement' | 'error_report';
  }) {
    await db.insert(userFeedback).values({
      userId,
      ...correction
    });

    // If it's a correction, add to knowledge base
    if (correction.feedbackType === 'correction' && correction.correctedContent) {
      await db.insert(knowledgeBase).values({
        category: 'corrections',
        title: `User Correction: ${correction.userComment.substring(0, 100)}`,
        content: correction.correctedContent,
        evidenceLevel: 'medium',
        tags: ['user_correction', 'medical_accuracy']
      });
    }
  }

  // Get evidence-based content for specific topics
  async getEvidenceBasedContent(topic: string) {
    const relevantKnowledge = await this.searchKnowledgeBase(topic);
    
    return relevantKnowledge
      .filter(kb => kb.evidenceLevel === 'high')
      .sort((a, b) => {
        // Prioritize medical facts and references
        if (a.category === 'medical_facts' && b.category !== 'medical_facts') return -1;
        if (b.category === 'medical_facts' && a.category !== 'medical_facts') return 1;
        return 0;
      });
  }
}

export const knowledgeBaseManager = new KnowledgeBaseManager();