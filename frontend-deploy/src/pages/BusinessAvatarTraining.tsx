import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import TopNavigation from "@/components/TopNavigation";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User,
  Play,
  Pause,
  RotateCcw,
  Target,
  TrendingUp,
  Clock,
  Award,
  Sparkles,
  Settings,
  CheckCircle,
  AlertCircle,
  Star,
  Heart,
  Briefcase,
  HeadphonesIcon,
  Wrench,
  Brain,
  GraduationCap,
  MessageSquare,
  BarChart3,
  Users,
  ArrowRight,
  Zap
} from 'lucide-react';

interface BusinessAvatar {
  id: string;
  name: string;
  businessType: string;
  description: string;
  appearance: {
    imageUrl: string;
    hairColor: string;
    eyeColor: string;
  };
  voiceProfile: {
    tone: string;
    pace: string;
    accent: string;
  };
  expertise: string[];
  specializations: string[];
}

interface TrainingScenario {
  id: string;
  avatarType: string;
  name: string;
  description: string;
  customerPersona: string;
  customerMood: string;
  objectives: string[];
  timeframeMins: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  industry: string;
  successCriteria: string[];
  commonMistakes: string[];
  keyLearningPoints: string[];
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  avatarId?: string;
  isTraining?: boolean;
}

interface TrainingSession {
  id: string;
  avatarId: string;
  scenarioId: string;
  status: 'active' | 'paused' | 'completed';
  score?: number;
  feedback?: string;
  startTime: string;
  messages: ChatMessage[];
}

// Avatar type icons mapping
const AVATAR_ICONS = {
  health_coaching: Heart,
  sales_automation: Briefcase,
  customer_service: HeadphonesIcon,
  technical_support: Wrench,
  business_consulting: Brain,
  education: GraduationCap
};

// Difficulty colors
const DIFFICULTY_COLORS = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
};

