import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { healthPreferencesFormSchema } from '@shared/health-schedule-schema';
import { z } from 'zod';
import { 
  Clock, 
  Target, 
  Calendar, 
  Bell, 
  Activity,
  Heart,
  ArrowRight,
  CheckCircle
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

const MEDICAL_CONDITIONS = [
  'Family history of breast cancer',
  'Previous breast cancer',
  'BRCA gene mutation',
  'Dense breast tissue',
  'Hormone replacement therapy',
  'Early menstruation',
  'Late menopause',
  'Never had children',
  'First child after 30'
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

export default function HealthPreferences() {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch existing preferences
  const { data: existingPreferences } = useQuery({
    queryKey: ['/api/health/preferences'],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(healthPreferencesFormSchema),
    defaultValues: {
      preferredTime: existingPreferences?.preferredTime || 'morning',
      reminderSettings: {
        sms: existingPreferences?.reminderSettings?.sms || true,
        email: existingPreferences?.reminderSettings?.email || true,
        push: existingPreferences?.reminderSettings?.push || true,
        reminderMinutes: existingPreferences?.reminderSettings?.reminderMinutes || 30,
      },
      fitnessLevel: existingPreferences?.fitnessLevel || 'beginner',
      healthGoals: existingPreferences?.healthGoals || [],
      medicalConditions: existingPreferences?.medicalConditions || [],
      availableDays: existingPreferences?.availableDays || [1, 2, 3, 4, 5],
      sessionDuration: existingPreferences?.sessionDuration || 30,
    },
  });

  const savePreferencesMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest('/api/health/preferences', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Preferences Saved!",
        description: "Your health preferences have been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/health/preferences'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save preferences",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    savePreferencesMutation.mutate(data);
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Preferences Setup</h1>
          <p className="text-gray-600">Customize your health journey for personalized scheduling</p>
          
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
            
            {/* Step 1: Time & Schedule Preferences */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Schedule Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Preferred Time */}
                  <FormField
                    control={form.control}
                    name="preferredTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>When do you prefer to do health activities?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select preferred time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="morning">Morning (6 AM - 12 PM)</SelectItem>
                            <SelectItem value="afternoon">Afternoon (12 PM - 6 PM)</SelectItem>
                            <SelectItem value="evening">Evening (6 PM - 10 PM)</SelectItem>
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
                        <FormLabel>Which days are you available for health activities?</FormLabel>
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
                        <FormLabel>Preferred session duration (minutes)</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
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

            {/* Step 2: Health Goals & Fitness Level */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Health Goals & Fitness Level
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Fitness Level */}
                  <FormField
                    control={form.control}
                    name="fitnessLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What's your current fitness level?</FormLabel>
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
                        <FormLabel>What are your health goals? (Select all that apply)</FormLabel>
                        <div className="grid grid-cols-2 gap-3">
                          {HEALTH_GOALS.map((goal) => (
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
                              <label htmlFor={`goal-${goal}`} className="text-sm font-medium">
                                {goal}
                              </label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Medical Conditions */}
                  <FormField
                    control={form.control}
                    name="medicalConditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Do any of these apply to you? (Optional - helps personalize recommendations)</FormLabel>
                        <div className="grid grid-cols-1 gap-3">
                          {MEDICAL_CONDITIONS.map((condition) => (
                            <div key={condition} className="flex items-center space-x-2">
                              <Checkbox
                                id={`condition-${condition}`}
                                checked={field.value?.includes(condition)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  if (checked) {
                                    field.onChange([...current, condition]);
                                  } else {
                                    field.onChange(current.filter(c => c !== condition));
                                  }
                                }}
                              />
                              <label htmlFor={`condition-${condition}`} className="text-sm font-medium">
                                {condition}
                              </label>
                            </div>
                          ))}
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
                    Reminder Settings
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
                      disabled={savePreferencesMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {savePreferencesMutation.isPending ? 'Saving...' : 'Save Preferences & Create Schedule'}
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