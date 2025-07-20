import { Router } from "express";
import { AvatarService } from "../avatarService";
import { AvatarRequirementsService } from "../avatarRequirementsService";
import { brandMiddleware, requireBrand } from "../brandMiddleware";
import { z } from "zod";
import { avatarQuizSchema } from "@shared/avatar-schema";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const router = Router();

// Apply brand middleware to all routes
router.use(brandMiddleware);
router.use(requireBrand);

// Middleware to check if customer is authenticated
const requireCustomerAuth = (req: any, res: any, next: any) => {
  const customerId = (req.session as any)?.customerId;
  if (!customerId) {
    return res.status(401).json({ error: "Customer authentication required" });
  }
  req.customerId = customerId;
  next();
};

// Create new avatar session
router.post("/session", requireCustomerAuth, async (req: any, res) => {
  try {
    const createSessionSchema = z.object({
      avatarId: z.string().optional(),
      language: z.string().default("en"),
    });

    const { avatarId, language } = createSessionSchema.parse(req.body);
    const brandId = req.brand!.id;
    const customerId = req.customerId;

    const session = await AvatarService.createAvatarSession(brandId, customerId, avatarId);
    
    res.json({
      success: true,
      session,
    });
  } catch (error: any) {
    console.error("Avatar session creation error:", error);
    res.status(500).json({ 
      error: "Failed to create avatar session",
      message: error.message 
    });
  }
});

// Send message to avatar
router.post("/message", requireCustomerAuth, async (req: any, res) => {
  try {
    const messageSchema = z.object({
      sessionId: z.string(),
      message: z.string().min(1),
      language: z.string().default("en"),
    });

    const { sessionId, message, language } = messageSchema.parse(req.body);
    const brandId = req.brand!.id;
    const customerId = req.customerId;

    const response = await AvatarService.sendMessageToAvatar(
      brandId, 
      customerId, 
      sessionId, 
      message, 
      language
    );
    
    res.json({
      success: true,
      ...response,
    });
  } catch (error: any) {
    console.error("Avatar message error:", error);
    res.status(500).json({ 
      error: "Failed to send message to avatar",
      message: error.message 
    });
  }
});

// Get available avatars
router.get("/available", async (req, res) => {
  try {
    const avatars = await AvatarService.getAvailableAvatars();
    
    res.json({
      success: true,
      avatars,
    });
  } catch (error: any) {
    console.error("Error fetching avatars:", error);
    res.status(500).json({ 
      error: "Failed to fetch avatars",
      message: error.message 
    });
  }
});

// Create custom avatar for brand
router.post("/custom", async (req: any, res) => {
  try {
    const customAvatarSchema = z.object({
      name: z.string().min(1),
      imageUrl: z.string().url(),
    });

    const { name, imageUrl } = customAvatarSchema.parse(req.body);
    const brandId = req.brand!.id;

    const avatar = await AvatarService.createCustomAvatar(brandId, name, imageUrl);
    
    res.json({
      success: true,
      avatar,
    });
  } catch (error: any) {
    console.error("Custom avatar creation error:", error);
    res.status(500).json({ 
      error: "Failed to create custom avatar",
      message: error.message 
    });
  }
});

// Close avatar session
router.post("/session/:sessionId/close", requireCustomerAuth, async (req: any, res) => {
  try {
    const { sessionId } = req.params;

    await AvatarService.closeAvatarSession(sessionId);
    
    res.json({
      success: true,
      message: "Avatar session closed",
    });
  } catch (error: any) {
    console.error("Error closing avatar session:", error);
    res.status(500).json({ 
      error: "Failed to close avatar session",
      message: error.message 
    });
  }
});

// Get chat history
router.get("/history", requireCustomerAuth, async (req: any, res) => {
  try {
    const brandId = req.brand!.id;
    const customerId = req.customerId;

    const history = await AvatarService.getChatHistory(brandId, customerId);
    
    res.json({
      success: true,
      history,
    });
  } catch (error: any) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ 
      error: "Failed to fetch chat history",
      message: error.message 
    });
  }
});

// Prepare voice call (for Twilio integration)
router.post("/voice/prepare", async (req: any, res) => {
  try {
    const voiceCallSchema = z.object({
      phoneNumber: z.string().min(10),
      language: z.string().default("en"),
    });

    const { phoneNumber, language } = voiceCallSchema.parse(req.body);
    const brandId = req.brand!.id;

    const callPrep = await AvatarService.prepareVoiceCall(brandId, phoneNumber, language);
    
    res.json({
      success: true,
      callPrep,
    });
  } catch (error: any) {
    console.error("Voice call preparation error:", error);
    res.status(500).json({ 
      error: "Failed to prepare voice call",
      message: error.message 
    });
  }
});

// ===== AVATAR REQUIREMENTS & SETUP ROUTES =====

// Save avatar requirements from quiz
router.post("/requirements", requireCustomerAuth, async (req: any, res) => {
  try {
    const requirements = avatarQuizSchema.parse(req.body);
    const brandId = req.brand!.id;
    const customerId = req.customerId;

    const result = await AvatarRequirementsService.saveRequirements(
      brandId, 
      customerId, 
      requirements
    );
    
    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Avatar requirements error:", error);
    res.status(500).json({ 
      error: "Failed to save avatar requirements",
      message: error.message 
    });
  }
});

