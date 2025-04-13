
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

import Navigation from "@/components/Navigation";
import SkillProfile, { Skill, SkillCategory, SkillLevel } from "@/components/SkillProfile";
import SkillFilters, { FilterState } from "@/components/SkillFilters";

// Mock data for demo
const generateMockData = () => {
  const mockSkills: Skill[] = [
    {
      id: "1",
      category: "Strength Training",
      name: "Weightlifting Form",
      level: "Advanced",
      tags: ["Powerlifting", "Olympic", "Form Correction"],
    },
    {
      id: "2",
      category: "Cardio",
      name: "HIIT Training",
      level: "Intermediate",
      tags: ["Circuit", "Fat Loss", "Endurance"],
    },
    {
      id: "3",
      category: "Yoga",
      name: "Vinyasa Flow",
      level: "Intermediate",
      tags: ["Flow", "Flexibility", "Balance"],
    },
    {
      id: "4",
      category: "Nutrition",
      name: "Meal Planning",
      level: "Beginner",
      tags: ["Healthy Eating", "Macros", "Meal Prep"],
    },
    {
      id: "5",
      category: "Running",
      name: "Marathon Training",
      level: "Advanced",
      tags: ["Long Distance", "Endurance", "Race Prep"],
    },
    {
      id: "6",
      category: "Cycling",
      name: "Mountain Biking",
      level: "Intermediate",
      tags: ["Trail Riding", "Technique", "Off-Road"],
    },
    {
      id: "7",
      category: "Hiking",
      name: "Trail Navigation",
      level: "Beginner",
      tags: ["Orienteering", "Safety", "Equipment"],
    },
    {
      id: "8",
      category: "Martial Arts",
      name: "Kickboxing",
      level: "Intermediate",
      tags: ["Technique", "Sparring", "Conditioning"],
    },
  ];

  const mockProfiles = [
    {
      id: "user1",
      name: "Alex Johnson",
      bio: "Certified personal trainer specializing in strength training and HIIT workouts. Looking to improve my yoga skills.",
      location: "New York, NY",
      availability: "Evenings & Weekends",
      offeredSkills: [mockSkills[0], mockSkills[1]],
      desiredSkills: [mockSkills[2]],
      rating: 4.9,
      reviewCount: 28,
      isMentor: true,
    },
    {
      id: "user2",
      name: "Sam Parker",
      bio: "Yoga instructor with 5 years of experience. Interested in learning more about nutrition and meal planning.",
      location: "Los Angeles, CA",
      availability: "Mornings & Afternoons",
      offeredSkills: [mockSkills[2]],
      desiredSkills: [mockSkills[3]],
      rating: 4.7,
      reviewCount: 42,
      isMentor: true,
    },
    {
      id: "user3",
      name: "Jamie Smith",
      bio: "Marathon runner and nutrition enthusiast. Would love to improve my strength training form.",
      location: "Chicago, IL",
      availability: "Weekends Only",
      offeredSkills: [mockSkills[3], mockSkills[4]],
      desiredSkills: [mockSkills[0]],
      rating: 4.5,
      reviewCount: 15,
      isMentor: false,
    },
    {
      id: "user4",
      name: "Taylor Wilson",
      bio: "Mountain biking instructor and trail guide. Looking to learn kickboxing techniques.",
      location: "Denver, CO",
      availability: "Flexible Hours",
      offeredSkills: [mockSkills[5], mockSkills[6]],
      desiredSkills: [mockSkills[7]],
      rating: 4.8,
      reviewCount: 31,
      isMentor: true,
    },
    {
      id: "user5",
      name: "Jordan Lee",
      bio: "Kickboxing coach with a background in martial arts. Interested in improving long-distance running skills.",
      location: "Seattle, WA",
      availability: "Evenings Only",
      offeredSkills: [mockSkills[7]],
      desiredSkills: [mockSkills[4]],
      rating: 4.6,
      reviewCount: 23,
      isMentor: true,
    },
    {
      id: "user6",
      name: "Riley Martinez",
      bio: "Beginner looking to improve overall fitness. Particularly interested in learning proper weightlifting form and basic nutrition.",
      location: "Austin, TX",
      availability: "Weekday Mornings",
      offeredSkills: [],
      desiredSkills: [mockSkills[0], mockSkills[3]],
      rating: 0,
      reviewCount: 0,
      isMentor: false,
    },
  ];

  return mockProfiles;
};

