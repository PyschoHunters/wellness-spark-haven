
import React from 'react';
import { Award, Star, MessageSquare, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export interface Skill {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  skillName: string;
  category: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  rating: number;
  reviews: number;
  location: string;
  availability: string;
  isVirtual: boolean;
  isMentor?: boolean;
}

interface SkillCardProps {
  skill: Skill;
  onSelect: (skill: Skill) => void;
  className?: string;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, onSelect, className }) => {
  const experienceColors = {
    Beginner: 'bg-green-100 text-green-700',
    Intermediate: 'bg-blue-100 text-blue-700',
    Advanced: 'bg-purple-100 text-purple-700',
  };

  return (
    <div 
      className={cn(
        "bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12 border-2 border-gray-100">
          <AvatarImage src={skill.userAvatar} alt={skill.userName} />
          <AvatarFallback>{skill.userName.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base line-clamp-1">{skill.skillName}</h3>
            <div className="flex items-center text-amber-500">
              <Star size={14} className="fill-amber-500" />
              <span className="text-xs ml-1 font-medium">{skill.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mb-2">{skill.userName}</p>
          
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
              {skill.category}
            </span>
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              experienceColors[skill.experienceLevel]
            )}>
              {skill.experienceLevel}
            </span>
            {skill.isVirtual && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                Virtual
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{skill.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <MessageSquare size={12} className="mr-1" />
              {skill.reviews} reviews
            </div>
            
            <Button 
              variant="outline"
              size="sm"
              onClick={() => onSelect(skill)}
              className="text-xs px-3 py-1 h-auto rounded-full flex items-center gap-1"
            >
              {skill.isMentor ? "Learn from" : "Connect"} 
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
