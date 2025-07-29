
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useTranslation } from "@/components/LanguageSelector";
import RiskReductionChart from "./risk-reduction-chart";
import yogaImage from "@assets/yoga_1752241133489.png";

export default function Features() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  const activities = [
    {
      title: t('features.activity1.title', 'Daily 5mins breathing exercise'),
      description: t('features.activity1.description', 'Lower Chronic stress'),
      reduction: t('features.activity1.reduction', '-15% risk'),
      icon: "🫁",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: t('features.activity2.title', 'Daily 10mins mindfulness exercise'),
      description: t('features.activity2.description', 'Increase positivity'),
      reduction: t('features.activity2.reduction', '-5% risk'),
      icon: "🧘‍♀️",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      title: t('features.activity3.title', '3x/weekly Self Breast Massage'),
      description: t('features.activity3.description', 'Lower Chronic inflammation'),
      reduction: t('features.activity3.reduction', '-20% risk'),
      icon: "💆‍♀️",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200"
    },
    {
      title: t('features.activity4.title', 'Personalized dietary management'),
      description: t('features.activity4.description', 'Lower Carcinogen'),
      reduction: t('features.activity4.reduction', '-20% risk'),
      icon: "🥗",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: t('features.activity5.title', 'Daily Physical exercise tracking'),
      description: t('features.activity5.description', 'Lower oxidative stress'),
      reduction: t('features.activity5.reduction', '-40% risk'),
      icon: "🏃‍♀️",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      title: t('features.activity6.title', 'Monthly Self Breast Exam'),
      description: t('features.activity6.description', 'Early Symptom Detection'),
      reduction: t('features.activity6.reduction', '-20% risk'),
      icon: "🔍",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200"
    },
    {
      title: t('features.activity7.title', 'Daily educational content and tips'),
      description: t('features.activity7.description', 'Increase awareness'),
      reduction: t('features.activity7.reduction', '-5% risk'),
      icon: "📚",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    },
    {
      title: t('features.activity8.title', 'AI-Risk Monitoring system'),
      description: t('features.activity8.description', 'Early detection'),
      reduction: t('features.activity8.reduction', '-50% risk'),
      icon: "🤖",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('features.title', 'Evidence-based activities to reverse breast cancer development')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('features.subtitle', 'All activities are scientifically proven to reduce breast cancer risk')}
          </p>
        </div>

        <RiskReductionChart />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((activity, index) => (
            <div key={index} className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl hover-lift">
              <h3 className="text-lg font-bold mb-2">{activity.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{activity.description}</p>
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block">
                {activity.reduction}
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Summary */}
        <div className="mt-20 bg-gradient-to-r from-sky-50 to-blue-50 rounded-3xl p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div>
              <h3 className="text-3xl font-bold mb-8 text-sky-600">{t('features.help.title', 'Brezcode can help you')}</h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">{t('features.help.benefit1.title', 'Reduce breast cancer risk')}</h4>
                    <p className="text-gray-600">{t('features.help.benefit1.description', 'No matter where you are on your journey, Brezcode can help you reduce risk, with no pressure to be perfect.')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">{t('features.help.benefit2.title', 'Gain control over your wellness')}</h4>
                    <p className="text-gray-600">{t('features.help.benefit2.description', 'We\'ll teach you the science-backed habits and techniques to gain control over your breast health.')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">{t('features.help.benefit3.title', 'Reduce anxiety and stress')}</h4>
                    <p className="text-gray-600">{t('features.help.benefit3.description', 'The days of anxiety ruining your day or week are over. Learn to enjoy peace of mind with fewer negative effects.')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">{t('features.help.benefit4.title', 'Improve your well-being')}</h4>
                    <p className="text-gray-600">{t('features.help.benefit4.description', 'Taking care of your health can have a big positive impact on your sleep, mental health, relationships, and more.')}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button onClick={() => setLocation('/brezcode/quiz')} className="bg-yellow-400 text-black px-8 py-3 rounded-full text-lg font-bold hover:bg-yellow-300 transition-all">
                  {t('features.help.button', 'Take the quiz to start')}
                </Button>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <div className="w-full h-96 rounded-2xl overflow-hidden flex items-center justify-center">
                  <img 
                    src={yogaImage} 
                    alt="Woman meditating in peaceful pose"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}