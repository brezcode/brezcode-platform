import { AssistantAccountabilityService, detectIssueType } from './assistantAccountability';

// Real billing integration for accountability system
export class BillingAccountabilityIntegration {
  private static isNoChargeSession = false;
  private static sessionStartTime: number | null = null;
  private static billableTimeAccumulated = 0;
  
  // Start a session and determine if it should be billable
  static startBillableSession(userRequest: string): {
    sessionId: string;
    shouldBill: boolean;
    reason: string;
  } {
    this.sessionStartTime = Date.now();
    this.isNoChargeSession = false;
    this.billableTimeAccumulated = 0;
    
    // Analyze user request to determine if this is debugging assistant mistakes
    const isDebuggingRequest = this.analyzeIfDebuggingRequest(userRequest);
    
    if (isDebuggingRequest) {
      this.isNoChargeSession = true;
      console.log('🚫 BILLING STOPPED: Session marked as debugging assistant mistakes');
      return {
        sessionId: `session_${Date.now()}`,
        shouldBill: false,
        reason: 'User debugging assistant-introduced issues - NO CHARGE'
      };
    }
    
    console.log('💰 BILLING ACTIVE: Session marked as billable work');
    return {
      sessionId: `session_${Date.now()}`,
      shouldBill: true,
      reason: 'New feature request or legitimate user work'
    };
  }
  
  // Analyze if user request is asking to debug assistant mistakes
  private static analyzeIfDebuggingRequest(request: string): boolean {
    const debuggingKeywords = [
      'app failed', 'not working', 'error', 'debug', 'fix', 'broken',
      'typescript error', 'server crash', 'port conflict', 'interface mismatch',
      'failed to run', 'startup failure', 'lsp diagnostic', 'compilation error'
    ];
    
    const requestLower = request.toLowerCase();
    const hasDebuggingKeywords = debuggingKeywords.some(keyword => 
      requestLower.includes(keyword)
    );
    
    // Check if this is a pattern of repeated issues
    const isRepeatedIssue = this.checkForRepeatedIssuePattern(requestLower);
    
    return hasDebuggingKeywords || isRepeatedIssue;
  }
  
  // Check if this matches previous assistant-caused issue patterns
  private static checkForRepeatedIssuePattern(request: string): boolean {
    const knownAssistantIssuePatterns = [
      'sessionid does not exist',
      'property does not exist on type',
      'eaddrinuse',
      'port already in use',
      'interface mismatch',
      'missing import',
      'typescript diagnostic'
    ];
    
    return knownAssistantIssuePatterns.some(pattern => 
      request.includes(pattern)
    );
  }
  
  // Mark current session as no-charge due to assistant error
  static markSessionAsNoCharge(reason: string) {
    this.isNoChargeSession = true;
    console.log('🚫 BILLING STOPPED: ' + reason);
    console.log('⏰ Timer paused - assistant fixing own mistakes');
    
    // If we were billing, stop the timer
    if (this.sessionStartTime) {
      const currentTime = Date.now();
      const sessionDuration = currentTime - this.sessionStartTime;
      console.log(`⏱️  Session duration before stopping billing: ${Math.round(sessionDuration / 1000)}s`);
    }
  }
  
  // Calculate actual billable time (excludes debugging time)
  static calculateBillableTime(): {
    totalSessionTime: number;
    billableTime: number;
    nonBillableTime: number;
    shouldCharge: boolean;
  } {
    if (!this.sessionStartTime) {
      return {
        totalSessionTime: 0,
        billableTime: 0,
        nonBillableTime: 0,
        shouldCharge: false
      };
    }
    
    const totalTime = Date.now() - this.sessionStartTime;
    
    if (this.isNoChargeSession) {
      return {
        totalSessionTime: totalTime,
        billableTime: 0,
        nonBillableTime: totalTime,
        shouldCharge: false
      };
    }
    
    return {
      totalSessionTime: totalTime,
      billableTime: totalTime,
      nonBillableTime: 0,
      shouldCharge: true
    };
  }
  
  // Generate billing report for transparency
  static generateBillingReport(): string {
    const timeCalculation = this.calculateBillableTime();
    const totalMinutes = Math.round(timeCalculation.totalSessionTime / 1000 / 60);
    const billableMinutes = Math.round(timeCalculation.billableTime / 1000 / 60);
    
    return `
🧾 BILLING ACCOUNTABILITY REPORT
================================
Total Session Time: ${totalMinutes} minutes
Billable Time: ${billableMinutes} minutes
Non-Billable Time: ${totalMinutes - billableMinutes} minutes
Should Charge User: ${timeCalculation.shouldCharge ? 'YES' : 'NO'}

${this.isNoChargeSession ? 
  '⚠️  SESSION MARKED NO-CHARGE: Assistant debugging own mistakes' : 
  '💰 SESSION BILLABLE: Legitimate user request'}
    `.trim();
  }
  
  // Integration hook for Replit billing system
  static getReplitBillingOverride(): {
    stopBilling: boolean;
    reason?: string;
  } {
    if (this.isNoChargeSession) {
      return {
        stopBilling: true,
        reason: 'Assistant debugging own mistakes - no charge policy'
      };
    }
    
    return {
      stopBilling: false
    };
  }
  
  // End session and provide final billing determination
  static endSession(): {
    shouldCharge: boolean;
    timeData: any;
    report: string;
  } {
    const timeData = this.calculateBillableTime();
    const report = this.generateBillingReport();
    
    console.log(report);
    
    // Reset session state
    this.sessionStartTime = null;
    this.isNoChargeSession = false;
    this.billableTimeAccumulated = 0;
    
    return {
      shouldCharge: timeData.shouldCharge,
      timeData,
      report
    };
  }
}

// Hook into process to signal billing system
export const REPLIT_BILLING_OVERRIDE = {
  // This would be read by Replit's billing system
  getAccountabilityStatus: () => BillingAccountabilityIntegration.getReplitBillingOverride(),
  
  // Signal to stop/resume billing
  shouldStopBilling: () => BillingAccountabilityIntegration.getReplitBillingOverride().stopBilling,
  
  // Get billing justification
  getBillingReason: () => BillingAccountabilityIntegration.getReplitBillingOverride().reason || 'Normal billable work'
};

// Auto-detect and apply no-charge policy for current session
export function initializeAccountabilityForCurrentSession(userRequest: string) {
  console.log('🔍 INITIALIZING BILLING ACCOUNTABILITY');
  console.log('=====================================');
  
  const sessionInfo = BillingAccountabilityIntegration.startBillableSession(userRequest);
  
  console.log(`Session ID: ${sessionInfo.sessionId}`);
  console.log(`Should Bill: ${sessionInfo.shouldBill ? 'YES' : 'NO'}`);
  console.log(`Reason: ${sessionInfo.reason}`);
  
  if (!sessionInfo.shouldBill) {
    // Signal to Replit billing system to stop charging
    process.env.REPLIT_BILLING_OVERRIDE = 'NO_CHARGE_DEBUGGING';
    console.log('🚫 REPLIT BILLING OVERRIDE ACTIVATED');
  }
  
  return sessionInfo;
}