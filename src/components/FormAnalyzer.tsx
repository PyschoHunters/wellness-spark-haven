import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Camera, Upload, Dumbbell, Zap, AlertCircle, CheckCircle, X, RefreshCw } from 'lucide-react';
import { showActionToast } from '@/utils/toast-utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Analysis {
  id?: string;
  analysis: string;
  rating: number | null;
  exerciseType: string;
  formTips: string[];
  timestamp: string;
  imageUrl?: string;
}

const FormAnalyzer = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [exerciseType, setExerciseType] = useState('squat');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<Analysis[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const exerciseOptions = [
    { value: 'squat', label: 'Squat' },
    { value: 'pushup', label: 'Push-up' },
    { value: 'deadlift', label: 'Deadlift' },
    { value: 'plank', label: 'Plank' },
    { value: 'lunge', label: 'Lunge' },
    { value: 'bicep-curl', label: 'Bicep Curl' },
    { value: 'shoulder-press', label: 'Shoulder Press' },
    { value: 'tricep-extension', label: 'Tricep Extension' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        showActionToast('Please select an image file');
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showActionToast('Image size should be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };
  
  const handleCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };
  
  const analyzeForm = async () => {
    if (!selectedFile || !exerciseType) {
      showActionToast('Please select an image and exercise type');
      return;
    }
    
    try {
      setIsAnalyzing(true);
      
      // Convert image to base64
      const imageBase64 = await convertToBase64(selectedFile);
      
      // Call the Supabase Edge Function for analysis
      const { data, error } = await supabase.functions.invoke('pose-analysis', {
        body: { imageBase64, exerciseType }
      });
      
      if (error) {
        throw error;
      }
      
      // Save the image to Supabase Storage (if we implement that later)
      // For now, we'll just keep the analysis data
      
      const newAnalysis: Analysis = {
        analysis: data.analysis,
        rating: data.rating,
        exerciseType: data.exerciseType,
        formTips: data.formTips,
        timestamp: data.timestamp,
        // We could add the image URL here if we save it to storage
      };
      
      setAnalysis(newAnalysis);
      setShowResults(true);
      
      // Add to history
      setAnalysisHistory(prev => [newAnalysis, ...prev].slice(0, 10));
      
      showActionToast('Form analysis complete!');
    } catch (error) {
      console.error('Error analyzing form:', error);
      showActionToast('Failed to analyze form. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysis(null);
    setShowResults(false);
  };
  
  const getRatingColor = (rating: number | null) => {
    if (!rating) return 'bg-gray-400';
    if (rating < 4) return 'bg-red-500';
    if (rating < 7) return 'bg-amber-500';
    return 'bg-green-500';
  };
  
  const viewHistory = () => {
    setShowHistory(true);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">AI Form Analyzer</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={viewHistory}
          disabled={analysisHistory.length === 0}
          className="text-xs"
        >
          View History
        </Button>
      </div>
      
      {!showResults ? (
        <div className="space-y-4">
          <div className="bg-fitness-gray-light p-4 rounded-xl text-center">
            <div className="flex justify-center mb-4">
              <Dumbbell size={32} className="text-fitness-primary" />
            </div>
            <h3 className="font-medium mb-2">Perfect Your Form</h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload a photo of yourself performing an exercise and our AI will analyze your form 
              and provide personalized feedback.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Exercise Type</label>
              <Select value={exerciseType} onValueChange={setExerciseType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select exercise" />
                </SelectTrigger>
                <SelectContent>
                  {exerciseOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {previewUrl ? (
              <div className="relative mb-4">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-56 object-cover rounded-lg"
                />
                <button 
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1"
                  onClick={() => setPreviewUrl(null)}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 cursor-pointer hover:border-fitness-primary transition-colors"
                onClick={handleCapture}
              >
                <div className="text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Take or upload a photo</p>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange} 
                  ref={fileInputRef}
                />
              </div>
            )}
            
            <div className="flex space-x-2">
              <Button 
                className="flex-1" 
                onClick={handleCapture}
                variant="outline"
              >
                <Upload size={16} className="mr-2" />
                Upload Photo
              </Button>
              <Button 
                className="flex-1 bg-fitness-primary hover:bg-fitness-primary-dark"
                onClick={analyzeForm}
                disabled={!previewUrl || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap size={16} className="mr-2" />
                    Analyze Form
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <h3 className="font-medium">Form Analysis Results</h3>
              <Badge variant="outline" className="ml-2">
                {exerciseOptions.find(e => e.value === exerciseType)?.label || exerciseType}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={resetForm}>
              <X size={16} className="mr-1" /> Close
            </Button>
          </div>
          
          {previewUrl && (
            <div className="mb-4">
              <img 
                src={previewUrl} 
                alt="Exercise Form" 
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
          
          {analysis && analysis.rating !== null && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Form Rating</span>
                <span className="text-sm font-bold">{analysis.rating}/10</span>
              </div>
              <Progress value={analysis.rating * 10} className={getRatingColor(analysis.rating)} />
            </div>
          )}
          
          <Card className="p-4">
            <h4 className="font-medium mb-2">Expert Feedback</h4>
            <p className="text-sm whitespace-pre-line">{analysis?.analysis}</p>
          </Card>
          
          <div>
            <h4 className="font-medium mb-2">Form Tips</h4>
            <ul className="space-y-2">
              {analysis?.formTips.map((tip, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Button 
            className="w-full mt-4 bg-fitness-primary hover:bg-fitness-primary-dark"
            onClick={resetForm}
          >
            Analyze Another Exercise
          </Button>
        </div>
      )}
      
      {/* History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Your Form Analysis History</DialogTitle>
            <DialogDescription>
              Review your previous form analyses and track your progress over time.
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto space-y-4 py-4">
            {analysisHistory.length > 0 ? (
              analysisHistory.map((item, index) => (
                <Card key={index} className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Badge variant="outline">
                        {exerciseOptions.find(e => e.value === item.exerciseType)?.label || item.exerciseType}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(item.timestamp)}</p>
                    </div>
                    {item.rating !== null && (
                      <Badge className={getRatingColor(item.rating) + ' text-white'}>
                        {item.rating}/10
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm line-clamp-3">{item.analysis}</p>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">No analysis history yet</p>
              </div>
            )}
          </div>
          
          <DialogClose asChild>
            <Button className="w-full mt-2">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormAnalyzer;
