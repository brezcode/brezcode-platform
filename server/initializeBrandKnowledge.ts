import { brandAiService } from './services/brandAiService';

export async function initializeBrandKnowledge() {
  try {
    console.log('🧠 Initializing brand knowledge bases...');
    
    // Initialize BrezCode brand AI with breast health expertise
    await initializeBrezCodeKnowledge();
    
    console.log('✅ Brand knowledge bases initialized successfully');
  } catch (error) {
    console.error('❌ Brand knowledge initialization failed:', error);
  }
}

async function initializeBrezCodeKnowledge() {
  const brandId = 'brezcode';
  
  // Initialize AI configuration for BrezCode
  await brandAiService.initializeBrandAi(
    brandId, 
    'breast_health',
    'supportive, empathetic, evidence-based, encouraging'
  );
  
  // Add foundational knowledge entries
  const knowledgeEntries = [
    {
      title: 'Breast Self-Examination Steps',
      content: `Breast self-examination is an important part of breast health awareness. Here's how to perform it properly:

1. **Visual Inspection**: Stand in front of a mirror with your arms at your sides. Look for any changes in size, shape, skin texture, or color.

2. **Raise Your Arms**: Lift your arms overhead and look for the same changes.

3. **Check for Discharge**: Gently squeeze each nipple to check for any discharge.

4. **Lying Down Examination**: Lie down and use your right hand to examine your left breast, and vice versa. Use the pads of your fingers to feel for lumps or changes.

5. **Circular Motion**: Move in small circles from the outside of the breast toward the nipple, covering the entire breast and armpit area.

**When to Perform**: The best time is 3-5 days after your period ends, when breasts are least tender. If you no longer menstruate, choose the same day each month.

**Important**: Self-examination supplements but does not replace regular clinical examinations and mammograms.`,
      category: 'procedures',
      tags: ['self-examination', 'breast-health', 'prevention', 'early-detection']
    },
    {
      title: 'Breast Health Nutrition Guidelines',
      content: `Nutrition plays a significant role in breast health. Here are evidence-based dietary recommendations:

**Foods to Include:**
- **Cruciferous vegetables**: Broccoli, cauliflower, Brussels sprouts contain compounds that may help reduce cancer risk
- **Berries**: Rich in antioxidants that protect cells from damage
- **Fatty fish**: Salmon, mackerel, sardines provide omega-3 fatty acids
- **Green tea**: Contains polyphenols with protective properties
- **Whole grains**: Provide fiber and help maintain healthy weight
- **Legumes**: Beans, lentils are good sources of protein and fiber

**Foods to Limit:**
- **Processed meats**: May increase cancer risk
- **Excessive alcohol**: Linked to increased breast cancer risk
- **High-fat dairy**: Choose low-fat options
- **Refined sugars**: Can contribute to inflammation

**Key Nutrients:**
- **Vitamin D**: Important for immune function
- **Folate**: Found in leafy greens, helps with DNA repair
- **Antioxidants**: Vitamins C and E protect against cellular damage

Remember: A balanced diet combined with regular exercise is the foundation of breast health.`,
      category: 'health_guidance',
      tags: ['nutrition', 'diet', 'prevention', 'antioxidants', 'healthy-eating']
    },
    {
      title: 'Exercise and Breast Health',
      content: `Regular physical activity is one of the most effective ways to reduce breast cancer risk and maintain overall breast health.

**Benefits of Exercise:**
- Reduces breast cancer risk by 10-20%
- Helps maintain healthy weight
- Improves immune function
- Reduces inflammation
- Balances hormones

**Recommended Activities:**
- **Aerobic Exercise**: 150 minutes of moderate-intensity or 75 minutes of vigorous activity per week
- **Strength Training**: 2-3 sessions per week targeting major muscle groups
- **Low-Impact Options**: Walking, swimming, cycling, yoga
- **High-Impact Options**: Running, dancing, HIIT workouts

**Getting Started:**
- Start slowly if you're new to exercise
- Choose activities you enjoy
- Set realistic goals
- Track your progress
- Consider working with a fitness professional

**Special Considerations:**
- If you're undergoing treatment, consult your healthcare team
- Listen to your body and rest when needed
- Stay hydrated and wear proper support
- Gradually increase intensity over time

Remember: Any amount of physical activity is better than none. Start where you are and build gradually.`,
      category: 'health_guidance',
      tags: ['exercise', 'fitness', 'prevention', 'physical-activity', 'wellness']
    },
    {
      title: 'Stress Management for Breast Health',
      content: `Chronic stress can negatively impact immune function and overall health. Here are effective stress management techniques:

**Understanding Stress Impact:**
- Chronic stress may weaken immune system
- Can affect sleep and eating patterns
- May contribute to inflammation
- Important to develop healthy coping strategies

**Stress Reduction Techniques:**

**1. Mindfulness and Meditation:**
- Daily 10-15 minute practice
- Focus on breathing
- Use guided meditation apps
- Practice body scan relaxation

**2. Physical Activities:**
- Regular exercise releases stress-reducing hormones
- Yoga combines movement with mindfulness
- Dancing can be both fun and stress-relieving
- Nature walks provide additional benefits

**3. Social Support:**
- Connect with friends and family
- Join support groups
- Share your feelings
- Don't isolate yourself

**4. Healthy Boundaries:**
- Learn to say no when necessary
- Prioritize self-care
- Limit exposure to stressful situations when possible
- Create a balanced schedule

**5. Professional Help:**
- Consider counseling if stress feels overwhelming
- Therapy can provide coping strategies
- Support groups offer shared experiences

Remember: Managing stress is an ongoing process. Find what works best for you and practice regularly.`,
      category: 'health_guidance',
      tags: ['stress-management', 'mental-health', 'mindfulness', 'relaxation', 'wellness']
    },
    {
      title: 'Mammogram and Screening Guidelines',
      content: `Regular screening is crucial for early detection of breast cancer. Here are current evidence-based guidelines:

**Age-Based Screening Recommendations:**

**Ages 20-39:**
- Monthly breast self-examinations
- Clinical breast exam every 3 years
- Discuss family history with healthcare provider
- Consider genetic counseling if high-risk family history

**Ages 40-49:**
- Annual mammograms (discuss with doctor)
- Annual clinical breast exams
- Continue monthly self-examinations
- Consider supplemental screening if dense breasts

**Ages 50-74:**
- Annual mammograms
- Annual clinical breast exams
- Continue monthly self-examinations
- Follow up on any unusual findings promptly

**Ages 75+:**
- Discuss screening with healthcare provider
- Consider overall health and life expectancy
- Continue self-examinations

**High-Risk Individuals:**
- Earlier and more frequent screening
- May include MRI in addition to mammography
- Genetic testing consideration
- Enhanced surveillance protocols

**Preparing for Mammogram:**
- Schedule for week after period
- Avoid deodorant, powder, or lotion
- Wear two-piece outfit
- Bring previous mammogram films
- List any breast concerns or changes

**Important**: These are general guidelines. Always consult with your healthcare provider for personalized recommendations based on your individual risk factors.`,
      category: 'medical_info',
      tags: ['mammogram', 'screening', 'early-detection', 'guidelines', 'prevention']
    },
    {
      title: 'Common Breast Health Concerns FAQ',
      content: `Here are answers to frequently asked questions about breast health:

**Q: What should I do if I find a lump?**
A: Don't panic. Most breast lumps are benign. Schedule an appointment with your healthcare provider promptly for evaluation. Continue with regular activities while awaiting your appointment.

**Q: Is breast pain a sign of cancer?**
A: Breast pain is rarely a symptom of cancer. It's often related to hormonal changes, caffeine intake, or muscle strain. However, any persistent pain should be evaluated by a healthcare provider.

**Q: How do I know if my breasts are dense?**
A: Breast density can only be determined through mammography. Your radiologist will include this information in your mammogram report. Dense breasts may require additional screening methods.

**Q: Can men get breast cancer?**
A: Yes, though it's rare (less than 1% of all breast cancer cases). Men should also be aware of changes in their breast tissue and report any lumps or changes to their doctor.

**Q: Do underwire bras cause cancer?**
A: No credible scientific evidence supports a link between underwire bras and breast cancer. Choose bras that fit properly and are comfortable.

**Q: Can stress cause breast cancer?**
A: While chronic stress may weaken the immune system, there's no direct evidence that stress causes breast cancer. However, managing stress is important for overall health.

**Q: How often should I examine my breasts?**
A: Monthly self-examinations are recommended, ideally 3-5 days after your period ends. If you no longer menstruate, choose the same day each month.

**Q: What's the difference between a lump and dense tissue?**
A: Dense tissue feels firm and slightly lumpy throughout the breast. A concerning lump is typically a distinct, hard mass that feels different from surrounding tissue.

Remember: When in doubt, consult your healthcare provider. It's always better to have unnecessary concerns checked than to ignore potentially important symptoms.`,
      category: 'faq',
      tags: ['faq', 'lumps', 'breast-pain', 'dense-breasts', 'concerns', 'questions']
    }
  ];
  
  // Add each knowledge entry
  for (const entry of knowledgeEntries) {
    try {
      await brandAiService.addKnowledge(brandId, entry);
      console.log(`✅ Added knowledge: ${entry.title}`);
    } catch (error) {
      console.log(`⚠️ Knowledge already exists or error adding: ${entry.title}`);
    }
  }
  
  console.log(`✅ BrezCode knowledge base initialized with ${knowledgeEntries.length} entries`);
}