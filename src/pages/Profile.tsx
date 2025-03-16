
import React from 'react';
import { Flame, Clock, Heart, Activity } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import DietTracker from '@/components/DietTracker';
import BodyProgress from '@/components/BodyProgress';
import DailyTips from '@/components/DailyTips';
import PersonalRecommendations from '@/components/PersonalRecommendations';
import { showActionToast } from '@/utils/toast-utils';

const Profile = () => {
  const handleSeeAllAchievements = () => {
    showActionToast("Viewing all achievements");
  };

  const handleBellClick = () => {
    showActionToast("No new notifications");
  };

  // User data for personalized recommendations
  const userData = {
    name: "Manumohan",
    level: "Intermediate",
    caloriesPerWeek: 1250,
    weight: 74.0,
    bodyFatPercentage: 20.8,
    recentWorkouts: ["Morning Workout", "Full Body", "HIIT Session"]
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20">
      <Header 
        title="Hi, Manumohan" 
        subtitle="Check your fitness profile" 
        action={
          <button 
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm"
            onClick={handleBellClick}
          >
            <Flame size={20} className="text-fitness-dark" />
          </button>
        }
      />
      
      <div className="flex flex-col gap-6">
        <div className="flex items-center bg-white rounded-2xl p-4 shadow-sm">
          <img 
            src="/lovable-uploads/11f24990-5ac1-4930-8ca7-eaea332a39ee.png" 
            alt="Profile" 
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="ml-4 flex-1">
            <h2 className="font-bold text-xl">Manumohan</h2>
            <p className="text-fitness-gray text-sm">manumohan.ai21@gmail.com</p>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Activity size={14} className="text-fitness-primary" />
                <span className="text-xs font-medium">Intermediate</span>
              </div>
              <div className="flex items-center gap-1">
                <Flame size={14} className="text-fitness-secondary" />
                <span className="text-xs font-medium">1250 kcal/week</span>
              </div>
            </div>
          </div>
        </div>
        
        <PersonalRecommendations userData={userData} />
        
        <DietTracker />
        
        <BodyProgress />
        
        <DailyTips />
      </div>
      
      <Navigation />
    </div>
  );
};

export default Profile;
