import OpenAI from 'openai';
import { knowledgeBaseManager } from './knowledgeBase';

// Using OpenAI GPT-4o with evidence-based knowledge system
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class EnhancedAI {
  async generateEvidenceBasedReport(quizAnswers: any, reportType: string) {
    // Get relevant knowledge base content
    const relevantKnowledge = await knowledgeBaseManager.getEvidenceBasedContent(reportType);
    
    // Build evidence-based context
    const knowledgeContext = relevantKnowledge.map(kb => 
      `EVIDENCE: ${kb.title}\n${kb.content}\nSource: ${kb.sourceFile}\nEvidence Level: ${kb.evidenceLevel}`
    ).join('\n\n');

    const systemPrompt = `You are an expert breast health AI assistant with access to evidence-based medical knowledge. 

CRITICAL MEDICAL ACCURACY REQUIREMENTS:
1. Age 30 is NOT in an age group where breast cancer incidence increases significantly
2. 85% of breast cancer patients do NOT have family history - warn users to stay alert even without family history
3. NEVER assume breast density from screening if user has never had screening
4. Only use facts from the provided knowledge base and attached medical reference book
5. All medical statements must be evidence-based and accurate

AVAILABLE EVIDENCE-BASED KNOWLEDGE:
${knowledgeContext}

INSTRUCTIONS:
- Use only the provided evidence-based knowledge
- Correct any medical inaccuracies immediately
- Provide specific, actionable recommendations
- Include appropriate medical disclaimers
- Be compassionate but medically accurate

Quiz Data: ${JSON.stringify(quizAnswers, null, 2)}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 2000,
      messages: [{
        role: 'system',
        content: systemPrompt
      }, {
        role: 'user',
        content: `Generate a medically accurate ${reportType} report based on the quiz answers and evidence-based knowledge provided. Ensure all medical facts are correct and evidence-based.`
      }]
    });

    return response.choices[0].message.content || '';
  }

  async generatePersonalizedRecommendations(userProfile: string, riskFactors: any[]) {
    const knowledgeContext = await knowledgeBaseManager.getEvidenceBasedContent('recommendations');
    
    const systemPrompt = `You are generating personalized breast health recommendations using evidence-based medical knowledge.

EVIDENCE-BASED KNOWLEDGE:
${knowledgeContext.map(kb => `${kb.title}: ${kb.content}`).join('\n')}

CRITICAL ACCURACY REQUIREMENTS:
- All recommendations must be evidence-based
- Include specific actionable steps
- Provide realistic timelines
- Include appropriate medical disclaimers
- Be compassionate and empowering

User Profile: ${userProfile}
Risk Factors: ${JSON.stringify(riskFactors)}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1500,
      messages: [{
        role: 'system',
        content: systemPrompt
      }, {
        role: 'user',
        content: 'Generate personalized, evidence-based recommendations for this user.'
      }]
    });

    return response.choices[0].message.content || '';
  }

  async validateMedicalContent(content: string) {
    const knowledgeContext = await knowledgeBaseManager.getEvidenceBasedContent('validation');
    
    const systemPrompt = `You are a medical content validator. Check the provided content for medical accuracy using evidence-based knowledge.

EVIDENCE-BASED KNOWLEDGE:
${knowledgeContext.map(kb => `${kb.title}: ${kb.content}`).join('\n')}

VALIDATION CRITERIA:
- Age 30 is NOT high risk for breast cancer
- 85% of breast cancer patients have NO family history
- Never assume breast density without screening
- All medical facts must be evidence-based

Content to validate: ${content}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1000,
      messages: [{
        role: 'system',
        content: systemPrompt
      }, {
        role: 'user',
        content: 'Validate this medical content for accuracy and provide corrections if needed.'
      }]
    });

    return response.choices[0].message.content || '';
  }
}

export const enhancedAI = new EnhancedAI();