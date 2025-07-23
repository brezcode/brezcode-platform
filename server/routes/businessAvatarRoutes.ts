import { Router } from 'express';
import { 
  BUSINESS_AVATARS, 
  getAvatarById, 
  getAvatarsByBusinessType, 
  getAvatarsByIndustry,
  getAvatarsByPricingTier,
  CUSTOMIZATION_OPTIONS,
  DEPLOYMENT_CONFIGS,
  BusinessAvatar
} from '../businessAvatars';

const router = Router();

// Get all business avatars
router.get('/avatars', (req, res) => {
  try {
    const { businessType, industry, tier, active } = req.query;
    
    let filteredAvatars = BUSINESS_AVATARS;
    
    if (businessType) {
      filteredAvatars = getAvatarsByBusinessType(businessType as string);
    }
    
    if (industry) {
      filteredAvatars = getAvatarsByIndustry(industry as string);
    }
    
    if (tier) {
      filteredAvatars = getAvatarsByPricingTier(tier as 'basic' | 'premium' | 'enterprise');
    }
    
    if (active === 'true') {
      filteredAvatars = filteredAvatars.filter(avatar => avatar.isActive);
    }
    
    res.json({
      success: true,
      avatars: filteredAvatars,
      totalAvatars: filteredAvatars.length,
      businessTypes: [...new Set(BUSINESS_AVATARS.map(a => a.businessType))],
      industries: [...new Set(BUSINESS_AVATARS.flatMap(a => a.industries))],
      pricingTiers: [...new Set(BUSINESS_AVATARS.map(a => a.pricing.tier))]
    });
  } catch (error) {
    console.error('Error fetching business avatars:', error);
    res.status(500).json({ error: 'Failed to fetch business avatars' });
  }
});

// Get specific avatar details
router.get('/avatars/:id', (req, res) => {
  try {
    const { id } = req.params;
    const avatar = getAvatarById(id);
    
    if (!avatar) {
      return res.status(404).json({ error: 'Avatar not found' });
    }
    
    res.json({
      success: true,
      avatar,
      customizationOptions: CUSTOMIZATION_OPTIONS
    });
  } catch (error) {
    console.error('Error fetching avatar:', error);
    res.status(500).json({ error: 'Failed to fetch avatar details' });
  }
});

// Get avatars by business type
router.get('/business-type/:type', (req, res) => {
  try {
    const { type } = req.params;
    const avatars = getAvatarsByBusinessType(type);
    
    res.json({
      success: true,
      businessType: type,
      avatars,
      count: avatars.length
    });
  } catch (error) {
    console.error('Error fetching avatars by business type:', error);
    res.status(500).json({ error: 'Failed to fetch avatars by business type' });
  }
});

// Get deployment recommendations
router.get('/deployment/:businessType', (req, res) => {
  try {
    const { businessType } = req.params;
    const config = DEPLOYMENT_CONFIGS[businessType as keyof typeof DEPLOYMENT_CONFIGS];
    
    if (!config) {
      return res.status(404).json({ error: 'Business type not found' });
    }
    
    const recommendedAvatar = getAvatarById(config.recommendedAvatar);
    const alternativeAvatars = getAvatarsByBusinessType(businessType);
    
    res.json({
      success: true,
      businessType,
      recommendedAvatar,
      alternativeAvatars,
      deploymentConfig: config,
      customizationOptions: CUSTOMIZATION_OPTIONS
    });
  } catch (error) {
    console.error('Error fetching deployment config:', error);
    res.status(500).json({ error: 'Failed to fetch deployment configuration' });
  }
});

