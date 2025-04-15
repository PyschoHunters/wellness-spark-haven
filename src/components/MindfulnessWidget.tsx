
import React, { useState, useEffect, useRef } from 'react';
import { Heart, Play, Clock, VolumeX, Volume2, SkipBack, SkipForward, Pause, Save, Share2, Award, Settings, Moon, Sun, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { showActionToast } from '@/utils/toast-utils';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const meditationSessions = [
  {
    id: 1,
    title: "Morning Calm",
    duration: 300, // 5 minutes in seconds
    description: "Start your day with clarity",
    level: "Beginner",
    backgroundSound: "nature",
    guidedVoice: true,
  },
  {
    id: 2,
    title: "Stress Relief",
    duration: 600, // 10 minutes
    description: "Release tension and find balance",
    level: "Intermediate",
    backgroundSound: "rain",
    guidedVoice: true,
  },
  {
    id: 3,
    title: "Deep Focus",
    duration: 900, // 15 minutes
    description: "Enhance concentration",
    level: "All Levels",
    backgroundSound: "ambient",
    guidedVoice: false,
  },
  {
    id: 4,
    title: "Sleep Preparation",
    duration: 1200, // 20 minutes
    description: "Calm your mind before sleep",
    level: "Beginner",
    backgroundSound: "waves",
    guidedVoice: true,
  },
  {
    id: 5,
    title: "Body Scan",
    duration: 720, // 12 minutes
    description: "Connect with your body",
    level: "Intermediate",
    backgroundSound: "forest",
    guidedVoice: true,
  }
];

const breathingPatterns = [
  { id: 1, name: "4-7-8 Breathing", inhale: 4, hold: 7, exhale: 8, description: "Calming breath for anxiety" },
  { id: 2, name: "Box Breathing", inhale: 4, hold: 4, exhale: 4, description: "For focus and stress relief" },
  { id: 3, name: "Deep Belly Breathing", inhale: 5, hold: 0, exhale: 5, description: "Natural relaxation" },
  { id: 4, name: "Energizing Breath", inhale: 2, hold: 0, exhale: 2, description: "Quick energy boost" }
];

const backgroundSounds = [
  { id: "nature", name: "Nature Sounds", icon: "🌿" },
  { id: "rain", name: "Gentle Rain", icon: "🌧️" },
  { id: "waves", name: "Ocean Waves", icon: "🌊" },
  { id: "ambient", name: "Ambient Music", icon: "🎵" },
  { id: "forest", name: "Forest Birds", icon: "🌳" },
  { id: "none", name: "No Sound", icon: "🔇" }
];

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const MindfulnessWidget: React.FC = () => {
  const { user } = useAuth();
  const [selectedSession, setSelectedSession] = useState(meditationSessions[0]);
  const [selectedPattern, setSelectedPattern] = useState(breathingPatterns[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [breatheIn, setBreatheIn] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [guidedMeditation, setGuidedMeditation] = useState(true);
  const [selectedBackgroundSound, setSelectedBackgroundSound] = useState(backgroundSounds[0]);
  const [favoriteSessionIds, setFavoriteSessionIds] = useState<number[]>([]);
  const [completedSessions, setCompletedSessions] = useState<{id: number, timestamp: string}[]>([]);
  const [activeTab, setActiveTab] = useState('sessions');
  const breathAnimationRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [streakCount, setStreakCount] = useState(0);
  const [showSessionHistory, setShowSessionHistory] = useState(false);
  
  useEffect(() => {
    // Load user preferences and history from localStorage or Supabase
    const loadUserData = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('mindfulness_preferences')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          if (data && !error) {
            setVolume(data.volume || 80);
            setDarkMode(data.dark_mode || false);
            setGuidedMeditation(data.guided_meditation || true);
            const selectedSound = backgroundSounds.find(s => s.id === data.background_sound) || backgroundSounds[0];
            setSelectedBackgroundSound(selectedSound);
          }
          
          // Load user's favorite sessions
          const { data: favoritesData, error: favoritesError } = await supabase
            .from('mindfulness_favorites')
            .select('session_id')
            .eq('user_id', user.id);
            
          if (favoritesData && !favoritesError) {
            setFavoriteSessionIds(favoritesData.map(f => f.session_id));
          }
          
          // Load completed sessions
          const { data: completedData, error: completedError } = await supabase
            .from('mindfulness_completed')
            .select('session_id, completed_at')
            .eq('user_id', user.id)
            .order('completed_at', { ascending: false });
            
          if (completedData && !completedError) {
            setCompletedSessions(completedData.map(c => ({
              id: c.session_id,
              timestamp: c.completed_at
            })));
            
            // Calculate streak
            calculateStreak(completedData);
          }
        } catch (error) {
          console.error("Error loading mindfulness data", error);
          // Fallback to default values if there's an error
        }
      }
    };
    
    loadUserData();
  }, [user]);
  
  const calculateStreak = (completedData: any[]) => {
    if (!completedData.length) {
      setStreakCount(0);
      return;
    }
    
    // Sort by date (newest first)
    const sortedSessions = [...completedData].sort((a, b) => 
      new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
    );
    
    let streak = 1;
    let currentDate = new Date(sortedSessions[0].completed_at);
    currentDate.setHours(0, 0, 0, 0);
    
    // Check if the most recent session was today or yesterday
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (currentDate.getTime() !== today.getTime() && 
        currentDate.getTime() !== yesterday.getTime()) {
      setStreakCount(0);
      return;
    }
    
    // Calculate streak by checking consecutive days
    for (let i = 1; i < sortedSessions.length; i++) {
      const sessionDate = new Date(sortedSessions[i].completed_at);
      sessionDate.setHours(0, 0, 0, 0);
      
      const expectedPrevDate = new Date(currentDate);
      expectedPrevDate.setDate(expectedPrevDate.getDate() - 1);
      
      if (sessionDate.getTime() === expectedPrevDate.getTime()) {
        streak++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }
    
    setStreakCount(streak);
  };
  
  useEffect(() => {
    // Clear any existing timers when component unmounts
    return () => {
      if (breathAnimationRef.current) clearInterval(breathAnimationRef.current);
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, []);
  
  useEffect(() => {
    if (breathAnimationRef.current) clearInterval(breathAnimationRef.current);
    
    if (isPlaying) {
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
  }, [isPlaying, selectedPattern]);
  
  useEffect(() => {
    if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    
    if (isPlaying && currentTime < selectedSession.duration) {
      sessionTimerRef.current = setInterval(() => {
        setCurrentTime(prevTime => {
          return prevTime + 1;
        });
      }, 1000);
    } else if (currentTime >= selectedSession.duration) {
      setIsPlaying(false);
      handleSessionComplete();
    }
    
    return () => {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, [isPlaying, currentTime, selectedSession.duration]);
  
  const handleSessionComplete = async () => {
    showActionToast("Meditation session completed");
    setCurrentTime(0);
    
    if (user) {
      try {
        // Record completed session
        await supabase.from('mindfulness_completed').insert({
          user_id: user.id,
          session_id: selectedSession.id,
          completed_at: new Date().toISOString(),
          duration: selectedSession.duration
        });
        
        // Update completed sessions state
        setCompletedSessions(prev => [
          { id: selectedSession.id, timestamp: new Date().toISOString() },
          ...prev
        ]);
        
        // Recalculate streak
        const { data } = await supabase
          .from('mindfulness_completed')
          .select('session_id, completed_at')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });
          
        if (data) {
          calculateStreak(data);
        }
      } catch (error) {
        console.error("Error recording completed session", error);
      }
    }
  };
  
  const handleSessionClick = (session: typeof meditationSessions[0]) => {
    setSelectedSession(session);
    setCurrentTime(0);
    setIsPlaying(false);
  };
  
  const handlePatternSelect = (pattern: typeof breathingPatterns[0]) => {
    setSelectedPattern(pattern);
    if (isPlaying) {
      // Reset the breathing animation with the new pattern
      if (breathAnimationRef.current) clearInterval(breathAnimationRef.current);
      setBreatheIn(true); // Start with inhale
    }
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
    
    if (user) {
      // Save volume preference to Supabase (debounced in real implementation)
      saveUserPreferences({ volume: value[0] });
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const toggleFavorite = async (sessionId: number) => {
    const isFavorite = favoriteSessionIds.includes(sessionId);
    
    try {
      if (isFavorite) {
        // Remove from favorites
        await supabase
          .from('mindfulness_favorites')
          .delete()
          .eq('user_id', user?.id)
          .eq('session_id', sessionId);
          
        setFavoriteSessionIds(prev => prev.filter(id => id !== sessionId));
        showActionToast("Removed from favorites");
      } else {
        // Add to favorites
        await supabase
          .from('mindfulness_favorites')
          .insert({
            user_id: user?.id,
            session_id: sessionId
          });
          
        setFavoriteSessionIds(prev => [...prev, sessionId]);
        showActionToast("Added to favorites");
      }
    } catch (error) {
      console.error("Error updating favorites", error);
      showActionToast("There was an error updating your favorites");
    }
  };
  
  const saveUserPreferences = async (preferences: any) => {
    if (!user) return;
    
    try {
      const { data: existingData } = await supabase
        .from('mindfulness_preferences')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      const updatedPreferences = {
        ...preferences,
        user_id: user.id
      };
      
      if (existingData?.id) {
        // Update existing preferences
        await supabase
          .from('mindfulness_preferences')
          .update(updatedPreferences)
          .eq('id', existingData.id);
      } else {
        // Insert new preferences
        await supabase
          .from('mindfulness_preferences')
          .insert(updatedPreferences);
      }
    } catch (error) {
      console.error("Error saving preferences", error);
    }
  };
  
  const handleBackgroundSoundChange = (sound: typeof backgroundSounds[0]) => {
    setSelectedBackgroundSound(sound);
    saveUserPreferences({ background_sound: sound.id });
    showActionToast(`Background sound changed to ${sound.name}`);
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    saveUserPreferences({ dark_mode: !darkMode });
  };
  
  const toggleGuidedMeditation = () => {
    setGuidedMeditation(!guidedMeditation);
    saveUserPreferences({ guided_meditation: !guidedMeditation });
  };
  
  const restartSession = () => {
    setCurrentTime(0);
    setIsPlaying(false);
    showActionToast("Session restarted");
  };
  
  const handleShareSession = () => {
    // In a real app, this would generate a shareable link
    const shareText = `I'm meditating with ${selectedSession.title} on FitTrack! Join me for ${formatTime(selectedSession.duration)} of mindfulness.`;
    navigator.clipboard.writeText(shareText);
    showActionToast("Share text copied to clipboard");
  };
  
  const widgetClassName = darkMode ? "bg-gray-900 text-white" : "bg-white";
  const headerTextClassName = darkMode ? "text-gray-100" : "text-gray-800";
  const subTextClassName = darkMode ? "text-gray-300" : "text-fitness-gray";
  
  return (
    <div className="animate-fade-up">
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-lg font-semibold flex items-center gap-2 ${headerTextClassName}`}>
          <Heart size={18} className="text-red-500" />
          Mindfulness
          {streakCount > 0 && (
            <span className="ml-2 bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full flex items-center">
              <Award size={12} className="mr-1" /> {streakCount} day streak
            </span>
          )}
        </h2>
        <div className="flex gap-2">
          <button 
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            onClick={() => setShowSettings(true)}
          >
            <Settings size={16} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
          </button>
          <button 
            className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-fitness-primary'}`}
            onClick={toggleExpanded}
          >
            {expanded ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>
      
      <Card className={widgetClassName}>
        <CardContent className="p-4">
          <p className={`text-sm ${subTextClassName} mb-3`}>
            Take a moment to breathe and find your center
          </p>
          
          {expanded && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4">
              <TabsList className={`grid w-full grid-cols-2 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
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
                          : darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-fitness-gray-light hover:bg-fitness-gray-light/80'
                      }`}
                      style={{ width: 'calc(33.333% - 8px)' }}
                      onClick={() => handleSessionClick(session)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span className="text-xs">{formatTime(session.duration)}</span>
                        </div>
                        {favoriteSessionIds.includes(session.id) && (
                          <Heart size={12} className="text-red-500 fill-red-500" />
                        )}
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
                          : darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-fitness-gray-light hover:bg-fitness-gray-light/80'
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
          )}
          
          {expanded && (
            <>
              <div className="mx-auto w-40 h-40 rounded-full border-4 border-fitness-primary/20 flex items-center justify-center mb-4 relative">
                <div 
                  className={`w-32 h-32 rounded-full bg-fitness-primary/10 flex items-center justify-center transition-all duration-2000 ease-in-out ${
                    breatheIn ? 'scale-110' : 'scale-90'
                  }`}
                >
                  <div className="text-center">
                    <div className={`${darkMode ? 'text-blue-400' : 'text-fitness-primary'} font-medium`}>
                      {breatheIn ? 'Breathe In' : 'Breathe Out'}
                    </div>
                    <div className={`text-sm ${subTextClassName}`}>
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
                      stroke={darkMode ? "#374151" : "#f0f0f0"}
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
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${headerTextClassName}`}>
                    {selectedSession.title}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      className={`p-1.5 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                      onClick={() => toggleFavorite(selectedSession.id)}
                    >
                      <Heart 
                        size={16} 
                        className={favoriteSessionIds.includes(selectedSession.id) ? 'text-red-500 fill-red-500' : subTextClassName} 
                      />
                    </button>
                    <button 
                      className={`p-1.5 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                      onClick={handleShareSession}
                    >
                      <Share2 size={16} className={subTextClassName} />
                    </button>
                  </div>
                </div>
                
                <Progress value={progress} className={`h-1.5 ${darkMode ? 'bg-gray-700' : ''}`} />
                
                <div className={`flex justify-between text-sm ${subTextClassName}`}>
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(selectedSession.duration)}</span>
                </div>
                
                <div className="flex items-center justify-center gap-4">
                  <Button 
                    variant={darkMode ? "outline" : "ghost"} 
                    size="icon"
                    onClick={restartSession}
                  >
                    <RotateCcw size={20} />
                  </Button>
                  
                  <Button 
                    className={`w-12 h-12 rounded-full ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-fitness-primary hover:bg-fitness-primary/90'}`}
                    onClick={handleStartMeditation}
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </Button>
                  
                  <Button 
                    variant={darkMode ? "outline" : "ghost"} 
                    size="icon"
                    onClick={() => {
                      setCurrentTime(selectedSession.duration);
                      setIsPlaying(false);
                      handleSessionComplete();
                    }}
                  >
                    <SkipForward size={20} />
                  </Button>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button variant={darkMode ? "outline" : "ghost"} size="icon" onClick={toggleMute}>
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
                
                <div className={`flex justify-between text-sm ${subTextClassName} mt-4`}>
                  <div>
                    Background: <span className="font-medium">{selectedBackgroundSound.icon} {selectedBackgroundSound.name}</span>
                  </div>
                  <button 
                    className="text-fitness-primary text-sm"
                    onClick={() => setShowSessionHistory(true)}
                  >
                    History
                  </button>
                </div>
              </div>
            </>
          )}
          
          {!expanded && (
            <>
              <div className={`flex justify-between items-center text-sm mb-2 ${darkMode ? 'text-gray-300' : ''}`}>
                <span className="font-medium">{selectedSession.title}</span>
                <span className={subTextClassName}>{formatTime(selectedSession.duration)}</span>
              </div>
              
              <Progress value={progress} className={`h-1.5 mb-4 ${darkMode ? 'bg-gray-700' : ''}`} />
              
              <Button 
                className={`w-full gap-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                onClick={handleStartMeditation}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {isPlaying ? "Pause Meditation" : "Start Meditation"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className={`${darkMode ? 'bg-gray-900 text-white' : ''}`}>
          <DialogHeader>
            <DialogTitle className={darkMode ? 'text-white' : ''}>Mindfulness Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <Switch 
                id="dark-mode" 
                checked={darkMode} 
                onCheckedChange={toggleDarkMode} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="guided">Guided Meditation</Label>
              <Switch 
                id="guided" 
                checked={guidedMeditation} 
                onCheckedChange={toggleGuidedMeditation} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Background Sound</Label>
              <div className="grid grid-cols-2 gap-2">
                {backgroundSounds.map(sound => (
                  <div 
                    key={sound.id}
                    className={`p-2 rounded-lg cursor-pointer ${
                      selectedBackgroundSound.id === sound.id 
                        ? 'bg-fitness-primary text-white' 
                        : darkMode ? 'bg-gray-800' : 'bg-gray-100'
                    }`}
                    onClick={() => handleBackgroundSoundChange(sound)}
                  >
                    <div className="text-lg text-center">{sound.icon}</div>
                    <div className="text-xs text-center mt-1">{sound.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showSessionHistory} onOpenChange={setShowSessionHistory}>
        <DialogContent className={`${darkMode ? 'bg-gray-900 text-white' : ''}`}>
          <DialogHeader>
            <DialogTitle className={darkMode ? 'text-white' : ''}>Meditation History</DialogTitle>
          </DialogHeader>
          
          <div className="max-h-80 overflow-y-auto">
            {completedSessions.length === 0 ? (
              <p className={`text-center py-4 ${subTextClassName}`}>
                No meditation sessions completed yet.
              </p>
            ) : (
              <div className="space-y-3 mt-2">
                {completedSessions.map((session, index) => {
                  const sessionInfo = meditationSessions.find(s => s.id === session.id);
                  const date = new Date(session.timestamp);
                  
                  return (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{sessionInfo?.title || 'Unknown session'}</h4>
                        <span className={`text-xs ${subTextClassName}`}>
                          {formatTime(sessionInfo?.duration || 0)}
                        </span>
                      </div>
                      <p className={`text-xs ${subTextClassName} mt-1`}>
                        {date.toLocaleDateString()} at {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-1">
              <Award size={16} className="text-amber-500" />
              <span className="text-sm font-medium">
                {streakCount} day streak
              </span>
            </div>
            <Button onClick={() => setShowSessionHistory(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MindfulnessWidget;
