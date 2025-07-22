import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { useLocation } from 'wouter';
import TopNavigation from "@/components/TopNavigation";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User,
  Calendar,
  TrendingUp,
  Target,
  Heart,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Award,
  Flame,
  BarChart3,
  Activity,
  Smartphone,
  Bell,
  ArrowLeft,
  Apple,
  Brain,
  Building2
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface DashboardStats {
  weeklyGoalProgress: number;
  currentStreak: number;
  totalActivities: number;
  weeklyMinutes: number;
  healthScore: number;
}

interface ScheduledActivity {
  id: string;
  title: string;
  description: string;
  scheduledDate: string;
  duration: number;
  category: string;
  completed: boolean;
  instructions?: string;
}

export default function UserHomepage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your personal health assistant. I can help you with wellness questions, provide guidance on breast health, and support your health journey. What can I help you with today?',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId] = useState(`session-${Date.now()}`);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Fetch user information
  const { data: currentUser } = useQuery({
    queryKey: ['/api/me'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/me');
      const data = await response.json();
      return data.user;
    }
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch dashboard stats
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/health/stats'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/health/stats');
      const data = await response.json();
      return data.stats as DashboardStats;
    }
  });

  // Fetch today's activities
  const { data: todayActivities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['/api/health/daily-plan', format(selectedDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const response = await apiRequest('GET', `/api/health/daily-plan?date=${dateStr}`);
      const data = await response.json();
      return data.activities as ScheduledActivity[];
    }
  });

  // Fetch weekly schedule
  const { data: weeklySchedule } = useQuery({
    queryKey: ['/api/health/activities', format(startOfWeek(selectedDate), 'yyyy-MM-dd')],
    queryFn: async () => {
      const startDate = format(startOfWeek(selectedDate), 'yyyy-MM-dd');
      const endDate = format(addDays(startOfWeek(selectedDate), 6), 'yyyy-MM-dd');
      const response = await apiRequest('GET', `/api/health/activities?startDate=${startDate}&endDate=${endDate}`);
      const data = await response.json();
      return data.activities as ScheduledActivity[];
    }
  });

  // Fetch Apple Watch health data
  const { data: appleWatchData, isLoading: appleWatchLoading } = useQuery({
    queryKey: ['/api/apple-health/metrics'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/apple-health/metrics');
      const data = await response.json();
      return data.metrics;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: false, // Don't retry if no data
  });

  // Send message to AI
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/brand-ai/chat", {
        brandId: 'brezcode',
        sessionId,
        message,
        language: 'en',
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response || data.message || 'I apologize, but I couldn\'t generate a response.',
        timestamp: data.timestamp || new Date().toISOString(),
      }]);
    },
    onError: (error: any) => {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date().toISOString(),
      }]);
    }
  });

  // Complete activity
  const completeActivityMutation = useMutation({
    mutationFn: async (activityId: string) => {
      const response = await apiRequest('POST', `/api/health/activities/${activityId}/complete`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/health/daily-plan'] });
      queryClient.invalidateQueries({ queryKey: ['/api/health/stats'] });
    }
  });

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || sendMessageMutation.isPending) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    sendMessageMutation.mutate(inputMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderWeeklyCalendar = () => {
    const weekStart = startOfWeek(selectedDate);
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    return (
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const dayActivities = weeklySchedule?.filter(activity => 
            isSameDay(new Date(activity.scheduledDate), day)
          ) || [];
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, selectedDate);

          return (
            <div
              key={index}
              className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                isSelected 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : isToday 
                    ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20' 
                    : 'hover:bg-muted'
              }`}
              onClick={() => setSelectedDate(day)}
            >
              <div className="text-center">
                <div className="text-xs font-medium mb-1">
                  {format(day, 'EEE')}
                </div>
                <div className="text-sm font-bold mb-1">
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayActivities.slice(0, 2).map((activity, idx) => (
                    <div 
                      key={idx}
                      className={`w-full h-1 rounded ${
                        activity.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                  {dayActivities.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayActivities.length - 2}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Top Navigation */}
      <TopNavigation />
      
      <div className="container mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome Back{currentUser ? `, ${currentUser.firstName}!` : '!'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {currentUser?.email && (
                <span className="text-sm text-blue-600 dark:text-blue-400 block">
                  {currentUser.email}
                </span>
              )}
              Your personalized dashboard
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white">
              {format(new Date(), 'EEEE, MMM d')}
            </Badge>
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Dashboard Stats */}
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {statsLoading ? (
                  <div className="animate-pulse space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Weekly Goal</span>
                        <span className="text-sm text-muted-foreground">
                          {dashboardStats?.weeklyGoalProgress || 0}%
                        </span>
                      </div>
                      <Progress value={dashboardStats?.weeklyGoalProgress || 0} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Flame className="h-4 w-4 text-orange-500" />
                          <span className="text-xs font-medium">Streak</span>
                        </div>
                        <div className="text-lg font-bold text-orange-600">
                          {dashboardStats?.currentStreak || 0}
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Award className="h-4 w-4 text-green-500" />
                          <span className="text-xs font-medium">Activities</span>
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          {dashboardStats?.totalActivities || 0}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Health Score</span>
                        <span className="text-sm font-bold text-primary">
                          {dashboardStats?.healthScore || 0}/100
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Based on your activities and consistency
                      </div>
                    </div>

                    {/* Business Selection */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2 mb-3">
                        <Building2 className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Your Businesses</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div 
                          className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg cursor-pointer hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
                          onClick={() => setLocation('/business/brezcode/dashboard')}
                        >
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-pink-500" />
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">BrezCode</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Health & Wellness</div>
                            </div>
                          </div>
                          <Badge className="mt-2 bg-green-100 text-green-800 text-xs">Admin</Badge>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-xs"
                          onClick={() => setLocation('/business-selector')}
                        >
                          View All Businesses
                        </Button>
                      </div>
                    </div>

                    {/* Apple Watch Health Data */}
                    {appleWatchData && !appleWatchLoading && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center gap-2 mb-3">
                          <Activity className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium">Apple Watch</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded">
                            <div className="flex items-center gap-1 mb-1">
                              <Heart className="h-3 w-3 text-red-500" />
                              <span className="font-medium">Heart Rate</span>
                            </div>
                            <div className="text-sm font-bold text-red-600">
                              {appleWatchData.heartRate} bpm
                            </div>
                          </div>

                          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                            <div className="flex items-center gap-1 mb-1">
                              <Activity className="h-3 w-3 text-blue-500" />
                              <span className="font-medium">Steps</span>
                            </div>
                            <div className="text-sm font-bold text-blue-600">
                              {appleWatchData.steps?.toLocaleString() || 0}
                            </div>
                          </div>

                          <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
                            <div className="flex items-center gap-1 mb-1">
                              <Flame className="h-3 w-3 text-orange-500" />
                              <span className="font-medium">Calories</span>
                            </div>
                            <div className="text-sm font-bold text-orange-600">
                              {appleWatchData.caloriesBurned}
                            </div>
                          </div>

                          <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                            <div className="flex items-center gap-1 mb-1">
                              <Clock className="h-3 w-3 text-purple-500" />
                              <span className="font-medium">Sleep</span>
                            </div>
                            <div className="text-sm font-bold text-purple-600">
                              {appleWatchData.sleepHours ? `${appleWatchData.sleepHours.toFixed(1)}h` : '0h'}
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 text-xs text-muted-foreground text-center">
                          Last sync: {appleWatchData.lastSync ? 
                            format(new Date(appleWatchData.lastSync), 'MMM d, h:mm a') : 
                            'Never'
                          }
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5" />
                  Week Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderWeeklyCalendar()}
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - AI Chat Interface */}
          <div className="lg:col-span-6">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">AI Health Assistant</div>
                    <div className="text-sm opacity-90">
                      Ask me anything about your health journey
                    </div>
                  </div>
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages Area */}
                <div 
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                  style={{ maxHeight: '450px' }}
                >
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start gap-2 max-w-[80%] ${
                        message.role === 'user' ? 'flex-row-reverse' : ''
                      }`}>
                        <Avatar className="w-8 h-8 mt-1">
                          <AvatarFallback className={
                            message.role === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-green-100 text-green-600'
                          }>
                            {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-sm'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm'
                        }`}>
                          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                          <div className={`text-xs mt-1 opacity-70`}>
                            {format(new Date(message.timestamp), 'HH:mm')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {sendMessageMutation.isPending && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-2">
                        <Avatar className="w-8 h-8 mt-1">
                          <AvatarFallback className="bg-green-100 text-green-600">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg rounded-bl-sm">
                          <div className="flex items-center gap-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-xs text-gray-500">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about your health, get wellness tips, or schedule activities..."
                      className="flex-1"
                      disabled={sendMessageMutation.isPending}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || sendMessageMutation.isPending}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      AI-powered with brand knowledge
                    </div>
                    <div>Press Enter to send</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Today's Schedule */}
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5" />
                  Today's Plan
                  <Badge variant="secondary" className="ml-auto">
                    {format(selectedDate, 'MMM d')}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activitiesLoading ? (
                  <div className="animate-pulse space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ) : todayActivities && todayActivities.length > 0 ? (
                  <div className="space-y-3">
                    {todayActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className={`p-3 rounded-lg border transition-all ${
                          activity.completed 
                            ? 'bg-green-50 border-green-200 dark:bg-green-900/20' 
                            : 'bg-white dark:bg-gray-800 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`font-medium text-sm ${
                              activity.completed ? 'text-green-700 dark:text-green-300' : ''
                            }`}>
                              {activity.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {activity.duration}min • {activity.category}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant={activity.completed ? "outline" : "default"}
                            onClick={() => completeActivityMutation.mutate(activity.id)}
                            disabled={activity.completed || completeActivityMutation.isPending}
                            className="ml-2"
                          >
                            {activity.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No activities scheduled for today</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <span>Plan Your Day</span>
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => setLocation('/brezcode/health-calendar')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Health Calendar
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => setLocation('/brezcode/notifications')}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Push Notifications
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => setLocation('/brezcode/notifications?tab=iphone')}
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Create iPhone Widget
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => setLocation('/brezcode/notifications?tab=watch')}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Connect Apple Watch
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => setLocation('/brezcode/food-analysis')}
                >
                  <Apple className="h-4 w-4 mr-2" />
                  Analyze Food
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => setLocation('/brezcode/dietary-recommendations')}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Meal Plans (AI)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}