import { WhatsAppService } from './whatsappService';
import WhatsAppAiAssistant from './whatsappAiAssistant';
import { db } from './db';
import { whatsappContacts } from '../shared/whatsapp-schema';
import { eq } from 'drizzle-orm';

export class WhatsAppScheduler {
  private static instance: WhatsAppScheduler;
  private whatsappService: WhatsAppService;
  private aiAssistant: WhatsAppAiAssistant;
  private scheduledJobs: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {
    this.whatsappService = WhatsAppService.getInstance();
    this.aiAssistant = new WhatsAppAiAssistant();
  }

  public static getInstance(): WhatsAppScheduler {
    if (!WhatsAppScheduler.instance) {
      WhatsAppScheduler.instance = new WhatsAppScheduler();
    }
    return WhatsAppScheduler.instance;
  }

  startHealthReminders(): void {
    console.log('🔔 Starting WhatsApp health reminder scheduler...');
    
    // Send weekly self-exam reminders
    const weeklyReminders = setInterval(async () => {
      await this.sendWeeklyHealthReminders();
    }, 7 * 24 * 60 * 60 * 1000); // Weekly

    // Send daily health tips
    const dailyTips = setInterval(async () => {
      await this.sendDailyHealthTips();
    }, 24 * 60 * 60 * 1000); // Daily at the same time

    // Store intervals for cleanup
    this.scheduledJobs.set('weeklyReminders', weeklyReminders);
    this.scheduledJobs.set('dailyTips', dailyTips);

    console.log('✅ WhatsApp health reminders scheduled');
  }

