// BREZCODE ADMIN ROUTES
// Backend administration routes for BrezCode health platform
// Adapted from LeadGen business routes for health platform management

import { Router } from 'express'
import { brezcodeBusinessDashboardService } from '../brezcode-business-dashboard-service'
import { brezcodeAiTrainingService } from '../brezcode-ai-training-service'
import { brezcodeAvatarService } from '../brezcode-avatar-service'

const router = Router()

// Admin authentication middleware (simplified for now)
const adminAuth = (req: any, res: any, next: any) => {
  // In production, this should check for admin privileges
  // For now, just check if user is logged in
  if (req.session?.userId) {
    next()
  } else {
    res.status(401).json({ error: 'Admin authentication required' })
  }
}

// Apply admin auth to all routes
router.use(adminAuth)

// ================================
// ANALYTICS & DASHBOARD ROUTES
// ================================

// Get dashboard analytics
router.get('/analytics', async (req, res) => {
  try {
    const range = req.query.range as string || '30d'
    let dateRange: { start: Date; end: Date } | undefined

    if (range === '7d') {
      dateRange = {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date()
      }
    } else if (range === '30d') {
      dateRange = {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date()
      }
    } else if (range === '90d') {
      dateRange = {
        start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        end: new Date()
      }
    }

    const analytics = await brezcodeBusinessDashboardService.getDashboardAnalytics(dateRange)
    res.json(analytics)
  } catch (error) {
    console.error('Analytics fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch analytics' })
  }
})

// Get health trend data
router.get('/health-trends', async (req, res) => {
  try {
    const days = parseInt(req.query.days as string) || 30
    const trends = await brezcodeBusinessDashboardService.getHealthTrendData(days)
    res.json(trends)
  } catch (error) {
    console.error('Health trends fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch health trends' })
  }
})

// ================================
// USER MANAGEMENT ROUTES
// ================================

// Get user management data
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 50
    
    const userData = await brezcodeBusinessDashboardService.getUserManagementData(page, limit)
    res.json(userData)
  } catch (error) {
    console.error('User data fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch user data' })
  }
})

// Get detailed user profile
router.get('/users/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId)
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' })
    }

    const userProfile = await brezcodeBusinessDashboardService.getDetailedUserProfile(userId)
    res.json(userProfile)
  } catch (error) {
    console.error('User profile fetch error:', error)
    if (error instanceof Error && error.message === 'User not found') {
      res.status(404).json({ error: 'User not found' })
    } else {
      res.status(500).json({ error: 'Failed to fetch user profile' })
    }
  }
})

// Update user subscription
router.put('/users/:userId/subscription', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId)
    const { planType, isActive } = req.body

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' })
    }

    if (!planType || typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const result = await brezcodeBusinessDashboardService.updateUserSubscription(userId, planType, isActive)
    res.json(result)
  } catch (error) {
    console.error('Subscription update error:', error)
    res.status(500).json({ error: 'Failed to update subscription' })
  }
})

// Export user data
router.get('/export', async (req, res) => {
  try {
    const format = req.query.format as 'csv' | 'json' || 'csv'
    const data = await brezcodeBusinessDashboardService.exportUserData(format)
    
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename=brezcode-users.csv')
    } else {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Disposition', 'attachment; filename=brezcode-users.json')
    }
    
    res.send(data)
  } catch (error) {
    console.error('Export error:', error)
    res.status(500).json({ error: 'Failed to export data' })
  }
})

// ================================
// AI TRAINING MANAGEMENT ROUTES
// ================================

// Get available training scenarios
router.get('/ai-training/scenarios', async (req, res) => {
  try {
    const scenarios = await brezcodeAiTrainingService.getTrainingScenarios()
    res.json(scenarios)
  } catch (error) {
    console.error('Training scenarios fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch training scenarios' })
  }
})

// Get specific training scenario
router.get('/ai-training/scenarios/:scenarioId', async (req, res) => {
  try {
    const { scenarioId } = req.params
    const scenario = await brezcodeAiTrainingService.getScenarioById(scenarioId)
    
    if (!scenario) {
      return res.status(404).json({ error: 'Training scenario not found' })
    }
    
    res.json(scenario)
  } catch (error) {
    console.error('Training scenario fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch training scenario' })
  }
})

