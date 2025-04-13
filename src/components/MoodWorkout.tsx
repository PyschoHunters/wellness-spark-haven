
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Smile, Frown, Meh, Zap, Sun, Moon, Cloud, CloudRain, Heart, RefreshCw, Clock, Check } from 'lucide-react';
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
  const [isSelecting, setIsSelecting] = useState(false);
  
  const moods = [
    { id: 'happy', icon: <Smile size={24} />, label: 'Happy', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { id: 'sad', icon: <Frown size={24} />, label: 'Sad', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'neutral', icon: <Meh size={24} />, label: 'Neutral', color: 'bg-gray-100 text-gray-700 border-gray-200' }
  ];
  
  const energyLevels = [
    { id: 'low', icon: <Moon size={24} />, label: 'Low', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    { id: 'medium', icon: <Cloud size={24} />, label: 'Medium', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { id: 'high', icon: <Sun size={24} />, label: 'High', color: 'bg-orange-100 text-orange-700 border-orange-200' }
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
    setIsSelecting(true);
    
    setTimeout(() => {
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
          setSuggestedWorkout(moodMatches[Math.floor(Math.random() * moodMatches.length)]);
        } else {
          setSuggestedWorkout(workouts[Math.floor(Math.random() * workouts.length)]);
        }
      } else {
        setSuggestedWorkout(matchingWorkouts[Math.floor(Math.random() * matchingWorkouts.length)]);
      }
      
      setIsSelecting(false);
    }, 1000);
  };
  
  const handleGetSuggestion = () => {
    getWorkoutSuggestion();
    showActionToast(`Finding workout for your ${selectedMood} mood and ${selectedEnergy} energy...`);
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

  const getMoodBackgroundGradient = () => {
    switch (selectedMood) {
      case 'happy':
        return 'from-amber-50 to-amber-100/50';
      case 'sad':
        return 'from-blue-50 to-blue-100/50';
      case 'neutral':
        return 'from-gray-50 to-gray-100/50';
      default:
        return 'from-blue-50 to-blue-100/50';
    }
  };

  const getEnergyBackgroundAccent = () => {
    switch (selectedEnergy) {
      case 'low':
        return 'border-l-indigo-300';
      case 'medium':
        return 'border-l-purple-300';
      case 'high':
        return 'border-l-orange-300';
      default:
        return 'border-l-blue-300';
    }
  };
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-500 hover:shadow-lg",
      "bg-gradient-to-br", getMoodBackgroundGradient(),
      className
    )}>
      <CardContent className="p-4 relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="bg-fitness-primary/10 p-1 rounded-full">
              <Heart size={18} className="text-fitness-primary" />
            </span>
            Mood-Based Workout
          </h3>
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
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
              <p className="text-sm text-gray-600 animate-fade-up">
                Let us find the perfect workout based on how you're feeling today
              </p>
            </div>
            
            <div className="space-y-5">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium mb-3 text-gray-700 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-fitness-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-fitness-primary">1</span>
                  </span>
                  How are you feeling today?
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {moods.map((mood) => (
                    <Button
                      key={mood.id}
                      variant={selectedMood === mood.id ? "default" : "outline"}
                      className={cn(
                        "flex flex-col h-auto py-3 transition-all duration-300",
                        selectedMood === mood.id 
                          ? "bg-fitness-primary text-white scale-105 shadow-md" 
                          : `bg-white text-gray-700 hover:${mood.color} border-2`,
                        "relative overflow-hidden"
                      )}
                      onClick={() => setSelectedMood(mood.id)}
                    >
                      {selectedMood === mood.id && (
                        <span className="absolute inset-0 bg-white/20 animate-pulse-light opacity-0"></span>
                      )}
                      <div className={cn(
                        "mb-1",
                        selectedMood === mood.id ? "opacity-100" : "opacity-80"
                      )}>
                        {mood.icon}
                      </div>
                      <span className="text-xs font-medium">{mood.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">
                <h4 className="text-sm font-medium mb-3 text-gray-700 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-fitness-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-fitness-primary">2</span>
                  </span>
                  What's your energy level?
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {energyLevels.map((level) => (
                    <Button
                      key={level.id}
                      variant={selectedEnergy === level.id ? "default" : "outline"}
                      className={cn(
                        "flex flex-col h-auto py-3 transition-all duration-300",
                        selectedEnergy === level.id 
                          ? "bg-fitness-primary text-white scale-105 shadow-md" 
                          : `bg-white text-gray-700 hover:${level.color} border-2`,
                        "relative overflow-hidden"
                      )}
                      onClick={() => setSelectedEnergy(level.id)}
                    >
                      {selectedEnergy === level.id && (
                        <span className="absolute inset-0 bg-white/20 animate-pulse-light opacity-0"></span>
                      )}
                      <div className={cn(
                        "mb-1",
                        selectedEnergy === level.id ? "opacity-100" : "opacity-80"
                      )}>
                        {level.icon}
                      </div>
                      <span className="text-xs font-medium">{level.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button 
                className={cn(
                  "w-full bg-fitness-primary hover:bg-fitness-primary/90",
                  "transition-all duration-300 transform hover:scale-[1.02]",
                  "shadow-lg shadow-fitness-primary/20 h-12",
                  "relative overflow-hidden"
                )}
                onClick={handleGetSuggestion}
                disabled={isSelecting}
              >
                {isSelecting ? (
                  <>
                    <div className="animate-spin mr-2">
                      <RefreshCw size={18} />
                    </div>
                    Finding Perfect Workout...
                  </>
                ) : (
                  <>
                    <Zap size={18} className="mr-2" />
                    Get Workout Suggestion
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className={cn(
            "space-y-4 bg-white rounded-xl p-5 shadow-md border-l-4",
            getEnergyBackgroundAccent(), 
            "transform transition-all duration-500 animate-fade-up"
          )}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{suggestedWorkout.title}</h3>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className="flex items-center gap-1 bg-gray-50">
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
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fitness-primary to-fitness-primary/80 flex items-center justify-center shadow-lg shadow-fitness-primary/20 animate-pulse">
                  <Heart size={22} className="text-white" />
                </div>
                <span className="text-xs mt-1 text-gray-600 font-medium">Perfect Match</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 border-l-2 border-gray-200 pl-3 py-1 italic bg-gray-50 rounded-r-md">
              {suggestedWorkout.description}
            </p>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Energy Required</span>
                <span className="font-medium text-gray-800">{suggestedWorkout.energy}%</span>
              </div>
              <Progress 
                value={suggestedWorkout.energy} 
                className="h-2 bg-blue-100" 
              />
            </div>
            
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="text-sm font-medium mb-2 text-gray-700 flex items-center gap-1">
                <Zap size={14} className="text-fitness-primary" />
                Benefits:
              </h4>
              <ul className="grid grid-cols-1 gap-2">
                {suggestedWorkout.benefits.map((benefit, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <Check size={12} className="text-green-600" />
                    </div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex gap-2 mt-2">
              <Button 
                className="flex-1 bg-fitness-primary hover:bg-fitness-primary/90 transition-colors shadow-md shadow-fitness-primary/20 h-11"
              >
                Start Workout
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 hover:bg-gray-50 transition-colors border-2" 
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
