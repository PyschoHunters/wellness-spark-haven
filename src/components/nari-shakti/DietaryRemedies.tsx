
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Utensils, Search, Heart, ExternalLink, BookOpen, ThumbsUp, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { showActionToast } from '@/utils/toast-utils';

interface DietaryRemedy {
  id: number;
  name: string;
  ingredients: string[];
  benefits: string[];
  preparation: string;
  imageUrl: string;
  forSymptoms: string[];
  tags: string[];
}

const remedies: DietaryRemedy[] = [
  {
    id: 1,
    name: "Ginger Tea",
    ingredients: ["Fresh ginger root (1 inch)", "Water (2 cups)", "Honey (1 tsp, optional)", "Lemon slice (optional)"],
    benefits: [
      "Reduces menstrual cramps and pain",
      "Soothes nausea and digestive discomfort",
      "Has anti-inflammatory properties",
      "Improves blood circulation"
    ],
    preparation: "Peel and slice the ginger root. Boil water in a pot and add the ginger. Simmer for 5-10 minutes. Strain the tea into a cup. Add honey and lemon if desired.",
    imageUrl: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=500&auto=format&fit=crop",
    forSymptoms: ["Cramps", "Nausea", "Bloating"],
    tags: ["Warm", "Beverage", "Quick"]
  },
  {
    id: 2,
    name: "Turmeric Milk (Golden Milk)",
    ingredients: ["Milk or plant-based milk (1 cup)", "Turmeric powder (1/2 tsp)", "Cinnamon (pinch)", "Black pepper (pinch)", "Honey (1 tsp, optional)"],
    benefits: [
      "Reduces inflammation and pain",
      "Has antispasmodic properties to relieve cramps",
      "Boosts immune system",
      "Improves digestion and relieves bloating"
    ],
    preparation: "Heat the milk in a small saucepan over medium heat until it's warm but not boiling. Add turmeric, cinnamon, and black pepper. Stir well. Simmer for 1-2 minutes. Remove from heat and add honey if desired.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlwM4d4bCi1qFXLuurlMK9fZkKX38V9lVUyw&s",
    forSymptoms: ["Cramps", "Inflammation", "Mood Swings"],
    tags: ["Warm", "Beverage", "Anti-inflammatory"]
  },
  {
    id: 3,
    name: "Shatavari Herbal Supplement",
    ingredients: ["Shatavari powder (1/2 tsp)", "Warm water or milk"],
    benefits: [
      "Balances hormones",
      "Reduces menstrual cramps",
      "Supports reproductive health",
      "Boosts immunity"
    ],
    preparation: "Mix Shatavari powder with warm water or milk. Can be taken twice daily.",
    imageUrl: "https://medlineplus.gov/images/HerbalMedicine_share.jpg",
    forSymptoms: ["Hormonal Imbalance", "Cramps", "Fatigue"],
    tags: ["Supplement", "Ayurvedic", "Daily"]
  },
  {
    id: 4,
    name: "Triphala",
    ingredients: ["Triphala powder (1/2 tsp)", "Warm water"],
    benefits: [
      "Improves digestion",
      "Reduces bloating",
      "Detoxifies body",
      "Supports overall health"
    ],
    preparation: "Mix Triphala powder with warm water. Best taken before bedtime.",
    imageUrl: "public/lovable-uploads/b644a126-23a1-4dbe-a31f-4ce75340260e.png",
    forSymptoms: ["Bloating", "Digestion", "Detox"],
    tags: ["Supplement", "Ayurvedic", "Evening"]
  },
  {
    id: 5,
    name: "Ashoka Bark Decoction",
    ingredients: ["Ashoka bark powder (1 tsp)", "Water (2 cups)"],
    benefits: [
      "Regulates menstrual cycle",
      "Reduces heavy bleeding",
      "Alleviates menstrual pain",
      "Supports reproductive health"
    ],
    preparation: "Boil Ashoka bark powder in water until reduced to half. Strain and drink twice daily.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvlyM_20VMICP6kst2F1FUBVsx_ga8JAZrJQ&s",
    forSymptoms: ["Heavy Flow", "Irregular Cycles", "Pain"],
    tags: ["Decoction", "Ayurvedic", "Traditional"]
  }
];

