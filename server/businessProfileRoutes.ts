import { Router } from 'express';
import { db } from './db';
import { businessProfiles, businessStrategies } from '@shared/schema';
import { insertBusinessProfileSchema } from '@shared/schema';
import { BusinessConsultantService } from './businessConsultantService';
import { eq } from 'drizzle-orm';

const router = Router();
const businessConsultant = new BusinessConsultantService();

// Create comprehensive business profile
router.post('/profile', async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ error: 'Please log in to continue' });
    }

    // Validate the business profile data
    const validatedData = insertBusinessProfileSchema.parse({
      ...req.body,
      userId: req.session.userId,
    });

    // Insert the business profile
    const [businessProfile] = await db
      .insert(businessProfiles)
      .values(validatedData)
      .returning();

    console.log('Business profile created:', businessProfile.id);

    res.json({
      success: true,
      profileId: businessProfile.id,
      message: 'Business profile saved successfully'
    });

  } catch (error: any) {
    console.error('Error creating business profile:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    res.status(500).json({ 
      error: 'Failed to save business profile',
      details: error.message 
    });
  }
});

// Generate AI business strategies
router.post('/generate-strategies', async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ error: 'Please log in to continue' });
    }

    const { profileId } = req.body;

    if (!profileId) {
      return res.status(400).json({ error: 'Profile ID is required' });
    }

    // Get the business profile
    const [businessProfile] = await db
      .select()
      .from(businessProfiles)
      .where(eq(businessProfiles.id, profileId))
      .limit(1);

    if (!businessProfile) {
      return res.status(404).json({ error: 'Business profile not found' });
    }

    if (businessProfile.userId !== req.session.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Generate AI strategies
    console.log('Generating strategies for profile:', profileId);
    const strategies = await businessConsultant.generateBusinessStrategies(businessProfile);

    // Save strategies to database
    const savedStrategies = await db
      .insert(businessStrategies)
      .values(strategies)
      .returning();

    console.log(`Generated ${savedStrategies.length} strategies for business profile`);

    res.json({
      success: true,
      strategiesCount: savedStrategies.length,
      strategies: savedStrategies,
      message: 'Strategic recommendations generated successfully'
    });

  } catch (error: any) {
    console.error('Error generating strategies:', error);
    res.status(500).json({ 
      error: 'Failed to generate strategies',
      details: error.message 
    });
  }
});

// Get user's business profile
router.get('/profile', async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ error: 'Please log in to continue' });
    }

    const [businessProfile] = await db
      .select()
      .from(businessProfiles)
      .where(eq(businessProfiles.userId, req.session.userId))
      .limit(1);

    if (!businessProfile) {
      return res.status(404).json({ error: 'Business profile not found' });
    }

    res.json(businessProfile);

  } catch (error: any) {
    console.error('Error fetching business profile:', error);
    res.status(500).json({ 
      error: 'Failed to fetch business profile',
      details: error.message 
    });
  }
});

// Get business strategies
router.get('/strategies', async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ error: 'Please log in to continue' });
    }

    // Get user's business profile first
    const [businessProfile] = await db
      .select()
      .from(businessProfiles)
      .where(eq(businessProfiles.userId, req.session.userId))
      .limit(1);

    if (!businessProfile) {
      return res.status(404).json({ error: 'Business profile not found' });
    }

    // Get strategies for this profile
    const strategies = await db
      .select()
      .from(businessStrategies)
      .where(eq(businessStrategies.businessProfileId, businessProfile.id));

    res.json(strategies);

  } catch (error: any) {
    console.error('Error fetching strategies:', error);
    res.status(500).json({ 
      error: 'Failed to fetch strategies',
      details: error.message 
    });
  }
});

export { router as businessProfileRoutes };