import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Brain, Target, Shield, Users, Zap, BarChart3, Globe, Store, MessageSquare, Calendar, Mail, Phone, Linkedin, Image, CreditCard } from "lucide-react";

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
            🚀 Ultimate Business AI Platform
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            The Ultimate Business
            <br />
            AI Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Create landing pages, manage products, generate leads, handle sales, provide customer service, 
            and engage customers with AI-powered content. Connect to email, SMS, WhatsApp, LinkedIn, and more.
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
              <div className="text-3xl font-bold text-blue-600">10K+</div>
              <div className="text-sm text-gray-600">Businesses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">300%</div>
              <div className="text-sm text-gray-600">Lead Increase</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600">24/7</div>
              <div className="text-sm text-gray-600">AI Assistant</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">AI</div>
              <div className="text-sm text-gray-600">Powered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Everything You Need to Run Your Business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete business automation platform with AI avatar, lead generation, sales management, and customer engagement
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Brain className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>AI Avatar Assistant</CardTitle>
                <CardDescription>
                  Claude-powered virtual assistant that handles customer service, sales, and engagement 24/7
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <Store className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Landing Pages & Catalog</CardTitle>
                <CardDescription>
                  Create stunning landing pages and product catalogs with AI-generated content and images
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-pink-200 transition-colors">
              <CardHeader>
                <Target className="w-12 h-12 text-pink-600 mb-4" />
                <CardTitle>Lead Generation</CardTitle>
                <CardDescription>
                  Capture, qualify, and nurture leads automatically with intelligent forms and AI follow-up
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <CreditCard className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Sales Management</CardTitle>
                <CardDescription>
                  Complete CRM with pipeline management, automated follow-ups, and payment processing
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-yellow-200 transition-colors">
              <CardHeader>
                <Calendar className="w-12 h-12 text-yellow-600 mb-4" />
                <CardTitle>Booking Service</CardTitle>
                <CardDescription>
                  Automated appointment scheduling with calendar integration and reminder notifications
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-indigo-200 transition-colors">
              <CardHeader>
                <MessageSquare className="w-12 h-12 text-indigo-600 mb-4" />
                <CardTitle>Multi-Channel Engagement</CardTitle>
                <CardDescription>
                  Connect email, SMS, WhatsApp, LinkedIn with AI-generated daily content and campaigns
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
              Business Solutions & Tools
            </h2>
            <p className="text-xl text-gray-600">
              Explore our AI-powered business automation tools and integrations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">AI Business Suite</h3>
                    <p className="text-blue-100">Complete Business Automation</p>
                  </div>
                </div>
                <p className="text-blue-100 mb-6">
                  End-to-end business platform with AI avatar, lead generation, sales management, and multi-channel customer engagement
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    AI Avatar
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    Lead Generation
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    Sales CRM
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    Multi-Channel
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold text-green-600">✓ Coming Soon</span>
                    <br />
                    Email • SMS • WhatsApp • LinkedIn integration
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Join Waitlist
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-2 border-dashed border-gray-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Your Business Here</h3>
                <p className="text-gray-600 mb-6">
                  Launch your complete business automation platform with AI avatar, landing pages, 
                  lead generation, and customer engagement tools.
                </p>
                <div className="space-y-2 text-sm text-gray-500 mb-6">
                  <div>• AI-powered landing pages</div>
                  <div>• Automated lead capture</div>
                  <div>• Multi-channel messaging</div>
                  <div>• Sales pipeline management</div>
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
            Built with Claude AI for intelligent business automation and customer engagement
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-lg border bg-gradient-to-br from-blue-50 to-purple-50">
              <Brain className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="font-semibold text-gray-900">Claude AI</div>
              <div className="text-sm text-gray-600">Advanced business AI</div>
            </div>
            <div className="p-6 rounded-lg border">
              <Mail className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="font-semibold text-gray-900">Multi-Channel</div>
              <div className="text-sm text-gray-600">Email, SMS, WhatsApp</div>
            </div>
            <div className="p-6 rounded-lg border">
              <Image className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <div className="font-semibold text-gray-900">AI Content</div>
              <div className="text-sm text-gray-600">Images & copy</div>
            </div>
            <div className="p-6 rounded-lg border">
              <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
              <div className="font-semibold text-gray-900">Automation</div>
              <div className="text-sm text-gray-600">24/7 operations</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Automate Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses using AI to generate leads, manage sales, and engage customers
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
            No credit card required • 30-day free trial • Cancel anytime
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
                Complete AI business automation platform for modern entrepreneurs and enterprises.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Landing Pages</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Lead Generation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sales CRM</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Avatar</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Integrations</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Email Marketing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">SMS & WhatsApp</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
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