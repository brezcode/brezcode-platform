import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Smartphone, 
  Share, 
  Plus, 
  Home, 
  CheckCircle, 
  ArrowRight,
  Download,
  Bell,
  Heart,
  Calendar
} from 'lucide-react';

export default function IPhoneWidgetGuide() {
  const [showDetailedGuide, setShowDetailedGuide] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Open in Safari",
      description: "Copy the website URL and open it in Safari on your iPhone",
      icon: <Smartphone className="h-6 w-6" />,
      detail: "Copy this URL: " + window.location.href + "\n\nThen on your iPhone:\n1. Open Safari app\n2. Paste the URL in the address bar\n3. Visit the website\n\nNote: Chrome/other browsers won't work for widgets"
    },
    {
      title: "Tap Share Button",
      description: "Tap the Share button at the bottom of your screen",
      icon: <Share className="h-6 w-6" />,
      detail: "Look for the square with an arrow pointing up. It's usually at the bottom center of Safari."
    },
    {
      title: "Add to Home Screen",
      description: "Select 'Add to Home Screen' from the menu",
      icon: <Home className="h-6 w-6" />,
      detail: "Scroll down in the share menu if you don't see it immediately. The icon looks like a plus sign on a square."
    },
    {
      title: "Add Widget",
      description: "Long press home screen, tap '+', search for your app",
      icon: <Plus className="h-6 w-6" />,
      detail: "After adding the app to home screen:\n\n1. Long press any EMPTY area on your home screen (not on an app)\n2. All apps will start wiggling\n3. Look for a '+' button in the TOP LEFT corner\n4. Tap the '+' button\n5. Search for your health app name\n6. Select widget size and tap 'Add Widget'\n7. Tap 'Done' in top right corner"
    }
  ];

  const widgetTypes = [
    {
      name: "Daily Health Tip",
      description: "Get personalized breast health tips every day",
      icon: <Heart className="h-5 w-5 text-pink-500" />,
      size: "Small",
      frequency: "Daily"
    },
    {
      name: "Activity Reminder",
      description: "Your scheduled health activities and reminders",
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
      size: "Medium",
      frequency: "Real-time"
    },
    {
      name: "Health Notifications",
      description: "Important health alerts and tips",
      icon: <Bell className="h-5 w-5 text-green-500" />,
      size: "Small",
      frequency: "As needed"
    }
  ];

  const installPWA = () => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      alert('App is already installed! 🎉\n\nNote: Web apps may not support widgets yet.\n\nBut you can still:\n• Get push notifications\n• Use app from home screen\n• Access all health features\n\nTap "Enable Notifications" in the app for alerts!');
      return;
    }

    // Show installation guide
    setShowDetailedGuide(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-blue-600" />
            iPhone Widget Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Website URL Display */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-blue-900">Website URL for iPhone</h3>
                <p className="text-sm text-blue-700">Copy this URL and open it in Safari on your iPhone</p>
              </div>
              
              <div className="bg-white border rounded-lg p-3">
                <code className="text-sm text-gray-800 break-all">
                  {typeof window !== 'undefined' ? window.location.href : 'Loading...'}
                </code>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      navigator.clipboard.writeText(window.location.href);
                      alert('✅ URL copied! Now:\n\n1. Open Safari on your iPhone\n2. Paste this URL and visit it\n3. Tap Share button (square with arrow)\n4. Select "Add to Home Screen"\n5. Long press empty home screen area\n6. Look for "+" in TOP LEFT corner\n7. Search for your health app\n8. Add widget!');
                    }
                  }}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Copy URL
                </Button>
                <Button 
                  onClick={installPWA}
                  size="sm"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Show Guide
                </Button>
              </div>
            </div>
          </div>

          {/* Widget Types */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Available Widgets</h3>
            <div className="grid gap-3">
              {widgetTypes.map((widget, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      {widget.icon}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{widget.name}</p>
                      <p className="text-xs text-gray-600">{widget.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-1">{widget.size}</Badge>
                    <p className="text-xs text-gray-500">{widget.frequency}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Guide */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Step-by-Step Guide</h3>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-full mt-1">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{step.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                  </div>
                  <div className="text-blue-600 font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-900 mb-2">Troubleshooting Common Issues</h3>
            <div className="text-sm text-yellow-800 space-y-3">
              
              <div>
                <p><strong>Can't find the app on home screen?</strong></p>
                <ul className="list-disc ml-4 space-y-1 mt-1">
                  <li>Swipe right to check additional home screen pages</li>
                  <li>Check the App Library (swipe left to the end)</li>
                  <li>Search by swiping down on home screen and typing "health" or "brez"</li>
                  <li>The app might have a generic name like "Web App" or the website domain</li>
                </ul>
              </div>

              <div>
                <p><strong>Can't find the '+' button for widgets?</strong></p>
                <ol className="list-decimal ml-4 space-y-1 mt-1">
                  <li>Long press an EMPTY space on home screen (not on any app icon)</li>
                  <li>Apps will start wiggling/jiggling</li>
                  <li>Look in the TOP LEFT corner for a small '+' symbol</li>
                  <li>If no '+' appears, try pressing and holding longer</li>
                  <li>On older iPhones, the '+' might be at the top center</li>
                </ol>
              </div>

              <div>
                <p><strong>Can't search for the app in widgets?</strong></p>
                <ul className="list-disc ml-4 space-y-1 mt-1">
                  <li>Make sure iOS is updated (widgets require iOS 14+)</li>
                  <li>Try searching for "web", "health", or the exact app name</li>
                  <li>The app may not support widgets yet - this is normal for web apps</li>
                  <li>Focus on using the app from home screen instead</li>
                </ul>
              </div>

              <p className="mt-2 font-medium">
                <strong>Alternative:</strong> Even without widgets, you'll get push notifications when you enable them in the app!
              </p>
            </div>
          </div>

          {/* Alternative: Push Notifications */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Good News: Push Notifications Work!</h3>
            <div className="text-sm text-green-800 space-y-2">
              <p>Even if widgets aren't available, you still get all the benefits:</p>
              <ul className="list-disc ml-4 space-y-1">
                <li>Daily health tips sent directly to your iPhone</li>
                <li>Activity reminders and alerts</li>
                <li>Native iPhone notifications</li>
                <li>Health calendar access from home screen</li>
                <li>No need to open the app constantly</li>
              </ul>
              <div className="bg-white border border-green-300 rounded p-3 mt-3">
                <p className="font-medium text-green-900">Next Step:</p>
                <p>Go to the "Live Demo" tab and enable push notifications to start receiving health tips!</p>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Detailed Guide Dialog */}
      <Dialog open={showDetailedGuide} onOpenChange={setShowDetailedGuide}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>iPhone Widget Installation</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Current Step: {steps[currentStep]?.title}</h3>
              <div className="text-sm text-blue-800 mb-3 whitespace-pre-line">{steps[currentStep]?.detail}</div>
              
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                
                <span className="text-sm text-blue-600">
                  {currentStep + 1} of {steps.length}
                </span>
                
                <Button 
                  size="sm"
                  onClick={() => {
                    if (currentStep < steps.length - 1) {
                      setCurrentStep(currentStep + 1);
                    } else {
                      setShowDetailedGuide(false);
                      alert('🎉 Installation complete!\n\nYour health app is now available as an iPhone widget. Long press your home screen and tap "+" to add widgets.');
                    }
                  }}
                >
                  {currentStep < steps.length - 1 ? 'Next' : 'Complete'}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div 
                  key={index}
                  className={`h-2 flex-1 rounded ${
                    index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}