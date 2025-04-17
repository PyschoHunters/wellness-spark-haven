
import React from 'react';
import { X, Clock, Flame, Calendar, BarChart2, Heart, Activity, CheckCircle, ArrowUpRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-up shadow-xl">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-fitness-primary/10 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-fitness-gray-light flex items-center justify-center shadow-sm">
              {getActivityIcon(type)}
            </div>
            <div>
              <h2 className="font-bold text-lg">{title}</h2>
              <p className="text-xs text-fitness-gray">{date}</p>
            </div>
          </div>
          <button 
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-fitness-gray-light transition-colors"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          <div className="bg-gradient-to-r from-fitness-gray-light to-fitness-gray-light/40 rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-fitness-primary" />
                <span className="text-sm font-medium">{duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-fitness-secondary" />
                <span className="text-sm font-medium">{calories} kcal</span>
              </div>
            </div>
            <div className="mt-3 h-2 bg-white rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-fitness-primary to-fitness-secondary rounded-full"
                style={{ width: `${Math.min(100, (calories / 600) * 100)}%` }}
              ></div>
            </div>
            
            <div className="flex justify-end mt-2">
              <span className="text-xs text-fitness-gray">
                {Math.min(100, Math.round((calories / 600) * 100))}% of daily goal
              </span>
            </div>
          </div>
          
          {stats.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-fitness-gray mb-3 flex items-center">
                <Activity size={16} className="mr-2 text-fitness-primary" />
                Activity Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-fitness-gray-light/50 p-3 rounded-xl hover:shadow-sm transition-all border border-gray-100">
                    <p className="text-xs text-fitness-gray">{stat.label}</p>
                    <p className="font-medium">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-6">
            <h3 className="text-sm font-medium text-fitness-gray mb-3 flex items-center">
              <CheckCircle size={16} className="mr-2 text-fitness-primary" />
              Achievements
            </h3>
            <div className="bg-white border border-fitness-gray-light/50 rounded-xl p-3 flex items-center justify-between mb-3 hover:border-fitness-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-fitness-primary/10 flex items-center justify-center">
                  <Flame size={18} className="text-fitness-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Calorie Burner</p>
                  <p className="text-xs text-fitness-gray">300+ calories burned</p>
                </div>
              </div>
              <Badge className="bg-fitness-primary/10 text-fitness-primary hover:bg-fitness-primary/20">
                +5 pts
              </Badge>
            </div>
            
            {type === 'running' && (
              <div className="bg-white border border-fitness-gray-light/50 rounded-xl p-3 flex items-center justify-between hover:border-fitness-secondary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-fitness-secondary/10 flex items-center justify-center">
                    <Calendar size={18} className="text-fitness-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Distance Runner</p>
                    <p className="text-xs text-fitness-gray">3+ km in a single run</p>
                  </div>
                </div>
                <Badge className="bg-fitness-secondary/10 text-fitness-secondary hover:bg-fitness-secondary/20">
                  +8 pts
                </Badge>
              </div>
            )}
            
            <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="flex items-start gap-2">
                <div className="min-w-5 mt-0.5">
                  <Coins className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-indigo-700">FitToken Rewards</p>
                  <p className="text-xs text-indigo-600">
                    You've earned 30 FTK from this activity! Rewards have been added to your wallet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex gap-2">
          <button 
            className="flex-1 py-3 rounded-xl font-medium border border-fitness-gray-light text-fitness-gray bg-white hover:bg-fitness-gray-light/50 transition-colors flex items-center justify-center gap-2"
            onClick={onClose}
          >
            Close
          </button>
          <button 
            className="flex-1 bg-gradient-to-r from-fitness-primary to-fitness-primary/80 text-white py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
            onClick={onClose}
          >
            <span>Share Activity</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