const DietaryRemedies = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSymptom, setActiveSymptom] = useState<string | null>(null);
  const [filteredRemedies, setFilteredRemedies] = useState<DietaryRemedy[]>(remedies);
  const [selectedRemedy, setSelectedRemedy] = useState<DietaryRemedy | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  useEffect(() => {
    let results = remedies;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(remedy => 
        remedy.name.toLowerCase().includes(query) || 
        remedy.ingredients.some(i => i.toLowerCase().includes(query)) ||
        remedy.tags.some(t => t.toLowerCase().includes(query))
      );
    }
    
    // Filter by active symptom
    if (activeSymptom) {
      results = results.filter(remedy => 
        remedy.forSymptoms.includes(activeSymptom)
      );
    }
    
    setFilteredRemedies(results);
  }, [searchQuery, activeSymptom]);
  
  const handleSymptomClick = (symptom: string) => {
    if (activeSymptom === symptom) {
      setActiveSymptom(null);
    } else {
      setActiveSymptom(symptom);
    }
  };
  
  const handleRemedyClick = (remedy: DietaryRemedy) => {
    setSelectedRemedy(remedy);
    setDetailsOpen(true);
  };
  
  const handleSave = () => {
    if (selectedRemedy) {
      showActionToast(`${selectedRemedy.name} saved to your collection!`);
      setDetailsOpen(false);
    }
  };
  
  return (
    <>
      <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-amber-100 to-amber-200 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-amber-800">
              <Utensils className="h-5 w-5" />
              Dietary Remedies
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-amber-300"
              placeholder="Search remedies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              className={`rounded-full text-xs ${activeSymptom === 'Cramps' ? 'bg-amber-100 text-amber-800 border-amber-200' : ''}`}
              onClick={() => handleSymptomClick('Cramps')}
            >
              Cramps
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`rounded-full text-xs ${activeSymptom === 'Bloating' ? 'bg-amber-100 text-amber-800 border-amber-200' : ''}`}
              onClick={() => handleSymptomClick('Bloating')}
            >
              Bloating
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`rounded-full text-xs ${activeSymptom === 'Mood Swings' ? 'bg-amber-100 text-amber-800 border-amber-200' : ''}`}
              onClick={() => handleSymptomClick('Mood Swings')}
            >
              Mood Swings
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`rounded-full text-xs ${activeSymptom === 'Fatigue' ? 'bg-amber-100 text-amber-800 border-amber-200' : ''}`}
              onClick={() => handleSymptomClick('Fatigue')}
            >
              Fatigue
            </Button>
          </div>
          
          <div className="space-y-3">
            {filteredRemedies.length > 0 ? (
              filteredRemedies.map((remedy) => (
                <div 
                  key={remedy.id}
                  className="flex gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleRemedyClick(remedy)}
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={remedy.imageUrl} 
                      alt={remedy.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{remedy.name}</h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {remedy.forSymptoms.map((symptom, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] px-1 py-0 h-4 bg-amber-50 text-amber-700 border-amber-200">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {remedy.benefits[0]}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 self-center">
                    <Info size={16} />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No remedies found for your search.</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchQuery('');
                    setActiveSymptom(null);
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedRemedy?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedRemedy && (
            <div className="space-y-4 mt-2">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src={selectedRemedy.imageUrl} 
                  alt={selectedRemedy.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <Heart className="h-4 w-4 mr-1 text-amber-500" />
                  Benefits
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedRemedy.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm">{benefit}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <Utensils className="h-4 w-4 mr-1 text-amber-500" />
                  Ingredients
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedRemedy.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-sm">{ingredient}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <BookOpen className="h-4 w-4 mr-1 text-amber-500" />
                  Preparation
                </h3>
                <p className="text-sm">{selectedRemedy.preparation}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {selectedRemedy.tags.map((tag, index) => (
                  <Badge key={index} className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="pt-2 flex space-x-3">
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDetailsOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  className="flex-1 bg-amber-500 hover:bg-amber-600"
                  onClick={handleSave}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DietaryRemedies;
