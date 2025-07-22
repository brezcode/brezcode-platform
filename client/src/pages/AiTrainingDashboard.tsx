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
    <div className="w-full max-w-7xl mx-auto mobile-safe-padding mobile-spacing contain-layout">
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">AI Assistant Training</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Train your AI assistant with role-playing scenarios and detailed feedback</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button 
            onClick={() => generateScenario('lead_generation')}
            disabled={isGeneratingScenario}
            className="flex items-center gap-2 justify-center text-sm px-4 py-2 min-h-[44px]"
            size="default"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Generate Lead Gen Scenario</span>
            <span className="sm:hidden">Lead Gen</span>
          </Button>
          <Button 
            onClick={() => generateScenario('customer_service')}
            disabled={isGeneratingScenario}
            variant="outline"
            className="flex items-center gap-2 justify-center text-sm px-4 py-2 min-h-[44px]"
            size="default"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Generate Support Scenario</span>
            <span className="sm:hidden">Support</span>
          </Button>
        </div>
      </div>

      {/* Training Analytics Overview */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600 truncate">Total Sessions</p>
                <p className="text-xl sm:text-2xl font-bold">{analytics?.sessionStats.total || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600 truncate">Completed</p>
                <p className="text-xl sm:text-2xl font-bold">{analytics?.sessionStats.completed || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600 truncate">Avg Score</p>
                <p className="text-xl sm:text-2xl font-bold">{Math.round(analytics?.sessionStats.avgScore || 0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600 truncate">Skill Level</p>
                <p className="text-xl sm:text-2xl font-bold capitalize">{analytics?.analytics?.skillLevel || 'Beginner'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="scenarios" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm">
          <TabsTrigger value="scenarios" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Training Scenarios</span>
            <span className="sm:hidden">Scenarios</span>
          </TabsTrigger>
          <TabsTrigger value="sessions" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Training Sessions</span>
            <span className="sm:hidden">Sessions</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Performance Analytics</span>
            <span className="sm:hidden">Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Training Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                Available Training Scenarios
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
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
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:gap-3 sm:space-y-0 mb-2">
                              <h3 className="font-semibold text-base sm:text-lg truncate">{scenario.title}</h3>
                              <div className="flex gap-2">
                                <Badge className={getDifficultyColor(scenario.difficulty)}>
                                  {scenario.difficulty}
                                </Badge>
                                <Badge variant="outline">
                                  {scenario.scenarioType.replace('_', ' ')}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-gray-600 mb-4 text-sm sm:text-base">{scenario.description}</p>
                            
                            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                              <div>
                                <h4 className="font-medium mb-2 text-sm sm:text-base">Customer Persona</h4>
                                <p className="text-xs sm:text-sm text-gray-600">
                                  {scenario.customerPersona?.name} - {scenario.customerPersona?.role}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                  {scenario.customerPersona?.company}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2 text-sm sm:text-base">Objectives</h4>
                                <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                                  {scenario.objectives?.slice(0, 2).map((objective, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      <span className="break-words">{objective}</span>
                                    </li>
                                  ))}
                                  {scenario.objectives?.length > 2 && (
                                    <li className="text-gray-500 text-xs">
                                      +{scenario.objectives.length - 2} more objectives
                                    </li>
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex w-full sm:w-auto sm:ml-4">
                            <Button 
                              onClick={() => startTrainingSession(scenario)}
                              disabled={startSessionMutation.isPending}
                              className="flex items-center justify-center gap-2 text-sm px-4 py-2 min-h-[44px] w-full sm:w-auto"
                              size="default"
                            >
                              <Play className="w-4 h-4" />
                              <span className="hidden sm:inline">Start Training</span>
                              <span className="sm:hidden">Start</span>
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
        <TabsContent value="sessions" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                Training Sessions History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
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
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:gap-3 sm:space-y-0 mb-2">
                              <h3 className="font-semibold text-base sm:text-lg truncate">{session.sessionName}</h3>
                              <div className="flex gap-2">
                                <Badge className={getStatusColor(session.status)}>
                                  {session.status.replace('_', ' ')}
                                </Badge>
                                <Badge variant="outline">{session.aiAssistantRole}</Badge>
                              </div>
                            </div>
                            <p className="text-gray-600 mb-2 text-sm sm:text-base">{session.scenario.title}</p>
                            <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:gap-4 sm:space-y-0 text-xs sm:text-sm text-gray-500">
                              <span>Started: {new Date(session.startedAt).toLocaleDateString()}</span>
                              {session.completedAt && (
                                <span>Completed: {new Date(session.completedAt).toLocaleDateString()}</span>
                              )}
                              {session.performanceScore && (
                                <span className="flex items-center gap-1">
                                  <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                                  Score: {session.performanceScore}%
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex w-full sm:w-auto sm:ml-4">
                            <Button 
                              variant="outline" 
                              size="default"
                              onClick={() => window.location.href = `/ai-training/session/${session.id}`}
                              className="flex items-center justify-center gap-2 text-sm px-4 py-2 min-h-[44px] w-full sm:w-auto"
                            >
                              <span className="hidden sm:inline">View Session</span>
                              <span className="sm:hidden">View</span>
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
        <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
          <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">Performance Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
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
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">Improvement Areas</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {analytics?.analytics?.improvementAreas?.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.analytics.improvementAreas.map((area: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 sm:gap-3">
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                        <span className="capitalize text-sm sm:text-base">{area.replace('_', ' ')}</span>
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
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">Training Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {analytics.analytics.recommendations.map((rec: any, index: number) => (
                    <div key={index} className="border-l-4 border-l-blue-500 pl-3 sm:pl-4">
                      <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:gap-2 sm:space-y-0 mb-2">
                        <span className="font-medium capitalize text-sm sm:text-base">{rec.area}</span>
                        <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                          {rec.priority} priority
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">{rec.recommendation}</p>
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