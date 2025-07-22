import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BackButton } from "@/components/BackButton";
import { ScrollToTop } from "@/components/ScrollToTop";
import { 
  Play, 
  Pause, 
  Square, 
  Users, 
  MessageSquare, 
  Clock, 
  Star,
  Eye,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  Target,
  Bot,
  User,
  Settings,
  Plus,
  Trash2,
  BarChart3
} from "lucide-react";
import { useLocation } from "wouter";

interface RoleplayScenario {
  id: number;
  name: string;
  description: string;
  customerType: string;
  scenario: string;
  objectives: string[];
  timeframeMins: number;
  isActive: boolean;
}

interface RoleplaySession {
  id: number;
  scenarioId: number;
  status: string;
  startTime: string;
  endTime?: string;
  customerPersona: string;
  score?: number;
  sessionNotes?: string;
}

interface RoleplayMessage {
  id: number;
  sender: 'customer_ai' | 'assistant_ai';
  message: string;
  timestamp: string;
  feedback?: RoleplayFeedback[];
}

interface RoleplayFeedback {
  id: number;
  feedbackType: 'improvement' | 'issue' | 'good';
  comment: string;
  suggestion?: string;
}

export default function RoleplayTraining() {
  const [, setLocation] = useLocation();
  const [selectedScenario, setSelectedScenario] = useState<RoleplayScenario | null>(null);
  const [activeSession, setActiveSession] = useState<RoleplaySession | null>(null);
  const [messages, setMessages] = useState<RoleplayMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [newFeedback, setNewFeedback] = useState({ messageId: 0, type: 'improvement', comment: '', suggestion: '' });

  const queryClient = useQueryClient();

  // Fetch scenarios
  const { data: scenarios } = useQuery({
    queryKey: ["/api/roleplay/scenarios"],
  });

  // Fetch sessions
  const { data: sessions } = useQuery({
    queryKey: ["/api/roleplay/sessions"],
  });

  // Fetch session details
  const { data: sessionDetails } = useQuery({
    queryKey: ["/api/roleplay/sessions", selectedSession],
    enabled: !!selectedSession,
  });

  // Create scenario mutation
  const createScenarioMutation = useMutation({
    mutationFn: (scenario: Omit<RoleplayScenario, 'id' | 'isActive'>) =>
      apiRequest("/api/roleplay/scenarios", "POST", scenario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/roleplay/scenarios"] });
    },
  });

  // Start session mutation
  const startSessionMutation = useMutation({
    mutationFn: async (sessionData: { scenarioId: number; customerPersona: string }) => {
      const response = await apiRequest("POST", "/api/roleplay/sessions/start", sessionData);
      return response.json();
    },
    onSuccess: (newSession) => {
      setActiveSession(newSession);
      setIsRunning(true);
      setTimeRemaining(selectedScenario?.timeframeMins ? selectedScenario.timeframeMins * 60 : 600);
      setMessages([]);
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { sessionId: number; sender: string; message: string }) => {
      const response = await apiRequest("POST", "/api/roleplay/sessions/message", messageData);
      return response.json();
    },
    onSuccess: (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
      // Trigger AI response
      if (newMessage.sender === 'assistant_ai') {
        generateCustomerResponse();
      }
    },
  });

  // Add feedback mutation
  const addFeedbackMutation = useMutation({
    mutationFn: (feedbackData: any) =>
      apiRequest("/api/roleplay/feedback", "POST", feedbackData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/roleplay/sessions", selectedSession] });
      setNewFeedback({ messageId: 0, type: 'improvement', comment: '', suggestion: '' });
    },
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            completeSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const generateCustomerResponse = async () => {
    if (!activeSession) return;

    try {
      const response = await apiRequest("/api/roleplay/generate-customer", "POST", {
        sessionId: activeSession.id,
        conversationHistory: messages.map(m => `${m.sender}: ${m.message}`)
      });
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: 'customer_ai',
          message: response.message,
          timestamp: new Date().toISOString()
        }]);
      }, 1000);
    } catch (error) {
      console.error('Failed to generate customer response:', error);
    }
  };

  const completeSession = async () => {
    if (!activeSession) return;

    try {
      await apiRequest(`/api/roleplay/sessions/${activeSession.id}/complete`, "POST", {
        score: Math.floor(Math.random() * 10) + 1, // Placeholder scoring
        notes: "Session completed"
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/roleplay/sessions"] });
      setActiveSession(null);
      setIsRunning(false);
    } catch (error) {
      console.error('Failed to complete session:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const ScenarioCreator = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [customerType, setCustomerType] = useState('');
    const [scenario, setScenario] = useState('');
    const [objectives, setObjectives] = useState('');
    const [timeframe, setTimeframe] = useState(10);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      createScenarioMutation.mutate({
        name,
        description,
        customerType,
        scenario,
        objectives: objectives.split('\n').filter(Boolean),
        timeframeMins: timeframe,
      });

      // Reset form
      setName('');
      setDescription('');
      setCustomerType('');
      setScenario('');
      setObjectives('');
      setTimeframe(10);
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>Create New Scenario</CardTitle>
          <CardDescription>Design a roleplay scenario for training your AI assistant</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Scenario Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Angry Customer Support Call"
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerType">Customer Type</Label>
                <Select value={customerType} onValueChange={setCustomerType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="angry">Angry</SelectItem>
                    <SelectItem value="confused">Confused</SelectItem>
                    <SelectItem value="price-sensitive">Price Sensitive</SelectItem>
                    <SelectItem value="tech-savvy">Tech Savvy</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="impatient">Impatient</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the scenario"
                required
              />
            </div>

            <div>
              <Label htmlFor="scenario">Detailed Scenario</Label>
              <Textarea
                id="scenario"
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                placeholder="Describe the situation in detail..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="objectives">Objectives (one per line)</Label>
              <Textarea
                id="objectives"
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                placeholder="Resolve the customer's issue&#10;Maintain professional tone&#10;Offer appropriate solution"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="timeframe">Time Frame (minutes)</Label>
              <Input
                id="timeframe"
                type="number"
                value={timeframe}
                onChange={(e) => setTimeframe(parseInt(e.target.value))}
                min={5}
                max={60}
                required
              />
            </div>

            <Button type="submit" disabled={createScenarioMutation.isPending}>
              <Plus className="h-4 w-4 mr-2" />
              Create Scenario
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  };

  const ActiveSessionView = () => {
    const [userMessage, setUserMessage] = useState('');

    const sendMessage = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!userMessage.trim() || !activeSession) return;

      sendMessageMutation.mutate({
        sessionId: activeSession.id,
        sender: 'assistant_ai',
        message: userMessage
      });

      setUserMessage('');
    };

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Live Roleplay Session</CardTitle>
                <CardDescription>
                  Scenario: {selectedScenario?.name} | Customer: {activeSession?.customerPersona}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-mono font-bold text-blue-600">
                  {formatTime(timeRemaining)}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsRunning(false)}
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop Session
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 h-96">
              {/* Customer AI Side */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="h-5 w-5 text-orange-600" />
                  <span className="font-semibold">Customer AI</span>
                  <Badge variant="secondary">{activeSession?.customerPersona}</Badge>
                </div>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {messages.filter(m => m.sender === 'customer_ai').map((message, index) => (
                      <div key={index} className="bg-orange-50 p-3 rounded-lg">
                        <p className="text-sm">{message.message}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Assistant AI Side */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">Assistant AI</span>
                  <Badge variant="secondary">Your AI</Badge>
                </div>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {messages.filter(m => m.sender === 'assistant_ai').map((message, index) => (
                      <div key={index} className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm">{message.message}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            <form onSubmit={sendMessage} className="mt-4">
              <div className="flex space-x-2">
                <Input
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Type assistant response..."
                  className="flex-1"
                />
                <Button type="submit" disabled={!userMessage.trim()}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };

  const SessionHistory = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Session History</h3>
          <Badge variant="secondary">
            {Array.isArray(sessions) ? sessions.length : 0} total sessions
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(sessions) && sessions.map((session: RoleplaySession) => (
            <Card key={session.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Session #{session.id}</CardTitle>
                  <Badge 
                    variant={session.status === 'completed' ? 'default' : 'secondary'}
                  >
                    {session.status}
                  </Badge>
                </div>
                <CardDescription>
                  Customer: {session.customerPersona}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {new Date(session.startTime).toLocaleString()}
                  </div>
                  {session.score && (
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 mr-2 text-yellow-500" />
                      Score: {session.score}/10
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 w-full"
                  onClick={() => setSelectedSession(session.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const SessionDetailsModal = () => {
    if (!selectedSession || !sessionDetails) return null;

    const { session, messages: sessionMessages } = sessionDetails as any;

    const addFeedback = (messageId: number) => {
      if (!newFeedback.comment.trim()) return;

      addFeedbackMutation.mutate({
        messageId,
        feedbackType: newFeedback.type,
        comment: newFeedback.comment,
        suggestion: newFeedback.suggestion,
        sessionId: selectedSession
      });
    };

    return (
      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Session Details - #{selectedSession}</DialogTitle>
            <DialogDescription>
              Review conversation and add feedback
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6">
            {/* Conversation */}
            <div className="space-y-4">
              <h4 className="font-semibold">Full Conversation</h4>
              <ScrollArea className="h-96 border rounded-lg p-4">
                <div className="space-y-4">
                  {Array.isArray(sessionMessages) && sessionMessages.map((message: RoleplayMessage) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg ${
                        message.sender === 'customer_ai' 
                          ? 'bg-orange-50 ml-4' 
                          : 'bg-blue-50 mr-4'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {message.sender === 'customer_ai' ? (
                              <User className="h-4 w-4 text-orange-600" />
                            ) : (
                              <Bot className="h-4 w-4 text-blue-600" />
                            )}
                            <span className="text-sm font-medium">
                              {message.sender === 'customer_ai' ? 'Customer' : 'Assistant'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm">{message.message}</p>
                          
                          {/* Show existing feedback */}
                          {Array.isArray(message.feedback) && message.feedback.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.feedback.map((feedback: RoleplayFeedback) => (
                                <div key={feedback.id} className="text-xs bg-yellow-50 p-2 rounded">
                                  <span className="font-medium capitalize">{feedback.feedbackType}:</span>
                                  <p>{feedback.comment}</p>
                                  {feedback.suggestion && (
                                    <p className="text-gray-600">Suggestion: {feedback.suggestion}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Add feedback button */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setNewFeedback({ ...newFeedback, messageId: message.id })}
                        >
                          <MessageCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Feedback Panel */}
            <div className="space-y-4">
              <h4 className="font-semibold">Add Feedback</h4>
              
              {newFeedback.messageId > 0 && (
                <Card>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div>
                        <Label>Feedback Type</Label>
                        <Select
                          value={newFeedback.type}
                          onValueChange={(value) => setNewFeedback({ ...newFeedback, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="improvement">Needs Improvement</SelectItem>
                            <SelectItem value="issue">Issue/Problem</SelectItem>
                            <SelectItem value="good">Good Response</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Comment</Label>
                        <Textarea
                          value={newFeedback.comment}
                          onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                          placeholder="What's your feedback on this message?"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label>Suggestion (optional)</Label>
                        <Textarea
                          value={newFeedback.suggestion}
                          onChange={(e) => setNewFeedback({ ...newFeedback, suggestion: e.target.value })}
                          placeholder="How could this response be improved?"
                          rows={2}
                        />
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => addFeedback(newFeedback.messageId)}
                          disabled={!newFeedback.comment.trim()}
                        >
                          Add Feedback
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setNewFeedback({ messageId: 0, type: 'improvement', comment: '', suggestion: '' })}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Session Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Session Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>Status: <Badge>{session.status}</Badge></div>
                    <div>Customer Persona: {session.customerPersona}</div>
                    <div>Started: {new Date(session.startTime).toLocaleString()}</div>
                    {session.endTime && (
                      <div>Ended: {new Date(session.endTime).toLocaleString()}</div>
                    )}
                    {session.score && (
                      <div className="flex items-center">
                        Score: 
                        <div className="flex items-center ml-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="ml-1">{session.score}/10</span>
                        </div>
                      </div>
                    )}
                    {session.sessionNotes && (
                      <div>Notes: {session.sessionNotes}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <BackButton to="/ai-trainer" />
          <div>
            <h1 className="text-3xl font-bold">Roleplay Training</h1>
            <p className="text-gray-600">Test your AI assistants with realistic customer scenarios</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="scenarios" className="space-y-6">
        <div className="flex flex-col space-y-3">
          <TabsList className="grid w-full grid-cols-2 h-auto p-2">
            <TabsTrigger value="scenarios" className="flex items-center justify-center space-x-2 py-3">
              <Target className="h-4 w-4" />
              <span>Training Scenarios</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center justify-center space-x-2 py-3">
              <BarChart3 className="h-4 w-4" />
              <span>Session History</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="scenarios" className="space-y-6">
          {activeSession ? (
            <ActiveSessionView />
          ) : (
            <>
              <ScenarioCreator />
              
              <Card>
                <CardHeader>
                  <CardTitle>Available Scenarios</CardTitle>
                  <CardDescription>Select a scenario to start role-play training</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.isArray(scenarios) && scenarios.map((scenario: RoleplayScenario) => (
                      <Card key={scenario.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{scenario.name}</CardTitle>
                            <Badge variant="secondary">{scenario.customerType}</Badge>
                          </div>
                          <CardDescription>{scenario.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <p className="text-sm text-gray-600">{scenario.scenario}</p>
                            <div>
                              <span className="text-sm font-medium">Objectives:</span>
                              <ul className="text-sm list-disc list-inside text-gray-600 mt-1">
                                {scenario.objectives.map((obj, index) => (
                                  <li key={index}>{obj}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-gray-600">
                                <Clock className="h-4 w-4 mr-1" />
                                {scenario.timeframeMins} minutes
                              </div>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedScenario(scenario);
                                  startSessionMutation.mutate({
                                    scenarioId: scenario.id,
                                    customerPersona: `${scenario.customerType} customer`
                                  });
                                }}
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Start Session
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="history">
          <SessionHistory />
        </TabsContent>
      </Tabs>

      <SessionDetailsModal />
      <ScrollToTop />
    </div>
  );
}