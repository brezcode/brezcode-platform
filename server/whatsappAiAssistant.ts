import { WhatsAppService } from './whatsappService';
import { db } from './db';
import { whatsappAiSessions, whatsappContacts, whatsappConversations } from '../shared/whatsapp-schema';
import { eq, and } from 'drizzle-orm';

export interface ConversationContext {
  phoneNumber: string;
  assistantType: 'coaching' | 'sales' | 'support';
  sessionData: any;
  messageHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
}

export class WhatsAppAiAssistant {
  private whatsappService: WhatsAppService;

  constructor() {
    this.whatsappService = WhatsAppService.getInstance();
  }

  async processIncomingMessage(phoneNumber: string, messageContent: string, messageType: string = 'text'): Promise<void> {
    try {
      console.log(`🤖 Processing WhatsApp message from ${phoneNumber}: ${messageContent.substring(0, 100)}...`);

      // Get or create contact and determine conversation context
      let contact = await this.whatsappService.getContact(phoneNumber);
      
      if (!contact) {
        // New contact - start with support context by default
        await this.whatsappService.updateOrCreateContact(phoneNumber, {
          phoneNumber,
          conversationContext: 'support'
        });
        contact = { phoneNumber, conversationContext: 'support' } as any;
      }

      // Get conversation history for context
      const conversationHistory = await this.whatsappService.getConversationHistory(phoneNumber, 10);
      
      // Determine which AI assistant to use based on conversation context and message content
      const assistantType = await this.determineAssistantType(messageContent, contact.conversationContext, conversationHistory);
      
      // Get or create AI session
      const aiSession = await this.getOrCreateAiSession(phoneNumber, assistantType);
      
      // Process message based on assistant type
      let response = '';
      switch (assistantType) {
        case 'coaching':
          response = await this.processCoachingMessage(phoneNumber, messageContent, aiSession);
          break;
        case 'sales':
          response = await this.processSalesMessage(phoneNumber, messageContent, aiSession);
          break;
        case 'support':
        default:
          response = await this.processSupportMessage(phoneNumber, messageContent, aiSession);
          break;
      }

      // Send response via WhatsApp
      if (response) {
        await this.whatsappService.sendTextMessage(phoneNumber, response);
        
        // Update AI session
        await this.updateAiSession(aiSession.id, {
          messageCount: aiSession.messageCount + 1,
          lastInteractionAt: new Date()
        });
      }

      console.log(`✅ WhatsApp AI response sent to ${phoneNumber} via ${assistantType} assistant`);

    } catch (error) {
      console.error('❌ Error processing WhatsApp message:', error);
      
      // Send error response
      await this.whatsappService.sendTextMessage(
        phoneNumber, 
        "I apologize, but I'm experiencing technical difficulties. Please try again in a few moments, or type 'HELP' for assistance."
      );
    }
  }

  private async determineAssistantType(messageContent: string, currentContext: string, history: any[]): Promise<'coaching' | 'sales' | 'support'> {
    const message = messageContent.toLowerCase();
    
    // Keywords for different assistant types
    const coachingKeywords = ['coach', 'health', 'wellness', 'breast', 'self-exam', 'prevention', 'symptoms', 'doctor', 'medical'];
    const salesKeywords = ['price', 'cost', 'buy', 'purchase', 'plan', 'subscription', 'upgrade', 'premium', 'features'];
    const supportKeywords = ['help', 'support', 'problem', 'issue', 'error', 'bug', 'account', 'login', 'password', 'interactive', 'button'];

    // Check for explicit context switching
    if (message.includes('talk to coach') || message.includes('health coach')) {
      return 'coaching';
    }
    if (message.includes('sales') || message.includes('pricing')) {
      return 'sales';
    }
    if (message.includes('support') || message.includes('help')) {
      return 'support';
    }

    // Check for keyword matches
    const coachingMatches = coachingKeywords.filter(keyword => message.includes(keyword)).length;
    const salesMatches = salesKeywords.filter(keyword => message.includes(keyword)).length;
    const supportMatches = supportKeywords.filter(keyword => message.includes(keyword)).length;

    // Determine based on keyword frequency
    if (coachingMatches > salesMatches && coachingMatches > supportMatches) {
      return 'coaching';
    }
    if (salesMatches > coachingMatches && salesMatches > supportMatches) {
      return 'sales';
    }
    if (supportMatches > 0) {
      return 'support';
    }

    // Fall back to current context or default to support
    return currentContext as 'coaching' | 'sales' | 'support' || 'support';
  }

