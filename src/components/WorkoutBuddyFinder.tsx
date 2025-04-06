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
  Star,
  CheckCircle,
  X,
  Activity,
  Bell,
  Heart,
  Clock,
  MoreHorizontal,
  Send,
  Mail,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';
import { showActionToast } from '@/utils/toast-utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
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
  bio?: string;
  goal?: string;
  experience?: number; // in months
  achievements?: string[];
  verified?: boolean;
  reviews?: BuddyReview[];
  personality?: string[];
}

interface BuddyRequest {
  id: number;
  buddy: WorkoutBuddy;
  status: 'pending' | 'accepted' | 'declined';
  date: string;
  message?: string;
}

interface BuddyReview {
  id: number;
  author: string;
  rating: number;
  text: string;
  date: string;
}

interface Message {
  id: number;
  sender: string;
  receiver: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

const WorkoutBuddyFinder: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'main' | 'filter' | 'details' | 'chat' | 'requests' | 'connections'>('main');
  const [selectedBuddy, setSelectedBuddy] = useState<WorkoutBuddy | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [buddyRequests, setBuddyRequests] = useState<BuddyRequest[]>([]);
  const [connections, setConnections] = useState<WorkoutBuddy[]>([]);
  const [activeChat, setActiveChat] = useState<{buddy: WorkoutBuddy, messages: Message[]}>({
    buddy: null as unknown as WorkoutBuddy, 
    messages: []
  });
  const [newMessage, setNewMessage] = useState('');
  const [hasUnreadRequests, setHasUnreadRequests] = useState(false);
  const [detailsTab, setDetailsTab] = useState('profile');
  const { isAuthenticated } = useAuth();
  
  const [filters, setFilters] = useState({
    maxDistance: 10,
    fitnessLevel: 'all',
    workoutType: 'all',
    availability: 'all',
    experience: 'all',
    personality: 'all',
    verified: false
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
      bio: "Fitness enthusiast who loves to push boundaries. Looking for a buddy who can keep up with my high-energy workouts but also enjoys occasional yoga to balance things out.",
      goal: "Train for a half marathon and improve overall strength",
      experience: 24, // 2 years
      achievements: ["Completed 5K race", "30-day yoga challenge"],
      verified: true,
      personality: ["Energetic", "Motivated", "Supportive"],
      reviews: [
        {
          id: 1,
          author: "Rahul M.",
          rating: 5,
          text: "Ananya is an amazing workout partner! Very motivating and reliable.",
          date: "2023-12-10"
        },
        {
          id: 2,
          author: "Priya S.",
          rating: 4,
          text: "Great energy and always on time. Helped me improve my running technique.",
          date: "2023-11-25"
        }
      ]
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
      bio: "Professional personal trainer looking for a dedicated workout partner for morning sessions. I specialize in strength training and CrossFit.",
      goal: "Increase muscle mass and improve swimming technique",
      experience: 60, // 5 years
      achievements: ["Certified CrossFit coach", "Completed triathlon"],
      verified: true,
      personality: ["Disciplined", "Competitive", "Teacher"],
      reviews: [
        {
          id: 1,
          author: "Aditya K.",
          rating: 5,
          text: "Rohit knows his stuff! Great technique and very helpful with form corrections.",
          date: "2024-01-15"
        }
      ]
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
      bio: "Just starting my fitness journey after having a baby. Looking for a supportive buddy who understands that I'm taking it slow but staying consistent.",
      goal: "Regain fitness and learn proper techniques",
      experience: 3, // 3 months
      achievements: ["Consistent 10K steps daily for a month"],
      verified: false,
      personality: ["Patient", "Consistent", "Friendly"],
      reviews: []
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
      bio: "Sports enthusiast who loves outdoor activities. I prefer running in the park and playing tennis. Looking for someone with similar interests.",
      goal: "Improve endurance and tennis skills",
      experience: 36, // 3 years
      achievements: ["10K race finisher", "Local tennis tournament semifinalist"],
      verified: true,
      personality: ["Outgoing", "Social", "Competitive"],
      reviews: [
        {
          id: 1,
          author: "Meera L.",
          rating: 4,
          text: "Great running partner! Always keeps the pace challenging but manageable.",
          date: "2023-10-05"
        }
      ]
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
      bio: "Martial arts instructor looking for a sparring partner and someone to join for morning workouts. I'm disciplined and expect the same.",
      goal: "Maintain peak physical condition and flexibility",
      experience: 84, // 7 years
      achievements: ["Black belt in Karate", "Certified Pilates instructor"],
      verified: true,
      personality: ["Disciplined", "Focused", "Intense"],
      reviews: [
        {
          id: 1,
          author: "Vikram S.",
          rating: 5,
          text: "Meera is incredibly skilled and a great teacher. Tough but fair.",
          date: "2024-02-20"
        },
        {
          id: 2,
          author: "Neha R.",
          rating: 4,
          text: "Very disciplined and punctual. Helped me improve my technique.",
          date: "2023-11-15"
        }
      ]
    },
    {
      id: 6,
      name: "Arjun Patel",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      location: "University Area",
      distance: "1.9 km",
      fitnessLevel: "Intermediate",
      preferredWorkouts: ["Calisthenics", "Basketball", "Cycling"],
      availability: ["Evenings", "Weekend (Morning)"],
      matchPercentage: 78,
      bio: "College student who loves bodyweight exercises and team sports. Looking for someone to join for street workout sessions and basketball games.",
      goal: "Master advanced calisthenics moves",
      experience: 18, // 1.5 years
      achievements: ["Can do 15 pull-ups in a row", "Local basketball tournament winner"],
      verified: false,
      personality: ["Enthusiastic", "Creative", "Laid-back"],
      reviews: []
    }
  ];

