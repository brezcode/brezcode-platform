import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Brain, Target, TrendingUp, Zap, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface OnboardingQuestion {
  id: string;
  questionText: string;
  questionType: "single_choice" | "multiple_choice" | "text" | "number";
  options?: string[];
  category: string;
  order: number;
  required: boolean;
}

interface BusinessProfile {
  id: string;
  businessName: string;
  industry: string;
  businessType: string;
  targetAudience: string;
  currentRevenue?: string;
  teamSize?: number;
  goals: string[];
  currentChallenges: string[];
}

interface BusinessStrategy {
  id: string;
  strategyTitle: string;
  description: string;
  category: string;
  priority: "high" | "medium" | "low";
  estimatedImpact: string;
  timeToImplement: string;
  actionPlan: Array<{
    step: string;
    description: string;
    timeline: string;
    automatable: boolean;
  }>;
}

export default function BusinessOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [strategies, setStrategies] = useState<BusinessStrategy[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch onboarding questions
  const { data: questions = [], isLoading: questionsLoading } = useQuery({
    queryKey: ['/api/business/onboarding-questions'],
  });

  // Submit responses and get business profile + strategies
  const submitResponsesMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/business/complete-onboarding', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: (data) => {
      setBusinessProfile(data.profile);
      setStrategies(data.strategies);
      setIsComplete(true);
      toast({
        title: "Business Analysis Complete!",
        description: "Your personalized strategies are ready.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to analyze your business. Please try again.",
        variant: "destructive",
      });
    },
  });

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleResponse = (value: any) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Submit all responses
      submitResponsesMutation.mutate({
        responses: Object.entries(responses).map(([questionId, response]) => ({
          questionId,
          response
        }))
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    if (!currentQuestion) return false;
    if (!currentQuestion.required) return true;
    return responses[currentQuestion.id] !== undefined && responses[currentQuestion.id] !== '';
  };

  if (questionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Preparing your business assessment...</p>
        </div>
      </div>
    );
  }

  if (isComplete && businessProfile && strategies.length > 0) {
    return <BusinessStrategiesView profile={businessProfile} strategies={strategies} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Business Intelligence Assessment
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Let our AI analyze your business and create a personalized growth strategy
          </p>
          <div className="mb-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-500 mt-2">
              Question {currentStep + 1} of {questions.length}
            </p>
          </div>
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline" className="capitalize">
                  {currentQuestion.category.replace('_', ' ')}
                </Badge>
                {currentQuestion.required && (
                  <Badge variant="destructive" className="text-xs">Required</Badge>
                )}
              </div>
              <CardTitle className="text-xl">
                {currentQuestion.questionText}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <QuestionInput
                question={currentQuestion}
                value={responses[currentQuestion.id]}
                onChange={handleResponse}
              />
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button
            onClick={nextStep}
            disabled={!canProceed() || submitResponsesMutation.isPending}
            className="min-w-24"
          >
            {submitResponsesMutation.isPending ? (
              "Analyzing..."
            ) : currentStep === questions.length - 1 ? (
              "Complete Analysis"
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Question input component
function QuestionInput({ 
  question, 
  value, 
  onChange 
}: { 
  question: OnboardingQuestion;
  value: any;
  onChange: (value: any) => void;
}) {
  if (question.questionType === "text") {
    return (
      <Textarea
        placeholder="Enter your answer..."
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-24"
      />
    );
  }

  if (question.questionType === "number") {
    return (
      <Input
        type="number"
        placeholder="Enter a number..."
        value={value || ''}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    );
  }

  if (question.questionType === "single_choice") {
    return (
      <RadioGroup
        value={value || ''}
        onValueChange={onChange}
        className="space-y-3"
      >
        {question.options?.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={option} />
            <Label htmlFor={option} className="cursor-pointer flex-1">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    );
  }

  if (question.questionType === "multiple_choice") {
    const selectedValues = value || [];
    
    return (
      <div className="space-y-3">
        {question.options?.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={option}
              checked={selectedValues.includes(option)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onChange([...selectedValues, option]);
                } else {
                  onChange(selectedValues.filter((v: string) => v !== option));
                }
              }}
            />
            <Label htmlFor={option} className="cursor-pointer flex-1">
              {option}
            </Label>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

// Business strategies display component
function BusinessStrategiesView({ 
  profile, 
  strategies 
}: { 
  profile: BusinessProfile;
  strategies: BusinessStrategy[];
}) {
  const [selectedStrategy, setSelectedStrategy] = useState<BusinessStrategy | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'marketing': return <Target className="w-5 h-5" />;
      case 'sales': return <TrendingUp className="w-5 h-5" />;
      case 'operations': return <Zap className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Success Header */}
        <div className="text-center mb-12">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Business Strategy is Ready!
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            AI-powered analysis for <span className="font-semibold text-blue-600">{profile.businessName}</span>
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline">{profile.industry}</Badge>
            <Badge variant="outline">{profile.businessType}</Badge>
            <Badge variant="outline">{strategies.length} Strategies</Badge>
          </div>
        </div>

        {/* Strategies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {strategies.map((strategy) => (
            <Card 
              key={strategy.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => setSelectedStrategy(strategy)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(strategy.category)}
                    <Badge variant="outline" className="capitalize">
                      {strategy.category}
                    </Badge>
                  </div>
                  <Badge className={getPriorityColor(strategy.priority)}>
                    {strategy.priority}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight">
                  {strategy.strategyTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {strategy.description}
                </p>
                <div className="space-y-2 text-xs text-gray-500">
                  <div><strong>Impact:</strong> {strategy.estimatedImpact}</div>
                  <div><strong>Timeline:</strong> {strategy.timeToImplement}</div>
                  <div>
                    <strong>Actions:</strong> {strategy.actionPlan.length} steps
                    <span className="text-green-600 ml-1">
                      ({strategy.actionPlan.filter(step => step.automatable).length} automated)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="inline-block p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Execute Your Strategy?</h3>
            <p className="mb-6 max-w-md">
              Our AI platform can automatically execute many of these strategies for you. 
              Let's get started with implementation!
            </p>
            <div className="space-x-4">
              <Button size="lg" variant="secondary">
                Start Implementation
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                Schedule Consultation
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Strategy Detail Modal would go here */}
    </div>
  );
}