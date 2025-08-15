import { Router } from 'express';
import { skincoachDb, skincoachProducts, skincoachAvatars, skincoachTrainingData, skincoachUsers, skinAnalysisResults } from '../skincoach-db';
import { eq, desc, count, sql } from 'drizzle-orm';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for admin endpoints
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Higher limit for admin operations
  message: {
    error: 'Too many admin requests, please try again later.',
  },
});

// Apply rate limiting to all admin routes
router.use(adminLimiter);

// Dashboard overview stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const [
      totalUsersResult,
      totalAnalysesResult,
      totalProductsResult,
      activeConversationsResult
    ] = await Promise.all([
      skincoachDb.select({ count: count() }).from(skincoachUsers),
      skincoachDb.select({ count: count() }).from(skinAnalysisResults),
      skincoachDb.select({ count: count() }).from(skincoachProducts),
      // For now, we'll use a mock count for active conversations
      Promise.resolve([{ count: 342 }])
    ]);

    const stats = {
      totalUsers: totalUsersResult[0]?.count || 0,
      totalAnalyses: totalAnalysesResult[0]?.count || 0,
      totalProducts: totalProductsResult[0]?.count || 0,
      activeConversations: activeConversationsResult[0]?.count || 0,
      avgSatisfactionScore: 4.7, // Mock data
      monthlyGrowth: 23.5 // Mock data
    };

    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Product management endpoints

