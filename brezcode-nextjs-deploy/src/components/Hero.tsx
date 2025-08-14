'use client'

import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Hero() {
  const handleTakeQuiz = () => {
    window.location.href = '/quiz';
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 pt-32">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
            <span className="text-white text-sm font-medium">Evidence-based AI coaching available 24/7</span>
          </div>

          <p className="text-xl text-white/90 mb-6 max-w-4xl mx-auto leading-relaxed">
            <strong>"1 in 8 women in US will develop breast cancer in their lifetime"... According to WHO</strong>
          </p>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Good news! You can now <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">REVERSE</span> the development<br />
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
              onClick={handleTakeQuiz}
              className="bg-yellow-400 text-black px-12 py-6 rounded-full text-xl font-bold hover:shadow-lg transition-all hover:scale-105 hover:bg-yellow-300"
            >
              Take the quiz to start
            </Button>
            <Button 
              onClick={() => window.location.href = '/login'}
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full text-lg font-bold transition-all"
            >
              Already have an account? Sign In
            </Button>
          </div>

          <p className="text-white/80 text-lg mb-16">
            Start for free. Cancel any time.
          </p>
        </div>

        {/* Hero Image Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-start pb-0">
          <div className="relative flex justify-center items-end" style={{ height: '500px' }}>
            {/* Yellow Circle Background */}
            <div className="w-80 h-80 bg-yellow-400 rounded-full absolute" style={{ bottom: '120px' }}></div>
            {/* Woman Image */}
            <Image 
              src="/happy-woman-phone.png"
              alt="Happy woman using phone"
              width={384}
              height={480}
              className="relative z-10 object-contain object-bottom"
              style={{
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
              }}
            />

            {/* Chat Bubbles */}
            <div className="absolute top-4 right-4 bg-white rounded-2xl p-3 shadow-lg max-w-48 z-20">
              <p className="text-sm text-gray-700">Hey Sue, how'd it go yesterday?</p>
            </div>

            <div className="absolute top-20 right-8 bg-purple-500 rounded-2xl p-3 shadow-lg max-w-48 z-20">
              <p className="text-sm text-white">I am following the plan, and feeling great today!</p>
            </div>

            <div className="absolute bottom-20 left-4 bg-green-500 rounded-2xl p-3 shadow-lg max-w-40 z-20">
              <p className="text-sm text-white">Great work sticking to your plan!</p>
            </div>
          </div>

          <div className="text-left">
            <div className="text-6xl font-bold text-white mb-4">96%</div>
            <div className="text-2xl font-bold text-white mb-4">
              of members report<br />
              reduced anxiety after 90 days
            </div>
            <p className="text-blue-100 mb-8">
              In addition, BrezCode members feel accomplished by an average of 80% after 90 days, as verified in a third-party study.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleTakeQuiz}
                className="bg-yellow-400 text-black px-8 py-3 rounded-full text-lg font-bold hover:bg-yellow-300 transition-all"
              >
                Take the quiz to start
              </Button>
              <Button 
                onClick={() => window.location.href = '/health-setup'}
                variant="outline"
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-3 rounded-full text-lg font-bold transition-all"
              >
                🗓️ Create My Health Plan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}