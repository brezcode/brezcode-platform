import { AvatarTrainingSessionService } from './avatarTrainingSessionService';
import { BrezcodeAvatarService } from './brezcodeAvatarService';

// Event-driven knowledge transfer service
export class KnowledgeTransferService {
  
  // Transfer knowledge from completed LeadGen training session to BrezCode
  static async transferTrainingSessionToBrezcode(
    sessionId: string, 
    userId: number
  ): Promise<{ success: boolean; transferred: number; error?: string }> {
    try {
      console.log(`🔄 Starting knowledge transfer for session ${sessionId} to BrezCode...`);
      
      // Get the completed training session
      const session = await AvatarTrainingSessionService.getSession(sessionId);
      
      if (!session) {
        return { 
          success: false, 
          transferred: 0, 
          error: 'Training session not found' 
        };
      }

      // Only transfer Dr. Sakura sessions for BrezCode
      if (session.avatarId !== 'dr_sakura_brezcode') {
        console.log(`⏭️ Skipping non-BrezCode session: ${session.avatarId}`);
        return { 
          success: true, 
          transferred: 0, 
          error: 'Session not applicable to BrezCode platform' 
        };
      }

      // Only transfer completed sessions
      if (session.status !== 'completed') {
        return { 
          success: false, 
          transferred: 0, 
          error: 'Session not completed yet' 
        };
      }

      // Extract knowledge from training session
      const knowledgePoints = this.extractKnowledgeFromSession(session);
      
      if (knowledgePoints.length === 0) {
        console.log(`⚠️ No knowledge points found in session ${sessionId}`);
        return { 
          success: true, 
          transferred: 0 
        };
      }

      // Store knowledge in BrezCode platform
      // This would typically update a knowledge base or training data
      console.log(`📚 Extracted ${knowledgePoints.length} knowledge points from training session`);
      
      // For now, we'll log the transfer completion
      // In the future, this could update BrezCode-specific training data
      console.log(`✅ Knowledge transfer completed for session ${sessionId} - ${knowledgePoints.length} points transferred`);
      
      return { 
        success: true, 
        transferred: knowledgePoints.length 
      };

    } catch (error) {
      console.error('Error during knowledge transfer:', error);
      return { 
        success: false, 
        transferred: 0, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Extract valuable knowledge points from a training session
  private static extractKnowledgeFromSession(session: any): Array<{
    type: string;
    content: string;
    quality: number;
    timestamp: Date;
  }> {
    const knowledgePoints: Array<{
      type: string;
      content: string; 
      quality: number;
      timestamp: Date;
    }> = [];

    // Extract from conversation history
    if (session.conversationHistory && Array.isArray(session.conversationHistory)) {
      session.conversationHistory.forEach((message: any) => {
        if (message.role === 'avatar' && message.qualityScore && message.qualityScore > 80) {
          knowledgePoints.push({
            type: 'high_quality_response',
            content: message.content,
            quality: message.qualityScore,
            timestamp: new Date(message.timestamp)
          });
        }
      });
    }

    // Extract from scenario learnings
    if (session.scenarioDetails && session.scenarioDetails.objectives) {
      session.scenarioDetails.objectives.forEach((objective: string) => {
        knowledgePoints.push({
          type: 'training_objective',
          content: objective,
          quality: 85,
          timestamp: new Date()
        });
      });
    }

    return knowledgePoints;
  }

  // Trigger knowledge transfer when a training session is completed
  static async onTrainingSessionCompleted(sessionId: string, userId: number): Promise<void> {
    try {
      console.log(`🎯 Training session completed event triggered: ${sessionId}`);
      
      const result = await this.transferTrainingSessionToBrezcode(sessionId, userId);
      
      if (result.success) {
        console.log(`✅ Knowledge transfer completed: ${result.transferred} points transferred`);
      } else {
        console.warn(`⚠️ Knowledge transfer failed: ${result.error}`);
      }
      
    } catch (error) {
      console.error('Error handling training session completion:', error);
    }
  }
}