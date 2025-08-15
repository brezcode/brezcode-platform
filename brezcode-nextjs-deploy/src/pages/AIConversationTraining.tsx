import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { format } from 'date-fns';
import TopNavigation from "@/components/TopNavigation";
import { 
  MessageCircle, 
  Play, 
  Pause,
  Square,
  Bot, 
  User,
  Brain,
  Zap,
  Eye,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  RefreshCw,
  Settings
} from 'lucide-react';

interface AIConversationMessage {
  id: string;
  role: 'customer' | 'avatar';
  content: string;
  timestamp: string;
  emotion?: string;
  intent?: string;
  quality_score?: number;
}

interface AICustomer {
  id: string;
  name: string;
  personality: string;
  scenario: string;
  emotional_state: string;
  goals: string[];
  objections: string[];
  background: string;
}

interface ConversationSession {
  id: string;
  avatar_id: string;
  customer_id: string;
  scenario: string;
  status: 'running' | 'paused' | 'completed';
  messages: AIConversationMessage[];
  performance_metrics: {
    response_quality: number;
    customer_satisfaction: number;
    goal_achievement: number;
    conversation_flow: number;
  };
  started_at: string;
  duration: number;
}

const AI_CUSTOMERS = [
  {
    id: 'frustrated_enterprise',
    name: 'Sarah Mitchell - Enterprise Buyer',
    personality: 'Direct, time-pressed, skeptical, high expectations',
    scenario: 'Evaluating expensive enterprise software with budget concerns',
    emotional_state: 'Frustrated with previous vendors, cautious but urgent need',
    goals: ['Find reliable solution', 'Justify ROI to board', 'Ensure scalability'],
    objections: ['Price too high', 'Integration complexity', 'Security concerns'],
    background: 'IT Director at 500-person company, burned by previous failed implementations'
  },
  {
    id: 'anxious_small_business',
    name: 'Mike Rodriguez - Small Business Owner',
    personality: 'Cautious, cost-conscious, relationship-focused, detail-oriented',
    scenario: 'First-time software buyer looking for simple solution',
    emotional_state: 'Anxious about making wrong decision, overwhelmed by options',
    goals: ['Keep costs low', 'Easy to use', 'Good customer support'],
    objections: ['Too expensive', 'Too complicated', 'What if it breaks?'],
    background: 'Owns local restaurant chain, tech-averse but knows he needs modernization'
  },
  {
    id: 'angry_existing_customer',
    name: 'Jennifer Kim - Existing Customer',
    personality: 'Angry, disappointed, demanding immediate resolution',
    scenario: 'Service outage during critical business period',
    emotional_state: 'Furious about downtime, questioning subscription value',
    goals: ['Get immediate resolution', 'Prevent future issues', 'Get compensation'],
    objections: ['Service is unreliable', 'Support is slow', 'Considering switching'],
    background: 'Long-time customer who experienced first major service disruption'
  },
  {
    id: 'curious_startup_founder',
    name: 'Alex Chen - Startup Founder',
    personality: 'Enthusiastic, fast-moving, cost-sensitive, growth-focused',
    scenario: 'Scaling startup needs enterprise-grade tools on startup budget',
    emotional_state: 'Excited about growth but stressed about costs',
    goals: ['Scale quickly', 'Control costs', 'Future-proof solution'],
    objections: ['Too expensive for stage', 'Overkill for current size', 'Startup discounts?'],
    background: 'Technical founder of AI startup, 15 employees, just raised Series A'
  },
  {
    id: 'health_anxiety_patient',
    name: 'Maria Santos - Health Concerns',
    personality: 'Worried, seeking reassurance, health-conscious, detail-oriented',
    scenario: 'Asking about breast health screening and risk factors',
    emotional_state: 'Anxious about family history, wants concrete guidance',
    goals: ['Understand risk factors', 'Get screening schedule', 'Peace of mind'],
    objections: ['Too scared to get tested', 'Insurance coverage concerns', 'Time constraints'],
    background: 'Mother of two, family history of breast cancer, overdue for screening'
  }
];

