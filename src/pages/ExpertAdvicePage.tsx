
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Book, Award, Clock, ArrowLeft, ArrowRight, Search } from 'lucide-react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';

interface BlogPost {
  id: number;
  title: string;
  author: string;
  role: string;
  excerpt: string;
  readTime: string;
  date: string;
  content?: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Building Sustainable Fitness Habits",
    author: "Dr. Rajesh Sharma",
    role: "Sports Nutritionist",
    excerpt: "The key to long-term fitness success isn't about drastic changes, but rather small, consistent steps that become part of your lifestyle...",
    readTime: "5 min read",
    date: "Apr 15, 2025",
    content: `
      <p>The journey to fitness is not a sprint, but a marathon. Many people approach fitness with an all-or-nothing mindset, making drastic changes that are difficult to maintain in the long run.</p>
      
      <p>Instead, focus on building small, sustainable habits that you can consistently maintain over time. Start with just 10 minutes of exercise daily, gradually increasing as it becomes a natural part of your routine.</p>
      
      <p>Remember that consistency trumps intensity when it comes to long-term results. A moderate workout that you can do regularly will yield better results than an intense regimen you can only maintain for a few weeks.</p>
      
      <p>Another key aspect is finding activities you genuinely enjoy. Fitness shouldn't feel like punishment - explore different forms of movement until you discover what brings you joy while also challenging your body.</p>
      
      <p>Finally, be patient with yourself. Building sustainable habits takes time, typically 66 days according to research. Celebrate small victories along the way and remember that each step forward, no matter how small, is progress worth acknowledging.</p>
    `
  },
  {
    id: 2,
    title: "Recovery: The Missing Piece in Your Fitness Journey",
    author: "Ananya Patel",
    role: "Elite Trainer",
    excerpt: "Most people focus solely on workout intensity, but proper recovery is equally important for achieving results and preventing injuries...",
    readTime: "4 min read",
    date: "Apr 14, 2025",
    content: `
      <p>When it comes to fitness, many enthusiasts put all their energy into training hard but neglect the equally important aspect of recovery. Your body doesn't become stronger during your workout - it grows stronger during the recovery period afterward.</p>
      
      <p>Proper recovery includes several key components: adequate sleep (7-9 hours for most adults), proper nutrition with sufficient protein intake, hydration, and active recovery techniques like gentle stretching, yoga, or light cardio.</p>
      
      <p>Overtraining without proper recovery can lead to diminished performance, increased injury risk, hormonal imbalances, and even regression in your fitness journey. Listen to your body - persistent fatigue, decreased performance, and constant soreness are signs you need more recovery time.</p>
      
      <p>Consider implementing recovery tools like foam rolling, massage therapy, or contrast therapy (alternating hot and cold) to enhance your body's natural recovery processes.</p>
      
      <p>Remember that recovery isn't laziness - it's an essential part of any effective training program. By prioritizing recovery, you're not taking time away from progress; you're facilitating sustainable, long-term gains.</p>
    `
  },
  {
    id: 3,
    title: "Mindful Movement: Beyond Physical Exercise",
    author: "Vikram Malhotra",
    role: "Wellness Coach",
    excerpt: "Integrating mindfulness into your fitness routine can enhance both mental and physical results, creating a holistic approach to wellbeing...",
    readTime: "6 min read",
    date: "Apr 13, 2025",
    content: `
      <p>In our fast-paced world, exercise often becomes another task to check off our to-do list. We go through the motions while our minds are elsewhere - planning dinner, solving work problems, or scrolling through mental social media feeds.</p>
      
      <p>Mindful movement is about bringing your complete attention to the present moment during exercise. This means noticing how your body feels, being aware of your breathing, and fully engaging with the movement patterns you're performing.</p>
      
      <p>The benefits of this approach are numerous. Mindful exercise can reduce stress more effectively than distracted movement, improve coordination and body awareness, enhance mind-muscle connection for better results, and transform your workout from an obligation into a form of moving meditation.</p>
      
      <p>To practice mindful movement, start by turning off distractions during your workout. Focus on your breath, notice the sensations in your muscles, and approach each exercise with curiosity rather than judgment. When your mind wanders (as all minds do), gently bring your attention back to your body and breath.</p>
      
      <p>This practice extends beyond traditional exercise. Walking, household chores, and even standing in line can become opportunities for mindful movement. With consistent practice, you'll develop a deeper connection between mind and body that enhances both your physical health and mental wellbeing.</p>
    `
  },
  {
    id: 4,
    title: "Ayurvedic Principles for Modern Fitness",
    author: "Dr. Meena Gupta",
    role: "Ayurveda Expert",
    excerpt: "Ancient Ayurvedic wisdom offers valuable insights that can be applied to contemporary fitness routines for better balance and harmony...",
    readTime: "7 min read",
    date: "Apr 12, 2025",
    content: `
      <p>Ayurveda, India's ancient system of medicine and wellness, offers timeless wisdom that can significantly enhance modern fitness approaches. At its core, Ayurveda recognizes that each person has a unique constitution or "dosha" - Vata (air/space), Pitta (fire/water), or Kapha (earth/water) - and that exercise should be tailored accordingly.</p>
      
      <p>For Vata-dominant individuals who tend to be naturally active but easily fatigued, grounding exercises like yoga, Pilates, and strength training provide stability. Pitta types, naturally competitive and intense, benefit from cooling activities like swimming and moderation in their training. Kapha types, naturally strong but sometimes lethargic, thrive with regular, vigorous exercise that increases heart rate and stimulates metabolism.</p>
      
      <p>Beyond dosha-specific recommendations, Ayurveda suggests exercising at specific times of day - early morning for Kapha energy, evening for Vata balance, and cooler times of day for Pitta constitutions. It also emphasizes seasonal adjustments to your routine, like more gentle practices during summer and more vigorous movement during winter.</p>
      
      <p>Ayurveda teaches the importance of exercising at 50-70% of your capacity, stopping before exhaustion. This sustainable approach prevents the accumulation of stress hormones and supports long-term wellness rather than short-term gains.</p>
      
      <p>By incorporating these ancient principles into modern fitness routines, you can create a more balanced, personalized approach that honors your unique needs and promotes holistic health.</p>
    `
  },
  {
    id: 5,
    title: "Nutrition Timing: When to Eat for Optimal Performance",
    author: "Priya Desai",
    role: "Sports Dietitian",
    excerpt: "Understanding the science of nutrition timing can significantly impact your energy levels, recovery, and overall fitness results...",
    readTime: "5 min read",
    date: "Apr 11, 2025",
    content: `
      <p>While what you eat certainly matters for fitness goals, when you eat can be equally important. Nutrition timing strategies can optimize energy availability, enhance recovery, and improve overall performance.</p>
      
      <p>Pre-workout nutrition should focus on providing readily available energy. Consume easily digestible carbohydrates with a small amount of protein 1-3 hours before exercise. For early morning workouts, a small snack like a banana or a few dates can provide quick energy without causing digestive discomfort.</p>
      
      <p>During prolonged exercise (over 60 minutes), consuming carbohydrates can delay fatigue and maintain performance. Sports drinks, energy gels, or easily digestible fruit can provide this necessary fuel.</p>
      
      <p>The post-workout "anabolic window" is crucial for recovery. Within 30-60 minutes after exercise, consume a combination of protein (to repair muscle tissue) and carbohydrates (to replenish glycogen stores). A protein shake with fruit or a balanced meal works well in this timeframe.</p>
      
      <p>Beyond workout-specific timing, consider distributing protein intake evenly throughout the day rather than consuming it primarily at dinner, as many do. This approach optimizes muscle protein synthesis and supports metabolic health.</p>
      
      <p>Remember that individual factors like training goals, workout intensity, and personal preference influence optimal nutrition timing. Experiment with different strategies to discover what works best for your unique needs and schedule.</p>
    `
  }
];

