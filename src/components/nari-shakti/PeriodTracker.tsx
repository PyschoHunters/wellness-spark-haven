import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Clock, CalendarDays, Heart, Thermometer, Moon, AlertCircle, BadgeCheck } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { showActionToast } from '@/utils/toast-utils';

interface CycleDay {
  date: string;
  flow: 'none' | 'light' | 'medium' | 'heavy';
  symptoms: string[];
  notes: string;
}

interface Pokemon {
  id: number;
  name: string;
  sprite: string;
}

interface Cycle {
  id: number;
  startDate: string;
  endDate?: string;
  days: CycleDay[];
  pokemon?: Pokemon;
}

const symptoms = [
  'Cramps', 'Fatigue', 'Bloating', 'Headache', 
  'Mood Swings', 'Backache', 'Nausea', 'Insomnia'
];

const PeriodTracker = () => {
  const [currentCycle, setCurrentCycle] = useState<Cycle | null>(null);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [isLoggingOpen, setIsLoggingOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<'none' | 'light' | 'medium' | 'heavy'>('none');
  const [notes, setNotes] = useState('');
  const [predictedCycle, setPredictedCycle] = useState<{start: string, end: string} | null>(null);
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [pokemonOpen, setPokemonOpen] = useState(false);
  
  useEffect(() => {
    // Fetch mock cycle data
    fetchMockCycles();
    
    // For demonstration, we'll fetch a random Pokémon
    fetchRandomPokemon();
  }, []);
  
  const fetchMockCycles = async () => {
    try {
      // Using JSONPlaceholder for mock data
      const response = await fetch('https://jsonplaceholder.typicode.com/users/1/todos');
      const data = await response.json();
      
      // Transform the data into cycles format (simulation)
      const mockCycles: Cycle[] = [
        {
          id: 1,
          startDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          days: []
        },
        {
          id: 2,
          startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          days: []
        }
      ];
      
      // Calculate predicted next cycle
      const avgCycleLength = 28; // Assuming 28 days cycle
      const lastStartDate = new Date(mockCycles[1].startDate);
      const nextStartDate = new Date(lastStartDate);
      nextStartDate.setDate(nextStartDate.getDate() + avgCycleLength);
      
      setPredictedCycle({
        start: nextStartDate.toISOString().split('T')[0],
        end: new Date(nextStartDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      
      setCycles(mockCycles);
      setCurrentCycle(mockCycles[1]);
    } catch (error) {
      console.error('Error fetching mock cycles:', error);
    }
  };
  
  const fetchRandomPokemon = async () => {
    try {
      // Get a random Pokémon ID (1-151 for original Pokémon)
      const randomId = Math.floor(Math.random() * 151) + 1;
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await response.json();
      
      setPokemon({
        id: data.id,
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        sprite: data.sprites.front_default
      });
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
    }
  };
  
  const handleOpenLogging = (date: string) => {
    setSelectedDate(date);
    setSelectedSymptoms([]);
    setSelectedFlow('none');
    setNotes('');
    setIsLoggingOpen(true);
  };
  
  const handleToggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };
  
  const handleSaveLog = () => {
    if (currentCycle) {
      // Find if there's already an entry for this date
      const existingDayIndex = currentCycle.days.findIndex(day => day.date === selectedDate);
      
      const newDay: CycleDay = {
        date: selectedDate,
        flow: selectedFlow,
        symptoms: selectedSymptoms,
        notes
      };
      
      let updatedDays;
      if (existingDayIndex >= 0) {
        // Update existing day
        updatedDays = [...currentCycle.days];
        updatedDays[existingDayIndex] = newDay;
      } else {
        // Add new day
        updatedDays = [...currentCycle.days, newDay];
      }
      
      // Update current cycle
      const updatedCycle = {
        ...currentCycle,
        days: updatedDays
      };
      
      setCurrentCycle(updatedCycle);
      
      // Update cycles list
      const updatedCycles = cycles.map(cycle => 
        cycle.id === currentCycle.id ? updatedCycle : cycle
      );
      
      setCycles(updatedCycles);
      
      // Close dialog
      setIsLoggingOpen(false);
      
      // Show success message
      showActionToast("Day logged successfully!");
      
      // Check if this is a consecutive log and reward with Pokémon
      if (updatedDays.length >= 3) {
        setPokemonOpen(true);
      }
    }
  };
  
  const calculateCycleProgress = () => {
    if (!currentCycle || !predictedCycle) return 0;
    
    const today = new Date();
    const cycleStartDate = new Date(currentCycle.startDate);
    const nextCycleDate = new Date(predictedCycle.start);
    
    const totalDays = Math.round((nextCycleDate.getTime() - cycleStartDate.getTime()) / (24 * 60 * 60 * 1000));
    const daysPassed = Math.round((today.getTime() - cycleStartDate.getTime()) / (24 * 60 * 60 * 1000));
    
    return Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100);
  };
  
  const handleStartDateSelect = (date: Date | undefined) => {
    if (date && currentCycle) {
      const updatedCycle = {
        ...currentCycle,
        startDate: date.toISOString().split('T')[0]
      };
      setCurrentCycle(updatedCycle);
      
      const updatedCycles = cycles.map(cycle => 
        cycle.id === currentCycle.id ? updatedCycle : cycle
      );
      
      // Update predicted cycle based on new start date
      const avgCycleLength = 28;
      const nextStartDate = new Date(date);
      nextStartDate.setDate(nextStartDate.getDate() + avgCycleLength);
      
      setPredictedCycle({
        start: nextStartDate.toISOString().split('T')[0],
        end: new Date(nextStartDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      
      setCycles(updatedCycles);
      showActionToast("Period start date updated");
    }
  };
  
  return (
    <>
      <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-rose-100 to-rose-200 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-rose-800">
              <CalendarIcon className="h-5 w-5" />
              Period Tracker
            </CardTitle>
            <Badge variant="outline" className="bg-white/80 text-rose-700 border-rose-200">
              <BadgeCheck className="h-3 w-3 mr-1" />
              Cycle {cycles.length}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          {currentCycle && (
            <>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1 text-rose-400" />
                    <span>Current Cycle</span>
                  </div>
                  <span>Day {Math.round((new Date().getTime() - new Date(currentCycle.startDate).getTime()) / (24 * 60 * 60 * 1000)) + 1}</span>
                </div>
                <Progress value={calculateCycleProgress()} className="h-2" indicatorClassName="bg-gradient-to-r from-rose-400 to-rose-500" />
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-rose-50 p-3 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <Clock className="h-3 w-3 text-rose-400" />
                        <span>Current Period</span>
                      </div>
                      <p className="font-medium">
                        Started {new Date(currentCycle.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <CalendarIcon className="h-4 w-4 text-rose-400" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={new Date(currentCycle.startDate)}
                          onSelect={handleStartDateSelect}
                          className="rounded-md border pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                {predictedCycle && (
                  <div className="bg-indigo-50 p-3 rounded-xl">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <Moon className="h-3 w-3 text-indigo-400" />
                      <span>Next Period</span>
                    </div>
                    <p className="font-medium">
                      ~{new Date(predictedCycle.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 p-3 rounded-xl mb-4">
                <h3 className="font-medium mb-2 text-gray-700">Recent Logs</h3>
                {currentCycle.days.length > 0 ? (
                  <div className="space-y-2">
                    {currentCycle.days.slice(-3).map((day, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm">
                        <div>
                          <p className="text-sm font-medium">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {day.symptoms.slice(0, 2).map((symptom, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {symptom}
                              </Badge>
                            ))}
                            {day.symptoms.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{day.symptoms.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${
                          day.flow === 'heavy' ? 'bg-rose-500' : 
                          day.flow === 'medium' ? 'bg-rose-400' : 
                          day.flow === 'light' ? 'bg-rose-300' : 'bg-gray-200'
                        }`} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-2">No logs yet. Start tracking now!</p>
                )}
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl"
                onClick={() => handleOpenLogging(new Date().toISOString().split('T')[0])}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Log Today
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isLoggingOpen} onOpenChange={setIsLoggingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log Your Day</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-2">
            <div>
              <h3 className="text-sm font-medium mb-2">Date: {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : ''}</h3>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Flow</h3>
              <div className="flex space-x-2">
                {['none', 'light', 'medium', 'heavy'].map((flow) => (
                  <Button
                    key={flow}
                    type="button"
                    variant={selectedFlow === flow ? "default" : "outline"}
                    className={`flex-1 capitalize ${selectedFlow === flow ? 'bg-rose-500 hover:bg-rose-600' : ''}`}
                    onClick={() => setSelectedFlow(flow as any)}
                  >
                    {flow}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Symptoms</h3>
              <div className="grid grid-cols-2 gap-2">
                {symptoms.map((symptom) => (
                  <Button
                    key={symptom}
                    type="button"
                    variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                    className={`text-sm ${selectedSymptoms.includes(symptom) ? 'bg-indigo-500 hover:bg-indigo-600' : ''}`}
                    onClick={() => handleToggleSymptom(symptom)}
                  >
                    {symptom}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Notes</h3>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsLoggingOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveLog} className="bg-rose-500 hover:bg-rose-600">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={pokemonOpen} onOpenChange={setPokemonOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">You earned a Badge!</DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-4">
            {pokemon && (
              <div className="flex flex-col items-center">
                <div className="bg-rose-50 rounded-full p-4 mb-3">
                  <img src={pokemon.sprite} alt={pokemon.name} className="w-24 h-24 object-contain" />
                </div>
                <h3 className="text-lg font-bold mb-1">{pokemon.name} Badge</h3>
                <p className="text-gray-600 mb-3">Awarded for tracking 3 consecutive days!</p>
                <Badge className="bg-gradient-to-r from-rose-400 to-rose-500">+15 Wellness Points</Badge>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              onClick={() => setPokemonOpen(false)} 
              className="w-full bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600"
            >
              <BadgeCheck className="h-4 w-4 mr-2" />
              Claim Reward
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PeriodTracker;
