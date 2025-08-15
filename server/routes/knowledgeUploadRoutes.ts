
import type { Express } from "express";
import multer from 'multer';
import { db } from '../db';
import { avatarKnowledge } from '@shared/avatar-schema';
import { eq } from 'drizzle-orm';

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const requireAuth = (req: any, res: any, next: any) => {
  const userId = req.session?.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.userId = userId;
  next();
};

export function registerKnowledgeUploadRoutes(app: Express): void {
  // Upload file to knowledge base for all avatars
  app.post('/api/knowledge/upload', requireAuth, upload.single('file'), async (req, res) => {
    try {
      const { brandId, category = 'general', title } = req.body;
      const file = req.file;

      if (!file || !brandId) {
        return res.status(400).json({ 
          success: false, 
          error: 'File and brand ID are required' 
        });
      }

      // Process file content based on type
      let content = '';
      const fileType = file.mimetype;

      if (fileType.includes('text') || fileType.includes('json')) {
        content = file.buffer.toString('utf8');
      } else if (fileType.includes('pdf')) {
        // For PDF files, you'd integrate with a PDF parser
        content = `PDF file uploaded: ${file.originalname}. Content extraction needed.`;
      } else {
        content = `File uploaded: ${file.originalname} (${fileType})`;
      }

      // Split content into manageable chunks for better search
      const chunks = splitContentIntoChunks(content, 1000);
      const createdEntries = [];

      for (let i = 0; i < chunks.length; i++) {
        const [entry] = await db.insert(avatarKnowledge).values({
          brandId,
          configId: 'shared', // Special ID for shared knowledge
          title: title || `${file.originalname} (Part ${i + 1})`,
          content: chunks[i],
          category,
          tags: [file.originalname, category, 'uploaded'],
          isActive: true,
        }).returning();

        createdEntries.push(entry);
      }

      res.json({
        success: true,
        message: `Successfully uploaded ${file.originalname}`,
        entries: createdEntries.length,
        filename: file.originalname,
        fileType,
        category
      });

    } catch (error: any) {
      console.error('Knowledge upload error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload knowledge',
        details: error.message
      });
    }
  });

  // Get all knowledge entries for a brand
  app.get('/api/knowledge/:brandId', requireAuth, async (req, res) => {
    try {
      const { brandId } = req.params;
      
      const knowledge = await db
        .select()
        .from(avatarKnowledge)
        .where(eq(avatarKnowledge.brandId, brandId))
        .orderBy(avatarKnowledge.createdAt);

      res.json({
        success: true,
        knowledge
      });
    } catch (error: any) {
      console.error('Error fetching knowledge:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch knowledge'
      });
    }
  });

  // Delete knowledge entry
  app.delete('/api/knowledge/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      
      await db
        .update(avatarKnowledge)
        .set({ isActive: false })
        .where(eq(avatarKnowledge.id, id));

      res.json({
        success: true,
        message: 'Knowledge entry deleted'
      });
    } catch (error: any) {
      console.error('Error deleting knowledge:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete knowledge'
      });
    }
  });
}

function splitContentIntoChunks(content: string, maxChunkSize: number): string[] {
  const chunks = [];
  const sentences = content.split(/[.!?]+/);
  let currentChunk = '';

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence + '.';
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
