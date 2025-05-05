
// Types for 2D points
interface Point2D {
  x: number;
  y: number;
}

/**
 * Calculate the angle between three points in degrees
 * @param pointA - First point (usually a joint like hip)
 * @param pointB - Middle point (usually the joint we want the angle for, like knee)
 * @param pointC - Third point (usually another joint like ankle)
 * @returns Angle in degrees between the three points
 */
export const calculateAngle = (pointA: Point2D, pointB: Point2D, pointC: Point2D): number => {
  // Calculate vectors from point B to A and C
  const vectorBA = {
    x: pointA.x - pointB.x,
    y: pointA.y - pointB.y
  };
  
  const vectorBC = {
    x: pointC.x - pointB.x,
    y: pointC.y - pointB.y
  };
  
  // Calculate dot product
  const dotProduct = vectorBA.x * vectorBC.x + vectorBA.y * vectorBC.y;
  
  // Calculate magnitudes
  const magnitudeBA = Math.sqrt(vectorBA.x * vectorBA.x + vectorBA.y * vectorBA.y);
  const magnitudeBC = Math.sqrt(vectorBC.x * vectorBC.x + vectorBC.y * vectorBC.y);
  
  // Calculate cosine of the angle
  const cosTheta = dotProduct / (magnitudeBA * magnitudeBC);
  
  // Convert to degrees (ensure value is within valid range for arccos)
  const theta = Math.acos(Math.max(-1, Math.min(1, cosTheta))) * (180 / Math.PI);
  
  return theta;
};

/**
 * Calculate the distance between two points
 * @param pointA - First point
 * @param pointB - Second point
 * @returns Distance between the two points
 */
