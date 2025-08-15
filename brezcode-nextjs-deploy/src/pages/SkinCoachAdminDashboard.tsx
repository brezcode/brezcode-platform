import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  ShoppingBag, 
  Brain, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Download,
  MessageSquare,
  Target,
  TrendingUp,
  Award,
  CheckCircle,
  AlertCircle,
  Eye,
  Settings,
  Database,
  Bot
} from 'lucide-react';
import { useLocation } from 'wouter';

export default function SkinCoachAdminDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  // Mock data - in real app this would come from API
  const [dashboardStats] = useState({
    totalUsers: 15420,
    activeConversations: 342,
    totalAnalyses: 8760,
    productRecommendations: 12340,
    avgSatisfactionScore: 4.7,
    monthlyGrowth: 23.5
  });

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Gentle Foaming Cleanser',
      brand: 'CeraVe',
      category: 'cleanser',
      price: '$14.99',
      rating: 4.5,
      recommendations: 890,
      status: 'active'
    },
    {
      id: 2,
      name: 'Hyaluronic Acid 2% + B5',
      brand: 'The Ordinary',
      category: 'serum',
      price: '$8.90',
      rating: 4.3,
      recommendations: 1240,
      status: 'active'
    }
  ]);

  const [aiTrainingData, setAiTrainingData] = useState([
    {
      id: 1,
      type: 'conversation',
      input: 'I have acne on my forehead and chin',
      expectedOutput: 'Based on your acne pattern, I recommend starting with a gentle salicylic acid cleanser...',
      status: 'validated',
      feedbackScore: 5
    },
    {
      id: 2,
      type: 'product_knowledge',
      input: 'What ingredients help with dark spots?',
      expectedOutput: 'For dark spots, look for vitamin C, niacinamide, kojic acid, and arbutin...',
      status: 'pending',
      feedbackScore: null
    }
  ]);

  const handleProductAdd = () => {
    // Product add functionality
    console.log('Adding new product...');
  };

  const handleAiTraining = () => {
    // AI training functionality
    console.log('Starting AI training session...');
  };

  const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {change && (
              <div className={`flex items-center mt-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className="h-4 w-4 mr-1" />
                {change}% from last month
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              SkinCoach Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Manage AI coaching, products, and user analytics</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => setLocation('/skincoach')}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Frontend
            </Button>
            <Button 
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
              onClick={() => setActiveTab('ai-training')}
            >
              <Bot className="h-4 w-4 mr-2" />
              Train AI
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="ai-training" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Training
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Total Users"
                value={dashboardStats.totalUsers.toLocaleString()}
                change={dashboardStats.monthlyGrowth}
                icon={Users}
                color="bg-gradient-to-r from-blue-500 to-blue-600"
              />
              <StatCard
                title="Active Conversations"
                value={dashboardStats.activeConversations}
                change={15.2}
                icon={MessageSquare}
                color="bg-gradient-to-r from-green-500 to-green-600"
              />
              <StatCard
                title="Skin Analyses"
                value={dashboardStats.totalAnalyses.toLocaleString()}
                change={28.1}
                icon={Eye}
                color="bg-gradient-to-r from-purple-500 to-purple-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { action: 'New user registered', time: '2 minutes ago', type: 'user' },
                    { action: 'AI training completed', time: '15 minutes ago', type: 'training' },
                    { action: 'Product recommendation updated', time: '1 hour ago', type: 'product' },
                    { action: 'Skin analysis performed', time: '2 hours ago', type: 'analysis' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'user' ? 'bg-blue-500' :
                        activity.type === 'training' ? 'bg-purple-500' :
                        activity.type === 'product' ? 'bg-green-500' : 'bg-pink-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">AI Response Accuracy</span>
                    <Badge className="bg-green-100 text-green-700">94.2%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">User Satisfaction</span>
                    <Badge className="bg-blue-100 text-blue-700">4.7/5.0</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Product Click Rate</span>
                    <Badge className="bg-purple-100 text-purple-700">32.8%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Conversation Length</span>
                    <Badge className="bg-pink-100 text-pink-700">8.3 msg avg</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
              <Button 
                onClick={handleProductAdd}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.brand} • {product.category}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{product.price}</Badge>
                            <Badge variant="outline">★ {product.rating}</Badge>
                            <Badge variant="outline">{product.recommendations} recs</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                          {product.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Product Add Form */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Add Product</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="productName">Product Name</Label>
                    <Input id="productName" placeholder="Enter product name" />
                  </div>
                  <div>
                    <Label htmlFor="productBrand">Brand</Label>
                    <Input id="productBrand" placeholder="Enter brand name" />
                  </div>
                  <div>
                    <Label htmlFor="productCategory">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cleanser">Cleanser</SelectItem>
                        <SelectItem value="serum">Serum</SelectItem>
                        <SelectItem value="moisturizer">Moisturizer</SelectItem>
                        <SelectItem value="sunscreen">Sunscreen</SelectItem>
                        <SelectItem value="treatment">Treatment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="productPrice">Price</Label>
                    <Input id="productPrice" placeholder="$0.00" />
                  </div>
                  <div>
                    <Label htmlFor="productBudget">Budget Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="budget">Budget</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="productDescription">Description</Label>
                  <Textarea id="productDescription" placeholder="Enter product description" />
                </div>
                <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Training Tab */}
          <TabsContent value="ai-training" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">AI Training & Knowledge Base</h2>
              <Button 
                onClick={handleAiTraining}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              >
                <Brain className="h-4 w-4 mr-2" />
                Start Training Session
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-500" />
                    Training Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-2">2,340</div>
                  <p className="text-sm text-gray-600">Validated training examples</p>
                  <Button className="w-full mt-4" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Data
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-purple-500" />
                    Model Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-2">94.2%</div>
                  <p className="text-sm text-gray-600">Response accuracy</p>
                  <Button className="w-full mt-4" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Metrics
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Active Models
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-2">3</div>
                  <p className="text-sm text-gray-600">Production models</p>
                  <Button className="w-full mt-4" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Training Data Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiTrainingData.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={
                          item.type === 'conversation' ? 'bg-blue-100 text-blue-700' :
                          item.type === 'product_knowledge' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                        }>
                          {item.type.replace('_', ' ')}
                        </Badge>
                        <Badge className={item.status === 'validated' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                          {item.status}
                        </Badge>
                      </div>
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-700">Input:</p>
                        <p className="text-sm text-gray-600">{item.input}</p>
                      </div>
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-700">Expected Output:</p>
                        <p className="text-sm text-gray-600">{item.expectedOutput}</p>
                      </div>
                      {item.feedbackScore && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Feedback Score:</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-sm ${i < item.feedbackScore! ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Training Data
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Dataset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-blue-800">
                User management features are coming soon. This will include user analytics, conversation history, and support tools.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
            </div>

            <Alert className="border-purple-200 bg-purple-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-purple-800">
                Advanced analytics dashboard is under development. This will include detailed metrics, user behavior analysis, and business insights.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>AI Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="aiModel">AI Model</Label>
                  <Select defaultValue="gpt-4">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="responseLength">Max Response Length</Label>
                  <Input id="responseLength" type="number" defaultValue="500" />
                </div>
                <div>
                  <Label htmlFor="temperature">AI Temperature (Creativity)</Label>
                  <Input id="temperature" type="number" step="0.1" min="0" max="2" defaultValue="0.7" />
                </div>
                <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
                  Save Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}