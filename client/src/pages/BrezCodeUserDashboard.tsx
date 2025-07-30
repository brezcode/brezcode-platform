import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
// import { Calendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Heart, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Activity, 
  Target, 
  CheckCircle2,
  Clock,
  MessageSquare,
  User,
  Award,
  Zap
} from "lucide-react";
// import TopNavigation from "@/components/TopNavigation";

export default function BrezCodeUserDashboard() {
  const [, setLocation] = useLocation();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Fetch user's health stats
  const { data: healthStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/brezcode/stats'],
  });

  // Fetch user's health activities for selected date
  const { data: activitiesData, isLoading: activitiesLoading } = useQuery({
    queryKey: ['/api/brezcode/activities', selectedDate?.toISOString()],
  });

  // Mock user data (would come from API)
  const userData = {
    firstName: "Lee",
    currentStreak: 12,
    totalPoints: 2847,
    healthScore: 85,
    riskCategory: "Low Risk",
    lastAssessment: "January 28, 2025"
  };

  const stats = (healthStats as any)?.stats || {
    weeklyGoalProgress: 75,
    currentStreak: 12,
    totalActivities: 45,
    weeklyMinutes: 280,
    healthScore: 85,
    completedAssessments: 3,
    riskImprovementScore: 2.3
  };

  const activities = (activitiesData as any)?.activities || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 dark:from-gray-900 dark:to-gray-800">
      {/* BrezCode Independent Navigation */}
      <nav className="bg-white border-b border-pink-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">BrezCode</h1>
                <p className="text-xs text-gray-600">Breast Health Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLocation('/brezcode/assessment')}
              >
                Take Assessment
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLocation('/brezcode/profile')}
              >
                Profile
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation('/login')}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Personal Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {userData.firstName}! 🌸
              </h1>
              <p className="text-gray-600">Your breast health journey continues</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-green-50 text-green-700 px-3 py-1">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              {userData.riskCategory}
            </Badge>
            <Button 
              onClick={() => setLocation('/brezcode/chat')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat with Dr. Sakura
            </Button>
          </div>
        </div>

        {/* Health Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Heart className="h-4 w-4 mr-2 text-pink-500" />
                Health Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl font-bold text-gray-900">{stats.healthScore}/100</span>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <Progress value={stats.healthScore} className="mb-2" />
              <p className="text-sm text-green-600">+{stats.riskImprovementScore} improvement</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Zap className="h-4 w-4 mr-2 text-blue-500" />
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-gray-900">{stats.currentStreak}</span>
                <Award className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-sm text-blue-600 mt-1">days in a row</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Target className="h-4 w-4 mr-2 text-green-500" />
                Weekly Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl font-bold text-gray-900">{stats.weeklyGoalProgress}%</span>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <Progress value={stats.weeklyGoalProgress} className="mb-2" />
              <p className="text-sm text-green-600">{stats.totalActivities} activities completed</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-purple-500" />
                Active Minutes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-gray-900">{stats.weeklyMinutes}</span>
                <Activity className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-sm text-purple-600 mt-1">this week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Health Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-pink-500" />
                Health Calendar
              </CardTitle>
              <CardDescription>
                Track your daily wellness activities and appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="w-full p-4 border rounded-md bg-white">
                  <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-500 mb-4">
                    <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 35 }, (_, i) => {
                      const day = i - 6; // Start from Sunday of previous month
                      const isToday = day === new Date().getDate();
                      const isSelected = selectedDate?.getDate() === day;
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedDate(new Date(2025, 0, day))}
                          className={`h-8 w-8 rounded-full text-sm ${
                            isSelected 
                              ? 'bg-pink-500 text-white' 
                              : isToday 
                                ? 'bg-pink-100 text-pink-600' 
                                : day > 0 && day <= 31 
                                  ? 'hover:bg-gray-100 text-gray-900' 
                                  : 'text-gray-300'
                          }`}
                        >
                          {day > 0 && day <= 31 ? day : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {selectedDate && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Activities for {selectedDate.toLocaleDateString()}
                    </h4>
                    <div className="space-y-2">
                      {activities.length > 0 ? activities.map((activity: any) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${activity.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <div>
                              <p className="font-medium text-gray-900">{activity.title}</p>
                              <p className="text-sm text-gray-600">{activity.description}</p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {activity.duration} min
                          </div>
                        </div>
                      )) : (
                        <p className="text-gray-500 text-center py-4">No activities scheduled for this date</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Daily Wellness Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-rose-500" />
                Today's Wellness Plan
              </CardTitle>
              <CardDescription>
                Your personalized daily health activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-200">
                  <h4 className="font-semibold text-gray-900 mb-2">🌅 Morning Routine</h4>
                  <p className="text-sm text-gray-700">
                    Start with 5 minutes of deep breathing and gentle stretching
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Mark Complete
                  </Button>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2">🌞 Afternoon Activity</h4>
                  <p className="text-sm text-gray-700">
                    20-minute walk or light exercise session
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Start Activity
                  </Button>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-2">🌙 Evening Reflection</h4>
                  <p className="text-sm text-gray-700">
                    Mindfulness practice and health journal entry
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Open Journal
                  </Button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <Button 
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                  onClick={() => setLocation('/brezcode/chat')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Get Personalized Advice from Dr. Sakura
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Assessment Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-indigo-500" />
              Latest Health Assessment Summary
            </CardTitle>
            <CardDescription>
              Based on your assessment completed on {userData.lastAssessment}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700 mb-2">{userData.riskCategory}</div>
                <p className="text-sm text-green-600">Current risk level based on your profile</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-700 mb-2">{stats.completedAssessments}</div>
                <p className="text-sm text-blue-600">Total assessments completed</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-700 mb-2">Next: Feb 28</div>
                <p className="text-sm text-purple-600">Recommended follow-up assessment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}