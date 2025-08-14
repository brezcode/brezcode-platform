import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY) : null;

const TIER_INFO = {
  basic: {
    name: "Basic",
    price: "$4.99",
    features: [
      "Basic risk assessment",
      "Weekly health tips", 
      "Limited AI chat (10 messages/day)"
    ]
  },
  pro: {
    name: "Pro",
    price: "$9.99",
    features: [
      "Comprehensive risk assessment",
      "Daily personalized coaching",
      "Unlimited AI chat support",
      "Progress tracking & analytics"
    ]
  },
  premium: {
    name: "Premium", 
    price: "$19.99",
    features: [
      "Advanced genetic risk analysis",
      "Priority AI responses",
      "Expert consultation scheduling",
      "Family sharing (up to 4 members)"
    ]
  }
};

function SubscribeForm({ tier }: { tier: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/chat`,
      },
    });

    setIsProcessing(false);

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Subscription Successful",
        description: `Welcome to the ${tier} plan!`,
      });
      setLocation("/chat");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || !elements || isProcessing}
        className="w-full gradient-bg hover:opacity-90"
      >
        {isProcessing ? "Processing..." : `Subscribe to ${TIER_INFO[tier as keyof typeof TIER_INFO]?.name}`}
      </Button>
    </form>
  );
}

export default function SubscribePage() {
  const params = useParams();
  const tier = params.tier as string;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState("");

  const createSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/create-subscription", { tier });
      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create subscription",
        variant: "destructive",
      });
      setLocation("/");
    }
  });

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe",
        variant: "destructive",
      });
      setLocation("/");
      return;
    }

    if (!tier || !TIER_INFO[tier as keyof typeof TIER_INFO]) {
      toast({
        title: "Invalid Plan",
        description: "The selected plan is not available",
        variant: "destructive",
      });
      setLocation("/");
      return;
    }

    if (user.isSubscriptionActive) {
      toast({
        title: "Already Subscribed",
        description: "You already have an active subscription",
      });
      setLocation("/chat");
      return;
    }

    // Only create subscription if Stripe is available
    if (stripePromise) {
      createSubscriptionMutation.mutate();
    }
  }, [user, tier, setLocation, toast]);

  if (!user || !tier || !TIER_INFO[tier as keyof typeof TIER_INFO]) {
    return null;
  }

  const tierInfo = TIER_INFO[tier as keyof typeof TIER_INFO];

  if (createSubscriptionMutation.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-sky-blue border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your subscription...</p>
        </div>
      </div>
    );
  }

  // If Stripe is not configured, show a coming soon message
  if (!stripePromise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">BH</span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {tierInfo.name} Plan
            </CardTitle>
            <p className="text-gray-600 mt-2">{tierInfo.price}/month</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {tierInfo.features.map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-sky-blue rounded-full mr-3"></div>
                  {feature}
                </div>
              ))}
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-yellow-800 font-medium">Payment System Coming Soon</p>
              <p className="text-yellow-600 text-sm mt-1">
                We're setting up secure payments. For now, enjoy the free chat experience!
              </p>
            </div>
            <Button 
              onClick={() => setLocation("/chat")} 
              className="w-full bg-sky-blue hover:bg-sky-blue/90"
            >
              Try Free Chat Instead
            </Button>
            <Button 
              onClick={() => setLocation("/")} 
              variant="outline"
              className="w-full"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600">Failed to initialize payment. Please try again.</p>
              <Button onClick={() => setLocation("/")} className="mt-4">
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">BH</span>
            </div>
            <CardTitle className="text-2xl">Subscribe to {tierInfo.name}</CardTitle>
            <div className="text-3xl font-bold text-sky-blue">{tierInfo.price}<span className="text-base font-normal text-gray-500">/month</span></div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3">What's included:</h4>
              <ul className="space-y-2">
                {tierInfo.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-sky-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <SubscribeForm tier={tier} />
            </Elements>

            <div className="text-center text-sm text-gray-500">
              <p>30-day money-back guarantee • Cancel anytime</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
