// Business management service for multi-business support
export interface Business {
  id: number;
  userId: number;
  name: string;
  industry: string;
  description: string;
  website?: string;
  logo?: string;
  primaryColor?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewBusiness {
  userId: number;
  name: string;
  industry: string;
  description: string;
  website?: string;
  isActive: boolean;
}

export class BusinessService {
  // Get all businesses for a user
  static async getUserBusinesses(userId: number): Promise<Business[]> {
    // Mock data for development - in production this would query the database
    return [
      {
        id: 1,
        userId,
        name: "BrezCode Health",
        industry: "Health & Wellness",
        description: "AI-powered health assessments and personalized coaching platform",
        website: "https://brezcode.com",
        primaryColor: "#10B981",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        userId,
        name: "TechConsult Pro",
        industry: "Technology Consulting",
        description: "Digital transformation and IT consulting services",
        website: "https://techconsult.com",
        primaryColor: "#3B82F6",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        userId,
        name: "EcoSmart Solutions",
        industry: "Sustainability",
        description: "Environmental consulting and green technology solutions",
        primaryColor: "#059669",
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  // Create new business
  static async createBusiness(business: NewBusiness): Promise<Business> {
    const newBusiness: Business = {
      id: Date.now(),
      ...business,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // In production, this would save to database
    console.log("Creating new business:", newBusiness);
    
    return newBusiness;
  }

  // Update business
  static async updateBusiness(businessId: number, updates: Partial<Business>): Promise<Business> {
    // In production, this would update the database
    console.log(`Updating business ${businessId}:`, updates);
    
    return {
      id: businessId,
      userId: updates.userId || 1,
      name: updates.name || "Updated Business",
      industry: updates.industry || "General",
      description: updates.description || "Updated business description",
      isActive: updates.isActive !== undefined ? updates.isActive : true,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    };
  }

  // Delete business (soft delete)
  static async deleteBusiness(businessId: number): Promise<boolean> {
    // In production, this would set isActive to false or delete from database
    console.log(`Deleting business ${businessId}`);
    return true;
  }

  // Get business by ID
  static async getBusinessById(businessId: number): Promise<Business | null> {
    const businesses = await this.getUserBusinesses(1); // Mock user ID
    return businesses.find(b => b.id === businessId) || null;
  }

  // Get business statistics
  static async getBusinessStats(businessId: number) {
    return {
      totalCustomers: Math.floor(Math.random() * 1000) + 100,
      monthlyRevenue: Math.floor(Math.random() * 50000) + 10000,
      activeAssistants: Math.floor(Math.random() * 5) + 1,
      conversationsThisMonth: Math.floor(Math.random() * 500) + 50,
      customerSatisfaction: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
      responseTime: Math.floor(Math.random() * 30) + 10 // seconds
    };
  }

  // Switch active business context
  static async switchBusinessContext(userId: number, businessId: number): Promise<boolean> {
    // In production, this would update user's active business context
    console.log(`User ${userId} switching to business ${businessId}`);
    return true;
  }

  // Get industries list for dropdown
  static getIndustries(): string[] {
    return [
      "Health & Wellness",
      "Technology Consulting", 
      "E-commerce",
      "Real Estate",
      "Financial Services",
      "Education",
      "Marketing & Advertising",
      "Food & Beverage",
      "Automotive",
      "Fashion & Beauty",
      "Travel & Tourism",
      "Legal Services",
      "Manufacturing",
      "Healthcare",
      "Construction",
      "Entertainment",
      "Non-profit",
      "Other"
    ];
  }
}