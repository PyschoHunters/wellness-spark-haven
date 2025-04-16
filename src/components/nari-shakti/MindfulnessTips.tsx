import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Headphones, Clock, CalendarDays, Play, Bookmark, BookmarkCheck, Heart, Volume2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { showActionToast } from '@/utils/toast-utils';

const YOUTUBE_API_KEY = "AIzaSyBdFJxHBH7QDmG15jqV3ovQH11Y4ZJRE-s";

interface MindfulnessSession {
  id: number;
  title: string;
  duration: number; // in minutes
  category: 'meditation' | 'breathing' | 'affirmation' | 'sleep';
  description: string;
  benefits: string[];
  coverImage: string;
  audioUrl: string;
  embedId?: string; // YouTube video ID
  forSymptoms: string[];
}

const sessions: MindfulnessSession[] = [
  {
    id: 1,
    title: "5-Minute Breathing Exercise",
    duration: 5,
    category: 'breathing',
    description: "A quick breathing exercise to help you center yourself and reduce stress. Perfect for when you're feeling overwhelmed or experiencing cramps.",
    benefits: [
      "Reduces anxiety and stress",
      "Helps manage pain",
      "Improves focus and clarity",
      "Can be done anywhere, anytime"
    ],
    coverImage: "https://images.unsplash.com/photo-1497561813398-8fcc7a37b567?q=80&w=500&auto=format&fit=crop",
    audioUrl: "#",
    embedId: "wfDTp2GogaQ",
    forSymptoms: ["Stress", "Cramps", "Anxiety"]
  },
  {
    id: 2,
    title: "Calming Body Scan Meditation",
    duration: 10,
    category: 'meditation',
    description: "This guided meditation helps you connect with your body, release tension, and find relief from physical discomfort.",
    benefits: [
      "Relieves physical tension",
      "Increases body awareness",
      "Reduces pain perception",
      "Promotes deep relaxation"
    ],
    coverImage: "https://images.unsplash.com/photo-1536623975707-c4b3b2af565d?q=80&w=500&auto=format&fit=crop",
    audioUrl: "#",
    embedId: "3pGVU-yLQR4",
    forSymptoms: ["Pain", "Tension", "Insomnia"]
  },
  {
    id: 3,
    title: "Positive Affirmations for Healing",
    duration: 7,
    category: 'affirmation',
    description: "Empower yourself with these positive affirmations designed to promote healing, acceptance, and self-compassion during your cycle.",
    benefits: [
      "Improves mood and outlook",
      "Builds self-compassion",
      "Reduces negative self-talk",
      "Creates positive mental environment"
    ],
    coverImage: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=500&auto=format&fit=crop",
    audioUrl: "#",
    embedId: "Tpq8AvwDpDA",
    forSymptoms: ["Mood Swings", "Low Energy", "Self-Doubt"]
  },
  {
    id: 4,
    title: "Sleep Aid Meditation",
    duration: 15,
    category: 'sleep',
    description: "Gentle guidance into deep, restful sleep when period discomfort makes it difficult to relax at night.",
    benefits: [
      "Improves sleep quality",
      "Reduces insomnia",
      "Calms an active mind",
      "Creates bedtime routine"
    ],
    coverImage: "https://hallow.com/wp-content/uploads/2019/04/indian-yogi-yogi-madhav-727510-unsplash.jpg",
    audioUrl: "#",
    embedId: "N4qYjY0poQE",
    forSymptoms: ["Insomnia", "Restlessness", "Anxiety"]
  },
  {
    id: 5,
    title: "Energy Boost Meditation",
    duration: 8,
    category: 'meditation',
    description: "A revitalizing meditation to combat fatigue and low energy often experienced during your period.",
    benefits: [
      "Increases energy naturally",
      "Improves mental clarity",
      "Reduces feeling of fatigue",
      "Uplifts mood"
    ],
    coverImage: "https://images.unsplash.com/photo-1476611317561-60117649dd94?q=80&w=500&auto=format&fit=crop",
    audioUrl: "#",
    embedId: "inpok4MKVLM",
    forSymptoms: ["Fatigue", "Low Energy", "Brain Fog"]
  }
];

