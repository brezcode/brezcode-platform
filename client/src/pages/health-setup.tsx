import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { healthPreferencesFormSchema } from '@shared/health-schedule-schema';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { 
  Clock, 
  Target, 
  Calendar, 
  Bell, 
  Activity,
  Heart,
  ArrowRight,
  CheckCircle,
  User,
  Sparkles
} from 'lucide-react';

type FormData = z.infer<typeof healthPreferencesFormSchema>;

const HEALTH_GOALS = [
  'Reduce breast cancer risk',
  'Improve overall fitness',
  'Better stress management',
  'Increase body awareness',
  'Build healthy habits',
  'Weight management',
  'Better sleep quality',
  'Improved mental health'
];

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export default function HealthSetup() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get quiz results from localStorage to personalize recommendations
  const quizData = React.useMemo(() => {
    try {
      const stored = localStorage.getItem('brezcode_quiz_answers') || localStorage.getItem('quizAnswers');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  // Generate personalized recommendations based on quiz
  const personalizedRecommendations = React.useMemo(() => {
    if (!quizData) return { goals: [], fitness: 'beginner', focus: 'general' };

    const recommendations = {
      goals: ['Reduce breast cancer risk'],
      fitness: 'beginner' as const,
      focus: 'general' as const
    };

    // Age-based recommendations
    const age = parseInt(quizData['1']) || 25;
    if (age >= 40) {
      recommendations.goals.push('Better stress management', 'Improve overall fitness');
      recommendations.fitness = 'intermediate';
      recommendations.focus = 'prevention';
    } else if (age >= 30) {
      recommendations.goals.push('Build healthy habits', 'Increase body awareness');
      recommendations.focus = 'awareness';
    } else {
      recommendations.goals.push('Build healthy habits', 'Better sleep quality');
      recommendations.focus = 'foundation';
    }

    // Activity level based recommendations
    if (quizData['21'] === 'Daily' || quizData['21'] === '3-4 times per week') {
      recommendations.fitness = 'intermediate';
    } else if (quizData['21'] === '5+ times per week') {
      recommendations.fitness = 'advanced';
    }

    // Stress level recommendations
    if (quizData['16'] === 'Very high' || quizData['16'] === 'High') {
      recommendations.goals.push('Better stress management', 'Improved mental health');
    }

    // Family history considerations
    if (quizData['11'] === 'Yes') {
      recommendations.goals.unshift('Reduce breast cancer risk');
      recommendations.focus = 'high-priority';
    }

    return recommendations;
  }, [quizData]);

  const form = useForm<FormData>({
    resolver: zodResolver(healthPreferencesFormSchema),
    defaultValues: {
      preferredTime: 'morning',
      reminderSettings: {
        sms: true,
        email: true,
        push: true,
        reminderMinutes: 30,
      },
      fitnessLevel: personalizedRecommendations.fitness,
      healthGoals: personalizedRecommendations.goals,
      medicalConditions: [],
      availableDays: [1, 2, 3, 4, 5],
      sessionDuration: personalizedRecommendations.fitness === 'beginner' ? 20 : 30,
    },
  });

  const savePreferencesAndSchedule = useMutation({
    mutationFn: async (data: FormData) => {
      console.log('Form data being submitted:', data);
      
      // Save preferences first
      const preferencesResponse = await apiRequest('POST', '/api/health/preferences', data);
      const preferences = await preferencesResponse.json();

      // Generate personalized schedule for the next week
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 7);

      const scheduleResponse = await apiRequest('POST', '/api/health/schedule/generate', {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        preferences: data,
        quizResults: quizData // Include quiz results for personalization
      });
      const schedule = await scheduleResponse.json();

      return { preferences, schedule };
    },
    onSuccess: (response) => {
      toast({
        title: "Success!",
        description: `Your personalized health schedule has been created with ${response.schedule.activities?.length || 0} activities planned.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/health/preferences'] });
      queryClient.invalidateQueries({ queryKey: ['/api/health/activities'] });
      
      // Redirect to health calendar to see the schedule
      setTimeout(() => {
        setLocation('/brezcode/health-calendar');
      }, 1500);
    },
    onError: (error: any) => {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create your health schedule",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    savePreferencesAndSchedule.mutate(data);
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with Personalization */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <User className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Personalized Health Plan Setup</h1>
          <p className="text-gray-600 mb-4">Based on your assessment, we'll create a customized health schedule</p>
          
          {/* Quiz-based recommendations preview */}
          {personalizedRecommendations.focus !== 'general' && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Based on Your Assessment</span>
              </div>
              <div className="text-sm text-blue-700">
                {personalizedRecommendations.focus === 'high-priority' && 
                  "Given your family history, we've prioritized risk reduction activities."}
                {personalizedRecommendations.focus === 'prevention' && 
                  "For your age group, we focus on prevention and early detection activities."}
                {personalizedRecommendations.focus === 'awareness' && 
                  "We'll emphasize body awareness and healthy habit building."}
                {personalizedRecommendations.focus === 'foundation' && 
                  "Perfect time to build foundational health habits!"}
              </div>
            </div>
          )}
          
          {/* Progress indicator */}
          <div className="flex items-center justify-center mt-6 space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > stepNum ? <CheckCircle className="h-5 w-5" /> : stepNum}
                </div>
                {stepNum < 3 && <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Step 1: Schedule Preferences */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    When would you like to do your health activities?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Preferred Time */}
                  <FormField
                    control={form.control}
                    name="preferredTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Best time of day for activities</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select preferred time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="morning">Morning (6 AM - 12 PM) - Great for establishing routines</SelectItem>
                            <SelectItem value="afternoon">Afternoon (12 PM - 6 PM) - Perfect for energy breaks</SelectItem>
                            <SelectItem value="evening">Evening (6 PM - 10 PM) - Ideal for unwinding</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Available Days */}
                  <FormField
                    control={form.control}
                    name="availableDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Which days work best for you?</FormLabel>
                        <div className="grid grid-cols-4 gap-3">
                          {DAYS_OF_WEEK.map((day) => (
                            <div key={day.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={`day-${day.value}`}
                                checked={field.value?.includes(day.value)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  if (checked) {
                                    field.onChange([...current, day.value]);
                                  } else {
                                    field.onChange(current.filter(d => d !== day.value));
                                  }
                                }}
                              />
                              <label htmlFor={`day-${day.value}`} className="text-sm font-medium">
                                {day.label}
                              </label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Session Duration */}
                  <FormField
                    control={form.control}
                    name="sessionDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How much time can you dedicate per activity?</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="10">10 minutes - Quick daily habits</SelectItem>
                            <SelectItem value="20">20 minutes - Focused sessions</SelectItem>
                            <SelectItem value="30">30 minutes - Comprehensive activities</SelectItem>
                            <SelectItem value="45">45 minutes - Extended wellness time</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button onClick={nextStep} type="button">
                      Next Step <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Health Goals (Pre-filled based on quiz) */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Your Health Goals & Fitness Level
                  </CardTitle>
                  <p className="text-sm text-gray-600">We've pre-selected goals based on your assessment. Feel free to adjust them.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Fitness Level */}
                  <FormField
                    control={form.control}
                    name="fitnessLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current fitness level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select fitness level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner - Just starting my health journey</SelectItem>
                            <SelectItem value="intermediate">Intermediate - Some experience with health routines</SelectItem>
                            <SelectItem value="advanced">Advanced - Very active and experienced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Health Goals */}
                  <FormField
                    control={form.control}
                    name="healthGoals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Health goals (recommended based on your assessment)</FormLabel>
                        <div className="grid grid-cols-2 gap-3">
                          {HEALTH_GOALS.map((goal) => {
                            const isRecommended = personalizedRecommendations.goals.includes(goal);
                            return (
                              <div key={goal} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`goal-${goal}`}
                                  checked={field.value?.includes(goal)}
                                  onCheckedChange={(checked) => {
                                    const current = field.value || [];
                                    if (checked) {
                                      field.onChange([...current, goal]);
                                    } else {
                                      field.onChange(current.filter(g => g !== goal));
                                    }
                                  }}
                                />
                                <label htmlFor={`goal-${goal}`} className="text-sm font-medium flex items-center gap-2">
                                  {goal}
                                  {isRecommended && (
                                    <Badge variant="secondary" className="text-xs">Recommended</Badge>
                                  )}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between">
                    <Button onClick={prevStep} type="button" variant="outline">
                      Previous
                    </Button>
                    <Button onClick={nextStep} type="button">
                      Next Step <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Reminder Settings */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Reminder Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Reminder Types */}
                  <div className="space-y-4">
                    <FormLabel>How would you like to receive reminders?</FormLabel>
                    
                    <FormField
                      control={form.control}
                      name="reminderSettings.email"
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="email-reminders"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <label htmlFor="email-reminders" className="text-sm font-medium">
                            Email reminders
                          </label>
                        </div>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reminderSettings.sms"
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="sms-reminders"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <label htmlFor="sms-reminders" className="text-sm font-medium">
                            SMS text reminders
                          </label>
                        </div>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reminderSettings.push"
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="push-reminders"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <label htmlFor="push-reminders" className="text-sm font-medium">
                            Push notifications
                          </label>
                        </div>
                      )}
                    />
                  </div>

                  {/* Reminder Timing */}
                  <FormField
                    control={form.control}
                    name="reminderSettings.reminderMinutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Send reminders how many minutes before activities?</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select reminder time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="5">5 minutes before</SelectItem>
                            <SelectItem value="15">15 minutes before</SelectItem>
                            <SelectItem value="30">30 minutes before</SelectItem>
                            <SelectItem value="60">1 hour before</SelectItem>
                            <SelectItem value="120">2 hours before</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between">
                    <Button onClick={prevStep} type="button" variant="outline">
                      Previous
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={savePreferencesAndSchedule.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {savePreferencesAndSchedule.isPending ? 'Creating Your Schedule...' : 'Create My Health Schedule'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}