import React from 'react';
import { UserRound, Clock, ThumbsUp, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { showActionToast } from '@/utils/toast-utils';

const ElderFitness = () => {
  const handleStartWorkout = (workoutName: string) => {
    showActionToast(`Starting ${workoutName} workout`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-center w-16 h-16 mb-4 bg-white rounded-full shadow-sm mx-auto">
          <UserRound className="text-purple-600" size={28} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Senior Fitness</h1>
        <p className="text-gray-600 text-center mb-6">
          Exercises designed for seniors to improve mobility, balance, and overall well-being
        </p>
        
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white p-3 rounded-xl text-center shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Balance</p>
            <div className="flex justify-center mb-1">
              <ThumbsUp size={20} className="text-blue-500" />
            </div>
            <Progress value={68} className="h-1.5" />
          </div>
          <div className="bg-white p-3 rounded-xl text-center shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Strength</p>
            <div className="flex justify-center mb-1">
              <Heart size={20} className="text-red-500" />
            </div>
            <Progress value={45} className="h-1.5" />
          </div>
          <div className="bg-white p-3 rounded-xl text-center shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Mobility</p>
            <div className="flex justify-center mb-1">
              <Clock size={20} className="text-purple-500" />
            </div>
            <Progress value={72} className="h-1.5" />
          </div>
        </div>
      </div>
      
      <h2 className="text-lg font-semibold px-1">Recommended Workouts</h2>
      <div className="space-y-4">
        <Card className="overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Gentle Chair Yoga</CardTitle>
            <CardDescription>30 mins • Low Impact</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-gray-600">
              Improve flexibility and balance with these gentle chair-supported poses.
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <Heart size={14} className="mr-1 text-red-400" />
              <span>Great for circulation</span>
            </div>
            <Button 
              size="sm" 
              className="bg-purple-100 hover:bg-purple-200 text-purple-800"
              onClick={() => handleStartWorkout('Gentle Chair Yoga')}
            >
              Start
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Balance & Stability</CardTitle>
            <CardDescription>25 mins • Moderate</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-gray-600">
              Essential exercises to improve balance and prevent falls.
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <ThumbsUp size={14} className="mr-1 text-blue-400" />
              <span>Strength building</span>
            </div>
            <Button 
              size="sm" 
              className="bg-purple-100 hover:bg-purple-200 text-purple-800"
              onClick={() => handleStartWorkout('Balance & Stability')}
            >
              Start
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Gentle Strength Training</CardTitle>
            <CardDescription>20 mins • Low Impact</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-gray-600">
              Light resistance exercises to maintain muscle mass and bone density.
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <Clock size={14} className="mr-1 text-purple-400" />
              <span>Joint-friendly</span>
            </div>
            <Button 
              size="sm" 
              className="bg-purple-100 hover:bg-purple-200 text-purple-800"
              onClick={() => handleStartWorkout('Gentle Strength Training')}
            >
              Start
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Button 
        variant="outline" 
        className="mt-2 w-full border-purple-200 text-purple-800"
        onClick={() => showActionToast("More workouts coming soon!")}
      >
        View All Elder Fitness Workouts
        <ArrowRight size={16} className="ml-2" />
      </Button>
    </div>
  );
};

export default ElderFitness;
