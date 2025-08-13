import { HealthResearchService } from './healthResearchService';
import { MultimediaContent } from './multimediaContentService';

// Proactive Content Delivery System
export interface ProactiveMessage {
  id: string;
  userId: number;
  role: 'avatar';
  content: string;
  multimediaContent: MultimediaContent[];
  timestamp: string;
  qualityScores: {
    empathy: number;
    medicalAccuracy: number;
    overall: number;
  };
  isProactiveResearch: boolean;
  delivered: boolean;
}

export class ProactiveContentService {
  private static activeIntervals: Map<number, NodeJS.Timeout> = new Map();
  private static userCallbacks: Map<number, (message: ProactiveMessage) => void> = new Map();

  // Start proactive content delivery for a user
  static startContentDelivery(
    userId: number, 
    callback: (message: ProactiveMessage) => void,
    intervalMinutes: number = 2
  ) {
    // Stop existing interval if running
    this.stopContentDelivery(userId);
    
    // Store callback
    this.userCallbacks.set(userId, callback);
    
    console.log(`🌸 Dr. Sakura starting proactive research delivery for user ${userId} every ${intervalMinutes} minutes`);
    
    // Send first message after 30 seconds
    setTimeout(() => {
      this.sendProactiveMessage(userId);
    }, 30000);
    
    // Set up recurring delivery
    const interval = setInterval(() => {
      this.sendProactiveMessage(userId);
    }, intervalMinutes * 60 * 1000);
    
    this.activeIntervals.set(userId, interval);
    
    return {
      success: true,
      message: `Proactive content delivery started for user ${userId}`,
      intervalMinutes
    };
  }

  // Send a proactive research message
  private static async sendProactiveMessage(userId: number) {
    try {
      const callback = this.userCallbacks.get(userId);
      if (!callback) {
        console.warn(`No callback found for user ${userId}`);
        return;
      }

      // Generate research content
      const researchMessage = HealthResearchService.generateProactiveResearchMessage();
      
      const proactiveMessage: ProactiveMessage = {
        id: `research_${Date.now()}_${userId}`,
        userId,
        role: 'avatar',
        content: researchMessage.content,
        multimediaContent: researchMessage.multimediaContent,
        timestamp: new Date().toISOString(),
        qualityScores: {
          empathy: 85,
          medicalAccuracy: 95,
          overall: 90
        },
        isProactiveResearch: true,
        delivered: false
      };

      // Send via callback
      callback(proactiveMessage);
      proactiveMessage.delivered = true;
      
      console.log(`📚 Sent proactive research message to user ${userId}: "${researchMessage.content.substring(0, 80)}..."`);
      
    } catch (error) {
      console.error(`Error sending proactive message to user ${userId}:`, error);
    }
  }

  // Stop content delivery for a user
  static stopContentDelivery(userId: number): boolean {
    const interval = this.activeIntervals.get(userId);
    if (interval) {
      clearInterval(interval);
      this.activeIntervals.delete(userId);
      this.userCallbacks.delete(userId);
      console.log(`⏹️ Stopped proactive content delivery for user ${userId}`);
      return true;
    }
    return false;
  }

  // Get delivery status for a user
  static getDeliveryStatus(userId: number): {
    isActive: boolean;
    intervalMinutes?: number;
    nextDelivery?: string;
  } {
    const isActive = this.activeIntervals.has(userId);
    return {
      isActive,
      intervalMinutes: isActive ? 2 : undefined,
      nextDelivery: isActive ? new Date(Date.now() + 2 * 60 * 1000).toISOString() : undefined
    };
  }

  // Send specific research content
  static async sendSpecificResearch(
    userId: number,
    researcherName: string = 'Dr. Rhonda Patrick'
  ): Promise<ProactiveMessage | null> {
    try {
      const callback = this.userCallbacks.get(userId);
      if (!callback) {
        console.warn(`No callback found for user ${userId}`);
        return null;
      }

      // Get content from specific researcher
      const researcherContent = HealthResearchService.getContentByResearcher(researcherName);
      
      if (researcherContent.length === 0) {
        console.warn(`No content found for researcher: ${researcherName}`);
        return null;
      }

      // Get random content from this researcher
      const selectedContent = researcherContent[Math.floor(Math.random() * researcherContent.length)];
      const multimediaContent = HealthResearchService.convertToMultimedia(selectedContent);

      const message = `🌸 **Dr. Sakura's Featured Research**

I wanted to share this important research from ${selectedContent.author}, one of the leading experts in longevity and health optimization:

**"${selectedContent.title}"**

${selectedContent.summary}

**Key Research Findings:**
${selectedContent.keyFindings.map(finding => `• ${finding}`).join('\n')}

This research provides valuable insights that could enhance your health journey. Would you like me to explain how to apply these findings to your daily routine?`;

      const proactiveMessage: ProactiveMessage = {
        id: `specific_research_${Date.now()}_${userId}`,
        userId,
        role: 'avatar',
        content: message,
        multimediaContent,
        timestamp: new Date().toISOString(),
        qualityScores: {
          empathy: 88,
          medicalAccuracy: 96,
          overall: 92
        },
        isProactiveResearch: true,
        delivered: false
      };

      callback(proactiveMessage);
      proactiveMessage.delivered = true;

      return proactiveMessage;

    } catch (error) {
      console.error(`Error sending specific research to user ${userId}:`, error);
      return null;
    }
  }

  // Get all active deliveries
  static getActiveDeliveries(): { userId: number; isActive: boolean }[] {
    return Array.from(this.activeIntervals.keys()).map(userId => ({
      userId,
      isActive: true
    }));
  }
}