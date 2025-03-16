
import React from 'react';
import { X, Award, Flame, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: 'award' | 'flame' | 'calendar';
  color: string;
  completed: boolean;
  progress?: number;
}

interface AchievementsProps {
  onClose: () => void;
}

const Achievements: React.FC<AchievementsProps> = ({ onClose }) => {
  const achievements: Achievement[] = [
    {
      id: 1,
      title: 'First Workout',
      description: 'Complete your first workout',
      icon: 'award',
      color: 'bg-purple-500',
      completed: true,
    },
    {
      id: 2,
      title: 'Burn 1000 Calories',
      description: 'Burn a total of 1000 calories',
      icon: 'flame',
      color: 'bg-fitness-secondary',
      completed: true,
    },
    {
      id: 3,
      title: '7 Day Streak',
      description: 'Work out for 7 days in a row',
      icon: 'calendar',
      color: 'bg-blue-500',
      completed: false,
      progress: 60,
    },
    {
      id: 4,
      title: 'Burn 6000 Calories',
      description: 'Burn a total of 6000 calories',
      icon: 'flame',
      color: 'bg-fitness-secondary',
      completed: false,
      progress: 80,
    },
    {
      id: 5,
      title: '30 Day Streak',
      description: 'Work out for 30 days in a row',
      icon: 'calendar',
      color: 'bg-blue-500',
      completed: false,
      progress: 25,
    },
  ];

  const getIcon = (icon: string, className?: string) => {
    switch (icon) {
      case 'award':
        return <Award className={className} size={24} />;
      case 'flame':
        return <Flame className={className} size={24} />;
      case 'calendar':
        return <Calendar className={className} size={24} />;
      default:
        return <Award className={className} size={24} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-up">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold text-xl">Achievements</h2>
          <button 
            className="w-8 h-8 bg-fitness-gray-light rounded-full flex items-center justify-center"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={cn(
                  "border-l-4 p-4 rounded-r-xl bg-white shadow-sm",
                  achievement.completed ? achievement.color : "border-gray-300"
                )}
              >
                <div className="flex gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    achievement.completed ? `${achievement.color} text-white` : "bg-gray-100 text-gray-400"
                  )}>
                    {getIcon(achievement.icon)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{achievement.title}</h3>
                    <p className="text-xs text-fitness-gray">{achievement.description}</p>
                    
                    {!achievement.completed && achievement.progress !== undefined && (
                      <div className="mt-2">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full", achievement.color)}
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-right mt-1 text-fitness-gray">{achievement.progress}%</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-100">
          <button 
            className="w-full bg-fitness-primary text-white py-3 rounded-xl font-medium"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
