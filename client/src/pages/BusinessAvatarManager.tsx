import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { AVATAR_IMAGES } from "@/components/AvatarImageGenerator";
import TopNavigation from "@/components/TopNavigation";
import { 
  Bot, 
  Star, 
  Users, 
  Zap, 
  Edit, 
  Eye, 
  Play,
  Settings,
  Palette,
  Mic,
  Brain,
  TrendingUp,
  DollarSign,
  Globe,
  Heart,
  Briefcase,
  HeadphonesIcon,
  Wrench,
  GraduationCap,
  Award,
  CheckCircle,
  Sparkles
} from "lucide-react";

interface BusinessAvatar {
  id: string;
  name: string;
  businessType: string;
  description: string;
  personality: string;
  expertise: string[];
  appearance: {
    imageUrl: string;
    style: string;
    hairColor: string;
    eyeColor: string;
    outfit: string;
    accessories: string[];
  };
  voiceProfile: {
    tone: string;
    pace: string;
    accent: string;
  };
  specializations: string[];
  industries: string[];
  communicationStyle: string;
  languages: string[];
  pricing: {
    tier: string;
    monthlyPrice: number;
  };
  isCustomizable: boolean;
  isActive: boolean;
}

// Avatar type icons
const AVATAR_TYPE_ICONS = {
  health_coaching: Heart,
  sales_automation: Briefcase,
  customer_service: HeadphonesIcon,
  technical_support: Wrench,
  business_consulting: Brain,
  education_training: GraduationCap
};

// Pricing tier colors
const PRICING_COLORS = {
  basic: 'bg-green-100 text-green-800',
  premium: 'bg-blue-100 text-blue-800',
  enterprise: 'bg-purple-100 text-purple-800'
};

