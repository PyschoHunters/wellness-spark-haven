
import React, { useState, useEffect, useRef } from 'react';
import { Heart, Play, Clock, VolumeX, Volume2, SkipBack, SkipForward, Pause, Moon, Sun, Wind, Music, Droplets, Waves, Mountains, RotateCcw, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { showActionToast } from '@/utils/toast-utils';

interface Session {
  id: number;
  title: string;
  duration: number; // in seconds
  description: string;
  level: string;
  category: 'guided' | 'unguided' | 'breathing' | 'sleep';
  backgroundSound?: string;
}

interface MeditationStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
}

// Sound options for meditation background
const soundOptions = [
  { name: 'None', icon: VolumeX },
  { name: 'Rain', icon: Droplets },
  { name: 'Ocean', icon: Waves },
  { name: 'Forest', icon: Mountains },
  { name: 'White Noise', icon: Wind },
  { name: 'Ambient Music', icon: Music },
];

// Breathing patterns
const breathingPatterns = [
  { name: 'Basic', inSeconds: 4, holdSeconds: 0, outSeconds: 4, pauseSeconds: 0 },
  { name: '4-7-8', inSeconds: 4, holdSeconds: 7, outSeconds: 8, pauseSeconds: 0 },
  { name: 'Box Breathing', inSeconds: 4, holdSeconds: 4, outSeconds: 4, pauseSeconds: 4 },
  { name: 'Energizing', inSeconds: 2, holdSeconds: 0, outSeconds: 2, pauseSeconds: 0 },
  { name: 'Relaxing', inSeconds: 5, holdSeconds: 2, outSeconds: 6, pauseSeconds: 0 },
];

