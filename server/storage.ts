import { users, emailVerifications, type User, type InsertUser, type SubscriptionTier, type EmailVerification } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
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
  verifyEmail(email: string): Promise<User | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private emailVerifications: Map<string, EmailVerification>;
  currentId: number;
  currentEmailVerificationId: number;

  constructor() {
    this.users = new Map();
    this.emailVerifications = new Map();
    this.currentId = 1;
    this.currentEmailVerificationId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser,
      id,
      quizAnswers: insertUser.quizAnswers || null,
      isEmailVerified: false,
      subscriptionTier: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      isSubscriptionActive: false,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
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
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      createdAt: new Date(),
    };
    this.emailVerifications.set(`${email}:${code}`, verification);
    return verification;
  }

  async getEmailVerification(email: string, code: string): Promise<EmailVerification | undefined> {
    const verification = this.emailVerifications.get(`${email}:${code}`);
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
    return updatedUser;
  }

  // Phone verification removed - using Firebase Auth + email verification only
}

export const storage = new MemStorage();
