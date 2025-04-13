
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, User, Image, Palette, Save, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { showActionToast } from '@/utils/toast-utils';

const avatarStyles = [
  { id: 1, name: 'Casual', image: 'https://img.freepik.com/free-vector/smiling-young-man-glasses_1308-174702.jpg?t=st=1744568749~exp=1744572349~hmac=c449517fb5917e841d45c92cddc9f2fe41f2af579aa012bb52e36a165a1829b5&w=996' },
  { id: 2, name: 'Friendly', image: 'https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?t=st=1744568774~exp=1744572374~hmac=6058207927c97d6613c49874ef5293a73b5df42dc37315e0d8e67929312ee939&w=1060' },
  { id: 3, name: 'Professional', image: 'https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg?t=st=1744568797~exp=1744572397~hmac=5266e234fa3d1858b88ff3ec838a7c7ec347a173c259f0911d2a3a8b74fd4f54&w=996' },
  { id: 4, name: 'Contemporary', image: 'https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100226.jpg?t=st=1744568833~exp=1744572433~hmac=2414e54e07e53b34f10a2783bc0ff86d495a567908567cb5ae05bb790eb1eb3b&w=1380' }
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
  const { user, updateUserAvatar } = useAuth();
  const [activeTab, setActiveTab] = useState('style');
  const [selectedStyle, setSelectedStyle] = useState(avatarStyles[0]);
  const [selectedHair, setSelectedHair] = useState(hairStyles[0]);
  const [selectedSkin, setSelectedSkin] = useState(skinTones[0]);
  const [selectedClothing, setSelectedClothing] = useState(clothingColors[0]);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [showSaveAnimation, setShowSaveAnimation] = useState(false);

  const handleRandomize = () => {
    setIsRandomizing(true);
    setSelectedStyle(avatarStyles[Math.floor(Math.random() * avatarStyles.length)]);
    setSelectedHair(hairStyles[Math.floor(Math.random() * hairStyles.length)]);
    setSelectedSkin(skinTones[Math.floor(Math.random() * skinTones.length)]);
    setSelectedClothing(clothingColors[Math.floor(Math.random() * clothingColors.length)]);
    
    setTimeout(() => {
      setIsRandomizing(false);
    }, 500);
  };

  const handleSaveAvatar = () => {
    const avatarData = {
      style: selectedStyle,
      hair: selectedHair,
      skin: selectedSkin,
      clothing: selectedClothing
    };
    
    localStorage.setItem('userAvatar', JSON.stringify(avatarData));
    
    if (typeof updateUserAvatar === 'function') {
      updateUserAvatar(selectedStyle.image);
    }
    
    setShowSaveAnimation(true);
    setTimeout(() => {
      setShowSaveAnimation(false);
      showActionToast("Avatar saved successfully!");
    }, 1000);
  };

  const handleUploadPhoto = () => {
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
            className="text-xs flex items-center gap-1 rounded-full"
          >
            <RefreshCw size={14} className={isRandomizing ? "animate-spin" : ""} />
            Randomize
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleSaveAvatar}
            className="text-xs flex items-center gap-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-full"
            disabled={showSaveAnimation}
          >
            {showSaveAnimation ? (
              <CheckCircle2 size={14} className="animate-pulse" />
            ) : (
              <Save size={14} />
            )}
            {showSaveAnimation ? "Saved!" : "Save Avatar"}
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden border-none shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-6 items-center mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
            <div className="flex-shrink-0">
              <div className={`relative rounded-full border-4 ${isRandomizing ? "animate-pulse" : ""} shadow-lg transition-all duration-300`} 
                   style={{ borderColor: selectedClothing.color }}>
                <Avatar className="w-28 h-28">
                  <AvatarImage src={selectedStyle.image} alt="Avatar preview" className="object-cover" />
                  <AvatarFallback style={{ backgroundColor: selectedSkin.color }}>
                    {user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div 
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center bg-white text-fitness-primary shadow-md cursor-pointer hover:bg-fitness-primary hover:text-white transition-colors"
                  onClick={handleUploadPhoto}
                >
                  <Camera size={16} />
                </div>
              </div>
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">Your Custom Avatar</h3>
              <p className="text-sm mb-3 text-gray-600">Express yourself with a personalized avatar that represents your fitness journey.</p>
              
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="bg-gradient-to-r from-blue-100 to-blue-200 px-3 py-1 rounded-full text-blue-800 text-xs font-medium">{selectedStyle.name}</span>
                <span className="bg-gradient-to-r from-amber-100 to-amber-200 px-3 py-1 rounded-full text-amber-800 text-xs font-medium flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: selectedHair.color }}></span>
                  {selectedHair.name}
                </span>
                <span className="bg-gradient-to-r from-orange-100 to-orange-200 px-3 py-1 rounded-full text-orange-800 text-xs font-medium flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: selectedSkin.color }}></span>
                  {selectedSkin.name}
                </span>
                <span className="bg-gradient-to-r from-green-100 to-green-200 px-3 py-1 rounded-full text-green-800 text-xs font-medium flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: selectedClothing.color }}></span>
                  {selectedClothing.name}
                </span>
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-4 mb-4 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="style" 
                className="text-xs flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
              >
                <Image size={14} />
                Style
              </TabsTrigger>
              <TabsTrigger 
                value="hair" 
                className="text-xs flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
              >
                <Palette size={14} />
                Hair
              </TabsTrigger>
              <TabsTrigger 
                value="skin" 
                className="text-xs flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
              >
                <Palette size={14} />
                Skin
              </TabsTrigger>
              <TabsTrigger 
                value="clothing" 
                className="text-xs flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
              >
                <Palette size={14} />
                Clothing
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="style" className="mt-0">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {avatarStyles.map(style => (
                  <div
                    key={style.id}
                    onClick={() => setSelectedStyle(style)}
                    className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all hover:shadow-md ${
                      selectedStyle.id === style.id ? 'border-fitness-primary scale-105 shadow-md' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="aspect-square overflow-hidden bg-gray-50">
                      <img 
                        src={style.image} 
                        alt={style.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-2 text-center text-xs font-medium bg-white">{style.name}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="hair" className="mt-0">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {hairStyles.map(hair => (
                  <div
                    key={hair.id}
                    onClick={() => setSelectedHair(hair)}
                    className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all hover:shadow-md ${
                      selectedHair.id === hair.id ? 'border-fitness-primary scale-105 shadow-md' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="p-6 flex items-center justify-center bg-gray-50">
                      <div 
                        className="w-16 h-16 rounded-full shadow-inner" 
                        style={{ backgroundColor: hair.color }}
                      ></div>
                    </div>
                    <div className="p-2 text-center text-xs font-medium bg-white">{hair.name}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="skin" className="mt-0">
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {skinTones.map(skin => (
                  <div
                    key={skin.id}
                    onClick={() => setSelectedSkin(skin)}
                    className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all hover:shadow-md ${
                      selectedSkin.id === skin.id ? 'border-fitness-primary scale-105 shadow-md' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="p-4 flex items-center justify-center bg-gray-50">
                      <div 
                        className="w-14 h-14 rounded-full shadow-inner" 
                        style={{ backgroundColor: skin.color }}
                      ></div>
                    </div>
                    <div className="p-2 text-center text-xs font-medium bg-white">{skin.name}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="clothing" className="mt-0">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {clothingColors.map(clothing => (
                  <div
                    key={clothing.id}
                    onClick={() => setSelectedClothing(clothing)}
                    className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all hover:shadow-md ${
                      selectedClothing.id === clothing.id ? 'border-fitness-primary scale-105 shadow-md' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="p-4 flex items-center justify-center bg-gray-50">
                      <div 
                        className="w-14 h-14 rounded-full shadow-inner" 
                        style={{ backgroundColor: clothing.color }}
                      ></div>
                    </div>
                    <div className="p-2 text-center text-xs font-medium bg-white">{clothing.name}</div>
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
