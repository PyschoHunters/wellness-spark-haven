
import React, { useState } from 'react';
import { X, Clock, Flame, Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';
import ExerciseTimer from './ExerciseTimer';
import EmailForm from './EmailForm';

export interface Exercise {
  name: string;
  duration: string;
  sets?: number;
  reps?: number;
  image?: string;
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
  const [activeExercise, setActiveExercise] = useState<{
    name: string;
    duration: number;
    index: number;
    image?: string;
  } | null>(null);
  
  const [showEmailForm, setShowEmailForm] = useState(false);

  const difficultyColors = {
    easy: 'bg-green-500',
    medium: 'bg-amber-500',
    hard: 'bg-fitness-secondary'
  };

  const getExerciseImage = (name: string): string => {
    const exerciseImages: Record<string, string> = {
      'Plank': '/lovable-uploads/aef82357-db4d-4b21-a448-5255c62690db.png',
      'Push-ups': '/lovable-uploads/0993405e-8d31-415d-a879-e39436efe870.png',
      'Jumping Jacks': '/lovable-uploads/1a22edd2-d4e5-48dd-a654-165662bbc27a.png',
      'Squats': 'https://images.unsplash.com/photo-1584863231364-2edc166de576?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'Mountain Climbers': 'https://images.unsplash.com/photo-1597347316205-36f6c451902a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'Lunges': 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'Burpees': 'https://images.unsplash.com/photo-1593476087123-36d1de271f08?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'High Knees': 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'Jump Squats': 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'Warm Up': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'Cool Down': 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'Deep Breathing': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'Child\'s Pose': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'Downward Dog': 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'Warrior I': 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'Warrior II': 'https://images.unsplash.com/photo-1599447494230-61a253204a76?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'Triangle Pose': 'https://images.unsplash.com/photo-1617049885637-9e9343685150?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'Tree Pose': 'https://images.unsplash.com/photo-1562088287-bde35a1ea917?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'Seated Forward Bend': 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'Bridge Pose': 'https://images.unsplash.com/photo-1581122584612-713f89b6c4f8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'Corpse Pose': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'Rest': 'https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'Cool Down Stretching': 'https://images.unsplash.com/photo-1518609571773-39b7d303a87b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    };
    
    return exerciseImages[name] || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3';
  };

  const handleExerciseClick = (exercise: Exercise, index: number) => {
    const seconds = parseInt(exercise.duration) || 60;
    
    console.log('Starting exercise:', exercise.name);
    console.log('Exercise details:', exercise);
    
    const exerciseImage = exercise.image || getExerciseImage(exercise.name);
    console.log('Using image:', exerciseImage);
    
    setActiveExercise({
      name: exercise.name,
      duration: seconds,
      index,
      image: exerciseImage
    });
  };

  const handleExerciseComplete = () => {
    if (activeExercise) {
      const nextIndex = activeExercise.index + 1;
      if (nextIndex < exercises.length) {
        const nextExercise = exercises[nextIndex];
        const seconds = parseInt(nextExercise.duration) || 60;
        
        setActiveExercise({
          name: nextExercise.name,
          duration: seconds,
          index: nextIndex,
          image: nextExercise.image || getExerciseImage(nextExercise.name)
        });
      } else {
        setActiveExercise(null);
        import('@/utils/toast-utils').then(({ showActionToast }) => {
          showActionToast("Workout Complete! Great job!");
        });
      }
    }
  };

  const handleSetupEmailReminder = () => {
    setShowEmailForm(true);
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
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-fitness-gray-light p-3 rounded-xl cursor-pointer hover:bg-fitness-gray-light/80 transition-colors"
                  onClick={() => handleExerciseClick(exercise, index)}
                >
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
        
        <div className="p-4 border-t border-gray-100 flex gap-2">
          <button 
            className="flex-1 border border-fitness-primary text-fitness-primary py-3 rounded-xl font-medium"
            onClick={handleSetupEmailReminder}
          >
            Get Reminder
          </button>
          <button 
            className="flex-1 bg-fitness-primary text-white py-3 rounded-xl font-medium"
            onClick={() => {
              if (exercises.length > 0) {
                handleExerciseClick(exercises[0], 0);
              } 
            }}
          >
            Start Workout
          </button>
        </div>
      </div>

      {activeExercise && (
        <ExerciseTimer
          exercise={activeExercise.name}
          nextExercise={
            activeExercise.index < exercises.length - 1
              ? exercises[activeExercise.index + 1].name
              : undefined
          }
          duration={activeExercise.duration}
          onComplete={handleExerciseComplete}
          onClose={() => setActiveExercise(null)}
          image={activeExercise.image}
        />
      )}
      
      {showEmailForm && (
        <EmailForm
          workoutTitle={title}
          workoutTime={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          onClose={() => setShowEmailForm(false)}
          onSubmit={() => {}}
        />
      )}
    </div>
  );
};

export default WorkoutDetail;
