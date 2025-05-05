
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
