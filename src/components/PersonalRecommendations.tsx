
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface UserData {
  name: string;
  level: string;
  caloriesPerWeek: number;
  weight: number;
  bodyFatPercentage: number;
  recentWorkouts: string[];
}

interface PersonalRecommendationsProps {
  userData: UserData;
}

const PersonalRecommendations: React.FC<PersonalRecommendationsProps> = ({ userData }) => {
  // This is a mock personalized recommendation for the user
  // In a real app, this would come from an API based on user data
  const personalizedRecommendation = {
    workout: "Focus on low-impact endurance training like brisk walking (45-60 mins), cycling, or swimming. Incorporate core strengthening exercises to support your back. Modify HIIT sessions to be low-impact, prioritizing longer intervals with shorter rest. Morning yoga focusing on back stretches like Bhujangasana (Cobra Pose) is beneficial.",
    nutrition: "Manage blood sugar with a balanced diet. Prioritize complex carbs like brown rice, whole wheat roti, and millets (bajra, jowar). Include protein sources like lentils (dal), chickpeas (chole), and lean chicken. Limit processed foods and sugary drinks. Include healthy fats like nuts and seeds.",
    recovery: "Prioritize sleep (7-8 hours). Manage back pain with regular stretching and physiotherapy. Stay hydrated, especially after workouts. Consider incorporating turmeric (haldi) and ginger in your diet for anti-inflammatory benefits."
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
          <h3 className="text-lg font-semibold">Personal Recommendations</h3>
          <p className="text-sm opacity-90">Tailored for your fitness journey</p>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-blue-600 border-b pb-1">Workout</h4>
            <p className="text-sm">{personalizedRecommendation.workout}</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-green-600 border-b pb-1">Nutrition</h4>
            <p className="text-sm">{personalizedRecommendation.nutrition}</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-amber-600 border-b pb-1">Recovery</h4>
            <p className="text-sm">{personalizedRecommendation.recovery}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalRecommendations;
