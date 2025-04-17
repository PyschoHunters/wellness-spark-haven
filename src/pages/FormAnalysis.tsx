
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Camera, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FormAnalysis = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState('');
  const { toast } = useToast();

  const analyzeForm = async (file: File) => {
    try {
      setAnalyzing(true);
      const base64Image = await convertToBase64(file);
      
      const response = await fetch('https://zrzkpoysgsybrkuennkd.supabase.co/functions/v1/analyze-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
        }),
      });

      const data = await response.json();
      setFeedback(data.feedback);
      toast({
        title: "Analysis Complete",
        description: "Your form has been analyzed successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      analyzeForm(file);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4">
        <Header 
          title="Form Analysis" 
          subtitle="Get AI feedback on your workout form" 
        />
        
        <div className="mt-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-fitness-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-10 h-10 text-fitness-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Upload Your Form Video/Image</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Get instant AI feedback on your exercise form
                </p>
              </div>
              
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="form-upload"
                  disabled={analyzing}
                />
                <label htmlFor="form-upload">
                  <Button
                    className="w-full gap-2"
                    disabled={analyzing}
                  >
                    <Upload className="w-4 h-4" />
                    {analyzing ? 'Analyzing...' : 'Upload Media'}
                  </Button>
                </label>
              </div>
            </div>
          </div>

          {feedback && (
            <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-up">
              <h3 className="font-semibold mb-3">AI Feedback</h3>
              <p className="text-gray-600 whitespace-pre-line">{feedback}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FormAnalysis;