export default function BusinessAvatarManager() {
  const [, setLocation] = useLocation();
  const [selectedAvatar, setSelectedAvatar] = useState<BusinessAvatar | null>(null);
  const [customizationMode, setCustomizationMode] = useState(false);
  const [deploymentMode, setDeploymentMode] = useState(false);
  const [customizations, setCustomizations] = useState<any>({});
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all business avatars
  const { data: avatarsData, isLoading: avatarsLoading, error: avatarsError } = useQuery({
    queryKey: ['/api/business-avatars/avatars'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/business-avatars/avatars');
      if (!response.ok) throw new Error('Failed to fetch avatars');
      return response.json();
    }
  });

  // Fetch customization options
  const { data: optionsData } = useQuery({
    queryKey: ['/api/business-avatars/customization-options'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/business-avatars/customization-options');
      if (!response.ok) throw new Error('Failed to fetch customization options');
      return response.json();
    }
  });

  const avatars: BusinessAvatar[] = (avatarsData as any)?.avatars || [];
  const customizationOptions = (optionsData as any)?.options || {};



  // Customize avatar mutation
  const customizeAvatarM = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/business-avatars/avatars/customize', data);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Customization failed');
      return result;
    },
    onSuccess: (data) => {
      toast({
        title: "Avatar Customized Successfully",
        description: `${data.avatar.name} is ready for deployment`,
      });
      setSelectedAvatar(data.avatar);
      setCustomizationMode(false);
      queryClient.invalidateQueries({ queryKey: ['/api/business-avatars/avatars'] });
    },
    onError: (error: any) => {
      toast({
        title: "Customization Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Deploy avatar mutation
  const deployAvatarM = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', `/api/business-avatars/avatars/${data.avatarId}/deploy`, data);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Deployment failed');
      return result;
    },
    onSuccess: (data) => {
      toast({
        title: "Avatar Deployed Successfully",
        description: `${data.avatar.name} is now live and ready to assist customers`,
      });
      setDeploymentMode(false);
    },
    onError: (error: any) => {
      toast({
        title: "Deployment Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleCustomizeAvatar = () => {
    if (!selectedAvatar) return;

    customizeAvatarM.mutate({
      baseAvatarId: selectedAvatar.id,
      customizations,
      businessName: 'LeadGen Business',
      targetAudience: 'Business professionals'
    });
  };

  const handleDeployAvatar = (businessId: string = 'leadgen_main') => {
    if (!selectedAvatar) return;

    deployAvatarM.mutate({
      avatarId: selectedAvatar.id,
      businessId,
      deploymentConfig: {
        environment: 'production',
        channels: ['web', 'mobile', 'api'],
        features: ['chat', 'voice', 'analytics']
      }
    });
  };

  const getAvatarImage = (avatar: BusinessAvatar) => {
    const imageKey = avatar.appearance.imageUrl.split('/').pop()?.replace('.svg', '.svg') || '';
    const ImageComponent = AVATAR_IMAGES[imageKey as keyof typeof AVATAR_IMAGES];
    return ImageComponent ? ImageComponent(80) : (
      <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
        <Bot className="h-10 w-10 text-white" />
      </div>
    );
  };

  const getBusinessTypeIcon = (businessType: string) => {
    const IconComponent = AVATAR_TYPE_ICONS[businessType as keyof typeof AVATAR_TYPE_ICONS] || Bot;
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <TopNavigation />
      
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Business Avatar Manager</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Deploy ready-to-use AI avatars for your business. Each avatar is specialized for specific industries 
            with anime-style personalities and customizable features.
          </p>
        </div>

        <Tabs defaultValue="gallery" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="gallery">Avatar Gallery</TabsTrigger>
            <TabsTrigger value="customize">Customize</TabsTrigger>
            <TabsTrigger value="deploy">Deploy</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Avatar Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {avatarsLoading ? (
                [...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </CardHeader>
                  </Card>
                ))
              ) : (
                avatars.map((avatar) => (
                  <Card 
                    key={avatar.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedAvatar?.id === avatar.id ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedAvatar(avatar)}
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4">
                        {getAvatarImage(avatar)}
                      </div>
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        {getBusinessTypeIcon(avatar.businessType)}
                        <CardTitle className="text-lg">{avatar.name}</CardTitle>
                      </div>
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <Badge className={PRICING_COLORS[avatar.pricing?.tier as keyof typeof PRICING_COLORS] || 'bg-gray-100 text-gray-800'}>
                          {avatar.pricing?.tier || 'standard'}
                        </Badge>
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3" />
                          <span>{avatar.pricing?.monthlyPrice || 99}/mo</span>
                        </Badge>
                      </div>
                      <CardDescription className="text-sm mb-4">
                        {avatar.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Expertise */}
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Expertise</h4>
                        <div className="flex flex-wrap gap-1">
                          {avatar.expertise.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {avatar.expertise.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{avatar.expertise.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Industries */}
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Industries</h4>
                        <div className="flex flex-wrap gap-1">
                          {avatar.industries.slice(0, 3).map((industry, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {industry}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Voice & Style */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Voice:</span>
                          <p className="text-gray-600">{avatar.voiceProfile.tone}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Style:</span>
                          <p className="text-gray-600">{avatar.appearance.style}</p>
                        </div>
                      </div>

                      {/* Languages */}
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Languages</h4>
                        <div className="flex items-center space-x-1">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {avatar.languages.slice(0, 3).join(', ')}
                            {avatar.languages.length > 3 && ` +${avatar.languages.length - 3} more`}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-4 border-t">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAvatar(avatar);
                            setCustomizationMode(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Customize
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAvatar(avatar);
                            handleDeployAvatar();
                          }}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Deploy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Customize Tab */}
          <TabsContent value="customize" className="space-y-6">
            {!selectedAvatar ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Palette className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Avatar to Customize</h3>
                  <p className="text-gray-600 mb-4">Choose an avatar from the gallery to start customization</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Avatar Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Eye className="h-5 w-5" />
                      <span>Avatar Preview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="mx-auto w-32 h-32">
                      {getAvatarImage(selectedAvatar)}
                    </div>
                    <h3 className="text-xl font-semibold">{customizations.name || selectedAvatar.name}</h3>
                    <p className="text-gray-600">{customizations.description || selectedAvatar.description}</p>
                    
                    {/* Voice Preview */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Mic className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-sm">Voice Profile</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Tone: {customizations.voiceProfile?.tone || selectedAvatar.voiceProfile.tone}</p>
                        <p>Pace: {customizations.voiceProfile?.pace || selectedAvatar.voiceProfile.pace}</p>
                        <p>Accent: {customizations.voiceProfile?.accent || selectedAvatar.voiceProfile.accent}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Customization Controls */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="h-5 w-5" />
                      <span>Customization Options</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="avatar-name">Avatar Name</Label>
                        <Input
                          id="avatar-name"
                          value={customizations.name || selectedAvatar.name}
                          onChange={(e) => setCustomizations({...customizations, name: e.target.value})}
                          placeholder="Enter avatar name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="avatar-description">Description</Label>
                        <Textarea
                          id="avatar-description"
                          value={customizations.description || selectedAvatar.description}
                          onChange={(e) => setCustomizations({...customizations, description: e.target.value})}
                          placeholder="Describe your avatar's role and personality"
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Appearance Customization */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Appearance</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="hair-color">Hair Color</Label>
                          <Select
                            value={customizations.appearance?.hairColor || selectedAvatar.appearance.hairColor}
                            onValueChange={(value) => setCustomizations({
                              ...customizations,
                              appearance: {...customizations.appearance, hairColor: value}
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {customizationOptions.appearance?.hairColors?.map((color: string) => (
                                <SelectItem key={color} value={color}>{color}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="eye-color">Eye Color</Label>
                          <Select
                            value={customizations.appearance?.eyeColor || selectedAvatar.appearance.eyeColor}
                            onValueChange={(value) => setCustomizations({
                              ...customizations,
                              appearance: {...customizations.appearance, eyeColor: value}
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {customizationOptions.appearance?.eyeColors?.map((color: string) => (
                                <SelectItem key={color} value={color}>{color}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Voice Customization */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Voice Profile</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="voice-tone">Tone</Label>
                          <Select
                            value={customizations.voiceProfile?.tone || selectedAvatar.voiceProfile.tone}
                            onValueChange={(value) => setCustomizations({
                              ...customizations,
                              voiceProfile: {...customizations.voiceProfile, tone: value}
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {customizationOptions.voice?.tones?.map((tone: string) => (
                                <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="voice-pace">Pace</Label>
                          <Select
                            value={customizations.voiceProfile?.pace || selectedAvatar.voiceProfile.pace}
                            onValueChange={(value) => setCustomizations({
                              ...customizations,
                              voiceProfile: {...customizations.voiceProfile, pace: value}
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {customizationOptions.voice?.paces?.map((pace: string) => (
                                <SelectItem key={pace} value={pace}>{pace}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Save Customization */}
                    <div className="flex space-x-3 pt-6 border-t">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCustomizations({});
                          setCustomizationMode(false);
                        }}
                        className="flex-1"
                      >
                        Reset
                      </Button>
                      <Button
                        onClick={handleCustomizeAvatar}
                        disabled={customizeAvatarM.isPending}
                        className="flex-1"
                      >
                        {customizeAvatarM.isPending ? 'Saving...' : 'Save Customization'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Deploy Tab */}
          <TabsContent value="deploy" className="space-y-6">
            {!selectedAvatar ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Play className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Avatar to Deploy</h3>
                  <p className="text-gray-600 mb-4">Choose an avatar from the gallery to deploy to your business</p>
                </CardContent>
              </Card>
            ) : (
              <div className="max-w-2xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Deploy {selectedAvatar.name}</span>
                    </CardTitle>
                    <CardDescription>
                      Ready to deploy your AI avatar to production
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Deployment Preview */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16">
                          {getAvatarImage(selectedAvatar)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{selectedAvatar.name}</h3>
                          <p className="text-gray-600">{selectedAvatar.businessType.replace('_', ' ')}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Industries:</span>
                          <p className="text-gray-600">{selectedAvatar.industries.slice(0, 2).join(', ')}</p>
                        </div>
                        <div>
                          <span className="font-medium">Languages:</span>
                          <p className="text-gray-600">{selectedAvatar.languages.slice(0, 2).join(', ')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Deployment Options */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Deployment Configuration</h4>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Environment:</span>
                          <Badge>Production</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Channels:</span>
                          <span className="text-sm text-gray-600">Web, Mobile, API</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Features:</span>
                          <span className="text-sm text-gray-600">Chat, Voice, Analytics</span>
                        </div>
                      </div>
                    </div>

                    {/* Deploy Button */}
                    <Button
                      onClick={() => handleDeployAvatar()}
                      disabled={deployAvatarM.isPending}
                      className="w-full"
                      size="lg"
                    >
                      {deployAvatarM.isPending ? (
                        'Deploying...'
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Deploy Avatar to Production
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="text-center py-12">
              <CardContent>
                <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Avatar Analytics Coming Soon</h3>
                <p className="text-gray-600 mb-4">
                  Track performance metrics, conversation analytics, and business impact of your deployed avatars
                </p>
                <Button variant="outline" disabled>
                  <Award className="h-4 w-4 mr-2" />
                  View Analytics Dashboard
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}