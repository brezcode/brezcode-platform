import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function Hero() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const handleTakeQuiz = () => {
    setLocation("/chat");
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Content */}
        <div className="pt-32 pb-20 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-white">
              Control your health,<br />
              transform your life.
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
              The #1 evidence-based breast health platform<br />
              to help you gain control of your wellness.
            </p>
            
            <Button 
              onClick={handleTakeQuiz}
              className="bg-yellow-400 text-black px-12 py-4 rounded-full text-xl font-bold hover:bg-yellow-300 transition-all hover:scale-105 mb-4"
            >
              Take the quiz to start
            </Button>
            
            <p className="text-blue-100 text-sm">
              Start for free. Cancel any time.
            </p>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-3 gap-8 mt-20 mb-20">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">250,000</div>
              <div className="text-blue-200 text-sm">LIVES CHANGED</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <div className="text-blue-200 text-sm">4.8 RATING</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">13 MILLION</div>
              <div className="text-blue-200 text-sm">DRINKS CUT SINCE 2020</div>
            </div>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center pb-20">
          <div className="relative flex justify-center">
            {/* Yellow Circle Background */}
            <div className="w-80 h-80 bg-yellow-400 rounded-full absolute"></div>
            {/* Woman Image */}
            <img 
              src="https://images.unsplash.com/photo-1594824226394-17fb78a5f2aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&h=580"
              alt="Happy woman using phone"
              className="relative z-10 w-64 h-80 object-cover object-center"
            />
            
            {/* Chat Bubbles */}
            <div className="absolute top-4 right-4 bg-white rounded-2xl p-3 shadow-lg max-w-48 z-20">
              <p className="text-sm text-gray-700">Hey Sue, how'd it go yesterday?</p>
            </div>
            
            <div className="absolute top-20 right-8 bg-purple-500 rounded-2xl p-3 shadow-lg max-w-48 z-20">
              <p className="text-sm text-white">Kept it mindful, and feeling great today!</p>
            </div>
            
            <div className="absolute bottom-20 left-4 bg-green-500 rounded-2xl p-3 shadow-lg max-w-40 z-20">
              <p className="text-sm text-white">Great work sticking to your plan!</p>
            </div>
          </div>
          
          <div className="text-left">
            <div className="text-6xl font-bold text-white mb-4">96%</div>
            <div className="text-2xl font-bold text-white mb-4">
              of members report<br />
              better health after 90 days
            </div>
            <p className="text-blue-100 mb-8">
              In addition, BrezCode members reduce their weekly risk consumption by an average of 31% after 90 days, as verified in a third-party study.
            </p>
            
            <Button 
              onClick={handleTakeQuiz}
              className="bg-yellow-400 text-black px-8 py-3 rounded-full text-lg font-bold hover:bg-yellow-300 transition-all"
            >
              Take the quiz to start
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
