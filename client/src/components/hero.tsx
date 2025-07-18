import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/components/LanguageSelector";
import happyWomanImage from "@assets/happy_women_using_phone-removebg-preview_1752232002425.png";

export default function Hero() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { t } = useTranslation();

  const handleTakeQuiz = () => {
    setLocation("/quiz");
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
            <span className="text-white text-sm font-medium">{t('hero.badge', 'Evidence-based AI coaching available 24/7')}</span>
          </div>

          <p className="text-xl text-white/90 mb-6 max-w-4xl mx-auto leading-relaxed">
            {t('hero.statistic', '"1 in 8 women in US will develop breast cancer in their lifetime"... According to WHO')}
          </p>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            {t('hero.title1', 'Good news! You can now')} <span className="gradient-text">{t('hero.reverse', 'REVERSE')}</span> {t('hero.title2', 'the development')}<br />
            {t('hero.title3', 'and lower the risk by')} <span className="text-yellow-400">{t('hero.percentage', '100% in 15 days.')}</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-4xl mx-auto leading-relaxed italic">
            {t('hero.subtitle1', 'The #1 evidence-based AI breast health coaching platform to help you')}
          </p>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed italic">
            {t('hero.subtitle2', 'regain control of your wellness.')}
          </p>

          <p className="text-lg text-white/90 mb-12 max-w-3xl mx-auto">
            {t('hero.urgency', 'Don\'t wait until it is too late, your family depends on you.')}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Button 
              onClick={() => setLocation("/quiz")}
              className="bg-yellow-400 text-black px-12 py-6 rounded-full text-xl font-bold hover:shadow-lg transition-all hover:scale-105"
            >
              {t('hero.cta', 'Take the quiz to start')}
            </Button>
          </div>

          <p className="text-white/80 text-lg mb-16">
            {t('hero.freeText', 'Start for free. Cancel any time.')}
          </p>
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
              <p className="text-sm text-gray-700">{t('hero.chat1', 'Hey Sue, how\'d it go yesterday?')}</p>
            </div>

            <div className="absolute top-20 right-8 bg-purple-500 rounded-2xl p-3 shadow-lg max-w-48 z-20">
              <p className="text-sm text-white">{t('hero.chat2', 'I am following the plan, and feeling great today!')}</p>
            </div>

            <div className="absolute bottom-20 left-4 bg-green-500 rounded-2xl p-3 shadow-lg max-w-40 z-20">
              <p className="text-sm text-white">{t('hero.chat3', 'Great work sticking to your plan!')}</p>
            </div>
          </div>

          <div className="text-left">
            <div className="text-6xl font-bold text-white mb-4">96%</div>
            <div className="text-2xl font-bold text-white mb-4">
              {t('hero.members.title', 'of members report')}<br />
              {t('hero.members.subtitle', 'reduced anxiety after 90 days')}
            </div>
            <p className="text-blue-100 mb-8">
              {t('hero.members.study', 'In addition, BrezCode members feel accomplished by an average of 80% after 90 days, as verified in a third-party study.')}
            </p>

            <Button 
              onClick={handleTakeQuiz}
              className="bg-yellow-400 text-black px-8 py-3 rounded-full text-lg font-bold hover:bg-yellow-300 transition-all"
            >
              {t('hero.cta', 'Take the quiz to start')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}