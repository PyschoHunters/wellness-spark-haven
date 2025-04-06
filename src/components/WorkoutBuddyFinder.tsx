
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  Calendar, 
  Dumbbell, 
  MessageSquare,
  Filter,
  ArrowLeft,
  Search,
  CheckSquare,
  UserPlus,
  Shield,
  Clock,
  Star,
  BarChart,
  Zap,
  Target
} from 'lucide-react';
import { showActionToast } from '@/utils/toast-utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

interface WorkoutBuddy {
  id: number;
  name: string;
  avatar: string;
  location: string;
  distance: string;
  fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  preferredWorkouts: string[];
  availability: string[];
  matchPercentage: number;
  personality?: string[];
  goals?: string[];
  achievements?: number;
  experience?: number;
  verified?: boolean;
  compatibility?: {
    schedule: number;
    goals: number;
    intensity: number;
    location: number;
  };
}

const WorkoutBuddyFinder: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'main' | 'filter' | 'details' | 'compatibility'>('main');
  const [selectedBuddy, setSelectedBuddy] = useState<WorkoutBuddy | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    maxDistance: 10,
    fitnessLevel: 'all',
    workoutType: 'all',
    availability: 'all',
    minCompatibility: 60,
    verifiedOnly: false,
    withGoals: false,
  });
  const [activeTab, setActiveTab] = useState('nearby');

  const buddies: WorkoutBuddy[] = [
    {
      id: 1,
      name: "Ananya Gupta",
      avatar: "https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      location: "Downtown",
      distance: "1.2 km",
      fitnessLevel: "Intermediate",
      preferredWorkouts: ["HIIT", "Yoga", "Running"],
      availability: ["Mon-Wed (Evening)", "Sat (Morning)"],
      matchPercentage: 87,
      personality: ["Motivating", "Consistent", "Social"],
      goals: ["Lose weight", "Build endurance"],
      achievements: 12,
      experience: 3,
      verified: true,
      compatibility: {
        schedule: 90,
        goals: 85,
        intensity: 80,
        location: 95
      }
    },
    {
      id: 2,
      name: "Rohit Verma",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      location: "Westside",
      distance: "2.8 km",
      fitnessLevel: "Advanced",
      preferredWorkouts: ["Weightlifting", "CrossFit", "Swimming"],
      availability: ["Tue-Thu (Morning)", "Sun (Afternoon)"],
      matchPercentage: 75,
      personality: ["Focused", "Intense", "Disciplined"],
      goals: ["Build muscle", "Improve strength"],
      achievements: 28,
      experience: 5,
      verified: true,
      compatibility: {
        schedule: 65,
        goals: 70,
        intensity: 90,
        location: 75
      }
    },
    {
      id: 3,
      name: "Kavita Sharma",
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      location: "Northside",
      distance: "0.5 km",
      fitnessLevel: "Beginner",
      preferredWorkouts: ["Walking", "Light Cardio", "Yoga"],
      availability: ["Mon-Fri (Afternoon)", "Weekend (Flexible)"],
      matchPercentage: 92,
      personality: ["Supportive", "Patient", "Encouraging"],
      goals: ["Improve flexibility", "Stress reduction"],
      achievements: 5,
      experience: 1,
      verified: false,
      compatibility: {
        schedule: 95,
        goals: 80,
        intensity: 100,
        location: 98
      }
    },
    {
      id: 4,
      name: "Rajesh Kumar",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      location: "Eastside",
      distance: "3.5 km",
      fitnessLevel: "Intermediate",
      preferredWorkouts: ["Running", "Group Classes", "Tennis"],
      availability: ["Weekends", "Wed (Evening)"],
      matchPercentage: 68,
      personality: ["Competitive", "Energetic", "Social"],
      goals: ["Improve cardio", "Train for marathon"],
      achievements: 15,
      experience: 4,
      verified: true,
      compatibility: {
        schedule: 60,
        goals: 65,
        intensity: 70,
        location: 65
      }
    },
    {
      id: 5,
      name: "Meera Iyer",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      location: "Central",
      distance: "0.8 km",
      fitnessLevel: "Advanced",
      preferredWorkouts: ["Kickboxing", "Martial Arts", "Pilates"],
      availability: ["Mon-Fri (Morning)", "Sat (Evening)"],
      matchPercentage: 81,
      personality: ["Disciplined", "Determined", "Technical"],
      goals: ["Improve technique", "Build core strength"],
      achievements: 22,
      experience: 6,
      verified: true,
      compatibility: {
        schedule: 75,
        goals: 85,
        intensity: 90,
        location: 85
      }
    },
    {
      id: 6,
      name: "Arjun Malhotra",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      location: "Southside",
      distance: "2.1 km",
      fitnessLevel: "Intermediate",
      preferredWorkouts: ["Cycling", "Rock Climbing", "Calisthenics"],
      availability: ["Tue-Thu (Evening)", "Sun (Morning)"],
      matchPercentage: 78,
      personality: ["Adventurous", "Balanced", "Analytical"],
      goals: ["Improve balance", "Outdoor fitness"],
      achievements: 17,
      experience: 3,
      verified: false,
      compatibility: {
        schedule: 70,
        goals: 75,
        intensity: 85,
        location: 80
      }
    },
    {
      id: 7,
      name: "Priya Nair",
      avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      location: "Northwest",
      distance: "1.7 km",
      fitnessLevel: "Beginner",
      preferredWorkouts: ["Swimming", "Pilates", "Meditation"],
      availability: ["Mon/Wed/Fri (Morning)", "Weekend (Afternoon)"],
      matchPercentage: 85,
      personality: ["Calm", "Consistent", "Mindful"],
      goals: ["Better posture", "Core strength"],
      achievements: 8,
      experience: 2,
      verified: true,
      compatibility: {
        schedule: 85,
        goals: 90,
        intensity: 75,
        location: 85
      }
    }
  ];

  const suggestedBuddies = [...buddies].sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 5);

  const filteredBuddies = buddies.filter(buddy => {
    // Search filter
    if (searchTerm && !buddy.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !buddy.preferredWorkouts.some(workout => workout.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    // Distance filter
    const distanceNum = parseFloat(buddy.distance);
    if (filters.maxDistance < distanceNum) {
      return false;
    }
    
    // Fitness level filter
    if (filters.fitnessLevel !== 'all' && buddy.fitnessLevel !== filters.fitnessLevel) {
      return false;
    }
    
    // Workout type filter
    if (filters.workoutType !== 'all') {
      if (!buddy.preferredWorkouts.some(workout => 
        workout.toLowerCase().includes(filters.workoutType.toLowerCase()))) {
        return false;
      }
    }
    
    // Compatibility filter
    if (buddy.matchPercentage < filters.minCompatibility) {
      return false;
    }
    
    // Verified filter
    if (filters.verifiedOnly && !buddy.verified) {
      return false;
    }
    
    // Goals filter
    if (filters.withGoals && (!buddy.goals || buddy.goals.length === 0)) {
      return false;
    }
    
    // Availability filter
    if (filters.availability !== 'all') {
      if (!buddy.availability.some(time => 
        time.toLowerCase().includes(filters.availability.toLowerCase()))) {
        return false;
      }
    }
    
    return true;
  });

  const displayBuddies = activeTab === 'nearby' ? filteredBuddies : 
                          activeTab === 'suggested' ? suggestedBuddies.filter(buddy => filteredBuddies.includes(buddy)) : 
                          filteredBuddies;

  const handleOpenDialog = () => {
    setIsOpen(true);
    setView('main');
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setSelectedBuddy(null);
    setView('main');
  };

  const handleBuddySelect = (buddy: WorkoutBuddy) => {
    setSelectedBuddy(buddy);
    setView('details');
  };

  const handleContactBuddy = () => {
    if (!selectedBuddy) return;
    showActionToast(`Message sent to ${selectedBuddy.name}!`);
    handleCloseDialog();
  };

  const handleApplyFilters = () => {
    setView('main');
    showActionToast("Filters applied");
  };

  const handleViewCompatibility = () => {
    if (!selectedBuddy) return;
    setView('compatibility');
  };

  return (
    <>
      <button
        className="fixed bottom-24 right-4 z-20 bg-fitness-primary text-white rounded-full p-3 shadow-lg flex items-center gap-2"
        onClick={handleOpenDialog}
      >
        <Users size={20} />
        <span className="font-medium">Find Buddy</span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {view === 'main' ? (
                <>
                  <Users size={18} /> Workout Buddies
                </>
              ) : view === 'filter' ? (
                <>
                  <Filter size={18} /> Filter Buddies
                </>
              ) : view === 'compatibility' ? (
                <>
                  <BarChart size={18} /> Compatibility Analysis
                </>
              ) : (
                <>
                  <Users size={18} /> Buddy Details
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {view === 'main' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by name or workout"
                    className="pl-8 pr-4 py-2 w-full rounded-lg border border-gray-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  className="p-2 rounded-lg border border-gray-200"
                  onClick={() => setView('filter')}
                >
                  <Filter size={20} />
                </button>
              </div>
              
              <Tabs defaultValue="nearby" onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-2">
                  <TabsTrigger value="nearby">Nearby</TabsTrigger>
                  <TabsTrigger value="suggested">Best Match</TabsTrigger>
                </TabsList>
                
                <p className="text-sm text-muted-foreground">
                  {activeTab === 'nearby' ? 'Workout partners near your location' : 'Partners matched to your fitness profile'}
                </p>
              </Tabs>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {displayBuddies.length > 0 ? (
                  displayBuddies.map((buddy) => (
                    <div
                      key={buddy.id}
                      className="p-3 border border-gray-100 rounded-xl flex gap-3 items-center cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleBuddySelect(buddy)}
                    >
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={buddy.avatar} alt={buddy.name} />
                          <AvatarFallback>{buddy.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {buddy.verified && (
                          <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                            <CheckSquare size={12} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{buddy.name}</h3>
                          <span className="bg-fitness-primary/10 text-fitness-primary text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Star size={12} />
                            {buddy.matchPercentage}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <MapPin size={12} />
                          <span>{buddy.location} • {buddy.distance}</span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {buddy.preferredWorkouts.slice(0, 2).map((workout, i) => (
                            <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                              {workout}
                            </span>
                          ))}
                          {buddy.preferredWorkouts.length > 2 && (
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                              +{buddy.preferredWorkouts.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>No matching workout buddies found</p>
                    <p className="text-sm mt-1">Try adjusting your filters</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {view === 'filter' && (
            <div className="space-y-4">
              <button
                className="flex items-center gap-1 text-sm font-medium"
                onClick={() => setView('main')}
              >
                <ArrowLeft size={16} />
                <span>Back to results</span>
              </button>
              
              <div>
                <label className="block text-sm font-medium mb-1">Maximum Distance</label>
                <div className="flex items-center gap-2">
                  <Slider
                    min={1}
                    max={20}
                    step={0.5}
                    value={[filters.maxDistance]}
                    onValueChange={(value) => setFilters({...filters, maxDistance: value[0]})}
                  />
                  <span className="text-sm w-12 text-right">{filters.maxDistance} km</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Fitness Level</label>
                <select
                  className="w-full p-2 rounded-lg border border-gray-200"
                  value={filters.fitnessLevel}
                  onChange={(e) => setFilters({...filters, fitnessLevel: e.target.value})}
                >
                  <option value="all">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Workout Type</label>
                <select
                  className="w-full p-2 rounded-lg border border-gray-200"
                  value={filters.workoutType}
                  onChange={(e) => setFilters({...filters, workoutType: e.target.value})}
                >
                  <option value="all">All Types</option>
                  <option value="yoga">Yoga</option>
                  <option value="running">Running</option>
                  <option value="hiit">HIIT</option>
                  <option value="weight">Weightlifting</option>
                  <option value="cardio">Cardio</option>
                  <option value="martial">Martial Arts</option>
                  <option value="pilates">Pilates</option>
                  <option value="cycling">Cycling</option>
                  <option value="swimming">Swimming</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Availability</label>
                <select
                  className="w-full p-2 rounded-lg border border-gray-200"
                  value={filters.availability}
                  onChange={(e) => setFilters({...filters, availability: e.target.value})}
                >
                  <option value="all">Any Time</option>
                  <option value="morning">Mornings</option>
                  <option value="afternoon">Afternoons</option>
                  <option value="evening">Evenings</option>
                  <option value="weekend">Weekends</option>
                  <option value="mon">Mondays</option>
                  <option value="tue">Tuesdays</option>
                  <option value="wed">Wednesdays</option>
                  <option value="thu">Thursdays</option>
                  <option value="fri">Fridays</option>
                  <option value="sat">Saturdays</option>
                  <option value="sun">Sundays</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Minimum Compatibility</label>
                <div className="flex items-center gap-2">
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    value={[filters.minCompatibility]}
                    onValueChange={(value) => setFilters({...filters, minCompatibility: value[0]})}
                  />
                  <span className="text-sm w-12 text-right">{filters.minCompatibility}%</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Verified Users Only</label>
                  <Switch
                    checked={filters.verifiedOnly}
                    onCheckedChange={(checked) => setFilters({...filters, verifiedOnly: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">With Fitness Goals</label>
                  <Switch
                    checked={filters.withGoals}
                    onCheckedChange={(checked) => setFilters({...filters, withGoals: checked})}
                  />
                </div>
              </div>
              
              <Button 
                className="w-full"
                onClick={handleApplyFilters}
              >
                Apply Filters
              </Button>
            </div>
          )}

          {view === 'details' && selectedBuddy && (
            <div className="space-y-4">
              <button
                className="flex items-center gap-1 text-sm font-medium"
                onClick={() => setView('main')}
              >
                <ArrowLeft size={16} />
                <span>Back to results</span>
              </button>
              
              <div className="flex flex-col items-center">
                <div className="relative mb-2">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={selectedBuddy.avatar} alt={selectedBuddy.name} />
                    <AvatarFallback>{selectedBuddy.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {selectedBuddy.verified && (
                    <div className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full w-7 h-7 flex items-center justify-center">
                      <Shield size={14} />
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-semibold">{selectedBuddy.name}</h2>
                <div className="flex items-center gap-1 text-gray-500 mt-1">
                  <MapPin size={14} />
                  <span>{selectedBuddy.location} • {selectedBuddy.distance}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="bg-fitness-primary/10 text-fitness-primary text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                    <Star size={14} />
                    {selectedBuddy.matchPercentage}% Match
                  </div>
                  <div className="bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                    <Dumbbell size={14} />
                    {selectedBuddy.fitnessLevel}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-fitness-gray mb-1 flex items-center">
                    <Dumbbell size={16} className="mr-1 text-fitness-primary" />
                    Preferred Workouts
                  </h3>
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {selectedBuddy.preferredWorkouts.map((workout, i) => (
                        <span key={i} className="bg-white text-gray-700 text-xs px-2 py-1 rounded-full">
                          {workout}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-fitness-gray mb-1 flex items-center">
                    <Calendar size={16} className="mr-1 text-fitness-primary" />
                    Availability
                  </h3>
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <div className="flex flex-col gap-1">
                      {selectedBuddy.availability.map((time, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Clock size={14} className="text-fitness-primary" />
                          <span className="text-sm">{time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {selectedBuddy.personality && (
                  <div>
                    <h3 className="text-sm font-medium text-fitness-gray mb-1 flex items-center">
                      <User size={16} className="mr-1 text-fitness-primary" />
                      Personality
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedBuddy.personality.map((trait, idx) => (
                        <Badge key={idx} variant="outline" className="bg-blue-50">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedBuddy.goals && (
                  <div>
                    <h3 className="text-sm font-medium text-fitness-gray mb-1 flex items-center">
                      <Target size={16} className="mr-1 text-fitness-primary" />
                      Fitness Goals
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedBuddy.goals.map((goal, idx) => (
                        <Badge key={idx} variant="outline" className="bg-green-50">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-fitness-gray mb-1 flex items-center">
                    <Zap size={16} className="mr-1 text-fitness-primary" />
                    Experience & Achievements
                  </h3>
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Experience</span>
                      <span className="font-medium">{selectedBuddy.experience} years</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm">Achievements</span>
                      <span className="font-medium">{selectedBuddy.achievements} completed</span>
                    </div>
                  </div>
                </div>
                
                {selectedBuddy.compatibility && (
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-fitness-gray flex items-center">
                        <BarChart size={16} className="mr-1 text-fitness-primary" />
                        Compatibility
                      </h3>
                      <button 
                        className="text-xs text-fitness-primary font-medium"
                        onClick={handleViewCompatibility}
                      >
                        View Analysis
                      </button>
                    </div>
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <div className="h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-fitness-primary rounded-full" 
                          style={{ width: `${selectedBuddy.matchPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => showActionToast(`Viewing ${selectedBuddy.name}'s profile`)}
                >
                  View Profile
                </Button>
                <Button 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleContactBuddy}
                >
                  <MessageSquare size={18} />
                  <span>Message</span>
                </Button>
              </div>
            </div>
          )}
          
          {view === 'compatibility' && selectedBuddy && selectedBuddy.compatibility && (
            <div className="space-y-4">
              <button
                className="flex items-center gap-1 text-sm font-medium"
                onClick={() => setView('details')}
              >
                <ArrowLeft size={16} />
                <span>Back to details</span>
              </button>
              
              <div className="text-center mb-4">
                <h2 className="font-semibold">Compatibility with {selectedBuddy.name}</h2>
                <p className="text-sm text-gray-500">Overall match: {selectedBuddy.matchPercentage}%</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Schedule Alignment</span>
                    <span className="text-sm">{selectedBuddy.compatibility.schedule}%</span>
                  </div>
                  <Progress value={selectedBuddy.compatibility.schedule} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">How well your workout schedules align</p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Goals Compatibility</span>
                    <span className="text-sm">{selectedBuddy.compatibility.goals}%</span>
                  </div>
                  <Progress value={selectedBuddy.compatibility.goals} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">Alignment of fitness goals and interests</p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Workout Intensity</span>
                    <span className="text-sm">{selectedBuddy.compatibility.intensity}%</span>
                  </div>
                  <Progress value={selectedBuddy.compatibility.intensity} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">Match in preferred exercise intensity</p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Location Convenience</span>
                    <span className="text-sm">{selectedBuddy.compatibility.location}%</span>
                  </div>
                  <Progress value={selectedBuddy.compatibility.location} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">Proximity and accessibility</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-lg">
                <h3 className="text-sm font-medium flex items-center mb-2">
                  <Zap size={16} className="mr-1 text-yellow-500" />
                  Compatibility Insight
                </h3>
                <p className="text-sm">
                  You and {selectedBuddy.name} have a strong match in
                  {Object.entries(selectedBuddy.compatibility)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 2)
                    .map(([key]) => ` ${key}`)}
                  {selectedBuddy.matchPercentage > 80 ? 
                    '. You would make excellent workout partners!' : 
                    '. Consider this for collaborative sessions.'}
                </p>
              </div>
              
              <Button 
                className="w-full"
                onClick={handleContactBuddy}
              >
                Connect with {selectedBuddy.name}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WorkoutBuddyFinder;
