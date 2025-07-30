import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Shield, Brain, Users, ArrowRight, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function BrezCodeLanding() {
  const [, setLocation] = useLocation();
  const { login, isLoggingIn } = useAuth();
  const { toast } = useToast();
  
  const [showSignIn, setShowSignIn] = useState(false);
  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });

  // Check if user is already authenticated
  const { data: user } = useQuery({
    queryKey: ['/api/me'],
    retry: false,
  });

  // If user is authenticated, redirect to personal dashboard
  if (user && (user as any).id) {
    setTimeout(() => setLocation('/brezcode/personal-dashboard'), 0);
    return null;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(signInForm.email, signInForm.password);
      toast({
        title: "Welcome back!",
        description: "Redirecting to your personal health dashboard",
      });
      setLocation('/brezcode/personal-dashboard');
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    }
  };

  const handleStartQuiz = () => {
    setLocation('/brezcode/quiz');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                BrezCode
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {!showSignIn ? (
                <Button 
                  variant="outline" 
                  onClick={() => setShowSignIn(true)}
                  className="border-pink-200 text-pink-600 hover:bg-pink-50"
                >
                  Sign In
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  onClick={() => setShowSignIn(false)}
                  className="text-gray-600"
                >
                  Back to Home
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!showSignIn ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Your Personal
                <span className="block bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Breast Health Coach
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Empowering women with AI-powered health insights, personalized wellness plans, 
                and expert guidance for optimal breast health management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  onClick={handleStartQuiz}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold"
                >
                  Start Health Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setShowSignIn(true)}
                  className="border-pink-200 text-pink-600 hover:bg-pink-50 px-8 py-3 rounded-full text-lg"
                >
                  Already a Member? Sign In
                </Button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <Card className="border-pink-100 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">AI Health Coach</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Meet Dr. Sakura, your personal AI wellness coach providing 24/7 support, 
                    guidance, and evidence-based health recommendations.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-pink-100 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Comprehensive health assessment with personalized risk analysis 
                    and actionable recommendations for prevention and wellness.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-pink-100 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Wellness Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Connect with a supportive community of women on similar health journeys, 
                    sharing experiences and encouragement.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-2xl p-8 mb-16 border border-pink-100">
              <h2 className="text-3xl font-bold text-center mb-8">
                How BrezCode Works
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Take Assessment</h3>
                  <p className="text-gray-600">
                    Complete our comprehensive health questionnaire to understand your unique risk profile.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Get Your Plan</h3>
                  <p className="text-gray-600">
                    Receive personalized recommendations, daily wellness plans, and health insights.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                    3
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Start Your Journey</h3>
                  <p className="text-gray-600">
                    Access your personal dashboard with AI coaching, calendar planning, and progress tracking.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Take Control of Your Health?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of women who have transformed their health journey with BrezCode.
              </p>
              <Button 
                size="lg" 
                onClick={handleStartQuiz}
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold"
              >
                Start Your Assessment Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </>
        ) : (
          /* Sign In Form */
          <div className="max-w-md mx-auto">
            <Card className="border-pink-100">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome Back
                </CardTitle>
                <p className="text-gray-600">Sign in to access your personal health dashboard</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={signInForm.email}
                      onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                      required
                      className="border-pink-200 focus:border-pink-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={signInForm.password}
                      onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                      required
                      className="border-pink-200 focus:border-pink-400"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    New to BrezCode?{' '}
                    <button 
                      onClick={() => {
                        setShowSignIn(false);
                        handleStartQuiz();
                      }}
                      className="text-pink-600 hover:text-pink-700 font-semibold"
                    >
                      Start Your Health Assessment
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}