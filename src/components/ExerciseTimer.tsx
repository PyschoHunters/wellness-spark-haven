
import React, { useState, useEffect } from 'react';
import { X, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExerciseTimerProps {
  exercise: string;
  nextExercise?: string;
  duration: number; // in seconds
  onComplete: () => void;
  onClose: () => void;
  image?: string;
}

const ExerciseTimer: React.FC<ExerciseTimerProps> = ({ 
  exercise, 
  nextExercise, 
  duration, 
  onComplete, 
  onClose,
  image
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(true);
  const progress = (timeLeft / duration) * 100;
  
  // Debug the image prop when component mounts
  useEffect(() => {
    console.log('ExerciseTimer mounted with exercise:', exercise);
    console.log('Image path:', image);
  }, [exercise, image]);
  
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
  
  // Format time display (MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Show image layout if there's an image
  const showImageLayout = !!image;
  
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {showImageLayout ? (
        // Image layout
        <>
          <div className="absolute top-4 right-4 z-10">
            <button 
              className="w-10 h-10 bg-black/70 rounded-full flex items-center justify-center"
              onClick={onClose}
            >
              <X size={20} className="text-white" />
            </button>
          </div>
          
          <div className="flex flex-col h-full">
            <div className="p-4 pt-8">
              <h2 className="text-4xl font-bold text-gray-700">{exercise}</h2>
              {nextExercise && (
                <p className="text-xl text-gray-500">Next: {nextExercise}</p>
              )}
            </div>
            
            <div className="flex-1 relative overflow-hidden">
              {image ? (
                <div className="w-full h-3/4 max-h-[400px] overflow-hidden flex items-center justify-center">
                  <img 
                    src={image} 
                    alt={exercise} 
                    className="object-contain max-w-full max-h-full" 
                    onError={(e) => {
                      console.error('Image failed to load:', image);
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Exercise+Image+Not+Found';
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">No image available</p>
                </div>
              )}
              
              <div className="absolute bottom-24 left-0 right-0 flex justify-center">
                <div className="bg-gray-800 text-white text-5xl font-bold py-4 px-8 rounded-xl">
                  {formatTime(timeLeft)}
                </div>
              </div>
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <button
                  className="w-16 h-16 bg-white shadow-lg rounded-full flex items-center justify-center"
                  onClick={toggleTimer}
                >
                  {isRunning ? (
                    <Pause size={28} className="text-gray-800" />
                  ) : (
                    <Play size={28} className="text-gray-800 ml-1" />
                  )}
                </button>
                
                <button
                  className="bg-white px-6 py-3 rounded-full shadow-lg font-semibold"
                  onClick={onComplete}
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Original centered layout with circle
        <>
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
                <span className="text-5xl font-bold">{formatTime(timeLeft)}</span>
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
        </>
      )}
    </div>
  );
};

export default ExerciseTimer;
