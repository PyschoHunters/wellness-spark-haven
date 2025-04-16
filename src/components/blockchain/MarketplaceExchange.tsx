
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Coins, ShoppingBag, Tag, Search, ListFilter, Clock, ArrowUpDown } from 'lucide-react';
import { cn } from "@/lib/utils";

interface MarketItem {
  id: number;
  name: string;
  description: string;
  image: string;
  type: 'nft' | 'item' | 'membership';
  price: number;
  seller: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  listedSince: string;
}

export const MarketplaceExchange: React.FC = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [sortOption, setSortOption] = useState('recent');
  const [filterRarity, setFilterRarity] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [searchQuery, setSearchQuery] = useState('');
  
  const marketItems: MarketItem[] = [
    {
      id: 1,
      name: "Golden Dumbbell Trophy",
      description: "Ultra-rare NFT trophy awarded to winners of the Global Fitness Championship",
      image: "https://via.placeholder.com/300x300/f59e0b/ffffff?text=Trophy",
      type: 'nft',
      price: 5000,
      seller: "0xFitOracle",
      rarity: 'legendary',
      listedSince: "2 days ago"
    },
    {
      id: 2,
      name: "Premium Yoga Class Membership",
      description: "3-month premium membership to virtual yoga classes with certified instructors",
      image: "https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Yoga",
      type: 'membership',
      price: 800,
      seller: "YogaConnect",
      listedSince: "5 hours ago"
    },
    {
      id: 3,
      name: "Marathon Finisher Badge",
      description: "Limited edition NFT badge for completing the virtual marathon",
      image: "https://via.placeholder.com/300x300/ef4444/ffffff?text=Marathon",
      type: 'nft',
      price: 350,
      seller: "0xRunFast123",
      rarity: 'rare',
      listedSince: "1 week ago"
    },
    {
      id: 4,
      name: "Nutrition Consultation",
      description: "One-hour personal nutrition consultation with a certified dietitian",
      image: "https://via.placeholder.com/300x300/10b981/ffffff?text=Nutrition",
      type: 'item',
      price: 200,
      seller: "HealthEats",
      listedSince: "3 days ago"
    },
    {
      id: 5,
      name: "Premium Workout Template",
      description: "12-week advanced strength training program designed by elite coaches",
      image: "https://via.placeholder.com/300x300/3b82f6/ffffff?text=Workout",
      type: 'item',
      price: 120,
      seller: "FitPro",
      listedSince: "6 hours ago"
    },
    {
      id: 6,
      name: "First Steps Badge",
      description: "Beginner's achievement badge for completing your first 10 workouts",
      image: "https://via.placeholder.com/300x300/6366f1/ffffff?text=Badge",
      type: 'nft',
      price: 50,
      seller: "0xFitBeginner",
      rarity: 'common',
      listedSince: "12 hours ago"
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
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'nft': return 'bg-purple-100 text-purple-800';
      case 'item': return 'bg-blue-100 text-blue-800';
      case 'membership': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'nft': return <ShoppingBag className="h-4 w-4 mr-1" />;
      case 'item': return <Tag className="h-4 w-4 mr-1" />;
      case 'membership': return <Clock className="h-4 w-4 mr-1" />;
      default: return null;
    }
  };
  
  // Apply filters and sorting
  const filteredItems = marketItems.filter(item => {
    // Filter by search query
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by rarity
    if (filterRarity !== 'all' && item.rarity !== filterRarity) {
      return false;
    }
    
    // Filter by type
    if (filterType !== 'all' && item.type !== filterType) {
      return false;
    }
    
    // Filter by price range
    if (priceRange.min && Number(priceRange.min) > item.price) {
      return false;
    }
    if (priceRange.max && Number(priceRange.max) < item.price) {
      return false;
    }
    
    return true;
  });
  
  // Apply sorting
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortOption) {
      case 'priceAsc':
        return a.price - b.price;
      case 'priceDesc':
        return b.price - a.price;
      case 'nameAZ':
        return a.name.localeCompare(b.name);
      case 'nameZA':
        return b.name.localeCompare(a.name);
      case 'recent':
      default:
        // This is a simplified sort for the example
        // In a real app, you'd parse the dates properly
        return a.id < b.id ? 1 : -1;
    }
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already applied as we type, so nothing needs to be done here
    console.log("Searching for:", searchQuery);
  };
  
  const handlePurchase = (itemId: number) => {
    // In a real app, this would integrate with a blockchain smart contract
    console.log(`Purchasing item ${itemId}`);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="browse">Browse Marketplace</TabsTrigger>
          <TabsTrigger value="sell">Sell Items</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="space-y-6 pt-4">
          <div className="flex flex-col space-y-4">
            <form onSubmit={handleSearch} className="flex w-full space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search marketplace..." 
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
            
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <ListFilter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[120px] h-9">
                    <SelectValue placeholder="Item Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="nft">NFTs</SelectItem>
                    <SelectItem value="item">Items</SelectItem>
                    <SelectItem value="membership">Memberships</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterRarity} onValueChange={setFilterRarity}>
                  <SelectTrigger className="w-[120px] h-9">
                    <SelectValue placeholder="Rarity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rarities</SelectItem>
                    <SelectItem value="common">Common</SelectItem>
                    <SelectItem value="uncommon">Uncommon</SelectItem>
                    <SelectItem value="rare">Rare</SelectItem>
                    <SelectItem value="epic">Epic</SelectItem>
                    <SelectItem value="legendary">Legendary</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Min"
                    className="w-16 h-9"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                  />
                  <span>-</span>
                  <Input
                    placeholder="Max"
                    className="w-16 h-9"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[140px] h-9">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recently Listed</SelectItem>
                    <SelectItem value="priceAsc">Price: Low to High</SelectItem>
                    <SelectItem value="priceDesc">Price: High to Low</SelectItem>
                    <SelectItem value="nameAZ">Name: A-Z</SelectItem>
                    <SelectItem value="nameZA">Name: Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {sortedItems.length === 0 ? (
            <div className="text-center py-10">
              <ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No items found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-video overflow-hidden bg-gray-100">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                    />
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-medium">
                        {item.name}
                      </CardTitle>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className={getTypeColor(item.type)}>
                          {getTypeIcon(item.type)}
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </Badge>
                        {item.rarity && (
                          <Badge variant="outline" className={getRarityColor(item.rarity)}>
                            {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                      {item.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-amber-600 font-medium">
                        <Coins className="h-4 w-4 mr-1" />
                        {item.price} FTK
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Listed {item.listedSince}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Seller: {item.seller}
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90"
                      onClick={() => handlePurchase(item.id)}
                    >
                      Purchase
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="sell" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>List Your Item for Sale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="item-type">Item Type</Label>
                <Select defaultValue="nft">
                  <SelectTrigger id="item-type">
                    <SelectValue placeholder="Select item type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nft">NFT</SelectItem>
                    <SelectItem value="item">Physical Item</SelectItem>
                    <SelectItem value="membership">Membership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="item-name">Item Name</Label>
                <Input id="item-name" placeholder="Enter item name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="item-description">Description</Label>
                <Input id="item-description" placeholder="Describe your item" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="item-price">Price (FTK)</Label>
                <Input id="item-price" type="number" min="1" placeholder="100" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="item-image">Image URL</Label>
                <Input id="item-image" placeholder="https://example.com/image.jpg" />
              </div>
              
              <div className="rounded-lg border p-3 bg-amber-50 border-amber-200">
                <div className="flex items-start space-x-2">
                  <TrendingUp className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div className="flex-1 text-sm text-amber-800">
                    <p className="font-medium mb-1">Marketplace Fee</p>
                    <p className="text-xs">
                      A 2.5% fee will be applied to all sales. Tokens will be transferred to your wallet immediately after a successful sale.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                List Item for Sale
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
