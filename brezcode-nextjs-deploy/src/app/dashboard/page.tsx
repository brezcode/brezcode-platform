'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Brain, Users, TrendingUp, MessageSquare, Calendar, BookOpen, Settings, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const brezCodeStats = {
    totalUsers: 1247,
    activeAssessments: 89,
    completionRate: 94,
    avgHealthScore: 82,
    weeklyGrowth: 12,
    customerSatisfaction: 4.8,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">BrezCode Platform</h1>
          <p className="text-green-600 text-lg">AI-Powered Breast Health Management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-400 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{brezCodeStats.totalUsers.toLocaleString()}</div>
              <p className="text-green-100 text-xs">+{brezCodeStats.weeklyGrowth}% this week</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-400 to-pink-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Active Assessments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{brezCodeStats.activeAssessments}</div>
              <p className="text-pink-100 text-xs">Health evaluations in progress</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{brezCodeStats.completionRate}%</div>
              <p className="text-blue-100 text-xs">Assessment completion</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-400 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Avg Health Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{brezCodeStats.avgHealthScore}/100</div>
              <p className="text-purple-100 text-xs">Platform average</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-800">Quick Actions</CardTitle>
              <CardDescription>Access key platform features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => router.push('/health-assessment')}
                className="w-full justify-start bg-green-600 hover:bg-green-700"
              >
                <Heart className="mr-2 h-4 w-4" />
                Start Health Assessment
              </Button>
              <Button 
                onClick={() => router.push('/avatar-training')}
                variant="outline" 
                className="w-full justify-start"
              >
                <Brain className="mr-2 h-4 w-4" />
                AI Avatar Training
              </Button>
              <Button 
                onClick={() => router.push('/analytics')}
                variant="outline" 
                className="w-full justify-start"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-green-800">Platform Status</CardTitle>
              <CardDescription>System health and performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">User Engagement</span>
                  <span className="text-sm font-medium">94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">System Health</span>
                  <span className="text-sm font-medium">98%</span>
                </div>
                <Progress value={98} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">AI Response Time</span>
                  <span className="text-sm font-medium">1.2s avg</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}