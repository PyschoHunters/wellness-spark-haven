
import React, { useState, useEffect } from 'react';
import { Heart, Clock, VolumeX, Volume2, SkipBack, SkipForward, Pause, Play } from 'lucide-react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { showActionToast } from '@/utils/toast-utils';

const meditationSessions = [
  {
    id: 1,
    title: "Morning Calm",
    duration: 300, // 5 minutes in seconds
    description: "Start your day with clarity and focus",
    level: "Beginner",
    category: "Morning"
  },
  {
    id: 2,
    title: "Stress Relief",
    duration: 600, // 10 minutes
    description: "Release tension and find your center",
    level: "Intermediate",
    category: "Stress Management"
  },
  {
    id: 3,
    title: "Deep Focus",
    duration: 900, // 15 minutes
    description: "Enhance concentration for work or study",
    level: "All Levels",
    category: "Productivity"
  },
  {
    id: 4,
    title: "Sleep Better",
    duration: 1200, // 20 minutes
    description: "Gentle meditation to prepare for restful sleep",
    level: "All Levels",
    category: "Evening"
  }
];

const MindfulnessPage = () => {
  const [selectedSession, setSelectedSession] = useState(meditationSessions[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
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
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      showActionToast(`Started: ${selectedSession.title}`);
    }
  };
  
  const handleSessionChange = (sessionId: number) => {
    const session = meditationSessions.find(s => s.id === sessionId);
    if (session) {
      setSelectedSession(session);
      setCurrentTime(0);
      setIsPlaying(false);
      showActionToast(`Selected: ${session.title}`);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (isMuted && value[0] > 0) {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const progress = (currentTime / selectedSession.duration) * 100;
  
  return (
    <div className="max-w-md mx-auto px-4 pb-20">
      <Header 
        title="Mindfulness" 
        action={
          <button 
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm"
            onClick={() => showActionToast("Mindfulness helps reduce stress and improve focus")}
          >
            <Heart size={20} className="text-red-500" />
          </button>
        }
      />
      
      <div className="mb-6 animate-fade-up">
        <h2 className="text-lg font-semibold mb-4">Meditation Sessions</h2>
        <div className="grid grid-cols-2 gap-4">
          {meditationSessions.map((session) => (
            <div 
              key={session.id}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                selectedSession.id === session.id 
                  ? 'bg-fitness-primary text-white shadow-lg scale-105' 
                  : 'bg-white shadow hover:shadow-md'
              }`}
              onClick={() => handleSessionChange(session.id)}
            >
              <h3 className={`font-medium ${selectedSession.id === session.id ? 'text-white' : 'text-fitness-dark'}`}>
                {session.title}
              </h3>
              <div className="flex items-center mt-2">
                <Clock size={14} className={selectedSession.id === session.id ? 'text-white/80' : 'text-fitness-gray'} />
                <span className={`text-xs ml-1 ${selectedSession.id === session.id ? 'text-white/80' : 'text-fitness-gray'}`}>
                  {formatTime(session.duration)}
                </span>
              </div>
              <div className={`text-xs mt-1 ${selectedSession.id === session.id ? 'text-white/90' : 'text-fitness-gray'}`}>
                {session.level}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-md mb-6 animate-fade-up">
        <h3 className="font-semibold text-lg mb-1">{selectedSession.title}</h3>
        <p className="text-fitness-gray mb-4">{selectedSession.description}</p>
        
        <div className="mx-auto w-52 h-52 rounded-full border-8 border-fitness-primary/20 flex items-center justify-center mb-6 relative">
          <div 
            className={`w-40 h-40 rounded-full bg-fitness-primary/10 flex items-center justify-center transition-all duration-2000 ease-in-out ${
              breatheIn ? 'scale-110' : 'scale-90'
            }`}
          >
            <div className="text-center">
              <div className="text-fitness-primary font-medium text-lg">
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
        
        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          
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
              <SkipBack size={24} />
            </Button>
            
            <Button 
              className="w-14 h-14 rounded-full bg-fitness-primary hover:bg-fitness-primary/90"
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} />}
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
              <SkipForward size={24} />
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleMute}>
              {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
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
      </div>
      
      <div className="rounded-2xl bg-white p-4 shadow-md animate-fade-up">
        <h3 className="font-semibold mb-2">Benefits of Mindfulness</h3>
        <ul className="space-y-2 pl-5 list-disc text-fitness-gray">
          <li>Reduces stress and anxiety</li>
          <li>Improves focus and concentration</li>
          <li>Enhances self-awareness</li>
          <li>Helps manage emotions</li>
          <li>Promotes better sleep quality</li>
        </ul>
      </div>
      
      <Navigation />
    </div>
  );
};

export default MindfulnessPage;
