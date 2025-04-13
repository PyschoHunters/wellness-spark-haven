
import React from 'react';
import { Baby, Star, Trophy, PlayCircle, ArrowRight, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { showActionToast } from '@/utils/toast-utils';

const KidsFitness = () => {
  const handleStartActivity = (activityName: string) => {
    showActionToast(`Starting ${activityName} activity`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-center w-16 h-16 mb-4 bg-white rounded-full shadow-sm mx-auto">
          <Baby className="text-orange-500" size={28} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Kids Fitness</h1>
        <p className="text-gray-600 text-center mb-6">
          Fun activities to keep children active and healthy while developing important skills
        </p>
        
        <div className="flex bg-white p-3 rounded-xl shadow-sm mb-4">
          <div className="flex items-center justify-center bg-yellow-100 w-12 h-12 rounded-full">
            <Trophy className="text-yellow-600" size={24} />
          </div>
          <div className="ml-4">
            <h3 className="font-medium">Activity Streak</h3>
            <div className="flex items-center">
              <div className="flex space-x-1 mt-1">
                {[1, 2, 3].map((day) => (
                  <div key={day} className="w-8 h-1.5 rounded-full bg-orange-400"></div>
                ))}
                {[4, 5, 6, 7].map((day) => (
                  <div key={day} className="w-8 h-1.5 rounded-full bg-gray-200"></div>
                ))}
              </div>
              <span className="ml-2 text-xs text-gray-500">3/7 days</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="font-medium mb-2">This Week's Challenge</h3>
          <p className="text-sm text-gray-600 mb-3">Complete 5 different activities this week!</p>
          <div className="flex justify-between">
            <span className="text-xs text-gray-500">Progress: 2/5 activities</span>
            <div className="flex">
              {[1, 2].map((star) => (
                <Star key={star} className="text-yellow-400 fill-yellow-400" size={16} />
              ))}
              {[3, 4, 5].map((star) => (
                <Star key={star} className="text-gray-200" size={16} />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <h2 className="text-lg font-semibold px-1">Fun Activities</h2>
      <div className="space-y-4">
        <Card className="overflow-hidden border-2 border-orange-100">
          <CardHeader className="p-4 pb-2 bg-orange-50">
            <CardTitle className="text-base">Animal Movement Game</CardTitle>
            <CardDescription>15 mins • Ages 4-8</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-3">
            <p className="text-sm text-gray-600">
              Hop like a bunny, slither like a snake, and roar like a lion in this fun movement game!
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <Heart size={14} className="mr-1 text-red-400" />
              <span>Coordination</span>
            </div>
            <Button 
              size="sm" 
              className="bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-full"
              onClick={() => handleStartActivity('Animal Movement Game')}
            >
              <PlayCircle size={16} className="mr-1" /> Play
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="overflow-hidden border-2 border-green-100">
          <CardHeader className="p-4 pb-2 bg-green-50">
            <CardTitle className="text-base">Superhero Training</CardTitle>
            <CardDescription>20 mins • Ages 6-12</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-3">
            <p className="text-sm text-gray-600">
              Jump, run and exercise with superhero-themed activities to build strength and agility.
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <Heart size={14} className="mr-1 text-red-400" />
              <span>Strength building</span>
            </div>
            <Button 
              size="sm" 
              className="bg-green-100 hover:bg-green-200 text-green-800 rounded-full"
              onClick={() => handleStartActivity('Superhero Training')}
            >
              <PlayCircle size={16} className="mr-1" /> Play
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="overflow-hidden border-2 border-blue-100">
          <CardHeader className="p-4 pb-2 bg-blue-50">
            <CardTitle className="text-base">Dance Party</CardTitle>
            <CardDescription>15 mins • All Ages</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-3">
            <p className="text-sm text-gray-600">
              Get moving with kid-friendly dance routines that are fun for the whole family.
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <Heart size={14} className="mr-1 text-red-400" />
              <span>Cardio fun</span>
            </div>
            <Button 
              size="sm" 
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full"
              onClick={() => handleStartActivity('Dance Party')}
            >
              <PlayCircle size={16} className="mr-1" /> Play
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Button 
        variant="outline" 
        className="mt-2 w-full border-orange-200 text-orange-800"
        onClick={() => showActionToast("More kids activities coming soon!")}
      >
        Explore More Activities
        <ArrowRight size={16} className="ml-2" />
      </Button>
    </div>
  );
};

export default KidsFitness;
