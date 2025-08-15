import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Bot, ArrowRight, ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface QuizData {
  businessType: string;
  primaryUseCase: string;
  targetAudience: string;
  communicationStyle: string;
  expertise: string[];
  languages: string[];
  personalityTraits: string[];
  restrictions: string[];
  customInstructions: string;
}

const BUSINESS_TYPES = [
  { value: 'ecommerce', label: 'E-commerce', description: 'Online retail and shopping' },
  { value: 'healthcare', label: 'Healthcare', description: 'Medical services and patient care' },
  { value: 'education', label: 'Education', description: 'Learning and training platforms' },
  { value: 'finance', label: 'Finance', description: 'Banking and financial services' },
  { value: 'real_estate', label: 'Real Estate', description: 'Property sales and management' },
  { value: 'consulting', label: 'Consulting', description: 'Professional advisory services' },
  { value: 'technology', label: 'Technology', description: 'Software and tech support' },
  { value: 'other', label: 'Other', description: 'Custom business type' },
];

const USE_CASES = [
  { value: 'customer_service', label: 'Customer Service', description: 'Handle inquiries and support tickets' },
  { value: 'sales', label: 'Sales', description: 'Lead generation and product demos' },
  { value: 'coaching', label: 'Coaching', description: 'Personal development and guidance' },
  { value: 'consultation', label: 'Consultation', description: 'Professional advice and recommendations' },
  { value: 'support', label: 'Technical Support', description: 'Troubleshooting and problem-solving' },
  { value: 'training', label: 'Training', description: 'Educational content delivery' },
  { value: 'marketing', label: 'Marketing', description: 'Brand engagement and promotion' },
];

const TARGET_AUDIENCES = [
  { value: 'general_consumers', label: 'General Consumers', description: 'Everyday customers and users' },
  { value: 'business_professionals', label: 'Business Professionals', description: 'Corporate clients and executives' },
  { value: 'students', label: 'Students', description: 'Educational learners' },
  { value: 'elderly', label: 'Elderly', description: 'Senior citizens requiring special care' },
  { value: 'children', label: 'Children', description: 'Young users and families' },
  { value: 'healthcare_patients', label: 'Healthcare Patients', description: 'Medical patients and caregivers' },
  { value: 'specific_niche', label: 'Specific Niche', description: 'Specialized target group' },
];

const COMMUNICATION_STYLES = [
  { value: 'formal_professional', label: 'Formal & Professional', description: 'Business-like and authoritative' },
  { value: 'casual_friendly', label: 'Casual & Friendly', description: 'Relaxed and approachable' },
  { value: 'warm_empathetic', label: 'Warm & Empathetic', description: 'Caring and understanding' },
  { value: 'energetic_enthusiastic', label: 'Energetic & Enthusiastic', description: 'Upbeat and motivating' },
  { value: 'calm_reassuring', label: 'Calm & Reassuring', description: 'Peaceful and comforting' },
  { value: 'expert_authoritative', label: 'Expert & Authoritative', description: 'Knowledgeable and confident' },
];

const EXPERTISE_OPTIONS = [
  'Customer Support', 'Sales & Marketing', 'Healthcare', 'Education', 'Finance',
  'Technology', 'Real Estate', 'Legal', 'HR & Recruitment', 'Travel & Tourism',
  'Food & Beverage', 'Fashion & Beauty', 'Fitness & Wellness', 'Entertainment',
  'Home Services', 'Automotive', 'Insurance', 'Non-profit', 'Government Services'
];

const LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'it', name: 'Italian' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
];

const PERSONALITY_TRAITS = [
  'helpful', 'patient', 'knowledgeable', 'friendly', 'professional',
  'empathetic', 'enthusiastic', 'calm', 'confident', 'supportive'
];

