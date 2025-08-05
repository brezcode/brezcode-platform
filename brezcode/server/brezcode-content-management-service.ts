// BREZCODE CONTENT MANAGEMENT SERVICE
// Health content creation and management for BrezCode platform
// Adapted from LeadGen content tools for health education and coaching materials

import { db } from './brezcode-db'
import { brezcodeUsers, brezcodeHealthAssessments } from '../../shared/brezcode-schema'
import { eq, desc } from 'drizzle-orm'

export interface HealthContent {
  id: string
  title: string
  category: 'education' | 'prevention' | 'screening' | 'lifestyle' | 'nutrition' | 'exercise'
  targetAudience: 'general' | 'low_risk' | 'moderate_risk' | 'high_risk' | 'young_adults' | 'middle_aged' | 'seniors'
  content: string
  mediaType: 'article' | 'video' | 'infographic' | 'audio' | 'interactive'
  tags: string[]
  createdAt: Date
  updatedAt: Date
  isPublished: boolean
  authorId?: number
  metadata?: {
    readingTime?: number
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
    medicalReview?: boolean
    sources?: string[]
  }
}

export interface PersonalizedContentRecommendation {
  userId: number
  contentId: string
  reason: string
  priority: 'low' | 'medium' | 'high'
  recommendedAt: Date
  viewedAt?: Date
}

export interface ContentPerformance {
  contentId: string
  views: number
  completionRate: number
  userSatisfaction: number
  shares: number
  averageTimeSpent: number
  engagementScore: number
}

class BrezcodeContentManagementService {
  private healthContent: Map<string, HealthContent> = new Map()
  private recommendations: Map<string, PersonalizedContentRecommendation> = new Map()

  constructor() {
    this.initializeDefaultContent()
  }

