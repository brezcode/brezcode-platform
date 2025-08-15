import { Router } from 'express';
import { notificationService } from '../notificationService';

const router = Router();

// Subscribe to push notifications
router.post('/subscribe', async (req, res) => {
  try {
    const { subscription, preferences } = req.body;
    const customerId = req.session?.user?.id || 'demo-customer';

    if (!subscription) {
      return res.status(400).json({
        success: false,
        error: 'Subscription data is required'
      });
    }

    // Register the push subscription
    await notificationService.registerPushSubscription(customerId, subscription);

    // Schedule daily health tips if enabled
    if (preferences?.enableDailyTips) {
      await notificationService.scheduleDailyHealthTips(
        customerId, 
        'brezcode', // Default brand for demo
        preferences.preferredTime || '09:00'
      );
    }

    // Update preferences
    await notificationService.updateNotificationPreferences(customerId, preferences);

    res.json({
      success: true,
      message: 'Successfully subscribed to push notifications'
    });

  } catch (error: any) {
    console.error('Push subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to subscribe to notifications',
      details: error.message
    });
  }
});

// Unsubscribe from push notifications
router.post('/unsubscribe', async (req, res) => {
  try {
    const customerId = req.session?.user?.id || 'demo-customer';

    // Get customer notifications and cancel them
    const notifications = await notificationService.getCustomerNotifications(customerId);
    
    for (const notification of notifications) {
      await notificationService.cancelNotification(notification.id);
    }

    res.json({
      success: true,
      message: 'Successfully unsubscribed from notifications'
    });

  } catch (error: any) {
    console.error('Push unsubscribe error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to unsubscribe',
      details: error.message
    });
  }
});

// Send test notification
router.post('/test', async (req, res) => {
  try {
    const { title, body, icon } = req.body;
    const customerId = req.session?.user?.id || 'demo-customer';

    const sent = await notificationService.sendWebPushNotification(
      customerId,
      title || '🌟 Test Notification',
      body || 'This is a test notification from your health app!',
      icon || '/health-icon.png',
      '/health-badge.png',
      { test: true, timestamp: Date.now() }
    );

    if (sent) {
      res.json({
        success: true,
        message: 'Test notification sent successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Failed to send test notification - no subscription found'
      });
    }

  } catch (error: any) {
    console.error('Test notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send test notification',
      details: error.message
    });
  }
});

// Update notification preferences
router.post('/preferences', async (req, res) => {
  try {
    const { preferences } = req.body;
    const customerId = req.session?.user?.id || 'demo-customer';

    await notificationService.updateNotificationPreferences(customerId, preferences);

    // Reschedule notifications based on new preferences
    if (preferences.enableDailyTips) {
      await notificationService.scheduleDailyHealthTips(
        customerId,
        'brezcode',
        preferences.preferredTime || '09:00'
      );
    }

    res.json({
      success: true,
      message: 'Notification preferences updated successfully'
    });

  } catch (error: any) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update preferences',
      details: error.message
    });
  }
});

// Get customer notifications
router.get('/list', async (req, res) => {
  try {
    const customerId = req.session?.user?.id || 'demo-customer';
    
    const notifications = await notificationService.getCustomerNotifications(customerId);

    res.json({
      success: true,
      notifications,
      count: notifications.length
    });

  } catch (error: any) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get notifications',
      details: error.message
    });
  }
});

// Cancel specific notification
router.delete('/:notificationId', async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const cancelled = await notificationService.cancelNotification(notificationId);

    if (cancelled) {
      res.json({
        success: true,
        message: 'Notification cancelled successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

  } catch (error: any) {
    console.error('Cancel notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel notification',
      details: error.message
    });
  }
});

// Manual trigger for specific notification types
router.post('/trigger', async (req, res) => {
  try {
    const { type, customerId: targetCustomerId } = req.body;
    const customerId = targetCustomerId || req.session?.user?.id || 'demo-customer';
    const brandId = 'brezcode'; // Default brand

    // Generate personalized notification
    const message = await notificationService.generatePersonalizedNotification(
      customerId,
      brandId,
      type
    );

    // Send immediately
    const sent = await notificationService.sendWebPushNotification(
      customerId,
      notificationService['getNotificationTitle'](type), // Access private method for demo
      message,
      '/health-icon.png',
      '/health-badge.png',
      { type, brandId, manual: true }
    );

    if (sent) {
      res.json({
        success: true,
        message: `${type} notification sent successfully`,
        content: message
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Failed to send notification - no subscription found'
      });
    }

  } catch (error: any) {
    console.error('Trigger notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to trigger notification',
      details: error.message
    });
  }
});

export default router;