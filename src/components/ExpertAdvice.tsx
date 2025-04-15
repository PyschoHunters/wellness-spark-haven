
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Book, Award, Clock } from 'lucide-react';

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
    author: "Dr. Sarah Chen",
    role: "Sports Nutritionist",
    excerpt: "The key to long-term fitness success isn't about drastic changes, but rather small, consistent steps...",
    readTime: "5 min read",
    date: "Apr 15, 2025"
  },
  {
    id: 2,
    title: "Recovery: The Missing Piece in Your Fitness Journey",
    author: "Mike Thompson",
    role: "Elite Trainer",
    excerpt: "Most people focus solely on workout intensity, but proper recovery is equally important for achieving results...",
    readTime: "4 min read",
    date: "Apr 14, 2025"
  },
  {
    id: 3,
    title: "Mindful Movement: Beyond Physical Exercise",
    author: "Lisa Rodriguez",
    role: "Wellness Coach",
    excerpt: "Integrating mindfulness into your fitness routine can enhance both mental and physical results...",
    readTime: "6 min read",
    date: "Apr 13, 2025"
  }
];

const ExpertAdvice: React.FC = () => {
  return (
    <section className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Expert Advice</h2>
          <p className="text-muted-foreground">Learn from fitness professionals</p>
        </div>
        <Book className="text-fitness-primary w-6 h-6" />
      </div>
      
      <div className="grid gap-4">
        {blogPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow duration-200">
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
                <button className="text-sm font-medium text-fitness-primary hover:underline">
                  Read more
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ExpertAdvice;
