import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Award, Star, Calendar, Moon, Droplet, Heart, Utensils, BookOpen, Dumbbell, Brain } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface WellnessBadge {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  total: number;
  color: string;
  unlocked: boolean;
}

const wellnessBadges: WellnessBadge[] = [
  {
    id: 1,
    name: "Cycle Tracker",
    description: "Log your cycle for 3 consecutive months",
    icon: <Calendar className="h-6 w-6" />,
    progress: 2,
    total: 3,
    color: "bg-gradient-to-br from-rose-300 via-pink-400 to-rose-500",
    unlocked: false
  },
  {
    id: 2,
    name: "Mindfulness Maven",
    description: "Complete 10 mindfulness sessions",
    icon: <Brain className="h-6 w-6" />,
    progress: 7,
    total: 10,
    color: "bg-gradient-to-br from-indigo-300 via-purple-400 to-indigo-500",
    unlocked: false
  },
  {
    id: 3,
    name: "Ayurveda Explorer",
    description: "Try 5 different Ayurvedic remedies",
    icon: <BookOpen className="h-6 w-6" />,
    progress: 3,
    total: 5,
    color: "bg-gradient-to-br from-amber-300 via-orange-400 to-amber-500",
    unlocked: false
  },
  {
    id: 4,
    name: "Yoga Enthusiast",
    description: "Practice yoga on 15 different days",
    icon: <Dumbbell className="h-6 w-6" />,
    progress: 12,
    total: 15,
    color: "bg-gradient-to-br from-emerald-300 to-emerald-500",
    unlocked: false
  },
  {
    id: 5,
    name: "Nutrition Nurturer",
    description: "Log 20 wellness foods or remedies",
    icon: <Utensils className="h-6 w-6" />,
    progress: 14,
    total: 20,
    color: "bg-gradient-to-br from-amber-300 to-amber-500",
    unlocked: false
  },
  {
    id: 6,
    name: "Hydration Hero",
    description: "Log water intake for 14 consecutive days",
    icon: <Droplet className="h-6 w-6" />,
    progress: 9,
    total: 14,
    color: "bg-gradient-to-br from-sky-300 to-sky-500",
    unlocked: false
  },
  {
    id: 7,
    name: "Self-Care Superstar",
    description: "Log 30 self-care activities",
    icon: <Heart className="h-6 w-6" />,
    progress: 18,
    total: 30,
    color: "bg-gradient-to-br from-pink-300 to-pink-500",
    unlocked: false
  },
  {
    id: 8,
    name: "Lunar Listener",
    description: "Track your cycle alongside 3 full moon cycles",
    icon: <Moon className="h-6 w-6" />,
    progress: 1,
    total: 3,
    color: "bg-gradient-to-br from-slate-300 to-slate-500",
    unlocked: false
  }
];

const WellnessBadges = () => {
  const [selectedBadge, setSelectedBadge] = useState<WellnessBadge | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const handleBadgeClick = (badge: WellnessBadge) => {
    setSelectedBadge(badge);
    setDetailsOpen(true);
  };
  
  return (
    <>
      <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-pink-100 to-pink-200 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-pink-800">
              <Award className="h-5 w-5" />
              Wellness Badges
            </CardTitle>
            <Badge variant="outline" className="bg-white/80 text-pink-700 border-pink-200">
              <Star className="h-3 w-3 mr-1" />
              Level 2
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-3 mb-3">
            {wellnessBadges.slice(0, 4).map((badge) => (
              <div 
                key={badge.id}
                className="flex flex-col items-center text-center cursor-pointer"
                onClick={() => handleBadgeClick(badge)}
              >
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center text-white mb-2 shadow-sm",
                  badge.progress >= badge.total ? badge.color : "bg-gray-200"
                )}>
                  {badge.icon}
                </div>
                <span className="text-xs font-medium line-clamp-1">{badge.name}</span>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 p-3 rounded-xl mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Next Badge: {wellnessBadges[3].name}</h3>
              <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                {wellnessBadges[3].progress}/{wellnessBadges[3].total}
              </Badge>
            </div>
            <Progress 
              value={(wellnessBadges[3].progress / wellnessBadges[3].total) * 100} 
              className="h-2 bg-gray-100"
              indicatorClassName={wellnessBadges[3].color}
            />
            <p className="text-xs text-gray-500 mt-2">
              {wellnessBadges[3].description}
            </p>
          </div>
          
          <Button
            onClick={() => setDetailsOpen(true)}
            className={cn(
              "w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white",
              "hover:opacity-90 transition-all duration-300",
              "flex items-center justify-center gap-2 rounded-xl"
            )}
          >
            <Award className="h-4 w-4" />
            View All Badges
          </Button>
        </CardContent>
      </Card>
      
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {selectedBadge ? selectedBadge.name : "Wellness Badges"}
            </DialogTitle>
          </DialogHeader>
          
          {selectedBadge ? (
            <div className="text-center space-y-4 py-2">
              <div className={cn(
                "w-24 h-24 mx-auto rounded-full flex items-center justify-center text-white",
                selectedBadge.progress >= selectedBadge.total ? selectedBadge.color : "bg-gray-200"
              )}>
                {selectedBadge.icon}
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-1">{selectedBadge.name}</h3>
                <p className="text-gray-600 mb-3">{selectedBadge.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">
                      {selectedBadge.progress}/{selectedBadge.total}
                    </span>
                  </div>
                  <Progress 
                    value={(selectedBadge.progress / selectedBadge.total) * 100} 
                    className="h-2 bg-gray-100"
                    indicatorClassName={selectedBadge.color}
                  />
                </div>
                
                {selectedBadge.progress >= selectedBadge.total ? (
                  <Badge className="mt-4 px-3 py-1 bg-gradient-to-r from-emerald-400 to-emerald-500">
                    Unlocked!
                  </Badge>
                ) : (
                  <p className="mt-4 text-sm text-gray-500">
                    {selectedBadge.total - selectedBadge.progress} more to unlock this badge
                  </p>
                )}
              </div>
              
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSelectedBadge(null)}
              >
                View All Badges
              </Button>
            </div>
          ) : (
            <div className="space-y-6 py-2">
              <div className="grid grid-cols-3 gap-4">
                {wellnessBadges.map((badge) => (
                  <div 
                    key={badge.id}
                    className="flex flex-col items-center text-center cursor-pointer"
                    onClick={() => setSelectedBadge(badge)}
                  >
                    <div className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center text-white mb-2",
                      badge.progress >= badge.total ? badge.color : "bg-gray-200"
                    )}>
                      {badge.icon}
                    </div>
                    <span className="text-sm font-medium mb-1">{badge.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {badge.progress}/{badge.total}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Earn badges by tracking your cycle, practicing wellness activities, and engaging with the Nari Shakti community.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WellnessBadges;
