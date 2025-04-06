
import React, { useState, useEffect } from 'react';
import { Brain, Send, ArrowRight, Sparkles, X, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { showActionToast } from '@/utils/toast-utils';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SuggestedQuestion {
  id: number;
  text: string;
  category: string;
}

const suggestedQuestions: SuggestedQuestion[] = [
  { id: 1, text: "How can I stay motivated with my workouts?", category: "motivation" },
  { id: 2, text: "What's the best exercise for lower back pain?", category: "health" },
  { id: 3, text: "Can you create a beginner-friendly workout plan?", category: "plan" },
  { id: 4, text: "How much protein should I eat per day?", category: "nutrition" },
  { id: 5, text: "What's the best time of day to work out?", category: "general" },
  { id: 6, text: "How can I improve my running endurance?", category: "cardio" },
  { id: 7, text: "What stretches should I do before weight training?", category: "tips" },
  { id: 8, text: "How do I calculate my macros for weight loss?", category: "nutrition" },
];

// Preset responses for demo purposes
const getAIResponse = (question: string): string => {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('motivation') || lowerQuestion.includes('motivated')) {
    return "Staying motivated with workouts is all about finding what works for you! Try these strategies:\n\n1. Set specific, achievable goals (run 5k, do 10 pushups)\n2. Find a workout buddy or join a class\n3. Mix up your routine to avoid boredom\n4. Track your progress with an app or journal\n5. Reward yourself after milestone achievements\n6. Remember your 'why' - the deeper reason you started\n\nWould you like specific motivation ideas for your particular fitness goals?";
  }
  
  if (lowerQuestion.includes('back pain') || lowerQuestion.includes('back')) {
    return "For lower back pain, gentle strengthening and stretching exercises can help. Try these (after consulting your doctor):\n\n1. Cat-cow stretches\n2. Partial crunches\n3. Pelvic tilts\n4. Swimming\n5. Wall sits\n6. Gentle yoga poses like child's pose\n\nRemember to maintain proper form, start slowly, and stop if pain increases. Would you like me to explain any of these exercises in more detail?";
  }
  
  if (lowerQuestion.includes('workout plan') || lowerQuestion.includes('beginner')) {
    return "Here's a simple beginner-friendly workout plan:\n\nMonday: Full-body strength (squats, pushups, lunges)\nTuesday: 20-30 min light cardio (walking, cycling)\nWednesday: Rest or gentle yoga\nThursday: Upper body focus (modified pushups, dumbbell exercises)\nFriday: Lower body focus (lunges, glute bridges)\nSat/Sun: Active recovery (walking, stretching)\n\nStart with 2-3 sets of 8-12 reps, with proper form. Increase gradually as you get stronger. Would you like more detailed instructions for any of these workouts?";
  }
  
  if (lowerQuestion.includes('protein')) {
    return "For average adults, the general recommendation is about 0.8g of protein per kilogram of body weight daily. However, if you're physically active or looking to build muscle, you might need more:\n\n- Moderate activity: 1.2-1.4g per kg\n- High activity/endurance: 1.4-1.7g per kg\n- Strength/power athletes: 1.6-2.0g per kg\n\nGood protein sources include lean meats, fish, eggs, dairy, legumes, and protein supplements if needed. Would you like help calculating your specific protein needs based on your weight and activity level?";
  }
  
  if (lowerQuestion.includes('time of day') || lowerQuestion.includes('when to')) {
    return "The best time to work out is whenever you can do it consistently! There are benefits to different times:\n\nMorning:\n- Fewer distractions and schedule conflicts\n- May improve focus and energy throughout day\n- Can help establish routine\n\nAfternoon:\n- Body temperature is higher, possibly reducing injury risk\n- Strength and endurance may peak\n- Reaction time is quicker\n\nEvening:\n- Muscles are warmed up from daily activities\n- Potentially higher anaerobic capacity\n- May help some people with sleep\n\nThe most important factor is consistency. What's your current schedule like?";
  }
  
  return "That's an interesting question! As your AI fitness coach, I'd be happy to help you with this. The key to any fitness journey is consistency and finding what works best for your body and lifestyle. Would you like me to provide some specific advice tailored to your situation?";
};

