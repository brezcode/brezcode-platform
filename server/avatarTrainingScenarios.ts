// Comprehensive AI Avatar Training Scenarios
// Based on industry research and best practices

export interface AvatarType {
  id: string;
  name: string;
  description: string;
  primarySkills: string[];
  industries: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  expectedOutcomes: string[];
}

export interface TrainingScenario {
  id: string;
  avatarType: string;
  name: string;
  description: string;
  customerPersona: string;
  customerMood: 'calm' | 'frustrated' | 'confused' | 'angry' | 'excited' | 'skeptical' | 'urgent';
  objectives: string[];
  timeframeMins: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  industry: string;
  successCriteria: string[];
  commonMistakes: string[];
  keyLearningPoints: string[];
}

// ===== AI AVATAR TYPES =====

export const AVATAR_TYPES: AvatarType[] = [
  {
    id: 'sales_specialist',
    name: 'Sales Specialist',
    description: 'Expert in consultative selling, lead qualification, objection handling, and closing deals',
    primarySkills: [
      'Consultative selling approach',
      'Lead qualification (BANT, MEDDIC)',
      'Objection handling',
      'Value proposition articulation',
      'Closing techniques',
      'Pipeline management',
      'CRM usage'
    ],
    industries: ['SaaS', 'Real Estate', 'Insurance', 'Technology', 'Healthcare', 'Financial Services'],
    difficulty: 'intermediate',
    expectedOutcomes: [
      'Increase conversion rates by 25-40%',
      'Reduce sales cycle length',
      'Improve lead qualification accuracy',
      'Master objection handling techniques'
    ]
  },
  {
    id: 'customer_service',
    name: 'Customer Service Representative',
    description: 'Focused on issue resolution, empathy, de-escalation, and customer satisfaction',
    primarySkills: [
      'Active listening',
      'Empathy and emotional intelligence',
      'De-escalation techniques',
      'Problem-solving methodology',
      'Product knowledge',
      'Policy communication',
      'Follow-up procedures'
    ],
    industries: ['E-commerce', 'SaaS', 'Telecommunications', 'Banking', 'Retail', 'Healthcare'],
    difficulty: 'beginner',
    expectedOutcomes: [
      'Reduce escalation rates by 30%',
      'Improve customer satisfaction scores',
      'Faster issue resolution times',
      'Enhanced brand loyalty'
    ]
  },
  {
    id: 'technical_support',
    name: 'Technical Support Specialist',
    description: 'Expert in troubleshooting, technical guidance, and complex problem resolution',
    primarySkills: [
      'Technical troubleshooting',
      'Step-by-step guidance',
      'Documentation skills',
      'Patience with non-technical users',
      'Escalation protocols',
      'Bug reporting',
      'Knowledge base management'
    ],
    industries: ['Software', 'Hardware', 'SaaS', 'Telecommunications', 'IT Services'],
    difficulty: 'advanced',
    expectedOutcomes: [
      'Reduce ticket resolution time by 40%',
      'Improve first-call resolution rates',
      'Enhance technical communication skills',
      'Better documentation practices'
    ]
  },
  {
    id: 'business_consultant',
    name: 'Business Consultant',
    description: 'Strategic advisor for business growth, process optimization, and decision-making support',
    primarySkills: [
      'Strategic thinking',
      'Business analysis',
      'Process optimization',
      'ROI calculation',
      'Industry expertise',
      'Change management',
      'Executive communication'
    ],
    industries: ['Consulting', 'Professional Services', 'Manufacturing', 'Healthcare', 'Finance'],
    difficulty: 'advanced',
    expectedOutcomes: [
      'Improve client engagement quality',
      'Enhance strategic recommendation skills',
      'Better business case development',
      'Increased client retention'
    ]
  },
  {
    id: 'health_coach',
    name: 'Health & Wellness Coach',
    description: 'Specialized in health guidance, behavior change, and wellness program support',
    primarySkills: [
      'Motivational interviewing',
      'Health education',
      'Behavior change techniques',
      'Empathetic communication',
      'Goal setting',
      'Progress tracking',
      'Medical sensitivity'
    ],
    industries: ['Healthcare', 'Wellness', 'Fitness', 'Nutrition', 'Mental Health'],
    difficulty: 'intermediate',
    expectedOutcomes: [
      'Improve patient engagement',
      'Better health outcome tracking',
      'Enhanced motivational skills',
      'Increased program adherence'
    ]
  },
  {
    id: 'education_specialist',
    name: 'Education Specialist',
    description: 'Expert in learning facilitation, knowledge transfer, and educational support',
    primarySkills: [
      'Learning theory application',
      'Curriculum development',
      'Student assessment',
      'Adaptive teaching methods',
      'Progress monitoring',
      'Educational technology',
      'Inclusive education practices'
    ],
    industries: ['Education', 'Training', 'E-learning', 'Corporate Training', 'Healthcare Education'],
    difficulty: 'intermediate',
    expectedOutcomes: [
      'Improve learning outcomes',
      'Enhanced teaching methodologies',
      'Better student engagement',
      'Personalized learning approaches'
    ]
  }
];

