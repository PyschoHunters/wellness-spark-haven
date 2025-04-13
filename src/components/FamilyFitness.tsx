
import React from 'react';
import { Users, Calendar, MapPin, Clock, ArrowRight, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { showActionToast } from '@/utils/toast-utils';

const FamilyFitness = () => {
  const handleStartActivity = (activityName: string) => {
    showActionToast(`Starting ${activityName} activity`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-center w-16 h-16 mb-4 bg-white rounded-full shadow-sm mx-auto">
          <Users className="text-teal-600" size={28} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Family Fitness</h1>
        <p className="text-gray-600 text-center mb-6">
          Activities designed for the whole family to enjoy together and stay active
        </p>
        
        <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
          <h3 className="font-medium mb-2">Next Family Challenge</h3>
          <div className="flex items-center">
            <Calendar className="text-teal-500 mr-2" size={18} />
            <span className="text-sm">Weekend Family Hike</span>
          </div>
          <div className="flex items-center mt-2">
            <MapPin className="text-teal-500 mr-2" size={18} />
            <span className="text-sm">Local Nature Park</span>
          </div>
          <Button 
            className="w-full mt-3 bg-teal-100 hover:bg-teal-200 text-teal-800"
            size="sm"
            onClick={() => showActionToast("Family challenge added to calendar!")}
          >
            Join Challenge
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-xl shadow-sm text-center">
            <h3 className="font-medium text-sm mb-1">Family Streak</h3>
            <p className="text-2xl font-bold text-blue-600">7</p>
            <p className="text-xs text-gray-500">days active</p>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm text-center">
            <h3 className="font-medium text-sm mb-1">Activities</h3>
            <p className="text-2xl font-bold text-green-600">12</p>
            <p className="text-xs text-gray-500">completed</p>
          </div>
        </div>
      </div>
      
      <h2 className="text-lg font-semibold px-1">Family Activities</h2>
      <div className="space-y-4">
        <Card className="overflow-hidden">
          <CardHeader className="p-4 pb-2 border-b">
            <CardTitle className="text-base">Family Circuit Challenge</CardTitle>
            <CardDescription>30 mins • All Ages</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 mb-3">
              Create a fun circuit of exercises that everyone can participate in at their own level.
            </p>
            <div className="flex items-center text-xs text-gray-500 mb-3">
              <Clock size={14} className="mr-1" />
              <span>Best done in a backyard or park</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-blue-50 rounded-md p-2 text-center">
                <p className="text-xs font-medium">Jumping Jacks</p>
              </div>
              <div className="bg-green-50 rounded-md p-2 text-center">
                <p className="text-xs font-medium">Bear Crawl</p>
              </div>
              <div className="bg-yellow-50 rounded-md p-2 text-center">
                <p className="text-xs font-medium">Ball Toss</p>
              </div>
              <div className="bg-purple-50 rounded-md p-2 text-center">
                <p className="text-xs font-medium">Relay Race</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-center">
            <Button 
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={() => handleStartActivity('Family Circuit Challenge')}
            >
              <PlayCircle size={16} className="mr-1" /> Start Activity
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="p-4 pb-2 border-b">
            <CardTitle className="text-base">Family Dance Off</CardTitle>
            <CardDescription>20 mins • All Ages</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 mb-3">
              Get the whole family moving with fun dance routines that everyone can learn.
            </p>
            <div className="flex items-center text-xs text-gray-500 mb-3">
              <Clock size={14} className="mr-1" />
              <span>Great indoor activity for rainy days</span>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-800">
                💡 Dance together to your favorite music. Take turns letting each family member pick a song and lead a dance move!
              </p>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-center">
            <Button 
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={() => handleStartActivity('Family Dance Off')}
            >
              <PlayCircle size={16} className="mr-1" /> Start Activity
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="p-4 pb-2 border-b">
            <CardTitle className="text-base">Family Yoga Session</CardTitle>
            <CardDescription>25 mins • All Ages</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 mb-3">
              A relaxing yet engaging yoga session with poses that are fun for both kids and adults.
            </p>
            <div className="flex items-center text-xs text-gray-500 mb-3">
              <Clock size={14} className="mr-1" />
              <span>Perfect for winding down in the evening</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-green-50 rounded-md p-2 text-center">
                <p className="text-xs font-medium">Tree Pose</p>
              </div>
              <div className="bg-green-50 rounded-md p-2 text-center">
                <p className="text-xs font-medium">Warrior</p>
              </div>
              <div className="bg-green-50 rounded-md p-2 text-center">
                <p className="text-xs font-medium">Downdog</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-center">
            <Button 
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={() => handleStartActivity('Family Yoga Session')}
            >
              <PlayCircle size={16} className="mr-1" /> Start Activity
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Button 
        variant="outline" 
        className="mt-2 w-full border-teal-200 text-teal-800"
        onClick={() => showActionToast("More family activities coming soon!")}
      >
        Explore All Family Activities
        <ArrowRight size={16} className="ml-2" />
      </Button>
    </div>
  );
};

export default FamilyFitness;
