
import { useState, useRef, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, Play, Pause, RotateCcw, Video, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

const ExerciseCounter = () => {
  const { user } = useAuth();
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isExercising, setIsExercising] = useState(false);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [exercise, setExercise] = useState('pull-up');
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);
  const [status, setStatus] = useState('ready'); // 'ready', 'up', 'down'
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestAnimationRef = useRef<number | null>(null);

  // Initialize the pose detector
  useEffect(() => {
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

    return () => {
      if (requestAnimationRef.current) {
        cancelAnimationFrame(requestAnimationRef.current);
      }
    };
  }, []);

  // Setup webcam
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
    
    // Draw keypoints
    const keypoints = pose.keypoints;
    
    // Draw connections for better visualization
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

  const countExercise = (pose: poseDetection.Pose) => {
    const keypoints = pose.keypoints;
    if (!keypoints || keypoints.length === 0) return;

    // Get relevant keypoints for pull-up detection
    const leftWrist = keypoints.find(kp => kp.name === 'left_wrist');
    const rightWrist = keypoints.find(kp => kp.name === 'right_wrist');
    const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
    const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
    const leftHip = keypoints.find(kp => kp.name === 'left_hip');
    const rightHip = keypoints.find(kp => kp.name === 'right_hip');

    if (!leftWrist || !rightWrist || !leftShoulder || !rightShoulder || !leftHip || !rightHip ||
        !leftWrist.y || !rightWrist.y || !leftShoulder.y || !rightShoulder.y || !leftHip.y || !rightHip.y) {
      return;
    }

    // For pull-ups, check the relative position of wrists to shoulders
    // In a pull-up, wrists are above shoulders in the 'up' position
    const wristsY = (leftWrist.y + rightWrist.y) / 2;
    const shouldersY = (leftShoulder.y + rightShoulder.y) / 2;
    const hipsY = (leftHip.y + rightHip.y) / 2;

    if (exercise === 'pull-up') {
      // Check if arms are extended (wrists above shoulders)
      if (wristsY < shouldersY - 50 && status !== 'up') {
        setStatus('up');
      } 
      // Check if arms are lowered (wrists below shoulders)
      else if (wristsY > shouldersY + 20 && status === 'up') {
        setStatus('down');
        setExerciseCount(prev => prev + 1);
        toast.success("Rep counted!", { duration: 1000 });
      }
    }
  };

  useEffect(() => {
    if (videoRef.current && canvasRef.current) {
      canvasRef.current.width = videoRef.current.videoWidth || 640;
      canvasRef.current.height = videoRef.current.videoHeight || 480;
    }
  }, [videoRef.current?.videoWidth, videoRef.current?.videoHeight]);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 pb-12">
        <Header 
          title="AI Exercise Counter" 
          subtitle="Real-time exercise tracking and counting with AI"
        />
        
        <Card className="mt-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Exercise: {exercise.replace('-', ' ').toUpperCase()}</h2>
            
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
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-700">
                <p className="font-medium mb-1">How to use:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Position yourself so your full body is visible</li>
                  <li>For pull-ups, ensure your arms go fully extended and contracted</li>
                  <li>The AI will automatically count your reps when properly performed</li>
                  <li>Make sure you have good lighting for best detection results</li>
                </ol>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default ExerciseCounter;

