import { Router } from 'express';

const router = Router();

// Personal Avatar Data - for individual users
const PERSONAL_AVATARS = [
  {
    id: 'travel_planner_maya',
    name: 'Maya Explorer',
    avatarType: 'travel_planning',
    description: 'Your personal travel planning assistant for discovering amazing destinations and creating perfect itineraries.',
    appearance: {
      imageUrl: '/avatars/maya-explorer.svg',
      hairColor: 'Auburn with golden highlights',
      eyeColor: 'Adventurous hazel',
      style: 'Bohemian traveler'
    },
    voiceProfile: {
      tone: 'enthusiastic',
      pace: 'moderate',
      accent: 'World Traveler'
    },
    expertise: ['Trip planning', 'Destination research', 'Budget optimization', 'Cultural insights'],
    specializations: ['Adventure travel', 'Cultural exploration', 'Budget travel', 'Solo travel safety'],
    industries: ['Travel', 'Tourism', 'Adventure', 'Cultural Exchange'],
    communicationStyle: 'Enthusiastic and inspiring with extensive knowledge of global destinations. Provides practical advice while maintaining excitement for travel.',
    languages: ['English', 'Spanish', 'French', 'Italian', 'Portuguese'],
    pricing: {
      tier: 'basic',
      monthlyPrice: 29
    },
    personalityTraits: ['Adventurous', 'Cultural', 'Budget-conscious', 'Safety-focused'],
    isCustomizable: true,
    isActive: true,
    createdAt: '2025-01-23T00:00:00Z',
    updatedAt: '2025-01-23T00:00:00Z'
  },
  {
    id: 'wellness_coach_zen',
    name: 'Zen Wellness',
    avatarType: 'wellness_coaching',
    description: 'Holistic wellness coach focused on mind-body balance, stress management, and healthy lifestyle habits.',
    appearance: {
      imageUrl: '/avatars/zen-wellness.svg',
      hairColor: 'Soft silver',
      eyeColor: 'Peaceful blue',
      style: 'Natural wellness'
    },
    voiceProfile: {
      tone: 'calming',
      pace: 'slow',
      accent: 'Mindful'
    },
    expertise: ['Stress management', 'Mindfulness', 'Habit formation', 'Work-life balance'],
    specializations: ['Meditation guidance', 'Breathing exercises', 'Sleep optimization', 'Emotional wellness'],
    industries: ['Wellness', 'Mental Health', 'Mindfulness', 'Self-Care'],
    communicationStyle: 'Calm and supportive with focus on gentle guidance and sustainable lifestyle changes. Emphasizes self-compassion and gradual progress.',
    languages: ['English', 'Sanskrit', 'Mandarin', 'Japanese'],
    pricing: {
      tier: 'premium',
      monthlyPrice: 49
    },
    personalityTraits: ['Calm', 'Supportive', 'Mindful', 'Patient'],
    isCustomizable: true,
    isActive: true,
    createdAt: '2025-01-23T00:00:00Z',
    updatedAt: '2025-01-23T00:00:00Z'
  },
  {
    id: 'fitness_trainer_max',
    name: 'Max Power',
    avatarType: 'fitness_training',
    description: 'Personal fitness trainer specializing in strength training, cardio optimization, and athletic performance.',
    appearance: {
      imageUrl: '/avatars/max-power.svg',
      hairColor: 'Athletic black',
      eyeColor: 'Determined green',
      style: 'Athletic gear'
    },
    voiceProfile: {
      tone: 'motivational',
      pace: 'energetic',
      accent: 'Athlete'
    },
    expertise: ['Strength training', 'Cardio optimization', 'Form correction', 'Injury prevention'],
    specializations: ['Weight lifting', 'HIIT workouts', 'Athletic performance', 'Recovery planning'],
    industries: ['Fitness', 'Athletics', 'Health', 'Sports Performance'],
    communicationStyle: 'Motivational and energetic with focus on proper form and progressive improvement. Balances challenge with safety.',
    languages: ['English', 'Spanish', 'Portuguese', 'German'],
    pricing: {
      tier: 'premium',
      monthlyPrice: 39
    },
    personalityTraits: ['Motivational', 'Disciplined', 'Safety-focused', 'Results-driven'],
    isCustomizable: true,
    isActive: true,
    createdAt: '2025-01-23T00:00:00Z',
    updatedAt: '2025-01-23T00:00:00Z'
  },
  {
    id: 'nutritionist_sage',
    name: 'Dr. Sage Nutrition',
    avatarType: 'nutrition_coaching',
    description: 'Certified nutritionist providing personalized meal planning, dietary guidance, and nutrition education.',
    appearance: {
      imageUrl: '/avatars/dr-sage-nutrition.svg',
      hairColor: 'Natural brown',
      eyeColor: 'Wise amber',
      style: 'Professional health'
    },
    voiceProfile: {
      tone: 'knowledgeable',
      pace: 'thoughtful',
      accent: 'Health Professional'
    },
    expertise: ['Meal planning', 'Nutritional analysis', 'Dietary restrictions', 'Supplement guidance'],
    specializations: ['Weight management', 'Sports nutrition', 'Medical diets', 'Food allergies'],
    industries: ['Nutrition', 'Health', 'Wellness', 'Medical'],
    communicationStyle: 'Evidence-based and educational with focus on sustainable nutrition habits. Provides clear explanations and practical meal solutions.',
    languages: ['English', 'Spanish', 'French', 'Mandarin'],
    pricing: {
      tier: 'premium',
      monthlyPrice: 59
    },
    personalityTraits: ['Evidence-based', 'Educational', 'Practical', 'Health-focused'],
    isCustomizable: true,
    isActive: true,
    createdAt: '2025-01-23T00:00:00Z',
    updatedAt: '2025-01-23T00:00:00Z'
  },
  {
    id: 'counselor_harmony',
    name: 'Dr. Harmony Heart',
    avatarType: 'counseling_support',
    description: 'Licensed counselor providing emotional support, coping strategies, and mental wellness guidance.',
    appearance: {
      imageUrl: '/avatars/dr-harmony-heart.svg',
      hairColor: 'Warm chestnut',
      eyeColor: 'Compassionate brown',
      style: 'Professional caring'
    },
    voiceProfile: {
      tone: 'empathetic',
      pace: 'gentle',
      accent: 'Therapeutic'
    },
    expertise: ['Active listening', 'Coping strategies', 'Emotional regulation', 'Stress management'],
    specializations: ['Anxiety support', 'Depression help', 'Relationship guidance', 'Self-esteem building'],
    industries: ['Mental Health', 'Counseling', 'Therapy', 'Wellness'],
    communicationStyle: 'Empathetic and non-judgmental with focus on active listening and validation. Provides gentle guidance and practical coping strategies.',
    languages: ['English', 'Spanish', 'French', 'German'],
    pricing: {
      tier: 'premium',
      monthlyPrice: 69
    },
    personalityTraits: ['Empathetic', 'Non-judgmental', 'Supportive', 'Professional'],
    isCustomizable: true,
    isActive: true,
    createdAt: '2025-01-23T00:00:00Z',
    updatedAt: '2025-01-23T00:00:00Z'
  },
  {
    id: 'spiritual_guide_luna',
    name: 'Luna Mystic',
    avatarType: 'spiritual_guidance',
    description: 'Spiritual guide offering meditation, mindfulness practices, and personal growth insights.',
    appearance: {
      imageUrl: '/avatars/luna-mystic.svg',
      hairColor: 'Mystical purple',
      eyeColor: 'Ethereal violet',
      style: 'Spiritual bohemian'
    },
    voiceProfile: {
      tone: 'serene',
      pace: 'contemplative',
      accent: 'Spiritual'
    },
    expertise: ['Meditation guidance', 'Spiritual practices', 'Personal growth', 'Energy healing'],
    specializations: ['Chakra balancing', 'Crystal healing', 'Tarot guidance', 'Astrology insights'],
    industries: ['Spirituality', 'Personal Growth', 'Alternative Healing', 'Mindfulness'],
    communicationStyle: 'Serene and wise with deep understanding of spiritual practices. Provides gentle guidance for personal transformation and inner peace.',
    languages: ['English', 'Sanskrit', 'Hindi', 'Tibetan'],
    pricing: {
      tier: 'basic',
      monthlyPrice: 35
    },
    personalityTraits: ['Wise', 'Intuitive', 'Peaceful', 'Transformative'],
    isCustomizable: true,
    isActive: true,
    createdAt: '2025-01-23T00:00:00Z',
    updatedAt: '2025-01-23T00:00:00Z'
  }
];

