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
  private readonly businessAccountId: string;
  private readonly webhookVerifyToken: string;

  private constructor() {
    this.phoneNumberId = process.env.WA_PHONE_NUMBER_ID || 'test_phone_number_id';
    this.accessToken = process.env.CLOUD_API_ACCESS_TOKEN || 'test_access_token';
    this.apiVersion = process.env.CLOUD_API_VERSION || 'v19.0';
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
    this.businessAccountId = process.env.WA_BUSINESS_ACCOUNT_ID || 'test_business_account_id';
    this.webhookVerifyToken = process.env.WEBHOOK_VERIFICATION_TOKEN || 'test_verify_token_12345';

    if (process.env.NODE_ENV === 'production' && 
        (!this.phoneNumberId || !this.accessToken || 
         this.phoneNumberId === 'test_phone_number_id' ||
         !this.businessAccountId || this.businessAccountId === 'test_business_account_id')) {
      throw new Error('WhatsApp credentials not configured properly for production');
    }
    
    if (this.phoneNumberId === 'test_phone_number_id') {
      console.log('⚠️ WhatsApp service running in test mode (credentials not configured)');
    } else {
      console.log('✅ WhatsApp Business API initialized successfully');
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
    if (mode && token) {
      if (mode === 'subscribe' && token === this.webhookVerifyToken) {
        console.log('✅ WhatsApp webhook verified successfully');
        return challenge;
      } else {
        console.error('❌ WhatsApp webhook verification failed', { receivedToken: token ? 'present' : 'missing', expectedToken: this.webhookVerifyToken ? 'present' : 'missing' });
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

  // Advanced WhatsApp Business API Features

  async sendMediaMessage(to: string, mediaType: 'image' | 'video' | 'audio' | 'document', mediaUrl: string, caption?: string): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;
      
      const payload: any = {
        messaging_product: 'whatsapp',
        to: to,
        type: mediaType
      };

      payload[mediaType] = {
        link: mediaUrl
      };

      if (caption && (mediaType === 'image' || mediaType === 'video' || mediaType === 'document')) {
        payload[mediaType].caption = caption;
      }

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`✅ WhatsApp ${mediaType} message sent to ${to}`);
      
      // Store message in database
      await this.storeMessage({
        from: this.phoneNumberId,
        to,
        text: caption || `[${mediaType.toUpperCase()}]`,
        type: mediaType,
        mediaUrl,
        timestamp: new Date().toISOString(),
        messageId: response.data.messages[0].id
      });

      return true;
    } catch (error: any) {
      console.error(`❌ Error sending WhatsApp ${mediaType} message:`, error.response?.data || error.message);
      return false;
    }
  }

  async sendLocationMessage(to: string, latitude: number, longitude: number, name?: string, address?: string): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;
      
      const response = await axios.post(url, {
        messaging_product: 'whatsapp',
        to: to,
        type: 'location',
        location: {
          latitude: latitude,
          longitude: longitude,
          name: name || 'Location',
          address: address || ''
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`✅ WhatsApp location message sent to ${to}`);
      return true;
    } catch (error: any) {
      console.error('❌ Error sending WhatsApp location message:', error.response?.data || error.message);
      return false;
    }
  }

  async sendReactionMessage(to: string, messageId: string, emoji: string): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;
      
      const response = await axios.post(url, {
        messaging_product: 'whatsapp',
        to: to,
        type: 'reaction',
        reaction: {
          message_id: messageId,
          emoji: emoji
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`✅ WhatsApp reaction sent to ${to}: ${emoji}`);
      return true;
    } catch (error: any) {
      console.error('❌ Error sending WhatsApp reaction:', error.response?.data || error.message);
      return false;
    }
  }

  async downloadMedia(mediaId: string): Promise<Buffer | null> {
    try {
      // First, get the media URL
      const mediaUrl = `${this.baseUrl}/${mediaId}`;
      const mediaResponse = await axios.get(mediaUrl, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      const downloadUrl = mediaResponse.data.url;

      // Then download the actual media
      const downloadResponse = await axios.get(downloadUrl, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        },
        responseType: 'arraybuffer'
      });

      return Buffer.from(downloadResponse.data);
    } catch (error: any) {
      console.error('❌ Error downloading WhatsApp media:', error.response?.data || error.message);
      return null;
    }
  }

  async markMessageAsRead(messageId: string): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;
      
      await axios.post(url, {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId
      }, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`✅ Message marked as read: ${messageId}`);
      return true;
    } catch (error: any) {
      console.error('❌ Error marking message as read:', error.response?.data || error.message);
      return false;
    }
  }

  async getPhoneNumberInfo(): Promise<any> {
    try {
      const url = `${this.baseUrl}/${this.phoneNumberId}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        },
        params: {
          fields: 'verified_name,display_phone_number,quality_rating,messaging_limit_tier,phone_number_quality_score,throughput,code_verification_status'
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching phone number info:', error.response?.data || error.message);
      return null;
    }
  }

  async createQRCode(message: string = 'Welcome to Brezcode Health!'): Promise<string | null> {
    try {
      const url = `${this.baseUrl}/${this.phoneNumberId}/message_qrdls`;
      
      const response = await axios.post(url, {
        prefilled_message: message,
        generate_qr_image: 'PNG'
      }, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.qr_image_url;
    } catch (error: any) {
      console.error('❌ Error creating QR code:', error.response?.data || error.message);
      return null;
    }
  }

  async getMessageTemplates(): Promise<any[]> {
    try {
      const url = `${this.baseUrl}/${this.businessAccountId}/message_templates`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        },
        params: {
          fields: 'name,status,components,language,category'
        }
      });

      return response.data.data || [];
    } catch (error: any) {
      console.error('❌ Error fetching message templates:', error.response?.data || error.message);
      return [];
    }
  }

  async createMessageTemplate(templateData: {
    name: string;
    category: 'AUTHENTICATION' | 'MARKETING' | 'UTILITY';
    components: Array<{
      type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
      text?: string;
      buttons?: Array<{
        type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
        text: string;
        url?: string;
        phone_number?: string;
      }>;
    }>;
    language?: string;
  }): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/${this.businessAccountId}/message_templates`;
      
      await axios.post(url, {
        ...templateData,
        language: templateData.language || 'en'
      }, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`✅ Message template created: ${templateData.name}`);
      return true;
    } catch (error: any) {
      console.error('❌ Error creating message template:', error.response?.data || error.message);
      return false;
    }
  }

  async getAnalytics(start: string, end: string, granularity: 'HALF_HOUR' | 'DAY' | 'MONTH' = 'DAY'): Promise<any> {
    try {
      const url = `${this.baseUrl}/${this.phoneNumberId}/analytics`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        },
        params: {
          start,
          end,
          granularity,
          metric_types: 'cost,conversation_analytics'
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching analytics:', error.response?.data || error.message);
      return null;
    }
  }

  async updatePhoneNumber(pin?: string): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/${this.phoneNumberId}`;
      
      const payload: any = {};
      if (pin) {
        payload.pin = pin;
      }

      await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Phone number updated successfully');
      return true;
    } catch (error: any) {
      console.error('❌ Error updating phone number:', error.response?.data || error.message);
      return false;
    }
  }

  // Rate limiting helper
  private async rateLimitedRequest<T>(requestFn: () => Promise<T>, retries: number = 3): Promise<T | null> {
    for (let i = 0; i < retries; i++) {
      try {
        return await requestFn();
      } catch (error: any) {
        if (error.response?.status === 429) {
          // Rate limited, wait and retry
          const waitTime = Math.pow(2, i) * 1000; // Exponential backoff
          console.log(`⏳ Rate limited, waiting ${waitTime}ms before retry ${i + 1}/${retries}`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        throw error;
      }
    }
    return null;
  }
}

export default WhatsAppService;