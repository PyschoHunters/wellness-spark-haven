
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
  Star
} from 'lucide-react';
import { showActionToast } from '@/utils/toast-utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import WorkoutBuddyChat from './WorkoutBuddyChat';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

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
  connectionStatus?: 'none' | 'pending' | 'connected';
  chatStreak?: number;
}

const WorkoutBuddyFinder: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'main' | 'filter' | 'details'>('main');
  const [selectedBuddy, setSelectedBuddy] = useState<WorkoutBuddy | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    maxDistance: 10,
    fitnessLevel: 'all',
    workoutType: 'all',
  });
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [connectedBuddies, setConnectedBuddies] = useState<WorkoutBuddy[]>([]);

  const buddies: WorkoutBuddy[] = [
    {
      id: 1,
      name: "Ananya Gupta",
      avatar: "/lovable-uploads/a26c2a99-d523-4a37-a2dd-2f76e5088aae.png",
      location: "Downtown",
      distance: "1.2 km",
      fitnessLevel: "Intermediate",
      preferredWorkouts: ["HIIT", "Yoga", "Running"],
      availability: ["Mon-Wed (Evening)", "Sat (Morning)"],
      matchPercentage: 87,
      connectionStatus: 'none',
      chatStreak: 0
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
      connectionStatus: 'connected',
      chatStreak: 3
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
      connectionStatus: 'pending',
      chatStreak: 0
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
      connectionStatus: 'none',
      chatStreak: 0
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
      connectionStatus: 'connected',
      chatStreak: 5
    }
  ];

  useEffect(() => {
    // Initialize connected buddies
    const connected = buddies.filter(buddy => buddy.connectionStatus === 'connected');
    setConnectedBuddies(connected);
  }, []);

  const filteredBuddies = buddies.filter(buddy => {
    if (searchTerm && !buddy.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    const distanceNum = parseFloat(buddy.distance);
    if (filters.maxDistance < distanceNum) {
      return false;
    }
    
    if (filters.fitnessLevel !== 'all' && buddy.fitnessLevel !== filters.fitnessLevel) {
      return false;
    }
    
    if (filters.workoutType !== 'all') {
      if (!buddy.preferredWorkouts.some(workout => 
        workout.toLowerCase().includes(filters.workoutType.toLowerCase()))) {
        return false;
      }
    }
    
    return true;
  });

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
    if (selectedBuddy) {
      if (selectedBuddy.connectionStatus === 'connected') {
        // Open chat
        setShowChatDialog(true);
      } else if (selectedBuddy.connectionStatus === 'pending') {
        // Accept connection
        handleAcceptConnection(selectedBuddy.id);
      } else {
        // Send connection request
        handleSendConnectionRequest(selectedBuddy.id);
      }
    }
  };

  const handleSendConnectionRequest = (buddyId: number) => {
    // Update buddy connection status to pending
    const updatedBuddies = buddies.map(b => 
      b.id === buddyId ? { ...b, connectionStatus: 'pending' as const } : b
    );
    
    setSelectedBuddy(updatedBuddies.find(b => b.id === buddyId) || null);
    showActionToast("Connection request sent!");
    handleCloseDialog();
  };

  const handleAcceptConnection = (buddyId: number) => {
    // Update buddy connection status to connected
    const updatedBuddies = buddies.map(b => 
      b.id === buddyId ? { ...b, connectionStatus: 'connected' as const } : b
    );
    
    const connectedBuddy = updatedBuddies.find(b => b.id === buddyId);
    if (connectedBuddy) {
      setConnectedBuddies([...connectedBuddies, connectedBuddy]);
    }
    
    setSelectedBuddy(connectedBuddy || null);
    showActionToast("Connection accepted! You can now chat with this buddy.");
    handleCloseDialog();
  };

  const handleOpenChat = (buddy: WorkoutBuddy) => {
    setSelectedBuddy(buddy);
    setShowChatDialog(true);
  };

  const handleApplyFilters = () => {
    setView('main');
    showActionToast("Filters applied");
  };

  const getConnectionButtonText = (status?: 'none' | 'pending' | 'connected') => {
    switch (status) {
      case 'connected':
        return "Chat Now";
      case 'pending':
        return "Accept Request";
      default:
        return "Connect";
    }
  };

  return (
    <>
      <button
        className="fixed bottom-24 right-4 z-20 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full p-3 shadow-lg flex items-center gap-2 hover:from-indigo-600 hover:to-purple-700 transition-all"
        onClick={handleOpenDialog}
      >
        <Users size={20} />
        <span className="font-medium">Find Buddy</span>
      </button>

      {/* Connected Buddies Display */}
      {connectedBuddies.length > 0 && (
        <div className="fixed bottom-40 right-4 z-20 bg-white rounded-lg shadow-lg p-3 w-64 border border-gray-100">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Users size={14} className="mr-2 text-fitness-primary" />
            Connected Buddies
          </h3>
          <div className="max-h-[180px] overflow-y-auto space-y-2">
            {connectedBuddies.map(buddy => (
              <div 
                key={buddy.id}
                className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => handleOpenChat(buddy)}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img 
                    src={buddy.avatar} 
                    alt={buddy.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{buddy.name}</h4>
                  <div className="flex items-center text-xs text-gray-500">
                    {buddy.chatStreak && buddy.chatStreak > 0 ? (
                      <div className="flex items-center">
                        <Star size={10} className="text-amber-500 mr-1" />
                        <span>{buddy.chatStreak} day streak</span>
                      </div>
                    ) : (
                      <span>Start chatting!</span>
                    )}
                  </div>
                </div>
                <button 
                  className="ml-2 p-1.5 bg-fitness-primary text-white rounded-full hover:bg-fitness-primary/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenChat(buddy);
                  }}
                >
                  <MessageSquare size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {view === 'main' ? (
                <>
                  <Users size={18} /> Find Workout Buddies
                </>
              ) : view === 'filter' ? (
                <>
                  <Filter size={18} /> Filter Buddies
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
                    placeholder="Search by name"
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
              
              <p className="text-sm text-muted-foreground">
                Find workout partners near you based on your preferences
              </p>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {filteredBuddies.length > 0 ? (
                  filteredBuddies.map((buddy) => (
                    <div
                      key={buddy.id}
                      className="p-3 border border-gray-100 rounded-xl flex gap-3 items-center cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleBuddySelect(buddy)}
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img 
                            src={buddy.avatar} 
                            alt={buddy.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/48?text=User';
                            }}
                          />
                        </div>
                        {buddy.connectionStatus === 'connected' && (
                          <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                        )}
                        {buddy.connectionStatus === 'pending' && (
                          <div className="absolute -bottom-1 -right-1 bg-amber-500 w-4 h-4 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{buddy.name}</h3>
                          <span className="bg-fitness-primary/10 text-fitness-primary text-xs font-medium px-2 py-0.5 rounded-full">
                            {buddy.matchPercentage}% Match
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
                        
                        {buddy.connectionStatus === 'connected' && buddy.chatStreak && buddy.chatStreak > 0 && (
                          <div className="mt-1.5 flex items-center gap-1 text-xs text-amber-600">
                            <Star size={10} />
                            <span>{buddy.chatStreak} day chat streak</span>
                          </div>
                        )}
                      </div>
                      
                      <Button
                        size="sm"
                        variant={buddy.connectionStatus === 'connected' ? 'default' : 
                                buddy.connectionStatus === 'pending' ? 'secondary' : 'outline'}
                        className="ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (buddy.connectionStatus === 'connected') {
                            handleOpenChat(buddy);
                          } else if (buddy.connectionStatus === 'pending') {
                            handleAcceptConnection(buddy.id);
                          } else {
                            handleSendConnectionRequest(buddy.id);
                          }
                        }}
                      >
                        {buddy.connectionStatus === 'connected' ? (
                          <><MessageSquare size={14} className="mr-1" /> Chat</>
                        ) : buddy.connectionStatus === 'pending' ? (
                          <>Accept</>
                        ) : (
                          <>Connect</>
                        )}
                      </Button>
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
                  <input
                    type="range"
                    min="1"
                    max="20"
                    className="w-full"
                    value={filters.maxDistance}
                    onChange={(e) => setFilters({...filters, maxDistance: parseInt(e.target.value)})}
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
                </select>
              </div>
              
              <button 
                className="w-full bg-fitness-primary text-white py-2 rounded-xl font-medium"
                onClick={handleApplyFilters}
              >
                Apply Filters
              </button>
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
                <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
                  <img 
                    src={selectedBuddy.avatar} 
                    alt={selectedBuddy.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-semibold">{selectedBuddy.name}</h2>
                <div className="flex items-center gap-1 text-gray-500 mt-1">
                  <MapPin size={14} />
                  <span>{selectedBuddy.location} • {selectedBuddy.distance}</span>
                </div>
                <div className="bg-fitness-primary/10 text-fitness-primary text-sm font-medium px-3 py-1 rounded-full mt-2">
                  {selectedBuddy.matchPercentage}% Match
                </div>
                
                {selectedBuddy.connectionStatus === 'connected' && selectedBuddy.chatStreak && selectedBuddy.chatStreak > 0 && (
                  <div className="flex items-center gap-1 mt-2 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    <Star size={14} />
                    <span>{selectedBuddy.chatStreak} day chat streak</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-fitness-gray mb-1">Fitness Level</h3>
                  <div className="bg-gray-100 p-2 rounded-lg flex items-center gap-2">
                    <Dumbbell size={16} className="text-fitness-primary" />
                    <span>{selectedBuddy.fitnessLevel}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-fitness-gray mb-1">Preferred Workouts</h3>
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
                  <h3 className="text-sm font-medium text-fitness-gray mb-1">Availability</h3>
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <div className="flex flex-col gap-1">
                      {selectedBuddy.availability.map((time, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Calendar size={14} className="text-fitness-primary" />
                          <span className="text-sm">{time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-fitness-gray mb-1">Compatibility</h3>
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <div className="mb-1 flex justify-between text-xs">
                      <span>Match Score</span>
                      <span>{selectedBuddy.matchPercentage}%</span>
                    </div>
                    <Progress value={selectedBuddy.matchPercentage} className="h-2" />
                    
                    <div className="mt-2 text-xs text-gray-600">
                      {selectedBuddy.matchPercentage > 80 
                        ? "Perfect match! You have very similar fitness goals and preferences."
                        : selectedBuddy.matchPercentage > 60
                        ? "Good match! You share several fitness interests."
                        : "You have some common fitness interests and could learn from each other."}
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                className="w-full bg-fitness-primary text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                onClick={handleContactBuddy}
              >
                {selectedBuddy.connectionStatus === 'connected' ? (
                  <>
                    <MessageSquare size={18} />
                    <span>Chat Now</span>
                  </>
                ) : selectedBuddy.connectionStatus === 'pending' ? (
                  <>
                    <Users size={18} />
                    <span>Accept Connection</span>
                  </>
                ) : (
                  <>
                    <Users size={18} />
                    <span>Connect with Buddy</span>
                  </>
                )}
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Chat Dialog */}
      {selectedBuddy && (
        <WorkoutBuddyChat 
          buddy={{
            id: selectedBuddy.id,
            name: selectedBuddy.name,
            avatar: selectedBuddy.avatar,
            interests: selectedBuddy.preferredWorkouts,
            level: selectedBuddy.fitnessLevel
          }}
          isOpen={showChatDialog}
          onClose={() => {
            setShowChatDialog(false);
            setSelectedBuddy(null);
          }}
        />
      )}
    </>
  );
};

export default WorkoutBuddyFinder;
