import React, { useState } from 'react';
import { Activity, Flame, Heart } from 'lucide-react';
import Header from '@/components/Header';
import WorkoutCard from '@/components/WorkoutCard';
import WorkoutDetail from '@/components/WorkoutDetail';
import StatsCard from '@/components/StatsCard';
import ActivityChart from '@/components/ActivityChart';
import Navigation from '@/components/Navigation';
import DailyTips from '@/components/DailyTips';
import { useNavigate } from 'react-router-dom';
import { showActionToast } from '@/utils/toast-utils';
import ExerciseTimer from '@/components/ExerciseTimer';
import AvatarCreator from '@/components/AvatarCreator';
import WorkoutPlanGenerator from '@/components/WorkoutPlanGenerator';
import KidsFitness from '@/components/KidsFitness';
import FamilyFitness from '@/components/FamilyFitness';

const weeklyActivity = [
  { name: 'Mon', calories: 320 },
  { name: 'Tue', calories: 450 },
  { name: 'Wed', calories: 280 },
  { name: 'Thu', calories: 590 },
  { name: 'Fri', calories: 350 },
  { name: 'Sat', calories: 200 },
  { name: 'Sun', calories: 450 },
];

const workouts = [
  {
    id: 1,
    title: 'Full Body Workout',
    subtitle: 'Improve your strength and energy',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop',
    description: 'A comprehensive workout targeting all major muscle groups. This balanced routine helps improve overall strength, endurance, and flexibility while boosting your energy levels throughout the day.',
    difficulty: 'medium' as const,
    duration: '30 min',
    calories: 320,
    exercises: [
      { name: 'Jumping Jacks', duration: '60 sec', image: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
      { name: 'Push-ups', duration: '45 sec', sets: 3, reps: 12, image: 'https://images.unsplash.com/photo-1616803689943-5601631c7fec?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
      { name: 'Squats', duration: '45 sec', sets: 3, reps: 15 },
      { name: 'Plank', duration: '30 sec', sets: 3, image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
      { name: 'Mountain Climbers', duration: '45 sec' },
      { name: 'Lunges', duration: '45 sec', sets: 3, reps: 10 },
      { name: 'Burpees', duration: '30 sec' },
      { name: 'Cool Down Stretching', duration: '2 min' }
    ]
  },
  {
    id: 2,
    title: 'HIIT Training',
    subtitle: 'Burn calories efficiently',
    image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=2070&auto=format&fit=crop',
    description: 'High-Intensity Interval Training (HIIT) alternates between intense bursts of activity and fixed periods of less-intense activity or rest. This type of training keeps your heart rate up and burns more calories in less time.',
    difficulty: 'hard' as const,
    duration: '25 min',
    calories: 380,
    exercises: [
      { name: 'Warm Up', duration: '2 min' },
      { name: 'High Knees', duration: '40 sec', sets: 4 },
      { name: 'Rest', duration: '20 sec', sets: 4 },
      { name: 'Burpees', duration: '40 sec', sets: 4 },
      { name: 'Rest', duration: '20 sec', sets: 4 },
      { name: 'Jump Squats', duration: '40 sec', sets: 4 },
      { name: 'Rest', duration: '20 sec', sets: 4 },
      { name: 'Mountain Climbers', duration: '40 sec', sets: 4 },
      { name: 'Rest', duration: '20 sec', sets: 4 },
      { name: 'Cool Down', duration: '3 min' }
    ]
  },
  {
    id: 3,
    title: 'Yoga Basics',
    subtitle: 'Improve flexibility and mindfulness',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1920&auto=format&fit=crop',
    description: 'This beginner-friendly yoga session focuses on basic poses and breathing techniques to enhance flexibility, balance, and mental clarity. Perfect for stress reduction and improving overall body awareness.',
    difficulty: 'easy' as const,
    duration: '40 min',
    calories: 180,
    exercises: [
      { name: 'Deep Breathing', duration: '3 min' },
      { name: 'Child\'s Pose', duration: '2 min' },
      { name: 'Downward Dog', duration: '2 min' },
      { name: 'Warrior I', duration: '3 min' },
      { name: 'Warrior II', duration: '3 min' },
      { name: 'Triangle Pose', duration: '2 min' },
      { name: 'Tree Pose', duration: '2 min' },
      { name: 'Seated Forward Bend', duration: '2 min' },
      { name: 'Bridge Pose', duration: '2 min' },
      { name: 'Corpse Pose', duration: '5 min' }
    ]
  }
];

const getExerciseImage = (name: string): string => {
  const exerciseImages: Record<string, string> = {
    'Plank': 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    'Push-ups': 'https://images.unsplash.com/photo-1616803689943-5601631c7fec?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    'Jumping Jacks': 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  };
  
  return exerciseImages[name] || '';
};

const Home = () => {
  const navigate = useNavigate();
  const [selectedWorkout, setSelectedWorkout] = useState<number | null>(null);
  const [activeExercise, setActiveExercise] = useState<{
    name: string;
    duration: number;
    index: number;
    workoutId: number;
    image?: string;
  } | null>(null);

  const handleSeeAllActivity = () => {
    navigate('/activity');
  };

  const handleSeeAllWorkouts = () => {
    showActionToast("Showing all available workouts");
  };

  const handleWorkoutClick = (workoutId: number) => {
    setSelectedWorkout(workoutId);
  };

  const handleBellClick = () => {
    showActionToast("No new notifications");
  };

  const getWorkoutDetails = (id: number) => {
    return workouts.find(w => w.id === id);
  }

  const handleStartWorkout = (workoutId: number) => {
    const workout = getWorkoutDetails(workoutId);
    if (workout && workout.exercises.length > 0) {
      const firstExercise = workout.exercises[0];
      
      const exerciseImage = 'image' in firstExercise && firstExercise.image 
        ? firstExercise.image 
        : getExerciseImage(firstExercise.name);
      
      setActiveExercise({
        name: firstExercise.name,
        duration: parseInt(firstExercise.duration) || 60,
        index: 0,
        workoutId,
        image: exerciseImage || undefined
      });
      setSelectedWorkout(null);
    }
  };

  const handleExerciseComplete = () => {
    if (activeExercise) {
      const workout = getWorkoutDetails(activeExercise.workoutId);
      if (workout) {
        const nextIndex = activeExercise.index + 1;
        if (nextIndex < workout.exercises.length) {
          const nextExercise = workout.exercises[nextIndex];
          
          const exerciseImage = 'image' in nextExercise && nextExercise.image
            ? nextExercise.image
            : getExerciseImage(nextExercise.name);
          
          setActiveExercise({
            name: nextExercise.name,
            duration: parseInt(nextExercise.duration) || 60,
            index: nextIndex,
            workoutId: activeExercise.workoutId,
            image: exerciseImage || undefined
          });
        } else {
          setActiveExercise(null);
          showActionToast("Workout Complete! Great job!");
        }
      }
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20">
      <Header 
        title="Hi, Manumohan" 
        subtitle="Let's check your activity" 
        action={
          <button 
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm"
            onClick={handleBellClick}
          >
            <Flame size={20} className="text-fitness-dark" />
          </button>
        }
      />
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatsCard 
          title="Calories" 
          value="350 kcal" 
          icon={<Flame size={20} className="text-fitness-secondary" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard 
          title="Heart Rate" 
          value="86 bpm" 
          icon={<Heart size={20} className="text-fitness-secondary" />}
        />
        <StatsCard 
          title="Workouts" 
          value="12" 
          icon={<Activity size={20} className="text-fitness-primary" />}
          trend={{ value: 8, isPositive: true }}
          className="col-span-2"
        />
      </div>
      
      <section className="mb-6">
        <FamilyFitness />
      </section>
      
      <section className="mb-6">
        <KidsFitness />
      </section>
      
      <section className="mb-6">
        <DailyTips />
      </section>
      
      <section className="mb-6">
        <AvatarCreator />
      </section>
      
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recommended Workouts</h2>
          <button 
            className="text-sm font-medium text-fitness-primary"
            onClick={handleSeeAllWorkouts}
          >
            See All
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {workouts.map((workout, index) => (
            <WorkoutCard 
              key={workout.id}
              title={workout.title}
              subtitle={workout.subtitle}
              image={workout.image}
              difficulty={workout.difficulty}
              duration={workout.duration}
              className="delay-100"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleWorkoutClick(workout.id)}
            />
          ))}
        </div>
      </section>
      
      {selectedWorkout !== null && getWorkoutDetails(selectedWorkout) && (
        <WorkoutDetail
          {...getWorkoutDetails(selectedWorkout)!}
          onClose={() => setSelectedWorkout(null)}
        />
      )}
      
      {activeExercise && (
        <ExerciseTimer
          exercise={activeExercise.name}
          nextExercise={
            activeExercise.index < getWorkoutDetails(activeExercise.workoutId)!.exercises.length - 1
              ? getWorkoutDetails(activeExercise.workoutId)!.exercises[activeExercise.index + 1].name
              : undefined
          }
          duration={activeExercise.duration}
          onComplete={handleExerciseComplete}
          onClose={() => setActiveExercise(null)}
          image={activeExercise.image}
        />
      )}
      
      <Navigation />
    </div>
  );
};

export default Home;
