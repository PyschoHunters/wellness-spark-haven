
import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX } from "lucide-react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface MeditationTrack {
  id: number;
  title: string;
  duration: string; // Format: "MM:SS"
  category: "sleep" | "stress" | "focus" | "calm";
  audioSrc: string;
  background: string;
  description: string;
}

const meditationTracks: MeditationTrack[] = [
  {
    id: 1,
    title: "Deep Sleep Journey",
    duration: "10:00",
    category: "sleep",
    audioSrc: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_2dde51b426.mp3?filename=deep-meditation-128283.mp3",
    background: "bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600",
    description: "Drift into a peaceful sleep with this gentle guided meditation designed to relax your body and quiet your mind."
  },
  {
    id: 2,
    title: "Stress Release",
    duration: "5:30",
    category: "stress",
    audioSrc: "https://cdn.pixabay.com/download/audio/2021/10/25/audio_b937258ee0.mp3?filename=relaxing-mountains-rivers-birds-136200.mp3",
    background: "bg-gradient-to-br from-green-800 via-green-600 to-emerald-500",
    description: "Let go of tension and anxiety with this short guided practice focused on deep breathing and body awareness."
  },
  {
    id: 3,
    title: "Focus Booster",
    duration: "7:45",
    category: "focus",
    audioSrc: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d16737d365.mp3?filename=mindfulness-relaxation-amp-meditation-music-124586.mp3",
    background: "bg-gradient-to-br from-amber-700 via-orange-600 to-amber-500",
    description: "Enhance your concentration and mental clarity with this meditation designed to center your thoughts."
  },
  {
    id: 4,
    title: "Calm Waters",
    duration: "8:20",
    category: "calm",
    audioSrc: "https://cdn.pixabay.com/download/audio/2022/03/17/audio_27940d3b68.mp3?filename=floating-abstract-142819.mp3",
    background: "bg-gradient-to-br from-cyan-800 via-cyan-600 to-blue-500",
    description: "Find tranquility and inner peace with this meditation inspired by the gentle movement of water."
  },
  {
    id: 5,
    title: "Morning Energy",
    duration: "6:15",
    category: "focus",
    audioSrc: "https://cdn.pixabay.com/download/audio/2022/02/07/audio_d16ec1410b.mp3?filename=morning-garden-acoustic-chill-131994.mp3",
    background: "bg-gradient-to-br from-rose-600 via-orange-500 to-amber-400",
    description: "Start your day with intention and positive energy with this uplifting guided meditation."
  },
  {
    id: 6,
    title: "Night Rest",
    duration: "12:00",
    category: "sleep",
    audioSrc: "https://cdn.pixabay.com/download/audio/2022/03/09/audio_c8e21804bd.mp3?filename=relaxing-mountains-rivers-birds-133376.mp3",
    background: "bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-700",
    description: "Prepare your body and mind for restful sleep with this extended nighttime meditation."
  }
];

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const parseTimeToSeconds = (timeString: string): number => {
  const [minutes, seconds] = timeString.split(':').map(Number);
  return minutes * 60 + seconds;
};

