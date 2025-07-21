import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Brain, Target, Shield, Users, Zap, BarChart3, Globe } from "lucide-react";

export function LeadGenLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LeadGen.to
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#platforms" className="text-gray-600 hover:text-blue-600 transition-colors">Platforms</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
            <Link href="/brezcode">
              <Button variant="outline">Demo Platform</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200">
            🚀 AI-Powered Health Platforms
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            Build Your Own
            <br />
            Health Assessment Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Launch white-label health and wellness platforms with Claude AI-powered assessments, 
            personalized recommendations, and comprehensive analytics. Perfect for healthcare brands, 
            wellness coaches, and medical organizations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/brezcode">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8">
                Try Live Demo
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8">
              Schedule Demo Call
            </Button>
          </div>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">99%</div>
              <div className="text-sm text-gray-600">User Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">500+</div>
              <div className="text-sm text-gray-600">Health Assessments</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600">24/7</div>
              <div className="text-sm text-gray-600">AI Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">HIPAA</div>
              <div className="text-sm text-gray-600">Compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Everything You Need for Health Platforms
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive suite of AI-powered features built with Claude for superior intelligence and accuracy
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Brain className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Claude AI Integration</CardTitle>
                <CardDescription>
                  Advanced AI powered by Anthropic's Claude for superior health coaching and recommendations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <Target className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Smart Assessments</CardTitle>
                <CardDescription>
                  Personalized health questionnaires with intelligent scoring and risk analysis
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-pink-200 transition-colors">
              <CardHeader>
                <Heart className="w-12 h-12 text-pink-600 mb-4" />
                <CardTitle>Dietary Recommendations</CardTitle>
                <CardDescription>
                  AI-powered meal planning with photo analysis and nutritional breakdowns
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <Shield className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>HIPAA Compliance</CardTitle>
                <CardDescription>
                  Enterprise-grade security with encrypted data and compliance management
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-yellow-200 transition-colors">
              <CardHeader>
                <Users className="w-12 h-12 text-yellow-600 mb-4" />
                <CardTitle>Multi-Tenant Platform</CardTitle>
                <CardDescription>
                  White-label solutions with custom branding for unlimited client organizations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-indigo-200 transition-colors">
              <CardHeader>
                <BarChart3 className="w-12 h-12 text-indigo-600 mb-4" />
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>
                  Comprehensive reporting and insights for health outcomes and user engagement
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Live Platforms Section */}
      <section id="platforms" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Live Health Platforms
            </h2>
            <p className="text-xl text-gray-600">
              Explore our deployed health assessment platforms in action
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-6 text-white">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">BrezCode</h3>
                    <p className="text-pink-100">Breast Health Assessment</p>
                  </div>
                </div>
                <p className="text-pink-100 mb-6">
                  Comprehensive breast health assessment with AI-powered risk analysis and personalized recommendations
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    Risk Assessment
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    Health Coaching
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    Meal Planning
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold text-green-600">✓ Live Platform</span>
                    <br />
                    Multi-language support • Apple Health integration
                  </div>
                  <Link href="/brezcode">
                    <Button className="bg-pink-600 hover:bg-pink-700">
                      Explore Platform
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-2 border-dashed border-gray-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Your Platform Here</h3>
                <p className="text-gray-600 mb-6">
                  Launch your own branded health assessment platform with custom questionnaires, 
                  AI recommendations, and comprehensive analytics.
                </p>
                <div className="space-y-2 text-sm text-gray-500 mb-6">
                  <div>• Custom branding & domain</div>
                  <div>• Tailored health focus areas</div>
                  <div>• Integrated payment processing</div>
                  <div>• Advanced reporting dashboard</div>
                </div>
                <Button variant="outline" className="w-full">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Powered by Advanced AI Technology
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Built with Claude AI for superior intelligence and medical accuracy
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-lg border bg-gradient-to-br from-blue-50 to-purple-50">
              <Brain className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="font-semibold text-gray-900">Claude AI</div>
              <div className="text-sm text-gray-600">Advanced reasoning</div>
            </div>
            <div className="p-6 rounded-lg border">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="font-semibold text-gray-900">HIPAA Secure</div>
              <div className="text-sm text-gray-600">Enterprise security</div>
            </div>
            <div className="p-6 rounded-lg border">
              <Globe className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <div className="font-semibold text-gray-900">Multi-language</div>
              <div className="text-sm text-gray-600">Global accessibility</div>
            </div>
            <div className="p-6 rounded-lg border">
              <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
              <div className="font-semibold text-gray-900">Real-time</div>
              <div className="text-sm text-gray-600">Instant responses</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Launch Your Health Platform?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join forward-thinking healthcare organizations using our AI-powered platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/brezcode">
              <Button size="lg" variant="secondary" className="px-8">
                Try Live Demo
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 text-white border-white hover:bg-white hover:text-blue-600">
              Schedule Consultation
            </Button>
          </div>
          <div className="mt-8 text-sm text-blue-200">
            No credit card required • HIPAA compliant • 30-day free trial
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">LeadGen.to</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered health assessment platforms for the modern healthcare industry.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platforms</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/brezcode" className="hover:text-white transition-colors">BrezCode</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Custom Platform</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">AI Assessments</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Health Coaching</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Multi-tenant</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            © 2025 LeadGen.to. All rights reserved. | Powered by Claude AI
          </div>
        </div>
      </footer>
    </div>
  );
}