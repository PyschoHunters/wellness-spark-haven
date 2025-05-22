
import { Layout } from '@/components/Layout';
import Header from '@/components/Header';
import WorkoutCard from '@/components/WorkoutCard';
import ActivityChart from '@/components/ActivityChart';
import WorkoutStats from '@/components/WorkoutStats';
import DailyTips from '@/components/DailyTips';
import StatsCard from '@/components/StatsCard';
import AddWorkout from '@/components/AddWorkout';
import PersonalRecommendations from '@/components/PersonalRecommendations';
import HealthyRecipeGenerator from '@/components/HealthyRecipeGenerator';
import NutritionTracker from '@/components/NutritionTracker';
import WorkoutPlanGenerator from '@/components/WorkoutPlanGenerator';
import WellnessHub from '@/components/WellnessHub';
import BuddyFinderButton from '@/components/BuddyFinderButton';
import MindfulnessWidget from '@/components/MindfulnessWidget';

const Index = () => {
  return (
    <Layout>
      <Header
        title="Dashboard"
        subtitle="Track your fitness journey, analyze workouts, and get personalized recommendations"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <StatsCard title="Weekly Workouts" value="5" icon="activity" />
        <ActivityChart data={[]} />
        <WorkoutStats onClose={() => {}} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <PersonalRecommendations userData={{}} />
        <WorkoutCard 
          title="Morning HIIT"
          subtitle="High intensity interval training"
          image="/placeholder.svg"
          difficulty="Intermediate"
          duration={20}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <AddWorkout onClose={() => {}} onSave={() => {}} />
        <DailyTips />
        <BuddyFinderButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <HealthyRecipeGenerator />
        <NutritionTracker />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <WorkoutPlanGenerator />
        <MindfulnessWidget />
      </div>

      <div className="mt-6">
        <WellnessHub />
      </div>
    </Layout>
  );
};

export default Index;
