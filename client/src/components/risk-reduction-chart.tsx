
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
    <div className="bg-white p-8 rounded-3xl shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-center">Risk Reduction by Activity</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={60}
            fontSize={12}
          />
          <YAxis 
            label={{ value: 'Risk Reduction (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value, name, props) => [`${value}%`, 'Risk Reduction']}
            labelFormatter={(label, payload) => {
              const item = payload?.[0]?.payload;
              return item ? item.fullName : label;
            }}
          />
          <Bar 
            dataKey="reduction" 
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth={1}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
