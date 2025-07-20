import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Heart, Clock, User, MessageSquare, Play } from 'lucide-react';

const healthTips = [
  {
    title: "🌸 Daily Breast Health Tip",
    body: "Take 5 minutes today for deep breathing exercises. Stress reduction can help lower cortisol levels and support immune function.",
    type: "stress"
  },
  {
    title: "💪 Exercise Reminder",
    body: "Time for your 20-minute walk! Regular physical activity can reduce breast cancer risk by up to 25%.",
    type: "exercise"
  },
  {
    title: "🥗 Nutrition Tip",
    body: "Include cruciferous vegetables in your meals today. Broccoli, kale, and Brussels sprouts contain compounds that support breast health.",
    type: "nutrition"
  },
  {
    title: "🔍 Self-Exam Reminder",
    body: "Monthly breast self-examination reminder: Check for any changes in size, shape, or texture. Early detection saves lives.",
    type: "exam"
  },
  {
    title: "😴 Sleep Health",
    body: "Aim for 7-9 hours of quality sleep tonight. Good sleep supports immune function and hormone balance.",
    type: "sleep"
  }
];

export default function NotificationDemo() {
  const [lastSent, setLastSent] = useState<string>('');
  const [notificationCount, setNotificationCount] = useState(0);

  const sendDemoNotification = (tip: typeof healthTips[0]) => {
    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(tip.title, {
        body: tip.body,
        icon: '/health-icon.png',
        tag: `health-tip-${tip.type}`,
        requireInteraction: true
      });
    }

    setLastSent(tip.title);
    setNotificationCount(prev => prev + 1);

    // Also show in-page notification for demo
    const notificationEl = document.createElement('div');
    notificationEl.className = 'fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50 animate-in slide-in-from-right';
    notificationEl.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="h-8 w-8 bg-pink-100 rounded-full flex items-center justify-center">
          <svg class="h-4 w-4 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <div class="flex-1">
          <p class="font-medium text-sm">${tip.title}</p>
          <p class="text-xs text-gray-600 mt-1">${tip.body}</p>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="text-gray-400 hover:text-gray-600">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    `;
    
    document.body.appendChild(notificationEl);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notificationEl.parentNode) {
        notificationEl.remove();
      }
    }, 5000);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        sendDemoNotification(healthTips[0]);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5 text-blue-600" />
          Live Notification Demo
          {notificationCount > 0 && (
            <Badge variant="secondary">{notificationCount} sent</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Demo Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Try the demo:</strong> Click any notification type below to see how breast health tips appear on your device
          </p>
          {Notification.permission !== 'granted' && (
            <Button 
              onClick={requestNotificationPermission}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Enable Browser Notifications First
            </Button>
          )}
        </div>

        {/* Notification Types */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-muted-foreground">NOTIFICATION TYPES</h3>
          
          {healthTips.map((tip, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-pink-100 rounded-full flex items-center justify-center">
                  {tip.type === 'stress' && <Heart className="h-4 w-4 text-pink-600" />}
                  {tip.type === 'exercise' && <Clock className="h-4 w-4 text-pink-600" />}
                  {tip.type === 'nutrition' && <Heart className="h-4 w-4 text-pink-600" />}
                  {tip.type === 'exam' && <User className="h-4 w-4 text-pink-600" />}
                  {tip.type === 'sleep' && <MessageSquare className="h-4 w-4 text-pink-600" />}
                </div>
                <div>
                  <p className="font-medium text-sm">{tip.title}</p>
                  <p className="text-xs text-muted-foreground">{tip.body.substring(0, 60)}...</p>
                </div>
              </div>
              <Button
                onClick={() => sendDemoNotification(tip)}
                size="sm"
                variant="outline"
              >
                Send
              </Button>
            </div>
          ))}
        </div>

        {/* Last Sent Status */}
        {lastSent && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <strong>✅ Last sent:</strong> {lastSent}
            </p>
          </div>
        )}

        {/* Demo Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex gap-2">
            <div className="text-yellow-600">💡</div>
            <div>
              <p className="font-medium text-yellow-800">How it works</p>
              <p className="text-sm text-yellow-700">
                On mobile devices, these notifications appear in your notification center just like native app notifications. You can also add this web app to your iPhone home screen for the full widget experience.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}