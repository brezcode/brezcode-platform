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
  customerMood: 'calm' | 'frustrated' | 'confused' | 'angry' | 'excited' | 'skeptical' | 'urgent' | 'anxious' | 'discouraged';
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

  // ===== DR. SAKURA BREAST HEALTH COACHING SCENARIOS =====
  {
    id: 'breast_screening_anxiety',
    avatarType: 'health_coach',
    name: 'First Mammogram Anxiety',
    description: 'Patient is terrified about her first mammogram and considering cancelling due to fear and anxiety',
    customerPersona: 'Sarah Chen, 40, marketing manager, no family history, heard painful stories from friends, very anxious about the unknown',
    customerMood: 'anxious',
    objectives: [
      'Validate anxiety while providing reassurance',
      'Explain mammogram process in simple terms',
      'Address pain and discomfort concerns',
      'Emphasize importance of early detection'
    ],
    timeframeMins: 15,
    difficulty: 'beginner',
    tags: ['mammogram', 'anxiety', 'first_screening', 'fear'],
    industry: 'Healthcare',
    successCriteria: [
      'Patient feels heard and understood',
      'Provided clear explanation of procedure',
      'Offered practical comfort tips',
      'Patient commits to keeping appointment'
    ],
    commonMistakes: [
      'Dismissing fears as irrational',
      'Using medical jargon',
      'Not acknowledging discomfort reality',
      'Rushing through explanation'
    ],
    keyLearningPoints: [
      'Acknowledge fear before education',
      'Use empathetic, gentle language',
      'Provide practical coping strategies',
      'Focus on empowerment through knowledge'
    ]
  },
  {
    id: 'family_history_concern',
    avatarType: 'health_coach', 
    name: 'Family History Breast Cancer Worry',
    description: 'Patient just learned her sister was diagnosed with breast cancer and is panicked about her own risk',
    customerPersona: 'Lisa Thompson, 35, teacher, sister recently diagnosed, feeling overwhelmed and scared about genetic risk',
    customerMood: 'urgent',
    objectives: [
      'Provide emotional support during crisis',
      'Explain family history risk factors clearly',
      'Discuss genetic testing options',
      'Create action plan for screening'
    ],
    timeframeMins: 20,
    difficulty: 'intermediate',
    tags: ['family_history', 'genetics', 'risk_assessment', 'crisis_support'],
    industry: 'Healthcare',
    successCriteria: [
      'Emotional state stabilized',
      'Risk factors explained accurately',
      'Clear next steps provided',
      'Patient feels empowered not helpless'
    ],
    commonMistakes: [
      'Providing false reassurance',
      'Overwhelming with statistics',
      'Not addressing emotional impact',
      'Delaying necessary referrals'
    ],
    keyLearningPoints: [
      'Balance hope with realistic information',
      'Family history increases but doesn\'t guarantee risk',
      'Early detection saves lives',
      'Support system is crucial'
    ]
  },
  {
    id: 'self_exam_guidance',
    avatarType: 'health_coach',
    name: 'Breast Self-Examination Teaching',
    description: 'Patient wants to learn proper self-examination technique but feels embarrassed and unsure',
    customerPersona: 'Amanda Rodriguez, 28, nurse, wants to be proactive but lacks confidence in technique, feels awkward about self-touch',
    customerMood: 'confused',
    objectives: [
      'Create comfortable learning environment',
      'Teach proper self-examination technique',
      'Address embarrassment and discomfort',
      'Establish regular self-exam routine'
    ],
    timeframeMins: 25,
    difficulty: 'beginner',
    tags: ['self_examination', 'technique', 'education', 'routine'],
    industry: 'Healthcare',
    successCriteria: [
      'Patient comfortable with discussion',
      'Demonstrated proper technique',
      'Addressed normal variations',
      'Committed to monthly routine'
    ],
    commonMistakes: [
      'Not addressing embarrassment',
      'Teaching too quickly',
      'Not explaining normal changes',
      'Skipping follow-up planning'
    ],
    keyLearningPoints: [
      'Normalize body awareness',
      'Technique matters for effectiveness',
      'Know your normal to detect changes',
      'Monthly routine after menstruation'
    ]
  },
  {
    id: 'lump_discovery_panic',
    avatarType: 'health_coach',
    name: 'Found a Lump - Crisis Management',
    description: 'Patient found a lump during self-exam and is in complete panic, needs immediate guidance and support',
    customerPersona: 'Jennifer Walsh, 45, mother of two, found lump yesterday, couldn\'t sleep, assuming the worst, needs urgent support',
    customerMood: 'urgent',
    objectives: [
      'Provide immediate emotional support',
      'Guide through next steps calmly',
      'Explain that most lumps are benign',
      'Facilitate prompt medical evaluation'
    ],
    timeframeMins: 20,
    difficulty: 'advanced',
    tags: ['lump_discovery', 'crisis', 'urgent_care', 'emotional_support'],
    industry: 'Healthcare',
    successCriteria: [
      'Panic level reduced significantly',
      'Clear action plan established',
      'Appointment scheduled promptly',
      'Support system activated'
    ],
    commonMistakes: [
      'False reassurance without examination',
      'Not validating extreme fear',
      'Delaying medical referral',
      'Providing diagnostic opinions'
    ],
    keyLearningPoints: [
      'Most breast lumps are not cancer',
      'Immediate evaluation is important',
      'Support system crucial during waiting',
      'Stay within scope of practice'
    ]
  },
  {
    id: 'menopause_breast_changes',
    avatarType: 'health_coach',
    name: 'Menopause and Breast Health Changes',
    description: 'Patient experiencing breast changes during menopause and worried about increased cancer risk',
    customerPersona: 'Patricia Kim, 52, executive, going through menopause, noticing breast density changes, concerned about hormone therapy effects',
    customerMood: 'skeptical',
    objectives: [
      'Explain normal menopausal breast changes',
      'Discuss hormone therapy implications',
      'Address screening modifications needed',
      'Provide lifestyle recommendations'
    ],
    timeframeMins: 18,
    difficulty: 'intermediate',
    tags: ['menopause', 'hormones', 'breast_density', 'lifestyle'],
    industry: 'Healthcare',
    successCriteria: [
      'Normal changes explained clearly',
      'Hormone risks/benefits discussed',
      'Screening plan updated',
      'Lifestyle modifications planned'
    ],
    commonMistakes: [
      'Not explaining hormone complexity',
      'Dismissing valid concerns',
      'Generic lifestyle advice',
      'Not coordinating with physician'
    ],
    keyLearningPoints: [
      'Menopause affects breast tissue',
      'Personalized risk assessment needed',
      'Collaborative care approach',
      'Lifestyle factors matter at any age'
    ]
  },
  {
    id: 'young_adult_education',
    avatarType: 'health_coach',
    name: 'Young Adult Breast Health Education',
    description: 'College student wants to learn about breast health but feels it\'s not relevant at her age',
    customerPersona: 'Emma Johnson, 20, college student, thinks breast cancer only affects older women, wants basic education',
    customerMood: 'calm',
    objectives: [
      'Provide age-appropriate education',
      'Establish healthy habits early',
      'Address young adult risk factors',
      'Create foundation for lifelong awareness'
    ],
    timeframeMins: 15,
    difficulty: 'beginner',
    tags: ['young_adult', 'prevention', 'education', 'habits'],
    industry: 'Healthcare',
    successCriteria: [
      'Age-appropriate information provided',
      'Early habits encouraged',
      'Risk factors understood',
      'Foundation for future awareness'
    ],
    commonMistakes: [
      'Too much focus on cancer risk',
      'Not making it relevant to age',
      'Overwhelming with information',
      'Not encouraging questions'
    ],
    keyLearningPoints: [
      'Early education builds lifelong habits',
      'Young women can develop breast awareness',
      'Risk factors exist at all ages',
      'Prevention starts early'
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
  },

  // ===== HEALTH COACH SCENARIOS (DR. SAKURA) =====
  {
    id: 'breast_screening_anxiety',
    avatarType: 'health_coach',
    name: 'Patient with Mammogram Screening Anxiety',
    description: 'Patient expressing fear and anxiety about upcoming mammogram screening appointment',
    customerPersona: 'Maria Santos, 42, working mother, first mammogram, anxious about pain and potential findings',
    customerMood: 'anxious',
    objectives: [
      'Acknowledge and validate screening anxiety',
      'Provide factual information about mammogram process',
      'Offer coping strategies for anxiety management',
      'Encourage keeping the screening appointment'
    ],
    timeframeMins: 15,
    difficulty: 'beginner',
    tags: ['screening', 'anxiety', 'mammogram', 'education'],
    industry: 'Healthcare',
    successCriteria: [
      'Demonstrated empathy for patient anxiety',
      'Provided clear, accurate information about mammogram process',
      'Offered practical anxiety management techniques',
      'Reinforced importance of screening without pressure'
    ],
    commonMistakes: [
      'Dismissing anxiety as "no big deal"',
      'Providing too much medical detail',
      'Not offering concrete coping strategies',
      'Being pushy about appointment scheduling'
    ],
    keyLearningPoints: [
      'Screening anxiety is normal and valid',
      'Information reduces fear and uncertainty',
      'Practical coping strategies empower patients',
      'Supportive encouragement improves compliance'
    ]
  },
  {
    id: 'family_history_concern',
    avatarType: 'health_coach',
    name: 'Patient Worried About Family History',
    description: 'Patient concerned about breast cancer risk due to family history',
    customerPersona: 'Sarah Johnson, 35, recently learned her sister was diagnosed with breast cancer, worried about her own risk',
    customerMood: 'anxious',
    objectives: [
      'Assess family history details and patterns',
      'Explain genetic vs. environmental risk factors',
      'Recommend appropriate screening timeline',
      'Provide actionable prevention strategies'
    ],
    timeframeMins: 20,
    difficulty: 'intermediate',
    tags: ['family_history', 'genetic_risk', 'prevention', 'screening'],
    industry: 'Healthcare',
    successCriteria: [
      'Gathered comprehensive family history information',
      'Explained risk factors in understandable terms',
      'Provided personalized screening recommendations',
      'Offered evidence-based prevention strategies'
    ],
    commonMistakes: [
      'Making assumptions about genetic risk',
      'Providing overly technical explanations',
      'Not recommending genetic counseling when appropriate',
      'Causing unnecessary alarm'
    ],
    keyLearningPoints: [
      'Family history requires detailed assessment',
      'Genetic counseling may be beneficial',
      'Many risk factors are modifiable',
      'Early detection strategies are key'
    ]
  },
  {
    id: 'self_exam_guidance',
    avatarType: 'health_coach',
    name: 'Teaching Breast Self-Examination',
    description: 'Patient requesting guidance on how to perform proper breast self-examination',
    customerPersona: 'Emily Chen, 28, health-conscious young professional, wants to establish good health habits',
    customerMood: 'excited',
    objectives: [
      'Explain the purpose and limitations of self-exams',
      'Provide step-by-step examination instructions',
      'Discuss timing and frequency recommendations',
      'Address what to do if changes are found'
    ],
    timeframeMins: 18,
    difficulty: 'beginner',
    tags: ['self_examination', 'education', 'prevention', 'technique'],
    industry: 'Healthcare',
    successCriteria: [
      'Clearly explained self-exam technique',
      'Discussed appropriate timing and frequency',
      'Addressed normal vs. concerning findings',
      'Provided follow-up guidance for discoveries'
    ],
    commonMistakes: [
      'Overemphasizing self-exam effectiveness',
      'Not explaining normal breast tissue variations',
      'Providing vague examination instructions',
      'Not addressing what to do with findings'
    ],
    keyLearningPoints: [
      'Self-exams supplement but don\'t replace professional screening',
      'Normal breast tissue varies significantly',
      'Consistency in technique and timing matters',
      'Early reporting of changes improves outcomes'
    ]
  },
  {
    id: 'lump_discovery_panic',
    avatarType: 'health_coach',
    name: 'Patient Found Lump During Self-Exam',
    description: 'Patient panicking after discovering a lump during breast self-examination',
    customerPersona: 'Jennifer Williams, 45, found small lump, extremely anxious, jumping to worst-case scenarios',
    customerMood: 'urgent',
    objectives: [
      'Provide immediate emotional support and reassurance',
      'Explain that most lumps are benign',
      'Guide through next steps for medical evaluation',
      'Help manage anxiety while emphasizing importance of follow-up'
    ],
    timeframeMins: 12,
    difficulty: 'advanced',
    tags: ['lump_discovery', 'anxiety_management', 'urgent_care', 'emotional_support'],
    industry: 'Healthcare',
    successCriteria: [
      'Provided immediate emotional support',
      'Shared reassuring statistics about benign lumps',
      'Gave clear guidance on seeking medical evaluation',
      'Helped patient manage immediate anxiety'
    ],
    commonMistakes: [
      'Providing false reassurance without evaluation',
      'Not acknowledging the emotional impact',
      'Giving medical advice beyond scope',
      'Not emphasizing urgency of professional evaluation'
    ],
    keyLearningPoints: [
      'Most breast lumps are benign (80%+)',
      'Immediate professional evaluation is essential',
      'Emotional support reduces patient anxiety',
      'Avoid diagnostic speculation'
    ]
  },
  {
    id: 'menopause_breast_changes',
    avatarType: 'health_coach',
    name: 'Menopause-Related Breast Changes',
    description: 'Patient experiencing breast changes during menopause and seeking guidance',
    customerPersona: 'Linda Davis, 52, perimenopausal, noticing breast tenderness and density changes, confused about normal vs. concerning',
    customerMood: 'confused',
    objectives: [
      'Explain normal menopausal breast changes',
      'Discuss hormone-related symptoms',
      'Address screening considerations during menopause',
      'Provide lifestyle management strategies'
    ],
    timeframeMins: 16,
    difficulty: 'intermediate',
    tags: ['menopause', 'hormonal_changes', 'screening', 'lifestyle'],
    industry: 'Healthcare',
    successCriteria: [
      'Explained normal menopausal breast changes',
      'Distinguished normal from concerning symptoms',
      'Discussed screening modifications for menopause',
      'Provided hormone and lifestyle management tips'
    ],
    commonMistakes: [
      'Dismissing all changes as "normal menopause"',
      'Not addressing individual risk factors',
      'Overlooking need for continued screening',
      'Not providing practical management strategies'
    ],
    keyLearningPoints: [
      'Menopause affects breast tissue significantly',
      'Screening guidelines may change post-menopause',
      'Hormone changes require ongoing monitoring',
      'Lifestyle modifications can help manage symptoms'
    ]
  },
  {
    id: 'young_adult_education',
    avatarType: 'health_coach',
    name: 'Young Adult Breast Health Education',
    description: 'Young adult seeking education about breast health and when to start screenings',
    customerPersona: 'Ashley Rodriguez, 23, college student, wants to establish healthy habits, mother had breast cancer at 40',
    customerMood: 'excited',
    objectives: [
      'Provide age-appropriate breast health education',
      'Discuss when to begin screening based on family history',
      'Explain lifestyle factors that support breast health',
      'Establish foundation for lifelong health awareness'
    ],
    timeframeMins: 14,
    difficulty: 'beginner',
    tags: ['young_adult', 'education', 'prevention', 'lifestyle'],
    industry: 'Healthcare',
    successCriteria: [
      'Provided age-appropriate health education',
      'Discussed personalized screening timeline',
      'Explained lifestyle factors for breast health',
      'Encouraged ongoing health awareness'
    ],
    commonMistakes: [
      'Providing overly advanced medical information',
      'Not considering family history implications',
      'Focusing too much on rare young adult risks',
      'Not emphasizing preventive lifestyle factors'
    ],
    keyLearningPoints: [
      'Early education builds lifelong healthy habits',
      'Family history may advance screening timelines',
      'Lifestyle factors significantly impact risk',
      'Age-appropriate information prevents anxiety'
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
    'breast_screening_anxiety',
    'family_history_concern',
    'self_exam_guidance',
    'lump_discovery_panic',
    'menopause_breast_changes',
    'young_adult_education'
  ],
  education_specialist: [
    'edu_struggling_learner',
    // Add more scenarios
  ]
};