const MindfulnessTips = () => {
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [savedSessions, setSavedSessions] = useState<number[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [filteredSessions, setFilteredSessions] = useState(sessions);
  const [sessionOpen, setSessionOpen] = useState(false);
  
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredSessions(sessions);
    } else if (activeFilter === 'saved') {
      setFilteredSessions(sessions.filter(session => savedSessions.includes(session.id)));
    } else {
      setFilteredSessions(sessions.filter(session => 
        session.category === activeFilter || 
        session.forSymptoms.includes(activeFilter)
      ));
    }
  }, [activeFilter, savedSessions]);
  
  const handleSessionClick = (session: MindfulnessSession) => {
    setSelectedSession(session);
    setSessionOpen(true);
  };
  
  const handleSaveSession = (sessionId: number) => {
    if (savedSessions.includes(sessionId)) {
      setSavedSessions(savedSessions.filter(id => id !== sessionId));
      showActionToast("Removed from saved sessions");
    } else {
      setSavedSessions([...savedSessions, sessionId]);
      showActionToast("Added to saved sessions");
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'meditation': return 'bg-indigo-100 text-indigo-800';
      case 'breathing': return 'bg-cyan-100 text-cyan-800';
      case 'affirmation': return 'bg-pink-100 text-pink-800';
      case 'sleep': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDuration = (minutes: number) => {
    return `${minutes} min`;
  };
  
  const getYouTubeEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}?rel=0`;
  };
  
  return (
    <>
      <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-indigo-100 to-indigo-200 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-indigo-800">
              <Headphones className="h-5 w-5" />
              Mindfulness Tips
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="flex overflow-x-auto space-x-2 pb-2 mb-3 -mx-1 px-1">
            <Button
              variant="outline"
              size="sm"
              className={`flex-shrink-0 rounded-full text-xs px-3 ${activeFilter === 'all' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`flex-shrink-0 rounded-full text-xs px-3 ${activeFilter === 'meditation' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : ''}`}
              onClick={() => setActiveFilter('meditation')}
            >
              Meditation
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`flex-shrink-0 rounded-full text-xs px-3 ${activeFilter === 'breathing' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : ''}`}
              onClick={() => setActiveFilter('breathing')}
            >
              Breathing
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`flex-shrink-0 rounded-full text-xs px-3 ${activeFilter === 'Fatigue' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : ''}`}
              onClick={() => setActiveFilter('Fatigue')}
            >
              For Fatigue
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`flex-shrink-0 rounded-full text-xs px-3 ${activeFilter === 'saved' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : ''}`}
              onClick={() => setActiveFilter('saved')}
            >
              Saved
            </Button>
          </div>
          
          <div className="space-y-3">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <div 
                  key={session.id}
                  className="flex gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer relative"
                >
                  <div 
                    className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative"
                    onClick={() => handleSessionClick(session)}
                  >
                    <img 
                      src={session.coverImage} 
                      alt={session.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  <div 
                    className="flex-1"
                    onClick={() => handleSessionClick(session)}
                  >
                    <h3 className="font-medium mb-1">{session.title}</h3>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`text-[10px] px-1 py-0 h-4 ${getCategoryColor(session.category)}`}>
                        {session.category.charAt(0).toUpperCase() + session.category.slice(1)}
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDuration(session.duration)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {session.description}
                    </p>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 flex-shrink-0 self-start absolute top-2 right-2"
                    onClick={() => handleSaveSession(session.id)}
                  >
                    {savedSessions.includes(session.id) ? (
                      <BookmarkCheck className="h-4 w-4 text-indigo-500" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No sessions found for your filter.</p>
                <Button variant="link" onClick={() => setActiveFilter('all')}>
                  View all sessions
                </Button>
              </div>
            )}
          </div>
          
          <Button 
            className="w-full mt-4 bg-gradient-to-r from-indigo-400 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl flex items-center gap-2"
            onClick={() => setActiveFilter('all')}
          >
            <Volume2 className="h-4 w-4" />
            Explore All Mindfulness Resources
          </Button>
        </CardContent>
      </Card>
      
      <Dialog open={sessionOpen} onOpenChange={setSessionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedSession?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedSession && (
            <div className="space-y-4 mt-2">
              {selectedSession.embedId && (
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={getYouTubeEmbedUrl(selectedSession.embedId)}
                    title={selectedSession.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <Badge className={getCategoryColor(selectedSession.category)}>
                  {selectedSession.category.charAt(0).toUpperCase() + selectedSession.category.slice(1)}
                </Badge>
                <span className="text-sm text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDuration(selectedSession.duration)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600">
                {selectedSession.description}
              </p>
              
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <Heart className="h-4 w-4 mr-1 text-indigo-500" />
                  Benefits
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedSession.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm">{benefit}</li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-between pt-2">
                <Button 
                  variant="outline"
                  onClick={() => setSessionOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  className="bg-indigo-500 hover:bg-indigo-600"
                  onClick={() => handleSaveSession(selectedSession.id)}
                >
                  {savedSessions.includes(selectedSession.id) ? (
                    <>
                      <BookmarkCheck className="h-4 w-4 mr-2" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MindfulnessTips;
