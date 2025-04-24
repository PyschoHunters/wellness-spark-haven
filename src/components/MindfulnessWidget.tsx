
import React, { useState, useEffect, useRef } from 'react';
import { Heart, Play, Clock, VolumeX, Volume2, SkipBack, SkipForward, Pause } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showActionToast } from '@/utils/toast-utils';

const meditationSessions = [
  {
    id: 1,
    title: "Morning Calm",
    duration: 300, // 5 minutes in seconds
    description: "Start your day with clarity",
    level: "Beginner",
    audioUrl: "https://audio.jukehost.co.uk/oRST2nTnzYfXBEL4WFGZl4OdJbJZDCa0"
  },
  {
    id: 2,
    title: "Stress Relief",
    duration: 600, // 10 minutes
    description: "Release tension and find balance",
    level: "Intermediate",
    audioUrl: "https://audio.jukehost.co.uk/xdBITvgna6CHGjsMDl8x4CDdhTSjxOYl"
  },
  {
    id: 3,
    title: "Deep Focus",
    duration: 900, // 15 minutes
    description: "Enhance concentration",
    level: "All Levels",
    audioUrl: "https://audio.jukehost.co.uk/a6PFGOnKGpKL0UjECUTJYvhVlVdZwrUw"
  },
  {
    id: 4,
    title: "Sleep Preparation",
    duration: 1200, // 20 minutes
    description: "Calm your mind before sleep",
    level: "Beginner",
    audioUrl: "https://audio.jukehost.co.uk/8sQvpTJ8yrkSeEuUZcWRf2xe2n5sWORg"
  },
  {
    id: 5,
    title: "Body Scan",
    duration: 720, // 12 minutes
    description: "Connect with your body",
    level: "Intermediate",
    audioUrl: "https://audio.jukehost.co.uk/TXKLAKjdWqMBaFQdxneDYKIvnswLJNnC"
  }
];

