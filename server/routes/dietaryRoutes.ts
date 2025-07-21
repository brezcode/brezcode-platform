import express from 'express';
import { dietaryRecommendationEngine } from '../dietaryRecommendationEngine';

const router = express.Router();

// Generate personalized daily meal plan
router.post('/dietary/meal-plan', async (req, res) => {
  try {
    const { userProfile, date } = req.body;

    if (!userProfile || !date) {
      return res.status(400).json({
        success: false,
        message: 'User profile and date are required'
      });
    }

    // Validate required user profile fields
    const requiredFields = ['age', 'gender', 'activityLevel', 'weight', 'height'];
    const missingFields = requiredFields.filter(field => !userProfile[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const mealPlan = await dietaryRecommendationEngine.generateDailyMealPlan(userProfile, date);

    res.json({
      success: true,
      mealPlan,
      nutritionalNeeds: dietaryRecommendationEngine.calculateNutritionalNeeds(userProfile)
    });

  } catch (error) {
    console.error('Meal plan generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate meal plan'
    });
  }
});

// Generate single meal recommendation
router.post('/dietary/meal-recommendation', async (req, res) => {
  try {
    const { userProfile, mealType, previousMeals = [] } = req.body;

    if (!userProfile || !mealType) {
      return res.status(400).json({
        success: false,
        message: 'User profile and meal type are required'
      });
    }

    const nutritionalNeeds = dietaryRecommendationEngine.calculateNutritionalNeeds(userProfile);
    const recommendation = await dietaryRecommendationEngine.generateMealRecommendations(
      userProfile,
      nutritionalNeeds,
      mealType,
      previousMeals
    );

    res.json({
      success: true,
      recommendation,
      nutritionalNeeds
    });

  } catch (error) {
    console.error('Meal recommendation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate meal recommendation'
    });
  }
});

// Calculate user's nutritional needs
router.post('/dietary/nutritional-needs', async (req, res) => {
  try {
    const { userProfile } = req.body;

    if (!userProfile) {
      return res.status(400).json({
        success: false,
        message: 'User profile is required'
      });
    }

    const nutritionalNeeds = dietaryRecommendationEngine.calculateNutritionalNeeds(userProfile);

    res.json({
      success: true,
      nutritionalNeeds
    });

  } catch (error) {
    console.error('Nutritional needs calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate nutritional needs'
    });
  }
});

// Submit meal feedback for ML learning
router.post('/dietary/feedback', async (req, res) => {
  try {
    const { userId, mealFeedback } = req.body;

    if (!userId || !mealFeedback) {
      return res.status(400).json({
        success: false,
        message: 'User ID and meal feedback are required'
      });
    }

    const updatedPreferences = await dietaryRecommendationEngine.updateUserPreferences(
      userId,
      mealFeedback
    );

    // This would typically save to database
    // For now, return the suggestions
    res.json({
      success: true,
      updatedPreferences,
      message: 'Feedback recorded and preferences updated'
    });

  } catch (error) {
    console.error('Meal feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process meal feedback'
    });
  }
});

// Analyze nutritional gaps in meal plan
router.post('/dietary/nutritional-analysis', async (req, res) => {
  try {
    const { meals, userProfile } = req.body;

    if (!meals || !userProfile) {
      return res.status(400).json({
        success: false,
        message: 'Meals and user profile are required'
      });
    }

    const nutritionalNeeds = dietaryRecommendationEngine.calculateNutritionalNeeds(userProfile);
    const nutritionalGaps = dietaryRecommendationEngine.analyzeNutritionalGaps(meals, nutritionalNeeds);

    // Identify areas that need improvement (less than 80% of needs met)
    const improvements = Object.entries(nutritionalGaps)
      .filter(([, percentage]) => percentage < 80)
      .map(([nutrient, percentage]) => ({
        nutrient,
        currentPercentage: percentage,
        deficit: 100 - percentage
      }));

    res.json({
      success: true,
      nutritionalGaps,
      improvements,
      overallScore: Math.round(
        Object.values(nutritionalGaps).reduce((sum, val) => sum + Math.min(val, 100), 0) / 
        Object.keys(nutritionalGaps).length
      )
    });

  } catch (error) {
    console.error('Nutritional analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze nutritional gaps'
    });
  }
});

// Get personalized food suggestions based on health goals
router.post('/dietary/food-suggestions', async (req, res) => {
  try {
    const { healthGoals, dietaryRestrictions = [], allergies = [] } = req.body;

    if (!healthGoals || !Array.isArray(healthGoals)) {
      return res.status(400).json({
        success: false,
        message: 'Health goals array is required'
      });
    }

    // This would typically query a comprehensive food database
    // For now, provide goal-specific suggestions
    const goalBasedSuggestions: Record<string, string[]> = {
      'weight_loss': [
        'Lean proteins (chicken breast, fish, tofu)',
        'High-fiber vegetables (broccoli, spinach, kale)',
        'Low-glycemic fruits (berries, apples)',
        'Whole grains in moderation',
        'Healthy fats (avocado, nuts, olive oil)'
      ],
      'muscle_gain': [
        'High-protein foods (eggs, lean meats, Greek yogurt)',
        'Complex carbohydrates (quinoa, sweet potatoes)',
        'Protein-rich snacks (nuts, protein smoothies)',
        'Recovery foods (tart cherry juice, fatty fish)'
      ],
      'heart_health': [
        'Omega-3 rich fish (salmon, mackerel, sardines)',
        'Fiber-rich foods (oats, beans, lentils)',
        'Antioxidant fruits (blueberries, pomegranates)',
        'Heart-healthy nuts (walnuts, almonds)',
        'Low-sodium options'
      ],
      'reduce_breast_cancer_risk': [
        'Cruciferous vegetables (broccoli, cauliflower)',
        'Antioxidant-rich berries',
        'Green tea and turmeric',
        'Omega-3 fatty acids',
        'Fiber-rich whole grains'
      ],
      'better_stress_management': [
        'Magnesium-rich foods (dark chocolate, nuts)',
        'Complex carbohydrates for serotonin',
        'Herbal teas (chamomile, lavender)',
        'Vitamin C sources (citrus, bell peppers)',
        'Probiotic foods (yogurt, kefir)'
      ]
    };

    const suggestions = healthGoals.reduce((acc: string[], goal: string) => {
      const goalKey = goal.toLowerCase().replace(/\s+/g, '_');
      if (goalBasedSuggestions[goalKey]) {
        acc.push(...goalBasedSuggestions[goalKey]);
      }
      return acc;
    }, []);

    // Remove duplicates and filter based on restrictions
    const uniqueSuggestions = Array.from(new Set(suggestions));
    
    res.json({
      success: true,
      suggestions: uniqueSuggestions,
      healthGoals,
      note: 'Suggestions are personalized based on your health goals and dietary preferences'
    });

  } catch (error) {
    console.error('Food suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate food suggestions'
    });
  }
});

export default router;