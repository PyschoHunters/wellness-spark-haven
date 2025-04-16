
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, Search, BookOpen, ThumbsUp, Brain, BookMarked, History, ExternalLink } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { showActionToast } from '@/utils/toast-utils';

interface AyurvedicRemedy {
  id: number;
  title: string;
  description: string;
  herbs: string[];
  practices: string[];
  dosha: 'vata' | 'pitta' | 'kapha' | 'all';
  research: string;
  category: string;
  imageUrl: string;
}

const ayurvedicRemedies: AyurvedicRemedy[] = [
  {
    id: 1,
    title: "Sesame Oil Massage (Abhyanga)",
    description: "A warming self-massage with sesame oil that can help soothe menstrual pain by improving circulation and reducing inflammation. Particularly effective for Vata-type menstrual discomfort characterized by cramping and irregular cycles.",
    herbs: ["Sesame oil", "Optional: infused with ashwagandha or dashamoola herbs"],
    practices: [
      "Warm the oil slightly by placing the container in hot water",
      "Massage the lower abdomen with gentle circular motions",
      "Apply light pressure over the lower back",
      "Practice for 10-15 minutes before a warm bath or shower"
    ],
    dosha: 'vata',
    research: "Several studies indicate that abdominal massage can reduce menstrual pain intensity and duration. The warmth and nutrients from sesame oil are believed to encourage blood flow and relax tense muscles.",
    category: "Massage Therapy",
    imageUrl: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Shatavari Herbal Supplement",
    description: "Shatavari (Asparagus racemosus) is considered the queen of herbs in Ayurveda for female reproductive health. It helps balance hormones, reduce inflammation, and provide nutritional support during menstruation.",
    herbs: ["Shatavari powder or extract", "Optional: combined with ghee and honey"],
    practices: [
      "Take 1/2 teaspoon of Shatavari powder with warm water or milk",
      "Add a small amount of honey or ghee for enhanced absorption",
      "Take regularly throughout the month, adjusting dosage during menstruation"
    ],
    dosha: 'pitta',
    research: "Research suggests Shatavari contains steroidal saponins that may help regulate estrogen levels. Studies have shown it can help reduce PMS symptoms and menstrual discomfort due to its anti-inflammatory properties.",
    category: "Herbal Remedy",
    imageUrl: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Triphala for Digestive Balance",
    description: "Triphala, a combination of three fruits (Amalaki, Bibhitaki, and Haritaki), helps balance the digestive system which is often disrupted during menstruation. It gently detoxifies without depleting energy needed during your period.",
    herbs: ["Triphala powder or tablets", "Warm water"],
    practices: [
      "Take 1/2 teaspoon of Triphala powder with warm water before bed",
      "Alternatively, take 1-2 tablets as directed on the package",
      "Practice regularly for 1-2 weeks before expected menstruation"
    ],
    dosha: 'all',
    research: "Triphala has been studied for its antioxidant and anti-inflammatory properties. Research suggests it helps optimize digestion and elimination, which can indirectly ease menstrual discomfort related to constipation or bloating.",
    category: "Digestive Support",
    imageUrl: "https://images.unsplash.com/photo-1611241893603-3c359704e0ee?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Ashoka Bark Decoction",
    description: "Ashoka (Saraca indica) is a sacred tree in Ayurveda with specific benefits for the female reproductive system. It helps regulate excessive bleeding, reduce pain, and tone the uterus.",
    herbs: ["Ashoka bark powder or pieces", "Water", "Optional: cinnamon, ginger"],
    practices: [
      "Boil 1 teaspoon of Ashoka bark in 2 cups of water until reduced to 1 cup",
      "Strain and drink warm, optionally with a pinch of cinnamon",
      "Take once or twice daily during menstruation"
    ],
    dosha: 'pitta',
    research: "Studies suggest Ashoka contains compounds that may help reduce prostaglandins (pain-causing compounds) and have hemostatic properties that help control excessive bleeding during menstruation.",
    category: "Herbal Decoction",
    imageUrl: "https://images.unsplash.com/photo-1605560464677-e91a950de0c0?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Dashamoola Tea for Pain Relief",
    description: "Dashamoola, a powerful combination of ten roots, is an important Ayurvedic remedy for managing Vata-related pain including menstrual cramps. It helps reduce inflammation and relax tense muscles.",
    herbs: ["Dashamoola powder or tablets", "Water", "Optional: cardamom or cinnamon"],
    practices: [
      "Simmer 1 teaspoon of Dashamoola powder in 2 cups of water for 10 minutes",
      "Strain and drink warm 1-2 times daily during menstruation",
      "Can be sweetened with a small amount of jaggery or honey"
    ],
    dosha: 'vata',
    research: "Traditional Ayurvedic texts cite Dashamoola's effectiveness for pain relief. Modern studies suggest its anti-inflammatory and antispasmodic properties may help reduce menstrual cramping and discomfort.",
    category: "Herbal Tea",
    imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=500&auto=format&fit=crop"
  }
];

