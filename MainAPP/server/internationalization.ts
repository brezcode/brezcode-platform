import { db } from './db';
import { languages, translations, userPreferences } from '@shared/schema';
import { eq } from 'drizzle-orm';

export class InternationalizationManager {
  private translationCache = new Map<string, Map<string, string>>();
  private supportedLanguages = ['en', 'zh-CN', 'zh-TW', 'es', 'fr', 'de', 'ja', 'ko', 'vi'];

  async initializeLanguages() {
    // Initialize supported languages
    const defaultLanguages = [
      { code: 'en', name: 'English' },
      { code: 'zh-CN', name: '简体中文' },
      { code: 'zh-TW', name: '繁體中文' },
      { code: 'es', name: 'Español' },
      { code: 'fr', name: 'Français' },
      { code: 'de', name: 'Deutsch' },
      { code: 'ja', name: '日本語' },
      { code: 'ko', name: '한국어' },
      { code: 'vi', name: 'Tiếng Việt' }
    ];

    try {
      for (const lang of defaultLanguages) {
        await db
          .insert(languages)
          .values(lang)
          .onConflictDoUpdate({
            target: languages.code,
            set: { name: lang.name }
          });
      }
      console.log('✅ Languages initialized');
    } catch (error) {
      console.warn('Languages may already exist:', error);
    }
  }

  async getTranslation(key: string, languageCode: string = 'en'): Promise<string> {
    // Check cache first
    if (this.translationCache.has(languageCode)) {
      const langCache = this.translationCache.get(languageCode);
      if (langCache?.has(key)) {
        return langCache.get(key)!;
      }
    }

    // Query database
    try {
      const [translation] = await db
        .select()
        .from(translations)
        .where(eq(translations.key, key) && eq(translations.languageCode, languageCode));

      if (translation) {
        // Cache the result
        if (!this.translationCache.has(languageCode)) {
          this.translationCache.set(languageCode, new Map());
        }
        this.translationCache.get(languageCode)!.set(key, translation.value);
        return translation.value;
      }
    } catch (error) {
      console.warn('Translation query failed:', error);
    }

    // Fallback to English if not found
    if (languageCode !== 'en') {
      return this.getTranslation(key, 'en');
    }

    // Return key as fallback
    return key;
  }

  async addTranslation(key: string, value: string, languageCode: string, context?: string) {
    try {
      await db
        .insert(translations)
        .values({
          key,
          value,
          languageCode,
          context
        })
        .onConflictDoUpdate({
          target: [translations.key, translations.languageCode],
          set: { value, updatedAt: new Date() }
        });

      // Update cache
      if (!this.translationCache.has(languageCode)) {
        this.translationCache.set(languageCode, new Map());
      }
      this.translationCache.get(languageCode)!.set(key, value);
    } catch (error) {
      console.error('Failed to add translation:', error);
    }
  }

  async getUserLanguage(userId: number): Promise<string> {
    try {
      const [prefs] = await db
        .select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, userId));

      return prefs?.languageCode || 'en';
    } catch (error) {
      console.warn('Failed to get user language:', error);
      return 'en';
    }
  }

  async setUserLanguage(userId: number, languageCode: string) {
    try {
      await db
        .insert(userPreferences)
        .values({
          userId,
          languageCode
        })
        .onConflictDoUpdate({
          target: userPreferences.userId,
          set: { languageCode, updatedAt: new Date() }
        });
    } catch (error) {
      console.error('Failed to set user language:', error);
    }
  }

  detectLanguageFromRequest(req: any): string {
    // Check user session language
    if (req.user?.languageCode) {
      return req.user.languageCode;
    }

    // Check Accept-Language header
    const acceptLanguage = req.headers['accept-language'];
    if (acceptLanguage) {
      const languages = acceptLanguage.split(',').map((lang: string) => {
        const [code] = lang.trim().split(';');
        return code;
      });

      for (const lang of languages) {
        if (this.supportedLanguages.includes(lang)) {
          return lang;
        }
        // Check for partial matches (e.g., 'zh' matches 'zh-CN')
        const partialMatch = this.supportedLanguages.find(supported => 
          supported.startsWith(lang.split('-')[0])
        );
        if (partialMatch) {
          return partialMatch;
        }
      }
    }

    return 'en'; // Default fallback
  }

  async initializeDefaultTranslations() {
    const defaultTranslations = {
      // Quiz Section
      'quiz.title': {
        en: 'Breast Health Assessment',
        'zh-CN': '乳房健康评估',
        'zh-TW': '乳房健康評估',
        es: 'Evaluación de Salud Mamaria',
        fr: 'Évaluation de la Santé Mammaire',
        de: 'Brustgesundheitsbewertung',
        ja: '乳房健康評価',
        ko: '유방 건강 평가',
        vi: 'Đánh Giá Sức Khỏe Vú'
      },
      
      'quiz.age.title': {
        en: 'What is your age?',
        'zh-CN': '您的年龄是多少？',
        'zh-TW': '您的年齡是多少？',
        es: '¿Cuál es su edad?',
        fr: 'Quel est votre âge?',
        de: 'Wie alt sind Sie?',
        ja: 'あなたの年齢は？',
        ko: '나이가 어떻게 되시나요?',
        vi: 'Tuổi của bạn là bao nhiêu?'
      },

      // Report Section
      'report.title': {
        en: 'Your Health Report',
        'zh-CN': '您的健康报告',
        'zh-TW': '您的健康報告',
        es: 'Su Informe de Salud',
        fr: 'Votre Rapport de Santé',
        de: 'Ihr Gesundheitsbericht',
        ja: 'あなたの健康レポート',
        ko: '건강 보고서',
        vi: 'Báo Cáo Sức Khỏe Của Bạn'
      },

      // Coaching Section
      'coaching.daily_tip': {
        en: 'Daily Health Tip',
        'zh-CN': '每日健康小贴士',
        'zh-TW': '每日健康小貼士',
        es: 'Consejo Diario de Salud',
        fr: 'Conseil Santé Quotidien',
        de: 'Täglicher Gesundheitstipp',
        ja: '毎日の健康のヒント',
        ko: '일일 건강 팁',
        vi: 'Mẹo Sức Khỏe Hàng Ngày'
      },

      // Common Actions
      'button.continue': {
        en: 'Continue',
        'zh-CN': '继续',
        'zh-TW': '繼續',
        es: 'Continuar',
        fr: 'Continuer',
        de: 'Weiter',
        ja: '続行',
        ko: '계속',
        vi: 'Tiếp tục'
      },

      'button.submit': {
        en: 'Submit',
        'zh-CN': '提交',
        'zh-TW': '提交',
        es: 'Enviar',
        fr: 'Soumettre',
        de: 'Absenden',
        ja: '送信',
        ko: '제출',
        vi: 'Gửi'
      }
    };

    console.log('🌍 Initializing default translations...');
    
    for (const [key, translations] of Object.entries(defaultTranslations)) {
      for (const [languageCode, value] of Object.entries(translations)) {
        await this.addTranslation(key, value, languageCode, 'default');
      }
    }

    console.log('✅ Default translations initialized');
  }
}

export const i18nManager = new InternationalizationManager();