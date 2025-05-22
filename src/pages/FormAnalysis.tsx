import { useState, useRef } from 'react';
import { Layout } from '@/components/Layout';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Camera, 
  Upload, 
  Image as ImageIcon, 
  RotateCcw, 
  Copy, 
  CheckCircle, 
  AlertTriangle, 
  Info 
} from 'lucide-react';
import { toast } from "sonner";

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
      toast.info("Analyzing your form...", {
        description: "This may take up to 30 seconds. Please be patient."
      });
      
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
      
      const textResponse = await response.text();
      console.log("Raw response:", textResponse);
      
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (e) {
        console.error("Error parsing response:", e);
        throw new Error(`Invalid response from server: ${textResponse}`);
      }
      
      if (!response.ok) {
        console.error("Error response:", data);
        throw new Error(data.error || data.details || `Server responded with ${response.status}`);
      }

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
        description: "Please try again with a different image. Our AI will try to analyze any image quality."
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Please upload an image smaller than 5MB"
        });
        return;
      }
      
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
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Please upload an image smaller than 5MB"
        });
        return;
      }
      
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

  const renderFeedbackSection = (title: string, content: string) => (
    <div className="mb-4">
      <h4 className="text-fitness-primary font-semibold text-lg mb-2">{title}</h4>
      <p className="text-gray-700 leading-relaxed">{content}</p>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 pb-12">
        <Header 
          title="AI Form Analysis" 
          subtitle="Get instant, professional feedback on your exercise technique" 
        />
        
        <Card className="mt-6 border border-fitness-primary/20">
          <div 
            className={`p-8 transition-all duration-300 ${analyzing ? 'opacity-70' : ''}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-fitness-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-12 h-12 text-fitness-primary" />
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">Analyze Your Form</h3>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                  Upload a photo of your exercise form and get instant professional feedback
                </p>
              </div>
              
              {previewUrl ? (
                <div className="relative mt-4 rounded-xl overflow-hidden border-2 border-fitness-primary/30 bg-black/5">
                  <img src={previewUrl} alt="Workout form preview" className="w-full h-72 object-contain" />
                  {analyzing && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin w-12 h-12 border-4 border-fitness-primary/20 border-t-fitness-primary rounded-full mb-4"></div>
                        <div className="font-medium text-fitness-primary text-lg">Analyzing your form...</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  className="mt-4 border-2 border-dashed border-gray-300 rounded-xl p-10 cursor-pointer hover:border-fitness-primary/60 transition-all bg-gray-50/50"
                  onClick={handleCameraClick}
                >
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 mx-auto text-gray-400" />
                    <p className="mt-4 text-base text-gray-600">Drag and drop or click to upload</p>
                    <p className="text-sm text-gray-400 mt-2">Supports JPG, PNG, GIF (max 5MB)</p>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 justify-center">
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
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={analyzing}
                    className="min-w-[200px]"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Upload New Image
                  </Button>
                ) : (
                  <Button
                    className="min-w-[200px] bg-fitness-primary hover:bg-fitness-primary/90"
                    onClick={handleCameraClick}
                    disabled={analyzing}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {analyzing ? 'Analyzing...' : 'Upload Image'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {error && (
          <Card className="mt-6 border-red-200 bg-red-50/50">
            <div className="p-6 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-red-800">Analysis Error</h4>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <p className="text-red-500/70 text-xs mt-2">
                  Try uploading a different image or adjusting the lighting/angle
                </p>
              </div>
            </div>
          </Card>
        )}

        {feedback && (
          <Card className="mt-6 bg-white shadow-sm border border-fitness-primary/10">
            <div className="p-6 space-y-5">
              <div className="flex justify-between items-center border-b pb-3 border-fitness-primary/10">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-fitness-primary" />
                  <h3 className="text-xl font-bold text-fitness-primary">
                    Professional Form Analysis
                  </h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-sm flex gap-2 items-center hover:bg-fitness-primary/10"
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
                      <span>Copy Feedback</span>
                    </>
                  )}
                </Button>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                <p className="text-gray-800 leading-relaxed font-medium text-base">
                  {feedback}
                </p>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-500 border-t pt-3 border-fitness-primary/10">
                <Info className="w-4 h-4 text-fitness-primary/70" />
                <p className="italic">
                  AI-generated analysis. Consult a fitness professional for personalized guidance.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default FormAnalysis;
