import { useState, useEffect, useRef } from 'react';
import { useParams } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  User, 
  Send, 
  MessageSquare, 
  ThumbsUp,
  ThumbsDown,
  Edit3,
  CheckCircle,
  Clock,
  Target,
  AlertCircle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface TrainingDialogue {
  id: number;
  messageOrder: number;
  speaker: string;
  message: string;
  messageType: string;
  timestamp: string;
  needsImprovement?: boolean;
  trainerFeedback?: string;
  suggestedResponse?: string;
  feedbackCategory?: string;
  isReviewed?: boolean;
}

interface TrainingSession {
  id: number;
  sessionName: string;
  aiAssistantRole: string;
  status: string;
  performanceScore?: number;
  scenario: {
    title: string;
    description: string;
    customerPersona: any;
    objectives: string[];
    context: any;
  };
}

export function AiTrainingSession() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [newMessage, setNewMessage] = useState('');
  const [feedbackDialogueId, setFeedbackDialogueId] = useState<number | null>(null);
  const [feedbackForm, setFeedbackForm] = useState({
    needsImprovement: false,
    trainerFeedback: '',
    suggestedResponse: '',
    feedbackCategory: ''
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch session details
  const { data: session, isLoading: loadingSession } = useQuery({
    queryKey: [`/api/ai-training/sessions/${sessionId}`],
    queryFn: async () => {
      const response = await fetch(`/api/ai-training/sessions/${sessionId}/dialogues`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch session');
      return response.json();
    },
    enabled: !!sessionId
  });

  // Fetch dialogue history
  const { data: dialogues = [], isLoading: loadingDialogues, refetch: refetchDialogues } = useQuery({
    queryKey: [`/api/ai-training/sessions/${sessionId}/dialogues`],
    queryFn: async () => {
      const response = await fetch(`/api/ai-training/sessions/${sessionId}/dialogues`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch dialogues');
      return response.json();
    },
    enabled: !!sessionId
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { speaker: string; message: string; messageType?: string }) => {
      const response = await fetch(`/api/ai-training/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(messageData)
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    },
    onSuccess: () => {
      refetchDialogues();
      setNewMessage('');
    }
  });

  // Add feedback mutation
  const addFeedbackMutation = useMutation({
    mutationFn: async ({ dialogueId, feedback }: { dialogueId: number; feedback: any }) => {
      const response = await fetch(`/api/ai-training/dialogues/${dialogueId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(feedback)
      });
      if (!response.ok) throw new Error('Failed to add feedback');
      return response.json();
    },
    onSuccess: () => {
      refetchDialogues();
      setFeedbackDialogueId(null);
      setFeedbackForm({
        needsImprovement: false,
        trainerFeedback: '',
        suggestedResponse: '',
        feedbackCategory: ''
      });
    }
  });

  // Complete session mutation
  const completeSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/ai-training/sessions/${sessionId}/complete`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to complete session');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/ai-training/sessions/${sessionId}`] });
      refetchDialogues();
    }
  });

  useEffect(() => {
    scrollToBottom();
  }, [dialogues]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = (speaker: 'customer' | 'trainer') => {
    if (!newMessage.trim()) return;
    
    sendMessageMutation.mutate({
      speaker,
      message: newMessage,
      messageType: 'text'
    });
  };

  const startFeedback = (dialogueId: number, dialogue: TrainingDialogue) => {
    setFeedbackDialogueId(dialogueId);
    setFeedbackForm({
      needsImprovement: dialogue.needsImprovement || false,
      trainerFeedback: dialogue.trainerFeedback || '',
      suggestedResponse: dialogue.suggestedResponse || '',
      feedbackCategory: dialogue.feedbackCategory || ''
    });
  };

  const submitFeedback = () => {
    if (!feedbackDialogueId) return;
    
    addFeedbackMutation.mutate({
      dialogueId: feedbackDialogueId,
      feedback: feedbackForm
    });
  };

  const getSpeakerIcon = (speaker: string) => {
    switch (speaker) {
      case 'ai_assistant': return <Bot className="w-5 h-5" />;
      case 'customer': return <User className="w-5 h-5" />;
      case 'trainer': return <MessageSquare className="w-5 h-5" />;
      default: return <MessageSquare className="w-5 h-5" />;
    }
  };

  const getSpeakerColor = (speaker: string) => {
    switch (speaker) {
      case 'ai_assistant': return 'bg-blue-50 border-blue-200';
      case 'customer': return 'bg-green-50 border-green-200';
      case 'trainer': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (loadingSession || loadingDialogues) {
    return <div className="flex items-center justify-center h-64">Loading training session...</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto mobile-safe-padding mobile-spacing contain-layout mobile-force-contain">
      {/* Session Header */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="min-w-0 flex-1">
              <CardTitle className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:gap-3 sm:space-y-0">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  <span className="text-lg sm:text-xl">AI Training Session</span>
                  <Badge variant="outline" className="text-xs">Active</Badge>
                </div>
              </CardTitle>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Role-playing as: <strong>{session?.aiAssistantRole || 'AI Assistant'}</strong>
              </p>
            </div>
            <div className="flex w-full sm:w-auto mobile-force-contain">
              <Button 
                onClick={() => completeSessionMutation.mutate()}
                disabled={completeSessionMutation.isPending}
                variant="outline"
                size="default"
                className="flex items-center justify-center gap-2 text-sm px-3 py-2 min-h-[44px] mobile-btn-fix"
              >
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline truncate">Complete Session</span>
                <span className="sm:hidden truncate">Complete</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] sm:h-[700px] flex flex-col">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                Training Conversation
              </CardTitle>
            </CardHeader>
            
            {/* Messages Area */}
            <CardContent className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 p-3 sm:p-4">
              {dialogues.map((dialogue: TrainingDialogue) => (
                <div key={dialogue.id} className={`p-3 sm:p-4 rounded-lg border ${getSpeakerColor(dialogue.speaker)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-2 min-w-0 flex-1">
                      {getSpeakerIcon(dialogue.speaker)}
                      <span className="font-medium capitalize text-sm sm:text-base truncate">
                        {dialogue.speaker.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500 hidden sm:inline">
                        {new Date(dialogue.timestamp).toLocaleTimeString()}
                      </span>
                      {dialogue.isReviewed && (
                        <Badge variant="secondary" className="text-xs">
                          Reviewed
                        </Badge>
                      )}
                    </div>
                    
                    {dialogue.speaker === 'ai_assistant' && (
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startFeedback(dialogue.id, dialogue)}
                          className="p-1 h-6 w-6"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        {dialogue.needsImprovement ? (
                          <ThumbsDown className="w-4 h-4 text-red-500" />
                        ) : dialogue.isReviewed ? (
                          <ThumbsUp className="w-4 h-4 text-green-500" />
                        ) : null}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-900 text-sm sm:text-base break-words">{dialogue.message}</p>
                  
                  {dialogue.trainerFeedback && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-yellow-800">Trainer Feedback</span>
                        {dialogue.feedbackCategory && (
                          <Badge variant="outline" className="text-xs">
                            {dialogue.feedbackCategory}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-yellow-800">{dialogue.trainerFeedback}</p>
                      {dialogue.suggestedResponse && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-yellow-800">Suggested:</span>
                          <p className="text-sm text-yellow-700 italic">"{dialogue.suggestedResponse}"</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>
            
            {/* Message Input */}
            <div className="border-t p-3 sm:p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message as the customer..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage('customer')}
                  disabled={sendMessageMutation.isPending}
                  className="text-sm sm:text-base"
                />
                <Button 
                  onClick={() => sendMessage('customer')}
                  disabled={sendMessageMutation.isPending || !newMessage.trim()}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4"
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send as Customer</span>
                  <span className="sm:hidden">Send</span>
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between mt-2 gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage('trainer')}
                  disabled={sendMessageMutation.isPending || !newMessage.trim()}
                  className="text-xs sm:text-sm"
                >
                  Send as Trainer
                </Button>
                <span className="text-xs text-gray-500 text-center sm:text-right">
                  AI responds automatically to customer messages
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Scenario Info & Feedback Panel */}
        <div className="space-y-4 sm:space-y-6">
          {/* Scenario Information */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                Scenario Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
              <div>
                <h4 className="font-medium mb-2">Customer Persona</h4>
                <p className="text-sm text-gray-600">
                  {session?.scenario?.customerPersona?.name} - {session?.scenario?.customerPersona?.role}
                </p>
                <p className="text-xs text-gray-500">
                  {session?.scenario?.customerPersona?.company}
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Objectives</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {session?.scenario?.objectives?.map((objective: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Form */}
          {feedbackDialogueId && (
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">Provide Training Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={feedbackForm.needsImprovement}
                      onChange={(e) => setFeedbackForm({
                        ...feedbackForm,
                        needsImprovement: e.target.checked
                      })}
                    />
                    <span className="text-sm">Needs Improvement</span>
                  </label>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Feedback Category</label>
                  <select
                    value={feedbackForm.feedbackCategory}
                    onChange={(e) => setFeedbackForm({
                      ...feedbackForm,
                      feedbackCategory: e.target.value
                    })}
                    className="w-full mt-1 p-2 border rounded"
                  >
                    <option value="">Select category</option>
                    <option value="tone">Tone & Communication</option>
                    <option value="accuracy">Information Accuracy</option>
                    <option value="empathy">Empathy & Understanding</option>
                    <option value="sales_technique">Sales Technique</option>
                    <option value="problem_solving">Problem Solving</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Trainer Feedback</label>
                  <Textarea
                    placeholder="Provide specific feedback on this response..."
                    value={feedbackForm.trainerFeedback}
                    onChange={(e) => setFeedbackForm({
                      ...feedbackForm,
                      trainerFeedback: e.target.value
                    })}
                    className="mt-1"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Suggested Response</label>
                  <Textarea
                    placeholder="What should the AI have said instead?"
                    value={feedbackForm.suggestedResponse}
                    onChange={(e) => setFeedbackForm({
                      ...feedbackForm,
                      suggestedResponse: e.target.value
                    })}
                    className="mt-1"
                    rows={3}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={submitFeedback}
                    disabled={addFeedbackMutation.isPending}
                    className="flex items-center justify-center gap-2 text-sm px-4 py-2 min-h-[44px] w-full sm:flex-1"
                    size="default"
                  >
                    Save Feedback
                  </Button>
                  <Button 
                    variant="outline"
                    size="default"
                    className="flex items-center justify-center gap-2 text-sm px-4 py-2 min-h-[44px] w-full sm:w-auto"
                    onClick={() => setFeedbackDialogueId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}