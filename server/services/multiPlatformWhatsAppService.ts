import { WhatsAppService, WhatsAppContact, WhatsAppMessage } from '../whatsappService';

export interface PlatformConfig {
  platform: 'brezcode' | 'skincoach' | 'leadgen';
  phoneNumberId: string;
  businessName: string;
  brandColor: string;
  logoUrl: string;
  welcomeMessage: string;
  aiPersonality: string;
  businessId?: string; // For LeadGen SaaS clients
}

export class MultiPlatformWhatsAppService {
  private static instance: MultiPlatformWhatsAppService;
  private whatsappService: WhatsAppService;

  // Platform configurations
  private platformConfigs: Map<string, PlatformConfig> = new Map([
    ['brezcode', {
      platform: 'brezcode',
      phoneNumberId: process.env.BREZCODE_PHONE_NUMBER_ID || process.env.WA_PHONE_NUMBER_ID || '',
      businessName: 'BrezCode Health',
      brandColor: '#e91e63',
      logoUrl: 'https://brezcode.com/logo.png',
      welcomeMessage: '👋 Welcome to BrezCode! I\'m Dr. Sakura, your personal health coach. How can I help you today?',
      aiPersonality: 'Dr. Sakura - Empathetic health coach specializing in breast health and wellness'
    }],
    ['skincoach', {
      platform: 'skincoach',
      phoneNumberId: process.env.SKINCOACH_PHONE_NUMBER_ID || process.env.WA_PHONE_NUMBER_ID || '',
      businessName: 'SkinCoach AI',
      brandColor: '#9c27b0',
      logoUrl: 'https://skincoach.ai/logo.png',
      welcomeMessage: '✨ Welcome to SkinCoach! I\'m your AI skin analyst. Send me a photo for personalized skin analysis!',
      aiPersonality: 'SkinCoach AI - Expert in skin analysis, acne assessment, and skincare recommendations'
    }],
    ['leadgen', {
      platform: 'leadgen',
      phoneNumberId: process.env.LEADGEN_PHONE_NUMBER_ID || process.env.WA_PHONE_NUMBER_ID || '',
      businessName: 'LeadGen Pro',
      brandColor: '#2196f3',
      logoUrl: 'https://leadgen.to/logo.png',
      welcomeMessage: '🚀 Welcome to LeadGen Pro! I\'m your business growth assistant. Let\'s generate some leads!',
      aiPersonality: 'LeadGen AI - Business development expert focused on lead generation and sales automation'
    }]
  ]);

  private constructor() {
    this.whatsappService = WhatsAppService.getInstance();
  }

  public static getInstance(): MultiPlatformWhatsAppService {
    if (!MultiPlatformWhatsAppService.instance) {
      MultiPlatformWhatsAppService.instance = new MultiPlatformWhatsAppService();
    }
    return MultiPlatformWhatsAppService.instance;
  }

  /**
   * Detect platform from incoming message
   */
  public detectPlatform(toPhoneNumber: string, businessId?: string): PlatformConfig {
    // Check if it's a LeadGen SaaS client
    if (businessId) {
      const leadgenConfig = this.platformConfigs.get('leadgen')!;
      return {
        ...leadgenConfig,
        businessId,
        businessName: `LeadGen Pro - ${businessId}`,
        welcomeMessage: `🚀 Welcome! I'm your dedicated business assistant for ${businessId}. How can I help grow your business today?`
      };
    }

    // Match by phone number
    for (const [platform, config] of this.platformConfigs.entries()) {
      if (config.phoneNumberId === toPhoneNumber) {
        return config;
      }
    }

    // Default to BrezCode
    return this.platformConfigs.get('brezcode')!;
  }

  /**
   * Send platform-specific message
   */
  public async sendMessage(
    toPhoneNumber: string, 
    message: string, 
    platform: 'brezcode' | 'skincoach' | 'leadgen',
    businessId?: string
  ): Promise<any> {
    const config = businessId ? 
      this.detectPlatform('', businessId) : 
      this.platformConfigs.get(platform)!;

    try {
      // Add platform branding to message
      const brandedMessage = this.addPlatformBranding(message, config);
      
      const result = await this.whatsappService.sendTextMessage(toPhoneNumber, brandedMessage);
      
      // Store message with platform context
      await this.storeMessage({
        from: config.phoneNumberId,
        to: toPhoneNumber,
        text: brandedMessage,
        type: 'text',
        timestamp: new Date().toISOString(),
        messageId: `${platform}_${Date.now()}`
      }, platform, businessId);

      return { success: result, messageId: `${platform}_${Date.now()}` };
    } catch (error) {
      console.error(`❌ Error sending ${platform} message:`, error);
      throw error;
    }
  }

