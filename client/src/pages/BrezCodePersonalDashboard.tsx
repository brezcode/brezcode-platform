import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  Activity, 
  Shield, 
  User,
  Bell,
  Settings,
  LogOut,
  ChevronRight
} from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function BrezCodePersonalDashboard() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();

  // Personal health metrics
  const healthMetrics = {
    overallScore: 87,
    riskLevel: "Low",
    activeDays: 28,
    assessmentDate: "Jan 15, 2025",
    nextCheckup: "Apr 15, 2025",
    streakDays: 12,
    completedActivities: 89
  };

  const quickActions = [
    {
      title: "Chat with Dr. Sakura",
      description: "Get personalized health guidance",
      icon: <MessageSquare className="h-6 w-6" />,
      action: () => setLocation('/brezcode/avatar-chat'),
      color: "bg-pink-500"
    },
    {
      title: "Health Calendar",
      description: "View your wellness schedule",
      icon: <Calendar className="h-6 w-6" />,
      action: () => setLocation('/brezcode/health-calendar'),
      color: "bg-purple-500"
    },
    {
      title: "Track Activities",
      description: "Log today's health activities",
      icon: <Activity className="h-6 w-6" />,
      action: () => setLocation('/brezcode/activity-tracker'),
      color: "bg-blue-500"
    },
    {
      title: "View Report",
      description: "See your latest health assessment",
      icon: <TrendingUp className="h-6 w-6" />,
      action: () => setLocation('/brezcode/report'),
      color: "bg-green-500"
    }
  ];

  const todaysTasks = [
    { id: 1, task: "Morning meditation (10 min)", completed: true },
    { id: 2, task: "Breast self-examination", completed: false },
    { id: 3, task: "Healthy meal planning", completed: true },
    { id: 4, task: "Evening walk (30 min)", completed: false },
    { id: 5, task: "Stress management exercises", completed: false }
  ];

  const handleLogout = async () => {
    await logout();
    setLocation('/brezcode');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  BrezCode
                </h1>
                <p className="text-sm text-gray-600">Frontend Personal Health Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">{(user as any)?.firstName || 'User'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {(user as any)?.firstName || 'there'}! 👋
          </h2>
          <p className="text-gray-600">
            Here's your health journey overview for today.
          </p>
        </div>

        {/* Health Score Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-pink-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Overall Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="text-3xl font-bold text-green-600">{healthMetrics.overallScore}</div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {healthMetrics.riskLevel} Risk
                </Badge>
              </div>
              <Progress value={healthMetrics.overallScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border-purple-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{healthMetrics.activeDays}</div>
              <p className="text-sm text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{healthMetrics.streakDays}</div>
              <p className="text-sm text-gray-500 mt-1">Days in a row</p>
            </CardContent>
          </Card>

          <Card className="border-orange-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Activities Done</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{healthMetrics.completedActivities}%</div>
              <p className="text-sm text-gray-500 mt-1">This week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="border-pink-100 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-pink-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Featured Chat with AI Button */}
                  <Button
                    className="w-full h-16 bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 justify-start p-4"
                    onClick={() => setLocation('/brezcode/avatar-chat')}
                  >
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg">Chat with Dr. Sakura AI</div>
                      <div className="text-sm text-pink-100">Get personalized health guidance 24/7</div>
                    </div>
                    <ChevronRight className="h-5 w-5 ml-auto" />
                  </Button>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto p-4 justify-start border-gray-200 hover:border-pink-300"
                        onClick={action.action}
                      >
                        <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mr-3`}>
                          {action.icon}
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{action.title}</div>
                          <div className="text-sm text-gray-500">{action.description}</div>
                        </div>
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Today's Tasks */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-500" />
                  Today's Wellness Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todaysTasks.map((task) => (
                    <div key={task.id} className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        task.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-gray-300'
                      }`}>
                        {task.completed && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <span className={`flex-1 ${
                        task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}>
                        {task.task}
                      </span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Activities
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Health Summary */}
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-500" />
                  Health Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Assessment</span>
                  <span className="text-sm font-medium">{healthMetrics.assessmentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Next Checkup</span>
                  <span className="text-sm font-medium">{healthMetrics.nextCheckup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Risk Level</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {healthMetrics.riskLevel}
                  </Badge>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Update Assessment
                </Button>
              </CardContent>
            </Card>

            {/* Dr. Sakura Chat */}
            <Card className="border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-purple-500" />
                  Dr. Sakura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  "Good morning! I noticed you've been doing great with your morning routines. 
                  Would you like some tips for today's self-examination?"
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={() => setLocation('/brezcode/avatar-chat')}
                >
                  Chat Now
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-gray-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed meditation</span>
                  <span className="text-gray-400">2h ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Health report generated</span>
                  <span className="text-gray-400">1d ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dr. Sakura chat session</span>
                  <span className="text-gray-400">2d ago</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}