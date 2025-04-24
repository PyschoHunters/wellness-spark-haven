
import React, { useState, useRef, useEffect } from 'react';
import { Heart, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { showActionToast } from '@/utils/toast-utils';

interface MeditationSession {
  id: number;
  title: string;
  duration: number; // in seconds
  audioUrl: string;
}

const meditationSessions: MeditationSession[] = [
  {
    id: 1,
    title: "Morning Calm",
    duration: 180, // 3 minutes
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_cb2cf4f7e7.mp3"
  },
  {
    id: 2,
    title: "Stress Relief",
    duration: 240, // 4 minutes
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d16d7196d0.mp3"
  },
  {
    id: 3,
    title: "Deep Focus",
    duration: 300, // 5 minutes
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/09/audio_861b4fe3a5.mp3"
  }
];

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const MeditationWidget: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState<MeditationSession>(meditationSessions[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio(selectedSession.audioUrl);
    audioRef.current.volume = volume / 100;
    
    // Clean up on component unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [selectedSession]);

  useEffect(() => {
    // Update volume when it changes
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      showActionToast(`Paused ${selectedSession.title} meditation`);
    } else {
      // If we're at the end, reset to beginning
      if (currentTime >= selectedSession.duration) {
        setCurrentTime(0);
        audioRef.current.currentTime = 0;
      }
      
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
        showActionToast("Could not play audio. Please try again.");
      });
      
      progressIntervalRef.current = setInterval(() => {
        if (audioRef.current) {
          const newTime = Math.floor(audioRef.current.currentTime);
          setCurrentTime(newTime);
          
          // Check if meditation is complete
          if (newTime >= selectedSession.duration) {
            handleComplete();
          }
        }
      }, 1000);
      
      showActionToast(`Starting ${selectedSession.title} meditation`);
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleComplete = () => {
    setIsPlaying(false);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    showActionToast("Meditation session completed");
  };

  const handleSessionSelect = (session: MeditationSession) => {
    // Stop current session if playing
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setIsPlaying(false);
    }
    
    setCurrentTime(0);
    setSelectedSession(session);
    
    // Initialize new audio
    if (audioRef.current) {
      audioRef.current.src = session.audioUrl;
      audioRef.current.load();
    }
    
    showActionToast(`Selected ${session.title}`);
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

  const skipForward = () => {
    const currentIndex = meditationSessions.findIndex(s => s.id === selectedSession.id);
    const nextIndex = (currentIndex + 1) % meditationSessions.length;
    handleSessionSelect(meditationSessions[nextIndex]);
  };

  const skipBack = () => {
    const currentIndex = meditationSessions.findIndex(s => s.id === selectedSession.id);
    const prevIndex = currentIndex === 0 ? meditationSessions.length - 1 : currentIndex - 1;
    handleSessionSelect(meditationSessions[prevIndex]);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const progress = (currentTime / selectedSession.duration) * 100;

  return (
    <div className="animate-fade-up">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Heart size={18} className="text-red-500" />
          Voice-Guided Meditation
        </h2>
        <button 
          className="text-sm font-medium text-fitness-primary"
          onClick={toggleExpanded}
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-fitness-gray mb-3">
            Take a moment to breathe and find your center
          </p>
          
          {expanded && (
            <>
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
                    onClick={() => handleSessionSelect(session)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs">{formatTime(session.duration)}</span>
                    </div>
                    <h3 className="text-sm font-medium line-clamp-1">{session.title}</h3>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {selectedSession.title}
                  </span>
                </div>
                
                <Progress value={progress} className="h-1.5" />
                
                <div className="flex justify-between text-sm text-fitness-gray">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(selectedSession.duration)}</span>
                </div>
                
                <div className="flex items-center justify-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={skipBack}
                  >
                    <SkipBack size={20} />
                  </Button>
                  
                  <Button 
                    className="w-12 h-12 rounded-full bg-fitness-primary hover:bg-fitness-primary/90"
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={skipForward}
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
                onClick={handlePlayPause}
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

export default MeditationWidget;