  private async sendWeeklyHealthReminders(): Promise<void> {
    try {
      console.log('📅 Sending weekly health reminders via WhatsApp...');

      // Get all contacts who have opted for coaching
      const coachingContacts = await db
        .select()
        .from(whatsappContacts)
        .where(eq(whatsappContacts.conversationContext, 'coaching'));

      const reminderMessages = [
        "🌸 **Weekly Health Reminder**\n\nTime for your monthly breast self-examination! Remember:\n\n• Best time is 7-10 days after your period\n• Use gentle pressure with fingertips\n• Check for lumps, changes in size, or skin texture\n\nReply 'GUIDE' for step-by-step instructions. Stay healthy! 💙",
        
        "🏥 **Health Check-In**\n\nHow are you feeling this week? Regular self-care includes:\n\n✅ Monthly self-exams\n✅ Annual mammograms (if recommended)\n✅ Healthy lifestyle choices\n✅ Managing stress\n\nReply 'COACH' to chat with Dr. Sakura about any concerns! 🌸",
        
        "💪 **Wellness Wednesday**\n\nYour health matters! This week, focus on:\n\n🥗 Nutritious eating\n🏃‍♀️ Regular exercise\n😴 Quality sleep\n🧘‍♀️ Stress management\n\nSmall steps lead to big changes. Need personalized advice? Type 'COACH'!"
      ];

      for (const contact of coachingContacts) {
        const randomMessage = reminderMessages[Math.floor(Math.random() * reminderMessages.length)];
        await this.aiAssistant.sendProactiveMessage(
          contact.phoneNumber,
          'reminder',
          randomMessage
        );
        
        // Small delay between messages to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log(`✅ Weekly health reminders sent to ${coachingContacts.length} contacts`);
    } catch (error) {
      console.error('❌ Error sending weekly health reminders:', error);
    }
  }

  private async sendDailyHealthTips(): Promise<void> {
    try {
      console.log('💡 Sending daily health tips via WhatsApp...');

      // Get all contacts who are active in coaching
      const activeContacts = await db
        .select()
        .from(whatsappContacts)
        .where(eq(whatsappContacts.conversationContext, 'coaching'));

      const healthTips = [
        "🥛 **Daily Tip**: Calcium-rich foods like dairy, leafy greens, and almonds support bone health and may help reduce breast cancer risk.",
        
        "🚶‍♀️ **Daily Tip**: Just 30 minutes of walking daily can reduce breast cancer risk by up to 14%. Every step counts!",
        
        "🌿 **Daily Tip**: Limit alcohol consumption. Even small amounts can increase breast cancer risk. Try herbal teas or sparkling water with fruit!",
        
        "😴 **Daily Tip**: Aim for 7-9 hours of quality sleep. Poor sleep patterns may be linked to increased cancer risk.",
        
        "🥗 **Daily Tip**: Eat the rainbow! Colorful fruits and vegetables provide antioxidants that help protect your cells.",
        
        "🧘‍♀️ **Daily Tip**: Practice stress management through meditation, deep breathing, or yoga. Chronic stress can impact immune function.",
        
        "🚭 **Daily Tip**: If you smoke, consider quitting. Smoking increases the risk of many cancers, including breast cancer.",
        
        "🏋️‍♀️ **Daily Tip**: Strength training twice a week can boost your immune system and overall health. Start with light weights or bodyweight exercises!",
        
        "💧 **Daily Tip**: Stay hydrated! Aim for 8 glasses of water daily to support cellular health and energy levels.",
        
        "🌞 **Daily Tip**: Get 10-15 minutes of morning sunlight for natural Vitamin D, which may help reduce cancer risk."
      ];

      // Send tips only to a subset to avoid overwhelming users
      const dailyTip = healthTips[Math.floor(Math.random() * healthTips.length)];
      
      // Send to max 50 contacts per day, rotate through the list
      const maxDaily = Math.min(50, activeContacts.length);
      const startIndex = Math.floor(Math.random() * Math.max(1, activeContacts.length - maxDaily));
      const selectedContacts = activeContacts.slice(startIndex, startIndex + maxDaily);

      for (const contact of selectedContacts) {
        await this.aiAssistant.sendProactiveMessage(
          contact.phoneNumber,
          'tip',
          dailyTip
        );
        
        // Small delay between messages
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      console.log(`✅ Daily health tip sent to ${selectedContacts.length} contacts`);
    } catch (error) {
      console.error('❌ Error sending daily health tips:', error);
    }
  }

  scheduleFollowUp(phoneNumber: string, delayHours: number, message: string): void {
    const followUpKey = `followup_${phoneNumber}_${Date.now()}`;
    
    const timeout = setTimeout(async () => {
      try {
        await this.aiAssistant.sendProactiveMessage(phoneNumber, 'followup', message);
        this.scheduledJobs.delete(followUpKey);
        console.log(`✅ Follow-up message sent to ${phoneNumber}`);
      } catch (error) {
        console.error('❌ Error sending follow-up message:', error);
      }
    }, delayHours * 60 * 60 * 1000);

    this.scheduledJobs.set(followUpKey, timeout);
    console.log(`⏰ Follow-up scheduled for ${phoneNumber} in ${delayHours} hours`);
  }

  cancelScheduledMessage(phoneNumber: string): void {
    const keysToDelete: string[] = [];
    
    for (const [key, timeout] of this.scheduledJobs.entries()) {
      if (key.includes(phoneNumber)) {
        clearTimeout(timeout);
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.scheduledJobs.delete(key));
    console.log(`🚫 Cancelled ${keysToDelete.length} scheduled messages for ${phoneNumber}`);
  }

  stopAllSchedulers(): void {
    console.log('🛑 Stopping all WhatsApp schedulers...');
    
    for (const [key, timeout] of this.scheduledJobs.entries()) {
      clearTimeout(timeout);
    }
    
    this.scheduledJobs.clear();
    console.log('✅ All WhatsApp schedulers stopped');
  }

  getScheduledJobsCount(): number {
    return this.scheduledJobs.size;
  }

  // Method to send onboarding sequence for new users
  async sendOnboardingSequence(phoneNumber: string): Promise<void> {
    try {
      console.log(`🎉 Starting onboarding sequence for ${phoneNumber}`);

      // Welcome message (immediate)
      await this.aiAssistant.sendWelcomeMessage(phoneNumber);

      // Health assessment invitation (1 hour later)
      this.scheduleFollowUp(phoneNumber, 1, 
        "👋 **Welcome to your health journey!**\n\nReady to take a quick health assessment? It helps me provide personalized guidance.\n\nType 'ASSESSMENT' to get started, or 'COACH' to chat with Dr. Sakura anytime! 🌸"
      );

      // Self-exam education (1 day later)
      this.scheduleFollowUp(phoneNumber, 24,
        "📚 **Educational Moment**\n\nDid you know that 80% of breast lumps are found by women themselves during self-exams?\n\nLearning proper technique is empowering and potentially life-saving.\n\nType 'LEARN' for a guided tutorial! 💪"
      );

      // Feature overview (3 days later)
      this.scheduleFollowUp(phoneNumber, 72,
        "🚀 **Explore Brezcode Features**\n\nYou have access to:\n\n🤖 24/7 AI health coaching\n📅 Personalized reminders\n📊 Health tracking tools\n👩‍⚕️ Expert consultations\n\nWhat interests you most? Just ask! ✨"
      );

      console.log(`✅ Onboarding sequence scheduled for ${phoneNumber}`);
    } catch (error) {
      console.error('❌ Error scheduling onboarding sequence:', error);
    }
  }
}

// Auto-start scheduler when module is imported
const scheduler = WhatsAppScheduler.getInstance();

// Start health reminders in production or when explicitly enabled
if (process.env.NODE_ENV === 'production' || process.env.WHATSAPP_SCHEDULER_ENABLED === 'true') {
  scheduler.startHealthReminders();
  console.log('🔔 WhatsApp scheduler auto-started');
}

export default WhatsAppScheduler;