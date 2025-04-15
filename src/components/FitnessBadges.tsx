
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Flame, Target, Dumbbell, Timer, Footprints, Medal } from 'lucide-react';
import { cn } from "@/lib/utils";

const badges = [
  {
    id: 1,
    name: "Early Bird",
    description: "Complete 5 workouts before 8 AM",
    icon: <Timer className="h-6 w-6" />,
    progress: 3,
    total: 5,
    color: "bg-gradient-to-br from-amber-400 to-amber-600"
  },
  {
    id: 2,
    name: "Power Lifter",
    description: "Complete 10 strength training sessions",
    icon: <Dumbbell className="h-6 w-6" />,
    progress: 7,
    total: 10,
    color: "bg-gradient-to-br from-purple-400 to-purple-600"
  },
  {
    id: 3,
    name: "Step Master",
    description: "Reach 50,000 steps in a week",
    icon: <Footprints className="h-6 w-6" />,
    progress: 35000,
    total: 50000,
    color: "bg-gradient-to-br from-emerald-400 to-emerald-600"
  }
];

const FitnessBadges = () => {
  return (
    <Card className="w-full bg-white shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Medal className="h-6 w-6" />
            Achievement Badges
          </CardTitle>
          <Badge variant="outline" className="bg-white/20 text-white border-white/40">
            <Flame className="h-3 w-3 mr-1" />
            Level 3
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid gap-6">
          {badges.map((badge) => (
            <div 
              key={badge.id}
              className="bg-gray-50 p-5 rounded-xl transition-all duration-300 hover:shadow-md group hover:bg-white"
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
      </CardContent>
    </Card>
  );
};

export default FitnessBadges;
