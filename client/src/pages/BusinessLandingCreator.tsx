import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TopNavigation from "@/components/TopNavigation";
import ProfileModule from "@/components/ProfileModule";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye, Palette, User, Building, Save, ExternalLink } from "lucide-react";

interface BusinessProfile {
  id?: number;
  firstName: string;
  lastName: string;
  businessName: string;
  businessType: string;
  industry: string;
  jobTitle: string;
  website?: string;
  phone: string;
  address: string;
  bio: string;
  profilePhoto?: string;
}

interface LandingPageData {
  profile: BusinessProfile;
  colorScheme: string;
  template: string;
  customContent?: string;
}

const COLOR_SCHEMES = [
  { name: "Professional Blue", value: "blue", primary: "#2563eb", secondary: "#f8fafc" },
  { name: "Modern Green", value: "green", primary: "#059669", secondary: "#f0fdf4" },
  { name: "Elegant Purple", value: "purple", primary: "#7c3aed", secondary: "#faf5ff" },
  { name: "Bold Orange", value: "orange", primary: "#ea580c", secondary: "#fff7ed" },
  { name: "Classic Gray", value: "gray", primary: "#374151", secondary: "#f9fafb" },
];

const TEMPLATES = [
  { id: "modern", name: "Modern Professional", description: "Clean, minimal design perfect for consultants" },
  { id: "creative", name: "Creative Portfolio", description: "Eye-catching layout for creative professionals" },
  { id: "corporate", name: "Corporate Executive", description: "Traditional professional look for executives" },
  { id: "startup", name: "Startup Founder", description: "Dynamic design for entrepreneurs and founders" },
];

