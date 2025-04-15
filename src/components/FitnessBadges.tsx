
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Flame, Target, Dumbbell, Timer, Footprints, Medal, Trophy, Award, Zap } from 'lucide-react';
import { cn } from "@/lib/utils";

const badges = [
  {
    id: 1,
    name: "Early Bird",
    description: "Complete 5 workouts before 8 AM",
    icon: <Timer className="h-6 w-6" />,
    progress: 3,
    total: 5,
    color: "bg-gradient-to-br from-amber-300 to-amber-500"
  },
  {
    id: 2,
    name: "Power Lifter",
    description: "Complete 10 strength training sessions",
    icon: <Dumbbell className="h-6 w-6" />,
    progress: 7,
    total: 10,
    color: "bg-gradient-to-br from-indigo-300 to-indigo-500"
  },
  {
    id: 3,
    name: "Step Master",
    description: "Reach 50,000 steps in a week",
    icon: <Footprints className="h-6 w-6" />,
    progress: 35000,
    total: 50000,
    color: "bg-gradient-to-br from-emerald-300 to-emerald-500"
  },
  {
    id: 4,
    name: "Ultimate Warrior",
    description: "Complete 20 HIIT workouts",
    icon: <Zap className="h-6 w-6" />,
    progress: 12,
    total: 20,
    color: "bg-gradient-to-br from-rose-300 to-rose-500"
  },
  {
    id: 5,
    name: "Champion",
    description: "Earn 10 achievement badges",
    icon: <Trophy className="h-6 w-6" />,
    progress: 4,
    total: 10,
    color: "bg-gradient-to-br from-sky-300 to-sky-500"
  }
];

const FitnessBadges = () => {
  const [showAllBadges, setShowAllBadges] = useState(false);
  const displayedBadges = showAllBadges ? badges : badges.slice(0, 2);

  return (
    <Card className="w-full bg-white shadow-xl rounded-2xl overflow-hidden border-0 hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-sky-500 to-blue-600 p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-white">
            <Award className="h-6 w-6" />
            Achievement Badges
          </CardTitle>
          <Badge variant="outline" className="bg-white/20 text-white border-white/40">
            <Trophy className="h-3 w-3 mr-1" />
            Level 3
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid gap-6">
          {displayedBadges.map((badge) => (
            <div 
              key={badge.id}
              className={cn(
                "bg-gray-50 p-5 rounded-2xl transition-all duration-300 hover:shadow-lg group hover:bg-white",
                "animate-fade-in"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-xl text-white transition-transform duration-300 group-hover:scale-110",
                  badge.color
                )}>
                  {badge.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{badge.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">
                        {badge.progress.toLocaleString()}/{badge.total.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={(badge.progress / badge.total) * 100} 
                      className="h-2 bg-gray-100"
                      indicatorClassName={cn(
                        "transition-all duration-300",
                        badge.color
                      )}
                    />
                  </div>
                </div>
                <Target 
                  className={cn(
                    "h-5 w-5 transition-all duration-300",
                    badge.progress >= badge.total 
                      ? "text-emerald-500 scale-110" 
                      : "text-gray-300 opacity-50 group-hover:opacity-75"
                  )} 
                />
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={() => setShowAllBadges(!showAllBadges)}
          className={cn(
            "w-full mt-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white",
            "hover:opacity-90 transition-all duration-300",
            "flex items-center justify-center gap-2 rounded-2xl"
          )}
        >
          <Medal className="h-4 w-4" />
          {showAllBadges ? "Show Less Badges" : "View All Badges"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FitnessBadges;
