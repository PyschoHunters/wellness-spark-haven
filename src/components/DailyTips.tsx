
import React, { useState, useEffect } from 'react';
import { Info, ArrowRight, X, Bookmark, Search, CheckCircle } from 'lucide-react';
import { showActionToast } from '@/utils/toast-utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Tip {
  id: number;
  title: string;
  description: string;
  category: 'nutrition' | 'workout' | 'wellness';
  fullContent?: string;
  bookmarked?: boolean;
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
  nutrition: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    light: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: 'text-emerald-600'
  },
  workout: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    light: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600'
  },
  wellness: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    light: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'text-purple-600'
  }
};

const DailyTips: React.FC = () => {
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);
  const [showTipDetail, setShowTipDetail] = useState(false);
  const [showAllTips, setShowAllTips] = useState(false);
  const [displayedTips, setDisplayedTips] = useState(tips.slice(0, 4));
  const [bookmarkedTips, setBookmarkedTips] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'nutrition' | 'workout' | 'wellness'>('all');
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Load bookmarks from localStorage
    try {
      const saved = localStorage.getItem('bookmarkedTips');
      if (saved) {
        setBookmarkedTips(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading bookmarks:', e);
    }
    
    // Add animation delay
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleTipClick = (tip: Tip) => {
    setSelectedTip({
      ...tip,
      bookmarked: bookmarkedTips.includes(tip.id)
    });
    setShowTipDetail(true);
  };

  const handleSeeAllClick = () => {
    setShowAllTips(true);
    setDisplayedTips(tips);
    showActionToast("Viewing all tips");
  };

  const handleBookmark = (tipId: number) => {
    let newBookmarks;
    if (bookmarkedTips.includes(tipId)) {
      newBookmarks = bookmarkedTips.filter(id => id !== tipId);
      showActionToast("Tip removed from favorites");
    } else {
      newBookmarks = [...bookmarkedTips, tipId];
      showActionToast("Tip saved to favorites");
    }
    setBookmarkedTips(newBookmarks);
    
    // Update the selected tip if it's open
    if (selectedTip && selectedTip.id === tipId) {
      setSelectedTip({
        ...selectedTip,
        bookmarked: !bookmarkedTips.includes(tipId)
      });
    }
    
    // Save to localStorage
    localStorage.setItem('bookmarkedTips', JSON.stringify(newBookmarks));
  };

  const filterTipsByCategory = (category: 'all' | 'nutrition' | 'workout' | 'wellness') => {
    setActiveCategory(category);
    if (category === 'all') {
      setDisplayedTips(showAllTips ? tips : tips.slice(0, 4));
    } else {
      const filtered = tips.filter(tip => tip.category === category);
      setDisplayedTips(filtered);
    }
  };

  const getTodaysTip = () => {
    // Get a "random" tip based on the day of the month
    const day = new Date().getDate();
    return tips[day % tips.length];
  };

  const todaysTip = getTodaysTip();

  return (
    <Card className={`border-0 shadow-md overflow-hidden transition-all duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 text-white">
        <h2 className="text-xl font-semibold mb-2">Daily Wellness Tips</h2>
        <p className="text-white/80 text-sm mb-4">Expert advice to improve your fitness journey</p>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          <Button 
            className={`${activeCategory === 'all' ? 'bg-white text-indigo-700' : 'bg-white/20 text-white'} rounded-full text-xs px-4 hover:bg-white hover:text-indigo-700`}
            onClick={() => filterTipsByCategory('all')}
          >
            All Tips
          </Button>
          <Button 
            className={`${activeCategory === 'nutrition' ? 'bg-white text-emerald-600' : 'bg-white/20 text-white'} rounded-full text-xs px-4 hover:bg-white hover:text-emerald-600`}
            onClick={() => filterTipsByCategory('nutrition')}
          >
            Nutrition
          </Button>
          <Button 
            className={`${activeCategory === 'workout' ? 'bg-white text-blue-600' : 'bg-white/20 text-white'} rounded-full text-xs px-4 hover:bg-white hover:text-blue-600`}
            onClick={() => filterTipsByCategory('workout')}
          >
            Workout
          </Button>
          <Button 
            className={`${activeCategory === 'wellness' ? 'bg-white text-purple-600' : 'bg-white/20 text-white'} rounded-full text-xs px-4 hover:bg-white hover:text-purple-600`}
            onClick={() => filterTipsByCategory('wellness')}
          >
            Wellness
          </Button>
        </div>
        
        <div className="mt-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl">
          <div className="flex gap-3">
            <div className={`h-12 w-12 rounded-full ${categoryColors[todaysTip.category].bg} ${categoryColors[todaysTip.category].text} flex items-center justify-center flex-shrink-0`}>
              <Info size={24} />
            </div>
            <div>
              <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full text-white">Today's Tip</span>
              <h3 className="font-medium mt-1">{todaysTip.title}</h3>
              <p className="text-xs text-white/80 mt-1 line-clamp-2">{todaysTip.description}</p>
            </div>
          </div>
          <Button
            className="w-full mt-3 bg-white/20 hover:bg-white/30 text-white text-sm"
            onClick={() => handleTipClick(todaysTip)}
          >
            Read More <ArrowRight size={14} className="ml-1" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        {displayedTips.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Search size={40} className="mx-auto mb-2 opacity-30" />
            <p>No tips found in this category</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedTips.map((tip) => (
              <div 
                key={tip.id} 
                className={`${categoryColors[tip.category].light} p-4 rounded-xl flex gap-3 cursor-pointer hover:shadow-md transition-all border ${categoryColors[tip.category].border}`}
                onClick={() => handleTipClick(tip)}
              >
                <div className={`w-10 h-10 rounded-full ${categoryColors[tip.category].bg} flex items-center justify-center flex-shrink-0`}>
                  <Info size={18} className={categoryColors[tip.category].icon} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{tip.title}</h3>
                    {bookmarkedTips.includes(tip.id) && (
                      <Bookmark size={16} className="text-amber-500 fill-amber-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{tip.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[tip.category].bg} ${categoryColors[tip.category].text}`}>
                      {tip.category}
                    </span>
                    <ArrowRight size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!showAllTips && displayedTips.length >= 4 && (
          <Button
            variant="outline"
            className="w-full mt-4 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            onClick={handleSeeAllClick}
          >
            View All Tips
          </Button>
        )}
        
        {bookmarkedTips.length > 0 && (
          <div className="mt-4 text-center">
            <span className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <Bookmark size={12} className="text-amber-500 fill-amber-500" /> 
              {bookmarkedTips.length} tips saved to favorites
            </span>
          </div>
        )}
      </CardContent>
      
      <Dialog open={showTipDetail} onOpenChange={setShowTipDetail}>
        <DialogContent className="max-w-md">
          <DialogClose className="absolute right-4 top-4">
            <X size={18} className="text-gray-500" />
          </DialogClose>
          {selectedTip && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full ${categoryColors[selectedTip.category].bg} flex items-center justify-center`}>
                    <Info size={22} className={categoryColors[selectedTip.category].icon} />
                  </div>
                  <DialogTitle className="text-xl">{selectedTip.title}</DialogTitle>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className={`text-xs uppercase font-medium px-2 py-1 rounded-full ${categoryColors[selectedTip.category].bg} ${categoryColors[selectedTip.category].text}`}>
                    {selectedTip.category}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`text-xs ${selectedTip.bookmarked ? 'text-amber-500' : 'text-gray-500'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookmark(selectedTip.id);
                    }}
                  >
                    {selectedTip.bookmarked ? (
                      <><Bookmark size={14} className="mr-1 fill-amber-500" /> Saved</>
                    ) : (
                      <><Bookmark size={14} className="mr-1" /> Save to Favorites</>
                    )}
                  </Button>
                </div>
              </DialogHeader>
              
              <div className="mt-4">
                <p className="text-gray-700 leading-relaxed">
                  {selectedTip.fullContent || selectedTip.description}
                </p>
              </div>
              
              <div className="mt-6 flex gap-3">
                {selectedTip.bookmarked ? (
                  <Button 
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                    onClick={() => {
                      handleBookmark(selectedTip.id);
                      setShowTipDetail(false);
                    }}
                  >
                    <CheckCircle size={16} className="mr-2" /> Saved to Favorites
                  </Button>
                ) : (
                  <Button 
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => {
                      handleBookmark(selectedTip.id);
                      setShowTipDetail(false);
                    }}
                  >
                    <Bookmark size={16} className="mr-2" /> Save to Favorites
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DailyTips;
