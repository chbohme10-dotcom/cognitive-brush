import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Grid, 
  Environment, 
  ContactShadows,
  PerspectiveCamera,
  Html,
  Center,
  Stage
} from '@react-three/drei';
import * as THREE from 'three';
import { 
  Sparkles, RotateCcw, Maximize2, Grid3X3, Eye, Box, 
  Camera, User, ScanFace, Bone as BoneIcon, ZoomIn, ZoomOut,
  Move, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VRMCharacterModel } from './VRMCharacterModel';

// Enhanced bone visualization with proper skeleton
function SkeletonOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;
  
  const bonePositions = [
    // Spine
    { pos: [0, 0, 0] as const, name: 'Root' },
    { pos: [0, 0.15, 0] as const, name: 'Hips' },
    { pos: [0, 0.3, 0] as const, name: 'Spine' },
    { pos: [0, 0.45, 0] as const, name: 'Spine1' },
    { pos: [0, 0.6, 0] as const, name: 'Spine2' },
    { pos: [0, 0.72, 0] as const, name: 'Neck' },
    { pos: [0, 0.82, 0] as const, name: 'Head' },
    // Left arm
    { pos: [-0.12, 0.65, 0] as const, name: 'L.Shoulder' },
    { pos: [-0.22, 0.6, 0] as const, name: 'L.UpperArm' },
    { pos: [-0.32, 0.45, 0] as const, name: 'L.LowerArm' },
    { pos: [-0.38, 0.32, 0] as const, name: 'L.Hand' },
    // Right arm
    { pos: [0.12, 0.65, 0] as const, name: 'R.Shoulder' },
    { pos: [0.22, 0.6, 0] as const, name: 'R.UpperArm' },
    { pos: [0.32, 0.45, 0] as const, name: 'R.LowerArm' },
    { pos: [0.38, 0.32, 0] as const, name: 'R.Hand' },
    // Left leg
    { pos: [-0.08, 0.1, 0] as const, name: 'L.UpperLeg' },
    { pos: [-0.09, -0.12, 0] as const, name: 'L.LowerLeg' },
    { pos: [-0.09, -0.32, 0] as const, name: 'L.Foot' },
    // Right leg
    { pos: [0.08, 0.1, 0] as const, name: 'R.UpperLeg' },
    { pos: [0.09, -0.12, 0] as const, name: 'R.LowerLeg' },
    { pos: [0.09, -0.32, 0] as const, name: 'R.Foot' },
  ];

  return (
    <group position={[0, 0.75, 0]}>
      {bonePositions.map((bone, i) => (
        <group key={i} position={bone.pos}>
          <mesh>
            <octahedronGeometry args={[0.015, 0]} />
            <meshBasicMaterial color="#ff6b6b" wireframe />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.008, 8, 8]} />
            <meshBasicMaterial color="#ffaa00" />
          </mesh>
        </group>
      ))}
      
      {/* Bone connections */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={40}
            array={new Float32Array([
              // Spine
              0, 0.15, 0, 0, 0.3, 0,
              0, 0.3, 0, 0, 0.45, 0,
              0, 0.45, 0, 0, 0.6, 0,
              0, 0.6, 0, 0, 0.72, 0,
              0, 0.72, 0, 0, 0.82, 0,
              // Left arm
              0, 0.6, 0, -0.12, 0.65, 0,
              -0.12, 0.65, 0, -0.22, 0.6, 0,
              -0.22, 0.6, 0, -0.32, 0.45, 0,
              -0.32, 0.45, 0, -0.38, 0.32, 0,
              // Right arm
              0, 0.6, 0, 0.12, 0.65, 0,
              0.12, 0.65, 0, 0.22, 0.6, 0,
              0.22, 0.6, 0, 0.32, 0.45, 0,
              0.32, 0.45, 0, 0.38, 0.32, 0,
              // Left leg
              0, 0.15, 0, -0.08, 0.1, 0,
              -0.08, 0.1, 0, -0.09, -0.12, 0,
              -0.09, -0.12, 0, -0.09, -0.32, 0,
              // Right leg
              0, 0.15, 0, 0.08, 0.1, 0,
              0.08, 0.1, 0, 0.09, -0.12, 0,
              0.09, -0.12, 0, 0.09, -0.32, 0,
              // Hips connection
              -0.08, 0.1, 0, 0.08, 0.1, 0,
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ff6b6b" linewidth={2} />
      </lineSegments>
    </group>
  );
}

function Scene({ 
  showBones, 
  showGrid, 
  morphValues,
  viewMode
}: { 
  showBones: boolean; 
  showGrid: boolean;
  morphValues: Record<string, number>;
  viewMode: 'full' | 'face' | 'body';
}) {
  const cameraPositions = {
    full: { position: [1.5, 1.2, 1.5] as [number, number, number], target: [0, 0.9, 0] as [number, number, number] },
    face: { position: [0, 1.55, 0.4] as [number, number, number], target: [0, 1.55, 0] as [number, number, number] },
    body: { position: [1.2, 0.8, 1.2] as [number, number, number], target: [0, 0.7, 0] as [number, number, number] },
  };

  const { position, target } = cameraPositions[viewMode];

  return (
    <>
      <PerspectiveCamera makeDefault position={position} fov={viewMode === 'face' ? 35 : 50} />
      <OrbitControls 
        target={target}
        minDistance={0.3} 
        maxDistance={5}
        enablePan={true}
        maxPolarAngle={Math.PI * 0.9}
      />
      
      {/* Studio Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 5, 3]} intensity={0.8} castShadow />
      <directionalLight position={[-2, 3, -2]} intensity={0.4} />
      <directionalLight position={[0, 0, 3]} intensity={0.3} color="#a0c0ff" />
      <spotLight position={[0, 4, 0]} intensity={0.5} angle={0.5} penumbra={0.5} />
      
      {/* Environment */}
      <Environment preset="studio" />
      
      {/* Character */}
      <Center position={[0, 0, 0]}>
        <VRMCharacterModel morphValues={morphValues} />
      </Center>
      
      {/* Skeleton overlay */}
      <SkeletonOverlay visible={showBones} />
      
      {/* Ground Grid */}
      {showGrid && (
        <Grid 
          args={[10, 10]} 
          cellSize={0.25}
          cellThickness={0.5}
          cellColor="#3a3a5a"
          sectionSize={1}
          sectionThickness={1}
          sectionColor="#5a5a8a"
          fadeDistance={8}
          fadeStrength={1}
          position={[0, 0, 0]}
        />
      )}
      
      <ContactShadows 
        position={[0, 0, 0]} 
        opacity={0.5} 
        scale={6} 
        blur={2.5} 
        far={3} 
      />
    </>
  );
}

interface Character3DViewportProps {
  morphValues: Record<string, number>;
  onMorphChange?: (id: string, value: number) => void;
}

export const Character3DViewport = ({ morphValues, onMorphChange }: Character3DViewportProps) => {
  const [showBones, setShowBones] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [viewMode, setViewMode] = useState<'full' | 'face' | 'body'>('full');
  const [isAutoRotate, setIsAutoRotate] = useState(false);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-[hsl(240_20%_14%)] to-[hsl(240_20%_8%)]">
      {/* Top Left Controls */}
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
          <BoneIcon className="w-4 h-4 mr-1" />
          Bones
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className={`${isAutoRotate ? 'bg-[hsl(280_70%_50%)]/20 text-[hsl(280_70%_60%)]' : ''}`}
          onClick={() => setIsAutoRotate(!isAutoRotate)}
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Rotate
        </Button>
      </div>

      {/* View Mode Selector */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 p-1 rounded-lg bg-[hsl(var(--cde-bg-tertiary))]/80 backdrop-blur-sm">
        <Button 
          variant="ghost" 
          size="sm"
          className={`h-7 px-3 ${viewMode === 'full' ? 'bg-[hsl(280_70%_50%)]/30 text-[hsl(280_70%_60%)]' : ''}`}
          onClick={() => setViewMode('full')}
        >
          <User className="w-3 h-3 mr-1" />
          Full Body
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className={`h-7 px-3 ${viewMode === 'face' ? 'bg-[hsl(280_70%_50%)]/30 text-[hsl(280_70%_60%)]' : ''}`}
          onClick={() => setViewMode('face')}
        >
          <ScanFace className="w-3 h-3 mr-1" />
          Face
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className={`h-7 px-3 ${viewMode === 'body' ? 'bg-[hsl(280_70%_50%)]/30 text-[hsl(280_70%_60%)]' : ''}`}
          onClick={() => setViewMode('body')}
        >
          <Move className="w-3 h-3 mr-1" />
          Body
        </Button>
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1">
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <Camera className="w-4 h-4" />
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
          alpha: false,
          stencil: false,
        }}
        shadows
        dpr={[1, 2]}
      >
        <Suspense fallback={
          <Html center>
            <div className="flex flex-col items-center gap-3 text-[hsl(280_70%_60%)]">
              <Sparkles className="w-8 h-8 animate-spin" />
              <span className="text-sm font-medium">Loading 3D Character Studio...</span>
              <div className="w-32 h-1 bg-[hsl(var(--cde-bg-tertiary))] rounded-full overflow-hidden">
                <div className="h-full bg-[hsl(280_70%_50%)] animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          </Html>
        }>
          <Scene 
            showBones={showBones} 
            showGrid={showGrid} 
            morphValues={morphValues}
            viewMode={viewMode}
          />
        </Suspense>
      </Canvas>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3">
        <div className="px-3 py-1.5 rounded-lg bg-[hsl(var(--cde-bg-tertiary))]/80 backdrop-blur-sm flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-[hsl(var(--cde-text-muted))]">WebGL2 Active</span>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-[hsl(var(--cde-bg-tertiary))]/80 backdrop-blur-sm">
          <span className="text-xs text-[hsl(var(--cde-text-muted))]">Vertices: <span className="text-[hsl(280_70%_60%)]">12,847</span></span>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-[hsl(var(--cde-bg-tertiary))]/80 backdrop-blur-sm">
          <span className="text-xs text-[hsl(var(--cde-text-muted))]">Bones: <span className="text-[hsl(280_70%_60%)]">65</span></span>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-[hsl(var(--cde-bg-tertiary))]/80 backdrop-blur-sm">
          <span className="text-xs text-[hsl(var(--cde-text-muted))]">Morphs: <span className="text-[hsl(280_70%_60%)]">52</span></span>
        </div>
      </div>

      {/* Current View Indicator */}
      <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-lg bg-[hsl(280_70%_50%)]/20 border border-[hsl(280_70%_50%)]/40">
        <span className="text-xs font-medium text-[hsl(280_70%_60%)] uppercase">
          {viewMode === 'face' ? 'Face Close-up' : viewMode === 'body' ? 'Body View' : 'Full Character'}
        </span>
      </div>
    </div>
  );
};
