/**
 * Twilio SMS Service
 * Handles SMS verification codes and notifications using existing Twilio setup
 */

import twilio from "twilio";

const twilioClient = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) 
  : null;

export class TwilioSMSService {
  /**
   * Send SMS verification code
   */
  static async sendVerificationCode(phoneNumber: string, code: string): Promise<void> {
    if (!twilioClient || !process.env.TWILIO_PHONE_NUMBER) {
      console.log(`SMS Service not configured. Verification code for ${phoneNumber}: ${code}`);
      return;
    }

    try {
      const message = await twilioClient.messages.create({
        body: `Your verification code is: ${code}. This code will expire in 15 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });

      console.log(`SMS sent successfully to ${phoneNumber}. Message SID: ${message.sid}`);
    } catch (error: any) {
      console.error("SMS sending failed:", error.message);
      // Fallback to console logging for development
      console.log(`SMS FALLBACK - Verification code for ${phoneNumber}: ${code}`);
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }

  /**
   * Send SMS notification
   */
  static async sendNotification(phoneNumber: string, message: string): Promise<void> {
    if (!twilioClient || !process.env.TWILIO_PHONE_NUMBER) {
      console.log(`SMS Service not configured. Message for ${phoneNumber}: ${message}`);
      return;
    }

    try {
      const smsMessage = await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });

      console.log(`SMS notification sent to ${phoneNumber}. Message SID: ${smsMessage.sid}`);
    } catch (error: any) {
      console.error("SMS notification failed:", error.message);
      console.log(`SMS FALLBACK - Message for ${phoneNumber}: ${message}`);
      throw new Error(`Failed to send SMS notification: ${error.message}`);
    }
  }

  /**
   * Send email verification code via SMS (for users who prefer SMS over email)
   */
  static async sendEmailVerificationViaSMS(phoneNumber: string, email: string, code: string): Promise<void> {
    const message = `Email verification for ${email}: Your verification code is ${code}. Enter this code to verify your email address.`;
    await this.sendNotification(phoneNumber, message);
  }

  /**
   * Check if SMS service is configured
   */
  static isConfigured(): boolean {
    return !!(twilioClient && process.env.TWILIO_PHONE_NUMBER);
  }

  /**
   * Get service status
   */
  static getStatus(): { configured: boolean; message: string } {
    const configured = this.isConfigured();
    return {
      configured,
      message: configured 
        ? "Twilio SMS service is ready" 
        : "Twilio SMS service not configured - using console fallback"
    };
  }
}