
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Fire, Target, Dumbbell, Timer, Footprints, Medal } from 'lucide-react';
import { cn } from "@/lib/utils";

const badges = [
  {
    id: 1,
    name: "Early Bird",
    description: "Complete 5 workouts before 8 AM",
    icon: <Timer className="h-6 w-6" />,
    progress: 3,
    total: 5,
    color: "bg-yellow-500"
  },
  {
    id: 2,
    name: "Power Lifter",
    description: "Complete 10 strength training sessions",
    icon: <Dumbbell className="h-6 w-6" />,
    progress: 7,
    total: 10,
    color: "bg-purple-500"
  },
  {
    id: 3,
    name: "Step Master",
    description: "Reach 50,000 steps in a week",
    icon: <Footprints className="h-6 w-6" />,
    progress: 35000,
    total: 50000,
    color: "bg-green-500"
  }
];

const FitnessBadges = () => {
  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Medal className="h-5 w-5" />
            Fitness Badges
          </CardTitle>
          <Badge variant="outline" className="bg-white/20 text-white">
            <Fire className="h-3 w-3 mr-1" />
            Level 3
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid gap-4">
          {badges.map((badge) => (
            <div 
              key={badge.id}
              className="bg-gray-50 p-4 rounded-lg transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-full text-white",
                  badge.color
                )}>
                  {badge.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{badge.name}</h3>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">
                        {badge.progress}/{badge.total}
                      </span>
                    </div>
                    <Progress 
                      value={(badge.progress / badge.total) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
                <Target 
                  className={cn(
                    "h-5 w-5 transition-opacity",
                    badge.progress >= badge.total ? "text-green-500" : "text-gray-300 opacity-50"
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
