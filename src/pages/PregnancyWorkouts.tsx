
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Baby, Activity, AlertTriangle, Calendar, Clock, Heart, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { showActionToast } from '@/utils/toast-utils';
import { supabase } from '@/integrations/supabase/client';

type PregnancyStage = 'first' | 'second' | 'third';
type WorkoutIntensity = 'gentle' | 'moderate' | 'active';
type WorkoutDuration = '15' | '20' | '30' | '45';

interface PregnancyWorkout {
  id: number;
  title: string;
  description: string;
  trimester: PregnancyStage[];
  duration: string;
  intensity: WorkoutIntensity;
  benefits: string[];
  cautions: string[];
  imageUrl?: string;
}

// Sample workout data
const sampleWorkoutData: PregnancyWorkout[] = [
  {
    id: 1,
    title: 'Gentle Prenatal Yoga',
    description: 'Focus on breathing, gentle stretching, and maintaining flexibility through various yoga poses safe for pregnancy.',
    trimester: ['first', 'second', 'third'],
    duration: '20 min',
    intensity: 'gentle',
    benefits: ['Reduces stress', 'Improves sleep', 'Increases flexibility', 'Relieves lower back pain'],
    cautions: ['Avoid deep twists', 'No lying flat on back after first trimester']
  },
  {
    id: 2,
    title: 'Water Aerobics',
    description: 'Low-impact workout in water that supports your weight, reducing stress on joints while providing resistance for strength building.',
    trimester: ['first', 'second', 'third'],
    duration: '30 min',
    intensity: 'moderate',
    benefits: ['Reduces swelling', 'Improves circulation', 'Builds strength without strain'],
    cautions: ['Maintain balance getting in and out of pool', 'Stay hydrated']
  }
];

