
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RiskReductionChart() {
  const data = [
    {
      name: "Breathing",
      reduction: 15,
      fullName: "Daily 5mins breathing exercise"
    },
    {
      name: "Mindfulness", 
      reduction: 5,
      fullName: "Daily 10mins mindfulness exercise"
    },
    {
      name: "Massage",
      reduction: 20,
      fullName: "3x/weekly Self Breast Massage"
    },
    {
      name: "Diet",
      reduction: 20,
      fullName: "Personalized dietary management"
    },
    {
      name: "Exercise",
      reduction: 40,
      fullName: "Daily Physical exercise tracking"
    },
    {
      name: "Exam",
      reduction: 20,
      fullName: "Monthly Self Breast Exam"
    },
    {
      name: "Education",
      reduction: 5,
      fullName: "Daily educational content and tips"
    },
    {
      name: "AI Monitor",
      reduction: 50,
      fullName: "AI-Risk Monitoring system"
    }
  ];

  return (
    <div className="flex flex-col items-center mb-16">
      {/* Celebration Header */}
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-green-600 mb-2">
          🎉 Reach Risk Reduction of 100% 🎊
        </h3>
        <p className="text-lg text-gray-600">
          Combine all activities for maximum protection! 🌟
        </p>
      </div>

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
              <div className="text-center mb-4">
                <h4 className="text-lg font-bold text-gray-800">Risk Reduction by Activity</h4>
              </div>
              
              <ResponsiveContainer width="100%" height="85%">
                <BarChart
                  data={data}
                  layout="horizontal"
                  margin={{
                    top: 20,
                    right: 30,
                    left: 60,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number"
                    domain={[0, 60]}
                    tickFormatter={(value) => `${value}%`}
                    fontSize={10}
                  />
                  <YAxis 
                    type="category"
                    dataKey="name"
                    width={50}
                    fontSize={9}
                    interval={0}
                  />
                  <Tooltip 
                    formatter={(value, name, props) => [`${value}%`, 'Risk Reduction']}
                    labelFormatter={(label, payload) => {
                      const item = payload?.[0]?.payload;
                      return item ? item.fullName : label;
                    }}
                    contentStyle={{
                      fontSize: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}
                  />
                  <Bar 
                    dataKey="reduction" 
                    fill="#fbbf24"
                    stroke="#f59e0b"
                    strokeWidth={1}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Phone Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-700 rounded-full"></div>
      </div>

      {/* Total Risk Reduction Display */}
      <div className="mt-8 text-center">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl shadow-lg">
          <div className="text-2xl font-bold">Total Risk Reduction: 175% 🎯</div>
          <div className="text-sm opacity-90 mt-1">Maximum protection achieved! 🛡️</div>
        </div>
      </div>
    </div>
  );
}
