import { db } from "./db";
import { userFeedback, knowledgeBase } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function submitUserFeedback(userId: number, feedback: {
  reportId: number;
  feedbackType: 'correction' | 'improvement' | 'error_report';
  originalContent: string;
  correctedContent?: string;
  userComment: string;
}) {
  try {
    // Insert feedback into database
    await db.insert(userFeedback).values({
      userId,
      ...feedback
    });

    // If it's a correction, add to knowledge base for future reference
    if (feedback.feedbackType === 'correction' && feedback.correctedContent) {
      await db.insert(knowledgeBase).values({
        category: 'corrections',
        title: `User Correction: ${feedback.userComment.substring(0, 100)}`,
        content: feedback.correctedContent,
        evidenceLevel: 'medium',
        tags: ['user_correction', 'medical_accuracy'],
        isActive: true
      });
    }

    return { success: true, message: 'Feedback submitted successfully' };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return { success: false, message: 'Failed to submit feedback' };
  }
}

export async function getUnprocessedFeedback() {
  try {
    return await db
      .select()
      .from(userFeedback)
      .where(eq(userFeedback.isProcessed, false))
      .orderBy(userFeedback.createdAt);
  } catch (error) {
    console.error('Error getting unprocessed feedback:', error);
    return [];
  }
}

export async function markFeedbackProcessed(feedbackId: number) {
  try {
    await db
      .update(userFeedback)
      .set({ isProcessed: true })
      .where(eq(userFeedback.id, feedbackId));
    return { success: true };
  } catch (error) {
    console.error('Error marking feedback as processed:', error);
    return { success: false };
  }
}