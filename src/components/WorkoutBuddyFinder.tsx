import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  Calendar, 
  Dumbbell, 
  MessageSquare,
  Filter,
  ArrowLeft,
  Search
} from 'lucide-react';
import { showActionToast } from '@/utils/toast-utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
      matchPercentage: 87
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
      matchPercentage: 75
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
      matchPercentage: 92
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
      matchPercentage: 68
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
      matchPercentage: 81
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
    showActionToast("Message sent to workout buddy!");
    handleCloseDialog();
  };

  const handleApplyFilters = () => {
    setView('main');
    showActionToast("Filters applied");
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
              </div>
              
              <button 
                className="w-full bg-fitness-primary text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                onClick={handleContactBuddy}
              >
                <MessageSquare size={18} />
                <span>Contact Buddy</span>
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WorkoutBuddyFinder;