export default function AvatarQuiz() {
  const [currentStep, setCurrentStep] = useState(1);
  const [quizData, setQuizData] = useState<QuizData>({
    businessType: '',
    primaryUseCase: '',
    targetAudience: '',
    communicationStyle: '',
    expertise: [],
    languages: ['en'],
    personalityTraits: [],
    restrictions: [],
    customInstructions: '',
  });

  const { toast } = useToast();
  const totalSteps = 8;
  const progress = (currentStep / totalSteps) * 100;

  const submitQuizMutation = useMutation({
    mutationFn: async (data: QuizData) => {
      return apiRequest('/api/avatar/requirements', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: "Your AI avatar requirements have been saved and prompt generated.",
      });
      // Navigate to avatar setup page
      window.location.href = '/avatar-setup';
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save avatar requirements",
        variant: "destructive",
      });
    },
  });

  const updateQuizData = (field: string, value: any) => {
    setQuizData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayValue = (field: string, value: string) => {
    setQuizData(prev => ({
      ...prev,
      [field]: (prev[field as keyof QuizData] as string[]).includes(value)
        ? (prev[field as keyof QuizData] as string[]).filter(v => v !== value)
        : [...(prev[field as keyof QuizData] as string[]), value]
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      submitQuizMutation.mutate(quizData);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return quizData.businessType;
      case 2: return quizData.primaryUseCase;
      case 3: return quizData.targetAudience;
      case 4: return quizData.communicationStyle;
      case 5: return quizData.expertise.length > 0;
      case 6: return quizData.languages.length > 0;
      case 7: return quizData.personalityTraits.length > 0;
      case 8: return true; // Optional step
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">What type of business do you have?</h2>
              <p className="text-gray-600">This helps us understand your industry and context.</p>
            </div>
            <RadioGroup
              value={quizData.businessType}
              onValueChange={(value) => updateQuizData('businessType', value)}
              className="grid md:grid-cols-2 gap-4"
            >
              {BUSINESS_TYPES.map((type) => (
                <div key={type.value} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={type.value} id={type.value} />
                  <div className="flex-1">
                    <Label htmlFor={type.value} className="font-medium">{type.label}</Label>
                    <p className="text-sm text-gray-500">{type.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">What's the primary use case for your AI avatar?</h2>
              <p className="text-gray-600">Choose the main function your avatar will perform.</p>
            </div>
            <RadioGroup
              value={quizData.primaryUseCase}
              onValueChange={(value) => updateQuizData('primaryUseCase', value)}
              className="grid md:grid-cols-2 gap-4"
            >
              {USE_CASES.map((useCase) => (
                <div key={useCase.value} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={useCase.value} id={useCase.value} />
                  <div className="flex-1">
                    <Label htmlFor={useCase.value} className="font-medium">{useCase.label}</Label>
                    <p className="text-sm text-gray-500">{useCase.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Who is your target audience?</h2>
              <p className="text-gray-600">Understanding your audience helps tailor the avatar's approach.</p>
            </div>
            <RadioGroup
              value={quizData.targetAudience}
              onValueChange={(value) => updateQuizData('targetAudience', value)}
              className="grid md:grid-cols-2 gap-4"
            >
              {TARGET_AUDIENCES.map((audience) => (
                <div key={audience.value} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={audience.value} id={audience.value} />
                  <div className="flex-1">
                    <Label htmlFor={audience.value} className="font-medium">{audience.label}</Label>
                    <p className="text-sm text-gray-500">{audience.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">What communication style should your avatar have?</h2>
              <p className="text-gray-600">The tone and manner of communication with customers.</p>
            </div>
            <RadioGroup
              value={quizData.communicationStyle}
              onValueChange={(value) => updateQuizData('communicationStyle', value)}
              className="space-y-4"
            >
              {COMMUNICATION_STYLES.map((style) => (
                <div key={style.value} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={style.value} id={style.value} />
                  <div className="flex-1">
                    <Label htmlFor={style.value} className="font-medium">{style.label}</Label>
                    <p className="text-sm text-gray-500">{style.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">What areas of expertise should your avatar have?</h2>
              <p className="text-gray-600">Select all areas where your avatar should be knowledgeable.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {EXPERTISE_OPTIONS.map((expertise) => (
                <div key={expertise} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id={expertise}
                    checked={quizData.expertise.includes(expertise)}
                    onCheckedChange={() => toggleArrayValue('expertise', expertise)}
                  />
                  <Label htmlFor={expertise} className="text-sm">{expertise}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Which languages should your avatar support?</h2>
              <p className="text-gray-600">Your avatar can communicate in multiple languages.</p>
            </div>
            <div className="grid md:grid-cols-4 gap-3">
              {LANGUAGE_OPTIONS.map((language) => (
                <div key={language.code} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id={language.code}
                    checked={quizData.languages.includes(language.code)}
                    onCheckedChange={() => toggleArrayValue('languages', language.code)}
                  />
                  <Label htmlFor={language.code} className="text-sm">{language.name}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">What personality traits should your avatar have?</h2>
              <p className="text-gray-600">Select traits that best represent your brand personality.</p>
            </div>
            <div className="grid md:grid-cols-5 gap-3">
              {PERSONALITY_TRAITS.map((trait) => (
                <div key={trait} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id={trait}
                    checked={quizData.personalityTraits.includes(trait)}
                    onCheckedChange={() => toggleArrayValue('personalityTraits', trait)}
                  />
                  <Label htmlFor={trait} className="text-sm capitalize">{trait}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Any restrictions or custom instructions?</h2>
              <p className="text-gray-600">Optional: Add specific guidelines or restrictions for your avatar.</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="restrictions">Restrictions (things your avatar should NOT do)</Label>
                <Textarea
                  id="restrictions"
                  placeholder="e.g., Don't provide medical advice, Don't discuss pricing without verification..."
                  value={quizData.restrictions.join('\n')}
                  onChange={(e) => updateQuizData('restrictions', e.target.value.split('\n').filter(Boolean))}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="custom">Custom Instructions</Label>
                <Textarea
                  id="custom"
                  placeholder="Any specific behavior, phrases, or guidelines you want your avatar to follow..."
                  value={quizData.customInstructions}
                  onChange={(e) => updateQuizData('customInstructions', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Bot className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">AI Avatar Setup Wizard</h1>
          </div>
          <p className="text-lg text-gray-600">
            Let's create the perfect AI avatar for your business
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={prevStep}
            disabled={currentStep === 1}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          <Button
            onClick={nextStep}
            disabled={!canProceed() || submitQuizMutation.isPending}
            className="flex items-center gap-2"
          >
            {currentStep === totalSteps ? (
              submitQuizMutation.isPending ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  Generating Avatar...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Create Avatar
                </>
              )
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Summary */}
        {currentStep > 1 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Configuration Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quizData.businessType && (
                <div className="flex gap-2">
                  <Badge variant="outline">Business: {BUSINESS_TYPES.find(t => t.value === quizData.businessType)?.label}</Badge>
                </div>
              )}
              {quizData.primaryUseCase && (
                <div className="flex gap-2">
                  <Badge variant="outline">Use Case: {USE_CASES.find(u => u.value === quizData.primaryUseCase)?.label}</Badge>
                </div>
              )}
              {quizData.expertise.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {quizData.expertise.slice(0, 3).map(exp => (
                    <Badge key={exp} variant="secondary" className="text-xs">{exp}</Badge>
                  ))}
                  {quizData.expertise.length > 3 && (
                    <Badge variant="secondary" className="text-xs">+{quizData.expertise.length - 3} more</Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}