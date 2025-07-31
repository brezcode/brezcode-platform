import express from 'express';
import { z } from 'zod';

const router = express.Router();

// Business management schemas
const BusinessSchema = z.object({
  name: z.string().min(1),
  type: z.string(),
  industry: z.string(),
  description: z.string()
});

// Sample businesses data (in production this would be database-backed)
const businessesStore = new Map([
  ['brezcode', {
    id: 'brezcode',
    name: 'BrezCode Health',
    type: 'Health & Wellness',
    industry: 'Healthcare',
    description: 'Breast health coaching and wellness platform',
    avatar_trained: true,
    documents_count: 8,
    content_pieces: 47,
    created_at: '2025-01-15',
    user_id: 5 // Sample user ID
  }],
  ['techstore', {
    id: 'techstore',
    name: 'TechStore Pro',
    type: 'E-commerce',
    industry: 'Technology Retail',
    description: 'Electronic devices and tech accessories',
    avatar_trained: false,
    documents_count: 23,
    content_pieces: 12,
    created_at: '2025-01-20',
    user_id: 5
  }]
]);

// Get user's businesses
router.get('/businesses', (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Filter businesses by user ID
    const userBusinesses = Array.from(businessesStore.values())
      .filter(business => business.user_id === userId);

    res.json({
      success: true,
      businesses: userBusinesses
    });
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({ error: 'Failed to fetch businesses' });
  }
});

// Get specific business details
router.get('/businesses/:businessId', (req, res) => {
  try {
    const { businessId } = req.params;
    const userId = req.session?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const business = businessesStore.get(businessId);
    if (!business || business.user_id !== userId) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.json({
      success: true,
      business
    });
  } catch (error) {
    console.error('Error fetching business:', error);
    res.status(500).json({ error: 'Failed to fetch business' });
  }
});

// Create new business
router.post('/businesses', (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const validation = BusinessSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Invalid business data',
        details: validation.error.issues
      });
    }

    const businessData = validation.data;
    const businessId = businessData.name.toLowerCase().replace(/\s+/g, '');
    
    const newBusiness = {
      id: businessId,
      ...businessData,
      avatar_trained: false,
      documents_count: 0,
      content_pieces: 0,
      created_at: new Date().toISOString().split('T')[0],
      user_id: userId
    };

    businessesStore.set(businessId, newBusiness);

    res.json({
      success: true,
      business: newBusiness,
      message: 'Business created successfully'
    });
  } catch (error) {
    console.error('Error creating business:', error);
    res.status(500).json({ error: 'Failed to create business' });
  }
});

// Training Module APIs

// Get scenario training data for a business
router.get('/businesses/:businessId/training/scenarios', (req, res) => {
  try {
    const { businessId } = req.params;
    const userId = req.session?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const business = businessesStore.get(businessId);
    if (!business || business.user_id !== userId) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Sample scenario training data based on business type
    const scenarioCategories = getScenarioCategoriesForBusiness(business.type);
    
    res.json({
      success: true,
      business_id: businessId,
      business_type: business.type,
      categories: scenarioCategories,
      training_status: business.avatar_trained ? 'trained' : 'not_trained'
    });
  } catch (error) {
    console.error('Error fetching scenario training:', error);
    res.status(500).json({ error: 'Failed to fetch scenario training data' });
  }
});

// Get documentation learning data
router.get('/businesses/:businessId/training/documentation', (req, res) => {
  try {
    const { businessId } = req.params;
    const userId = req.session?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const business = businessesStore.get(businessId);
    if (!business || business.user_id !== userId) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.json({
      success: true,
      business_id: businessId,
      documents_uploaded: business.documents_count,
      document_categories: getDocumentCategoriesForBusiness(business.type),
      processing_status: business.documents_count > 0 ? 'processed' : 'empty'
    });
  } catch (error) {
    console.error('Error fetching documentation data:', error);
    res.status(500).json({ error: 'Failed to fetch documentation data' });
  }
});

