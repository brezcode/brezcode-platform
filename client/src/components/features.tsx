import React from 'react';

export default function Features() {
  const benefits = [
    {
      icon: "🥤",
      title: "Drink less alcohol",
      description: "No matter where you are on your journey, Sunnyside can help you drink less, with no pressure to quit."
    },
    {
      icon: "🎯",
      title: "Gain control over binge drinking",
      description: "We'll teach you the psychology-backed habits and techniques to gain control over binge drinking."
    },
    {
      icon: "📑",
      title: "Reduce hangovers",
      description: "The days of hangovers ruining your day or week are over. Learn to enjoy drinking with fewer negative effects."
    },
    {
      icon: "📅",
      title: "Improve your well-being",
      description: "Drinking just a bit less can have a big positive impact on your sleep, mental health, relationships, and more."
    }
  ];

  return (
    <section className="py-20 bg-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Benefits List */}
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-12">
              Sunnyside can help you
            </h2>

            <div className="space-y-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="text-2xl mt-1">{benefit.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-12 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-4 rounded-full text-lg transition-colors">
              Take the quiz to start
            </button>
          </div>

          {/* Right Side - Image with Stats Overlay */}
          <div className="relative">
            <div className="relative">
              <img 
                src="/happy-woman-phone.png"
                alt="Woman enjoying coffee"
                className="w-full h-auto rounded-3xl"
              />

              {/* Stats Overlay */}
              <div className="absolute top-8 right-8 space-y-3">
                <div className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-2xl font-bold">19</span>
                    <span className="text-sm">Nights of great sleep</span>
                  </div>
                </div>

                <div className="bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-2xl font-bold">1.3k</span>
                    <span className="text-sm">Calories cut</span>
                  </div>
                </div>

                <div className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-2xl font-bold">27</span>
                    <span className="text-sm">Total drinks saved</span>
                  </div>
                </div>

                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-2xl font-bold">20</span>
                    <span className="text-sm">Dry days added</span>
                  </div>
                </div>

                <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-2xl font-bold">$58</span>
                    <span className="text-sm">In money saved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}