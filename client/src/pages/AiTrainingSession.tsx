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
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;
  
  // Debug sessionId extraction
  console.log('🔍 Component Debug:', {
    params,
    sessionId,
    sessionIdType: typeof sessionId,
    sessionIdValue: sessionId
  });
  
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

  // Fetch session details - use avatar training routes
  const { data: session, isLoading: loadingSession } = useQuery({
    queryKey: [`/api/avatar-training/sessions/${sessionId}`],
    queryFn: async () => {
      console.log('🔍 Query sessionId:', { sessionId, type: typeof sessionId });
      if (!sessionId) {
        console.error('❌ Query: No session ID available');
        throw new Error('No session ID');
      }
      const response = await fetch(`/api/avatar-training/sessions/${sessionId}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        console.error('❌ Query failed:', response.status, response.statusText);
        throw new Error('Failed to fetch session');
      }
      const result = await response.json();
      return result.session || result;
    },
    enabled: !!sessionId
  });

  // Use session messages as dialogues
  const dialogues = session?.messages || session?.conversationHistory || [];
  const loadingDialogues = loadingSession;
  const refetchDialogues = () => queryClient.invalidateQueries({ 
    queryKey: [`/api/avatar-training/sessions/${sessionId}`] 
  });

  // Send message mutation - use continue endpoint
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { speaker: string; message: string; messageType?: string }) => {
      console.log('🔍 SessionId Debug:', {
        sessionId,
        type: typeof sessionId,
        urlParams: useParams(),
        messageData
      });
      
      if (!sessionId) {
        console.error('❌ No session ID available:', { sessionId });
        throw new Error('No session ID available');
      }
      
      console.log('🔄 Continue conversation request:', {
        sessionId: sessionId,
        customerMessage: messageData.message,
        urlSessionId: sessionId
      });
      
      const response = await fetch(`/api/avatar-training/sessions/${sessionId}/continue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ customerMessage: messageData.message })
      });
      
      console.log('📡 Continue response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Continue conversation failed:', errorData);
        throw new Error('Failed to continue conversation');
      }
      
      const result = await response.json();
      console.log('✅ Continue conversation success:', result.success);
      return result;
    },
    onSuccess: (data) => {
      console.log('🎯 Continue conversation onSuccess:', data);
      refetchDialogues();
      setNewMessage('');
    },
    onError: (error) => {
      console.error('❌ Continue conversation error:', error);
    }
  });

  // Add feedback mutation
  const addFeedbackMutation = useMutation({
    mutationFn: async ({ dialogueId, feedback }: { dialogueId: number; feedback: any }) => {
      const response = await fetch(`/api/avatar-training/sessions/${sessionId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ dialogueId, feedback })
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
      const response = await fetch(`/api/avatar-training/sessions/${sessionId}/complete`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to complete session');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/avatar-training/sessions/${sessionId}`] });
      refetchDialogues();
    }
  });

  useEffect(() => {
    scrollToBottom();
  }, [dialogues]);

  // Auto-continue conversation when component loads
  useEffect(() => {
    if (sessionId && dialogues.length <= 1 && !sendMessageMutation.isPending) {
      console.log('🎯 Auto-continue triggered:', { sessionId, dialoguesLength: dialogues.length });
      // Auto-start conversation with empty message to trigger AI
      setTimeout(() => {
        sendMessageMutation.mutate({
          speaker: 'customer',
          message: '',
          messageType: 'auto_continue'
        });
      }, 1000);
    }
  }, [sessionId, dialogues.length]);

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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Session Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3">
                <Bot className="w-6 h-6 text-blue-600" />
                AI Training Session
                <Badge variant="outline">Active</Badge>
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Role-playing as: <strong>{session?.aiAssistantRole || 'AI Assistant'}</strong>
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => completeSessionMutation.mutate()}
                disabled={completeSessionMutation.isPending}
                variant="outline"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Session
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[700px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Training Conversation
              </CardTitle>
            </CardHeader>

            {/* Messages Area */}
            <CardContent className="flex-1 overflow-y-auto space-y-4 p-6">
              <div className="max-w-full space-y-4">
                {dialogues.map((dialogue: any, index: number) => (
                  <div key={dialogue.id || `msg-${index}`} className={`p-4 rounded-lg border max-w-full break-words ${getSpeakerColor(dialogue.role || dialogue.speaker)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      {getSpeakerIcon(dialogue.role || dialogue.speaker)}
                      <span className="font-medium capitalize">
                        {(dialogue.role || dialogue.speaker || 'system').replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(dialogue.timestamp || dialogue.createdAt || new Date()).toLocaleTimeString()}
                      </span>
                      {dialogue.isReviewed && (
                        <Badge variant="secondary" className="text-xs">
                          Reviewed
                        </Badge>
                      )}
                    </div>

                    {dialogue.speaker === 'ai_assistant' && (
                      <div className="flex gap-1">
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

                  <p className="text-gray-900">{dialogue.content || dialogue.message}</p>

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
              </div>
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Message Input */}
            <div className="border-t p-6">
              <div className="flex gap-2 max-w-full">
                <Input
                  placeholder="Type your message as the customer..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage('customer')}
                  disabled={sendMessageMutation.isPending}
                  className="flex-1 min-w-0"
                />
                <Button 
                  onClick={() => sendMessage('customer')}
                  disabled={sendMessageMutation.isPending || !newMessage.trim()}
                  className="flex items-center gap-2 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                  Send as Customer
                </Button>
              </div>
              <div className="flex justify-between mt-2">
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => sendMessage('trainer')}
                    disabled={sendMessageMutation.isPending || !newMessage.trim()}
                  >
                    Send as Trainer
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => sendMessageMutation.mutate({ speaker: 'customer', message: '', messageType: 'continue' })}
                    disabled={sendMessageMutation.isPending}
                  >
                    Continue AI Conversation
                  </Button>
                </div>
                <span className="text-xs text-gray-500">
                  The AI will automatically respond to customer messages
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Scenario Info & Feedback Panel */}
        <div className="space-y-6">
          {/* Scenario Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Scenario Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <CardHeader>
                <CardTitle>Provide Training Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="flex gap-2">
                  <Button 
                    onClick={submitFeedback}
                    disabled={addFeedbackMutation.isPending}
                    className="flex-1"
                  >
                    Save Feedback
                  </Button>
                  <Button 
                    variant="outline"
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