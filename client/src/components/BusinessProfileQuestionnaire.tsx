import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Target, 
  DollarSign, 
  Users, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Lightbulb
} from "lucide-react";

// Comprehensive business profile schema
const businessProfileSchema = z.object({
  // Company Fundamentals
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  businessType: z.string().min(1, "Business type is required"),
  companySize: z.string().min(1, "Company size is required"),
  businessStage: z.string().min(1, "Business stage is required"),
  
  // Market & Competition
  targetAudience: z.string().min(10, "Please provide detailed target audience description"),
  uniqueValueProp: z.string().min(10, "Please describe your unique value proposition"),
  mainCompetitors: z.array(z.string()).min(1, "Please identify at least one competitor"),
  marketPosition: z.string().min(1, "Market position is required"),
  
  // Financial Context
  currentRevenue: z.string().min(1, "Revenue range is required"),
  revenueStreams: z.array(z.string()).min(1, "Please identify at least one revenue stream"),
  profitMargins: z.string().min(1, "Profit margin range is required"),
  cashFlowHealth: z.string().min(1, "Cash flow assessment is required"),
  marketingBudget: z.string().min(1, "Marketing budget is required"),
  
  // Operations & Team
  teamSize: z.string().min(1, "Team size is required"),
  keyRoles: z.array(z.string()).min(1, "Please identify key roles"),
  operationalChallenges: z.array(z.string()).min(1, "Please identify operational challenges"),
  currentTools: z.array(z.string()).optional(),
  systemsNeeded: z.array(z.string()).optional(),
  
  // Marketing & Sales
  marketingChannels: z.array(z.string()).min(1, "Please select marketing channels"),
  salesProcess: z.string().min(10, "Please describe your sales process"),
  customerAcquisitionCost: z.string().min(1, "Customer acquisition cost is required"),
  customerLifetimeValue: z.string().min(1, "Customer lifetime value is required"),
  conversionRates: z.string().min(1, "Conversion rate information is required"),
  
  // Goals & Vision
  primaryGoals: z.array(z.string()).min(1, "Please select primary goals"),
  timeline: z.string().min(1, "Timeline is required"),
  successMetrics: z.array(z.string()).min(1, "Please define success metrics"),
  growthTargets: z.string().min(10, "Please describe growth targets"),
  
  // Current Challenges & Pain Points
  businessChallenges: z.array(z.string()).min(1, "Please identify business challenges"),
  urgentIssues: z.array(z.string()).optional(),
  resourceLimitations: z.array(z.string()).optional(),
  
  // Strategic Context
  riskTolerance: z.string().min(1, "Risk tolerance is required"),
  changeReadiness: z.string().min(1, "Change readiness assessment is required"),
  innovationFocus: z.array(z.string()).optional(),
  futureVision: z.string().min(20, "Please describe your 3-year vision"),
});

type BusinessProfileData = z.infer<typeof businessProfileSchema>;

// Question data structure
const questionSections = [
  {
    id: "fundamentals",
    title: "Company Fundamentals",
    icon: Building2,
    description: "Basic information about your business structure and operations"
  },
  {
    id: "market",
    title: "Market & Competition",
    icon: Target,
    description: "Your market position, audience, and competitive landscape"
  },
  {
    id: "financial",
    title: "Financial Context",
    icon: DollarSign,
    description: "Revenue, profitability, and budget information"
  },
  {
    id: "operations",
    title: "Operations & Team",
    icon: Users,
    description: "Your team, processes, and operational capabilities"
  },
  {
    id: "marketing",
    title: "Marketing & Sales",
    icon: TrendingUp,
    description: "Your customer acquisition and sales processes"
  },
  {
    id: "strategy",
    title: "Goals & Strategy",
    icon: Lightbulb,
    description: "Your vision, goals, and strategic priorities"
  }
];

