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
      detail: "Once the app is on your home screen, long press an empty area, tap the '+' button, and search for the health app to add widgets."
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
      alert('App is already installed! 🎉\n\nTo add widgets:\n1. Long press your home screen\n2. Tap the "+" button\n3. Search for your health app\n4. Select widget size and add');
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
                      alert('✅ URL copied! Now:\n\n1. Open Safari on your iPhone\n2. Paste this URL\n3. Follow the widget setup steps');
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

          {/* Benefits */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Widget Benefits</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Daily health tips without opening the app</li>
              <li>• Quick access to your health calendar</li>
              <li>• Native iPhone notifications</li>
              <li>• Glanceable health information</li>
              <li>• Personalized reminders and tips</li>
            </ul>
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