import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Smile, Frown, Meh, Zap, Sun, Moon, Cloud, CloudRain, Heart, RefreshCw, Clock } from 'lucide-react';
import { showActionToast } from '@/utils/toast-utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface MoodWorkoutProps {
  className?: string;
}

interface Workout {
  id: string;
  title: string;
  description: string;
  duration: string;
  intensity: 'low' | 'medium' | 'high';
  benefits: string[];
  energy: number;
  suitable: string[];
}

const MoodWorkout: React.FC<MoodWorkoutProps> = ({ className }) => {
  const [selectedMood, setSelectedMood] = useState<string>('happy');
  const [selectedEnergy, setSelectedEnergy] = useState<string>('medium');
  const [suggestedWorkout, setSuggestedWorkout] = useState<Workout | null>(null);
  
  const moods = [
    { id: 'happy', icon: <Smile size={24} />, label: 'Happy' },
    { id: 'sad', icon: <Frown size={24} />, label: 'Sad' },
    { id: 'neutral', icon: <Meh size={24} />, label: 'Neutral' }
  ];
  
  const energyLevels = [
    { id: 'low', icon: <Moon size={24} />, label: 'Low' },
    { id: 'medium', icon: <Cloud size={24} />, label: 'Medium' },
    { id: 'high', icon: <Sun size={24} />, label: 'High' }
  ];
  
  const workouts: Workout[] = [
    {
      id: 'w1',
      title: 'Gentle Stretch & Breathe',
      description: 'A gentle routine focusing on deep breathing and light stretching to improve mood and reduce stress.',
      duration: '15 min',
      intensity: 'low',
      benefits: ['Reduces stress', 'Improves flexibility', 'Calms the mind'],
      energy: 30,
      suitable: ['sad', 'neutral', 'low', 'medium']
    },
    {
      id: 'w2',
      title: 'Mood-Lifting Dance',
      description: 'Energetic dance movements set to upbeat music to boost endorphins and elevate your mood.',
      duration: '20 min',
      intensity: 'medium',
      benefits: ['Boosts mood', 'Increases heart rate', 'Improves coordination'],
      energy: 65,
      suitable: ['happy', 'neutral', 'medium', 'high']
    },
    {
      id: 'w3',
      title: 'Mindful Power Walk',
      description: 'Combines brisk walking with mindfulness techniques to clear your head and energize your body.',
      duration: '30 min',
      intensity: 'medium',
      benefits: ['Clears mind', 'Builds endurance', 'Reduces anxiety'],
      energy: 55,
      suitable: ['neutral', 'sad', 'low', 'medium']
    },
    {
      id: 'w4',
      title: 'Expression Flow Yoga',
      description: 'Yoga sequence designed to release emotional tension and promote positive energy flow.',
      duration: '25 min',
      intensity: 'low',
      benefits: ['Releases tension', 'Improves posture', 'Enhances mood'],
      energy: 40,
      suitable: ['sad', 'neutral', 'low', 'medium']
    },
    {
      id: 'w5',
      title: 'High-Energy HIIT',
      description: 'Short bursts of intense exercise with recovery periods to channel excess energy and boost confidence.',
      duration: '20 min',
      intensity: 'high',
      benefits: ['Burns calories', 'Releases endorphins', 'Builds strength'],
      energy: 85,
      suitable: ['happy', 'neutral', 'high']
    },
    {
      id: 'w6',
      title: 'Gratitude Mobility Flow',
      description: 'A combination of mobility exercises with gratitude practices to improve both physical and mental wellbeing.',
      duration: '18 min',
      intensity: 'medium',
      benefits: ['Improves mobility', 'Enhances mood', 'Fosters gratitude'],
      energy: 50,
      suitable: ['happy', 'neutral', 'medium']
    },
    {
      id: 'w7',
      title: 'Stress Relief Circuit',
      description: 'Circuit training focused on releasing physical tension and channeling negative emotions productively.',
      duration: '25 min',
      intensity: 'medium',
      benefits: ['Reduces stress', 'Builds strength', 'Improves focus'],
      energy: 60,
      suitable: ['sad', 'neutral', 'medium', 'high']
    },
    {
      id: 'w8',
      title: 'Energy Boost Cardio',
      description: 'Quick, effective cardio session designed to wake up your body and reset your mind.',
      duration: '15 min',
      intensity: 'high',
      benefits: ['Increases energy', 'Improves circulation', 'Clears mental fog'],
      energy: 75,
      suitable: ['neutral', 'happy', 'medium', 'high']
    }
  ];
  
  const getWorkoutSuggestion = () => {
    const matchingWorkouts = workouts.filter(workout => 
      workout.suitable.includes(selectedMood) && 
      workout.suitable.includes(selectedEnergy)
    );
    
    if (matchingWorkouts.length === 0) {
      showActionToast("No perfect match found. Here's our best recommendation!");
      const moodMatches = workouts.filter(workout => 
        workout.suitable.includes(selectedMood)
      );
      
      if (moodMatches.length > 0) {
        return moodMatches[Math.floor(Math.random() * moodMatches.length)];
      } else {
        return workouts[Math.floor(Math.random() * workouts.length)];
      }
    }
    
    return matchingWorkouts[Math.floor(Math.random() * matchingWorkouts.length)];
  };
  
  const handleGetSuggestion = () => {
    const suggestion = getWorkoutSuggestion();
    setSuggestedWorkout(suggestion);
    showActionToast(`Workout suggested based on your ${selectedMood} mood and ${selectedEnergy} energy!`);
  };
  
  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-lg",
      "bg-gradient-to-br from-blue-50 to-blue-100/50",
      className
    )}>
      <CardContent className="p-4 relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Mood-Based Workout</h3>
          {suggestedWorkout && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSuggestedWorkout(null)}
              className="h-8 w-8 hover:bg-blue-100 transition-colors"
            >
              <RefreshCw size={16} className="text-gray-600" />
            </Button>
          )}
        </div>
        
        {!suggestedWorkout ? (
          <>
            <p className="text-sm text-gray-600 mb-4 animate-fade-up">
              Discover personalized workouts tailored to your mood and energy
            </p>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-700">How are you feeling today?</h4>
                <div className="grid grid-cols-3 gap-2">
                  {moods.map((mood) => (
                    <Button
                      key={mood.id}
                      variant={selectedMood === mood.id ? "default" : "outline"}
                      className={cn(
                        "flex flex-col h-auto py-3 transition-all duration-300",
                        "hover:bg-blue-50 hover:border-blue-200",
                        selectedMood === mood.id 
                          ? "bg-fitness-primary text-white" 
                          : "bg-white text-gray-700"
                      )}
                      onClick={() => setSelectedMood(mood.id)}
                    >
                      <div className="mb-1 opacity-80">{mood.icon}</div>
                      <span className="text-xs">{mood.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-700">What's your energy level?</h4>
                <div className="grid grid-cols-3 gap-2">
                  {energyLevels.map((level) => (
                    <Button
                      key={level.id}
                      variant={selectedEnergy === level.id ? "default" : "outline"}
                      className={cn(
                        "flex flex-col h-auto py-3 transition-all duration-300",
                        "hover:bg-blue-50 hover:border-blue-200",
                        selectedEnergy === level.id 
                          ? "bg-fitness-primary text-white" 
                          : "bg-white text-gray-700"
                      )}
                      onClick={() => setSelectedEnergy(level.id)}
                    >
                      <div className="mb-1 opacity-80">{level.icon}</div>
                      <span className="text-xs">{level.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button 
                className={cn(
                  "w-full bg-fitness-primary hover:bg-fitness-primary/90 mt-4",
                  "transition-all duration-300 transform hover:scale-[1.02]"
                )}
                onClick={handleGetSuggestion}
              >
                <Zap size={16} className="mr-2" />
                Get Workout Suggestion
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4 bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{suggestedWorkout.title}</h3>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock size={12} className="text-gray-500" />
                    <span className="text-xs text-gray-600">{suggestedWorkout.duration}</span>
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs", 
                      getIntensityColor(suggestedWorkout.intensity)
                    )}
                  >
                    {suggestedWorkout.intensity.charAt(0).toUpperCase() + suggestedWorkout.intensity.slice(1)} Intensity
                  </Badge>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-fitness-primary flex items-center justify-center animate-pulse">
                  <Heart size={20} className="text-white" />
                </div>
                <span className="text-xs mt-1 text-gray-600">Perfect Match</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-700">{suggestedWorkout.description}</p>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Energy Required</span>
                <span className="font-medium text-gray-800">{suggestedWorkout.energy}%</span>
              </div>
              <Progress 
                value={suggestedWorkout.energy} 
                className="h-2 bg-blue-100" 
                indicatorClassName="bg-fitness-primary" 
              />
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1 text-gray-700">Benefits:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {suggestedWorkout.benefits.map((benefit, index) => (
                  <li key={index} className="text-sm text-gray-600">{benefit}</li>
                ))}
              </ul>
            </div>
            
            <div className="flex gap-2 mt-2">
              <Button 
                className="flex-1 bg-fitness-primary hover:bg-fitness-primary/90 transition-colors"
              >
                Start Workout
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 hover:bg-gray-50 transition-colors" 
                onClick={() => setSuggestedWorkout(null)}
              >
                Choose Again
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodWorkout;