// All expert advice page
const ExpertAdvicePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredPosts = searchTerm
    ? blogPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : blogPosts;
  
  return (
    <div className="max-w-md mx-auto px-4 pb-20">
      <Header 
        title="Expert Advice" 
        subtitle="Insights from fitness professionals"
      />
      
      <div className="mb-6 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search advice..."
            className="w-full py-2 pl-10 pr-4 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-fitness-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>
      
      <div className="grid gap-5">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg mb-1 hover:text-fitness-primary transition-colors">
                    <Link to={`/expert-advice/${post.id}`}>{post.title}</Link>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-fitness-secondary" />
                    <CardDescription className="text-sm">
                      {post.author} · {post.role}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {post.excerpt}
              </p>
              <Separator className="my-3" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{post.date}</span>
                <Link 
                  to={`/expert-advice/${post.id}`} 
                  className="flex items-center gap-1 text-sm font-medium text-fitness-primary hover:underline"
                >
                  Read more
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Navigation />
    </div>
  );
};

// Single blog post page
export const BlogPostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find(post => post.id === Number(id));
  
  if (!post) {
    return (
      <div className="max-w-md mx-auto px-4 pb-20 text-center pt-10">
        <p>Post not found</p>
        <Link to="/expert-advice" className="text-fitness-primary hover:underline mt-4 inline-block">
          Back to Expert Advice
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto px-4 pb-20">
      <div className="mb-4 mt-6">
        <Link 
          to="/expert-advice" 
          className="flex items-center gap-1 text-fitness-primary hover:underline font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all advice
        </Link>
      </div>
      
      <article className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-3">{post.title}</h1>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-fitness-secondary" />
            <div>
              <p className="font-medium">{post.author}</p>
              <p className="text-sm text-muted-foreground">{post.role}</p>
            </div>
          </div>
          <div className="flex flex-col items-end text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
            <span>{post.date}</span>
          </div>
        </div>
        
        <Separator className="mb-6" />
        
        <div
          className="prose prose-sm prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />
        
        <div className="mt-8">
          <Separator className="mb-4" />
          <div className="flex justify-between">
            <Link 
              to="/expert-advice" 
              className="flex items-center gap-1 text-fitness-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all advice
            </Link>
            
            {post.id < blogPosts.length && (
              <Link 
                to={`/expert-advice/${post.id + 1}`} 
                className="flex items-center gap-1 text-fitness-primary hover:underline"
              >
                Next article
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </article>
      
      <Navigation />
    </div>
  );
};

export default ExpertAdvicePage;
