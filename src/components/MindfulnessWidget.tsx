
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircleDot, Clock, Heart, Lotus, Moon, Smile, Sparkles, Timer, Zap, CloudFog, Leaf } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { showActionToast } from '@/utils/toast-utils';
import { supabase } from '@/integrations/supabase/client';

interface Exercise {
  id: number;
  name: string;
  duration: number;
  description: string;
  benefits: string[];
  steps: string[];
  category: 'breathing' | 'meditation' | 'focus' | 'sleep';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  iconType: string;
}

const exercises: Exercise[] = [
  {
    id: 1,
    name: "Box Breathing",
    duration: 120,
    description: "A simple breathing technique to reduce stress and improve focus",
    benefits: [
      "Reduces stress and anxiety",
      "Improves concentration",
      "Helps manage emotional responses",
      "Can be done anywhere"
    ],
    steps: [
      "Breathe in through your nose for 4 seconds",
      "Hold your breath for 4 seconds",
      "Exhale through your mouth for 4 seconds",
      "Hold your breath for 4 seconds",
      "Repeat for 2-5 minutes"
    ],
    category: "breathing",
    difficulty: "beginner",
    iconType: "breathing"
  },
  {
    id: 2,
    name: "Body Scan Meditation",
    duration: 300,
    description: "A meditation practice that involves focusing attention on different parts of the body",
    benefits: [
      "Increases body awareness",
      "Helps release physical tension",
      "Promotes relaxation",
      "Improves concentration"
    ],
    steps: [
      "Lie down or sit comfortably with eyes closed",
      "Take a few deep breaths",
      "Focus your attention on your feet, noticing any sensations",
      "Slowly move your attention up through your body",
      "Notice any areas of tension and try to relax them",
      "Continue until you've scanned your entire body"
    ],
    category: "meditation",
    difficulty: "beginner",
    iconType: "meditation"
  },
  {
    id: 3,
    name: "Candle Gazing",
    duration: 180,
    description: "A traditional concentration practice involving gazing at a candle flame",
    benefits: [
      "Sharpens concentration",
      "Calms the mind",
      "Improves eye strength",
      "Enhances visualization skills"
    ],
    steps: [
      "Place a lit candle at eye level about 2 feet away",
      "Sit comfortably with a straight back",
      "Gaze softly at the flame without blinking too much",
      "When your mind wanders, gently bring attention back to the flame",
      "Practice for 3-5 minutes initially"
    ],
    category: "focus",
    difficulty: "intermediate",
    iconType: "focus"
  },
  {
    id: 4,
    name: "4-7-8 Breathing",
    duration: 120,
    description: "A breathing pattern developed to promote sleep and reduce anxiety",
    benefits: [
      "Helps fall asleep faster",
      "Reduces anxiety",
      "Lowers stress levels",
      "Can help manage cravings"
    ],
    steps: [
      "Sit with your back straight or lie down",
      "Place the tip of your tongue behind your upper front teeth",
      "Exhale completely through your mouth",
      "Close your mouth and inhale through your nose for 4 seconds",
      "Hold your breath for 7 seconds",
      "Exhale completely through your mouth for 8 seconds",
      "Repeat for 4 full cycles"
    ],
    category: "sleep",
    difficulty: "beginner",
    iconType: "sleep"
  },
  {
    id: 5,
    name: "Loving-Kindness Meditation",
    duration: 600,
    description: "A practice to develop feelings of goodwill, kindness and warmth towards others",
    benefits: [
      "Increases positive emotions",
      "Decreases negative emotions",
      "Reduces self-criticism",
      "Enhances empathy and compassion"
    ],
    steps: [
      "Sit comfortably and close your eyes",
      "Take a few deep breaths",
      "Imagine yourself feeling perfectly happy and at peace",
      "Repeat phrases like 'May I be happy, may I be healthy, may I be safe'",
      "Extend these wishes to loved ones, neutral people, difficult people, and all beings",
      "Practice for 10-15 minutes"
    ],
    category: "meditation",
    difficulty: "intermediate",
    iconType: "meditation"
  },
  {
    id: 6,
    name: "Progressive Muscle Relaxation",
    duration: 600,
    description: "A technique that involves tensing and then relaxing muscle groups",
    benefits: [
      "Reduces physical tension",
      "Helps with insomnia",
      "Decreases anxiety and stress",
      "Increases body awareness"
    ],
    steps: [
      "Lie down in a comfortable position",
      "Start with your feet, tense the muscles for 5 seconds",
      "Release and notice the feeling of relaxation",
      "Move progressively through each muscle group",
      "Work your way up to your head",
      "Take deep breaths between each muscle group"
    ],
    category: "sleep",
    difficulty: "beginner",
    iconType: "sleep"
  },
  {
    id: 7,
    name: "Mindful Walking",
    duration: 600,
    description: "A practice that involves bringing awareness to the experience of walking",
    benefits: [
      "Combines physical activity with mindfulness",
      "Reduces anxiety and stress",
      "Improves balance and coordination",
      "Can be practiced anywhere"
    ],
    steps: [
      "Find a quiet place to walk slowly",
      "Pay attention to the sensation of your feet touching the ground",
      "Notice the movement of your legs, arms, and body",
      "Observe your surroundings with curiosity",
      "When your mind wanders, gently bring it back to the walking",
      "Practice for 10-20 minutes"
    ],
    category: "meditation",
    difficulty: "beginner",
    iconType: "walking"
  },
  {
    id: 8,
    name: "Trataka (Steady Gazing)",
    duration: 300,
    description: "An ancient yoga practice of focusing on a single point or object",
    benefits: [
      "Improves concentration",
      "Enhances memory",
      "Develops willpower",
      "Calms the mind"
    ],
    steps: [
      "Choose an object to focus on (a dot on the wall, a crystal, etc.)",
      "Sit comfortably with a straight back",
      "Gaze at the object without blinking for as long as possible",
      "Close your eyes and visualize the object",
      "Alternate between gazing and visualizing",
      "Practice for 5-10 minutes"
    ],
    category: "focus",
    difficulty: "advanced",
    iconType: "focus"
  }
];