  private initializeDefaultContent() {
    // Breast Health Education Content
    const educationContent: HealthContent[] = [
      {
        id: 'breast-anatomy-basics',
        title: 'Understanding Breast Anatomy and Development',
        category: 'education',
        targetAudience: 'general',
        content: `
# Understanding Your Breast Anatomy

Your breasts are complex structures made up of several types of tissue. Understanding their anatomy helps you better monitor your breast health and perform effective self-examinations.

## Key Components:

### Mammary Glands
- **Function**: Produce milk during lactation
- **Structure**: Organized into 15-20 sections called lobes
- **Changes**: Vary with hormonal cycles, pregnancy, and age

### Ductal System
- **Milk Ducts**: Carry milk from lobes to nipple
- **Terminal Ducts**: Where most breast cancers originate
- **Nipple**: Contains multiple duct openings

### Supportive Tissues
- **Fatty Tissue**: Provides shape and cushioning
- **Connective Tissue**: Supports mammary glands
- **Chest Muscle**: Lies beneath breast tissue

### Lymphatic System
- **Lymph Nodes**: Filter lymphatic fluid
- **Primary Locations**: Armpit, collarbone, chest
- **Function**: Part of immune system defense

## Normal Changes Throughout Life:

### Menstrual Cycle
- Hormonal fluctuations cause texture changes
- Breasts may feel fuller or more tender
- Best time for self-exam: week after period

### Pregnancy and Nursing
- Significant growth and changes
- Increased blood flow and sensitivity
- Milk production capabilities develop

### Menopause
- Decreased hormone production
- Tissue becomes less dense
- Screening may become easier

## Why This Matters:
Understanding normal breast anatomy helps you:
- Recognize what's normal for you
- Detect changes early
- Communicate effectively with healthcare providers
- Reduce anxiety about normal variations

Remember: Every person's breasts are unique. Getting familiar with your normal anatomy is the first step in maintaining breast health.
        `,
        mediaType: 'article',
        tags: ['anatomy', 'education', 'basic', 'breast-health'],
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true,
        metadata: {
          readingTime: 8,
          difficulty: 'beginner',
          medicalReview: true,
          sources: ['American Cancer Society', 'Mayo Clinic', 'National Cancer Institute']
        }
      },
      {
        id: 'self-examination-guide',
        title: 'Monthly Breast Self-Examination: Complete Guide',
        category: 'screening',
        targetAudience: 'general',
        content: `
# Monthly Breast Self-Examination Guide

Regular breast self-examination is a simple yet powerful tool for maintaining breast health awareness. While it cannot replace professional screening, it helps you become familiar with your normal breast tissue.

## When to Perform Self-Exams:

### For Menstruating Individuals:
- **Best Time**: 3-5 days after period ends
- **Reason**: Hormones are most stable
- **Consistency**: Same time each month

### For Non-Menstruating Individuals:
- **Frequency**: Same date each month
- **Choose**: Easy-to-remember date (like the 1st)

## Step-by-Step Instructions:

### Step 1: Visual Inspection (Mirror)
1. **Position**: Stand topless in front of mirror
2. **Arms at Sides**: Look for size, shape, color changes
3. **Arms Raised**: Check for skin changes, dimpling
4. **Hands on Hips**: Press firmly, look for muscle changes

**Look For:**
- Changes in size or shape
- Skin dimpling or puckering
- Nipple changes or discharge
- Redness, swelling, or rash

### Step 2: Physical Examination (Standing)
1. **In Shower**: Soapy hands glide easily
2. **Hand Position**: Use opposite hand to examine each breast
3. **Finger Technique**: Use 3 middle fingers, flat finger pads
4. **Pressure**: Light, medium, then firm pressure
5. **Pattern**: Choose vertical strips, circles, or wedges

**Coverage Area:**
- Entire breast tissue
- From collarbone to bra line
- From armpit to center of chest
- Include nipple area

### Step 3: Lying Down Examination
1. **Position**: Lie flat with arm behind head
2. **Pillow**: Place under shoulder being examined
3. **Technique**: Same as standing examination
4. **Complete**: Both breasts thoroughly

## What You're Feeling For:

### Normal Findings:
- Firm ridge along bottom of breast
- Soft, fatty tissue (most of breast)
- Some lumpiness (especially upper outer area)
- Firmness that varies with cycle

### Changes to Report:
- New lumps or thickening
- Changes in skin texture
- Nipple discharge (non-milky)
- Persistent pain in one area
- Changes in size or shape

## Important Reminders:

### Stay Consistent:
- Use same technique each time
- Perform at same time monthly
- Track findings if helpful

### Don't Panic:
- 80% of breast lumps are benign
- Many changes are hormonal
- Early detection saves lives

### Professional Care:
- Self-exams supplement professional screening
- Report any changes to healthcare provider
- Follow recommended screening guidelines

## Special Considerations:

### Pregnancy/Nursing:
- Continue self-exams
- Expect normal changes
- Report unusual findings

### Breast Implants:
- Modified technique may be needed
- Learn normal feel with implants
- Regular professional exams important

### Dense Breast Tissue:
- May feel naturally lumpy
- Self-exam still valuable
- Professional screening may need enhancement

Remember: The goal is familiarity with your normal breast tissue. Changes are not necessarily cancer, but early detection through awareness is your best protection.
        `,
        mediaType: 'article',
        tags: ['self-exam', 'screening', 'prevention', 'monthly', 'guide'],
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true,
        metadata: {
          readingTime: 12,
          difficulty: 'beginner',
          medicalReview: true,
          sources: ['American Cancer Society', 'Susan G. Komen', 'CDC']
        }
      },
      {
        id: 'nutrition-breast-health',
        title: 'Nutrition for Breast Health: Evidence-Based Guidelines',
        category: 'nutrition',
        targetAudience: 'general',
        content: `
# Nutrition for Optimal Breast Health

Research shows that certain dietary patterns may help reduce breast cancer risk and support overall breast health. While no single food prevents cancer, a balanced approach to nutrition can be powerful.

## Anti-Inflammatory Foods:

### Colorful Fruits and Vegetables:
- **Berries**: Anthocyanins and antioxidants
- **Leafy Greens**: Folate and phytochemicals
- **Cruciferous Vegetables**: Broccoli, cauliflower, Brussels sprouts
- **Orange/Yellow Produce**: Beta-carotene sources

### Healthy Fats:
- **Omega-3 Fatty Acids**: Salmon, sardines, walnuts, flaxseeds
- **Monounsaturated Fats**: Olive oil, avocados, nuts
- **Limit**: Processed and trans fats

### Whole Grains:
- **Fiber Benefits**: Hormone regulation, weight management
- **Options**: Quinoa, brown rice, oats, whole wheat
- **Goal**: 25-35 grams fiber daily

## Foods to Emphasize:

### Soy Foods (Whole Forms):
- **Research**: May be protective when consumed as whole foods
- **Sources**: Tofu, tempeh, edamame, soy milk
- **Moderation**: 1-2 servings daily

### Green Tea:
- **Compounds**: Polyphenols, especially EGCG
- **Benefits**: Antioxidant and anti-inflammatory properties
- **Consumption**: 2-3 cups daily

### Herbs and Spices:
- **Turmeric**: Curcumin for inflammation reduction
- **Garlic**: Sulfur compounds
- **Ginger**: Anti-inflammatory properties

## Foods to Limit:

### Processed Meats:
- **Examples**: Bacon, sausage, deli meats
- **Alternative**: Lean poultry, fish, plant proteins

### Refined Sugars:
- **Impact**: Inflammation, weight gain
- **Sources**: Sugary drinks, desserts, processed foods

### Excessive Alcohol:
- **Recommendation**: Limit to 1 drink per day or less
- **Risk**: Alcohol increases breast cancer risk

### High-Fat Dairy:
- **Consideration**: Choose low-fat options
- **Focus**: Calcium and vitamin D benefits

## Meal Planning Strategies:

### Daily Structure:
- **Breakfast**: Berries, whole grains, nuts
- **Lunch**: Leafy greens, lean protein, healthy fats
- **Dinner**: Colorful vegetables, fish or plant protein
- **Snacks**: Fruits, vegetables, nuts

### Weekly Planning:
- **Fish**: 2-3 servings weekly
- **Legumes**: Daily inclusion
- **Variety**: Rainbow of produce colors
- **Preparation**: Minimize processed foods

## Hydration:
- **Water**: 8-10 glasses daily
- **Herbal Teas**: Green tea, chamomile
- **Limit**: Sugary beverages, excessive caffeine

## Supplements Consideration:

### Evidence-Based Options:
- **Vitamin D**: If deficient (test first)
- **Omega-3**: If fish intake is low
- **Folate**: For adequate intake

### Consult Healthcare Provider:
- Before starting any supplements
- For personalized recommendations
- To avoid interactions

## Special Dietary Patterns:

### Mediterranean Diet:
- **Research**: Associated with reduced risk
- **Emphasis**: Olive oil, fish, fruits, vegetables
- **Lifestyle**: Combined with physical activity

### Plant-Based Eating:
- **Benefits**: High fiber, antioxidants, low saturated fat
- **Approach**: Emphasize variety and completeness

## Practical Tips:

### Shopping:
- **Perimeter**: Fresh produce, lean proteins
- **Read Labels**: Minimize processed ingredients
- **Seasonal**: Choose fresh, local when possible

### Cooking:
- **Methods**: Steaming, baking, grilling vs. frying
- **Oils**: Use healthy fats for cooking
- **Herbs**: Flavor without excess sodium

### Mindful Eating:
- **Portions**: Listen to hunger cues
- **Environment**: Minimize distractions
- **Enjoyment**: Savor nutritious foods

Remember: Nutrition is just one component of breast health. Combine healthy eating with regular exercise, adequate sleep, stress management, and appropriate medical screening for comprehensive breast health care.
        `,
        mediaType: 'article',
        tags: ['nutrition', 'diet', 'prevention', 'anti-inflammatory', 'evidence-based'],
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true,
        metadata: {
          readingTime: 15,
          difficulty: 'intermediate',
          medicalReview: true,
          sources: ['American Institute for Cancer Research', 'Harvard School of Public Health', 'World Cancer Research Fund']
        }
      }
    ]

    // Store in memory (in production, this would be in database)
    educationContent.forEach(content => {
      this.healthContent.set(content.id, content)
    })
  }

