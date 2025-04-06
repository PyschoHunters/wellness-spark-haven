
import React from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import WorkoutBuddyFinder from '@/components/WorkoutBuddyFinder';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Dumbbell, MessageSquare, ChevronRight, Calendar, Search, Filter, Sparkles, Target, Award } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { showActionToast } from '@/utils/toast-utils';

const fitnessEvents = [
  {
    id: 1,
    title: "Group Yoga in the Park",
    location: "Central Park, North Area",
    date: "Sat, April 12",
    time: "08:00 - 09:30 AM",
    participants: 12,
    maxParticipants: 20,
    difficulty: "Beginner",
    host: "Priya Nair",
    image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 2,
    title: "HIIT Circuit Training",
    location: "FitLife Gym, Downtown",
    date: "Sun, April 13",
    time: "10:00 - 11:00 AM",
    participants: 8,
    maxParticipants: 15,
    difficulty: "Intermediate",
    host: "Arjun Malhotra",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 3,
    title: "Trail Running Meetup",
    location: "Riverside Trails",
    date: "Wed, April 16",
    time: "06:30 - 07:30 AM",
    participants: 6,
    maxParticipants: 12,
    difficulty: "Advanced",
    host: "Rajesh Kumar",
    image: "https://images.unsplash.com/photo-1502230831726-fe5549140034?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

const popularInterests = [
  { name: "Yoga", count: 26 },
  { name: "Running", count: 22 },
  { name: "Weightlifting", count: 18 },
  { name: "HIIT", count: 15 },
  { name: "Cycling", count: 14 }
];

const leaderboard = [
  { 
    id: 1, 
    name: "Ananya Gupta", 
    avatar: "https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    points: 1240,
    connections: 24,
    verified: true
  },
  { 
    id: 2, 
    name: "Rohit Verma", 
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    points: 980,
    connections: 18,
    verified: true
  },
  { 
    id: 3, 
    name: "Priya Nair", 
    avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    points: 840,
    connections: 15,
    verified: false
  },
  { 
    id: 4, 
    name: "Arjun Malhotra", 
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    points: 760,
    connections: 12,
    verified: true
  },
  { 
    id: 5, 
    name: "Meera Iyer", 
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    points: 580,
    connections: 9,
    verified: false
  }
];

const BuddyFinder = () => {
  const [activeTab, setActiveTab] = React.useState('discover');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);

  const handleEventJoin = (eventId: number) => {
    const event = fitnessEvents.find(e => e.id === eventId);
    if (event) {
      showActionToast(`You've joined: ${event.title}`);
    }
  };

  const handleConnectUser = (userId: number) => {
    const user = leaderboard.find(u => u.id === userId);
    if (user) {
      showActionToast(`Connection request sent to ${user.name}`);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-20">
      <Header 
        title="Fitness Community" 
        subtitle="Connect, share, and grow together" 
      />
      
      <div className="mb-6">
        <Tabs defaultValue="discover" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder={
              activeTab === 'discover' ? "Search by name, activity..." : 
              activeTab === 'events' ? "Search events..." : 
              "Search community members..."
            }
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
      
      {activeTab === 'discover' && (
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-3">Suggested for You</h2>
            <Card className="bg-gradient-to-r from-fitness-primary to-blue-600 text-white overflow-hidden mb-4">
              <CardContent className="p-0">
                <div className="relative h-40">
                  <img 
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                    alt="Group fitness" 
                    className="w-full h-full object-cover opacity-30"
                  />
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <Badge className="bg-white/20 hover:bg-white/30">Featured</Badge>
                      <div className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs">
                        24 buddies nearby
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold mb-1">Find Your Perfect Workout Match</h3>
                      <p className="text-sm opacity-90 mb-2">Connect with fitness enthusiasts who share your goals</p>
                      <Button variant="secondary" size="sm" className="gap-1">
                        <Users size={14} />
                        Find Buddies
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-2 gap-3">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm">Group Events</h3>
                      <Badge variant="outline" className="text-xs">{fitnessEvents.length}</Badge>
                    </div>
                    <p className="text-xs text-gray-500">Join group workouts & fitness events</p>
                  </div>
                  <img 
                    src="https://images.unsplash.com/photo-1571388208497-71bedc66e932?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                    alt="Group fitness" 
                    className="w-full h-24 object-cover"
                  />
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm">Weekly Challenges</h3>
                      <Badge variant="outline" className="text-xs">New</Badge>
                    </div>
                    <p className="text-xs text-gray-500">Compete & earn achievement points</p>
                  </div>
                  <img 
                    src="https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                    alt="Fitness challenge" 
                    className="w-full h-24 object-cover"
                  />
                </CardContent>
              </Card>
            </div>
          </section>
          
          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Popular Interests</h2>
              <Button variant="ghost" size="sm" className="text-fitness-primary h-8">See All</Button>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {popularInterests.map((interest, idx) => (
                <div 
                  key={idx}
                  className="flex-shrink-0 bg-gray-50 border border-gray-100 rounded-lg p-3 text-center min-w-24"
                >
                  <div className="font-medium">{interest.name}</div>
                  <div className="text-xs text-gray-500">{interest.count} buddies</div>
                </div>
              ))}
            </div>
          </section>
          
          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Top Buddy Matches</h2>
              <Button variant="ghost" size="sm" className="text-fitness-primary h-8">View All</Button>
            </div>
            
            <div className="space-y-3">
              {leaderboard.slice(0, 3).map((user) => (
                <div
                  key={user.id}
                  className="p-3 bg-white border border-gray-100 rounded-xl flex gap-3 items-center"
                >
                  <div className="relative">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {user.verified && (
                      <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                        <Sparkles size={12} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <h3 className="font-medium">{user.name}</h3>
                      {user.id <= 3 && (
                        <Badge className={`ml-1 ${
                          user.id === 1 ? 'bg-yellow-500' : 
                          user.id === 2 ? 'bg-gray-400' : 
                          'bg-amber-700'
                        }`}>
                          #{user.id}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Match Score</span>
                        <span className="font-medium">92%</span>
                      </div>
                      <Progress value={92} className="h-1" />
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <Users size={12} className="mr-1" />
                        <span>{user.connections} connections</span>
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => handleConnectUser(user.id)}
                      >
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="ghost" className="w-full text-fitness-primary">
                View More Matches
              </Button>
            </div>
          </section>
        </div>
      )}
      
      {activeTab === 'events' && (
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-3">Upcoming Events</h2>
            
            <div className="space-y-4">
              {fitnessEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative h-36">
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0 right-0 p-2">
                        <Badge className="bg-white/80 text-fitness-primary backdrop-blur-sm text-xs">
                          {event.difficulty}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <h3 className="font-semibold mb-1">{event.title}</h3>
                      
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <MapPin size={12} className="mr-1" />
                        <span>{event.location}</span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center text-xs">
                          <Calendar size={12} className="mr-1 text-fitness-primary" />
                          <span>{event.date}, {event.time}</span>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          {event.participants}/{event.maxParticipants} joined
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <Progress 
                          value={(event.participants / event.maxParticipants) * 100} 
                          className="h-1"
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{event.host.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs">Hosted by {event.host}</span>
                        </div>
                        
                        <Button 
                          size="sm" 
                          className="h-8"
                          onClick={() => handleEventJoin(event.id)}
                        >
                          Join
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button variant="outline" className="w-full">
                Explore More Events
              </Button>
            </div>
          </section>
          
          <section>
            <h2 className="text-lg font-semibold mb-3">Create Your Own Event</h2>
            
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 mb-3">
                  Organize your own workout session or fitness event and invite others to join.
                </p>
                
                <Button className="w-full gap-2">
                  <Calendar size={16} />
                  Create Event
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      )}
      
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Fitness Leaderboard</h2>
              <Button variant="outline" size="sm" className="h-8 flex items-center gap-1">
                <Filter size={14} />
                This Month
              </Button>
            </div>
            
            <div className="space-y-3">
              {leaderboard.map((user, index) => (
                <div
                  key={user.id}
                  className="p-3 bg-white border border-gray-100 rounded-xl flex gap-3 items-center"
                >
                  <div className="w-8 flex justify-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-medium ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-50 text-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm flex items-center gap-1">
                        {user.name}
                        {user.verified && <Sparkles size={14} className="text-green-500" />}
                      </h3>
                      
                      <div className="flex items-center text-sm font-semibold">
                        {user.points}
                        <Trophy className="ml-1 h-4 w-4 text-yellow-500" />
                      </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Users size={12} className="mr-1" />
                      <span>{user.connections} connections</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          <section>
            <h2 className="text-lg font-semibold mb-3">Your Achievements</h2>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="font-medium">635 points</div>
                    <div className="text-xs text-gray-500">Rank #18 this month</div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="h-8">View All</Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Award size={20} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Consistency Champion</div>
                      <div className="text-xs text-gray-500">Worked out 5 days in a row</div>
                    </div>
                    <Badge>+50</Badge>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Target size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Goal Crusher</div>
                      <div className="text-xs text-gray-500">Completed 10 workout sessions</div>
                    </div>
                    <Badge>+75</Badge>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Users size={20} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Social Butterfly</div>
                      <div className="text-xs text-gray-500">Connected with 5 workout buddies</div>
                    </div>
                    <Badge>+100</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      )}
      
      <Navigation />
      <WorkoutBuddyFinder />
    </div>
  );
};

// Helper component for Trophy icon
const Trophy = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

export default BuddyFinder;