// Get all products
router.get('/products', async (req, res) => {
  try {
    const { category, budget, limit = 50 } = req.query;
    
    let query = skincoachDb.select().from(skincoachProducts);
    
    if (category) {
      query = query.where(eq(skincoachProducts.category, category as string));
    }
    
    const products = await query
      .orderBy(desc(skincoachProducts.created_at))
      .limit(Number(limit));

    res.json({
      success: true,
      products,
      count: products.length
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add new product
router.post('/products', async (req, res) => {
  try {
    const productData = req.body;
    
    // Validate required fields
    if (!productData.name || !productData.brand || !productData.category || !productData.price) {
      return res.status(400).json({ error: 'Missing required product fields' });
    }

    const newProduct = await skincoachDb
      .insert(skincoachProducts)
      .values({
        ...productData,
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning();

    res.json({
      success: true,
      product: newProduct[0],
      message: 'Product added successfully'
    });

  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Update product
router.put('/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const updateData = req.body;

    const updatedProduct = await skincoachDb
      .update(skincoachProducts)
      .set({
        ...updateData,
        updated_at: new Date()
      })
      .where(eq(skincoachProducts.id, productId))
      .returning();

    if (!updatedProduct.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      product: updatedProduct[0],
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    const deletedProduct = await skincoachDb
      .delete(skincoachProducts)
      .where(eq(skincoachProducts.id, productId))
      .returning();

    if (!deletedProduct.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// AI Training Data Management

// Get training data
router.get('/training-data', async (req, res) => {
  try {
    const { type, status, limit = 50 } = req.query;
    
    let query = skincoachDb.select().from(skincoachTrainingData);
    
    if (type) {
      query = query.where(eq(skincoachTrainingData.training_type, type as string));
    }
    
    const trainingData = await query
      .orderBy(desc(skincoachTrainingData.created_at))
      .limit(Number(limit));

    res.json({
      success: true,
      trainingData,
      count: trainingData.length
    });

  } catch (error) {
    console.error('Error fetching training data:', error);
    res.status(500).json({ error: 'Failed to fetch training data' });
  }
});

// Add training data
router.post('/training-data', async (req, res) => {
  try {
    const { training_type, input_data, expected_output, avatar_id } = req.body;
    
    if (!training_type || !input_data) {
      return res.status(400).json({ error: 'Missing required training data fields' });
    }

    const newTrainingData = await skincoachDb
      .insert(skincoachTrainingData)
      .values({
        avatar_id,
        training_type,
        input_data,
        expected_output,
        is_validated: false,
        created_at: new Date()
      })
      .returning();

    res.json({
      success: true,
      trainingData: newTrainingData[0],
      message: 'Training data added successfully'
    });

  } catch (error) {
    console.error('Error adding training data:', error);
    res.status(500).json({ error: 'Failed to add training data' });
  }
});

// Validate training data
router.put('/training-data/:id/validate', async (req, res) => {
  try {
    const trainingId = parseInt(req.params.id);
    const { feedback_score, feedback_notes, validator_id } = req.body;

    const validatedData = await skincoachDb
      .update(skincoachTrainingData)
      .set({
        is_validated: true,
        feedback_score,
        feedback_notes,
        validator_id
      })
      .where(eq(skincoachTrainingData.id, trainingId))
      .returning();

    if (!validatedData.length) {
      return res.status(404).json({ error: 'Training data not found' });
    }

    res.json({
      success: true,
      trainingData: validatedData[0],
      message: 'Training data validated successfully'
    });

  } catch (error) {
    console.error('Error validating training data:', error);
    res.status(500).json({ error: 'Failed to validate training data' });
  }
});

// Avatar Management

// Get avatars
router.get('/avatars', async (req, res) => {
  try {
    const avatars = await skincoachDb
      .select()
      .from(skincoachAvatars)
      .orderBy(desc(skincoachAvatars.created_at));

    res.json({
      success: true,
      avatars
    });

  } catch (error) {
    console.error('Error fetching avatars:', error);
    res.status(500).json({ error: 'Failed to fetch avatars' });
  }
});

// Update avatar configuration
router.put('/avatars/:id', async (req, res) => {
  try {
    const avatarId = parseInt(req.params.id);
    const updateData = req.body;

    const updatedAvatar = await skincoachDb
      .update(skincoachAvatars)
      .set({
        ...updateData,
        updated_at: new Date()
      })
      .where(eq(skincoachAvatars.id, avatarId))
      .returning();

    if (!updatedAvatar.length) {
      return res.status(404).json({ error: 'Avatar not found' });
    }

    res.json({
      success: true,
      avatar: updatedAvatar[0],
      message: 'Avatar updated successfully'
    });

  } catch (error) {
    console.error('Error updating avatar:', error);
    res.status(500).json({ error: 'Failed to update avatar' });
  }
});

// Analytics endpoints

// User analytics
router.get('/analytics/users', async (req, res) => {
  try {
    // This would include more complex analytics queries
    const userStats = {
      newUsersThisMonth: 1240,
      activeUsers: 3420,
      retentionRate: 76.5,
      avgSessionDuration: '8.3 minutes'
    };

    res.json({
      success: true,
      analytics: userStats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ error: 'Failed to fetch user analytics' });
  }
});

// Product analytics
router.get('/analytics/products', async (req, res) => {
  try {
    // This would include product performance metrics
    const productStats = {
      totalRecommendations: 12340,
      clickThroughRate: 32.8,
      topProducts: [
        { name: 'CeraVe Cleanser', recommendations: 890 },
        { name: 'The Ordinary HA', recommendations: 1240 }
      ]
    };

    res.json({
      success: true,
      analytics: productStats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching product analytics:', error);
    res.status(500).json({ error: 'Failed to fetch product analytics' });
  }
});

// System configuration endpoints

// Get system configuration
router.get('/config', async (req, res) => {
  try {
    const config = {
      ai_model: 'gpt-4',
      max_response_length: 500,
      temperature: 0.7,
      training_enabled: true,
      auto_validation: false
    };

    res.json({
      success: true,
      config
    });

  } catch (error) {
    console.error('Error fetching system config:', error);
    res.status(500).json({ error: 'Failed to fetch system configuration' });
  }
});

// Update system configuration
router.put('/config', async (req, res) => {
  try {
    const configData = req.body;
    
    // In a real implementation, this would save to a configuration table
    // For now, we'll just return success
    
    res.json({
      success: true,
      config: configData,
      message: 'Configuration updated successfully'
    });

  } catch (error) {
    console.error('Error updating system config:', error);
    res.status(500).json({ error: 'Failed to update system configuration' });
  }
});

// Export data endpoints

// Export products
router.get('/export/products', async (req, res) => {
  try {
    const products = await skincoachDb.select().from(skincoachProducts);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=skincoach-products.json');
    res.json({
      exported_at: new Date().toISOString(),
      count: products.length,
      products
    });

  } catch (error) {
    console.error('Error exporting products:', error);
    res.status(500).json({ error: 'Failed to export products' });
  }
});

// Export training data
router.get('/export/training-data', async (req, res) => {
  try {
    const trainingData = await skincoachDb.select().from(skincoachTrainingData);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=skincoach-training-data.json');
    res.json({
      exported_at: new Date().toISOString(),
      count: trainingData.length,
      training_data: trainingData
    });

  } catch (error) {
    console.error('Error exporting training data:', error);
    res.status(500).json({ error: 'Failed to export training data' });
  }
});

export default router;