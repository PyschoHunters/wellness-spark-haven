
import React from 'react';
import { X, Clock, Flame, Calendar, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityDetailProps {
  id: number;
  title: string;
  type: string;
  date: string;
  duration: string;
  calories: number;
  stats?: {
    label: string;
    value: string;
  }[];
  onClose: () => void;
}

const ActivityDetail: React.FC<ActivityDetailProps> = ({
  title,
  type,
  date,
  duration,
  calories,
  stats = [],
  onClose
}) => {
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'workout':
        return 'text-fitness-primary';
      case 'running':
        return 'text-fitness-secondary';
      default:
        return 'text-fitness-gray';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'workout':
        return <BarChart2 className={getActivityColor(type)} size={20} />;
      case 'running':
        return <Calendar className={getActivityColor(type)} size={20} />;
      default:
        return <Clock className={getActivityColor(type)} size={20} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-up">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-fitness-gray-light flex items-center justify-center">
              {getActivityIcon(type)}
            </div>
            <div>
              <h2 className="font-bold text-lg">{title}</h2>
              <p className="text-xs text-fitness-gray">{date}</p>
            </div>
          </div>
          <button 
            className="w-8 h-8 bg-fitness-gray-light rounded-full flex items-center justify-center"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          <div className="bg-fitness-gray-light rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-fitness-gray" />
                <span className="text-sm font-medium">{duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-fitness-secondary" />
                <span className="text-sm font-medium">{calories} kcal</span>
              </div>
            </div>
            <div className="mt-3 h-2 bg-white rounded-full overflow-hidden">
              <div 
                className="h-full bg-fitness-primary rounded-full"
                style={{ width: `${Math.min(100, (calories / 600) * 100)}%` }}
              ></div>
            </div>
          </div>
          
          {stats.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-fitness-gray mb-3">Activity Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-fitness-gray-light p-3 rounded-xl">
                    <p className="text-xs text-fitness-gray">{stat.label}</p>
                    <p className="font-medium">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
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

export default ActivityDetail;
