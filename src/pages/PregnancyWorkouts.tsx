
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Baby, Activity, AlertTriangle, Calendar, Clock, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { showActionToast } from '@/utils/toast-utils';

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

const workoutData: PregnancyWorkout[] = [
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
  },
  {
    id: 3,
    title: 'Pelvic Floor Strengthening',
    description: 'Focused exercises to strengthen the pelvic floor muscles, crucial for pregnancy, delivery, and postpartum recovery.',
    trimester: ['first', 'second', 'third'],
    duration: '15 min',
    intensity: 'gentle',
    benefits: ['Prepares for delivery', 'Prevents incontinence', 'Improves recovery'],
    cautions: ['Stop if any pain occurs']
  },
  {
    id: 4,
    title: 'Walking Program',
    description: 'A structured walking routine tailored to pregnancy needs, focusing on proper posture and comfortable pace.',
    trimester: ['first', 'second', 'third'],
    duration: '30 min',
    intensity: 'moderate',
    benefits: ['Improves cardiovascular health', 'Helps manage weight', 'Boosts mood'],
    cautions: ['Wear supportive shoes', 'Stay hydrated', 'Rest if tired']
  },
  {
    id: 5,
    title: 'Prenatal Pilates',
    description: 'Modified pilates exercises that focus on core strength, posture, and stability during pregnancy.',
    trimester: ['first', 'second'],
    duration: '20 min',
    intensity: 'moderate',
    benefits: ['Improves posture', 'Strengthens core safely', 'Reduces back pain'],
    cautions: ['Avoid traditional ab exercises', 'No lying flat after first trimester']
  },
  {
    id: 6,
    title: 'Pregnancy Strength Training',
    description: 'Carefully selected resistance exercises using light weights or body weight to maintain muscle tone safely.',
    trimester: ['first', 'second'],
    duration: '20 min',
    intensity: 'moderate',
    benefits: ['Maintains muscle tone', 'Prepares body for delivery and recovery', 'Improves daily function'],
    cautions: ['Use lighter weights than pre-pregnancy', 'Avoid lying flat on back', 'Focus on form']
  },
  {
    id: 7,
    title: 'Gentle Stretching Routine',
    description: 'Focused on relieving common pregnancy discomforts through safe, gentle stretches for the entire body.',
    trimester: ['first', 'second', 'third'],
    duration: '15 min',
    intensity: 'gentle',
    benefits: ['Relieves muscle tension', 'Improves flexibility', 'Reduces joint discomfort'],
    cautions: ['No bouncing', 'Stretch only to comfortable limit', 'Breath normally']
  },
  {
    id: 8,
    title: 'Modified Dance Workout',
    description: 'Fun, low-impact dance moves that help maintain cardiovascular fitness while being gentle on the joints.',
    trimester: ['first', 'second'],
    duration: '20 min',
    intensity: 'moderate',
    benefits: ['Improves mood', 'Maintains cardiovascular fitness', 'Releases endorphins'],
    cautions: ['Avoid jumps and quick direction changes', 'Maintain balance', 'Stay hydrated']
  },
  {
    id: 9,
    title: 'Third Trimester Relief Exercises',
    description: 'Specially designed movements to alleviate common third trimester discomforts like back pain and swelling.',
    trimester: ['third'],
    duration: '15 min',
    intensity: 'gentle',
    benefits: ['Reduces swelling', 'Relieves back pain', 'Improves circulation', 'Prepares for labor'],
    cautions: ['Move slowly', 'Use supports when needed', 'Listen to your body']
  }
];

const PregnancyWorkouts = () => {
  const navigate = useNavigate();
  const [trimester, setTrimester] = useState<PregnancyStage>('first');
  const [intensity, setIntensity] = useState<WorkoutIntensity>('gentle');
  const [duration, setDuration] = useState<WorkoutDuration>('20');
  const [symptomFocus, setSymptomFocus] = useState<string[]>([]);
  
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
  
  const handleSavePreferences = () => {
    showActionToast("Preferences saved! Your recommendations are updated.");
  };
  
  const handleToggleSymptom = (symptom: string) => {
    setSymptomFocus(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom) 
        : [...prev, symptom]
    );
  };
  
  // Filter workouts based on user preferences
  const filteredWorkouts = workoutData.filter(workout => {
    // Filter by trimester
    const trimesterMatch = workout.trimester.includes(trimester);
    
    // Filter by intensity
    const intensityPriority = {
      'gentle': 0,
      'moderate': 1,
      'active': 2
    };
    
    // Allow current intensity and lower intensities
    const intensityMatch = intensityPriority[workout.intensity] <= intensityPriority[intensity];
    
    // Basic match
    return trimesterMatch && intensityMatch;
  });
  
  // Further sort by preference
  const sortedWorkouts = [...filteredWorkouts].sort((a, b) => {
    // Prioritize exact intensity matches
    if (a.intensity === intensity && b.intensity !== intensity) return -1;
    if (b.intensity === intensity && a.intensity !== intensity) return 1;
    
    // Sort by duration close to preference
    const aDurationNum = parseInt(a.duration);
    const bDurationNum = parseInt(b.duration);
    const prefDurationNum = parseInt(duration);
    
    return Math.abs(aDurationNum - prefDurationNum) - Math.abs(bDurationNum - prefDurationNum);
  });
  
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
                className="w-full bg-fitness-primary"
              >
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h3 className="font-medium mb-3">Recommended Workouts</h3>
      <div className="space-y-4 mb-6">
        {sortedWorkouts.map((workout) => (
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
        ))}
      </div>
      
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