const breathingPatterns = [
  { id: 1, name: "4-7-8 Breathing", inhale: 4, hold: 7, exhale: 8, description: "Calming breath for anxiety" },
  { id: 2, name: "Box Breathing", inhale: 4, hold: 4, exhale: 4, description: "For focus and stress relief" },
  { id: 3, name: "Deep Belly Breathing", inhale: 5, hold: 0, exhale: 5, description: "Natural relaxation" },
  { id: 4, name: "Energizing Breath", inhale: 2, hold: 0, exhale: 2, description: "Quick energy boost" }
];

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const MindfulnessWidget: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState(meditationSessions[0]);
  const [selectedPattern, setSelectedPattern] = useState(breathingPatterns[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [breatheIn, setBreatheIn] = useState(false);
  const [activeTab, setActiveTab] = useState('sessions');
  const breathAnimationRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Initialize audio element
    if (activeTab === 'sessions') {
      audioRef.current = new Audio(selectedSession.audioUrl);
      audioRef.current.volume = volume / 100;
      audioRef.current.addEventListener('loadeddata', () => {
        console.log("Audio loaded successfully:", selectedSession.audioUrl);
      });
      audioRef.current.addEventListener('error', (e) => {
        console.error("Error loading audio:", e);
      });
    }
    
    // Clear any existing timers when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (breathAnimationRef.current) clearInterval(breathAnimationRef.current);
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, [selectedSession, activeTab]);
  
  useEffect(() => {
    if (breathAnimationRef.current) clearInterval(breathAnimationRef.current);
    
    if (isPlaying && activeTab === 'breathing') {
      // Create a breathing animation timer based on the selected pattern
      const { inhale, hold, exhale } = selectedPattern;
      const totalCycleTime = (inhale + hold + exhale) * 1000;
      
      breathAnimationRef.current = setInterval(() => {
        const timeInCycle = Date.now() % totalCycleTime;
        
        if (timeInCycle < inhale * 1000) {
          setBreatheIn(true);
        } else if (timeInCycle < (inhale + hold) * 1000) {
          // Holding breath - no state change
        } else {
          setBreatheIn(false);
        }
      }, 100); // Check breathing state frequently for smooth transitions
    }
    
    return () => {
      if (breathAnimationRef.current) clearInterval(breathAnimationRef.current);
    };
  }, [isPlaying, selectedPattern, activeTab]);
  
  useEffect(() => {
    // Update volume when it changes
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);
  
  useEffect(() => {
    if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    
    if (isPlaying) {
      if (activeTab === 'sessions') {
        // For audio meditation sessions
        if (audioRef.current) {
          audioRef.current.play().catch(error => {
            console.error("Error playing audio:", error);
            showActionToast("Could not play audio. Please try again.");
            setIsPlaying(false);
          });
        }
        
        sessionTimerRef.current = setInterval(() => {
          if (audioRef.current) {
            const newTime = Math.floor(audioRef.current.currentTime);
            setCurrentTime(newTime);
            
            // Check if meditation is complete
            if (newTime >= selectedSession.duration) {
              handleSessionComplete();
            }
          }
        }, 1000);
      } else {
        // For breathing exercises, just increment the timer
        sessionTimerRef.current = setInterval(() => {
          setCurrentTime(prevTime => {
            if (prevTime >= 300) { // Cap at 5 minutes for breathing exercises
              handleSessionComplete();
              return 0;
            }
            return prevTime + 1;
          });
        }, 1000);
      }
    } else {
      // Pause audio if we're in a session
      if (activeTab === 'sessions' && audioRef.current) {
        audioRef.current.pause();
      }
    }
    
    return () => {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, [isPlaying, activeTab]);
  
  const handleSessionComplete = () => {
    setIsPlaying(false);
    if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    if (breathAnimationRef.current) clearInterval(breathAnimationRef.current);
    showActionToast("Meditation session completed");
    setCurrentTime(0);
  };
  
  const handleSessionClick = (session: typeof meditationSessions[0]) => {
    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
      setIsPlaying(false);
    }
    setSelectedSession(session);
    setCurrentTime(0);
  };
  
  const handlePatternSelect = (pattern: typeof breathingPatterns[0]) => {
    setSelectedPattern(pattern);
    if (isPlaying && breathAnimationRef.current) {
      clearInterval(breathAnimationRef.current);
      setBreatheIn(true); // Start with inhale
    }
  };
  
  const handleStartMeditation = () => {
    if (isPlaying) {
      setIsPlaying(false);
      showActionToast(`Paused ${activeTab === 'sessions' ? selectedSession.title : 'breathing'} exercise`);
    } else {
      setIsPlaying(true);
      showActionToast(`Starting ${activeTab === 'sessions' ? selectedSession.title : 'breathing'} exercise`);
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
    if (audioRef.current) {
      audioRef.current.volume = !isMuted ? 0 : volume / 100;
    }
  };
  
  const progress = activeTab === 'sessions' 
    ? (currentTime / selectedSession.duration) * 100
    : (currentTime / 300) * 100; // 5 minutes max for breathing
  
  return (
    <div className="animate-fade-up">
      <Card>
        <CardContent className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sessions">Meditation</TabsTrigger>
              <TabsTrigger value="breathing">Breathing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sessions" className="mt-2">
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
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span className="text-xs">{formatTime(session.duration)}</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-medium line-clamp-1">{session.title}</h3>
                    <p className="text-xs line-clamp-1 mt-1 opacity-80">{session.level}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="breathing" className="mt-2">
              <div className="space-y-2 mb-4">
                {breathingPatterns.map(pattern => (
                  <div
                    key={pattern.id}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedPattern.id === pattern.id 
                        ? 'bg-fitness-primary text-white' 
                        : 'bg-fitness-gray-light hover:bg-fitness-gray-light/80'
                    }`}
                    onClick={() => handlePatternSelect(pattern)}
                  >
                    <h3 className="text-sm font-medium">{pattern.name}</h3>
                    <p className="text-xs mt-1 opacity-80">{pattern.description}</p>
                    <div className="flex gap-2 mt-2 text-xs">
                      <span>Inhale: {pattern.inhale}s</span>
                      {pattern.hold > 0 && <span>Hold: {pattern.hold}s</span>}
                      <span>Exhale: {pattern.exhale}s</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          {activeTab === 'breathing' && (
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
          )}
          
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {activeTab === 'sessions' ? selectedSession.title : selectedPattern.name}
              </span>
              {activeTab === 'sessions' && (
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                  {selectedSession.level}
                </span>
              )}
            </div>
            
            <Progress value={progress} className="h-1.5" />
            
            <div className="flex justify-between text-sm text-fitness-gray">
              <span>{formatTime(currentTime)}</span>
              <span>
                {activeTab === 'sessions' ? formatTime(selectedSession.duration) : '5:00'}
              </span>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  if (activeTab === 'sessions') {
                    const currentIndex = meditationSessions.findIndex(s => s.id === selectedSession.id);
                    const prevIndex = currentIndex === 0 ? meditationSessions.length - 1 : currentIndex - 1;
                    handleSessionClick(meditationSessions[prevIndex]);
                  } else {
                    const currentIndex = breathingPatterns.findIndex(p => p.id === selectedPattern.id);
                    const prevIndex = currentIndex === 0 ? breathingPatterns.length - 1 : currentIndex - 1;
                    handlePatternSelect(breathingPatterns[prevIndex]);
                  }
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
                  if (activeTab === 'sessions') {
                    const currentIndex = meditationSessions.findIndex(s => s.id === selectedSession.id);
                    const nextIndex = (currentIndex + 1) % meditationSessions.length;
                    handleSessionClick(meditationSessions[nextIndex]);
                  } else {
                    const currentIndex = breathingPatterns.findIndex(p => p.id === selectedPattern.id);
                    const nextIndex = (currentIndex + 1) % breathingPatterns.length;
                    handlePatternSelect(breathingPatterns[nextIndex]);
                  }
                }}
              >
                <SkipForward size={20} />
              </Button>
            </div>
            
            {activeTab === 'sessions' && (
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
            )}
            
            <div className="text-sm text-fitness-gray mt-2">
              {activeTab === 'sessions' ? (
                <p>{selectedSession.description}</p>
              ) : (
                <p className="italic">Focus on your breath and follow the rhythm</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
