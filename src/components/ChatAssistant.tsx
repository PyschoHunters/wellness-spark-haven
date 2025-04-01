
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
  },
  // Previously added questions
  {
    question: "how accurate are the calorie counts",
    answer: "Our calorie counting is based on standardized metabolic calculations that consider exercise type, duration, intensity, and your personal metrics like weight. While not exact, they provide a reliable estimate to track your progress and energy expenditure."
  },
  {
    question: "can I sync with fitness trackers",
    answer: "Currently, our app doesn't directly integrate with fitness trackers, but you can manually enter activity data from your devices. We're working on adding integrations with popular fitness wearables in future updates."
  },
  {
    question: "Indian diet options",
    answer: "Yes, we offer numerous Indian diet options tailored for fitness goals! Our meal suggestions include protein-rich dal preparations, roti with vegetables, paneer dishes, raita, khichdi, oats idli, vegetable upma, sprouts salad, and more - all with complete nutritional information."
  },
  {
    question: "vegetarian protein sources",
    answer: "Our app recommends many vegetarian protein sources including paneer, tofu, legumes (lentils, chickpeas, beans), dairy products (Greek yogurt, cottage cheese), quinoa, nuts and seeds (almonds, chia seeds), soy products, and protein-enriched plant milk. All our vegetarian meal plans ensure adequate protein intake."
  },
  {
    question: "how to use AI recommendations",
    answer: "To get personalized AI recommendations, go to the Profile section and look for the 'AI Personalized Plan' option. Click on it, fill in your health details including fitness goals, BMI, and any health issues. Our AI will then generate tailored workout and nutrition recommendations specific to your profile."
  },
  {
    question: "workout frequency recommendations",
    answer: "For beginners, we recommend 2-3 workouts per week with rest days in between. Intermediate users should aim for 3-4 workouts weekly with proper recovery. Advanced users can exercise 4-6 times per week, varying intensity and targeting different muscle groups. Always listen to your body and include at least one full rest day weekly."
  },
  {
    question: "how to track achievements",
    answer: "Your achievements are automatically tracked as you use the app. Visit the Profile section to view all your earned and locked achievements. You'll earn achievements for completing workouts, burning calories, maintaining streaks, and reaching fitness milestones. These visual markers help keep you motivated on your fitness journey."
  },
  {
    question: "water intake recommendations",
    answer: "We recommend drinking at least 2-3 liters of water daily, adjusting for your activity level and climate. During workouts, aim to drink about 200-300ml every 15-20 minutes. Our app can help you track your daily water intake to ensure proper hydration, which is crucial for optimal workout performance and recovery."
  },
  {
    question: "rest and recovery tips",
    answer: "Proper recovery is essential for fitness progress. We recommend: 1) Get 7-8 hours of quality sleep nightly, 2) Include 1-2 complete rest days weekly, 3) Try light activities like walking or yoga on recovery days, 4) Stay hydrated, 5) Consider foam rolling for muscle recovery, and 6) Consume protein within 30-45 minutes post-workout to aid muscle repair."
  },
  {
    question: "how to customize my profile",
    answer: "To customize your profile, go to the Profile section where you can update your personal information, fitness level, goals, and preferences. The more accurate your profile information, the better our system can tailor workouts and nutrition recommendations to your specific needs. Don't forget to update your measurements regularly to track your progress!"
  },
  // New questions added as requested
  {
    question: "can i connect this app with google fit",
    answer: "Currently, we don't have a direct integration with Google Fit, but it's on our roadmap for future updates. We plan to implement synchronization with Google Fit to automatically import your activity data, steps, and other metrics to provide a more comprehensive fitness tracking experience. We'll notify all users when this feature becomes available."
  },
  {
    question: "What are some good exercises for beginners",
    answer: "For beginners, we recommend starting with bodyweight exercises like walking, modified push-ups (on knees), wall sits, chair squats, assisted lunges, gentle yoga poses, and low-impact cardio like swimming or cycling. Our app includes dedicated beginner-friendly workout routines that gradually increase in intensity as your fitness improves."
  },
  {
    question: "How do I set fitness goals",
    answer: "To set fitness goals in our app, go to the Profile section and select 'My Goals.' You can create SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) such as weight targets, workout frequency, strength milestones, or cardiovascular improvements. Our app will help track your progress and provide recommendations based on your personal goals."
  },
  {
    question: "Why is daily physical activity important",
    answer: "Daily physical activity is crucial because it improves cardiovascular health, maintains healthy weight, boosts mood through endorphin release, improves sleep quality, reduces chronic disease risk, increases energy levels, enhances cognitive function, and promotes longevity. Even 30 minutes of moderate activity daily can provide significant health benefits."
  },
  {
    question: "How do I improve my stamina and endurance",
    answer: "To improve stamina and endurance: 1) Start with a consistent cardio routine (running, cycling, swimming), 2) Gradually increase workout duration or intensity each week, 3) Incorporate interval training (alternating between high and low intensity), 4) Practice tempo training, 5) Ensure proper nutrition and hydration, 6) Get adequate rest between workouts, and 7) Monitor your progress regularly."
  },
  {
    question: "How much water should I drink daily",
    answer: "The general recommendation is to drink 8-10 glasses (2-2.5 liters) of water daily, but individual needs vary based on activity level, climate, body weight, and overall health. A good rule is to drink enough so your urine remains pale yellow. During workouts, drink 200-300ml every 15-20 minutes, and monitor your hydration levels using our app's water tracking feature."
  },
  {
    question: "What are the benefits of getting enough sleep",
    answer: "Adequate sleep (7-9 hours for adults) is essential for fitness because it: 1) Facilitates muscle recovery and growth, 2) Balances hormones that regulate hunger and metabolism, 3) Improves athletic performance, 4) Enhances cognitive function and motivation, 5) Boosts immune function, 6) Helps regulate blood sugar, and 7) Reduces injury risk. Our app can help you track sleep patterns for optimal fitness results."
  },
  {
    question: "How do I maintain a balanced diet",
    answer: "A balanced diet should include: 1) Lean proteins (chicken, fish, beans, tofu) for muscle repair, 2) Complex carbohydrates (whole grains, vegetables) for energy, 3) Healthy fats (avocados, nuts, olive oil) for hormone production, 4) Plenty of fruits and vegetables for vitamins and minerals, 5) Adequate hydration, and 6) Portion control. Our nutrition section provides personalized meal plans based on your fitness goals."
  },
  {
    question: "What's the ideal heart rate for exercise",
    answer: "The ideal exercise heart rate varies by age and fitness goals. For moderate-intensity workouts, aim for 50-70% of your maximum heart rate (220 minus your age). For vigorous exercise, target 70-85%. Beginners should start in the lower ranges and gradually increase intensity. Our app can help you calculate your target zones and track your heart rate during workouts."
  },
  {
    question: "How can I recover faster after workouts",
    answer: "To speed up recovery: 1) Stay hydrated before, during, and after exercise, 2) Consume protein and carbs within 30-45 minutes post-workout, 3) Get 7-9 hours of quality sleep, 4) Try active recovery like light walking or swimming on rest days, 5) Consider foam rolling or stretching for muscle tension, 6) Use contrast therapy (alternating hot/cold), and 7) Listen to your body and avoid overtraining."
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
