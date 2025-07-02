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
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your <span className="sky-blue">Health Plan</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the perfect plan for your breast health journey. All plans include AI chat support and personalized recommendations.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`bg-white rounded-3xl shadow-lg hover-lift p-8 relative ${
                plan.popular ? "border-2 border-sky-blue" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-sky-blue text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className={`text-4xl font-bold mb-6 ${
                  plan.popular ? "sky-blue" : "text-charcoal"
                }`}>
                  {plan.price}<span className="text-lg font-normal text-gray-500">/month</span>
                </div>
                
                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <svg 
                        className={`w-5 h-5 ${
                          plan.id === "premium" ? "sunny-yellow" : "sky-blue"
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full py-3 rounded-full font-semibold transition-all ${plan.buttonClass}`}
                >
                  {plan.id === "basic" ? "Get Started" : 
                   plan.id === "pro" ? "Start Pro Plan" : "Go Premium"}
                </Button>
              </div>
            </div>
          ))}
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
