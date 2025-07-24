import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import TopNavigation from "@/components/TopNavigation";
import { apiRequest } from "@/lib/queryClient";
import {
  Bot, Heart, Plane, Dumbbell, Apple, Brain as BrainIcon, Sparkles,
  DollarSign, Globe, Edit, Play, Settings, Eye, Mic, Palette,
  CheckCircle, Zap, User, Target, Calendar, MessageSquare
} from "lucide-react";

interface PersonalAvatar {
  id: string;
  name: string;
  avatarType: string;
  description: string;
  appearance: {
    imageUrl: string;
    hairColor: string;
    eyeColor: string;
    style: string;
  };
  voiceProfile: {
    tone: string;
    pace: string;
    accent: string;
  };
  expertise: string[];
  specializations: string[];
  industries: string[];
  communicationStyle: string;
  languages: string[];
  pricing: {
    tier: string;
    monthlyPrice: number;
  };
  personalityTraits: string[];
  isCustomizable: boolean;
  isActive: boolean;
}

// Avatar type icons
const AVATAR_TYPE_ICONS = {
  travel_planning: Plane,
  wellness_coaching: Heart,
  fitness_training: Dumbbell,
  nutrition_coaching: Apple,
  counseling_support: BrainIcon,
  spiritual_guidance: Sparkles
};

// Pricing tier colors
const PRICING_COLORS = {
  basic: 'bg-green-100 text-green-800',
  premium: 'bg-blue-100 text-blue-800',
  enterprise: 'bg-purple-100 text-purple-800'
};

// Avatar type descriptions
const AVATAR_DESCRIPTIONS = {
  travel_planning: 'Plan perfect trips and discover amazing destinations',
  wellness_coaching: 'Achieve mind-body balance and healthy lifestyle habits',
  fitness_training: 'Reach your fitness goals with personalized workout plans',
  nutrition_coaching: 'Optimize your nutrition with expert dietary guidance', 
  counseling_support: 'Get emotional support and mental wellness guidance',
  spiritual_guidance: 'Explore personal growth through spiritual practices'
};

