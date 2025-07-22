import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Users, 
  Target, 
  MessageCircle, 
  Phone, 
  Mail, 
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface TrainingRequirements {
  // Business Context
  businessType: string;
  businessTypeOther: string;
  industry: string;
  industryOther: string;
  targetAudience: string;
  valueProposition: string;
  
  // Assistant Role & Responsibilities
  assistantRole: string;
  assistantRoleOther: string;
  primaryFunctions: string[];
  primaryFunctionsOther: string;
  communicationChannels: string[];
  communicationChannelsOther: string;
  
  // Training Focus Areas
  trainingGoals: string[];
  trainingGoalsOther: string;
  currentChallenges: string[];
  currentChallengesOther: string;
  skillLevels: {
    leadGeneration: string;
    customerService: string;
    salesConversion: string;
    businessConsulting: string;
    coaching: string;
    technicalSupport: string;
  };
  
  // Specific Scenarios Needed
  priorityScenarios: string[];
  priorityScenariosOther: string;
  difficultyLevels: string[];
  customerPersonas: string[];
  customerPersonasOther: string;
}

export function AITrainingSetup() {
  const [step, setStep] = useState(1);
  const [requirements, setRequirements] = useState<Partial<TrainingRequirements>>({
    businessType: '',
    businessTypeOther: '',
    industry: '',
    industryOther: '',
    assistantRole: '',
    assistantRoleOther: '',
    primaryFunctions: [],
    primaryFunctionsOther: '',
    communicationChannels: [],
    communicationChannelsOther: '',
    trainingGoals: [],
    trainingGoalsOther: '',
    currentChallenges: [],
    currentChallengesOther: '',
    priorityScenarios: [],
    priorityScenariosOther: '',
    difficultyLevels: [],
    customerPersonas: [],
    customerPersonasOther: '',
    skillLevels: {
      leadGeneration: 'beginner',
      customerService: 'beginner', 
      salesConversion: 'beginner',
      businessConsulting: 'beginner',
      coaching: 'beginner',
      technicalSupport: 'beginner'
    }
  });

  const updateRequirements = (field: string, value: any) => {
    setRequirements(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: string, value: string) => {
    const currentArray = requirements[field as keyof TrainingRequirements] as string[] || [];
    const updated = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateRequirements(field, updated);
  };

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Business Context & Industry
        </CardTitle>
        <CardDescription>
          Help me understand your business so I can create relevant training scenarios
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="businessType">What type of business do you run?</Label>
            <Select value={requirements.businessType || ''} onValueChange={(value) => updateRequirements('businessType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="digital_marketing_agency">Digital Marketing Agency</SelectItem>
                <SelectItem value="saas_company">SaaS Company</SelectItem>
                <SelectItem value="ecommerce">E-commerce Store</SelectItem>
                <SelectItem value="consulting">Consulting Firm</SelectItem>
                <SelectItem value="coaching">Coaching Business</SelectItem>
                <SelectItem value="real_estate">Real Estate</SelectItem>
                <SelectItem value="healthcare">Healthcare Services</SelectItem>
                <SelectItem value="education">Education/Training</SelectItem>
                <SelectItem value="finance">Financial Services</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="retail">Retail Business</SelectItem>
                <SelectItem value="food_beverage">Food & Beverage</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {requirements.businessType === 'other' && (
              <Input
                className="mt-2"
                placeholder="Please specify your business type"
                value={requirements.businessTypeOther || ''}
                onChange={(e) => updateRequirements('businessTypeOther', e.target.value)}
              />
            )}
          </div>
          <div>
            <Label htmlFor="industry">Industry/Vertical</Label>
            <Select value={requirements.industry || ''} onValueChange={(value) => updateRequirements('industry', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance & Banking</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="retail">Retail & E-commerce</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="real_estate">Real Estate</SelectItem>
                <SelectItem value="legal">Legal Services</SelectItem>
                <SelectItem value="marketing">Marketing & Advertising</SelectItem>
                <SelectItem value="hospitality">Hospitality & Tourism</SelectItem>
                <SelectItem value="transportation">Transportation & Logistics</SelectItem>
                <SelectItem value="nonprofit">Non-profit</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {requirements.industry === 'other' && (
              <Input
                className="mt-2"
                placeholder="Please specify your industry"
                value={requirements.industryOther || ''}
                onChange={(e) => updateRequirements('industryOther', e.target.value)}
              />
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="targetAudience">Who are your primary customers?</Label>
          <Textarea
            id="targetAudience"
            placeholder="Describe your target audience: demographics, pain points, decision-making process..."
            value={requirements.targetAudience || ''}
            onChange={(e) => updateRequirements('targetAudience', e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="valueProposition">What's your unique value proposition?</Label>
          <Textarea
            id="valueProposition"
            placeholder="What makes your business different? What specific benefits do you provide?"
            value={requirements.valueProposition || ''}
            onChange={(e) => updateRequirements('valueProposition', e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Assistant Role & Functions
        </CardTitle>
        <CardDescription>
          Define what your AI assistant will do and how it will interact with customers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="assistantRole">What is the primary role of your AI assistant?</Label>
          <Select value={requirements.assistantRole || ''} onValueChange={(value) => updateRequirements('assistantRole', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select assistant role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lead_qualifier">Lead Qualifier & Initial Contact</SelectItem>
              <SelectItem value="customer_service">Customer Service Representative</SelectItem>
              <SelectItem value="sales_assistant">Sales Assistant & Deal Closer</SelectItem>
              <SelectItem value="business_consultant">Business Consultant & Advisor</SelectItem>
              <SelectItem value="coach">Coach & Mentor</SelectItem>
              <SelectItem value="technical_support">Technical Support Specialist</SelectItem>
              <SelectItem value="multi_role">Multi-Role Assistant (All of the above)</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {requirements.assistantRole === 'other' && (
            <Input
              className="mt-2"
              placeholder="Please specify the assistant role"
              value={requirements.assistantRoleOther || ''}
              onChange={(e) => updateRequirements('assistantRoleOther', e.target.value)}
            />
          )}
        </div>

        <div>
          <Label>What functions should your assistant perform? (Select all that apply)</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {[
              'Qualify incoming leads',
              'Schedule appointments', 
              'Answer product questions',
              'Handle billing inquiries',
              'Process refunds/cancellations',
              'Provide technical support',
              'Cross-sell/upsell products',
              'Collect customer feedback',
              'Follow up on proposals',
              'Manage customer onboarding',
              'Provide business consultation',
              'Offer strategic advice',
              'Conduct coaching sessions',
              'Guide skill development',
              'Assess business needs',
              'Create action plans'
            ].map((func) => (
              <div key={func} className="flex items-center space-x-2">
                <Checkbox
                  id={func}
                  checked={requirements.primaryFunctions?.includes(func)}
                  onCheckedChange={() => toggleArrayField('primaryFunctions', func)}
                />
                <Label htmlFor={func} className="text-sm">{func}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Communication channels your assistant will use:</Label>
          <div className="flex flex-wrap gap-3 mt-2">
            {[
              { id: 'website_chat', label: 'Website Chat', icon: MessageCircle },
              { id: 'phone_calls', label: 'Phone Calls', icon: Phone },
              { id: 'email', label: 'Email', icon: Mail },
              { id: 'sms', label: 'SMS/Text', icon: MessageCircle },
              { id: 'social_media', label: 'Social Media', icon: Users },
              { id: 'video_calls', label: 'Video Calls', icon: MessageCircle },
              { id: 'live_chat', label: 'Live Chat Support', icon: MessageCircle }
            ].map(({ id, label, icon: Icon }) => (
              <div key={id} className="flex items-center space-x-2">
                <Checkbox
                  id={id}
                  checked={requirements.communicationChannels?.includes(id)}
                  onCheckedChange={() => toggleArrayField('communicationChannels', id)}
                />
                <Label htmlFor={id} className="flex items-center gap-1 text-sm">
                  <Icon className="h-4 w-4" />
                  {label}
                </Label>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="other_channels"
                checked={requirements.communicationChannels?.includes('other')}
                onCheckedChange={() => toggleArrayField('communicationChannels', 'other')}
              />
              <Label htmlFor="other_channels" className="text-sm">Other</Label>
            </div>
          </div>
          {requirements.communicationChannels?.includes('other') && (
            <Input
              className="mt-2"
              placeholder="Please specify other communication channels"
              value={requirements.communicationChannelsOther || ''}
              onChange={(e) => updateRequirements('communicationChannelsOther', e.target.value)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Training Goals & Current Challenges
        </CardTitle>
        <CardDescription>
          What specific skills do you want to improve and what challenges are you facing?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>What are your main training goals? (Select all that apply)</Label>
          <div className="grid grid-cols-1 gap-3 mt-2">
            {[
              'Improve lead qualification accuracy',
              'Increase conversion rates from leads to sales',
              'Reduce customer service response time',
              'Handle objections more effectively',
              'Better understand customer pain points',
              'Improve cross-selling and upselling',
              'Enhance empathy and emotional intelligence',
              'Master technical product knowledge',
              'Handle difficult/angry customers',
              'Streamline appointment scheduling',
              'Develop consulting and advisory skills',
              'Master coaching conversation techniques',
              'Improve strategic thinking abilities',
              'Enhance problem-solving capabilities',
              'Build trust and rapport with clients',
              'Guide effective goal-setting processes'
            ].map((goal) => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox
                  id={goal}
                  checked={requirements.trainingGoals?.includes(goal)}
                  onCheckedChange={() => toggleArrayField('trainingGoals', goal)}
                />
                <Label htmlFor={goal} className="text-sm">{goal}</Label>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="other_goals"
                checked={requirements.trainingGoals?.includes('other')}
                onCheckedChange={() => toggleArrayField('trainingGoals', 'other')}
              />
              <Label htmlFor="other_goals" className="text-sm">Other</Label>
            </div>
          </div>
          {requirements.trainingGoals?.includes('other') && (
            <Input
              className="mt-2"
              placeholder="Please specify other training goals"
              value={requirements.trainingGoalsOther || ''}
              onChange={(e) => updateRequirements('trainingGoalsOther', e.target.value)}
            />
          )}
        </div>

        <div>
          <Label>What challenges are you currently facing? (Select all that apply)</Label>
          <div className="grid grid-cols-1 gap-3 mt-2">
            {[
              'Low lead-to-customer conversion rates',
              'Inconsistent messaging across team',
              'Difficulty handling price objections',
              'Long response times to customer inquiries',
              'High customer churn/cancellation rates',
              'Lack of product knowledge among staff',
              'Poor follow-up on warm leads',
              'Difficulty qualifying serious prospects',
              'Struggling with complex technical questions',
              'Need better discovery/needs assessment'
            ].map((challenge) => (
              <div key={challenge} className="flex items-center space-x-2">
                <Checkbox
                  id={challenge}
                  checked={requirements.currentChallenges?.includes(challenge)}
                  onCheckedChange={() => toggleArrayField('currentChallenges', challenge)}
                />
                <Label htmlFor={challenge} className="text-sm">{challenge}</Label>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="other_challenges"
                checked={requirements.currentChallenges?.includes('other')}
                onCheckedChange={() => toggleArrayField('currentChallenges', 'other')}
              />
              <Label htmlFor="other_challenges" className="text-sm">Other</Label>
            </div>
          </div>
          {requirements.currentChallenges?.includes('other') && (
            <Input
              className="mt-2"
              placeholder="Please specify other challenges"
              value={requirements.currentChallengesOther || ''}
              onChange={(e) => updateRequirements('currentChallengesOther', e.target.value)}
            />
          )}
        </div>

        <div>
          <Label>Current skill levels in key areas:</Label>
          <div className="space-y-4 mt-3">
            {[
              { key: 'leadGeneration', label: 'Lead Generation & Qualification' },
              { key: 'customerService', label: 'Customer Service & Support' },
              { key: 'salesConversion', label: 'Sales Conversion & Closing' },
              { key: 'businessConsulting', label: 'Business Consulting & Advisory' },
              { key: 'coaching', label: 'Coaching & Mentoring' },
              { key: 'technicalSupport', label: 'Technical Support & Knowledge' }
            ].map(({ key, label }) => (
              <div key={key}>
                <Label className="text-sm font-medium">{label}</Label>
                <RadioGroup 
                  value={requirements.skillLevels?.[key as keyof typeof requirements.skillLevels] || 'beginner'} 
                  onValueChange={(value) => updateRequirements('skillLevels', { 
                    ...requirements.skillLevels, 
                    [key]: value 
                  })}
                  className="flex gap-6 mt-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id={`${key}_beginner`} />
                    <Label htmlFor={`${key}_beginner`} className="text-sm">Beginner</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id={`${key}_intermediate`} />
                    <Label htmlFor={`${key}_intermediate`} className="text-sm">Intermediate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id={`${key}_advanced`} />
                    <Label htmlFor={`${key}_advanced`} className="text-sm">Advanced</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expert" id={`${key}_expert`} />
                    <Label htmlFor={`${key}_expert`} className="text-sm">Expert</Label>
                  </div>
                </RadioGroup>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Scenario Preferences & Training Plan
        </CardTitle>
        <CardDescription>
          Let's create a customized training plan based on your specific needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>What types of scenarios do you want to prioritize?</Label>
          <div className="grid grid-cols-1 gap-3 mt-2">
            {[
              'Cold lead qualification calls',
              'Warm lead follow-up conversations', 
              'Product demo and presentation',
              'Handling price/budget objections',
              'Technical support and troubleshooting',
              'Billing and account management',
              'Upselling to existing customers',
              'Handling cancellation requests',
              'Angry/frustrated customer situations',
              'Complex enterprise sales scenarios',
              'Business strategy consultation sessions',
              'Goal-setting and planning conversations',
              'Performance coaching discussions',
              'Problem-solving advisory meetings',
              'Skills development coaching',
              'Stakeholder consultation scenarios'
            ].map((scenario) => (
              <div key={scenario} className="flex items-center space-x-2">
                <Checkbox
                  id={scenario}
                  checked={requirements.priorityScenarios?.includes(scenario)}
                  onCheckedChange={() => toggleArrayField('priorityScenarios', scenario)}
                />
                <Label htmlFor={scenario} className="text-sm">{scenario}</Label>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="other_scenarios"
                checked={requirements.priorityScenarios?.includes('other')}
                onCheckedChange={() => toggleArrayField('priorityScenarios', 'other')}
              />
              <Label htmlFor="other_scenarios" className="text-sm">Other</Label>
            </div>
          </div>
          {requirements.priorityScenarios?.includes('other') && (
            <Input
              className="mt-2"
              placeholder="Please specify other priority scenarios"
              value={requirements.priorityScenariosOther || ''}
              onChange={(e) => updateRequirements('priorityScenariosOther', e.target.value)}
            />
          )}
        </div>

        <div>
          <Label>What difficulty levels should we include?</Label>
          <div className="flex gap-4 mt-2">
            {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox
                  id={level}
                  checked={requirements.difficultyLevels?.includes(level)}
                  onCheckedChange={() => toggleArrayField('difficultyLevels', level)}
                />
                <Label htmlFor={level} className="text-sm">{level}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Customer personas you typically deal with:</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {[
              'Budget-conscious small business owner',
              'Enterprise decision maker',
              'Technical/IT professional', 
              'Marketing manager/director',
              'Startup founder',
              'Conservative/risk-averse buyer',
              'Quick decision maker',
              'Analytical/data-driven buyer',
              'Relationship-focused buyer',
              'Price-sensitive consumer',
              'Executive seeking strategic guidance',
              'Entrepreneur needing business advice',
              'Team leader requiring coaching',
              'Professional seeking skill development',
              'Manager facing performance challenges',
              'Business owner planning growth'
            ].map((persona) => (
              <div key={persona} className="flex items-center space-x-2">
                <Checkbox
                  id={persona}
                  checked={requirements.customerPersonas?.includes(persona)}
                  onCheckedChange={() => toggleArrayField('customerPersonas', persona)}
                />
                <Label htmlFor={persona} className="text-sm">{persona}</Label>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="other_personas"
                checked={requirements.customerPersonas?.includes('other')}
                onCheckedChange={() => toggleArrayField('customerPersonas', 'other')}
              />
              <Label htmlFor="other_personas" className="text-sm">Other</Label>
            </div>
          </div>
          {requirements.customerPersonas?.includes('other') && (
            <Input
              className="mt-2"
              placeholder="Please specify other customer personas"
              value={requirements.customerPersonasOther || ''}
              onChange={(e) => updateRequirements('customerPersonasOther', e.target.value)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderSummary = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Training Plan Summary
        </CardTitle>
        <CardDescription>
          Review your customized AI training plan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Business Context</h4>
            <div className="space-y-1 text-sm">
              <p><strong>Type:</strong> {requirements.businessType === 'other' ? requirements.businessTypeOther : requirements.businessType?.replace('_', ' ')}</p>
              <p><strong>Industry:</strong> {requirements.industry === 'other' ? requirements.industryOther : requirements.industry?.replace('_', ' ')}</p>
              <p><strong>Assistant Role:</strong> {requirements.assistantRole === 'other' ? requirements.assistantRoleOther : requirements.assistantRole?.replace('_', ' ')}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Key Functions</h4>
            <div className="flex flex-wrap gap-1">
              {requirements.primaryFunctions?.slice(0, 4).map((func) => (
                <Badge key={func} variant="secondary" className="text-xs">{func}</Badge>
              ))}
              {(requirements.primaryFunctions?.length || 0) > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{(requirements.primaryFunctions?.length || 0) - 4} more
                </Badge>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Training Goals</h4>
            <div className="flex flex-wrap gap-1">
              {requirements.trainingGoals?.slice(0, 3).map((goal) => (
                <Badge key={goal} variant="secondary" className="text-xs">{goal}</Badge>
              ))}
              {(requirements.trainingGoals?.length || 0) > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{(requirements.trainingGoals?.length || 0) - 3} more
                </Badge>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Priority Scenarios</h4>
            <div className="flex flex-wrap gap-1">
              {requirements.priorityScenarios?.slice(0, 3).map((scenario) => (
                <Badge key={scenario} variant="secondary" className="text-xs">{scenario}</Badge>
              ))}
              {(requirements.priorityScenarios?.length || 0) > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{(requirements.priorityScenarios?.length || 0) - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">Next Steps</h4>
              <p className="text-blue-800 text-sm mt-1">
                Based on your requirements, I'll create {requirements.priorityScenarios?.length || 3} 
                custom training scenarios targeting your biggest challenges: lead qualification, 
                objection handling, and customer retention. Each scenario will include realistic 
                customer personas, specific objectives, and success criteria.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Assistant Training Setup
          </h1>
          <p className="text-gray-600">
            Let's create a customized training plan for your AI assistant
          </p>
          
          {/* Progress Steps */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4, 5].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepNum <= step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 5 && (
                    <div className={`w-8 h-1 ${
                      stepNum < step ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderSummary()}

        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            Previous
          </Button>
          
          {step < 5 ? (
            <Button 
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && (!requirements.businessType || !requirements.industry)) ||
                (step === 2 && !requirements.assistantRole) ||
                (step === 3 && (!requirements.trainingGoals?.length || !requirements.currentChallenges?.length)) ||
                (step === 4 && !requirements.priorityScenarios?.length)
              }
            >
              Next Step
            </Button>
          ) : (
            <Button onClick={() => {
              // Generate training scenarios based on requirements
              console.log('Generating training scenarios with requirements:', requirements);
              // Navigate to AI training dashboard
            }}>
              Generate Training Scenarios
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}