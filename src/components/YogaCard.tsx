
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { showActionToast } from '@/utils/toast-utils';

interface YogaPose {
  id: number;
  name: string;
  duration: number; // in seconds
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
  instructions: string[];
  image?: string;
}

const yogaPoses: YogaPose[] = [
  {
    id: 1,
    name: "Downward-Facing Dog",
    duration: 60,
    description: "A classic yoga pose that stretches the whole body, particularly the hamstrings, shoulders, calves, and spine.",
    difficulty: "beginner",
    benefits: [
      "Strengthens arms, shoulders, and legs",
      "Stretches shoulders, hamstrings, calves, and hands",
      "Improves blood flow to the brain",
      "Helps relieve back pain and headaches"
    ],
    instructions: [
      "Start on your hands and knees with hands shoulder-width apart",
      "Tuck your toes and lift your hips high to form an inverted V shape",
      "Spread your fingers wide and press firmly through your palms and knuckles",
      "Relax your head between your arms and focus on lengthening your spine",
      "Bend your knees if necessary to keep your back straight"
    ]
  },
  {
    id: 2,
    name: "Warrior II",
    duration: 45,
    description: "A powerful standing pose that builds strength and stability in the legs and core.",
    difficulty: "beginner",
    benefits: [
      "Strengthens legs, ankles, and feet",
      "Opens hips and chest",
      "Builds core strength",
      "Improves focus and concentration"
    ],
    instructions: [
      "Stand with feet wide apart, right foot pointing to the right side",
      "Extend arms parallel to the floor, reaching actively through the fingertips",
      "Bend right knee to 90 degrees, keeping knee directly over ankle",
      "Gaze over right fingertips",
      "Keep shoulders relaxed and chest open"
    ]
  },
  {
    id: 3,
    name: "Tree Pose",
    duration: 30,
    description: "A balancing pose that improves focus, concentration, and stability.",
    difficulty: "beginner",
    benefits: [
      "Improves balance and stability",
      "Strengthens legs, ankles, and feet",
      "Opens hips",
      "Improves concentration and focus"
    ],
    instructions: [
      "Stand tall with feet together and arms at sides",
      "Shift weight to left foot and place right foot on inner left thigh or calf",
      "Never place foot on knee",
      "Bring palms together at heart center or extend arms overhead",
      "Fix gaze on a point in front of you to help with balance"
    ]
  },
  {
    id: 4,
    name: "Cobra Pose",
    duration: 30,
    description: "A gentle backbend that strengthens the spine and opens the chest.",
    difficulty: "beginner",
    benefits: [
      "Strengthens spine and back muscles",
      "Opens chest and shoulders",
      "Improves posture",
      "Helps relieve stress and fatigue"
    ],
    instructions: [
      "Lie face down with hands under shoulders, elbows close to body",
      "Press tops of feet, thighs, and pelvis into the floor",
      "On an inhale, lift chest off the floor",
      "Keep elbows slightly bent and shoulders away from ears",
      "Hold for a few breaths, then release back down"
    ]
  },
  {
    id: 5,
    name: "Child's Pose",
    duration: 60,
    description: "A restful pose that gently stretches the back and promotes relaxation.",
    difficulty: "beginner",
    benefits: [
      "Stretches back, hips, thighs, and ankles",
      "Calms the nervous system",
      "Relieves stress and anxiety",
      "Helps relieve back pain"
    ],
    instructions: [
      "Start on hands and knees",
      "Spread knees wide with big toes touching",
      "Sit back on heels and extend arms forward or alongside body",
      "Rest forehead on the floor",
      "Breathe deeply into the back of the ribs"
    ]
  }
];

interface YogaCardProps {
  className?: string;
}

const YogaCard: React.FC<YogaCardProps> = ({ className }) => {
  const [selectedPose, setSelectedPose] = useState<YogaPose>(yogaPoses[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(yogaPoses[0].duration);
  const [showPoseDetails, setShowPoseDetails] = useState(false);
  
  const handlePoseSelect = (pose: YogaPose) => {
    if (isPlaying) {
      setIsPlaying(false);
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
    showActionToast(`${selectedPose.name} reset`);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const progress = (timeRemaining / selectedPose.duration) * 100;
  
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Yoga Practice</h3>
          <p className="text-sm text-fitness-gray">
            Follow these yoga poses for improved flexibility and mindfulness
          </p>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
          {yogaPoses.map((pose) => (
            <div
              key={pose.id}
              className={`flex-shrink-0 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                selectedPose.id === pose.id 
                  ? 'bg-fitness-primary text-white' 
                  : 'bg-fitness-gray-light hover:bg-fitness-gray-light/80'
              }`}
              style={{ width: 'calc(33.333% - 8px)' }}
              onClick={() => handlePoseSelect(pose)}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs">{formatTime(pose.duration)}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  pose.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  pose.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {pose.difficulty.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-sm font-medium line-clamp-2 mt-1">{pose.name}</h3>
            </div>
          ))}
        </div>
        
        <div className="bg-fitness-gray-light p-4 rounded-xl mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">{selectedPose.name}</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setShowPoseDetails(true)}
            >
              <Info size={16} />
            </Button>
          </div>
          
          <p className="text-sm mb-3">{selectedPose.description}</p>
          
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>{formatTime(timeRemaining)}</span>
              <span>{formatTime(selectedPose.duration)}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="flex justify-center gap-4 mt-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={resetTimer}
            >
              <RotateCcw size={18} />
            </Button>
            
            <Button 
              className="w-10 h-10 rounded-full bg-fitness-primary hover:bg-fitness-primary/90"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-fitness-gray">
          <p className="mb-2">Benefits:</p>
          <ul className="list-disc pl-5 space-y-1">
            {selectedPose.benefits.slice(0, 2).map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      
      <Dialog open={showPoseDetails} onOpenChange={setShowPoseDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPose.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-2">
            <p>{selectedPose.description}</p>
            
            <div>
              <h4 className="font-medium mb-2">Benefits:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {selectedPose.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Instructions:</h4>
              <ol className="list-decimal pl-5 space-y-2">
                {selectedPose.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <div className={`px-2 py-1 rounded-full text-xs ${
                selectedPose.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                selectedPose.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {selectedPose.difficulty.charAt(0).toUpperCase() + selectedPose.difficulty.slice(1)} Level
              </div>
              
              <span className="text-sm text-fitness-gray">
                Duration: {formatTime(selectedPose.duration)}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default YogaCard;