// Create avatar configuration from requirements
router.post("/config", async (req: any, res) => {
  try {
    const configSchema = z.object({
      requirementsId: z.string().uuid(),
      avatarName: z.string().min(1),
      heygenAvatarId: z.string().optional(),
    });

    const { requirementsId, avatarName, heygenAvatarId } = configSchema.parse(req.body);
    const brandId = req.brand!.id;

    const configId = await AvatarRequirementsService.createAvatarConfig(
      brandId,
      requirementsId,
      avatarName,
      heygenAvatarId
    );
    
    res.json({
      success: true,
      configId,
    });
  } catch (error: any) {
    console.error("Avatar config creation error:", error);
    res.status(500).json({ 
      error: "Failed to create avatar configuration",
      message: error.message 
    });
  }
});

// Get customer requirements
router.get("/requirements", requireCustomerAuth, async (req: any, res) => {
  try {
    const brandId = req.brand!.id;
    const customerId = req.customerId;

    const requirements = await AvatarRequirementsService.getCustomerRequirements(
      brandId,
      customerId
    );
    
    res.json({
      success: true,
      requirements,
    });
  } catch (error: any) {
    console.error("Error fetching requirements:", error);
    res.status(500).json({ 
      error: "Failed to fetch requirements",
      message: error.message 
    });
  }
});

// ===== KNOWLEDGE BASE ROUTES =====

// Add knowledge to avatar
router.post("/knowledge", async (req: any, res) => {
  try {
    const knowledgeSchema = z.object({
      configId: z.string().uuid(),
      title: z.string().min(1),
      content: z.string().min(1),
      category: z.string().min(1),
      tags: z.array(z.string()).optional(),
    });

    const knowledge = knowledgeSchema.parse(req.body);
    const brandId = req.brand!.id;

    const entryId = await AvatarRequirementsService.addKnowledge(
      brandId,
      knowledge.configId,
      knowledge
    );
    
    res.json({
      success: true,
      entryId,
    });
  } catch (error: any) {
    console.error("Knowledge addition error:", error);
    res.status(500).json({ 
      error: "Failed to add knowledge",
      message: error.message 
    });
  }
});

// Get knowledge base
router.get("/knowledge/:configId", async (req: any, res) => {
  try {
    const { configId } = req.params;
    const brandId = req.brand!.id;

    const knowledge = await AvatarRequirementsService.getKnowledgeBase(
      brandId,
      configId
    );
    
    res.json({
      success: true,
      knowledge,
    });
  } catch (error: any) {
    console.error("Error fetching knowledge base:", error);
    res.status(500).json({ 
      error: "Failed to fetch knowledge base",
      message: error.message 
    });
  }
});

// Search knowledge base
router.get("/knowledge/:configId/search", async (req: any, res) => {
  try {
    const { configId } = req.params;
    const { q: query } = req.query;
    const brandId = req.brand!.id;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ 
        error: "Search query is required" 
      });
    }

    const results = await AvatarRequirementsService.searchKnowledge(
      brandId,
      configId,
      query
    );
    
    res.json({
      success: true,
      results,
    });
  } catch (error: any) {
    console.error("Knowledge search error:", error);
    res.status(500).json({ 
      error: "Failed to search knowledge base",
      message: error.message 
    });
  }
});

// Demo chat endpoint (no auth required for testing)
router.post("/chat", async (req: any, res) => {
  try {
    const { message, sessionId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("Demo chat request:", { message, sessionId });
    console.log("OpenAI API Key exists:", !!process.env.OPENAI_API_KEY);

    // Use the same pattern as the working chat service
    const systemPrompt = `You are a professional health assistant specializing in breast health education and self-care. Your role is to provide clear, step-by-step guidance for self breast exams and general breast health practices. Always include appropriate medical disclaimers and encourage professional medical consultation when needed.

Key guidelines:
- Provide detailed, easy-to-follow instructions
- Use encouraging and supportive language
- Include timing recommendations (when to do exams)
- Emphasize the importance of regular self-exams
- Always recommend professional medical care for any concerns
- Be thorough but not overwhelming`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ];

    console.log("Calling OpenAI with", messages.length, "messages");

    let aiResponse;
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages as any,
        max_tokens: 500,
        temperature: 0.7,
      });

      console.log("OpenAI response received successfully");
      aiResponse = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
    } catch (openaiError: any) {
      console.log("OpenAI API unavailable, providing educational fallback");
      // Provide educational fallback for self breast exam instruction
      aiResponse = `I'll guide you through a proper self breast exam step by step. **Please note: This is educational information only. Always consult your healthcare provider for medical advice.**

**When to perform self breast exam:**
- Best time: 7-10 days after your period starts
- If no periods: Choose the same day each month

**Step-by-step self breast exam:**

**Step 1 - Visual Inspection (Mirror)**
- Stand in front of a mirror, shoulders straight, arms on hips
- Look for changes in size, shape, dimpling, or skin texture
- Raise your arms overhead and check again

**Step 2 - Lying Down Examination**
- Lie down with a pillow under your right shoulder
- Use your left hand to examine your right breast
- Use finger pads (not tips) in small circular motions
- Apply light, medium, then firm pressure
- Cover the entire breast from collarbone to bra line

**Step 3 - Pattern Coverage**
- Use up-and-down pattern covering all breast tissue
- Include the area under your arm
- Repeat on the other side

**What to feel for:**
- New lumps or thickening
- Changes in size or shape
- Skin dimpling or puckering
- Nipple discharge or inversion

**Important:** Contact your healthcare provider if you notice any changes. Early detection saves lives, and most breast changes are not cancer.

Would you like me to explain any specific step in more detail?`;
    }

    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error("Demo chat error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      error: "Failed to process message",
      message: error.message 
    });
  }
});

export default router;