// ===== TRAINING SCENARIOS BY AVATAR TYPE =====

export const TRAINING_SCENARIOS: TrainingScenario[] = [
  // ===== SALES SPECIALIST SCENARIOS =====
  {
    id: 'sales_objection_price',
    avatarType: 'sales_specialist',
    name: 'Price Objection Handling',
    description: 'Prospect says your solution is too expensive compared to competitors',
    customerPersona: 'David Chen, 45, CFO at mid-size manufacturing company, budget-conscious, analytical decision maker',
    customerMood: 'skeptical',
    objectives: [
      'Understand the true budget constraints',
      'Demonstrate ROI and value proposition',
      'Compare total cost of ownership vs competitors',
      'Secure commitment to move forward'
    ],
    timeframeMins: 15,
    difficulty: 'intermediate',
    tags: ['objection_handling', 'pricing', 'roi', 'negotiation'],
    industry: 'SaaS',
    successCriteria: [
      'Acknowledged the price concern without defensiveness',
      'Asked discovery questions about budget and priorities',
      'Presented clear ROI calculation',
      'Gained agreement on next steps'
    ],
    commonMistakes: [
      'Immediately offering a discount',
      'Arguing about competitor comparisons',
      'Not quantifying the value proposition',
      'Getting defensive about pricing'
    ],
    keyLearningPoints: [
      'Price objections are often value questions in disguise',
      'Always understand the budget process before responding',
      'Focus on business outcomes, not features',
      'Use social proof and case studies'
    ]
  },
  {
    id: 'sales_discovery_call',
    avatarType: 'sales_specialist',
    name: 'Initial Discovery Call',
    description: 'First call with a qualified lead to understand their needs and challenges',
    customerPersona: 'Sarah Martinez, 38, VP of Operations, growing logistics company, overwhelmed with manual processes',
    customerMood: 'confused',
    objectives: [
      'Understand current challenges and pain points',
      'Identify decision-making process and stakeholders',
      'Establish budget and timeline',
      'Build rapport and trust'
    ],
    timeframeMins: 20,
    difficulty: 'beginner',
    tags: ['discovery', 'qualification', 'needs_analysis', 'rapport_building'],
    industry: 'SaaS',
    successCriteria: [
      'Asked open-ended discovery questions',
      'Identified 3+ specific pain points',
      'Understood decision criteria and process',
      'Scheduled appropriate follow-up'
    ],
    commonMistakes: [
      'Talking too much about features',
      'Not asking follow-up questions',
      'Failing to identify all stakeholders',
      'Rushing to present solutions'
    ],
    keyLearningPoints: [
      'Listen more than you speak',
      'Pain points drive purchase decisions',
      'Map the complete buyer journey',
      'Always confirm next steps'
    ]
  },

  // ===== CUSTOMER SERVICE SCENARIOS =====
  {
    id: 'cs_angry_customer',
    avatarType: 'customer_service',
    name: 'Angry Customer De-escalation',
    description: 'Customer has been waiting 45 minutes on hold and is extremely frustrated about a service outage',
    customerPersona: 'Michael Rodriguez, 52, small business owner, depends on your service for daily operations, losing money',
    customerMood: 'angry',
    objectives: [
      'Acknowledge the customer\'s frustration genuinely',
      'Provide clear information about the outage',
      'Offer appropriate compensation or resolution',
      'Restore confidence in the service'
    ],
    timeframeMins: 10,
    difficulty: 'intermediate',
    tags: ['de-escalation', 'empathy', 'service_recovery', 'communication'],
    industry: 'SaaS',
    successCriteria: [
      'Acknowledged frustration without being defensive',
      'Provided clear timeline for resolution',
      'Offered meaningful compensation',
      'Customer tone improved by end of call'
    ],
    commonMistakes: [
      'Making excuses for the company',
      'Not acknowledging the business impact',
      'Offering generic apologies',
      'Rushing to end the conversation'
    ],
    keyLearningPoints: [
      'Validate emotions before addressing issues',
      'Take ownership even if not personally responsible',
      'Focus on solutions, not problems',
      'Follow up proactively'
    ]
  },
  {
    id: 'cs_billing_dispute',
    avatarType: 'customer_service',
    name: 'Billing Dispute Resolution',
    description: 'Customer questions unexpected charges on their account and wants immediate refund',
    customerPersona: 'Jennifer Kim, 29, startup founder, cash flow sensitive, detail-oriented about expenses',
    customerMood: 'frustrated',
    objectives: [
      'Research and understand the billing issue',
      'Explain charges clearly and transparently',
      'Determine appropriate resolution',
      'Prevent future billing confusion'
    ],
    timeframeMins: 15,
    difficulty: 'beginner',
    tags: ['billing', 'resolution', 'explanation', 'policy'],
    industry: 'SaaS',
    successCriteria: [
      'Thoroughly investigated the charges',
      'Provided clear explanation of billing',
      'Offered fair resolution',
      'Set up safeguards for future'
    ],
    commonMistakes: [
      'Not researching before explaining',
      'Using too much technical jargon',
      'Being inflexible with policy',
      'Not preventing future issues'
    ],
    keyLearningPoints: [
      'Transparency builds trust',
      'Always research before responding',
      'Policy flexibility when appropriate',
      'Prevention is better than reaction'
    ]
  },

  // ===== TECHNICAL SUPPORT SCENARIOS =====
  {
    id: 'tech_complex_integration',
    avatarType: 'technical_support',
    name: 'Complex API Integration Issue',
    description: 'Developer is having trouble integrating your API with their system, getting authentication errors',
    customerPersona: 'Alex Thompson, 31, senior developer, experienced but unfamiliar with your API, under project deadline pressure',
    customerMood: 'frustrated',
    objectives: [
      'Diagnose the authentication issue accurately',
      'Provide step-by-step resolution guidance',
      'Ensure successful integration',
      'Document the solution for future reference'
    ],
    timeframeMins: 25,
    difficulty: 'advanced',
    tags: ['api', 'authentication', 'integration', 'debugging'],
    industry: 'SaaS',
    successCriteria: [
      'Accurately diagnosed the root cause',
      'Provided clear technical guidance',
      'Verified successful implementation',
      'Created documentation for future use'
    ],
    commonMistakes: [
      'Assuming customer\'s technical level',
      'Not verifying each step',
      'Providing generic solutions',
      'Not following up on resolution'
    ],
    keyLearningPoints: [
      'Verify understanding at each step',
      'Use screen sharing when possible',
      'Document common issues',
      'Build relationships with developer community'
    ]
  },

  // ===== BUSINESS CONSULTANT SCENARIOS =====
  {
    id: 'consultant_growth_strategy',
    avatarType: 'business_consultant',
    name: 'Growth Strategy Development',
    description: 'CEO wants to scale their business but unsure about market expansion vs product development',
    customerPersona: 'Patricia Williams, 47, CEO of successful regional business, growth-focused but risk-aware',
    customerMood: 'excited',
    objectives: [
      'Analyze current business situation',
      'Evaluate growth options and risks',
      'Develop actionable strategic recommendations',
      'Create implementation roadmap'
    ],
    timeframeMins: 30,
    difficulty: 'advanced',
    tags: ['strategy', 'growth', 'analysis', 'planning'],
    industry: 'Consulting',
    successCriteria: [
      'Conducted thorough situation analysis',
      'Presented data-driven recommendations',
      'Addressed risk concerns',
      'Created actionable next steps'
    ],
    commonMistakes: [
      'Providing generic advice',
      'Not considering company culture',
      'Ignoring resource constraints',
      'Lack of specific milestones'
    ],
    keyLearningPoints: [
      'Every business situation is unique',
      'Data should drive recommendations',
      'Implementation is as important as strategy',
      'Regular review and adjustment needed'
    ]
  },

  // ===== HEALTH COACH SCENARIOS =====
  {
    id: 'health_breast_screening',
    avatarType: 'health_coach',
    name: 'Breast Health Screening Anxiety',
    description: 'Patient is anxious about upcoming mammogram and asks about what to expect and pain management',
    customerPersona: 'Maria Santos, 42, mother of two, first mammogram, anxious about process and potential findings',
    customerMood: 'anxious',
    objectives: [
      'Provide accurate information about mammogram process',
      'Address anxiety with empathy and reassurance',
      'Offer practical preparation tips',
      'Encourage regular screening compliance'
    ],
    timeframeMins: 15,
    difficulty: 'intermediate',
    tags: ['breast_health', 'screening', 'anxiety', 'education'],
    industry: 'Healthcare',
    successCriteria: [
      'Provided accurate medical information',
      'Demonstrated empathy for patient concerns',
      'Offered practical preparation advice',
      'Patient expressed reduced anxiety'
    ],
    commonMistakes: [
      'Minimizing legitimate concerns',
      'Providing medical advice beyond scope',
      'Not addressing emotional aspects',
      'Using too much medical terminology'
    ],
    keyLearningPoints: [
      'Validation reduces anxiety',
      'Education empowers patients',
      'Stay within professional scope',
      'Emotional support is crucial'
    ]
  },

  // ===== EDUCATION SPECIALIST SCENARIOS =====
  {
    id: 'edu_struggling_learner',
    avatarType: 'education_specialist',
    name: 'Supporting Struggling Adult Learner',
    description: 'Adult learner is having difficulty with online course material and considering dropping out',
    customerPersona: 'Robert Johnson, 35, career changer, returning to education after 10 years, feeling overwhelmed',
    customerMood: 'discouraged',
    objectives: [
      'Identify specific learning challenges',
      'Provide personalized learning strategies',
      'Rebuild confidence and motivation',
      'Create sustainable study plan'
    ],
    timeframeMins: 20,
    difficulty: 'intermediate',
    tags: ['adult_learning', 'motivation', 'study_skills', 'support'],
    industry: 'Education',
    successCriteria: [
      'Identified root causes of difficulty',
      'Provided tailored learning strategies',
      'Restored learner confidence',
      'Established ongoing support plan'
    ],
    commonMistakes: [
      'One-size-fits-all solutions',
      'Not addressing emotional barriers',
      'Overloading with information',
      'Lack of follow-up support'
    ],
    keyLearningPoints: [
      'Adult learners have unique needs',
      'Confidence affects learning ability',
      'Personalization improves outcomes',
      'Ongoing support prevents dropout'
    ]
  }
];

