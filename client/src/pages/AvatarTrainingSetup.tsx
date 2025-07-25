import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import AvatarKnowledgeUploader from "@/components/AvatarKnowledgeUploader";
import { 
  Bot, 
  Users, 
  Target, 
  Clock, 
  TrendingUp,
  Play,
  BookOpen,
  MessageSquare,
  Settings,
  Award,
  Briefcase,
  HeadphonesIcon,
  Wrench,
  Brain,
  Heart,
  GraduationCap,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Star,
  BarChart3,
  Upload,
  Database
} from "lucide-react";
import TopNavigation from "@/components/TopNavigation";

interface AvatarType {
  id: string;
  name: string;
  description: string;
  primarySkills: string[];
  industries: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  expectedOutcomes: string[];
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

// Avatar type icons mapping
const AVATAR_ICONS = {
  sales_specialist: Briefcase,
  customer_service: HeadphonesIcon,
  technical_support: Wrench,
  business_consultant: Brain,
  health_coach: Heart,
  education_specialist: GraduationCap
};

// Difficulty colors
const DIFFICULTY_COLORS = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
};

export default function AvatarTrainingSetup() {
  const [, setLocation] = useLocation();
  const [selectedAvatarType, setSelectedAvatarType] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<TrainingScenario | null>(null);
  const { toast } = useToast();

  // Fetch avatar types
  const { data: avatarTypesData, isLoading: avatarTypesLoading } = useQuery({
    queryKey: ['/api/avatar-training/avatar-types'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/avatar-training/avatar-types');
      if (!response.ok) throw new Error('Failed to fetch avatar types');
      return response.json();
    }
  });

  // Fetch scenarios for selected avatar type
  const { data: scenariosData } = useQuery({
    queryKey: ['/api/avatar-training/scenarios', selectedAvatarType],
    enabled: !!selectedAvatarType,
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/avatar-training/scenarios?avatarType=${selectedAvatarType}`);
      if (!response.ok) throw new Error('Failed to fetch scenarios');
      return response.json();
    }
  });

  // Fetch training recommendations
  const { data: recommendationsData } = useQuery({
    queryKey: ['/api/avatar-training/recommendations', selectedAvatarType],
    enabled: !!selectedAvatarType,
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/avatar-training/recommendations/${selectedAvatarType}`);
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      return response.json();
    }
  });

  const avatarTypes: AvatarType[] = (avatarTypesData as any)?.avatarTypes || [];
  const scenarios: TrainingScenario[] = (scenariosData as any)?.scenarios || [];

  const handleAvatarTypeSelect = (avatarType: string) => {
    setSelectedAvatarType(avatarType);
    setSelectedScenario(null);
  };

  const handleStartTraining = (scenario: TrainingScenario) => {
    toast({
      title: "Starting Training Session",
      description: `Initializing ${scenario.name} scenario`,
    });
    // Navigate to roleplay training with scenario
    setLocation(`/roleplay-training?scenario=${scenario.id}&avatar=${scenario.avatarType}`);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <TopNavigation />

      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bot className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">AI Avatar Training Center</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose your AI avatar specialization and train with realistic customer scenarios. 
            Develop expertise through progressive roleplay training sessions.
          </p>
        </div>

        <Tabs defaultValue="avatar-types" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="avatar-types">Avatar Types</TabsTrigger>
            <TabsTrigger value="scenarios">Training Scenarios</TabsTrigger>
            <TabsTrigger value="knowledge-upload">Upload Knowledge</TabsTrigger>
            <TabsTrigger value="progress">My Progress</TabsTrigger>
          </TabsList>

          {/* Avatar Types Tab */}
          <TabsContent value="avatar-types" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Choose Your AI Avatar Specialization</h2>
              <p className="text-gray-600">Each avatar type focuses on specific skills and industries</p>
            </div>

            {avatarTypesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {avatarTypes.map((avatarType) => {
                  const IconComponent = AVATAR_ICONS[avatarType.id as keyof typeof AVATAR_ICONS] || Bot;
                  const isSelected = selectedAvatarType === avatarType.id;

                  return (
                    <Card 
                      key={avatarType.id} 
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleAvatarTypeSelect(avatarType.id)}
                    >
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                            <IconComponent className={`h-6 w-6 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{avatarType.name}</CardTitle>
                            <div className="flex items-center space-x-2">
                              {getDifficultyIcon(avatarType.difficulty)}
                              <Badge className={DIFFICULTY_COLORS[avatarType.difficulty]}>
                                {avatarType.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <CardDescription className="text-sm">
                          {avatarType.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Primary Skills */}
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-2">Key Skills</h4>
                          <div className="flex flex-wrap gap-1">
                            {avatarType.primarySkills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {avatarType.primarySkills.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{avatarType.primarySkills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Industries */}
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-2">Industries</h4>
                          <div className="flex flex-wrap gap-1">
                            {avatarType.industries.slice(0, 3).map((industry, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {industry}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Expected Outcomes */}
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-2">Outcomes</h4>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {avatarType.expectedOutcomes.slice(0, 2).map((outcome, index) => (
                              <li key={index} className="flex items-start space-x-1">
                                <TrendingUp className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button 
                          className="w-full" 
                          variant={isSelected ? "default" : "outline"}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAvatarTypeSelect(avatarType.id);
                          }}
                        >
                          {isSelected ? 'Selected' : 'Select Avatar Type'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Training Scenarios Tab */}
          <TabsContent value="scenarios" className="space-y-6">
            {!selectedAvatarType ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Bot className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Avatar Type First</h3>
                  <p className="text-gray-600 mb-4">Choose your AI avatar specialization to see available training scenarios</p>
                  <Button onClick={() => setLocation('#avatar-types')}>
                    Choose Avatar Type
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Selected Avatar Info */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {AVATAR_ICONS[selectedAvatarType as keyof typeof AVATAR_ICONS] && 
                          (() => {
                            const IconComponent = AVATAR_ICONS[selectedAvatarType as keyof typeof AVATAR_ICONS];
                            return <IconComponent className="h-6 w-6 text-blue-600" />;
                          })()
                        }
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          {avatarTypes.find(a => a.id === selectedAvatarType)?.name} Training
                        </CardTitle>
                        <CardDescription>
                          {scenarios.length} scenarios available • {recommendationsData?.trainingPath?.estimatedTrainingTime || 0} min total
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Scenarios Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {scenarios.map((scenario) => (
                    <Card key={scenario.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{scenario.name}</CardTitle>
                            <CardDescription className="text-sm mb-3">
                              {scenario.description}
                            </CardDescription>
                          </div>
                          <Badge className={DIFFICULTY_COLORS[scenario.difficulty]}>
                            {scenario.difficulty}
                          </Badge>
                        </div>

                        {/* Customer Persona */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Users className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">Customer Persona</span>
                          </div>
                          <p className="text-sm text-gray-600">{scenario.customerPersona}</p>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Objectives */}
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Target className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">Training Objectives</span>
                          </div>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {scenario.objectives.slice(0, 3).map((objective, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <ArrowRight className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                                <span>{objective}</span>
                              </li>
                            ))}
                            {scenario.objectives.length > 3 && (
                              <li className="text-blue-600 text-xs">+{scenario.objectives.length - 3} more objectives</li>
                            )}
                          </ul>
                        </div>

                        {/* Tags & Time */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{scenario.timeframeMins} min</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {scenario.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button 
                          className="w-full" 
                          onClick={() => handleStartTraining(scenario)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Training Session
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Knowledge Upload Tab */}
          <TabsContent value="knowledge-upload" className="space-y-6">
            {!selectedAvatarType ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Upload className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Avatar Type First</h3>
                  <p className="text-gray-600 mb-4">Choose your AI avatar specialization to upload custom knowledge files</p>
                  <Button onClick={() => setLocation('#avatar-types')}>
                    Choose Avatar Type
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Selected Avatar Info */}
                <Card className="bg-purple-50 border-purple-200">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        {AVATAR_ICONS[selectedAvatarType as keyof typeof AVATAR_ICONS] && 
                          (() => {
                            const IconComponent = AVATAR_ICONS[selectedAvatarType as keyof typeof AVATAR_ICONS];
                            return <IconComponent className="h-6 w-6 text-purple-600" />;
                          })()
                        }
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          Train {avatarTypes.find(a => a.id === selectedAvatarType)?.name} with Custom Knowledge
                        </CardTitle>
                        <CardDescription>
                          Upload files to expand your avatar's knowledge base and improve training responses
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Knowledge Upload Component */}
                <AvatarKnowledgeUploader
                  selectedAvatarType={selectedAvatarType}
                  onKnowledgeExtracted={(knowledge) => {
                    console.log('Knowledge extracted:', knowledge);
                    toast({
                      title: "Knowledge Added Successfully",
                      description: `Added ${knowledge.knowledgePoints?.length || 0} knowledge points to ${knowledge.avatarType}`,
                    });
                  }}
                />

                {/* Knowledge Base Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Current Knowledge Base
                    </CardTitle>
                    <CardDescription>
                      View and manage the custom knowledge for this avatar
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Upload files to see your avatar's custom knowledge base</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card className="text-center py-12">
              <CardContent>
                <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Training Progress Coming Soon</h3>
                <p className="text-gray-600 mb-4">
                  Track your AI avatar training progress, completed scenarios, and skill improvements
                </p>
                <Button variant="outline" disabled>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}