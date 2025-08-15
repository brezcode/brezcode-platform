import twilio from "twilio";
const VoiceResponse = twilio.twiml.VoiceResponse;
import { AvatarService } from "./avatarService";
import { BrandCustomerService } from "./brandCustomerService";
import OpenAI from "openai";

const twilioClient = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) 
  : null;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export class TwilioVoiceService {
  // Handle incoming voice calls
  static async handleIncomingCall(req: any): Promise<string> {
    const twiml = new VoiceResponse();
    const callSid = req.body.CallSid;
    const from = req.body.From;
    const to = req.body.To;

    // Extract brand context from phone number or domain
    const brandContext = await this.getBrandFromPhoneNumber(to);
    
    if (!brandContext) {
      twiml.say({ voice: "alice", language: "en-US" }, 
        "Thank you for calling. This service is currently unavailable.");
      return twiml.toString();
    }

    // Welcome message with language detection
    twiml.gather({
      input: "speech",
      language: "en-US",
      speechTimeout: "3",
      action: `/voice/process-input?brand=${brandContext.brandId}&callSid=${callSid}`,
      method: "POST",
    }).say({ voice: "alice", language: "en-US" },
      `Hello and welcome to ${brandContext.brandName}. I'm your AI assistant. How can I help you today?`
    );

    // Fallback if no input
    twiml.say({ voice: "alice", language: "en-US" },
      "I didn't hear anything. Please call back when you're ready to speak."
    );

    return twiml.toString();
  }

  // Process speech input from caller
  static async processVoiceInput(req: any): Promise<string> {
    const twiml = new VoiceResponse();
    const speechResult = req.body.SpeechResult;
    const callSid = req.body.CallSid;
    const brandId = req.query.brand;

    if (!speechResult) {
      twiml.say({ voice: "alice", language: "en-US" },
        "I didn't understand that. Could you please repeat?");
      
      twiml.gather({
        input: "speech",
        language: "en-US",
        speechTimeout: "3",
        action: `/voice/process-input?brand=${brandId}&callSid=${callSid}`,
        method: "POST",
      });

      return twiml.toString();
    }

    try {
      // Detect language of input
      const detectedLanguage = await this.detectLanguage(speechResult);
      
      // Get AI response
      const aiResponse = await this.getAIResponse(speechResult, brandId, detectedLanguage);
      
      // Convert response to speech in appropriate language
      const voiceConfig = this.getVoiceConfig(detectedLanguage);
      
      twiml.say(voiceConfig, aiResponse);

      // Continue conversation
      twiml.gather({
        input: "speech",
        language: detectedLanguage,
        speechTimeout: "5",
        action: `/voice/process-input?brand=${brandId}&callSid=${callSid}`,
        method: "POST",
      }).say(voiceConfig, "Is there anything else I can help you with?");

      // Option to end call
      twiml.say(voiceConfig, "Say goodbye to end the call, or continue speaking for more assistance.");

    } catch (error) {
      console.error("Voice processing error:", error);
      twiml.say({ voice: "alice", language: "en-US" },
        "I'm sorry, I'm having trouble processing your request. Please try calling back later.");
    }

    return twiml.toString();
  }

  // Make outbound calls
  static async makeOutboundCall(
    brandId: string, 
    toPhoneNumber: string, 
    message: string, 
    language: string = "en-US"
  ): Promise<any> {
    if (!twilioClient || !process.env.TWILIO_PHONE_NUMBER) {
      throw new Error("Twilio not configured for outbound calls");
    }

    try {
      const call = await twilioClient.calls.create({
        twiml: this.generateOutboundTwiML(message, language),
        to: toPhoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER,
      });

      // Track the outbound call
      await BrandCustomerService.trackEvent(brandId, "system", "outbound_call", {
        callSid: call.sid,
        toNumber: toPhoneNumber,
        message,
        language,
      });

      return {
        callSid: call.sid,
        status: call.status,
        toNumber: toPhoneNumber,
      };
    } catch (error) {
      console.error("Outbound call error:", error);
      throw error;
    }
  }

  // Generate TwiML for outbound calls
  private static generateOutboundTwiML(message: string, language: string): string {
    const twiml = new VoiceResponse();
    const voiceConfig = this.getVoiceConfig(language);
    
    twiml.say(voiceConfig, message);
    
    // Allow for callback response
    twiml.gather({
      input: "speech",
      language: language,
      speechTimeout: "5",
      action: "/voice/outbound-response",
      method: "POST",
    }).say(voiceConfig, "If you'd like to respond, please speak now, or hang up to end this call.");

    return twiml.toString();
  }

  // Get brand context from phone number
  private static async getBrandFromPhoneNumber(phoneNumber: string): Promise<any> {
    // In a real implementation, you'd look up the brand based on the phone number
    // For now, return default brand
    return {
      brandId: "c710e70b-c50b-44d1-8046-8", // Default BrezCode brand
      brandName: "BrezCode Health",
    };
  }

  // Detect language from speech
  private static async detectLanguage(text: string): Promise<string> {
    try {
      // Use OpenAI to detect language
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{
          role: "user",
          content: `Detect the language of this text and return only the language code (e.g., en-US, es-ES, zh-CN, fr-FR, de-DE, ja-JP, ko-KR): "${text}"`
        }],
        max_tokens: 10,
      });

      const detectedLang = completion.choices[0]?.message?.content?.trim() || "en-US";
      return detectedLang;
    } catch (error) {
      console.error("Language detection error:", error);
      return "en-US"; // Default to English
    }
  }

  // Get AI response for voice input
  private static async getAIResponse(input: string, brandId: string, language: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{
          role: "system",
          content: `You are a helpful customer service AI assistant. Respond in ${language}. 
          Keep responses concise and conversational for voice interaction (under 100 words). 
          Be friendly, professional, and helpful. If you need to transfer to a human agent, say so clearly.`
        }, {
          role: "user",
          content: input
        }],
        max_tokens: 200,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || "I'm sorry, I couldn't understand that. Could you please rephrase?";
    } catch (error) {
      console.error("AI response error:", error);
      return "I'm experiencing technical difficulties. Please hold while I transfer you to a human agent.";
    }
  }

  // Get voice configuration for different languages
  private static getVoiceConfig(language: string): any {
    const voiceMap: { [key: string]: any } = {
      "en-US": { voice: "alice", language: "en-US" },
      "en-GB": { voice: "emma", language: "en-GB" },
      "es-ES": { voice: "conchita", language: "es-ES" },
      "es-MX": { voice: "mia", language: "es-MX" },
      "fr-FR": { voice: "celine", language: "fr-FR" },
      "de-DE": { voice: "marlene", language: "de-DE" },
      "zh-CN": { voice: "zhiyu", language: "zh-CN" },
      "ja-JP": { voice: "mizuki", language: "ja-JP" },
      "ko-KR": { voice: "seoyeon", language: "ko-KR" },
    };

    return voiceMap[language] || voiceMap["en-US"];
  }

  // Handle call status updates
  static async handleCallStatus(req: any): Promise<void> {
    const callSid = req.body.CallSid;
    const callStatus = req.body.CallStatus;
    const duration = req.body.CallDuration;

    console.log(`Call ${callSid} status: ${callStatus}, duration: ${duration}s`);

    // Track call completion for analytics
    if (callStatus === "completed") {
      // You could save call analytics here
      console.log(`Call completed: ${callSid}, Duration: ${duration} seconds`);
    }
  }
}