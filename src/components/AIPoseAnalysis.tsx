
import React, { useState } from 'react';
import { Camera, CheckCircle2, AlertCircle, RefreshCw, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { showActionToast } from '@/utils/toast-utils';

interface PoseAnalysisResult {
  score: number;
  feedback: string[];
  status: 'good' | 'needs-improvement' | 'incorrect';
}

const AIPoseAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PoseAnalysisResult | null>(null);
  const [selectedExercise, setSelectedExercise] = useState('squat');

  const exercises = [
    { id: 'squat', name: 'Squats' },
    { id: 'pushup', name: 'Push-ups' },
    { id: 'plank', name: 'Plank Form' },
    { id: 'lunge', name: 'Lunges' }
  ];

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    // Simulating AI analysis with mock data
    setTimeout(() => {
      const mockResults: Record<string, PoseAnalysisResult> = {
        squat: {
          score: 85,
          feedback: [
            'Knees tracking well over toes',
            'Good depth achieved',
            'Try maintaining a more neutral spine'
          ],
          status: 'good'
        },
        pushup: {
          score: 70,
          feedback: [
            'Elbow angle is good',
            'Core needs more engagement',
            'Keep hips level throughout movement'
          ],
          status: 'needs-improvement'
        },
        plank: {
          score: 90,
          feedback: [
            'Excellent core engagement',
            'Shoulders stacked properly',
            'Perfect hip alignment'
          ],
          status: 'good'
        },
        lunge: {
          score: 65,
          feedback: [
            'Front knee stable',
            'Back knee needs to go lower',
            'Watch trunk rotation'
          ],
          status: 'needs-improvement'
        }
      };

      setResult(mockResults[selectedExercise]);
      setIsAnalyzing(false);
      showActionToast("Analysis complete!");
    }, 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">AI Form Analysis</h3>
          <p className="text-sm text-gray-500">Perfect your exercise form with AI assistance</p>
        </div>
        <Shield className="text-indigo-600" size={24} />
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {exercises.map((exercise) => (
            <button
              key={exercise.id}
              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                selectedExercise === exercise.id
                  ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-200'
                  : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:border-gray-200'
              }`}
              onClick={() => setSelectedExercise(exercise.id)}
            >
              {exercise.name}
            </button>
          ))}
        </div>

        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
          {!isAnalyzing && !result ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Camera size={40} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Ready to analyze your form</p>
            </div>
          ) : isAnalyzing ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <RefreshCw size={40} className="text-indigo-500 mb-2 animate-spin" />
              <p className="text-sm text-indigo-600 font-medium">Analyzing your form...</p>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              {result?.status === 'good' ? (
                <CheckCircle2 size={40} className="text-green-500 mb-2" />
              ) : (
                <AlertCircle size={40} className="text-amber-500 mb-2" />
              )}
              <div className="w-full max-w-sm mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Form Score</span>
                  <span className="font-medium">{result?.score}%</span>
                </div>
                <Progress value={result?.score} className="h-2" />
              </div>
              <div className="bg-gray-50 rounded-lg p-4 w-full max-w-sm">
                <h4 className="text-sm font-medium mb-2">Feedback:</h4>
                <ul className="space-y-2">
                  {result?.feedback.map((item, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <div className="mt-1">
                        {index === 0 ? (
                          <CheckCircle2 size={14} className="text-green-500" />
                        ) : index === result.feedback.length - 1 ? (
                          <AlertCircle size={14} className="text-amber-500" />
                        ) : (
                          <CheckCircle2 size={14} className="text-blue-500" />
                        )}
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <Button 
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white"
          size="lg"
          onClick={simulateAnalysis}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <RefreshCw size={16} className="mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Camera size={16} className="mr-2" />
              Start Analysis
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AIPoseAnalysis;
