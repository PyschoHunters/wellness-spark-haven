
import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface ChatMessage {
  type: 'user' | 'bot';
  content: string;
}

const faqs: FAQ[] = [
  {
    question: "What features does this app offer?",
    answer: "Our fitness app offers workout tracking, custom exercise timers, workout scheduling with reminders, activity statistics, personalized recommendations, diet tracking, body progress monitoring, and a chat assistant for guidance."
  },
  {
    question: "How do I schedule a workout?",
    answer: "Navigate to the Schedule tab, select a date, and click on 'Add New Workout' to create a custom workout schedule with exercises of your choice."
  },
  {
    question: "Can I get reminders for my workouts?",
    answer: "Yes! When you schedule a workout, click the 'Get Reminder' button and provide your email address to receive an immediate notification with details about your upcoming workout."
  },
  {
    question: "How do I track my progress?",
    answer: "Your activity and progress are automatically tracked in the Activity tab, where you can view statistics and charts of your workouts. You can also monitor your body measurements in the Profile section."
  },
  {
    question: "Who can I contact for support?",
    answer: "For any questions or support, please email us at manumohan.ai21@gmail.com"
  },
  {
    question: "app features",
    answer: "Our fitness app includes: 1) Workout tracking to log your exercises, 2) Custom timers for your workouts, 3) Scheduling with email reminders, 4) Progress statistics and charts, 5) Personalized workout and nutrition recommendations, 6) Diet tracking, 7) Body measurement tracking, and 8) This helpful assistant."
  },
  {
    question: "email reminders",
    answer: "When you click 'Get Reminder' for a workout, we'll immediately send an email reminder to your registered email address (manumohan.ai21@gmail.com) with details about your scheduled workout."
  },
  {
    question: "workout types",
    answer: "We offer various workout types including: Full Body Workout, HIIT Training, Yoga Basics, Cardio, Strength Training, and more. Each workout comes with detailed instructions and timers. You can also create custom workouts with our 'Add Workout' feature."
  },
  {
    question: "exercise routines",
    answer: "Our exercise routines include jumping jacks, push-ups, squats, planks, mountain climbers, lunges, burpees, yoga poses and many more. Each exercise comes with an image and timer to help you perform it correctly."
  },
  {
    question: "how to use timers",
    answer: "When you start a workout, each exercise has its own timer. Follow the countdown to complete each exercise for the recommended duration. You can pause or skip exercises as needed."
  },
  {
    question: "diet plans",
    answer: "We offer customized diet plans based on your fitness goals. You can browse meal options for breakfast, lunch, dinner and snacks. You can also receive email reminders for your meal schedules to help you stay on track with your nutrition."
  },
  {
    question: "beginner tips",
    answer: "For beginners, we recommend starting with our 'Yoga Basics' or 'Full Body Workout' at a slower pace. Focus on proper form rather than speed, and gradually increase intensity as you build strength and endurance."
  },
  {
    question: "advanced workouts",
    answer: "For advanced users, try our HIIT Training or create custom workout routines with higher intensity exercises. You can also increase the number of sets or reduce rest time between exercises."
  },
  {
    question: "how to track body progress",
    answer: "In the Profile section, you'll find the Body Progress tracker where you can log and view changes in your weight, body measurements, and other metrics over time. This helps you see your fitness journey visually."
  },
  {
    question: "how to get personalized recommendations",
    answer: "We provide personalized workout and nutrition recommendations based on your fitness level, goals, and recent activity. These can be found in the Profile section and are updated regularly to help you progress."
  },
  {
    question: "achievements",
    answer: "As you use the app and complete workouts, you'll earn achievements for milestones like your first workout, calories burned, and workout streaks. View your achievements in the Profile section to stay motivated."
  },
  {
    question: "how to add a workout",
    answer: "Go to the Schedule tab, select 'Add New Workout', then customize your workout by selecting exercises, setting durations, and organizing them in your preferred order. Save your workout to access it anytime."
  },
  {
    question: "what is HIIT",
    answer: "HIIT (High-Intensity Interval Training) is a workout method that alternates between short, intense bursts of exercise and brief recovery periods. It's effective for burning calories and improving cardiovascular health in a short amount of time."
  },
  {
    question: "what yoga poses do you offer",
    answer: "We offer various yoga poses including Downward Dog, Warrior I, Warrior II, Triangle Pose, Tree Pose, Child's Pose, Bridge Pose, and many more. Each comes with proper instructions and timer to help maintain the pose correctly."
  },
  {
    question: "nutrition advice",
    answer: "Our app provides nutrition advice tailored to your fitness goals. For weight loss, focus on a calorie deficit with high protein. For muscle gain, consider a slight surplus with high protein intake. All recommended meals include nutritional information to help you make informed choices."
  }
];

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {type: 'bot', content: 'Hi there! How can I help you today? You can ask me about our app features, schedules, or how to track your progress.'}
  ]);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  
  const findMatchingFaq = (userQuery: string): FAQ | undefined => {
    const normalizedQuery = userQuery.toLowerCase().trim();
    
    // First try exact match
    const exactMatch = faqs.find(faq => 
      faq.question.toLowerCase() === normalizedQuery
    );
    
    if (exactMatch) return exactMatch;
    
    // Then try partial matches
    const partialMatches = faqs.filter(faq => {
      // Check if query contains key terms from FAQ question
      return faq.question.toLowerCase().includes(normalizedQuery) || 
        normalizedQuery.includes(faq.question.toLowerCase());
    });
    
    // If we have a partial match, return the best one (shortest question for relevance)
    if (partialMatches.length > 0) {
      return partialMatches.sort((a, b) => a.question.length - b.question.length)[0];
    }
    
    // Check for keyword matches
    const keywords = normalizedQuery.split(' ');
    for (const keyword of keywords) {
      if (keyword.length < 3) continue; // Skip very short words
      
      const keywordMatches = faqs.filter(faq => 
        faq.question.toLowerCase().includes(keyword) || 
        faq.answer.toLowerCase().includes(keyword)
      );
      
      if (keywordMatches.length > 0) {
        return keywordMatches[0];
      }
    }
    
    return undefined;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (query.trim() === '') return;
    
    // Add user message
    const newMessages = [...messages, {type: 'user' as const, content: query}];
    setMessages(newMessages);
    
    // Find matching FAQ using improved matching
    const matchingFaq = findMatchingFaq(query);
    
    setTimeout(() => {
      if (matchingFaq) {
        setMessages([...newMessages, {type: 'bot' as const, content: matchingFaq.answer}]);
      } else {
        setMessages([
          ...newMessages, 
          {type: 'bot' as const, content: "I don't have information about that specific topic. For our app features, try asking 'What features does this app offer?' or for support, please email manumohan.ai21@gmail.com for more details."}
        ]);
      }
    }, 500);
    
    setQuery('');
  };

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-xl w-80 max-h-[500px] flex flex-col animate-scale-up overflow-hidden">
          <div className="bg-fitness-primary text-white p-3 flex justify-between items-center">
            <h3 className="font-medium">Fitness Assistant</h3>
            <button onClick={handleToggleChat} className="p-1">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 max-h-[350px] space-y-3">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`${
                  message.type === 'user' 
                    ? 'bg-fitness-gray-light ml-auto' 
                    : 'bg-fitness-primary/10'
                } p-2 rounded-lg max-w-[85%] ${
                  message.type === 'user' ? 'ml-auto' : 'mr-auto'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSubmit} className="border-t border-gray-100 p-2 flex">
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder="Ask a question..."
              className="flex-1 p-2 text-sm border border-gray-200 rounded-lg mr-2 focus:outline-none focus:ring-1 focus:ring-fitness-primary"
            />
            <button 
              type="submit" 
              className="bg-fitness-primary text-white p-2 rounded-lg"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={handleToggleChat}
          className="bg-fitness-primary text-white p-3 rounded-full shadow-lg hover:bg-fitness-primary/90 transition-colors"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
};

export default ChatAssistant;