  /**
   * Handle incoming message with platform detection
   */
  public async handleIncomingMessage(
    fromPhoneNumber: string,
    toPhoneNumber: string,
    message: string,
    businessId?: string
  ): Promise<string> {
    const platform = this.detectPlatform(toPhoneNumber, businessId);
    
    console.log(`📱 Incoming ${platform.platform} message from ${fromPhoneNumber}: ${message}`);

    // Route to appropriate AI handler
    switch (platform.platform) {
      case 'brezcode':
        return this.handleBrezCodeMessage(fromPhoneNumber, message);
      case 'skincoach':
        return this.handleSkinCoachMessage(fromPhoneNumber, message);
      case 'leadgen':
        return this.handleLeadGenMessage(fromPhoneNumber, message, businessId);
      default:
        return this.platformConfigs.get('brezcode')!.welcomeMessage;
    }
  }

  /**
   * Platform-specific message handlers
   */
  private async handleBrezCodeMessage(fromPhoneNumber: string, message: string): Promise<string> {
    // Integration with Dr. Sakura AI
    try {
      // Call BrezCode avatar service
      const response = await fetch('/api/brezcode/avatar/dr-sakura/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversationHistory: [],
          context: { platform: 'whatsapp', phoneNumber: fromPhoneNumber }
        })
      });

      const result = await response.json();
      return result.response?.content || 'Hello! I\'m Dr. Sakura. How can I help with your health today?';
    } catch (error) {
      console.error('❌ BrezCode AI error:', error);
      return 'Hello! I\'m Dr. Sakura, your health coach. I\'m here to help with any health questions you have.';
    }
  }

  private async handleSkinCoachMessage(fromPhoneNumber: string, message: string): Promise<string> {
    // Integration with SkinCoach AI
    if (message.toLowerCase().includes('photo') || message.toLowerCase().includes('analysis')) {
      return '📸 Perfect! Please send me a clear photo of your face or skin area you\'d like analyzed. I\'ll provide detailed insights about your skin condition and personalized recommendations.';
    }
    
    return '✨ Welcome to SkinCoach! Send me a photo for AI-powered skin analysis, or ask me about skincare routines, products, or skin health tips.';
  }

  private async handleLeadGenMessage(fromPhoneNumber: string, message: string, businessId?: string): Promise<string> {
    // Integration with LeadGen AI
    const businessName = businessId || 'your business';
    
    if (message.toLowerCase().includes('lead') || message.toLowerCase().includes('customer')) {
      return `🎯 Great! I can help ${businessName} generate more leads. Let me know:
1. What's your target audience?
2. What services do you offer?
3. What's your current biggest challenge?

I'll create a customized lead generation strategy for you!`;
    }
    
    return `🚀 Hello! I'm your business growth assistant for ${businessName}. I can help with lead generation, customer engagement, and sales automation. What would you like to work on today?`;
  }

  /**
   * Add platform-specific branding
   */
  private addPlatformBranding(message: string, config: PlatformConfig): string {
    // Add subtle platform branding without being intrusive
    const platformEmojis = {
      brezcode: '🌸',
      skincoach: '✨',
      leadgen: '🚀'
    };

    const emoji = platformEmojis[config.platform];
    return `${emoji} ${message}`;
  }

  /**
   * Store message with platform context
   */
  private async storeMessage(
    message: WhatsAppMessage, 
    platform: 'brezcode' | 'skincoach' | 'leadgen',
    businessId?: string
  ): Promise<void> {
    try {
      // Store in database with platform and business context
      console.log(`💾 Storing ${platform} message:`, {
        platform,
        businessId,
        message: message.text?.substring(0, 50) + '...'
      });

      // TODO: Implement database storage with platform context
    } catch (error) {
      console.error('❌ Error storing message:', error);
    }
  }

  /**
   * Get platform statistics
   */
  public async getPlatformStats(platform: 'brezcode' | 'skincoach' | 'leadgen', businessId?: string) {
    return {
      platform,
      businessId,
      totalMessages: 0, // TODO: Implement from database
      activeContacts: 0,
      responseRate: 0,
      avgResponseTime: 0
    };
  }

  /**
   * Configure new LeadGen SaaS client
   */
  public configureSaaSClient(
    businessId: string,
    businessName: string,
    customWelcomeMessage?: string,
    customBranding?: Partial<PlatformConfig>
  ): PlatformConfig {
    const baseLeadGenConfig = this.platformConfigs.get('leadgen')!;
    
    const clientConfig: PlatformConfig = {
      ...baseLeadGenConfig,
      businessId,
      businessName: `LeadGen Pro - ${businessName}`,
      welcomeMessage: customWelcomeMessage || `🚀 Welcome to ${businessName}! I'm your AI business assistant. How can I help grow your business today?`,
      ...customBranding
    };

    // Store client configuration (in production, this would be in database)
    console.log(`🔧 Configured SaaS client: ${businessId} - ${businessName}`);
    
    return clientConfig;
  }
}

export default MultiPlatformWhatsAppService;