const SkillSwap: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"explore" | "my-connections">("explore");
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    categories: [],
    levels: [],
    mentorOnly: false,
    inPersonOnly: false,
    distanceRadius: 50,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const allProfiles = generateMockData();
  
  // Filter profiles based on current filters
  const filteredProfiles = allProfiles.filter(profile => {
    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const nameMatch = profile.name.toLowerCase().includes(searchLower);
      const bioMatch = profile.bio.toLowerCase().includes(searchLower);
      const locationMatch = profile.location.toLowerCase().includes(searchLower);
      
      const skillMatch = profile.offeredSkills.some(skill => 
        skill.name.toLowerCase().includes(searchLower) || 
        skill.category.toLowerCase().includes(searchLower) ||
        skill.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
      
      if (!(nameMatch || bioMatch || locationMatch || skillMatch)) {
        return false;
      }
    }
    
    // Filter by categories
    if (filters.categories.length > 0) {
      const hasMatchingCategory = profile.offeredSkills.some(skill => 
        filters.categories.includes(skill.category)
      );
      if (!hasMatchingCategory) return false;
    }
    
    // Filter by skill levels
    if (filters.levels.length > 0) {
      const hasMatchingLevel = profile.offeredSkills.some(skill => 
        filters.levels.includes(skill.level)
      );
      if (!hasMatchingLevel) return false;
    }
    
    // Filter by mentor status
    if (filters.mentorOnly && !profile.isMentor) {
      return false;
    }
    
    // We'd normally filter by distance here but for demo purposes we'll skip that
    
    return true;
  });

  const handleConnect = (userId: string) => {
    const profile = allProfiles.find(p => p.id === userId);
    if (profile) {
      toast({
        title: "Connection Request Sent",
        description: `Your request to connect with ${profile.name} has been sent.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container px-4 py-6 max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Skill Swap & Mentorship</h1>
          <p className="text-muted-foreground mt-1">Connect with fitness enthusiasts to share skills and knowledge</p>
        </header>
        
        <Tabs defaultValue="explore" className="w-full" onValueChange={(value) => setActiveTab(value as "explore" | "my-connections")}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="explore">Explore</TabsTrigger>
              <TabsTrigger value="my-connections">My Connections</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              {/* Mobile filter button */}
              <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[90vw] sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    <SkillFilters 
                      onFilterChange={(newFilters) => {
                        setFilters(newFilters);
                        setShowMobileFilters(false);
                      }} 
                    />
                  </div>
                </SheetContent>
              </Sheet>

              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Profile
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Desktop filters */}
            <div className="hidden md:block w-full md:w-72 shrink-0">
              <SkillFilters onFilterChange={setFilters} />
            </div>
            
            <div className="flex-1">
              <TabsContent value="explore" className="m-0">
                {filteredProfiles.length === 0 ? (
                  <div className="bg-white rounded-lg border p-8 text-center">
                    <h3 className="font-semibold text-lg mb-2">No matches found</h3>
                    <p className="text-muted-foreground mb-4">Try adjusting your filters to see more results.</p>
                    <Button
                      variant="outline"
                      onClick={() => setFilters({
                        searchTerm: "",
                        categories: [],
                        levels: [],
                        mentorOnly: false,
                        inPersonOnly: false,
                        distanceRadius: 50,
                      })}
                    >
                      Reset Filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {filteredProfiles.map((profile) => (
                      <SkillProfile
                        key={profile.id}
                        id={profile.id}
                        name={profile.name}
                        bio={profile.bio}
                        location={profile.location}
                        availability={profile.availability}
                        offeredSkills={profile.offeredSkills}
                        desiredSkills={profile.desiredSkills}
                        rating={profile.rating}
                        reviewCount={profile.reviewCount}
                        isMentor={profile.isMentor}
                        onConnect={handleConnect}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="my-connections" className="m-0">
                <div className="bg-white rounded-lg border p-8 text-center">
                  <h3 className="font-semibold text-lg mb-2">No active connections yet</h3>
                  <p className="text-muted-foreground mb-4">Start exploring and connect with fitness enthusiasts.</p>
                  <Button onClick={() => setActiveTab("explore")}>
                    Find Connections
                  </Button>
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default SkillSwap;
