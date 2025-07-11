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
    <section id="pricing" className="py-20" style={{ backgroundColor: '#F4F1E8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Left side - Features list */}
          <div className="lg:col-span-1">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-black leading-tight">
              Free 15-day trial,<br />
              then simple pricing.
            </h2>

            <div className="space-y-4">
              {[
                "Easy drink tracking",
                "Weekly planning", 
                "Analytics & dashboard",
                "Personalized recommendations",
                "Real human coaching",
                "Supportive community",
                "Focus on moderation",
                "Judgement-free",
                "Affordable cost",
                "Text message interface",
                "Only 3 minutes per day"
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-800 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Pricing cards */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
            {/* Basic Plan */}
            <div className="bg-white rounded-3xl border-2 border-yellow-300 p-8 relative shadow-sm">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-green-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-1">
                  <span>✓</span>
                  <span>MOST POPULAR</span>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-4 text-black mt-4">Basic plan</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Ready to drink a bit less, but don't want to quit? This is where most new members start.
              </p>

              <div className="mb-8">
                <div className="text-4xl font-bold text-black">$8.25</div>
                <div className="text-gray-500 text-sm">per month, billed at $99/year</div>
              </div>

              <Button 
                onClick={() => setLocation("/chat")}
                className="w-full py-4 rounded-full font-bold text-black border-0 transition-all"
                style={{ backgroundColor: '#F5D748' }}
              >
                Start my free 15-day trial
              </Button>
            </div>

            {/* Cutback Coach */}
            <div className="bg-white rounded-3xl border border-gray-200 p-8 relative shadow-sm">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gray-400 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-1">
                  <span>♡</span>
                  <span>IF YOU NEED MORE SUPPORT</span>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-4 text-black mt-4">Cutback Coach</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Need a more hands-on approach? Get a more personalized experience & hands-on coaching.
              </p>

              <div className="mb-8">
                <div className="text-4xl font-bold text-black">$24.83</div>
                <div className="text-gray-500 text-sm">per month, billed at $298/year</div>
              </div>

              <Button 
                onClick={() => setLocation("/chat")}
                className="w-full py-4 rounded-full font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all border-0"
              >
                Start my free 15-day trial
              </Button>
            </div>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-12">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-gray-700 font-medium text-sm">MONEY-BACK GUARANTEE. DON'T LOVE IT? JUST LET US KNOW</span>
          </div>
        </div>
      </div>
    </section>
  );
}