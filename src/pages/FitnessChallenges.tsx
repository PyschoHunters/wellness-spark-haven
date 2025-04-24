
import React, { useState } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { ArrowLeft, Trophy, Users, CheckCircle, Clock, Flame, Award, Lock, ChevronRight, Heart, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showActionToast } from '@/utils/toast-utils';
import { cn } from '@/lib/utils';

interface Challenge {
  id: number;
  title: string;
  description: string;
  duration: string;
  participants: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  type: 'Solo' | 'Group' | 'Community';
  status: 'active' | 'completed' | 'locked';
  progress: number;
  reward: string;
  endDate: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'endurance' | 'wellness';
}

const FitnessChallenges: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  
  const handleBack = () => {
    navigate('/schedule');
  };
  
  const challenges: Challenge[] = [
    {
      id: 1,
      title: "30-Day Push-Up Challenge",
      description: "Start with 5 push-ups and add 1 each day until you reach 35 push-ups.",
      duration: "30 days",
      participants: 1243,
      difficulty: 'Medium',
      type: 'Solo',
      status: 'active',
      progress: 60,
      reward: "Silver Badge + 500 EcoFit Points",
      endDate: "May 15, 2025",
      category: 'strength'
    },
    {
      id: 2,
      title: "10K Steps Daily",
      description: "Complete 10,000 steps every day for 14 days straight.",
      duration: "14 days",
      participants: 3587,
      difficulty: 'Easy',
      type: 'Community',
      status: 'active',
      progress: 35,
      reward: "Bronze Badge + 300 EcoFit Points",
      endDate: "May 8, 2025",
      category: 'endurance'
    },
    {
      id: 3,
      title: "Morning Yoga Master",
      description: "Complete a 15-minute yoga session every morning for 21 days.",
      duration: "21 days",
      participants: 876,
      difficulty: 'Easy',
      type: 'Solo',
      status: 'completed',
      progress: 100,
      reward: "Flexibility Expert Badge + 400 EcoFit Points",
      endDate: "April 22, 2025",
      category: 'flexibility'
    },
    {
      id: 4,
      title: "HIIT Champions",
      description: "Complete 12 high-intensity interval training sessions within 30 days.",
      duration: "30 days",
      participants: 654,
      difficulty: 'Hard',
      type: 'Group',
      status: 'active',
      progress: 25,
      reward: "Gold Badge + 800 EcoFit Points",
      endDate: "May 30, 2025",
      category: 'cardio'
    },
    {
      id: 5,
      title: "Marathon Prep Challenge",
      description: "Follow a structured training program preparing for a half-marathon.",
      duration: "60 days",
      participants: 321,
      difficulty: 'Expert',
      type: 'Group',
      status: 'locked',
      progress: 0,
      reward: "Elite Runner Badge + 1000 EcoFit Points",
      endDate: "July 24, 2025",
      category: 'endurance'
    },
    {
      id: 6,
      title: "Mindful Meditation",
      description: "Meditate for at least 10 minutes every day for 30 days.",
      duration: "30 days",
      participants: 1432,
      difficulty: 'Easy',
      type: 'Community',
      status: 'active',
      progress: 45,
      reward: "Mental Wellness Badge + 350 EcoFit Points",
      endDate: "May 25, 2025",
      category: 'wellness'
    }
  ];
  
  const filteredChallenges = activeTab === 'all' 
    ? challenges 
    : challenges.filter(challenge => 
        activeTab === 'active' 
          ? challenge.status === 'active' 
          : activeTab === 'completed' 
            ? challenge.status === 'completed' 
            : challenge.category === activeTab);
  
  const handleJoinChallenge = (challenge: Challenge) => {
    if (challenge.status === 'locked') {
      showActionToast("Complete active challenges to unlock this one!");
      return;
    }
    setSelectedChallenge(challenge);
    setShowJoinModal(true);
  };
  
  const confirmJoinChallenge = () => {
    if (selectedChallenge) {
      showActionToast(`Joined "${selectedChallenge.title}" challenge!`);
      setShowJoinModal(false);
    }
  };
  
  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-blue-100 text-blue-800';
      case 'Hard': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTypeIcon = (type: Challenge['type']) => {
    switch(type) {
      case 'Solo': return <Trophy size={14} />;
      case 'Group': return <Users size={14} />;
      case 'Community': return <Heart size={14} />;
      default: return <Trophy size={14} />;
    }
  };
  
  const getCategoryIcon = (category: Challenge['category']) => {
    switch(category) {
      case 'strength': return <Award className="text-purple-500" size={18} />;
      case 'cardio': return <Flame className="text-red-500" size={18} />;
      case 'flexibility': return <Sparkles className="text-blue-500" size={18} />;
      case 'endurance': return <Clock className="text-green-500" size={18} />;
      case 'wellness': return <Heart className="text-pink-500" size={18} />;
      default: return <Trophy className="text-amber-500" size={18} />;
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20">
      <Header 
        title="Fitness Challenges" 
        action={
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft size={20} className="text-fitness-dark" />
          </Button>
        }
      />
      
      <div className="mb-6 bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center mb-2">
          <Trophy className="text-amber-500 mr-2" size={24} />
          <h2 className="text-lg font-semibold">Join Challenges, Earn Rewards</h2>
        </div>
        <p className="text-sm text-fitness-gray">
          Push yourself with fitness challenges. Compete with friends, track progress, and earn exclusive rewards.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-6 h-auto p-1">
          <TabsTrigger value="all" className="text-xs py-1 h-auto">All</TabsTrigger>
          <TabsTrigger value="active" className="text-xs py-1 h-auto">Active</TabsTrigger>
          <TabsTrigger value="strength" className="text-xs py-1 h-auto">Strength</TabsTrigger>
          <TabsTrigger value="cardio" className="text-xs py-1 h-auto">Cardio</TabsTrigger>
          <TabsTrigger value="endurance" className="text-xs py-1 h-auto">Endurance</TabsTrigger>
          <TabsTrigger value="wellness" className="text-xs py-1 h-auto">Wellness</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="space-y-4">
        {filteredChallenges.map((challenge) => (
          <Card key={challenge.id} className={cn(
            "overflow-hidden transition-all border-l-4",
            challenge.status === 'completed' ? "border-green-500" : 
            challenge.status === 'locked' ? "border-gray-300 opacity-70" :
            "border-amber-500"
          )}>
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(challenge.category)}
                    <h3 className="font-semibold">{challenge.title}</h3>
                  </div>
                  <Badge variant="outline" className={cn(
                    "text-xs font-normal",
                    getDifficultyColor(challenge.difficulty)
                  )}>
                    {challenge.difficulty}
                  </Badge>
                </div>
                
                <p className="text-sm text-fitness-gray mb-3">{challenge.description}</p>
                
                <div className="flex justify-between text-xs text-fitness-gray mb-2">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{challenge.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{challenge.participants.toLocaleString()} participants</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getTypeIcon(challenge.type)}
                    <span>{challenge.type}</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span className="font-medium">{challenge.progress}%</span>
                  </div>
                  <Progress value={challenge.progress} className="h-1.5" />
                </div>
                
                <div className="flex items-center justify-between text-xs text-fitness-gray mb-3">
                  <div className="flex items-center gap-1">
                    <Award size={14} />
                    <span className="font-medium text-amber-600">{challenge.reward}</span>
                  </div>
                  <span>Ends: {challenge.endDate}</span>
                </div>
                
                <Button
                  variant={challenge.status === 'completed' ? "outline" : "default"}
                  className={cn(
                    "w-full",
                    challenge.status === 'completed' ? "bg-green-50 text-green-700 hover:text-green-800 hover:bg-green-100 border-green-200" :
                    challenge.status === 'locked' ? "bg-gray-100 text-gray-500" :
                    ""
                  )}
                  onClick={() => handleJoinChallenge(challenge)}
                  disabled={challenge.status === 'locked'}
                >
                  {challenge.status === 'completed' ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} />
                      Completed
                    </div>
                  ) : challenge.status === 'locked' ? (
                    <div className="flex items-center gap-2">
                      <Lock size={16} />
                      Locked
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Trophy size={16} />
                      Join Challenge
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {showJoinModal && selectedChallenge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 m-4 max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Join Challenge</h3>
            <p className="mb-4">
              Are you ready to join the "{selectedChallenge.title}" challenge? You'll need to complete it within {selectedChallenge.duration}.
            </p>
            
            <div className="flex justify-between mb-4 text-sm bg-amber-50 rounded-lg p-3">
              <div>
                <div className="font-medium">Reward upon completion</div>
                <div className="flex items-center text-amber-700 mt-1">
                  <Award size={16} className="mr-1" />
                  <span>{selectedChallenge.reward}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowJoinModal(false)}>
                Cancel
              </Button>
              <Button onClick={confirmJoinChallenge}>
                Join Challenge
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Navigation />
    </div>
  );
};

export default FitnessChallenges;
