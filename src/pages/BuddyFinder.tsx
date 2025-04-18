import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, MapPin, Calendar, Shield, Check, X, Heart, UserCheck, Dumbbell, Flame, Trophy, Users, MessageSquare, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { showActionToast } from '@/utils/toast-utils';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import WorkoutBuddyFinder from '@/components/WorkoutBuddyFinder';
import WorkoutBuddyChat from '@/components/WorkoutBuddyChat';

const workoutBuddies = [
  {
    id: 1,
    name: 'Arjun Sharma',
    age: 28,
    location: '2.3 miles away',
    interests: ['Yoga', 'Running', 'HIIT'],
    availability: 'Mornings',
    availabilityDays: ['Monday', 'Wednesday', 'Friday'],
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    level: 'Intermediate',
    bio: 'Fitness enthusiast focused on mind-body balance. Love outdoor workouts and trying new routines!',
    matchPercentage: 87,
    achievements: ['10K Runner', 'Yoga Master'],
    connectionStatus: 'none'
  },
  {
    id: 2,
    name: 'Priya Patel',
    age: 32,
    location: '0.8 miles away',
    interests: ['Weightlifting', 'CrossFit'],
    availability: 'Evenings',
    availabilityDays: ['Tuesday', 'Thursday', 'Saturday'],
    image: 'https://images.unsplash.com/photo-1581182800629-7d90925ad072?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2662&q=80',
    level: 'Advanced',
    bio: 'Competitive lifter focused on strength gains. Looking for serious training partners.',
    matchPercentage: 72,
    achievements: ['Deadlift Pro', '30-Day Challenge'],
    connectionStatus: 'connected'
  },
  {
    id: 3,
    name: 'Neha Singh',
    age: 25,
    location: '1.5 miles away',
    interests: ['Swimming', 'Pilates'],
    availability: 'Weekends',
    availabilityDays: ['Saturday', 'Sunday'],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD3PjtcB-W5KNBduwG6OLLyip5Is2m69gOcg&s',
    level: 'Beginner',
    bio: 'Just starting my fitness journey. Looking for supportive workout friends to learn with.',
    matchPercentage: 91,
    achievements: ['First Mile', 'Newbie'],
    connectionStatus: 'pending'
  },
  {
    id: 4,
    name: 'Vikram Mehta',
    age: 30,
    location: '3.2 miles away',
    interests: ['Cycling', 'Boxing'],
    availability: 'Afternoons',
    availabilityDays: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
    image: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    level: 'Advanced',
    bio: 'Endurance athlete training for triathlons. Looking for cycling and running partners.',
    matchPercentage: 64,
    achievements: ['Century Ride', 'Boxing Champion'],
    connectionStatus: 'none'
  },
  {
    id: 5,
    name: 'Divya Nair',
    age: 27,
    location: '1.1 miles away',
    interests: ['Zumba', 'Yoga', 'Dancing'],
    availability: 'Evenings',
    availabilityDays: ['Tuesday', 'Thursday', 'Friday'],
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=988&q=80',
    level: 'Intermediate',
    bio: 'Dance fitness enthusiast. Love high-energy workouts that make you forget you\'re exercising!',
    matchPercentage: 85,
    achievements: ['Dance Master', 'Flexibility Pro'],
    connectionStatus: 'none'
  }
];

const activityTypes = [
  'Yoga', 'Running', 'HIIT', 'Weightlifting', 'CrossFit', 'Swimming', 
  'Pilates', 'Cycling', 'Boxing', 'Zumba', 'Dancing', 'Basketball',
  'Tennis', 'Soccer', 'Hiking', 'Rock Climbing', 'Martial Arts'
];

const allAvailabilityOptions = [
  'Mornings', 'Afternoons', 'Evenings', 'Weekends'
];