const getIconForExercise = (iconType: string) => {
  switch (iconType) {
    case 'breathing':
      return <CloudFog className="text-blue-500" />;
    case 'meditation':
      return <Lotus className="text-purple-500" />;
    case 'focus':
      return <Zap className="text-amber-500" />;
    case 'sleep':
      return <Moon className="text-indigo-500" />;
    case 'walking':
      return <Leaf className="text-green-500" />;
    default:
      return <Heart className="text-rose-500" />;
  }
};

const getColorForCategory = (category: 'breathing' | 'meditation' | 'focus' | 'sleep') => {
  switch (category) {
    case 'breathing':
      return 'bg-blue-100 text-blue-800';
    case 'meditation':
      return 'bg-purple-100 text-purple-800';
    case 'focus':
      return 'bg-amber-100 text-amber-800';
    case 'sleep':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const MindfulnessWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [streakDays, setStreakDays] = useState(3);
  const [totalSessions, setTotalSessions] = useState(12);
  const [totalMinutes, setTotalMinutes] = useState(120);
  const [mindfulnessLevel, setMindfulnessLevel] = useState('Beginner');
  const [customPrompt, setCustomPrompt] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    let interval: number | undefined;
    
    if (isPlaying && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsPlaying(false);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timeLeft]);
  
  const handleSessionComplete = () => {
    showActionToast("Session completed! Great job.");
    setTotalSessions(prev => prev + 1);
    setTotalMinutes(prev => prev + Math.floor(selectedExercise?.duration || 0 / 60));
  };
  
  const handleExerciseSelect = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setTimeLeft(exercise.duration);
    setIsPlaying(false);
    setIsOpen(true);
  };
  
  const togglePlay = () => {
    if (timeLeft === 0 && selectedExercise) {
      setTimeLeft(selectedExercise.duration);
    }
    setIsPlaying(!isPlaying);
  };
  
  const resetTimer = () => {
    if (selectedExercise) {
      setTimeLeft(selectedExercise.duration);
      setIsPlaying(false);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const filteredExercises = activeTab === 'all' 
    ? exercises 
    : exercises.filter(exercise => exercise.category === activeTab);
    
  const getAiSuggestion = async () => {
    if (!customPrompt.trim()) {
      showActionToast("Please enter a prompt");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await supabase.functions.invoke('gemini-ai', {
        body: { 
          prompt: customPrompt,
          type: 'mindfulness'
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      setAiSuggestion(response.data.recommendation);
    } catch (error) {
      console.error("Error getting mindfulness suggestion:", error);
      setAiSuggestion("I couldn't generate a suggestion at this time. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Mindfulness Practice</h2>
          <div className="text-sm font-medium text-fitness-primary flex items-center">
            <Clock size={14} className="mr-1" />
            {streakDays} day streak
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-blue-600">{totalSessions}</p>
            <p className="text-xs text-gray-500">Sessions</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-green-600">{totalMinutes}</p>
            <p className="text-xs text-gray-500">Minutes</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-purple-600">{mindfulnessLevel}</p>
            <p className="text-xs text-gray-500">Level</p>
          </div>
        </div>
        
        <div className="bg-amber-50 p-3 rounded-xl mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-amber-600" />
            <h3 className="font-medium">AI Mindfulness Prompt</h3>
          </div>
          
          <div className="space-y-2">
            <input
              type="text"
              placeholder="E.g., Help me sleep better, reduce stress..."
              className="w-full p-2 text-sm border border-gray-200 rounded-lg"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
            />
            
            <Button 
              onClick={getAiSuggestion} 
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Getting suggestion..." : "Get Suggestion"}
            </Button>
            
            {aiSuggestion && (
              <div className="mt-2 p-3 bg-white rounded-lg text-sm">
                {aiSuggestion}
              </div>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="breathing">Breath</TabsTrigger>
            <TabsTrigger value="meditation">Meditate</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="space-y-3">
          {filteredExercises.map((exercise) => (
            <div 
              key={exercise.id}
              className="bg-fitness-gray-light p-3 rounded-xl cursor-pointer hover:bg-fitness-gray-light/80 transition-colors"
              onClick={() => handleExerciseSelect(exercise)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  exercise.category === 'breathing' ? 'bg-blue-100' :
                  exercise.category === 'meditation' ? 'bg-purple-100' :
                  exercise.category === 'focus' ? 'bg-amber-100' :
                  'bg-indigo-100'
                }`}>
                  {getIconForExercise(exercise.iconType)}
                </div>
                <div>
                  <div className="flex items-center justify-between w-full">
                    <h3 className="font-medium">{exercise.name}</h3>
                    <span className="text-xs text-gray-500">{formatTime(exercise.duration)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{exercise.description}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getColorForCategory(exercise.category)}`}>
                      {exercise.category}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 ml-2">
                      {exercise.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      {selectedExercise && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedExercise.name}</DialogTitle>
              <DialogDescription>
                {selectedExercise.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="text-center">
                <div className="relative inline-block">
                  <svg className="w-32 h-32">
                    <circle
                      className="text-gray-200"
                      strokeWidth="6"
                      stroke="currentColor"
                      fill="transparent"
                      r="58"
                      cx="64"
                      cy="64"
                    />
                    <circle
                      className="text-fitness-primary"
                      strokeWidth="6"
                      strokeDasharray={2 * Math.PI * 58}
                      strokeDashoffset={2 * Math.PI * 58 * (1 - timeLeft / selectedExercise.duration)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="58"
                      cx="64"
                      cy="64"
                    />
                  </svg>
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetTimer}
                >
                  <Timer size={18} />
                </Button>
                
                <Button
                  className="w-12 h-12 rounded-full bg-fitness-primary hover:bg-fitness-primary/90"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Timer size={20} /> : <Play size={20} />}
                </Button>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Steps:</h4>
                <ol className="list-decimal pl-5 space-y-1">
                  {selectedExercise.steps.map((step, index) => (
                    <li key={index} className="text-sm">{step}</li>
                  ))}
                </ol>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Benefits:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedExercise.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm">{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default MindfulnessWidget;
