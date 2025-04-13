
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, User, Image, Palette, Save, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { showActionToast } from '@/utils/toast-utils';

// Avatar options for different categories
const avatarStyles = [
  { id: 1, name: 'Professional', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=300&auto=format&fit=crop' },
  { id: 2, name: 'Casual', image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=300&auto=format&fit=crop' },
  { id: 3, name: 'Athletic', image: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?q=80&w=300&auto=format&fit=crop' },
  { id: 4, name: 'Cartoon', image: 'https://images.unsplash.com/photo-1537815749002-de6a533c64db?q=80&w=300&auto=format&fit=crop' }
];

const hairStyles = [
  { id: 1, name: 'Short', color: '#5D4037' },
  { id: 2, name: 'Long', color: '#3E2723' },
  { id: 3, name: 'Curly', color: '#4E342E' },
  { id: 4, name: 'Bald', color: '#FFFFFF' }
];

const skinTones = [
  { id: 1, name: 'Light', color: '#FFDBAC' },
  { id: 2, name: 'Medium', color: '#F1C27D' },
  { id: 3, name: 'Tan', color: '#E0AC69' },
  { id: 4, name: 'Dark', color: '#C68642' },
  { id: 5, name: 'Deep', color: '#8D5524' }
];

const clothingColors = [
  { id: 1, name: 'Blue', color: '#1E88E5' },
  { id: 2, name: 'Red', color: '#E53935' },
  { id: 3, name: 'Green', color: '#43A047' },
  { id: 4, name: 'Purple', color: '#8E24AA' },
  { id: 5, name: 'Orange', color: '#FB8C00' },
  { id: 6, name: 'Black', color: '#212121' },
  { id: 7, name: 'White', color: '#EEEEEE' }
];

const AvatarCreator: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('style');
  const [selectedStyle, setSelectedStyle] = useState(avatarStyles[0]);
  const [selectedHair, setSelectedHair] = useState(hairStyles[0]);
  const [selectedSkin, setSelectedSkin] = useState(skinTones[0]);
  const [selectedClothing, setSelectedClothing] = useState(clothingColors[0]);
  const [isRandomizing, setIsRandomizing] = useState(false);

  const handleRandomize = () => {
    setIsRandomizing(true);
    // Randomize selections
    setSelectedStyle(avatarStyles[Math.floor(Math.random() * avatarStyles.length)]);
    setSelectedHair(hairStyles[Math.floor(Math.random() * hairStyles.length)]);
    setSelectedSkin(skinTones[Math.floor(Math.random() * skinTones.length)]);
    setSelectedClothing(clothingColors[Math.floor(Math.random() * clothingColors.length)]);
    
    // Visual feedback for randomization
    setTimeout(() => {
      setIsRandomizing(false);
    }, 500);
  };

  const handleSaveAvatar = () => {
    // In a real app, this would save the avatar configuration to the user profile
    showActionToast("Avatar saved successfully!");
  };

  const handleUploadPhoto = () => {
    // In a real app, this would open a file picker
    showActionToast("This feature will let you upload your photo");
  };

  return (
    <div className="animate-fade-up mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <User size={18} className="text-fitness-primary" />
          Create Your Avatar
        </h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRandomize}
            className="text-xs flex items-center gap-1"
          >
            <RefreshCw size={14} className={isRandomizing ? "animate-spin" : ""} />
            Random
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleSaveAvatar}
            className="text-xs flex items-center gap-1"
          >
            <Save size={14} />
            Save
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
            <div className="flex-shrink-0">
              <div className={`relative rounded-full border-4 ${isRandomizing ? "animate-pulse" : ""}`} style={{ borderColor: selectedClothing.color }}>
                <Avatar className="w-24 h-24">
                  <AvatarImage src={selectedStyle.image} alt="Avatar preview" />
                  <AvatarFallback style={{ backgroundColor: selectedSkin.color }}>
                    {user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div 
                  className="absolute top-0 right-0 w-6 h-6 rounded-full flex items-center justify-center bg-fitness-primary text-white cursor-pointer"
                  onClick={handleUploadPhoto}
                >
                  <Camera size={14} />
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <p className="text-sm mb-2">Customize your fitness avatar to represent you in the app.</p>
              
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-gray-100 px-2 py-1 rounded-full">Style: {selectedStyle.name}</span>
                <span className="bg-gray-100 px-2 py-1 rounded-full">Hair: {selectedHair.name}</span>
                <span className="bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                  Skin
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: selectedSkin.color }}></span>
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                  Clothing
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: selectedClothing.color }}></span>
                </span>
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="style" className="text-xs flex items-center gap-1">
                <Image size={14} />
                Style
              </TabsTrigger>
              <TabsTrigger value="hair" className="text-xs flex items-center gap-1">
                <Palette size={14} />
                Hair
              </TabsTrigger>
              <TabsTrigger value="skin" className="text-xs flex items-center gap-1">
                <Palette size={14} />
                Skin
              </TabsTrigger>
              <TabsTrigger value="clothing" className="text-xs flex items-center gap-1">
                <Palette size={14} />
                Clothing
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="style" className="mt-0">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {avatarStyles.map(style => (
                  <div
                    key={style.id}
                    onClick={() => setSelectedStyle(style)}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selectedStyle.id === style.id ? 'border-fitness-primary scale-105' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={style.image} 
                        alt={style.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-1 text-center text-xs">{style.name}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="hair" className="mt-0">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {hairStyles.map(hair => (
                  <div
                    key={hair.id}
                    onClick={() => setSelectedHair(hair)}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selectedHair.id === hair.id ? 'border-fitness-primary' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="p-4 flex items-center justify-center">
                      <div 
                        className="w-12 h-12 rounded-full" 
                        style={{ backgroundColor: hair.color }}
                      ></div>
                    </div>
                    <div className="p-1 text-center text-xs">{hair.name}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="skin" className="mt-0">
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {skinTones.map(skin => (
                  <div
                    key={skin.id}
                    onClick={() => setSelectedSkin(skin)}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selectedSkin.id === skin.id ? 'border-fitness-primary' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="p-4 flex items-center justify-center">
                      <div 
                        className="w-12 h-12 rounded-full" 
                        style={{ backgroundColor: skin.color }}
                      ></div>
                    </div>
                    <div className="p-1 text-center text-xs">{skin.name}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="clothing" className="mt-0">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {clothingColors.map(clothing => (
                  <div
                    key={clothing.id}
                    onClick={() => setSelectedClothing(clothing)}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selectedClothing.id === clothing.id ? 'border-fitness-primary' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="p-4 flex items-center justify-center">
                      <div 
                        className="w-12 h-12 rounded-full" 
                        style={{ backgroundColor: clothing.color }}
                      ></div>
                    </div>
                    <div className="p-1 text-center text-xs">{clothing.name}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvatarCreator;
