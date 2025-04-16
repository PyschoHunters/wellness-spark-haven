
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WellnessHub = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/nari-shakti');
  };

  return (
    <Card className="w-full bg-white shadow-md rounded-2xl overflow-hidden border-0 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={handleNavigate}>
      <CardContent className="p-0">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-indigo-500/20" />
          <img 
            src="https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=500&auto=format&fit=crop" 
            alt="Wellness Hub" 
            className="w-full h-32 object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
            <h3 className="text-white font-semibold flex items-center">
              <Heart className="h-4 w-4 mr-2 text-rose-200" />
              Nari Shakti
            </h3>
          </div>
        </div>
        
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-3">
            Track your cycle, discover personalized remedies, and connect with a supportive community.
          </p>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-rose-200 text-rose-700 hover:bg-rose-50 flex items-center justify-center gap-1"
          >
            <span>Explore Hub</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WellnessHub;
