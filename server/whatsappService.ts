import axios from 'axios';
import { db } from './db';
import { whatsappMessages, whatsappContacts, whatsappConversations } from '../shared/whatsapp-schema';
import { eq, desc } from 'drizzle-orm';

export interface WhatsAppMessage {
  from: string;
  to: string;
  text?: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'document';
  mediaUrl?: string;
  timestamp: string;
  messageId: string;
}

export interface WhatsAppContact {
  phoneNumber: string;
  name?: string;
  profileUrl?: string;
  lastActive?: string;
  conversationContext: 'coaching' | 'sales' | 'support';
}

export class WhatsAppService {
  private static instance: WhatsAppService;
  private readonly phoneNumberId: string;
  private readonly accessToken: string;
  private readonly apiVersion: string;
  private readonly baseUrl: string;

  private constructor() {
    this.phoneNumberId = process.env.WA_PHONE_NUMBER_ID || 'test_phone_number_id';
    this.accessToken = process.env.CLOUD_API_ACCESS_TOKEN || 'test_access_token';
    this.apiVersion = process.env.CLOUD_API_VERSION || 'v19.0';
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;

    if (process.env.NODE_ENV === 'production' && (!this.phoneNumberId || !this.accessToken || this.phoneNumberId === 'test_phone_number_id')) {
      throw new Error('WhatsApp credentials not configured properly for production');
    }
    
    if (this.phoneNumberId === 'test_phone_number_id') {
      console.log('⚠️ WhatsApp service running in test mode (credentials not configured)');
    }
  }

