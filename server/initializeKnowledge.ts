import { knowledgeBaseManager } from './knowledgeBase';
import { i18nManager } from './internationalization';

export async function initializeKnowledgeBase() {
  try {
    await knowledgeBaseManager.initializeKnowledgeBase();
    console.log('✅ Knowledge base initialized successfully with evidence-based medical facts');
  } catch (error) {
    console.error('❌ Error initializing knowledge base:', error);
  }
}

export async function initializeInternationalization() {
  try {
    await i18nManager.initializeLanguages();
    await i18nManager.initializeDefaultTranslations();
    console.log('✅ Internationalization initialized with 8 languages');
  } catch (error) {
    console.error('❌ Error initializing internationalization:', error);
  }
}

// Initialize systems on server startup
initializeKnowledgeBase();
initializeInternationalization();