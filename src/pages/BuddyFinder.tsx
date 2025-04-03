
import React, { useState } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, MapPin, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { showActionToast } from '@/utils/toast-utils';

// Sample data for workout buddies
const workoutBuddies = [
  {
    id: 1,
    name: 'Alex Johnson',
    age: 28,
    location: '2.3 miles away',
    interests: ['Yoga', 'Running', 'HIIT'],
    availability: 'Mornings',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    level: 'Intermediate'
  },
  {
    id: 2,
    name: 'Jamie Smith',
    age: 32,
    location: '0.8 miles away',
    interests: ['Weightlifting', 'CrossFit'],
    availability: 'Evenings',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2662&q=80',
    level: 'Advanced'
  },
  {
    id: 3,
    name: 'Taylor Kim',
    age: 25,
    location: '1.5 miles away',
    interests: ['Swimming', 'Pilates'],
    availability: 'Weekends',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80',
    level: 'Beginner'
  },
];

const BuddyFinder = () => {
  const [activeTab, setActiveTab] = useState('nearby');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    level: 'all',
    interests: 'all',
    availability: 'all'
  });

  const handleConnect = (buddyId: number) => {
    showActionToast(`Request sent to ${workoutBuddies.find(b => b.id === buddyId)?.name}!`);
  };

  // Filter buddies based on search term and filters
  const filteredBuddies = workoutBuddies.filter(buddy => {
    // Search term filtering
    if (searchTerm && !buddy.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !buddy.interests.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    // Filter by level
    if (filters.level !== 'all' && buddy.level !== filters.level) {
      return false;
    }
    
    // Filter by interest (simplified)
    if (filters.interests !== 'all' && !buddy.interests.includes(filters.interests)) {
      return false;
    }
    
    // Filter by availability
    if (filters.availability !== 'all' && buddy.availability !== filters.availability) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="max-w-md mx-auto px-4 pb-20">
      <Header 
        title="Find Workout Buddies" 
        subtitle="Connect with fitness friends nearby" 
      />
      
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search by name, activity..." 
            className="pl-10 pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-1 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className={`${showFilters ? 'text-fitness-primary' : 'text-gray-500'}`} size={18} />
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg animate-in fade-in-50 duration-300">
          <h3 className="text-sm font-medium mb-3">Filters</h3>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Level</label>
              <select 
                className="w-full text-sm p-2 rounded border"
                value={filters.level}
                onChange={(e) => setFilters({...filters, level: e.target.value})}
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Activity</label>
              <select 
                className="w-full text-sm p-2 rounded border"
                value={filters.interests}
                onChange={(e) => setFilters({...filters, interests: e.target.value})}
              >
                <option value="all">All Activities</option>
                <option value="Yoga">Yoga</option>
                <option value="Running">Running</option>
                <option value="HIIT">HIIT</option>
                <option value="Weightlifting">Weightlifting</option>
                <option value="Swimming">Swimming</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Availability</label>
              <select 
                className="w-full text-sm p-2 rounded border"
                value={filters.availability}
                onChange={(e) => setFilters({...filters, availability: e.target.value})}
              >
                <option value="all">Any Time</option>
                <option value="Mornings">Mornings</option>
                <option value="Evenings">Evenings</option>
                <option value="Weekends">Weekends</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="nearby" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="nearby">Nearby</TabsTrigger>
          <TabsTrigger value="suggested">Suggested</TabsTrigger>
        </TabsList>
        
        {['nearby', 'suggested'].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {filteredBuddies.length > 0 ? (
              filteredBuddies.map((buddy) => (
                <div key={buddy.id} className="bg-white rounded-lg shadow p-4 flex gap-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src={buddy.image} 
                      alt={buddy.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80';
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{buddy.name}, {buddy.age}</h3>
                      <Badge variant="outline" className="bg-gray-50">
                        {buddy.level}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <MapPin size={12} className="mr-1" />
                      <span>{buddy.location}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {buddy.interests.map((interest, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar size={12} className="mr-1" />
                        <span>{buddy.availability}</span>
                      </div>
                      
                      <Button 
                        size="sm" 
                        onClick={() => handleConnect(buddy.id)}
                        className="h-8"
                      >
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No workout buddies found matching your criteria</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      <Navigation />
    </div>
  );
};

export default BuddyFinder;
