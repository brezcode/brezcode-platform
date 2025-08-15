import { Router } from 'express';
import { skinAnalysisService, uploadMiddleware } from '../skinAnalysisService';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for analysis endpoints
const analysisLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 analysis requests per windowMs
  message: {
    error: 'Too many analysis requests, please try again later.',
  },
});

// Health check for skin analysis service
router.get('/health', skinAnalysisService.healthCheck);

// Main skin analysis endpoint
router.post('/analyze', 
  analysisLimiter,
  uploadMiddleware,
  skinAnalysisService.analyzeSkin
);

// Product recommendations endpoint
router.post('/recommendations', 
  analysisLimiter,
  skinAnalysisService.getProductRecommendations
);

// Get supported analysis features
router.get('/features', (req, res) => {
  res.json({
    supported_metrics: [
      'acne',
      'wrinkles',
      'sagging',
      'redness',
      'dark_spots',
      'dark_circles',
      'eye_bags',
      'texture',
      'pores',
      'hydration'
    ],
    models: [
      {
        name: 'DermNet-Classification',
        version: '2.0',
        capabilities: ['multi_class_skin_disease_detection', 'lesion_classification', 'confidence_scoring'],
        source: 'Roboflow Universe + DermNet NZ'
      },
      {
        name: 'Skin-Lesion-Detection',
        version: '1.0', 
        capabilities: ['lesion_localization', 'bounding_box_detection', 'severity_assessment'],
        source: 'Roboflow Universe'
      },
      {
        name: 'Enhanced-Skin-Analysis',
        version: '1.0',
        capabilities: ['personalized_analysis', 'quiz_integration', 'comprehensive_scoring'],
        source: 'Custom Implementation'
      }
    ],
    accuracy_rates: {
      acne: 0.94,
      dark_spots: 0.91,
      wrinkles: 0.89,
      texture: 0.86,
      redness: 0.88,
      overall_classification: 0.85
    }
  });
});

// Get analysis history (placeholder for future implementation)
router.get('/history/:userId', (req, res) => {
  // This would fetch user's previous analyses from database
  res.json({
    message: 'Analysis history feature coming soon',
    userId: req.params.userId,
    analyses: []
  });
});

// Save analysis results (placeholder for future implementation)
router.post('/save', (req, res) => {
  // This would save analysis results to database
  const { userId, analysisResult } = req.body;
  
  res.json({
    message: 'Analysis saved successfully',
    analysisId: `analysis_${Date.now()}`,
    timestamp: new Date().toISOString()
  });
});

export default router;