  private async processCoachingMessage(phoneNumber: string, message: string, aiSession: any): Promise<string> {
    try {
      // Use the existing BrezcodeAvatarService for health coaching
      const { BrezcodeAvatarService } = await import('./services/brezcodeAvatarService');
      
      // Get conversation history for context
      const conversationHistory = await this.whatsappService.getConversationHistory(phoneNumber, 10);
      const formattedHistory = conversationHistory.map(msg => ({
        role: msg.direction === 'inbound' ? 'user' : 'assistant',
        content: msg.content || '',
        timestamp: msg.timestamp?.toISOString() || new Date().toISOString()
      }));

      // Generate Dr. Sakura's response (adapt for WhatsApp)
      const response = await BrezcodeAvatarService.generateDrSakuraResponse(
        phoneNumber, // Use phone number as user ID
        message,
        formattedHistory,
        { platform: 'whatsapp', assistantType: 'coaching' }
      );

      // Format response for WhatsApp (keep it concise)
      let whatsappResponse = response.content;
      
      // Add coaching call-to-actions
      if (message.toLowerCase().includes('learn more') || message.toLowerCase().includes('education')) {
        whatsappResponse += `\n\n💡 *Want to learn more?* Type:
• "SELF-EXAM" for self-examination guide
• "PREVENTION" for prevention tips
• "SYMPTOMS" for warning signs
• "SUPPORT" for emotional support`;
      }

      return whatsappResponse;

    } catch (error) {
      console.error('❌ Error in coaching assistant:', error);
      return `Hello! I'm Dr. Sakura, your breast health coach. 🌸

I'm here to provide personalized guidance on breast health, self-examinations, and wellness. 

How can I support your health journey today?

Type "MENU" to see all available options.`;
    }
  }

  private async processSalesMessage(phoneNumber: string, message: string, aiSession: any): Promise<string> {
    try {
      const message_lower = message.toLowerCase();

      // Handle common sales inquiries
      if (message_lower.includes('price') || message_lower.includes('cost') || message_lower.includes('plan')) {
        return `💼 **Brezcode Health Plans**

🌸 **Wellness Plan** - $29/month
• Unlimited Dr. Sakura coaching
• Self-exam reminders
• Health tracking

🏥 **Premium Plan** - $49/month  
• Everything in Wellness
• Advanced skin analysis
• Priority support
• Expert consultations

✨ **Family Plan** - $79/month
• Up to 4 family members
• All Premium features
• Family health dashboard

*Ready to start your health journey?*
Type "START TRIAL" for a 7-day free trial!`;
      }

      if (message_lower.includes('feature') || message_lower.includes('what do you')) {
        return `🚀 **What Brezcode Offers:**

🤖 **AI Health Coach**: Dr. Sakura provides 24/7 personalized guidance
📱 **Smart Reminders**: Never miss self-exams or check-ups
🔍 **Health Analysis**: Advanced screening tools
📊 **Progress Tracking**: Monitor your wellness journey
👨‍⚕️ **Expert Access**: Connect with healthcare professionals

*Interested in learning more?*
Type "DEMO" for a personalized walkthrough!`;
      }

      if (message_lower.includes('trial') || message_lower.includes('free')) {
        return `🎉 **Start Your FREE 7-Day Trial!**

Experience all Premium features:
✅ Unlimited AI coaching sessions
✅ Advanced health tracking
✅ Personalized recommendations
✅ 24/7 support access

*No credit card required!*

To start your trial, I'll need:
1. Your name
2. Email address

Just reply with: "My name is [NAME] and my email is [EMAIL]"

Questions? Type "HELP" anytime!`;
      }

      if (message_lower.includes('help') || message_lower.includes('support')) {
        return `🤝 **Sales Support Menu:**

Type one of these options:
• **PLANS** - View all pricing plans
• **FEATURES** - See what Brezcode offers
• **TRIAL** - Start your free trial
• **DEMO** - Request a personal demo
• **COMPARE** - Compare plan features
• **CONTACT** - Speak with sales team

Questions about our health coaching? Type "COACH" to speak with Dr. Sakura! 🌸`;
      }

      // Default sales response
      return `👋 Welcome to Brezcode Sales!

I'm here to help you find the perfect health plan for your needs.

🎯 **Popular Options:**
• Type "PLANS" to see pricing
• Type "TRIAL" to start free
• Type "FEATURES" to learn more

Have specific questions? Just ask! 
For health advice, type "COACH" to speak with Dr. Sakura 🌸`;

    } catch (error) {
      console.error('❌ Error in sales assistant:', error);
      return "I'm having trouble accessing our pricing information right now. Please type 'HELP' or try again in a moment.";
    }
  }

