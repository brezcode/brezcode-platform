'use client'

export default function Reviews() {
  const testimonials = [
    {
      name: "Sarah M.",
      initial: "S",
      rating: 5,
      text: "BrezCode helped me understand my risk factors and gave me a clear action plan. The AI coach is incredibly supportive and knowledgeable.",
      bgColor: "bg-blue-600"
    },
    {
      name: "Maria L.",
      initial: "M", 
      rating: 5,
      text: "The personalized recommendations are amazing. I've made real changes to my lifestyle and feel more confident about my health.",
      bgColor: "bg-yellow-500"
    },
    {
      name: "Jennifer K.",
      initial: "J",
      rating: 5,
      text: "Having 24/7 access to evidence-based health guidance has been life-changing. BrezCode is like having a health expert in my pocket.",
      bgColor: "bg-purple-500"
    },
    {
      name: "Emily R.",
      initial: "E",
      rating: 5,
      text: "My sister had breast cancer, so I'm high-risk. The app's risk scoring and check-in reminders help me feel in control of my health!",
      bgColor: "bg-green-500"
    },
    {
      name: "Lisa T.",
      initial: "L",
      rating: 5,
      text: "The daily activities are so manageable and the progress tracking keeps me motivated. I've never felt more proactive about my health.",
      bgColor: "bg-pink-500"
    },
    {
      name: "Amanda S.",
      initial: "A",
      rating: 5,
      text: "After my mom's diagnosis, I was terrified. BrezCode gave me practical steps to reduce my risk and peace of mind.",
      bgColor: "bg-indigo-500"
    }
  ];

  return (
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 ${testimonial.bgColor} rounded-full flex items-center justify-center mr-4`}>
                  <span className="text-white font-bold">{testimonial.initial}</span>
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="text-4xl font-bold text-blue-600 mb-2">96%</div>
            <p className="text-xl text-gray-700 mb-4">
              of members report reduced anxiety after 90 days
            </p>
            <p className="text-gray-600">
              Based on a third-party study of 1,000+ BrezCode users
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}