import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Grid, 
  Environment, 
  ContactShadows,
  PerspectiveCamera,
  Html
} from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles, RotateCcw, Maximize2, Grid3X3, Eye, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Simple humanoid character mesh
function HumanoidCharacter({ morphValues }: { morphValues: Record<string, number> }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Apply morph values to scale
  const heightScale = 1 + ((morphValues.height ?? 50) - 50) * 0.01;
  const widthScale = 1 + ((morphValues.weight ?? 50) - 50) * 0.005;
  const muscleScale = 1 + ((morphValues.muscle ?? 50) - 50) * 0.003;

  return (
    <group ref={groupRef} scale={[widthScale * muscleScale, heightScale, widthScale]}>
      {/* Head */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color="#e8d0c0" roughness={0.7} />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.1, 16]} />
        <meshStandardMaterial color="#e8d0c0" roughness={0.7} />
      </mesh>
      
      {/* Torso */}
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[0.35, 0.5, 0.18]} />
        <meshStandardMaterial color="#2a2a3a" roughness={0.5} />
      </mesh>
      
      {/* Hips */}
      <mesh position={[0, 0.82, 0]}>
        <boxGeometry args={[0.32, 0.15, 0.16]} />
        <meshStandardMaterial color="#1a1a2a" roughness={0.5} />
      </mesh>
      
      {/* Left Arm */}
      <group position={[-0.22, 1.25, 0]}>
        <mesh position={[0, -0.12, 0]} rotation={[0, 0, 0.1]}>
          <capsuleGeometry args={[0.04, 0.2, 8, 16]} />
          <meshStandardMaterial color="#2a2a3a" roughness={0.5} />
        </mesh>
        <mesh position={[-0.02, -0.35, 0]} rotation={[0, 0, 0.15]}>
          <capsuleGeometry args={[0.035, 0.2, 8, 16]} />
          <meshStandardMaterial color="#e8d0c0" roughness={0.7} />
        </mesh>
      </group>
      
      {/* Right Arm */}
      <group position={[0.22, 1.25, 0]}>
        <mesh position={[0, -0.12, 0]} rotation={[0, 0, -0.1]}>
          <capsuleGeometry args={[0.04, 0.2, 8, 16]} />
          <meshStandardMaterial color="#2a2a3a" roughness={0.5} />
        </mesh>
        <mesh position={[0.02, -0.35, 0]} rotation={[0, 0, -0.15]}>
          <capsuleGeometry args={[0.035, 0.2, 8, 16]} />
          <meshStandardMaterial color="#e8d0c0" roughness={0.7} />
        </mesh>
      </group>
      
      {/* Left Leg */}
      <group position={[-0.1, 0.7, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <capsuleGeometry args={[0.055, 0.3, 8, 16]} />
          <meshStandardMaterial color="#1a1a2a" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.55, 0]}>
          <capsuleGeometry args={[0.045, 0.3, 8, 16]} />
          <meshStandardMaterial color="#1a1a2a" roughness={0.5} />
        </mesh>
      </group>
      
      {/* Right Leg */}
      <group position={[0.1, 0.7, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <capsuleGeometry args={[0.055, 0.3, 8, 16]} />
          <meshStandardMaterial color="#1a1a2a" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.55, 0]}>
          <capsuleGeometry args={[0.045, 0.3, 8, 16]} />
          <meshStandardMaterial color="#1a1a2a" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

// Bone visualization
function BoneOverlay() {
  return (
    <group>
      {/* Simplified bone structure */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#ff6b6b" />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#ff6b6b" />
      </mesh>
      <mesh position={[0, 1.35, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#ff6b6b" />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#ff6b6b" />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#ff6b6b" />
      </mesh>
    </group>
  );
}

function Scene({ showBones, showGrid, morphValues }: { 
  showBones: boolean; 
  showGrid: boolean;
  morphValues: Record<string, number>;
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[2, 1.5, 2]} fov={50} />
      <OrbitControls 
        target={[0, 1, 0]} 
        minDistance={1} 
        maxDistance={10}
        enablePan={true}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-3, 3, -3]} intensity={0.3} />
      
      {/* Environment */}
      <Environment preset="studio" />
      
      {/* Character */}
      <HumanoidCharacter morphValues={morphValues} />
      
      {/* Bones overlay */}
      {showBones && <BoneOverlay />}
      
      {/* Ground */}
      {showGrid && (
        <Grid 
          args={[10, 10]} 
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#404060"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#606080"
          fadeDistance={10}
          fadeStrength={1}
          position={[0, 0, 0]}
        />
      )}
      
      <ContactShadows 
        position={[0, 0, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={2} 
        far={4} 
      />
    </>
  );
}

interface Character3DViewportProps {
  morphValues: Record<string, number>;
}

export const Character3DViewport = ({ morphValues }: Character3DViewportProps) => {
  const [showBones, setShowBones] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-[hsl(240_20%_12%)] to-[hsl(240_20%_8%)]">
      {/* Viewport Controls */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          className={`${showGrid ? 'bg-[hsl(280_70%_50%)]/20 text-[hsl(280_70%_60%)]' : ''}`}
          onClick={() => setShowGrid(!showGrid)}
        >
          <Grid3X3 className="w-4 h-4 mr-1" />
          Grid
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className={`${showBones ? 'bg-[hsl(280_70%_50%)]/20 text-[hsl(280_70%_60%)]' : ''}`}
          onClick={() => setShowBones(!showBones)}
        >
          <Eye className="w-4 h-4 mr-1" />
          Bones
        </Button>
      </div>

      {/* View Presets */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1">
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <Box className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <Maximize2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* WebGL2 Canvas */}
      <Canvas 
        gl={{ 
          antialias: true,
          powerPreference: 'high-performance',
        }}
        shadows
      >
        <Suspense fallback={
          <Html center>
            <div className="flex items-center gap-2 text-[hsl(280_70%_60%)]">
              <Sparkles className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading 3D Engine...</span>
            </div>
          </Html>
        }>
          <Scene showBones={showBones} showGrid={showGrid} morphValues={morphValues} />
        </Suspense>
      </Canvas>

      {/* Bottom Status */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-4">
        <div className="px-3 py-1.5 rounded-lg bg-[hsl(var(--cde-bg-tertiary))]/80 backdrop-blur-sm">
          <span className="text-xs text-[hsl(var(--cde-text-muted))]">WebGL2</span>
          <span className="text-xs text-green-400 ml-2">● Active</span>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-[hsl(var(--cde-bg-tertiary))]/80 backdrop-blur-sm">
          <span className="text-xs text-[hsl(var(--cde-text-muted))]">Vertices: 2,847</span>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-[hsl(var(--cde-bg-tertiary))]/80 backdrop-blur-sm">
          <span className="text-xs text-[hsl(var(--cde-text-muted))]">Bones: 65</span>
        </div>
      </div>
    </div>
  );
};
