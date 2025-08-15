import { pgTable, text, serial, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { storage } from './storage';

// Assistant Accountability System - Track when issues are caused by AI changes
export const assistantSessions = pgTable("assistant_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  userEmail: text("user_email").notNull(),
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  
  // Track what the assistant worked on
  tasksCompleted: jsonb("tasks_completed").$type<string[]>(),
  filesModified: jsonb("files_modified").$type<string[]>(),
  changesDescription: text("changes_description"),
  
  // Track if issues occurred
  issuesIntroduced: boolean("issues_introduced").default(false),
  issueTypes: jsonb("issue_types").$type<string[]>(), // 'typescript_error', 'server_crash', 'api_failure', etc.
  issueDescription: text("issue_description"),
  
  // Track fixes
  wasFixedByAssistant: boolean("was_fixed_by_assistant").default(false),
  fixTime: timestamp("fix_time"),
  shouldNotCharge: boolean("should_not_charge").default(false),
  
  // User feedback
  userSatisfaction: text("user_satisfaction"), // 'satisfied', 'unsatisfied', 'neutral'
  userComments: text("user_comments"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export class AssistantAccountabilityService {
  private static currentSessionId: string | null = null;
  private static sessionStartTime: Date | null = null;
  private static filesModifiedInSession: Set<string> = new Set();
  private static tasksInSession: string[] = [];

  // Start tracking a new assistant session
  static startSession(userEmail: string, initialTask: string): string {
    this.currentSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.sessionStartTime = new Date();
    this.filesModifiedInSession.clear();
    this.tasksInSession = [initialTask];
    
    console.log(`🔍 Assistant Accountability: Started session ${this.currentSessionId} for ${userEmail}`);
    console.log(`📝 Initial task: ${initialTask}`);
    
    return this.currentSessionId;
  }

  // Track file modifications
  static trackFileModification(filePath: string) {
    if (this.currentSessionId) {
      this.filesModifiedInSession.add(filePath);
      console.log(`📄 File modified in session: ${filePath}`);
    }
  }

  // Track completed tasks
  static trackTaskCompletion(task: string) {
    if (this.currentSessionId) {
      this.tasksInSession.push(task);
      console.log(`✅ Task completed in session: ${task}`);
    }
  }

  // Report issues introduced by assistant
  static async reportIssue(issueType: string, description: string) {
    if (!this.currentSessionId) return;

    console.log(`🚨 Assistant Accountability: Issue detected!`);
    console.log(`Issue Type: ${issueType}`);
    console.log(`Description: ${description}`);
    console.log(`Files Modified: ${Array.from(this.filesModifiedInSession).join(', ')}`);
    
    // This would normally save to database - for now just log
    const issueRecord = {
      sessionId: this.currentSessionId,
      issueType,
      description,
      filesModified: Array.from(this.filesModifiedInSession),
      tasksCompleted: this.tasksInSession,
      timestamp: new Date().toISOString()
    };

    // Mark this session as problematic
    console.log(`⚠️  CHARGING POLICY: This session should NOT be charged to user`);
    console.log(`🔧 Assistant will fix this issue at no cost`);
    
    return issueRecord;
  }

  // Mark issue as fixed
  static async markIssueFixed(fixDescription: string) {
    if (!this.currentSessionId) return;

    console.log(`✅ Assistant Accountability: Issue resolved`);
    console.log(`Fix Description: ${fixDescription}`);
    console.log(`⚡ Session marked as: Assistant fixed own mistake - NO CHARGE`);
    
    const fixRecord = {
      sessionId: this.currentSessionId,
      fixDescription,
      fixTime: new Date().toISOString(),
      shouldNotCharge: true
    };

    return fixRecord;
  }

  // End session with summary
  static async endSession(userEmail: string, userFeedback?: string) {
    if (!this.currentSessionId) return;

    const sessionDuration = this.sessionStartTime ? 
      Date.now() - this.sessionStartTime.getTime() : 0;

    console.log(`🏁 Assistant Accountability: Session ended`);
    console.log(`Session ID: ${this.currentSessionId}`);
    console.log(`Duration: ${Math.round(sessionDuration / 1000 / 60)} minutes`);
    console.log(`Files Modified: ${Array.from(this.filesModifiedInSession).join(', ')}`);
    console.log(`Tasks Completed: ${this.tasksInSession.join(', ')}`);
    
    if (userFeedback) {
      console.log(`User Feedback: ${userFeedback}`);
    }

    // Reset session tracking
    this.currentSessionId = null;
    this.sessionStartTime = null;
    this.filesModifiedInSession.clear();
    this.tasksInSession = [];
  }

  // Check if current session has introduced issues
  static hasIssuesInCurrentSession(): boolean {
    // This would check the database for issues in current session
    // For now, return false as a placeholder
    return false;
  }

  // Get charging recommendation
  static getChargingRecommendation(): { shouldCharge: boolean, reason: string } {
    if (!this.currentSessionId) {
      return { shouldCharge: true, reason: "No active session" };
    }

    // Check if issues were introduced and fixed in same session
    const hasIssues = this.hasIssuesInCurrentSession();
    
    if (hasIssues) {
      return { 
        shouldCharge: false, 
        reason: "Assistant introduced and fixed issues in same session - debugging own mistakes"
      };
    }

    return { 
      shouldCharge: true, 
      reason: "Session completed successfully without introducing issues"
    };
  }
}

// Common issue patterns to detect
export const ASSISTANT_ISSUE_PATTERNS = {
  TYPESCRIPT_ERROR: 'typescript_error',
  SERVER_CRASH: 'server_crash', 
  API_FAILURE: 'api_failure',
  PORT_CONFLICT: 'port_conflict',
  INTERFACE_MISMATCH: 'interface_mismatch',
  IMPORT_ERROR: 'import_error',
  SCHEMA_MISMATCH: 'schema_mismatch',
  POLLING_OVERLOAD: 'polling_overload'
};

// Auto-detect common issues
export function detectIssueType(error: string): string {
  const errorLower = error.toLowerCase();
  
  if (errorLower.includes('property') && errorLower.includes('does not exist on type')) {
    return ASSISTANT_ISSUE_PATTERNS.INTERFACE_MISMATCH;
  }
  if (errorLower.includes('eaddrinuse') || errorLower.includes('port')) {
    return ASSISTANT_ISSUE_PATTERNS.PORT_CONFLICT;
  }
  if (errorLower.includes('cannot find module') || errorLower.includes('import')) {
    return ASSISTANT_ISSUE_PATTERNS.IMPORT_ERROR;
  }
  if (errorLower.includes('server') && errorLower.includes('crash')) {
    return ASSISTANT_ISSUE_PATTERNS.SERVER_CRASH;
  }
  
  return 'unknown_issue';
}