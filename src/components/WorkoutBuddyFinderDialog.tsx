
import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Calendar, 
  Dumbbell, 
  MessageSquare,
  Filter,
  ArrowLeft,
  Search,
  UserPlus,
  CheckCircle,
  Clock
} from 'lucide-react';
import { showActionToast } from '@/utils/toast-utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
}

const WorkoutBuddyFinderDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'main' | 'filter' | 'details'>('main');
  const [selectedBuddy, setSelectedBuddy] = useState<WorkoutBuddy | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    maxDistance: 10,
    fitnessLevel: 'all',
    workoutType: 'all',
  });
  
  // Track connection status
  const [connectionStatuses, setConnectionStatuses] = useState<Record<number, 'none' | 'pending' | 'connected'>>({
    1: 'none',
    2: 'connected',
    3: 'pending',
    4: 'none',
    5: 'none'
  });

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
      connectionStatus: 'none'
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
      connectionStatus: 'connected'
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
      connectionStatus: 'pending'
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
      connectionStatus: 'none'
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
      connectionStatus: 'none'
    }
  ];

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
      const status = connectionStatuses[selectedBuddy.id];
      let message = "";
      
      if (status === 'none') {
        setConnectionStatuses({...connectionStatuses, [selectedBuddy.id]: 'pending'});
        message = `Connection request sent to ${selectedBuddy.name}!`;
      } else if (status === 'pending') {
        setConnectionStatuses({...connectionStatuses, [selectedBuddy.id]: 'connected'});
        message = `You're now connected with ${selectedBuddy.name}!`;
      } else {
        setConnectionStatuses({...connectionStatuses, [selectedBuddy.id]: 'none'});
        message = `You've disconnected from ${selectedBuddy.name}.`;
      }
      
      showActionToast(message);
      setTimeout(() => handleCloseDialog(), 500);
    }
  };

  const handleApplyFilters = () => {
    setView('main');
    showActionToast("Filters applied");
  };
  
  const getConnectionButtonText = (status: 'none' | 'pending' | 'connected') => {
    switch(status) {
      case 'none': return "Connect";
      case 'pending': return "Accept Connection";
      case 'connected': return "Message Buddy";
      default: return "Connect";
    }
  };

  return (
    <>
      <button
        className="fixed bottom-24 right-4 z-20 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full p-3 shadow-lg flex items-center gap-2 hover:shadow-xl transition-all"
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
                  <Users size={18} className="text-blue-600" /> Find Workout Buddies
                </>
              ) : view === 'filter' ? (
                <>
                  <Filter size={18} className="text-blue-600" /> Filter Buddies
                </>
              ) : (
                <>
                  <Dumbbell size={18} className="text-blue-600" /> Buddy Details
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
                    className="pl-8 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  className="p-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  onClick={() => setView('filter')}
                >
                  <Filter size={20} className="text-blue-600" />
                </button>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Find workout partners near you based on your preferences
              </p>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {filteredBuddies.length > 0 ? (
                  filteredBuddies.map((buddy) => (
                    <div
                      key={buddy.id}
                      className="p-3 border border-gray-100 rounded-xl flex gap-3 items-center cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors"
                      onClick={() => handleBuddySelect({...buddy, connectionStatus: connectionStatuses[buddy.id]})}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100">
                        <img 
                          src={buddy.avatar} 
                          alt={buddy.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/48?text=User';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{buddy.name}</h3>
                          <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
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
                        
                        {connectionStatuses[buddy.id] !== 'none' && (
                          <div className="mt-1">
                            <Badge 
                              variant="outline" 
                              className={
                                connectionStatuses[buddy.id] === 'connected' 
                                  ? "bg-green-50 text-green-700 border-green-200" 
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }
                            >
                              {connectionStatuses[buddy.id] === 'connected' ? (
                                <><CheckCircle size={12} className="mr-1" /> Connected</>
                              ) : (
                                <><Clock size={12} className="mr-1" /> Pending</>
                              )}
                            </Badge>
                          </div>
                        )}
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
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
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
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    value={filters.maxDistance}
                    onChange={(e) => setFilters({...filters, maxDistance: parseInt(e.target.value)})}
                  />
                  <span className="text-sm w-12 text-right">{filters.maxDistance} km</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Fitness Level</label>
                <select
                  className="w-full p-2 rounded-lg border border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
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
                  className="w-full p-2 rounded-lg border border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
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
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-xl font-medium hover:shadow-md transition-all"
                onClick={handleApplyFilters}
              >
                Apply Filters
              </button>
            </div>
          )}

          {view === 'details' && selectedBuddy && (
            <div className="space-y-4">
              <button
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                onClick={() => setView('main')}
              >
                <ArrowLeft size={16} />
                <span>Back to results</span>
              </button>
              
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-2 border-4 border-gray-100">
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
                <div className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full mt-2">
                  {selectedBuddy.matchPercentage}% Match
                </div>
                <div className="w-full mt-2">
                  <Progress value={selectedBuddy.matchPercentage} className="h-2" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Fitness Level</h3>
                  <div className="bg-gray-100 p-2 rounded-lg flex items-center gap-2">
                    <Dumbbell size={16} className="text-blue-600" />
                    <span>{selectedBuddy.fitnessLevel}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Preferred Workouts</h3>
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
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Availability</h3>
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <div className="flex flex-col gap-1">
                      {selectedBuddy.availability.map((time, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Calendar size={14} className="text-blue-600" />
                          <span className="text-sm">{time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                  connectionStatuses[selectedBuddy.id] === 'connected' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : connectionStatuses[selectedBuddy.id] === 'pending'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-md'
                }`}
                onClick={handleContactBuddy}
              >
                {connectionStatuses[selectedBuddy.id] === 'connected' ? (
                  <MessageSquare size={18} />
                ) : connectionStatuses[selectedBuddy.id] === 'pending' ? (
                  <CheckCircle size={18} />
                ) : (
                  <UserPlus size={18} />
                )}
                <span>{getConnectionButtonText(connectionStatuses[selectedBuddy.id])}</span>
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WorkoutBuddyFinderDialog;
