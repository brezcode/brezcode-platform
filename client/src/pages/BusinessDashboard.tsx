import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, Users, TrendingUp, MessageSquare, Mail, Phone, 
  Calendar, Target, Zap, Settings, Brain, Store, CreditCard,
  PlusCircle, Activity, CheckCircle, Clock, ArrowUpRight, User
} from "lucide-react";

export default function BusinessDashboard() {
  const { data: profile } = useQuery({
    queryKey: ["/api/user/profile"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/user/dashboard-stats"],
  });

  const { data: strategies } = useQuery({
    queryKey: ["/api/business/strategies"],
  });

  const { data: toolUsage } = useQuery({
    queryKey: ["/api/user/tool-usage"],
  });

  const quickActions = [
    {
      icon: Brain,
      title: "AI Avatar Assistant",
      description: "Configure your 24/7 virtual assistant",
      action: "Setup Assistant",
      href: "/avatar-setup",
      color: "blue",
      status: "available"
    },
    {
      icon: Store,
      title: "Landing Page Builder",
      description: "Create stunning pages with AI content",
      action: "Create Page",
      href: "/landing-builder",
      color: "purple",
      status: "available"
    },
    {
      icon: Target,
      title: "Lead Generation",
      description: "Capture and qualify leads automatically",
      action: "Setup Leads",
      href: "/lead-gen",
      color: "green",
      status: "available"
    },
    {
      icon: CreditCard,
      title: "Sales CRM",
      description: "Manage pipeline and payments",
      action: "Open CRM",
      href: "/sales-crm",
      color: "orange",
      status: "available"
    },
    {
      icon: Calendar,
      title: "Booking System",
      description: "Automated scheduling with reminders",
      action: "Setup Booking",
      href: "/booking",
      color: "indigo",
      status: "available"
    },
    {
      icon: MessageSquare,
      title: "Multi-Channel Engagement",
      description: "Email, SMS, WhatsApp automation",
      action: "Configure Channels",
      href: "/engagement",
      color: "pink",
      status: "available"
    },
    {
      icon: Brain,
      title: "Business Avatars",
      description: "Manage your AI business avatars",
      action: "Manage Avatars",
      href: "/business-avatar-manager",
      color: "indigo",
      status: "available"
    },
    {
      icon: MessageSquare,
      title: "Avatar Training",
      description: "Train your AI avatars with realistic dialogue scenarios",
      action: "Start Training",
      href: "/business-avatar-training",
      color: "violet",
      status: "available"
    },
    {
      icon: User,
      title: "Personal Avatars",
      description: "Manage your personal AI assistants for life goals",
      action: "View Personal",
      href: "/personal-avatars",
      color: "pink",
      status: "available"
    }
  ];

  const recentStrategies = Array.isArray(strategies) ? strategies.slice(0, 3) : [];

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's how your business automation is performing.
          </p>
        </div>
        <div className="flex space-x-3">
          <Link href="/user-profile">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Profile Settings
            </Button>
          </Link>
          <Link href="/business-consultant">
            <Button>
              <Brain className="w-4 h-4 mr-2" />
              Get New Strategy
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Strategies</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats as any)?.totalStrategies || 0}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              Active business plans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tools</CardTitle>
            <Zap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats as any)?.activeTools || 0}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <Activity className="w-3 h-3 mr-1" />
              Automation running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Generated</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats as any)?.leadsGenerated || 0}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Closed</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats as any)?.salesClosed || 0}</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <CheckCircle className="w-3 h-3 mr-1" />
              Revenue generated
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span>Quick Actions</span>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Set up and manage your business automation tools
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <div
                      key={index}
                      className="p-6 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer group hover:shadow-md"
                    >
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors">
                          <IconComponent className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-lg">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {action.description}
                          </p>
                        </div>
                        <Link href={action.href} className="w-full">
                          <Button 
                            size="sm" 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4"
                          >
                            {action.action}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Strategies */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span>Recent Strategies</span>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Your latest AI-generated business strategies
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentStrategies.length > 0 ? (
                recentStrategies.map((strategy: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {strategy.category}
                      </Badge>
                      <Badge 
                        variant={strategy.priority === 'high' ? 'destructive' : 
                                strategy.priority === 'medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {strategy.priority}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm text-gray-900 mb-1">
                      {strategy.title}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {strategy.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Impact: {strategy.estimatedImpact}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {strategy.timeline}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-3">
                    No strategies yet. Get started with AI business consulting!
                  </p>
                  <Link href="/business-consultant">
                    <Button size="sm">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Generate Strategies
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tool Usage Analytics */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <span>Tool Usage & Performance</span>
            </CardTitle>
            <p className="text-sm text-gray-600">
              Track how your automation tools are performing
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <div className="flex flex-col space-y-3">
                <TabsList className="grid w-full grid-cols-2 h-auto p-2">
                  <TabsTrigger value="overview" className="flex items-center justify-center py-3">
                    <span>Performance Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="engagement" className="flex items-center justify-center py-3">
                    <span>Customer Engagement</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsList className="grid w-full grid-cols-2 h-auto p-2">
                  <TabsTrigger value="sales" className="flex items-center justify-center py-3">
                    <span>Sales Performance</span>
                  </TabsTrigger>
                  <TabsTrigger value="automation" className="flex items-center justify-center py-3">
                    <span>Automation Metrics</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>AI Avatar Interactions</span>
                      <span className="font-medium">{(stats as any)?.customerInteractions || 0}</span>
                    </div>
                    <Progress value={Math.min(100, ((stats as any)?.customerInteractions || 0) * 2)} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completed Actions</span>
                      <span className="font-medium">{(stats as any)?.completedActions || 0}</span>
                    </div>
                    <Progress value={Math.min(100, ((stats as any)?.completedActions || 0) * 5)} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tools Configured</span>
                      <span className="font-medium">{(stats as any)?.activeTools || 0}/6</span>
                    </div>
                    <Progress value={(((stats as any)?.activeTools || 0) / 6) * 100} />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="engagement" className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Engagement analytics will appear here once you configure your communication channels.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="sales" className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Sales performance will be tracked here once you set up your CRM and payment processing.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="automation" className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <Zap className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Automation metrics will be displayed once your tools are active and processing data.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}