const PregnancyWorkouts = () => {
  const navigate = useNavigate();
  const [trimester, setTrimester] = useState<PregnancyStage>('first');
  const [intensity, setIntensity] = useState<WorkoutIntensity>('gentle');
  const [duration, setDuration] = useState<WorkoutDuration>('20');
  const [symptomFocus, setSymptomFocus] = useState<string[]>([]);
  const [workoutData, setWorkoutData] = useState<PregnancyWorkout[]>(sampleWorkoutData);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleBack = () => {
    navigate('/schedule');
  };
  
  const handleWeekChange = (value: number[]) => {
    const week = value[0];
    if (week <= 13) {
      setTrimester('first');
    } else if (week <= 26) {
      setTrimester('second');
    } else {
      setTrimester('third');
    }
  };
  
  const handleToggleSymptom = (symptom: string) => {
    setSymptomFocus(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom) 
        : [...prev, symptom]
    );
  };
  
  const generateWorkoutRecommendations = async () => {
    setIsLoading(true);
    try {
      // Construct prompt with user preferences
      const trimesterName = trimester === 'first' ? 'First Trimester' : 
                          trimester === 'second' ? 'Second Trimester' : 
                          'Third Trimester';
      
      let prompt = `Generate 4-6 pregnancy workout recommendations for a woman in her ${trimesterName} (${getWeeksRange(trimester)}). `;
      prompt += `She prefers ${intensity} intensity workouts with a duration of about ${duration} minutes. `;
      
      if (symptomFocus.length > 0) {
        prompt += `She is experiencing the following symptoms that need focus: ${symptomFocus.join(', ')}. `;
      }
      
      prompt += `For each workout, provide: 1) title, 2) short description, 3) duration, 4) intensity level, 5) list of 3-4 benefits, 6) list of 2-3 cautions or warning signs to watch for. Format as JSON array.`;
      
      console.log("Sending prompt to Gemini:", prompt);

      // Call the Gemini AI function
      const { data, error } = await supabase.functions.invoke("gemini-ai", {
        body: { 
          prompt: prompt,
          type: "fitness" 
        }
      });
      
      if (error) {
        console.error("Error calling Gemini:", error);
        showActionToast("Failed to generate workouts. Please try again.");
        return;
      }
      
      console.log("Gemini response:", data);
      
      // Parse the recommendation
      let workoutRecommendations: PregnancyWorkout[];
      
      try {
        // Try to parse as JSON first
        const recommendationText = data.recommendation;
        const jsonMatch = recommendationText.match(/(\[[\s\S]*\])/);
        const jsonString = jsonMatch ? jsonMatch[1] : recommendationText;
        
        try {
          workoutRecommendations = JSON.parse(jsonString);
        } catch (e) {
          console.log("Failed to parse JSON directly, attempting to extract structured data");
          
          // Fallback to structured extraction if JSON parsing fails
          const workouts = parseWorkoutsFromText(recommendationText);
          if (workouts && workouts.length > 0) {
            workoutRecommendations = workouts;
          } else {
            throw new Error("Could not parse workout data");
          }
        }
        
        // Transform the data to match our interface
        const mappedWorkouts: PregnancyWorkout[] = workoutRecommendations.map((workout, index) => ({
          id: Date.now() + index,
          title: workout.title || `Workout ${index + 1}`,
          description: workout.description || '',
          trimester: [trimester],
          duration: workout.duration || `${duration} min`,
          intensity: (workout.intensity?.toLowerCase() || intensity) as WorkoutIntensity,
          benefits: Array.isArray(workout.benefits) ? workout.benefits : ['Improves overall health'],
          cautions: Array.isArray(workout.cautions) ? workout.cautions : ['Consult your doctor'],
        }));
        
        setWorkoutData(mappedWorkouts);
        showActionToast("Personalized workouts generated for your needs");
      } catch (parseError) {
        console.error("Error parsing workout data:", parseError);
        showActionToast("Could not generate personalized workouts. Using default recommendations instead.");
      }
    } catch (fetchError) {
      console.error("Error fetching recommendations:", fetchError);
      showActionToast("Failed to connect to recommendation service");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to parse workouts from text when JSON parsing fails
  const parseWorkoutsFromText = (text: string): PregnancyWorkout[] => {
    const workouts: PregnancyWorkout[] = [];
    // Look for patterns like "1. Workout Name" or "Workout 1:"
    const workoutSections = text.split(/\d+\.\s|\bWorkout\s+\d+\s*:/);
    
    for (let i = 1; i < workoutSections.length; i++) { // Skip first element as it's often empty
      const section = workoutSections[i].trim();
      if (!section) continue;
      
      const lines = section.split('\n').map(line => line.trim()).filter(Boolean);
      if (lines.length < 2) continue;
      
      const title = lines[0];
      let description = '';
      let duration = `${duration} min`;
      let workoutIntensity = intensity;
      const benefits: string[] = [];
      const cautions: string[] = [];
      
      // Parse the rest of the lines
      let currentSection: 'description' | 'benefits' | 'cautions' = 'description';
      
      for (let j = 1; j < lines.length; j++) {
        const line = lines[j];
        
        if (line.toLowerCase().includes('duration')) {
          const durationMatch = line.match(/(\d+)\s*min/);
          if (durationMatch) duration = `${durationMatch[1]} min`;
          continue;
        }
        
        if (line.toLowerCase().includes('intensity')) {
          if (line.toLowerCase().includes('gentle')) workoutIntensity = 'gentle';
          else if (line.toLowerCase().includes('moderate')) workoutIntensity = 'moderate';
          else if (line.toLowerCase().includes('active')) workoutIntensity = 'active';
          continue;
        }
        
        if (line.toLowerCase().includes('benefit') || line.toLowerCase().includes('advantage')) {
          currentSection = 'benefits';
          continue;
        }
        
        if (line.toLowerCase().includes('caution') || line.toLowerCase().includes('warning') || line.toLowerCase().includes('avoid')) {
          currentSection = 'cautions';
          continue;
        }
        
        // Check for bullet points or numbered items
        if (/^[-•*]\s|^\d+\.\s/.test(line)) {
          const content = line.replace(/^[-•*]\s|^\d+\.\s/, '').trim();
          if (currentSection === 'benefits') benefits.push(content);
          else if (currentSection === 'cautions') cautions.push(content);
          continue;
        }
        
        // If we're still in description section and haven't hit any special sections
        if (currentSection === 'description') {
          description += line + ' ';
        }
      }
      
      workouts.push({
        id: Date.now() + i,
        title,
        description: description.trim(),
        trimester: [trimester],
        duration,
        intensity: workoutIntensity as WorkoutIntensity,
        benefits: benefits.length > 0 ? benefits : ['Improved overall pregnancy health'],
        cautions: cautions.length > 0 ? cautions : ['Consult with your doctor']
      });
    }
    
    return workouts;
  };
  
  // Generate new recommendations when preferences change
  const handleSavePreferences = () => {
    generateWorkoutRecommendations();
  };
  
  const getTrimesters = (num: number): string => {
    if (num === 1) return "First";
    if (num === 2) return "Second";
    if (num === 3) return "Third";
    return "";
  };
  
  const getWeeksRange = (trimester: PregnancyStage): string => {
    if (trimester === 'first') return "Week 1-13";
    if (trimester === 'second') return "Week 14-26";
    if (trimester === 'third') return "Week 27-40";
    return "";
  };
  
  const getWeekNumber = (trimester: PregnancyStage): number => {
    if (trimester === 'first') return 6;
    if (trimester === 'second') return 20;
    if (trimester === 'third') return 33;
    return 6;
  };
  
  const symptoms = [
    'Back Pain', 'Nausea', 'Swelling', 'Fatigue',
    'Joint Pain', 'Insomnia', 'Heartburn', 'Cramps'
  ];

  // Generate initial recommendations on page load
  useEffect(() => {
    generateWorkoutRecommendations();
  }, []);

  return (
    <div className="max-w-md mx-auto px-4 pb-20">
      <Header 
        title="Pregnancy Workouts" 
        subtitle="Safe exercise recommendations" 
        action={
          <button 
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm"
            onClick={handleBack}
          >
            <ArrowLeft size={20} className="text-fitness-dark" />
          </button>
        }
      />
      
      <Card className="mb-6 overflow-hidden border-0 shadow-lg rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50">
        <CardContent className="p-0">
          <div className="px-6 py-6">
            <div className="flex items-center gap-3 mb-2">
              <Baby className="text-pink-500 h-6 w-6" />
              <h2 className="text-xl font-semibold text-gray-800">Pregnancy Fitness</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Safe, tailored workouts for each trimester to support your pregnancy journey.
            </p>
            
            <div className="flex items-center gap-2 mt-3">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${trimester === 'first' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                First Trimester
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${trimester === 'second' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-600'}`}>
                Second Trimester
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${trimester === 'third' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'}`}>
                Third Trimester
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mb-6 space-y-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Your Pregnancy Stage</h3>
            <p className="text-sm text-gray-500 mb-2">{getTrimesters(trimester === 'first' ? 1 : trimester === 'second' ? 2 : 3)} Trimester ({getWeeksRange(trimester)})</p>
            
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Select your current week (1-40):</p>
              <Slider
                defaultValue={[getWeekNumber(trimester)]}
                max={40}
                min={1}
                step={1}
                onValueChange={handleWeekChange}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Week 1</span>
                <span>Week 20</span>
                <span>Week 40</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Your Preferences</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Workout Intensity</p>
                <div className="flex gap-2">
                  <Button 
                    variant={intensity === 'gentle' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIntensity('gentle')}
                    className={intensity === 'gentle' ? 'bg-green-500 hover:bg-green-600' : ''}
                  >
                    Gentle
                  </Button>
                  <Button 
                    variant={intensity === 'moderate' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIntensity('moderate')}
                    className={intensity === 'moderate' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                  >
                    Moderate
                  </Button>
                  <Button 
                    variant={intensity === 'active' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIntensity('active')}
                    className={intensity === 'active' ? 'bg-purple-500 hover:bg-purple-600' : ''}
                  >
                    Active
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-2">Workout Duration</p>
                <div className="flex gap-2">
                  <Button 
                    variant={duration === '15' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDuration('15')}
                  >
                    15 min
                  </Button>
                  <Button 
                    variant={duration === '20' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDuration('20')}
                  >
                    20 min
                  </Button>
                  <Button 
                    variant={duration === '30' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDuration('30')}
                  >
                    30 min
                  </Button>
                  <Button 
                    variant={duration === '45' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDuration('45')}
                  >
                    45 min
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-2">Symptom Relief Focus</p>
                <div className="flex flex-wrap gap-2">
                  {symptoms.map(symptom => (
                    <Button 
                      key={symptom}
                      variant={symptomFocus.includes(symptom) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleToggleSymptom(symptom)}
                      className={symptomFocus.includes(symptom) ? 'bg-pink-500 hover:bg-pink-600' : ''}
                    >
                      {symptom}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={handleSavePreferences}
                className="w-full bg-fitness-primary relative"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Recommendations...
                  </>
                ) : (
                  'Generate Personalized Workouts'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h3 className="font-medium mb-3">Recommended Workouts</h3>
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-fitness-primary" />
          <p className="ml-2 text-fitness-gray">Generating your personalized workout plan...</p>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {workoutData.length > 0 ? workoutData.map((workout) => (
            <Card key={workout.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{workout.title}</h3>
                    <div className="flex items-center">
                      <Clock size={14} className="text-fitness-gray mr-1" />
                      <span className="text-xs text-fitness-gray">{workout.duration}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{workout.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full 
                      ${workout.intensity === 'gentle' ? 'bg-green-100 text-green-800' : 
                      workout.intensity === 'moderate' ? 'bg-blue-100 text-blue-800' : 
                      'bg-purple-100 text-purple-800'}`}>
                      {workout.intensity.charAt(0).toUpperCase() + workout.intensity.slice(1)} Intensity
                    </span>
                    
                    {workout.trimester.includes('first') && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        1st Trimester
                      </span>
                    )}
                    {workout.trimester.includes('second') && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                        2nd Trimester
                      </span>
                    )}
                    {workout.trimester.includes('third') && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                        3rd Trimester
                      </span>
                    )}
                  </div>
                  
                  <Tabs defaultValue="benefits">
                    <TabsList className="grid grid-cols-2 mb-2">
                      <TabsTrigger value="benefits" className="text-xs">Benefits</TabsTrigger>
                      <TabsTrigger value="cautions" className="text-xs">Cautions</TabsTrigger>
                    </TabsList>
                    <TabsContent value="benefits" className="space-y-1 mt-2">
                      <ul className="text-xs text-gray-600 space-y-1">
                        {workout.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start">
                            <Heart size={12} className="text-pink-500 mr-1 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                    <TabsContent value="cautions" className="space-y-1 mt-2">
                      <ul className="text-xs text-gray-600 space-y-1">
                        {workout.cautions.map((caution, i) => (
                          <li key={i} className="flex items-start">
                            <AlertTriangle size={12} className="text-amber-500 mr-1 mt-0.5" />
                            <span>{caution}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" className="flex-1 text-xs">
                      View Details
                    </Button>
                    <Button className="flex-1 text-xs bg-fitness-primary">
                      Start Workout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) : (
            <Card className="p-4 text-center">
              <p className="text-fitness-gray">No workouts found for your current preferences.</p>
              <Button onClick={handleSavePreferences} className="mt-2">
                Try Different Preferences
              </Button>
            </Card>
          )}
        </div>
      )}
      
      <Card className="mb-6 bg-red-50 border border-red-100">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-500 h-5 w-5 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800 mb-1">Important Health Notice</h4>
              <p className="text-xs text-red-700">
                Always consult with your healthcare provider before starting any exercise 
                program during pregnancy. Stop immediately and seek medical advice if you 
                experience dizziness, shortness of breath, chest pain, headache, muscle 
                weakness, calf pain or swelling, vaginal bleeding, or contractions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Navigation />
    </div>
  );
};

export default PregnancyWorkouts;
