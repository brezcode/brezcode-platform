import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { 
  Heart, 
  Shield, 
  Activity, 
  MessageSquare, 
  Calendar,
  Award,
  ChevronRight,
  Star
} from "lucide-react";

export default function BrezCodeLanding() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      {/* Header */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-pink-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">BrezCode</h1>
                <p className="text-xs text-gray-600">Breast Health Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setLocation('/login')}
              >
                Sign In
              </Button>
              <Button 
                onClick={() => setLocation('/brezcode/assessment')}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              >
                Start Assessment
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center bg-pink-100 rounded-full px-4 py-2 mb-6">
            <Heart className="h-4 w-4 text-pink-600 mr-2" />
            <span className="text-pink-800 text-sm font-medium">Your Breast Health Journey Starts Here</span>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Personalized Breast Health
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600"> Assessment & Coaching</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Get evidence-based breast health insights with Dr. Sakura, your AI wellness coach. 
            Track your health metrics, receive personalized recommendations, and build healthy habits.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg"
              onClick={() => setLocation('/brezcode/assessment')}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 px-8 py-3"
            >
              Take Free Assessment
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setLocation('/login')}
              className="border-pink-300 text-pink-700 hover:bg-pink-50 px-8 py-3"
            >
              Sign In to Dashboard
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span>Evidence-Based</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-green-500 mr-1" />
              <span>Privacy Protected</span>
            </div>
            <div className="flex items-center">
              <Award className="h-4 w-4 text-blue-500 mr-1" />
              <span>Personalized</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="border-pink-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-3 bg-pink-100 rounded-lg w-fit mb-4">
                <Heart className="h-8 w-8 text-pink-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Health Assessment</CardTitle>
              <CardDescription>
                Comprehensive breast health risk assessment based on medical guidelines and your personal health profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Risk factor analysis</li>
                <li>• Personalized recommendations</li>
                <li>• Screening schedule guidance</li>
                <li>• Evidence-based insights</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4">
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Dr. Sakura AI Coach</CardTitle>
              <CardDescription>
                24/7 access to your personal AI wellness coach with proactive research and expert-backed guidance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Instant health guidance</li>
                <li>• Proactive research updates</li>
                <li>• Multimedia content delivery</li>
                <li>• Personalized coaching</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Health Calendar</CardTitle>
              <CardDescription>
                Track your wellness activities, appointments, and build healthy habits with personalized daily plans.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Daily wellness plans</li>
                <li>• Activity tracking</li>
                <li>• Progress monitoring</li>
                <li>• Streak achievements</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* WHO Statistics */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 border border-pink-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Breast Health Matters</h2>
            <p className="text-lg text-gray-600">Understanding the importance of proactive breast health care</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
              <div className="text-4xl font-bold text-pink-600 mb-2">1 in 8</div>
              <p className="text-gray-700 font-medium mb-2">Women develop breast cancer</p>
              <p className="text-sm text-gray-600">WHO Global Cancer Statistics</p>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
              <div className="text-4xl font-bold text-purple-600 mb-2">85%</div>
              <p className="text-gray-700 font-medium mb-2">Have no family history</p>
              <p className="text-sm text-gray-600">Making personal health tracking crucial</p>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="text-4xl font-bold text-green-600 mb-2">99%</div>
              <p className="text-gray-700 font-medium mb-2">5-year survival rate when caught early</p>
              <p className="text-sm text-gray-600">Early detection saves lives</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Start Your Breast Health Journey Today</h2>
          <p className="text-xl mb-8 text-pink-100">
            Take the first step towards proactive breast health with personalized insights and ongoing support.
          </p>
          <Button 
            size="lg"
            onClick={() => setLocation('/brezcode/assessment')}
            className="bg-white text-pink-600 hover:bg-pink-50 px-8 py-3 text-lg font-semibold"
          >
            Begin Free Assessment
            <Heart className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-pink-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">BrezCode</span>
          </div>
          <p className="text-gray-600 text-sm">
            © 2025 BrezCode. Your trusted partner in breast health and wellness.
          </p>
        </div>
      </footer>
    </div>
  );
}