const meditationSessions: Session[] = [
  {
    id: 1,
    title: "Morning Calm",
    duration: 300, // 5 minutes
    description: "Start your day with clarity and positivity",
    level: "Beginner",
    category: 'guided',
  },
  {
    id: 2,
    title: "Stress Relief",
    duration: 600, // 10 minutes
    description: "Release tension and find balance",
    level: "Intermediate",
    category: 'guided',
  },
  {
    id: 3,
    title: "Deep Focus",
    duration: 900, // 15 minutes
    description: "Enhance concentration and productivity",
    level: "All Levels",
    category: 'guided',
  },
  {
    id: 4,
    title: "Sleep Better",
    duration: 1200, // 20 minutes
    description: "Calm your mind for restful sleep",
    level: "All Levels",
    category: 'sleep',
  },
  {
    id: 5,
    title: "Anxiety Relief",
    duration: 300, // 5 minutes
    description: "Quick relief from anxious thoughts",
    level: "Beginner",
    category: 'breathing',
  },
  {
    id: 6,
    title: "Self-Compassion",
    duration: 900, // 15 minutes
    description: "Cultivate kindness toward yourself",
    level: "Intermediate",
    category: 'guided',
  },
  {
    id: 7,
    title: "Silent Meditation",
    duration: 1200, // 20 minutes
    description: "Quiet meditation with timer",
    level: "Advanced",
    category: 'unguided',
  },
  {
    id: 8,
    title: "Body Scan",
    duration: 600, // 10 minutes
    description: "Connect with your physical sensations",
    level: "All Levels",
    category: 'guided',
  },
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
  const [breathePhase, setBreathePhase] = useState<'in' | 'hold' | 'out' | 'pause'>('in');
  const [selectedTab, setSelectedTab] = useState<string>('guided');
  const [selectedBackground, setSelectedBackground] = useState(soundOptions[0]);
  const [selectedBreathPattern, setSelectedBreathPattern] = useState(breathingPatterns[0]);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [meditationStats, setMeditationStats] = useState<MeditationStats>({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: null,
  });
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customDuration, setCustomDuration] = useState(300); // 5 minutes
  
  const breathingTimer = useRef<number | null>(null);
  
  // Load stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('meditationStats');
    if (savedStats) {
      setMeditationStats(JSON.parse(savedStats));
    }
  }, []);
  
  // Save stats to localStorage
  const saveStats = (updatedStats: MeditationStats) => {
    localStorage.setItem('meditationStats', JSON.stringify(updatedStats));
    setMeditationStats(updatedStats);
  };
  
  // Update stats when session completes
  const updateStats = () => {
    const today = new Date().toISOString().slice(0, 10);
    const minutesMeditated = Math.ceil(currentTime / 60);
    
    let { totalSessions, totalMinutes, currentStreak, longestStreak, lastCompletedDate } = meditationStats;
    
    totalSessions += 1;
    totalMinutes += minutesMeditated;
    
    // Update streak
    if (lastCompletedDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);
      
      if (lastCompletedDate === yesterdayStr || lastCompletedDate === today) {
        if (lastCompletedDate !== today) {
          currentStreak += 1;
        }
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }
    
    // Update longest streak if needed
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
    
    const updatedStats = {
      totalSessions,
      totalMinutes,
      currentStreak,
      longestStreak,
      lastCompletedDate: today,
    };
    
    saveStats(updatedStats);
    
    showActionToast(`Great job! You've completed ${totalSessions} meditation sessions.`);
  };
  
  // Breathing exercise timer
  useEffect(() => {
    if (isPlaying && selectedTab === 'breathing') {
      let breatheCycle = 0;
      const pattern = selectedBreathPattern;
      
      const runBreathingCycle = () => {
        if (breatheCycle < pattern.inSeconds) {
          setBreathePhase('in');
        } else if (breatheCycle < pattern.inSeconds + pattern.holdSeconds) {
          setBreathePhase('hold');
        } else if (breatheCycle < pattern.inSeconds + pattern.holdSeconds + pattern.outSeconds) {
          setBreathePhase('out');
        } else {
          setBreathePhase('pause');
        }
        
        breatheCycle += 1;
        
        if (breatheCycle >= pattern.inSeconds + pattern.holdSeconds + pattern.outSeconds + pattern.pauseSeconds) {
          breatheCycle = 0;
        }
      };
      
      runBreathingCycle();
      
      breathingTimer.current = window.setInterval(runBreathingCycle, 1000);
      
      return () => {
        if (breathingTimer.current) {
          clearInterval(breathingTimer.current);
        }
      };
    }
  }, [isPlaying, selectedTab, selectedBreathPattern]);
  
  // Main meditation timer
  useEffect(() => {
    let timer: number | undefined;
    
    if (isPlaying && currentTime < (isCustomMode ? customDuration : selectedSession.duration)) {
      timer = window.setInterval(() => {
        setCurrentTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (currentTime >= (isCustomMode ? customDuration : selectedSession.duration) && isPlaying) {
      setIsPlaying(false);
      setCurrentTime(0);
      updateStats();
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentTime, selectedSession.duration, isCustomMode, customDuration]);
  
  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
    setCurrentTime(0);
    setIsPlaying(false);
    setIsCustomMode(false);
  };
  
  const handleCustomDuration = (value: number[]) => {
    setCustomDuration(value[0] * 60); // Convert minutes to seconds
  };
  
  const handleStartMeditation = () => {
    if (isPlaying) {
      setIsPlaying(false);
      showActionToast(`Paused meditation`);
    } else {
      setIsPlaying(true);
      setExpanded(true);
      showActionToast(`Starting ${isCustomMode ? 'custom' : selectedSession.title} meditation`);
    }
  };
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    setCurrentTime(0);
    setIsPlaying(false);
    
    // Find the first session of the selected category
    const filteredSessions = meditationSessions.filter(s => s.category === value);
    if (filteredSessions.length > 0) {
      setSelectedSession(filteredSessions[0]);
    }
  };
  
  const progress = (currentTime / (isCustomMode ? customDuration : selectedSession.duration)) * 100;
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (isMuted && value[0] > 0) {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleResetSession = () => {
    setCurrentTime(0);
    if (isPlaying) {
      showActionToast("Restarted meditation");
    }
  };
  
  const handleSkipToEnd = () => {
    setCurrentTime(isCustomMode ? customDuration : selectedSession.duration);
    setIsPlaying(false);
    showActionToast("Skipped to end");
  };
  
  const renderSessionList = () => {
    const filteredSessions = meditationSessions.filter(
      session => session.category === selectedTab
    );
    
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {filteredSessions.map(session => (
          <div
            key={session.id}
            className={`flex-shrink-0 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
              selectedSession.id === session.id && !isCustomMode
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
        
        {/* Custom duration option */}
        <div
          className={`flex-shrink-0 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
            isCustomMode
              ? 'bg-fitness-primary text-white' 
              : 'bg-fitness-gray-light hover:bg-fitness-gray-light/80'
          }`}
          style={{ width: 'calc(33.333% - 8px)' }}
          onClick={() => setIsCustomMode(true)}
        >
          <div className="flex items-center gap-1 mb-1">
            <Clock size={12} />
            <span className="text-xs">Custom</span>
          </div>
          <h3 className="text-sm font-medium line-clamp-1">Your Time</h3>
        </div>
      </div>
    );
  };
  
  const renderBreathingExercise = () => {
    const { inSeconds, holdSeconds, outSeconds, pauseSeconds } = selectedBreathPattern;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center mb-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {breathingPatterns.map((pattern, idx) => (
              <Badge
                key={idx}
                variant={selectedBreathPattern.name === pattern.name ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedBreathPattern(pattern)}
              >
                {pattern.name}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mx-auto w-48 h-48 rounded-full border-4 border-fitness-primary/20 flex items-center justify-center relative">
          <div 
            className={`w-40 h-40 rounded-full bg-fitness-primary/10 flex items-center justify-center transition-all duration-1000 ease-in-out ${
              breathePhase === 'in' ? 'scale-110' : 
              breathePhase === 'out' ? 'scale-90' : 
              'scale-100'
            }`}
          >
            <div className="text-center">
              <div className="text-fitness-primary font-medium">
                {breathePhase === 'in' ? 'Breathe In' : 
                 breathePhase === 'hold' ? 'Hold' : 
                 breathePhase === 'out' ? 'Breathe Out' : 
                 'Pause'}
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
        
        <div className="text-center text-sm">
          <div className="grid grid-cols-4 gap-2 text-fitness-gray">
            <div>
              <div className="font-medium">In</div>
              <div>{inSeconds}s</div>
            </div>
            <div>
              <div className="font-medium">Hold</div>
              <div>{holdSeconds}s</div>
            </div>
            <div>
              <div className="font-medium">Out</div>
              <div>{outSeconds}s</div>
            </div>
            <div>
              <div className="font-medium">Pause</div>
              <div>{pauseSeconds}s</div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="animate-fade-up">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Heart size={18} className="text-red-500" />
          Mindfulness
        </h2>
        <div className="flex items-center gap-2">
          <button 
            className="text-sm font-medium text-fitness-primary flex items-center gap-1"
            onClick={() => setIsStatsOpen(true)}
          >
            <Calendar size={16} />
            Stats
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
        <CardContent className="p-4">
          <p className="text-sm text-fitness-gray mb-3">
            Take a moment to breathe and find your center
          </p>
          
          {expanded && (
            <Tabs value={selectedTab} onValueChange={handleTabChange} className="mb-4">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="guided">
                  <Sun size={16} className="mr-1" />
                  <span className="hidden sm:inline">Guided</span>
                </TabsTrigger>
                <TabsTrigger value="unguided">
                  <Moon size={16} className="mr-1" />
                  <span className="hidden sm:inline">Unguided</span>
                </TabsTrigger>
                <TabsTrigger value="breathing">
                  <Wind size={16} className="mr-1" />
                  <span className="hidden sm:inline">Breathing</span>
                </TabsTrigger>
                <TabsTrigger value="sleep">
                  <Moon size={16} className="mr-1" />
                  <span className="hidden sm:inline">Sleep</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="guided">
                {renderSessionList()}
              </TabsContent>
              
              <TabsContent value="unguided">
                {renderSessionList()}
              </TabsContent>
              
              <TabsContent value="breathing">
                {renderBreathingExercise()}
              </TabsContent>
              
              <TabsContent value="sleep">
                {renderSessionList()}
              </TabsContent>
            </Tabs>
          )}
          
          {!expanded && (
            <>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="font-medium">
                  {isCustomMode ? "Custom Meditation" : selectedSession.title}
                </span>
                <span className="text-fitness-gray">
                  {formatTime(isCustomMode ? customDuration : selectedSession.duration)}
                </span>
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
          
          {expanded && (
            <>
              {isCustomMode && (
                <div className="space-y-2 mb-4">
                  <h3 className="text-sm font-medium">Custom Duration</h3>
                  <div className="flex items-center gap-3">
                    <Slider 
                      value={[customDuration / 60]} 
                      min={1}
                      max={60}
                      step={1}
                      onValueChange={handleCustomDuration}
                    />
                    <span className="text-sm font-medium w-16 text-right">
                      {customDuration / 60} min
                    </span>
                  </div>
                </div>
              )}
              
              {selectedTab !== 'breathing' && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Background Sound</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {soundOptions.map((sound, idx) => (
                      <Badge
                        key={idx}
                        variant={selectedBackground.name === sound.name ? "default" : "outline"}
                        className="cursor-pointer flex items-center gap-1"
                        onClick={() => setSelectedBackground(sound)}
                      >
                        <sound.icon size={12} />
                        {sound.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {(selectedTab !== 'breathing' || isCustomMode) && (
                <div className="mx-auto w-40 h-40 rounded-full border-4 border-fitness-primary/20 flex items-center justify-center mb-4 relative">
                  <div className="w-32 h-32 rounded-full bg-fitness-primary/10 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-fitness-primary font-medium">
                        {isPlaying ? "Meditating" : "Ready"}
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
                <Progress value={progress} className="h-1.5" />
                
                <div className="flex justify-between text-sm text-fitness-gray">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(isCustomMode ? customDuration : selectedSession.duration)}</span>
                </div>
                
                <div className="flex items-center justify-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleResetSession}
                  >
                    <RotateCcw size={18} />
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
                    onClick={handleSkipToEnd}
                  >
                    <SkipForward size={18} />
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
        </CardContent>
      </Card>
      
      <Dialog open={isStatsOpen} onOpenChange={setIsStatsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart size={18} className="text-red-500" />
              Your Meditation Journey
            </DialogTitle>
            <DialogDescription>
              Track your progress and mindfulness habits
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                <p className="text-xl font-bold text-fitness-primary">
                  {meditationStats.totalSessions}
                </p>
                <p className="text-sm text-fitness-gray text-center">
                  Sessions Completed
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                <p className="text-xl font-bold text-fitness-primary">
                  {meditationStats.totalMinutes}
                </p>
                <p className="text-sm text-fitness-gray text-center">
                  Total Minutes
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                <p className="text-xl font-bold text-fitness-primary">
                  {meditationStats.currentStreak}
                </p>
                <p className="text-sm text-fitness-gray text-center">
                  Current Streak
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                <p className="text-xl font-bold text-fitness-primary">
                  {meditationStats.longestStreak}
                </p>
                <p className="text-sm text-fitness-gray text-center">
                  Longest Streak
                </p>
              </CardContent>
            </Card>
          </div>
          
          <p className="text-sm text-center text-muted-foreground mt-4">
            {meditationStats.lastCompletedDate 
              ? `Last meditation: ${new Date(meditationStats.lastCompletedDate).toLocaleDateString()}`
              : 'Start your meditation journey today!'}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MindfulnessWidget;
