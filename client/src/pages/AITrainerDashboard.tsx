import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BackButton } from "@/components/BackButton";
import { ScrollToTop } from "@/components/ScrollToTop";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Brain, 
  Target,
  BarChart3,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Star,
  Clock,
  Users,
  MessageSquare,
  Zap,
  Award,
  Settings,
  Play,
  Bot
} from "lucide-react";
import { useLocation } from "wouter";

interface PerformanceAnalysis {
  totalSessions: number;
  completedSessions: number;
  averageScore: number;
  performanceTrend: 'improving' | 'declining' | 'stable';
  improvementAreas: Array<{
    area: string;
    description: string;
    frequency: string;
    impact: string;
  }>;
  strengths: Array<{
    area: string;
    description: string;
    frequency: string;
    examples: string;
  }>;
  trainingRecommendations: Array<{
    title: string;
    priority: 'high' | 'medium' | 'low';
    description: string;
    actionSteps: string[];
    expectedOutcome: string;
    timeframe: string;
  }>;
}

interface TrainingAnalytics {
  timeRange: string;
  summary: {
    totalSessions: number;
    completedSessions: number;
    averageScore: number;
    trend: string;
    lastTrainingDate: string | null;
  };
  performance: {
    strengths: any[];
    improvementAreas: any[];
    recommendations: any[];
  };
  progress: {
    weeklyScores: Array<{
      week: string;
      averageScore: number;
      sessionCount: number;
    }>;
    scenarioPerformance: Array<{
      scenarioId: number;
      averageScore: number;
      sessionCount: number;
    }>;
    skillDevelopment: Array<{
      name: string;
      score: number;
      trend: string;
    }>;
  };
}

