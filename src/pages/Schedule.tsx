
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Check } from 'lucide-react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const scheduledWorkouts = [
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

  return (
    <div className="max-w-md mx-auto px-4 pb-20">
      <Header title="Schedule" />
      
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
              onSelect={(date) => date && setDate(date)}
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
                "bg-white rounded-2xl p-4 border-l-4 animate-fade-up flex items-center",
                workout.completed ? "border-green-500" : "border-fitness-primary"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
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
                "w-8 h-8 rounded-full flex items-center justify-center",
                workout.completed 
                  ? "bg-green-100 text-green-500" 
                  : "bg-fitness-gray-light text-fitness-primary"
              )}>
                {workout.completed ? (
                  <Check size={16} />
                ) : (
                  <Clock size={16} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center animate-fade-up" style={{ animationDelay: '300ms' }}>
        <button className="bg-fitness-primary text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]">
          + Add New Workout
        </button>
      </div>
      
      <Navigation />
    </div>
  );
};

export default SchedulePage;