const AyurvedicInsights = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDosha, setActiveDosha] = useState<string | null>(null);
  const [filteredRemedies, setFilteredRemedies] = useState<AyurvedicRemedy[]>(ayurvedicRemedies);
  const [selectedRemedy, setSelectedRemedy] = useState<AyurvedicRemedy | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    let results = ayurvedicRemedies;
    
    // Filter by search query
    if (query) {
      const searchTerm = query.toLowerCase();
      results = results.filter(remedy => 
        remedy.title.toLowerCase().includes(searchTerm) || 
        remedy.description.toLowerCase().includes(searchTerm) ||
        remedy.herbs.some(herb => herb.toLowerCase().includes(searchTerm)) ||
        remedy.category.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by active dosha
    if (activeDosha) {
      results = results.filter(remedy => 
        remedy.dosha === activeDosha || remedy.dosha === 'all'
      );
    }
    
    setFilteredRemedies(results);
  };
  
  const handleDoshaClick = (dosha: string) => {
    if (activeDosha === dosha) {
      setActiveDosha(null);
      
      // Update filtered results when removing dosha filter
      handleSearch(searchQuery);
    } else {
      setActiveDosha(dosha as any);
      
      // Filter results by new dosha and existing search query
      let results = ayurvedicRemedies;
      
      if (searchQuery) {
        const searchTerm = searchQuery.toLowerCase();
        results = results.filter(remedy => 
          remedy.title.toLowerCase().includes(searchTerm) || 
          remedy.description.toLowerCase().includes(searchTerm) ||
          remedy.herbs.some(herb => herb.toLowerCase().includes(searchTerm)) ||
          remedy.category.toLowerCase().includes(searchTerm)
        );
      }
      
      results = results.filter(remedy => 
        remedy.dosha === dosha || remedy.dosha === 'all'
      );
      
      setFilteredRemedies(results);
    }
  };
  
  const handleRemedyClick = (remedy: AyurvedicRemedy) => {
    setSelectedRemedy(remedy);
    setDetailsOpen(true);
  };
  
  const getDoshaColor = (dosha: string) => {
    switch(dosha) {
      case 'vata': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'pitta': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'kapha': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'all': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <>
      <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-200 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-purple-800">
              <Leaf className="h-5 w-5" />
              Ayurvedic Insights
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-purple-300"
              placeholder="Search Ayurvedic remedies..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              className={`rounded-full text-xs ${activeDosha === 'vata' ? getDoshaColor('vata') : ''}`}
              onClick={() => handleDoshaClick('vata')}
            >
              <span className="w-2 h-2 bg-indigo-400 rounded-full mr-1.5"></span>
              Vata
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`rounded-full text-xs ${activeDosha === 'pitta' ? getDoshaColor('pitta') : ''}`}
              onClick={() => handleDoshaClick('pitta')}
            >
              <span className="w-2 h-2 bg-amber-400 rounded-full mr-1.5"></span>
              Pitta
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`rounded-full text-xs ${activeDosha === 'kapha' ? getDoshaColor('kapha') : ''}`}
              onClick={() => handleDoshaClick('kapha')}
            >
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-1.5"></span>
              Kapha
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`rounded-full text-xs ${activeDosha === 'all' ? getDoshaColor('all') : ''}`}
              onClick={() => handleDoshaClick('all')}
            >
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-1.5"></span>
              All Doshas
            </Button>
          </div>
          
          <Accordion type="single" collapsible className="mb-4">
            <AccordionItem value="doshas" className="border-b-0">
              <AccordionTrigger className="py-2 text-sm font-medium text-gray-700 hover:no-underline">
                <div className="flex items-center">
                  <Brain className="h-4 w-4 mr-2 text-purple-500" />
                  <span>What are Doshas?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                <p>In Ayurveda, the three doshas — Vata, Pitta, and Kapha — are energetic forces that govern all physical and mental processes. During menstruation, these doshas can become imbalanced:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><span className="font-medium text-indigo-600">Vata</span>: Associated with irregular cycles, cramping, and anxiety</li>
                  <li><span className="font-medium text-amber-600">Pitta</span>: Associated with heavy flow, irritability, and inflammation</li>
                  <li><span className="font-medium text-emerald-600">Kapha</span>: Associated with bloating, water retention, and lethargy</li>
                </ul>
                <p className="mt-2">Remedies are designed to balance your specific dosha imbalance for personalized relief.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="space-y-3">
            {filteredRemedies.length > 0 ? (
              filteredRemedies.map((remedy) => (
                <div 
                  key={remedy.id}
                  className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleRemedyClick(remedy)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={remedy.imageUrl} 
                        alt={remedy.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{remedy.title}</h3>
                        <Badge 
                          variant="outline" 
                          className={`text-[10px] px-1 py-0 h-4 ${getDoshaColor(remedy.dosha)}`}
                        >
                          {remedy.dosha === 'all' ? 'Tri-doshic' : remedy.dosha.charAt(0).toUpperCase() + remedy.dosha.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                        {remedy.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No Ayurvedic remedies found for your search.</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchQuery('');
                    setActiveDosha(null);
                    setFilteredRemedies(ayurvedicRemedies);
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
          
          <Button 
            className="w-full mt-4 bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white rounded-xl flex items-center gap-2"
            onClick={() => window.open('https://www.ayush.gov.in/', '_blank')}
          >
            <BookMarked className="h-4 w-4" />
            Explore Ayurveda Resources
          </Button>
        </CardContent>
      </Card>
      
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedRemedy?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedRemedy && (
            <div className="space-y-4 mt-2">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src={selectedRemedy.imageUrl} 
                  alt={selectedRemedy.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Badge 
                  className={getDoshaColor(selectedRemedy.dosha).replace('border-', '')}
                >
                  {selectedRemedy.dosha === 'all' ? 'Tri-doshic' : selectedRemedy.dosha.charAt(0).toUpperCase() + selectedRemedy.dosha.slice(1)}
                </Badge>
                <Badge variant="outline" className="bg-gray-50">
                  {selectedRemedy.category}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600">
                {selectedRemedy.description}
              </p>
              
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <Leaf className="h-4 w-4 mr-1 text-purple-500" />
                  Herbs & Ingredients
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedRemedy.herbs.map((herb, index) => (
                    <li key={index} className="text-sm">{herb}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <BookOpen className="h-4 w-4 mr-1 text-purple-500" />
                  How to Use
                </h3>
                <ol className="list-decimal pl-5 space-y-1">
                  {selectedRemedy.practices.map((practice, index) => (
                    <li key={index} className="text-sm">{practice}</li>
                  ))}
                </ol>
              </div>
              
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <History className="h-4 w-4 mr-1 text-purple-500" />
                  Research Insights
                </h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedRemedy.research}
                </p>
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
                  className="flex-1 bg-purple-500 hover:bg-purple-600"
                  onClick={() => {
                    showActionToast(`${selectedRemedy.title} saved to your collection!`);
                    setDetailsOpen(false);
                  }}
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

export default AyurvedicInsights;
