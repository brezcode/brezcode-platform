import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
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
  RefreshCw,
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

// Difficulty colors
const DIFFICULTY_COLORS = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

export default function BrezCodeAvatarTraining() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedAvatar, setSelectedAvatar] = useState<BusinessAvatar | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<TrainingScenario | null>(null);
  const [activeSession, setActiveSession] = useState<TrainingSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch BrezCode health coaching avatar specifically
  const { data: avatarsData, isLoading: avatarsLoading } = useQuery({
    queryKey: ['/api/business-avatars/business-type/health_coaching'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/business-avatars/business-type/health_coaching');
      if (!response.ok) throw new Error('Failed to fetch health coaching avatars');
      return response.json();
    }
  });

  // Fetch health coaching training scenarios
  const { data: scenariosData } = useQuery({
    queryKey: ['/api/avatar-training/scenarios', 'health_coach'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/avatar-training/scenarios?avatarType=health_coach');
      if (!response.ok) throw new Error('Failed to fetch health coaching scenarios');
      return response.json();
    }
  });

  // Fetch active training sessions for BrezCode
  const { data: sessionsData } = useQuery({
    queryKey: ['/api/avatar-training/sessions/brezcode'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/avatar-training/sessions?business=brezcode');
      if (!response.ok) throw new Error('Failed to fetch BrezCode training sessions');
      return response.json();
    }
  });

  const avatars: BusinessAvatar[] = (avatarsData as any)?.avatars || [];
  const scenarios: TrainingScenario[] = (scenariosData as any)?.scenarios || [];
  const sessions: TrainingSession[] = (sessionsData as any)?.sessions || [];

  // Automatically select Dr. Sakura Wellness if available
  useEffect(() => {
    if (avatars.length > 0 && !selectedAvatar) {
      const drSakura = avatars.find(a => a.id === 'brezcode_health_coach');
      if (drSakura) {
        setSelectedAvatar(drSakura);
      }
    }
  }, [avatars, selectedAvatar]);

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
        scenarioId,
        businessContext: 'brezcode'
      });
      if (!response.ok) throw new Error('Failed to start BrezCode training session');
      return response.json();
    },
    onSuccess: (data) => {
      setActiveSession(data.session);
      
      // Display automatic AI conversation messages
      const sessionMessages = data.session.messages || [];
      const formattedMessages = sessionMessages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        isTraining: true,
        emotion: msg.emotion,
        quality_score: msg.quality_score
      }));
      
      setMessages([
        {
          role: 'system',
          content: `🩺 BrezCode AI Training Started! Watch Dr. Sakura handle breast health consultations. This is an AI-to-AI conversation for training observation.`,
          timestamp: new Date().toISOString(),
          isTraining: true
        },
        ...formattedMessages
      ]);
      
      toast({
        title: "Dr. Sakura AI Training Active",
        description: `Observing AI conversation: ${selectedScenario?.name}`,
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
        role: 'user',
        businessContext: 'brezcode'
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
      const response = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/end`, {
        businessContext: 'brezcode'
      });
      if (!response.ok) throw new Error('Failed to end session');
      return response.json();
    },
    onSuccess: (data) => {
      setActiveSession(null);
      setMessages([]);
      toast({
        title: "BrezCode Training Completed",
        description: `Dr. Sakura scored ${data.score}/100 in breast health coaching!`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/avatar-training/sessions/brezcode'] });
    }
  });

  // Add continue conversation functionality
  const continueConversation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/continue`);
      if (!response.ok) throw new Error('Failed to continue conversation');
      return response.json();
    },
    onSuccess: (data) => {
      const sessionMessages = data.session.messages || [];
      const formattedMessages = sessionMessages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        isTraining: true,
        emotion: msg.emotion,
        quality_score: msg.quality_score
      }));
      
      setMessages(prev => [
        prev[0], // Keep the system message
        ...formattedMessages
      ]);
      
      toast({
        title: "Conversation Continued",
        description: `Dr. Sakura handling patient concerns`,
      });
    }
  });

  const handleSendMessage = () => {
    if (!currentMessage.trim() || isSending || !activeSession) return;
    
    setIsSending(true);
    sendTrainingMessage.mutate(currentMessage);
    setTimeout(() => setIsSending(false), 1000);
  };
  
  const handleContinueConversation = () => {
    if (!activeSession) return;
    continueConversation.mutate(activeSession.id);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 dark:from-gray-900 dark:to-gray-800">
      <TopNavigation />
      
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* BrezCode Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">BrezCode AI Training Platform</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Train Dr. Sakura Wellness with breast health coaching scenarios. 
            Practice empathetic conversations and improve health guidance skills.
          </p>
        </div>

        <Tabs defaultValue="training" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="training">Training Session</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="analytics">Performance</TabsTrigger>
          </TabsList>

          {/* Training Session */}
          <TabsContent value="training" className="space-y-6">
            {!selectedAvatar ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Heart className="h-12 w-12 text-pink-400 mx-auto mb-4" />
                  <p className="text-gray-600">Loading Dr. Sakura Wellness...</p>
                </CardContent>
              </Card>
            ) : !selectedScenario ? (
              <Card>
                <CardHeader>
                  <CardTitle>Ready to Train Dr. Sakura Wellness</CardTitle>
                  <CardDescription>
                    Please select a breast health coaching scenario to begin training.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scenarios.map((scenario) => (
                      <Card 
                        key={scenario.id} 
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          selectedScenario?.id === scenario.id ? 'ring-2 ring-pink-500 bg-pink-50' : ''
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
                              <p className="text-sm font-medium text-gray-700">Customer Situation:</p>
                              <p className="text-sm text-gray-600">{scenario.customerPersona}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {scenario.timeframeMins} min
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-pink-50 text-pink-700">
                                <Heart className="h-3 w-3 mr-1" />
                                Health Coaching
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : !activeSession ? (
              <Card>
                <CardHeader>
                  <CardTitle>Start BrezCode Training Session</CardTitle>
                  <CardDescription>
                    Train <strong>Dr. Sakura Wellness</strong> with the <strong>{selectedScenario.name}</strong> scenario.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2 text-pink-700">Dr. Sakura's Role</h4>
                        <p className="text-sm text-gray-600">{selectedAvatar.description}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-pink-700">Training Objectives</h4>
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
                      className="w-full bg-pink-600 hover:bg-pink-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start BrezCode Training Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Chat Interface */}
                <div className="lg:col-span-3">
                  <Card className="h-[600px] flex flex-col">
                    <CardHeader className="flex-row items-center justify-between space-y-0 pb-4 bg-pink-50">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          <Heart className="h-5 w-5 mr-2 text-pink-600" />
                          Training Dr. Sakura Wellness
                        </CardTitle>
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
                                    : 'bg-pink-100 text-pink-700'
                                }>
                                  {message.role === 'user' ? <User className="h-4 w-4" /> : 
                                   message.role === 'system' ? <Settings className="h-4 w-4" /> : 
                                   <Heart className="h-4 w-4" />}
                                </AvatarFallback>
                              </Avatar>
                              <div className={`rounded-lg px-4 py-2 ${
                                message.role === 'user' 
                                  ? 'bg-blue-500 text-white' 
                                  : message.role === 'system'
                                  ? 'bg-pink-100 text-pink-800 border border-pink-200'
                                  : 'bg-gray-100 text-gray-800 border'
                              }`}>
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                      
                      <div className="space-y-2">
                        {/* AI-to-AI Conversation Controls */}
                        <div className="flex space-x-2">
                          <Button 
                            onClick={handleContinueConversation}
                            disabled={continueConversation.isPending}
                            className="flex-1 bg-pink-600 hover:bg-pink-700"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Continue AI Conversation
                          </Button>
                        </div>
                        
                        {/* Manual Chat Input */}
                        <div className="flex space-x-2">
                          <Input
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Or manually type as customer..."
                            disabled={isSending}
                            className="flex-1"
                          />
                          <Button 
                            onClick={handleSendMessage} 
                            disabled={isSending || !currentMessage.trim()}
                            size="sm"
                          className="bg-pink-600 hover:bg-pink-700"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Session Info */}
                <div className="lg:col-span-1 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Training Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Exchanges</span>
                            <span>{messages.filter(m => m.role !== 'system').length / 2}</span>
                          </div>
                          <Progress value={Math.min((messages.length / 10) * 100, 100)} className="bg-pink-100" />
                        </div>
                        <div className="text-xs text-gray-600">
                          <p><strong>Scenario:</strong> {selectedScenario?.difficulty || 'N/A'}</p>
                          <p><strong>Focus:</strong> Breast health coaching</p>
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
                            <Heart className="h-3 w-3 mr-1 mt-0.5 text-pink-500" />
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

          {/* Scenarios Tab */}
          <TabsContent value="scenarios" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scenarios.map((scenario) => (
                <Card key={scenario.id} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{scenario.name}</CardTitle>
                      <Badge className={DIFFICULTY_COLORS[scenario.difficulty]}>
                        {scenario.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>{scenario.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Key Learning Points:</p>
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                          {scenario.keyLearningPoints.slice(0, 3).map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {scenario.timeframeMins} min
                        </Badge>
                        <Button 
                          size="sm" 
                          onClick={() => setSelectedScenario(scenario)}
                          className="bg-pink-600 hover:bg-pink-700"
                        >
                          Select Scenario
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">BrezCode Sessions</CardTitle>
                  <Heart className="h-4 w-4 text-pink-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sessions.length}</div>
                  <p className="text-xs text-muted-foreground">Health coaching completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <Award className="h-4 w-4 text-pink-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92</div>
                  <p className="text-xs text-muted-foreground">Excellent performance</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Dr. Sakura</CardTitle>
                  <MessageSquare className="h-4 w-4 text-pink-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Active</div>
                  <p className="text-xs text-muted-foreground">Ready for training</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Improvement</CardTitle>
                  <TrendingUp className="h-4 w-4 text-pink-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+15%</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent BrezCode Training Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Heart className="w-12 h-12 mx-auto mb-3 text-pink-400" />
                  <p>No training sessions completed yet. Start your first BrezCode training session!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}