export default function BusinessAvatarTraining() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedAvatar, setSelectedAvatar] = useState<BusinessAvatar | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<TrainingScenario | null>(null);
  const [activeSession, setActiveSession] = useState<TrainingSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  // Fetch all business avatars for current user's businesses
  const { data: avatarsData, isLoading: avatarsLoading } = useQuery({
    queryKey: ['/api/business-avatars/avatars'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/business-avatars/avatars');
      if (!response.ok) throw new Error('Failed to fetch business avatars');
      return response.json();
    }
  });

  // Fetch training scenarios based on selected avatar
  const { data: scenariosData } = useQuery({
    queryKey: ['/api/avatar-training/scenarios', selectedAvatar?.businessType],
    enabled: !!selectedAvatar,
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/avatar-training/scenarios?avatarType=${selectedAvatar?.businessType}`);
      if (!response.ok) throw new Error('Failed to fetch scenarios');
      return response.json();
    }
  });

  // Fetch active training sessions
  const { data: sessionsData } = useQuery({
    queryKey: ['/api/avatar-training/sessions'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/avatar-training/sessions');
      if (!response.ok) throw new Error('Failed to fetch sessions');
      return response.json();
    }
  });

  const avatars: BusinessAvatar[] = (avatarsData as any)?.avatars || [];
  const scenarios: TrainingScenario[] = (scenariosData as any)?.scenarios || [];
  const sessions: TrainingSession[] = (sessionsData as any)?.sessions || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Start training session
  const startTrainingSession = useMutation({
    mutationFn: async ({ avatarId, scenarioId }: { avatarId: string; scenarioId: string }) => {
      const response = await apiRequest('POST', '/api/avatar-training/sessions/start', {
        avatarId,
        scenarioId
      });
      if (!response.ok) throw new Error('Failed to start training session');
      return response.json();
    },
    onSuccess: (data) => {
      setActiveSession(data.session);
      setMessages([{
        role: 'system',
        content: `Training session started: ${selectedScenario?.name}. You are now role-playing with ${selectedAvatar?.name}. Begin the scenario!`,
        timestamp: new Date().toISOString(),
        isTraining: true
      }]);
      toast({
        title: "Training Session Started",
        description: `Now training ${selectedAvatar?.name} with ${selectedScenario?.name}`,
      });
    }
  });

  // Send training message
  const sendTrainingMessage = useMutation({
    mutationFn: async (message: string) => {
      if (!activeSession) throw new Error('No active session');
      
      const response = await apiRequest('POST', '/api/avatar-training/sessions/message', {
        sessionId: activeSession.id,
        message: message,
        role: 'user'
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    },
    onSuccess: (data) => {
      // Add user message
      const userMessage: ChatMessage = {
        role: 'user',
        content: currentMessage,
        timestamp: new Date().toISOString(),
        isTraining: true
      };
      
      // Add avatar response
      const avatarMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        avatarId: selectedAvatar?.id,
        isTraining: true
      };

      setMessages(prev => [...prev, userMessage, avatarMessage]);
      setCurrentMessage('');
    }
  });

  // End training session
  const endTrainingSession = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/end`);
      if (!response.ok) throw new Error('Failed to end session');
      return response.json();
    },
    onSuccess: (data) => {
      setActiveSession(null);
      setMessages([]);
      toast({
        title: "Training Session Completed",
        description: `Session score: ${data.score}/100. Great work!`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/avatar-training/sessions'] });
    }
  });

  const handleSendMessage = () => {
    if (!currentMessage.trim() || isSending || !activeSession) return;
    
    setIsSending(true);
    sendTrainingMessage.mutate(currentMessage);
    setTimeout(() => setIsSending(false), 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'intermediate': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'advanced': return <Star className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const getAvatarIcon = (businessType: string) => {
    const IconComponent = AVATAR_ICONS[businessType as keyof typeof AVATAR_ICONS] || Bot;
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <TopNavigation />
      
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Business Avatar Training</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Train your business AI avatars with industry-specific scenarios and realistic dialogue testing. 
            Improve customer interactions across sales, support, consulting, and specialized services.
          </p>
        </div>

        <Tabs defaultValue="avatars" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="avatars">Select Avatar</TabsTrigger>
            <TabsTrigger value="scenarios">Choose Scenario</TabsTrigger>
            <TabsTrigger value="training">Training Session</TabsTrigger>
            <TabsTrigger value="analytics">Performance</TabsTrigger>
          </TabsList>

          {/* Avatar Selection */}
          <TabsContent value="avatars" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {avatarsLoading ? (
                [...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </CardHeader>
                  </Card>
                ))
              ) : (
                avatars.map((avatar) => (
                  <Card 
                    key={avatar.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedAvatar?.id === avatar.id ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
                    }`}
                    onClick={() => setSelectedAvatar(avatar)}
                  >
                    <CardHeader className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                          {getAvatarIcon(avatar.businessType)}
                          <Bot className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-lg">{avatar.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {avatar.description}
                      </CardDescription>
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          {avatar.businessType.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {getAvatarIcon(avatar.businessType)}
                            <span className="ml-1">{avatar.businessType.replace('_', ' ')}</span>
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          <p><strong>Voice:</strong> {avatar.voiceProfile.tone} tone</p>
                          <p><strong>Expertise:</strong> {avatar.expertise.slice(0, 2).join(', ')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Scenario Selection */}
          <TabsContent value="scenarios" className="space-y-6">
            {!selectedAvatar ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Please select an avatar first to see available training scenarios.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {scenarios.map((scenario) => (
                  <Card 
                    key={scenario.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedScenario?.id === scenario.id ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
                    }`}
                    onClick={() => setSelectedScenario(scenario)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{scenario.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          {getDifficultyIcon(scenario.difficulty)}
                          <Badge className={DIFFICULTY_COLORS[scenario.difficulty]}>
                            {scenario.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription>{scenario.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Customer Persona:</p>
                          <p className="text-sm text-gray-600">{scenario.customerPersona}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Objectives:</p>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            {scenario.objectives.slice(0, 2).map((obj, i) => (
                              <li key={i}>{obj}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {scenario.timeframeMins} min
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {scenario.industry}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Training Session */}
          <TabsContent value="training" className="space-y-6">
            {!selectedAvatar || !selectedScenario ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Please select both an avatar and scenario to start training.</p>
                </CardContent>
              </Card>
            ) : !activeSession ? (
              <Card>
                <CardHeader>
                  <CardTitle>Ready to Start Training</CardTitle>
                  <CardDescription>
                    You'll be training <strong>{selectedAvatar.name}</strong> with the <strong>{selectedScenario.name}</strong> scenario.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Avatar Details</h4>
                        <p className="text-sm text-gray-600">{selectedAvatar.description}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Scenario Objectives</h4>
                        <ul className="text-sm text-gray-600">
                          {selectedScenario.objectives.map((obj, i) => (
                            <li key={i}>• {obj}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <Button 
                      onClick={() => startTrainingSession.mutate({ 
                        avatarId: selectedAvatar.id, 
                        scenarioId: selectedScenario.id 
                      })}
                      disabled={startTrainingSession.isPending}
                      className="w-full"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Training Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Chat Interface */}
                <div className="lg:col-span-3">
                  <Card className="h-[600px] flex flex-col">
                    <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                      <div>
                        <CardTitle className="text-lg">Training with {selectedAvatar.name}</CardTitle>
                        <CardDescription>{selectedScenario.name}</CardDescription>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => endTrainingSession.mutate(activeSession.id)}
                      >
                        End Session
                      </Button>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                        {messages.map((message, index) => (
                          <div 
                            key={index} 
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex items-start space-x-2 max-w-[80%] ${
                              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                            }`}>
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className={
                                  message.role === 'user' 
                                    ? 'bg-blue-100 text-blue-700' 
                                    : message.role === 'system'
                                    ? 'bg-gray-100 text-gray-700'
                                    : 'bg-purple-100 text-purple-700'
                                }>
                                  {message.role === 'user' ? <User className="h-4 w-4" /> : 
                                   message.role === 'system' ? <Settings className="h-4 w-4" /> : 
                                   <Bot className="h-4 w-4" />}
                                </AvatarFallback>
                              </Avatar>
                              <div className={`rounded-lg px-4 py-2 ${
                                message.role === 'user' 
                                  ? 'bg-blue-500 text-white' 
                                  : message.role === 'system'
                                  ? 'bg-gray-100 text-gray-800 border'
                                  : 'bg-gray-100 text-gray-800 border'
                              }`}>
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                      
                      <div className="flex space-x-2">
                        <Input
                          value={currentMessage}
                          onChange={(e) => setCurrentMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your response as a customer..."
                          disabled={isSending}
                          className="flex-1"
                        />
                        <Button 
                          onClick={handleSendMessage} 
                          disabled={isSending || !currentMessage.trim()}
                          size="sm"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Session Info */}
                <div className="lg:col-span-1 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Session Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Messages</span>
                            <span>{messages.filter(m => m.role !== 'system').length}</span>
                          </div>
                          <Progress value={Math.min((messages.length / 10) * 100, 100)} />
                        </div>
                        <div className="text-xs text-gray-600">
                          <p><strong>Scenario:</strong> {selectedScenario.difficulty}</p>
                          <p><strong>Duration:</strong> {selectedScenario.timeframeMins} min target</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Success Criteria</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {selectedScenario.successCriteria.map((criteria, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle className="h-3 w-3 mr-1 mt-0.5 text-green-500" />
                            {criteria}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Training Sessions</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sessions.length}</div>
                  <p className="text-xs text-muted-foreground">Total completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85</div>
                  <p className="text-xs text-muted-foreground">Out of 100</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Avatars</CardTitle>
                  <Bot className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avatars.length}</div>
                  <p className="text-xs text-muted-foreground">Ready for training</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Improvement</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12%</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Training Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{session.avatarId}</p>
                        <p className="text-sm text-gray-600">{session.scenarioId}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={session.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {session.status}
                        </Badge>
                        {session.score && (
                          <p className="text-sm text-gray-600 mt-1">Score: {session.score}/100</p>
                        )}
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
  );
}