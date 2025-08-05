// BREZCODE ADMIN DASHBOARD
// Backend management dashboard for BrezCode health platform
// Adapted from LeadGen business dashboard for health platform administration

import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Heart, 
  MessageSquare,
  Shield,
  Download,
  Settings,
  BarChart3,
  UserCheck,
  AlertTriangle
} from 'lucide-react'

interface AnalyticsData {
  totalUsers: number
  activeUsers: number
  assessmentsCompleted: number
  aiSessionsTotal: number
  subscriptionMetrics: {
    free: number
    premium: number
    family: number
  }
  healthMetrics: {
    lowRisk: number
    moderateRisk: number
    highRisk: number
  }
  engagementMetrics: {
    averageSessionDuration: number
    averageMessagesPerSession: number
    userSatisfactionScore: number
  }
}

interface UserData {
  id: number
  name: string
  email: string
  joinedDate: string
  lastActive: string
  riskLevel: string
  subscriptionTier: string
  assessmentsCompleted: number
  aiSessionsCount: number
  isActive: boolean
}

export default function BrezCodeAdminDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [dateRange, setDateRange] = useState('30d')

  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['brezcode-analytics', dateRange],
    queryFn: async () => {
      const response = await fetch(`/api/brezcode/admin/analytics?range=${dateRange}`)
      if (!response.ok) throw new Error('Failed to fetch analytics')
      return response.json() as AnalyticsData
    }
  })

  // Fetch user management data
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['brezcode-users'],
    queryFn: async () => {
      const response = await fetch('/api/brezcode/admin/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      return response.json() as { users: UserData[], total: number }
    }
  })

  const exportData = async (format: 'csv' | 'json') => {
    try {
      const response = await fetch(`/api/brezcode/admin/export?format=${format}`)
      const data = await response.text()
      
      const blob = new Blob([data], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `brezcode-users-${new Date().toISOString().split('T')[0]}.${format}`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  if (analyticsLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            BrezCode Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your breast health platform, monitor user engagement, and track health outcomes
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.activeUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Assessments</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.assessmentsCompleted || 0}</div>
              <p className="text-xs text-muted-foreground">
                Completed this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Coaching Sessions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.aiSessionsTotal || 0}</div>
              <p className="text-xs text-muted-foreground">
                Dr. Sakura interactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="health">Health Analytics</TabsTrigger>
            <TabsTrigger value="ai-training">AI Training</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subscription Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Distribution</CardTitle>
                  <CardDescription>User subscription tiers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Free Users</span>
                      <Badge variant="secondary">{analytics?.subscriptionMetrics.free || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Premium Users</span>
                      <Badge variant="default">{analytics?.subscriptionMetrics.premium || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Family Plans</span>
                      <Badge variant="outline">{analytics?.subscriptionMetrics.family || 0}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Health Risk Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Level Distribution</CardTitle>
                  <CardDescription>User health risk categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Low Risk</span>
                      <Badge className="bg-green-100 text-green-800">
                        {analytics?.healthMetrics.lowRisk || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Moderate Risk</span>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {analytics?.healthMetrics.moderateRisk || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>High Risk</span>
                      <Badge className="bg-red-100 text-red-800">
                        {analytics?.healthMetrics.highRisk || 0}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Metrics */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Engagement Analytics</CardTitle>
                  <CardDescription>User interaction and satisfaction metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {analytics?.engagementMetrics.averageSessionDuration || 0}m
                      </div>
                      <p className="text-sm text-gray-600">Avg Session Duration</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {analytics?.engagementMetrics.averageMessagesPerSession || 0}
                      </div>
                      <p className="text-sm text-gray-600">Messages per Session</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-600">
                        {analytics?.engagementMetrics.userSatisfactionScore || 0}/5
                      </div>
                      <p className="text-sm text-gray-600">Satisfaction Score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">User Management</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => exportData('csv')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" onClick={() => exportData('json')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>User List</CardTitle>
                <CardDescription>Manage BrezCode health platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Risk Level</th>
                        <th className="text-left p-2">Subscription</th>
                        <th className="text-left p-2">Assessments</th>
                        <th className="text-left p-2">AI Sessions</th>
                        <th className="text-left p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users?.users?.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">{user.name}</td>
                          <td className="p-2">{user.email}</td>
                          <td className="p-2">
                            <Badge 
                              className={
                                user.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                                user.riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }
                            >
                              {user.riskLevel}
                            </Badge>
                          </td>
                          <td className="p-2">{user.subscriptionTier}</td>
                          <td className="p-2">{user.assessmentsCompleted}</td>
                          <td className="p-2">{user.aiSessionsCount}</td>
                          <td className="p-2">
                            {user.isActive ? (
                              <UserCheck className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Analytics Tab */}
          <TabsContent value="health" className="space-y-6">
            <h2 className="text-2xl font-bold">Health Analytics</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Health Outcomes Tracking</CardTitle>
                <CardDescription>Monitor user health progression and platform effectiveness</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                  <p>Health analytics dashboard coming soon</p>
                  <p className="text-sm">Track user health improvements and platform impact</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Training Tab */}
          <TabsContent value="ai-training" className="space-y-6">
            <h2 className="text-2xl font-bold">AI Training Management</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Dr. Sakura Training Dashboard</CardTitle>
                <CardDescription>Manage AI coaching training scenarios and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                  <p>AI training dashboard coming soon</p>
                  <p className="text-sm">Train and optimize Dr. Sakura's responses</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Platform Settings</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>BrezCode Configuration</CardTitle>
                <CardDescription>Manage platform settings and configurations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-4" />
                  <p>Settings panel coming soon</p>
                  <p className="text-sm">Configure platform behavior and features</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}