import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Activity, Users, Brain, Heart, TrendingUp, CheckCircle } from 'lucide-react'

export default function BrezCodeAdminDemo() {
  const [testResults, setTestResults] = useState<Record<string, any>>({})
  const [testing, setTesting] = useState(false)

  const runSystemTest = async (testName: string, endpoint: string) => {
    setTesting(true)
    try {
      const response = await fetch(endpoint)
      const data = await response.json()
      
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          status: response.ok ? 'success' : 'error',
          data: response.ok ? data : `Error ${response.status}`,
          timestamp: new Date().toLocaleTimeString()
        }
      }))
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          status: 'error',
          data: `Connection error: ${error.message}`,
          timestamp: new Date().toLocaleTimeString()
        }
      }))
    }
    setTesting(false)
  }

  const testAnalytics = () => runSystemTest('analytics', '/api/brezcode/admin/analytics')
  const testUsers = () => runSystemTest('users', '/api/brezcode/admin/users')
  const testTraining = () => runSystemTest('training', '/api/brezcode/admin/ai-training/scenarios')
  const testAvatars = () => runSystemTest('avatars', '/api/brezcode/admin/avatars')
  const testHealthData = () => runSystemTest('health', '/api/brezcode/admin/health-trends')

  const systemComponents = [
    {
      name: 'Analytics Dashboard',
      icon: TrendingUp,
      description: 'Health metrics and business intelligence',
      test: testAnalytics,
      key: 'analytics'
    },
    {
      name: 'User Management',
      icon: Users,
      description: 'Complete user lifecycle management',
      test: testUsers,
      key: 'users'
    },
    {
      name: 'AI Training Platform',
      icon: Brain,
      description: 'Dr. Sakura training and optimization',
      test: testTraining,
      key: 'training'
    },
    {
      name: 'Avatar Management',
      icon: Activity,
      description: 'Health coaching avatars',
      test: testAvatars,
      key: 'avatars'
    },
    {
      name: 'Health Analytics',
      icon: Heart,
      description: 'Population health and outcomes',
      test: testHealthData,
      key: 'health'
    }
  ]

  const getStatusBadge = (key: string) => {
    const result = testResults[key]
    if (!result) return <Badge variant="outline">Not Tested</Badge>
    
    return result.status === 'success' 
      ? <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Working</Badge>
      : <Badge variant="destructive">Error</Badge>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏥 BrezCode Backend Management System
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Complete administrative platform for breast health coaching
          </p>
          <div className="flex justify-center gap-4">
            <Badge className="bg-green-500 text-white px-4 py-2">
              Server Running on Port 5000
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              8 Core Services Implemented
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              Independent Platform Architecture
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="testing">Live Testing</TabsTrigger>
            <TabsTrigger value="services">Backend Services</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemComponents.map((component) => {
                const Icon = component.icon
                return (
                  <Card key={component.key} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-pink-600" />
                        {component.name}
                      </CardTitle>
                      <CardDescription>{component.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <Button 
                          onClick={component.test}
                          disabled={testing}
                          variant="outline"
                          size="sm"
                        >
                          Test System
                        </Button>
                        {getStatusBadge(component.key)}
                      </div>
                      {testResults[component.key] && (
                        <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                          <div className="font-medium">Last Test: {testResults[component.key].timestamp}</div>
                          <div className="text-gray-600 mt-1 truncate">
                            {typeof testResults[component.key].data === 'object' 
                              ? 'System responding with data...' 
                              : testResults[component.key].data}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="testing" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Live System Testing</CardTitle>
                <CardDescription>
                  Test all BrezCode backend endpoints and verify functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={() => {
                      systemComponents.forEach(component => {
                        setTimeout(component.test, Math.random() * 1000)
                      })
                    }}
                    disabled={testing}
                    className="w-full"
                  >
                    Run All System Tests
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(testResults).map(([key, result]) => (
                      <div key={key} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium capitalize">{key} System</h4>
                          {getStatusBadge(key)}
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>Last tested: {result.timestamp}</div>
                          {result.status === 'success' && typeof result.data === 'object' && (
                            <div className="mt-2 p-2 bg-green-50 rounded text-xs">
                              ✅ Backend service responding with valid data structure
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Core Backend Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>BrezCode Database Connection</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>AI Training Service (Dr. Sakura)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Avatar Management System</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>User Management Service</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Health Analytics Engine</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Notification Service</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Content Management System</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Business Dashboard Service</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Endpoints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm font-mono">
                    <div>/api/brezcode/admin/analytics</div>
                    <div>/api/brezcode/admin/users</div>
                    <div>/api/brezcode/admin/ai-training/*</div>
                    <div>/api/brezcode/admin/avatars</div>
                    <div>/api/brezcode/admin/health-analytics/*</div>
                    <div>/api/brezcode/admin/content</div>
                    <div>/api/brezcode/admin/notifications</div>
                    <div>/api/brezcode/avatar/dr-sakura/*</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="architecture" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Architecture</CardTitle>
                <CardDescription>
                  BrezCode operates as a completely independent health platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Dual Platform Design</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-pink-200 rounded-lg bg-pink-50">
                        <h5 className="font-medium text-pink-800">BrezCode Health Platform</h5>
                        <ul className="text-sm text-pink-700 mt-2 space-y-1">
                          <li>• Breast health coaching</li>
                          <li>• Dr. Sakura AI assistant</li>
                          <li>• Health assessments</li>
                          <li>• Personal health journey tracking</li>
                        </ul>
                      </div>
                      <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                        <h5 className="font-medium text-blue-800">LeadGen.to Business Platform</h5>
                        <ul className="text-sm text-blue-700 mt-2 space-y-1">
                          <li>• Business automation</li>
                          <li>• Lead generation</li>
                          <li>• CRM and sales tools</li>
                          <li>• Business analytics</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg mb-2">Key Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-gray-50 rounded">
                        <h5 className="font-medium">Complete Independence</h5>
                        <p className="text-sm text-gray-600">Separate databases, user systems, and feature sets</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <h5 className="font-medium">Health-Focused Backend</h5>
                        <p className="text-sm text-gray-600">AI training, analytics, and content management</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <h5 className="font-medium">Professional Tools</h5>
                        <p className="text-sm text-gray-600">Admin dashboard and management interface</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}