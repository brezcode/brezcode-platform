import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: "$4.99",
    features: [
      "Basic risk assessment",
      "Weekly health tips",
      "Limited AI chat (10 messages/day)"
    ],
    buttonClass: "border-2 border-sky-blue text-sky-blue hover:bg-sky-blue hover:text-white"
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9.99",
    popular: true,
    features: [
      "Comprehensive risk assessment",
      "Daily personalized coaching", 
      "Unlimited AI chat support",
      "Progress tracking & analytics"
    ],
    buttonClass: "gradient-bg text-white hover:shadow-lg"
  },
  {
    id: "premium",
    name: "Premium",
    price: "$19.99",
    features: [
      "Advanced genetic risk analysis",
      "Priority AI responses",
      "Expert consultation scheduling",
      "Family sharing (up to 4 members)"
    ],
    buttonClass: "bg-sunny-yellow text-charcoal hover:bg-yellow-400"
  }
];

export default function Pricing() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubscribe = (tier: string) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to subscribe to a plan.",
        variant: "destructive",
      });
      return;
    }

    if (user.isSubscriptionActive) {
      toast({
        title: "Already Subscribed",
        description: "You already have an active subscription.",
      });
      return;
    }

    setLocation(`/subscribe/${tier}`);
  };

  return (
    <section id="pricing" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Free 15-day trial, then <span className="sky-blue">simple pricing</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Easy Risk scoring and tracking • Weekly Planning • Analytics & dashboard • Personalized recommendations • AI chatbot messaging interface • Supportive community • Focus on moderation • Affordable cost
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-3xl shadow-xl p-12 border-2 border-sky-blue relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-sky-blue to-blue-500 text-white px-8 py-3 rounded-full text-lg font-bold">
                ⭐ BEST VALUE
              </span>
            </div>
            
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">BrezCode Premium</h3>
              <div className="text-6xl font-bold mb-2 sky-blue">
                Free
              </div>
              <p className="text-xl text-gray-600 mb-2">15 days, then $4.99/month</p>
              <p className="text-gray-500 mb-8">Cancel anytime • No hidden fees</p>
              
              <Button
                onClick={() => setLocation("/chat")}
                className="w-full py-4 rounded-full font-bold text-xl bg-sunny-yellow text-black hover:bg-yellow-400 hover:shadow-lg transition-all hover:scale-105"
              >
                Take the quiz to start
              </Button>
              
              <p className="text-sm text-gray-500 mt-4">
                Start immediately • No credit card required • Cancel anytime
              </p>
            </div>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            <span className="font-semibold">30-day money-back guarantee</span> • Cancel anytime • No hidden fees
          </p>
        </div>
      </div>
    </section>
  );
}
