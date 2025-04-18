import React, { useState, useMemo } from 'react';
import { CalendarDays, Clock, Dumbbell, TrendingUp, BarChart2, Flame, Heart, Award, Zap, ChefHat } from 'lucide-react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import ActivityDetail from '@/components/ActivityDetail';
import ActivityChart from '@/components/ActivityChart';
import StatsCard from '@/components/StatsCard';
import FitnessBadges from '@/components/FitnessBadges';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { showActionToast } from '@/utils/toast-utils';
import HealthyRecipeGenerator from '@/components/HealthyRecipeGenerator';

const activityTypes = [
  { name: 'All', icon: TrendingUp, active: true, count: 5 },
  { name: 'Workout', icon: Dumbbell, active: false, count: 3 },
  { name: 'Running', icon: CalendarDays, active: false, count: 2 },
  { name: 'Timer', icon: Clock, active: false, count: 0 },
];

const activityHistory = [
  { 
    id: 1, 
    title: 'Morning Workout', 
    type: 'workout',
    duration: '32 min',
    calories: 350,
    date: 'Today • 08:30 AM',
    stats: [
      { label: 'Average Heart Rate', value: '132 bpm' },
      { label: 'Max Heart Rate', value: '156 bpm' },
      { label: 'Steps', value: '4,567' },
      { label: 'Distance', value: '0 km' }
    ]
  },
  { 
    id: 2, 
    title: 'Evening Run', 
    type: 'running',
    duration: '45 min',
    calories: 480,
    date: 'Today • 06:15 PM',
    stats: [
      { label: 'Distance', value: '5.2 km' },
      { label: 'Pace', value: '8:39 min/km' },
      { label: 'Average Heart Rate', value: '145 bpm' },
      { label: 'Elevation Gain', value: '32 m' }
    ]
  },
  { 
    id: 3, 
    title: 'Full Body Workout', 
    type: 'workout',
    duration: '50 min',
    calories: 520,
    date: 'Yesterday • 07:45 AM',
    stats: [
      { label: 'Average Heart Rate', value: '128 bpm' },
      { label: 'Max Heart Rate', value: '152 bpm' },
      { label: 'Steps', value: '5,823' },
      { label: 'Distance', value: '0 km' }
    ]
  },
  { 
    id: 4, 
    title: 'HIIT Session', 
    type: 'workout',
    duration: '25 min',
    calories: 320,
    date: 'Yesterday • 05:30 PM',
    stats: [
      { label: 'Average Heart Rate', value: '148 bpm' },
      { label: 'Max Heart Rate', value: '172 bpm' },
      { label: 'Steps', value: '3,256' },
      { label: 'Distance', value: '0 km' }
    ]
  },
  { 
    id: 5, 
    title: 'Morning Run', 
    type: 'running',
    duration: '30 min',
    calories: 360,
    date: '2 days ago • 06:30 AM',
    stats: [
      { label: 'Distance', value: '3.8 km' },
      { label: 'Pace', value: '7:54 min/km' },
      { label: 'Average Heart Rate', value: '142 bpm' },
      { label: 'Elevation Gain', value: '18 m' }
    ]
  },
];

const weeklyActivityData = [
  { name: 'Mon', calories: 280 },
  { name: 'Tue', calories: 350 },
  { name: 'Wed', calories: 420 },
  { name: 'Thu', calories: 310 },
  { name: 'Fri', calories: 480 },
  { name: 'Sat', calories: 520 },
  { name: 'Sun', calories: 380 },
];

const activityStats = [
  {
    title: 'Total Calories',
    value: '2,030 kcal',
    icon: <Flame className="text-fitness-secondary" />,
    trend: { value: 12, isPositive: true }
  },
  {
    title: 'Active Minutes',
    value: '182 min',
    icon: <Clock className="text-fitness-primary" />,
    trend: { value: 8, isPositive: true }
  },
  {
    title: 'Avg Heart Rate',
    value: '138 bpm',
    icon: <Heart className="text-fitness-secondary" />,
    trend: { value: 2, isPositive: false }
  },
  {
    title: 'Workouts',
    value: '5',
    icon: <Dumbbell className="text-fitness-primary" />,
    trend: { value: 20, isPositive: true }
  }
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'workout':
      return <Dumbbell className="text-fitness-primary" size={20} />;
    case 'running':
      return <CalendarDays className="text-fitness-secondary" size={20} />;
    default:
      return <TrendingUp className="text-fitness-gray" size={20} />;
  }
};

