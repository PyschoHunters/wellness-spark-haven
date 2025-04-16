
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Coins, Trophy, Users, TrendingUp } from 'lucide-react';

export const FitChainOverview: React.FC = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600 border-0 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Coins className="h-5 w-5" />
            FitToken Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">1,250 FTK</span>
            <span className="text-xs opacity-80 mt-1">≈ $125.00 USD</span>
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+128 FTK this week</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Level Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="flex justify-between mb-1">
              <span className="text-lg font-bold">Level 12</span>
              <span className="text-sm">750/1000 XP</span>
            </div>
            <Progress value={75} className="h-2" />
            <span className="text-xs text-muted-foreground mt-2">
              250 XP needed for next level
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Leaderboard Rank
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">#28</span>
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span>Up 5 positions this week</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Trophy className="h-5 w-5 text-emerald-500" />
            NFT Collectibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">7</span>
            <span className="text-sm text-muted-foreground mt-1">
              Rare: 2 | Common: 5
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
