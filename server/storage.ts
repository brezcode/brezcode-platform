import { users, emailVerifications, healthReports, userProfiles, type User, type InsertUser, type SubscriptionTier, type EmailVerification, type HealthReport, type InsertHealthReport, type CreateUserData } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: CreateUserData): Promise<User>;
  deleteUser(email: string): Promise<boolean>; // For test email cleanup
  updateUserSubscription(
    id: number, 
    tier: SubscriptionTier, 
    stripeCustomerId?: string, 
    stripeSubscriptionId?: string
  ): Promise<User | undefined>;
  updateStripeCustomerId(id: number, customerId: string): Promise<User | undefined>;
  
  // Email verification
  createEmailVerification(email: string, code: string): Promise<EmailVerification>;
  getEmailVerification(email: string, code: string): Promise<EmailVerification | undefined>;
  getPendingVerification(email: string): Promise<EmailVerification | undefined>;
  verifyEmail(email: string): Promise<User | undefined>;
  // Pending user storage for email verification
  storePendingUser(email: string, userData: any): Promise<void>;
  getPendingUser(email: string): Promise<any>;
  deletePendingUser(email: string): Promise<void>;
  
  // Health reports
  createHealthReport(report: InsertHealthReport): Promise<HealthReport>;
  getHealthReports(userId: number): Promise<HealthReport[]>;
  getLatestHealthReport(userId: number): Promise<HealthReport | undefined>;
  
  // Profile updates
  updateUser(id: number, userData: Partial<User>): Promise<User>;
  getUserProfile(userId: number): Promise<any>;
  updateUserProfile(userId: number, profileData: any): Promise<any>;
  createUserProfile(userId: number, profileData: any): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private emailVerifications: Map<string, EmailVerification>;
  private healthReports: Map<number, HealthReport>;
  private healthMetrics: Map<number, any>;
  private healthDataSync: Map<number, any>;
  private pendingUsers: Map<string, any>;
  currentId: number;
  currentEmailVerificationId: number;
  currentHealthReportId: number;

  constructor() {
    this.users = new Map();
    this.emailVerifications = new Map();
    this.healthReports = new Map();
    this.healthMetrics = new Map();
    this.healthDataSync = new Map();
    this.pendingUsers = new Map();
    this.currentId = 1;
    this.currentEmailVerificationId = 1;
    this.currentHealthReportId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: CreateUserData): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      id,
      firstName: insertUser.firstName,
      lastName: insertUser.lastName,
      email: insertUser.email,
      password: insertUser.password,
      quizAnswers: insertUser.quizAnswers || null,
      isEmailVerified: false,
      subscriptionTier: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      isSubscriptionActive: false,
      createdAt: new Date(),
      platform: "leadgen",
      phone: null,
      address: null,
      bio: null,
      profilePhoto: null,
      streetAddress: null,
      city: null,
      state: null,
      postalCode: null,
      country: null,
      phoneNumber: null,
    };
    this.users.set(id, user);
    return user;
  }

  async deleteUser(email: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);
    if (!user) return false;
    
    // Delete the user
    this.users.delete(user.id);
    
    // Also clean up any email verifications for this email
    const keysToDelete: string[] = [];
    for (const [key, verification] of Array.from(this.emailVerifications.entries())) {
      if (verification.email === email) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => this.emailVerifications.delete(key));
    
    // Clean up health reports for this user
    const reportsToDelete: number[] = [];
    for (const [id, report] of Array.from(this.healthReports.entries())) {
      if (report.userId === user.id) {
        reportsToDelete.push(id);
      }
    }
    reportsToDelete.forEach(id => this.healthReports.delete(id));
    
    return true;
  }

  async updateUserSubscription(
    id: number, 
    tier: SubscriptionTier, 
    stripeCustomerId?: string, 
    stripeSubscriptionId?: string
  ): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      subscriptionTier: tier,
      isSubscriptionActive: true,
      ...(stripeCustomerId && { stripeCustomerId }),
      ...(stripeSubscriptionId && { stripeSubscriptionId }),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateStripeCustomerId(id: number, customerId: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      stripeCustomerId: customerId,
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Email verification methods
  async createEmailVerification(email: string, code: string): Promise<EmailVerification> {
    const id = this.currentEmailVerificationId++;
    const verification: EmailVerification = {
      id,
      email,
      code,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      createdAt: new Date(),
    };
    // Store both by email+code and by email only for easier lookup
    this.emailVerifications.set(`${email}:${code}`, verification);
    this.emailVerifications.set(`pending:${email}`, verification);
    return verification;
  }

  async getEmailVerification(email: string, code: string): Promise<EmailVerification | undefined> {
    const verification = this.emailVerifications.get(`${email}:${code}`);
    if (!verification || verification.expiresAt < new Date()) {
      return undefined;
    }
    return verification;
  }

  async getPendingVerification(email: string): Promise<EmailVerification | undefined> {
    const verification = this.emailVerifications.get(`pending:${email}`);
    if (!verification || verification.expiresAt < new Date()) {
      return undefined;
    }
    return verification;
  }

  async verifyEmail(email: string): Promise<User | undefined> {
    const user = await this.getUserByEmail(email);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      isEmailVerified: true,
    };

    this.users.set(user.id, updatedUser);
    
    // Clean up verification records
    this.emailVerifications.delete(`pending:${email}`);
    this.deletePendingUser(email);
    return updatedUser;
  }

  // Pending user management for email verification
  async storePendingUser(email: string, userData: any): Promise<void> {
    this.pendingUsers.set(email, userData);
  }

  async getPendingUser(email: string): Promise<any> {
    return this.pendingUsers.get(email);
  }

  async deletePendingUser(email: string): Promise<void> {
    this.pendingUsers.delete(email);
  }

  // Health Reports
  async createHealthReport(report: InsertHealthReport): Promise<HealthReport> {
    const id = this.currentHealthReportId++;
    const healthReport: HealthReport = {
      ...report,
      id,
      userId: report.userId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.healthReports.set(id, healthReport);
    return healthReport;
  }

  async getHealthReports(userId: number): Promise<HealthReport[]> {
    return Array.from(this.healthReports.values())
      .filter(report => report.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getLatestHealthReport(userId: number): Promise<HealthReport | undefined> {
    const reports = await this.getHealthReports(userId);
    return reports[0]; // Most recent due to sorting
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    const updatedUser: User = {
      ...existingUser,
      ...userData,
      id, // Ensure ID doesn't change
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Apple Health Data Management
  async createHealthMetrics(metrics: any): Promise<any> {
    const id = this.healthMetrics.size + 1;
    const newMetrics = { id, ...metrics };
    this.healthMetrics.set(id, newMetrics);
    return Promise.resolve(newMetrics);
  }

  async getHealthMetricsByUser(userId: number, days: number = 30): Promise<any[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const userMetrics = Array.from(this.healthMetrics.values())
      .filter(metrics => 
        metrics.userId === userId && 
        new Date(metrics.date) >= cutoffDate
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return Promise.resolve(userMetrics);
  }

  async getLatestHealthMetrics(userId: number): Promise<any | null> {
    const userMetrics = Array.from(this.healthMetrics.values())
      .filter(metrics => metrics.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return Promise.resolve(userMetrics[0] || null);
  }

  async updateHealthDataSync(userId: number, settings: any): Promise<any> {
    const existing = this.healthDataSync.get(userId);
    const updated = existing ? { ...existing, ...settings, updatedAt: new Date() } : 
                              { id: userId, userId, ...settings, createdAt: new Date(), updatedAt: new Date() };
    
    this.healthDataSync.set(userId, updated);
    return Promise.resolve(updated);
  }

  async getHealthDataSyncByUser(userId: number): Promise<any | null> {
    return Promise.resolve(this.healthDataSync.get(userId) || null);
  }

  // Profile methods required by interface
  async getUserProfile(userId: number): Promise<any> {
    const user = this.users.get(userId);
    if (!user) return null;
    
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      bio: user.bio,
      profilePhoto: user.profilePhoto,
      streetAddress: user.streetAddress,
      city: user.city,
      state: user.state,
      postalCode: user.postalCode,
      country: user.country,
      phoneNumber: user.phoneNumber,
    };
  }

  async updateUserProfile(userId: number, profileData: any): Promise<any> {
    return this.updateUser(userId, profileData);
  }

  async createUserProfile(userId: number, profileData: any): Promise<any> {
    return this.updateUser(userId, profileData);
  }
}

// Switch from MemStorage to DatabaseStorage for persistent data
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: CreateUserData): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async deleteUser(email: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.email, email));
    return (result.rowCount || 0) > 0;
  }

  async updateUserSubscription(
    id: number, 
    tier: SubscriptionTier, 
    stripeCustomerId?: string, 
    stripeSubscriptionId?: string
  ): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ 
        subscriptionTier: tier, 
        stripeCustomerId, 
        stripeSubscriptionId,
        isSubscriptionActive: true
      })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async updateStripeCustomerId(id: number, customerId: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ stripeCustomerId: customerId })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async createEmailVerification(email: string, code: string): Promise<EmailVerification> {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    
    const [verification] = await db
      .insert(emailVerifications)
      .values({ email, code, expiresAt })
      .returning();
    return verification;
  }

  async getEmailVerification(email: string, code: string): Promise<EmailVerification | undefined> {
    const [verification] = await db
      .select()
      .from(emailVerifications)
      .where(and(eq(emailVerifications.email, email), eq(emailVerifications.code, code)))
      .limit(1);
    return verification || undefined;
  }

  async verifyEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ isEmailVerified: true })
      .where(eq(users.email, email))
      .returning();
    return user || undefined;
  }

  async createHealthReport(report: InsertHealthReport): Promise<HealthReport> {
    const [healthReport] = await db
      .insert(healthReports)
      .values(report)
      .returning();
    return healthReport;
  }

  async getHealthReports(userId: number): Promise<HealthReport[]> {
    return await db
      .select()
      .from(healthReports)
      .where(eq(healthReports.userId, userId));
  }

  async getLatestHealthReport(userId: number): Promise<HealthReport | undefined> {
    const [report] = await db
      .select()
      .from(healthReports)
      .where(eq(healthReports.userId, userId))
      .orderBy(desc(healthReports.createdAt))
      .limit(1);
    return report || undefined;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getUserProfile(userId: number): Promise<any> {
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);
    return profile || null;
  }

  async updateUserProfile(userId: number, profileData: any): Promise<any> {
    const existingProfile = await this.getUserProfile(userId);
    
    if (existingProfile) {
      const [updatedProfile] = await db
        .update(userProfiles)
        .set({ ...profileData, updatedAt: new Date() })
        .where(eq(userProfiles.userId, userId))
        .returning();
      return updatedProfile;
    } else {
      return this.createUserProfile(userId, profileData);
    }
  }

  async createUserProfile(userId: number, profileData: any): Promise<any> {
    const [profile] = await db
      .insert(userProfiles)
      .values({ userId, ...profileData })
      .returning();
    return profile;
  }

  // Missing methods for email verification - using in-memory storage for pending users
  private pendingUsers: Map<string, any> = new Map();

  async getPendingVerification(email: string): Promise<EmailVerification | undefined> {
    const [verification] = await db
      .select()
      .from(emailVerifications)
      .where(eq(emailVerifications.email, email))
      .orderBy(desc(emailVerifications.createdAt))
      .limit(1);
    
    if (!verification || verification.expiresAt < new Date()) {
      return undefined;
    }
    return verification;
  }

  async storePendingUser(email: string, userData: any): Promise<void> {
    this.pendingUsers.set(email, userData);
  }

  async getPendingUser(email: string): Promise<any> {
    return this.pendingUsers.get(email);
  }

  async deletePendingUser(email: string): Promise<void> {
    this.pendingUsers.delete(email);
  }
}

export const storage = new DatabaseStorage();
