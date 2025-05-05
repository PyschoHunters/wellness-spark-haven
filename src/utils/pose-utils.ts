
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
