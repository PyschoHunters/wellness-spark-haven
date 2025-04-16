
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, Flame, Heart, Award, Clock, Users, ChevronRight, Lock } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Challenge {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  reward: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: 'daily' | 'weekly' | 'community' | 'special';
  progress: number;
  total: number;
  joined: boolean;
  completed: boolean;
  participants: number;
  timeRemaining: string;
  color: string;
}

export const ChallengeBoard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  const challenges: Challenge[] = [
    {
      id: 1,
      title: "10K Step Challenge",
      description: "Complete 10,000 steps daily for 5 consecutive days",
      icon: <Flame className="h-5 w-5" />,
      reward: 250,
      difficulty: 'medium',
      category: 'weekly',
      progress: 3,
      total: 5,
      joined: true,
      completed: false,
      participants: 1354,
      timeRemaining: "2 days",
      color: "from-orange-400 to-red-500"
    },
    {
      id: 2,
      title: "Strength Training Master",
      description: "Complete 8 strength training sessions in 2 weeks",
      icon: <Dumbbell className="h-5 w-5" />,
      reward: 350,
      difficulty: 'hard',
      category: 'weekly',
      progress: 5,
      total: 8,
      joined: true,
      completed: false,
      participants: 823,
      timeRemaining: "5 days",
      color: "from-blue-500 to-indigo-600"
    },
    {
      id: 3,
      title: "Daily Meditation",
      description: "Complete a 10-minute meditation session",
      icon: <Heart className="h-5 w-5" />,
      reward: 50,
      difficulty: 'easy',
      category: 'daily',
      progress: 1,
      total: 1,
      joined: true,
      completed: true,
      participants: 2158,
      timeRemaining: "Resets in 8 hours",
      color: "from-pink-400 to-rose-500"
    },
    {
      id: 4,
      title: "Community 5K Run",
      description: "Participate in the virtual community 5K run event",
      icon: <Users className="h-5 w-5" />,
      reward: 500,
      difficulty: 'expert',
      category: 'community',
      progress: 0,
      total: 1,
      joined: false,
      completed: false,
      participants: 506,
      timeRemaining: "Starts in 3 days",
      color: "from-emerald-400 to-green-600"
    },
    {
      id: 5,
      title: "NFT Marathon Challenge",
      description: "Run a total of 42.2 kilometers to earn an exclusive Marathon NFT",
      icon: <Award className="h-5 w-5" />,
      reward: 1000,
      difficulty: 'expert',
      category: 'special',
      progress: 12.8,
      total: 42.2,
      joined: true,
      completed: false,
      participants: 289,
      timeRemaining: "14 days",
      color: "from-purple-500 to-indigo-700"
    }
  ];

  const filteredChallenges = activeFilter === 'all' 
    ? challenges 
    : challenges.filter(c => c.category === activeFilter || 
        (activeFilter === 'active' && c.joined && !c.completed) ||
        (activeFilter === 'completed' && c.completed));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'daily': return <Clock className="h-4 w-4 mr-1" />;
      case 'weekly': return <Flame className="h-4 w-4 mr-1" />;
      case 'community': return <Users className="h-4 w-4 mr-1" />;
      case 'special': return <Award className="h-4 w-4 mr-1" />;
      default: return null;
    }
  };

  const joinChallenge = (id: number) => {
    // In a real app, this would connect to a blockchain smart contract
    console.log(`Joining challenge ${id}`);
    // Show success toast
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeFilter === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveFilter('all')}
        >
          All Challenges
        </Button>
        <Button
          variant={activeFilter === 'daily' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveFilter('daily')}
          className="flex items-center"
        >
          <Clock className="h-4 w-4 mr-1" /> Daily
        </Button>
        <Button
          variant={activeFilter === 'weekly' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveFilter('weekly')}
          className="flex items-center"
        >
          <Flame className="h-4 w-4 mr-1" /> Weekly
        </Button>
        <Button
          variant={activeFilter === 'community' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveFilter('community')}
          className="flex items-center"
        >
          <Users className="h-4 w-4 mr-1" /> Community
        </Button>
        <Button
          variant={activeFilter === 'special' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveFilter('special')}
          className="flex items-center"
        >
          <Award className="h-4 w-4 mr-1" /> Special
        </Button>
        <Button
          variant={activeFilter === 'active' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveFilter('active')}
        >
          Active
        </Button>
        <Button
          variant={activeFilter === 'completed' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setActiveFilter('completed')}
        >
          Completed
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredChallenges.map((challenge) => (
          <Card key={challenge.id} className="overflow-hidden border">
            <div className={`h-2 w-full bg-gradient-to-r ${challenge.color}`} />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className={`p-2 rounded-full bg-gradient-to-br ${challenge.color} text-white`}>
                      {challenge.icon}
                    </div>
                    <span>{challenge.title}</span>
                  </CardTitle>
                  <CardDescription className="mt-2">{challenge.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pb-2">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                    </Badge>
                    <Badge variant="outline" className="ml-2 flex items-center">
                      {getCategoryIcon(challenge.category)}
                      {challenge.category.charAt(0).toUpperCase() + challenge.category.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center text-amber-600 font-medium">
                    <Coins className="h-4 w-4 mr-1" />
                    {challenge.reward} FTK
                  </div>
                </div>
                
                {challenge.joined && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{challenge.progress}/{challenge.total} {challenge.id === 5 ? 'km' : 'days'}</span>
                    </div>
                    <Progress 
                      value={(challenge.progress / challenge.total) * 100}
                      className={cn(
                        "h-2",
                        challenge.completed && "bg-green-100"
                      )}
                      indicatorClassName={
                        challenge.completed 
                          ? "bg-green-500" 
                          : `bg-gradient-to-r ${challenge.color}`
                      }
                    />
                  </div>
                )}
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {challenge.participants.toLocaleString()} participants
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {challenge.timeRemaining}
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              {challenge.completed ? (
                <Button className="w-full bg-green-500 hover:bg-green-600" disabled>
                  Completed
                </Button>
              ) : challenge.joined ? (
                <Button className="w-full" variant="outline">
                  View Details <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button 
                  className={`w-full bg-gradient-to-r ${challenge.color} text-white hover:opacity-90`}
                  onClick={() => joinChallenge(challenge.id)}
                >
                  Join Challenge
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
