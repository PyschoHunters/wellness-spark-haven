
import React from 'react';
import { X, Clock, Flame, Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Exercise {
  name: string;
  duration: string;
  sets?: number;
  reps?: number;
}

interface WorkoutDetailProps {
  id: number;
  title: string;
  image: string;
  description: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  calories: number;
  exercises: Exercise[];
  onClose: () => void;
}

const WorkoutDetail: React.FC<WorkoutDetailProps> = ({
  title,
  image,
  description,
  duration,
  difficulty,
  calories,
  exercises,
  onClose
}) => {
  const difficultyColors = {
    easy: 'bg-green-500',
    medium: 'bg-amber-500',
    hard: 'bg-fitness-secondary'
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-up">
        <div className="relative h-[200px]">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <button 
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            onClick={onClose}
          >
            <X size={18} className="text-white" />
          </button>
          <div className="absolute bottom-4 left-4">
            <h2 className="text-white text-xl font-bold">{title}</h2>
          </div>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          <div className="flex gap-3 mb-4">
            <div className="flex items-center gap-1 bg-fitness-gray-light rounded-full px-3 py-1">
              <Clock size={14} className="text-fitness-gray" />
              <span className="text-xs font-medium">{duration}</span>
            </div>
            <div className={cn("flex items-center gap-1 rounded-full px-3 py-1", difficultyColors[difficulty])}>
              <Dumbbell size={14} className="text-white" />
              <span className="text-xs font-medium text-white capitalize">{difficulty}</span>
            </div>
            <div className="flex items-center gap-1 bg-fitness-secondary/10 rounded-full px-3 py-1">
              <Flame size={14} className="text-fitness-secondary" />
              <span className="text-xs font-medium">{calories} kcal</span>
            </div>
          </div>
          
          <div className="mb-5">
            <h3 className="text-sm font-medium text-fitness-gray mb-1">About This Workout</h3>
            <p className="text-sm">{description}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-fitness-gray mb-3">Exercises</h3>
            <div className="space-y-3">
              {exercises.map((exercise, index) => (
                <div key={index} className="flex items-center justify-between bg-fitness-gray-light p-3 rounded-xl">
                  <div>
                    <h4 className="font-medium">{exercise.name}</h4>
                    <p className="text-xs text-fitness-gray">{exercise.duration}</p>
                  </div>
                  {(exercise.sets && exercise.reps) && (
                    <span className="text-sm font-medium">{exercise.sets} sets × {exercise.reps} reps</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-100">
          <button 
            className="w-full bg-fitness-primary text-white py-3 rounded-xl font-medium"
            onClick={() => {
              // Send email reminder
              const email = "manumohan.ai21@gmail.com";
              const reminderTime = new Date();
              reminderTime.setHours(reminderTime.getHours() + 1);
              const formattedTime = `${reminderTime.getHours()}:${reminderTime.getMinutes().toString().padStart(2, '0')}`;
              
              import('@/utils/toast-utils').then(({ sendEmailReminder }) => {
                sendEmailReminder(email, title, formattedTime);
              });
              
              onClose();
            }}
          >
            Start Workout
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetail;
