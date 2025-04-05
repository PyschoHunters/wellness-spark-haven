
import React, { useState, useEffect } from 'react';
import { Heart, Play, Clock, VolumeX, Volume2, SkipBack, SkipForward, Pause } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { showActionToast } from '@/utils/toast-utils';

const meditationSessions = [
  {
    id: 1,
    title: "Morning Calm",
    duration: 300, // 5 minutes in seconds
    description: "Start your day with clarity",
    level: "Beginner",
  },
  {
    id: 2,
    title: "Stress Relief",
    duration: 600, // 10 minutes
    description: "Release tension and find balance",
    level: "Intermediate",
  },
  {
    id: 3,
    title: "Deep Focus",
    duration: 900, // 15 minutes
    description: "Enhance concentration",
    level: "All Levels",
  }
];

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const MindfulnessWidget: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState(meditationSessions[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [breatheIn, setBreatheIn] = useState(false);
  
  useEffect(() => {
    let timer: number | undefined;
    
    if (isPlaying && currentTime < selectedSession.duration) {
      timer = window.setInterval(() => {
        setCurrentTime(prevTime => {
          const newTime = prevTime + 1;
          // Toggle breathe state every 4 seconds
          if (newTime % 4 === 0) {
            setBreatheIn(prev => !prev);
          }
          return newTime;
        });
      }, 1000);
    } else if (currentTime >= selectedSession.duration) {
      setIsPlaying(false);
      setCurrentTime(0);
      showActionToast("Meditation session completed");
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentTime, selectedSession.duration]);
  
  const handleSessionClick = (session: typeof meditationSessions[0]) => {
    setSelectedSession(session);
    setCurrentTime(0);
    setIsPlaying(false);
  };
  
  const handleStartMeditation = () => {
    if (isPlaying) {
      setIsPlaying(false);
      showActionToast(`Paused ${selectedSession.title} meditation`);
    } else {
      setIsPlaying(true);
      setExpanded(true);
      showActionToast(`Starting ${selectedSession.title} meditation`);
    }
  };
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const progress = (currentTime / selectedSession.duration) * 100;
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (isMuted && value[0] > 0) {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  return (
    <div className="animate-fade-up">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Heart size={18} className="text-red-500" />
          Mindfulness
        </h2>
        <button 
          className="text-sm font-medium text-fitness-primary"
          onClick={toggleExpanded}
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>
      
      <Card className="bg-white overflow-hidden">
        <CardContent className="p-4">
          <p className="text-sm text-fitness-gray mb-3">
            Take a moment to breathe and find your center
          </p>
          
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
            {meditationSessions.map(session => (
              <div
                key={session.id}
                className={`flex-shrink-0 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                  selectedSession.id === session.id 
                    ? 'bg-fitness-primary text-white' 
                    : 'bg-fitness-gray-light hover:bg-fitness-gray-light/80'
                }`}
                style={{ width: 'calc(33.333% - 8px)' }}
                onClick={() => handleSessionClick(session)}
              >
                <div className="flex items-center gap-1 mb-1">
                  <Clock size={12} />
                  <span className="text-xs">{formatTime(session.duration)}</span>
                </div>
                <h3 className="text-sm font-medium line-clamp-1">{session.title}</h3>
              </div>
            ))}
          </div>
          
          {expanded && (
            <>
              <div className="mx-auto w-40 h-40 rounded-full border-4 border-fitness-primary/20 flex items-center justify-center mb-4 relative">
                <div 
                  className={`w-32 h-32 rounded-full bg-fitness-primary/10 flex items-center justify-center transition-all duration-2000 ease-in-out ${
                    breatheIn ? 'scale-110' : 'scale-90'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-fitness-primary font-medium">
                      {breatheIn ? 'Breathe In' : 'Breathe Out'}
                    </div>
                    <div className="text-sm text-fitness-gray">
                      {isPlaying ? formatTime(currentTime) : '0:00'}
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 left-0 w-full h-full">
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke="#f0f0f0"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke="#4F46E5"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 46}`}
                      strokeDashoffset={`${(2 * Math.PI * 46) * (1 - progress / 100)}`}
                      transform="rotate(-90 50 50)"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-4 mt-4">
                <Progress value={progress} className="h-1.5" />
                
                <div className="flex justify-between text-sm text-fitness-gray">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(selectedSession.duration)}</span>
                </div>
                
                <div className="flex items-center justify-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setCurrentTime(0);
                      showActionToast("Restarted meditation");
                    }}
                  >
                    <SkipBack size={20} />
                  </Button>
                  
                  <Button 
                    className="w-12 h-12 rounded-full bg-fitness-primary hover:bg-fitness-primary/90"
                    onClick={handleStartMeditation}
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setCurrentTime(selectedSession.duration);
                      setIsPlaying(false);
                      showActionToast("Skipped to end");
                    }}
                  >
                    <SkipForward size={20} />
                  </Button>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={toggleMute}>
                    {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </Button>
                  
                  <Slider 
                    value={[isMuted ? 0 : volume]} 
                    max={100} 
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="flex-1"
                  />
                </div>
              </div>
            </>
          )}
          
          {!expanded && (
            <>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="font-medium">{selectedSession.title}</span>
                <span className="text-fitness-gray">{formatTime(selectedSession.duration)}</span>
              </div>
              
              <Progress value={progress} className="h-1.5 mb-4" />
              
              <Button 
                className="w-full gap-2"
                onClick={handleStartMeditation}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {isPlaying ? "Pause Meditation" : "Start Meditation"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MindfulnessWidget;
