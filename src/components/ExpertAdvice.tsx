
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Book, Award, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: number;
  title: string;
  author: string;
  role: string;
  excerpt: string;
  readTime: string;
  date: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Building Sustainable Fitness Habits",
    author: "Dr. Rajesh Sharma",
    role: "Sports Nutritionist",
    excerpt: "The key to long-term fitness success isn't about drastic changes, but rather small, consistent steps that become part of your lifestyle...",
    readTime: "5 min read",
    date: "Apr 15, 2025"
  },
  {
    id: 2,
    title: "Recovery: The Missing Piece in Your Fitness Journey",
    author: "Ananya Patel",
    role: "Elite Trainer",
    excerpt: "Most people focus solely on workout intensity, but proper recovery is equally important for achieving results and preventing injuries...",
    readTime: "4 min read",
    date: "Apr 14, 2025"
  },
  {
    id: 3,
    title: "Mindful Movement: Beyond Physical Exercise",
    author: "Vikram Malhotra",
    role: "Wellness Coach",
    excerpt: "Integrating mindfulness into your fitness routine can enhance both mental and physical results, creating a holistic approach to wellbeing...",
    readTime: "6 min read",
    date: "Apr 13, 2025"
  },
  {
    id: 4,
    title: "Ayurvedic Principles for Modern Fitness",
    author: "Dr. Meena Gupta",
    role: "Ayurveda Expert",
    excerpt: "Ancient Ayurvedic wisdom offers valuable insights that can be applied to contemporary fitness routines for better balance and harmony...",
    readTime: "7 min read",
    date: "Apr 12, 2025"
  }
];

const ExpertAdvice: React.FC = () => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>(blogPosts.slice(0, 2));
  
  return (
    <section className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Expert Advice</h2>
          <p className="text-muted-foreground">Learn from fitness professionals</p>
        </div>
        <Link 
          to="/expert-advice" 
          className="flex items-center gap-1 text-fitness-primary hover:underline font-medium"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="grid gap-4">
        {featuredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-fitness-primary">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg mb-1">{post.title}</CardTitle>
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
    </section>
  );
};

export default ExpertAdvice;