export default function AITrainerDashboard() {
  const [, setLocation] = useLocation();
  const [selectedAssistant, setSelectedAssistant] = useState<number>(1);
  const [timeRange, setTimeRange] = useState<string>('30d');
  const queryClient = useQueryClient();

  // Fetch performance analysis
  const { data: performance, isLoading: performanceLoading } = useQuery({
    queryKey: ['/api/ai-trainer/performance', selectedAssistant],
    enabled: selectedAssistant > 0
  });

  // Fetch training analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/ai-trainer/analytics', selectedAssistant, timeRange],
    enabled: selectedAssistant > 0
  });

  // Create custom scenarios mutation
  const createScenariosM = useMutation({
    mutationFn: async (data: { assistantId: number; improvementAreas: any[] }) =>
      apiRequest('/api/ai-trainer/custom-scenarios', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/roleplay/scenarios'] });
    }
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600';
      case 'declining':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleCreateCustomScenarios = async () => {
    if (!performance?.improvementAreas?.length) return;
    
    await createScenariosM.mutateAsync({
      assistantId: selectedAssistant,
      improvementAreas: performance.improvementAreas
    });
  };

  if (performanceLoading || analyticsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 animate-pulse text-purple-600" />
              <div className="text-lg">Analyzing AI Performance...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BackButton />
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Brain className="h-7 w-7 text-purple-600" />
                LeadGen AI Trainer
              </h1>
              <p className="text-muted-foreground">
                Comprehensive AI assistant performance analysis and training optimization
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedAssistant.toString()} onValueChange={(value) => setSelectedAssistant(parseInt(value))}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Assistant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Primary Assistant</SelectItem>
                <SelectItem value="2">BrezCode Health Bot</SelectItem>
                <SelectItem value="3">Sales Assistant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Performance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performance?.totalSessions || 0}</div>
              <p className="text-xs text-muted-foreground">
                {performance?.completedSessions || 0} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performance?.averageScore || 0}/10</div>
              <div className={`flex items-center gap-1 text-xs ${getTrendColor(performance?.performanceTrend || 'stable')}`}>
                {getTrendIcon(performance?.performanceTrend || 'stable')}
                <span className="capitalize">{performance?.performanceTrend || 'stable'}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Improvement Areas</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performance?.improvementAreas?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Areas identified
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Strengths</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performance?.strengths?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Strong areas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="analysis" className="space-y-4">
          <TabsList>
            <TabsTrigger value="analysis">Performance Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">Training Recommendations</TabsTrigger>
            <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
            <TabsTrigger value="scenarios">Training Scenarios</TabsTrigger>
          </TabsList>

          {/* Performance Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Strengths */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Key Strengths
                  </CardTitle>
                  <CardDescription>
                    Areas where the AI assistant excels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {performance?.strengths?.map((strength: any, index: number) => (
                        <div key={index} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-green-800 dark:text-green-200">
                              {strength.area}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {strength.frequency}
                            </Badge>
                          </div>
                          <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                            {strength.description}
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400">
                            {strength.examples}
                          </p>
                        </div>
                      ))}
                      {(!performance?.strengths || performance.strengths.length === 0) && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>More training sessions needed to identify strengths</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Improvement Areas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Improvement Areas
                  </CardTitle>
                  <CardDescription>
                    Areas that need attention and development
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {performance?.improvementAreas?.map((area: any, index: number) => (
                        <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                              {area.area}
                            </h4>
                            <div className="flex gap-1">
                              <Badge variant="outline" className="text-xs">
                                {area.frequency}
                              </Badge>
                              <Badge variant={area.frequency === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                                {area.impact}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            {area.description}
                          </p>
                        </div>
                      ))}
                      {(!performance?.improvementAreas || performance.improvementAreas.length === 0) && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No specific improvement areas identified</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Skill Development Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Skill Development
                </CardTitle>
                <CardDescription>
                  Current skill levels across different competency areas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.progress?.skillDevelopment?.map((skill: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{skill.name}</span>
                          <Badge variant="outline" className="text-xs capitalize">
                            {skill.trend}
                          </Badge>
                        </div>
                        <span className="text-sm font-medium">{skill.score}/10</span>
                      </div>
                      <Progress value={(skill.score / 10) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Training Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid gap-4">
              {performance?.trainingRecommendations?.map((rec: any, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-blue-500" />
                        {rec.title}
                      </CardTitle>
                      <Badge variant={getPriorityColor(rec.priority)}>
                        {rec.priority} priority
                      </Badge>
                    </div>
                    <CardDescription>{rec.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Action Steps
                        </h4>
                        <ul className="space-y-1 text-sm">
                          {rec.actionSteps?.map((step: string, stepIndex: number) => (
                            <li key={stepIndex} className="flex items-start gap-2">
                              <span className="text-muted-foreground">•</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium mb-1 flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Expected Outcome
                          </h4>
                          <p className="text-sm text-muted-foreground">{rec.expectedOutcome}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Timeframe
                          </h4>
                          <p className="text-sm text-muted-foreground">{rec.timeframe}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {(!performance?.trainingRecommendations || performance.trainingRecommendations.length === 0) && (
                <Card>
                  <CardContent className="text-center py-8">
                    <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="font-medium mb-2">No Specific Recommendations</h3>
                    <p className="text-muted-foreground mb-4">
                      Complete more training sessions to receive personalized recommendations
                    </p>
                    <Button onClick={() => setLocation('/roleplay-training')}>
                      Start Training Session
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Generate Custom Scenarios */}
            {performance?.improvementAreas?.length > 0 && (
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-500" />
                    AI-Generated Training Scenarios
                  </CardTitle>
                  <CardDescription>
                    Create custom roleplay scenarios based on identified improvement areas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleCreateCustomScenarios}
                    disabled={createScenariosM.isPending}
                    className="w-full"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    {createScenariosM.isPending ? 'Generating...' : 'Generate Custom Training Scenarios'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Progress Tracking Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Weekly Progress
                  </CardTitle>
                  <CardDescription>Performance trends over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {analytics?.progress?.weeklyScores?.map((week: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          <div>
                            <div className="font-medium">{new Date(week.week).toLocaleDateString()}</div>
                            <div className="text-xs text-muted-foreground">
                              {week.sessionCount} sessions
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="font-medium">{week.averageScore.toFixed(1)}/10</div>
                            </div>
                            <Progress value={(week.averageScore / 10) * 100} className="w-20 h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Scenario Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Scenario Performance
                  </CardTitle>
                  <CardDescription>Performance by training scenario type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {analytics?.progress?.scenarioPerformance?.map((scenario: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          <div>
                            <div className="font-medium">Scenario #{scenario.scenarioId}</div>
                            <div className="text-xs text-muted-foreground">
                              {scenario.sessionCount} sessions
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="font-medium">{scenario.averageScore.toFixed(1)}/10</div>
                            </div>
                            <Progress value={(scenario.averageScore / 10) * 100} className="w-20 h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Training Scenarios Tab */}
          <TabsContent value="scenarios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Start training sessions and manage scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setLocation('/roleplay-training')}
                    className="h-20 flex flex-col gap-2"
                  >
                    <Bot className="h-6 w-6" />
                    <span>Start Training Session</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setLocation('/roleplay-training?tab=scenarios')}
                    className="h-20 flex flex-col gap-2"
                  >
                    <Settings className="h-6 w-6" />
                    <span>Manage Scenarios</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={handleCreateCustomScenarios}
                    disabled={createScenariosM.isPending || !performance?.improvementAreas?.length}
                    className="h-20 flex flex-col gap-2"
                  >
                    <Brain className="h-6 w-6" />
                    <span>Generate AI Scenarios</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <ScrollToTop />
      </div>
    </div>
  );
}