// Get content creation data
router.get('/businesses/:businessId/training/content', (req, res) => {
  try {
    const { businessId } = req.params;
    const userId = req.session?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const business = businessesStore.get(businessId);
    if (!business || business.user_id !== userId) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.json({
      success: true,
      business_id: businessId,
      content_pieces: business.content_pieces,
      content_types: getContentTypesForBusiness(business.type),
      research_sources: getResearchSourcesForBusiness(business.type)
    });
  } catch (error) {
    console.error('Error fetching content data:', error);
    res.status(500).json({ error: 'Failed to fetch content data' });
  }
});

// Helper functions to generate business-specific data
function getScenarioCategoriesForBusiness(businessType: string) {
  const baseCategories = [
    'Customer Service Scenarios',
    'Sales Conversations',
    'Technical Support',
    'Product Inquiries',
    'Complaint Resolution'
  ];

  switch (businessType) {
    case 'Health & Wellness':
      return [
        ...baseCategories,
        'Health Consultations',
        'Wellness Coaching',
        'Medical Inquiries',
        'Health Anxiety Support'
      ];
    case 'E-commerce':
      return [
        ...baseCategories,
        'Product Recommendations',
        'Order Issues',
        'Return Processes',
        'Shipping Inquiries'
      ];
    default:
      return baseCategories;
  }
}

function getDocumentCategoriesForBusiness(businessType: string) {
  const baseCategories = [
    'Product Manuals',
    'SOPs & Procedures',
    'Knowledge Base',
    'Training Materials'
  ];

  switch (businessType) {
    case 'Health & Wellness':
      return [
        ...baseCategories,
        'Medical Guidelines',
        'Health Protocols',
        'Clinical Research',
        'Patient Resources'
      ];
    case 'E-commerce':
      return [
        ...baseCategories,
        'Product Catalogs',
        'Inventory Management',
        'Shipping Procedures',
        'Return Policies'
      ];
    default:
      return baseCategories;
  }
}

function getContentTypesForBusiness(businessType: string) {
  const baseTypes = [
    'Educational Articles',
    'Product Videos',
    'Infographics',
    'Social Media Content'
  ];

  switch (businessType) {
    case 'Health & Wellness':
      return [
        ...baseTypes,
        'Health Tips',
        'Exercise Videos',
        'Wellness Guides',
        'Medical Infographics'
      ];
    case 'E-commerce':
      return [
        ...baseTypes,
        'Product Demos',
        'Unboxing Videos',
        'Comparison Guides',
        'Shopping Tips'
      ];
    default:
      return baseTypes;
  }
}

function getResearchSourcesForBusiness(businessType: string) {
  switch (businessType) {
    case 'Health & Wellness':
      return [
        { name: 'Dr. Rhonda Patrick', specialty: 'Nutrition & Longevity', videos: 8, status: 'Active' },
        { name: 'Dr. David Sinclair', specialty: 'Aging Research', videos: 6, status: 'Active' },
        { name: 'Dr. Peter Attia', specialty: 'Metabolic Health', videos: 9, status: 'Active' },
        { name: 'Dr. Andrew Huberman', specialty: 'Neuroscience', videos: 7, status: 'Active' }
      ];
    case 'E-commerce':
      return [
        { name: 'TechReview Central', specialty: 'Product Reviews', videos: 15, status: 'Active' },
        { name: 'Unbox Therapy', specialty: 'Product Unboxing', videos: 12, status: 'Active' },
        { name: 'MarketWatch Tech', specialty: 'Industry Trends', videos: 8, status: 'Active' }
      ];
    default:
      return [
        { name: 'Industry Expert 1', specialty: 'General Business', videos: 5, status: 'Active' },
        { name: 'Business Insider', specialty: 'Business Trends', videos: 10, status: 'Active' }
      ];
  }
}

export default router;