
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

interface ActivityChartProps {
  data: Array<{
    name: string;
    calories: number;
  }>;
  className?: string;
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data, className }) => {
  return (
    <div className={cn("w-full h-[300px] bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-up", className)}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <span className="w-2 h-2 rounded-full bg-fitness-primary mr-2"></span>
        Weekly Activity
      </h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4d94ff" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#4d94ff" stopOpacity={0.3}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#86868B' }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#86868B' }}
            width={30}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '8px 12px',
            }}
            itemStyle={{ color: '#1C1C1E' }}
            labelStyle={{ color: '#86868B', marginBottom: '5px', fontWeight: 'bold' }}
            formatter={(value) => [`${value} calories`, 'Burned']}
            cursor={{fill: 'rgba(77, 148, 255, 0.1)'}}
          />
          <Bar 
            dataKey="calories" 
            radius={[5, 5, 0, 0]} 
            fill="url(#colorCalories)" 
            barSize={32} 
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;