const Meditation = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [currentTrack, setCurrentTrack] = useState<MeditationTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Filter tracks based on active tab
  const filteredTracks = activeTab === "all" 
    ? meditationTracks 
    : meditationTracks.filter(track => track.category === activeTab);

  const handleTrackSelect = (track: MeditationTrack) => {
    if (currentTrack?.id === track.id) {
      togglePlayPause();
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setCurrentTime(0);
      
      if (audioRef.current) {
        audioRef.current.src = track.audioSrc;
        audioRef.current.load();
        audioRef.current.play().catch(error => {
          console.error("Audio playback failed:", error);
          toast({
            title: "Playback Error",
            description: "There was an issue playing this track. Please try again.",
            variant: "destructive",
          });
          setIsPlaying(false);
        });
      }
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      } else {
        audioRef.current.play()
          .catch(error => {
            console.error("Audio playback failed:", error);
            toast({
              title: "Playback Error",
              description: "There was an issue playing this track. Please try again.",
              variant: "destructive",
            });
          });
        animationRef.current = requestAnimationFrame(updateProgress);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      animationRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const handleTimeChange = (newValue: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newValue[0];
      setCurrentTime(newValue[0]);
      if (!isPlaying) {
        setIsPlaying(true);
        audioRef.current.play()
          .catch(error => {
            console.error("Audio playback failed:", error);
            setIsPlaying(false);
          });
      }
    }
  };

  const handleVolumeChange = (newValue: number[]) => {
    const volumeValue = newValue[0];
    
    if (audioRef.current) {
      audioRef.current.volume = volumeValue;
      setVolume(volumeValue);
      
      if (volumeValue === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      audioRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  const handlePrevious = () => {
    if (!currentTrack) return;
    
    const currentIndex = meditationTracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + meditationTracks.length) % meditationTracks.length;
    handleTrackSelect(meditationTracks[prevIndex]);
  };

  const handleNext = () => {
    if (!currentTrack) return;
    
    const currentIndex = meditationTracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % meditationTracks.length;
    handleTrackSelect(meditationTracks[nextIndex]);
  };

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleLoadedMetadata = () => {
      if (audio) {
        setDuration(audio.duration);
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
    
    if (audio) {
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      
      // Apply saved volume
      audio.volume = volume;
      audio.muted = isMuted;
    }
    
    return () => {
      if (audio) {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentTrack]);

  return (
    <div className="max-w-md mx-auto px-4 pb-20">
      <Header 
        title="Meditation" 
        subtitle="Mindfulness & relaxation" 
      />
      
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
            <TabsTrigger value="stress">Stress</TabsTrigger>
            <TabsTrigger value="focus">Focus</TabsTrigger>
            <TabsTrigger value="calm">Calm</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 gap-4 mb-24">
        {filteredTracks.map((track) => (
          <div 
            key={track.id} 
            className={cn(
              "p-4 rounded-xl text-white shadow-md cursor-pointer transition-all duration-300",
              track.background,
              currentTrack?.id === track.id ? "scale-[1.02] ring-2 ring-white/30" : "hover:scale-[1.01]"
            )}
            onClick={() => handleTrackSelect(track)}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{track.title}</h3>
              <span className="text-sm opacity-90">{track.duration}</span>
            </div>
            <p className="text-sm opacity-80 mt-1 line-clamp-2">{track.description}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs uppercase tracking-wider opacity-70">{track.category}</span>
              <Button 
                size="sm" 
                variant="secondary"
                className="bg-white/20 hover:bg-white/30"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTrackSelect(track);
                }}
              >
                {currentTrack?.id === track.id && isPlaying ? (
                  <Pause size={16} />
                ) : (
                  <Play size={16} />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Audio element (hidden) */}
      <audio ref={audioRef} preload="metadata">
        <source src={currentTrack?.audioSrc} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      
      {/* Floating player at bottom */}
      {currentTrack && (
        <div className="fixed bottom-16 left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg p-4 border-t border-gray-200">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-medium truncate">{currentTrack.title}</h3>
                <p className="text-xs text-gray-500">{formatTime(currentTime)} / {currentTrack.duration}</p>
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX size={18} />
                  ) : volume > 0.5 ? (
                    <Volume2 size={18} />
                  ) : (
                    <Volume1 size={18} />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="mb-2">
              <Slider 
                defaultValue={[0]} 
                value={[currentTime]} 
                max={duration || parseTimeToSeconds(currentTrack.duration)}
                step={0.1}
                onValueChange={handleTimeChange}
                className="cursor-pointer"
              />
            </div>
            
            <div className="flex justify-center items-center gap-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 rounded-full"
                onClick={handlePrevious}
              >
                <SkipBack size={18} />
              </Button>
              
              <Button 
                className="h-14 w-14 rounded-full bg-fitness-primary hover:bg-fitness-primary/90"
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <Pause size={24} />
                ) : (
                  <Play size={24} className="ml-1" />
                )}
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 rounded-full"
                onClick={handleNext}
              >
                <SkipForward size={18} />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Navigation />
    </div>
  );
};

export default Meditation;
