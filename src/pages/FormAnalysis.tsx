
import { useState, useRef } from 'react';
import { Layout } from '@/components/Layout';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Image as ImageIcon, RotateCcw, Copy, CheckCircle } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';

const FormAnalysis = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeForm = async (file: File) => {
    try {
      setAnalyzing(true);
      setError(null);
      setFeedback('');
      setPreviewUrl(URL.createObjectURL(file));
      
      const base64Image = await convertToBase64(file);
      
      console.log("Sending image for analysis...");
      
      const response = await fetch('https://zrzkpoysgsybrkuennkd.supabase.co/functions/v1/analyze-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
        }),
      });

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error response:", errorData);
        throw new Error(`Server responded with ${response.status}: ${errorData.error || errorData.details || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log("Analysis completed successfully");
      
      if (data.feedback) {
        setFeedback(data.feedback);
        toast.success("Analysis complete!", {
          description: "Your form has been analyzed successfully!"
        });
      } else {
        throw new Error("No feedback received from the analysis");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      setError(error.message || "Failed to analyze your workout form");
      toast.error("Analysis failed", {
        description: error.message || "Failed to analyze form. Please try again with a different image."
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Please upload an image smaller than 5MB"
        });
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("Invalid file type", {
          description: "Please upload an image file (JPG, PNG, etc.)"
        });
        return;
      }
      
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
      const file = e.dataTransfer.files[0];
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Please upload an image smaller than 5MB"
        });
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("Invalid file type", {
          description: "Please upload an image file (JPG, PNG, etc.)"
        });
        return;
      }
      
      analyzeForm(file);
    }
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleReset = () => {
    setPreviewUrl(null);
    setFeedback('');
    setError(null);
    setCopied(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopyFeedback = () => {
    if (feedback) {
      navigator.clipboard.writeText(feedback);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
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
      <div className="max-w-3xl mx-auto px-4 pb-12">
        <Header 
          title="AI Workout Form Analysis" 
          subtitle="Get professional feedback on your exercise form" 
        />
        
        <div className="mt-6 space-y-6">
          <div 
            className={`bg-white p-6 rounded-2xl shadow-sm transition-all duration-300 ${analyzing ? 'opacity-70' : ''}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-fitness-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-10 h-10 text-fitness-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Analyze Your Workout Form</h3>
                <p className="text-gray-500 mt-2">
                  Upload a photo of your workout form and our AI will provide personalized feedback
                </p>
              </div>
              
              {previewUrl ? (
                <div className="relative mt-4 rounded-xl overflow-hidden border-2 border-fitness-primary/30">
                  <img src={previewUrl} alt="Workout form preview" className="w-full h-64 object-contain bg-gray-100" />
                  {analyzing && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin w-10 h-10 border-4 border-fitness-primary/20 border-t-fitness-primary rounded-full mb-3"></div>
                        <div className="font-medium text-fitness-primary">Analyzing your form...</div>
                      </div>
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
                    <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, GIF (max 5MB)</p>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="form-upload"
                  ref={fileInputRef}
                  disabled={analyzing}
                />
                
                {previewUrl ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      disabled={analyzing}
                      className="w-full"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Upload New Image
                    </Button>
                  </>
                ) : (
                  <Button
                    className="w-full flex gap-2 bg-fitness-primary hover:bg-fitness-primary/90"
                    onClick={handleCameraClick}
                    disabled={analyzing}
                  >
                    <Upload className="w-4 h-4" />
                    {analyzing ? 'Analyzing...' : 'Upload Image'}
                  </Button>
                )}
              </div>
              
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
                  <p className="font-medium mb-1">Analysis Error</p>
                  <p>{error}</p>
                  <p className="mt-2 text-xs">Try uploading a clearer image of your exercise form</p>
                </div>
              )}
            </div>
          </div>

          {feedback && (
            <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-up space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-fitness-primary">AI Form Analysis</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-sm flex gap-1.5 items-center"
                  onClick={handleCopyFeedback}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>
              
              <div className="p-4 bg-fitness-primary/5 rounded-xl">
                <p className="text-gray-700 whitespace-pre-line">{feedback}</p>
              </div>
              
              <div className="pt-2 text-sm text-gray-500 italic">
                <p>This analysis is provided by AI and should not replace professional advice from a certified trainer.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FormAnalysis;
