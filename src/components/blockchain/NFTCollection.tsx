import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Lock, Eye, Dumbbell, Flame, Heart, Sun, Target, Trophy, RotateCw } from 'lucide-react';
import { cn } from "@/lib/utils";

interface NFT {
  id: number;
  name: string;
  description: string;
  image: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: 'achievement' | 'challenge' | 'limited';
  unlocked: boolean;
  tokenId?: string;
  attributes: {
    name: string;
    value: string;
  }[];
  acquiredDate?: string;
}

export const NFTCollection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('owned');
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const nfts: NFT[] = [
    {
      id: 1,
      name: "Marathon Master",
      description: "Awarded to fitness enthusiasts who completed the 42.2km Marathon Challenge",
      image: "https://ichef.bbci.co.uk/ace/standard/1024/cpsprodpb/B079/production/_133177154_gettyimages-1484427391.jpg",
      rarity: 'rare',
      category: 'achievement',
      unlocked: true,
      tokenId: "1429",
      attributes: [
        { name: "Collection", value: "Achievement Series" },
        { name: "Season", value: "Spring 2025" },
        { name: "Power", value: "+15% Endurance" }
      ],
      acquiredDate: "2025-03-15"
    },
    {
      id: 2,
      name: "Strength Champion",
      description: "Awarded for completing 50 strength training workouts",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4FX8BMZeEloeIX0JOpyGFbapfvWjTThTe2w&s",
      rarity: 'uncommon',
      category: 'achievement',
      unlocked: true,
      tokenId: "2183",
      attributes: [
        { name: "Collection", value: "Achievement Series" },
        { name: "Season", value: "Winter 2025" },
        { name: "Power", value: "+10% Strength" }
      ],
      acquiredDate: "2025-02-22"
    },
    {
      id: 3,
      name: "Marathon Finisher Badge",
      description: "Limited edition NFT badge for completing the virtual marathon",
      image: "https://ichef.bbci.co.uk/ace/standard/1024/cpsprodpb/B079/production/_133177154_gettyimages-1484427391.jpg",
      rarity: 'rare',
      category: 'limited',
      unlocked: true,
      tokenId: "3692",
      attributes: [
        { name: "Collection", value: "Challenge Series" },
        { name: "Season", value: "Spring 2025" },
        { name: "Power", value: "+10% Endurance" }
      ],
      acquiredDate: "2025-03-01"
    },
    {
      id: 4,
      name: "Yoga Guru",
      description: "Awarded for mastering 20 different yoga poses",
      image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=500&h=500&fit=crop",
      rarity: 'common',
      category: 'achievement',
      unlocked: true,
      tokenId: "5827",
      attributes: [
        { name: "Collection", value: "Achievement Series" },
        { name: "Season", value: "Winter 2025" },
        { name: "Power", value: "+8% Flexibility" }
      ],
      acquiredDate: "2025-01-30"
    },
    {
      id: 5,
      name: "Ironman Legend",
      description: "Complete the legendary Ironman challenge consisting of swimming, cycling, and running",
      image: "https://media.bleacherreport.com/image/upload/v1633965483/qkezskngtavug1crcfts.jpg",
      rarity: 'legendary',
      category: 'challenge',
      unlocked: false,
      attributes: [
        { name: "Collection", value: "Challenge Series" },
        { name: "Season", value: "Summer 2025" },
        { name: "Power", value: "+25% Recovery" }
      ]
    },
    {
      id: 6,
      name: "90-Day Streak",
      description: "Awarded for maintaining a 90-day workout streak",
      image: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=500&h=500&fit=crop",
      rarity: 'epic',
      category: 'achievement',
      unlocked: false,
      attributes: [
        { name: "Collection", value: "Achievement Series" },
        { name: "Season", value: "Spring 2025" },
        { name: "Power", value: "+20% Motivation" }
      ]
    },
    {
      id: 7,
      name: "First Edition Badge",
      description: "Limited edition badge for founding members of the FitChain community",
      image: "https://img.freepik.com/free-photo/3d-rendering-blockchain-technology_23-2151480182.jpg?semt=ais_hybrid&w=740",
      rarity: 'legendary',
      category: 'limited',
      unlocked: true,
      tokenId: "0042",
      attributes: [
        { name: "Collection", value: "Founder Series" },
        { name: "Season", value: "Genesis" },
        { name: "Power", value: "+15% All Stats" }
      ],
      acquiredDate: "2025-01-01"
    },
    {
      id: 8,
      name: "First Steps",
      description: "Awarded for starting your fitness journey and completing your first workout",
      image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=500&h=500&fit=crop",
      rarity: 'epic',
      category: 'achievement',
      unlocked: false,
      attributes: [
        { name: "Collection", value: "Achievement Series" },
        { name: "Season", value: "Spring 2025" },
        { name: "Power", value: "+20% Motivation" }
      ]
    }
  ];
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'uncommon': return 'bg-green-100 text-green-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-200';
      case 'uncommon': return 'border-green-200';
      case 'rare': return 'border-blue-200';
      case 'epic': return 'border-purple-200';
      case 'legendary': return 'border-amber-200';
      default: return 'border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'achievement': return <Trophy className="h-4 w-4 mr-1" />;
      case 'challenge': return <Target className="h-4 w-4 mr-1" />;
      case 'limited': return <Award className="h-4 w-4 mr-1" />;
      default: return null;
    }
  };
  
  const filteredNFTs = activeTab === 'owned' 
    ? nfts.filter(nft => nft.unlocked) 
    : activeTab === 'locked' 
      ? nfts.filter(nft => !nft.unlocked) 
      : nfts;
  
  const handleNFTClick = (nft: NFT) => {
    setSelectedNFT(nft);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">NFT Fitness Collection</h2>
        <p className="text-muted-foreground">
          Collect unique NFTs by completing challenges and milestones on your fitness journey
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="all">All NFTs</TabsTrigger>
          <TabsTrigger value="owned">Owned</TabsTrigger>
          <TabsTrigger value="locked">To Earn</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredNFTs.map((nft) => (
          <Card 
            key={nft.id} 
            className={cn(
              "overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer",
              nft.unlocked ? getRarityBorder(nft.rarity) : "border-gray-200 opacity-80"
            )}
            onClick={() => handleNFTClick(nft)}
          >
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <img 
                src={nft.image} 
                alt={nft.name}
                className={cn(
                  "w-full h-full object-cover transition-all duration-300",
                  !nft.unlocked && "filter grayscale blur-[1px]"
                )}
              />
              {!nft.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Lock className="h-8 w-8 text-white opacity-80" />
                </div>
              )}
            </div>
            
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-medium">
                  {nft.name}
                </CardTitle>
                <div className="flex space-x-1">
                  <Badge variant="outline" className={getRarityColor(nft.rarity)}>
                    {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
                  </Badge>
                </div>
              </div>
              <CardDescription className="line-clamp-2 h-10">
                {nft.description}
              </CardDescription>
            </CardHeader>
            
            <CardFooter className="pt-0">
              <div className="flex w-full justify-between items-center">
                <Badge variant="outline" className="flex items-center">
                  {getCategoryIcon(nft.category)}
                  {nft.category.charAt(0).toUpperCase() + nft.category.slice(1)}
                </Badge>
                
                {nft.unlocked ? (
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" className="text-blue-600 gap-1">
                    <RotateCw className="h-4 w-4" />
                    Earn
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* NFT Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedNFT && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedNFT.name}</span>
                <Badge variant="outline" className={getRarityColor(selectedNFT.rarity)}>
                  {selectedNFT.rarity.charAt(0).toUpperCase() + selectedNFT.rarity.slice(1)}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                {selectedNFT.unlocked 
                  ? `Acquired on ${selectedNFT.acquiredDate} • Token #${selectedNFT.tokenId}`
                  : "Complete the required challenge to unlock this NFT"
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col space-y-4">
              <div className={cn(
                "relative aspect-square rounded-md overflow-hidden",
                !selectedNFT.unlocked && "filter grayscale blur-[1px]"
              )}>
                <img 
                  src={selectedNFT.image} 
                  alt={selectedNFT.name}
                  className="w-full h-full object-cover"
                />
                {!selectedNFT.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Lock className="h-12 w-12 text-white opacity-80" />
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedNFT.description}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Attributes</h4>
                <div className="grid grid-cols-3 gap-2">
                  {selectedNFT.attributes.map((attr, index) => (
                    <div key={index} className="bg-gray-50 rounded-md p-2 text-center">
                      <p className="text-xs text-muted-foreground">{attr.name}</p>
                      <p className="text-xs font-medium">{attr.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              {selectedNFT.unlocked ? (
                <Button className="w-full">
                  View on Blockchain
                </Button>
              ) : (
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  How to Earn
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
