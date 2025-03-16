
import React from 'react';
import { Activity, Flame, Heart } from 'lucide-react';
import Header from '@/components/Header';
import WorkoutCard from '@/components/WorkoutCard';
import StatsCard from '@/components/StatsCard';
import ActivityChart from '@/components/ActivityChart';
import Navigation from '@/components/Navigation';
import { useNavigate } from 'react-router-dom';
import { showActionToast } from '@/utils/toast-utils';

// Sample data
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
    difficulty: 'medium',
    duration: '30 min'
  },
  {
    id: 2,
    title: 'HIIT Training',
    subtitle: 'Burn calories efficiently',
    image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=2070&auto=format&fit=crop',
    difficulty: 'hard',
    duration: '25 min'
  },
  {
    id: 3,
    title: 'Yoga Basics',
    subtitle: 'Improve flexibility and mindfulness',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1920&auto=format&fit=crop',
    difficulty: 'easy',
    duration: '40 min'
  }
];

const Home = () => {
  const navigate = useNavigate();

  const handleSeeAllActivity = () => {
    navigate('/activity');
  };

  const handleSeeAllWorkouts = () => {
    showActionToast("Showing all available workouts");
  };

  const handleWorkoutClick = (workoutId: number) => {
    showActionToast(`Starting workout: ${workouts.find(w => w.id === workoutId)?.title}`);
  };

  const handleBellClick = () => {
    showActionToast("No new notifications");
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20">
      <Header 
        title="Hi, Alex" 
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Today Activity</h2>
          <button 
            className="text-sm font-medium text-fitness-primary"
            onClick={handleSeeAllActivity}
          >
            See All
          </button>
        </div>
        <ActivityChart data={weeklyActivity} />
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
              difficulty={workout.difficulty as 'easy' | 'medium' | 'hard'}
              duration={workout.duration}
              className="delay-100"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleWorkoutClick(workout.id)}
            />
          ))}
        </div>
      </section>
      
      <Navigation />
    </div>
  );
};

export default Home;