  private async processSupportMessage(phoneNumber: string, message: string, aiSession: any): Promise<string> {
    try {
      const message_lower = message.toLowerCase();

      // Handle common support inquiries
      if (message_lower.includes('help') || message_lower.includes('menu') || message_lower === 'start') {
        return `🆘 **Brezcode Support Menu**

Choose what you need help with:

🏥 **Health Coaching** - Type "COACH"
💼 **Sales & Pricing** - Type "SALES" 
🔧 **Technical Support** - Type "TECH"
📱 **Account Help** - Type "ACCOUNT"
❓ **General Questions** - Type "FAQ"

Or just describe your issue and I'll help!

*Need urgent health advice? Type "URGENT" to connect immediately.*`;
      }

      if (message_lower.includes('account') || message_lower.includes('login') || message_lower.includes('password')) {
        return `🔐 **Account Support**

**Common Issues:**
• **Forgot Password** - Type "RESET PASSWORD"
• **Can't Login** - Type "LOGIN HELP" 
• **Update Profile** - Type "PROFILE"
• **Billing Questions** - Type "BILLING"
• **Cancel Subscription** - Type "CANCEL"

**Need immediate help?** 
📞 Call: 1-800-BREZCODE
📧 Email: support@brezcode.com

I'm here to help troubleshoot! What specific issue are you experiencing?`;
      }

      if (message_lower.includes('tech') || message_lower.includes('bug') || message_lower.includes('error')) {
        return `🔧 **Technical Support**

I can help with:
• App crashes or freezing
• Feature not working properly  
• Sync issues
• Notification problems
• Performance issues

**Quick Fixes:**
1. Try restarting the app
2. Check your internet connection
3. Update to latest version

**Still having issues?**
Please describe:
• What were you trying to do?
• What happened instead?
• When did this start?

I'll get this sorted for you! 🛠️`;
      }

      if (message_lower.includes('urgent') || message_lower.includes('emergency')) {
        return `🚨 **Urgent Support**

For **medical emergencies**, please:
📞 Call 911 (US) or your local emergency number
🏥 Visit your nearest emergency room

For **urgent health questions**:
Type "COACH" to speak with Dr. Sakura immediately 🌸

For **account emergencies** (security concerns):
📧 Email: urgent@brezcode.com
📞 Call: 1-800-BREZCODE (24/7)

I'm here to help with immediate non-emergency support needs. What's happening?`;
      }

      if (message_lower.includes('cancel') || message_lower.includes('unsubscribe')) {
        return `😔 Sorry to see you considering leaving!

**Before you go:**
• Is there an issue we can fix?
• Would you like to pause instead?
• Need help with something specific?

**To proceed with cancellation:**
1. Type "CONFIRM CANCEL"
2. I'll guide you through the process
3. You'll retain access until your billing period ends

**Want to talk to someone?**
📞 Call: 1-800-BREZCODE
📧 Email: retention@brezcode.com

What's prompting you to cancel? Maybe I can help! 💙`;
      }

      // Default support response
      return `👋 **Brezcode Customer Support**

I'm here to help with:
✅ Account questions
✅ Technical issues  
✅ Billing support
✅ Feature guidance
✅ General questions

**Quick Start:**
• Type "MENU" for all options
• Describe your issue in detail
• Type "COACH" for health questions 🌸
• Type "SALES" for plan information 💼

What can I help you with today?`;

    } catch (error) {
      console.error('❌ Error in support assistant:', error);
      return "I'm experiencing technical difficulties. Please try again or contact support@brezcode.com for immediate assistance.";
    }
  }