const ActivityPage = () => {
  const [selectedType, setSelectedType] = useState('All');
  const [filteredActivities, setFilteredActivities] = useState(activityHistory);
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [showWeeklyChart, setShowWeeklyChart] = useState(true);
  const [showBadges, setShowBadges] = useState(false);
  const [showRecipeGenerator, setShowRecipeGenerator] = useState(false);

  const totalWeeklyCalories = useMemo(() => {
    return weeklyActivityData.reduce((sum, day) => sum + day.calories, 0);
  }, [weeklyActivityData]);

  const handleFilterChange = (type: string) => {
    setSelectedType(type);
    
    if (type === 'All') {
      setFilteredActivities(activityHistory);
    } else {
      const typeMap: Record<string, string> = {
        'Workout': 'workout',
        'Running': 'running',
        'Timer': 'timer'
      };
      
      const filtered = activityHistory.filter(activity => 
        activity.type === typeMap[type]
      );
      
      setFilteredActivities(filtered);
    }
    
    showActionToast(`Showing ${type} activities`);
  };

  const handleActivityClick = (activityId: number) => {
    setSelectedActivity(activityId);
  };
  
  const handleBellClick = () => {
    showActionToast("No new notifications");
  };

  const getActivityDetails = (id: number) => {
    return activityHistory.find(activity => activity.id === id);
  }

  const toggleSection = (section: 'chart' | 'badges') => {
    if (section === 'chart') {
      setShowWeeklyChart(!showWeeklyChart);
    } else {
      setShowBadges(!showBadges);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20 bg-[#F9FAFC]">
      <Header 
        title="Activity" 
        action={
          <button 
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm"
            onClick={handleBellClick}
          >
            <Clock size={20} className="text-fitness-dark" />
          </button>
        }
      />
      
      <section className="mb-6">
        <div className="grid grid-cols-2 gap-3">
          {activityStats.map((stat, index) => (
            <StatsCard 
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))}
        </div>
      </section>

      <section className="mb-6">
        <Button
          onClick={() => setShowRecipeGenerator(true)}
          className="w-full bg-gradient-to-r from-fitness-primary to-fitness-secondary text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <ChefHat className="mr-2 h-5 w-5" />
          Generate Healthy Recipe
        </Button>
      </section>

      <section className={cn("mb-6", showWeeklyChart ? "block" : "hidden")}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Weekly Activity</h2>
          <button 
            onClick={() => toggleSection('chart')}
            className="text-fitness-primary text-sm font-medium"
          >
            {showWeeklyChart ? "Hide" : "Show"}
          </button>
        </div>
        <ActivityChart 
          data={weeklyActivityData} 
          className="mb-3"
        />
        <div className="bg-white rounded-2xl p-4 text-center animate-fade-up shadow-sm">
          <p className="text-sm text-fitness-gray">Total Weekly Burn</p>
          <p className="text-2xl font-bold text-fitness-primary">{totalWeeklyCalories} calories</p>
          <div className="w-full bg-fitness-gray-light h-1.5 rounded-full mt-2">
            <div 
              className="bg-gradient-to-r from-fitness-primary to-fitness-secondary h-full rounded-full"
              style={{ width: `${Math.min(100, (totalWeeklyCalories / 3000) * 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-fitness-gray mt-1">
            {Math.round((totalWeeklyCalories / 3000) * 100)}% of weekly goal (3,000 cal)
          </p>
        </div>
      </section>
      
      <div className="flex gap-3 overflow-x-auto pb-2 mb-6 no-scrollbar">
        {activityTypes.map((type, index) => (
          <button
            key={index}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 animate-fade-up relative",
              selectedType === type.name
                ? "bg-gradient-to-r from-fitness-primary to-fitness-primary/80 text-white shadow-md"
                : "bg-white text-fitness-gray hover:bg-fitness-gray-light"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => handleFilterChange(type.name)}
          >
            <type.icon size={18} />
            <span className="font-medium">{type.name}</span>
            {type.count > 0 && (
              <Badge className={cn(
                "ml-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]",
                selectedType === type.name 
                  ? "bg-white text-fitness-primary" 
                  : "bg-fitness-gray-light text-fitness-gray"
              )}>
                {type.count}
              </Badge>
            )}
          </button>
        ))}
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">History</h2>
          <div className="flex items-center">
            <button 
              className={cn(
                "p-2 rounded-full mr-2 transition-all",
                "bg-fitness-gray-light text-fitness-gray"
              )}
            >
              <BarChart2 size={16} />
            </button>
            <button 
              className="p-2 rounded-full bg-white text-fitness-gray border border-fitness-gray-light"
            >
              <Award size={16} />
            </button>
          </div>
        </div>
        
        {filteredActivities.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center animate-fade-up">
            <div className="mb-4 flex justify-center">
              <Clock size={40} className="text-fitness-gray-light" />
            </div>
            <h3 className="font-medium text-fitness-dark mb-2">No Activities Found</h3>
            <p className="text-sm text-fitness-gray">
              There are no {selectedType !== 'All' ? selectedType.toLowerCase() : ''} activities recorded yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity, index) => (
              <div 
                key={activity.id}
                className="bg-white rounded-2xl p-4 animate-fade-up cursor-pointer hover:shadow-md transition-all relative overflow-hidden group"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleActivityClick(activity.id)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-fitness-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center justify-between mb-3 relative">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-fitness-gray-light flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <h3 className="font-medium">{activity.title}</h3>
                      <p className="text-xs text-fitness-gray">{activity.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <Flame size={14} className="text-fitness-secondary mr-1" />
                      <p className="font-medium">{activity.calories} kcal</p>
                    </div>
                    <p className="text-xs text-fitness-gray">{activity.duration}</p>
                  </div>
                </div>
                <div className="h-2 bg-fitness-gray-light rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-fitness-primary to-fitness-secondary rounded-full"
                    style={{ width: `${Math.min(100, (activity.calories / 600) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <section className={cn("mb-6", showBadges ? "block" : "hidden")}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Award className="mr-2 text-fitness-primary" size={20} />
            Achievements
          </h2>
          <button 
            onClick={() => toggleSection('badges')}
            className="text-fitness-primary text-sm font-medium"
          >
            {showBadges ? "Hide" : "Show"}
          </button>
        </div>
        <FitnessBadges />
      </section>
      
      {!showBadges && (
        <button 
          className="w-full bg-white rounded-2xl p-4 mb-6 flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all animate-fade-up"
          onClick={() => setShowBadges(true)}
        >
          <Award className="text-fitness-primary" size={20} />
          <span className="font-medium">View Fitness Badges</span>
        </button>
      )}
      
      {selectedActivity !== null && (
        <ActivityDetail 
          {...getActivityDetails(selectedActivity)!}
          onClose={() => setSelectedActivity(null)}
        />
      )}
      
      <Navigation />
      
      <HealthyRecipeGenerator 
        isOpen={showRecipeGenerator}
        onClose={() => setShowRecipeGenerator(false)}
      />
    </div>
  );
};

export default ActivityPage;
