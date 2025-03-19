
import React, { useState } from 'react';
import { Trophy, Timer, Calendar, Zap, RefreshCw } from 'lucide-react';
import { showActionToast } from '@/utils/toast-utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

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

interface UserHealthDetails {
  goal: string;
  bmi: number;
  healthIssues: string[];
}

const PersonalRecommendations: React.FC<RecommendationProps> = ({ userData }) => {
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [userHealthDetails, setUserHealthDetails] = useState<UserHealthDetails>({
    goal: "Weight loss",
    bmi: 24.5,
    healthIssues: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  
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
    if (type === 'AI') {
      setShowHealthForm(true);
    } else {
      showActionToast(`Viewing details for ${type} recommendation`);
    }
  };

  const getAIRecommendation = async () => {
    setIsLoading(true);
    
    try {
      // Using Google's Gemini API
      const prompt = `
        Generate personalized fitness and nutrition recommendations for a user with the following details:
        
        Name: ${userData.name}
        Fitness Level: ${userData.level}
        Weekly Calories Burned: ${userData.caloriesPerWeek}
        Current Weight: ${userData.weight} kg
        Body Fat Percentage: ${userData.bodyFatPercentage}%
        Recent Workouts: ${userData.recentWorkouts.join(', ')}
        
        Health Details:
        Goal: ${userHealthDetails.goal}
        BMI: ${userHealthDetails.bmi}
        Health Issues: ${userHealthDetails.healthIssues.length > 0 ? userHealthDetails.healthIssues.join(', ') : 'None'}
        
        Provide a concise personalized recommendation (max 150 words) covering workout suggestions, nutrition advice, and recovery tips.
      `;
      
      // For now, we'll use a mock response instead of actual API call
      // In a real implementation, you would use the actual Gemini API
      setTimeout(() => {
        const mockResponse = getMockAIResponse(userHealthDetails.goal);
        setAiRecommendation(mockResponse);
        setIsLoading(false);
        setShowHealthForm(false);
        showActionToast("Generated new AI recommendations");
      }, 2000);
      
    } catch (error) {
      console.error("Error fetching AI recommendation:", error);
      setIsLoading(false);
      showActionToast("Failed to generate recommendations");
    }
  };
  
  const getMockAIResponse = (goal: string): string => {
    if (goal === "Weight loss") {
      return "Based on your profile, I recommend incorporating 3-4 HIIT sessions (20-30 mins) weekly, complemented by 2 strength training sessions focusing on compound movements. Maintain a 500 calorie daily deficit through a high-protein diet (1.6g/kg bodyweight) with complex carbs before workouts. Include 2 rest days weekly for recovery, aim for 7000 steps daily, and prioritize 7-8 hours of sleep. Start with a 5-minute dynamic warm-up before workouts and finish with 5-10 minutes of static stretching. Track progress weekly through measurements and photos rather than daily weigh-ins.";
    } else if (goal === "Muscle gain") {
      return "For your muscle-building goals, focus on progressive overload with 4 strength training sessions weekly, emphasizing different muscle groups each day. Incorporate compound movements (squats, deadlifts, bench press) with 6-12 rep ranges at 70-85% of your 1RM. Maintain a 300-calorie surplus with 1.8-2.2g protein per kg of bodyweight. Include 1-2 light cardio sessions (20-30 mins) for heart health without hampering recovery. Ensure 48 hours rest between training the same muscle groups and prioritize 8 hours of sleep. Track your strength gains through a workout journal.";
    } else {
      return "To improve overall fitness, I recommend a balanced approach with 2 strength training sessions, 2 cardio sessions (mix of steady-state and HIIT), and 1 flexibility-focused workout (yoga/Pilates) weekly. Maintain calories at maintenance level with a balanced macronutrient profile (30% protein, 40% carbs, 30% fats). Stay hydrated with at least 3 liters of water daily and prioritize whole foods over processed options. Incorporate active recovery days with walking or light swimming. Track improvements in performance metrics (endurance, strength, flexibility) rather than aesthetic changes to stay motivated.";
    }
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
        
        {aiRecommendation && (
          <div 
            className="bg-fitness-gray-light p-3 rounded-xl cursor-pointer hover:bg-fitness-gray-light/80 transition-colors"
            onClick={() => handleRecommendationClick('AI')}
          >
            <div className="flex items-start gap-3">
              <div className="bg-amber-100 text-amber-600 p-2 rounded-lg">
                <RefreshCw size={18} />
              </div>
              <div>
                <h3 className="font-medium">AI Personalized Plan</h3>
                <p className="text-sm mt-1">
                  {aiRecommendation}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {!aiRecommendation && (
          <button 
            className="w-full bg-fitness-primary/10 text-fitness-primary py-2 rounded-xl font-medium flex items-center justify-center mt-2"
            onClick={() => handleRecommendationClick('AI')}
          >
            Get AI Personalized Recommendation
          </button>
        )}
      </div>
      
      <Dialog open={showHealthForm} onOpenChange={setShowHealthForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Your Health Details</DialogTitle>
            <DialogDescription>
              Share more details to get personalized AI recommendations
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fitness Goal</label>
              <select 
                className="w-full p-2 border border-gray-200 rounded-lg"
                value={userHealthDetails.goal}
                onChange={(e) => setUserHealthDetails({...userHealthDetails, goal: e.target.value})}
              >
                <option value="Weight loss">Weight loss</option>
                <option value="Muscle gain">Muscle gain</option>
                <option value="General fitness">General fitness</option>
                <option value="Endurance">Endurance</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">BMI</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-200 rounded-lg"
                value={userHealthDetails.bmi}
                onChange={(e) => setUserHealthDetails({...userHealthDetails, bmi: parseFloat(e.target.value)})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Health Issues</label>
              <div className="space-y-2">
                {['Back pain', 'Joint issues', 'High blood pressure', 'Diabetes', 'Asthma'].map((issue) => (
                  <label key={issue} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={userHealthDetails.healthIssues.includes(issue)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setUserHealthDetails({
                            ...userHealthDetails, 
                            healthIssues: [...userHealthDetails.healthIssues, issue]
                          });
                        } else {
                          setUserHealthDetails({
                            ...userHealthDetails, 
                            healthIssues: userHealthDetails.healthIssues.filter(i => i !== issue)
                          });
                        }
                      }}
                    />
                    <span className="text-sm">{issue}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <button 
              className="w-full bg-fitness-primary text-white py-2 rounded-lg font-medium mt-4"
              onClick={getAIRecommendation}
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Get Personalized Plan'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PersonalRecommendations;