export default function AIConversationTraining() {
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [currentSession, setCurrentSession] = useState<ConversationSession | null>(null);
  const [isConversationActive, setIsConversationActive] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationSession[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get available avatars
  const { data: avatarsData } = useQuery({
    queryKey: ['/api/business-avatars/avatars'],
    enabled: true
  });

  const avatars = (avatarsData as any)?.avatars || [];

  // Start AI-to-AI conversation
  const startConversationMutation = useMutation({
    mutationFn: async (params: { avatarId: string; customerId: string; scenario: string }) => {
      const response = await fetch('/direct-api/training/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Expected JSON but got:', contentType, text.substring(0, 200));
        throw new Error('Server returned HTML instead of JSON');
      }
      
      return response.json();
    },
    onSuccess: (session) => {
      console.log('Conversation started successfully:', session);
      setCurrentSession(session);
      setIsConversationActive(true);
    },
    onError: (error) => {
      console.error('Failed to start conversation:', error);
    }
  });

  // Continue conversation (get next AI responses)
  const continueConversationMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await fetch(`/direct-api/training/${sessionId}/continue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    },
    onSuccess: (updatedSession) => {
      setCurrentSession(updatedSession);
    }
  });

  // Stop conversation
  const stopConversationMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await fetch(`/direct-api/training/${sessionId}/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    },
    onSuccess: (finalSession) => {
      setCurrentSession(finalSession);
      setIsConversationActive(false);
      setConversationHistory(prev => [...prev, finalSession]);
    }
  });

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  // Auto-continue conversation
  useEffect(() => {
    if (isConversationActive && currentSession && currentSession.messages.length < 20) {
      const timer = setTimeout(() => {
        continueConversationMutation.mutate(currentSession.id);
      }, 3000); // Wait 3 seconds between AI responses

      return () => clearTimeout(timer);
    }
  }, [currentSession?.messages, isConversationActive]);

  const handleStartConversation = () => {
    if (!selectedAvatar || !selectedCustomer || !selectedScenario) return;

    startConversationMutation.mutate({
      avatarId: selectedAvatar,
      customerId: selectedCustomer,
      scenario: selectedScenario
    });
  };

  const handleStopConversation = () => {
    if (currentSession) {
      stopConversationMutation.mutate(currentSession.id);
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (score >= 60) return <Clock className="w-4 h-4 text-yellow-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  const selectedCustomerData = AI_CUSTOMERS.find(c => c.id === selectedCustomer);
  const selectedAvatarData = avatars.find((a: any) => a.id === selectedAvatar);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              AI-to-AI Conversation Training
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Watch AI customers interact with your avatars to evaluate conversation quality
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            {/* Setup Panel */}
            <div className="lg:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-600" />
                    Conversation Setup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Avatar Selection */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Avatar</label>
                    <Select value={selectedAvatar} onValueChange={setSelectedAvatar}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an avatar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {avatars.map((avatar: any) => (
                          <SelectItem key={avatar.id} value={avatar.id}>
                            {avatar.name} - {avatar.businessType.replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Customer Selection */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select AI Customer</label>
                    <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose AI customer..." />
                      </SelectTrigger>
                      <SelectContent>
                        {AI_CUSTOMERS.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Scenario Selection */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Conversation Scenario</label>
                    <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose scenario..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="initial_inquiry">Initial Product Inquiry</SelectItem>
                        <SelectItem value="pricing_objection">Price Objection Handling</SelectItem>
                        <SelectItem value="technical_questions">Technical Support</SelectItem>
                        <SelectItem value="customer_complaint">Customer Complaint</SelectItem>
                        <SelectItem value="health_consultation">Health Consultation</SelectItem>
                        <SelectItem value="follow_up_sales">Follow-up Sales Call</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Customer Profile Preview */}
                  {selectedCustomerData && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">{selectedCustomerData.name}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {selectedCustomerData.scenario}
                      </p>
                      <div className="space-y-1">
                        <div className="text-xs">
                          <span className="font-medium">Emotional State:</span> {selectedCustomerData.emotional_state}
                        </div>
                        <div className="text-xs">
                          <span className="font-medium">Main Objections:</span> {selectedCustomerData.objections.join(', ')}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {!isConversationActive ? (
                      <Button 
                        onClick={handleStartConversation}
                        disabled={!selectedAvatar || !selectedCustomer || !selectedScenario}
                        className="w-full"
                        size="lg"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start AI Conversation
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Button 
                          onClick={handleStopConversation}
                          variant="destructive"
                          className="w-full"
                          size="lg"
                        >
                          <Square className="w-4 h-4 mr-2" />
                          Stop Conversation
                        </Button>
                        <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          AI Conversation Active
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              {currentSession && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                      Live Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Response Quality</span>
                        <div className="flex items-center gap-1">
                          {getQualityIcon(currentSession.performance_metrics.response_quality)}
                          <span className={`text-sm font-medium ${getQualityColor(currentSession.performance_metrics.response_quality)}`}>
                            {currentSession.performance_metrics.response_quality}%
                          </span>
                        </div>
                      </div>
                      <Progress value={currentSession.performance_metrics.response_quality} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Customer Satisfaction</span>
                        <div className="flex items-center gap-1">
                          {getQualityIcon(currentSession.performance_metrics.customer_satisfaction)}
                          <span className={`text-sm font-medium ${getQualityColor(currentSession.performance_metrics.customer_satisfaction)}`}>
                            {currentSession.performance_metrics.customer_satisfaction}%
                          </span>
                        </div>
                      </div>
                      <Progress value={currentSession.performance_metrics.customer_satisfaction} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Goal Achievement</span>
                        <div className="flex items-center gap-1">
                          {getQualityIcon(currentSession.performance_metrics.goal_achievement)}
                          <span className={`text-sm font-medium ${getQualityColor(currentSession.performance_metrics.goal_achievement)}`}>
                            {currentSession.performance_metrics.goal_achievement}%
                          </span>
                        </div>
                      </div>
                      <Progress value={currentSession.performance_metrics.goal_achievement} />
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Messages: {currentSession.messages.length}</span>
                        <span>Duration: {Math.floor(currentSession.duration / 60)}m {currentSession.duration % 60}s</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Conversation View */}
            <div className="lg:col-span-8">
              <Card className="h-[600px]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-purple-600" />
                    AI-to-AI Conversation Observer
                  </CardTitle>
                  {currentSession && (
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Bot className="w-4 h-4" />
                        {selectedAvatarData?.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {selectedCustomerData?.name}
                      </div>
                      <Badge variant="outline">{selectedScenario?.replace('_', ' ')}</Badge>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="h-full flex flex-col p-0">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {!currentSession ? (
                      <div className="h-full flex items-center justify-center text-center">
                        <div>
                          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-600 mb-2">
                            AI Conversation Training
                          </h3>
                          <p className="text-gray-500 max-w-md">
                            Set up an AI customer and avatar, then watch them have a realistic conversation. 
                            Observe how your avatar handles different scenarios and customer personalities.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {currentSession.messages.map((message, index) => (
                          <div
                            key={message.id}
                            className={`flex gap-3 ${message.role === 'avatar' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex gap-2 max-w-[80%] ${message.role === 'avatar' ? 'flex-row-reverse' : 'flex-row'}`}>
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>
                                  {message.role === 'avatar' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                </AvatarFallback>
                              </Avatar>
                              <div
                                className={`rounded-lg p-3 ${
                                  message.role === 'avatar'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-medium opacity-80">
                                    {message.role === 'avatar' ? selectedAvatarData?.name : selectedCustomerData?.name}
                                  </span>
                                  {message.emotion && (
                                    <Badge variant="outline" className="text-xs">
                                      {message.emotion}
                                    </Badge>
                                  )}
                                  {message.quality_score && (
                                    <div className="flex items-center gap-1">
                                      <Star className="w-3 h-3 text-yellow-400" />
                                      <span className="text-xs">{message.quality_score}/100</span>
                                    </div>
                                  )}
                                </div>
                                <p className="whitespace-pre-wrap">{message.content}</p>
                                <p className="text-xs mt-1 opacity-70">
                                  {format(new Date(message.timestamp), 'HH:mm:ss')}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {isConversationActive && (
                          <div className="flex gap-3 justify-center">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              AI agents are thinking...
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Conversation History */}
          {conversationHistory.length > 0 && (
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Previous Training Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {conversationHistory.map((session) => (
                      <div key={session.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-sm font-medium">
                            {avatars.find((a: any) => a.id === session.avatar_id)?.name}
                          </div>
                          <Badge variant="outline">
                            {Math.floor(session.duration / 60)}m
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          {AI_CUSTOMERS.find(c => c.id === session.customer_id)?.name}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Quality</span>
                            <span className={getQualityColor(session.performance_metrics.response_quality)}>
                              {session.performance_metrics.response_quality}%
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Satisfaction</span>
                            <span className={getQualityColor(session.performance_metrics.customer_satisfaction)}>
                              {session.performance_metrics.customer_satisfaction}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}