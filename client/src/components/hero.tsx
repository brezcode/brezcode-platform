import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function Hero() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user?.isSubscriptionActive) {
      setLocation("/chat");
    } else {
      // Scroll to pricing section
      const pricingSection = document.getElementById("pricing");
      pricingSection?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Your Personal
            <span className="gradient-text"> Breast Health</span>
            <br />Coach
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            AI-powered guidance for proactive breast health management. Get personalized insights, risk assessments, and daily coaching tailored to your unique health profile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={handleGetStarted}
              className="gradient-bg text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all hover:scale-105"
            >
              {user?.isSubscriptionActive ? "Open Chat" : "Start Your Health Journey"}
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-sky-blue text-sky-blue px-8 py-4 rounded-full text-lg font-semibold hover:bg-sky-blue hover:text-white transition-all"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="mt-16 animate-float">
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=600" 
            alt="Diverse group of women supporting each other in health journey" 
            className="rounded-3xl shadow-2xl mx-auto max-w-5xl w-full"
          />
        </div>
      </div>
    </section>
  );
}
