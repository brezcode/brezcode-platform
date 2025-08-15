import express from 'express';
import { foodAnalysisService } from '../foodAnalysisService';

const router = express.Router();

// Analyze food image for nutritional content
router.post('/food/analyze', async (req, res) => {
  try {
    const { image, analysisType = 'comprehensive' } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'Image data is required'
      });
    }

    // Analyze the food image
    const analysisResult = await foodAnalysisService.analyzeFoodImage(image);

    if (!analysisResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Failed to analyze food image. Please try with a clearer photo.'
      });
    }

    // Enhance health score calculation
    analysisResult.analysis.healthScore = foodAnalysisService.calculateHealthScore(analysisResult.analysis);

    res.json(analysisResult);

  } catch (error) {
    console.error('Food analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during food analysis'
    });
  }
});

// Get personalized food recommendations
router.post('/food/recommendations', async (req, res) => {
  try {
    const { nutritionalData, userGoals = [] } = req.body;

    if (!nutritionalData) {
      return res.status(400).json({
        success: false,
        message: 'Nutritional data is required'
      });
    }

    const recommendations = await foodAnalysisService.getFoodRecommendations(
      nutritionalData, 
      userGoals
    );

    res.json({
      success: true,
      recommendations
    });

  } catch (error) {
    console.error('Food recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations'
    });
  }
});

// Get food analysis history for a user
router.get('/food/history/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const limit = parseInt(req.query.limit as string) || 10;

    // This would typically fetch from database
    // For now, return empty array as this requires database schema
    res.json({
      success: true,
      history: [],
      message: 'Food analysis history feature coming soon'
    });

  } catch (error) {
    console.error('Food history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve food analysis history'
    });
  }
});

// Save food analysis result
router.post('/food/save', async (req, res) => {
  try {
    const { userId, analysisResult, mealType = 'unknown' } = req.body;

    if (!userId || !analysisResult) {
      return res.status(400).json({
        success: false,
        message: 'User ID and analysis result are required'
      });
    }

    // This would typically save to database
    // For now, just return success
    res.json({
      success: true,
      message: 'Food analysis saved successfully',
      id: `food_analysis_${Date.now()}`
    });

  } catch (error) {
    console.error('Save food analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save food analysis'
    });
  }
});

export default router;