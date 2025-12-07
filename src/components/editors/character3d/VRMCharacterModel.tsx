import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// High-quality parametric head with detailed face morphs
function DetailedHead({ 
  morphValues,
  position = [0, 1.55, 0] as [number, number, number]
}: { 
  morphValues: Record<string, number>;
  position?: [number, number, number];
}) {
  const headRef = useRef<THREE.Group>(null);
  
  // Face morph calculations
  const faceWidth = 1 + ((morphValues.faceWidth ?? 50) - 50) * 0.004;
  const jawWidth = 1 + ((morphValues.jawWidth ?? 50) - 50) * 0.005;
  const cheekbones = (morphValues.cheekbones ?? 50) / 100;
  const eyeSize = 1 + ((morphValues.eyeSize ?? 50) - 50) * 0.006;
  const eyeSpacing = 0.035 + ((morphValues.eyeSpacing ?? 50) - 50) * 0.0003;
  const noseSize = 1 + ((morphValues.noseSize ?? 50) - 50) * 0.005;
  const noseWidth = 1 + ((morphValues.noseWidth ?? 50) - 50) * 0.004;
  const lipSize = 1 + ((morphValues.lipSize ?? 50) - 50) * 0.004;
  const browHeight = 0.04 + ((morphValues.browHeight ?? 50) - 50) * 0.0003;
  const chinLength = 1 + ((morphValues.chinLength ?? 50) - 50) * 0.003;
  const foreheadHeight = 1 + ((morphValues.foreheadHeight ?? 50) - 50) * 0.003;

  // Skin color based on ethnicity blend
  const skinColor = useMemo(() => {
    const asian = (morphValues.ethnicity1 ?? 0) / 100;
    const african = (morphValues.ethnicity2 ?? 0) / 100;
    const caucasian = (morphValues.ethnicity3 ?? 100) / 100;
    
    const r = 0.95 * caucasian + 0.85 * asian + 0.45 * african;
    const g = 0.80 * caucasian + 0.72 * asian + 0.35 * african;
    const b = 0.72 * caucasian + 0.60 * asian + 0.28 * african;
    
    return new THREE.Color(r, g, b);
  }, [morphValues.ethnicity1, morphValues.ethnicity2, morphValues.ethnicity3]);

  return (
    <group ref={headRef} position={position}>
      {/* Cranium - main head shape */}
      <mesh scale={[faceWidth, foreheadHeight, 1]}>
        <sphereGeometry args={[0.095, 32, 32]} />
        <meshStandardMaterial 
          color={skinColor} 
          roughness={0.65} 
          metalness={0.05}
        />
      </mesh>
      
      {/* Jaw/Chin area */}
      <mesh position={[0, -0.06, 0.02]} scale={[jawWidth * 0.9, chinLength * 0.6, 0.85]}>
        <sphereGeometry args={[0.075, 24, 24]} />
        <meshStandardMaterial color={skinColor} roughness={0.65} metalness={0.05} />
      </mesh>
      
      {/* Cheekbones */}
      <mesh position={[-0.055 * faceWidth, -0.01, 0.045]} scale={[0.4 + cheekbones * 0.2, 0.3, 0.4]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.65} metalness={0.05} />
      </mesh>
      <mesh position={[0.055 * faceWidth, -0.01, 0.045]} scale={[0.4 + cheekbones * 0.2, 0.3, 0.4]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.65} metalness={0.05} />
      </mesh>
      
      {/* Eye sockets */}
      <mesh position={[-eyeSpacing, 0.015, 0.07]}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
      </mesh>
      <mesh position={[eyeSpacing, 0.015, 0.07]}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
      </mesh>
      
      {/* Eyeballs */}
      <mesh position={[-eyeSpacing, 0.015, 0.075]} scale={[eyeSize, eyeSize, 1]}>
        <sphereGeometry args={[0.014, 24, 24]} />
        <meshStandardMaterial color="#f8f8f8" roughness={0.1} metalness={0.1} />
      </mesh>
      <mesh position={[eyeSpacing, 0.015, 0.075]} scale={[eyeSize, eyeSize, 1]}>
        <sphereGeometry args={[0.014, 24, 24]} />
        <meshStandardMaterial color="#f8f8f8" roughness={0.1} metalness={0.1} />
      </mesh>
      
      {/* Irises */}
      <mesh position={[-eyeSpacing, 0.015, 0.086]} scale={[eyeSize, eyeSize, 1]}>
        <circleGeometry args={[0.007, 24]} />
        <meshStandardMaterial color="#4a6b8a" roughness={0.3} />
      </mesh>
      <mesh position={[eyeSpacing, 0.015, 0.086]} scale={[eyeSize, eyeSize, 1]}>
        <circleGeometry args={[0.007, 24]} />
        <meshStandardMaterial color="#4a6b8a" roughness={0.3} />
      </mesh>
      
      {/* Pupils */}
      <mesh position={[-eyeSpacing, 0.015, 0.0865]} scale={[eyeSize, eyeSize, 1]}>
        <circleGeometry args={[0.003, 16]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
      <mesh position={[eyeSpacing, 0.015, 0.0865]} scale={[eyeSize, eyeSize, 1]}>
        <circleGeometry args={[0.003, 16]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
      
      {/* Eyebrows */}
      <mesh position={[-eyeSpacing, 0.015 + browHeight, 0.075]} rotation={[0, 0, 0.1]} scale={[1.2, 0.3, 0.5]}>
        <boxGeometry args={[0.025, 0.006, 0.008]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.9} />
      </mesh>
      <mesh position={[eyeSpacing, 0.015 + browHeight, 0.075]} rotation={[0, 0, -0.1]} scale={[1.2, 0.3, 0.5]}>
        <boxGeometry args={[0.025, 0.006, 0.008]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.9} />
      </mesh>
      
      {/* Nose bridge */}
      <mesh position={[0, 0, 0.07]} scale={[noseWidth * 0.3, noseSize, noseSize]}>
        <boxGeometry args={[0.015, 0.04, 0.02]} />
        <meshStandardMaterial color={skinColor} roughness={0.65} metalness={0.05} />
      </mesh>
      
      {/* Nose tip */}
      <mesh position={[0, -0.025, 0.085]} scale={[noseWidth, noseSize, noseSize]}>
        <sphereGeometry args={[0.012, 16, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.65} metalness={0.05} />
      </mesh>
      
      {/* Nostrils */}
      <mesh position={[-0.008 * noseWidth, -0.03, 0.08]} scale={[noseWidth * 0.5, 0.4, 0.5]}>
        <sphereGeometry args={[0.006, 12, 12]} />
        <meshStandardMaterial color={skinColor.clone().multiplyScalar(0.85)} roughness={0.7} />
      </mesh>
      <mesh position={[0.008 * noseWidth, -0.03, 0.08]} scale={[noseWidth * 0.5, 0.4, 0.5]}>
        <sphereGeometry args={[0.006, 12, 12]} />
        <meshStandardMaterial color={skinColor.clone().multiplyScalar(0.85)} roughness={0.7} />
      </mesh>
      
      {/* Upper lip */}
      <mesh position={[0, -0.055, 0.07]} scale={[lipSize * 1.2, lipSize * 0.4, 0.6]}>
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshStandardMaterial color={skinColor.clone().multiplyScalar(0.9)} roughness={0.5} />
      </mesh>
      
      {/* Lower lip */}
      <mesh position={[0, -0.068, 0.065]} scale={[lipSize * 1.1, lipSize * 0.5, 0.5]}>
        <sphereGeometry args={[0.016, 16, 16]} />
        <meshStandardMaterial color={skinColor.clone().multiplyScalar(0.88)} roughness={0.4} />
      </mesh>
      
      {/* Ears */}
      <mesh position={[-0.09 * faceWidth, 0, 0]} rotation={[0, -0.3, 0]} scale={[0.3, 1, 0.5]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.65} metalness={0.05} />
      </mesh>
      <mesh position={[0.09 * faceWidth, 0, 0]} rotation={[0, 0.3, 0]} scale={[0.3, 1, 0.5]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.65} metalness={0.05} />
      </mesh>
      
      {/* Hair (simplified) */}
      <mesh position={[0, 0.05, -0.01]} scale={[faceWidth * 1.05, 1.1, 1]}>
        <sphereGeometry args={[0.1, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color="#1a1008" roughness={0.8} />
      </mesh>
    </group>
  );
}

// High-quality parametric body
function DetailedBody({ 
  morphValues 
}: { 
  morphValues: Record<string, number>;
}) {
  const bodyRef = useRef<THREE.Group>(null);
  
  // Body morph calculations
  const height = 1 + ((morphValues.height ?? 50) - 50) * 0.008;
  const weight = 1 + ((morphValues.weight ?? 50) - 50) * 0.006;
  const muscle = 1 + ((morphValues.muscle ?? 50) - 50) * 0.004;
  const shoulders = 1 + ((morphValues.shoulders ?? 50) - 50) * 0.005;
  const hips = 1 + ((morphValues.hips ?? 50) - 50) * 0.004;
  const torsoLength = 1 + ((morphValues.torso ?? 50) - 50) * 0.004;
  const legLength = 1 + ((morphValues.legs ?? 50) - 50) * 0.005;
  const armLength = 1 + ((morphValues.arms ?? 50) - 50) * 0.004;
  const gender = (morphValues.gender ?? 50) / 100; // 0 = more feminine, 1 = more masculine
  
  const bodyWidth = weight * (0.85 + gender * 0.15);
  const waistWidth = weight * (0.7 + (1 - gender) * 0.1);
  const chestDepth = muscle * (0.8 + gender * 0.2);

  // Skin color
  const skinColor = useMemo(() => {
    const asian = (morphValues.ethnicity1 ?? 0) / 100;
    const african = (morphValues.ethnicity2 ?? 0) / 100;
    const caucasian = (morphValues.ethnicity3 ?? 100) / 100;
    
    const r = 0.95 * caucasian + 0.85 * asian + 0.45 * african;
    const g = 0.80 * caucasian + 0.72 * asian + 0.35 * african;
    const b = 0.72 * caucasian + 0.60 * asian + 0.28 * african;
    
    return new THREE.Color(r, g, b);
  }, [morphValues.ethnicity1, morphValues.ethnicity2, morphValues.ethnicity3]);

  return (
    <group ref={bodyRef} scale={[1, height, 1]}>
      {/* Neck */}
      <mesh position={[0, 1.42, 0]}>
        <cylinderGeometry args={[0.04 * muscle, 0.05 * muscle, 0.1, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.65} metalness={0.05} />
      </mesh>
      
      {/* Upper chest/shoulders */}
      <mesh position={[0, 1.28, 0]} scale={[shoulders, 1, chestDepth]}>
        <boxGeometry args={[0.38, 0.12, 0.18]} />
        <meshStandardMaterial color="#2a2a3a" roughness={0.5} />
      </mesh>
      
      {/* Chest */}
      <mesh position={[0, 1.15, 0]} scale={[bodyWidth, torsoLength, chestDepth]}>
        <boxGeometry args={[0.34, 0.22, 0.16]} />
        <meshStandardMaterial color="#2a2a3a" roughness={0.5} />
      </mesh>
      
      {/* Waist */}
      <mesh position={[0, 0.98, 0]} scale={[waistWidth, torsoLength, chestDepth * 0.9]}>
        <boxGeometry args={[0.3, 0.12, 0.14]} />
        <meshStandardMaterial color="#2a2a3a" roughness={0.5} />
      </mesh>
      
      {/* Hips/Pelvis */}
      <mesh position={[0, 0.84, 0]} scale={[hips, 1, 1]}>
        <boxGeometry args={[0.32, 0.14, 0.15]} />
        <meshStandardMaterial color="#1a1a2a" roughness={0.5} />
      </mesh>
      
      {/* Left Arm */}
      <group position={[-0.22 * shoulders, 1.28, 0]}>
        {/* Shoulder */}
        <mesh position={[0, -0.02, 0]}>
          <sphereGeometry args={[0.045 * muscle, 16, 16]} />
          <meshStandardMaterial color="#2a2a3a" roughness={0.5} />
        </mesh>
        {/* Upper arm */}
        <mesh position={[-0.02, -0.14 * armLength, 0]} rotation={[0, 0, 0.12]}>
          <capsuleGeometry args={[0.038 * muscle, 0.18 * armLength, 8, 16]} />
          <meshStandardMaterial color="#2a2a3a" roughness={0.5} />
        </mesh>
        {/* Elbow */}
        <mesh position={[-0.04, -0.28 * armLength, 0]}>
          <sphereGeometry args={[0.032 * muscle, 12, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.65} />
        </mesh>
        {/* Forearm */}
        <mesh position={[-0.05, -0.42 * armLength, 0]} rotation={[0, 0, 0.15]}>
          <capsuleGeometry args={[0.032 * muscle, 0.18 * armLength, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.65} />
        </mesh>
        {/* Hand */}
        <mesh position={[-0.06, -0.58 * armLength, 0]}>
          <boxGeometry args={[0.04, 0.06, 0.02]} />
          <meshStandardMaterial color={skinColor} roughness={0.65} />
        </mesh>
      </group>
      
      {/* Right Arm */}
      <group position={[0.22 * shoulders, 1.28, 0]}>
        <mesh position={[0, -0.02, 0]}>
          <sphereGeometry args={[0.045 * muscle, 16, 16]} />
          <meshStandardMaterial color="#2a2a3a" roughness={0.5} />
        </mesh>
        <mesh position={[0.02, -0.14 * armLength, 0]} rotation={[0, 0, -0.12]}>
          <capsuleGeometry args={[0.038 * muscle, 0.18 * armLength, 8, 16]} />
          <meshStandardMaterial color="#2a2a3a" roughness={0.5} />
        </mesh>
        <mesh position={[0.04, -0.28 * armLength, 0]}>
          <sphereGeometry args={[0.032 * muscle, 12, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.65} />
        </mesh>
        <mesh position={[0.05, -0.42 * armLength, 0]} rotation={[0, 0, -0.15]}>
          <capsuleGeometry args={[0.032 * muscle, 0.18 * armLength, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.65} />
        </mesh>
        <mesh position={[0.06, -0.58 * armLength, 0]}>
          <boxGeometry args={[0.04, 0.06, 0.02]} />
          <meshStandardMaterial color={skinColor} roughness={0.65} />
        </mesh>
      </group>
      
      {/* Left Leg */}
      <group position={[-0.09 * hips, 0.76, 0]}>
        {/* Upper leg */}
        <mesh position={[0, -0.18 * legLength, 0]}>
          <capsuleGeometry args={[0.055 * weight, 0.28 * legLength, 8, 16]} />
          <meshStandardMaterial color="#1a1a2a" roughness={0.5} />
        </mesh>
        {/* Knee */}
        <mesh position={[0, -0.36 * legLength, 0.01]}>
          <sphereGeometry args={[0.045 * weight, 12, 12]} />
          <meshStandardMaterial color="#1a1a2a" roughness={0.5} />
        </mesh>
        {/* Lower leg */}
        <mesh position={[0, -0.54 * legLength, 0]}>
          <capsuleGeometry args={[0.042 * weight, 0.28 * legLength, 8, 16]} />
          <meshStandardMaterial color="#1a1a2a" roughness={0.5} />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.74 * legLength, 0.03]}>
          <boxGeometry args={[0.06, 0.04, 0.12]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.6} />
        </mesh>
      </group>
      
      {/* Right Leg */}
      <group position={[0.09 * hips, 0.76, 0]}>
        <mesh position={[0, -0.18 * legLength, 0]}>
          <capsuleGeometry args={[0.055 * weight, 0.28 * legLength, 8, 16]} />
          <meshStandardMaterial color="#1a1a2a" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.36 * legLength, 0.01]}>
          <sphereGeometry args={[0.045 * weight, 12, 12]} />
          <meshStandardMaterial color="#1a1a2a" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.54 * legLength, 0]}>
          <capsuleGeometry args={[0.042 * weight, 0.28 * legLength, 8, 16]} />
          <meshStandardMaterial color="#1a1a2a" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.74 * legLength, 0.03]}>
          <boxGeometry args={[0.06, 0.04, 0.12]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

// Complete VRM-style character with full morph support
export function VRMCharacterModel({ 
  morphValues 
}: { 
  morphValues: Record<string, number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Idle breathing animation
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      <DetailedHead morphValues={morphValues} />
      <DetailedBody morphValues={morphValues} />
    </group>
  );
}
