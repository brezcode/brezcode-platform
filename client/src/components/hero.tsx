import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import happyWomanImage from "@assets/happy_women_using_phone-removebg-preview_1752232002425.png";

export default function Hero() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const handleTakeQuiz = () => {
    setLocation("/chat");
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
            <span className="text-white text-sm font-medium">Evidence-based AI coaching available 24/7</span>
          </div>

          <p className="text-xl text-white/90 mb-6 max-w-4xl mx-auto leading-relaxed">
            "1 in 8 women in US will <strong className="text-yellow-400">develop</strong> breast cancer in their lifetime"... According to WHO
          </p>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Good news! You can now <span className="gradient-text">REVERSE</span> the development<br />
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
              onClick={() => setLocation("/chat")}
              className="bg-yellow-400 text-black px-12 py-6 rounded-full text-xl font-bold hover:shadow-lg transition-all hover:scale-105"
            >
              Take the quiz to start
            </Button>
          </div>

          <p className="text-white/80 text-lg mb-16">
            Start for free. Cancel any time.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 text-white">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">250,000</div>
              <p className="text-white/80 text-sm uppercase tracking-wider">Lives changed</p>
            </div>

            <div className="flex items-center">
              <div className="flex mr-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span className="text-sm">4.8 RATING</span>
            </div>

            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">13 MILLION</div>
              <p className="text-white/80 text-sm uppercase tracking-wider">Women helped since 2020</p>
            </div>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-start pb-0">
          <div className="relative flex justify-center items-end" style={{ height: '500px' }}>
            {/* Yellow Circle Background */}
            <div className="w-80 h-80 bg-yellow-400 rounded-full absolute" style={{ bottom: '120px' }}></div>
            {/* Woman Image */}
            <img 
              src={happyWomanImage}
              alt="Happy woman using phone"
              className="relative z-10 object-contain object-bottom"
              style={{
                width: '24rem',
                height: '30rem',
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
              }}
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