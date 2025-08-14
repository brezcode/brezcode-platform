import React from 'react';
import { useTranslation } from './LanguageSelector';

export default function RiskReductionChart() {
  const { t } = useTranslation();
  const data = [
    { name: t('riskChart.breathing', 'Breathing'), reduction: 15, fullName: t('features.activity1.title', 'Daily 5mins breathing exercise') },
    { name: t('riskChart.mindfulness', 'Mindfulness'), reduction: 5, fullName: t('features.activity2.title', 'Daily 10mins mindfulness exercise') },
    { name: t('riskChart.massage', 'Massage'), reduction: 20, fullName: t('features.activity3.title', '3x/weekly Self Breast Massage') },
    { name: t('riskChart.diet', 'Diet'), reduction: 20, fullName: t('features.activity4.title', 'Personalized dietary management') },
    { name: t('riskChart.exercise', 'Exercise'), reduction: 40, fullName: t('features.activity5.title', 'Daily Physical exercise tracking') },
    { name: t('riskChart.exam', 'Exam'), reduction: 20, fullName: t('features.activity6.title', 'Monthly Self Breast Exam') },
    { name: t('riskChart.education', 'Education'), reduction: 5, fullName: t('features.activity7.title', 'Daily educational content and tips') },
    { name: t('riskChart.aiMonitor', 'AI Monitor'), reduction: 50, fullName: t('features.activity8.title', 'AI-Risk Monitoring system') }
  ];

  // Calculate width percentage based on max value of 50%
  const getBarWidth = (value: number) => {
    return (value / 50) * 100; // 50% is the max value (AI Monitor)
  };

  return (
    <div className="flex flex-col items-center mb-16">
      {/* Phone Mockup */}
      <div className="relative">
        {/* Phone Frame */}
        <div className="w-80 h-[600px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
          {/* Screen */}
          <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
            {/* Phone Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10"></div>

            {/* Chart Content */}
            <div className="pt-8 px-4 h-full">
              {/* Celebration Header inside phone */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-green-600 mb-1">
                  🎉 {t('riskChart.reach100', 'Reach Risk Reduction of 100%')} 🎊
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  {t('riskChart.combineAll', 'Combine all activities for maximum protection!')} 🌟
                </p>
                <h4 className="text-md font-bold text-gray-800 mb-4">{t('riskChart.byActivity', 'Risk Reduction by Activity')}</h4>
              </div>

              {/* Custom Bar Chart */}
              <div className="space-y-3">
                {data.map((item, index) => (
                  <div key={index} className="flex items-center">
                    {/* Bar Container */}
                    <div className="flex-1 relative flex items-center">
                      <div 
                        className="bg-blue-600 h-10 rounded-md flex items-center justify-between px-3 transition-all duration-500 ease-out min-w-[120px]"
                        style={{ width: `${getBarWidth(item.reduction)}%` }}
                      >
                        <span className="text-white font-bold text-sm truncate">
                          {item.name}
                        </span>
                      </div>

                      {/* Percentage on the right */}
                      <span className="text-gray-800 font-bold text-sm ml-3 min-w-[35px]">
                        {item.reduction}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Phone Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-700 rounded-full"></div>
      </div>

      {/* Total Risk Reduction Display */}
      <div className="mt-8 text-center">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl shadow-lg">
          <div className="text-2xl font-bold">{t('riskChart.total', 'Total Risk Reduction: 175% 🎯')}</div>
          <div className="text-sm opacity-90 mt-1">{t('riskChart.maxProtection', 'Maximum protection achieved! 🛡️')}</div>
        </div>
      </div>
    </div>
  );
}