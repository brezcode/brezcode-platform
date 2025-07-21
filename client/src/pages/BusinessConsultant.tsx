import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, TrendingUp, Zap, ArrowRight, CheckCircle, Clock, Lightbulb } from "lucide-react";
import BusinessOnboarding from "@/components/BusinessOnboarding";

export default function BusinessConsultant() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  if (showOnboarding) {
    return <BusinessOnboarding />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Brain className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            AI Business Consultant
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Get personalized business strategies and let our AI platform execute them for you
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge className="px-4 py-2 text-sm bg-blue-100 text-blue-700">
              15-Minute Analysis
            </Badge>
            <Badge className="px-4 py-2 text-sm bg-green-100 text-green-700">
              AI-Powered Strategies
            </Badge>
            <Badge className="px-4 py-2 text-sm bg-purple-100 text-purple-700">
              Automated Execution
            </Badge>
          </div>

          <Button 
            size="lg" 
            className="px-8 py-4 text-lg font-semibold"
            onClick={() => setShowOnboarding(true)}
          >
            Start Business Analysis
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              How Our AI Consultant Works
            </h2>
            <p className="text-xl text-gray-600">
              From analysis to execution in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">1. Business Analysis</h3>
                <p className="text-gray-600 mb-4">
                  Answer 15 strategic questions about your business, goals, and challenges. 
                  Our AI analyzes your industry, competition, and growth opportunities.
                </p>
                <Badge variant="outline">5-10 minutes</Badge>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">2. Strategy Generation</h3>
                <p className="text-gray-600 mb-4">
                  Get 5-8 personalized strategies across marketing, sales, operations, and growth. 
                  Each includes action plans, timelines, and ROI estimates.
                </p>
                <Badge variant="outline">AI-powered</Badge>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">3. Automated Execution</h3>
                <p className="text-gray-600 mb-4">
                  Our platform automatically executes many strategies using AI avatars, 
                  landing pages, email campaigns, and multi-channel automation.
                </p>
                <Badge variant="outline">24/7 automation</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Strategy Categories */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Strategic Areas We Optimize
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive business growth across all key functions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Marketing & Lead Gen</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Lead generation automation</li>
                  <li>• Content marketing strategy</li>
                  <li>• Social media optimization</li>
                  <li>• Brand positioning</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Sales Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Sales funnel optimization</li>
                  <li>• CRM automation</li>
                  <li>• Follow-up sequences</li>
                  <li>• Conversion rate improvement</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Process automation</li>
                  <li>• Customer service AI</li>
                  <li>• Workflow optimization</li>
                  <li>• Team productivity</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                  <Brain className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Growth & Expansion</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Market expansion</li>
                  <li>• Product development</li>
                  <li>• Strategic partnerships</li>
                  <li>• Revenue diversification</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Results Preview */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              What You'll Get
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive business strategy with actionable implementation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Personalized Strategy Report</h3>
                  <p className="text-gray-600">
                    5-8 custom strategies with detailed action plans, timelines, and expected ROI for your specific business.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Automated Implementation</h3>
                  <p className="text-gray-600">
                    Many strategies can be executed automatically using our AI platform tools and automation capabilities.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Performance Tracking</h3>
                  <p className="text-gray-600">
                    KPI metrics and tracking systems to monitor progress and optimize your business growth continuously.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Quick Results</h3>
                  <p className="text-gray-600">
                    Get your complete business analysis and strategy within 15 minutes of completing the assessment.
                  </p>
                </div>
              </div>
            </div>

            <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
              <CardHeader className="text-center pb-6">
                <h3 className="text-2xl font-bold text-gray-900">Sample Strategy Output</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-red-100 text-red-700">High Priority</Badge>
                    <Badge variant="outline">Marketing</Badge>
                  </div>
                  <h4 className="font-semibold mb-2">Lead Generation Automation</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Implement AI chatbot and automated email sequences to capture and nurture leads 24/7.
                  </p>
                  <div className="text-xs text-gray-500">
                    <div><strong>Timeline:</strong> 2-3 weeks</div>
                    <div><strong>Expected Impact:</strong> 40% increase in qualified leads</div>
                    <div className="text-green-600"><strong>Automated:</strong> 85% of implementation</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get your personalized AI-powered business strategy in just 15 minutes
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="px-8 py-4 text-lg font-semibold"
            onClick={() => setShowOnboarding(true)}
          >
            Start Free Business Analysis
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <div className="mt-6 text-sm text-blue-200">
            No credit card required • Get results instantly • AI-powered insights
          </div>
        </div>
      </section>
    </div>
  );
}