// Create/customize avatar
router.post('/avatars/customize', (req, res) => {
  try {
    const {
      baseAvatarId,
      customizations,
      businessName,
      targetAudience
    } = req.body;
    
    const baseAvatar = getAvatarById(baseAvatarId);
    if (!baseAvatar) {
      return res.status(404).json({ error: 'Base avatar not found' });
    }
    
    // Create customized avatar
    const customizedAvatar: BusinessAvatar = {
      ...baseAvatar,
      id: `custom_${Date.now()}`,
      name: customizations.name || baseAvatar.name,
      description: customizations.description || baseAvatar.description,
      appearance: {
        ...baseAvatar.appearance,
        ...customizations.appearance
      },
      voiceProfile: {
        ...baseAvatar.voiceProfile,
        ...customizations.voiceProfile
      },
      specializations: customizations.specializations || baseAvatar.specializations,
      communicationStyle: customizations.communicationStyle || baseAvatar.communicationStyle,
      updatedAt: new Date().toISOString()
    };
    
    // In production, save to database
    // await db.insert(customAvatars).values(customizedAvatar);
    
    res.json({
      success: true,
      avatar: customizedAvatar,
      message: 'Avatar customized successfully',
      deploymentReady: true
    });
  } catch (error) {
    console.error('Error customizing avatar:', error);
    res.status(500).json({ error: 'Failed to customize avatar' });
  }
});

// Get customization options
router.get('/customization-options', (req, res) => {
  try {
    res.json({
      success: true,
      options: CUSTOMIZATION_OPTIONS,
      businessTypes: [...new Set(BUSINESS_AVATARS.map(a => a.businessType))],
      popularCustomizations: {
        most_professional: {
          appearance: { style: 'professional', outfit: 'Executive Business Suit' },
          voice: { tone: 'professional', pace: 'moderate' }
        },
        most_friendly: {
          appearance: { style: 'friendly', outfit: 'Modern Casual Professional' },
          voice: { tone: 'warm', pace: 'moderate' }
        },
        most_energetic: {
          appearance: { style: 'energetic', outfit: 'Sales Professional' },
          voice: { tone: 'enthusiastic', pace: 'fast' }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching customization options:', error);
    res.status(500).json({ error: 'Failed to fetch customization options' });
  }
});

// Deploy avatar to business
router.post('/avatars/:id/deploy', (req, res) => {
  try {
    const { id } = req.params;
    const { businessId, deploymentConfig } = req.body;
    
    const avatar = getAvatarById(id);
    if (!avatar) {
      return res.status(404).json({ error: 'Avatar not found' });
    }
    
    // In production, save deployment configuration
    const deployment = {
      id: `deploy_${Date.now()}`,
      avatarId: id,
      businessId,
      config: deploymentConfig,
      status: 'active',
      deployedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      deployment,
      avatar,
      message: 'Avatar deployed successfully',
      endpoints: {
        chat: `/api/chat/${deployment.id}`,
        voice: `/api/voice/${deployment.id}`,
        admin: `/api/avatar-admin/${deployment.id}`
      }
    });
  } catch (error) {
    console.error('Error deploying avatar:', error);
    res.status(500).json({ error: 'Failed to deploy avatar' });
  }
});

// Get avatar performance analytics
router.get('/avatars/:id/analytics', (req, res) => {
  try {
    const { id } = req.params;
    const { timeRange = '30d' } = req.query;
    
    const avatar = getAvatarById(id);
    if (!avatar) {
      return res.status(404).json({ error: 'Avatar not found' });
    }
    
    // Mock analytics data - in production, fetch from analytics database
    const analytics = {
      avatarId: id,
      timeRange,
      conversations: {
        total: 1247,
        successful: 1156,
        escalated: 91,
        averageLength: '4.2 minutes'
      },
      satisfaction: {
        average: 4.6,
        distribution: { 5: 68, 4: 24, 3: 6, 2: 1, 1: 1 }
      },
      performance: {
        responseTime: '1.2 seconds',
        accuracyRate: 94.5,
        resolutionRate: 87.3,
        engagementScore: 92.1
      },
      topIssues: [
        'Product information requests',
        'Billing inquiries',
        'Technical support',
        'Account management'
      ],
      improvementAreas: [
        'Complex technical queries',
        'Emotional support scenarios',
        'Multi-step processes'
      ]
    };
    
    res.json({
      success: true,
      analytics,
      avatar: {
        id: avatar.id,
        name: avatar.name,
        businessType: avatar.businessType
      }
    });
  } catch (error) {
    console.error('Error fetching avatar analytics:', error);
    res.status(500).json({ error: 'Failed to fetch avatar analytics' });
  }
});

export default router;