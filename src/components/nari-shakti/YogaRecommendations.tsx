
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dumbbell, Info, Clock, RotateCcw, Play, Pause, ArrowRight } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { showActionToast } from '@/utils/toast-utils';

interface YogaPose {
  id: number;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  benefits: string[];
  forSymptoms: string[];
  instructions: string[];
  imageUrl: string;
}

const yogaPoses: YogaPose[] = [
  {
    id: 1,
    name: "Child's Pose",
    difficulty: "beginner",
    duration: 60,
    benefits: [
      "Relieves back pain and neck tension",
      "Gently stretches hips, thighs, and ankles",
      "Calms the mind and reduces stress",
      "Helps relieve menstrual discomfort"
    ],
    forSymptoms: ["Cramps", "Backache", "Stress"],
    instructions: [
      "Kneel on the floor with toes together and knees hip-width apart",
      "Exhale and lower your torso between your knees",
      "Extend arms alongside your body with palms facing up",
      "Rest your forehead on the floor and relax",
      "Hold for 1-3 minutes while breathing deeply"
    ],
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Reclining Bound Angle Pose",
    difficulty: "beginner",
    duration: 90,
    benefits: [
      "Opens the hips and groin",
      "Improves circulation to the pelvis",
      "Stimulates abdominal organs",
      "Helps relieve menstrual discomfort and PMS"
    ],
    forSymptoms: ["Cramps", "Bloating", "Fatigue"],
    instructions: [
      "Lie on your back with knees bent and feet on the floor",
      "Allow your knees to fall out to the sides",
      "Bring the soles of your feet together",
      "Place your arms alongside your body with palms up",
      "Close your eyes and relax for 5-10 minutes"
    ],
    imageUrl: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Cat-Cow Stretch",
    difficulty: "beginner",
    duration: 45,
    benefits: [
      "Improves posture and balance",
      "Strengthens and stretches the spine and neck",
      "Relieves back pain and menstrual cramps",
      "Reduces stress and calms the mind"
    ],
    forSymptoms: ["Cramps", "Backache", "Mood Swings"],
    instructions: [
      "Start on hands and knees in a tabletop position",
      "For Cow: Inhale and drop your belly towards the mat",
      "Lift your chin and chest, and gaze up toward the ceiling",
      "For Cat: Exhale and draw your belly to your spine",
      "Round your back toward the ceiling like a stretching cat",
      "Repeat 5-10 times, moving with your breath"
    ],
    imageUrl: "https://images.unsplash.com/photo-1588286840104-8957b019727f?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Seated Forward Bend",
    difficulty: "beginner",
    duration: 60,
    benefits: [
      "Stretches the spine, shoulders, and hamstrings",
      "Calms the mind and reduces anxiety",
      "Relieves headaches and fatigue",
      "Stimulates the liver, kidneys, and ovaries"
    ],
    forSymptoms: ["Fatigue", "Headache", "Mood Swings"],
    instructions: [
      "Sit on the floor with legs extended in front of you",
      "Inhale, lengthen your spine, and raise your arms",
      "Exhale and bend forward from the hips",
      "Reach for your feet or ankles, or rest hands on your legs",
      "Hold for 30 seconds to 3 minutes while breathing deeply"
    ],
    imageUrl: "https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Legs Up The Wall",
    difficulty: "beginner",
    duration: 120,
    benefits: [
      "Relieves tired or cramped legs and feet",
      "Gently stretches the back of the neck and spine",
      "Relieves mild backache and menstrual cramps",
      "Calms the mind and reduces anxiety"
    ],
    forSymptoms: ["Cramps", "Fatigue", "Backache", "Insomnia"],
    instructions: [
      "Sit with one side of your body against a wall",
      "Swing your legs up the wall as you lower your back to the floor",
      "Move your buttocks as close to the wall as comfortable",
      "Relax your arms at your sides with palms up",
      "Close your eyes and hold for 5-15 minutes"
    ],
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=500&auto=format&fit=crop"
  }
];

