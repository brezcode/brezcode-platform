import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User, Building, Target, TrendingUp, Calendar, DollarSign, Users, Wrench, MessageSquare, Mail } from "lucide-react";

const profileSchema = z.object({
  // Personal Information (Primary)
  fullName: z.string().min(1, "Full name is required"),
  location: z.string().min(1, "Location is required"),
  timezone: z.string().min(1, "Timezone is required"),
  phoneNumber: z.string().optional(),
  personalGoals: z.array(z.string()).min(1, "Select at least one personal goal"),
  workStyle: z.string().min(1, "Work style is required"),
  communicationPreference: z.string().min(1, "Communication preference is required"),
  availabilityHours: z.string().min(1, "Availability is required"),
  personalChallenges: z.array(z.string()).min(1, "Select at least one challenge"),
  
  // Business Information (Optional/Secondary)
  businessName: z.string().optional(),
  industry: z.string().optional(),
  businessModel: z.string().optional(),
  targetAudience: z.string().optional(),
  monthlyRevenue: z.string().optional(),
  teamSize: z.string().optional(),
  marketingChannels: z.array(z.string()).optional(),
  businessChallenges: z.array(z.string()).optional(),
  businessGoals: z.array(z.string()).optional(),
  growthTimeline: z.string().optional(),
  marketingBudget: z.string().optional(),
  businessTools: z.array(z.string()).optional(),
  uniqueValue: z.string().optional(),
  customerAcquisition: z.string().optional(),
  customerServiceNeeds: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Personal Goals Options
const personalGoalsOptions = [
  "Improve Work-Life Balance", "Increase Productivity", "Learn New Skills", "Build Better Habits",
  "Enhance Communication", "Reduce Stress", "Grow Network", "Achieve Financial Goals",
  "Become More Organized", "Develop Leadership", "Stay Healthy", "Travel More"
];

// Personal Challenges Options
const personalChallengesOptions = [
  "Time Management", "Procrastination", "Overwhelm", "Communication", 
  "Focus & Concentration", "Work-Life Balance", "Stress Management", "Decision Making",
  "Technology Adoption", "Networking", "Goal Setting", "Motivation"
];

// Business Options (Optional)
const marketingChannelsOptions = [
  "Social Media", "Email Marketing", "Content Marketing", "SEO", "PPC Advertising",
  "Influencer Marketing", "Direct Mail", "Events", "Referrals", "Word of Mouth"
];

const businessChallengesOptions = [
  "Lead Generation", "Customer Retention", "Brand Awareness", "Sales Conversion",
  "Time Management", "Team Scaling", "Marketing ROI", "Customer Service", "Competition"
];

const businessGoalsOptions = [
  "Increase Revenue", "Expand Market Share", "Launch New Products", "Improve Efficiency",
  "Scale Operations", "Build Brand", "Enhance Customer Experience", "Reduce Costs"
];

const toolsOptions = [
  "CRM System", "Email Marketing Platform", "Social Media Management", "Analytics Tools",
  "Project Management", "Customer Support", "E-commerce Platform", "Accounting Software"
];

export default function UserProfile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/user/profile"],
  });

  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: (data: ProfileFormData) => apiRequest("POST", "/api/user/profile", data),
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your business profile has been saved successfully.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive",
      });
    },
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      // Personal Information
      fullName: profile?.fullName || "",
      location: profile?.location || "",
      timezone: profile?.timezone || "",
      phoneNumber: profile?.phoneNumber || "",
      personalGoals: profile?.personalGoals || [],
      workStyle: profile?.workStyle || "",
      communicationPreference: profile?.communicationPreference || "",
      availabilityHours: profile?.availabilityHours || "",
      personalChallenges: profile?.personalChallenges || [],
      
      // Business Information (Optional)
      businessName: profile?.businessName || "",
      industry: profile?.industry || "",
      businessModel: profile?.businessModel || "",
      targetAudience: profile?.targetAudience || "",
      monthlyRevenue: profile?.monthlyRevenue || "",
      teamSize: profile?.teamSize || "",
      marketingChannels: profile?.marketingChannels || [],
      businessChallenges: profile?.businessChallenges || [],
      businessGoals: profile?.businessGoals || [],
      growthTimeline: profile?.growthTimeline || "",
      marketingBudget: profile?.marketingBudget || "",
      businessTools: profile?.businessTools || [],
      uniqueValue: profile?.uniqueValue || "",
      customerAcquisition: profile?.customerAcquisition || "",
      customerServiceNeeds: profile?.customerServiceNeeds || "",
    },
  });

  // Update form when profile data is loaded
  useEffect(() => {
    if (profile) {
      form.reset({
        fullName: profile.fullName || "",
        location: profile.location || "",
        timezone: profile.timezone || "",
        phoneNumber: profile.phoneNumber || "",
        personalGoals: profile.personalGoals || [],
        workStyle: profile.workStyle || "",
        communicationPreference: profile.communicationPreference || "",
        availabilityHours: profile.availabilityHours || "",
        personalChallenges: profile.personalChallenges || [],
        businessName: profile.businessName || "",
        industry: profile.industry || "",
        businessModel: profile.businessModel || "",
        targetAudience: profile.targetAudience || "",
        monthlyRevenue: profile.monthlyRevenue || "",
        teamSize: profile.teamSize || "",
        marketingChannels: profile.marketingChannels || [],
        businessChallenges: profile.businessChallenges || [],
        businessGoals: profile.businessGoals || [],
        growthTimeline: profile.growthTimeline || "",
        marketingBudget: profile.marketingBudget || "",
        businessTools: profile.businessTools || [],
        uniqueValue: profile.uniqueValue || "",
        customerAcquisition: profile.customerAcquisition || "",
        customerServiceNeeds: profile.customerServiceNeeds || "",
      });
    }
  }, [profile, form]);

  const onSubmit = (data: ProfileFormData) => {
    saveProfile(data);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <User className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Personal Profile</h1>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button 
              onClick={form.handleSubmit(onSubmit)}
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      {!isEditing && profile ? (
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="business">Business Information</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <span>Basic Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Full Name</span>
                    <p className="text-gray-900">{profile.fullName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Location</span>
                    <p className="text-gray-900">{profile.location}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Timezone</span>
                    <p className="text-gray-900">{profile.timezone}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-green-600" />
                    <span>Personal Goals</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(profile.personalGoals || []).map((goal: string) => (
                      <span key={goal} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {goal}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span>Work Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Work Style</span>
                    <p className="text-gray-900">{profile.workStyle}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Communication</span>
                    <p className="text-gray-900">{profile.communicationPreference}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Availability</span>
                    <p className="text-gray-900">{profile.availabilityHours}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-red-600" />
                    <span>Personal Challenges</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(profile.personalChallenges || []).map((challenge: string) => (
                      <span key={challenge} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                        {challenge}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            {profile.businessName ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="w-5 h-5 text-blue-600" />
                      <span>Business Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Business Name</span>
                      <p className="text-gray-900">{profile.businessName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Industry</span>
                      <p className="text-gray-900">{profile.industry}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Business Model</span>
                      <p className="text-gray-900">{profile.businessModel}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-green-600" />
                      <span>Target & Revenue</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Target Audience</span>
                      <p className="text-gray-900">{profile.targetAudience}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Monthly Revenue</span>
                      <p className="text-gray-900">{profile.monthlyRevenue}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Team Size</span>
                      <p className="text-gray-900">{profile.teamSize}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      <span>Growth Strategy</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Growth Timeline</span>
                      <p className="text-gray-900">{profile.growthTimeline}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Marketing Budget</span>
                      <p className="text-gray-900">{profile.marketingBudget}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Mail className="w-5 h-5 text-orange-600" />
                      <span>Marketing Channels</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {(profile.marketingChannels || []).map((channel: string) => (
                        <span key={channel} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {channel}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5 text-red-600" />
                      <span>Unique Value</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-900">{profile.uniqueValue}</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Business Information</h3>
                <p className="text-gray-600 mb-4">
                  Add your business information to unlock business automation tools.
                </p>
                <Button onClick={() => setIsEditing(true)}>
                  Add Business Information
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">Personal Information</TabsTrigger>
                <TabsTrigger value="business">Business Information (Optional)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Personal Information</h2>
                  <p className="text-gray-600">Tell us about yourself to personalize your experience.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="City, Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your timezone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="UTC-12">UTC-12 (Baker Island)</SelectItem>
                            <SelectItem value="UTC-11">UTC-11 (American Samoa)</SelectItem>
                            <SelectItem value="UTC-10">UTC-10 (Hawaii)</SelectItem>
                            <SelectItem value="UTC-9">UTC-9 (Alaska)</SelectItem>
                            <SelectItem value="UTC-8">UTC-8 (Pacific Time)</SelectItem>
                            <SelectItem value="UTC-7">UTC-7 (Mountain Time)</SelectItem>
                            <SelectItem value="UTC-6">UTC-6 (Central Time)</SelectItem>
                            <SelectItem value="UTC-5">UTC-5 (Eastern Time)</SelectItem>
                            <SelectItem value="UTC+0">UTC+0 (London)</SelectItem>
                            <SelectItem value="UTC+1">UTC+1 (Paris, Berlin)</SelectItem>
                            <SelectItem value="UTC+8">UTC+8 (Beijing, Singapore)</SelectItem>
                            <SelectItem value="UTC+9">UTC+9 (Tokyo, Seoul)</SelectItem>
                            <SelectItem value="UTC+10">UTC+10 (Sydney)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="workStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="How do you prefer to work?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="focused-deep-work">Focused Deep Work</SelectItem>
                            <SelectItem value="collaborative-team">Collaborative Team Work</SelectItem>
                            <SelectItem value="flexible-schedule">Flexible Schedule</SelectItem>
                            <SelectItem value="structured-routine">Structured Routine</SelectItem>
                            <SelectItem value="multitasking">Multitasking</SelectItem>
                            <SelectItem value="project-based">Project-Based</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="communicationPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Communication Preference</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="How do you prefer to communicate?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="instant-messaging">Instant Messaging</SelectItem>
                            <SelectItem value="video-calls">Video Calls</SelectItem>
                            <SelectItem value="phone-calls">Phone Calls</SelectItem>
                            <SelectItem value="face-to-face">Face to Face</SelectItem>
                            <SelectItem value="mixed-approach">Mixed Approach</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="availabilityHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Availability Hours</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="When are you usually available?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="early-morning">Early Morning (6AM - 9AM)</SelectItem>
                            <SelectItem value="morning">Morning (9AM - 12PM)</SelectItem>
                            <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
                            <SelectItem value="evening">Evening (6PM - 9PM)</SelectItem>
                            <SelectItem value="night">Night (9PM - 12AM)</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                            <SelectItem value="business-hours">Business Hours Only</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="personalGoals"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Personal Goals</FormLabel>
                          <p className="text-sm text-gray-600">What do you want to achieve personally?</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-3">
                          {personalGoalsOptions.map((goal) => (
                            <FormField
                              key={goal}
                              control={form.control}
                              name="personalGoals"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={goal}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(goal)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, goal])
                                            : field.onChange(
                                                field.value?.filter((value: string) => value !== goal)
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {goal}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="personalChallenges"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Personal Challenges</FormLabel>
                          <p className="text-sm text-gray-600">What challenges would you like help with?</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-3">
                          {personalChallengesOptions.map((challenge) => (
                            <FormField
                              key={challenge}
                              control={form.control}
                              name="personalChallenges"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={challenge}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(challenge)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, challenge])
                                            : field.onChange(
                                                field.value?.filter((value: string) => value !== challenge)
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {challenge}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="business" className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Business Information</h2>
                  <p className="text-gray-600">Add your business details to unlock advanced automation tools.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your business name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="consulting">Consulting</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessModel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Model</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select business model" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="b2b">B2B (Business to Business)</SelectItem>
                            <SelectItem value="b2c">B2C (Business to Consumer)</SelectItem>
                            <SelectItem value="b2b2c">B2B2C (Business to Business to Consumer)</SelectItem>
                            <SelectItem value="marketplace">Marketplace</SelectItem>
                            <SelectItem value="saas">SaaS (Software as a Service)</SelectItem>
                            <SelectItem value="ecommerce">E-commerce</SelectItem>
                            <SelectItem value="freelance">Freelance/Consulting</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="targetAudience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Audience</FormLabel>
                        <FormControl>
                          <Input placeholder="Describe your target audience" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="monthlyRevenue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Revenue</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select revenue range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0-1k">$0 - $1,000</SelectItem>
                            <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                            <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                            <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                            <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                            <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                            <SelectItem value="100k+">$100,000+</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="teamSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Size</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select team size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="solo">Just me (Solo entrepreneur)</SelectItem>
                            <SelectItem value="2-5">2-5 people</SelectItem>
                            <SelectItem value="6-10">6-10 people</SelectItem>
                            <SelectItem value="11-25">11-25 people</SelectItem>
                            <SelectItem value="26-50">26-50 people</SelectItem>
                            <SelectItem value="50+">50+ people</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="marketingChannels"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Marketing Channels</FormLabel>
                          <p className="text-sm text-gray-600">Select all channels you currently use</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-3">
                          {marketingChannelsOptions.map((channel) => (
                            <FormField
                              key={channel}
                              control={form.control}
                              name="marketingChannels"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={channel}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(channel)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, channel])
                                            : field.onChange(
                                                field.value?.filter((value: string) => value !== channel)
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {channel}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="uniqueValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unique Value Proposition</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What makes your business unique compared to competitors?"
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      )}
    </div>
  );
}