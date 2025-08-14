'use client'

import { Button } from "@/components/ui/button";

export default function Pricing() {
  const handleSubscribe = (tier: string) => {
    window.location.href = `/subscribe/${tier}`;
  };

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Free 15-day trial, then <span className="text-blue-600">simple pricing</span>
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-3xl shadow-xl p-12 border-2 border-blue-600 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-full text-lg font-bold">
                ⭐ BEST VALUE
              </span>
            </div>

            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">BrezCode Premium</h3>
              <div className="text-6xl font-bold mb-2 text-blue-600">
                Free
              </div>
              <p className="text-xl text-gray-600 mb-2">15 days, then $4.99/month</p>
              <p className="text-gray-500 mb-8">Cancel anytime • No hidden fees</p>

              <div className="grid md:grid-cols-2 gap-6 mb-8 text-left">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Comprehensive risk assessment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Daily personalized coaching</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Unlimited AI chat support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Progress tracking & analytics</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Evidence-based activities</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Monthly self-exam reminders</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Health calendar integration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Priority support</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => window.location.href = '/quiz'}
                className="bg-yellow-400 text-black px-12 py-4 rounded-full text-xl font-bold hover:bg-yellow-300 transition-all mb-4"
              >
                Start Free Trial
              </Button>
              
              <p className="text-sm text-gray-500">
                Start your 15-day free trial. No payment required upfront.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 max-w-2xl mx-auto">
            "96% of our members report reduced anxiety and increased confidence in their breast health management after 90 days of using BrezCode."
          </p>
        </div>
      </div>
    </section>
  );
}