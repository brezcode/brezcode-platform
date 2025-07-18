import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface TranslationRequest {
  text: string;
  targetLanguage: string;
  context?: string;
}

export class AITranslationService {
  private translationCache = new Map<string, string>();

  async translateText({ text, targetLanguage, context }: TranslationRequest): Promise<string> {
    const cacheKey = `${text}-${targetLanguage}`;
    
    // Check cache first
    if (this.translationCache.has(cacheKey)) {
      return this.translationCache.get(cacheKey)!;
    }

    try {
      const languageNames: Record<string, string> = {
        'zh-CN': 'Simplified Chinese',
        'zh-TW': 'Traditional Chinese',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'ja': 'Japanese',
        'ko': 'Korean',
        'vi': 'Vietnamese'
      };

      const targetLangName = languageNames[targetLanguage] || targetLanguage;
      
      const prompt = `Translate the following text to ${targetLangName}. This is for a breast health and wellness application.

Context: ${context || 'Medical/health wellness application focused on breast cancer prevention and health coaching'}

Text to translate: "${text}"

Requirements:
- Use natural, native-sounding language
- Maintain the tone and emotion of the original
- For medical/health terms, use appropriate medical terminology
- Keep any formatting like quotation marks
- For Traditional Chinese, use Taiwan-style terminology
- For marketing copy, make it compelling and culturally appropriate

Translation:`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional medical translator specializing in health and wellness content. Provide only the translation without any explanations or additional text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      });

      const translation = response.choices[0]?.message?.content?.trim() || text;
      
      // Cache the translation
      this.translationCache.set(cacheKey, translation);
      
      return translation;
    } catch (error) {
      console.error('AI translation failed:', error);
      return text; // Fallback to original text
    }
  }

  async translateBatch(texts: { key: string; text: string; context?: string }[], targetLanguage: string): Promise<Record<string, string>> {
    const results: Record<string, string> = {};
    
    // Process translations in parallel but with a limit to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const promises = batch.map(async item => {
        const translation = await this.translateText({
          text: item.text,
          targetLanguage,
          context: item.context
        });
        return { key: item.key, translation };
      });
      
      const batchResults = await Promise.all(promises);
      batchResults.forEach(result => {
        results[result.key] = result.translation;
      });
      
      // Small delay between batches to respect rate limits
      if (i + batchSize < texts.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return results;
  }
}

export const aiTranslationService = new AITranslationService();