export const calculateDistance = (pointA: Point2D, pointB: Point2D): number => {
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Check if a point is above another point in screen coordinates (y decreases upward)
 * @param pointA - First point
 * @param pointB - Second point
 * @returns True if pointA is above pointB
 */
export const isPointAbove = (pointA: Point2D, pointB: Point2D): boolean => {
  return pointA.y < pointB.y;
};

/**
 * Check vertical alignment between points (useful for exercises like lateral raises)
 * @param pointA - First point
 * @param pointB - Second point
 * @param threshold - Maximum allowed horizontal difference
 * @returns True if points are vertically aligned within threshold
 */
export const isVerticallyAligned = (pointA: Point2D, pointB: Point2D, threshold: number = 15): boolean => {
  return Math.abs(pointA.x - pointB.x) < threshold;
};

/**
 * Check horizontal alignment between points (useful for exercises like front raises)
 * @param pointA - First point
 * @param pointB - Second point
 * @param threshold - Maximum allowed vertical difference
 * @returns True if points are horizontally aligned within threshold
 */
export const isHorizontallyAligned = (pointA: Point2D, pointB: Point2D, threshold: number = 15): boolean => {
  return Math.abs(pointA.y - pointB.y) < threshold;
};

/**
 * Get the relative position of pointA to pointB
 * @param pointA - First point
 * @param pointB - Second point
 * @returns Object with above, below, left, right boolean values
 */
export const getRelativePosition = (pointA: Point2D, pointB: Point2D): { 
  above: boolean; 
  below: boolean; 
  left: boolean; 
  right: boolean; 
} => {
  return {
    above: pointA.y < pointB.y,
    below: pointA.y > pointB.y,
    left: pointA.x < pointB.x,
    right: pointA.x > pointB.x
  };
};

/**
 * Check if wrist is in curl position based on elbow and shoulder positions
 * @param wrist - Wrist point
 * @param elbow - Elbow point
 * @param shoulder - Shoulder point
 * @returns Boolean indicating if wrist is in curl position
 */
export const isWristInCurlPosition = (wrist: Point2D, elbow: Point2D, shoulder: Point2D): boolean => {
  // For bicep curl, wrist should be above elbow when curled
  const isWristAboveElbow = wrist.y < elbow.y;
  
  // Also check if wrist is closer to shoulder than elbow is
  const wristToShoulderDist = calculateDistance(wrist, shoulder);
  const elbowToShoulderDist = calculateDistance(elbow, shoulder);
  
  return isWristAboveElbow && (wristToShoulderDist < elbowToShoulderDist);
};

/**
 * Calculate the vertical displacement percentage (for tracking movements like jumping jacks)
 * @param current - Current position of a point
 * @param baseline - Baseline position (usually the starting position)
 * @returns Percentage of vertical displacement (0-100)
 */
export const calculateVerticalDisplacementPercentage = (
  current: Point2D, 
  baseline: Point2D, 
  maxDisplacement: number
): number => {
  const displacement = Math.abs(current.y - baseline.y);
  return Math.min(100, (displacement / maxDisplacement) * 100);
};

/**
 * Check if a set of keypoints has acceptable confidence scores for exercise detection
 * @param keypointMap - Map of keypoints
 * @param requiredKeypoints - Array of required keypoint names
 * @param minConfidence - Minimum confidence threshold
 * @returns Whether keypoints are valid for exercise detection
 */
export const hasValidKeypoints = (
  keypointMap: Record<string, any>,
  requiredKeypoints: string[],
  minConfidence: number = 0.3
): boolean => {
  for (const keypointName of requiredKeypoints) {
    const keypoint = keypointMap[keypointName];
    if (!keypoint || !keypoint.score || keypoint.score < minConfidence) {
      return false;
    }
  }
  return true;
};

/**
 * Debug helper: Log visibility scores of keypoints
 * @param keypointMap - Map of keypoints with their scores
 */
export const logKeypointVisibility = (keypointMap: Record<string, any>): void => {
  console.log("Keypoint visibility:");
  Object.keys(keypointMap).forEach(key => {
    if (keypointMap[key] && keypointMap[key].score) {
      console.log(`${key}: ${keypointMap[key].score.toFixed(2)}`);
    }
  });
};

/**
 * Detect if an exercise rep has been completed based on angle changes
 * @param currentAngle - Current angle
 * @param status - Current status (up/down/ready)
 * @param downThreshold - Threshold to consider "down" position
 * @param upThreshold - Threshold to consider "up" position
 * @returns Object with updated status and whether rep was completed
 */
export const detectRepCompletion = (
  currentAngle: number, 
  status: string, 
  downThreshold: number, 
  upThreshold: number
): { newStatus: string, repCompleted: boolean } => {
  let newStatus = status;
  let repCompleted = false;
  
  if (currentAngle < downThreshold && status !== 'down') {
    newStatus = 'down';
    console.log("Status changed to DOWN, angle:", currentAngle.toFixed(1));
  } else if (currentAngle > upThreshold && status === 'down') {
    newStatus = 'up';
    repCompleted = true;
    console.log("REP COMPLETED! Status changed to UP, angle:", currentAngle.toFixed(1));
  }
  
  return { newStatus, repCompleted };
};

/**
 * Check if the detected pose is valid for exercise tracking
 * @param pose - The detected pose
 * @param exerciseType - Type of exercise being performed
 * @returns Whether the pose is valid for the given exercise
 */
export const isPoseValidForExercise = (pose: any, exerciseType: string): boolean => {
  if (!pose || !pose.keypoints || pose.keypoints.length === 0) {
    return false;
  }
  
  // Create keypoint map for easy access
  const keypointMap = pose.keypoints.reduce((map: Record<string, any>, keypoint: any) => {
    map[keypoint.name || ''] = keypoint;
    return map;
  }, {});
  
  // Check for required keypoints based on exercise type
  const requiredKeypoints = getRequiredKeypointsForExercise(exerciseType);
  return hasValidKeypoints(keypointMap, requiredKeypoints, 0.2);
};

/**
 * Get required keypoints for a specific exercise type
 * @param exerciseType - Type of exercise
 * @returns Array of required keypoint names
 */
export const getRequiredKeypointsForExercise = (exerciseType: string): string[] => {
  // Basic set of keypoints for most exercises
  const basicKeypoints = ['left_shoulder', 'right_shoulder', 'left_hip', 'right_hip'];
  
  switch (exerciseType) {
    case 'squat':
      return [...basicKeypoints, 'left_knee', 'left_ankle', 'right_knee', 'right_ankle'];
    
    case 'push-up':
      return [...basicKeypoints, 'left_elbow', 'left_wrist', 'right_elbow', 'right_wrist'];
    
    case 'bicep-curl':
      return [...basicKeypoints, 'left_elbow', 'left_wrist', 'right_elbow', 'right_wrist'];
    
    case 'lateral-raise':
      return [...basicKeypoints, 'left_elbow', 'left_wrist', 'right_elbow', 'right_wrist'];
    
    case 'shoulder-press':
      return [...basicKeypoints, 'left_elbow', 'left_wrist', 'right_elbow', 'right_wrist'];
    
    case 'jumping-jack':
      return [...basicKeypoints, 'left_ankle', 'right_ankle'];
    
    case 'lunges':
      return [...basicKeypoints, 'left_knee', 'left_ankle', 'right_knee', 'right_ankle'];
    
    default:
      return basicKeypoints;
  }
};

/**
 * Get a clear user-friendly message to explain why pose detection might not be working
 * @param pose - Detected pose
 * @param exerciseType - Type of exercise
 * @returns Message explaining detection issues
 */
export const getPoseDetectionFeedback = (pose: any, exerciseType: string): string => {
  if (!pose || !pose.keypoints || pose.keypoints.length === 0) {
    return "No pose detected - please ensure you are visible in the camera frame.";
  }

  // Calculate average confidence
  let totalConfidence = 0;
  let visiblePoints = 0;
  const keypointMap: Record<string, any> = {};
  
  pose.keypoints.forEach((keypoint: any) => {
    if (keypoint.score && keypoint.name) {
      keypointMap[keypoint.name] = keypoint;
      totalConfidence += keypoint.score;
      visiblePoints++;
    }
  });

  const avgConfidence = visiblePoints > 0 ? totalConfidence / visiblePoints : 0;
  
  // Provide appropriate feedback based on pose quality
  if (avgConfidence < 0.2) {
    return "Low detection confidence - please ensure good lighting and that your full body is visible.";
  }
  
  const requiredKeypoints = getRequiredKeypointsForExercise(exerciseType);
  const missingKeypoints: string[] = [];
  
  for (const keypointName of requiredKeypoints) {
    const keypoint = keypointMap[keypointName];
    if (!keypoint || !keypoint.score || keypoint.score < 0.2) {
      missingKeypoints.push(keypointName.replace('_', ' '));
    }
  }
  
  if (missingKeypoints.length > 0) {
    return `Cannot detect your ${missingKeypoints.join(', ')}. Please ensure your entire body is visible.`;
  }
  
  return "";
}
