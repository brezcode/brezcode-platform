import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Camera, Brain, Star, Award, Shield, Zap, Users, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';

export default function SkinCoachLanding() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
            ✨ Revolutionary AI Skin Analysis
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
            Transform Your Skin with AI-Powered Coaching
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get personalized acne analysis using Skyn AI technology. Simply take a photo and receive comprehensive acne severity assessment with expert treatment recommendations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              onClick={() => setLocation('/skincoach/camera')}
            >
              <Camera className="mr-2 h-5 w-5" />
              Start Your Acne Analysis
            </Button>
            
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              onClick={() => setLocation('/skin-lesion-test')}
            >
              🔍 Skin Lesion Test
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-4 text-lg font-semibold rounded-full"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See How It Works
            </Button>
          </div>
          
          <div className="flex justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Instant Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span>100% Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-500" />
              <span>Expert Approved</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our advanced AI technology analyzes your skin in seconds to provide personalized recommendations
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-2 border-pink-100 hover:border-pink-300 transition-colors duration-300 hover:shadow-lg">
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="h-10 w-10 text-pink-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">1. Take a Photo</h3>
              <p className="text-gray-600 leading-relaxed">
                Use your phone camera to capture a clear image of your face. Our AI works with any lighting condition.
              </p>
            </Card>
            
            <Card className="text-center p-8 border-2 border-purple-100 hover:border-purple-300 transition-colors duration-300 hover:shadow-lg">
              <div className="bg-gradient-to-br from-purple-100 to-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">2. AI Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced algorithms analyze acne, wrinkles, dark spots, redness, and more to create your skin profile.
              </p>
            </Card>
            
            <Card className="text-center p-8 border-2 border-indigo-100 hover:border-indigo-300 transition-colors duration-300 hover:shadow-lg">
              <div className="bg-gradient-to-br from-indigo-100 to-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">3. Get Results</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive detailed scores and personalized product recommendations tailored to your unique skin needs.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              10,000+ Happy Users
            </h2>
            <p className="text-xl text-gray-600">
              See what our users are saying about their skin transformation
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                rating: 5,
                review: "Amazing accuracy! The AI detected issues I hadn't even noticed. My skin has never looked better after following the recommendations.",
                improvement: "85% improvement in 30 days"
              },
              {
                name: "Emily Chen",
                rating: 5,
                review: "I was skeptical at first, but the detailed analysis was spot-on. The product recommendations actually work!",
                improvement: "90% reduction in acne"
              },
              {
                name: "Jessica Martinez",
                rating: 5,
                review: "The most comprehensive skin analysis I've ever had. Better than my dermatologist visit and much more convenient.",
                improvement: "70% less dark spots"
              }
            ].map((review, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400 mr-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      {review.improvement}
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed italic">
                    "{review.review}"
                  </p>
                  <p className="font-semibold text-gray-900">{review.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Powered by Advanced AI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our technology uses state-of-the-art machine learning models trained on millions of skin images
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-3 rounded-lg">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Multi-Factor Analysis</h3>
                  <p className="text-gray-600">
                    Analyzes acne, wrinkles, sagging, redness, dark spots, dark circles, eye bags, and more
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-green-100 to-teal-100 p-3 rounded-lg">
                  <Brain className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Open Source Models</h3>
                  <p className="text-gray-600">
                    Integrates SkinAI, skin-lesion-analyser, and skyn for comprehensive analysis
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Privacy First</h3>
                  <p className="text-gray-600">
                    All analysis happens securely with no image storage or data sharing
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-orange-100 to-red-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Expert Validated</h3>
                  <p className="text-gray-600">
                    Recommendations reviewed and approved by certified dermatologists
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Analysis Capabilities</h3>
              <div className="space-y-4">
                {[
                  { metric: "Acne Detection", accuracy: "96%" },
                  { metric: "Wrinkle Analysis", accuracy: "94%" },
                  { metric: "Dark Spot Recognition", accuracy: "98%" },
                  { metric: "Redness Assessment", accuracy: "92%" },
                  { metric: "Skin Texture Analysis", accuracy: "95%" },
                  { metric: "Age Prediction", accuracy: "89%" }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">{item.metric}</span>
                    <Badge className="bg-green-100 text-green-700 font-semibold">
                      {item.accuracy}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Get professional-grade skin analysis at a fraction of the cost
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-2 border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Single Analysis</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">$9.99</span>
                  </div>
                  <ul className="space-y-3 mb-8 text-left">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Complete skin analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Personalized recommendations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Product suggestions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Detailed report</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                    onClick={() => setLocation('/skincoach/camera')}
                  >
                    Get Started
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-8 border-4 border-gradient-to-r from-pink-500 to-purple-500 relative hover:shadow-xl transition-shadow duration-300">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1">
                MOST POPULAR
              </Badge>
              <CardContent className="p-0">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Monthly Coaching</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">$19.99</span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8 text-left">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Unlimited skin analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Progress tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Weekly skin check-ins</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Personalized routines</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Expert support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Product discounts</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                    onClick={() => setLocation('/skincoach/camera')}
                  >
                    <ArrowRight className="mr-2 h-5 w-5" />
                    Start Free Trial
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SkinCoach AI</h3>
              <p className="text-gray-400 leading-relaxed">
                Revolutionary AI-powered skin analysis and personalized skincare recommendations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Skin Analysis</li>
                <li>Product Recommendations</li>
                <li>Progress Tracking</li>
                <li>Expert Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Scientific Studies</li>
                <li>Accuracy Reports</li>
                <li>Dermatologist Reviews</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SkinCoach AI. All rights reserved. *Results may vary. Individual results depend on skin type, age, and consistency of use.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}