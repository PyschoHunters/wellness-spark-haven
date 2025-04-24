
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

interface AudioTesterProps {
  audioUrl: string;
  title: string;
}

const AudioTester: React.FC<AudioTesterProps> = ({ audioUrl, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audioElement = new Audio(audioUrl);
    
    audioElement.addEventListener('canplaythrough', () => {
      setIsLoading(false);
      setError(null);
      console.log(`Audio loaded successfully: ${title}`);
    });
    
    audioElement.addEventListener('error', (e) => {
      setIsLoading(false);
      setError(`Error loading audio: ${e.type}`);
      console.error(`Error loading audio for ${title}:`, e);
    });
    
    setAudio(audioElement);
    
    return () => {
      audioElement.pause();
      audioElement.src = "";
    };
  }, [audioUrl, title]);

  const togglePlay = () => {
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => {
        console.error("Play error:", err);
        setError(`Play error: ${err.message}`);
      });
    }
    
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="p-3 border rounded-md mb-3">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-xs text-gray-500">{audioUrl}</p>
        </div>
        <Button 
          onClick={togglePlay} 
          disabled={isLoading || !!error}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isLoading ? "Loading..." : isPlaying ? "Pause" : "Play"}
        </Button>
      </div>
      {error && (
        <div className="text-sm text-red-500 mt-2">{error}</div>
      )}
    </div>
  );
};

export default AudioTester;
