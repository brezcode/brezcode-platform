
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
      {/* Phone Mockup */}
      <div className="relative">
        {/* Phone Frame */}
        <div className="w-80 h-[600px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
          {/* Screen */}
          <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
            {/* Phone Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10"></div>
            
            {/* Chart Content */}
            <div className="pt-8 px-3 h-full">
              {/* Celebration Header inside phone */}
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-green-600 mb-1">
                  🎉 Reach Risk Reduction of 100% 🎊
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  Combine all activities for maximum protection! 🌟
                </p>
                <h4 className="text-md font-bold text-gray-800">Risk Reduction by Activity</h4>
              </div>
              
              <ResponsiveContainer width="100%" height="70%">
                <BarChart
                  data={data}
                  layout="horizontal"
                  margin={{
                    top: 5,
                    right: 10,
                    left: 55,
                    bottom: 5,
                  }}
                  barCategoryGap="10%"
                  barGap={2}
                >
                  <CartesianGrid strokeDasharray="2 2" stroke="#d1d5db" opacity={0.3} />
                  <XAxis 
                    type="number"
                    domain={[0, 50]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 8, fill: '#6b7280' }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis 
                    type="category"
                    dataKey="name"
                    width={50}
                    fontSize={7}
                    interval={0}
                    tick={{ fill: '#374151', fontWeight: '500' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    formatter={(value, name, props) => [`${value}%`, 'Risk Reduction']}
                    labelFormatter={(label, payload) => {
                      const item = payload?.[0]?.payload;
                      return item ? item.fullName : label;
                    }}
                    contentStyle={{
                      fontSize: '10px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      padding: '8px',
                      backgroundColor: 'white',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="reduction" 
                    fill="#2563eb"
                    stroke="#1d4ed8"
                    strokeWidth={0}
                    radius={[0, 4, 4, 0]}
                    minPointSize={8}
                    label={{
                      position: 'inside',
                      fill: 'white',
                      fontSize: 8,
                      fontWeight: 'bold',
                      formatter: (value) => `${value}%`
                    }}
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
