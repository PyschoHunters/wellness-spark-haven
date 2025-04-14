
import React from 'react';
import { X, Activity, Flame, Clock, TrendingUp, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

interface WorkoutStatsProps {
  onClose: () => void;
}

const WorkoutStats: React.FC<WorkoutStatsProps> = ({ onClose }) => {
  const weeklyData = [
    { name: 'Mon', workouts: 2, calories: 350 },
    { name: 'Tue', workouts: 1, calories: 280 },
    { name: 'Wed', workouts: 0, calories: 0 },
    { name: 'Thu', workouts: 2, calories: 520 },
    { name: 'Fri', workouts: 1, calories: 320 },
    { name: 'Sat', workouts: 3, calories: 680 },
    { name: 'Sun', workouts: 1, calories: 360 },
  ];

  const totalStats = [
    { 
      label: 'Total Workouts', 
      value: '32',
      icon: Activity,
      color: 'text-fitness-primary bg-fitness-primary/10'
    },
    { 
      label: 'Total Calories', 
      value: '12,400 kcal',
      icon: Flame,
      color: 'text-fitness-secondary bg-fitness-secondary/10'
    },
    { 
      label: 'Total Hours', 
      value: '26h 45m',
      icon: Clock,
      color: 'text-gray-500 bg-gray-100'
    },
    { 
      label: 'Current Streak', 
      value: '8 days',
      icon: Calendar,
      color: 'text-blue-500 bg-blue-100'
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-up">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold text-xl">Workout Stats</h2>
          <button 
            className="w-8 h-8 bg-fitness-gray-light rounded-full flex items-center justify-center"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {totalStats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center mb-2",
                  stat.color
                )}>
                  <stat.icon size={16} />
                </div>
                <p className="text-xs text-fitness-gray">{stat.label}</p>
                <p className="font-bold text-lg">{stat.value}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 mb-6">
            <h3 className="font-medium mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-fitness-primary mr-2"></span>
              Weekly Activity
            </h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorCaloriesStats" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#colorCaloriesStats)" 
                    barSize={30} 
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="font-medium mb-2 flex items-center">
              <span className="w-2 h-2 rounded-full bg-fitness-primary mr-2"></span>
              Most Popular Workouts
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-fitness-gray-light rounded-lg flex items-center justify-center">
                    <TrendingUp size={16} className="text-fitness-primary" />
                  </div>
                  <span>Full Body Workout</span>
                </div>
                <span className="text-sm font-medium">12 times</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-fitness-gray-light rounded-lg flex items-center justify-center">
                    <TrendingUp size={16} className="text-fitness-secondary" />
                  </div>
                  <span>HIIT Training</span>
                </div>
                <span className="text-sm font-medium">8 times</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-fitness-gray-light rounded-lg flex items-center justify-center">
                    <TrendingUp size={16} className="text-green-500" />
                  </div>
                  <span>Yoga Basics</span>
                </div>
                <span className="text-sm font-medium">5 times</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-100">
          <button 
            className="w-full bg-fitness-primary text-white py-3 rounded-xl font-medium hover:bg-blue-500 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutStats;
