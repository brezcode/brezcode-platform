import type { Request, Response } from 'express';
import multer from 'multer';
import { AvatarKnowledgeService } from './services/avatarKnowledgeService';
import { TrainingImpactService } from './services/trainingImpactService';
import { avatarKnowledgeDocuments, avatarKnowledgeChunks } from '@shared/schema';
import { eq, like, or } from 'drizzle-orm';
import { db } from './db';

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept text files, PDFs, and common document types
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/csv',
      'application/json'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Please upload text, PDF, Word, or CSV files.'));
    }
  }
});

export const registerAvatarKnowledgeRoutes = (app: any) => {
  console.log('📚 Registering Avatar Knowledge Base routes...');

  // Upload document for specific avatar
  app.post('/api/avatar-knowledge/:avatarId/upload', upload.single('document'), async (req: Request, res: Response) => {
    try {
      const { avatarId } = req.params;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      console.log(`📤 Uploading document for avatar: ${avatarId}`);
      console.log(`📄 File details: ${file.originalname} (${file.size} bytes)`);
      
      // Extract text content based on file type
      let textContent = '';
      
      try {
        if (file.mimetype === 'text/plain' || file.mimetype === 'text/csv' || file.mimetype === 'application/json') {
          textContent = file.buffer.toString('utf-8');
        } else if (file.mimetype === 'application/pdf') {
          // Enhanced PDF parsing with proper text extraction
          try {
            const pdfParse = await import('pdf-parse');
            const pdfData = await pdfParse.default(file.buffer);
            textContent = pdfData.text;
            console.log(`📄 Successfully extracted ${pdfData.text.length} characters from PDF: ${file.originalname}`);
            
            // Validate meaningful text content was extracted
            if (!textContent || textContent.length < 50) {
              throw new Error('PDF extraction returned insufficient content');
            }
            
            // Clean up PDF text extraction artifacts
            textContent = textContent
              .replace(/\s+/g, ' ')
              .replace(/\n\s*\n/g, '\n')
              .trim();
              
          } catch (pdfError) {
            console.error('❌ PDF parsing failed:', pdfError);
            // Critical: Don't use fallback content - try alternative extraction
            try {
              // Alternative: Try extracting raw text
              const rawText = file.buffer.toString('utf-8');
              const textMatch = rawText.match(/stream\s+(.*?)\s+endstream/gs);
              if (textMatch && textMatch.length > 0) {
                textContent = textMatch.join(' ').replace(/[^\x20-\x7E\s]/g, ' ').trim();
              } else {
                throw new Error('Alternative PDF extraction failed');
              }
            } catch (altError) {
              return res.status(400).json({ 
                error: 'PDF text extraction failed',
                details: 'This PDF format is not supported for text extraction. Please convert to .txt or .docx format.'
              });
            }
          }
        } else if (file.mimetype.includes('word') || file.mimetype.includes('document')) {
          // For Word documents, try basic text extraction with proper encoding
          textContent = file.buffer.toString('utf-8')
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')  // Remove control chars
            .replace(/[^\x20-\x7E\n\r\t\u00A0-\uFFFF]/g, ' ');
        } else {
          // Fallback for other file types with encoding cleanup
          textContent = file.buffer.toString('utf-8')
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')  // Remove control chars
            .replace(/[^\x20-\x7E\n\r\t\u00A0-\uFFFF]/g, ' ');
        }
        
        // Clean up extracted text and remove invalid UTF-8 characters
        textContent = textContent
          .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')  // Remove control characters
          .replace(/[^\x20-\x7E\n\r\t\u00A0-\uFFFF]/g, ' ')  // Replace non-printable chars
          .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
          .replace(/\n\s*\n/g, '\n')  // Replace multiple newlines
          .trim();
          
        console.log(`📝 Extracted ${textContent.length} characters from ${file.originalname}`);
        
      } catch (extractionError) {
        console.error('Text extraction error:', extractionError);
        textContent = `Content extraction failed for ${file.originalname}. File type: ${file.mimetype}. Please try uploading a text file or a simpler PDF.`;
      }
      
      // Final cleanup to ensure valid UTF-8
      textContent = Buffer.from(textContent, 'utf-8').toString('utf-8');
      
      // Validate content was extracted successfully
      if (!textContent || textContent.length < 10) {
        return res.status(400).json({ 
          error: 'Could not extract meaningful content from file',
          details: 'File appears to be empty or in an unsupported format'
        });
      }
      
      // Create document record
      const document = await AvatarKnowledgeService.uploadDocument({
        avatarId,
        userId: 1, // TODO: Get from session
        filename: file.originalname,
        originalContent: textContent,
        processedContent: textContent,
        documentType: file.mimetype,
        fileSize: file.size,
        contentCategory: req.body.category || 'general',
        metadata: {
          uploadedBy: 'user',
          originalFilename: file.originalname,
          mimeType: file.mimetype,
          contentLength: textContent.length,
          extractedAt: new Date().toISOString()
        }
      });
      
      res.json({
        success: true,
        document,
        message: `Document uploaded successfully for ${avatarId}`
      });
      
    } catch (error: any) {
      console.error('❌ Error uploading document:', error);
      res.status(500).json({ 
        error: 'Failed to upload document',
        details: error.message 
      });
    }
  });

  // Get all documents for specific avatar
  app.get('/api/avatar-knowledge/:avatarId/documents', async (req: Request, res: Response) => {
    try {
      const { avatarId } = req.params;
      
      console.log(`📚 Fetching documents for avatar: ${avatarId}`);
      
      const documents = await AvatarKnowledgeService.getAvatarDocuments(avatarId);
      
      res.json({
        success: true,
        documents,
        count: documents.length
      });
      
    } catch (error: any) {
      console.error('❌ Error fetching documents:', error);
      res.status(500).json({ 
        error: 'Failed to fetch documents',
        details: error.message 
      });
    }
  });

  // Search knowledge base for avatar
  app.get('/api/avatar-knowledge/:avatarId/search', async (req: Request, res: Response) => {
    try {
      const { avatarId } = req.params;
      const { q: query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Search query is required' });
      }
      
      console.log(`🔍 Searching knowledge for ${avatarId}: "${query}"`);
      
      const results = await AvatarKnowledgeService.searchKnowledge(avatarId, query);
      
      res.json({
        success: true,
        results,
        query,
        count: results.length
      });
      
    } catch (error: any) {
      console.error('❌ Error searching knowledge:', error);
      res.status(500).json({ 
        error: 'Failed to search knowledge base',
        details: error.message 
      });
    }
  });

  // Delete document
  app.delete('/api/avatar-knowledge/documents/:documentId', async (req: Request, res: Response) => {
    try {
      const { documentId } = req.params;
      
      console.log(`🗑️ Deleting document: ${documentId}`);
      
      const success = await AvatarKnowledgeService.deleteDocument(parseInt(documentId));
      
      if (success) {
        res.json({
          success: true,
          message: 'Document deleted successfully'
        });
      } else {
        res.status(404).json({ error: 'Document not found or could not be deleted' });
      }
      
    } catch (error: any) {
      console.error('❌ Error deleting document:', error);
      res.status(500).json({ 
        error: 'Failed to delete document',
        details: error.message 
      });
    }
  });

  // NEW: Get training impact analysis for avatar
  app.get('/api/avatar-knowledge/:avatarId/training-impact', async (req: Request, res: Response) => {
    try {
      const { avatarId } = req.params;
      
      console.log(`🎯 Fetching training impact for avatar: ${avatarId}`);
      
      const { TrainingImpactService } = await import('./services/trainingImpactService');
      const trainingImpact = await TrainingImpactService.getTrainingImpactForAvatar(avatarId);
      
      console.log(`✅ Found training impact with ${Object.keys(trainingImpact).length} categories`);
      
      res.json({
        success: true,
        trainingImpact: trainingImpact
      });
      
    } catch (error) {
      console.error('Error fetching training impact:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch training impact'
      });
    }
  });

  // NEW: Trigger comprehensive training impact analysis for a document
  app.post('/api/avatar-knowledge/:avatarId/analyze-document', async (req: Request, res: Response) => {
    try {
      const { avatarId } = req.params;
      const { documentId } = req.body;
      
      console.log(`🧠 Starting comprehensive analysis for document ${documentId} in avatar ${avatarId}`);
      
      // Get document content
      const [document] = await db.select()
        .from(avatarKnowledgeDocuments)
        .where(eq(avatarKnowledgeDocuments.id, documentId));
        
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }
      
      console.log(`📄 Found document: ${document.filename} (${document.processedContent.length} characters)`);
      
      // Run comprehensive training impact analysis
      const trainingImpact = await TrainingImpactService.analyzeDocumentImpact(
        documentId,
        document.processedContent,
        document.filename,
        avatarId
      );
      
      // Update document with analysis
      await TrainingImpactService.updateDocumentWithAnalysis(
        documentId,
        trainingImpact.title,
        trainingImpact.analysis,
        trainingImpact.category
      );
      
      console.log(`✅ Comprehensive analysis completed:`);
      console.log(`📊 Title: "${trainingImpact.title}"`);
      console.log(`📚 Category: "${trainingImpact.category}"`);
      console.log(`📝 Analysis length: ${trainingImpact.analysis.length} characters`);
      
      res.json({
        success: true,
        trainingImpact,
        message: 'Document analysis completed successfully'
      });
      
    } catch (error: any) {
      console.error('❌ Error analyzing document:', error);
      res.status(500).json({ 
        error: 'Failed to analyze document',
        details: error.message 
      });
    }
  });

  console.log('✅ Avatar Knowledge Base routes registered successfully');
};