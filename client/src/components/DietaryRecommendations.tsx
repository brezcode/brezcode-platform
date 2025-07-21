import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Utensils, 
  Clock, 
  Star, 
  Target, 
  TrendingUp, 
  Heart, 
  Brain,
  Zap,
  Activity,
  ChefHat,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  X
} from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface UserProfile {
  age: number;
  gender: string;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  weight: number;
  height: number;
  healthGoals: string[];
  medicalConditions: string[];
  dietaryRestrictions: string[];
  foodPreferences: string[];
  allergies: string[];
}

interface MealRecommendation {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: Array<{
    name: string;
    category: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    healthScore: number;
    tags: string[];
  }>;
  totalCalories: number;
  macroBreakdown: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  healthScore: number;
  reasoning: string;
  preparationTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  recipe?: string;
}

interface DailyMealPlan {
  date: string;
  meals: MealRecommendation[];
  totalCalories: number;
  nutritionalGoalsNet: number;
  personalizedInsights: string[];
}

export default function DietaryRecommendations() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    age: 30,
    gender: 'female',
    activityLevel: 'moderately_active',
    weight: 65,
    height: 165,
    healthGoals: ['Reduce breast cancer risk'],
    medicalConditions: [],
    dietaryRestrictions: [],
    foodPreferences: [],
    allergies: []
  });

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newGoal, setNewGoal] = useState('');
  const [newRestriction, setNewRestriction] = useState('');
  const [newAllergy, setNewAllergy] = useState('');

  // Generate daily meal plan
  const generateMealPlanMutation = useMutation({
    mutationFn: async (data: { userProfile: UserProfile; date: string }) => {
      const response = await apiRequest('POST', '/api/dietary/meal-plan', data);
      return response.json();
    }
  });

  // Generate single meal recommendation
  const generateMealMutation = useMutation({
    mutationFn: async (data: { userProfile: UserProfile; mealType: string; previousMeals?: MealRecommendation[] }) => {
      const response = await apiRequest('POST', '/api/dietary/meal-recommendation', data);
      return response.json();
    }
  });

  // Get nutritional needs
  const { data: nutritionalNeeds } = useQuery({
    queryKey: ['/api/dietary/nutritional-needs', userProfile],
    queryFn: async () => {
      const response = await apiRequest('POST', '/api/dietary/nutritional-needs', { userProfile });
      const data = await response.json();
      return data.nutritionalNeeds;
    },
    enabled: !!(userProfile.age && userProfile.weight && userProfile.height)
  });

  // Get food suggestions based on health goals
  const { data: foodSuggestions } = useQuery({
    queryKey: ['/api/dietary/food-suggestions', userProfile.healthGoals],
    queryFn: async () => {
      const response = await apiRequest('POST', '/api/dietary/food-suggestions', {
        healthGoals: userProfile.healthGoals,
        dietaryRestrictions: userProfile.dietaryRestrictions,
        allergies: userProfile.allergies
      });
      const data = await response.json();
      return data.suggestions;
    },
    enabled: userProfile.healthGoals.length > 0
  });

  const handleGenerateMealPlan = () => {
    generateMealPlanMutation.mutate({ userProfile, date: selectedDate });
  };

  const handleGenerateMeal = (mealType: string) => {
    const previousMeals = generateMealPlanMutation.data?.mealPlan?.meals || [];
    generateMealMutation.mutate({ userProfile, mealType, previousMeals });
  };

  const addToList = (list: string[], item: string, setter: (profile: UserProfile) => void) => {
    if (item.trim() && !list.includes(item.trim())) {
      const updatedProfile = { ...userProfile };
      setter(updatedProfile);
      setUserProfile(updatedProfile);
    }
  };

  const removeFromList = (list: string[], item: string, setter: (profile: UserProfile) => void) => {
    const updatedProfile = { ...userProfile };
    setter(updatedProfile);
    setUserProfile(updatedProfile);
  };

  const renderMealCard = (meal: MealRecommendation) => (
    <Card key={meal.mealType} className="mb-4">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="capitalize flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            {meal.mealType}
          </CardTitle>
          <Badge variant={meal.healthScore >= 80 ? 'default' : 'secondary'}>
            {meal.healthScore}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Foods List */}
        <div className="space-y-2">
          {meal.foods.map((food, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <div>
                <span className="font-medium">{food.name}</span>
                <div className="flex gap-2 mt-1">
                  {food.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {food.calories} cal
              </div>
            </div>
          ))}
        </div>

        {/* Macro Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
            <div className="text-sm font-medium text-blue-600">Protein</div>
            <div className="text-lg font-bold">{meal.macroBreakdown.protein}g</div>
          </div>
          <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
            <div className="text-sm font-medium text-green-600">Carbs</div>
            <div className="text-lg font-bold">{meal.macroBreakdown.carbs}g</div>
          </div>
          <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
            <div className="text-sm font-medium text-yellow-600">Fat</div>
            <div className="text-lg font-bold">{meal.macroBreakdown.fat}g</div>
          </div>
          <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
            <div className="text-sm font-medium text-purple-600">Fiber</div>
            <div className="text-lg font-bold">{meal.macroBreakdown.fiber}g</div>
          </div>
        </div>

        {/* Meal Details */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {meal.preparationTime} min
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="h-4 w-4" />
            {meal.difficulty}
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4" />
            {meal.totalCalories} cal
          </div>
        </div>

        {/* Reasoning */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
          <p className="text-sm">{meal.reasoning}</p>
        </div>

        {/* Recipe */}
        {meal.recipe && (
          <div className="p-3 border rounded">
            <h4 className="font-medium mb-2">Preparation Instructions:</h4>
            <p className="text-sm text-muted-foreground">{meal.recipe}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Dietary Recommendations
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Get personalized meal plans based on your health goals and nutritional needs
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="needs">Nutritional Needs</TabsTrigger>
              <TabsTrigger value="meals">Meal Plans</TabsTrigger>
              <TabsTrigger value="suggestions">Food Ideas</TabsTrigger>
            </TabsList>

            {/* User Profile Tab */}
            <TabsContent value="profile" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={userProfile.age}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={userProfile.gender} onValueChange={(value) => setUserProfile(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={userProfile.weight}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={userProfile.height}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="activity">Activity Level</Label>
                  <Select value={userProfile.activityLevel} onValueChange={(value: any) => setUserProfile(prev => ({ ...prev, activityLevel: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (office job)</SelectItem>
                      <SelectItem value="lightly_active">Lightly Active (light exercise 1-3 days/week)</SelectItem>
                      <SelectItem value="moderately_active">Moderately Active (moderate exercise 3-5 days/week)</SelectItem>
                      <SelectItem value="very_active">Very Active (hard exercise 6-7 days/week)</SelectItem>
                      <SelectItem value="extra_active">Extra Active (very hard exercise, physical job)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Health Goals */}
              <div className="space-y-2">
                <Label>Health Goals</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add health goal..."
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addToList(userProfile.healthGoals, newGoal, (profile) => {
                          profile.healthGoals = [...profile.healthGoals, newGoal.trim()];
                        });
                        setNewGoal('');
                      }
                    }}
                  />
                  <Button 
                    size="sm" 
                    onClick={() => {
                      addToList(userProfile.healthGoals, newGoal, (profile) => {
                        profile.healthGoals = [...profile.healthGoals, newGoal.trim()];
                      });
                      setNewGoal('');
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userProfile.healthGoals.map(goal => (
                    <Badge key={goal} variant="secondary" className="flex items-center gap-1">
                      {goal}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeFromList(userProfile.healthGoals, goal, (profile) => {
                          profile.healthGoals = profile.healthGoals.filter(g => g !== goal);
                        })}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Dietary Restrictions */}
              <div className="space-y-2">
                <Label>Dietary Restrictions</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add dietary restriction..."
                    value={newRestriction}
                    onChange={(e) => setNewRestriction(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addToList(userProfile.dietaryRestrictions, newRestriction, (profile) => {
                          profile.dietaryRestrictions = [...profile.dietaryRestrictions, newRestriction.trim()];
                        });
                        setNewRestriction('');
                      }
                    }}
                  />
                  <Button 
                    size="sm" 
                    onClick={() => {
                      addToList(userProfile.dietaryRestrictions, newRestriction, (profile) => {
                        profile.dietaryRestrictions = [...profile.dietaryRestrictions, newRestriction.trim()];
                      });
                      setNewRestriction('');
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userProfile.dietaryRestrictions.map(restriction => (
                    <Badge key={restriction} variant="outline" className="flex items-center gap-1">
                      {restriction}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeFromList(userProfile.dietaryRestrictions, restriction, (profile) => {
                          profile.dietaryRestrictions = profile.dietaryRestrictions.filter(r => r !== restriction);
                        })}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              <div className="space-y-2">
                <Label>Allergies</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add allergy..."
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addToList(userProfile.allergies, newAllergy, (profile) => {
                          profile.allergies = [...profile.allergies, newAllergy.trim()];
                        });
                        setNewAllergy('');
                      }
                    }}
                  />
                  <Button 
                    size="sm" 
                    onClick={() => {
                      addToList(userProfile.allergies, newAllergy, (profile) => {
                        profile.allergies = [...profile.allergies, newAllergy.trim()];
                      });
                      setNewAllergy('');
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userProfile.allergies.map(allergy => (
                    <Badge key={allergy} variant="destructive" className="flex items-center gap-1">
                      {allergy}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeFromList(userProfile.allergies, allergy, (profile) => {
                          profile.allergies = profile.allergies.filter(a => a !== allergy);
                        })}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Nutritional Needs Tab */}
            <TabsContent value="needs" className="space-y-4">
              {nutritionalNeeds ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Daily Caloric Needs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-center text-green-600">
                        {nutritionalNeeds.dailyCalories} cal
                      </div>
                      <p className="text-sm text-muted-foreground text-center mt-2">
                        Based on your age, gender, weight, height, and activity level
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Macronutrient Targets</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Protein</span>
                        <span className="font-medium">{nutritionalNeeds.protein}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carbohydrates</span>
                        <span className="font-medium">{nutritionalNeeds.carbohydrates}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fat</span>
                        <span className="font-medium">{nutritionalNeeds.fat}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fiber</span>
                        <span className="font-medium">{nutritionalNeeds.fiber}g</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-base">Key Vitamins & Minerals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        {Object.entries(nutritionalNeeds.vitamins).slice(0, 8).map(([vitamin, amount]) => (
                          <div key={vitamin} className="flex justify-between">
                            <span>{vitamin}</span>
                            <span className="font-medium">{amount}{vitamin.includes('B12') ? 'mcg' : vitamin.includes('C') ? 'mg' : 'mcg'}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Complete your profile to see personalized nutritional needs</p>
                </div>
              )}
            </TabsContent>

            {/* Meal Plans Tab */}
            <TabsContent value="meals" className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="max-w-48"
                />
                <Button 
                  onClick={handleGenerateMealPlan}
                  disabled={generateMealPlanMutation.isPending}
                  className="flex items-center gap-2"
                >
                  {generateMealPlanMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Target className="h-4 w-4" />
                  )}
                  Generate Daily Plan
                </Button>
              </div>

              {generateMealPlanMutation.data?.mealPlan && (
                <div className="space-y-4">
                  {/* Daily Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Daily Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {generateMealPlanMutation.data.mealPlan.totalCalories}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Calories</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {generateMealPlanMutation.data.mealPlan.nutritionalGoalsNet}%
                          </div>
                          <div className="text-sm text-muted-foreground">Goals Met</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {generateMealPlanMutation.data.mealPlan.meals.length}
                          </div>
                          <div className="text-sm text-muted-foreground">Meals Planned</div>
                        </div>
                      </div>

                      {/* Personalized Insights */}
                      {generateMealPlanMutation.data.mealPlan.personalizedInsights && (
                        <div className="space-y-2">
                          <h4 className="font-medium">Personalized Insights:</h4>
                          {generateMealPlanMutation.data.mealPlan.personalizedInsights.map((insight: string, index: number) => (
                            <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                              <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
                              <span className="text-sm">{insight}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Individual Meals */}
                  {generateMealPlanMutation.data.mealPlan.meals.map((meal: MealRecommendation) => 
                    renderMealCard(meal)
                  )}
                </div>
              )}

              {/* Individual Meal Generation */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => (
                  <Button
                    key={mealType}
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateMeal(mealType)}
                    disabled={generateMealMutation.isPending}
                    className="capitalize"
                  >
                    {generateMealMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Utensils className="h-4 w-4" />
                    )}
                    {mealType}
                  </Button>
                ))}
              </div>

              {generateMealMutation.data?.recommendation && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Individual Meal Recommendation</h3>
                  {renderMealCard(generateMealMutation.data.recommendation)}
                </div>
              )}
            </TabsContent>

            {/* Food Suggestions Tab */}
            <TabsContent value="suggestions" className="space-y-4">
              {foodSuggestions && foodSuggestions.length > 0 ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" />
                        Foods for Your Health Goals
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Personalized food recommendations based on: {userProfile.healthGoals.join(', ')}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {foodSuggestions.map((suggestion: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Add health goals to get personalized food suggestions</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}