import { useState, useRef, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Camera, 
  Upload, 
  Image as ImageIcon, 
  RotateCcw, 
  Copy, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Play,
  Pause,
  Video,
  Activity
} from 'lucide-react';
import { toast } from "sonner";
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import { calculateAngle } from '@/utils/pose-utils';

const FormAnalysis = () => {
  // Original form analysis state
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New exercise counter state
  const [activeTab, setActiveTab] = useState('image-analysis');
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);
  const [isExercising, setIsExercising] = useState(false);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [exercise, setExercise] = useState('squat'); // Default exercise type
  const [status, setStatus] = useState('ready'); // 'ready', 'up', 'down'
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestAnimationRef = useRef<number | null>(null);
  
  // Initialize pose detection model
  useEffect(() => {
    if (activeTab === 'rep-counter') {
      const loadModel = async () => {
        try {
          setIsModelLoading(true);
          // Load the MoveNet model
          const detectorConfig = {
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
            enableSmoothing: true
          };
          const detector = await poseDetection.createDetector(
            poseDetection.SupportedModels.MoveNet, 
            detectorConfig
          );
          
          setDetector(detector);
          setIsModelLoading(false);
          toast.success("Exercise detection model loaded successfully!");
        } catch (error) {
          console.error("Failed to load model:", error);
          toast.error("Failed to load exercise detection model. Please try again.");
          setIsModelLoading(false);
        }
      };

      loadModel();
    }

    return () => {
      if (requestAnimationRef.current) {
        cancelAnimationFrame(requestAnimationRef.current);
      }
      
      // Stop camera when component unmounts or tab changes
      if (activeTab !== 'rep-counter') {
        stopCamera();
      }
    };
  }, [activeTab]);

  // Setup webcam dimensions when video loads
  useEffect(() => {
    if (videoRef.current && canvasRef.current) {
      canvasRef.current.width = videoRef.current.videoWidth || 640;
      canvasRef.current.height = videoRef.current.videoHeight || 480;
    }
  }, [videoRef.current?.videoWidth, videoRef.current?.videoHeight]);

  // Original form analysis functions
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

  // New rep counter functions
  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        toast.success("Camera started successfully!");
      }
    } catch (error) {
      console.error("Error accessing the camera:", error);
      toast.error("Could not access your camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => {
        track.stop();
      });
      
      videoRef.current.srcObject = null;
    }
    
    // Also stop exercise tracking if it's running
    if (isExercising) {
      stopExercising();
    }
  };

  const startExercising = () => {
    setIsExercising(true);
    setExerciseCount(0);
    setStatus('ready');
    detectPose();
  };

  const stopExercising = () => {
    setIsExercising(false);
    if (requestAnimationRef.current) {
      cancelAnimationFrame(requestAnimationRef.current);
      requestAnimationRef.current = null;
    }
  };

  const resetCounter = () => {
    setExerciseCount(0);
    setStatus('ready');
  };

  const detectPose = async () => {
    if (!detector || !videoRef.current || videoRef.current.readyState !== 4 || !canvasRef.current) {
      requestAnimationRef.current = requestAnimationFrame(detectPose);
      return;
    }

    try {
      // Detect poses
      const poses = await detector.estimatePoses(videoRef.current);
      
      if (poses.length > 0) {
        const pose = poses[0];
        
        // Draw the pose
        drawPose(pose);
        
        // Count exercises based on pose
        countExercise(pose);
      }
      
      // Continue detection loop
      if (isExercising) {
        requestAnimationRef.current = requestAnimationFrame(detectPose);
      }
    } catch (error) {
      console.error("Error in pose detection:", error);
    }
  };

  const drawPose = (pose: poseDetection.Pose) => {
    const ctx = canvasRef.current!.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    
    // Draw keypoints and connections
    const keypoints = pose.keypoints;
    
    if (keypoints) {
      // Draw each keypoint
      for (const keypoint of keypoints) {
        if (keypoint.score && keypoint.score > 0.3) {
          ctx.beginPath();
          ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = 'aqua';
          ctx.fill();
          ctx.strokeStyle = 'rgb(255, 255, 255)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // Connect keypoints to form a skeleton
      drawConnections(ctx, keypoints);
      
      // Draw angles for the specific exercise
      drawExerciseAngles(ctx, keypoints);
    }
  };

  const drawConnections = (ctx: CanvasRenderingContext2D, keypoints: poseDetection.Keypoint[]) => {
    const connections = [
      ['nose', 'left_eye'], ['left_eye', 'left_ear'], ['nose', 'right_eye'],
      ['right_eye', 'right_ear'], ['left_shoulder', 'right_shoulder'],
      ['left_shoulder', 'left_elbow'], ['left_elbow', 'left_wrist'],
      ['right_shoulder', 'right_elbow'], ['right_elbow', 'right_wrist'],
      ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
      ['left_hip', 'right_hip'], ['left_hip', 'left_knee'],
      ['left_knee', 'left_ankle'], ['right_hip', 'right_knee'],
      ['right_knee', 'right_ankle']
    ];

    const keypointMap = keypoints.reduce((map, keypoint) => {
      map[keypoint.name || ''] = keypoint;
      return map;
    }, {} as Record<string, poseDetection.Keypoint>);

    // Draw connections
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#00FFFF';

    for (const [start, end] of connections) {
      const startPoint = keypointMap[start];
      const endPoint = keypointMap[end];

      if (startPoint && endPoint && 
          startPoint.score && startPoint.score > 0.3 &&
          endPoint.score && endPoint.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();
      }
    }
  };

  const drawExerciseAngles = (ctx: CanvasRenderingContext2D, keypoints: poseDetection.Keypoint[]) => {
    const keypointMap = keypoints.reduce((map, keypoint) => {
      map[keypoint.name || ''] = keypoint;
      return map;
    }, {} as Record<string, poseDetection.Keypoint>);
    
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    
    if (exercise === 'squat') {
      // Draw knee angle for squats
      const leftHip = keypointMap['left_hip'];
      const leftKnee = keypointMap['left_knee'];
      const leftAnkle = keypointMap['left_ankle'];
      
      if (leftHip && leftHip.score && leftHip.score > 0.3 &&
          leftKnee && leftKnee.score && leftKnee.score > 0.3 &&
          leftAnkle && leftAnkle.score && leftAnkle.score > 0.3) {
        
        const kneeAngle = calculateAngle(
          { x: leftHip.x, y: leftHip.y },
          { x: leftKnee.x, y: leftKnee.y },
          { x: leftAnkle.x, y: leftAnkle.y }
        );
        
        ctx.fillText(`Knee: ${Math.round(kneeAngle)}°`, leftKnee.x + 10, leftKnee.y);
      }
    } else if (exercise === 'push-up') {
      // Draw elbow angle for push-ups
      const leftShoulder = keypointMap['left_shoulder'];
      const leftElbow = keypointMap['left_elbow'];
      const leftWrist = keypointMap['left_wrist'];
      
      if (leftShoulder && leftShoulder.score && leftShoulder.score > 0.3 &&
          leftElbow && leftElbow.score && leftElbow.score > 0.3 &&
          leftWrist && leftWrist.score && leftWrist.score > 0.3) {
        
        const elbowAngle = calculateAngle(
          { x: leftShoulder.x, y: leftShoulder.y },
          { x: leftElbow.x, y: leftElbow.y },
          { x: leftWrist.x, y: leftWrist.y }
        );
        
        ctx.fillText(`Elbow: ${Math.round(elbowAngle)}°`, leftElbow.x + 10, leftElbow.y);
      }
    }
  };

  const countExercise = (pose: poseDetection.Pose) => {
    const keypoints = pose.keypoints;
    if (!keypoints || keypoints.length === 0) return;

    const keypointMap = keypoints.reduce((map, keypoint) => {
      map[keypoint.name || ''] = keypoint;
      return map;
    }, {} as Record<string, poseDetection.Keypoint>);

    if (exercise === 'squat') {
      countSquats(keypointMap);
    } else if (exercise === 'push-up') {
      countPushUps(keypointMap);
    }
  };

  const countSquats = (keypointMap: Record<string, poseDetection.Keypoint>) => {
    const leftHip = keypointMap['left_hip'];
    const leftKnee = keypointMap['left_knee'];
    const leftAnkle = keypointMap['left_ankle'];
    
    if (!leftHip || !leftKnee || !leftAnkle || 
        !leftHip.score || leftHip.score < 0.3 ||
        !leftKnee.score || leftKnee.score < 0.3 ||
        !leftAnkle.score || leftAnkle.score < 0.3) {
      return;
    }
    
    const kneeAngle = calculateAngle(
      { x: leftHip.x, y: leftHip.y },
      { x: leftKnee.x, y: leftKnee.y },
      { x: leftAnkle.x, y: leftAnkle.y }
    );
    
    // For squats: status changes based on knee angle
    if (kneeAngle < 110 && status !== 'down') {
      setStatus('down');
    } else if (kneeAngle > 160 && status === 'down') {
      setStatus('up');
      setExerciseCount(prev => prev + 1);
      toast.success("Rep counted!", { duration: 1000 });
    }
  };

  const countPushUps = (keypointMap: Record<string, poseDetection.Keypoint>) => {
    const leftShoulder = keypointMap['left_shoulder'];
    const leftElbow = keypointMap['left_elbow'];
    const leftWrist = keypointMap['left_wrist'];
    
    if (!leftShoulder || !leftElbow || !leftWrist || 
        !leftShoulder.score || leftShoulder.score < 0.3 ||
        !leftElbow.score || leftElbow.score < 0.3 ||
        !leftWrist.score || leftWrist.score < 0.3) {
      return;
    }
    
    const elbowAngle = calculateAngle(
      { x: leftShoulder.x, y: leftShoulder.y },
      { x: leftElbow.x, y: leftElbow.y },
      { x: leftWrist.x, y: leftWrist.y }
    );
    
    // For push-ups: status changes based on elbow angle
    if (elbowAngle < 90 && status !== 'down') {
      setStatus('down');
    } else if (elbowAngle > 160 && status === 'down') {
      setStatus('up');
      setExerciseCount(prev => prev + 1);
      toast.success("Rep counted!", { duration: 1000 });
    }
  };
  
  const handleExerciseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExercise(e.target.value);
    resetCounter();
  };
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Reset states when switching tabs
    if (tab === 'image-analysis') {
      stopCamera();
      setIsExercising(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 pb-12">
        <Header 
          title="AI Form Analysis" 
          subtitle="Get instant feedback on your exercise technique and count your reps" 
        />
        
        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange} 
          className="w-full mt-6"
        >
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="image-analysis" className="text-sm">
              <ImageIcon className="w-4 h-4 mr-2" />
              Image Analysis
            </TabsTrigger>
            <TabsTrigger value="rep-counter" className="text-sm">
              <Activity className="w-4 h-4 mr-2" />
              Rep Counter
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="image-analysis">
            <Card className="border border-fitness-primary/20">
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
          </TabsContent>
          
          <TabsContent value="rep-counter">
            <Card className="mt-2">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">Exercise Rep Counter</h2>
                    <select
                      value={exercise}
                      onChange={handleExerciseChange}
                      className="ml-2 p-2 border border-gray-300 rounded-md text-sm"
                      disabled={isExercising}
                    >
                      <option value="squat">Squat</option>
                      <option value="push-up">Push-Up</option>
                    </select>
                  </div>
                </div>
                
                <div className="relative bg-black rounded-lg overflow-hidden mb-6 aspect-video">
                  <video 
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                  />
                  <canvas 
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full"
                  />
                  
                  {isModelLoading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin w-12 h-12 border-4 border-fitness-primary/20 border-t-fitness-primary rounded-full mx-auto mb-4"></div>
                        <p className="text-white font-medium">Loading AI model...</p>
                      </div>
                    </div>
                  )}
                  
                  {!videoRef.current?.srcObject && !isModelLoading && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-white font-medium">Click "Start Camera" to begin</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-fitness-primary/10 rounded-lg p-4 text-center">
                    <h3 className="text-sm text-gray-500 mb-1">Repetitions</h3>
                    <p className="text-3xl font-bold text-fitness-primary">{exerciseCount}</p>
                  </div>
                  <div className="bg-fitness-primary/10 rounded-lg p-4 text-center">
                    <h3 className="text-sm text-gray-500 mb-1">Status</h3>
                    <p className="text-xl font-bold text-fitness-primary capitalize">{status}</p>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {videoRef.current?.srcObject ? (
                      <Button 
                        variant="outline" 
                        className="flex gap-2 items-center"
                        onClick={stopCamera}
                      >
                        <Video className="w-4 h-4" />
                        Stop Camera
                      </Button>
                    ) : (
                      <Button 
                        className="bg-fitness-primary text-white hover:bg-fitness-primary/90 flex gap-2 items-center"
                        onClick={startCamera}
                        disabled={isModelLoading}
                      >
                        <Camera className="w-4 h-4" />
                        Start Camera
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline"
                      className="flex gap-2 items-center"
                      onClick={resetCounter}
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset Counter
                    </Button>
                  </div>
                  
                  {isExercising ? (
                    <Button 
                      variant="outline" 
                      className="w-full border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 flex gap-2 items-center"
                      onClick={stopExercising}
                    >
                      <Pause className="w-4 h-4" />
                      Pause Exercise Tracking
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-green-500 hover:bg-green-600 flex gap-2 items-center"
                      onClick={startExercising}
                      disabled={!videoRef.current?.srcObject || isModelLoading}
                    >
                      <Play className="w-4 h-4" />
                      Start Exercise Tracking
                    </Button>
                  )}
                </div>
                
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-700">
                    <p className="font-medium mb-1">How to use:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Position yourself so your full body is visible</li>
                      <li>For squats, ensure your legs are clearly visible from the side</li>
                      <li>For push-ups, position camera to see your upper body from the side</li>
                      <li>Make sure you have good lighting for best detection results</li>
                    </ol>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default FormAnalysis;