const AIFitnessCoach: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { isAuthenticated } = useAuth();
  
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Add welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          role: 'assistant',
          content: "Hi there! I'm your AI Fitness Coach. I can help with workout advice, nutrition tips, and motivation. How can I assist you today?",
          timestamp: new Date()
        }
      ]);
    }
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: newMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    
    // Simulate AI thinking
    setTimeout(() => {
      // Add AI response
      const aiResponse: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: getAIResponse(userMessage.content),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleSuggestedQuestion = (question: string) => {
    setNewMessage(question);
  };
  
  return (
    <>
      <Card className="border border-fitness-primary/20 bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain size={20} className="text-fitness-primary" />
            AI Fitness Coach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-fitness-gray mb-4">
            Your personal AI coach can help with workouts, nutrition, and motivation
          </p>
          
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-fitness-primary/10 flex items-center justify-center flex-shrink-0">
                  <Brain size={18} className="text-fitness-primary" />
                </div>
                <div className="text-sm line-clamp-3">
                  "Hi there! I'm your AI Fitness Coach. I can help with workout advice, nutrition tips, and motivation. How can I assist you today?"
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {suggestedQuestions.slice(0, 3).map(question => (
                  <Badge 
                    key={question.id} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSuggestedQuestion(question.text)}
                  >
                    {question.text}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Textarea 
                placeholder="Ask your fitness question..."
                className="min-h-12 resize-none"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (isAuthenticated) {
                      handleSendMessage();
                    } else {
                      showActionToast("Please login to use the AI Coach");
                    }
                  }
                }}
              />
              <Button 
                className="h-12 px-3"
                onClick={() => {
                  if (isAuthenticated) {
                    handleSendMessage();
                  } else {
                    showActionToast("Please login to use the AI Coach");
                  }
                }}
                disabled={!newMessage.trim()}
              >
                <Send size={18} />
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={() => {
                if (isAuthenticated) {
                  setIsDialogOpen(true);
                } else {
                  showActionToast("Please login to use the AI Coach");
                }
              }}
            >
              <MessageSquare size={16} />
              <span>Open Full Conversation</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] h-[80vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="flex items-center gap-2">
              <Brain size={20} className="text-fitness-primary" />
              AI Fitness Coach
            </DialogTitle>
            <DialogDescription>
              Your personal guide to fitness and wellness
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-6 pt-0">
            <div className="space-y-6">
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === 'user' 
                      ? 'bg-fitness-primary text-white ml-4 rounded-tr-none' 
                      : 'bg-gray-100 mr-4 rounded-tl-none'
                  }`}>
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-1 mb-1">
                        <Sparkles size={14} className="text-fitness-primary" />
                        <span className="text-xs font-medium text-fitness-primary">AI Coach</span>
                      </div>
                    )}
                    <div className="whitespace-pre-line text-sm">
                      {message.content}
                    </div>
                    <div className="text-xs opacity-70 mt-1 text-right">
                      {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl p-4 max-w-[80%] mr-4 rounded-tl-none">
                    <div className="flex items-center gap-1 mb-1">
                      <Sparkles size={14} className="text-fitness-primary" />
                      <span className="text-xs font-medium text-fitness-primary">AI Coach</span>
                    </div>
                    <div className="flex gap-1 items-center h-6">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
                           style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
                           style={{animationDelay: '300ms'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
                           style={{animationDelay: '600ms'}}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <div className="p-4 border-t">
            <div>
              <p className="text-xs text-muted-foreground mb-3">Suggested questions:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {suggestedQuestions.map(question => (
                  <Badge 
                    key={question.id} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSuggestedQuestion(question.text)}
                  >
                    {question.text}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Textarea 
                placeholder="Type your message..."
                className="min-h-12 resize-none"
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
                className="h-12 w-12"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIFitnessCoach;
