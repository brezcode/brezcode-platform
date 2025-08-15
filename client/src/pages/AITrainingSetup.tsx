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
  // Assistant Role & Responsibilities
  assistantRole: string;
  assistantRoleOther: string;
  
  // Training Focus Areas
  trainingGoals: string[];
  trainingGoalsOther: string;
  currentChallenges: string[];
  currentChallengesOther: string;
  skillLevel: string;
  
  // Specific Scenarios Needed
  priorityScenarios: string[];
  priorityScenariosOther: string;
  difficultyLevels: string[];
}

export function AITrainingSetup() {
  const [step, setStep] = useState(1);
  const [requirements, setRequirements] = useState<Partial<TrainingRequirements>>({
    assistantRole: '',
    assistantRoleOther: '',
    trainingGoals: [],
    trainingGoalsOther: '',
    currentChallenges: [],
    currentChallengesOther: '',
    priorityScenarios: [],
    priorityScenariosOther: '',
    difficultyLevels: [],
    skillLevel: 'beginner'
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
          <Brain className="h-5 w-5" />
          AI Assistant Role Selection
        </CardTitle>
        <CardDescription>
          What type of AI assistant do you want to train for your business?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="assistantRole">Select the primary role for your AI assistant:</Label>
          <Select value={requirements.assistantRole || ''} onValueChange={(value) => updateRequirements('assistantRole', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Choose assistant role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales_representative">Sales Representative</SelectItem>
              <SelectItem value="customer_service">Customer Service Agent</SelectItem>
              <SelectItem value="technical_specialist">Technical Specialist</SelectItem>
              <SelectItem value="engineer">Engineer/Technical Expert</SelectItem>
              <SelectItem value="consultant">Business Consultant</SelectItem>
              <SelectItem value="expert">Subject Matter Expert</SelectItem>
              <SelectItem value="coach">Coach & Mentor</SelectItem>
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

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Role Descriptions:</h4>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>Sales Representative:</strong> Focuses on lead qualification, product demos, handling objections, and closing deals</p>
            <p><strong>Customer Service:</strong> Handles support inquiries, troubleshooting, billing questions, and customer satisfaction</p>
            <p><strong>Technical Specialist:</strong> Provides technical support, product knowledge, and complex problem-solving</p>
            <p><strong>Engineer:</strong> Deep technical expertise, system architecture, and engineering consultation</p>
            <p><strong>Consultant:</strong> Strategic advice, business analysis, and professional recommendations</p>
            <p><strong>Expert:</strong> Specialized knowledge in your field, industry insights, and expert guidance</p>
            <p><strong>Coach:</strong> Personal development, skill building, and mentoring conversations</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Current Skill Level Assessment
        </CardTitle>
        <CardDescription>
          What's your current skill level in this role so I can create appropriate training?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Current skill level for {requirements.assistantRole === 'other' ? requirements.assistantRoleOther : requirements.assistantRole?.replace('_', ' ')} role:</Label>
          <Select value={requirements.skillLevel || 'beginner'} onValueChange={(value) => updateRequirements('skillLevel', value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select skill level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner - New to this role</SelectItem>
              <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
              <SelectItem value="advanced">Advanced - Experienced practitioner</SelectItem>
              <SelectItem value="expert">Expert - Highly skilled professional</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">Skill Level Guide:</h4>
          <div className="text-sm text-green-800 space-y-2">
            <p><strong>Beginner:</strong> Just starting out, need basic training and simple scenarios</p>
            <p><strong>Intermediate:</strong> Some experience, ready for moderate complexity and real-world challenges</p>
            <p><strong>Advanced:</strong> Experienced professional, need complex scenarios and edge cases</p>
            <p><strong>Expert:</strong> Highly skilled, need advanced techniques and leadership scenarios</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Training Goals & Challenges
        </CardTitle>
        <CardDescription>
          What specific skills do you want to improve in your {requirements.assistantRole?.replace('_', ' ')} role?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>What are your main training goals? (Select all that apply)</Label>
          <div className="grid grid-cols-1 gap-3 mt-2">
            {getTrainingGoalsForRole(requirements.assistantRole || '').map((goal) => (
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
            {getChallengesForRole(requirements.assistantRole || '').map((challenge) => (
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
      </CardContent>
    </Card>
  );

  // Helper functions for role-specific content
  const getTrainingGoalsForRole = (role: string) => {
    const commonGoals = [
      'Improve communication skills',
      'Handle difficult situations better',
      'Build trust and rapport with clients',
      'Enhance problem-solving abilities'
    ];

    switch (role) {
      case 'sales_representative':
        return [
          'Improve lead qualification accuracy',
          'Increase conversion rates',
          'Handle objections more effectively',
          'Master closing techniques',
          'Better understand customer pain points',
          'Improve cross-selling and upselling',
          ...commonGoals
        ];
      case 'customer_service':
        return [
          'Reduce response times',
          'Handle angry customers professionally',
          'Improve first-call resolution rates',
          'Master de-escalation techniques',
          'Enhance empathy and emotional intelligence',
          'Streamline process efficiency',
          ...commonGoals
        ];
      case 'technical_specialist':
        return [
          'Master technical product knowledge',
          'Improve troubleshooting skills',
          'Explain complex concepts simply',
          'Enhance diagnostic abilities',
          'Better technical documentation',
          'Improve system integration knowledge',
          ...commonGoals
        ];
      case 'consultant':
        return [
          'Develop strategic thinking abilities',
          'Master needs assessment techniques',
          'Improve analytical and advisory skills',
          'Enhance business acumen',
          'Better stakeholder management',
          'Guide effective goal-setting processes',
          ...commonGoals
        ];
      case 'coach':
        return [
          'Master coaching conversation techniques',
          'Improve active listening skills',
          'Enhance motivational abilities',
          'Better goal-setting facilitation',
          'Develop feedback delivery skills',
          'Guide skill development effectively',
          ...commonGoals
        ];
      default:
        return [
          'Improve professional skills',
          'Enhance subject matter expertise',
          'Better client interaction',
          'Improve knowledge delivery',
          ...commonGoals
        ];
    }
  };

  const getChallengesForRole = (role: string) => {
    const commonChallenges = [
      'Inconsistent performance',
      'Difficulty with complex situations',
      'Need better communication skills',
      'Time management issues'
    ];

    switch (role) {
      case 'sales_representative':
        return [
          'Low lead-to-customer conversion rates',
          'Difficulty handling price objections',
          'Poor follow-up on warm leads',
          'Struggling with discovery questions',
          'Need better closing techniques',
          'Difficulty qualifying serious prospects',
          ...commonChallenges
        ];
      case 'customer_service':
        return [
          'Long response times to inquiries',
          'High customer churn rates',
          'Difficulty with angry customers',
          'Inconsistent service quality',
          'Poor first-call resolution',
          'Need better de-escalation skills',
          ...commonChallenges
        ];
      case 'technical_specialist':
        return [
          'Struggling with complex technical questions',
          'Difficulty explaining technical concepts',
          'Incomplete product knowledge',
          'Poor diagnostic procedures',
          'Integration challenges',
          'Documentation gaps',
          ...commonChallenges
        ];
      case 'consultant':
        return [
          'Need better strategic thinking',
          'Difficulty with needs assessment',
          'Poor stakeholder management',
          'Inconsistent recommendations',
          'Analytical skill gaps',
          'Challenge with change management',
          ...commonChallenges
        ];
      case 'coach':
        return [
          'Difficulty with coaching conversations',
          'Poor active listening skills',
          'Struggling with motivation techniques',
          'Ineffective feedback delivery',
          'Goal-setting challenges',
          'Building trust issues',
          ...commonChallenges
        ];
      default:
        return [
          'General skill development needs',
          'Professional growth challenges',
          'Client interaction difficulties',
          'Knowledge gaps in field',
          ...commonChallenges
        ];
    }
  };

  const getScenariosForRole = (role: string) => {
    switch (role) {
      case 'sales_representative':
        return [
          'Cold lead qualification calls',
          'Warm lead follow-up conversations',
          'Product demo and presentation',
          'Handling price/budget objections',
          'Closing deals and negotiations',
          'Upselling to existing customers'
        ];
      case 'customer_service':
        return [
          'Handling billing inquiries',
          'Processing refunds/cancellations',
          'Angry/frustrated customer situations',
          'Technical support requests',
          'Account management questions',
          'Service escalation scenarios'
        ];
      case 'technical_specialist':
        return [
          'Complex technical troubleshooting',
          'System integration support',
          'Product configuration assistance',
          'Technical documentation review',
          'Engineering consultation calls',
          'Advanced diagnostic scenarios'
        ];
      case 'consultant':
        return [
          'Business strategy consultation sessions',
          'Needs assessment meetings',
          'Stakeholder consultation scenarios',
          'Change management discussions',
          'Performance improvement planning',
          'Strategic planning workshops'
        ];
      case 'coach':
        return [
          'Goal-setting and planning conversations',
          'Performance coaching discussions',
          'Skills development coaching',
          'Motivational coaching sessions',
          'Feedback delivery scenarios',
          'Career development mentoring'
        ];
      default:
        return [
          'Professional consultation sessions',
          'Expert advice scenarios',
          'Knowledge sharing meetings',
          'Problem-solving discussions',
          'Client advisory calls',
          'Specialized expertise scenarios'
        ];
    }
  };

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
            {getScenariosForRole(requirements.assistantRole || '').map((scenario) => (
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
            <h4 className="font-semibold mb-2">AI Assistant Configuration</h4>
            <div className="space-y-1 text-sm">
              <p><strong>Role:</strong> {requirements.assistantRole === 'other' ? requirements.assistantRoleOther : requirements.assistantRole?.replace('_', ' ')}</p>
              <p><strong>Skill Level:</strong> {requirements.skillLevel || 'Not specified'}</p>
              <p><strong>Difficulty Levels:</strong> {requirements.difficultyLevels?.join(', ') || 'Not specified'}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Current Challenges</h4>
            <div className="flex flex-wrap gap-1">
              {requirements.currentChallenges?.slice(0, 3).map((challenge) => (
                <Badge key={challenge} variant="secondary" className="text-xs">{challenge}</Badge>
              ))}
              {(requirements.currentChallenges?.length || 0) > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{(requirements.currentChallenges?.length || 0) - 3} more
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
              {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepNum <= step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 4 && (
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
        {step === 4 && renderSummary()}

        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            Previous
          </Button>
          
          {step < 4 ? (
            <Button 
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !requirements.assistantRole) ||
                (step === 2 && !requirements.skillLevel) ||
                (step === 3 && (!requirements.trainingGoals?.length || !requirements.priorityScenarios?.length))
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