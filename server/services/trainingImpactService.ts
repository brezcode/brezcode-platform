import Anthropic from '@anthropic-ai/sdk';
import { db } from "../db";
import { avatarKnowledgeDocuments } from "@shared/schema";
import { eq } from "drizzle-orm";

const DEFAULT_MODEL_STR = "claude-sonnet-4-20250514";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export class TrainingImpactService {
  
  /**
   * Analyze document content and generate training impact analysis
   */
  static async analyzeDocumentImpact(
    documentId: number,
    documentContent: string,
    filename: string,
    avatarId: string
  ): Promise<{ title: string; analysis: string; category: string }> {
    
    console.log(`🧠 Analyzing training impact for document ${documentId} (${filename})`);
    
    try {
      const analysisPrompt = `You are an AI training analyst. Analyze this document and determine what knowledge an AI avatar would learn from it.

DOCUMENT FILENAME: ${filename}
AVATAR CONTEXT: ${avatarId} (health coaching avatar)

DOCUMENT CONTENT:
${documentContent.substring(0, 4000)} ${documentContent.length > 4000 ? '...[TRUNCATED]' : ''}

Please provide a comprehensive analysis in this JSON format:
{
  "title": "Clear, engaging title describing what the AI learned (max 60 characters)",
  "analysis": "Detailed 200-400 word analysis explaining:\n- What specific knowledge the AI gained\n- How this knowledge will help the AI answer questions\n- Key facts, procedures, or insights the AI can now reference\n- Types of questions the AI can now answer better",
  "category": "Specific knowledge category like 'Product Information', 'Medical Procedures', 'Company Policy', 'Technical Documentation', etc."
}

Make the analysis practical and specific - explain exactly how this knowledge improves the AI's ability to help users.`;

      const response = await anthropic.messages.create({
        model: DEFAULT_MODEL_STR,
        max_tokens: 800,
        messages: [{ role: 'user', content: analysisPrompt }]
      });

      const responseText = (response.content[0] as any).text;
      const cleanContent = responseText.replace(/```json\n?/, '').replace(/\n?```/, '').trim();
      const result = JSON.parse(cleanContent);

      console.log(`✅ Generated training impact analysis: "${result.title}"`);
      
      return {
        title: result.title,
        analysis: result.analysis,
        category: result.category
      };

    } catch (error) {
      console.error('❌ Training impact analysis failed:', error);
      
      // Provide informative fallback analysis
      const fallbackCategory = this.inferCategoryFromFilename(filename);
      
      return {
        title: `Knowledge from ${filename}`,
        analysis: `The AI has learned information from the document "${filename}". This document contains valuable content that the AI can reference when answering related questions. The AI can now provide more accurate and detailed responses based on the specific information contained in this document. Users can ask questions about the content and the AI will draw from this knowledge base to provide informed answers.`,
        category: fallbackCategory
      };
    }
  }

  /**
   * Update document with training impact analysis
   */
  static async updateDocumentWithAnalysis(
    documentId: number,
    title: string,
    analysis: string,
    category: string
  ): Promise<void> {
    
    try {
      await db.update(avatarKnowledgeDocuments)
        .set({
          trainingImpactTitle: title,
          trainingImpactAnalysis: analysis,
          knowledgeCategory: category,
          isAnalyzed: true
        })
        .where(eq(avatarKnowledgeDocuments.id, documentId));

      console.log(`✅ Updated document ${documentId} with training impact analysis`);
      
    } catch (error) {
      console.error(`❌ Failed to update document ${documentId} with analysis:`, error);
      throw error;
    }
  }

  /**
   * Get training impact analysis for avatar
   */
  static async getTrainingImpactForAvatar(avatarId: string) {
    try {
      const documents = await db.select({
        id: avatarKnowledgeDocuments.id,
        filename: avatarKnowledgeDocuments.filename,
        trainingImpactTitle: avatarKnowledgeDocuments.trainingImpactTitle,
        trainingImpactAnalysis: avatarKnowledgeDocuments.trainingImpactAnalysis,
        knowledgeCategory: avatarKnowledgeDocuments.knowledgeCategory,
        isAnalyzed: avatarKnowledgeDocuments.isAnalyzed,
        uploadedAt: avatarKnowledgeDocuments.uploadedAt
      })
      .from(avatarKnowledgeDocuments)
      .where(eq(avatarKnowledgeDocuments.avatarId, avatarId));

      // Group by knowledge category
      const categorizedKnowledge: Record<string, any[]> = {};
      
      documents.forEach(doc => {
        if (doc.isAnalyzed && doc.trainingImpactTitle) {
          const category = doc.knowledgeCategory || 'General Knowledge';
          
          if (!categorizedKnowledge[category]) {
            categorizedKnowledge[category] = [];
          }
          
          categorizedKnowledge[category].push({
            id: doc.id,
            title: doc.trainingImpactTitle,
            analysis: doc.trainingImpactAnalysis,
            filename: doc.filename,
            uploadedAt: doc.uploadedAt
          });
        }
      });

      return categorizedKnowledge;
      
    } catch (error) {
      console.error('❌ Failed to get training impact for avatar:', error);
      return {};
    }
  }

  /**
   * Infer category from filename
   */
  private static inferCategoryFromFilename(filename: string): string {
    const lowerFilename = filename.toLowerCase();
    
    if (lowerFilename.includes('price') || lowerFilename.includes('cost')) {
      return 'Pricing Information';
    } else if (lowerFilename.includes('product') || lowerFilename.includes('catalog')) {
      return 'Product Information';
    } else if (lowerFilename.includes('manual') || lowerFilename.includes('guide') || lowerFilename.includes('instruction')) {
      return 'Technical Documentation';
    } else if (lowerFilename.includes('policy') || lowerFilename.includes('procedure')) {
      return 'Policies & Procedures';
    } else if (lowerFilename.includes('medical') || lowerFilename.includes('health')) {
      return 'Medical Information';
    } else if (lowerFilename.includes('training') || lowerFilename.includes('education')) {
      return 'Training Materials';
    }
    
    return 'General Knowledge';
  }
}