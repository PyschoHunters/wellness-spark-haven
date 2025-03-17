
import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What features does this app offer?",
    answer: "Our fitness app offers workout tracking, custom exercise timers, workout scheduling with reminders, activity statistics, and personalized recommendations based on your fitness level."
  },
  {
    question: "How do I schedule a workout?",
    answer: "Navigate to the Schedule tab, select a date, and click on 'Add New Workout' to create a custom workout schedule."
  },
  {
    question: "Can I get reminders for my workouts?",
    answer: "Yes! When you schedule a workout, click the 'Get Reminder' button and provide your email address to receive notifications."
  },
  {
    question: "How do I track my progress?",
    answer: "Your activity and progress are automatically tracked in the Activity tab, where you can view statistics and charts of your workouts."
  },
  {
    question: "Who can I contact for support?",
    answer: "For any questions or support, please email us at manumohan.ai21@gmail.com"
  }
];

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{type: 'user' | 'bot', content: string}[]>([
    {type: 'bot', content: 'Hi there! How can I help you today? You can ask me about our app features, schedules, or how to track your progress.'}
  ]);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (query.trim() === '') return;
    
    // Add user message
    const newMessages = [...messages, {type: 'user', content: query}];
    setMessages(newMessages);
    
    // Find matching FAQ or provide default response
    const matchingFaq = faqs.find(faq => 
      faq.question.toLowerCase().includes(query.toLowerCase()) || 
      query.toLowerCase().includes(faq.question.toLowerCase().split(' ').filter(word => word.length > 3).join(' '))
    );
    
    setTimeout(() => {
      if (matchingFaq) {
        setMessages([...newMessages, {type: 'bot', content: matchingFaq.answer}]);
      } else {
        setMessages([
          ...newMessages, 
          {type: 'bot', content: "I'm not sure about that. You can email manumohan.ai21@gmail.com for more specific questions."}
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
