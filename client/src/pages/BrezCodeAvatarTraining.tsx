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
import { useLocation, Link } from 'wouter';
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
  ArrowLeft,
  Zap,
  ThumbsUp,
  ThumbsDown,
  MessageCircleMore,
  FileText
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
  role: 'user' | 'assistant' | 'system' | 'customer' | 'avatar';
  content: string;
  timestamp: string;
  avatarId?: string;
  isTraining?: boolean;
  quality_score?: number;
  emotion?: string;
  id?: string;
  userRating?: 'thumbs_up' | 'thumbs_down' | null;
  userComment?: string;
  // Multiple choice removed for streamlined experience
  is_choice_selection?: boolean;
  // Improved response fields for comment feedback
  user_comment?: string;
  improved_response?: string;
  improved_quality_score?: number;
  improved_message_id?: string;
  has_improved_response?: boolean;
}

interface TrainingSession {
  id: string;
  sessionId: string; // Add sessionId field to match database schema
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
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [showCommentDialog, setShowCommentDialog] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>('');
  const [messageRatings, setMessageRatings] = useState<Record<string, { rating: 'thumbs_up' | 'thumbs_down' | null, comment: string }>>({});

  // Scenario carousel state
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [sessionCounter, setSessionCounter] = useState(1);

  // Fetch completed sessions count to calculate next session number
  const { data: completedSessionsData } = useQuery({
    queryKey: ['/api/avatar-performance/completed-sessions'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/avatar-performance/completed-sessions');
      if (!response.ok) throw new Error('Failed to fetch completed sessions');
      return response.json();
    }
  });

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

