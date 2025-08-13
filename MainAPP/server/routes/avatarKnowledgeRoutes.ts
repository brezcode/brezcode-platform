
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ClaudeAvatarService } from '../services/claudeAvatarService';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'avatar-knowledge');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'text/plain',
      'application/pdf', 
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/markdown',
      'application/json',
      'image/png',
      'image/jpeg',
      'image/gif',
      'text/csv'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  }
});

// Upload and extract content from file
router.post('/upload-knowledge', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { avatarType, fileId } = req.body;
    const filePath = req.file.path;
    
    console.log(`📁 Processing file: ${req.file.originalname} for ${avatarType}`);

    let extractedContent = '';

    // Extract content based on file type
    switch (req.file.mimetype) {
      case 'text/plain':
      case 'text/markdown':
      case 'application/json':
      case 'text/csv':
        extractedContent = fs.readFileSync(filePath, 'utf8');
        break;
        
      case 'application/pdf':
        // For PDF files, we'll use a simple text extraction
        // In production, you might want to use pdf-parse or similar
        extractedContent = `PDF content from ${req.file.originalname} (PDF processing would be implemented here)`;
        break;
        
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        // For Word documents, you'd use mammoth or similar
        extractedContent = `Word document content from ${req.file.originalname} (Word processing would be implemented here)`;
        break;
        
      case 'image/png':
      case 'image/jpeg':
      case 'image/gif':
        // For images, you could use OCR or image analysis
        extractedContent = `Image analysis from ${req.file.originalname} (Image OCR would be implemented here)`;
        break;
        
      default:
        extractedContent = `Content from ${req.file.originalname}`;
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      fileId,
      fileName: req.file.originalname,
      extractedContent,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    });

  } catch (error: any) {
    console.error('File upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Extract knowledge points from content using AI
router.post('/extract-knowledge', async (req, res) => {
  try {
    const { content, fileName, avatarType, fileId } = req.body;

    if (!content || !avatarType) {
      return res.status(400).json({ error: 'Content and avatar type are required' });
    }

    console.log(`🧠 Extracting knowledge from ${fileName} for ${avatarType}`);

    // Use Claude to extract structured knowledge points
    const knowledgePoints = await extractKnowledgeWithAI(content, fileName, avatarType);

    // Store the knowledge in the avatar's knowledge base
    await storeAvatarKnowledge(avatarType, {
      fileId,
      fileName,
      knowledgePoints,
      originalContent: content,
      extractedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      knowledgePoints,
      extractedCount: knowledgePoints.length
    });

  } catch (error: any) {
    console.error('Knowledge extraction error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get avatar's knowledge base
router.get('/knowledge-base/:avatarType', async (req, res) => {
  try {
    const { avatarType } = req.params;
    const knowledgeBase = await getAvatarKnowledgeBase(avatarType);
    
    res.json({
      success: true,
      avatarType,
      knowledgeBase,
      totalEntries: knowledgeBase.length,
      lastUpdated: knowledgeBase[0]?.extractedAt || null
    });

  } catch (error: any) {
    console.error('Knowledge base retrieval error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to extract knowledge using AI
async function extractKnowledgeWithAI(content: string, fileName: string, avatarType: string): Promise<string[]> {
  try {
    // Create a specialized prompt based on avatar type
    const avatarContext = getAvatarContext(avatarType);
    
    const prompt = `You are extracting knowledge points for a ${avatarType} AI avatar from the file "${fileName}".

Avatar Context: ${avatarContext}

Content to analyze:
${content.substring(0, 4000)} ${content.length > 4000 ? '...' : ''}

Extract 5-15 specific, actionable knowledge points that would be valuable for this avatar to know. Each point should be:
1. Specific and actionable
2. Relevant to the avatar's role and expertise
3. Something the avatar can reference in conversations
4. Formatted as a complete sentence or instruction

Return the knowledge points as a JSON array of strings.`;

    // Use Claude to extract knowledge (simplified version)
    const response = await ClaudeAvatarService.generateAvatarResponse(
      'knowledge_extractor',
      prompt,
      [],
      'knowledge_extraction'
    );

    // Parse the response to extract knowledge points
    let knowledgePoints: string[] = [];
    try {
      // Try to parse as JSON array
      const parsed = JSON.parse(response.content);
      if (Array.isArray(parsed)) {
        knowledgePoints = parsed;
      }
    } catch {
      // If JSON parsing fails, split by lines and filter
      knowledgePoints = response.content
        .split('\n')
        .filter(line => line.trim().length > 10)
        .map(line => line.replace(/^[\d\-\*\•]\s*/, '').trim())
        .slice(0, 15);
    }

    return knowledgePoints.filter(point => point.length > 0);

  } catch (error) {
    console.error('AI knowledge extraction failed:', error);
    // Fallback: simple content analysis
    return content
      .split(/[.!?]/)
      .filter(sentence => sentence.trim().length > 20)
      .slice(0, 10)
      .map(sentence => sentence.trim());
  }
}

// Get avatar context for knowledge extraction
function getAvatarContext(avatarType: string): string {
  const contexts = {
    'sales_specialist': 'A sales expert focused on closing deals, handling objections, and building customer relationships',
    'customer_service': 'A customer service professional focused on resolving issues, providing support, and ensuring satisfaction',
    'technical_support': 'A technical expert focused on troubleshooting, diagnostics, and solving technical problems',
    'business_consultant': 'A business strategist focused on growth, optimization, and strategic planning',
    'health_coach': 'A health and wellness expert focused on education, prevention, and patient guidance',
    'education_specialist': 'An educational expert focused on learning, teaching strategies, and student development',
    'dr_sakura': 'A health coach specializing in breast health, women\'s wellness, and medical education'
  };
  
  return contexts[avatarType as keyof typeof contexts] || 'A professional AI assistant';
}

// In-memory knowledge storage (in production, use database)
let avatarKnowledgeBases: { [avatarType: string]: any[] } = {};

async function storeAvatarKnowledge(avatarType: string, knowledge: any) {
  if (!avatarKnowledgeBases[avatarType]) {
    avatarKnowledgeBases[avatarType] = [];
  }
  
  avatarKnowledgeBases[avatarType].push(knowledge);
  console.log(`💾 Stored ${knowledge.knowledgePoints.length} knowledge points for ${avatarType}`);
}

async function getAvatarKnowledgeBase(avatarType: string) {
  return avatarKnowledgeBases[avatarType] || [];
}

export default router;
