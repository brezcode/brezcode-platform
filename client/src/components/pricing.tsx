import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/components/LanguageSelector";

const plans = (t: any) => [
  {
    id: "basic",
    name: t('pricing.basic.name', 'Basic'),
    price: t('pricing.basic.price', '$4.99'),
    features: [
      t('pricing.basic.feature1', 'Basic risk assessment'),
      t('pricing.basic.feature2', 'Weekly health tips'),
      t('pricing.basic.feature3', 'Limited AI chat (10 messages/day)')
    ],
    buttonClass: "border-2 border-sky-blue text-sky-blue hover:bg-sky-blue hover:text-white"
  },
  {
    id: "pro",
    name: t('pricing.pro.name', 'Pro'),
    price: t('pricing.pro.price', '$9.99'),
    popular: true,
    features: [
      t('pricing.pro.feature1', 'Comprehensive risk assessment'),
      t('pricing.pro.feature2', 'Daily personalized coaching'), 
      t('pricing.pro.feature3', 'Unlimited AI chat support'),
      t('pricing.pro.feature4', 'Progress tracking & analytics')
    ],
    buttonClass: "gradient-bg text-white hover:shadow-lg"
  },
  {
    id: "premium",
    name: t('pricing.premium.name', 'Premium'),
    price: t('pricing.premium.price', '$19.99'),
    features: [
      t('pricing.premium.feature1', 'Advanced genetic risk analysis'),
      t('pricing.premium.feature2', 'Priority AI responses'),
      t('pricing.premium.feature3', 'Expert consultation scheduling'),
      t('pricing.premium.feature4', 'Family sharing (up to 4 members)')
    ],
    buttonClass: "bg-sunny-yellow text-charcoal hover:bg-yellow-400"
  }
];

export default function Pricing() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

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

  const planList = plans(t);

  return (
    <section id="pricing" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Free 15-day trial, then <span className="sky-blue">simple pricing</span>
          </h2>
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

              <div className="grid md:grid-cols-2 gap-6 mb-8 text-left">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Easy Risk scoring and tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Weekly Planning</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Analytics & dashboard</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Personalized recommendations</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{t('pricing.extra.messaging', 'AI chatbot messaging interface')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{t('pricing.extra.community', 'Supportive community')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{t('pricing.extra.moderation', 'Focus on moderation')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{t('pricing.extra.affordable', 'Affordable cost')}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setLocation("/quiz")}
                className="w-full py-4 rounded-full font-bold text-xl bg-sunny-yellow text-black hover:bg-yellow-400 hover:shadow-lg transition-all hover:scale-105"
              >
                {t('pricing.startQuiz', 'Take the quiz to start')}
              </Button>

              <p className="text-sm text-gray-500 mt-4">
                {t('pricing.noCard', 'Start immediately • No credit card required • Cancel anytime')}
              </p>
            </div>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            <span className="font-semibold">{t('pricing.guarantee', '30-day money-back guarantee')}</span> • {t('pricing.cancel', 'Cancel anytime')} • {t('pricing.noFees', 'No hidden fees')}
          </p>
        </div>
      </div>
    </section>
  );
}