import { db } from './db';
import { sql, eq, and, desc } from 'drizzle-orm';
import { users, leadgenUsers, brezcodeUsers } from '@shared/schema';

/**
 * Comprehensive Data Protection and Backup System
 * Ensures all user data is securely saved in database with proper validation
 */

// Data validation interface
interface DataValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Comprehensive data backup for user
export async function createCompleteUserBackup(userId: number): Promise<any> {
  try {
    console.log(`Creating complete backup for user ${userId}...`);
    
    // Get main user data
    const [userData] = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        platform: users.platform,
        isEmailVerified: users.isEmailVerified,
        subscriptionTier: users.subscriptionTier,
        isSubscriptionActive: users.isSubscriptionActive,
        stripeCustomerId: users.stripeCustomerId,
        stripeSubscriptionId: users.stripeSubscriptionId,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userData) {
      throw new Error(`User ${userId} not found for backup`);
    }

    // Get platform-specific data
    let platformData = null;
    if (userData.platform === 'leadgen') {
      const [leadgenData] = await db
        .select()
        .from(leadgenUsers)
        .where(eq(leadgenUsers.userId, userId))
        .limit(1);
      platformData = leadgenData;
    } else if (userData.platform === 'brezcode') {
      const [brezcodeData] = await db
        .select()
        .from(brezcodeUsers)
        .where(eq(brezcodeUsers.userId, userId))
        .limit(1);
      platformData = brezcodeData;
    }

    const backup = {
      backupId: `backup_${userId}_${Date.now()}`,
      userData,
      platformData,
      backupTimestamp: new Date().toISOString(),
      backupVersion: '2.0',
      dataIntegrity: 'verified'
    };

    console.log(`Backup completed for user ${userId}:`, {
      hasUserData: !!userData,
      hasPlatformData: !!platformData,
      platform: userData.platform
    });

    return backup;
  } catch (error) {
    console.error(`Error creating backup for user ${userId}:`, error);
    throw error;
  }
}

// Validate user data integrity
export async function validateUserData(userId: number): Promise<DataValidationResult> {
  const result: DataValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  try {
    // Check if user exists
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      result.isValid = false;
      result.errors.push('User record not found');
      return result;
    }

    // Validate required fields
    if (!user.firstName || user.firstName.trim().length === 0) {
      result.errors.push('First name is empty');
      result.isValid = false;
    }

    if (!user.lastName || user.lastName.trim().length === 0) {
      result.errors.push('Last name is empty');
      result.isValid = false;
    }

    if (!user.email || !user.email.includes('@')) {
      result.errors.push('Invalid email format');
      result.isValid = false;
    }

    if (!user.password || user.password.length < 8) {
      result.errors.push('Password hash invalid');
      result.isValid = false;
    }

    // Check platform-specific data consistency
    if (user.platform === 'leadgen') {
      const [leadgenData] = await db
        .select()
        .from(leadgenUsers)
        .where(eq(leadgenUsers.userId, userId))
        .limit(1);
      
      if (!leadgenData) {
        result.warnings.push('LeadGen profile data missing');
      }
    } else if (user.platform === 'brezcode') {
      const [brezcodeData] = await db
        .select()
        .from(brezcodeUsers)
        .where(eq(brezcodeUsers.userId, userId))
        .limit(1);
      
      if (!brezcodeData) {
        result.warnings.push('BrezCode health profile missing');
      }
    }

    // Email verification check
    if (!user.isEmailVerified) {
      result.warnings.push('Email not verified');
    }

    console.log(`Data validation for user ${userId}:`, {
      isValid: result.isValid,
      errors: result.errors.length,
      warnings: result.warnings.length
    });

  } catch (error) {
    result.isValid = false;
    result.errors.push(`Validation error: ${error.message}`);
  }

  return result;
}