const YogaRecommendations = () => {
  const [selectedPose, setSelectedPose] = useState<YogaPose>(yogaPoses[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(yogaPoses[0].duration);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [filteredPoses, setFilteredPoses] = useState<YogaPose[]>(yogaPoses);
  
  useEffect(() => {
    if (filter === 'all') {
      setFilteredPoses(yogaPoses);
    } else {
      setFilteredPoses(yogaPoses.filter(pose => 
        pose.forSymptoms.includes(filter)
      ));
    }
  }, [filter]);
  
  const handlePoseSelect = (pose: YogaPose) => {
    if (isPlaying) {
      setIsPlaying(false);
      clearInterval((window as any).yogaTimer);
    }
    
    setSelectedPose(pose);
    setTimeRemaining(pose.duration);
  };
  
  const togglePlay = () => {
    if (!isPlaying) {
      // If timer has finished, reset it
      if (timeRemaining === 0) {
        setTimeRemaining(selectedPose.duration);
      }
      
      // Start the timer
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsPlaying(false);
            showActionToast(`${selectedPose.name} completed!`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Store the timer ID
      (window as any).yogaTimer = timer;
      
    } else {
      // Clear the timer
      clearInterval((window as any).yogaTimer);
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const resetTimer = () => {
    if (isPlaying) {
      clearInterval((window as any).yogaTimer);
      setIsPlaying(false);
    }
    
    setTimeRemaining(selectedPose.duration);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const progress = (timeRemaining / selectedPose.duration) * 100;
  
  return (
    <>
      <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-emerald-100 to-emerald-200 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-emerald-800">
              <Dumbbell className="h-5 w-5" />
              Yoga Remedies
            </CardTitle>
            
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`px-2 py-1 text-xs ${filter === 'all' ? 'bg-white/70 text-emerald-700' : 'text-emerald-600'}`}
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`px-2 py-1 text-xs ${filter === 'Cramps' ? 'bg-white/70 text-emerald-700' : 'text-emerald-600'}`}
                onClick={() => setFilter('Cramps')}
              >
                Cramps
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`px-2 py-1 text-xs ${filter === 'Fatigue' ? 'bg-white/70 text-emerald-700' : 'text-emerald-600'}`}
                onClick={() => setFilter('Fatigue')}
              >
                Fatigue
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 mb-4">
            {filteredPoses.map((pose) => (
              <div
                key={pose.id}
                className={`flex-shrink-0 rounded-xl cursor-pointer transition-all duration-300 ${
                  selectedPose.id === pose.id 
                    ? 'bg-emerald-500 text-white scale-105 shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                style={{ width: '120px' }}
                onClick={() => handlePoseSelect(pose)}
              >
                <div className="h-20 overflow-hidden rounded-t-xl">
                  <img 
                    src={pose.imageUrl} 
                    alt={pose.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs">{formatTime(pose.duration)}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] h-4 px-1 ${
                        selectedPose.id === pose.id 
                          ? 'bg-white/20 text-white border-white/30' 
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {pose.difficulty}
                    </Badge>
                  </div>
                  <h3 className="text-xs font-medium line-clamp-2 leading-tight">{pose.name}</h3>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl mb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-800">{selectedPose.name}</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedPose.forSymptoms.map((symptom, i) => (
                    <Badge key={i} variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setDetailsOpen(true)}
              >
                <Info size={16} />
              </Button>
            </div>
            
            <div className="flex items-center mt-4 mb-3">
              <div className="w-14 text-center">
                <span className="text-sm font-medium">{formatTime(timeRemaining)}</span>
              </div>
              <div className="flex-1 mx-2">
                <Progress 
                  value={progress} 
                  className="h-2" 
                  indicatorClassName="bg-gradient-to-r from-emerald-400 to-emerald-500" 
                />
              </div>
              <div className="w-14 text-center">
                <span className="text-sm text-gray-500">{formatTime(selectedPose.duration)}</span>
              </div>
            </div>
            
            <div className="flex justify-center gap-4 mt-4">
              <Button 
                variant="outline" 
                size="icon"
                onClick={resetTimer}
                className="h-10 w-10 rounded-full"
              >
                <RotateCcw size={18} />
              </Button>
              
              <Button 
                className="h-12 w-12 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-1" />}
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <h4 className="font-medium mb-2">Key Benefits:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {selectedPose.benefits.slice(0, 2).map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
              {selectedPose.benefits.length > 2 && (
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-emerald-500 p-0 h-auto font-normal"
                  onClick={() => setDetailsOpen(true)}
                >
                  See more <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedPose.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-2">
            <div className="aspect-video rounded-lg overflow-hidden">
              <img 
                src={selectedPose.imageUrl} 
                alt={selectedPose.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Benefits</h3>
              <ul className="list-disc pl-5 space-y-1">
                {selectedPose.benefits.map((benefit, index) => (
                  <li key={index} className="text-sm">{benefit}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Instructions</h3>
              <ol className="list-decimal pl-5 space-y-2">
                {selectedPose.instructions.map((instruction, index) => (
                  <li key={index} className="text-sm">{instruction}</li>
                ))}
              </ol>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <Badge className={cn(
                "px-2 py-1",
                selectedPose.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                selectedPose.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              )}>
                {selectedPose.difficulty.charAt(0).toUpperCase() + selectedPose.difficulty.slice(1)} Level
              </Badge>
              
              <span className="text-sm text-gray-500">
                Duration: {formatTime(selectedPose.duration)}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default YogaRecommendations;
