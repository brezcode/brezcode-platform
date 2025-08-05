// BREZCODE AI TRAINING DASHBOARD
// Dr. Sakura training management interface
// Adapted from LeadGen AI training for health coaching scenarios

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  Play, 
  Pause, 
  Clock, 
  Target, 
  Heart, 
  MessageSquare,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react'

interface TrainingScenario {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  healthFocus: string
  estimatedDuration: number
  objectives: string[]
}

interface TrainingSession {
  id: string
  scenarioId: string
  status: 'active' | 'completed' | 'paused'
  startedAt: string
  completedAt?: string
  performanceMetrics: {
    empathyScore: number
    accuracyScore: number
    responseTime: number
    patientSatisfaction: number
  }
}

export default function BrezCodeAITrainingDashboard() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [activeSession, setActiveSession] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Fetch available training scenarios
  const { data: scenarios, isLoading: scenariosLoading } = useQuery({
    queryKey: ['brezcode-training-scenarios'],
    queryFn: async () => {
      const response = await fetch('/api/brezcode/ai-training/scenarios')
      if (!response.ok) throw new Error('Failed to fetch scenarios')
      return response.json() as TrainingScenario[]
    }
  })

  // Fetch user's training sessions
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['brezcode-training-sessions'],
    queryFn: async () => {
      const response = await fetch('/api/brezcode/ai-training/sessions')
      if (!response.ok) throw new Error('Failed to fetch sessions')
      return response.json() as TrainingSession[]
    }
  })

  // Start training session mutation
  const startSessionMutation = useMutation({
    mutationFn: async (scenarioId: string) => {
      const response = await fetch('/api/brezcode/ai-training/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId })
      })
      if (!response.ok) throw new Error('Failed to start session')
      return response.json()
    },
    onSuccess: (data) => {
      setActiveSession(data.sessionId)
      queryClient.invalidateQueries({ queryKey: ['brezcode-training-sessions'] })
    }
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'active': return <Play className="h-4 w-4 text-blue-600" />
      case 'paused': return <Pause className="h-4 w-4 text-yellow-600" />
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  if (scenariosLoading || sessionsLoading) {
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
            Dr. Sakura AI Training
          </h1>
          <p className="text-gray-600">
            Train and improve AI coaching responses for breast health consultations
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Training Scenarios</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scenarios?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Available scenarios</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sessions?.filter(s => s.status === 'completed').length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Training completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Empathy Score</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sessions?.length > 0 
                  ? (sessions.reduce((sum, s) => sum + s.performanceMetrics.empathyScore, 0) / sessions.length).toFixed(1)
                  : '0.0'}
              </div>
              <p className="text-xs text-muted-foreground">Out of 10</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patient Satisfaction</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sessions?.length > 0 
                  ? (sessions.reduce((sum, s) => sum + s.performanceMetrics.patientSatisfaction, 0) / sessions.length).toFixed(1)
                  : '0.0'}
              </div>
              <p className="text-xs text-muted-foreground">Out of 5</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="scenarios" className="space-y-6">
          <TabsList>
            <TabsTrigger value="scenarios">Training Scenarios</TabsTrigger>
            <TabsTrigger value="sessions">Training History</TabsTrigger>
            <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
          </TabsList>

          {/* Training Scenarios Tab */}
          <TabsContent value="scenarios" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {scenarios?.map((scenario) => (
                <Card key={scenario.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{scenario.title}</CardTitle>
                      <Badge className={getDifficultyColor(scenario.difficulty)}>
                        {scenario.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>{scenario.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Heart className="h-4 w-4 mr-2" />
                        Focus: {scenario.healthFocus}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        Duration: {scenario.estimatedDuration} minutes
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Objectives:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {scenario.objectives.slice(0, 3).map((objective, index) => (
                            <li key={index} className="flex items-start">
                              <Target className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
                              {objective}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => startSessionMutation.mutate(scenario.id)}
                        disabled={startSessionMutation.isPending}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Training
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Training History Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Training Session History</CardTitle>
                <CardDescription>Review your past training sessions and performance</CardDescription>
              </CardHeader>
              <CardContent>
                {sessions && sessions.length > 0 ? (
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(session.status)}
                              <span className="font-medium">
                                Session {session.id.split('-').pop()}
                              </span>
                              <Badge variant="outline">{session.status}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              Started: {new Date(session.startedAt).toLocaleString()}
                            </p>
                            {session.completedAt && (
                              <p className="text-sm text-gray-600">
                                Completed: {new Date(session.completedAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div className="text-right space-y-1">
                            <div className="text-sm">
                              <span className="text-gray-600">Empathy:</span> 
                              <span className="font-medium ml-1">
                                {session.performanceMetrics.empathyScore}/10
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">Accuracy:</span> 
                              <span className="font-medium ml-1">
                                {session.performanceMetrics.accuracyScore}/10
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">Satisfaction:</span> 
                              <span className="font-medium ml-1">
                                {session.performanceMetrics.patientSatisfaction}/5
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                    <p>No training sessions yet</p>
                    <p className="text-sm">Start your first training scenario to begin</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Analytics Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Track your AI training improvement over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                    <p>Performance analytics coming soon</p>
                    <p className="text-sm">Track your progress and identify improvement areas</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Training Recommendations</CardTitle>
                  <CardDescription>Personalized suggestions for improvement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">
                        Practice Empathetic Responses
                      </p>
                      <p className="text-xs text-blue-600">
                        Focus on acknowledging patient emotions and concerns
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm font-medium text-purple-800">
                        Medical Accuracy Review
                      </p>
                      <p className="text-xs text-purple-600">
                        Review breast health guidelines and risk factors
                      </p>
                    </div>
                    <div className="p-3 bg-pink-50 rounded-lg">
                      <p className="text-sm font-medium text-pink-800">
                        Patient Communication
                      </p>
                      <p className="text-xs text-pink-600">
                        Practice explaining complex health concepts simply
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}