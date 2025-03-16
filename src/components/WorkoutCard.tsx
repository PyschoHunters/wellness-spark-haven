
import React from 'react';
import { cn } from '@/lib/utils';

interface WorkoutCardProps {
  title: string;
  subtitle: string;
  image: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const difficultyColors = {
  easy: 'bg-green-500',
  medium: 'bg-amber-500',
  hard: 'bg-fitness-secondary'
};

const WorkoutCard: React.FC<WorkoutCardProps> = ({
  title,
  subtitle,
  image,
  difficulty,
  duration,
  className,
  style,
  onClick
}) => {
  return (
    <div 
      className={cn(
        "fitness-card flex flex-col h-[280px] animate-fade-up cursor-pointer hover:shadow-md transition-all", 
        className
      )}
      style={style}
      onClick={onClick}
    >
      <div className="relative h-[180px] overflow-hidden rounded-t-2xl">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-fitness-dark/60 to-transparent"></div>
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
          <span className="text-xs font-medium text-white bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
            {duration}
          </span>
          <span className={`text-xs font-medium text-white px-3 py-1 rounded-full ${difficultyColors[difficulty]}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-lg mb-1 text-fitness-dark">{title}</h3>
        <p className="text-sm text-fitness-gray">{subtitle}</p>
      </div>
    </div>
  );
};

export default WorkoutCard;
