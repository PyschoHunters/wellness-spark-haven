
import React, { useState, useEffect } from 'react';
import { Flame, Clock, Heart, Activity, Camera, Medal, Award, Trophy, Plus, PlusCircle, RefreshCw, User, Users, Baby, UserRound } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import DietTracker from '@/components/DietTracker';
import BodyProgress from '@/components/BodyProgress';
import PersonalRecommendations from '@/components/PersonalRecommendations';
import WaterTracker from '@/components/WaterTracker';
import SleepTracker from '@/components/SleepTracker';
import { MindfulnessWidget } from '@/components/MindfulnessWidget';
import YogaCard from '@/components/YogaCard';
import MoodWorkout from '@/components/MoodWorkout';
import EcoFitRewards from '@/components/EcoFitRewards';
import { showActionToast } from '@/utils/toast-utils';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ElderFitness from '@/components/ElderFitness';
import KidsFitness from '@/components/KidsFitness';
import FamilyFitness from '@/components/FamilyFitness';
import NutritionTracker from '@/components/NutritionTracker';

const Profile = () => {
  const [showAchievements, setShowAchievements] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showAvatar, setShowAvatar] = useState(false);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);

  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      try {
        const avatarData = JSON.parse(savedAvatar);
        setAvatarImage(avatarData.style.image);
      } catch (error) {
        console.error("Error parsing avatar data:", error);
      }
    }
  }, []);

  const handleSeeAllAchievements = () => {
    setShowAchievements(true);
  };

  const handleBellClick = () => {
    showActionToast("No new notifications");
  };

  const toggleProfileImage = () => {
    if (avatarImage) {
      setShowAvatar(!showAvatar);
      showActionToast(showAvatar ? "Showing profile photo" : "Showing avatar");
    } else {
      showActionToast("No avatar saved yet. Create one in the Home screen!");
    }
  };

  const userData = {
    name: "Manumohan",
    level: "Intermediate",
    caloriesPerWeek: 1250,
    weight: 74.0,
    bodyFatPercentage: 20.8,
    recentWorkouts: ["Morning Workout", "Full Body", "HIIT Session"]
  };

  const achievements = [
    {
      title: "1st Workout",
      icon: <Medal className="text-white" size={24} />,
      color: "bg-purple-500",
      completed: true
    },
    {
      title: "1000 kcal",
      icon: <Flame className="text-white" size={24} />,
      color: "bg-blue-500",
      completed: true
    },
    {
      title: "6000 kcal",
      icon: <Flame className="text-white" size={24} />,
      color: "bg-blue-300",
      completed: false
    },
    {
      title: "7 Day Streak",
      icon: <Activity className="text-white" size={24} />,
      color: "bg-green-500",
      completed: false
    },
    {
      title: "30 Day Streak",
      icon: <Activity className="text-white" size={24} />,
      color: "bg-green-700",
      completed: false
    },
    {
      title: "First Goal",
      icon: <Trophy className="text-white" size={24} />,
      color: "bg-yellow-500",
      completed: true
    }
  ];

  const caloriesBurned = 480;
  const caloriesGoal = 6000;
  const caloriesProgress = (caloriesBurned / caloriesGoal) * 100;

  return (
    <div className="max-w-md mx-auto px-4 pb-20">
      <Header 
        title="Hi, Manumohan" 
        subtitle="Check your fitness profile" 
        action={
          <button 
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm"
            onClick={handleBellClick}
          >
            <Flame size={20} className="text-fitness-dark" />
          </button>
        }
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="wellness">Wellness</TabsTrigger>
          <TabsTrigger value="elders" className="text-xs">Elders</TabsTrigger>
          <TabsTrigger value="kids" className="text-xs">Kids</TabsTrigger>
          <TabsTrigger value="family" className="text-xs">Family</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center bg-white rounded-2xl p-4 shadow-sm">
              <div 
                className="relative cursor-pointer" 
                onClick={toggleProfileImage}
              >
                {avatarImage && showAvatar ? (
                  <img 
                    src={avatarImage} 
                    alt="Avatar" 
                    className="w-20 h-20 rounded-full object-cover transition-all"
                  />
                ) : (
                  <img 
                    src="/lovable-uploads/2624c7ec-0c72-4a77-87e4-99577bdf17e3.png" 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full object-cover transition-all"
                  />
                )}
                {avatarImage && (
                  <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center bg-fitness-primary text-white">
                    <RefreshCw size={12} />
                  </div>
                )}
              </div>
              <div className="ml-4 flex-1">
                <h2 className="font-bold text-xl">Manumohan</h2>
                <p className="text-fitness-gray text-sm">manumohan.ai21@gmail.com</p>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Activity size={14} className="text-fitness-primary" />
                    <span className="text-xs font-medium">Intermediate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame size={14} className="text-fitness-secondary" />
                    <span className="text-xs font-medium">1250 kcal/week</span>
                  </div>
                </div>
              </div>
            </div>
            
            <EcoFitRewards />
            
            <div className="bg-blue-50 rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Achievements</h2>
                <button 
                  className="text-sm font-medium text-fitness-primary"
                  onClick={handleSeeAllAchievements}
                >
                  See All
                </button>
              </div>
              
              <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                {achievements.slice(0, 3).map((achievement, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center mb-1",
                      achievement.color,
                      !achievement.completed && "opacity-40"
                    )}>
                      {achievement.icon}
                    </div>
                    <div className={cn(
                      "text-xs font-medium text-center",
                      !achievement.completed && "text-gray-400"
                    )}>
                      {achievement.title}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">You've burned</span>
                  <span className="font-medium">{caloriesBurned} kcal</span>
                </div>
                <Progress value={caloriesProgress} className="h-2 bg-blue-100" />
                <div className="flex justify-end">
                  <span className="text-sm text-gray-500">{caloriesGoal} kcal</span>
                </div>
              </div>
            </div>
            
            <PersonalRecommendations userData={userData} />
            
            <DietTracker />
            
            <BodyProgress />
            
            <button 
              className="flex items-center justify-center gap-2 w-full bg-fitness-primary text-white p-3 rounded-xl font-medium"
              onClick={() => showActionToast("Premium features coming soon!")}
            >
              <PlusCircle size={18} />
              Upgrade to Premium
            </button>
          </div>
        </TabsContent>
        
        <TabsContent value="wellness" className="mt-6">
          <div className="flex flex-col gap-6">
            <NutritionTracker />
            
            <WaterTracker />
            
            <SleepTracker />
            
            <MindfulnessWidget />
            
            <YogaCard className="shadow-sm" />
            
            <MoodWorkout className="shadow-sm" />
          </div>
        </TabsContent>
        
        <TabsContent value="elders" className="mt-6">
          <ElderFitness />
        </TabsContent>
        
        <TabsContent value="kids" className="mt-6">
          <KidsFitness />
        </TabsContent>
        
        <TabsContent value="family" className="mt-6">
          <FamilyFitness />
        </TabsContent>
      </Tabs>
      
      <Dialog open={showAchievements} onOpenChange={setShowAchievements}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Your Achievements</DialogTitle>
            <DialogDescription>
              Track your fitness progress through these milestones
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg flex flex-col items-center">
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mb-2",
                  achievement.color,
                  !achievement.completed && "opacity-40"
                )}>
                  {achievement.icon}
                </div>
                <div className={cn(
                  "text-sm font-medium text-center",
                  !achievement.completed && "text-gray-400"
                )}>
                  {achievement.title}
                </div>
                {!achievement.completed && (
                  <div className="text-xs text-gray-400 mt-1">Locked</div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">Calories Progress</h3>
            <Progress value={caloriesProgress} className="h-3 bg-blue-100" />
            <div className="flex justify-between mt-1 text-sm">
              <span>{caloriesBurned} kcal</span>
              <span className="text-gray-500">{caloriesGoal} kcal</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Navigation />
    </div>
  );
};

export default Profile;