// Industry options based on market research
const industryOptions = [
  "Technology & Software", "E-commerce & Retail", "Healthcare & Medical",
  "Professional Services", "Financial Services", "Real Estate",
  "Manufacturing", "Education & Training", "Marketing & Advertising",
  "Consulting", "Food & Beverage", "Fitness & Wellness",
  "Creative & Design", "Legal Services", "Construction",
  "Transportation & Logistics", "Non-profit", "Other"
];

// Business type options
const businessTypeOptions = [
  "B2B Services", "B2C Products", "B2B Products", "B2C Services",
  "Marketplace", "SaaS Platform", "E-commerce Store", "Agency",
  "Consulting Firm", "Freelance/Solo", "Franchise", "Other"
];

// Marketing channels options
const marketingChannelOptions = [
  "Social Media Marketing", "Google Ads", "SEO/Content Marketing", "Email Marketing",
  "LinkedIn Outreach", "Referrals", "Networking Events", "Direct Sales",
  "Content Creation", "Influencer Marketing", "Print Advertising", "Cold Calling",
  "Webinars", "Partnerships", "Trade Shows", "Other"
];

export default function BusinessProfileQuestionnaire() {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const form = useForm<BusinessProfileData>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      businessName: "",
      industry: "",
      businessType: "",
      companySize: "",
      businessStage: "",
      targetAudience: "",
      uniqueValueProp: "",
      mainCompetitors: [],
      marketPosition: "",
      currentRevenue: "",
      revenueStreams: [],
      profitMargins: "",
      cashFlowHealth: "",
      marketingBudget: "",
      teamSize: "",
      keyRoles: [],
      operationalChallenges: [],
      currentTools: [],
      systemsNeeded: [],
      marketingChannels: [],
      salesProcess: "",
      customerAcquisitionCost: "",
      customerLifetimeValue: "",
      conversionRates: "",
      primaryGoals: [],
      timeline: "",
      successMetrics: [],
      growthTargets: "",
      businessChallenges: [],
      urgentIssues: [],
      resourceLimitations: [],
      riskTolerance: "",
      changeReadiness: "",
      innovationFocus: [],
      futureVision: "",
    },
  });

  const onSubmit = async (data: BusinessProfileData) => {
    try {
      const response = await fetch("/api/business/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to save business profile");
      }

      const result = await response.json();
      
      toast({
        title: "Business Profile Complete",
        description: "Your comprehensive business assessment has been saved. Generating strategic recommendations...",
      });
      
      // Generate AI strategies
      const strategyResponse = await fetch("/api/business/generate-strategies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileId: result.profileId }),
        credentials: "include",
      });

      if (strategyResponse.ok) {
        const strategyResult = await strategyResponse.json();
        toast({
          title: "Strategic Analysis Complete",
          description: `Generated ${strategyResult.strategiesCount} personalized business strategies for your review.`,
        });
      }
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save business profile",
        variant: "destructive",
      });
    }
  };

  const validateSection = (sectionIndex: number): boolean => {
    const sectionFields = getSectionFields(sectionIndex);
    const formData = form.getValues();
    
    return sectionFields.every(field => {
      const value = formData[field as keyof BusinessProfileData];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value && value.toString().trim().length > 0;
    });
  };

  const getSectionFields = (sectionIndex: number): string[] => {
    switch (sectionIndex) {
      case 0: return ["businessName", "industry", "businessType", "companySize", "businessStage"];
      case 1: return ["targetAudience", "uniqueValueProp", "mainCompetitors", "marketPosition"];
      case 2: return ["currentRevenue", "revenueStreams", "profitMargins", "cashFlowHealth", "marketingBudget"];
      case 3: return ["teamSize", "keyRoles", "operationalChallenges"];
      case 4: return ["marketingChannels", "salesProcess", "customerAcquisitionCost", "customerLifetimeValue", "conversionRates"];
      case 5: return ["primaryGoals", "timeline", "successMetrics", "growthTargets", "businessChallenges", "futureVision"];
      default: return [];
    }
  };

  const nextSection = () => {
    if (validateSection(currentSection)) {
      setCompletedSections(prev => new Set([...prev, currentSection]));
      if (currentSection < questionSections.length - 1) {
        setCurrentSection(currentSection + 1);
      }
    } else {
      toast({
        title: "Incomplete Section",
        description: "Please fill in all required fields before continuing.",
        variant: "destructive",
      });
    }
  };

  const renderSectionContent = () => {
    switch (currentSection) {
      case 0:
        return renderFundamentalsSection();
      case 1:
        return renderMarketSection();
      case 2:
        return renderFinancialSection();
      case 3:
        return renderOperationsSection();
      case 4:
        return renderMarketingSection();
      case 5:
        return renderStrategySection();
      default:
        return null;
    }
  };

  const renderFundamentalsSection = () => (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="businessName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Name *</FormLabel>
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
            <FormLabel>Industry *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {industryOptions.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="businessType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Type *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your business type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {businessTypeOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="companySize"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Size *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="solo">Solo/Freelancer (1 person)</SelectItem>
                <SelectItem value="small">Small Team (2-10 people)</SelectItem>
                <SelectItem value="medium">Medium Business (11-50 people)</SelectItem>
                <SelectItem value="large">Large Business (51+ people)</SelectItem>
              </SelectContent>
            </Select>
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
                <SelectItem value="idea">Idea Stage</SelectItem>
                <SelectItem value="startup">Startup (0-2 years)</SelectItem>
                <SelectItem value="growth">Growth Stage (2-5 years)</SelectItem>
                <SelectItem value="established">Established (5+ years)</SelectItem>
                <SelectItem value="mature">Mature/Scaling</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderMarketSection = () => (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="targetAudience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Target Audience *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your ideal customers in detail (demographics, needs, behaviors, pain points)" 
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="uniqueValueProp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Unique Value Proposition *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="What makes your business unique? Why should customers choose you over competitors?" 
                className="min-h-[80px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="marketPosition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Market Position *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your market position" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="leader">Market Leader</SelectItem>
                <SelectItem value="challenger">Market Challenger</SelectItem>
                <SelectItem value="follower">Market Follower</SelectItem>
                <SelectItem value="niche">Niche Player</SelectItem>
                <SelectItem value="startup">New Entrant</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderFinancialSection = () => (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="currentRevenue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Annual Revenue Range *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select revenue range" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="0-10k">$0 - $10,000</SelectItem>
                <SelectItem value="10k-50k">$10,000 - $50,000</SelectItem>
                <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
                <SelectItem value="500k-1m">$500,000 - $1M</SelectItem>
                <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                <SelectItem value="5m+">$5M+</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="profitMargins"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Profit Margin Range *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select profit margin range" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="negative">Negative/Break-even</SelectItem>
                <SelectItem value="0-10">0-10%</SelectItem>
                <SelectItem value="10-20">10-20%</SelectItem>
                <SelectItem value="20-30">20-30%</SelectItem>
                <SelectItem value="30-50">30-50%</SelectItem>
                <SelectItem value="50+">50%+</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="marketingBudget"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Monthly Marketing Budget *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select marketing budget" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="0-500">$0 - $500</SelectItem>
                <SelectItem value="500-1k">$500 - $1,000</SelectItem>
                <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                <SelectItem value="25k+">$25,000+</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderOperationsSection = () => (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="teamSize"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current Team Size *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select team size" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">Just me</SelectItem>
                <SelectItem value="2-3">2-3 people</SelectItem>
                <SelectItem value="4-10">4-10 people</SelectItem>
                <SelectItem value="11-25">11-25 people</SelectItem>
                <SelectItem value="25+">25+ people</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-3">
        <FormLabel className="text-base font-medium">Key Roles in Your Team *</FormLabel>
        <div className="grid grid-cols-2 gap-3">
          {[
            "CEO/Founder", "Sales Manager", "Marketing Manager", "Operations Manager",
            "Customer Service", "Technical Lead", "Finance Manager", "HR Manager",
            "Product Manager", "Content Creator", "Administrative Assistant", "Other"
          ].map((role) => (
            <FormField
              key={role}
              control={form.control}
              name="keyRoles"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(role)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, role])
                          : field.onChange(field.value?.filter((value) => value !== role))
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    {role}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
        <FormMessage />
      </div>

      <div className="space-y-3">
        <FormLabel className="text-base font-medium">Current Operational Challenges *</FormLabel>
        <div className="grid grid-cols-1 gap-3">
          {[
            "Finding qualified staff", "Managing cash flow", "Scaling operations",
            "Time management", "Technology integration", "Quality control",
            "Customer retention", "Process efficiency", "Communication issues",
            "Remote work coordination", "Inventory management", "Other"
          ].map((challenge) => (
            <FormField
              key={challenge}
              control={form.control}
              name="operationalChallenges"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(challenge)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, challenge])
                          : field.onChange(field.value?.filter((value) => value !== challenge))
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    {challenge}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
        <FormMessage />
      </div>
    </div>
  );

  const renderMarketingSection = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <FormLabel className="text-base font-medium">Current Marketing Channels *</FormLabel>
        <div className="grid grid-cols-2 gap-3">
          {marketingChannelOptions.map((channel) => (
            <FormField
              key={channel}
              control={form.control}
              name="marketingChannels"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(channel)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, channel])
                          : field.onChange(field.value?.filter((value) => value !== channel))
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    {channel}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
        <FormMessage />
      </div>

      <FormField
        control={form.control}
        name="salesProcess"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current Sales Process *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe how you currently acquire and convert customers" 
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="customerAcquisitionCost"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Customer Acquisition Cost *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select CAC range" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="0-50">$0 - $50</SelectItem>
                <SelectItem value="50-200">$50 - $200</SelectItem>
                <SelectItem value="200-500">$200 - $500</SelectItem>
                <SelectItem value="500-1k">$500 - $1,000</SelectItem>
                <SelectItem value="1k+">$1,000+</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="customerLifetimeValue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Customer Lifetime Value *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select CLV range" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="0-500">$0 - $500</SelectItem>
                <SelectItem value="500-1k">$500 - $1,000</SelectItem>
                <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                <SelectItem value="10k+">$10,000+</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="conversionRates"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Conversion Rates *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select conversion rate" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="0-1">0-1%</SelectItem>
                <SelectItem value="1-3">1-3%</SelectItem>
                <SelectItem value="3-5">3-5%</SelectItem>
                <SelectItem value="5-10">5-10%</SelectItem>
                <SelectItem value="10+">10%+</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderStrategySection = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <FormLabel className="text-base font-medium">Primary Business Goals *</FormLabel>
        <div className="grid grid-cols-1 gap-3">
          {[
            "Increase revenue", "Acquire more customers", "Improve profit margins",
            "Expand market reach", "Launch new products/services", "Improve operational efficiency",
            "Build brand awareness", "Enhance customer satisfaction", "Scale team",
            "Enter new markets", "Improve cash flow", "Reduce costs", "Other"
          ].map((goal) => (
            <FormField
              key={goal}
              control={form.control}
              name="primaryGoals"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(goal)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, goal])
                          : field.onChange(field.value?.filter((value) => value !== goal))
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    {goal}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
        <FormMessage />
      </div>

      <FormField
        control={form.control}
        name="timeline"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Goal Achievement Timeline *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="3-months">Next 3 months</SelectItem>
                <SelectItem value="6-months">Next 6 months</SelectItem>
                <SelectItem value="1-year">Next 12 months</SelectItem>
                <SelectItem value="2-years">Next 2 years</SelectItem>
                <SelectItem value="3-years">Next 3+ years</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-3">
        <FormLabel className="text-base font-medium">Success Metrics *</FormLabel>
        <div className="grid grid-cols-2 gap-3">
          {[
            "Revenue growth", "Customer count", "Profit margins", "Market share",
            "Customer satisfaction", "Employee retention", "Brand awareness", "Conversion rates",
            "Customer lifetime value", "Cost reduction", "Process efficiency", "Other"
          ].map((metric) => (
            <FormField
              key={metric}
              control={form.control}
              name="successMetrics"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(metric)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, metric])
                          : field.onChange(field.value?.filter((value) => value !== metric))
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    {metric}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
        <FormMessage />
      </div>

      <FormField
        control={form.control}
        name="growthTargets"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Growth Targets *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="What specific growth targets do you want to achieve? (revenue, customers, market share, etc.)" 
                className="min-h-[80px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-3">
        <FormLabel className="text-base font-medium">Current Business Challenges *</FormLabel>
        <div className="grid grid-cols-1 gap-3">
          {[
            "Low conversion rates", "High customer acquisition cost", "Poor cash flow",
            "Limited market awareness", "Strong competition", "Scaling difficulties",
            "Team management", "Technology limitations", "Customer retention",
            "Product-market fit", "Pricing strategy", "Operations efficiency", "Other"
          ].map((challenge) => (
            <FormField
              key={challenge}
              control={form.control}
              name="businessChallenges"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(challenge)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, challenge])
                          : field.onChange(field.value?.filter((value) => value !== challenge))
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    {challenge}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
        <FormMessage />
      </div>

      <FormField
        control={form.control}
        name="riskTolerance"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Risk Tolerance *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select risk tolerance" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="conservative">Conservative - Prefer proven strategies</SelectItem>
                <SelectItem value="moderate">Moderate - Balance between safe and innovative</SelectItem>
                <SelectItem value="aggressive">Aggressive - Willing to take calculated risks</SelectItem>
                <SelectItem value="very-aggressive">Very Aggressive - Open to high-risk, high-reward</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="changeReadiness"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Change Readiness *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select change readiness" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="low">Low - Prefer gradual changes</SelectItem>
                <SelectItem value="medium">Medium - Open to moderate changes</SelectItem>
                <SelectItem value="high">High - Ready for significant transformation</SelectItem>
                <SelectItem value="very-high">Very High - Eager for complete overhaul</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="futureVision"
        render={({ field }) => (
          <FormItem>
            <FormLabel>3-Year Vision *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Where do you see your business in 3 years? What will success look like?" 
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Comprehensive Business Assessment
        </h1>
        <p className="text-gray-600 text-lg">
          Complete this detailed assessment to receive expert AI-powered business consulting recommendations
          tailored specifically to your business needs and growth objectives.
        </p>
      </div>

      {/* Progress Navigation */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {questionSections.map((section, index) => {
            const Icon = section.icon;
            const isCompleted = completedSections.has(index);
            const isCurrent = index === currentSection;
            
            return (
              <div key={section.id} className="flex items-center">
                <div 
                  className={`
                    flex items-center justify-center w-12 h-12 rounded-full border-2 
                    ${isCurrent ? 'border-blue-600 bg-blue-50' : ''}
                    ${isCompleted ? 'border-green-600 bg-green-50' : 'border-gray-300'}
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Icon className={`w-6 h-6 ${isCurrent ? 'text-blue-600' : 'text-gray-400'}`} />
                  )}
                </div>
                {index < questionSections.length - 1 && (
                  <div className="w-16 h-0.5 bg-gray-300 mx-2" />
                )}
              </div>
            );
          })}
        </div>
        
        <div className="text-center">
          <Badge variant="outline" className="text-sm">
            Section {currentSection + 1} of {questionSections.length}
          </Badge>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                {(() => {
                  const Icon = questionSections[currentSection].icon;
                  return <Icon className="w-6 h-6 text-blue-600" />;
                })()}
                <div>
                  <CardTitle>{questionSections[currentSection].title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {questionSections[currentSection].description}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {renderSectionContent()}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
            >
              Previous
            </Button>
            
            {currentSection < questionSections.length - 1 ? (
              <Button type="button" onClick={nextSection}>
                Next Section
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit">
                Generate Strategic Recommendations
                <TrendingUp className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}