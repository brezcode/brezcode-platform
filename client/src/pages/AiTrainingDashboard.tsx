import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  Play, 
  MessageSquare, 
  Target, 
  TrendingUp, 
  Clock,
  Award,
  Users,
  Brain,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface TrainingScenario {
  id: number;
  title: string;
  description: string;
  scenarioType: string;
  difficulty: string;
  customerPersona: any;
  objectives: string[];
  successCriteria: string[];
  context: any;
}

interface TrainingSession {
  id: number;
  sessionName: string;
  aiAssistantRole: string;
  status: string;
  performanceScore: number;
  startedAt: string;
  completedAt: string;
  scenario: TrainingScenario;
}

interface TrainingAnalytics {
  analytics: any;
  sessionStats: {
    total: number;
    completed: number;
    avgScore: number;
  };
}

export function AiTrainingDashboard() {
  const [selectedScenario, setSelectedScenario] = useState<TrainingScenario | null>(null);
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);
  const queryClient = useQueryClient();

  // Fetch training scenarios
  const { data: scenarios = [], isLoading: loadingScenarios } = useQuery({
    queryKey: ['/api/ai-training/scenarios/1'], // Using brandId = 1 for now
    queryFn: async () => {
      const response = await fetch('/api/ai-training/scenarios/1', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch scenarios');
      return response.json();
    },
  });

  // Fetch training sessions
  const { data: sessions = [], isLoading: loadingSessions } = useQuery({
    queryKey: ['/api/ai-training/sessions'],
    queryFn: async () => {
      const response = await fetch('/api/ai-training/sessions', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch sessions');
      return response.json();
    },
  });

  // Fetch training analytics
  const { data: analytics, isLoading: loadingAnalytics } = useQuery({
    queryKey: ['/api/ai-training/analytics'],
    queryFn: async () => {
      const response = await fetch('/api/ai-training/analytics', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
  });

  // Generate new scenario mutation
  const generateScenarioMutation = useMutation({
    mutationFn: async (data: { scenarioType: string; industry?: string }) => {
      const response = await fetch('/api/ai-training/scenarios/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ brandId: 1, ...data })
      });
      if (!response.ok) throw new Error('Failed to generate scenario');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-training/scenarios/1'] });
    }
  });

  // Start training session mutation
  const startSessionMutation = useMutation({
    mutationFn: async (data: { scenarioId: number; sessionName: string; aiAssistantRole: string }) => {
      const response = await fetch('/api/ai-training/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to start session');
      return response.json();
    },
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-training/sessions'] });
      // Navigate to training session
      window.location.href = `/ai-training/session/${session.id}`;
    }
  });

  const generateScenario = async (scenarioType: string) => {
    setIsGeneratingScenario(true);
    try {
      await generateScenarioMutation.mutateAsync({ 
        scenarioType,
        industry: 'Business Services' 
      });
    } catch (error) {
      console.error('Error generating scenario:', error);
    } finally {
      setIsGeneratingScenario(false);
    }
  };

  const startTrainingSession = async (scenario: TrainingScenario) => {
    const sessionName = `${scenario.scenarioType} Training - ${new Date().toLocaleDateString()}`;
    const aiAssistantRole = scenario.scenarioType === 'lead_generation' ? 'Lead Qualifier' :
                           scenario.scenarioType === 'customer_service' ? 'Support Agent' :
                           scenario.scenarioType === 'sales' ? 'Sales Representative' : 'Customer Success Manager';
    
    await startSessionMutation.mutateAsync({
      scenarioId: scenario.id,
      sessionName,
      aiAssistantRole
    });
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
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Assistant Training</h1>
          <p className="text-gray-600 mt-2">Train your AI assistant with role-playing scenarios and detailed feedback</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => generateScenario('lead_generation')}
            disabled={isGeneratingScenario}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Generate Lead Gen Scenario
          </Button>
          <Button 
            onClick={() => generateScenario('customer_service')}
            disabled={isGeneratingScenario}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Generate Support Scenario
          </Button>
        </div>
      </div>

      {/* Training Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold">{analytics?.sessionStats.total || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{analytics?.sessionStats.completed || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold">{Math.round(analytics?.sessionStats.avgScore || 0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Skill Level</p>
                <p className="text-2xl font-bold capitalize">{analytics?.analytics?.skillLevel || 'Beginner'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="scenarios" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scenarios">Training Scenarios</TabsTrigger>
          <TabsTrigger value="sessions">Training Sessions</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        {/* Training Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Available Training Scenarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingScenarios ? (
                <div className="text-center py-8">Loading scenarios...</div>
              ) : scenarios.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No training scenarios yet</p>
                  <p className="text-sm text-gray-500">Click "Generate Scenario" to create your first training scenario</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {scenarios.map((scenario: TrainingScenario) => (
                    <Card key={scenario.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{scenario.title}</h3>
                              <Badge className={getDifficultyColor(scenario.difficulty)}>
                                {scenario.difficulty}
                              </Badge>
                              <Badge variant="outline">
                                {scenario.scenarioType.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-4">{scenario.description}</p>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Customer Persona</h4>
                                <p className="text-sm text-gray-600">
                                  {scenario.customerPersona?.name} - {scenario.customerPersona?.role}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {scenario.customerPersona?.company}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Objectives</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {scenario.objectives?.slice(0, 2).map((objective, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      {objective}
                                    </li>
                                  ))}
                                  {scenario.objectives?.length > 2 && (
                                    <li className="text-gray-500">
                                      +{scenario.objectives.length - 2} more objectives
                                    </li>
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-6">
                            <Button 
                              onClick={() => startTrainingSession(scenario)}
                              disabled={startSessionMutation.isPending}
                              className="flex items-center gap-2"
                            >
                              <Play className="w-4 h-4" />
                              Start Training
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Training Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Training Sessions History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSessions ? (
                <div className="text-center py-8">Loading sessions...</div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No training sessions yet</p>
                  <p className="text-sm text-gray-500">Start your first training scenario to see sessions here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session: TrainingSession) => (
                    <Card key={session.id} className="border-l-4 border-l-green-500">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">{session.sessionName}</h3>
                              <Badge className={getStatusColor(session.status)}>
                                {session.status.replace('_', ' ')}
                              </Badge>
                              <Badge variant="outline">{session.aiAssistantRole}</Badge>
                            </div>
                            <p className="text-gray-600 mb-2">{session.scenario.title}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>Started: {new Date(session.startedAt).toLocaleDateString()}</span>
                              {session.completedAt && (
                                <span>Completed: {new Date(session.completedAt).toLocaleDateString()}</span>
                              )}
                              {session.performanceScore && (
                                <span className="flex items-center gap-1">
                                  <Award className="w-4 h-4" />
                                  Score: {session.performanceScore}%
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.location.href = `/ai-training/session/${session.id}`}
                            >
                              View Session
                            </Button>
                          </div>
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
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Empathy Score</span>
                    <span className="text-sm">{analytics?.analytics?.empathyScore || 0}%</span>
                  </div>
                  <Progress value={analytics?.analytics?.empathyScore || 0} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Accuracy Score</span>
                    <span className="text-sm">{analytics?.analytics?.accuracyScore || 0}%</span>
                  </div>
                  <Progress value={analytics?.analytics?.accuracyScore || 0} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Sales Effectiveness</span>
                    <span className="text-sm">{analytics?.analytics?.salesEffectivenessScore || 0}%</span>
                  </div>
                  <Progress value={analytics?.analytics?.salesEffectivenessScore || 0} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Customer Satisfaction</span>
                    <span className="text-sm">{analytics?.analytics?.customerSatisfactionScore || 0}%</span>
                  </div>
                  <Progress value={analytics?.analytics?.customerSatisfactionScore || 0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Improvement Areas</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics?.analytics?.improvementAreas?.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.analytics.improvementAreas.map((area: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                        <span className="capitalize">{area.replace('_', ' ')}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Complete training sessions to see improvement areas</p>
                )}
              </CardContent>
            </Card>
          </div>

          {analytics?.analytics?.recommendations && (
            <Card>
              <CardHeader>
                <CardTitle>Training Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.analytics.recommendations.map((rec: any, index: number) => (
                    <div key={index} className="border-l-4 border-l-blue-500 pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium capitalize">{rec.area}</span>
                        <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                          {rec.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{rec.recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}