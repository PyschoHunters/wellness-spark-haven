import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Cloud, Sun, Volume2 } from 'lucide-react';
import { showActionToast } from '@/utils/toast-utils';
import { supabase } from '@/integrations/supabase/client';

interface MindfulnessTip {
  id: number;
  tip: string;
  category: string;
}

const MindfulnessWidget: React.FC = () => {
  const [mindfulnessTip, setMindfulnessTip] = useState<MindfulnessTip | null>(null);
  const [weather, setWeather] = useState<{ description: string; temperature: number } | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    fetchMindfulnessTip();
    fetchWeather();
  }, []);

  const fetchMindfulnessTip = async () => {
    try {
      const { data, error } = await supabase
        .from('mindfulness_tips')
        .select('*')
        .order('id', { ascending: false })
        .limit(1);

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setMindfulnessTip(data[0] as MindfulnessTip);
      }
    } catch (error: any) {
      console.error('Error fetching mindfulness tip:', error.message);
      showActionToast('Failed to load mindfulness tip.');
    }
  };

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=YOUR_OPENWEATHERMAP_API_KEY&units=metric`
      );

      if (!response.ok) {
        throw new Error('Weather data could not be retrieved');
      }

      const data = await response.json();
      setWeather({
        description: data.weather[0].description,
        temperature: data.main.temp,
      });
    } catch (error: any) {
      console.error('Error fetching weather:', error.message);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    showActionToast(`Audio ${isMuted ? 'unmuted' : 'muted'}`);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Mindfulness Moment</h2>
        <button
          className="text-sm font-medium text-fitness-primary"
          onClick={() => showActionToast('Refreshing mindfulness tip')}
        >
          Refresh
        </button>
      </div>

      {weather && (
        <div className="flex items-center gap-2 mb-3">
          <Cloud className="text-gray-400" size={16} />
          <span className="text-sm">{weather.description}</span>
          <Sun className="text-orange-400" size={16} />
          <span className="text-sm">{weather.temperature}°C</span>
        </div>
      )}

      {mindfulnessTip ? (
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 text-green-600 p-2 rounded-lg">
              <Bell size={18} />
            </div>
            <div>
              <h3 className="font-medium">Tip of the Day</h3>
              <p className="text-sm mt-1">{mindfulnessTip.tip}</p>
            </div>
          </div>

          <button
            className="w-full bg-fitness-primary/10 text-fitness-primary py-2 rounded-xl font-medium flex items-center justify-center"
            onClick={() => showActionToast('Marked as completed')}
          >
            <CheckCircle size={18} className="mr-2" />
            Mark as Completed
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Loading mindfulness tip...</p>
      )}

      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">Nature Sounds</span>
        <button onClick={toggleMute}>
          <Volume2 className={`h-5 w-5 ${isMuted ? 'text-gray-400' : 'text-fitness-primary'}`} />
        </button>
      </div>
    </div>
  );
};

export default MindfulnessWidget;
