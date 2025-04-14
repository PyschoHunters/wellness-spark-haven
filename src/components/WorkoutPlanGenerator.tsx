import React, { useState, useEffect } from 'react';
import { Dumbbell, Clock, Flame, ArrowRight, X, Search, Plus, Save, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { showActionToast } from '@/utils/toast-utils';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';

const exerciseDatabase = {
  cardio: {
    beginner: [
      { name: 'Walking', duration: '20 min', calories: 100, description: 'Brisk walking at moderate pace' },
      { name: 'Stationary Bike', duration: '15 min', calories: 120, description: 'Low resistance cycling' },
      { name: 'Slow Jogging', duration: '10 min', calories: 130, description: 'Light jogging with breaks if needed' },
    ],
    intermediate: [
      { name: 'Jogging', duration: '20 min', calories: 200, description: 'Steady pace jogging' },
      { name: 'Jump Rope', duration: '10 min', calories: 150, description: 'Basic jump rope techniques' },
      { name: 'Swimming', duration: '20 min', calories: 250, description: 'Freestyle swimming at moderate pace' },
    ],
    advanced: [
      { name: 'HIIT Running', duration: '20 min', calories: 300, description: '30s sprint, 30s rest intervals' },
      { name: 'Stair Running', duration: '15 min', calories: 280, description: 'Running up stairs at fast pace' },
      { name: 'Cycling Intervals', duration: '25 min', calories: 320, description: '1 min sprint, 1 min recovery' },
    ]
  },
  strength: {
    beginner: [
      { name: 'Bodyweight Squats', duration: '3x10', calories: 80, description: 'Basic squats with proper form' },
      { name: 'Wall Push-ups', duration: '3x8', calories: 60, description: 'Push-ups against wall for beginners' },
      { name: 'Chair Dips', duration: '3x8', calories: 70, description: 'Tricep dips using a stable chair' },
    ],
    intermediate: [
      { name: 'Lunges', duration: '3x12', calories: 120, description: 'Forward and reverse lunges' },
      { name: 'Push-ups', duration: '3x10', calories: 100, description: 'Standard push-ups with good form' },
      { name: 'Dumbbell Rows', duration: '3x12', calories: 130, description: 'Single arm rows with light dumbbells' },
    ],
    advanced: [
      { name: 'Pistol Squats', duration: '3x8', calories: 150, description: 'Single leg squats with full range of motion' },
      { name: 'Plyometric Push-ups', duration: '3x12', calories: 180, description: 'Explosive push-ups with hand clap' },
      { name: 'Pull-ups', duration: '3x8', calories: 160, description: 'Full pull-ups with controlled movement' },
    ]
  },
  flexibility: {
    beginner: [
      { name: 'Standing Hamstring Stretch', duration: '30 sec x3', calories: 20, description: 'Basic hamstring stretch' },
      { name: 'Shoulder Stretch', duration: '30 sec x3', calories: 15, description: 'Gentle shoulder mobility stretch' },
      { name: 'Seated Forward Bend', duration: '30 sec x3', calories: 25, description: 'Seated hamstring and back stretch' },
    ],
    intermediate: [
      { name: 'Pigeon Pose', duration: '45 sec x3', calories: 30, description: 'Hip opener yoga pose' },
      { name: 'Cobra Stretch', duration: '45 sec x3', calories: 35, description: 'Back extension to improve posture' },
      { name: 'Butterfly Stretch', duration: '45 sec x3', calories: 25, description: 'Inner thigh and hip stretch' },
    ],
    advanced: [
      { name: 'Full Split', duration: '60 sec x3', calories: 40, description: 'Front split stretch' },
      { name: 'Deep Squat Hold', duration: '60 sec x3', calories: 50, description: 'Asian squat for ankle mobility' },
      { name: 'Bridge Pose', duration: '60 sec x3', calories: 45, description: 'Advanced back bend for spine flexibility' },
    ]
  }
};

interface WorkoutPlanGeneratorProps {
  className?: string;
}

const WorkoutPlanGenerator: React.FC<WorkoutPlanGeneratorProps> = ({ className }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [fitnessLevel, setFitnessLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [workoutDuration, setWorkoutDuration] = useState<'short' | 'medium' | 'long'>('medium');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [generatedPlan, setGeneratedPlan] = useState<any[] | null>(null);
  const [savedPlans, setSavedPlans] = useState<{name: string, exercises: any[]}[]>([]);
  const [planName, setPlanName] = useState('');
  const [showSaved, setShowSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const goals = ['Weight Loss', 'Muscle Gain', 'Improve Endurance', 'Increase Flexibility', 'General Fitness'];
  const areas = ['Full Body', 'Upper Body', 'Lower Body', 'Core', 'Back'];

  useEffect(() => {
    loadSavedPlans();
  }, [user?.id]);

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const toggleArea = (area: string) => {
    if (focusAreas.includes(area)) {
      setFocusAreas(focusAreas.filter(a => a !== area));
    } else {
      setFocusAreas([...focusAreas, area]);
    }
  };

  const generateWorkoutPlan = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const workoutPlan: any[] = [];
      
      const exerciseCount = workoutDuration === 'short' ? 4 : workoutDuration === 'medium' ? 6 : 8;
      
      let cardioPercentage = 0.33;
      let strengthPercentage = 0.33;
      let flexibilityPercentage = 0.33;
      
      if (selectedGoals.includes('Weight Loss')) {
        cardioPercentage += 0.1;
        strengthPercentage -= 0.05;
        flexibilityPercentage -= 0.05;
      }
      
      if (selectedGoals.includes('Muscle Gain')) {
        strengthPercentage += 0.15;
        cardioPercentage -= 0.1;
        flexibilityPercentage -= 0.05;
      }
      
      if (selectedGoals.includes('Improve Endurance')) {
        cardioPercentage += 0.15;
        strengthPercentage -= 0.1;
        flexibilityPercentage -= 0.05;
      }
      
      if (selectedGoals.includes('Increase Flexibility')) {
        flexibilityPercentage += 0.15;
        strengthPercentage -= 0.05;
        cardioPercentage -= 0.1;
      }
      
      const cardioCount = Math.round(exerciseCount * cardioPercentage);
      const strengthCount = Math.round(exerciseCount * strengthPercentage);
      const flexibilityCount = exerciseCount - cardioCount - strengthCount;
      
      for (let i = 0; i < cardioCount; i++) {
        const exercises = exerciseDatabase.cardio[fitnessLevel];
        const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
        if (!workoutPlan.some(ex => ex.name === randomExercise.name)) {
          workoutPlan.push({...randomExercise, type: 'Cardio'});
        } else {
          i--;
        }
      }
      
      for (let i = 0; i < strengthCount; i++) {
        const exercises = exerciseDatabase.strength[fitnessLevel];
        const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
        if (!workoutPlan.some(ex => ex.name === randomExercise.name)) {
          workoutPlan.push({...randomExercise, type: 'Strength'});
        } else {
          i--;
        }
      }
      
      for (let i = 0; i < flexibilityCount; i++) {
        const exercises = exerciseDatabase.flexibility[fitnessLevel];
        const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
        if (!workoutPlan.some(ex => ex.name === randomExercise.name)) {
          workoutPlan.push({...randomExercise, type: 'Flexibility'});
        } else {
          i--;
        }
      }
      
      const reorderedPlan = [];
      reorderedPlan.push(...workoutPlan.filter(ex => ex.type === 'Cardio'));
      reorderedPlan.push(...workoutPlan.filter(ex => ex.type === 'Strength'));
      reorderedPlan.push(...workoutPlan.filter(ex => ex.type === 'Flexibility'));
      
      setGeneratedPlan(reorderedPlan);
      setIsLoading(false);
    }, 800);
  };

  const savePlan = () => {
    if (!planName.trim()) {
      showActionToast("Please enter a name for your workout plan");
      return;
    }
    
    if (generatedPlan) {
      const newPlan = {
        name: planName,
        exercises: generatedPlan
      };
      
      const updatedPlans = [...savedPlans, newPlan];
      setSavedPlans(updatedPlans);
      
      try {
        const existingPlans = JSON.parse(localStorage.getItem(`workoutPlans_${user?.id}`) || '[]');
        localStorage.setItem(`workoutPlans_${user?.id}`, JSON.stringify([...existingPlans, newPlan]));
      } catch (error) {
        console.error("Error saving workout plan:", error);
      }
      
      setPlanName('');
      showActionToast("Workout plan saved successfully!");
    }
  };

  const loadSavedPlans = () => {
    try {
      const plans = JSON.parse(localStorage.getItem(`workoutPlans_${user?.id}`) || '[]');
      setSavedPlans(plans);
    } catch (error) {
      console.error("Error loading saved plans:", error);
    }
  };

  const loadPlan = (plan: {name: string, exercises: any[]}) => {
    setGeneratedPlan(plan.exercises);
    setShowSaved(false);
  };

  const resetForm = () => {
    setFitnessLevel('intermediate');
    setSelectedGoals([]);
    setWorkoutDuration('medium');
    setFocusAreas([]);
    setGeneratedPlan(null);
  };

  const getExerciseTypeColor = (type: string) => {
    switch(type) {
      case 'Cardio': return 'bg-red-100 text-red-600';
      case 'Strength': return 'bg-blue-100 text-blue-600';
      case 'Flexibility': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Card className={`overflow-hidden shadow-md border-0 ${className}`}>
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Dumbbell size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold">Workout Planner</h3>
          </div>
          <p className="text-white/80 mb-4 max-w-[80%]">
            Create personalized workout plans based on your goals and fitness level
          </p>
          <Button 
            onClick={() => {
              setShowDialog(true);
              loadSavedPlans();
            }}
            className="bg-white text-indigo-600 hover:bg-gray-100 font-medium mt-2"
          >
            Create Plan <ArrowRight size={16} className="ml-2" />
          </Button>
          
          {savedPlans.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white/80">Your Saved Plans</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{savedPlans.length}</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 max-w-full scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {savedPlans.slice(0, 3).map((plan, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg whitespace-nowrap text-sm">
                    {plan.name}
                  </div>
                ))}
                {savedPlans.length > 3 && (
                  <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg whitespace-nowrap text-sm">
                    +{savedPlans.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-500" />
              Create Your Custom Workout Plan
            </DialogTitle>
            <DialogDescription>
              Answer a few questions to generate a personalized workout plan.
            </DialogDescription>
          </DialogHeader>
          
          {!generatedPlan ? (
            <div className="space-y-6 py-4">
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-xs">1</span>
                  Your Fitness Level
                </h3>
                <div className="flex gap-2">
                  {['beginner', 'intermediate', 'advanced'].map((level) => (
                    <button
                      key={level}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        fitnessLevel === level 
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setFitnessLevel(level as any)}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-xs">2</span>
                  Your Fitness Goals
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {goals.map(goal => (
                    <button
                      key={goal}
                      className={`py-2 px-3 rounded-lg text-sm font-medium text-left transition-all flex items-center ${
                        selectedGoals.includes(goal)
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                      }`}
                      onClick={() => toggleGoal(goal)}
                    >
                      {selectedGoals.includes(goal) && <Plus size={14} className="mr-1 rotate-45" />}
                      {goal}
                    </button>
                  ))}
                </div>
                {selectedGoals.length === 0 && (
                  <p className="text-xs text-amber-600 mt-2">Please select at least one goal</p>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-xs">3</span>
                  Workout Duration
                </h3>
                <div className="flex gap-2">
                  {[
                    {value: 'short', label: 'Short (15-20 min)'},
                    {value: 'medium', label: 'Medium (30-40 min)'},
                    {value: 'long', label: 'Long (45-60 min)'}
                  ].map((option) => (
                    <button
                      key={option.value}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        workoutDuration === option.value 
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setWorkoutDuration(option.value as any)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-xs">4</span>
                  Focus Areas (Optional)
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {areas.map(area => (
                    <button
                      key={area}
                      className={`py-2 px-3 rounded-lg text-sm font-medium text-center transition-all ${
                        focusAreas.includes(area)
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                      }`}
                      onClick={() => toggleArea(area)}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-300"
                  onClick={resetForm}
                >
                  Reset
                </Button>
                <Button 
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  onClick={generateWorkoutPlan}
                  disabled={selectedGoals.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <><span className="animate-pulse">Generating</span><span className="animate-bounce ml-1">...</span></>
                  ) : (
                    <>Generate Plan</>
                  )}
                </Button>
              </div>
              
              {savedPlans.length > 0 && (
                <Button
                  variant="outline"
                  className="w-full mt-4 text-indigo-600 border-indigo-200"
                  onClick={() => setShowSaved(true)}
                >
                  View Saved Plans ({savedPlans.length})
                </Button>
              )}
            </div>
          ) : showSaved ? (
            <div className="py-4">
              <div className="flex justify-between mb-4">
                <h3 className="font-medium text-indigo-800">Your Saved Plans</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowSaved(false)} className="text-gray-500">
                  <X size={16} />
                </Button>
              </div>
              
              {savedPlans.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {savedPlans.map((plan, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-50 hover:bg-gray-100 p-3 rounded-lg cursor-pointer border border-gray-100 transition-all hover:border-indigo-200"
                      onClick={() => loadPlan(plan)}
                    >
                      <h4 className="font-medium text-indigo-900">{plan.name}</h4>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <span className="flex items-center">
                          <Dumbbell size={12} className="mr-1" />
                          {plan.exercises.length} exercises
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Flame size={12} className="mr-1" /> 
                          {plan.exercises.reduce((total, ex) => {
                            const calories = typeof ex.calories === 'number' ? ex.calories : 0;
                            return total + calories;
                          }, 0)} est. calories
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Search size={48} className="mx-auto mb-3 opacity-20" />
                  <p>No saved plans yet</p>
                </div>
              )}
              
              <Button
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setShowSaved(false)}
              >
                Back to Current Plan
              </Button>
            </div>
          ) : (
            <div className="py-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-indigo-800">Your Personalized Plan</h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setGeneratedPlan(null)} className="text-gray-500">
                    <X size={16} className="mr-1" /> Back
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {generatedPlan.map((exercise, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getExerciseTypeColor(exercise.type)}`}>
                        {exercise.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                      <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                        <Clock size={12} className="mr-1" />
                        {exercise.duration}
                      </div>
                      <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                        <Flame size={12} className="mr-1" />
                        {exercise.calories} cal
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-3 mt-6">
                <input
                  type="text"
                  placeholder="Name this workout plan"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <Button 
                  onClick={savePlan}
                  className="whitespace-nowrap bg-indigo-600 hover:bg-indigo-700"
                  disabled={!planName.trim()}
                >
                  <Save size={16} className="mr-2" /> Save Plan
                </Button>
              </div>
              
              <div className="mt-4 text-sm bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <div className="flex justify-between font-medium text-indigo-900">
                  <span>Workout Summary</span>
                  <span>{generatedPlan.length} Exercises</span>
                </div>
                <div className="flex justify-between text-indigo-700 mt-1">
                  <span>Estimated Calories:</span>
                  <span>{generatedPlan.reduce((total, ex) => total + ex.calories, 0)} cal</span>
                </div>
                <div className="flex justify-between text-indigo-700">
                  <span>Difficulty Level:</span>
                  <span className="capitalize">{fitnessLevel}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default WorkoutPlanGenerator;
