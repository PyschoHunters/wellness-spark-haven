
import React from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import StatsCard from '@/components/StatsCard';
import DailyTips from '@/components/DailyTips';
import PersonalRecommendations from '@/components/PersonalRecommendations';
import WorkoutBuddyFinder from '@/components/WorkoutBuddyFinder';
import MindfulnessWidget from '@/components/MindfulnessWidget';
import AIFitnessCoach from '@/components/AIFitnessCoach';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-12">
      <Header />
      <div className="max-w-md mx-auto px-4 space-y-6">
        <StatsCard />
        <PersonalRecommendations />
        <DailyTips />
        <MindfulnessWidget />
        <AIFitnessCoach />
      </div>
      <Navigation />
      <WorkoutBuddyFinder />
    </div>
  );
};

export default Index;
