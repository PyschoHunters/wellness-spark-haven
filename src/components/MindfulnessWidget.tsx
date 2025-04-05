
import React, { useState } from 'react';
import { Heart, Play, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState(meditationSessions[0]);
  
  const handleSessionClick = (session: typeof meditationSessions[0]) => {
    setSelectedSession(session);
  };
  
  const handleSeeAll = () => {
    navigate('/mindfulness');
  };
  
  const handleStartMeditation = () => {
    showActionToast(`Starting ${selectedSession.title} meditation`);
    navigate('/mindfulness');
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
          onClick={handleSeeAll}
        >
          See All
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
          
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="font-medium">{selectedSession.title}</span>
            <span className="text-fitness-gray">{formatTime(selectedSession.duration)}</span>
          </div>
          
          <Progress value={0} className="h-1.5 mb-4" />
          
          <Button 
            className="w-full gap-2"
            onClick={handleStartMeditation}
          >
            <Play size={16} />
            Start Meditation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MindfulnessWidget;
