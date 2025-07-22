import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Bot, Target, MessageSquare, TrendingUp, Clock, 
  Play, Plus, CheckCircle, Award, BarChart3 
} from 'lucide-react';

interface TrainingScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  scenarioType: 'lead_generation' | 'customer_service';
  customerPersona: {
    name: string;
    role: string;
    company: string;
  };
  objectives: string[];
}

interface TrainingSession {
  id: string;
  sessionName: string;
  status: 'active' | 'completed' | 'paused';
  startedAt: string;
  completedAt?: string;
  performanceScore?: number;
  aiAssistantRole: string;
  scenario: TrainingScenario;
}

interface Analytics {
  overallScore: number;
  improvementRate: number;
  sessionStats: {
    totalSessions: number;
    completedSessions: number;
    avgScore: number;
  };
  analytics: {
    empathyScore: number;
    accuracyScore: number;
    salesEffectiveness: number;
    skillLevel: string;
  };
}

export function AiTrainingDashboard() {
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);
  const queryClient = useQueryClient();

  // Fetch data
  const { data: analytics } = useQuery<Analytics>({
    queryKey: ['/api/ai-trainer/analytics'],
  });

  const { data: scenarios = [], isLoading: loadingScenarios } = useQuery<TrainingScenario[]>({
    queryKey: ['/api/ai-trainer/strategies'],
  });

  const { data: sessions = [], isLoading: loadingSessions } = useQuery<TrainingSession[]>({
    queryKey: ['/api/ai-trainer/sessions'],
  });

  // Mutations
  const generateScenarioMutation = useMutation({
    mutationFn: (type: string) => 
      apiRequest('/api/ai-trainer/generate-scenario', 'POST', { scenarioType: type }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-trainer/strategies'] });
      setIsGeneratingScenario(false);
    },
    onError: () => setIsGeneratingScenario(false),
  });

  const startSessionMutation = useMutation({
    mutationFn: (scenario: TrainingScenario) => 
      apiRequest('/api/ai-trainer/start-session', 'POST', { scenarioId: scenario.id }),
    onSuccess: (data) => {
      window.location.href = `/ai-training/session/${data.sessionId}`;
    },
  });

  const generateScenario = (type: string) => {
    setIsGeneratingScenario(true);
    generateScenarioMutation.mutate(type);
  };

  const startTrainingSession = (scenario: TrainingScenario) => {
    startSessionMutation.mutate(scenario);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mobile-container">
      {/* Header Section */}
      <div className="mobile-stack mobile-card">
        <h1 className="text-2xl font-bold text-gray-900 mobile-text">AI Assistant Training</h1>
        <p className="text-gray-600 mobile-text">Train your AI assistant with role-playing scenarios</p>
        
        {/* Action Buttons */}
        <div className="mobile-stack">
          <Button 
            onClick={() => generateScenario('lead_generation')}
            disabled={isGeneratingScenario}
            className="w-full h-10 text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate Lead Gen Scenario
          </Button>
          <Button 
            onClick={() => generateScenario('customer_service')}
            disabled={isGeneratingScenario}
            variant="outline"
            className="w-full h-10 text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate Support Scenario
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="mobile-stack">
        <Card className="mobile-card">
          <CardContent className="p-4">
            <div className="mobile-stack">
              <div className="flex items-center gap-3">
                <Bot className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Overall Score</p>
                  <p className="text-2xl font-bold">{Math.round(analytics?.overallScore || 0)}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mobile-card">
          <CardContent className="p-4">
            <div className="mobile-stack">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Improvement Rate</p>
                  <p className="text-2xl font-bold">+{Math.round(analytics?.improvementRate || 0)}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="scenarios" className="mobile-stack">
        <TabsList className="w-full mobile-no-flex">
          <TabsTrigger value="scenarios" className="mobile-text">Scenarios</TabsTrigger>
          <TabsTrigger value="sessions" className="mobile-text">Sessions</TabsTrigger>
          <TabsTrigger value="analytics" className="mobile-text">Analytics</TabsTrigger>
        </TabsList>

        {/* Scenarios Tab */}
        <TabsContent value="scenarios" className="mobile-stack">
          <Card className="mobile-card">
            <CardHeader>
              <CardTitle className="mobile-text">Training Scenarios</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingScenarios ? (
                <p className="text-center py-8">Loading scenarios...</p>
              ) : scenarios.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mobile-text">No training scenarios yet</p>
                </div>
              ) : (
                <div className="mobile-stack">
                  {scenarios.map((scenario) => (
                    <Card key={scenario.id} className="mobile-card border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="mobile-stack">
                          <div className="mobile-stack">
                            <h3 className="font-semibold text-lg mobile-text">{scenario.title}</h3>
                            <div className="mobile-stack">
                              <Badge className={getDifficultyColor(scenario.difficulty)}>
                                {scenario.difficulty}
                              </Badge>
                              <Badge variant="outline">
                                {scenario.scenarioType.replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm mobile-text">{scenario.description}</p>
                          
                          <div className="mobile-stack">
                            <div>
                              <h4 className="font-medium text-sm mobile-text">Customer</h4>
                              <p className="text-xs text-gray-600 mobile-text">
                                {scenario.customerPersona?.name} - {scenario.customerPersona?.role}
                              </p>
                            </div>
                          </div>
                          
                          <Button 
                            onClick={() => startTrainingSession(scenario)}
                            disabled={startSessionMutation.isPending}
                            className="w-full h-10 text-sm"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Start Training
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="mobile-stack">
          <Card className="mobile-card">
            <CardHeader>
              <CardTitle className="mobile-text">Training Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSessions ? (
                <p className="text-center py-8">Loading sessions...</p>
              ) : sessions.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mobile-text">No training sessions yet</p>
                </div>
              ) : (
                <div className="mobile-stack">
                  {sessions.map((session) => (
                    <Card key={session.id} className="mobile-card border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="mobile-stack">
                          <div className="mobile-stack">
                            <h3 className="font-semibold text-base mobile-text">{session.sessionName}</h3>
                            <div className="mobile-stack">
                              <Badge className={getStatusColor(session.status)}>
                                {session.status.replace('_', ' ')}
                              </Badge>
                              <Badge variant="outline">{session.aiAssistantRole}</Badge>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm mobile-text">{session.scenario.title}</p>
                          <p className="text-xs text-gray-500 mobile-text">
                            Started: {new Date(session.startedAt).toLocaleDateString()}
                          </p>
                          
                          <Button 
                            variant="outline" 
                            onClick={() => window.location.href = `/ai-training/session/${session.id}`}
                            className="w-full h-10 text-sm"
                          >
                            View Session
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mobile-stack">
          <Card className="mobile-card">
            <CardHeader>
              <CardTitle className="mobile-text">Performance Scores</CardTitle>
            </CardHeader>
            <CardContent className="mobile-stack">
              <div className="mobile-stack">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium mobile-text">Empathy Score</span>
                  <span className="text-sm">{analytics?.analytics?.empathyScore || 0}%</span>
                </div>
                <Progress value={analytics?.analytics?.empathyScore || 0} className="h-2" />
              </div>
              <div className="mobile-stack">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium mobile-text">Accuracy Score</span>
                  <span className="text-sm">{analytics?.analytics?.accuracyScore || 0}%</span>
                </div>
                <Progress value={analytics?.analytics?.accuracyScore || 0} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}