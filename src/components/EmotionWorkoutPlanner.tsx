
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Smile, 
  Frown, 
  Angry, 
  Heart, 
  Zap, 
  Music, 
  Brain, 
  Sun 
} from 'lucide-react';
import { showActionToast } from '@/utils/toast-utils';
import { useNavigate } from 'react-router-dom';

interface EmotionOption {
  name: string;
  icon: React.ReactNode;
  color: string;
  workouts: {
    title: string;
    description: string;
    duration: string;
    intensity: 'Low' | 'Medium' | 'High';
    benefits: string[];
  }[];
}

const EmotionWorkoutPlanner: React.FC = () => {
  const navigate = useNavigate();
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [showWorkouts, setShowWorkouts] = useState(false);

  const emotions: EmotionOption[] = [
    {
      name: "Happy",
      icon: <Smile className="h-6 w-6" />,
      color: "bg-yellow-100 text-yellow-600",
      workouts: [
        {
          title: "Energetic Dance Cardio",
          description: "Channel your positive energy with upbeat dance moves",
          duration: "25 min",
          intensity: "Medium",
          benefits: ["Mood booster", "Cardio health", "Coordination"]
        },
        {
          title: "Outdoor Running",
          description: "Enjoy the outdoors with a refreshing run",
          duration: "30 min",
          intensity: "High",
          benefits: ["Endorphin release", "Vitamin D", "Stamina building"]
        }
      ]
    },
    {
      name: "Stressed",
      icon: <Brain className="h-6 w-6" />,
      color: "bg-purple-100 text-purple-600",
      workouts: [
        {
          title: "Mindful Yoga Flow",
          description: "Gentle movements with focus on breathing and tension release",
          duration: "30 min",
          intensity: "Low",
          benefits: ["Stress reduction", "Mind-body connection", "Flexibility"]
        },
        {
          title: "Walking Meditation",
          description: "Combine light exercise with mindfulness techniques",
          duration: "20 min",
          intensity: "Low",
          benefits: ["Mental clarity", "Anxiety relief", "Mindfulness practice"]
        }
      ]
    },
    {
      name: "Tired",
      icon: <Sun className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-600",
      workouts: [
        {
          title: "Gentle Stretching",
          description: "Wake up your body with light, energizing stretches",
          duration: "15 min",
          intensity: "Low",
          benefits: ["Energy boost", "Muscle activation", "Improved circulation"]
        },
        {
          title: "Revitalizing Workout",
          description: "Short, low-impact exercises to increase energy levels",
          duration: "20 min",
          intensity: "Low",
          benefits: ["Natural energy", "Mental alertness", "Mood improvement"]
        }
      ]
    },
    {
      name: "Angry",
      icon: <Angry className="h-6 w-6" />,
      color: "bg-red-100 text-red-600",
      workouts: [
        {
          title: "Boxing Workout",
          description: "Channel frustration into powerful punches and movements",
          duration: "30 min",
          intensity: "High",
          benefits: ["Stress release", "Emotional regulation", "Strength building"]
        },
        {
          title: "HIIT Intensity",
          description: "High-intensity intervals to burn through strong emotions",
          duration: "25 min",
          intensity: "High",
          benefits: ["Emotional release", "Endorphin boost", "Metabolic benefits"]
        }
      ]
    },
    {
      name: "Sad",
      icon: <Frown className="h-6 w-6" />,
      color: "bg-indigo-100 text-indigo-600",
      workouts: [
        {
          title: "Mood-Lifting Walking",
          description: "Easy outdoor walk with uplifting music or podcast",
          duration: "30 min",
          intensity: "Low",
          benefits: ["Fresh air", "Gentle mood boost", "Light activity"]
        },
        {
          title: "Expressive Dance",
          description: "Free-form movement to express and process emotions",
          duration: "20 min",
          intensity: "Medium",
          benefits: ["Emotional processing", "Self-expression", "Endorphin release"]
        }
      ]
    },
    {
      name: "Motivated",
      icon: <Zap className="h-6 w-6" />,
      color: "bg-green-100 text-green-600",
      workouts: [
        {
          title: "Strength Challenge",
          description: "Push your limits with progressive strength training",
          duration: "40 min",
          intensity: "High",
          benefits: ["Strength gains", "Achievement feeling", "Confidence boost"]
        },
        {
          title: "New Skill Practice",
          description: "Channel motivation into learning a new fitness skill",
          duration: "35 min",
          intensity: "Medium",
          benefits: ["Skill development", "Brain-body coordination", "Growth mindset"]
        }
      ]
    },
    {
      name: "Relaxed",
      icon: <Music className="h-6 w-6" />,
      color: "bg-teal-100 text-teal-600",
      workouts: [
        {
          title: "Flow Yoga",
          description: "Maintain your calm state with flowing yoga sequences",
          duration: "35 min",
          intensity: "Low",
          benefits: ["Maintained calm", "Flexibility", "Mind-body harmony"]
        },
        {
          title: "Gentle Swimming",
          description: "Fluid movements in water to maintain relaxation",
          duration: "30 min",
          intensity: "Medium",
          benefits: ["Low-impact exercise", "Full-body movement", "Continued relaxation"]
        }
      ]
    },
    {
      name: "Loving",
      icon: <Heart className="h-6 w-6" />,
      color: "bg-pink-100 text-pink-600",
      workouts: [
        {
          title: "Partner Yoga",
          description: "Connect with a loved one through partner exercises",
          duration: "25 min",
          intensity: "Low",
          benefits: ["Connection", "Trust building", "Shared experience"]
        },
        {
          title: "Gratitude Walk",
          description: "Walking meditation focused on appreciation and love",
          duration: "20 min",
          intensity: "Low",
          benefits: ["Mindfulness", "Emotional wellbeing", "Heart-centered activity"]
        }
      ]
    }
  ];

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
    setShowWorkouts(true);
  };

  const handleStartWorkout = (workout: any) => {
    showActionToast(`Starting your ${workout.title} workout`);
    // In a real app, this would navigate to the workout or add it to schedule
  };

  const resetSelection = () => {
    setSelectedEmotion(null);
    setShowWorkouts(false);
  };

  const selectedEmotionData = emotions.find(e => e.name === selectedEmotion);

  return (
    <Card className="border-none shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-fitness-primary/80 to-fitness-primary text-white">
        <CardTitle className="text-xl flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Emotion-Based Workouts
        </CardTitle>
        <CardDescription className="text-white/80">
          Workouts tailored to how you feel today
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4">
        {!showWorkouts ? (
          <>
            <p className="text-sm text-gray-600 mb-3">
              How are you feeling today? Select your mood for personalized recommendations.
            </p>
            <div className="grid grid-cols-4 gap-2">
              {emotions.map((emotion) => (
                <button
                  key={emotion.name}
                  onClick={() => handleEmotionSelect(emotion.name)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all hover:shadow-md ${emotion.color}`}
                >
                  {emotion.icon}
                  <span className="text-xs font-medium mt-1">{emotion.name}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-full ${selectedEmotionData?.color}`}>
                  {selectedEmotionData?.icon}
                </div>
                <div>
                  <h3 className="font-medium">Feeling {selectedEmotionData?.name}</h3>
                  <p className="text-xs text-gray-500">These workouts can help channel your energy</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetSelection}
                className="text-fitness-primary"
              >
                Change
              </Button>
            </div>
            
            <div className="space-y-3">
              {selectedEmotionData?.workouts.map((workout, index) => (
                <div 
                  key={index} 
                  className="p-3 rounded-lg border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-fitness-dark">{workout.title}</h4>
                      <p className="text-xs text-gray-600">{workout.description}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-medium text-gray-600">{workout.duration}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full mt-1 ${
                        workout.intensity === 'Low' ? 'bg-green-100 text-green-700' : 
                        workout.intensity === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {workout.intensity}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {workout.benefits.map((benefit, i) => (
                      <span key={i} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                        {benefit}
                      </span>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full bg-fitness-primary hover:bg-fitness-primary/90"
                    size="sm"
                    onClick={() => handleStartWorkout(workout)}
                  >
                    Start Workout
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionWorkoutPlanner;
