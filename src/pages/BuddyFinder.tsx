
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
    name: 'Ananya Gupta',
    age: 28,
    location: '1.2 miles away',
    interests: ['Yoga', 'Running', 'HIIT'],
    availability: 'Mornings',
    availabilityDays: ['Monday', 'Wednesday', 'Friday'],
    image: 'https://www.ghru-southasia.org/wp-content/uploads/2019/12/ananya-gupta.jpg',
    level: 'Intermediate',
    bio: 'Fitness enthusiast focused on mind-body balance. Love outdoor workouts and trying new routines!',
    matchPercentage: 87,
    achievements: ['10K Runner', 'Yoga Master'],
    connectionStatus: 'none'
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
  const [activeTab, setActiveTab] = useState('find');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [buddyDetailOpen, setBuddyDetailOpen] = useState(false);
  const [selectedBuddy, setSelectedBuddy] = useState<any>(null);

  const filteredBuddies = workoutBuddies.filter(buddy => {
    // Filter by search term
    const matchesSearch = buddy.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         buddy.interests.some(interest => interest.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by activities if any are selected
    const matchesActivities = selectedActivities.length === 0 || 
                             buddy.interests.some(interest => selectedActivities.includes(interest));
    
    // Filter by availability if any are selected
    const matchesAvailability = selectedAvailability.length === 0 || 
                               selectedAvailability.includes(buddy.availability);
    
    return matchesSearch && matchesActivities && matchesAvailability;
  });

  const handleConnect = (buddyId: number) => {
    // Update the connection status in the local state
    const updatedBuddies = workoutBuddies.map(b => 
      b.id === buddyId ? {...b, connectionStatus: 'connected'} : b
    );
    // In a real app, you would update this in a database
    showActionToast("Connection request sent!");
  };

  const handleViewProfile = (buddy: any) => {
    setSelectedBuddy(buddy);
    setBuddyDetailOpen(true);
  };

  const toggleActivityFilter = (activity: string) => {
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(selectedActivities.filter(a => a !== activity));
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const toggleAvailabilityFilter = (availability: string) => {
    if (selectedAvailability.includes(availability)) {
      setSelectedAvailability(selectedAvailability.filter(a => a !== availability));
    } else {
      setSelectedAvailability([...selectedAvailability, availability]);
    }
  };

  const clearFilters = () => {
    setSelectedActivities([]);
    setSelectedAvailability([]);
  };

  return (
    <div className="container mx-auto pb-16">
      <Header 
        title="Workout Buddies" 
        subtitle="Connect with fitness enthusiasts near you" 
      />

      <Tabs defaultValue="find" className="w-full mt-4">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger 
            value="find" 
            onClick={() => setActiveTab('find')}
            className="text-base"
          >
            <Users className="mr-2 h-4 w-4" />
            Find Buddies
          </TabsTrigger>
          <TabsTrigger 
            value="messages" 
            onClick={() => setActiveTab('messages')}
            className="text-base"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="find" className="space-y-4">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or activity..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute right-0 top-0 h-full rounded-l-none"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {showFilters && (
            <div className="p-4 mb-6 bg-gray-50 rounded-lg border">
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Activities</h3>
                <div className="flex flex-wrap gap-2">
                  {activityTypes.slice(0, 8).map(activity => (
                    <Badge 
                      key={activity}
                      variant={selectedActivities.includes(activity) ? "default" : "outline"}
                      className={`cursor-pointer ${selectedActivities.includes(activity) ? "bg-primary" : ""}`}
                      onClick={() => toggleActivityFilter(activity)}
                    >
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Availability</h3>
                <div className="flex flex-wrap gap-2">
                  {allAvailabilityOptions.map(availability => (
                    <Badge 
                      key={availability}
                      variant={selectedAvailability.includes(availability) ? "default" : "outline"}
                      className={`cursor-pointer ${selectedAvailability.includes(availability) ? "bg-primary" : ""}`}
                      onClick={() => toggleAvailabilityFilter(availability)}
                    >
                      {availability}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {filteredBuddies.map(buddy => (
              <div 
                key={buddy.id}
                className="flex items-center p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
              >
                <div 
                  className="h-16 w-16 rounded-full bg-cover bg-center mr-4 flex-shrink-0"
                  style={{ backgroundImage: `url(${buddy.image})` }}
                ></div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{buddy.name}, {buddy.age}</h3>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{buddy.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center mb-1">
                        <span className="text-xs font-medium mr-2">Match</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {buddy.matchPercentage}%
                        </Badge>
                      </div>
                      <div className="w-20">
                        <Progress value={buddy.matchPercentage} className="h-1" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {buddy.interests.slice(0, 3).map((interest, idx) => (
                      <Badge 
                        key={idx} 
                        variant="secondary" 
                        className="text-xs"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex mt-4 justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{buddy.availability}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8"
                        onClick={() => handleViewProfile(buddy)}
                      >
                        View Profile
                      </Button>
                      {buddy.connectionStatus === 'connected' ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Connected
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="h-8"
                          onClick={() => handleConnect(buddy.id)}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredBuddies.length === 0 && (
              <div className="text-center py-10">
                <Users className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No matching workout buddies</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <WorkoutBuddyChat />
        </TabsContent>
      </Tabs>
      
      {/* Buddy Detail Dialog */}
      <Dialog open={buddyDetailOpen} onOpenChange={setBuddyDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedBuddy && (
            <>
              <DialogHeader>
                <DialogTitle>Buddy Profile</DialogTitle>
              </DialogHeader>
              
              <div className="flex flex-col items-center mt-2">
                <div 
                  className="h-24 w-24 rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${selectedBuddy.image})` }}
                ></div>
                <h2 className="text-xl font-bold mt-4">{selectedBuddy.name}, {selectedBuddy.age}</h2>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{selectedBuddy.location}</span>
                </div>
                
                <div className="flex items-center mt-2">
                  <Badge className="bg-indigo-100 text-indigo-800 border-0 mr-2">
                    {selectedBuddy.level}
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {selectedBuddy.matchPercentage}% Match
                  </Badge>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">About</h3>
                <p className="text-muted-foreground">{selectedBuddy.bio}</p>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedBuddy.interests.map((interest: string, idx: number) => (
                    <Badge key={idx} variant="secondary">{interest}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">Availability</h3>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{selectedBuddy.availability} - </span>
                  <span className="ml-1 text-muted-foreground">
                    {selectedBuddy.availabilityDays.join(', ')}
                  </span>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">Achievements</h3>
                <div className="space-y-2">
                  {selectedBuddy.achievements.map((achievement: string, idx: number) => (
                    <div key={idx} className="flex items-center">
                      <Trophy className="h-4 w-4 mr-2 text-amber-500" />
                      <span>{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <DialogFooter className="mt-6">
                {selectedBuddy.connectionStatus === 'connected' ? (
                  <Button 
                    variant="ghost"
                    className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Connected
                  </Button>
                ) : (
                  <Button onClick={() => handleConnect(selectedBuddy.id)}>
                    <Check className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default BuddyFinder;
