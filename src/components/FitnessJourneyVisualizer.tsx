
import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import { MathUtils } from 'three';

interface Achievement {
  title: string;
  date: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'milestone';
}

interface FitnessJourneyVisualizerProps {
  achievements: Achievement[];
}

const AchievementNode: React.FC<{ achievement: Achievement; position: [number, number, number] }> = ({ achievement, position }) => {
  const color = {
    strength: '#ef4444',
    cardio: '#3b82f6',
    flexibility: '#10b981',
    milestone: '#f59e0b'
  }[achievement.type];

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position}>
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
        </mesh>
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.2}
          color="white"
          anchorY="bottom"
          maxWidth={2}
          textAlign="center"
        >
          {achievement.title}
        </Text>
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.15}
          color="white"
          anchorY="top"
          maxWidth={2}
          textAlign="center"
        >
          {achievement.date}
        </Text>
      </group>
    </Float>
  );
};

const FitnessJourneyVisualizer: React.FC<FitnessJourneyVisualizerProps> = ({ achievements }) => {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <div className="w-full h-[400px] bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <group ref={groupRef}>
          {achievements.map((achievement, i) => {
            const angle = (i / achievements.length) * Math.PI * 2;
            const radius = 4;
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            const y = MathUtils.randFloat(-1, 1);
            
            return (
              <AchievementNode
                key={achievement.title}
                achievement={achievement}
                position={[x, y, z]}
              />
            );
          })}
        </group>

        <OrbitControls
          enableZoom={true}
          minDistance={5}
          maxDistance={15}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default FitnessJourneyVisualizer;
