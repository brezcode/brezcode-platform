import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { 
  Heart, 
  Shield, 
  Activity, 
  MessageSquare, 
  Calendar,
  Award,
  ChevronRight,
  Star,
  Users,
  CheckCircle,
  TrendingUp,
  Phone,
  Lock,
  DollarSign,
  Clock,
  BarChart3,
  BookOpen,
  Globe,
  Smile
} from "lucide-react";
import bLogoPath from "@assets/B_logo_2-removebg-preview_1752311662013.png";
import happyWomanPath from "@assets/happy_women_using_phone-removebg-preview_1752232002425.png";

export default function BrezCodeLanding() {
  const [, setLocation] = useLocation();

  const riskReductionActivities = [
    { activity: "Daily 5mins breathing exercise", benefit: "Lower Chronic stress", reduction: "-15% risk" },
    { activity: "Daily 10mins mindfulness exercise", benefit: "Increase positivity", reduction: "-5% risk" },
    { activity: "3x/weekly Self Breast Massage", benefit: "Lower Chronic inflammation", reduction: "-20% risk" },
    { activity: "Personalized dietary management", benefit: "Lower Carcinogen", reduction: "-20% risk" },
    { activity: "Daily Physical exercise tracking", benefit: "Lower oxidative stress", reduction: "-40% risk" },
    { activity: "Monthly Self Breast Exam", benefit: "Early Symptom Detection", reduction: "-20% risk" },
    { activity: "Daily educational content and tips", benefit: "Increase awareness", reduction: "-5% risk" },
    { activity: "AI-Risk Monitoring system", benefit: "Early detection", reduction: "-50% risk" }
  ];

  const features = [
    { icon: <Calendar className="h-8 w-8 text-blue-600" />, title: "Weekly Planning", description: "Every Sunday you'll get a personalized plan for the week ahead. Pre-commit to your week ahead to crush your goals." },
    { icon: <Users className="h-8 w-8 text-blue-600" />, title: "Community", description: "Give and get support in the vibrant BrezCode community, a place to cultivate a positive mindset every day." },
    { icon: <BookOpen className="h-8 w-8 text-blue-600" />, title: "Resources", description: "Exercises, videos, and resources are available on-demand to help you stay motivated when you need it." },
    { icon: <MessageSquare className="h-8 w-8 text-blue-600" />, title: "24/7 Coaching", description: "If you want any support or query, our AI coach trained by medical experts is always just a text message away, 24x7" },
    { icon: <TrendingUp className="h-8 w-8 text-blue-600" />, title: "Scoring Progress", description: "Whether it's sleep, exercise, stress, or drinks cut, BrezCode shows you your progress in the terms that matter most to you." },
    { icon: <Activity className="h-8 w-8 text-blue-600" />, title: "Drink and Diet tracking", description: "Tracking your drinks and diets will become the foundation of your habit change. BrezCode makes it simple and fun!" }
  ];

  const testimonials = [
    { name: "Abby", age: "35 years old", text: "I have family history and not knowing what to do with my current symptoms, thanks to this APP, now I gain control of my life" },
    { name: "Monica", age: "44 years old", text: "I am a current breast cancer patient, not knowing how to live my life, this APP is a game changer, I am so encouraged and able to face this challenge every day." },
    { name: "Tracy", age: "52 years old", text: "After chemo treatment, my doctor said I am free of cancer, but I am scared of recurrence. This APP provide me with daily guidance and tips to rebuild myself, and not solely on medication." }
  ];

  const stats = [
    { percentage: "96%", label: "feel less anxiety" },
    { percentage: "73%", label: "sleep better" },
    { percentage: "80%", label: "eat better" },
    { percentage: "75%", label: "exercise more" },
    { percentage: "80%", label: "feel accomplished" },
    { percentage: "100%", label: "improve breast health" }
  ];

  const includedFeatures = [
    "Easy Risk scoring and tracking",
    "Weekly Planning",
    "Analytics & dashboard",
    "Personalized recommendations",
    "AI chatbot messaging interface",
    "Supportive community",
    "Focus on moderation",
    "Affordable cost"
  ];

  const faqItems = [
    {
      question: "How does the risk assessment work?",
      answer: "Our AI-powered assessment analyzes multiple factors including lifestyle, family history, and health metrics to provide personalized risk scoring and recommendations."
    },
    {
      question: "Is my data secure and private?",
      answer: "Yes, we follow strict privacy protocols and HIPAA compliance. Your personal health data is encrypted and never shared with third parties."
    },
    {
      question: "How often should I use the app?",
      answer: "We recommend daily check-ins for optimal results. The app provides daily activities, tracking, and educational content that take just 5-15 minutes per day."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Absolutely. You can cancel your subscription at any time with no hidden fees. We also offer a 30-day money-back guarantee."
    },
    {
      question: "Is this a replacement for medical care?",
      answer: "No, BrezCode is a wellness and prevention tool. Always consult with your healthcare provider for medical advice and regular screenings."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-blue-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img src={bLogoPath} alt="BrezCode Logo" className="h-10 w-10" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">BrezCode</h1>
                <p className="text-xs text-blue-600">Breast Health Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#reviews" className="text-gray-600 hover:text-blue-600 transition-colors">Reviews</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#faq" className="text-gray-600 hover:text-blue-600 transition-colors">FAQ</a>
              <Button 
                variant="ghost" 
                onClick={() => setLocation('/login')}
                className="text-blue-600 hover:text-blue-700"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => setLocation('/brezcode/assessment')}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                Start Assessment
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-red-100 rounded-full px-4 py-2 mb-6">
                <Heart className="h-4 w-4 text-red-600 mr-2" />
                <span className="text-red-800 text-sm font-medium">"1 in 8 will have breast cancer in their lifetime"</span>
              </div>
              
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Say no to anxiety and 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600"> guessing</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Join now to lower your risk over 100% in 15 days
              </p>

              <p className="text-lg text-blue-700 font-medium mb-8">
                The #1 evidence-based AI coaching program with practical daily guidance, nurturing tips and risk scoring to uplift your lifestyle
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg"
                  onClick={() => setLocation('/brezcode/assessment')}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-8 py-3"
                >
                  Take Quiz Now - Get Personalized Report
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setLocation('/login')}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-3"
                >
                  Sign In to Dashboard
                </Button>
              </div>
            </div>

            <div className="relative">
              <img 
                src={happyWomanPath} 
                alt="Happy woman using phone" 
                className="w-full max-w-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Risk Reduction Chart */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Evidence-Based Risk Reduction</h2>
            <p className="text-xl text-gray-600">Comprehensive approach to lowering your breast cancer risk</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {riskReductionActivities.map((item, index) => (
              <Card key={index} className="border-blue-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{item.activity}</h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">{item.reduction}</Badge>
                  </div>
                  <p className="text-gray-600">{item.benefit}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">BrezCode Can Help You</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-blue-100 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Reduce Risk Level</h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-blue-100 rounded-full mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Improve Your Breast Health</h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-blue-100 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Increase Awareness</h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-blue-100 rounded-full mb-4">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Gain Control Over Estrogen</h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-blue-100 rounded-full mb-4">
                <Smile className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Improve Your Well-being</h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-blue-100 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">No More Guessing</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">An app, community, and coach in your pocket</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              After a quick quiz, we'll personalize your first weekly plan, introduce you to daily health rituals, 
              and invite you to our private community. Our supportive coaches will be with you at every step of the way
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-blue-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Free Trial CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">"Get your free 15-day trial"</h2>
          <p className="text-xl text-blue-100 mb-8">Every feature is included</p>
          <Button 
            size="lg"
            onClick={() => setLocation('/brezcode/assessment')}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
          >
            Start Free Trial Now
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Promise Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Promise to You</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We know this is a deeply personal journey for you, as it was for us. We follow a strict code of conduct 
              and promise to always put your health and wellness above all else.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No shame or guilt ever</h3>
              <p className="text-gray-600">Mindful lifestyle is about celebrating our wins, not making you feel bad.</p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Always private and secure</h3>
              <p className="text-gray-600">This is a personal, private journey for you. We make privacy a top priority.</p>
            </div>
            <div className="text-center">
              <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Money back guarantee</h3>
              <p className="text-gray-600">If you give it a fair shot and aren't happy after 30 days, just let us know!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Free 15-day trial, then simple pricing</h2>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl text-gray-900">Complete BrezCode Experience</CardTitle>
                <div className="text-4xl font-bold text-blue-600 mt-4">Free for 15 days</div>
                <p className="text-gray-600 mt-2">Then affordable monthly pricing</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {includedFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  size="lg"
                  onClick={() => setLocation('/brezcode/assessment')}
                  className="w-full mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Results from real people like you</h2>
            <p className="text-xl text-gray-600">These are real customer reviews, and we have hundreds more</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-blue-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}, {testimonial.age}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-indigo-600">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">With measurable impact</h2>
            <p className="text-xl text-blue-100">Results reported from a recent customer survey</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            {stats.map((stat, index) => (
              <div key={index} className="text-white">
                <div className="text-4xl font-bold mb-2">{stat.percentage}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {faqItems.map((item, index) => (
              <Card key={index} className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">{item.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to start your breast health journey?</h2>
          <p className="text-xl text-gray-600 mb-8">Take the first step with our comprehensive assessment</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => setLocation('/brezcode/assessment')}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-8 py-3"
            >
              Take Assessment - Free Trial
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setLocation('/login')}
              className="border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-3"
            >
              Sign In to Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img src={bLogoPath} alt="BrezCode Logo" className="h-8 w-8" />
                <h3 className="text-xl font-bold">BrezCode</h3>
              </div>
              <p className="text-gray-400">
                Evidence-based breast health coaching and risk reduction platform.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#reviews" className="hover:text-white transition-colors">Reviews</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BrezCode. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}