// Get all personal avatars
router.get('/avatars', (req, res) => {
  try {
    res.json({
      success: true,
      avatars: PERSONAL_AVATARS
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get avatars by type
router.get('/type/:avatarType', (req, res) => {
  try {
    const { avatarType } = req.params;
    const filteredAvatars = PERSONAL_AVATARS.filter(avatar => 
      avatar.avatarType === avatarType
    );
    
    res.json({
      success: true,
      avatarType: avatarType,
      avatars: filteredAvatars,
      count: filteredAvatars.length
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get avatar by ID
router.get('/avatar/:id', (req, res) => {
  try {
    const { id } = req.params;
    const avatar = PERSONAL_AVATARS.find(a => a.id === id);
    
    if (!avatar) {
      return res.status(404).json({ 
        success: false, 
        error: 'Avatar not found' 
      });
    }
    
    res.json({
      success: true,
      avatar
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Customize personal avatar
router.post('/customize', (req, res) => {
  try {
    const { baseAvatarId, customizations, personalGoals, preferences } = req.body;
    
    const baseAvatar = PERSONAL_AVATARS.find(a => a.id === baseAvatarId);
    if (!baseAvatar) {
      return res.status(404).json({ 
        success: false, 
        error: 'Base avatar not found' 
      });
    }
    
    // Create customized avatar
    const customizedAvatar = {
      ...baseAvatar,
      id: `custom_${baseAvatarId}_${Date.now()}`,
      name: customizations.name || baseAvatar.name,
      description: customizations.description || baseAvatar.description,
      personalGoals: personalGoals || [],
      preferences: preferences || {},
      customizations: customizations,
      isCustomized: true,
      createdAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      message: 'Personal avatar customized successfully',
      avatar: customizedAvatar
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Deploy personal avatar
router.post('/deploy', (req, res) => {
  try {
    const { avatarId, personalSettings, deploymentConfig } = req.body;
    
    const avatar = PERSONAL_AVATARS.find(a => a.id === avatarId);
    if (!avatar) {
      return res.status(404).json({ 
        success: false, 
        error: 'Avatar not found' 
      });
    }
    
    // Simulate deployment
    const deployment = {
      deploymentId: `deploy_${avatarId}_${Date.now()}`,
      avatarId,
      status: 'deployed',
      personalSettings: personalSettings || {},
      deploymentConfig: deploymentConfig || {
        channels: ['mobile', 'web'],
        features: ['chat', 'reminders', 'progress_tracking'],
        privacy: 'personal'
      },
      deployedAt: new Date().toISOString(),
      endpoint: `https://personal-assistant.leadgen.to/${avatarId}`
    };
    
    res.json({
      success: true,
      message: 'Personal avatar deployed successfully',
      deployment
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get personal avatar customization options
router.get('/customization-options', (req, res) => {
  try {
    const options = {
      personalities: ['Supportive', 'Motivational', 'Gentle', 'Direct', 'Encouraging'],
      communicationStyles: ['Formal', 'Casual', 'Friendly', 'Professional', 'Warm'],
      reminderFrequencies: ['Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'Custom'],
      goalTypes: ['Health', 'Fitness', 'Mental Wellness', 'Personal Growth', 'Adventure'],
      privacyLevels: ['Personal', 'Friends', 'Family', 'Public'],
      languages: ['English', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese']
    };
    
    res.json({
      success: true,
      options
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;