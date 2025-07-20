import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Settings, Smartphone, CheckCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface NotificationPreferences {
  enableDailyTips: boolean;
  enableReminders: boolean;
  enableCheckIns: boolean;
  preferredTime: string;
  frequency: string;
}

export default function WebPushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enableDailyTips: true,
    enableReminders: true,
    enableCheckIns: false,
    preferredTime: '09:00',
    frequency: 'daily'
  });

  useEffect(() => {
    checkNotificationSupport();
    checkExistingSubscription();
  }, []);

  const checkNotificationSupport = () => {
    if ('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window) {
      setIsSupported(true);
      console.log('🔔 Web push notifications are supported');
    } else {
      console.log('❌ Web push notifications are not supported');
    }
  };

  const checkExistingSubscription = async () => {
    if (!isSupported) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
      
      if (subscription) {
        console.log('✅ Found existing push subscription');
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('❌ This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      console.log('❌ Notification permission denied');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  };

  const subscribeToPush = async () => {
    if (!isSupported) {
      alert('Push notifications are not supported in this browser');
      return;
    }

    setIsLoading(true);
    
    try {
      // Request notification permission
      const permissionGranted = await requestNotificationPermission();
      
      if (!permissionGranted) {
        alert('Notification permission is required for health reminders');
        setIsLoading(false);
        return;
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('📱 Service worker registered');

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array('BEl62iUYgUivxIkv69yViEuiBIa40HI6YUd_Xo-5Bm5Mv2JO9JpDXhNGxpOq2CHM_JbkfSNp-LfG8eo-J5zEDrQ') // Example VAPID key
      });

      console.log('🔔 Push subscription created:', subscription);

      // Send subscription to server
      await apiRequest('POST', '/api/notifications/subscribe', {
        subscription: subscription.toJSON(),
        preferences
      });

      setIsSubscribed(true);
      console.log('✅ Successfully subscribed to push notifications');

      // Show test notification
      await showTestNotification();
      
    } catch (error: any) {
      console.error('❌ Failed to subscribe to push notifications:', error);
      alert('Failed to enable notifications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribeFromPush = async () => {
    setIsLoading(true);
    
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        await apiRequest('POST', '/api/notifications/unsubscribe');
        setIsSubscribed(false);
        console.log('🔕 Unsubscribed from push notifications');
      }
    } catch (error: any) {
      console.error('❌ Failed to unsubscribe:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const showTestNotification = async () => {
    try {
      await apiRequest('POST', '/api/notifications/test', {
        title: '🌟 Welcome to Health Notifications!',
        body: 'You\'ll receive personalized health tips and reminders.',
        icon: '/health-icon.png'
      });
      
      console.log('📲 Test notification sent');
    } catch (error) {
      console.error('❌ Failed to send test notification:', error);
    }
  };

  const sendBreastHealthTip = async () => {
    try {
      // Show immediate browser notification for demo
      if (typeof window !== 'undefined' && 'Notification' in window && window.Notification.permission === 'granted') {
        new window.Notification('🌸 Daily Breast Health Tip', {
          body: 'Take 5 minutes today for deep breathing exercises. Stress reduction can help lower cortisol levels and support immune function.',
          icon: '/health-icon.png',
          tag: 'health-tip'
        });
      }

      await apiRequest('POST', '/api/notifications/test', {
        title: '🌸 Daily Breast Health Tip',
        body: 'Take 5 minutes today for deep breathing exercises. Stress reduction can help lower cortisol levels and support immune function.',
        icon: '/health-icon.png'
      });
      
      console.log('📲 Breast health tip notification sent');
    } catch (error) {
      console.error('❌ Failed to send health tip notification:', error);
    }
  };

  const updatePreferences = async (newPreferences: Partial<NotificationPreferences>) => {
    const updatedPreferences = { ...preferences, ...newPreferences };
    setPreferences(updatedPreferences);

    if (isSubscribed) {
      try {
        await apiRequest('POST', '/api/notifications/preferences', {
          preferences: updatedPreferences
        });
        console.log('⚙️ Notification preferences updated');
      } catch (error) {
        console.error('❌ Failed to update preferences:', error);
      }
    }
  };

  // Convert VAPID key
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Notifications Not Supported
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Your browser doesn't support push notifications. Consider upgrading to a modern browser for the best health tracking experience.
          </p>
          <div className="space-y-2">
            <p className="text-sm">✅ Chrome, Firefox, Safari (latest versions)</p>
            <p className="text-sm">✅ iPhone: Add to Home Screen for notification support</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Health Notifications
            {isSubscribed && <Badge variant="secondary">Active</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Get personalized health tips, reminders, and check-ins delivered directly to your device.
          </p>
          
          {!isSubscribed ? (
            <Button 
              onClick={subscribeToPush}
              disabled={isLoading}
              className="w-full"
            >
              <Bell className="h-4 w-4 mr-2" />
              {isLoading ? 'Enabling...' : 'Enable Notifications'}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                Notifications are active
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Button 
                  onClick={sendBreastHealthTip}
                  variant="default"
                  size="sm"
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  🌸 Demo Health Tip
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={showTestNotification}
                    variant="outline"
                    size="sm"
                  >
                    Test Notification
                  </Button>
                  <Button 
                    onClick={unsubscribeFromPush}
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Disabling...' : 'Disable'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      {isSubscribed && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Daily Health Tips */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Daily Health Tips</label>
                <p className="text-xs text-muted-foreground">
                  Receive personalized health guidance daily
                </p>
              </div>
              <Switch
                checked={preferences.enableDailyTips}
                onCheckedChange={(checked) => updatePreferences({ enableDailyTips: checked })}
              />
            </div>

            {/* Health Reminders */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Health Reminders</label>
                <p className="text-xs text-muted-foreground">
                  Reminders for scheduled health activities
                </p>
              </div>
              <Switch
                checked={preferences.enableReminders}
                onCheckedChange={(checked) => updatePreferences({ enableReminders: checked })}
              />
            </div>

            {/* Wellness Check-ins */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Wellness Check-ins</label>
                <p className="text-xs text-muted-foreground">
                  Periodic prompts to track your progress
                </p>
              </div>
              <Switch
                checked={preferences.enableCheckIns}
                onCheckedChange={(checked) => updatePreferences({ enableCheckIns: checked })}
              />
            </div>

            {/* Preferred Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Time</label>
              <select 
                value={preferences.preferredTime}
                onChange={(e) => updatePreferences({ preferredTime: e.target.value })}
                className="w-full p-2 border rounded-md text-sm"
              >
                <option value="07:00">7:00 AM</option>
                <option value="09:00">9:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="18:00">6:00 PM</option>
                <option value="20:00">8:00 PM</option>
              </select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* iPhone Widget Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            iPhone Widget Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            For the best iPhone experience with notifications and widget support:
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="font-medium">1.</span>
              <span>Open this site in Safari</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium">2.</span>
              <span>Tap the Share button</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium">3.</span>
              <span>Select "Add to Home Screen"</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium">4.</span>
              <span>Enable notifications when prompted</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              💡 Once added to your home screen, you can add health widgets to your iPhone home screen 
              and receive native push notifications just like any other app!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}