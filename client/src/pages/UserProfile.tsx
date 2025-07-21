import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User, Building, Target, TrendingUp, Calendar, DollarSign, Users, Wrench, MessageSquare, Mail } from "lucide-react";

const profileSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  businessModel: z.string().min(1, "Business model is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  monthlyRevenue: z.string().min(1, "Monthly revenue range is required"),
  teamSize: z.string().min(1, "Team size is required"),
  marketingChannels: z.array(z.string()).min(1, "Select at least one marketing channel"),
  businessChallenges: z.array(z.string()).min(1, "Select at least one challenge"),
  businessGoals: z.array(z.string()).min(1, "Select at least one goal"),
  growthTimeline: z.string().min(1, "Growth timeline is required"),
  marketingBudget: z.string().min(1, "Marketing budget is required"),
  businessTools: z.array(z.string()),
  uniqueValue: z.string().min(1, "Unique value proposition is required"),
  customerAcquisition: z.string().min(1, "Customer acquisition method is required"),
  customerServiceNeeds: z.string().min(1, "Customer service needs are required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const marketingChannelsOptions = [
  "Social Media", "Email Marketing", "Content Marketing", "SEO", "PPC Advertising",
  "Influencer Marketing", "Direct Mail", "Events", "Referrals", "Word of Mouth"
];

const challengesOptions = [
  "Lead Generation", "Customer Retention", "Brand Awareness", "Sales Conversion",
  "Time Management", "Team Scaling", "Marketing ROI", "Customer Service", "Competition"
];

const goalsOptions = [
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
    mutationFn: (data: ProfileFormData) => apiRequest("/api/user/profile", {
      method: "POST",
      body: data,
    }),
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
    defaultValues: profile || {
      businessName: "",
      industry: "",
      businessModel: "",
      targetAudience: "",
      monthlyRevenue: "",
      teamSize: "",
      marketingChannels: [],
      businessChallenges: [],
      businessGoals: [],
      growthTimeline: "",
      marketingBudget: "",
      businessTools: [],
      uniqueValue: "",
      customerAcquisition: "",
      customerServiceNeeds: "",
    },
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Business Profile</h1>
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          </form>
        </Form>
      )}
    </div>
  );
}