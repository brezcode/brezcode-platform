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
import { format } from 'date-fns';
import { useLocation } from 'wouter';
import TopNavigation from "@/components/TopNavigation";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User,
  TrendingUp,
  Target,
  Clock,
  CheckCircle,
  Sparkles,
  ChevronRight,
  BarChart3,
  Zap,
  Users,
  Mail,
  MessageSquare,
  Calendar,
  Settings,
  Laptop,
  Building2,
  Award,
  DollarSign,
  Phone,
  Smartphone
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface LeadGenDashboardStats {
  totalStrategies: number;
  activeTools: number;
  completedActions: number;
  customerInteractions: number;
  leadsGenerated: number;
  salesClosed: number;
  aiConversations: number;
  avatarTrainingMinutes: number;
  landingPagesCreated: number;
  emailCampaignsSent: number;
  smsCampaignsSent: number;
}

export default function LeadGenDashboard() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI business assistant. I can help you with lead generation strategies, sales automation, customer service, and growing your business. What would you like to work on today?',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current user info
  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: ['/api/me'],
    enabled: true,
  });

  // Get LeadGen dashboard stats (different from health stats)
  const { data: dashboardStats, isLoading: statsLoading } = useQuery<LeadGenDashboardStats>({
    queryKey: ['/api/leadgen/dashboard-stats'],
    enabled: !!currentUser,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('/api/leadgen/chat', {
        method: 'POST',
        body: { message, conversationHistory: messages },
      });
      return response;
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
      }]);
      setIsSending(false);
    },
    onError: () => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date().toISOString(),
      }]);
      setIsSending(false);
    }
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || isSending) return;

    const userMessage = currentMessage.trim();
    setCurrentMessage('');
    setIsSending(true);

    // Add user message immediately
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    }]);

    // Send to AI
    sendMessage.mutate(userMessage);
  };

  // Quick Actions for LeadGen Platform (Business-focused)
  const quickActions = [
    {
      title: "Setup AI Avatar",
      description: "Create your AI sales assistant",
      icon: <Bot className="h-5 w-5" />,
      action: () => setLocation('/avatar-setup'),
      color: "bg-blue-500"
    },
    {
      title: "Create Landing Page",
      description: "Build high-converting landing pages",
      icon: <Laptop className="h-5 w-5" />,
      action: () => setLocation('/business-landing-creator'),
      color: "bg-purple-500"
    },
    {
      title: "Lead Generation",
      description: "Automate your lead capture process",
      icon: <Users className="h-5 w-5" />,
      action: () => setLocation('/lead-generation'),
      color: "bg-green-500"
    },
    {
      title: "Email Campaigns",
      description: "Send automated email sequences",
      icon: <Mail className="h-5 w-5" />,
      action: () => setLocation('/email-campaigns'),
      color: "bg-orange-500"
    },
    {
      title: "SMS Marketing",
      description: "Reach customers via SMS",
      icon: <Smartphone className="h-5 w-5" />,
      action: () => setLocation('/sms-campaigns'),
      color: "bg-pink-500"
    },
    {
      title: "Business Consultant",
      description: "Get AI-powered business strategies",
      icon: <Target className="h-5 w-5" />,
      action: () => setLocation('/business-consultant'),
      color: "bg-indigo-500"
    },
    {
      title: "AI Training",
      description: "Train your AI assistants",
      icon: <Sparkles className="h-5 w-5" />,
      action: () => setLocation('/ai-trainer'),
      color: "bg-yellow-500"
    },
    {
      title: "Profile Settings",
      description: "Manage your business profile",
      icon: <Settings className="h-5 w-5" />,
      action: () => setLocation('/user-profile'),
      color: "bg-gray-500"
    }
  ];

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <TopNavigation />
      
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {currentUser?.firstName || 'User'}!
              </h1>
              <p className="text-gray-600">
                {currentUser?.email && (
                  <span className="text-sm text-blue-600 dark:text-blue-400 block">
                    {currentUser.email}
                  </span>
                )}
                Your business automation dashboard
              </p>
            </div>
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
          {/* Left Panel - Business Dashboard Stats */}
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5" />
                  Business Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {statsLoading ? (
                  <div className="animate-pulse space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="h-4 w-4 text-green-500" />
                          <span className="text-xs font-medium">Leads</span>
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          {dashboardStats?.leadsGenerated || 0}
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="h-4 w-4 text-blue-500" />
                          <span className="text-xs font-medium">Sales</span>
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          {dashboardStats?.salesClosed || 0}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Active Tools</span>
                        <span className="text-sm text-muted-foreground">
                          {dashboardStats?.activeTools || 0}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        AI Avatar, Landing Pages, Email, SMS
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                        <div className="flex items-center gap-1 mb-1">
                          <Mail className="h-3 w-3 text-purple-500" />
                          <span className="font-medium">Emails</span>
                        </div>
                        <div className="text-sm font-bold text-purple-600">
                          {dashboardStats?.emailCampaignsSent || 0}
                        </div>
                      </div>

                      <div className="bg-pink-50 dark:bg-pink-900/20 p-2 rounded">
                        <div className="flex items-center gap-1 mb-1">
                          <Phone className="h-3 w-3 text-pink-500" />
                          <span className="font-medium">SMS</span>
                        </div>
                        <div className="text-sm font-bold text-pink-600">
                          {dashboardStats?.smsCampaignsSent || 0}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">AI Conversations</span>
                        <span className="text-sm font-bold text-primary">
                          {dashboardStats?.aiConversations || 0}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total customer interactions
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Business Management Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-blue-500" />
                  Your Businesses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div 
                  className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg cursor-pointer hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
                  onClick={() => setLocation('/business/brezcode/dashboard')}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-pink-500 rounded flex items-center justify-center text-white text-sm font-bold">
                      B
                    </div>
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
                  + Add New Business
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat">AI Assistant</TabsTrigger>
                <TabsTrigger value="tools">Business Tools</TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="space-y-4">
                <Card className="h-[600px]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-blue-500" />
                      AI Business Assistant
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-full flex flex-col p-0">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>
                                {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`rounded-lg p-3 ${
                                message.role === 'user'
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{message.content}</p>
                              <p className="text-xs mt-1 opacity-70">
                                {format(new Date(message.timestamp), 'HH:mm')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {isSending && (
                        <div className="flex gap-3 justify-start">
                          <div className="flex gap-2 max-w-[80%]">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="bg-gray-100 text-gray-900 rounded-lg p-3">
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 border-t">
                      <div className="flex gap-2">
                        <Input
                          value={currentMessage}
                          onChange={(e) => setCurrentMessage(e.target.value)}
                          placeholder="Ask me about lead generation, sales automation, or business strategies..."
                          disabled={isSending}
                        />
                        <Button type="submit" disabled={isSending || !currentMessage.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tools" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Automation Tools</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {quickActions.map((action, index) => (
                        <div
                          key={index}
                          onClick={action.action}
                          className="p-4 border rounded-lg cursor-pointer hover:shadow-lg transition-shadow group"
                        >
                          <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                            {action.icon}
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {action.description}
                          </p>
                          <div className="flex items-center text-blue-500 text-sm font-medium">
                            Get Started
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}