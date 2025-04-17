
import { useState, useRef } from 'react';
import { Layout } from '@/components/Layout';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { toast } from "sonner";

const FormAnalysis = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast: hookToast } = useToast();

  const analyzeForm = async (file: File) => {
    try {
      setAnalyzing(true);
      setPreviewUrl(URL.createObjectURL(file));
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

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      setFeedback(data.feedback);
      toast.success("Analysis complete!", {
        description: "Your form has been analyzed successfully!"
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Analysis failed", {
        description: "Failed to analyze form. Please try again."
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      analyzeForm(e.dataTransfer.files[0]);
    }
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
          <div 
            className={`bg-white p-6 rounded-2xl shadow-sm transition-all duration-300 ${analyzing ? 'opacity-70' : ''}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-fitness-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-12 h-12 text-fitness-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Analyze Your Form</h3>
                <p className="text-gray-500 mt-2">
                  Upload a photo or video of your workout form for instant AI feedback
                </p>
              </div>
              
              {previewUrl ? (
                <div className="relative mt-4 rounded-xl overflow-hidden border-2 border-fitness-primary/30">
                  <img src={previewUrl} alt="Workout form preview" className="w-full h-48 object-cover" />
                  {analyzing && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <div className="animate-pulse font-medium text-fitness-primary">Analyzing...</div>
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  className="mt-4 border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-fitness-primary/60 transition-all"
                  onClick={handleCameraClick}
                >
                  <div className="text-center">
                    <ImageIcon className="w-10 h-10 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Drag and drop or click to upload</p>
                    <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, GIF</p>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="form-upload"
                  ref={fileInputRef}
                  disabled={analyzing}
                />
                
                <Button
                  className="w-full flex gap-2 bg-fitness-primary hover:bg-fitness-primary/90"
                  onClick={handleCameraClick}
                  disabled={analyzing}
                >
                  <Upload className="w-4 h-4" />
                  {analyzing ? 'Analyzing...' : 'Upload Media'}
                </Button>
                
                {previewUrl && (
                  <Button
                    variant="outline"
                    onClick={() => setPreviewUrl(null)}
                    disabled={analyzing}
                  >
                    New
                  </Button>
                )}
              </div>
            </div>
          </div>

          {feedback && (
            <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-up space-y-4">
              <h3 className="text-lg font-semibold text-fitness-primary">AI Feedback</h3>
              
              <div className="p-4 bg-fitness-primary/5 rounded-xl">
                <p className="text-gray-700 whitespace-pre-line">{feedback}</p>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  className="text-sm"
                  onClick={() => {
                    navigator.clipboard.writeText(feedback);
                    toast.success("Copied to clipboard");
                  }}
                >
                  Copy Feedback
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FormAnalysis;
