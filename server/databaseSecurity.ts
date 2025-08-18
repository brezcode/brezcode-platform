import { db } from './db';
import { eq, and, sql } from 'drizzle-orm';
import { users, leadgenBusinessUsers, brezcodeUsers } from '@shared/schema';

/**
 * Database Security Layer
 * Implements secure database operations with proper validation and audit trails
 */

// User data validation schemas
interface SecureUserData {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  platform: 'leadgen' | 'brezcode';
}

// Secure user creation with validation
export async function createSecureUser(userData: SecureUserData): Promise<any> {
  try {
    // Input validation
    if (!userData.email || !userData.passwordHash || !userData.firstName || !userData.lastName) {
      throw new Error('All required fields must be provided');
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    // Check for existing user
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, userData.email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('User already exists with this email');
    }

    // Create user with audit trail
    const [newUser] = await db.transaction(async (tx) => {
      // Create main user record
      const [user] = await tx.insert(users).values({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email.toLowerCase(), // Normalize email
        password: userData.passwordHash,
        platform: userData.platform,
        isEmailVerified: false,
        createdAt: new Date()
      }).returning();

      // Create platform-specific user record
      if (userData.platform === 'leadgen') {
        await tx.insert(leadgenBusinessUsers).values({
          userId: user.id,
          businessName: null,
          industry: null,
          createdAt: new Date()
        });
      } else if (userData.platform === 'brezcode') {
        await tx.insert(brezcodeUsers).values({
          userId: user.id,
          healthProfile: {},
          riskLevel: 'unknown',
          createdAt: new Date()
        });
      }

      return [user];
    });

    // Log successful user creation (without sensitive data)
    console.log('AUDIT: User created', {
      userId: newUser.id,
      email: userData.email,
      platform: userData.platform,
      timestamp: new Date().toISOString()
    });

    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Secure user authentication
export async function authenticateUser(email: string, plainPassword: string): Promise<any | null> {
  try {
    // Input validation
    if (!email || !plainPassword) {
      throw new Error('Email and password are required');
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Get user with password hash
    const [user] = await db.select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (!user) {
      // Log failed login attempt
      console.log('AUDIT: Failed login - user not found', {
        email: normalizedEmail,
        timestamp: new Date().toISOString()
      });
      return null;
    }

    // Verify password using bcrypt
    const bcrypt = await import('bcrypt');
    const isValidPassword = await bcrypt.compare(plainPassword, user.password);

    if (!isValidPassword) {
      // Log failed login attempt
      console.log('AUDIT: Failed login - invalid password', {
        userId: user.id,
        email: normalizedEmail,
        timestamp: new Date().toISOString()
      });
      return null;
    }

    // Log successful login
    console.log('AUDIT: Successful login', {
      userId: user.id,
      email: normalizedEmail,
      platform: user.platform,
      timestamp: new Date().toISOString()
    });

    // Return user without password
    const { password, ...safeUser } = user;
    return safeUser;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

// Secure data retrieval with access control
export async function getSecureUserData(userId: number, requestingUserId: number): Promise<any | null> {
  try {
    // Access control - users can only access their own data
    if (userId !== requestingUserId) {
      throw new Error('Unauthorized access to user data');
    }

    // Get user data without password
    const [user] = await db.select({
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

    return user || null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    throw error;
  }
}

// Secure data update with validation
export async function updateSecureUserData(
  userId: number, 
  updateData: Partial<{
    firstName: string;
    lastName: string;
    isEmailVerified: boolean;
    subscriptionTier: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    isSubscriptionActive: boolean;
  }>,
  requestingUserId: number
): Promise<any | null> {
  try {
    // Access control
    if (userId !== requestingUserId) {
      throw new Error('Unauthorized access to update user data');
    }

    // Input validation
    if (updateData.firstName && updateData.firstName.trim().length === 0) {
      throw new Error('First name cannot be empty');
    }
    if (updateData.lastName && updateData.lastName.trim().length === 0) {
      throw new Error('Last name cannot be empty');
    }

    // Update user data
    const [updatedUser] = await db.update(users)
      .set({
        ...updateData,
        // Always update timestamp when data changes
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        platform: users.platform,
        isEmailVerified: users.isEmailVerified,
        subscriptionTier: users.subscriptionTier,
        isSubscriptionActive: users.isSubscriptionActive
      });

    // Log data update
    console.log('AUDIT: User data updated', {
      userId,
      updatedFields: Object.keys(updateData),
      timestamp: new Date().toISOString()
    });

    return updatedUser;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
}

// Database health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    // Simple query to check database connectivity
    await db.select({ count: sql`count(*)` }).from(users).limit(1);
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Data backup utilities
export async function createDataBackup(userId: number): Promise<any> {
  try {
    // Get all user-related data for backup
    const userData = await getSecureUserData(userId, userId);
    
    // Get platform-specific data
    let platformData = null;
    if (userData?.platform === 'leadgen') {
      const [leadgenData] = await db.select()
        .from(leadgenBusinessUsers)
        .where(eq(leadgenBusinessUsers.userId, userId))
        .limit(1);
      platformData = leadgenData;
    } else if (userData?.platform === 'brezcode') {
      const [brezcodeData] = await db.select()
        .from(brezcodeUsers)
        .where(eq(brezcodeUsers.userId, userId))
        .limit(1);
      platformData = brezcodeData;
    }

    const backup = {
      userData,
      platformData,
      backupDate: new Date().toISOString(),
      version: '1.0'
    };

    // Log backup creation
    console.log('AUDIT: Data backup created', {
      userId,
      platform: userData?.platform,
      timestamp: new Date().toISOString()
    });

    return backup;
  } catch (error) {
    console.error('Error creating data backup:', error);
    throw error;
  }
}

// Data integrity check
export async function verifyDataIntegrity(): Promise<{ status: string; issues: string[] }> {
  const issues: string[] = [];

  try {
    // Check for orphaned records
    const orphanedLeadgen = await db.select({ count: sql`count(*)` })
      .from(leadgenBusinessUsers)
      .leftJoin(users, eq(leadgenBusinessUsers.userId, users.id))
      .where(sql`${users.id} IS NULL`);

    const orphanedBrezcode = await db.select({ count: sql`count(*)` })
      .from(brezcodeUsers)
      .leftJoin(users, eq(brezcodeUsers.userId, users.id))
      .where(sql`${users.id} IS NULL`);

    if (Number(orphanedLeadgen[0].count) > 0) {
      issues.push(`Found ${orphanedLeadgen[0].count} orphaned leadgen user records`);
    }

    if (Number(orphanedBrezcode[0].count) > 0) {
      issues.push(`Found ${orphanedBrezcode[0].count} orphaned brezcode user records`);
    }

    // Check for duplicate emails
    const duplicateEmails = await db.select({
      email: users.email,
      count: sql`count(*)`
    })
    .from(users)
    .groupBy(users.email)
    .having(sql`count(*) > 1`);

    if (duplicateEmails.length > 0) {
      issues.push(`Found ${duplicateEmails.length} duplicate email addresses`);
    }

    return {
      status: issues.length === 0 ? 'healthy' : 'issues_found',
      issues
    };
  } catch (error) {
    console.error('Error checking data integrity:', error);
    return {
      status: 'error',
      issues: ['Failed to perform integrity check']
    };
  }
}