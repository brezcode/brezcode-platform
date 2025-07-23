import { Router } from 'express';

const router = Router();

// Mock business avatars for different business types
const BUSINESS_AVATARS = [
  {
    id: 'sales_specialist_alex',
    name: 'Alex Thunder',
    businessType: 'sales_automation',
    description: 'Expert sales specialist focused on lead qualification and deal closing with consultative selling approach.',
    appearance: {
      imageUrl: '/avatars/alex-thunder.svg',
      hairColor: 'Electric blue',
      eyeColor: 'Amber',
    },
    voiceProfile: {
      tone: 'confident',
      pace: 'energetic',
      accent: 'American'
    },
    expertise: ['Lead qualification', 'Objection handling', 'Deal closing', 'Pipeline management'],
    specializations: ['B2B sales', 'SaaS products', 'Enterprise deals', 'Cold outreach']
  },
  {
    id: 'customer_service_miko',
    name: 'Miko Harmony',
    businessType: 'customer_service',
    description: 'Friendly customer service representative specializing in issue resolution and customer satisfaction.',
    appearance: {
      imageUrl: '/avatars/miko-harmony.svg',
      hairColor: 'Lavender',
      eyeColor: 'Soft blue',
    },
    voiceProfile: {
      tone: 'warm',
      pace: 'moderate',
      accent: 'Neutral'
    },
    expertise: ['Issue resolution', 'Customer empathy', 'Product knowledge', 'De-escalation'],
    specializations: ['Live chat support', 'Email support', 'Complaint handling', 'Product guidance']
  },
  {
    id: 'tech_support_kai',
    name: 'Kai TechWiz',
    businessType: 'technical_support',
    description: 'Technical support specialist with expertise in troubleshooting and complex problem resolution.',
    appearance: {
      imageUrl: '/avatars/kai-techwiz.svg',
      hairColor: 'Deep purple',
      eyeColor: 'Cyan',
    },
    voiceProfile: {
      tone: 'analytical',
      pace: 'measured',
      accent: 'Technical'
    },
    expertise: ['Technical troubleshooting', 'API integration', 'Bug diagnosis', 'User guidance'],
    specializations: ['Software support', 'API help', 'Integration issues', 'Developer tools']
  },
  {
    id: 'business_consultant_luna',
    name: 'Luna Strategic',
    businessType: 'business_consulting',
    description: 'Strategic business consultant providing insights on growth, optimization, and strategic planning.',
    appearance: {
      imageUrl: '/avatars/luna-strategic.svg',
      hairColor: 'Silver',
      eyeColor: 'Violet',
    },
    voiceProfile: {
      tone: 'professional',
      pace: 'thoughtful',
      accent: 'Executive'
    },
    expertise: ['Strategic planning', 'Business analysis', 'Growth strategies', 'Market insights'],
    specializations: ['Business growth', 'Process optimization', 'Strategic consulting', 'Market analysis']
  },
  {
    id: 'brezcode_health_coach',
    name: 'Dr. Sakura Wellness',
    businessType: 'health_coaching',
    description: 'Specialized AI health coach for women\'s wellness and breast health awareness with empathetic medical guidance.',
    appearance: {
      imageUrl: '/avatars/dr-sakura-wellness.svg',
      hairColor: 'Soft pink with blue highlights',
      eyeColor: 'Gentle green',
    },
    voiceProfile: {
      tone: 'warm',
      pace: 'moderate',
      accent: 'Neutral American'
    },
    expertise: ['Breast health education', 'Preventive care', 'Health risk assessment', 'Wellness coaching'],
    specializations: ['Women\'s health', 'Breast health', 'Preventive medicine', 'Health education']
  },
  {
    id: 'education_professor',
    name: 'Professor Sage',
    businessType: 'education',
    description: 'Education specialist focused on learning facilitation, curriculum development, and student support.',
    appearance: {
      imageUrl: '/avatars/professor-sage.svg',
      hairColor: 'Warm brown',
      eyeColor: 'Amber',
    },
    voiceProfile: {
      tone: 'encouraging',
      pace: 'steady',
      accent: 'Academic'
    },
    expertise: ['Curriculum design', 'Learning assessment', 'Student motivation', 'Educational technology'],
    specializations: ['Online learning', 'Adult education', 'Skill development', 'Training programs']
  }
];

// Get all business avatars
router.get('/avatars', (req, res) => {
  try {
    res.json({
      success: true,
      avatars: BUSINESS_AVATARS
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get avatars by business type
router.get('/business-type/:businessType', (req, res) => {
  try {
    const { businessType } = req.params;
    const filteredAvatars = BUSINESS_AVATARS.filter(avatar => 
      avatar.businessType === businessType
    );
    
    res.json({
      success: true,
      businessType: businessType,
      avatars: filteredAvatars,
      count: filteredAvatars.length
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific avatar by ID
router.get('/avatar/:avatarId', (req, res) => {
  try {
    const { avatarId } = req.params;
    const avatar = BUSINESS_AVATARS.find(a => a.id === avatarId);
    
    if (!avatar) {
      return res.status(404).json({ error: 'Avatar not found' });
    }
    
    res.json({
      success: true,
      avatar: avatar
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get avatars by industry/specialization
router.get('/industry/:industry', (req, res) => {
  try {
    const { industry } = req.params;
    const filteredAvatars = BUSINESS_AVATARS.filter(avatar => 
      avatar.specializations.some(spec => 
        spec.toLowerCase().includes(industry.toLowerCase())
      )
    );
    
    res.json({
      success: true,
      industry: industry,
      avatars: filteredAvatars,
      count: filteredAvatars.length
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;