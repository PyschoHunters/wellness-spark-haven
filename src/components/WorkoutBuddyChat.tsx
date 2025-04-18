
import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Smile, 
  Paperclip, 
  Mic, 
  Search, 
  Bell, 
  BellOff, 
  Clock, 
  Check, 
  CheckCheck, 
  Image as ImageIcon,
  MoreHorizontal,
  ChevronDown,
  Heart,
  ThumbsUp,
  Star
} from 'lucide-react';
import { showActionToast } from '@/utils/toast-utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';

interface ChatMessage {
  id: string;
  senderId: number;
  text: string;
  timestamp: Date;
  isRead: boolean;
  reactions?: string[];
  attachments?: { type: 'image' | 'voice'; url: string }[];
  replyTo?: string;
}

interface WorkoutBuddyChatProps {
  buddy: {
    id: number;
    name: string;
    avatar: string;
    interests: string[];
    level: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTED_RESPONSES = [
  "What's your workout routine this week?",
  "Want to plan a yoga session together?",
  "Have you tried the new HIIT class?",
  "How long have you been into fitness?",
  "What's your favorite post-workout meal?"
];

const EMOJI_REACTIONS = ["❤️", "👍", "😊", "💪", "🔥", "👏", "✨", "🏋️‍♂️", "🧘‍♀️", "🏃‍♂️"];

const WorkoutBuddyChat: React.FC<WorkoutBuddyChatProps> = ({ buddy, isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationsMuted, setNotificationsMuted] = useState(false);
  const [chatStreakCount, setChatStreakCount] = useState(3);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Simulate loading past messages
  useEffect(() => {
    if (buddy && isOpen) {
      // Simulate fetching chat history when opening chat with a buddy
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          senderId: buddy.id,
          text: `Hi there! I see we're both into ${buddy.interests[0]}!`,
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
          isRead: true
        },
        {
          id: '2',
          senderId: 0, // current user
          text: "Hey! Yes, I've been practicing it for about 2 years now. How about you?",
          timestamp: new Date(Date.now() - 86300000),
          isRead: true
        },
        {
          id: '3',
          senderId: buddy.id,
          text: "That's awesome! I'm fairly new, only been at it for 6 months. Would love some tips sometime!",
          timestamp: new Date(Date.now() - 86200000),
          isRead: true
        },
        {
          id: '4',
          senderId: 0,
          text: "Of course! I'd be happy to share what I've learned. Maybe we could even schedule a session together?",
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          isRead: true
        },
        {
          id: '5',
          senderId: buddy.id,
          text: "That would be great! When are you usually free?",
          timestamp: new Date(Date.now() - 1800000), // 30 mins ago
          isRead: false,
          reactions: ["👍"]
        }
      ];
      setMessages(mockMessages);
      
      // Simulate buddy typing after a delay
      const typingTimeout = setTimeout(() => {
        setIsTyping(true);
        
        // Then simulate a new message arriving
        const messageTimeout = setTimeout(() => {
          setIsTyping(false);
          addMessage(buddy.id, "By the way, are you planning to join any fitness events this month?");
        }, 3000);
        
        return () => clearTimeout(messageTimeout);
      }, 5000);
      
      return () => clearTimeout(typingTimeout);
    }
  }, [buddy, isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (senderId: number, text: string, replyTo?: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId,
      text,
      timestamp: new Date(),
      isRead: senderId === 0, // Messages from current user are automatically read
      replyTo
    };
    
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    
    // If this is a message reply, close the thread view
    if (replyTo) {
      setActiveThreadId(null);
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    // Add user message
    addMessage(0, messageText, activeThreadId || undefined);
    setMessageText('');
    
    // Hide suggestions after sending a message
    setShowSuggestions(false);
    
    // Focus back on input
    inputRef.current?.focus();
    
    // Simulate chat streak increment
    setChatStreakCount(prev => prev + 1);
    
    // Show toast for milestone streaks
    if (chatStreakCount + 1 === 5) {
      showActionToast("5 day chat streak! 🔥 +10 Buddy Points");
    }
    
    // Simulate buddy typing and response
    setTimeout(() => {
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        
        // Simulate buddy response
        const responses = [
          "That's a great point!",
          "I agree. Want to try that next week?",
          "Interesting! I've been thinking about that too.",
          "Sounds like a plan. Let me know when you're free!",
          "Awesome! I'll add that to my routine."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(buddy?.id || 1, randomResponse, activeThreadId || undefined);
        
        // Mark message as read after a delay
        setTimeout(() => {
          setMessages(msgs => 
            msgs.map(msg => 
              msg.senderId === 0 && !msg.isRead ? { ...msg, isRead: true } : msg
            )
          );
        }, 2000);
      }, 3000);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(msgs => 
      msgs.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              reactions: msg.reactions 
                ? msg.reactions.includes(emoji) 
                  ? msg.reactions.filter(r => r !== emoji) 
                  : [...msg.reactions, emoji]
                : [emoji] 
            }
          : msg
      )
    );
  };

  const handleAttachment = (type: 'image' | 'voice') => {
    showActionToast(`${type === 'image' ? 'Image' : 'Voice note'} sharing coming soon!`);
  };

  const toggleNotifications = () => {
    setNotificationsMuted(!notificationsMuted);
    showActionToast(notificationsMuted 
      ? "Chat notifications enabled" 
      : "Chat notifications muted");
  };

  const handleUseSuggestion = (suggestion: string) => {
    setMessageText(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const startThread = (messageId: string) => {
    setActiveThreadId(messageId);
  };

  const filteredMessages = searchTerm 
    ? messages.filter(msg => 
        msg.text.toLowerCase().includes(searchTerm.toLowerCase()))
    : messages;

  const getThreadParentMessage = () => {
    return messages.find(msg => msg.id === activeThreadId);
  };

  const threadMessages = activeThreadId 
    ? messages.filter(msg => msg.replyTo === activeThreadId)
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={buddy?.avatar} alt={buddy?.name} />
                <AvatarFallback>{buddy?.name?.charAt(0) || "B"}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-base font-medium">
                  {buddy?.name || "Chat"}
                </DialogTitle>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  {isTyping ? (
                    <span className="text-blue-500 animate-pulse">typing...</span>
                  ) : (
                    <span>Active now</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {searchMode ? (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-sm rounded-full border border-gray-200 py-1 pl-8 pr-2 w-[150px]"
                    autoFocus
                  />
                  <Search className="absolute left-2 top-1.5 h-4 w-4 text-gray-400" />
                  <button 
                    className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setSearchMode(false);
                      setSearchTerm('');
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"></path><path d="M6 6l12 12"></path></svg>
                  </button>
                </div>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setSearchMode(true)}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={toggleNotifications}
                  >
                    {notificationsMuted ? (
                      <BellOff className="h-4 w-4" />
                    ) : (
                      <Bell className="h-4 w-4" />
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
          {buddy && (
            <div className="flex flex-wrap gap-1 mt-2">
              {buddy.interests.map((interest, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
              <Badge variant="outline" className={`
                ${buddy.level === 'Beginner' ? 'bg-green-50 text-green-700 border-green-200' : 
                  buddy.level === 'Intermediate' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                  'bg-purple-50 text-purple-700 border-purple-200'}
              `}>
                {buddy.level}
              </Badge>
            </div>
          )}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <div className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full flex items-center">
                <Star className="h-3 w-3 mr-1" />
                <span>{chatStreakCount} day streak</span>
              </div>
            </div>
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                Chat started {format(messages[0].timestamp, 'MMM d, yyyy')}
              </Button>
            )}
          </div>
        </DialogHeader>

        {activeThreadId ? (
          // Thread view
          <div className="flex flex-col flex-1">
            <div className="bg-gray-100 p-2 border-b flex items-start gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-1" 
                onClick={() => setActiveThreadId(null)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <div className="text-xs font-medium">Thread</div>
                <div className="bg-white p-2 rounded-lg mt-1 text-sm">
                  {getThreadParentMessage()?.text}
                </div>
              </div>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="flex flex-col gap-3">
                {threadMessages.length > 0 ? (
                  threadMessages.map((msg) => (
                    <div 
                      key={msg.id}
                      className={`flex ${msg.senderId === 0 ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`relative max-w-[80%] px-3 py-2 rounded-lg ${
                          msg.senderId === 0 
                            ? 'bg-blue-100 text-blue-800 rounded-br-none' 
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        <div className="text-sm">{msg.text}</div>
                        <div className="text-[10px] text-gray-500 mt-1 flex items-center justify-end gap-1">
                          {format(msg.timestamp, 'h:mm a')}
                          {msg.senderId === 0 && (
                            msg.isRead ? <CheckCheck className="h-3 w-3 text-blue-500" /> : <Check className="h-3 w-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 text-sm py-4">
                    No replies in this thread yet
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <div className="p-3 border-t flex items-center gap-2">
              <input
                type="text"
                placeholder="Reply to thread..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyPress}
                ref={inputRef}
                className="flex-1 py-2 px-3 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          // Regular chat view
          <>
            <ScrollArea className="flex-1 p-4">
              <div className="flex flex-col gap-3">
                {filteredMessages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${message.senderId === 0 ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.senderId !== 0 && (
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={buddy?.avatar} />
                        <AvatarFallback>{buddy?.name?.charAt(0) || "B"}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex flex-col">
                      <div 
                        className={`relative max-w-[260px] px-3 py-2 rounded-lg ${
                          message.senderId ===.0 
                            ? 'bg-blue-100 text-blue-800 rounded-br-none' 
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        <div className="text-sm">{message.text}</div>
                        <div className="text-[10px] text-gray-500 mt-1 flex items-center justify-end gap-1">
                          {format(message.timestamp, 'h:mm a')}
                          {message.senderId === 0 && (
                            message.isRead ? <CheckCheck className="h-3 w-3 text-blue-500" /> : <Check className="h-3 w-3" />
                          )}
                        </div>
                        
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="absolute -bottom-3 left-2 flex items-center bg-white rounded-full py-0.5 px-1 border shadow-sm">
                            {message.reactions.map((emoji, idx) => (
                              <span key={idx} className="text-xs">{emoji}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex text-[10px] text-gray-500 mt-1 items-center gap-2">
                        <button 
                          onClick={() => startThread(message.id)}
                          className="hover:text-blue-600 transition-colors"
                        >
                          Reply
                        </button>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="hover:text-blue-600 transition-colors">React</button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-1 flex gap-1">
                            {EMOJI_REACTIONS.map((emoji) => (
                              <button 
                                key={emoji} 
                                className="text-lg p-1 hover:bg-gray-100 rounded"
                                onClick={() => handleReaction(message.id, emoji)}
                              >
                                {emoji}
                              </button>
                            ))}
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex items-start">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={buddy?.avatar} />
                      <AvatarFallback>{buddy?.name?.charAt(0) || "B"}</AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 px-3 py-2 rounded-lg rounded-bl-none">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {showSuggestions && (
              <div className="px-4 py-2 border-t flex flex-wrap gap-2">
                {SUGGESTED_RESPONSES.map((suggestion, index) => (
                  <button
                    key={index}
                    className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors"
                    onClick={() => handleUseSuggestion(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            
            <div className="p-3 border-t">
              <div className="flex items-center gap-2 mb-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleAttachment('image')}
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Send image</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleAttachment('voice')}
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Record voice note</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setShowSuggestions(!showSuggestions)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Conversation starters</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <div className="flex-1"></div>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2 flex flex-wrap gap-1 max-w-[200px]">
                    {EMOJI_REACTIONS.concat(["😀", "😂", "🤣", "😊", "🥰", "😎", "🤔", "😴", "😭", "🙄"]).map((emoji) => (
                      <button 
                        key={emoji} 
                        className="text-xl p-1 hover:bg-gray-100 rounded"
                        onClick={() => {
                          setMessageText(prev => prev + emoji);
                          inputRef.current?.focus();
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  ref={inputRef}
                  className="flex-1 py-2 px-3 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <Button 
                  size="icon" 
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutBuddyChat;
