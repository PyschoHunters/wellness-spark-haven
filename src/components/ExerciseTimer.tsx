
import React, { useState, useEffect } from 'react';
import { X, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExerciseTimerProps {
  exercise: string;
  nextExercise?: string;
  duration: number; // in seconds
  onComplete: () => void;
  onClose: () => void;
}

const ExerciseTimer: React.FC<ExerciseTimerProps> = ({ 
  exercise, 
  nextExercise, 
  duration, 
  onComplete, 
  onClose 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(true);
  const progress = (timeLeft / duration) * 100;
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      onComplete();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isRunning, timeLeft, onComplete]);
  
  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };
  
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="flex justify-end p-4">
        <button 
          className="w-10 h-10 bg-fitness-gray-light rounded-full flex items-center justify-center"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-center mb-3">{exercise}</h1>
        {nextExercise && (
          <p className="text-fitness-gray mb-6">Next: {nextExercise}</p>
        )}
        
        <div className="relative w-64 h-64 mb-8">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={Math.PI * 90}
              strokeDashoffset={Math.PI * 90 * (1 - progress / 100)}
              transform="rotate(-90 50 50)"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-bold">{timeLeft}</span>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            className="w-full bg-fitness-primary text-white py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2"
            onClick={toggleTimer}
          >
            {isRunning ? (
              <>
                <Pause size={20} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={20} />
                <span>Resume</span>
              </>
            )}
          </button>
          <button 
            className="bg-fitness-gray-light py-3 px-6 rounded-xl font-medium"
            onClick={() => onComplete()}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseTimer;
