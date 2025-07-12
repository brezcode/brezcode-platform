import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import Features from "@/components/features";
import Pricing from "@/components/pricing";
import ChatInterface from "@/components/chat-interface";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import promiseImage from "@assets/Sunnyside p5_1752243629786.png";

export default function LandingPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <Features />
      
      {/* App Features Section */}
      <section id="app-features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              An app, community, and <span className="sky-blue">coach in your pocket</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              After a quick quiz, we'll personalize your first weekly plan, introduce you to daily health rituals, and invite you to our private community. Our supportive coaches will be with you at every step of the way.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg hover-lift">
              <div className="w-16 h-16 bg-sky-blue rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Weekly planning</h3>
              <p className="text-gray-600 leading-relaxed">
                Every Sunday you'll get a personalized plan for the week ahead. Pre-commit to your week ahead to crush your goals.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover-lift">
              <div className="w-16 h-16 bg-sunny-yellow rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Community</h3>
              <p className="text-gray-600 leading-relaxed">
                Give and get support in the vibrant BrezCode community, a place to cultivate a positive mindset every day.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover-lift">
              <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Resources</h3>
              <p className="text-gray-600 leading-relaxed">
                Exercises, videos, and resources are available on-demand to help you stay motivated when you need it.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover-lift">
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

            <div className="bg-white p-8 rounded-3xl shadow-lg hover-lift">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Scoring Progress</h3>
              <p className="text-gray-600 leading-relaxed">
                Whether it's sleep, exercise, stress, or drinks cut, BrezCode shows you your progress in the terms that matter most to you.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover-lift">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 3H4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Drink and Diet tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Tracking your drinks and diets will become the foundation of your habit change. BrezCode makes it simple and fun!
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Promise Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-indigo-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Our Promise to You
            </h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-white leading-relaxed font-medium mb-12">
                We know this is a deeply personal journey for you, as it was for us. We follow a strict code of conduct and promise to always put your health and wellness above all else.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-3">No shame or guilt ever</h3>
                  <p className="text-white/90">
                    Mindful lifestyle is about celebrating our wins, not making you feel bad.
                  </p>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-3">Always private and secure</h3>
                  <p className="text-white/90">
                    This is a personal, private journey for you. We make privacy a top priority.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-3">Money back guarantee</h3>
                  <p className="text-white/90">
                    If you give it a fair shot and aren't happy after 30 days, just let us know!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="reviews" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Results from real people like you
            </h2>
            <p className="text-lg text-gray-500 italic">
              These are real customer reviews, and we have hundreds more
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-pink-400 to-purple-500">
                <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                  M
                </div>
              </div>
              <p className="text-gray-600 font-medium mb-6">Mia</p>
              <blockquote className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed mb-6">
                "As a young woman, I ignored breast health. This app's fun, quick lessons taught me to listen to my body and act early!"
              </blockquote>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">Real BrezCode Customer</span>
              </div>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-500">
                <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                  E
                </div>
              </div>
              <p className="text-gray-600 font-medium mb-6">Emily</p>
              <blockquote className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed mb-6">
                "I found a lump and panicked. The app guided me through self-exams and screening info, helping me stay calm and get answers fast."
              </blockquote>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">Real BrezCode Customer</span>
              </div>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-teal-500">
                <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                  A
                </div>
              </div>
              <p className="text-gray-600 font-medium mb-6">Aisha</p>
              <blockquote className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed mb-6">
                "My sister had breast cancer, so I'm high-risk. The app's risk scoring and check-in reminders help me feel in control of my health!"
              </blockquote>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">Real BrezCode Customer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              With measurable impact
            </h2>
            <p className="text-lg text-gray-500 italic">
              Results reported from a recent customer survey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-center text-lg text-gray-800">
                <span className="w-2 h-2 bg-gray-800 rounded-full mr-3"></span>
                <span className="font-medium">96% feel less anxiety</span>
              </div>
              <div className="flex items-center text-lg text-gray-800">
                <span className="w-2 h-2 bg-gray-800 rounded-full mr-3"></span>
                <span className="font-medium">90% improve diet quality</span>
              </div>
              <div className="flex items-center text-lg text-gray-800">
                <span className="w-2 h-2 bg-gray-800 rounded-full mr-3"></span>
                <span className="font-medium">87% have better sleep</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center text-lg text-gray-800">
                <span className="w-2 h-2 bg-gray-800 rounded-full mr-3"></span>
                <span className="font-medium">80% feel accomplished</span>
              </div>
              <div className="flex items-center text-lg text-gray-800">
                <span className="w-2 h-2 bg-gray-800 rounded-full mr-3"></span>
                <span className="font-medium">75% improve mental health</span>
              </div>
              <div className="flex items-center text-lg text-gray-800">
                <span className="w-2 h-2 bg-gray-800 rounded-full mr-3"></span>
                <span className="font-medium">100% improve breast health</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Pricing />

      {/* Footer */}
      <footer className="bg-charcoal text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">BC</span>
                </div>
                <span className="text-xl font-semibold">BrezCode</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Empowering women with AI-driven breast health insights and personalized coaching for proactive wellness management.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-sky-blue transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-sky-blue transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
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
            <p>&copy; 2024 BrezCode. All rights reserved. This service is for informational purposes only and does not replace professional medical advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
