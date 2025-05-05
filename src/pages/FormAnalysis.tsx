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
  Activity,
  ChevronDown,
  Bug
} from 'lucide-react';
import { toast } from "sonner";
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs-core';
import { 
  calculateAngle, 
  calculateDistance, 
  isPointAbove,
  isWristInCurlPosition,
  isVerticallyAligned,
  isHorizontallyAligned,
  getRelativePosition,
  detectRepCompletion,
  logKeypointVisibility
} from '@/utils/pose-utils';

const FormAnalysis = () => {
  // Original form analysis state
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New exercise counter state
  const [activeTab, setActiveTab] = useState('rep-counter'); // Default to rep counter tab
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);
  const [isExercising, setIsExercising] = useState(false);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [exercise, setExercise] = useState('bicep-curl'); // Default exercise type
  const [status, setStatus] = useState('ready'); // 'ready', 'up', 'down'
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(true); // Show advanced options by default
  const [sensitivityThreshold, setSensitivityThreshold] = useState(15);
  const [repStartPositions, setRepStartPositions] = useState<Record<string, any>>({});
  const [debugMode, setDebugMode] = useState(true); // Enable debug mode by default
  const [modelLoaded, setModelLoaded] = useState(false);
  const [lastAngle, setLastAngle] = useState(0); // Track last measured angle
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestAnimationRef = useRef<number | null>(null);
  
  // Exercise type definitions
  const exerciseTypes = [
    { value: 'squat', label: 'Squats' },
    { value: 'push-up', label: 'Push Ups' },
    { value: 'bicep-curl', label: 'Bicep Curls' },
    { value: 'lateral-raise', label: 'Lateral Raises' },
    { value: 'shoulder-press', label: 'Shoulder Press' },
    { value: 'jumping-jack', label: 'Jumping Jacks' },
    { value: 'lunges', label: 'Lunges' }
  ];
  
  // Initialize pose detection model
  useEffect(() => {
    if (activeTab === 'rep-counter') {
      const loadModel = async () => {
        try {
          setIsModelLoading(true);
          console.log("Starting to load TensorFlow.js model...");
          
          // Force WebGL backend
          await tf.setBackend('webgl');
          await tf.ready();
          console.log("TensorFlow backend initialized:", tf.getBackend());
          
          // Load the MoveNet model
          const detectorConfig = {
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
            enableSmoothing: true
          };
          
          console.log("Creating pose detector with config:", detectorConfig);
          const detector = await poseDetection.createDetector(
            poseDetection.SupportedModels.MoveNet, 
            detectorConfig
          );
          
          console.log("Detector created successfully");
          setDetector(detector);
          setModelLoaded(true);
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
    if (videoRef.current) {
      const setupCanvas = () => {
        if (videoRef.current && canvasRef.current) {
          const videoWidth = videoRef.current.videoWidth || 640;
          const videoHeight = videoRef.current.videoHeight || 480;
          console.log(`Setting canvas dimensions to: ${videoWidth}x${videoHeight}`);
          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;
        }
      };
      
      videoRef.current.addEventListener('loadeddata', setupCanvas);
      
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadeddata', setupCanvas);
        }
      };
    }
  }, [videoRef.current]);

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
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      };
      
      console.log("Requesting camera access with constraints:", constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        console.log("Camera started, video dimensions:", 
          videoRef.current.videoWidth, "x", videoRef.current.videoHeight);
        
        // Ensure canvas is sized correctly after video starts
        if (canvasRef.current) {
          canvasRef.current.width = videoRef.current.videoWidth || 640;
          canvasRef.current.height = videoRef.current.videoHeight || 480;
        }
        
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
    setRepStartPositions({});
    console.log("Starting exercise tracking for:", exercise);
    detectPose();
  };

  const stopExercising = () => {
    setIsExercising(false);
    if (requestAnimationRef.current) {
      cancelAnimationFrame(requestAnimationRef.current);
      requestAnimationRef.current = null;
    }
    console.log("Exercise tracking stopped");
  };

  const resetCounter = () => {
    setExerciseCount(0);
    setStatus('ready');
    setRepStartPositions({});
    console.log("Counter reset");
  };

  const detectPose = async () => {
    if (!detector || !videoRef.current || !canvasRef.current) {
      console.log("Missing detector or video/canvas refs. Will retry.");
      requestAnimationRef.current = requestAnimationFrame(detectPose);
      return;
    }

    // Check if video is ready
    if (videoRef.current.readyState < 2) {
      console.log("Video not ready yet, readyState:", videoRef.current.readyState);
      requestAnimationRef.current = requestAnimationFrame(detectPose);
      return;
    }

    try {
      // Detect poses
      const poses = await detector.estimatePoses(videoRef.current);
      
      if (poses.length > 0) {
        const pose = poses[0];
        
        if (debugMode) {
          console.log("Detected pose with", pose.keypoints.length, "keypoints");
        }
        
        // Draw the pose
        drawPose(pose);
        
        // Count exercises based on pose
        countExercise(pose);
      } else {
        if (debugMode) {
          console.log("No poses detected");
        }
        
        // Clear canvas when no poses detected
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          
          // Draw a message when no pose is detected
          ctx.fillStyle = 'white';
          ctx.font = '24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('No pose detected - please ensure your full body is visible', 
            canvasRef.current.width / 2, canvasRef.current.height / 2);
        }
      }
      
      // Continue detection loop
      if (isExercising) {
        requestAnimationRef.current = requestAnimationFrame(detectPose);
      }
    } catch (error) {
      console.error("Error in pose detection:", error);
      requestAnimationRef.current = requestAnimationFrame(detectPose);
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
          ctx.arc(keypoint.x, keypoint.y, 8, 0, 2 * Math.PI); // Increased size for better visibility
          ctx.fillStyle = 'aqua';
          ctx.fill();
          ctx.strokeStyle = 'rgb(255, 255, 255)';
          ctx.lineWidth = 3;
          ctx.stroke();
          
          // Draw keypoint names for debugging
          if (debugMode) {
            ctx.fillStyle = 'yellow';
            ctx.font = '14px Arial';
            ctx.fillText(keypoint.name || '', keypoint.x + 10, keypoint.y);
            
            // Additionally show confidence score
            if (keypoint.score) {
              ctx.font = '12px Arial';
              ctx.fillStyle = 'lightgreen';
              ctx.fillText(`${(keypoint.score * 100).toFixed(0)}%`, keypoint.x + 10, keypoint.y + 20);
            }
          }
        } else if (debugMode && keypoint.score) {
          // Show low confidence points in red
          ctx.beginPath();
          ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = 'red';
          ctx.fill();
          ctx.fillStyle = 'red';
          ctx.font = '12px Arial';
          ctx.fillText(`${keypoint.name}: ${(keypoint.score * 100).toFixed(0)}%`, keypoint.x + 10, keypoint.y);
        }
      }

      // Connect keypoints to form a skeleton
      drawConnections(ctx, keypoints);
      
      // Draw angles for the specific exercise
      drawExerciseAngles(ctx, keypoints);
    }
  };

  const drawConnections = (ctx: CanvasRenderingContext2D, keypoints: poseDetection.Keypoint[]) => {
    // Define connections between keypoints to form a skeleton
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

    // Create a map of keypoints for easy lookup
    const keypointMap = keypoints.reduce((map, keypoint) => {
      map[keypoint.name || ''] = keypoint;
      return map;
    }, {} as Record<string, poseDetection.Keypoint>);

    // Draw connections
    ctx.lineWidth = 4; // Thicker lines for better visibility
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
    
    ctx.font = '18px Arial'; // Larger font for better visibility
    ctx.fillStyle = 'white';
    
    // Draw different angles based on exercise type
    switch (exercise) {
      case 'squat':
        // Draw knee angle for squats
        drawKneeAngle(ctx, keypointMap);
        break;
        
      case 'push-up':
        // Draw elbow angle for push-ups
        drawElbowAngle(ctx, keypointMap, 'left');
        drawElbowAngle(ctx, keypointMap, 'right');
        break;
        
      case 'bicep-curl':
        // Draw elbow angles for bicep curls
        drawElbowAngle(ctx, keypointMap, 'left');
        drawElbowAngle(ctx, keypointMap, 'right');
        break;
        
      case 'lateral-raise':
        // Draw shoulder angles for lateral raises
        drawShoulderAngle(ctx, keypointMap, 'left');
        drawShoulderAngle(ctx, keypointMap, 'right');
        break;
        
      case 'shoulder-press':
        // Draw shoulder and elbow angles for shoulder press
        drawShoulderAngle(ctx, keypointMap, 'left');
        drawShoulderAngle(ctx, keypointMap, 'right');
        drawElbowAngle(ctx, keypointMap, 'left');
        drawElbowAngle(ctx, keypointMap, 'right');
        break;
        
      case 'jumping-jack':
        // Draw hip and shoulder angles for jumping jacks
        drawHipAngle(ctx, keypointMap, 'left');
        drawShoulderAngle(ctx, keypointMap, 'left');
        drawShoulderAngle(ctx, keypointMap, 'right');
        break;
        
      case 'lunges':
        // Draw knee angles for lunges
        drawKneeAngle(ctx, keypointMap);
        break;
    }
  };
  
  const drawKneeAngle = (ctx: CanvasRenderingContext2D, keypointMap: Record<string, poseDetection.Keypoint>, side: 'left' | 'right' = 'left') => {
    const hipKey = `${side}_hip`;
    const kneeKey = `${side}_knee`;
    const ankleKey = `${side}_ankle`;
    
    const hip = keypointMap[hipKey];
    const knee = keypointMap[kneeKey];
    const ankle = keypointMap[ankleKey];
    
    if (hip && hip.score && hip.score > 0.3 &&
        knee && knee.score && knee.score > 0.3 &&
        ankle && ankle.score && ankle.score > 0.3) {
      
      const kneeAngle = calculateAngle(
        { x: hip.x, y: hip.y },
        { x: knee.x, y: knee.y },
        { x: ankle.x, y: ankle.y }
      );
      
      setLastAngle(kneeAngle); // Store angle for debugging
      
      // Draw angle text with background for better visibility
      const text = `${side.charAt(0).toUpperCase() + side.slice(1)} Knee: ${Math.round(kneeAngle)}°`;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      const textWidth = ctx.measureText(text).width;
      ctx.fillRect(knee.x + 10, knee.y - 25, textWidth + 10, 30);
      ctx.fillStyle = 'yellow';
      ctx.fillText(text, knee.x + 15, knee.y);
      
      // Draw angle arc to visualize the angle
      drawAngleArc(ctx, hip, knee, ankle);
    }
  };
  
  const drawElbowAngle = (ctx: CanvasRenderingContext2D, keypointMap: Record<string, poseDetection.Keypoint>, side: 'left' | 'right') => {
    const shoulderKey = `${side}_shoulder`;
    const elbowKey = `${side}_elbow`;
    const wristKey = `${side}_wrist`;
    
    const shoulder = keypointMap[shoulderKey];
    const elbow = keypointMap[elbowKey];
    const wrist = keypointMap[wristKey];
    
    if (shoulder && shoulder.score && shoulder.score > 0.3 &&
        elbow && elbow.score && elbow.score > 0.3 &&
        wrist && wrist.score && wrist.score > 0.3) {
      
      const elbowAngle = calculateAngle(
        { x: shoulder.x, y: shoulder.y },
        { x: elbow.x, y: elbow.y },
        { x: wrist.x, y: wrist.y }
      );
      
      setLastAngle(elbowAngle); // Store angle for debugging
      
      // Draw angle text with background for better visibility
      const text = `${side.charAt(0).toUpperCase() + side.slice(1)} Elbow: ${Math.round(elbowAngle)}°`;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      const textWidth = ctx.measureText(text).width;
      ctx.fillRect(elbow.x + 10, elbow.y - 25, textWidth + 10, 30);
      ctx.fillStyle = 'yellow';
      ctx.fillText(text, elbow.x + 15, elbow.y);
      
      // Draw angle arc to visualize the angle
      drawAngleArc(ctx, shoulder, elbow, wrist);
    }
  };
  
  const drawShoulderAngle = (ctx: CanvasRenderingContext2D, keypointMap: Record<string, poseDetection.Keypoint>, side: 'left' | 'right') => {
    const hipKey = `${side}_hip`;
    const shoulderKey = `${side}_shoulder`;
    const elbowKey = `${side}_elbow`;
    
    const hip = keypointMap[hipKey];
    const shoulder = keypointMap[shoulderKey];
    const elbow = keypointMap[elbowKey];
    
    if (hip && hip.score && hip.score > 0.3 &&
        shoulder && shoulder.score && shoulder.score > 0.3 &&
        elbow && elbow.score && elbow.score > 0.3) {
      
      const shoulderAngle = calculateAngle(
        { x: hip.x, y: hip.y },
        { x: shoulder.x, y: shoulder.y },
        { x: elbow.x, y: elbow.y }
      );
      
      setLastAngle(shoulderAngle); // Store angle for debugging
      
      // Draw angle text with background for better visibility
      const text = `${side.charAt(0).toUpperCase() + side.slice(1)} Shoulder: ${Math.round(shoulderAngle)}°`;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      const textWidth = ctx.measureText(text).width;
      ctx.fillRect(shoulder.x + 10, shoulder.y - 35, textWidth + 10, 30);
      ctx.fillStyle = 'yellow';
      ctx.fillText(text, shoulder.x + 15, shoulder.y - 10);
      
      // Draw angle arc to visualize the angle
      drawAngleArc(ctx, hip, shoulder, elbow);
    }
  };
  
  const drawHipAngle = (ctx: CanvasRenderingContext2D, keypointMap: Record<string, poseDetection.Keypoint>, side: 'left' | 'right') => {
    const kneeKey = `${side}_knee`;
    const hipKey = `${side}_hip`;
    const shoulderKey = `${side}_shoulder`;
    
    const knee = keypointMap[kneeKey];
    const hip = keypointMap[hipKey];
    const shoulder = keypointMap[shoulderKey];
    
    if (knee && knee.score && knee.score > 0.3 &&
        hip && hip.score && hip.score > 0.3 &&
        shoulder && shoulder.score && shoulder.score > 0.3) {
      
      const hipAngle = calculateAngle(
        { x: knee.x, y: knee.y },
        { x: hip.x, y: hip.y },
        { x: shoulder.x, y: shoulder.y }
      );
      
      setLastAngle(hipAngle); // Store angle for debugging
      
      // Draw angle text with background for better visibility
      const text = `${side.charAt(0).toUpperCase() + side.slice(1)} Hip: ${Math.round(hipAngle)}°`;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      const textWidth = ctx.measureText(text).width;
      ctx.fillRect(hip.x + 10, hip.y - 25, textWidth + 10, 30);
      ctx.fillStyle = 'yellow';
      ctx.fillText(text, hip.x + 15, hip.y);
      
      // Draw angle arc to visualize the angle
      drawAngleArc(ctx, knee, hip, shoulder);
    }
  };
  
  // New function to draw an arc representing the angle
  const drawAngleArc = (ctx: CanvasRenderingContext2D, pointA: poseDetection.Keypoint, pointB: poseDetection.Keypoint, pointC: poseDetection.Keypoint) => {
    // Calculate the angle between the three points
    const angle = calculateAngle(
      { x: pointA.x, y: pointA.y },
      { x: pointB.x, y: pointB.y },
      { x: pointC.x, y: pointC.y }
    );
    
    // Calculate the vectors
    const vectorBA = {
      x: pointA.x - pointB.x,
      y: pointA.y - pointB.y
    };
    
    const vectorBC = {
      x: pointC.x - pointB.x,
      y: pointC.y - pointB.y
    };
    
    // Calculate the angles for the arc
    const startAngle = Math.atan2(vectorBA.y, vectorBA.x);
    const endAngle = Math.atan2(vectorBC.y, vectorBC.x);
    
    // Draw the arc
    const radius = 30; // Size of the arc
    ctx.beginPath();
    ctx.arc(pointB.x, pointB.y, radius, startAngle, endAngle, false);
    ctx.strokeStyle = 'rgba(255, 255, 0, 0.7)';
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  const countExercise = (pose: poseDetection.Pose) => {
    const keypoints = pose.keypoints;
    if (!keypoints || keypoints.length === 0) return;

    const keypointMap = keypoints.reduce((map, keypoint) => {
      map[keypoint.name || ''] = keypoint;
      return map;
    }, {} as Record<string, poseDetection.Keypoint>);

    // Store starting positions if not set
    if (Object.keys(repStartPositions).length === 0) {
      setRepStartPositions({
        leftShoulder: keypointMap['left_shoulder'],
        rightShoulder: keypointMap['right_shoulder'],
        leftHip: keypointMap['left_hip'],
        rightHip: keypointMap['right_hip']
      });
      console.log("Set reference positions for exercise", exercise);
    }

    // Call appropriate counting method based on exercise type
    switch (exercise) {
      case 'squat':
        countSquats(keypointMap);
        break;
      case 'push-up':
        countPushUps(keypointMap);
        break;
      case 'bicep-curl':
        countBicepCurls(keypointMap);
        break;
      case 'lateral-raise':
        countLateralRaises(keypointMap);
        break;
      case 'shoulder-press':
        countShoulderPress(keypointMap);
        break;
      case 'jumping-jack':
        countJumpingJacks(keypointMap);
        break;
      case 'lunges':
        countLunges(keypointMap);
        break;
    }
  };

  // Exercise counting functions - refactored to be more robust
  const countSquats = (keypointMap: Record<string, poseDetection.Keypoint>) => {
    const leftHip = keypointMap['left_hip'];
    const leftKnee = keypointMap['left_knee'];
    const leftAnkle = keypointMap['left_ankle'];
    
    if (!leftHip || !leftKnee || !leftAnkle || 
        !leftHip.score || leftHip.score < 0.3 ||
        !leftKnee.score || leftKnee.score < 0.3 ||
        !leftAnkle.score || leftAnkle.score < 0.3) {
      if (debugMode) {
        console.log("Missing keypoints for squat detection");
      }
      return;
    }
    
    const kneeAngle = calculateAngle(
      { x: leftHip.x, y: leftHip.y },
      { x: leftKnee.x, y: leftKnee.y },
      { x: leftAnkle.x, y: leftAnkle.y }
    );
    
    if (debugMode) {
      console.log("Squat knee angle:", kneeAngle.toFixed(1), "Status:", status);
    }
    
    // For squats: status changes based on knee angle
    // Adjust thresholds based on sensitivity
    const downThreshold = 110 + sensitivityThreshold;
    const upThreshold = 160 - sensitivityThreshold;
    
    // Check if we're in the down position (knee bent)
    if (kneeAngle < downThreshold && status !== 'down') {
      setStatus('down');
      console.log("Squat DOWN detected, angle:", kneeAngle.toFixed(1));
    } 
    // Check if we're back to the up position from down (rep completed)
    else if (kneeAngle > upThreshold && status === 'down') {
      setStatus('up');
      setExerciseCount(prev => prev + 1);
      console.log("Squat UP detected, angle:", kneeAngle.toFixed(1), "REP COUNTED!");
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
      if (debugMode) {
        console.log("Missing keypoints for push-up detection");
        logKeypointVisibility(keypointMap);
      }
      return;
    }
    
    const elbowAngle = calculateAngle(
      { x: leftShoulder.x, y: leftShoulder.y },
      { x: leftElbow.x, y: leftElbow.y },
      { x: leftWrist.x, y: leftWrist.y }
    );
    
    if (debugMode) {
      console.log("Push-up elbow angle:", elbowAngle.toFixed(1), "Status:", status);
    }
    
    // For push-ups: status changes based on elbow angle
    // Adjust thresholds based on sensitivity
    const downThreshold = 90 + sensitivityThreshold;
    const upThreshold = 160 - sensitivityThreshold;
    
    if (elbowAngle < downThreshold && status !== 'down') {
      setStatus('down');
      console.log("Push-up DOWN detected, angle:", elbowAngle.toFixed(1));
    } else if (elbowAngle > upThreshold && status === 'down') {
      setStatus('up');
      setExerciseCount(prev => prev + 1);
      console.log("Push-up UP detected, angle:", elbowAngle.toFixed(1), "REP COUNTED!");
      toast.success("Rep counted!", { duration: 1000 });
    }
  };
  
  const countBicepCurls = (keypointMap: Record<string, poseDetection.Keypoint>) => {
    // Check both arms for bicep curl
    const sides: ('left' | 'right')[] = ['left', 'right'];
    
    for (const side of sides) {
      const shoulder = keypointMap[`${side}_shoulder`];
      const elbow = keypointMap[`${side}_elbow`];
      const wrist = keypointMap[`${side}_wrist`];
      
      if (!shoulder || !elbow || !wrist || 
          !shoulder.score || shoulder.score < 0.3 ||
          !elbow.score || elbow.score < 0.3 ||
          !wrist.score || wrist.score < 0.3) {
        continue;
      }
      
      const elbowAngle = calculateAngle(
        { x: shoulder.x, y: shoulder.y },
        { x: elbow.x, y: elbow.y },
        { x: wrist.x, y: wrist.y }
      );
      
      if (debugMode) {
        console.log(`${side} bicep curl elbow angle:`, elbowAngle.toFixed(1), "Status:", status);
      }
      
      // Check if arm is in curl position (wrist close to shoulder)
      const downThreshold = 120 + sensitivityThreshold; // Arm extended
      const upThreshold = 70 - sensitivityThreshold; // Arm curled
      
      if (elbowAngle < upThreshold && status !== 'down') {
        setStatus('down');
        console.log(`${side} bicep curl DOWN detected, angle:`, elbowAngle.toFixed(1));
      } else if (elbowAngle > downThreshold && status === 'down') {
        setStatus('up');
        setExerciseCount(prev => prev + 1);
        console.log(`${side} bicep curl UP detected, angle:`, elbowAngle.toFixed(1), "REP COUNTED!");
        toast.success("Rep counted!", { duration: 1000 });
      }
      
      // Only need one arm to count
      if (status === 'down' || status === 'up') {
        break;
      }
    }
  };
  
  const countLateralRaises = (keypointMap: Record<string, poseDetection.Keypoint>) => {
    const sides: ('left' | 'right')[] = ['left', 'right'];
    
    for (const side of sides) {
      const hip = keypointMap[`${side}_hip`];
      const shoulder = keypointMap[`${side}_shoulder`];
      const elbow = keypointMap[`${side}_elbow`];
      const wrist = keypointMap[`${side}_wrist`];
      
      if (!hip || !shoulder || !elbow || !wrist || 
          !hip.score || hip.score < 0.3 ||
          !shoulder.score || shoulder.score < 0.3 ||
          !elbow.score || elbow.score < 0.3 ||
          !wrist.score || wrist.score < 0.3) {
        continue;
      }
      
      // Calculate shoulder angle
      const shoulderAngle = calculateAngle(
        { x: hip.x, y: hip.y },
        { x: shoulder.x, y: shoulder.y },
        { x: elbow.x, y: elbow.y }
      );
      
      if (debugMode) {
        console.log(`${side} lateral raise shoulder angle:`, shoulderAngle.toFixed(1), "Status:", status);
      }
      
      // For lateral raises: check if arms are raised to shoulder height (90 degrees from torso)
      const upThreshold = 80 - sensitivityThreshold; // Arms raised
      const downThreshold = 30 + sensitivityThreshold; // Arms lowered
      
      // Use reversed logic for lateral raises since "down" means arms are lowered
      if (shoulderAngle > upThreshold && status !== 'up') {
        setStatus('up');
        console.log(`${side} lateral raise UP detected, angle:`, shoulderAngle.toFixed(1));
      } else if (shoulderAngle < downThreshold && status === 'up') {
        setStatus('down');
        setExerciseCount(prev => prev + 1);
        console.log(`${side} lateral raise DOWN detected, angle:`, shoulderAngle.toFixed(1), "REP COUNTED!");
        toast.success("Rep counted!", { duration: 1000 });
      }
      
      // Only need one arm to count
      if (status === 'up' || status === 'down') {
        break;
      }
    }
  };
  
  const countShoulderPress = (keypointMap: Record<string, poseDetection.Keypoint>) => {
    const sides: ('left' | 'right')[] = ['left', 'right'];
    
    for (const side of sides) {
      const shoulder = keypointMap[`${side}_shoulder`];
      const elbow = keypointMap[`${side}_elbow`];
      const wrist = keypointMap[`${side}_wrist`];
      
      if (!shoulder || !elbow || !wrist || 
          !shoulder.score || shoulder.score < 0.3 ||
          !elbow.score || elbow.score < 0.3 ||
          !wrist.score || wrist.score < 0.3) {
        continue;
      }
      
      // For shoulder press, check if wrist is above elbow and elbow is above shoulder
      const isWristAboveElbow = wrist.y < elbow.y;
      const isElbowAboveShoulder = elbow.y < shoulder.y;
      const isWristExtended = isWristAboveElbow && Math.abs(wrist.y - elbow.y) > 50;
      
      if (debugMode) {
        console.log(`${side} shoulder press position:`, 
          `wrist above elbow: ${isWristAboveElbow}`, 
          `elbow above shoulder: ${isElbowAboveShoulder}`,
          `wrist extended: ${isWristExtended}`,
          "Status:", status);
      }
      
      // Check for "up" position (arms extended overhead)
      if (isWristAboveElbow && isElbowAboveShoulder && isWristExtended && status !== 'up') {
        setStatus('up');
        console.log(`${side} shoulder press UP detected`);
      } 
      // Check for "down" position (arms at shoulder level)
      else if ((!isWristAboveElbow || !isElbowAboveShoulder || !isWristExtended) && status === 'up') {
        setStatus('down');
        setExerciseCount(prev => prev + 1);
        console.log(`${side} shoulder press DOWN detected, REP COUNTED!`);
        toast.success("Rep counted!", { duration: 1000 });
      }
      
      // Only need one arm to count
      if (status === 'up' || status === 'down') {
        break;
      }
    }
  };
  
  const countJumpingJacks = (keypointMap: Record<string, poseDetection.Keypoint>) => {
    const leftShoulder = keypointMap['left_shoulder'];
    const rightShoulder = keypointMap['right_shoulder'];
    const leftHip = keypointMap['left_hip'];
    const rightHip = keypointMap['right_hip'];
    const leftAnkle = keypointMap['left_ankle'];
    const rightAnkle = keypointMap['right_ankle'];
    
    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip || !leftAnkle || !rightAnkle ||
        !leftShoulder.score || leftShoulder.score < 0.3 ||
        !rightShoulder.score || rightShoulder.score < 0.3 ||
        !leftHip.score || leftHip.score < 0.3 ||
        !rightHip.score || rightHip.score < 0.3 ||
        !leftAnkle.score || leftAnkle.score < 0.3 ||
        !rightAnkle.score || rightAnkle.score < 0.3) {
      if (debugMode) {
        console.log("Missing keypoints for jumping jack detection");
      }
      return;
    }
    
    // Check distance between ankles and between shoulders
    const ankleDistance = calculateDistance(
      { x: leftAnkle.x, y: leftAnkle.y },
      { x: rightAnkle.x, y: rightAnkle.y }
    );
    
    const shoulderDistance = calculateDistance(
      { x: leftShoulder.x, y: leftShoulder.y },
      { x: rightShoulder.x, y: rightShoulder.y }
    );
    
    // Get hip distance for reference
    const hipDistance = calculateDistance(
      { x: leftHip.x, y: leftHip.y },
      { x: rightHip.x, y: rightHip.y }
    );
    
    // Calculate ratios relative to hip width
    const ankleRatio = ankleDistance / hipDistance;
    const shoulderRatio = shoulderDistance / hipDistance;
    
    if (debugMode) {
      console.log("Jumping jack metrics:", 
        "ankle ratio:", ankleRatio.toFixed(2), 
        "shoulder ratio:", shoulderRatio.toFixed(2),
        "Status:", status);
    }
    
    // Define thresholds adjusted by sensitivity
    const extendedThreshold = 1.5 - sensitivityThreshold * 0.02;
    const closedThreshold = 0.8 + sensitivityThreshold * 0.02;
    
    // Check for "up" position (arms and legs extended)
    if (ankleRatio > extendedThreshold && shoulderRatio > extendedThreshold && status !== 'up') {
      setStatus('up');
      console.log("Jumping jack UP detected");
    }
    // Check for "down" position (arms and legs together)
    else if (ankleRatio < closedThreshold && shoulderRatio < closedThreshold && status === 'up') {
      setStatus('down');
      setExerciseCount(prev => prev + 1);
      console.log("Jumping jack DOWN detected, REP COUNTED!");
      toast.success("Rep counted!", { duration: 1000 });
    }
  };
  
  const countLunges = (keypointMap: Record<string, poseDetection.Keypoint>) => {
    const leftKnee = keypointMap['left_knee'];
    const leftHip = keypointMap['left_hip'];
    const leftAnkle = keypointMap['left_ankle'];
    const rightKnee = keypointMap['right_knee'];
    const rightHip = keypointMap['right_hip'];
    const rightAnkle = keypointMap['right_ankle'];
    
    if (!leftKnee || !leftHip || !leftAnkle || !rightKnee || !rightHip || !rightAnkle ||
        !leftKnee.score || leftKnee.score < 0.3 ||
        !leftHip.score || leftHip.score < 0.3 ||
        !leftAnkle.score || leftAnkle.score < 0.3 ||
        !rightKnee.score || rightKnee.score < 0.3 ||
        !rightHip.score || rightHip.score < 0.3 ||
        !rightAnkle.score || rightAnkle.score < 0.3) {
      if (debugMode) {
        console.log("Missing keypoints for lunge detection");
      }
      return;
    }
    
    // Calculate knee angles
    const leftKneeAngle = calculateAngle(
      { x: leftHip.x, y: leftHip.y },
      { x: leftKnee.x, y: leftKnee.y },
      { x: leftAnkle.x, y: leftAnkle.y }
    );
    
    const rightKneeAngle = calculateAngle(
      { x: rightHip.x, y: rightHip.y },
      { x: rightKnee.x, y: rightKnee.y },
      { x: rightAnkle.x, y: rightAnkle.y }
    );
    
    // For lunges, we need one knee bent and one relatively straight
    const isBentKneeAngle = Math.min(leftKneeAngle, rightKneeAngle);
    const isStraightKneeAngle = Math.max(leftKneeAngle, rightKneeAngle);
    
    if (debugMode) {
      console.log("Lunge knee angles:", 
        "bent knee:", isBentKneeAngle.toFixed(1),
        "straight knee:", isStraightKneeAngle.toFixed(1),
        "Status:", status);
    }
    
    // Define thresholds for lunge positions adjusted by sensitivity
    const bentKneeThreshold = 100 + sensitivityThreshold;
    const straightKneeThreshold = 150 - sensitivityThreshold;
    
    // Check for "down" position (one knee bent, one straight)
    if (isBentKneeAngle < bentKneeThreshold && 
        isStraightKneeAngle > straightKneeThreshold && 
        status !== 'down') {
      setStatus('down');
      console.log("Lunge DOWN detected");
    }
    // Check for "up" position (both knees relatively straight)
    else if (isBentKneeAngle > straightKneeThreshold && status === 'down') {
      setStatus('up');
      setExerciseCount(prev => prev + 1);
      console.log("Lunge UP detected, REP COUNTED!");
      toast.success("Rep counted!", { duration: 1000 });
    }
  };
  
  const handleExerciseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExercise(e.target.value);
    resetCounter();
  };
  
  const handleSensitivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSensitivityThreshold(parseInt(e.target.value));
  };
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Reset states when switching tabs
    if (tab === 'image-analysis') {
      stopCamera();
      setIsExercising(false);
    }
  };

  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
    toast.info(debugMode ? "Debug mode disabled" : "Debug mode enabled");
  };

  // Render functions
  const renderExerciseControls = () => {
    return (
      <div className="flex flex-col space-y-4">
        {!isExercising ? (
          <div className="flex gap-2">
            <Button 
              onClick={startExercising} 
              className="flex-1 bg-fitness-primary hover:bg-fitness-primary/90"
              disabled={isModelLoading || !videoRef.current?.srcObject}
            >
              <Play className="w-5 h-5 mr-2" />
              Start Exercise
            </Button>
            <Button 
              onClick={startCamera} 
              variant="outline" 
              className="flex-1"
              disabled={isModelLoading || Boolean(videoRef.current?.srcObject)}
            >
              <Video className="w-5 h-5 mr-2" />
              Start Camera
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button 
              onClick={stopExercising} 
              variant="destructive" 
              className="flex-1"
            >
              <Pause className="w-5 h-5 mr-2" />
              Stop Exercise
            </Button>
            <Button 
              onClick={resetCounter} 
              variant="outline" 
              className="flex-1"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset Counter
            </Button>
          </div>
        )}
      </div>
    );
  };
  
  const renderExerciseGuide = () => {
    const exerciseGuides = {
      'squat': 'Stand with feet shoulder-width apart, lower your body by bending your knees as if sitting in a chair, then return to standing position.',
      'push-up': 'Position hands under shoulders in plank position, lower your body until chest nearly touches the floor, then push back up.',
      'bicep-curl': 'Hold weights with arms extended, bend elbows to bring weights toward shoulders, then lower back down.',
      'lateral-raise': 'Hold weights at sides, lift arms straight out to sides until parallel with floor, then lower.',
      'shoulder-press': 'Hold weights at shoulder height, push upward until arms are extended overhead, then lower back to shoulders.',
      'jumping-jack': 'Stand with feet together and arms at sides, jump while spreading legs and raising arms overhead, return to starting position.',
      'lunges': 'Stand straight, step forward with one leg, lower until both knees are bent at 90 degrees, return to standing position.'
    };

    const currentGuide = exerciseGuides[exercise as keyof typeof exerciseGuides] || '';
    
    return (
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-fitness-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-sm mb-1">Exercise Guide: {exerciseTypes.find(type => type.value === exercise)?.label}</h3>
            <p className="text-sm text-gray-600">
              {currentGuide}
            </p>
            <p className="text-xs text-gray-500 mt-3">
              Make sure your entire body is visible to the camera for accurate tracking. 
              Debug mode shows real-time angles and joint positions.
            </p>
          </div>
        </div>
      </div>
    );
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
            <Card className="mt-2">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Upload Exercise Image</h2>
                
                {!previewUrl ? (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors duration-300"
                    onClick={handleCameraClick}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileUpload} 
                    />
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-800 mb-1">
                      Upload an exercise photo
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Click or drag and drop an image here
                    </p>
                    <Button 
                      type="button" 
                      className="bg-fitness-primary hover:bg-fitness-primary/90"
                      onClick={handleCameraClick}
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Select Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <img 
                        src={previewUrl} 
                        alt="Your workout" 
                        className="w-full max-h-[400px] object-contain" 
                      />
                      {analyzing && (
                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-fitness-primary mb-4"></div>
                          <p className="text-white font-medium">Analyzing your form...</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        type="button" 
                        onClick={handleReset}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Try another image
                      </Button>
                    </div>
                  
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-4 flex gap-3 items-start">
                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-red-800 text-sm">Analysis Error</h4>
                          <p className="text-sm text-red-600 mt-1">{error}</p>
                        </div>
                      </div>
                    )}
                    
                    {feedback && (
                      <div className="bg-white border rounded-md p-5 space-y-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">Form Analysis Results</h3>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleCopyFeedback}
                          >
                            {copied ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            ) : (
                              <Copy className="w-4 h-4 mr-2" />
                            )}
                            {copied ? 'Copied' : 'Copy'}
                          </Button>
                        </div>
                        
                        <div className="prose prose-sm max-w-none text-gray-600">
                          {feedback.split('\n\n').map((section, idx) => {
                            const parts = section.split(':\n');
                            if (parts.length === 2) {
                              return renderFeedbackSection(parts[0], parts[1]);
                            }
                            return <p key={idx} className="text-gray-700 leading-relaxed">{section}</p>;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="rep-counter">
            <Card className="mt-2">
              <div className="p-6">
                <div className="flex flex-col space-y-4 mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h2 className="text-xl font-semibold">Exercise Rep Counter</h2>
                      <select
                        value={exercise}
                        onChange={handleExerciseChange}
                        className="p-2 border border-gray-300 rounded-md text-sm"
                        disabled={isExercising}
                      >
                        {exerciseTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center justify-center gap-1"
                      onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    >
                      Advanced Options
                      <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`} />
                    </Button>
                  </div>
                  
                  {showAdvancedOptions && (
                    <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                          <span>Detection Sensitivity: {sensitivityThreshold}</span>
                          <span className="text-xs text-gray-500">
                            {sensitivityThreshold < 10 ? 'High' : sensitivityThreshold > 20 ? 'Low' : 'Medium'}
                          </span>
                        </label>
                        <input
                          type="range"
                          min="5"
                          max="25"
                          step="1"
                          value={sensitivityThreshold}
                          onChange={handleSensitivityChange}
                          className="w-full mt-1"
                          disabled={isExercising}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Adjust if exercises aren't being counted correctly. 
                          Higher values (to the right) are more lenient.
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Debug Mode:</span>
                        <Button 
                          variant={debugMode ? "default" : "outline"} 
                          size="sm" 
                          onClick={toggleDebugMode}
                        >
                          {debugMode ? 'Enabled' : 'Disabled'}
                        </Button>
                      </div>
                    </div>
                  )}
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
                
                {renderExerciseControls()}
                {renderExerciseGuide()}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default FormAnalysis;
