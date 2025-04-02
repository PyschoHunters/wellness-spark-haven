
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Check } from 'lucide-react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import EmailForm from '@/components/EmailForm';
import AddWorkout from '@/components/AddWorkout';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { showActionToast, sendEmailReminder } from '@/utils/toast-utils';

const initialWorkouts = [
  {
    id: 1,
    title: 'Morning Yoga',
    time: '07:30 AM',
    duration: '30 min',
    completed: true
  },
  {
    id: 2,
    title: 'HIIT Workout',
    time: '12:00 PM',
    duration: '25 min',
    completed: false
  },
  {
    id: 3,
    title: 'Evening Run',
    time: '06:30 PM',
    duration: '45 min',
    completed: false
  }
];

const SchedulePage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [scheduledWorkouts, setScheduledWorkouts] = useState(initialWorkouts);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<typeof initialWorkouts[0] | null>(null);
  const [showAddWorkout, setShowAddWorkout] = useState(false);

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      showActionToast(`Showing schedule for ${format(newDate, 'MMMM d, yyyy')}`);
    }
  };

  const handleWorkoutClick = (workoutId: number) => {
    setScheduledWorkouts(prev => 
      prev.map(workout => 
        workout.id === workoutId 
          ? { ...workout, completed: !workout.completed } 
          : workout
      )
    );
    
    const workout = scheduledWorkouts.find(w => w.id === workoutId);
    if (workout) {
      if (!workout.completed) {
        showActionToast(`Completed: ${workout.title}`);
      } else {
        showActionToast(`Marked as incomplete: ${workout.title}`);
      }
    }
  };

  const handleAddNewWorkout = () => {
    setShowAddWorkout(true);
  };

  const handleSaveWorkout = (workoutData: any) => {
    const newWorkout = {
      id: Date.now(),
      title: workoutData.title,
      time: new Date().getHours() < 12 ? '09:00 AM' : '06:00 PM',
      duration: workoutData.duration,
      completed: false
    };
    
    setScheduledWorkouts(prev => [...prev, newWorkout]);
    showActionToast(`New workout added: ${workoutData.title}`);
  };

  const handleBellClick = () => {
    showActionToast("No new notifications");
  };
  
  const handleScheduleReminder = (workout: typeof initialWorkouts[0]) => {
    setSelectedWorkout(workout);
    setShowEmailForm(true);
  };
  
  const handleSubmitEmailReminder = (email: string) => {
    if (selectedWorkout) {
      sendEmailReminder(email, selectedWorkout.title, selectedWorkout.time);
    }
    setShowEmailForm(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20">
      <Header 
        title="Schedule" 
        action={
          <button 
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm"
            onClick={handleBellClick}
          >
            <Clock size={20} className="text-fitness-dark" />
          </button>
        }
      />
      
      <div className="mb-6 bg-white rounded-2xl p-4 animate-fade-up">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between border-dashed border-gray-300 bg-transparent hover:bg-transparent"
            >
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4 text-fitness-primary" />
                <span>{format(date, 'MMMM d, yyyy')}</span>
              </div>
              <span className="text-xs text-fitness-gray">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Today's Plan</h2>
          <span className="text-sm text-fitness-gray">{format(date, 'EEE, MMM d')}</span>
        </div>
        
        <div className="space-y-4">
          {scheduledWorkouts.map((workout, index) => (
            <div 
              key={workout.id}
              className={cn(
                "bg-white rounded-2xl p-4 border-l-4 animate-fade-up relative",
                workout.completed ? "border-green-500" : "border-fitness-primary"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center mb-3">
                <div className="flex-1">
                  <h3 className="font-medium">{workout.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={14} className="text-fitness-gray" />
                    <span className="text-xs text-fitness-gray">{workout.time}</span>
                    <span className="text-xs text-fitness-gray">•</span>
                    <span className="text-xs text-fitness-gray">{workout.duration}</span>
                  </div>
                </div>
                
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center cursor-pointer",
                  workout.completed 
                    ? "bg-green-100 text-green-500" 
                    : "bg-fitness-gray-light text-fitness-primary"
                )}
                onClick={() => handleWorkoutClick(workout.id)}
                >
                  {workout.completed ? (
                    <Check size={16} />
                  ) : (
                    <Clock size={16} />
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  className="flex-1 bg-fitness-gray-light text-fitness-dark py-2 rounded-lg text-sm font-medium hover:bg-fitness-gray-light/80 transition-colors"
                  onClick={() => handleWorkoutClick(workout.id)}
                >
                  {workout.completed ? 'Mark as Undone' : 'Mark as Done'}
                </button>
                
                <button 
                  className="flex-1 bg-fitness-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-fitness-primary/90 transition-colors"
                  onClick={() => handleScheduleReminder(workout)}
                >
                  Get Reminder
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center animate-fade-up" style={{ animationDelay: '300ms' }}>
        <button 
          className="bg-fitness-primary text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]"
          onClick={handleAddNewWorkout}
        >
          + Add New Workout
        </button>
      </div>
      
      {showEmailForm && selectedWorkout && (
        <EmailForm 
          workoutTitle={selectedWorkout.title}
          workoutTime={selectedWorkout.time}
          onClose={() => setShowEmailForm(false)}
          onSubmit={handleSubmitEmailReminder}
        />
      )}
      
      {showAddWorkout && (
        <AddWorkout 
          onClose={() => setShowAddWorkout(false)}
          onSave={handleSaveWorkout}
        />
      )}
      
      <Navigation />
    </div>
  );
};

export default SchedulePage;