export default function BusinessLandingCreator() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [selectedColorScheme, setSelectedColorScheme] = useState("blue");
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    firstName: "",
    lastName: "",
    businessName: "",
    businessType: "",
    industry: "",
    jobTitle: "",
    website: "",
    phone: "",
    address: "",
    bio: "",
  });

  // Fetch current user for initial data
  const { data: currentUser } = useQuery({
    queryKey: ['/api/me'],
    queryFn: () => apiRequest('/api/me')
  });

  // Save business landing page
  const saveLandingPageMutation = useMutation({
    mutationFn: async (data: LandingPageData) => {
      const response = await apiRequest('/api/business-landing', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },
    onSuccess: (data) => {
      toast({
        title: "Landing page created successfully",
        description: `Your business landing page is now live at ${data.url}`,
      });
    },
    onError: (error) => {
      console.error('Landing page creation error:', error);
      toast({
        title: "Error creating landing page",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  });

  const handleProfileSave = async (profileData: any) => {
    setBusinessProfile(prev => ({ ...prev, ...profileData }));
    toast({
      title: "Profile updated",
      description: "Your business profile has been updated in the preview.",
    });
  };

  const handlePublishLandingPage = async () => {
    const landingPageData: LandingPageData = {
      profile: businessProfile,
      colorScheme: selectedColorScheme,
      template: selectedTemplate,
    };

    await saveLandingPageMutation.mutateAsync(landingPageData);
  };

  const generatePreviewUrl = () => {
    const params = new URLSearchParams({
      template: selectedTemplate,
      colorScheme: selectedColorScheme,
      firstName: businessProfile.firstName,
      lastName: businessProfile.lastName,
      businessName: businessProfile.businessName,
      jobTitle: businessProfile.jobTitle,
    });
    return `/preview/landing?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Business Landing Page Creator
            </h1>
            <p className="text-gray-600">
              Create a professional landing page for your business using our modular profile system
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="design" className="flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span>Design</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </TabsTrigger>
              <TabsTrigger value="publish" className="flex items-center space-x-2">
                <Building className="h-4 w-4" />
                <span>Publish</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <ProfileModule
                initialData={{
                  email: currentUser?.email,
                  firstName: businessProfile.firstName || currentUser?.firstName || '',
                  lastName: businessProfile.lastName || currentUser?.lastName || '',
                  businessName: businessProfile.businessName,
                  businessType: businessProfile.businessType,
                  industry: businessProfile.industry,
                  jobTitle: businessProfile.jobTitle,
                  website: businessProfile.website,
                  phone: businessProfile.phone || currentUser?.phone || '',
                  address: businessProfile.address || currentUser?.address || '',
                  bio: businessProfile.bio || currentUser?.bio || '',
                  profilePhoto: businessProfile.profilePhoto || currentUser?.profilePhoto
                }}
                mode="business"
                onSave={handleProfileSave}
                isLoading={false}
                showEmailField={false}
                title="Business Profile Information"
                description="Enter your business details that will appear on your landing page"
              />
            </TabsContent>

            {/* Design Tab */}
            <TabsContent value="design">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Template Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Choose Template</CardTitle>
                    <CardDescription>
                      Select a template that matches your business style
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {TEMPLATES.map((template) => (
                      <div
                        key={template.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedTemplate === template.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{template.name}</h3>
                            <p className="text-sm text-gray-600">{template.description}</p>
                          </div>
                          {selectedTemplate === template.id && (
                            <Badge variant="default">Selected</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Color Scheme Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Color Scheme</CardTitle>
                    <CardDescription>
                      Choose colors that represent your brand
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {COLOR_SCHEMES.map((scheme) => (
                      <div
                        key={scheme.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedColorScheme === scheme.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedColorScheme(scheme.value)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex space-x-1">
                              <div
                                className="w-6 h-6 rounded"
                                style={{ backgroundColor: scheme.primary }}
                              />
                              <div
                                className="w-6 h-6 rounded"
                                style={{ backgroundColor: scheme.secondary }}
                              />
                            </div>
                            <span className="font-medium">{scheme.name}</span>
                          </div>
                          {selectedColorScheme === scheme.value && (
                            <Badge variant="default">Selected</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Landing Page Preview</CardTitle>
                  <CardDescription>
                    See how your landing page will look to visitors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 p-6 rounded-lg">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                      {/* Preview content based on selected template and data */}
                      <div className="p-8 text-center">
                        <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                          {businessProfile.firstName} {businessProfile.lastName}
                        </h1>
                        <p className="text-xl text-gray-600 mb-2">
                          {businessProfile.jobTitle || "Professional Title"}
                        </p>
                        <p className="text-lg text-gray-600 mb-4">
                          {businessProfile.businessName || "Business Name"}
                        </p>
                        <div className="max-w-2xl mx-auto">
                          <p className="text-gray-700">
                            {businessProfile.bio || "Your professional bio will appear here..."}
                          </p>
                        </div>
                        <div className="mt-6 space-y-2">
                          {businessProfile.phone && (
                            <p className="text-gray-600">📞 {businessProfile.phone}</p>
                          )}
                          {businessProfile.website && (
                            <p className="text-gray-600">🌐 {businessProfile.website}</p>
                          )}
                          {businessProfile.address && (
                            <p className="text-gray-600">📍 {businessProfile.address}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Button
                      variant="outline"
                      onClick={() => window.open(generatePreviewUrl(), '_blank')}
                      className="flex items-center space-x-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Open Full Preview</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Publish Tab */}
            <TabsContent value="publish">
              <Card>
                <CardHeader>
                  <CardTitle>Publish Your Landing Page</CardTitle>
                  <CardDescription>
                    Make your business landing page live and accessible to clients
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">Ready to publish?</h3>
                    <p className="text-blue-800 text-sm">
                      Your landing page will be created with the selected template, colors, and business information.
                      You can always come back and make changes later.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Template:</span> {TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                      </div>
                      <div>
                        <span className="font-medium">Color Scheme:</span> {COLOR_SCHEMES.find(c => c.value === selectedColorScheme)?.name}
                      </div>
                      <div>
                        <span className="font-medium">Business Name:</span> {businessProfile.businessName || "Not set"}
                      </div>
                      <div>
                        <span className="font-medium">Contact Info:</span> {businessProfile.phone ? "Added" : "Not added"}
                      </div>
                    </div>

                    <Button
                      onClick={handlePublishLandingPage}
                      disabled={saveLandingPageMutation.isPending || !businessProfile.firstName || !businessProfile.businessName}
                      className="w-full flex items-center justify-center space-x-2"
                      size="lg"
                    >
                      <Save className="h-5 w-5" />
                      <span>
                        {saveLandingPageMutation.isPending ? 'Publishing...' : 'Publish Landing Page'}
                      </span>
                    </Button>

                    {(!businessProfile.firstName || !businessProfile.businessName) && (
                      <p className="text-sm text-red-600 text-center">
                        Please complete your profile information before publishing
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}