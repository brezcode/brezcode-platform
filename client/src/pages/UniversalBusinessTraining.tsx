import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLocation, Link } from 'wouter';
import TopNavigation from "@/components/TopNavigation";
import { useToast } from "@/hooks/use-toast";
import BusinessCreationDialog from '@/components/BusinessCreationDialog';
import { 
  Building2,
  Bot,
  Upload,
  FileText,
  Video,
  MessageSquare,
  Users,
  Settings,
  Plus,
  Search,
  Download,
  Globe,
  Brain,
  BookOpen,
  Camera,
  Mic,
  Image as ImageIcon,
  Lightbulb,
  Target,
  Award,
  TrendingUp,
  PlayCircle,
  Pause,
  Play,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Heart,
  ShoppingCart,
  Briefcase,
  GraduationCap,
  Stethoscope
} from 'lucide-react';

interface Business {
  id: string;
  name: string;
  type: string;
  industry: string;
  description: string;
  avatar_trained: boolean;
  documents_count: number;
  content_pieces: number;
  created_at: string;
}

interface TrainingModule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  active: boolean;
}

export default function UniversalBusinessTraining() {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [activeModule, setActiveModule] = useState<string>('scenarios');
  const { toast } = useToast();

  // Fetch businesses from API
  const { data: businessesData, isLoading: businessesLoading } = useQuery({
    queryKey: ['/api/universal-training/businesses'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const businesses = businessesData?.businesses || [];

  const trainingModules: TrainingModule[] = [
    {
      id: 'scenarios',
      name: 'Scenario Response Training',
      description: 'Train AI to handle customer scenarios and interactions',
      icon: <MessageSquare className="h-5 w-5" />,
      active: true
    },
    {
      id: 'documentation',
      name: 'Documentation Learning',
      description: 'Upload business docs for AI to learn procedures and specs',
      icon: <BookOpen className="h-5 w-5" />,
      active: true
    },
    {
      id: 'content',
      name: 'Media & Content Creation',
      description: 'Create educational content and research industry materials',
      icon: <Camera className="h-5 w-5" />,
      active: true
    }
  ];

  const businessTypes = [
    { value: 'health', label: 'Health & Wellness', icon: <Stethoscope className="h-4 w-4" /> },
    { value: 'ecommerce', label: 'E-commerce', icon: <ShoppingCart className="h-4 w-4" /> },
    { value: 'consulting', label: 'Business Consulting', icon: <Briefcase className="h-4 w-4" /> },
    { value: 'education', label: 'Education & Training', icon: <GraduationCap className="h-4 w-4" /> },
    { value: 'other', label: 'Other Business', icon: <Building2 className="h-4 w-4" /> }
  ];

  const getBusinessIcon = (type: string) => {
    switch (type) {
      case 'Health & Wellness': return <Stethoscope className="h-4 w-4 text-pink-600" />;
      case 'E-commerce': return <ShoppingCart className="h-4 w-4 text-blue-600" />;
      case 'Business Consulting': return <Briefcase className="h-4 w-4 text-purple-600" />;
      case 'Education & Training': return <GraduationCap className="h-4 w-4 text-green-600" />;
      default: return <Building2 className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <TopNavigation />

      <div className="container mx-auto py-4 px-2 sm:py-8 sm:px-4 max-w-7xl">
        {/* Universal Platform Header */}
        <div className="text-center mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
              <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 text-center">Universal Business AI Training</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto px-2">
            Train AI assistants for any business type. Upload documentation, create scenarios, and generate content - all in one universal platform.
          </p>
        </div>

        {/* Business Selection */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Businesses</h2>
            <BusinessCreationDialog>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Business
              </Button>
            </BusinessCreationDialog>
          </div>
          
          {businessesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your businesses...</p>
            </div>
          ) : businesses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No businesses found. Create your first business to get started!</p>
              <BusinessCreationDialog>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Business
                </Button>
              </BusinessCreationDialog>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {businesses.map((business) => (
              <Card 
                key={business.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedBusiness?.id === business.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedBusiness(business)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getBusinessIcon(business.type)}
                      <CardTitle className="text-base">{business.name}</CardTitle>
                    </div>
                    <Badge variant={business.avatar_trained ? "default" : "secondary"} className="text-xs">
                      {business.avatar_trained ? 'Trained' : 'Setup'}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">{business.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-medium text-blue-600">{business.documents_count}</div>
                      <div className="text-gray-500">Docs</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-green-600">{business.content_pieces}</div>
                      <div className="text-gray-500">Content</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-purple-600">{business.type}</div>
                      <div className="text-gray-500">Industry</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          )}
        </div>

        {selectedBusiness && (
          <div className="space-y-6">
            {/* Business Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getBusinessIcon(selectedBusiness.type)}
                    <div>
                      <CardTitle>{selectedBusiness.name} - AI Training Center</CardTitle>
                      <CardDescription>{selectedBusiness.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {selectedBusiness.industry}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Training Modules */}
            <Tabs value={activeModule} onValueChange={setActiveModule} className="space-y-4 sm:space-y-6">
              <TabsList className="grid w-full grid-cols-3 max-w-3xl mx-auto text-xs sm:text-sm">
                <TabsTrigger value="scenarios" className="px-2 py-2">Scenario Training</TabsTrigger>
                <TabsTrigger value="documentation" className="px-2 py-2">Documentation</TabsTrigger>
                <TabsTrigger value="content" className="px-2 py-2">Content Creation</TabsTrigger>
              </TabsList>

              {/* Module 1: Scenario Response Training */}
              <TabsContent value="scenarios" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <span>Scenario Response Training</span>
                    </CardTitle>
                    <CardDescription>
                      Train your AI assistant to handle customer interactions and business scenarios
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">Training Categories</h4>
                        {[
                          'Customer Service Scenarios',
                          'Sales Conversations',
                          'Technical Support',
                          'Product Inquiries',
                          'Complaint Resolution'
                        ].map((category, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm">{category}</span>
                            <Button size="sm" variant="outline">Configure</Button>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">Quick Actions</h4>
                        <Button 
                          className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                          onClick={() => {
                            if (selectedBusiness?.id === 'brezcode') {
                              window.location.href = '/business/brezcode/avatar-training';
                            } else {
                              toast({
                                title: "Training Available Soon",
                                description: `Scenario training for ${selectedBusiness?.name} will be available in the next update.`
                              });
                            }
                          }}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Training Session
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Upload className="h-4 w-4 mr-2" />
                          Import Scenarios
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Settings className="h-4 w-4 mr-2" />
                          Training Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Module 2: Documentation Learning */}
              <TabsContent value="documentation" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-green-600" />
                      <span>Documentation Learning</span>
                    </CardTitle>
                    <CardDescription>
                      Upload business documents for your AI to learn procedures, specs, and knowledge
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="p-4">
                        <div className="text-center space-y-2">
                          <FileText className="h-8 w-8 mx-auto text-blue-600" />
                          <h4 className="font-medium">Product Manuals</h4>
                          <p className="text-xs text-gray-600">Upload product specs and manuals</p>
                          <Button size="sm" className="w-full">Upload</Button>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="text-center space-y-2">
                          <Settings className="h-8 w-8 mx-auto text-purple-600" />
                          <h4 className="font-medium">SOPs & Procedures</h4>
                          <p className="text-xs text-gray-600">Standard operating procedures</p>
                          <Button size="sm" className="w-full">Upload</Button>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="text-center space-y-2">
                          <Brain className="h-8 w-8 mx-auto text-orange-600" />
                          <h4 className="font-medium">Knowledge Base</h4>
                          <p className="text-xs text-gray-600">FAQ and knowledge articles</p>
                          <Button size="sm" className="w-full">Upload</Button>
                        </div>
                      </Card>
                    </div>
                    
                    <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="font-medium text-gray-900 mb-2">Drop files here or click to upload</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Support: PDF, DOCX, TXT, CSV files up to 10MB each
                      </p>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Choose Files
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Module 3: Content Creation */}
              <TabsContent value="content" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Camera className="h-5 w-5 text-purple-600" />
                      <span>Media & Content Creation</span>
                    </CardTitle>
                    <CardDescription>
                      Create educational content and research industry-relevant materials
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button className="h-20 flex flex-col items-center justify-center bg-purple-600 hover:bg-purple-700">
                        <Video className="h-6 w-6 mb-2" />
                        <span className="text-sm">Create Video</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                        <FileText className="h-6 w-6 mb-2" />
                        <span className="text-sm">Write Article</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                        <ImageIcon className="h-6 w-6 mb-2" />
                        <span className="text-sm">Generate Graphics</span>
                      </Button>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Industry Research & Content Curation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Auto-research industry trends</span>
                            <Button size="sm" variant="outline">Configure</Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Curate expert content</span>
                            <Button size="sm" variant="outline">Setup</Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Generate daily tips</span>
                            <Button size="sm" variant="outline">Enable</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}