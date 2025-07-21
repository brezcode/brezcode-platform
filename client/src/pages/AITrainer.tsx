import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Zap, 
  BarChart3,
  Bot,
  Settings,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle,
  Star,
  ArrowRight,
  Download,
  Upload,
  Lightbulb,
  MessageSquare,
  Clock,
  Award
} from "lucide-react";
import { Link } from "wouter";

interface TrainingStrategy {
  id: string;
  assistantId: number;
  strategyType: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  implementation: string[];
  expectedImprovement: string;
  timeline: string;
  metrics: string[];
  isImplemented: boolean;
  progress?: number;
}

interface ConversationAnalysis {
  conversationId: string;
  assistantId: number;
  userSatisfaction: number;
  responseQuality: number;
  accuracy: number;
  helpfulness: number;
  weakAreas: string[];
  strongAreas: string[];
  suggestions: string[];
  trainingNeeded: boolean;
}

interface TrainingRecommendation {
  category: string;
  issue: string;
  solution: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  priority: number;
}

export default function AITrainer() {
  const [selectedAssistant, setSelectedAssistant] = useState<number>(1);
  const [trainingMode, setTrainingMode] = useState<'auto' | 'manual'>('auto');
  const [analysisDepth, setAnalysisDepth] = useState<'basic' | 'detailed'>('detailed');
  const queryClient = useQueryClient();

  // Fetch assistants
  const { data: assistants = [], isLoading: assistantsLoading } = useQuery({
    queryKey: ["/api/knowledge/assistants"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/knowledge/assistants");
      return response.json();
    }
  });

  // Fetch training strategies
  const { data: strategies = [], isLoading: strategiesLoading } = useQuery({
    queryKey: ["/api/ai-trainer/strategies", selectedAssistant],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/ai-trainer/strategies?assistantId=${selectedAssistant}`);
      return response.json();
    }
  });

  // Fetch performance analytics
  const { data: analytics } = useQuery({
    queryKey: ["/api/ai-trainer/analytics", selectedAssistant],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/ai-trainer/analytics?assistantId=${selectedAssistant}`);
      return response.json();
    }
  });

  // Fetch training recommendations
  const { data: recommendations = [] } = useQuery({
    queryKey: ["/api/ai-trainer/recommendations", selectedAssistant],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/ai-trainer/recommendations?assistantId=${selectedAssistant}`);
      return response.json();
    }
  });

  // Generate training strategy mutation
  const generateStrategyMutation = useMutation({
    mutationFn: async (data: { assistantId: number; focus?: string }) => {
      const response = await apiRequest("POST", "/api/ai-trainer/generate-strategy", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai-trainer/strategies"] });
    }
  });

  // Implement strategy mutation
  const implementStrategyMutation = useMutation({
    mutationFn: async (strategyId: string) => {
      const response = await apiRequest("POST", `/api/ai-trainer/implement/${strategyId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai-trainer/strategies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ai-trainer/analytics"] });
    }
  });

  // Auto-training mutation
  const autoTrainingMutation = useMutation({
    mutationFn: async (assistantId: number) => {
      const response = await apiRequest("POST", "/api/ai-trainer/auto-train", { assistantId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai-trainer/strategies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ai-trainer/analytics"] });
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-emerald-600';
      case 'medium': return 'text-blue-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const PerformanceOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">{analytics?.overallScore || 85}/100</div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <Progress value={analytics?.overallScore || 85} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Active Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{strategies.filter((s: any) => !s.isImplemented).length}</div>
          <p className="text-xs text-gray-600 mt-1">
            {strategies.filter((s: any) => s.priority === 'high').length} high priority
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Improvement Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{analytics?.improvementRate || 12}%</div>
          <p className="text-xs text-green-600 mt-1">This month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Training Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics?.trainingSessions || 47}</div>
          <p className="text-xs text-gray-600 mt-1">Completed</p>
        </CardContent>
      </Card>
    </div>
  );

  const TrainingStrategies = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Training Strategies</h3>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            onClick={() => generateStrategyMutation.mutate({ assistantId: selectedAssistant })}
            disabled={generateStrategyMutation.isPending}
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Generate Strategy
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => autoTrainingMutation.mutate(selectedAssistant)}
            disabled={autoTrainingMutation.isPending}
          >
            <Zap className="h-4 w-4 mr-2" />
            Auto-Train
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {strategiesLoading ? (
          <p className="text-gray-500">Loading training strategies...</p>
        ) : strategies.length === 0 ? (
          <Card className="text-center p-8">
            <Brain className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No Training Strategies Yet</h3>
            <p className="text-gray-600 mb-4">Generate AI-powered training strategies to improve your assistant's performance</p>
            <Button onClick={() => generateStrategyMutation.mutate({ assistantId: selectedAssistant })}>
              <Lightbulb className="h-4 w-4 mr-2" />
              Create First Strategy
            </Button>
          </Card>
        ) : (
          strategies.map((strategy: TrainingStrategy) => (
            <Card key={strategy.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(strategy.priority)}>{strategy.priority}</Badge>
                    <Badge variant="outline">{strategy.strategyType.replace('_', ' ')}</Badge>
                  </div>
                  {strategy.isImplemented ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Implemented
                    </Badge>
                  ) : (
                    <Button 
                      size="sm"
                      onClick={() => implementStrategyMutation.mutate(strategy.id)}
                      disabled={implementStrategyMutation.isPending}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Implement
                    </Button>
                  )}
                </div>

                <h4 className="font-medium mb-2">{strategy.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium mb-1">Implementation Steps:</h5>
                    <ul className="text-gray-600 space-y-1">
                      {strategy.implementation.map((step, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="mb-2">
                      <h5 className="font-medium">Expected Improvement:</h5>
                      <p className="text-gray-600">{strategy.expectedImprovement}</p>
                    </div>
                    <div className="mb-2">
                      <h5 className="font-medium">Timeline:</h5>
                      <p className="text-gray-600 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {strategy.timeline}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium">Success Metrics:</h5>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {strategy.metrics.map((metric, index) => (
                          <Badge key={index} variant="outline" className="text-xs">{metric}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {strategy.progress !== undefined && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{strategy.progress}%</span>
                    </div>
                    <Progress value={strategy.progress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const RecommendationsPanel = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Real-Time Recommendations</h3>
      
      <div className="space-y-3">
        {recommendations.length === 0 ? (
          <Card className="text-center p-6">
            <Award className="h-8 w-8 mx-auto text-green-500 mb-2" />
            <p className="text-gray-600">Your assistant is performing well! No immediate recommendations.</p>
          </Card>
        ) : (
          recommendations.map((rec: TrainingRecommendation, index: number) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline">{rec.category}</Badge>
                  <div className="flex items-center space-x-1">
                    <Target className={`h-4 w-4 ${getImpactColor(rec.impact)}`} />
                    <span className={`text-xs ${getImpactColor(rec.impact)}`}>{rec.impact} impact</span>
                  </div>
                </div>
                
                <h4 className="font-medium mb-1">{rec.issue}</h4>
                <p className="text-sm text-gray-600 mb-3">{rec.solution}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Effort: {rec.effort}</span>
                    <span>Priority: #{rec.priority}</span>
                  </div>
                  <Button size="sm" variant="outline">
                    Apply Fix
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const ConversationAnalysis = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Recent Conversation Analysis</h3>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics?.avgSatisfaction || 4.2}</div>
              <div className="text-sm text-gray-600">User Satisfaction</div>
              <div className="flex justify-center mt-1">
                {[1,2,3,4,5].map(star => (
                  <Star key={star} className={`h-3 w-3 ${star <= (analytics?.avgSatisfaction || 4.2) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analytics?.responseQuality || 87}%</div>
              <div className="text-sm text-gray-600">Response Quality</div>
              <Progress value={analytics?.responseQuality || 87} className="mt-1" />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analytics?.accuracy || 92}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
              <Progress value={analytics?.accuracy || 92} className="mt-1" />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{analytics?.helpfulness || 89}%</div>
              <div className="text-sm text-gray-600">Helpfulness</div>
              <Progress value={analytics?.helpfulness || 89} className="mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
              Strong Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(analytics?.strongAreas || ['Professional communication', 'Quick response time', 'Accurate information']).map((area: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{area}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
              Improvement Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(analytics?.weakAreas || ['Complex technical questions', 'Emotional support', 'Multi-step processes']).map((area: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{area}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Brain className="h-8 w-8 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold">LeadGen AI Trainer</h1>
          <p className="text-gray-600">Intelligent training system to optimize AI assistant performance</p>
        </div>
      </div>

      {/* Assistant Selection & Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <Label>Select Assistant</Label>
                <Select value={selectedAssistant.toString()} onValueChange={(value) => setSelectedAssistant(parseInt(value))}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {assistants.map((assistant: any) => (
                      <SelectItem key={assistant.id} value={assistant.id.toString()}>
                        {assistant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Training Mode</Label>
                <Select value={trainingMode} onValueChange={(value: 'auto' | 'manual') => setTrainingMode(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Analysis Depth</Label>
                <Select value={analysisDepth} onValueChange={(value: 'basic' | 'detailed') => setAnalysisDepth(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" asChild>
                <Link href="/knowledge-centre">
                  <Settings className="h-4 w-4 mr-2" />
                  Knowledge Centre
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <PerformanceOverview />

      {/* Main Tabs */}
      <Tabs defaultValue="strategies" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="strategies">
            <Target className="h-4 w-4 mr-2" />
            Strategies
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            <Lightbulb className="h-4 w-4 mr-2" />
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="strategies" className="space-y-4">
          <TrainingStrategies />
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <RecommendationsPanel />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <ConversationAnalysis />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Trainer Settings</CardTitle>
              <CardDescription>Configure automated training parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-medium">Training Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600 mt-1">How often to analyze and suggest improvements</p>
                </div>

                <div>
                  <Label className="text-base font-medium">Auto-Implementation</Label>
                  <Select defaultValue="manual">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Automatic</SelectItem>
                      <SelectItem value="review">Review Required</SelectItem>
                      <SelectItem value="manual">Manual Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600 mt-1">Whether to auto-implement low-risk improvements</p>
                </div>

                <div>
                  <Label className="text-base font-medium">Performance Threshold</Label>
                  <Select defaultValue="80">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="70">70% - Basic</SelectItem>
                      <SelectItem value="80">80% - Standard</SelectItem>
                      <SelectItem value="90">90% - High</SelectItem>
                      <SelectItem value="95">95% - Excellence</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600 mt-1">Minimum performance score to maintain</p>
                </div>

                <div>
                  <Label className="text-base font-medium">Training Focus</Label>
                  <Select defaultValue="balanced">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accuracy">Accuracy</SelectItem>
                      <SelectItem value="satisfaction">User Satisfaction</SelectItem>
                      <SelectItem value="efficiency">Response Efficiency</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600 mt-1">Primary area to optimize during training</p>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Export Training Data</h4>
                  <p className="text-sm text-gray-600">Download conversation analysis and training strategies</p>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}