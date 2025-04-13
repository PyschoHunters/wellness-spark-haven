
import React, { useState } from 'react';
import { Search, Filter, Award, Bookmark, Sliders, Users, UserPlus, Plus, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { showActionToast } from '@/utils/toast-utils';
import SkillCard, { Skill } from './SkillCard';

// Mock data for skills
const mockSkills: Skill[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Sophia Lee',
    userAvatar: 'https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174702.jpg',
    skillName: 'Running Coach (5k to Marathon)',
    category: 'Cardio',
    experienceLevel: 'Advanced',
    description: 'Certified running coach specializing in building endurance for beginners to intermediate runners. Can help with form, pacing, and training plans.',
    rating: 4.8,
    reviews: 24,
    location: 'New York City',
    availability: 'Weekday evenings, Saturday mornings',
    isVirtual: true,
    isMentor: true
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Marcus Johnson',
    userAvatar: 'https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg',
    skillName: 'Weightlifting Form & Technique',
    category: 'Strength',
    experienceLevel: 'Intermediate',
    description: 'Powerlifter with 5 years of experience. Offering form checks and technique advice for squat, bench, deadlift, and Olympic lifts.',
    rating: 4.7,
    reviews: 15,
    location: 'Virtual only',
    availability: 'Flexible',
    isVirtual: true,
    isMentor: true
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Emma Wright',
    userAvatar: 'https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100226.jpg',
    skillName: 'Yoga for Flexibility & Stress Relief',
    category: 'Flexibility',
    experienceLevel: 'Advanced',
    description: 'RYT-200 yoga instructor specializing in gentle flows for improved flexibility and stress management. Perfect for beginners or those with limited mobility.',
    rating: 4.9,
    reviews: 32,
    location: 'Chicago',
    availability: 'Mornings and weekends',
    isVirtual: false,
    isMentor: true
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'David Chen',
    userAvatar: 'https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg',
    skillName: 'Nutrition Basics for Fitness',
    category: 'Nutrition',
    experienceLevel: 'Intermediate',
    description: 'Nutrition coach focusing on practical, sustainable eating habits to support fitness goals. No fad diets, just science-based approaches.',
    rating: 4.6,
    reviews: 19,
    location: 'Virtual only',
    availability: 'Evenings and weekends',
    isVirtual: true,
    isMentor: true
  },
  {
    id: '5',
    userId: 'user5',
    userName: 'Manumohan',
    skillName: 'Learn to Swim - Beginner',
    category: 'Aquatics',
    experienceLevel: 'Beginner',
    description: 'Looking for someone to teach basic swimming techniques. Complete beginner, interested in learning freestyle and treading water.',
    rating: 0,
    reviews: 0,
    location: 'Local Pools',
    availability: 'Weekends',
    isVirtual: false,
    isMentor: false
  }
];

const SkillSwapMarketplace: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('mentors');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [message, setMessage] = useState('');

  const filteredSkills = mockSkills.filter(skill => {
    const matchesSearch = skill.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = (activeTab === 'mentors' && skill.isMentor) || 
                      (activeTab === 'learners' && !skill.isMentor);
    return matchesSearch && matchesTab;
  });

  const handleSkillSelect = (skill: Skill) => {
    setSelectedSkill(skill);
    setShowRequestDialog(true);
  };

  const handleSendRequest = () => {
    if (!message.trim()) {
      showActionToast("Please enter a message");
      return;
    }
    showActionToast("Connection request sent!");
    setShowRequestDialog(false);
    setMessage('');
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search skills, categories, or keywords..." 
            className="pl-10 bg-gray-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mentors" className="flex items-center gap-2">
                <Award size={16} />
                Mentors & Teachers
              </TabsTrigger>
              <TabsTrigger value="learners" className="flex items-center gap-2">
                <Users size={16} />
                Learners & Seekers
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-500">
            {filteredSkills.length} results
          </div>
          <Button variant="outline" size="sm" className="text-xs h-8 flex items-center gap-1">
            <Filter size={14} />
            Filters
          </Button>
        </div>
      </div>
      
      <TabsContent value="mentors" className="mt-0 space-y-4">
        {filteredSkills.length > 0 ? (
          filteredSkills.map(skill => (
            <SkillCard 
              key={skill.id} 
              skill={skill} 
              onSelect={handleSkillSelect}
            />
          ))
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={24} />
            </div>
            <h3 className="font-medium mb-1">No results found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="learners" className="mt-0 space-y-4">
        {filteredSkills.length > 0 ? (
          filteredSkills.map(skill => (
            <SkillCard 
              key={skill.id} 
              skill={skill} 
              onSelect={handleSkillSelect}
            />
          ))
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="text-gray-400" size={24} />
            </div>
            <h3 className="font-medium mb-1">No learners found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or be the first to seek help in this area</p>
            <Button className="mt-4" size="sm">Add Your Request</Button>
          </div>
        )}
      </TabsContent>
      
      <Button 
        className="fixed bottom-20 right-4 h-12 w-12 rounded-full shadow-lg bg-fitness-primary hover:bg-fitness-primary/90"
        onClick={() => showActionToast("Add new skill feature coming soon!")}
      >
        <Plus size={24} />
      </Button>
      
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect with {selectedSkill?.userName}</DialogTitle>
            <DialogDescription>
              Send a message to express your interest in {selectedSkill?.isMentor ? "learning about" : "helping with"} {selectedSkill?.skillName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-start gap-4 my-4">
            <Avatar className="h-16 w-16 border-2 border-gray-100">
              <AvatarImage src={selectedSkill?.userAvatar} />
              <AvatarFallback>{selectedSkill?.userName.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-semibold">{selectedSkill?.skillName}</h3>
              <p className="text-sm text-gray-500">{selectedSkill?.userName}</p>
              
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                  {selectedSkill?.category}
                </span>
                <div className="flex items-center text-amber-500">
                  <Star size={14} className="fill-amber-500" />
                  <span className="text-xs ml-1 font-medium">{selectedSkill?.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Your message</Label>
              <Textarea 
                id="message"
                placeholder={`Hi ${selectedSkill?.userName}, I'm interested in ${selectedSkill?.isMentor ? "learning about" : "helping with"} ${selectedSkill?.skillName}. Would you be available to connect?`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendRequest}>
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SkillSwapMarketplace;
