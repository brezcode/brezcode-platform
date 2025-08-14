import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function BrezCodeLanding() {
  const [, setLocation] = useState(() => {});

  const handleTakeQuiz = () => {
    window.location.href = '/quiz';
  };

  return (
    <div className="min-h-screen bg-white" data-brezcode-loaded="true">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">BC</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">BrezCode</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600">Pricing</a>
              <a href="#reviews" className="text-gray-600 hover:text-blue-600">Reviews</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - ORIGINAL DESIGN */}
      <section className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 pt-16">
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
              {/* Woman Image Placeholder */}
              <div 
                className="relative z-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500"
                style={{
                  width: '24rem',
                  height: '30rem',
                  filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
                }}
              >
                Happy Woman Image
              </div>

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
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How <span className="text-blue-600">BrezCode Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              After a quick quiz, we'll personalize your first weekly plan, introduce you to daily health rituals, and invite you to our private community. Our supportive coaches will be with you at every step of the way.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Weekly planning</h3>
              <p className="text-gray-600 leading-relaxed">
                Every Sunday you'll get a personalized plan for the week ahead. Pre-commit to your week ahead to crush your goals.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Community</h3>
              <p className="text-gray-600 leading-relaxed">
                Give and get support in the vibrant BrezCode community, a place to cultivate a positive mindset every day.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Resources</h3>
              <p className="text-gray-600 leading-relaxed">
                Exercises, videos, and resources are available on-demand to help you stay motivated when you need it.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">24/7 Coaching</h3>
              <p className="text-gray-600 leading-relaxed">
                If you want any support or query, our AI coach trained by medical experts is always just a text message away, 24x7.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Progress Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Whether it's sleep, exercise, stress, or drinks cut, BrezCode shows you your progress in the terms that matter most to you.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 3H4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Alerts</h3>
              <p className="text-gray-600 leading-relaxed">
                Tracking your drinks and diets will become the foundation of your habit change. BrezCode makes it simple and fun!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Our Users <span className="text-blue-600">Are Saying</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Real stories from women who have transformed their health journey with BrezCode.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">S</span>
                </div>
                <div>
                  <h4 className="font-semibold">Sarah M.</h4>
                  <div className="flex text-yellow-400">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                "BrezCode helped me understand my risk factors and gave me a clear action plan. The AI coach is incredibly supportive and knowledgeable."
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">M</span>
                </div>
                <div>
                  <h4 className="font-semibold">Maria L.</h4>
                  <div className="flex text-yellow-400">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                "The personalized recommendations are amazing. I've made real changes to my lifestyle and feel more confident about my health."
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">J</span>
                </div>
                <div>
                  <h4 className="font-semibold">Jennifer K.</h4>
                  <div className="flex text-yellow-400">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                "Having 24/7 access to evidence-based health guidance has been life-changing. BrezCode is like having a health expert in my pocket."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">BC</span>
                </div>
                <span className="text-xl font-semibold">BrezCode</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Empowering women with AI-driven breast health insights and personalized coaching for proactive wellness management.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 BrezCode. All rights reserved. This service is for informational purposes only and does not replace professional medical advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}