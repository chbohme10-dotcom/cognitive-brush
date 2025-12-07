import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { 
  Bone, 
  ChevronRight, 
  ChevronDown, 
  Eye, 
  EyeOff,
  Lock,
  Unlock,
  RotateCcw,
  Play,
  Pause,
  SkipBack,
  SkipForward
} from "lucide-react";

interface BoneNode {
  id: string;
  name: string;
  children?: BoneNode[];
  rotation?: [number, number, number];
  position?: [number, number, number];
}

const humanoidSkeleton: BoneNode = {
  id: 'root',
  name: 'Root',
  children: [
    {
      id: 'hips',
      name: 'Hips',
      children: [
        {
          id: 'spine',
          name: 'Spine',
          children: [
            {
              id: 'spine1',
              name: 'Spine1',
              children: [
                {
                  id: 'spine2',
                  name: 'Spine2',
                  children: [
                    {
                      id: 'neck',
                      name: 'Neck',
                      children: [
                        {
                          id: 'head',
                          name: 'Head',
                          children: [
                            { id: 'leftEye', name: 'LeftEye' },
                            { id: 'rightEye', name: 'RightEye' },
                            { id: 'jaw', name: 'Jaw' },
                          ]
                        }
                      ]
                    },
                    {
                      id: 'leftShoulder',
                      name: 'LeftShoulder',
                      children: [
                        {
                          id: 'leftUpperArm',
                          name: 'LeftUpperArm',
                          children: [
                            {
                              id: 'leftLowerArm',
                              name: 'LeftLowerArm',
                              children: [
                                {
                                  id: 'leftHand',
                                  name: 'LeftHand',
                                  children: [
                                    { id: 'leftThumb1', name: 'LeftThumb1' },
                                    { id: 'leftIndex1', name: 'LeftIndex1' },
                                    { id: 'leftMiddle1', name: 'LeftMiddle1' },
                                    { id: 'leftRing1', name: 'LeftRing1' },
                                    { id: 'leftPinky1', name: 'LeftPinky1' },
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: 'rightShoulder',
                      name: 'RightShoulder',
                      children: [
                        {
                          id: 'rightUpperArm',
                          name: 'RightUpperArm',
                          children: [
                            {
                              id: 'rightLowerArm',
                              name: 'RightLowerArm',
                              children: [
                                {
                                  id: 'rightHand',
                                  name: 'RightHand',
                                  children: [
                                    { id: 'rightThumb1', name: 'RightThumb1' },
                                    { id: 'rightIndex1', name: 'RightIndex1' },
                                    { id: 'rightMiddle1', name: 'RightMiddle1' },
                                    { id: 'rightRing1', name: 'RightRing1' },
                                    { id: 'rightPinky1', name: 'RightPinky1' },
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'leftUpperLeg',
          name: 'LeftUpperLeg',
          children: [
            {
              id: 'leftLowerLeg',
              name: 'LeftLowerLeg',
              children: [
                {
                  id: 'leftFoot',
                  name: 'LeftFoot',
                  children: [
                    { id: 'leftToes', name: 'LeftToes' }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'rightUpperLeg',
          name: 'RightUpperLeg',
          children: [
            {
              id: 'rightLowerLeg',
              name: 'RightLowerLeg',
              children: [
                {
                  id: 'rightFoot',
                  name: 'RightFoot',
                  children: [
                    { id: 'rightToes', name: 'RightToes' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

interface SkeletonRigPanelProps {
  selectedBone: string | null;
  onBoneSelect: (boneId: string | null) => void;
}

export const SkeletonRigPanel = ({ selectedBone, onBoneSelect }: SkeletonRigPanelProps) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root', 'hips', 'spine', 'spine1', 'spine2']));
  const [visibleBones, setVisibleBones] = useState<Set<string>>(new Set());
  const [lockedBones, setLockedBones] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  const toggleExpanded = (id: string) => {
    const next = new Set(expandedNodes);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpandedNodes(next);
  };

  const toggleVisible = (id: string) => {
    const next = new Set(visibleBones);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setVisibleBones(next);
  };

  const toggleLocked = (id: string) => {
    const next = new Set(lockedBones);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setLockedBones(next);
  };

  const renderBoneNode = (node: BoneNode, depth: number = 0): JSX.Element => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedBone === node.id;
    const isVisible = !visibleBones.has(node.id);
    const isLocked = lockedBones.has(node.id);

    return (
      <div key={node.id}>
        <div 
          className={`flex items-center gap-1 py-1 px-1 rounded cursor-pointer transition-colors ${
            isSelected 
              ? 'bg-[hsl(280_70%_50%)]/20 text-[hsl(280_70%_60%)]' 
              : 'hover:bg-[hsl(var(--cde-bg-tertiary))]'
          }`}
          style={{ paddingLeft: `${depth * 12 + 4}px` }}
          onClick={() => onBoneSelect(node.id)}
        >
          {hasChildren ? (
            <button 
              onClick={(e) => { e.stopPropagation(); toggleExpanded(node.id); }}
              className="w-4 h-4 flex items-center justify-center"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          ) : (
            <div className="w-4" />
          )}
          
          <Bone className={`w-3 h-3 ${isSelected ? 'text-[hsl(280_70%_60%)]' : 'text-[hsl(var(--cde-text-muted))]'}`} />
          <span className="text-xs flex-1 truncate">{node.name}</span>
          
          <button 
            onClick={(e) => { e.stopPropagation(); toggleVisible(node.id); }}
            className="w-4 h-4 flex items-center justify-center opacity-50 hover:opacity-100"
          >
            {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); toggleLocked(node.id); }}
            className="w-4 h-4 flex items-center justify-center opacity-50 hover:opacity-100"
          >
            {isLocked ? <Lock className="w-3 h-3 text-red-400" /> : <Unlock className="w-3 h-3" />}
          </button>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => renderBoneNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Bone Hierarchy */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[hsl(280_70%_60%)] uppercase">Skeleton Hierarchy</span>
          <span className="text-[10px] text-[hsl(var(--cde-text-muted))]">65 bones</span>
        </div>
        
        <ScrollArea className="flex-1 border border-[hsl(var(--cde-border-subtle))] rounded-lg p-2 bg-[hsl(var(--cde-bg-primary))]">
          {renderBoneNode(humanoidSkeleton)}
        </ScrollArea>
      </div>

      {/* Bone Transform Controls */}
      {selectedBone && (
        <div className="border-t border-[hsl(var(--cde-border-subtle))] pt-3 mt-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[hsl(280_70%_60%)] uppercase">
              {selectedBone}
            </span>
            <Button variant="ghost" size="sm" className="h-6 text-xs">
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[hsl(var(--cde-text-muted))]">Rotation X</span>
                <span className="text-xs text-[hsl(var(--cde-text-secondary))] tabular-nums">0°</span>
              </div>
              <Slider defaultValue={[50]} max={100} step={1} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[hsl(var(--cde-text-muted))]">Rotation Y</span>
                <span className="text-xs text-[hsl(var(--cde-text-secondary))] tabular-nums">0°</span>
              </div>
              <Slider defaultValue={[50]} max={100} step={1} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[hsl(var(--cde-text-muted))]">Rotation Z</span>
                <span className="text-xs text-[hsl(var(--cde-text-secondary))] tabular-nums">0°</span>
              </div>
              <Slider defaultValue={[50]} max={100} step={1} />
            </div>
          </div>
        </div>
      )}

      {/* Animation Timeline */}
      <div className="border-t border-[hsl(var(--cde-border-subtle))] pt-3 mt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[hsl(280_70%_60%)] uppercase">Animation</span>
          <span className="text-[10px] text-[hsl(var(--cde-text-muted))]">Frame {currentFrame}/120</span>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="icon" className="w-7 h-7">
            <SkipBack className="w-3 h-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-7 h-7"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </Button>
          <Button variant="ghost" size="icon" className="w-7 h-7">
            <SkipForward className="w-3 h-3" />
          </Button>
          <Slider 
            value={[currentFrame]} 
            max={120} 
            step={1}
            onValueChange={([v]) => setCurrentFrame(v)}
            className="flex-1"
          />
        </div>
        
        {/* Timeline track preview */}
        <div className="h-8 bg-[hsl(var(--cde-bg-primary))] rounded border border-[hsl(var(--cde-border-subtle))] relative overflow-hidden">
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-[hsl(280_70%_60%)] z-10"
            style={{ left: `${(currentFrame / 120) * 100}%` }}
          />
          {/* Keyframe markers */}
          {[0, 30, 60, 90, 120].map((frame) => (
            <div
              key={frame}
              className="absolute top-1 w-2 h-2 rounded-full bg-[hsl(280_70%_50%)]"
              style={{ left: `calc(${(frame / 120) * 100}% - 4px)` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
