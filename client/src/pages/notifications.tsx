import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Calendar, Settings, Smartphone, Clock, Heart, User, MessageSquare } from 'lucide-react';
import WebPushNotifications from '@/components/WebPushNotifications';

export default function NotificationsPage() {
  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Bell className="h-8 w-8 text-blue-600" />
          Health Notifications
        </h1>
        <p className="text-muted-foreground">
          Stay connected to your wellness journey with smart, personalized notifications
        </p>
      </div>

      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="iphone">iPhone Widget</TabsTrigger>
        </TabsList>

        {/* Setup Tab */}
        <TabsContent value="setup" className="space-y-6">
          <WebPushNotifications />
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Notification Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                
                {/* Daily Health Tips */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-red-500" />
                    <div>
                      <h3 className="font-medium">Daily Health Tips</h3>
                      <p className="text-sm text-muted-foreground">Personalized guidance every morning</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">9:00 AM</Badge>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>

                {/* Exercise Reminders */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <div>
                      <h3 className="font-medium">Exercise Reminders</h3>
                      <p className="text-sm text-muted-foreground">Time for your scheduled workouts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">6:00 PM</Badge>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>

                {/* Self-Exam Reminders */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-purple-500" />
                    <div>
                      <h3 className="font-medium">Self-Exam Reminders</h3>
                      <p className="text-sm text-muted-foreground">Monthly breast health checks</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Monthly</Badge>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>

                {/* Wellness Check-ins */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-green-500" />
                    <div>
                      <h3 className="font-medium">Wellness Check-ins</h3>
                      <p className="text-sm text-muted-foreground">Track your progress and mood</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Weekly</Badge>
                    <Badge variant="outline">Paused</Badge>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Customize Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Daily Health Tip: Stress Management</p>
                    <p className="text-sm text-muted-foreground">
                      Take 5 minutes today for deep breathing exercises to reduce stress hormones...
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Exercise Reminder</p>
                    <p className="text-sm text-muted-foreground">
                      Time for your evening walk! Fresh air boosts immune function.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Yesterday, 6:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="h-2 w-2 bg-purple-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Weekly Progress Check</p>
                    <p className="text-sm text-muted-foreground">
                      How are you feeling this week? Share your wellness journey progress.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* iPhone Widget Tab */}
        <TabsContent value="iphone" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                iPhone Widget Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Widget Preview */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border">
                <h3 className="font-semibold mb-4">Widget Preview</h3>
                <div className="bg-white rounded-xl p-4 shadow-sm max-w-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Heart className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Health Tip</p>
                      <p className="text-xs text-gray-600">Today</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 mb-3">
                    Take 5 minutes for deep breathing to reduce stress hormones and support immune function.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">3 day streak</span>
                    </div>
                    <button className="text-blue-600 text-xs font-medium">View More</button>
                  </div>
                </div>
              </div>

              {/* Setup Instructions */}
              <div className="space-y-4">
                <h3 className="font-semibold">Setup Instructions</h3>
                
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">1</div>
                    <div>
                      <p className="font-medium">Add to Home Screen</p>
                      <p className="text-sm text-muted-foreground">
                        Open this site in Safari and tap the Share button, then "Add to Home Screen"
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">2</div>
                    <div>
                      <p className="font-medium">Enable Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Allow notifications when prompted for real-time health tips
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">3</div>
                    <div>
                      <p className="font-medium">Add Widget to Home Screen</p>
                      <p className="text-sm text-muted-foreground">
                        Long press your home screen &rarr; tap "+" &rarr; search for your health app &rarr; add widget
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">4</div>
                    <div>
                      <p className="font-medium">Customize Widget</p>
                      <p className="text-sm text-muted-foreground">
                        Choose widget size and position for easy access to your daily health insights
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Widget Features */}
              <div className="space-y-4">
                <h3 className="font-semibold">Widget Features</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Daily Health Tips</h4>
                    <p className="text-sm text-muted-foreground">
                      Quick access to personalized health guidance without opening the app
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Progress Tracking</h4>
                    <p className="text-sm text-muted-foreground">
                      View your wellness streak and daily activity completion status
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Quick Actions</h4>
                    <p className="text-sm text-muted-foreground">
                      Log activities, access reminders, and track health metrics instantly
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Smart Reminders</h4>
                    <p className="text-sm text-muted-foreground">
                      Time-aware notifications that adapt to your schedule and preferences
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <div className="text-yellow-600">💡</div>
                  <div>
                    <p className="font-medium text-yellow-800">Pro Tip</p>
                    <p className="text-sm text-yellow-700">
                      For the best widget experience, enable "Always Show Previews" in your iPhone Settings &rarr; Notifications &rarr; Health App
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}