
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, User, Clock, ThumbsUp, Send, Calendar, ExternalLink, Video } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showActionToast } from '@/utils/toast-utils';

interface ForumPost {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  title: string;
  content: string;
  tags: string[];
  likes: number;
  replies: number;
  timestamp: string; // ISO string
  category: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  date: string; // ISO string
  time: string;
  host: string;
  attendees: number;
  type: 'webinar' | 'q&a' | 'discussion';
  link: string;
}

const forumPosts: ForumPost[] = [
  {
    id: 1,
    author: {
      name: "SarahWellness",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    title: "Natural remedies that actually work for severe cramps?",
    content: "I've been struggling with severe menstrual cramps for years and I'm trying to move away from always relying on pain medication. Has anyone found natural remedies that actually make a difference for serious pain? I've tried ginger tea and a heating pad, but looking for more options.",
    tags: ["Cramps", "Natural Remedies", "Pain Management"],
    likes: 28,
    replies: 16,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Remedies"
  },
  {
    id: 2,
    author: {
      name: "AyurvedicHealer",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    title: "How I balanced my hormones through Ayurvedic practices",
    content: "After struggling with irregular periods and mood swings for years, I started incorporating Ayurvedic practices into my routine. Six months in, and the difference is amazing! My cycle is more regular, my PMS symptoms are much milder, and I feel more in tune with my body. Here's what worked for me...",
    tags: ["Ayurveda", "Hormone Balance", "Success Story"],
    likes: 45,
    replies: 23,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Success Stories"
  },
  {
    id: 3,
    author: {
      name: "FitnessFanatic",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg"
    },
    title: "Best yoga poses during different phases of your cycle?",
    content: "I've heard that certain yoga poses are better during different phases of your menstrual cycle. Does anyone have recommendations for what works best during: 1) menstruation, 2) follicular phase, 3) ovulation, and 4) luteal phase? I'd love to adapt my practice to support my body better.",
    tags: ["Yoga", "Exercise", "Cycle Phases"],
    likes: 32,
    replies: 19,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Fitness"
  },
  {
    id: 4,
    author: {
      name: "NutritionNerd",
      avatar: "https://randomuser.me/api/portraits/women/89.jpg"
    },
    title: "Foods that have helped reduce your PMS symptoms?",
    content: "I'm trying to use nutrition to help manage my PMS symptoms, especially mood swings and bloating. Has anyone found specific foods or eating patterns that make a noticeable difference? I've started eating more leafy greens and reducing sugar, but looking for more suggestions!",
    tags: ["Nutrition", "PMS", "Food"],
    likes: 41,
    replies: 27,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Nutrition"
  },
  {
    id: 5,
    author: {
      name: "MindfulMama",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    title: "How meditation changed my relationship with period pain",
    content: "I was skeptical at first, but after practicing mindfulness meditation consistently for 3 months, I've noticed a significant change in how I experience period pain. It's not that the sensations are gone, but my relationship with the discomfort has changed. Here's my practice and how it's helped...",
    tags: ["Meditation", "Mindfulness", "Pain Management"],
    likes: 37,
    replies: 14,
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Mindfulness"
  }
];

const upcomingEvents: Event[] = [
  {
    id: 1,
    title: "Ayurvedic Approaches to Menstrual Health",
    description: "Join Dr. Deepika Chopra, Ayurvedic practitioner, for an in-depth webinar on traditional approaches to modern period problems. Learn about dietary adjustments, herbs, and lifestyle practices for each dosha type.",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    time: "7:00 PM - 8:30 PM",
    host: "Dr. Deepika Chopra",
    attendees: 145,
    type: 'webinar',
    link: "#"
  },
  {
    id: 2,
    title: "Live Q&A with Gynecologist Dr. Sarah Chen",
    description: "Bring your questions about menstrual health, pain management, and cycle tracking to this live Q&A session with board-certified gynecologist Dr. Sarah Chen.",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    time: "6:00 PM - 7:00 PM",
    host: "Dr. Sarah Chen, MD",
    attendees: 98,
    type: 'q&a',
    link: "#"
  },
  {
    id: 3,
    title: "Community Discussion: Cultural Perspectives on Menstruation",
    description: "Join our diverse panel of women from around the world as they share cultural perspectives, traditions, and taboos surrounding menstruation. Learn how different societies approach period care and celebration.",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    time: "11:00 AM - 12:30 PM",
    host: "Nari Shakti Community Team",
    attendees: 72,
    type: 'discussion',
    link: "#"
  }
];

const CommunityForums = () => {
  const [activeTab, setActiveTab] = useState<string>("discussions");
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [postDetailsOpen, setPostDetailsOpen] = useState(false);
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>(forumPosts);
  
  // Filter posts by category
  useEffect(() => {
    if (activeCategory) {
      setFilteredPosts(forumPosts.filter(post => post.category === activeCategory));
    } else {
      setFilteredPosts(forumPosts);
    }
  }, [activeCategory]);
  
  const handleCategoryClick = (category: string) => {
    if (activeCategory === category) {
      setActiveCategory(null);
    } else {
      setActiveCategory(category);
    }
  };
  
  const handlePostClick = (post: ForumPost) => {
    setSelectedPost(post);
    setPostDetailsOpen(true);
  };
  
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setEventDetailsOpen(true);
  };
  
  const handleLikePost = (postId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Update UI to show like was registered
    const updatedPosts = filteredPosts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    });
    
    setFilteredPosts(updatedPosts);
    showActionToast("Post liked!");
  };
  
  const handleSubmitReply = () => {
    if (replyText.trim() === '') return;
    
    if (selectedPost) {
      // Update UI to show reply was posted
      const updatedPosts = filteredPosts.map(post => {
        if (post.id === selectedPost.id) {
          return { ...post, replies: post.replies + 1 };
        }
        return post;
      });
      
      setFilteredPosts(updatedPosts);
      setReplyText('');
      showActionToast("Reply posted successfully!");
      setPostDetailsOpen(false);
    }
  };
  
  const handleRSVP = () => {
    if (selectedEvent) {
      // Update UI to show RSVP was registered
      const updatedEvents = upcomingEvents.map(event => {
        if (event.id === selectedEvent.id) {
          return { ...event, attendees: event.attendees + 1 };
        }
        return event;
      });
      
      setSelectedEvent(null);
      showActionToast("RSVP confirmed! You'll receive a reminder before the event.");
      setEventDetailsOpen(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval === 1 ? '1 day ago' : `${interval} days ago`;
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
    }
    
    return 'Just now';
  };
  
  const getEventTypeIcon = (type: string) => {
    switch(type) {
      case 'webinar': return <Users className="h-4 w-4 text-sky-500" />;
      case 'q&a': return <MessageCircle className="h-4 w-4 text-purple-500" />;
      case 'discussion': return <Users className="h-4 w-4 text-rose-500" />;
      default: return null;
    }
  };
  
  const getEventTypeColor = (type: string) => {
    switch(type) {
      case 'webinar': return 'bg-sky-100 text-sky-800';
      case 'q&a': return 'bg-purple-100 text-purple-800';
      case 'discussion': return 'bg-rose-100 text-rose-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <>
      <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-sky-100 to-sky-200 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-sky-800">
              <MessageCircle className="h-5 w-5" />
              Community
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 rounded-none">
              <TabsTrigger value="discussions" className="rounded-none data-[state=active]:bg-white">
                <MessageCircle className="h-4 w-4 mr-2" />
                Discussions
              </TabsTrigger>
              <TabsTrigger value="events" className="rounded-none data-[state=active]:bg-white">
                <Calendar className="h-4 w-4 mr-2" />
                Events
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="discussions" className="p-4 space-y-3">
              <div className="flex space-x-2 overflow-x-auto pb-2 -mx-1 px-1">
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-shrink-0 rounded-full text-xs ${activeCategory === 'Remedies' ? 'bg-sky-100 text-sky-800 border-sky-200' : ''}`}
                  onClick={() => handleCategoryClick('Remedies')}
                >
                  Remedies
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-shrink-0 rounded-full text-xs ${activeCategory === 'Nutrition' ? 'bg-sky-100 text-sky-800 border-sky-200' : ''}`}
                  onClick={() => handleCategoryClick('Nutrition')}
                >
                  Nutrition
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-shrink-0 rounded-full text-xs ${activeCategory === 'Fitness' ? 'bg-sky-100 text-sky-800 border-sky-200' : ''}`}
                  onClick={() => handleCategoryClick('Fitness')}
                >
                  Fitness
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-shrink-0 rounded-full text-xs ${activeCategory === 'Mindfulness' ? 'bg-sky-100 text-sky-800 border-sky-200' : ''}`}
                  onClick={() => handleCategoryClick('Mindfulness')}
                >
                  Mindfulness
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-shrink-0 rounded-full text-xs ${activeCategory === 'Success Stories' ? 'bg-sky-100 text-sky-800 border-sky-200' : ''}`}
                  onClick={() => handleCategoryClick('Success Stories')}
                >
                  Success Stories
                </Button>
              </div>
              
              {filteredPosts.map((post) => (
                <div 
                  key={post.id}
                  className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handlePostClick(post)}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={post.author.avatar} 
                        alt={post.author.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{post.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>{post.author.name}</span>
                        <span>•</span>
                        <span>{timeAgo(post.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2 ml-11">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center justify-between ml-11">
                    <div className="flex gap-1">
                      {post.tags.slice(0, 2).map((tag, i) => (
                        <Badge 
                          key={i} 
                          variant="outline" 
                          className="text-[10px] px-1 py-0 h-4 bg-sky-50 text-sky-700 border-sky-200"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 2 && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                          +{post.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-sky-600 transition-colors"
                        onClick={(e) => handleLikePost(post.id, e)}
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span>{post.likes}</span>
                      </button>
                      
                      <button className="flex items-center gap-1 text-xs text-gray-500">
                        <MessageCircle className="h-3 w-3" />
                        <span>{post.replies}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button 
                className="w-full mt-2 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white rounded-xl flex items-center gap-2"
                onClick={() => setNewPostOpen(true)}
              >
                <MessageCircle className="h-4 w-4" />
                Start a New Discussion
              </Button>
            </TabsContent>
            
            <TabsContent value="events" className="p-4 space-y-4">
              {upcomingEvents.map((event) => (
                <div 
                  key={event.id}
                  className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      event.type === 'webinar' ? 'bg-sky-100' : 
                      event.type === 'q&a' ? 'bg-purple-100' : 'bg-rose-100'
                    }`}>
                      {getEventTypeIcon(event.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Badge className={getEventTypeColor(event.type)}>
                          {event.type.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(event.date)}
                        </span>
                      </div>
                      
                      <h3 className="font-medium mt-1">{event.title}</h3>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-3 border-t border-gray-200 pt-3">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {event.host}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {event.attendees} attending
                      </span>
                    </div>
                    
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {event.time}
                    </span>
                  </div>
                </div>
              ))}
              
              <Button 
                className="w-full mt-2 bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white rounded-xl flex items-center gap-2"
                onClick={() => window.open('https://meet.jit.si/', '_blank')}
              >
                <Video className="h-4 w-4" />
                Join Live Community Call
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Dialog open={postDetailsOpen} onOpenChange={setPostDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Discussion Thread</DialogTitle>
          </DialogHeader>
          
          {selectedPost && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src={selectedPost.author.avatar} 
                      alt={selectedPost.author.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{selectedPost.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span>{selectedPost.author.name}</span>
                      <span>•</span>
                      <span>{timeAgo(selectedPost.timestamp)}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 ml-13">
                  {selectedPost.content}
                </p>
                
                <div className="flex flex-wrap gap-1 ml-13">
                  {selectedPost.tags.map((tag, i) => (
                    <Badge 
                      key={i} 
                      variant="outline" 
                      className="text-xs bg-sky-50 text-sky-700 border-sky-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-4 ml-13 pt-2 border-t border-gray-100">
                  <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-sky-600 transition-colors">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{selectedPost.likes}</span>
                  </button>
                  
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <MessageCircle className="h-4 w-4" />
                    <span>{selectedPost.replies} replies</span>
                  </span>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Add your reply</h4>
                <textarea
                  className="w-full p-2 border rounded-md text-sm"
                  rows={3}
                  placeholder="Share your thoughts or experiences..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                
                <div className="flex justify-end mt-2">
                  <Button
                    className="bg-sky-500 hover:bg-sky-600 flex items-center gap-1"
                    size="sm"
                    onClick={handleSubmitReply}
                    disabled={replyText.trim() === ''}
                  >
                    <Send className="h-3 w-3" />
                    Post Reply
                  </Button>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500 pt-2">
                <p>
                  By participating, you agree to our Community Guidelines.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={eventDetailsOpen} onOpenChange={setEventDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Event Details</DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getEventTypeColor(selectedEvent.type)}>
                  {selectedEvent.type.toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(selectedEvent.date)}
                </span>
              </div>
              
              <h2 className="text-xl font-semibold">{selectedEvent.title}</h2>
              
              <p className="text-sm text-gray-600">
                {selectedEvent.description}
              </p>
              
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Time
                  </span>
                  <span className="font-medium">{selectedEvent.time}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Host
                  </span>
                  <span className="font-medium">{selectedEvent.host}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Attendees
                  </span>
                  <span className="font-medium">{selectedEvent.attendees} people</span>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-2">
                <Button 
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={() => window.open(selectedEvent.link || 'https://meet.jit.si/', '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                  View Link
                </Button>
                
                <Button 
                  className="flex-1 bg-purple-500 hover:bg-purple-600 flex items-center justify-center gap-2"
                  onClick={handleRSVP}
                >
                  <Calendar className="h-4 w-4" />
                  RSVP
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Discussion</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <input 
                type="text"
                className="w-full p-2 border rounded-md mt-1"
                placeholder="What would you like to discuss?"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Content</label>
              <textarea
                className="w-full p-2 border rounded-md mt-1"
                rows={5}
                placeholder="Share your question, experience or thoughts..."
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Tags</label>
              <input 
                type="text"
                className="w-full p-2 border rounded-md mt-1"
                placeholder="Add tags separated by commas"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Category</label>
              <select className="w-full p-2 border rounded-md mt-1">
                <option value="">Select a category</option>
                <option value="Remedies">Remedies</option>
                <option value="Nutrition">Nutrition</option>
                <option value="Fitness">Fitness</option>
                <option value="Mindfulness">Mindfulness</option>
                <option value="Success Stories">Success Stories</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewPostOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-sky-500 hover:bg-sky-600"
              onClick={() => {
                setNewPostOpen(false);
                showActionToast("Your discussion has been posted!");
              }}
            >
              Post Discussion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommunityForums;