  public static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService();
    }
    return WhatsAppService.instance;
  }

  async sendTextMessage(to: string, message: string): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;
      
      const response = await axios.post(url, {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: {
          body: message
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`✅ WhatsApp message sent to ${to}: ${message.substring(0, 50)}...`);
      
      // Store message in database
      await this.storeMessage({
        from: this.phoneNumberId,
        to,
        text: message,
        type: 'text',
        timestamp: new Date().toISOString(),
        messageId: response.data.messages[0].id
      });

      return true;
    } catch (error: any) {
      console.error('❌ Error sending WhatsApp message:', error.response?.data || error.message);
      return false;
    }
  }

  async sendTemplateMessage(to: string, templateName: string, language: string = 'en', parameters?: string[]): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;
      
      const templateData: any = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: language
          }
        }
      };

      if (parameters && parameters.length > 0) {
        templateData.template.components = [{
          type: 'body',
          parameters: parameters.map(param => ({
            type: 'text',
            text: param
          }))
        }];
      }

      const response = await axios.post(url, templateData, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`✅ WhatsApp template message sent to ${to}: ${templateName}`);
      return true;
    } catch (error: any) {
      console.error('❌ Error sending WhatsApp template message:', error.response?.data || error.message);
      return false;
    }
  }

  async sendInteractiveMessage(to: string, headerText: string, bodyText: string, buttons: Array<{id: string, title: string}>): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;
      
      const response = await axios.post(url, {
        messaging_product: 'whatsapp',
        to: to,
        type: 'interactive',
        interactive: {
          type: 'button',
          header: {
            type: 'text',
            text: headerText
          },
          body: {
            text: bodyText
          },
          action: {
            buttons: buttons.map(button => ({
              type: 'reply',
              reply: {
                id: button.id,
                title: button.title
              }
            }))
          }
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`✅ WhatsApp interactive message sent to ${to}`);
      return true;
    } catch (error: any) {
      console.error('❌ Error sending WhatsApp interactive message:', error.response?.data || error.message);
      return false;
    }
  }

  async storeMessage(message: WhatsAppMessage): Promise<void> {
    try {
      await db.insert(whatsappMessages).values({
        phoneNumber: message.from,
        messageType: message.type,
        content: message.text || '',
        mediaUrl: message.mediaUrl,
        direction: message.from === this.phoneNumberId ? 'outbound' : 'inbound',
        whatsappMessageId: message.messageId,
        timestamp: new Date(message.timestamp),
        processed: false
      });
    } catch (error) {
      console.error('❌ Error storing WhatsApp message:', error);
    }
  }

  async getContact(phoneNumber: string): Promise<WhatsAppContact | null> {
    try {
      const [contact] = await db
        .select()
        .from(whatsappContacts)
        .where(eq(whatsappContacts.phoneNumber, phoneNumber))
        .limit(1);

      return contact ? {
        phoneNumber: contact.phoneNumber,
        name: contact.displayName || undefined,
        profileUrl: contact.profileUrl || undefined,
        lastActive: contact.lastActive?.toISOString(),
        conversationContext: contact.conversationContext as 'coaching' | 'sales' | 'support'
      } : null;
    } catch (error) {
      console.error('❌ Error fetching WhatsApp contact:', error);
      return null;
    }
  }

  async updateOrCreateContact(phoneNumber: string, data: Partial<WhatsAppContact>): Promise<void> {
    try {
      const existingContact = await this.getContact(phoneNumber);
      
      if (existingContact) {
        await db
          .update(whatsappContacts)
          .set({
            displayName: data.name,
            profileUrl: data.profileUrl,
            conversationContext: data.conversationContext,
            lastActive: new Date(),
            updatedAt: new Date()
          })
          .where(eq(whatsappContacts.phoneNumber, phoneNumber));
      } else {
        await db.insert(whatsappContacts).values({
          phoneNumber,
          displayName: data.name,
          profileUrl: data.profileUrl,
          conversationContext: data.conversationContext || 'support',
          lastActive: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('❌ Error updating WhatsApp contact:', error);
    }
  }

  async getConversationHistory(phoneNumber: string, limit: number = 50): Promise<any[]> {
    try {
      const messages = await db
        .select()
        .from(whatsappMessages)
        .where(eq(whatsappMessages.phoneNumber, phoneNumber))
        .orderBy(desc(whatsappMessages.timestamp))
        .limit(limit);

      return messages.reverse(); // Return in chronological order
    } catch (error) {
      console.error('❌ Error fetching conversation history:', error);
      return [];
    }
  }

  async markMessageAsProcessed(messageId: string): Promise<void> {
    try {
      await db
        .update(whatsappMessages)
        .set({ processed: true })
        .where(eq(whatsappMessages.whatsappMessageId, messageId));
    } catch (error) {
      console.error('❌ Error marking message as processed:', error);
    }
  }

  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    const verifyToken = process.env.WEBHOOK_VERIFICATION_TOKEN || 'test_verify_token_12345';
    
    if (mode && token) {
      if (mode === 'subscribe' && token === verifyToken) {
        console.log('✅ WhatsApp webhook verified successfully');
        return challenge;
      } else {
        console.error('❌ WhatsApp webhook verification failed');
        return null;
      }
    }
    
    return null;
  }

  async getBusinessProfile(): Promise<any> {
    try {
      const url = `${this.baseUrl}/${this.phoneNumberId}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        },
        params: {
          fields: 'verified_name,display_phone_number,quality_rating'
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching business profile:', error.response?.data || error.message);
      return null;
    }
  }

  async setBusinessProfile(profileData: { about?: string; address?: string; description?: string; email?: string; websites?: string[] }): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/${this.phoneNumberId}`;
      
      // Default Brezcode business profile
      const defaultProfile = {
        about: "🌸 Brezcode - AI-powered breast health coaching and wellness platform. Get personalized health guidance, self-exam reminders, and expert support 24/7.",
        address: "Digital Health Platform",
        description: "Your trusted AI health coach Dr. Sakura provides personalized breast health guidance, preventive care recommendations, and wellness support through advanced AI technology.",
        email: "support@brezcode.com",
        websites: ["https://brezcode.com"],
        ...profileData
      };
      
      await axios.post(url, defaultProfile, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ WhatsApp business profile updated for Brezcode (+852 94740952)');
      return true;
    } catch (error: any) {
      console.error('❌ Error updating business profile:', error.response?.data || error.message);
      return false;
    }
  }

  getBrezcodeBusinessNumber(): string {
    return process.env.BREZCODE_WHATSAPP_NUMBER || '+852 94740952';
  }
}

export default WhatsAppService;