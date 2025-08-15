import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, User, Target, Sun, Droplets, Clock, Heart, Camera } from 'lucide-react';
import { useLocation } from 'wouter';

interface QuizData {
  age: string;
  gender: string;
  skinType: string;
  concerns: string[];
  goals: string[];
  routine: string;
  sunExposure: string;
  lifestyle: string[];
  budget: string;
  previousTreatments: string;
  allergies: string;
  additionalNotes: string;
}

export default function SkinCoachQuiz() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [quizData, setQuizData] = useState<QuizData>({
    age: '',
    gender: '',
    skinType: '',
    concerns: [],
    goals: [],
    routine: '',
    sunExposure: '',
    lifestyle: [],
    budget: '',
    previousTreatments: '',
    allergies: '',
    additionalNotes: ''
  });

  const totalSteps = 8;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const updateQuizData = (field: keyof QuizData, value: any) => {
    setQuizData(prev => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field: 'concerns' | 'goals' | 'lifestyle', value: string, checked: boolean) => {
    setQuizData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finish quiz and go to camera capture
      setLocation('/skincoach/camera');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return quizData.age && quizData.gender;
      case 1: return quizData.skinType;
      case 2: return quizData.concerns.length > 0;
      case 3: return quizData.goals.length > 0;
      case 4: return quizData.routine && quizData.sunExposure;
      case 5: return quizData.lifestyle.length > 0;
      case 6: return quizData.budget;
      case 7: return true; // Optional fields
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Tell us about yourself</h2>
              <p className="text-gray-600">This helps us personalize your skin analysis</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-lg font-semibold mb-4 block">What's your age range?</Label>
                <RadioGroup value={quizData.age} onValueChange={(value) => updateQuizData('age', value)}>
                  <div className="grid grid-cols-2 gap-3">
                    {['16-25', '26-35', '36-45', '46-55', '56-65', '65+'].map((age) => (
                      <div key={age} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-pink-50 cursor-pointer">
                        <RadioGroupItem value={age} id={age} />
                        <Label htmlFor={age} className="cursor-pointer flex-1">{age}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-lg font-semibold mb-4 block">Gender</Label>
                <RadioGroup value={quizData.gender} onValueChange={(value) => updateQuizData('gender', value)}>
                  <div className="grid grid-cols-3 gap-3">
                    {['Female', 'Male', 'Other'].map((gender) => (
                      <div key={gender} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-pink-50 cursor-pointer">
                        <RadioGroupItem value={gender} id={gender} />
                        <Label htmlFor={gender} className="cursor-pointer flex-1">{gender}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Droplets className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">What's your skin type?</h2>
              <p className="text-gray-600">Choose the option that best describes your skin</p>
            </div>

            <RadioGroup value={quizData.skinType} onValueChange={(value) => updateQuizData('skinType', value)}>
              <div className="space-y-4">
                {[
                  { value: 'normal', title: 'Normal', description: 'Well-balanced, not too oily or dry' },
                  { value: 'dry', title: 'Dry', description: 'Often feels tight, may flake or feel rough' },
                  { value: 'oily', title: 'Oily', description: 'Shiny appearance, especially in T-zone' },
                  { value: 'combination', title: 'Combination', description: 'Oily in T-zone, normal/dry elsewhere' },
                  { value: 'sensitive', title: 'Sensitive', description: 'Easily irritated, reactive to products' }
                ].map((type) => (
                  <div key={type.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-blue-50 cursor-pointer">
                    <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={type.value} className="cursor-pointer font-semibold text-gray-900">{type.title}</Label>
                      <p className="text-gray-600 text-sm mt-1">{type.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-red-100 to-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Main skin concerns</h2>
              <p className="text-gray-600">Select all that apply to your current skin</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                'Acne/Breakouts', 'Dark Spots', 'Wrinkles', 'Fine Lines',
                'Redness/Irritation', 'Dark Circles', 'Eye Bags', 'Sagging',
                'Large Pores', 'Uneven Texture', 'Dullness', 'Scarring'
              ].map((concern) => (
                <div key={concern} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-red-50">
                  <Checkbox
                    id={concern}
                    checked={quizData.concerns.includes(concern)}
                    onCheckedChange={(checked) => updateArrayField('concerns', concern, !!checked)}
                  />
                  <Label htmlFor={concern} className="cursor-pointer flex-1 font-medium">{concern}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your skin goals</h2>
              <p className="text-gray-600">What would you like to achieve with your skincare?</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                'Prevent aging', 'Reduce acne', 'Brighten complexion', 'Even skin tone',
                'Reduce dark spots', 'Minimize pores', 'Improve texture', 'Reduce redness',
                'Hydrate skin', 'Anti-aging', 'Firm and lift', 'Reduce dark circles'
              ].map((goal) => (
                <div key={goal} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-green-50">
                  <Checkbox
                    id={goal}
                    checked={quizData.goals.includes(goal)}
                    onCheckedChange={(checked) => updateArrayField('goals', goal, !!checked)}
                  />
                  <Label htmlFor={goal} className="cursor-pointer flex-1 font-medium">{goal}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-orange-100 to-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sun className="h-8 w-8 text-orange-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Current routine & sun exposure</h2>
              <p className="text-gray-600">Help us understand your current habits</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-lg font-semibold mb-4 block">Current skincare routine</Label>
                <RadioGroup value={quizData.routine} onValueChange={(value) => updateQuizData('routine', value)}>
                  <div className="space-y-3">
                    {[
                      { value: 'minimal', title: 'Minimal (cleanser only or no routine)' },
                      { value: 'basic', title: 'Basic (cleanser + moisturizer)' },
                      { value: 'moderate', title: 'Moderate (3-5 products)' },
                      { value: 'extensive', title: 'Extensive (6+ products)' }
                    ].map((routine) => (
                      <div key={routine.value} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-orange-50 cursor-pointer">
                        <RadioGroupItem value={routine.value} id={routine.value} />
                        <Label htmlFor={routine.value} className="cursor-pointer flex-1">{routine.title}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-lg font-semibold mb-4 block">Daily sun exposure</Label>
                <RadioGroup value={quizData.sunExposure} onValueChange={(value) => updateQuizData('sunExposure', value)}>
                  <div className="space-y-3">
                    {[
                      { value: 'minimal', title: 'Minimal (mostly indoors)' },
                      { value: 'moderate', title: 'Moderate (some outdoor time)' },
                      { value: 'high', title: 'High (frequently outdoors)' },
                      { value: 'always-sunscreen', title: 'High but always wear sunscreen' }
                    ].map((exposure) => (
                      <div key={exposure.value} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-orange-50 cursor-pointer">
                        <RadioGroupItem value={exposure.value} id={exposure.value} />
                        <Label htmlFor={exposure.value} className="cursor-pointer flex-1">{exposure.title}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-purple-100 to-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Lifestyle factors</h2>
              <p className="text-gray-600">These can affect your skin health</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                'Regular exercise', 'High stress levels', 'Poor sleep (< 6 hours)',
                'Frequent travel', 'Smoking', 'Heavy makeup use',
                'Air-conditioned environment', 'Urban pollution exposure',
                'Hormonal changes', 'Dietary restrictions'
              ].map((factor) => (
                <div key={factor} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-purple-50">
                  <Checkbox
                    id={factor}
                    checked={quizData.lifestyle.includes(factor)}
                    onCheckedChange={(checked) => updateArrayField('lifestyle', factor, !!checked)}
                  />
                  <Label htmlFor={factor} className="cursor-pointer flex-1 font-medium">{factor}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Budget preferences</h2>
              <p className="text-gray-600">Help us recommend products in your price range</p>
            </div>

            <RadioGroup value={quizData.budget} onValueChange={(value) => updateQuizData('budget', value)}>
              <div className="space-y-4">
                {[
                  { value: 'budget', title: 'Budget-friendly', description: 'Under $50/month for skincare' },
                  { value: 'moderate', title: 'Moderate', description: '$50-100/month for skincare' },
                  { value: 'premium', title: 'Premium', description: '$100-200/month for skincare' },
                  { value: 'luxury', title: 'Luxury', description: '$200+/month for skincare' }
                ].map((budget) => (
                  <div key={budget.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-emerald-50 cursor-pointer">
                    <RadioGroupItem value={budget.value} id={budget.value} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={budget.value} className="cursor-pointer font-semibold text-gray-900">{budget.title}</Label>
                      <p className="text-gray-600 text-sm mt-1">{budget.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-pink-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Additional information</h2>
              <p className="text-gray-600">Optional details to personalize your recommendations</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="treatments" className="text-lg font-semibold mb-2 block">Previous treatments or procedures</Label>
                <Textarea
                  id="treatments"
                  placeholder="E.g., chemical peels, laser treatments, professional facials..."
                  value={quizData.previousTreatments}
                  onChange={(e) => updateQuizData('previousTreatments', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="allergies" className="text-lg font-semibold mb-2 block">Known allergies or sensitivities</Label>
                <Textarea
                  id="allergies"
                  placeholder="E.g., fragrances, retinoids, certain ingredients..."
                  value={quizData.allergies}
                  onChange={(e) => updateQuizData('allergies', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="notes" className="text-lg font-semibold mb-2 block">Anything else we should know?</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information about your skin or preferences..."
                  value={quizData.additionalNotes}
                  onChange={(e) => updateQuizData('additionalNotes', e.target.value)}
                  className="min-h-[80px]"
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => currentStep === 0 ? setLocation('/skincoach') : prevStep()}
              className="text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {currentStep === 0 ? 'Back to Home' : 'Previous'}
            </Button>
            <Badge className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              Step {currentStep + 1} of {totalSteps}
            </Badge>
          </div>
          <Progress value={progress} className="h-3 bg-gray-200">
            <div 
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </Progress>
        </div>

        {/* Quiz Content */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="sr-only">Skin Assessment Quiz</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {renderStep()}

            {/* Navigation */}
            <div className="flex justify-between mt-12 pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-6"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6"
              >
                {currentStep === totalSteps - 1 ? (
                  <>
                    Take Photo
                    <Camera className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}