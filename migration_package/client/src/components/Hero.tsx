import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const [, setLocation] = useLocation();

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
            <span className="text-white text-sm font-medium">Evidence-based AI coaching available 24/7</span>
          </div>

          <p className="text-xl text-white/90 mb-6 max-w-4xl mx-auto leading-relaxed">
            <strong>"1 in 8 women in US will develop breast cancer in their lifetime"</strong>
            <br />
            <span className="text-lg">- According to WHO</span>
          </p>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Good news! You can now <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">REVERSE</span> the development
            <br />
            and lower the risk by <span className="text-yellow-400">100% in 15 days.</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-4xl mx-auto leading-relaxed italic">
            The #1 evidence-based AI breast health coaching platform to help you
          </p>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed italic">
            regain control of your wellness.
          </p>

          <p className="text-lg text-white/90 mb-12 max-w-3xl mx-auto">
            Don't wait until it is too late, your family depends on you.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Button 
              onClick={() => setLocation("/quiz")}
              className="bg-yellow-400 text-black px-12 py-6 rounded-full text-xl font-bold hover:shadow-lg transition-all hover:scale-105"
            >
              Take the quiz to start
            </Button>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-start pb-0">
          <div className="relative flex justify-center items-end" style={{ height: '500px' }}>
            {/* Yellow Circle Background */}
            <div className="w-80 h-80 bg-yellow-400 rounded-full absolute" style={{ bottom: '120px' }}></div>
            {/* Placeholder for woman image */}
            <div className="relative z-10 w-96 h-96 bg-white/20 rounded-lg flex items-center justify-center text-white text-lg">
              Happy Woman Image
            </div>
          </div>
          
          <div className="space-y-8 pt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4">Evidence-Based Assessment</h3>
              <p className="text-white/90 leading-relaxed">
                Our comprehensive quiz is based on the latest medical research and guidelines from leading health organizations.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4">Personalized Results</h3>
              <p className="text-white/90 leading-relaxed">
                Get instant, personalized breast health recommendations tailored to your unique risk factors and lifestyle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}