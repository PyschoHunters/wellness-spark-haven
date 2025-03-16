
import React from 'react';
import { Trophy, Timer, Calendar, Zap } from 'lucide-react';
import { showActionToast } from '@/utils/toast-utils';

interface RecommendationProps {
  userData: {
    name: string;
    level: string;
    caloriesPerWeek: number;
    weight: number;
    bodyFatPercentage: number;
    recentWorkouts: string[];
  }
}

const PersonalRecommendations: React.FC<RecommendationProps> = ({ userData }) => {
  const getRecommendedWorkouts = () => {
    if (userData.level === 'Beginner') {
      return ['Walking', 'Light Cardio', 'Basic Strength Training'];
    } else if (userData.level === 'Intermediate') {
      return ['HIIT Sessions', 'Progressive Strength Training', 'Functional Fitness'];
    } else {
      return ['Advanced Strength Training', 'Power Lifting', 'Complex HIIT Circuits'];
    }
  };

  const getRecommendedNutrition = () => {
    if (userData.bodyFatPercentage > 25) {
      return 'Focus on a calorie deficit with high protein intake to support fat loss while preserving muscle mass.';
    } else if (userData.bodyFatPercentage > 15) {
      return 'Maintain a balanced diet with moderate protein to support muscle maintenance and gradual fat loss.';
    } else {
      return 'Consider a slight calorie surplus with high protein intake to support muscle growth.';
    }
  };

  const handleRecommendationClick = (type: string) => {
    showActionToast(`Viewing details for ${type} recommendation`);
  };

  const recommendedWorkouts = getRecommendedWorkouts();
  
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Personalized For You</h2>
        <button 
          className="text-sm font-medium text-fitness-primary"
          onClick={() => showActionToast("Refreshing recommendations")}
        >
          Refresh
        </button>
      </div>
      
      <div className="bg-gradient-to-r from-fitness-primary to-fitness-secondary text-white p-4 rounded-xl mb-4">
        <h3 className="font-medium mb-1">Hello, {userData.name}!</h3>
        <p className="text-sm opacity-90">
          Based on your {userData.level.toLowerCase()} level and recent activity, we've prepared these recommendations to help you reach your fitness goals faster.
        </p>
      </div>
      
      <div className="space-y-3">
        <div 
          className="bg-fitness-gray-light p-3 rounded-xl cursor-pointer hover:bg-fitness-gray-light/80 transition-colors"
          onClick={() => handleRecommendationClick('Workout')}
        >
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <Trophy size={18} />
            </div>
            <div>
              <h3 className="font-medium">Recommended Workouts</h3>
              <ul className="mt-2 space-y-1">
                {recommendedWorkouts.map((workout, index) => (
                  <li key={index} className="text-sm flex items-center gap-2">
                    <Zap size={14} className="text-fitness-primary" />
                    {workout}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div 
          className="bg-fitness-gray-light p-3 rounded-xl cursor-pointer hover:bg-fitness-gray-light/80 transition-colors"
          onClick={() => handleRecommendationClick('Nutrition')}
        >
          <div className="flex items-start gap-3">
            <div className="bg-green-100 text-green-600 p-2 rounded-lg">
              <Timer size={18} />
            </div>
            <div>
              <h3 className="font-medium">Nutrition Advice</h3>
              <p className="text-sm mt-1">{getRecommendedNutrition()}</p>
            </div>
          </div>
        </div>
        
        <div 
          className="bg-fitness-gray-light p-3 rounded-xl cursor-pointer hover:bg-fitness-gray-light/80 transition-colors"
          onClick={() => handleRecommendationClick('Improvement')}
        >
          <div className="flex items-start gap-3">
            <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
              <Calendar size={18} />
            </div>
            <div>
              <h3 className="font-medium">Areas for Improvement</h3>
              <p className="text-sm mt-1">
                {userData.caloriesPerWeek < 1500 
                  ? "Try to increase your weekly activity to reach at least 1500 calories burned per week." 
                  : "You're on the right track with your activity level! Consider adding variety to your workouts."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalRecommendations;
