
import React, { useState } from 'react';
import { Info, ArrowRight, X } from 'lucide-react';
import { showActionToast } from '@/utils/toast-utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

interface Tip {
  id: number;
  title: string;
  description: string;
  category: 'nutrition' | 'workout' | 'wellness';
  fullContent?: string;
}

const tips: Tip[] = [
  {
    id: 1,
    title: 'Stay Hydrated',
    description: 'Drink at least 8 glasses of water daily to maintain energy levels and support recovery.',
    category: 'nutrition',
    fullContent: 'Water is essential for nearly every bodily function, including muscle performance and recovery. Aim to drink at least 8 glasses (64 ounces) of water daily, and more on days when you exercise intensely or when it\'s hot. Keep a water bottle with you throughout the day as a reminder to sip regularly. You can also get hydration from fruits and vegetables with high water content like watermelon, cucumber, and oranges.'
  },
  {
    id: 2,
    title: 'Protein Intake',
    description: 'Consume 1.6-2.2g of protein per kg of bodyweight to support muscle growth and recovery.',
    category: 'nutrition',
    fullContent: 'Protein is the building block of muscle tissue and is crucial for recovery and growth. For active individuals looking to build or maintain muscle mass, aim for 1.6-2.2g of protein per kg of bodyweight daily. Spread your protein intake throughout the day rather than consuming it all in one meal. Good sources include lean meats, fish, eggs, dairy, legumes, and plant-based options like tofu and tempeh. Consider a post-workout protein shake within 30 minutes of exercise to maximize recovery.'
  },
  {
    id: 3,
    title: 'Rest Between Sets',
    description: 'For strength gains, rest 2-3 minutes between sets. For endurance, keep rest periods under 60 seconds.',
    category: 'workout',
    fullContent: 'The amount of rest you take between sets directly influences your training outcomes. For maximum strength and power development, rest 2-3 minutes between sets to allow for complete phosphocreatine replenishment. This enables you to lift heavier weights in subsequent sets. For muscle endurance or hypertrophy (muscle building), shorter rest periods of 30-90 seconds increase metabolic stress and hormone response, which can enhance muscle growth. Monitor your rest periods with a timer to ensure consistency in your workouts.'
  },
  {
    id: 4,
    title: 'Sleep Quality',
    description: 'Aim for 7-9 hours of quality sleep to optimize recovery and hormonal balance.',
    category: 'wellness',
    fullContent: 'Sleep is when your body performs much of its repair and recovery work. During deep sleep, growth hormone is released, which helps repair muscle tissue damaged during exercise. Aim for 7-9 hours of quality sleep each night, and try to maintain a consistent sleep schedule. Create a sleep-conducive environment by keeping your bedroom dark, quiet, and cool. Avoid screens, caffeine, and alcohol before bedtime. Consider sleep-tracking apps or devices to monitor your sleep quality and identify areas for improvement.'
  },
  {
    id: 5,
    title: 'Progressive Overload',
    description: 'Gradually increase workout intensity over time to continue seeing results.',
    category: 'workout',
    fullContent: 'Progressive overload is the gradual increase of stress placed on the body during exercise training. It\'s essential for continued improvement in strength, endurance, or muscle size. This can be achieved by increasing weights, adding reps, increasing sets, decreasing rest time, or increasing workout frequency. Aim to progress in small increments to avoid injury. Keep a workout journal to track your progress and ensure you\'re consistently challenging yourself. Remember that progress isn\'t always linear - some weeks you may need to maintain rather than increase intensity.'
  },
  {
    id: 6,
    title: 'Mindful Eating',
    description: 'Practice eating slowly and without distractions to improve digestion and portion control.',
    category: 'nutrition',
    fullContent: 'Mindful eating involves paying full attention to the experience of eating, both inside and outside the body. It includes noticing the colors, smells, flavors, and textures of your food, as well as the thoughts and feelings that arise while eating. Eating slowly allows your body to properly register fullness signals, which typically take about 20 minutes to reach your brain. Turn off screens while eating, chew thoroughly, and try to identify all the ingredients and flavors in your meals. This practice can help prevent overeating and improve your relationship with food.'
  },
  {
    id: 7,
    title: 'Active Recovery',
    description: 'Incorporate light activity on rest days to promote blood flow and speed up recovery.',
    category: 'wellness',
    fullContent: 'Active recovery involves performing low-intensity exercise on your rest days rather than complete inactivity. Activities like walking, swimming, yoga, or light cycling increase blood flow to muscles without adding stress, which helps remove waste products and deliver nutrients to tissues. This can reduce muscle soreness and stiffness, maintain mobility, and potentially speed up the recovery process. Aim for 20-40 minutes of light activity that keeps your heart rate between 30-60% of your maximum heart rate on rest days.'
  },
  {
    id: 8,
    title: 'Compound Exercises',
    description: 'Focus on multi-joint movements to maximize workout efficiency and hormone response.',
    category: 'workout',
    fullContent: 'Compound exercises involve multiple joints and muscle groups working together, such as squats, deadlifts, bench presses, and pull-ups. These movements burn more calories, stimulate greater hormone response (particularly growth hormone and testosterone), and better mimic real-world movements compared to isolation exercises. They also save time by working multiple muscle groups simultaneously. Build your workout routine around compound movements, particularly at the beginning of your session when you have the most energy, then supplement with isolation exercises for specific muscle groups if needed.'
  }
];

const categoryColors = {
  nutrition: 'bg-green-100 text-green-800',
  workout: 'bg-blue-100 text-blue-800',
  wellness: 'bg-purple-100 text-purple-800'
};

const DailyTips: React.FC = () => {
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);
  const [showTipDetail, setShowTipDetail] = useState(false);
  const [showAllTips, setShowAllTips] = useState(false);
  const [displayedTips, setDisplayedTips] = useState(tips.slice(0, 4));

  const handleTipClick = (tip: Tip) => {
    setSelectedTip(tip);
    setShowTipDetail(true);
  };

  const handleSeeAllClick = () => {
    setShowAllTips(true);
    setDisplayedTips(tips);
    showActionToast("Viewing all tips");
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Daily Tips</h2>
        <button 
          className="text-sm font-medium text-fitness-primary"
          onClick={handleSeeAllClick}
        >
          See All
        </button>
      </div>
      
      <div className="space-y-3">
        {displayedTips.map((tip) => (
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
      
      <Dialog open={showTipDetail} onOpenChange={setShowTipDetail}>
        <DialogContent className="max-w-md">
          <DialogClose className="absolute right-4 top-4">
            <X size={18} className="text-gray-500" />
          </DialogClose>
          {selectedTip && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${categoryColors[selectedTip.category]} flex items-center justify-center`}>
                    <Info size={18} />
                  </div>
                  <DialogTitle>{selectedTip.title}</DialogTitle>
                </div>
                <span className="text-xs uppercase font-medium mt-2 inline-block px-2 py-1 rounded bg-gray-100">
                  {selectedTip.category}
                </span>
              </DialogHeader>
              
              <div className="mt-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedTip.fullContent || selectedTip.description}
                </p>
              </div>
              
              <button 
                className="w-full mt-6 bg-fitness-primary text-white py-2 rounded-xl font-medium"
                onClick={() => {
                  showActionToast(`Saved "${selectedTip.title}" to favorites`);
                  setShowTipDetail(false);
                }}
              >
                Save to Favorites
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DailyTips;
