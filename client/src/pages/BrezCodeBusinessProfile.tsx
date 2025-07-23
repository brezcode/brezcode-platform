import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Heart, Building2, ArrowLeft, Save } from "lucide-react";
import { useLocation } from "wouter";
import TopNavigation from "@/components/TopNavigation";

const brezCodeProfileSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessDescription: z.string().min(10, "Business description must be at least 10 characters"),
  targetAudience: z.string().min(5, "Target audience is required"),
  serviceOfferings: z.string().min(10, "Service offerings description is required"),
  businessGoals: z.string().min(10, "Business goals are required"),
  marketingChannels: z.string().min(5, "Marketing channels are required"),
  competitiveAdvantage: z.string().min(10, "Competitive advantage is required"),
  businessStage: z.string().min(1, "Business stage is required"),
  monthlyRevenue: z.string().min(1, "Monthly revenue range is required"),
  teamSize: z.string().min(1, "Team size is required"),
  primaryChallenges: z.string().min(10, "Primary challenges are required"),
  successMetrics: z.string().min(10, "Success metrics are required"),
});

type BrezCodeProfileData = z.infer<typeof brezCodeProfileSchema>;

export default function BrezCodeBusinessProfile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<BrezCodeProfileData>({
    resolver: zodResolver(brezCodeProfileSchema),
    defaultValues: {
      businessName: "BrezCode",
      businessDescription: "AI-powered breast health assessment platform providing comprehensive health coaching and educational resources for women's wellness.",
      targetAudience: "Women aged 20-65 interested in breast health awareness and preventive care",
      serviceOfferings: "Breast health assessments, AI health coaching, personalized wellness plans, educational content, health tracking tools",
      businessGoals: "Increase breast health awareness, improve early detection rates, provide accessible health education, build trusted health community",
      marketingChannels: "Social media, health blogs, medical partnerships, wellness events, SEO content marketing",
      competitiveAdvantage: "AI-powered personalized assessments, evidence-based medical content, comprehensive health coaching, user-friendly platform",
      businessStage: "growth",
      monthlyRevenue: "10k-25k",
      teamSize: "5-10",
      primaryChallenges: "User acquisition, medical content accuracy, building trust with sensitive health topics, regulatory compliance",
      successMetrics: "User engagement rates, assessment completion rates, health outcome improvements, customer satisfaction scores",
    },
  });

  const onSubmit = async (data: BrezCodeProfileData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/business/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, businessType: "brezcode" }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to save business profile");
      }

      const result = await response.json();
      
      toast({
        title: "BrezCode Profile Updated",
        description: "Your business profile has been saved successfully.",
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save business profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <TopNavigation 
        businessContext={{
          name: "BrezCode",
          icon: <Heart className="h-5 w-5 text-red-500" />
        }}
      />
      
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setLocation('/business/brezcode/dashboard')}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="p-2 bg-pink-100 rounded-lg">
              <Building2 className="h-6 w-6 text-pink-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">BrezCode Business Profile</h1>
              <p className="text-gray-600">Manage your business information and settings</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Business Fundamentals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  <span>Business Fundamentals</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="min-h-[100px]"
                          placeholder="Describe your business, mission, and what you do"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessStage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Stage *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select business stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="startup">Startup (0-2 years)</SelectItem>
                          <SelectItem value="growth">Growth (2-5 years)</SelectItem>
                          <SelectItem value="established">Established (5+ years)</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Target Market */}
            <Card>
              <CardHeader>
                <CardTitle>Target Market & Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience *</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="min-h-[80px]"
                          placeholder="Who are your ideal customers?"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceOfferings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Offerings *</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="min-h-[100px]"
                          placeholder="What services or products do you offer?"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="competitiveAdvantage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competitive Advantage *</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="min-h-[80px]"
                          placeholder="What makes your business unique?"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Business Operations */}
            <Card>
              <CardHeader>
                <CardTitle>Business Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="monthlyRevenue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Revenue *</FormLabel>
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
                            <SelectItem value="50k+">$50,000+</SelectItem>
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
                        <FormLabel>Team Size *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select team size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Just me</SelectItem>
                            <SelectItem value="2-4">2-4 people</SelectItem>
                            <SelectItem value="5-10">5-10 people</SelectItem>
                            <SelectItem value="11-25">11-25 people</SelectItem>
                            <SelectItem value="25+">25+ people</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="marketingChannels"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marketing Channels *</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="min-h-[80px]"
                          placeholder="How do you currently market your business?"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Goals & Challenges */}
            <Card>
              <CardHeader>
                <CardTitle>Goals & Challenges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="businessGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Goals *</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="min-h-[100px]"
                          placeholder="What are your main business objectives?"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="primaryChallenges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Challenges *</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="min-h-[100px]"
                          placeholder="What are your biggest business challenges?"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="successMetrics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Success Metrics *</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="min-h-[80px]"
                          placeholder="How do you measure success?"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation('/business/brezcode/dashboard')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-pink-500 hover:bg-pink-600"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Business Profile"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}