  private async getOrCreateAiSession(phoneNumber: string, assistantType: string): Promise<any> {
    try {
      // Check for existing active session
      const [existingSession] = await db
        .select()
        .from(whatsappAiSessions)
        .where(
          and(
            eq(whatsappAiSessions.phoneNumber, phoneNumber),
            eq(whatsappAiSessions.aiAssistantType, assistantType)
          )
        )
        .limit(1);

      if (existingSession) {
        return existingSession;
      }

      // Create new session
      const [newSession] = await db
        .insert(whatsappAiSessions)
        .values({
          phoneNumber,
          aiAssistantType: assistantType,
          sessionData: JSON.stringify({}),
          messageCount: 0,
          lastInteractionAt: new Date()
        })
        .returning();

      return newSession;
    } catch (error) {
      console.error('❌ Error managing AI session:', error);
      return {
        id: 0,
        phoneNumber,
        aiAssistantType: assistantType,
        sessionData: '{}',
        messageCount: 0,
        lastInteractionAt: new Date()
      };
    }
  }

  private async updateAiSession(sessionId: number, updates: any): Promise<void> {
    try {
      if (sessionId > 0) {
        await db
          .update(whatsappAiSessions)
          .set({
            ...updates,
            updatedAt: new Date()
          })
          .where(eq(whatsappAiSessions.id, sessionId));
      }
    } catch (error) {
      console.error('❌ Error updating AI session:', error);
    }
  }

  async sendWelcomeMessage(phoneNumber: string): Promise<void> {
    const welcomeMessage = `🌸 **Welcome to Brezcode!**
*Your AI Health Coach at +852 94740952*

I'm your AI assistant, here to help with:

🏥 **Health Coaching** (Dr. Sakura)
💼 **Sales & Pricing Information**  
🆘 **Customer Support**

**Quick Start:**
• Type "COACH" for health guidance
• Type "SALES" for pricing info
• Type "HELP" for support menu

How can I assist you today?`;

    await this.whatsappService.sendTextMessage(phoneNumber, welcomeMessage);
  }

  async sendProactiveMessage(phoneNumber: string, messageType: 'reminder' | 'tip' | 'followup', content: string): Promise<void> {
    let formattedMessage = '';
    
    switch (messageType) {
      case 'reminder':
        formattedMessage = `🔔 **Health Reminder**\n\n${content}\n\nReply "STOP" to pause reminders or "HELP" for support.`;
        break;
      case 'tip':
        formattedMessage = `💡 **Daily Health Tip**\n\n${content}\n\nWant more tips? Type "COACH" to chat with Dr. Sakura! 🌸`;
        break;
      case 'followup':
        formattedMessage = `👋 **Following up...**\n\n${content}\n\nNeed help? Type "SUPPORT" anytime!`;
        break;
    }

    await this.whatsappService.sendTextMessage(phoneNumber, formattedMessage);
  }
}

export default WhatsAppAiAssistant;