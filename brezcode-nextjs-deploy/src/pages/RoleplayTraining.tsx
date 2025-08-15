import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BackButton } from "@/components/BackButton";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { 
  Bot, 
  Play, 
  Users, 
  MessageSquare, 
  Star, 
  Clock, 
  Target,
  Plus,
  Settings,
  Trash2,
  Send,
  RotateCcw,
  CheckCircle,
  Timer,
  Zap,
  BarChart3,
  User,
  Bot as BotIcon
} from "lucide-react";

interface Scenario {
  id: number;
  name: string;
  description: string;
  customerType: string;
  scenario: string;
  objectives: string[];
  timeframeMins: number;
  isActive: boolean;
}

interface Session {
  id: number;
  scenarioId: number;
  status: 'running' | 'completed' | 'paused';
  score?: number;
  customerPersona: string;
  startTime: string;
  endTime?: string;
  sessionNotes?: string;
}

interface Message {
  id: number;
  sessionId: number;
  sender: 'user' | 'customer';
  message: string;
  timestamp: string;
}

export default function RoleplayTraining() {
  const [, setLocation] = useLocation();
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [showCreateScenario, setShowCreateScenario] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch scenarios
  const { data: scenarios = [], isLoading: scenariosLoading } = useQuery({
    queryKey: ['/api/roleplay/scenarios'],
  });

  // Fetch default scenarios for inspiration
  const { data: defaultScenarios = [] } = useQuery({
    queryKey: ['/api/roleplay/default-scenarios'],
  });

  // Fetch session statistics
  const { data: stats } = useQuery({
    queryKey: ['/api/roleplay/stats'],
  });

  // Timer effect for active sessions
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isSessionActive && activeSession) {
      interval = setInterval(() => {
        setSessionTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSessionActive, activeSession]);

  // Start session mutation
  const startSessionM = useMutation({
    mutationFn: async (scenarioId: number) => {
      const scenario = scenarios.find(s => s.id === scenarioId);
      const sessionData = {
        scenarioId,
        assistantId: 1,
        customerPersona: scenario?.customerType || 'neutral',
        status: 'running'
      };
      return apiRequest('/api/roleplay/sessions/start', {
        method: 'POST',
        body: JSON.stringify(sessionData)
      });
    },
    onSuccess: (session) => {
      setActiveSession(session);
      setIsSessionActive(true);
      setMessages([]);
      setSessionTimer(0);
      toast({
        title: "Training Session Started",
        description: "The roleplay scenario is now active. Start the conversation!"
      });
    }
  });

  // Send message mutation
  const sendMessageM = useMutation({
    mutationFn: async (message: string) => {
      // Add user message
      const userMessage = {
        sessionId: activeSession!.id,
        sender: 'user',
        message,
        timestamp: new Date().toISOString()
      };
      
      await apiRequest('/api/roleplay/sessions/message', {
        method: 'POST',
        body: JSON.stringify(userMessage)
      });

      // Generate customer response
      const scenario = scenarios.find(s => s.id === activeSession!.scenarioId);
      const conversationHistory = messages.map(m => `${m.sender}: ${m.message}`);
      
      const customerResponse = await apiRequest('/api/roleplay/generate-customer', {
        method: 'POST',
        body: JSON.stringify({
          customerPersona: activeSession!.customerPersona,
          scenario: scenario?.scenario || '',
          conversationHistory,
          objectives: scenario?.objectives || []
        })
      });

      // Add customer response
      const customerMessage = {
        sessionId: activeSession!.id,
        sender: 'customer',
        message: customerResponse.response,
        timestamp: new Date().toISOString()
      };

      await apiRequest('/api/roleplay/sessions/message', {
        method: 'POST',
        body: JSON.stringify(customerMessage)
      });

      return { userMessage, customerMessage };
    },
    onSuccess: (result) => {
      setMessages(prev => [...prev, result.userMessage, result.customerMessage]);
      setCurrentMessage("");
    }
  });

  // Complete session mutation
  const completeSessionM = useMutation({
    mutationFn: async (data: { score?: number; notes?: string }) => {
      return apiRequest(`/api/roleplay/sessions/${activeSession!.id}/complete`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      setIsSessionActive(false);
      setActiveSession(null);
      setMessages([]);
      setSessionTimer(0);
      queryClient.invalidateQueries({ queryKey: ['/api/roleplay/stats'] });
      toast({
        title: "Session Completed",
        description: "Your training session has been saved with feedback."
      });
    }
  });

  // Create scenario mutation
  const createScenarioM = useMutation({
    mutationFn: async (scenarioData: Partial<Scenario>) => {
      return apiRequest('/api/roleplay/scenarios', {
        method: 'POST',
        body: JSON.stringify(scenarioData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/roleplay/scenarios'] });
      setShowCreateScenario(false);
      toast({
        title: "Scenario Created",
        description: "Your custom training scenario has been created successfully."
      });
    }
  });

  const handleStartSession = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    startSessionM.mutate(scenario.id);
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim() || !activeSession) return;
    sendMessageM.mutate(currentMessage);
  };

  const handleCompleteSession = (score?: number, notes?: string) => {
    completeSessionM.mutate({ score, notes });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (scenariosLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2">
              <Bot className="h-8 w-8 animate-pulse text-blue-600" />
              <div className="text-lg">Loading Training Scenarios...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BackButton />
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Bot className="h-7 w-7 text-blue-600" />
                AI Roleplay Training
              </h1>
              <p className="text-muted-foreground">
                Practice customer service scenarios with AI-powered roleplay sessions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              onClick={() => setLocation('/ai-trainer-dashboard')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button 
              onClick={() => setShowCreateScenario(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Scenario
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalSessions || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.completedSessions || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.averageScore || 0}/10</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.successRate || 0}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Active Session */}
        {isSessionActive && activeSession && selectedScenario && (
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-blue-500" />
                    Active Training Session
                  </CardTitle>
                  <CardDescription>
                    {selectedScenario.name} • Timer: {formatTime(sessionTimer)}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {selectedScenario.customerType}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCompleteSession(8, "Good session")}
                  >
                    Complete Session
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Scenario Description */}
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm">{selectedScenario.scenario}</p>
                  <div className="mt-2">
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Objectives:</p>
                    <ul className="text-xs text-blue-600 dark:text-blue-400 list-disc list-inside mt-1">
                      {selectedScenario.objectives.map((obj, idx) => (
                        <li key={idx}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Chat Interface */}
                <div className="border rounded-lg">
                  <ScrollArea className="h-64 p-4">
                    <div className="space-y-3">
                      {messages.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>Start the conversation with your first message</p>
                        </div>
                      )}
                      {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-3 rounded-lg ${
                            msg.sender === 'user' 
                              ? 'bg-blue-600 text-white ml-4' 
                              : 'bg-gray-100 dark:bg-gray-800 mr-4'
                          }`}>
                            <div className="flex items-center gap-2 mb-1">
                              {msg.sender === 'user' ? (
                                <User className="h-4 w-4" />
                              ) : (
                                <BotIcon className="h-4 w-4" />
                              )}
                              <span className="text-xs opacity-70">
                                {msg.sender === 'user' ? 'You' : 'Customer'}
                              </span>
                            </div>
                            <p className="text-sm">{msg.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your response to the customer..."
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={sendMessageM.isPending}
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!currentMessage.trim() || sendMessageM.isPending}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Training Scenarios */}
        <Tabs defaultValue="available" className="space-y-4">
          <TabsList>
            <TabsTrigger value="available">Available Scenarios</TabsTrigger>
            <TabsTrigger value="custom">Custom Scenarios</TabsTrigger>
            <TabsTrigger value="templates">Template Scenarios</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scenarios.map((scenario: Scenario) => (
                <Card key={scenario.id} className={selectedScenario?.id === scenario.id ? 'border-blue-500' : ''}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{scenario.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{scenario.customerType}</Badge>
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          {scenario.timeframeMins}m
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>{scenario.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Scenario:</p>
                        <p className="text-sm">{scenario.scenario}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Objectives:</p>
                        <ul className="text-sm space-y-1">
                          {scenario.objectives.map((obj, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Target className="h-3 w-3 mt-0.5 text-muted-foreground" />
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button 
                        onClick={() => handleStartSession(scenario)}
                        disabled={isSessionActive || startSessionM.isPending}
                        className="w-full"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Training Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Custom Scenarios</CardTitle>
                <CardDescription>
                  Create personalized training scenarios tailored to your specific needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowCreateScenario(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Scenario
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {defaultScenarios.map((template: any, idx: number) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.scenario}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{template.customerType}</Badge>
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          {template.timeframeMins}m
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Objectives:</p>
                        <ul className="text-sm space-y-1">
                          {template.objectives.map((obj: string, objIdx: number) => (
                            <li key={objIdx} className="flex items-start gap-2">
                              <Target className="h-3 w-3 mt-0.5 text-muted-foreground" />
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => createScenarioM.mutate({
                          name: template.name,
                          description: template.scenario,
                          customerType: template.customerType,
                          scenario: template.scenario,
                          objectives: template.objectives,
                          timeframeMins: template.timeframeMins,
                          isActive: true
                        })}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to My Scenarios
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Scenario Dialog */}
        <Dialog open={showCreateScenario} onOpenChange={setShowCreateScenario}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Custom Training Scenario</DialogTitle>
              <DialogDescription>
                Design a personalized roleplay scenario for AI training
              </DialogDescription>
            </DialogHeader>
            <ScenarioCreationForm onSubmit={createScenarioM.mutate} />
          </DialogContent>
        </Dialog>

        <ScrollToTop />
      </div>
    </div>
  );
}

// Scenario Creation Form Component
function ScenarioCreationForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    customerType: "",
    scenario: "",
    objectives: [""],
    timeframeMins: 15
  });

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, ""]
    }));
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    setFormData(prev => ({
      ...prev,
      objectives: newObjectives
    }));
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      objectives: formData.objectives.filter(obj => obj.trim()),
      isActive: true
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Scenario Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Frustrated Customer - Product Return"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Customer Type</label>
          <Select value={formData.customerType} onValueChange={(value) => setFormData(prev => ({ ...prev, customerType: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select customer personality" />
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
        <label className="text-sm font-medium">Description</label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of the training scenario"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Scenario Details</label>
        <Textarea
          value={formData.scenario}
          onChange={(e) => setFormData(prev => ({ ...prev, scenario: e.target.value }))}
          placeholder="Detailed description of the customer's situation and context..."
          rows={3}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Learning Objectives</label>
        <div className="space-y-2">
          {formData.objectives.map((objective, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={objective}
                onChange={(e) => updateObjective(index, e.target.value)}
                placeholder={`Objective ${index + 1}`}
                required
              />
              {formData.objectives.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeObjective(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addObjective}>
            <Plus className="h-4 w-4 mr-2" />
            Add Objective
          </Button>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Estimated Duration (minutes)</label>
        <Select value={formData.timeframeMins.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, timeframeMins: parseInt(value) }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 minutes</SelectItem>
            <SelectItem value="15">15 minutes</SelectItem>
            <SelectItem value="20">20 minutes</SelectItem>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="45">45 minutes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        Create Scenario
      </Button>
    </form>
  );
}