
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare, Users, MapPin, Calendar } from "lucide-react";

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";

export type SkillCategory = 
  | "Strength Training" 
  | "Cardio" 
  | "Flexibility" 
  | "Nutrition" 
  | "Yoga" 
  | "Running" 
  | "Cycling" 
  | "Swimming" 
  | "Hiking" 
  | "Martial Arts" 
  | "Dance" 
  | "Other";

export interface Skill {
  id: string;
  category: SkillCategory;
  name: string;
  level: SkillLevel;
  tags: string[];
}

export interface SkillProfileProps {
  id: string;
  name: string;
  imageUrl?: string;
  bio: string;
  location: string;
  availability: string;
  offeredSkills: Skill[];
  desiredSkills: Skill[];
  rating?: number;
  reviewCount?: number;
  isMentor?: boolean;
  onConnect: (id: string) => void;
}

const getLevelColor = (level: SkillLevel): string => {
  switch (level) {
    case "Beginner":
      return "bg-green-100 text-green-800";
    case "Intermediate":
      return "bg-blue-100 text-blue-800";
    case "Advanced":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getCategoryIcon = (category: SkillCategory): JSX.Element => {
  switch (category) {
    case "Strength Training":
      return <span className="mr-1">💪</span>;
    case "Cardio":
      return <span className="mr-1">🏃</span>;
    case "Flexibility":
      return <span className="mr-1">🧘</span>;
    case "Nutrition":
      return <span className="mr-1">🥗</span>;
    case "Yoga":
      return <span className="mr-1">🧘‍♀️</span>;
    case "Running":
      return <span className="mr-1">🏃‍♂️</span>;
    case "Cycling":
      return <span className="mr-1">🚴</span>;
    case "Swimming":
      return <span className="mr-1">🏊</span>;
    case "Hiking":
      return <span className="mr-1">🥾</span>;
    case "Martial Arts":
      return <span className="mr-1">🥋</span>;
    case "Dance":
      return <span className="mr-1">💃</span>;
    default:
      return <span className="mr-1">⭐</span>;
  }
};

const SkillProfile: React.FC<SkillProfileProps> = ({
  id,
  name,
  imageUrl,
  bio,
  location,
  availability,
  offeredSkills,
  desiredSkills,
  rating = 0,
  reviewCount = 0,
  isMentor = false,
  onConnect,
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="w-full transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={imageUrl} alt={name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                {name}
                {isMentor && (
                  <Badge variant="secondary" className="ml-2">
                    Mentor
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                {location}
                <span className="mx-2">•</span>
                <Calendar className="h-3 w-3 mr-1" />
                {availability}
              </div>
            </div>
          </div>
          {rating > 0 && (
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground ml-1">
                ({reviewCount})
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">{bio}</CardDescription>
        
        {offeredSkills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">Skills Offered</h4>
            <div className="flex flex-wrap gap-2">
              {offeredSkills.map((skill) => (
                <Badge
                  key={skill.id}
                  variant="outline"
                  className={`${getLevelColor(skill.level)} flex items-center`}
                >
                  {getCategoryIcon(skill.category)}
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {desiredSkills.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Looking to Learn</h4>
            <div className="flex flex-wrap gap-2">
              {desiredSkills.map((skill) => (
                <Badge
                  key={skill.id}
                  variant="outline"
                  className="bg-gray-100 text-gray-800 flex items-center"
                >
                  {getCategoryIcon(skill.category)}
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            Message
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            View Profile
          </Button>
        </div>
        <Button 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => onConnect(id)}
        >
          Connect
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SkillProfile;
