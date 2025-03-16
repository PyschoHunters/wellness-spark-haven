
import React from 'react';
import { Info, ArrowRight } from 'lucide-react';
import { showActionToast } from '@/utils/toast-utils';

interface Tip {
  id: number;
  title: string;
  description: string;
  category: 'nutrition' | 'workout' | 'wellness';
}

const tips: Tip[] = [
  {
    id: 1,
    title: 'Stay Hydrated',
    description: 'Drink at least 8 glasses of water daily to maintain energy levels and support recovery.',
    category: 'nutrition'
  },
  {
    id: 2,
    title: 'Protein Intake',
    description: 'Consume 1.6-2.2g of protein per kg of bodyweight to support muscle growth and recovery.',
    category: 'nutrition'
  },
  {
    id: 3,
    title: 'Rest Between Sets',
    description: 'For strength gains, rest 2-3 minutes between sets. For endurance, keep rest periods under 60 seconds.',
    category: 'workout'
  },
  {
    id: 4,
    title: 'Sleep Quality',
    description: 'Aim for 7-9 hours of quality sleep to optimize recovery and hormonal balance.',
    category: 'wellness'
  }
];

const categoryColors = {
  nutrition: 'bg-green-100 text-green-800',
  workout: 'bg-blue-100 text-blue-800',
  wellness: 'bg-purple-100 text-purple-800'
};

const DailyTips: React.FC = () => {
  const handleTipClick = (tip: Tip) => {
    showActionToast(`Tip: ${tip.title}`);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Daily Tips</h2>
        <button className="text-sm font-medium text-fitness-primary">
          See All
        </button>
      </div>
      
      <div className="space-y-3">
        {tips.map((tip) => (
          <div 
            key={tip.id} 
            className="bg-fitness-gray-light p-3 rounded-xl flex gap-3 cursor-pointer hover:bg-fitness-gray-light/80 transition-colors"
            onClick={() => handleTipClick(tip)}
          >
            <div className={`w-10 h-10 rounded-full ${categoryColors[tip.category]} flex items-center justify-center flex-shrink-0`}>
              <Info size={18} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{tip.title}</h3>
              <p className="text-xs text-fitness-gray mt-1">{tip.description}</p>
            </div>
            <div className="flex items-center">
              <ArrowRight size={18} className="text-fitness-gray" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyTips;
