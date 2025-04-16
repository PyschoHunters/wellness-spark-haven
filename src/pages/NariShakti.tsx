
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Activity, Utensils, Headphones, MessageCircle, Leaf, Award, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PeriodTracker from '@/components/nari-shakti/PeriodTracker';
import YogaRecommendations from '@/components/nari-shakti/YogaRecommendations';
import DietaryRemedies from '@/components/nari-shakti/DietaryRemedies';
import MindfulnessTips from '@/components/nari-shakti/MindfulnessTips';
import AyurvedicInsights from '@/components/nari-shakti/AyurvedicInsights';
import CommunityForums from '@/components/nari-shakti/CommunityForums';
import WellnessBadges from '@/components/nari-shakti/WellnessBadges';
import { showActionToast } from '@/utils/toast-utils';

const NariShakti = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tracker");

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20">
      <Header 
        title="Nari Shakti" 
        subtitle="Holistic Women's Wellness" 
        action={
          <button 
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm"
            onClick={handleBack}
          >
            <ArrowLeft size={20} className="text-fitness-dark" />
          </button>
        }
      />
      
      <Card className="mb-6 overflow-hidden border-0 shadow-lg rounded-2xl bg-gradient-to-r from-rose-50 to-indigo-50">
        <CardContent className="p-0">
          <div className="px-6 py-6">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="text-rose-500 h-6 w-6" />
              <h2 className="text-xl font-semibold text-gray-800">Wellness Hub</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Track your cycle, discover personalized remedies, and connect with a supportive community.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="tracker" className="data-[state=active]:bg-rose-100 data-[state=active]:text-rose-800">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="text-xs">Track</span>
          </TabsTrigger>
          <TabsTrigger value="remedies" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800">
            <Leaf className="h-4 w-4 mr-1" />
            <span className="text-xs">Remedies</span>
          </TabsTrigger>
          <TabsTrigger value="wellness" className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800">
            <Activity className="h-4 w-4 mr-1" />
            <span className="text-xs">Wellness</span>
          </TabsTrigger>
          <TabsTrigger value="community" className="data-[state=active]:bg-sky-100 data-[state=active]:text-sky-800">
            <MessageCircle className="h-4 w-4 mr-1" />
            <span className="text-xs">Community</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tracker" className="space-y-4">
          <PeriodTracker />
          <WellnessBadges />
        </TabsContent>
        
        <TabsContent value="remedies" className="space-y-4">
          <YogaRecommendations />
          <DietaryRemedies />
        </TabsContent>
        
        <TabsContent value="wellness" className="space-y-4">
          <MindfulnessTips />
          <AyurvedicInsights />
        </TabsContent>
        
        <TabsContent value="community" className="space-y-4">
          <CommunityForums />
        </TabsContent>
      </Tabs>
      
      <Navigation />
    </div>
  );
};

export default NariShakti;