  async getPersonalizedContent(userId: number): Promise<{ content: HealthContent; reason: string }[]> {
    try {
      // Get user's latest assessment
      const latestAssessment = await db
        .select()
        .from(brezcodeHealthAssessments)
        .where(eq(brezcodeHealthAssessments.userId, userId))
        .orderBy(desc(brezcodeHealthAssessments.completedAt))
        .limit(1)

      const user = await db
        .select()
        .from(brezcodeUsers)
        .where(eq(brezcodeUsers.id, userId))
        .limit(1)

      if (user.length === 0) {
        throw new Error('User not found')
      }

      const riskLevel = latestAssessment[0]?.riskCategory || 'general'
      const recommendations: { content: HealthContent; reason: string }[] = []

      // Get all available content
      const allContent = Array.from(this.healthContent.values())

      // Personalize based on user profile
      for (const content of allContent) {
        const recommendation = this.generateContentRecommendation(content, riskLevel, userId)
        if (recommendation) {
          recommendations.push({
            content,
            reason: recommendation.reason
          })

          // Store recommendation
          this.recommendations.set(`${userId}-${content.id}`, recommendation)
        }
      }

      // Sort by priority
      return recommendations.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        const aPriority = this.recommendations.get(`${userId}-${a.content.id}`)?.priority || 'low'
        const bPriority = this.recommendations.get(`${userId}-${b.content.id}`)?.priority || 'low'
        return priorityOrder[bPriority] - priorityOrder[aPriority]
      })
    } catch (error) {
      console.error('Personalized content error:', error)
      throw error
    }
  }

  private generateContentRecommendation(
    content: HealthContent, 
    riskLevel: string, 
    userId: number
  ): PersonalizedContentRecommendation | null {
    // Content recommendation logic based on user profile
    let reason = ''
    let priority: 'low' | 'medium' | 'high' = 'low'

    // Risk-based recommendations
    if (riskLevel === 'high' && content.category === 'screening') {
      reason = 'Based on your risk profile, this screening information is particularly relevant'
      priority = 'high'
    } else if (riskLevel === 'moderate' && content.category === 'prevention') {
      reason = 'Your moderate risk level makes prevention strategies especially important'
      priority = 'medium'
    } else if (content.category === 'education' && content.targetAudience === 'general') {
      reason = 'Essential breast health education for everyone'
      priority = 'medium'
    } else if (content.category === 'nutrition') {
      reason = 'Nutrition plays a key role in overall breast health'
      priority = 'medium'
    }

    // Skip if no relevant reason found
    if (!reason) return null

    return {
      userId,
      contentId: content.id,
      reason,
      priority,
      recommendedAt: new Date()
    }
  }

  async getContentById(contentId: string): Promise<HealthContent | null> {
    return this.healthContent.get(contentId) || null
  }

  async getContentByCategory(category: HealthContent['category']): Promise<HealthContent[]> {
    return Array.from(this.healthContent.values())
      .filter(content => content.category === category && content.isPublished)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  async searchContent(query: string, filters?: {
    category?: HealthContent['category']
    targetAudience?: HealthContent['targetAudience']
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
  }): Promise<HealthContent[]> {
    const lowerQuery = query.toLowerCase()
    
    return Array.from(this.healthContent.values())
      .filter(content => {
        // Text search
        const matchesQuery = 
          content.title.toLowerCase().includes(lowerQuery) ||
          content.content.toLowerCase().includes(lowerQuery) ||
          content.tags.some(tag => tag.toLowerCase().includes(lowerQuery))

        // Filter matching
        const matchesCategory = !filters?.category || content.category === filters.category
        const matchesAudience = !filters?.targetAudience || content.targetAudience === filters.targetAudience
        const matchesDifficulty = !filters?.difficulty || content.metadata?.difficulty === filters.difficulty

        return matchesQuery && matchesCategory && matchesAudience && matchesDifficulty && content.isPublished
      })
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  async createContent(contentData: Omit<HealthContent, 'id' | 'createdAt' | 'updatedAt'>): Promise<HealthContent> {
    const id = `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newContent: HealthContent = {
      ...contentData,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.healthContent.set(id, newContent)
    return newContent
  }

  async updateContent(contentId: string, updates: Partial<HealthContent>): Promise<HealthContent | null> {
    const existing = this.healthContent.get(contentId)
    if (!existing) return null

    const updated: HealthContent = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    }

    this.healthContent.set(contentId, updated)
    return updated
  }

  async deleteContent(contentId: string): Promise<boolean> {
    return this.healthContent.delete(contentId)
  }

  async trackContentView(userId: number, contentId: string): Promise<void> {
    // Mark recommendation as viewed
    const recommendationKey = `${userId}-${contentId}`
    const recommendation = this.recommendations.get(recommendationKey)
    if (recommendation) {
      recommendation.viewedAt = new Date()
      this.recommendations.set(recommendationKey, recommendation)
    }

    // In production, track analytics
    console.log(`User ${userId} viewed content ${contentId}`)
  }

  async getContentPerformance(contentId: string): Promise<ContentPerformance> {
    // In production, this would query analytics data
    return {
      contentId,
      views: Math.floor(Math.random() * 1000),
      completionRate: Math.random() * 100,
      userSatisfaction: Math.random() * 5,
      shares: Math.floor(Math.random() * 50),
      averageTimeSpent: Math.floor(Math.random() * 600), // seconds
      engagementScore: Math.random() * 100
    }
  }

  async getFeaturedContent(): Promise<HealthContent[]> {
    // Return top performing or manually featured content
    return Array.from(this.healthContent.values())
      .filter(content => content.isPublished)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 6)
  }

  async getContentAnalytics() {
    const allContent = Array.from(this.healthContent.values())
    const totalContent = allContent.length
    const publishedContent = allContent.filter(c => c.isPublished).length
    
    const categoryDistribution = allContent.reduce((acc, content) => {
      acc[content.category] = (acc[content.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalContent,
      publishedContent,
      categoryDistribution,
      averageReadingTime: allContent.reduce((sum, c) => sum + (c.metadata?.readingTime || 0), 0) / totalContent,
      contentByDifficulty: {
        beginner: allContent.filter(c => c.metadata?.difficulty === 'beginner').length,
        intermediate: allContent.filter(c => c.metadata?.difficulty === 'intermediate').length,
        advanced: allContent.filter(c => c.metadata?.difficulty === 'advanced').length
      }
    }
  }
}

export const brezcodeContentManagementService = new BrezcodeContentManagementService()