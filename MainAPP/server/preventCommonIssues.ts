import { AssistantAccountabilityService, detectIssueType } from './assistantAccountability';

// Pre-flight checks to prevent common assistant mistakes
export class IssuePreventionService {
  
  // Check TypeScript interfaces before making changes
  static async validateTypeScriptChanges(filePath: string, newContent: string): Promise<string[]> {
    const issues: string[] = [];
    
    // Check for common interface mismatches
    if (filePath.includes('.tsx') || filePath.includes('.ts')) {
      // Check for sessionId access without proper interface
      if (newContent.includes('activeSession.sessionId') && 
          !newContent.includes('sessionId: string')) {
        issues.push('Interface mismatch: Accessing sessionId without defining it in interface');
      }
      
      // Check for missing imports
      const importRegex = /import.*from ['"](.*)['"];?/g;
      const imports = [...newContent.matchAll(importRegex)];
      
      // Common missing imports that cause issues
      const requiredImports = ['@/components/ui/', '@/hooks/', '@/lib/'];
      for (const requiredImport of requiredImports) {
        if (newContent.includes(requiredImport.replace('@/', '')) && 
            !imports.some(imp => imp[1].includes(requiredImport))) {
          issues.push(`Missing import: Component from ${requiredImport} used but not imported`);
        }
      }
    }
    
    return issues;
  }
  
  // Check for port conflicts before starting server
  static async checkPortConflicts(): Promise<boolean> {
    try {
      const { exec } = await import('child_process');
      return new Promise((resolve) => {
        exec('netstat -tulpn | grep :5000 || true', (error, stdout) => {
          const hasConflict = stdout.includes(':5000');
          if (hasConflict) {
            console.log('⚠️  Port 5000 conflict detected - will kill existing process');
          }
          resolve(!hasConflict);
        });
      });
    } catch {
      return true; // Assume no conflict if check fails
    }
  }
  
  // Validate API endpoint consistency
  static validateApiEndpoints(filePath: string, content: string): string[] {
    const issues: string[] = [];
    
    // Check for endpoint mismatches
    const apiCalls = content.match(/apiRequest\(['"`](\w+)['"`],\s*['"`]([^'"`]+)['"`]/g);
    if (apiCalls) {
      for (const call of apiCalls) {
        const match = call.match(/apiRequest\(['"`](\w+)['"`],\s*['"`]([^'"`]+)['"`]/);
        if (match) {
          const [, method, endpoint] = match;
          
          // Check for common endpoint issues
          if (endpoint.includes('${') && !endpoint.includes('}')) {
            issues.push(`Malformed template literal in API endpoint: ${endpoint}`);
          }
          
          if (method === 'GET' && endpoint.includes('/undefined')) {
            issues.push(`GET request with undefined parameter: ${endpoint}`);
          }
        }
      }
    }
    
    return issues;
  }
  
  // Run all pre-flight checks
  static async runPreflightChecks(filePath: string, content: string): Promise<{
    safe: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    console.log(`🔍 Running pre-flight checks for: ${filePath}`);
    
    const allIssues: string[] = [];
    const recommendations: string[] = [];
    
    // TypeScript validation
    const tsIssues = await this.validateTypeScriptChanges(filePath, content);
    allIssues.push(...tsIssues);
    
    // API endpoint validation
    const apiIssues = this.validateApiEndpoints(filePath, content);
    allIssues.push(...apiIssues);
    
    // Port conflict check (only for server files)
    if (filePath.includes('server/') || filePath.includes('index.ts')) {
      const portSafe = await this.checkPortConflicts();
      if (!portSafe) {
        allIssues.push('Port 5000 conflict detected');
        recommendations.push('Kill existing Node.js process before starting server');
      }
    }
    
    // Generate recommendations based on issues
    if (tsIssues.length > 0) {
      recommendations.push('Update TypeScript interfaces to match usage');
    }
    if (apiIssues.length > 0) {
      recommendations.push('Verify API endpoint parameters and template literals');
    }
    
    const safe = allIssues.length === 0;
    
    if (!safe) {
      console.log(`⚠️  Pre-flight check failed: ${allIssues.length} issues found`);
      allIssues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log(`✅ Pre-flight check passed for ${filePath}`);
    }
    
    return {
      safe,
      issues: allIssues,
      recommendations
    };
  }
}

// Wrapper for file editing that includes pre-flight checks
export async function safeFileEdit(
  filePath: string, 
  oldStr: string, 
  newStr: string,
  description: string
): Promise<{ success: boolean; error?: string }> {
  
  console.log(`🛡️  Safe File Edit: ${description}`);
  
  // Track the modification attempt
  AssistantAccountabilityService.trackFileModification(filePath);
  
  try {
    // Read current file content (this would be done by the actual edit tool)
    // For now, just validate the new string content
    const preflightResult = await IssuePreventionService.runPreflightChecks(filePath, newStr);
    
    if (!preflightResult.safe) {
      console.log(`🚨 Pre-flight check failed - canceling edit`);
      console.log(`Issues found: ${preflightResult.issues.join(', ')}`);
      
      // Report the issue to accountability system
      await AssistantAccountabilityService.reportIssue(
        'preflight_validation_failed',
        `Pre-flight validation failed: ${preflightResult.issues.join(', ')}`
      );
      
      return {
        success: false,
        error: `Pre-flight validation failed: ${preflightResult.issues[0]}`
      };
    }
    
    console.log(`✅ Pre-flight passed - proceeding with edit`);
    return { success: true };
    
  } catch (error) {
    const errorStr = error instanceof Error ? error.message : String(error);
    const issueType = detectIssueType(errorStr);
    
    await AssistantAccountabilityService.reportIssue(issueType, errorStr);
    
    return {
      success: false,
      error: errorStr
    };
  }
}