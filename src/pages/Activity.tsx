
import React, { useState } from 'react';
import { CalendarDays, Clock, Dumbbell, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import ActivityDetail from '@/components/ActivityDetail';
import { cn } from '@/lib/utils';
import { showActionToast } from '@/utils/toast-utils';

const activityTypes = [
  { name: 'All', icon: TrendingUp, active: true },
  { name: 'Workout', icon: Dumbbell, active: false },
  { name: 'Running', icon: CalendarDays, active: false },
  { name: 'Timer', icon: Clock, active: false },
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

  return (
    <div className="max-w-md mx-auto px-4 pb-20">
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
      
      <div className="flex gap-3 overflow-x-auto pb-2 mb-6 no-scrollbar">
        {activityTypes.map((type, index) => (
          <button
            key={index}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 animate-fade-up",
              selectedType === type.name
                ? "bg-fitness-primary text-white"
                : "bg-white text-fitness-gray hover:bg-fitness-gray-light"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => handleFilterChange(type.name)}
          >
            <type.icon size={18} />
            <span className="font-medium">{type.name}</span>
          </button>
        ))}
      </div>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-4">History</h2>
        
        <div className="space-y-4">
          {filteredActivities.map((activity, index) => (
            <div 
              key={activity.id}
              className="bg-white rounded-2xl p-4 animate-fade-up cursor-pointer hover:shadow-md transition-all"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleActivityClick(activity.id)}
            >
              <div className="flex items-center justify-between mb-3">
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
                  <p className="font-medium">{activity.calories} kcal</p>
                  <p className="text-xs text-fitness-gray">{activity.duration}</p>
                </div>
              </div>
              <div className="h-2 bg-fitness-gray-light rounded-full overflow-hidden">
                <div 
                  className="h-full bg-fitness-primary rounded-full"
                  style={{ width: `${Math.min(100, (activity.calories / 600) * 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedActivity !== null && (
        <ActivityDetail 
          {...getActivityDetails(selectedActivity)!}
          onClose={() => setSelectedActivity(null)}
        />
      )}
      
      <Navigation />
    </div>
  );
};

export default ActivityPage;
