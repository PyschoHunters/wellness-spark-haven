
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Coins, Trophy, Users, TrendingUp, Medal, Award, BadgeCheck } from 'lucide-react';
import { cn } from "@/lib/utils";

interface FitChainOverviewProps {
  balance: number;
}

export const FitChainOverview: React.FC<FitChainOverviewProps> = ({ balance }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="overflow-hidden relative border-0 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEuNSIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')] opacity-30"></div>
        <CardHeader className="pb-2 relative z-10">
          <CardTitle className="text-lg font-medium flex items-center gap-2 text-white">
            <Coins className="h-5 w-5" />
            FitToken Balance
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 text-white">
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{balance} FTK</span>
            <span className="text-xs opacity-80 mt-1">≈ ${(balance * 0.1).toFixed(2)} USD</span>
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+128 FTK this week</span>
            </div>
            <div className="mt-4 flex gap-2">
              <span className="text-[10px] bg-white/20 rounded-full px-2 py-0.5 backdrop-blur-sm">
                Tier: Gold
              </span>
              <span className="text-[10px] bg-white/20 rounded-full px-2 py-0.5 backdrop-blur-sm">
                x1.5 Earning Rate
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-md border-gray-200/60 hover:shadow-lg transition-shadow">
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
            <Progress value={75} className="h-2 bg-gray-100" indicatorClassName="bg-gradient-to-r from-amber-400 to-amber-500" />
            <span className="text-xs text-muted-foreground mt-2">
              250 XP needed for next level
            </span>
            <div className="mt-4">
              <div className="text-xs flex items-center gap-1 text-emerald-600">
                <BadgeCheck className="h-3.5 w-3.5" />
                <span>Completing daily challenges grants bonus XP</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-md border-gray-200/60 hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Leaderboard Rank
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">#28</span>
            <div className="flex items-center mt-2 text-xs text-emerald-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>Up 5 positions this week</span>
            </div>
            <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Medal className="h-3.5 w-3.5 text-amber-500" />
                <span>Top 100</span>
              </div>
              <span className="text-blue-500 hover:underline cursor-pointer">View Full Rankings →</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-md border-gray-200/60 hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-500" />
            NFT Collectibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">7</span>
            <div className="flex gap-1 mt-1">
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded-full",
                "bg-purple-100 text-purple-800"
              )}>
                Rare: 2
              </span>
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded-full",
                "bg-blue-100 text-blue-800"
              )}>
                Common: 5
              </span>
            </div>
            <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Trophy className="h-3.5 w-3.5 text-amber-500" />
                <span>Rarest: Gold Dumbbell</span>
              </div>
              <span className="text-emerald-500 hover:underline cursor-pointer">View Collection →</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
