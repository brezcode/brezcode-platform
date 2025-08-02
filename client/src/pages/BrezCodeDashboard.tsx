import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Brain, Users, TrendingUp, MessageSquare, Calendar, BookOpen, Settings } from "lucide-react";
import { useLocation } from "wouter";
import TopNavigation from "@/components/TopNavigation";

export default function BrezCodeDashboard() {
  const [, setLocation] = useLocation();

  // BrezCode business metrics
  const brezCodeStats = {
    totalUsers: 1247,
    activeAssessments: 89,
    completionRate: 94,
    avgHealthScore: 82,
    weeklyGrowth: 12,
    customerSatisfaction: 4.8,
    aiTrainingProgress: 85
  };

  const quickActions = [
    {
      title: "AI Training",
      description: "Train Dr. Sakura with breast health scenarios",
      icon: <Brain className="h-6 w-6" />,
      action: () => setLocation('/business/brezcode/avatar-training'),
      color: "bg-blue-500"
    },
    {
      title: "Knowledge Center",
      description: "Upload files to train all AI avatars",
      icon: <BookOpen className="h-6 w-6" />,
      action: () => setLocation('/knowledge-center'),
      color: "bg-indigo-500"
    },
    {
      title: "User Analytics",
      description: "View user engagement and health outcomes",
      icon: <TrendingUp className="h-6 w-6" />,
      action: () => setLocation('/analytics'),
      color: "bg-green-500"
    },
    {
      title: "Customer Support",
      description: "Manage customer inquiries and support tickets",
      icon: <MessageSquare className="h-6 w-6" />,
      action: () => setLocation('/customer-support'),
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      {/* Top Navigation with BrezCode Context */}
      <TopNavigation 
        businessContext={{
          name: "BrezCode",
          icon: <Heart className="h-5 w-5 text-red-500" />
        }}
      />
      
      <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-pink-100 rounded-lg">
            <Heart className="h-8 w-8 text-pink-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">BrezCode Backend Dashboard</h1>
            <p className="text-gray-600">Business analytics and AI management platform</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            Active
          </Badge>
          <Button 
            variant="outline" 
            onClick={() => setLocation('/business-selector')}
          >
            Switch Business
          </Button>
        </div>
      </div>

      {/* Edit Business Profile Section */}
      <div className="flex items-center justify-center mb-6">
        <Button 
          variant="outline" 
          className="flex items-center space-x-2 hover:bg-pink-50 border-pink-200"
          onClick={() => setLocation('/business/brezcode/profile')}
        >
          <Settings className="h-4 w-4" />
          <span>Edit Business Profile</span>
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">{brezCodeStats.totalUsers.toLocaleString()}</span>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm text-green-600 mt-1">+{brezCodeStats.weeklyGrowth}% this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">{brezCodeStats.activeAssessments}</span>
              <Heart className="h-5 w-5 text-pink-400" />
            </div>
            <p className="text-sm text-gray-500 mt-1">In progress today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">{brezCodeStats.completionRate}%</span>
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <Progress value={brezCodeStats.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">{brezCodeStats.avgHealthScore}/100</span>
              <Heart className="h-5 w-5 text-red-400" />
            </div>
            <p className="text-sm text-blue-600 mt-1">Improving outcomes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your BrezCode platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <div 
                    key={index}
                    onClick={action.action}
                    className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 ${action.color} rounded-lg text-white`}>
                        {action.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Training Progress */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Training Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Overall Training</span>
                    <span className="text-sm text-gray-600">{brezCodeStats.aiTrainingProgress}%</span>
                  </div>
                  <Progress value={brezCodeStats.aiTrainingProgress} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Health Scenarios</span>
                    <Badge variant="outline" className="text-xs">12 Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Customer Service</span>
                    <Badge variant="outline" className="text-xs">8 Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Medical Accuracy</span>
                    <Badge className="bg-green-100 text-green-800 text-xs">98.2%</Badge>
                  </div>
                </div>

                <Button 
                  className="w-full mt-4" 
                  onClick={() => setLocation('/business/brezcode/avatar-training')}
                >
                  Start BrezCode AI Training
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">New roleplay scenario created</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">AI training session completed</p>
                    <p className="text-xs text-gray-500">Score: 8.5/10</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Health assessment updated</p>
                    <p className="text-xs text-gray-500">5 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}