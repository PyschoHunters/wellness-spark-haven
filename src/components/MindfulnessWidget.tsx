
import React, { useState, useEffect, useRef } from 'react';
import { Heart, Play, Clock, VolumeX, Volume2, SkipBack, SkipForward, Pause, Moon, Sun, Sparkles, Wind, Music, Menu, X, Settings, Save, Bookmark, ChevronDown, ChevronRight, Waves, Flame, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { showActionToast } from '@/utils/toast-utils';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MeditationSession {
  id: number;
  title: string;
  duration: number; // in seconds
  description: string;
  level: string;
  category: 'focus' | 'calm' | 'sleep' | 'energy';
  technique?: string;
  backgroundSound?: string;
  affirmations?: string[];
  guided?: boolean;
  favorite?: boolean;
  completed?: number;
  image?: string;
}

interface SoundOption {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const meditationSessions: MeditationSession[] = [
  {
    id: 1,
    title: "Morning Calm",
    duration: 300, // 5 minutes in seconds
    description: "Start your day with clarity and purpose. This gentle meditation helps center your mind.",
    level: "Beginner",
    category: 'calm',
    technique: "Breath Awareness",
    backgroundSound: "Nature",
    guided: true,
    completed: 3,
    affirmations: [
      "I begin this day with calm and clarity",
      "Each breath fills me with peace",
      "I am fully present in this moment"
    ],
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 2,
    title: "Stress Relief",
    duration: 600, // 10 minutes
    description: "Release tension and find balance. This practice helps reduce stress and anxiety.",
    level: "Intermediate",
    category: 'calm',
    technique: "Body Scan",
    backgroundSound: "Rain",
    guided: true,
    completed: 1,
    affirmations: [
      "I release all tension from my body",
      "I am in control of my thoughts",
      "My mind becomes still and peaceful"
    ],
    image: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 3,
    title: "Deep Focus",
    duration: 900, // 15 minutes
    description: "Enhance concentration and mental clarity for productive work sessions.",
    level: "All Levels",
    category: 'focus',
    technique: "Single-Point Focus",
    backgroundSound: "White Noise",
    guided: false,
    favorite: true,
    completed: 5,
    affirmations: [
      "My mind is clear and focused",
      "I direct my attention effortlessly",
      "I accomplish tasks with full presence"
    ],
    image: "https://images.unsplash.com/photo-1489659639091-8b687bc4386e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 4,
    title: "Sleep Preparation",
    duration: 1200, // 20 minutes
    description: "Gentle relaxation to prepare your mind and body for restful sleep.",
    level: "Beginner",
    category: 'sleep',
    technique: "Progressive Relaxation",
    backgroundSound: "Ocean Waves",
    guided: true,
    favorite: false,
    completed: 2,
    affirmations: [
      "I let go of the day's concerns",
      "My body relaxes deeply with each breath",
      "I welcome peaceful, restful sleep"
    ],
    image: "https://images.unsplash.com/photo-1499988921418-b7df40ff03f9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 5,
    title: "Energy Boost",
    duration: 180, // 3 minutes
    description: "Quick rejuvenating practice to increase alertness and vitality.",
    level: "All Levels",
    category: 'energy',
    technique: "Energized Breathing",
    backgroundSound: "Upbeat",
    guided: false,
    favorite: true,
    completed: 8,
    affirmations: [
      "I am filled with vitality and energy",
      "Each breath awakens and revitalizes me",
      "I am alert, focused, and ready"
    ],
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 6,
    title: "Compassion Practice",
    duration: 900, // 15 minutes
    description: "Cultivate kindness and compassion toward yourself and others.",
    level: "Intermediate",
    category: 'calm',
    technique: "Loving-Kindness",
    backgroundSound: "Soft Piano",
    guided: true,
    favorite: false,
    completed: 0,
    affirmations: [
      "I extend kindness to myself and others",
      "My heart is open and compassionate",
      "I recognize the goodness in all beings"
    ],
    image: "https://images.unsplash.com/photo-1474418397713-2f2a6a6c7a53?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 7,
    title: "Mindful Walking",
    duration: 600, // 10 minutes
    description: "Practice mindfulness while walking to refresh your mind and body.",
    level: "All Levels",
    category: 'energy',
    technique: "Walking Meditation",
    backgroundSound: "Forest",
    guided: true,
    favorite: false,
    completed: 1,
    affirmations: [
      "With each step, I am fully present",
      "I move with awareness and intention",
      "My mind and body are in harmony"
    ],
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 8,
    title: "Deep Relaxation",
    duration: 1800, // 30 minutes
    description: "Extended practice for profound relaxation and stress reduction.",
    level: "Advanced",
    category: 'sleep',
    technique: "Yoga Nidra",
    backgroundSound: "Gentle Chimes",
    guided: true,
    favorite: false,
    completed: 0,
    affirmations: [
      "I surrender to complete relaxation",
      "Every part of my body rests deeply",
      "I am safe, supported, and at peace"
    ],
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

const backgroundSounds: SoundOption[] = [
  { id: 'nature', name: 'Forest Nature', icon: <Wind size={18} /> },
  { id: 'rain', name: 'Gentle Rain', icon: <Waves size={18} /> },
  { id: 'ocean', name: 'Ocean Waves', icon: <Wind size={18} /> },
  { id: 'fire', name: 'Crackling Fire', icon: <Flame size={18} /> },
  { id: 'birds', name: 'Birdsong', icon: <Music size={18} /> },
  { id: 'white-noise', name: 'White Noise', icon: <Wind size={18} /> },
  { id: 'piano', name: 'Soft Piano', icon: <Music size={18} /> },
  { id: 'silence', name: 'Silence', icon: <VolumeX size={18} /> },
];

const MindfulnessWidget: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'focus' | 'calm' | 'sleep' | 'energy'>('calm');
  const [selectedSession, setSelectedSession] = useState(meditationSessions[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [breatheIn, setBreatheIn] = useState(false);
  const [breathePhase, setBreathePhase] = useState<'in' | 'hold' | 'out' | 'rest'>('in');
  const [breatheCycle, setBreatheCycle] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [currentBackground, setCurrentBackground] = useState(backgroundSounds[0]);
  const [showAffirmations, setShowAffirmations] = useState(true);
  const [currentAffirmation, setCurrentAffirmation] = useState(0);
  const [favoriteList, setFavoriteList] = useState<number[]>([3, 5]);
  const [statsOpen, setStatsOpen] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  
  const breatheTimer = useRef<number | null>(null);
  const sessionTimer = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Filtered sessions based on selected category
  const filteredSessions = meditationSessions.filter(
    session => session.category === selectedCategory
  );
  
  // Sessions for the carousel (current category plus 2 from other categories)
  const carouselSessions = [
    ...filteredSessions.slice(0, 3),
    ...meditationSessions
      .filter(session => session.category !== selectedCategory)
      .slice(0, 2)
  ];
  
  // Favorite sessions
  const favoriteSessions = meditationSessions.filter(
    session => favoriteList.includes(session.id)
  );
  
  // Reset timers when component unmounts
  useEffect(() => {
    return () => {
      if (breatheTimer.current) clearInterval(breatheTimer.current);
      if (sessionTimer.current) clearInterval(sessionTimer.current);
    };
  }, []);
  
  // Control the breathing animation
  useEffect(() => {
    if (isPlaying) {
      breatheTimer.current = window.setInterval(() => {
        setBreathePhase(prev => {
          switch(prev) {
            case 'in': return 'hold';
            case 'hold': return 'out';
            case 'out': return 'rest';
            case 'rest': 
              setBreatheCycle(cycle => cycle + 1);
              return 'in';
            default: return 'in';
          }
        });
      }, 2000); // 2 seconds per phase in the breathing cycle
    } else if (breatheTimer.current) {
      clearInterval(breatheTimer.current);
    }
    
    return () => {
      if (breatheTimer.current) clearInterval(breatheTimer.current);
    };
  }, [isPlaying]);
  
  // Handle session timer
  useEffect(() => {
    let timer: number | undefined;
    
    if (isPlaying && currentTime < selectedSession.duration) {
      timer = window.setInterval(() => {
        setCurrentTime(prevTime => {
          const newTime = prevTime + 1;
          
          // Change affirmation every 20 seconds if available
          if (showAffirmations && selectedSession.affirmations && newTime % 20 === 0) {
            setCurrentAffirmation(prev => 
              (prev + 1) % selectedSession.affirmations!.length
            );
          }
          
          return newTime;
        });
      }, 1000);
      sessionTimer.current = timer;
    } else if (currentTime >= selectedSession.duration) {
      setIsPlaying(false);
      setCurrentTime(0);
      showActionToast("Meditation session completed");
      // Update completion count - in a real app, this would persist
      const updatedSessions = meditationSessions.map(session => 
        session.id === selectedSession.id 
          ? {...session, completed: (session.completed || 0) + 1}
          : session
      );
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentTime, selectedSession.duration, selectedSession.id, showAffirmations, selectedSession.affirmations]);
  
  const handleSessionClick = (session: MeditationSession) => {
    setSelectedSession(session);
    setCurrentTime(0);
    setIsPlaying(false);
    setBreatheCycle(0);
    setCurrentAffirmation(0);
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
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };
  
  const handleBackgroundSoundChange = (sound: SoundOption) => {
    setCurrentBackground(sound);
    // In a real app, this would change the actual audio source
  };
  
  const handleFavoriteToggle = () => {
    const isFavorite = favoriteList.includes(selectedSession.id);
    
    if (isFavorite) {
      setFavoriteList(prev => prev.filter(id => id !== selectedSession.id));
      showActionToast(`Removed ${selectedSession.title} from favorites`);
    } else {
      setFavoriteList(prev => [...prev, selectedSession.id]);
      showActionToast(`Added ${selectedSession.title} to favorites`);
    }
  };
  
  const handleDownload = () => {
    showActionToast("Meditation downloaded for offline use");
    setDownloadDialogOpen(false);
  };
  
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'focus': return <Sparkles size={16} className="text-blue-500" />;
      case 'calm': return <Heart size={16} className="text-green-500" />;
      case 'sleep': return <Moon size={16} className="text-indigo-500" />;
      case 'energy': return <Sun size={16} className="text-orange-500" />;
      default: return <Heart size={16} className="text-blue-500" />;
    }
  };
  
  const getBreathingText = () => {
    switch(breathePhase) {
      case 'in': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'out': return 'Breathe Out';
      case 'rest': return 'Rest';
      default: return 'Breathe';
    }
  };
  
  const getBreathingScale = () => {
    switch(breathePhase) {
      case 'in': return 'scale-110';
      case 'hold': return 'scale-110';
      case 'out': return 'scale-90';
      case 'rest': return 'scale-90';
      default: return 'scale-100';
    }
  };
  
  return (
    <div className="animate-fade-up">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Heart size={18} className="text-red-500" />
          Mindfulness
        </h2>
        <div className="flex items-center gap-3">
          <button
            className="text-xs font-medium flex items-center gap-1 text-gray-500 hover:text-gray-700"
            onClick={() => setStatsOpen(true)}
          >
            <BarChart size={14} />
            <span>Stats</span>
          </button>
          <button 
            className="text-sm font-medium text-fitness-primary"
            onClick={toggleExpanded}
          >
            {expanded ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>
      
      <Card className="bg-white overflow-hidden">
        <CardContent className={`p-4 ${expanded ? 'pb-4' : 'pb-4'}`}>
          <p className="text-sm text-fitness-gray mb-3">
            Take a moment to breathe and find your center
          </p>
          
          {expanded && (
            <>
              <div className="mb-4">
                <Tabs defaultValue="calm" onValueChange={(value) => setSelectedCategory(value as any)} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-2">
                    <TabsTrigger value="focus" className="flex items-center gap-1">
                      <Sparkles size={14} />
                      <span className="hidden sm:inline">Focus</span>
                    </TabsTrigger>
                    <TabsTrigger value="calm" className="flex items-center gap-1">
                      <Heart size={14} />
                      <span className="hidden sm:inline">Calm</span>
                    </TabsTrigger>
                    <TabsTrigger value="sleep" className="flex items-center gap-1">
                      <Moon size={14} />
                      <span className="hidden sm:inline">Sleep</span>
                    </TabsTrigger>
                    <TabsTrigger value="energy" className="flex items-center gap-1">
                      <Sun size={14} />
                      <span className="hidden sm:inline">Energy</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1 snap-x">
                {carouselSessions.map(session => (
                  <div
                    key={session.id}
                    className={`snap-start flex-shrink-0 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
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
                      {favoriteList.includes(session.id) && (
                        <Bookmark size={12} className="ml-auto" />
                      )}
                    </div>
                    <h3 className="text-sm font-medium line-clamp-1">{session.title}</h3>
                    <Badge 
                      variant="outline" 
                      className={`mt-1 text-[10px] py-0 h-4 ${
                        selectedSession.id === session.id 
                          ? 'border-white/30 text-white bg-white/10' 
                          : ''
                      }`}
                    >
                      {session.level}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-sm">{selectedSession.title}</h3>
                  <div className="flex gap-2">
                    <button
                      className="p-1 rounded-full hover:bg-gray-100"
                      onClick={handleFavoriteToggle}
                    >
                      <Bookmark 
                        size={16} 
                        className={favoriteList.includes(selectedSession.id) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"} 
                      />
                    </button>
                    <button
                      className="p-1 rounded-full hover:bg-gray-100"
                      onClick={() => setShowSettings(!showSettings)}
                    >
                      <Settings size={16} className="text-gray-500" />
                    </button>
                    <button
                      className="p-1 rounded-full hover:bg-gray-100"
                      onClick={() => setDownloadDialogOpen(true)}
                    >
                      <Download size={16} className="text-gray-500" />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{selectedSession.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getCategoryIcon(selectedSession.category)}
                    {selectedSession.category.charAt(0).toUpperCase() + selectedSession.category.slice(1)}
                  </Badge>
                  
                  {selectedSession.technique && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Sparkles size={14} />
                      {selectedSession.technique}
                    </Badge>
                  )}
                  
                  {selectedSession.guided && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Music size={14} />
                      Guided
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="mx-auto w-40 h-40 rounded-full border-4 border-fitness-primary/20 flex items-center justify-center mb-6 relative">
                <div 
                  className={`w-32 h-32 rounded-full bg-fitness-primary/10 flex items-center justify-center transition-all duration-2000 ease-in-out ${
                    getBreathingScale()
                  }`}
                >
                  <div className="text-center">
                    <div className="text-fitness-primary font-medium">
                      {isPlaying ? getBreathingText() : 'Ready'}
                    </div>
                    <div className="text-sm text-fitness-gray">
                      {isPlaying ? `Cycle ${breatheCycle}` : formatTime(selectedSession.duration)}
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
              
              {showAffirmations && selectedSession.affirmations && isPlaying && (
                <div className="mb-6 bg-fitness-primary/5 p-3 rounded-lg text-center">
                  <p className="italic text-fitness-primary">
                    "{selectedSession.affirmations[currentAffirmation]}"
                  </p>
                </div>
              )}
              
              {showSettings && (
                <div className="mb-6 space-y-4 bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-medium text-sm mb-2">Settings</h3>
                  
                  <div>
                    <h4 className="text-xs text-gray-500 mb-1">Background Sound</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {backgroundSounds.slice(0, 4).map(sound => (
                        <button
                          key={sound.id}
                          className={`flex items-center gap-2 text-sm p-2 rounded-lg ${
                            currentBackground.id === sound.id 
                              ? 'bg-fitness-primary text-white' 
                              : 'bg-white border border-gray-200'
                          }`}
                          onClick={() => handleBackgroundSoundChange(sound)}
                        >
                          {sound.icon}
                          <span>{sound.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Show Affirmations</span>
                    <Switch 
                      checked={showAffirmations} 
                      onCheckedChange={setShowAffirmations}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
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
              
              {favoriteSessions.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <Bookmark size={14} className="text-yellow-500" />
                    Favorites
                  </h3>
                  
                  <div className="space-y-2">
                    {favoriteSessions.map(session => (
                      <div 
                        key={session.id}
                        className="flex items-center p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSessionClick(session)}
                      >
                        <div className="w-10 h-10 bg-fitness-primary/10 rounded-lg flex items-center justify-center mr-3">
                          {getCategoryIcon(session.category)}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{session.title}</h4>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock size={12} className="mr-1" />
                            {formatTime(session.duration)}
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
      
      {/* Audio element for background sounds (hidden) */}
      <audio ref={audioRef} loop muted={isMuted} className="hidden">
        <source src="" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      
      {/* Stats Dialog */}
      <Dialog open={statsOpen} onOpenChange={setStatsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart size={18} />
              Mindfulness Stats
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {meditationSessions.reduce((sum, session) => sum + (session.completed || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Sessions Completed</div>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(meditationSessions.reduce((sum, session) => sum + (session.completed || 0) * session.duration, 0) / 60)}
                </div>
                <div className="text-sm text-gray-600">Total Minutes</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Most Practiced Categories</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-1">
                      <Heart size={14} className="text-red-500" />
                      Calm
                    </span>
                    <span>4 sessions</span>
                  </div>
                  <Progress value={40} className="h-1.5" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-1">
                      <Sparkles size={14} className="text-blue-500" />
                      Focus
                    </span>
                    <span>3 sessions</span>
                  </div>
                  <Progress value={30} className="h-1.5" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-1">
                      <Sun size={14} className="text-orange-500" />
                      Energy
                    </span>
                    <span>2 sessions</span>
                  </div>
                  <Progress value={20} className="h-1.5" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-1">
                      <Moon size={14} className="text-indigo-500" />
                      Sleep
                    </span>
                    <span>1 session</span>
                  </div>
                  <Progress value={10} className="h-1.5" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Recent Achievements</h3>
              <div className="space-y-2">
                <div className="flex items-center p-2 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 text-white">
                    <CheckSquare size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">5-Day Streak</h4>
                    <p className="text-xs text-gray-600">Completed a session for 5 consecutive days</p>
                  </div>
                </div>
                
                <div className="flex items-center p-2 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-white">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">60 Minutes Milestone</h4>
                    <p className="text-xs text-gray-600">Completed 60 minutes of meditation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Download Dialog */}
      <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download size={18} />
              Download Meditation
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Download this meditation for offline practice when you don't have internet access.
            </p>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-medium mb-1">{selectedSession.title}</h3>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Clock size={14} className="mr-1" />
                {formatTime(selectedSession.duration)}
                <Badge className="ml-2" variant="outline">{selectedSession.level}</Badge>
              </div>
              <p className="text-sm text-gray-600">{selectedSession.description}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Download with audio guidance</span>
                <Switch defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Include background sounds</span>
                <Switch defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">High quality (larger file)</span>
                <Switch defaultChecked={false} />
              </div>
            </div>
            
            <Button 
              className="w-full gap-2"
              onClick={handleDownload}
            >
              <Download size={16} />
              Download Meditation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MindfulnessWidget;