export default function PersonalAvatarManager() {
  const [, setLocation] = useLocation();
  const [selectedAvatar, setSelectedAvatar] = useState<PersonalAvatar | null>(null);
  const [customizationMode, setCustomizationMode] = useState(false);
  const [deploymentMode, setDeploymentMode] = useState(false);
  const [customizations, setCustomizations] = useState<any>({});
  const [selectedType, setSelectedType] = useState<string>('all');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all personal avatars
  const { data: avatarsData, isLoading: avatarsLoading, error: avatarsError } = useQuery({
    queryKey: ['/api/personal-avatars/avatars'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/personal-avatars/avatars');
      return response;
    }
  });

  // Fetch customization options
  const { data: customizationOptions } = useQuery({
    queryKey: ['/api/personal-avatars/customization-options'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/personal-avatars/customization-options');
      return response.options;
    }
  });

  const avatars = avatarsData?.avatars || [];

  // Filter avatars by type
  const filteredAvatars = selectedType === 'all' 
    ? avatars 
    : avatars.filter((avatar: PersonalAvatar) => avatar.avatarType === selectedType);

  // Customize avatar mutation
  const customizeAvatarM = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/personal-avatars/customize', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/personal-avatars/avatars'] });
      toast({
        title: "Avatar Customized",
        description: "Your personal avatar has been customized successfully.",
      });
      setCustomizationMode(false);
    },
    onError: (error: any) => {
      toast({
        title: "Customization Failed",
        description: error.message || "Failed to customize avatar",
        variant: "destructive",
      });
    }
  });

  // Deploy avatar mutation
  const deployAvatarM = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/personal-avatars/deploy', data);
    },
    onSuccess: (data) => {
      toast({
        title: "Avatar Deployed",
        description: `Your personal assistant is now active at ${data.deployment.endpoint}`,
      });
      setDeploymentMode(false);
    },
    onError: (error: any) => {
      toast({
        title: "Deployment Failed",
        description: error.message || "Failed to deploy avatar",
        variant: "destructive",
      });
    }
  });

  const handleCustomizeAvatar = () => {
    if (!selectedAvatar) return;

    customizeAvatarM.mutate({
      baseAvatarId: selectedAvatar.id,
      customizations,
      personalGoals: customizations.goals || [],
      preferences: {
        reminderFrequency: customizations.reminderFrequency || 'daily',
        privacyLevel: customizations.privacyLevel || 'personal'
      }
    });
  };

  const handleDeployAvatar = () => {
    if (!selectedAvatar) return;

    deployAvatarM.mutate({
      avatarId: selectedAvatar.id,
      personalSettings: {
        goals: customizations.goals || [],
        preferences: customizations.preferences || {}
      },
      deploymentConfig: {
        channels: ['mobile', 'web'],
        features: ['chat', 'reminders', 'progress_tracking'],
        privacy: 'personal'
      }
    });
  };

  const getAvatarImage = (avatar: PersonalAvatar) => {
    // For now, use the icon as placeholder
    const IconComponent = AVATAR_TYPE_ICONS[avatar.avatarType as keyof typeof AVATAR_TYPE_ICONS] || Bot;
    return (
      <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
        <IconComponent className="h-10 w-10 text-white" />
      </div>
    );
  };

  const getAvatarTypeIcon = (avatarType: string) => {
    const IconComponent = AVATAR_TYPE_ICONS[avatarType as keyof typeof AVATAR_TYPE_ICONS] || Bot;
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <TopNavigation />
      
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg">
              <User className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Personal Avatar Manager</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose your personal AI assistant for travel, wellness, fitness, nutrition, counseling, and spiritual guidance.
            Each avatar is designed to support your individual goals and personal growth.
          </p>
        </div>

        {/* Avatar Type Filter */}
        <div className="flex justify-center mb-6">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by avatar type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Personal Avatars</SelectItem>
              <SelectItem value="travel_planning">Travel Planning</SelectItem>
              <SelectItem value="wellness_coaching">Wellness Coaching</SelectItem>
              <SelectItem value="fitness_training">Fitness Training</SelectItem>
              <SelectItem value="nutrition_coaching">Nutrition Coaching</SelectItem>
              <SelectItem value="counseling_support">Counseling Support</SelectItem>
              <SelectItem value="spiritual_guidance">Spiritual Guidance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="gallery" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="gallery">Avatar Gallery</TabsTrigger>
            <TabsTrigger value="customize">Customize</TabsTrigger>
            <TabsTrigger value="deploy">Deploy</TabsTrigger>
            <TabsTrigger value="manage">My Avatars</TabsTrigger>
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
                filteredAvatars.map((avatar: PersonalAvatar) => (
                  <Card 
                    key={avatar.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedAvatar?.id === avatar.id ? 'ring-2 ring-pink-500 bg-pink-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedAvatar(avatar)}
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4">
                        {getAvatarImage(avatar)}
                      </div>
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        {getAvatarTypeIcon(avatar.avatarType)}
                        <CardTitle className="text-lg">{avatar.name}</CardTitle>
                      </div>
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <Badge className={PRICING_COLORS[avatar.pricing?.tier as keyof typeof PRICING_COLORS] || 'bg-gray-100 text-gray-800'}>
                          {avatar.pricing?.tier || 'standard'}
                        </Badge>
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3" />
                          <span>{avatar.pricing?.monthlyPrice || 29}/mo</span>
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
                          {(avatar.expertise || []).slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {(avatar.expertise || []).length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{(avatar.expertise || []).length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Personality Traits */}
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Personality</h4>
                        <div className="flex flex-wrap gap-1">
                          {(avatar.personalityTraits || []).slice(0, 3).map((trait, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {trait}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Languages */}
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Languages</h4>
                        <div className="flex items-center space-x-1">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {(avatar.languages || []).slice(0, 3).join(', ')}
                            {(avatar.languages || []).length > 3 && ` +${(avatar.languages || []).length - 3} more`}
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
                          className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAvatar(avatar);
                            handleDeployAvatar();
                          }}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Activate
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
                  <p className="text-gray-600 mb-4">Choose a personal avatar from the gallery to start customization</p>
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
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Customization Controls */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="h-5 w-5" />
                      <span>Personal Settings</span>
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
                        <Label htmlFor="personal-goals">Personal Goals</Label>
                        <Textarea
                          id="personal-goals"
                          value={customizations.goals || ''}
                          onChange={(e) => setCustomizations({...customizations, goals: e.target.value})}
                          placeholder="What are your goals? (e.g., lose weight, travel more, reduce stress)"
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Personal Preferences */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Preferences</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="reminder-frequency">Reminder Frequency</Label>
                          <Select
                            value={customizations.reminderFrequency || 'daily'}
                            onValueChange={(value) => setCustomizations({
                              ...customizations,
                              reminderFrequency: value
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="communication-style">Communication Style</Label>
                          <Select
                            value={customizations.communicationStyle || 'friendly'}
                            onValueChange={(value) => setCustomizations({
                              ...customizations,
                              communicationStyle: value
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="supportive">Supportive</SelectItem>
                              <SelectItem value="motivational">Motivational</SelectItem>
                              <SelectItem value="gentle">Gentle</SelectItem>
                              <SelectItem value="direct">Direct</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Save Customization */}
                    <Button
                      onClick={handleCustomizeAvatar}
                      disabled={customizeAvatarM.isPending}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    >
                      {customizeAvatarM.isPending ? 'Customizing...' : 'Save Customization'}
                    </Button>
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
                  <Zap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Avatar to Activate</h3>
                  <p className="text-gray-600 mb-4">Choose a personal avatar to activate as your assistant</p>
                </CardContent>
              </Card>
            ) : (
              <div className="max-w-2xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Activate {selectedAvatar.name}</span>
                    </CardTitle>
                    <CardDescription>
                      Ready to activate your personal AI assistant
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Activation Preview */}
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16">
                          {getAvatarImage(selectedAvatar)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{selectedAvatar.name}</h3>
                          <p className="text-gray-600">{AVATAR_DESCRIPTIONS[selectedAvatar.avatarType as keyof typeof AVATAR_DESCRIPTIONS]}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Specializations:</span>
                          <p className="text-gray-600">{(selectedAvatar.specializations || []).slice(0, 2).join(', ')}</p>
                        </div>
                        <div>
                          <span className="font-medium">Languages:</span>
                          <p className="text-gray-600">{(selectedAvatar.languages || []).slice(0, 2).join(', ')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Activation Configuration */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Activation Settings</h4>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Access:</span>
                          <Badge>Personal</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Channels:</span>
                          <span className="text-sm text-gray-600">Mobile, Web</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Features:</span>
                          <span className="text-sm text-gray-600">Chat, Reminders, Progress Tracking</span>
                        </div>
                      </div>
                    </div>

                    {/* Activate Button */}
                    <Button
                      onClick={handleDeployAvatar}
                      disabled={deployAvatarM.isPending}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      size="lg"
                    >
                      {deployAvatarM.isPending ? (
                        'Activating...'
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Activate Personal Assistant
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* My Avatars Tab */}
          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>My Active Avatars</span>
                </CardTitle>
                <CardDescription>
                  Manage your activated personal assistants and view their performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No active personal avatars yet</p>
                  <p className="text-sm">Activate an avatar from the gallery to get started</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}