  useEffect(() => {
    const sampleRequests: BuddyRequest[] = [
      {
        id: 1,
        buddy: buddies[3],
        status: 'pending',
        date: '2024-04-02',
        message: "Hi! I noticed we both enjoy running. Would you like to meet for a weekend run at Central Park?"
      },
      {
        id: 2,
        buddy: buddies[5],
        status: 'accepted',
        date: '2024-03-28',
        message: "Hey, I'm looking for a basketball partner for Thursday evenings. Are you interested?"
      }
    ];
    
    setBuddyRequests(sampleRequests);
    setHasUnreadRequests(true);
    
    const sampleConnections = [buddies[1], buddies[5]];
    setConnections(sampleConnections);
    
    if (buddies[1]) {
      const sampleMessages: Message[] = [
        {
          id: 1,
          sender: "Rohit Verma",
          receiver: "You",
          text: "Hey there! Looking forward to our workout session tomorrow.",
          timestamp: new Date(Date.now() - 3600000 * 24),
          read: true
        },
        {
          id: 2,
          sender: "You",
          receiver: "Rohit Verma",
          text: "Absolutely! I'll meet you at the gym at 7 AM. Should I bring anything specific?",
          timestamp: new Date(Date.now() - 3600000 * 23),
          read: true
        },
        {
          id: 3,
          sender: "Rohit Verma",
          receiver: "You",
          text: "Just bring water and a towel. I'll guide you through the workout routine.",
          timestamp: new Date(Date.now() - 3600000 * 22),
          read: true
        },
        {
          id: 4,
          sender: "Rohit Verma",
          receiver: "You",
          text: "Also, how was your last workout? Did you try the routine I suggested?",
          timestamp: new Date(Date.now() - 3600000 * 2),
          read: false
        }
      ];
      
      setActiveChat({
        buddy: buddies[1],
        messages: sampleMessages
      });
    }
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
    
    if (filters.verified && !buddy.verified) {
      return false;
    }
    
    if (filters.personality !== 'all' && buddy.personality) {
      if (!buddy.personality.some(trait => 
        trait.toLowerCase().includes(filters.personality.toLowerCase()))) {
        return false;
      }
    }
    
    if (filters.experience !== 'all') {
      if (filters.experience === 'beginner' && buddy.experience && buddy.experience > 12) {
        return false;
      }
      if (filters.experience === 'intermediate' && buddy.experience && 
          (buddy.experience < 12 || buddy.experience > 36)) {
        return false;
      }
      if (filters.experience === 'advanced' && buddy.experience && buddy.experience < 36) {
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
    setDetailsTab('profile');
  };

  const handleContactBuddy = () => {
    if (!isAuthenticated) {
      showActionToast("Please log in to contact workout buddies");
      return;
    }
    
    if (selectedBuddy) {
      const isAlreadyConnected = connections.some(connection => connection.id === selectedBuddy.id);
      
      if (isAlreadyConnected) {
        setActiveChat({
          buddy: selectedBuddy,
          messages: []
        });
        setView('chat');
      } else {
        const newRequest: BuddyRequest = {
          id: Date.now(),
          buddy: selectedBuddy,
          status: 'accepted',
          date: new Date().toISOString().split('T')[0],
        };
        
        setConnections(prev => [...prev, selectedBuddy]);
        setBuddyRequests(prev => [...prev, newRequest]);
        
        showActionToast("Connection request sent to workout buddy!");
        
        setActiveChat({
          buddy: selectedBuddy,
          messages: []
        });
        setView('chat');
      }
    }
  };

  const handleApplyFilters = () => {
    setView('main');
    showActionToast("Filters applied");
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now(),
      sender: "You",
      receiver: activeChat.buddy.name,
      text: newMessage,
      timestamp: new Date(),
      read: true
    };
    
    setActiveChat(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
    
    setNewMessage('');
    
    setTimeout(() => {
      const replyMessage: Message = {
        id: Date.now() + 1,
        sender: activeChat.buddy.name,
        receiver: "You",
        text: `Thanks for your message! I'll get back to you soon about our workout plans.`,
        timestamp: new Date(),
        read: true
      };
      
      setActiveChat(prev => ({
        ...prev,
        messages: [...prev.messages, replyMessage]
      }));
    }, 2000);
  };
  
  const handleAcceptRequest = (requestId: number) => {
    setBuddyRequests(prev => 
      prev.map(req => 
        req.id === requestId ? {...req, status: 'accepted'} : req
      )
    );
    
    const request = buddyRequests.find(req => req.id === requestId);
    if (request) {
      if (!connections.some(conn => conn.id === request.buddy.id)) {
        setConnections(prev => [...prev, request.buddy]);
      }
      
      showActionToast(`You and ${request.buddy.name} are now workout buddies!`);
    }
  };
  
  const handleDeclineRequest = (requestId: number) => {
    setBuddyRequests(prev => 
      prev.map(req => 
        req.id === requestId ? {...req, status: 'declined'} : req
      )
    );
    
    showActionToast("Request declined");
  };
  
  const renderRatingStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
        size={14}
      />
    ));
  };
  
