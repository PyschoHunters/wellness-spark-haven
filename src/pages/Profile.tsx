
import React from 'react';
import { Settings, ChevronRight, Activity, Award, BarChart2, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { cn } from '@/lib/utils';

// Define these components before they're used
const Flame = () => <span className="text-fitness-secondary">🔥</span>;
const Clock = () => <span className="text-fitness-gray">⏱️</span>;

const profileStats = [
  { label: 'Workouts', value: '32', icon: Activity, color: 'text-fitness-primary' },
  { label: 'Calories', value: '12,400', icon: Flame, color: 'text-fitness-secondary' },
  { label: 'Hours', value: '26', icon: Clock, color: 'text-fitness-gray' },
];

const menuItems = [
  { icon: Award, label: 'Achievements', color: 'bg-purple-100 text-purple-600' },
  { icon: Activity, label: 'Activity History', color: 'bg-blue-100 text-blue-600' },
  { icon: BarChart2, label: 'Workout Stats', color: 'bg-green-100 text-green-600' },
  { icon: Settings, label: 'Settings', color: 'bg-gray-100 text-gray-600' },
];

const ProfilePage = () => {
  return (
    <div className="max-w-md mx-auto px-4 pb-20">
      <Header 
        title="Profile" 
        action={
          <button className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm">
            <Settings size={20} className="text-fitness-dark" />
          </button>
        } 
      />
      
      <div className="flex flex-col items-center mb-8 animate-fade-up">
        <div className="w-24 h-24 rounded-full bg-fitness-gray-light overflow-hidden mb-4">
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-xl font-bold">Alex Johnson</h2>
        <p className="text-sm text-fitness-gray">@alexjohnson • Premium Member</p>
        
        <div className="w-full flex justify-between mt-6 bg-white rounded-2xl p-4">
          {profileStats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={cn("mb-1", stat.color)}>
                <stat.icon size={20} />
              </div>
              <span className="font-bold">{stat.value}</span>
              <span className="text-xs text-fitness-gray">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-3 animate-fade-up" style={{ animationDelay: '100ms' }}>
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between bg-white p-4 rounded-2xl cursor-pointer hover:shadow-sm transition-all duration-300"
          >
            <div className="flex items-center">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.color)}>
                <item.icon size={20} />
              </div>
              <span className="ml-3 font-medium">{item.label}</span>
            </div>
            <ChevronRight size={20} className="text-fitness-gray" />
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center animate-fade-up" style={{ animationDelay: '300ms' }}>
        <button className="text-fitness-secondary font-medium">Log Out</button>
      </div>
      
      <Navigation />
    </div>
  );
};

export default ProfilePage;
