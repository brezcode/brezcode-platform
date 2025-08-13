import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Heart, ShoppingCart, Users, Calendar, MessageCircle, Zap, Target } from 'lucide-react';

interface FeatureExample {
  id: string;
  name: string;
  description: string;
  icon: any;
  universalUse: string;
  brezcodeUse: string;
  ecommerceUse: string;
  consultingUse: string;
  isImplemented: boolean;
}

const features: FeatureExample[] = [
  {
    id: 'ai-avatar',
    name: 'AI Avatar Assistant',
    description: 'Intelligent virtual assistant powered by Claude AI',
    icon: Bot,
    universalUse: 'Handle customer service, sales inquiries, and lead qualification for any business type',
    brezcodeUse: 'Health coaching conversations, breast health education, personalized wellness guidance',
    ecommerceUse: 'Product recommendations, order support, inventory questions, return processing',
    consultingUse: 'Client onboarding, expertise sharing, appointment scheduling, progress tracking',
    isImplemented: true
  },
  {
    id: 'assessment-forms',
    name: 'Smart Assessment Forms',
    description: 'AI-powered forms that adapt based on user responses',
    icon: Target,
    universalUse: 'Lead qualification, customer needs analysis, service matching',
    brezcodeUse: 'Health risk assessments, symptom tracking, wellness evaluations',
    ecommerceUse: 'Product finder quizzes, size recommendations, preference profiling',
    consultingUse: 'Skills assessments, goal setting, progress evaluations',
    isImplemented: true
  },
  {
    id: 'content-generation',
    name: 'AI Content Creation',
    description: 'Automated content generation with industry customization',
    icon: Zap,
    universalUse: 'Blog posts, social media content, email campaigns, marketing copy',
    brezcodeUse: 'Health tips, wellness articles, educational content, prevention guides',
    ecommerceUse: 'Product descriptions, buying guides, seasonal promotions, reviews',
    consultingUse: 'Industry insights, case studies, thought leadership, client newsletters',
    isImplemented: true
  },
  {
    id: 'appointment-system',
    name: 'Smart Booking System',
    description: 'AI-enhanced scheduling with automatic optimization',
    icon: Calendar,
    universalUse: 'Automated scheduling, calendar management, reminder systems',
    brezcodeUse: 'Health check-up scheduling, therapy appointments, wellness consultations',
    ecommerceUse: 'Delivery scheduling, consultation calls, product demos, installations',
    consultingUse: 'Strategy sessions, review meetings, workshops, training calls',
    isImplemented: true
  },
  {
    id: 'analytics-dashboard',
    name: 'Performance Analytics',
    description: 'Real-time insights and automated reporting',
    icon: Users,
    universalUse: 'Customer behavior, sales metrics, engagement tracking, ROI analysis',
    brezcodeUse: 'Health progress tracking, wellness metrics, risk improvements, activity compliance',
    ecommerceUse: 'Sales performance, inventory turnover, customer lifetime value, conversion rates',
    consultingUse: 'Client progress, service effectiveness, business outcomes, satisfaction scores',
    isImplemented: true
  },
  {
    id: 'multi-channel',
    name: 'Multi-Channel Engagement',
    description: 'Coordinated communication across all platforms',
    icon: MessageCircle,
    universalUse: 'Email, SMS, WhatsApp, LinkedIn, social media automation',
    brezcodeUse: 'Health reminders, appointment notifications, wellness tips, support messages',
    ecommerceUse: 'Order updates, shipping notifications, promotional campaigns, customer support',
    consultingUse: 'Client check-ins, progress updates, industry insights, community building',
    isImplemented: true
  }
];

export function FeatureShowcase() {
  const [selectedFeature, setSelectedFeature] = useState(features[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            LeadGen.to Platform Architecture
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Universal business tools that adapt to any industry. Build once, use everywhere.
            BrezCode health coaching is just one example of how these tools can be specialized.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={feature.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedFeature.id === feature.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
                onClick={() => setSelectedFeature(feature)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                    <Badge variant={feature.isImplemented ? "default" : "secondary"}>
                      {feature.isImplemented ? "Ready" : "Planned"}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Feature View */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <selectedFeature.icon className="w-8 h-8 text-blue-600" />
              <div>
                <CardTitle className="text-2xl">{selectedFeature.name}</CardTitle>
                <p className="text-gray-600 mt-1">{selectedFeature.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="universal" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="universal">Universal Use</TabsTrigger>
                <TabsTrigger value="brezcode" className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  BrezCode
                </TabsTrigger>
                <TabsTrigger value="ecommerce" className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  E-commerce
                </TabsTrigger>
                <TabsTrigger value="consulting" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Consulting
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="universal" className="mt-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Universal Business Application</h3>
                  <p className="text-blue-800">{selectedFeature.universalUse}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="brezcode" className="mt-6">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2">Health & Wellness (BrezCode)</h3>
                  <p className="text-red-800">{selectedFeature.brezcodeUse}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="ecommerce" className="mt-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">E-commerce Application</h3>
                  <p className="text-green-800">{selectedFeature.ecommerceUse}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="consulting" className="mt-6">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">Consulting & Services</h3>
                  <p className="text-purple-800">{selectedFeature.consultingUse}</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Architecture Explanation */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Development Philosophy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <div>
                  <h4 className="font-medium">Build Universal Tools</h4>
                  <p className="text-sm text-gray-600">Every feature is designed as a reusable component that works across industries</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <h4 className="font-medium">Industry Customization</h4>
                  <p className="text-sm text-gray-600">Tools adapt their behavior, content, and interface for specific verticals</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                <div>
                  <h4 className="font-medium">Data Separation</h4>
                  <p className="text-sm text-gray-600">Platform maintains separate schemas while sharing core functionality</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">BrezCode as Example</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-red-500 mt-1" />
                <div>
                  <h4 className="font-medium">Health Vertical Specialization</h4>
                  <p className="text-sm text-gray-600">BrezCode demonstrates how universal tools become health-focused features</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <h4 className="font-medium">Same Core, Different Purpose</h4>
                  <p className="text-sm text-gray-600">AI Avatar becomes health coach, Forms become assessments, Analytics track wellness</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-yellow-500 mt-1" />
                <div>
                  <h4 className="font-medium">Rapid Deployment</h4>
                  <p className="text-sm text-gray-600">New businesses get sophisticated tools immediately, customized for their industry</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <Card className="inline-block">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Ready to Build Your Next Feature?</h3>
              <p className="text-gray-600 mb-4">
                Every feature you add becomes part of the LeadGen toolkit for all business types
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Start Building Universal Tools
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}