  // Fetch health coaching training scenarios (force fresh data)
  const { data: scenariosData } = useQuery({
    queryKey: ['/api/avatar-training/scenarios', 'health_coach', Date.now()], // Force cache refresh
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/avatar-training/scenarios?avatarType=health_coach');
      if (!response.ok) throw new Error('Failed to fetch health coaching scenarios');
      return response.json();
    },
    staleTime: 0 // Always refetch
  });

  // Fetch active training sessions for BrezCode
  const { data: sessionsData } = useQuery({
    queryKey: ['/api/avatar-training/sessions'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/avatar-training/sessions');
      if (!response.ok) throw new Error('Failed to fetch training sessions');
      return response.json();
    }
    // Removed excessive polling - will update manually when needed
  });

  const avatars: BusinessAvatar[] = (avatarsData as any)?.avatars || [];
  const scenarios: TrainingScenario[] = (scenariosData as any)?.scenarios || [];
  const sessions: TrainingSession[] = (sessionsData as any)?.sessions || [];
  const completedSessions = (completedSessionsData as any)?.sessions || [];

  // Calculate next session number based on completed sessions
  const nextSessionNumber = completedSessions.length + 1;

  // Scenario carousel navigation functions
  const navigateScenario = (direction: 'left' | 'right') => {
    if (scenarios.length === 0) return;

    if (direction === 'left') {
      setCurrentScenarioIndex((prev) => 
        prev === 0 ? scenarios.length - 1 : prev - 1
      );
    } else {
      setCurrentScenarioIndex((prev) => 
        prev === scenarios.length - 1 ? 0 : prev + 1
      );
    }
  };

  const selectCurrentScenario = () => {
    if (scenarios[currentScenarioIndex]) {
      setSelectedScenario(scenarios[currentScenarioIndex]);
    }
  };

  // Generate session ID with proper increment based on completed sessions
  const generateSessionId = () => {
    const sessionId = `Training Session #${nextSessionNumber}`;
    return sessionId;
  };

  // Automatically select Dr. Sakura Wellness if available
  useEffect(() => {
    if (avatars.length > 0 && !selectedAvatar) {
      const drSakura = avatars.find(a => a.id === 'brezcode_health_coach');
      if (drSakura) {
        setSelectedAvatar(drSakura);
      }
    }
  }, [avatars, selectedAvatar]);

  // Auto-load active session and refresh messages when session data updates
  useEffect(() => {
    if (sessions.length > 0) {
      const activeSessionData = sessions.find(s => s.status === 'active');
      if (activeSessionData) {
        // Always update active session to get latest messages
        setActiveSession(activeSessionData);

        // Load session messages with improved responses  
        const sessionMessages = activeSessionData.messages || [];
        const formattedMessages = sessionMessages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
          isTraining: true,
          emotion: msg.emotion,
          quality_score: msg.quality_score,
          multiple_choice_options: msg.multiple_choice_options || [],
          // Load improved response fields from session
          user_comment: msg.user_comment,
          improved_response: msg.improved_response,
          improved_quality_score: msg.improved_quality_score,
          improved_message_id: msg.improved_message_id,
          has_improved_response: msg.has_improved_response
        }));

        // Update messages to show current conversation
        setMessages([
          {
            role: 'system',
            content: `🎯 BrezCode AI Training Active\n\nYou are now training Dr. Sakura in breast health coaching. This simulation helps improve AI responses through realistic customer interactions.`,
            timestamp: new Date().toISOString(),
            isTraining: true
          },
          ...formattedMessages
        ]);
      }
    }
  }, [sessions]); // Re-run whenever sessions data changes

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

      // Display automatic AI conversation messages with improved responses
      const sessionMessages = data.session.messages || [];
      const formattedMessages = sessionMessages.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        isTraining: true,
        emotion: msg.emotion,
        quality_score: msg.quality_score,
        multiple_choice_options: msg.multiple_choice_options || [],
        // Include improved response fields from session restoration
        user_comment: msg.user_comment,
        improved_response: msg.improved_response,
        improved_quality_score: msg.improved_quality_score,
        improved_message_id: msg.improved_message_id,
        has_improved_response: msg.has_improved_response
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

      const response = await apiRequest('POST', `/api/avatar-training/sessions/${activeSession.sessionId}/message`, {
        message: message,
        role: 'customer'
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success && data.userMessage && data.avatarMessage) {
        // Add both user message and avatar response from backend
        const userMessage: ChatMessage = {
          id: data.userMessage.id,
          role: 'customer',
          content: data.userMessage.content,
          timestamp: data.userMessage.timestamp,
          isTraining: true,
          emotion: data.userMessage.emotion
        };

        const avatarMessage: ChatMessage = {
          id: data.avatarMessage.id,
          role: 'avatar',
          content: data.avatarMessage.content,
          timestamp: data.avatarMessage.timestamp,
          isTraining: true,
          quality_score: data.avatarMessage.quality_score
        };

        setMessages(prev => [...prev, userMessage, avatarMessage]);
        setCurrentMessage('');

        toast({
          title: "Manual Message Sent",
          description: "Dr. Sakura responded to your message",
        });
      }
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

  // Add continue conversation functionality - PRESERVE COMMENTS AND IMPROVEMENTS
  const continueConversation = useMutation({
    mutationFn: async ({ sessionId, customerMessage }: { sessionId: string; customerMessage?: string }) => {
      console.log('🔄 Continue conversation request:', { sessionId, customerMessage });
      const requestBody = customerMessage !== undefined ? { customerMessage } : {};

      const response = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/continue`, requestBody);
      console.log('📡 Continue response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Continue conversation failed:', errorData);
        throw new Error(`Failed to continue conversation: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Continue conversation success:', data.success);
      return data;
    },
    onSuccess: (data) => {
      console.log('🎯 Continue conversation onSuccess:', data);

      // Check if conversation has ended naturally
      if (data.conversationEnded) {
        toast({
          title: "Conversation Complete",
          description: "The conversation has reached its natural conclusion",
        });
        return;
      }

      // Update active session with latest data
      if (data.session) {
        setActiveSession(data.session);
      }

      const sessionMessages = data.session?.messages || [];
      const existingMessages = messages;

      // Create map of existing message data to preserve comments and improvements
      const existingMessageData = new Map();
      existingMessages.forEach(msg => {
        if (msg.id) {
          existingMessageData.set(msg.id, {
            user_comment: msg.user_comment,
            improved_response: msg.improved_response,
            improved_quality_score: msg.improved_quality_score,
            improved_message_id: msg.improved_message_id,
            has_improved_response: msg.has_improved_response
          });
        }
      });

      // Merge session data with preserved user interaction data
      const formattedMessages = sessionMessages.map((msg: any) => {
        const existingData = existingMessageData.get(msg.id) || {};
        return {
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
          isTraining: true,
          emotion: msg.emotion,
          quality_score: msg.quality_score,
          multiple_choice_options: msg.multiple_choice_options || [],
          // PRESERVE existing user comments and improved responses
          user_comment: existingData.user_comment || msg.user_comment,
          improved_response: existingData.improved_response || msg.improved_response,
          improved_quality_score: existingData.improved_quality_score || msg.improved_quality_score,
          improved_message_id: existingData.improved_message_id || msg.improved_message_id,
          has_improved_response: existingData.has_improved_response || msg.has_improved_response
        };
      });

      // Update the messages to show latest conversation including preserved data
      setMessages([
        {
          role: 'system',
          content: `🩺 BrezCode AI Training Active\n\nYou are now training Dr. Sakura in breast health coaching. This simulation helps improve AI responses through realistic customer interactions.`,
          timestamp: new Date().toISOString(),
          isTraining: true
        },
        ...formattedMessages
      ]);

      console.log('✅ Messages updated, total count:', formattedMessages.length + 1);

      // Force React re-render by updating refresh key
      setRefreshKey(prev => prev + 1);

      // Force UI refresh and scroll to bottom
      setTimeout(() => {
        scrollToBottom();
      }, 100);

      // Refresh sessions to show updated state
      queryClient.invalidateQueries({ queryKey: ['/api/avatar-training/sessions'] });
    },
    onError: (error) => {
      console.error('❌ Continue conversation error:', error);
      toast({
        title: "Continue Failed",
        description: `Failed to continue conversation: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Handle multiple choice selection
  const handleMultipleChoice = useMutation({
    mutationFn: async (choice: string) => {
      if (!activeSession) throw new Error('No active session');

      const response = await apiRequest('POST', `/api/avatar-training/sessions/${activeSession.sessionId}/choice`, {
        choice
      });
      if (!response.ok) throw new Error('Failed to submit choice');
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success && data.session) {
        // Update session and messages completely
        setMessages(data.session.messages);
        setActiveSession(data.session);

        // Force a re-render to ensure multiple choice options show up
        setTimeout(() => {
          setMessages([...data.session.messages]);
        }, 50);

        // Scroll to bottom to show new messages
        setTimeout(() => {
          const messagesContainer = document.querySelector('.overflow-y-auto');
          if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
        }, 200);
      }
      toast({
        title: "💬 Response Generated",
        description: "Dr. Sakura responded to your selected question",
      });
    }
  });

  // Submit comment feedback for immediate learning
  const submitCommentFeedback = useMutation({
    mutationFn: async ({ messageId, comment, rating }: { messageId: string; comment: string; rating: number }) => {
      if (!activeSession) throw new Error('No active session');

      const response = await apiRequest('POST', `/api/avatar-training/sessions/${activeSession.sessionId}/comment`, {
        messageId,
        comment,
        rating
      });
      if (!response.ok) throw new Error('Failed to submit feedback');
      return response.json();
    },
    onSuccess: (data) => {
      console.log('🎯 Comment feedback successful:', data);
      console.log('Has session:', !!data.session);
      console.log('Has improved_message:', !!data.improved_message);

      // Invalidate queries to force refresh
      queryClient.invalidateQueries({ queryKey: ['/api/avatar-training/sessions'] });

      // Update session with improved response
      if (data.session) {
        setActiveSession(data.session);

        // Update messages from session data to get improved responses
        const sessionMessages = data.session.messages || [];
        console.log('Session messages count:', sessionMessages.length);

        // Log improved response details
        const improvedMsg = sessionMessages.find((m: any) => m.improved_response);
        if (improvedMsg) {
          console.log('Found improved message:', {
            id: improvedMsg.id,
            hasImprovedResponse: !!improvedMsg.improved_response,
            improvedResponseLength: improvedMsg.improved_response?.length,
            userComment: improvedMsg.user_comment
          });
        }

        // Update messages state with improved response data
        setMessages(sessionMessages.map((sessionMsg: any) => ({
          id: sessionMsg.id,
          role: sessionMsg.role,
          content: sessionMsg.content,
          timestamp: sessionMsg.timestamp,
          isTraining: true,
          emotion: sessionMsg.emotion,
          quality_score: sessionMsg.quality_score,
          multiple_choice_options: sessionMsg.multiple_choice_options || [],
          // Add improved response fields from session
          user_comment: sessionMsg.user_comment,
          improved_response: sessionMsg.improved_response,
          improved_quality_score: sessionMsg.improved_quality_score,
          improved_message_id: sessionMsg.improved_message_id,
          has_improved_response: sessionMsg.has_improved_response
        })));

        // Force re-render and immediate display of improved response
        setTimeout(() => {
          setMessages(prev => [...prev]);

          // Scroll to the improved response
          const improvedResponseElement = document.getElementById(`improved-response-${improvedMsg?.id}`);
          if (improvedResponseElement) {
            improvedResponseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);

        console.log('🔄 Messages updated with improved responses:', sessionMessages.filter((m: any) => m.improved_response).length);
      }

      // Show success notification for improved response
      if (data.session?.messages?.some((m: any) => m.improved_response)) {
        toast({
          title: "✨ Dr. Sakura Improved!",
          description: "Enhanced response generated based on your feedback",
        });
      }

      // Also handle direct improved_message response
      if (data.improved_message) {
        setMessages(prev => prev.map(msg => {
          if (msg.id === data.improved_message.original_message_id) {
            return {
              ...msg,
              user_comment: data.improved_message.user_comment,
              improved_response: data.improved_message.content,
              improved_quality_score: data.improved_message.quality_score,
              improved_message_id: data.improved_message.id,
              has_improved_response: true
            };
          }
          return msg;
        }));

        // Scroll to the improved message
        setTimeout(() => {
          const improvedElement = document.getElementById(`improved-response-${data.improved_message.original_message_id}`);
          if (improvedElement) {
            improvedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }

      toast({
        title: "✅ Dr. Sakura Learned & Improved!",
        description: data.message || "Response improved based on your feedback",
      });
    }
  });

  const handleSendMessage = () => {
    if (!currentMessage.trim() || isSending || !activeSession) return;

    setIsSending(true);
    sendTrainingMessage.mutate(currentMessage);
    setTimeout(() => setIsSending(false), 1000);
  };

  // Complete session mutation for performance tracking
  const completeSession = useMutation({
    mutationFn: async (sessionId: string) => {
      console.log('🏁 Completing training session:', sessionId);
      const response = await apiRequest('POST', `/api/performance/complete-session/${sessionId}`, {});
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Complete session failed:', errorData);
        throw new Error(`Failed to complete session: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Session completed successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "🎯 Training Session Completed!",
        description: "Session saved to your performance history. View your progress in the Performance tab.",
      });
      
      // Reset the active session to return to scenario selection
      setActiveSession(null);
      setMessages([]);
      setCurrentMessage('');
      
      // Invalidate performance queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/performance/completed-sessions'] });
    },
    onError: (error) => {
      console.error('❌ Complete session error:', error);
      toast({
        title: "Error Completing Session",
        description: "Failed to save session. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleCompleteSession = () => {
    if (!activeSession) {
      toast({
        title: "No Active Session",
        description: "Please start a training session first",
        variant: "destructive"
      });
      return;
    }

    const sessionId = activeSession.sessionId || activeSession.id;
    if (!sessionId) {
      toast({
        title: "Session ID Missing",
        description: "Invalid session data. Cannot complete session.",
        variant: "destructive"
      });
      return;
    }

    completeSession.mutate(sessionId);
  };

  const handleContinueConversation = () => {
    if (!activeSession) {
      toast({
        title: "No Active Session",
        description: "Please start a training session first",
        variant: "destructive"
      });
      return;
    }

    // Fix session ID handling - use sessionId or id as fallback
    const sessionId = activeSession.sessionId || activeSession.id;
    console.log('🔍 SessionId Debug:', {
      activeSession: activeSession,
      sessionId: sessionId,
      activeSessionKeys: Object.keys(activeSession)
    });

    if (!sessionId) {
      toast({
        title: "Session ID Missing",
        description: "Invalid session data. Please restart the training session.",
        variant: "destructive"
      });
      return;
    }

    // Trigger continue conversation with explicit empty customer message for auto-generation
    continueConversation.mutate({ 
      sessionId: sessionId, 
      customerMessage: '' // Empty string triggers auto-generated customer questions
    });
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

      <div className="container mx-auto py-4 px-2 sm:py-8 sm:px-4 max-w-7xl">
        {/* BrezCode Header */}
        <div className="text-center mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 text-center">BrezCode AI Training Platform</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2">
            Train Dr. Sakura Wellness with breast health coaching scenarios. 
            Practice empathetic conversations and improve health guidance skills.
          </p>
        </div>

        <Tabs defaultValue="training" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto text-xs sm:text-sm">
            <TabsTrigger value="training" className="px-2 py-2">Training</TabsTrigger>
            <TabsTrigger value="scenarios" className="px-2 py-2">Scenarios</TabsTrigger>
            <TabsTrigger value="analytics" className="px-2 py-2">Performance</TabsTrigger>
          </TabsList>

          {/* Training Session */}
          <TabsContent value="training" className="space-y-4 sm:space-y-6">
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
                  <CardTitle className="flex items-center justify-between">
                    Ready to Train Dr. Sakura Wellness
                    <Badge variant="outline" className="text-sm">
                      Training Session #{sessionCounter} - {new Date().toLocaleDateString()}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Browse scenarios using the arrows below and select one to begin training.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {scenarios.length > 0 && (
                    <>
                      {/* Scenario Carousel */}
                      <div className="relative">
                        <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-white shadow-lg">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <CardTitle className="text-2xl font-bold text-pink-800 mb-2 leading-tight">
                                  {scenarios[currentScenarioIndex]?.name}
                                </CardTitle>
                                <CardDescription className="text-base text-gray-700 leading-relaxed">
                                  {scenarios[currentScenarioIndex]?.description}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-6">
                              {/* Difficulty and Scenario Info - Relocated above Patient Profile */}
                              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg border border-pink-200">
                                <div className="flex items-center space-x-2">
                                  {getDifficultyIcon(scenarios[currentScenarioIndex]?.difficulty)}
                                  <Badge className={DIFFICULTY_COLORS[scenarios[currentScenarioIndex]?.difficulty]}>
                                    {scenarios[currentScenarioIndex]?.difficulty}
                                  </Badge>
                                </div>
                                <Badge variant="outline" className="text-xs text-gray-600 bg-white">
                                  Scenario {currentScenarioIndex + 1} of {scenarios.length}
                                </Badge>
                              </div>

                              {/* Customer Situation Section */}
                              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <div className="flex items-center gap-2 mb-3">
                                  <User className="h-4 w-4 text-blue-600" />
                                  <h3 className="font-semibold text-blue-800">Patient Profile</h3>
                                </div>
                                <div className="text-sm text-blue-900 leading-relaxed">
                                  {(() => {
                                    const persona = scenarios[currentScenarioIndex]?.customerPersona;
                                    if (typeof persona === 'string') {
                                      try {
                                        const parsed = JSON.parse(persona);
                                        return (
                                          <div className="space-y-2">
                                            {parsed.name && <div><span className="font-medium">Name:</span> {parsed.name}</div>}
                                            {parsed.age && <div><span className="font-medium">Age:</span> {parsed.age}</div>}
                                            {parsed.role && <div><span className="font-medium">Occupation:</span> {parsed.role}</div>}
                                            {parsed.background && <div><span className="font-medium">Background:</span> {parsed.background}</div>}
                                            {parsed.concerns && Array.isArray(parsed.concerns) && (
                                              <div>
                                                <span className="font-medium">Main Concerns:</span>
                                                <ul className="list-disc list-inside ml-4 mt-1">
                                                  {parsed.concerns.map((concern: string, i: number) => (
                                                    <li key={i}>{concern}</li>
                                                  ))}
                                                </ul>
                                              </div>
                                            )}
                                            {parsed.goals && Array.isArray(parsed.goals) && (
                                              <div>
                                                <span className="font-medium">Goals:</span>
                                                <ul className="list-disc list-inside ml-4 mt-1">
                                                  {parsed.goals.map((goal: string, i: number) => (
                                                    <li key={i}>{goal}</li>
                                                  ))}
                                                </ul>
                                              </div>
                                            )}
                                            {parsed.communicationStyle && (
                                              <div><span className="font-medium">Communication Style:</span> {parsed.communicationStyle}</div>
                                            )}
                                          </div>
                                        );
                                      } catch {
                                        return persona;
                                      }
                                    }
                                    return persona || 'No patient profile available';
                                  })()}
                                </div>
                              </div>

                              {/* Training Objectives Section */}
                              <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                                <div className="flex items-center gap-2 mb-3">
                                  <Target className="h-4 w-4 text-pink-600" />
                                  <h3 className="font-semibold text-pink-800">Training Goals</h3>
                                </div>
                                <ul className="space-y-2">
                                  {(scenarios[currentScenarioIndex]?.objectives || []).map((obj, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                      <div className="w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-pink-700">{i + 1}</span>
                                      </div>
                                      <span className="text-sm text-pink-900 leading-relaxed">{obj}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Session Info */}
                              <div className="flex items-center justify-center gap-4 pt-2 border-t border-pink-200">
                                <Badge variant="outline" className="px-3 py-1">
                                  <Clock className="h-3 w-3 mr-2" />
                                  {scenarios[currentScenarioIndex]?.timeframeMins} minutes
                                </Badge>
                                <Badge variant="outline" className="px-3 py-1 bg-pink-100 text-pink-700 border-pink-300">
                                  <Heart className="h-3 w-3 mr-2" />
                                  Health Coaching
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Navigation Controls */}
                      <div className="flex items-center justify-center space-x-4">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => navigateScenario('left')}
                          className="h-12 w-12 rounded-full border-2 border-pink-300 hover:bg-pink-50"
                        >
                          <ArrowLeft className="h-5 w-5 text-pink-600" />
                        </Button>

                        <Button
                          onClick={selectCurrentScenario}
                          size="lg"
                          className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 text-lg font-medium"
                        >
                          Select Scenario
                        </Button>

                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => navigateScenario('right')}
                          className="h-12 w-12 rounded-full border-2 border-pink-300 hover:bg-pink-50"
                        >
                          <ArrowRight className="h-5 w-5 text-pink-600" />
                        </Button>
                      </div>

                      {/* Scenario Indicators */}
                      <div className="flex justify-center space-x-2">
                        {scenarios.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentScenarioIndex(index)}
                            className={`h-2 w-8 rounded-full transition-all ${
                              index === currentScenarioIndex 
                                ? 'bg-pink-600' 
                                : 'bg-pink-200 hover:bg-pink-300'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
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
                    {/* Patient Profile Section */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center gap-2 mb-3">
                        <User className="h-4 w-4 text-blue-600" />
                        <h4 className="font-medium text-blue-700">Patient Profile</h4>
                      </div>
                      <div className="text-sm text-blue-900 leading-relaxed">
                        {(() => {
                          const persona = selectedScenario?.customerPersona;
                          if (typeof persona === 'string') {
                            try {
                              const parsed = JSON.parse(persona);
                              return (
                                <div className="space-y-2">
                                  {parsed.name && <div><span className="font-medium">Name:</span> {parsed.name}</div>}
                                  {parsed.age && <div><span className="font-medium">Age:</span> {parsed.age}</div>}
                                  {parsed.role && <div><span className="font-medium">Occupation:</span> {parsed.role}</div>}
                                  {parsed.background && <div><span className="font-medium">Background:</span> {parsed.background}</div>}
                                  {parsed.concerns && Array.isArray(parsed.concerns) && (
                                    <div>
                                      <span className="font-medium">Main Concerns:</span>
                                      <ul className="list-disc list-inside ml-4 mt-1">
                                        {parsed.concerns.map((concern: string, i: number) => (
                                          <li key={i}>{concern}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {parsed.goals && Array.isArray(parsed.goals) && (
                                    <div>
                                      <span className="font-medium">Goals:</span>
                                      <ul className="list-disc list-inside ml-4 mt-1">
                                        {parsed.goals.map((goal: string, i: number) => (
                                          <li key={i}>{goal}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {parsed.communicationStyle && (
                                    <div><span className="font-medium">Communication Style:</span> {parsed.communicationStyle}</div>
                                  )}
                                </div>
                              );
                            } catch {
                              return persona;
                            }
                          }
                          return persona || 'No patient profile available';
                        })()}
                      </div>
                    </div>

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
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
                {/* Chat Interface */}
                <div className="lg:col-span-3 order-2 lg:order-1">
                  <Card className="h-[500px] sm:h-[600px] flex flex-col">
                    <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-3 sm:pb-4 bg-pink-50">
                      <div className="w-full sm:w-auto">
                        <CardTitle className="text-base sm:text-lg flex items-center">
                          <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-pink-600" />
                          Training Dr. Sakura Wellness
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">{selectedScenario.name}</CardDescription>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full sm:w-auto text-xs sm:text-sm"
                        onClick={() => endTrainingSession.mutate(activeSession.id)}
                      >
                        End Session
                      </Button>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col p-2 sm:p-6">
                      <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 mb-3 sm:mb-4 max-h-[380px] sm:max-h-[500px] pr-1 sm:pr-2" style={{ scrollbarWidth: 'thin' }}>
                        {messages.map((message, index) => (
                          <div 
                            key={index} 
                            className={`flex mb-4 ${
                              message.role === 'customer' ? 'justify-start' : 
                              message.role === 'avatar' ? 'justify-end' : 
                              'justify-center'
                            }`}
                          >
                            <div className={`flex items-start space-x-2 sm:space-x-3 max-w-[90%] sm:max-w-[85%] ${
                              message.role === 'avatar' ? 'flex-row-reverse space-x-reverse' : ''
                            }`}>
                              <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                                <AvatarFallback className={
                                  message.role === 'customer' 
                                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-200' 
                                    : message.role === 'avatar'
                                    ? 'bg-pink-100 text-pink-700 border-2 border-pink-200'
                                    : 'bg-gray-100 text-gray-600'
                                }>
                                  {message.role === 'customer' ? 
                                    <User className="h-4 w-4 sm:h-5 sm:w-5" /> : 
                                   message.role === 'avatar' ? 
                                    <Heart className="h-4 w-4 sm:h-5 sm:w-5" /> : 
                                    <Settings className="h-3 w-3 sm:h-4 sm:w-4" />}
                                </AvatarFallback>
                              </Avatar>
                              <div className={`rounded-lg px-3 py-2 sm:px-4 sm:py-3 shadow-sm ${
                                message.role === 'customer' 
                                  ? 'bg-blue-50 text-blue-900 border border-blue-200' 
                                  : message.role === 'avatar'
                                  ? (message as any).improved_from_feedback 
                                    ? 'bg-emerald-50 text-emerald-900 border-2 border-emerald-300 shadow-md'
                                    : 'bg-pink-50 text-pink-900 border border-pink-200'
                                  : 'bg-gray-50 text-gray-800 border border-gray-200'
                              }`}>
                                <div className={`text-xs font-medium mb-1 ${
                                  message.role === 'customer' ? 'text-blue-600' :
                                  message.role === 'avatar' 
                                    ? (message as any).improved_from_feedback ? 'text-emerald-600' : 'text-pink-600'
                                    : 'text-gray-500'
                                }`}>
                                  {message.role === 'customer' ? '🧑‍⚕️ Patient' : 
                                   message.role === 'avatar' ? 
                                     (message as any).improved_from_feedback ? '✨ Dr. Sakura (Improved)' : '🩺 Dr. Sakura'
                                     : '🎯 System'}
                                </div>
                                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

                                {/* Show user comment if exists */}
                                {(message as any).user_comment && (
                                  <div className="mt-4 p-3 bg-pink-100 border-l-4 border-pink-300 rounded-r-lg">
                                    <div className="text-xs font-medium text-pink-700 mb-1">💬 Your Feedback:</div>
                                    <p className="text-sm text-pink-800 italic">"{(message as any).user_comment}"</p>
                                  </div>
                                )}

                                {/* Show improved response if exists */}
                                {(message as any).improved_response && (
                                  <div id={`improved-response-${message.id}`} className="mt-4 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-emerald-600 text-sm font-semibold">✨ Dr. Sakura (Revised answer):</span>
                                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                        Improved
                                      </span>
                                    </div>
                                    <p className="text-sm leading-relaxed text-emerald-900 whitespace-pre-wrap">
                                      {(message as any).improved_response}
                                    </p>
                                    {(message as any).improved_quality_score && (
                                      <div className="text-xs text-emerald-600 mt-2 font-medium">
                                        Quality: {(message as any).improved_quality_score}/100
                                      </div>
                                    )}

                                    {/* Iterative feedback controls for improved response */}
                                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-emerald-100">
                                      <div className="flex items-center gap-1">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className={`h-6 px-2 ${messageRatings[`improved_${message.id}`]?.rating === 'thumbs_up' ? 'bg-green-100 text-green-600' : 'hover:bg-green-50'}`}
                                          onClick={() => {
                                            const messageId = `improved_${message.id}`;
                                            setMessageRatings(prev => ({
                                              ...prev,
                                              [messageId]: {
                                                ...prev[messageId],
                                                rating: prev[messageId]?.rating === 'thumbs_up' ? null : 'thumbs_up'
                                              }
                                            }));
                                          }}
                                        >
                                          <ThumbsUp className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className={`h-6 px-2 ${messageRatings[`improved_${message.id}`]?.rating === 'thumbs_down' ? 'bg-red-100 text-red-600' : 'hover:bg-red-50'}`}
                                          onClick={() => {
                                            const messageId = `improved_${message.id}`;
                                            setMessageRatings(prev => ({
                                              ...prev,
                                              [messageId]: {
                                                ...prev[messageId],
                                                rating: prev[messageId]?.rating === 'thumbs_down' ? null : 'thumbs_down'
                                              }
                                            }));
                                          }}
                                        >
                                          <ThumbsDown className="h-3 w-3" />
                                        </Button>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 px-2 text-xs hover:bg-emerald-50"
                                        onClick={() => setShowCommentDialog(`improved_${message.id}`)}
                                      >
                                        <MessageCircleMore className="h-3 w-3 mr-1" />
                                        {messageRatings[`improved_${message.id}`]?.comment ? 'Edit' : 'Add'} Comment
                                      </Button>
                                    </div>

                                    {/* Display comment on improved response */}
                                    {messageRatings[`improved_${message.id}`]?.comment && (
                                      <div className="mt-2 p-2 bg-emerald-100 rounded text-xs">
                                        <div className="font-medium text-emerald-700 mb-1">Your Comment on Improved Response:</div>
                                        <div className="text-emerald-800">{messageRatings[`improved_${message.id}`].comment}</div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {message.quality_score && (
                                  <div className={`text-xs mt-2 font-medium ${
                                    (message as any).improved_from_feedback ? 'text-emerald-600' : 'text-pink-600'
                                  }`}>
                                    Quality: {message.quality_score}/100
                                  </div>
                                )}
                                {message.emotion && (
                                  <div className="text-xs text-blue-600 mt-1">
                                    Emotion: {message.emotion}
                                  </div>
                                )}



                                {/* Multiple choice functionality removed for streamlined experience */}

                                {/* Comment and Rating Controls - Only for Dr. Sakura responses */}
                                {message.role === 'avatar' && message.id && (
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2 sm:mt-3 pt-2 border-t border-pink-100">
                                    <div className="flex items-center gap-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className={`h-6 px-2 text-xs ${messageRatings[message.id]?.rating === 'thumbs_up' ? 'bg-green-100 text-green-600' : 'hover:bg-green-50'}`}
                                        onClick={() => {
                                          const messageId = message.id!;
                                          setMessageRatings(prev => ({
                                            ...prev,
                                            [messageId]: {
                                              ...prev[messageId],
                                              rating: prev[messageId]?.rating === 'thumbs_up' ? null : 'thumbs_up'
                                            }
                                          }));
                                        }}
                                      >
                                        <ThumbsUp className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className={`h-6 px-2 text-xs ${messageRatings[message.id]?.rating === 'thumbs_down' ? 'bg-red-100 text-red-600' : 'hover:bg-red-50'}`}
                                        onClick={() => {
                                          const messageId = message.id!;
                                          setMessageRatings(prev => ({
                                            ...prev,
                                            [messageId]: {
                                              ...prev[messageId],
                                              rating: prev[messageId]?.rating === 'thumbs_down' ? null : 'thumbs_down'
                                            }
                                          }));
                                        }}
                                      >
                                        <ThumbsDown className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 px-2 text-xs hover:bg-pink-50"
                                      onClick={() => setShowCommentDialog(message.id!)}
                                    >
                                      <MessageCircleMore className="h-3 w-3 mr-1" />
                                      <span className="hidden sm:inline">{messageRatings[message.id]?.comment ? 'Edit' : 'Add'} Comment</span>
                                      <span className="sm:hidden">Comment</span>
                                    </Button>
                                  </div>
                                )}

                                {/* Display existing comment */}
                                {message.id && messageRatings[message.id]?.comment && (
                                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                                    <div className="font-medium text-gray-600 mb-1">Your Comment:</div>
                                    <div className="text-gray-800">{messageRatings[message.id].comment}</div>
                                  </div>
                                )}
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
                            className="flex-1 bg-pink-600 hover:bg-pink-700 text-xs sm:text-sm py-2"
                          >
                            <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Continue AI Conversation</span>
                            <span className="sm:hidden">Continue AI</span>
                          </Button>
                          
                          <Button 
                            onClick={handleCompleteSession}
                            disabled={completeSession.isPending}
                            className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm py-2 px-3 sm:px-4"
                          >
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            {completeSession.isPending ? (
                              <>
                                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-spin" />
                                <span className="hidden sm:inline">Completing...</span>
                                <span className="sm:hidden">Done...</span>
                              </>
                            ) : (
                              <>
                                <span className="hidden sm:inline">Complete Session</span>
                                <span className="sm:hidden">Complete</span>
                              </>
                            )}
                          </Button>
                        </div>

                        {/* Manual Chat Input */}
                        <div className="flex space-x-2 pr-16">
                          <Input
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Or manually type as customer..."
                            disabled={isSending}
                            className="flex-1 text-xs sm:text-sm py-2"
                          />
                          <Button 
                            onClick={handleSendMessage} 
                            disabled={isSending || !currentMessage.trim()}
                            size="sm"
                            className="bg-pink-600 hover:bg-pink-700 px-2 sm:px-3 relative z-10"
                          >
                            <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Scenario Information Panel */}
                <div className="lg:col-span-1 order-1 lg:order-2 space-y-3 sm:space-y-4">
                  {/* Scenario Overview */}
                  <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-white">
                    <CardHeader className="pb-2 sm:pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Target className="h-4 w-4 text-pink-600" />
                        Scenario Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-xs">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-pink-800">{selectedScenario?.name}</span>
                            <Badge className={DIFFICULTY_COLORS[selectedScenario?.difficulty]}>
                              {selectedScenario?.difficulty}
                            </Badge>
                          </div>
                          <p className="text-gray-700 text-xs leading-relaxed">{selectedScenario?.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 pt-2 border-t border-pink-200">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {selectedScenario?.timeframeMins || 15} min
                          </Badge>
                          <Badge variant="outline" className="text-xs bg-pink-100 text-pink-700 border-pink-300">
                            <Heart className="h-3 w-3 mr-1" />
                            Health Coaching
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Patient Profile */}
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader className="pb-2 sm:pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        Patient Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-blue-900 leading-relaxed">
                        {(() => {
                          const persona = selectedScenario?.customerPersona;
                          if (typeof persona === 'string') {
                            try {
                              const parsed = JSON.parse(persona);
                              return (
                                <div className="space-y-2">
                                  {parsed.name && <div><span className="font-medium">Name:</span> {parsed.name}</div>}
                                  {parsed.age && <div><span className="font-medium">Age:</span> {parsed.age}</div>}
                                  {parsed.role && <div><span className="font-medium">Occupation:</span> {parsed.role}</div>}
                                  {parsed.background && <div><span className="font-medium">Background:</span> {parsed.background}</div>}
                                  {parsed.mood && <div><span className="font-medium">Current Mood:</span> {parsed.mood}</div>}
                                  {parsed.concerns && Array.isArray(parsed.concerns) && (
                                    <div>
                                      <span className="font-medium">Main Concerns:</span>
                                      <ul className="list-disc list-inside ml-3 mt-1">
                                        {parsed.concerns.slice(0, 2).map((concern: string, i: number) => (
                                          <li key={i}>{concern}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              );
                            } catch {
                              return persona;
                            }
                          }
                          return persona || selectedScenario?.customerMood || 'Patient with health concerns';
                        })()}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Dr. Sakura's Role */}
                  <Card className="border-pink-200 bg-pink-50">
                    <CardHeader className="pb-2 sm:pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Bot className="h-4 w-4 text-pink-600" />
                        Dr. Sakura's Role
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-pink-900 leading-relaxed">
                        <p><span className="font-medium">Expertise:</span> Breast health coaching & patient communication</p>
                        <p><span className="font-medium">Approach:</span> Empathetic, evidence-based guidance</p>
                        <p><span className="font-medium">Focus:</span> Patient anxiety reduction & health education</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Training Objectives */}
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader className="pb-2 sm:pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Award className="h-4 w-4 text-green-600" />
                        Training Objectives
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-xs text-green-900 space-y-1">
                        {(selectedScenario?.objectives || selectedScenario?.successCriteria || [
                          'Provide accurate information about mammogram process',
                          'Address anxiety with empathy and reassurance', 
                          'Offer practical preparation tips',
                          'Encourage regular screening compliance'
                        ]).map((obj, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="w-4 h-4 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-green-700">{i + 1}</span>
                            </div>
                            <span className="leading-relaxed">{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Session Progress (Compact) */}
                  <Card className="border-gray-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs flex items-center gap-2">
                        <BarChart3 className="h-3 w-3 text-gray-600" />
                        Session Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Exchanges</span>
                          <span>{Math.floor(messages.filter(m => m.role !== 'system').length / 2)}</span>
                        </div>
                        <Progress value={Math.min((messages.length / 10) * 100, 100)} className="h-1 bg-pink-100" />
                      </div>
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
                          {(scenario?.keyLearningPoints || []).slice(0, 3).map((point, i) => (
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
                <div className="flex items-center justify-between">
                  <CardTitle>Recent BrezCode Training Sessions</CardTitle>
                  <Link href="/performance">
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Full Performance
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Heart className="w-12 h-12 mx-auto mb-3 text-pink-400" />
                  <p>Complete training sessions to track your progress!</p>
                  <div className="mt-4">
                    <Link href="/performance">
                      <Button className="bg-pink-600 hover:bg-pink-700">
                        <FileText className="h-4 w-4 mr-2" />
                        View Performance History
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Comment Dialog */}
      {showCommentDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Add Comment to Dr. Sakura's Response</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Your feedback on this response:
                </label>
                <textarea
                  placeholder="Share your thoughts on Dr. Sakura's response quality, accuracy, empathy, etc..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  rows={4}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCommentDialog(null);
                  setNewComment('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (showCommentDialog && newComment.trim()) {
                    // Store comment locally for display
                    setMessageRatings(prev => ({
                      ...prev,
                      [showCommentDialog]: {
                        ...prev[showCommentDialog],
                        comment: newComment.trim()
                      }
                    }));

                    // Get current rating for scoring
                    const currentRating = messageRatings[showCommentDialog]?.rating;
                    const rating = currentRating === 'thumbs_up' ? 5 : currentRating === 'thumbs_down' ? 1 : 3;

                    // Check if this is feedback on an improved response
                    if (showCommentDialog.startsWith('improved_')) {
                      // Handle iterative feedback on improved response
                      const originalMessageId = showCommentDialog.replace('improved_', '');
                      const message = messages.find(m => m.id === originalMessageId);
                      const improvedMessageId = (message as any)?.improved_message_id;

                      if (improvedMessageId) {
                        // Submit feedback on the improved response
                        submitCommentFeedback.mutate({
                          messageId: improvedMessageId,
                          comment: newComment.trim(),
                          rating: rating
                        });
                      }
                    } else {
                      // Handle original message feedback - showCommentDialog contains the message ID
                      const messageId = showCommentDialog;

                      console.log('🎯 Submitting comment for message ID:', messageId);
                      console.log('🎯 Comment text:', newComment.trim());

                      if (messageId) {
                        // Submit feedback for immediate learning
                        submitCommentFeedback.mutate({
                          messageId: messageId,
                          comment: newComment.trim(),
                          rating: rating
                        });
                      }
                    }

                    setShowCommentDialog(null);
                    setNewComment('');
                  }
                }}
                disabled={!newComment.trim() || submitCommentFeedback.isPending}
                className="flex-1 bg-pink-600 hover:bg-pink-700"
              >
                {submitCommentFeedback.isPending ? 'Training Dr. Sakura...' : 'Submit & Train'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}