  const renderUserProfile = () => {
    if (!selectedBuddy) return null;
    
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src={selectedBuddy.avatar} alt={selectedBuddy.name} />
              <AvatarFallback>{selectedBuddy.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            {selectedBuddy.verified && (
              <div className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-1">
                <CheckCircle size={16} />
              </div>
            )}
          </div>
          <h2 className="text-xl font-semibold mt-2">{selectedBuddy.name}</h2>
          <div className="flex items-center gap-1 text-gray-500 mt-1">
            <MapPin size={14} />
            <span>{selectedBuddy.location} • {selectedBuddy.distance}</span>
          </div>
          <div className="bg-fitness-primary/10 text-fitness-primary text-sm font-medium px-3 py-1 rounded-full mt-2 flex items-center gap-1">
            <ThumbsUp size={14} />
            <span>{selectedBuddy.matchPercentage}% Match</span>
          </div>
        </div>
        
        {selectedBuddy.bio && (
          <div>
            <h3 className="text-sm font-medium text-fitness-gray mb-1">About Me</h3>
            <p className="text-sm bg-gray-50 p-3 rounded-lg">
              {selectedBuddy.bio}
            </p>
          </div>
        )}
        
        <div>
          <h3 className="text-sm font-medium text-fitness-gray mb-1">Fitness Goal</h3>
          <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
            <Activity size={16} className="text-fitness-primary" />
            <span className="text-sm">{selectedBuddy.goal || "Not specified"}</span>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-fitness-gray mb-1">Fitness Level</h3>
          <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
            <Dumbbell size={16} className="text-fitness-primary" />
            <span className="text-sm">{selectedBuddy.fitnessLevel}</span>
            
            <div className="ml-auto">
              <Progress 
                value={selectedBuddy.fitnessLevel === 'Beginner' ? 33 : 
                      selectedBuddy.fitnessLevel === 'Intermediate' ? 66 : 100} 
                className="h-2 w-20" 
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-fitness-gray mb-1">Experience</h3>
          <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
            <Clock size={16} className="text-fitness-primary" />
            <span className="text-sm">
              {selectedBuddy.experience ? 
                `${Math.floor(selectedBuddy.experience / 12)} years ${selectedBuddy.experience % 12} months` : 
                "Not specified"}
            </span>
          </div>
        </div>
        
        {selectedBuddy.personality && selectedBuddy.personality.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-fitness-gray mb-1">Personality</h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex flex-wrap gap-2">
                {selectedBuddy.personality.map((trait, i) => (
                  <Badge key={i} variant="outline">
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div>
          <h3 className="text-sm font-medium text-fitness-gray mb-1">Preferred Workouts</h3>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex flex-wrap gap-2">
              {selectedBuddy.preferredWorkouts.map((workout, i) => (
                <Badge key={i} variant="secondary">
                  {workout}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-fitness-gray mb-1">Availability</h3>
          <div className="bg-gray-50 p-3 rounded-lg">
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
        
        {selectedBuddy.achievements && selectedBuddy.achievements.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-fitness-gray mb-1">Achievements</h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <ul className="list-disc list-inside space-y-1">
                {selectedBuddy.achievements.map((achievement, i) => (
                  <li key={i} className="text-sm">
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const renderReviews = () => {
    if (!selectedBuddy || !selectedBuddy.reviews || selectedBuddy.reviews.length === 0) {
      return (
        <div className="text-center py-6 text-gray-500">
          <p>No reviews yet</p>
          <p className="text-sm mt-1">This buddy hasn't received any reviews</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {selectedBuddy.reviews.map(review => (
          <Card key={review.id} className="p-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{review.author}</p>
                <div className="flex items-center gap-1 mt-1">
                  {renderRatingStars(review.rating)}
                </div>
              </div>
              <span className="text-xs text-gray-500">{review.date}</span>
            </div>
            <p className="text-sm mt-2">{review.text}</p>
          </Card>
        ))}
      </div>
    );
  };
  
  const renderDetailsTabs = () => {
    if (!selectedBuddy) return null;
    
    return (
      <Tabs value={detailsTab} onValueChange={setDetailsTab} className="mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews 
            {selectedBuddy.reviews && selectedBuddy.reviews.length > 0 && 
              ` (${selectedBuddy.reviews.length})`}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="pt-4">
          {renderUserProfile()}
        </TabsContent>
        
        <TabsContent value="reviews" className="pt-4">
          {renderReviews()}
        </TabsContent>
      </Tabs>
    );
  };
  
  const renderChat = () => {
    if (!activeChat.buddy) return null;
    
    return (
      <div className="flex flex-col h-[70vh]">
        <div className="flex items-center gap-2 pb-2 border-b">
          <Avatar className="w-8 h-8">
            <AvatarImage src={activeChat.buddy.avatar} alt={activeChat.buddy.name} />
            <AvatarFallback>{activeChat.buddy.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{activeChat.buddy.name}</p>
            <p className="text-xs text-gray-500">
              {activeChat.buddy.fitnessLevel} • {activeChat.buddy.preferredWorkouts[0]}
            </p>
          </div>
          <div className="ml-auto">
            <Button variant="ghost" size="icon">
              <MoreHorizontal size={18} />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {activeChat.messages.length > 0 ? (
            activeChat.messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    message.sender === "You" 
                      ? "bg-fitness-primary text-white rounded-tr-none" 
                      : "bg-gray-100 rounded-tl-none"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              <Mail size={36} className="mx-auto mb-2 opacity-50" />
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation with {activeChat.buddy.name}</p>
            </div>
          )}
        </div>
        
        <div className="border-t pt-3 mt-auto">
          <div className="flex gap-2">
            <Textarea 
              placeholder={`Message ${activeChat.buddy.name}...`}
              className="min-h-12 flex-1 resize-none"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button 
              size="icon" 
              className="h-10 w-10"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <Send size={20} />
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderConnectionsList = () => {
    if (connections.length === 0) {
      return (
        <div className="text-center py-10 text-gray-500">
          <Users size={36} className="mx-auto mb-2 opacity-50" />
          <p>No connections yet</p>
          <p className="text-sm">Find and connect with workout buddies</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-3">
        {connections.map(buddy => (
          <div 
            key={buddy.id} 
            className="p-3 border border-gray-100 rounded-xl flex gap-3 items-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => {
              setActiveChat({
                buddy,
                messages: buddy.id === activeChat.buddy?.id ? activeChat.messages : []
              });
              setView('chat');
            }}
          >
            <Avatar className="w-12 h-12">
              <AvatarImage src={buddy.avatar} alt={buddy.name} />
              <AvatarFallback>{buddy.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-medium">{buddy.name}</h3>
                <span className="text-xs text-gray-500">
                  {buddy.id === activeChat.buddy?.id && activeChat.messages.length > 0 ? 
                    activeChat.messages[activeChat.messages.length - 1].timestamp.toLocaleDateString() : 
                    'New'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <Dumbbell size={12} />
                <span>{buddy.fitnessLevel} • {buddy.preferredWorkouts[0]}</span>
              </div>
              {buddy.id === activeChat.buddy?.id && activeChat.messages.length > 0 && (
                <p className="text-sm text-gray-600 mt-1 truncate">
                  {activeChat.messages[activeChat.messages.length - 1].text}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderRequestsList = () => {
    const pendingRequests = buddyRequests.filter(req => req.status === 'pending');
    const otherRequests = buddyRequests.filter(req => req.status !== 'pending');
    
    if (buddyRequests.length === 0) {
      return (
        <div className="text-center py-10 text-gray-500">
          <Bell size={36} className="mx-auto mb-2 opacity-50" />
          <p>No requests</p>
          <p className="text-sm">You don't have any buddy requests</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {pendingRequests.length > 0 && (
          <>
            <h3 className="font-medium">Pending Requests</h3>
            {pendingRequests.map(request => (
              <Card key={request.id} className="p-3">
                <div className="flex gap-3 items-center">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={request.buddy.avatar} alt={request.buddy.name} />
                    <AvatarFallback>{request.buddy.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{request.buddy.name}</h4>
                      <span className="text-xs text-gray-500">{request.date}</span>
                    </div>
                    {request.message && (
                      <p className="text-sm text-gray-600 mt-1">{request.message}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Button 
                        size="sm" 
                        className="h-8 px-3"
                        onClick={() => handleAcceptRequest(request.id)}
                      >
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 px-3"
                        onClick={() => handleDeclineRequest(request.id)}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}
        
        {otherRequests.length > 0 && (
          <>
            <h3 className="font-medium">Previous Requests</h3>
            {otherRequests.map(request => (
              <Card key={request.id} className="p-3">
                <div className="flex gap-3 items-center">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={request.buddy.avatar} alt={request.buddy.name} />
                    <AvatarFallback>{request.buddy.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{request.buddy.name}</h4>
                      <Badge variant={request.status === 'accepted' ? 'success' : 'destructive'}>
                        {request.status === 'accepted' ? 'Accepted' : 'Declined'}
                      </Badge>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">{request.date}</span>
                      {request.status === 'accepted' && (
                        <Button 
                          variant="link" 
                          className="h-6 p-0 text-xs text-fitness-primary"
                          onClick={() => {
                            setActiveChat({
                              buddy: request.buddy,
                              messages: []
                            });
                            setView('chat');
                          }}
                        >
                          Message
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <button
        className="fixed bottom-24 right-4 z-20 bg-fitness-primary text-white rounded-full p-3 shadow-lg flex items-center gap-2"
        onClick={handleOpenDialog}
      >
        <Users size={20} />
        <span className="font-medium">Find Buddy</span>
        {hasUnreadRequests && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        )}
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
              ) : view === 'details' ? (
                <>
                  <Users size={18} /> Buddy Details
                </>
              ) : view === 'chat' ? (
                <>
                  <MessageSquare size={18} /> Chat
                </>
              ) : view === 'requests' ? (
                <>
                  <Bell size={18} /> Buddy Requests
                  <Badge 
                    variant="destructive" 
                    className="ml-2 h-5 px-1"
                  >
                    {buddyRequests.filter(r => r.status === 'pending').length}
                  </Badge>
                </>
              ) : (
                <>
                  <Heart size={18} /> Your Buddies
                </>
              )}
            </DialogTitle>
            
            {(view === 'chat' || view === 'details') && (
              <div className="mt-2">
                <button
                  className="flex items-center gap-1 text-sm font-medium"
                  onClick={() => view === 'chat' ? setView('connections') : setView('main')}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
              </div>
            )}
            
            {view === 'main' && (
              <div className="flex gap-4 mt-2">
                <button
                  className="flex items-center gap-1 text-sm text-fitness-primary"
                  onClick={() => {
                    setView('connections');
                  }}
                >
                  <Heart size={16} />
                  <span>My Buddies</span>
                </button>
                
                <button
                  className="flex items-center gap-1 text-sm text-fitness-primary relative"
                  onClick={() => {
                    setView('requests');
                    setHasUnreadRequests(false);
                  }}
                >
                  <Bell size={16} />
                  <span>Requests</span>
                  {hasUnreadRequests && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </div>
            )}
            
            {(view === 'requests' || view === 'connections') && (
              <div className="mt-2">
                <button
                  className="flex items-center gap-1 text-sm font-medium"
                  onClick={() => setView('main')}
                >
                  <ArrowLeft size={16} />
                  <span>Back to search</span>
                </button>
              </div>
            )}
          </DialogHeader>

          {view === 'main' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by name"
                    className="pl-8 pr-4 py-2 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setView('filter')}
                >
                  <Filter size={20} />
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Find workout partners based on location, interests and goals
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
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={buddy.avatar} alt={buddy.name} />
                          <AvatarFallback>{buddy.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        {buddy.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5">
                            <CheckCircle size={12} />
                          </div>
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
              
              <div>
                <label className="block text-sm font-medium mb-1">Experience Level</label>
                <select
                  className="w-full p-2 rounded-lg border border-gray-200"
                  value={filters.experience}
                  onChange={(e) => setFilters({...filters, experience: e.target.value})}
                >
                  <option value="all">All Experience</option>
                  <option value="beginner">Beginner (< 1 year)</option>
                  <option value="intermediate">Intermediate (1-3 years)</option>
                  <option value="advanced">Advanced (3+ years)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Personality Type</label>
                <select
                  className="w-full p-2 rounded-lg border border-gray-200"
                  value={filters.personality}
                  onChange={(e) => setFilters({...filters, personality: e.target.value})}
                >
                  <option value="all">All Personalities</option>
                  <option value="motivated">Motivated</option>
                  <option value="disciplined">Disciplined</option>
                  <option value="competitive">Competitive</option>
                  <option value="supportive">Supportive</option>
                  <option value="friendly">Friendly</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="verified" 
                  className="h-4 w-4 text-fitness-primary"
                  checked={filters.verified}
                  onChange={(e) => setFilters({...filters, verified: e.target.checked})}
                />
                <label htmlFor="verified" className="ml-2 text-sm font-medium">
                  Verified users only
                </label>
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
              {renderDetailsTabs()}
              
              <Separator />
              
              <Button 
                className="w-full flex items-center justify-center gap-2"
                onClick={handleContactBuddy}
              >
                <MessageSquare size={18} />
                <span>Contact Buddy</span>
              </Button>
            </div>
          )}
          
          {view === 'chat' && renderChat()}
          
          {view === 'requests' && renderRequestsList()}
          
          {view === 'connections' && (
            <div className="space-y-4">
              <h3 className="font-medium">Your Workout Buddies</h3>
              {renderConnectionsList()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WorkoutBuddyFinder;