// ===== SCENARIO SELECTION HELPERS =====

export function getScenariosByAvatarType(avatarType: string): TrainingScenario[] {
  return TRAINING_SCENARIOS.filter(scenario => scenario.avatarType === avatarType);
}

export function getScenariosByDifficulty(difficulty: string): TrainingScenario[] {
  return TRAINING_SCENARIOS.filter(scenario => scenario.difficulty === difficulty);
}

export function getScenariosByIndustry(industry: string): TrainingScenario[] {
  return TRAINING_SCENARIOS.filter(scenario => scenario.industry === industry);
}

export function getAvatarTypeById(id: string): AvatarType | undefined {
  return AVATAR_TYPES.find(avatar => avatar.id === id);
}

// ===== PROGRESSIVE TRAINING PATHS =====

export const TRAINING_PATHS = {
  sales_specialist: [
    'sales_discovery_call',
    'sales_objection_price',
    // Add more advanced scenarios
  ],
  customer_service: [
    'cs_billing_dispute',
    'cs_angry_customer',
    // Add more advanced scenarios
  ],
  technical_support: [
    'tech_complex_integration',
    // Add more scenarios
  ],
  business_consultant: [
    'consultant_growth_strategy',
    // Add more scenarios
  ],
  health_coach: [
    'health_breast_screening',
    // Add more scenarios
  ],
  education_specialist: [
    'edu_struggling_learner',
    // Add more scenarios
  ]
};