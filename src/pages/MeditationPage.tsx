
import React from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { MindfulnessWidget } from '@/components/MindfulnessWidget';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const MeditationPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/schedule');
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20">
      <Header 
        title="Meditation" 
        action={
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft size={20} className="text-fitness-dark" />
          </Button>
        }
      />
      
      <div className="mb-6 bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Mindfulness & Meditation</h2>
        <p className="text-sm text-fitness-gray">
          Enhance your wellness journey with guided meditation sessions. Find peace, clarity and focus.
        </p>
      </div>
      
      <MindfulnessWidget />
      
      <Navigation />
    </div>
  );
};

export default MeditationPage;
