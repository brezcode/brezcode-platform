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
      // Scroll to quiz section
      const quizSection = document.getElementById("quiz");
      quizSection?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleTakeQuiz = () => {
    setLocation("/chat"); // For now, redirect to chat for the quiz experience
  };

  return (
    <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="animate-fade-in-up">
          {/* Statistics Header */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 mb-8 max-w-md mx-auto">
            <p className="text-red-700 font-semibold text-lg">
              "1 in 8 will have breast cancer in their lifetime"
            </p>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Say no to <span className="text-red-600">anxiety</span> 
            <br />and <span className="text-red-600">guessing</span>
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
            Join now to lower your risk over 100% in 15 days
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            The #1 evidence-based AI coaching program with practical daily guidance, nurturing tips and risk scoring to uplift your lifestyle
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={handleTakeQuiz}
              className="gradient-bg text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all hover:scale-105"
            >
              Take a quiz now to assess your risk
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-sky-blue text-sky-blue px-8 py-4 rounded-full text-lg font-semibold hover:bg-sky-blue hover:text-white transition-all"
              onClick={() => {
                const trialSection = document.getElementById("trial");
                trialSection?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Get your free 15-day trial
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
