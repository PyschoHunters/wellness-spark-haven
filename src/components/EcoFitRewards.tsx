
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Leaf, Droplet, Wind, Award, TreePine, Trophy, Heart } from 'lucide-react';
import { showActionToast } from '@/utils/toast-utils';

interface RewardType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  target: number;
  current: number;
  unit: string;
  impact: string;
  background: string;
}

const EcoFitRewards: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("available");
  const [rewardCategories] = useState<RewardType[]>([
    {
      id: "steps",
      title: "Step Challenge",
      description: "Walk 10,000 steps",
      icon: <TreePine size={24} />,
      color: "text-green-600",
      target: 10000,
      current: 7536,
      unit: "steps",
      impact: "Plant 1 tree",
      background: "bg-gradient-to-br from-green-50 to-emerald-100"
    },
    {
      id: "calories",
      title: "Calorie Burner",
      description: "Burn 500 calories",
      icon: <Droplet size={24} />,
      color: "text-blue-600",
      target: 500,
      current: 320,
      unit: "calories",
      impact: "Clean 1L of ocean water",
      background: "bg-gradient-to-br from-blue-50 to-cyan-100"
    },
    {
      id: "marathon",
      title: "Marathon Mission",
      description: "Run 42.2 kilometers",
      icon: <Wind size={24} />,
      color: "text-amber-600",
      target: 42.2,
      current: 12.5,
      unit: "km",
      impact: "Fund renewable energy projects",
      background: "bg-gradient-to-br from-amber-50 to-yellow-100"
    }
  ]);

  const completedRewards = [
    {
      title: "First 1000 Steps",
      date: "Apr 10, 2025",
      impact: "Planted 0.1 tree"
    },
    {
      title: "100 Calorie Challenge",
      date: "Apr 8, 2025",
      impact: "Cleaned 0.2L of ocean water"
    }
  ];

  const handleClaimReward = (reward: RewardType) => {
    showActionToast(`You've claimed your reward: ${reward.impact}!`);
  };

  return (
    <Card className="overflow-hidden border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              EcoFit Rewards
            </CardTitle>
            <CardDescription className="text-white/80 mt-1">
              Turn your fitness into environmental action
            </CardDescription>
          </div>
          <Badge className="bg-white/20 text-white hover:bg-white/30">
            <Trophy className="h-3 w-3 mr-1" /> Level 2
          </Badge>
        </div>
      </CardHeader>
      
      <Tabs defaultValue="available" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 bg-gray-100 rounded-none">
          <TabsTrigger value="available" className="data-[state=active]:bg-white">
            Available Rewards
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-white">
            Completed
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="available" className="pt-2">
          <CardContent className="grid gap-4">
            <p className="text-sm text-gray-500">
              Complete these fitness challenges to make a positive environmental impact
            </p>
            
            {rewardCategories.map((reward) => (
              <div 
                key={reward.id} 
                className={`${reward.background} rounded-xl p-4 transition-all hover:shadow-md`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full bg-white/70 ${reward.color} mr-3`}>
                      {reward.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{reward.title}</h3>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                    </div>
                  </div>
                  <Badge className="bg-white/70 text-gray-700 hover:bg-white/80">
                    {reward.current}/{reward.target} {reward.unit}
                  </Badge>
                </div>
                
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-emerald-700 flex items-center">
                      <Leaf className="h-3 w-3 mr-1" />
                      Impact: {reward.impact}
                    </span>
                    <span className="text-gray-600">
                      {Math.round((reward.current / reward.target) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(reward.current / reward.target) * 100} 
                    className="h-2" 
                  />
                  
                  {reward.current >= reward.target ? (
                    <Button 
                      size="sm" 
                      onClick={() => handleClaimReward(reward)}
                      className="w-full mt-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      <Award className="h-4 w-4 mr-2" />
                      Claim Reward
                    </Button>
                  ) : (
                    <p className="text-xs text-gray-500 mt-2 italic">
                      Keep going! You're making progress toward a greener planet.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </TabsContent>
        
        <TabsContent value="completed">
          <CardContent>
            <div className="space-y-4">
              {completedRewards.map((reward, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Trophy className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{reward.title}</h4>
                    <p className="text-xs text-gray-500">{reward.date}</p>
                  </div>
                  <Badge variant="outline" className="bg-transparent border-green-200 text-green-700">
                    {reward.impact}
                  </Badge>
                </div>
              ))}
              
              <div className="text-center p-4">
                <Heart className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-medium">Your Impact</h3>
                <p className="text-sm text-gray-600 mt-1">
                  You've helped plant 0.1 trees and clean 0.2L of ocean water!
                </p>
                <p className="text-xs text-gray-500 mt-3">
                  Complete more fitness challenges to increase your environmental impact.
                </p>
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default EcoFitRewards;