// Start training session
router.post('/ai-training/start', async (req, res) => {
  try {
    const { scenarioId } = req.body
    const userId = req.session.userId

    if (!scenarioId) {
      return res.status(400).json({ error: 'Scenario ID required' })
    }

    const session = await brezcodeAiTrainingService.startTrainingSession(userId!, scenarioId)
    res.json(session)
  } catch (error) {
    console.error('Training session start error:', error)
    res.status(500).json({ error: 'Failed to start training session' })
  }
})

// Add message to training session
router.post('/ai-training/sessions/:sessionId/message', async (req, res) => {
  try {
    const { sessionId } = req.params
    const { role, message, feedback } = req.body

    if (!role || !message) {
      return res.status(400).json({ error: 'Role and message required' })
    }

    await brezcodeAiTrainingService.addMessageToSession(sessionId, role, message, feedback)
    res.json({ success: true })
  } catch (error) {
    console.error('Message add error:', error)
    res.status(500).json({ error: 'Failed to add message' })
  }
})

// Evaluate AI response
router.post('/ai-training/sessions/:sessionId/evaluate', async (req, res) => {
  try {
    const { sessionId } = req.params
    const { aiResponse, scenarioId } = req.body

    if (!aiResponse || !scenarioId) {
      return res.status(400).json({ error: 'AI response and scenario ID required' })
    }

    const evaluation = await brezcodeAiTrainingService.evaluateResponse(sessionId, aiResponse, scenarioId)
    res.json(evaluation)
  } catch (error) {
    console.error('Response evaluation error:', error)
    res.status(500).json({ error: 'Failed to evaluate response' })
  }
})

// Complete training session
router.post('/ai-training/sessions/:sessionId/complete', async (req, res) => {
  try {
    const { sessionId } = req.params
    const completedSession = await brezcodeAiTrainingService.completeTrainingSession(sessionId)
    res.json(completedSession)
  } catch (error) {
    console.error('Training session completion error:', error)
    res.status(500).json({ error: 'Failed to complete training session' })
  }
})

// Get user's training sessions
router.get('/ai-training/sessions', async (req, res) => {
  try {
    const userId = req.session.userId
    const sessions = await brezcodeAiTrainingService.getUserTrainingSessions(userId!)
    res.json(sessions)
  } catch (error) {
    console.error('Training sessions fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch training sessions' })
  }
})

// ================================
// AVATAR MANAGEMENT ROUTES
// ================================

// Get available avatars
router.get('/avatars', async (req, res) => {
  try {
    const avatars = await brezcodeAvatarService.getAvailableAvatars()
    res.json(avatars)
  } catch (error) {
    console.error('Avatars fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch avatars' })
  }
})

// Get specific avatar
router.get('/avatars/:avatarId', async (req, res) => {
  try {
    const { avatarId } = req.params
    const avatar = await brezcodeAvatarService.getAvatarById(avatarId)
    
    if (!avatar) {
      return res.status(404).json({ error: 'Avatar not found' })
    }
    
    res.json(avatar)
  } catch (error) {
    console.error('Avatar fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch avatar' })
  }
})

// Get user conversations
router.get('/avatars/conversations/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId)
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' })
    }

    const conversations = await brezcodeAvatarService.getUserConversations(userId)
    res.json(conversations)
  } catch (error) {
    console.error('Conversations fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch conversations' })
  }
})

// ================================
// SYSTEM HEALTH ROUTES
// ================================

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'BrezCode Admin API'
  })
})

// System status
router.get('/status', async (req, res) => {
  try {
    // Get basic system metrics
    const analytics = await brezcodeBusinessDashboardService.getDashboardAnalytics()
    
    res.json({
      status: 'operational',
      timestamp: new Date().toISOString(),
      metrics: {
        totalUsers: analytics.totalUsers,
        activeUsers: analytics.activeUsers,
        systemLoad: 'normal',
        databaseStatus: 'connected'
      }
    })
  } catch (error) {
    console.error('Status check error:', error)
    res.status(500).json({ 
      status: 'degraded',
      error: 'Failed to fetch system metrics'
    })
  }
})

export default router