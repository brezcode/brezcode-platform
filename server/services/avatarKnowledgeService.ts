import { db } from "../db";
import { avatarKnowledgeDocuments, avatarKnowledgeChunks, avatarKnowledgeQueries } from "@shared/schema";
import { eq, and, desc, like } from "drizzle-orm";
import type { 
  AvatarKnowledgeDocument, 
  InsertAvatarKnowledgeDocument,
  AvatarKnowledgeChunk,
  InsertAvatarKnowledgeChunk 
} from "@shared/schema";

export class AvatarKnowledgeService {
  
  // Upload and process document for specific avatar
  static async uploadDocument(data: InsertAvatarKnowledgeDocument): Promise<AvatarKnowledgeDocument> {
    console.log(`📚 Uploading knowledge document for avatar: ${data.avatarId}`);
    
    const [document] = await db.insert(avatarKnowledgeDocuments)
      .values({
        ...data,
        processingStatus: 'processing',
        isProcessed: false
      })
      .returning();
    
    console.log(`✅ Document uploaded with ID: ${document.id}`);
    
    // Process document into chunks asynchronously
    this.processDocumentIntoChunks(document.id, data.avatarId, data.processedContent);
    
    return document;
  }
  
  // Process document content into searchable chunks
  static async processDocumentIntoChunks(documentId: number, avatarId: string, content: string): Promise<void> {
    try {
      console.log(`🔄 Processing document ${documentId} into chunks for ${avatarId}`);
      
      // Split content into chunks (approximately 500 characters each)
      const chunks = this.splitIntoChunks(content, 500);
      
      // Create chunk records
      const chunkInserts: InsertAvatarKnowledgeChunk[] = chunks.map((chunk, index) => ({
        documentId,
        avatarId,
        chunkContent: chunk,
        chunkIndex: index,
        keywords: this.extractKeywords(chunk),
        topics: this.identifyTopics(chunk),
        relevanceScore: 100 // Default high relevance
      }));
      
      await db.insert(avatarKnowledgeChunks).values(chunkInserts);
      
      // Mark document as processed
      await db.update(avatarKnowledgeDocuments)
        .set({ 
          isProcessed: true, 
          processingStatus: 'completed' 
        })
        .where(eq(avatarKnowledgeDocuments.id, documentId));
      
      console.log(`✅ Document ${documentId} processed into ${chunks.length} chunks`);
      
    } catch (error) {
      console.error(`❌ Error processing document ${documentId}:`, error);
      
      // Mark document as failed
      await db.update(avatarKnowledgeDocuments)
        .set({ 
          isProcessed: false, 
          processingStatus: 'failed' 
        })
        .where(eq(avatarKnowledgeDocuments.id, documentId));
    }
  }
  
  // Get all documents for specific avatar
  static async getAvatarDocuments(avatarId: string): Promise<AvatarKnowledgeDocument[]> {
    const documents = await db.select()
      .from(avatarKnowledgeDocuments)
      .where(eq(avatarKnowledgeDocuments.avatarId, avatarId))
      .orderBy(desc(avatarKnowledgeDocuments.uploadedAt));
    
    return documents;
  }
  
  // Search knowledge base for avatar
  static async searchKnowledge(avatarId: string, query: string): Promise<AvatarKnowledgeChunk[]> {
    console.log(`🔍 Searching knowledge for ${avatarId}: "${query}"`);
    
    // Simple text search - can be enhanced with vector search later
    const chunks = await db.select()
      .from(avatarKnowledgeChunks)
      .where(
        and(
          eq(avatarKnowledgeChunks.avatarId, avatarId),
          like(avatarKnowledgeChunks.chunkContent, `%${query}%`)
        )
      )
      .limit(10);
    
    console.log(`✅ Found ${chunks.length} relevant knowledge chunks`);
    return chunks;
  }
  
  // Delete document and its chunks
  static async deleteDocument(documentId: number): Promise<boolean> {
    try {
      // Delete chunks first
      await db.delete(avatarKnowledgeChunks)
        .where(eq(avatarKnowledgeChunks.documentId, documentId));
      
      // Delete document
      await db.delete(avatarKnowledgeDocuments)
        .where(eq(avatarKnowledgeDocuments.id, documentId));
      
      console.log(`✅ Document ${documentId} and its chunks deleted`);
      return true;
    } catch (error) {
      console.error(`❌ Error deleting document ${documentId}:`, error);
      return false;
    }
  }
  
  // Helper: Split text into chunks
  private static splitIntoChunks(text: string, maxChunkSize: number): string[] {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const chunks: string[] = [];
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length <= maxChunkSize) {
        currentChunk += sentence.trim() + '. ';
      } else {
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = sentence.trim() + '. ';
      }
    }
    
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  }
  
  // Helper: Extract keywords from text
  private static extractKeywords(text: string): string[] {
    // Simple keyword extraction - remove common words
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.includes(word));
    
    return Array.from(new Set(words)).slice(0, 10); // Top 10 unique keywords
  }
  
  // Helper: Identify topics in text
  private static identifyTopics(text: string): string[] {
    const topics = [];
    
    // Simple topic identification based on keywords
    if (/price|cost|dollar|\$|payment|billing/i.test(text)) topics.push('pricing');
    if (/technical|system|software|api|code/i.test(text)) topics.push('technical');
    if (/policy|rule|regulation|compliance/i.test(text)) topics.push('policy');
    if (/product|feature|service|offering/i.test(text)) topics.push('product');
    if (/support|help|troubleshoot|issue/i.test(text)) topics.push('support');
    if (/health|medical|wellness|care/i.test(text)) topics.push('health');
    
    return topics;
  }
}