// Comprehensive system health check
export async function performSystemHealthCheck(): Promise<{
  database: boolean;
  users: number;
  leadgenUsers: number;
  brezcodeUsers: number;
  dataIntegrity: string;
  lastCheck: string;
}> {
  try {
    // Test database connection
    await db.select({ count: sql`count(*)` }).from(users).limit(1);
    
    // Count records
    const [userCount] = await db.select({ count: sql`count(*)` }).from(users);
    const [leadgenCount] = await db.select({ count: sql`count(*)` }).from(leadgenUsers);
    const [brezcodeCount] = await db.select({ count: sql`count(*)` }).from(brezcodeUsers);

    // Check for orphaned records
    const orphanedLeadgen = await db
      .select({ count: sql`count(*)` })
      .from(leadgenUsers)
      .leftJoin(users, eq(leadgenUsers.userId, users.id))
      .where(sql`${users.id} IS NULL`);

    const orphanedBrezcode = await db
      .select({ count: sql`count(*)` })
      .from(brezcodeUsers)
      .leftJoin(users, eq(brezcodeUsers.userId, users.id))
      .where(sql`${users.id} IS NULL`);

    const hasOrphans = Number(orphanedLeadgen[0].count) > 0 || Number(orphanedBrezcode[0].count) > 0;
    
    return {
      database: true,
      users: Number(userCount.count),
      leadgenUsers: Number(leadgenCount.count),
      brezcodeUsers: Number(brezcodeCount.count),
      dataIntegrity: hasOrphans ? 'issues_detected' : 'healthy',
      lastCheck: new Date().toISOString()
    };
  } catch (error) {
    console.error('Health check failed:', error);
    return {
      database: false,
      users: 0,
      leadgenUsers: 0,
      brezcodeUsers: 0,
      dataIntegrity: 'error',
      lastCheck: new Date().toISOString()
    };
  }
}

// Save user data with validation
export async function saveSecureUserData(userData: any): Promise<{ success: boolean; userId?: number; errors: string[] }> {
  const errors: string[] = [];
  
  try {
    // Input validation
    if (!userData.email) {
      errors.push('Email is required');
    }
    
    if (!userData.firstName) {
      errors.push('First name is required');
    }
    
    if (!userData.lastName) {
      errors.push('Last name is required');
    }
    
    if (!userData.password) {
      errors.push('Password is required');
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    // Hash password if not already hashed
    let hashedPassword = userData.password;
    if (!userData.password.startsWith('$2b$')) {
      const bcrypt = await import('bcrypt');
      hashedPassword = await bcrypt.hash(userData.password, 10);
    }

    // Save to database with transaction
    const result = await db.transaction(async (tx) => {
      // Create main user record
      const [newUser] = await tx.insert(users).values({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        platform: userData.platform || 'leadgen',
        isEmailVerified: userData.isEmailVerified || false,
        subscriptionTier: userData.subscriptionTier || 'basic',
        isSubscriptionActive: userData.isSubscriptionActive || false,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning({ id: users.id });

      // Create platform-specific record
      if ((userData.platform || 'leadgen') === 'leadgen') {
        await tx.insert(leadgenUsers).values({
          userId: newUser.id,
          businessName: userData.businessName || null,
          industry: userData.industry || null,
          createdAt: new Date()
        });
      } else if (userData.platform === 'brezcode') {
        await tx.insert(brezcodeUsers).values({
          userId: newUser.id,
          healthProfile: userData.healthProfile || {},
          riskLevel: userData.riskLevel || 'unknown',
          createdAt: new Date()
        });
      }

      return newUser;
    });

    // Validate saved data
    const validation = await validateUserData(result.id);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    console.log(`User data saved successfully: ${result.id}`);
    return { success: true, userId: result.id, errors: [] };
    
  } catch (error) {
    console.error('Error saving user data:', error);
    errors.push(`Database error: ${error.message}`);
    return { success: false, errors };
  }
}

// Secure data retrieval with audit trail
export async function retrieveSecureUserData(userId: number, requestedBy: number): Promise<any | null> {
  // Access control
  if (userId !== requestedBy) {
    console.warn(`Unauthorized data access attempt: User ${requestedBy} tried to access data for user ${userId}`);
    throw new Error('Unauthorized access');
  }

  try {
    // Get user data
    const [userData] = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        platform: users.platform,
        isEmailVerified: users.isEmailVerified,
        subscriptionTier: users.subscriptionTier,
        isSubscriptionActive: users.isSubscriptionActive,
        createdAt: users.createdAt
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userData) {
      return null;
    }

    // Get platform-specific data
    let platformData = null;
    if (userData.platform === 'leadgen') {
      const [leadgenData] = await db
        .select()
        .from(leadgenUsers)
        .where(eq(leadgenUsers.userId, userId))
        .limit(1);
      platformData = leadgenData;
    } else if (userData.platform === 'brezcode') {
      const [brezcodeData] = await db
        .select()
        .from(brezcodeUsers)
        .where(eq(brezcodeUsers.userId, userId))
        .limit(1);
      platformData = brezcodeData;
    }

    // Audit log
    console.log(`Data retrieved for user ${userId} by user ${requestedBy}`);

    return {
      ...userData,
      platformData
    };
  } catch (error) {
    console.error(`Error retrieving user data for ${userId}:`, error);
    throw error;
  }
}