const BuddyFinder = () => {
  const [activeTab, setActiveTab] = useState('nearby');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    level: 'all',
    interests: 'all',
    availability: 'all',
    distance: 5
  });

  const [selectedBuddy, setSelectedBuddy] = useState(null);
  const [showBuddyDetail, setShowBuddyDetail] = useState(false);

  const [buddies, setBuddies] = useState(workoutBuddies);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(0);

  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const pendingCount = buddies.filter(b => b.connectionStatus === 'pending').length;
    setPendingRequests(pendingCount);
  }, [buddies]);

  const handleConnect = (buddyId) => {
    try {
      setBuddies(prevBuddies => 
        prevBuddies.map(buddy => {
          if (buddy.id === buddyId) {
            if (buddy.connectionStatus === 'none') {
              showActionToast(`Connection request sent to ${buddy.name}!`);
              return { ...buddy, connectionStatus: 'pending' };
            } else if (buddy.connectionStatus === 'pending') {
              showActionToast(`Connection with ${buddy.name} accepted!`);
              return { ...buddy, connectionStatus: 'connected' };
            } else {
              showActionToast(`You've disconnected from ${buddy.name}`);
              return { ...buddy, connectionStatus: 'none' };
            }
          }
          return buddy;
        })
      );
    } catch (error) {
      console.error("Error handling connection:", error);
      showActionToast("Something went wrong. Please try again.");
    }
  };

  const calculateCompatibility = (buddy) => {
    let score = 0;
    
    if (filters.level === 'all' || buddy.level === filters.level) {
      score += 30;
    }
    
    if (filters.interests === 'all' || buddy.interests.includes(filters.interests)) {
      score += 40;
    }
    
    if (filters.availability === 'all' || buddy.availability === filters.availability) {
      score += 30;
    }
    
    return Math.min(score, 100);
  };

  const filteredBuddies = buddies.filter(buddy => {
    if (searchTerm && !buddy.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !buddy.interests.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    if (filters.level !== 'all' && buddy.level !== filters.level) {
      return false;
    }
    
    if (filters.interests !== 'all' && !buddy.interests.includes(filters.interests)) {
      return false;
    }
    
    if (filters.availability !== 'all' && buddy.availability !== filters.availability) {
      return false;
    }
    
    const distanceMiles = parseFloat(buddy.location.split(' ')[0]);
    if (distanceMiles > filters.distance) {
      return false;
    }
    
    return true;
  });

  const suggestedBuddies = [...filteredBuddies].sort((a, b) => {
    return b.matchPercentage - a.matchPercentage;
  });

  const handleViewBuddyDetail = (buddy) => {
    setSelectedBuddy(buddy);
    setShowBuddyDetail(true);
  };

  const getConnectionStatus = (status) => {
    switch(status) {
      case 'none':
        return { text: 'Connect', variant: 'default' as const };
      case 'pending':
        return { text: 'Accept', variant: 'secondary' as const };
      case 'connected':
        return { text: 'Disconnect', variant: 'outline' as const };
      default:
        return { text: 'Connect', variant: 'default' as const };
    }
  };

  const handleOpenChat = (buddy) => {
    setSelectedBuddy(buddy);
    setShowChat(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20">
      <div className="flex flex-col gap-4 mb-6">
        <Header 
          title="Find Workout Buddies" 
          subtitle="Connect with fitness friends nearby" 
        />
        
        <button
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full p-3 shadow-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Users size={20} />
          <span className="font-medium">Find New Buddies</span>
        </button>
      </div>
      
      {pendingRequests > 0 && (
        <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-center justify-between">
          <div className="flex items-center">
            <UserCheck size={18} className="text-amber-600 mr-2" />
            <span className="text-sm text-amber-800">
              {pendingRequests} pending connection{pendingRequests > 1 ? 's' : ''}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-100 p-1 h-auto"
            onClick={() => setActiveTab('pending')}
          >
            View
          </Button>
        </div>
      )}
      
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
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg animate-in fade-in-50 duration-300">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-700">Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs p-1 h-auto text-blue-600"
              onClick={() => setAdvancedSearch(!advancedSearch)}
            >
              {advancedSearch ? 'Basic Filters' : 'Advanced Search'}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Level</label>
              <select 
                className="w-full text-sm p-2 rounded border focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
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
              <label className="text-xs text-gray-500 block mb-1">Availability</label>
              <select 
                className="w-full text-sm p-2 rounded border focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                value={filters.availability}
                onChange={(e) => setFilters({...filters, availability: e.target.value})}
              >
                <option value="all">Any Time</option>
                {allAvailabilityOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="text-xs text-gray-500 block mb-1">Activity Type</label>
            <select 
              className="w-full text-sm p-2 rounded border focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
              value={filters.interests}
              onChange={(e) => setFilters({...filters, interests: e.target.value})}
            >
              <option value="all">All Activities</option>
              {activityTypes.map(activity => (
                <option key={activity} value={activity}>{activity}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-xs text-gray-500 flex justify-between mb-1">
              <span>Maximum Distance: {filters.distance} miles</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={filters.distance}
              onChange={(e) => setFilters({...filters, distance: parseFloat(e.target.value)})}
              className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      )}

      <Tabs defaultValue="nearby" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="nearby">Nearby</TabsTrigger>
          <TabsTrigger value="suggested">Suggested</TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pending
            {pendingRequests > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {pendingRequests}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="nearby" className="space-y-4">
          {filteredBuddies.length > 0 ? (
            filteredBuddies.map((buddy) => (
              <div key={buddy.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 flex gap-3">
                <div 
                  className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 cursor-pointer border-2 border-gray-100"
                  onClick={() => handleViewBuddyDetail(buddy)}
                >
                  <img 
                    src={buddy.image} 
                    alt={buddy.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80';
                    }}
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 
                      className="font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleViewBuddyDetail(buddy)}
                    >
                      {buddy.name}, {buddy.age}
                    </h3>
                    <Badge variant="outline" className={`
                      ${buddy.level === 'Beginner' ? 'bg-green-50 text-green-700 border-green-200' : 
                        buddy.level === 'Intermediate' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        'bg-purple-50 text-purple-700 border-purple-200'}
                    `}>
                      {buddy.level}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <MapPin size={12} className="mr-1" />
                    <span>{buddy.location}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {buddy.interests.slice(0, 2).map((interest, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                    {buddy.interests.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{buddy.interests.length - 2}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar size={12} className="mr-1" />
                      <span>{buddy.availability}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant={getConnectionStatus(buddy.connectionStatus).variant}
                        onClick={() => handleConnect(buddy.id)}
                        className="h-8"
                      >
                        {buddy.connectionStatus === 'pending' ? (
                          <Check size={16} className="mr-1" />
                        ) : buddy.connectionStatus === 'connected' ? (
                          <UserCheck size={16} className="mr-1" />
                        ) : (
                          <Heart size={16} className="mr-1" />
                        )}
                        {getConnectionStatus(buddy.connectionStatus).text}
                      </Button>
                      
                      {buddy.connectionStatus === 'connected' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenChat(buddy)}
                        >
                          <MessageSquare size={16} className="mr-1" />
                          Chat
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 mb-1">No workout buddies found matching your criteria</p>
              <p className="text-sm text-gray-400">Try adjusting your filters</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="suggested" className="space-y-4">
          {suggestedBuddies.length > 0 ? (
            suggestedBuddies.map((buddy) => (
              <div key={buddy.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-4 flex gap-3">
                <div 
                  className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 cursor-pointer border-2 border-gray-100"
                  onClick={() => handleViewBuddyDetail(buddy)}
                >
                  <img 
                    src={buddy.image} 
                    alt={buddy.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80';
                    }}
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 
                      className="font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleViewBuddyDetail(buddy)}
                    >
                      {buddy.name}, {buddy.age}
                    </h3>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {buddy.matchPercentage}% Match
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <MapPin size={12} className="mr-1" />
                    <span>{buddy.location}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2 mb-1">
                    {buddy.interests.map((interest, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="mt-2 mb-3">
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          buddy.matchPercentage >= 80 ? 'bg-green-500' : 
                          buddy.matchPercentage >= 60 ? 'bg-blue-500' : 
                          'bg-amber-500'
                        }`}
                        style={{ width: `${buddy.matchPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar size={12} className="mr-1" />
                      <span>{buddy.availability}</span>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant={getConnectionStatus(buddy.connectionStatus).variant}
                      onClick={() => handleConnect(buddy.id)}
                      className="h-8"
                    >
                      {buddy.connectionStatus === 'pending' ? (
                        <Check size={16} className="mr-1" />
                      ) : buddy.connectionStatus === 'connected' ? (
                        <UserCheck size={16} className="mr-1" />
                      ) : (
                        <Heart size={16} className="mr-1" />
                      )}
                      {getConnectionStatus(buddy.connectionStatus).text}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No suggested workout buddies available</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          {buddies.filter(b => b.connectionStatus === 'pending').length > 0 ? (
            buddies
              .filter(b => b.connectionStatus === 'pending')
              .map((buddy) => (
                <div key={buddy.id} className="bg-white rounded-lg shadow-sm border border-amber-100 p-4 flex gap-3">
                  <div 
                    className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 cursor-pointer border-2 border-amber-100"
                    onClick={() => handleViewBuddyDetail(buddy)}
                  >
                    <img 
                      src={buddy.image} 
                      alt={buddy.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80';
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 
                        className="font-semibold cursor-pointer hover:text-amber-600 transition-colors"
                        onClick={() => handleViewBuddyDetail(buddy)}
                      >
                        {buddy.name}, {buddy.age}
                      </h3>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        Pending
                      </Badge>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <MapPin size={12} className="mr-1" />
                      <span>{buddy.location}</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {buddy.bio}
                    </p>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center text-xs text-gray-500">
                        <Dumbbell size={12} className="mr-1" />
                        <span>{buddy.level}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setBuddies(prevBuddies => 
                              prevBuddies.map(b => 
                                b.id === buddy.id ? {...b, connectionStatus: 'none'} : b
                              )
                            );
                            showActionToast(`Request from ${buddy.name} declined`);
                          }}
                          className="h-8 border-gray-300"
                        >
                          <X size={16} className="mr-1" />
                          Decline
                        </Button>
                        
                        <Button 
                          size="sm"
                          onClick={() => handleConnect(buddy.id)}
                          className="h-8"
                        >
                          <Check size={16} className="mr-1" />
                          Accept
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserCheck size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 mb-1">No pending connection requests</p>
              <p className="text-sm text-gray-400">When users want to connect, they'll appear here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {selectedBuddy && (
        <Dialog open={showBuddyDetail} onOpenChange={setShowBuddyDetail}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Buddy Profile</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-4 border-gray-100">
                <img 
                  src={selectedBuddy.image} 
                  alt={selectedBuddy.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80';
                  }}
                />
              </div>
              <h2 className="text-xl font-semibold">{selectedBuddy.name}, {selectedBuddy.age}</h2>
              
              <div className="flex items-center gap-2 mt-1 mb-2">
                <MapPin size={14} className="text-gray-500" />
                <span className="text-sm text-gray-600">{selectedBuddy.location}</span>
              </div>
              
              <div className="flex gap-1 mb-4">
                {selectedBuddy.achievements.map((achievement, idx) => (
                  <Badge key={idx} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    <Trophy size={12} className="mr-1" />
                    {achievement}
                  </Badge>
                ))}
              </div>
              
              <div className="w-full mb-4">
                <div className="flex justify-between text-sm">
                  <span>Match Score</span>
                  <span className="font-medium">{selectedBuddy.matchPercentage}%</span>
                </div>
                <Progress value={selectedBuddy.matchPercentage} className="h-2 mt-1" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Shield size={14} className="mr-1 text-blue-600" />
                  About
                </h3>
                <p className="text-sm text-gray-600">{selectedBuddy.bio}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Dumbbell size={14} className="mr-1 text-blue-600" />
                    Fitness Level
                  </h3>
                  <p className="text-sm">{selectedBuddy.level}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Calendar size={14} className="mr-1 text-blue-600" />
                    Availability
                  </h3>
                  <p className="text-sm">{selectedBuddy.availability}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Flame size={14} className="mr-1 text-blue-600" />
                  Workout Interests
                </h3>
                <div className="flex flex-wrap gap-1">
                  {selectedBuddy.interests.map((interest, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Calendar size={14} className="mr-1 text-blue-600" />
                  Available Days
                </h3>
                <div className="flex flex-wrap gap-1">
                  {selectedBuddy.availabilityDays.map((day, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs bg-white">
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <div className="w-full flex gap-2">
                <Button
                  variant={getConnectionStatus(selectedBuddy.connectionStatus).variant}
                  onClick={() => {
                    handleConnect(selectedBuddy.id);
                    setShowBuddyDetail(false);
                  }}
                  className="flex-1"
                >
                  {selectedBuddy.connectionStatus === 'pending' ? (
                    <Check size={16} className="mr-1" />
                  ) : selectedBuddy.connectionStatus === 'connected' ? (
                    <UserCheck size={16} className="mr-1" />
                  ) : (
                    <Heart size={16} className="mr-1" />
                  )}
                  {getConnectionStatus(selectedBuddy.connectionStatus).text}
                </Button>
                
                {selectedBuddy.connectionStatus === 'connected' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowBuddyDetail(false);
                      setShowChat(true);
                    }}
                  >
                    <MessageSquare size={16} className="mr-1" />
                    Chat
                  </Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {selectedBuddy && (
        <WorkoutBuddyChat
          buddy={{
            id: selectedBuddy.id,
            name: selectedBuddy.name,
            avatar: selectedBuddy.image,
            interests: selectedBuddy.interests,
            level: selectedBuddy.level
          }}
          isOpen={showChat}
          onClose={() => {
            setShowChat(false);
            setSelectedBuddy(null);
          }}
        />
      )}
      
      <WorkoutBuddyFinder />
      
      <Navigation />
    </div>
  );
};

export default BuddyFinder;
