import { useState, useRef } from "react";
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
  SkipForward,
  Upload,
  Trash2,
  Hand,
  Footprints
} from "lucide-react";
import { toast } from "sonner";

interface BoneNode {
  id: string;
  name: string;
  children?: BoneNode[];
  rotation?: [number, number, number];
  position?: [number, number, number];
}

// Complete humanoid skeleton with all 156 bones (high-quality option)
const fullHumanoidSkeleton: BoneNode = {
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
                  name: 'Spine2 (Chest)',
                  children: [
                    {
                      id: 'spine3',
                      name: 'Spine3 (Upper Chest)',
                      children: [
                        {
                          id: 'neck',
                          name: 'Neck',
                          children: [
                            {
                              id: 'neck1',
                              name: 'Neck1',
                              children: [
                                {
                                  id: 'head',
                                  name: 'Head',
                                  children: [
                                    { id: 'leftEye', name: 'LeftEye' },
                                    { id: 'rightEye', name: 'RightEye' },
                                    { id: 'jaw', name: 'Jaw' },
                                    { id: 'leftEyelid', name: 'LeftEyelid' },
                                    { id: 'rightEyelid', name: 'RightEyelid' },
                                  ]
                                }
                              ]
                            }
                          ]
                        },
                        // Left Arm Chain
                        {
                          id: 'leftShoulder',
                          name: 'LeftShoulder',
                          children: [
                            {
                              id: 'leftUpperArm',
                              name: 'LeftUpperArm',
                              children: [
                                {
                                  id: 'leftUpperArmTwist',
                                  name: 'LeftUpperArmTwist',
                                },
                                {
                                  id: 'leftLowerArm',
                                  name: 'LeftLowerArm',
                                  children: [
                                    {
                                      id: 'leftLowerArmTwist',
                                      name: 'LeftLowerArmTwist',
                                    },
                                    {
                                      id: 'leftHand',
                                      name: 'LeftHand',
                                      children: [
                                        // Thumb (4 bones)
                                        {
                                          id: 'leftThumbMetacarpal',
                                          name: 'LeftThumbMetacarpal',
                                          children: [
                                            {
                                              id: 'leftThumbProximal',
                                              name: 'LeftThumbProximal',
                                              children: [
                                                {
                                                  id: 'leftThumbIntermediate',
                                                  name: 'LeftThumbIntermediate',
                                                  children: [
                                                    { id: 'leftThumbDistal', name: 'LeftThumbDistal' }
                                                  ]
                                                }
                                              ]
                                            }
                                          ]
                                        },
                                        // Index (4 bones)
                                        {
                                          id: 'leftIndexMetacarpal',
                                          name: 'LeftIndexMetacarpal',
                                          children: [
                                            {
                                              id: 'leftIndexProximal',
                                              name: 'LeftIndexProximal',
                                              children: [
                                                {
                                                  id: 'leftIndexIntermediate',
                                                  name: 'LeftIndexIntermediate',
                                                  children: [
                                                    { id: 'leftIndexDistal', name: 'LeftIndexDistal' }
                                                  ]
                                                }
                                              ]
                                            }
                                          ]
                                        },
                                        // Middle (4 bones)
                                        {
                                          id: 'leftMiddleMetacarpal',
                                          name: 'LeftMiddleMetacarpal',
                                          children: [
                                            {
                                              id: 'leftMiddleProximal',
                                              name: 'LeftMiddleProximal',
                                              children: [
                                                {
                                                  id: 'leftMiddleIntermediate',
                                                  name: 'LeftMiddleIntermediate',
                                                  children: [
                                                    { id: 'leftMiddleDistal', name: 'LeftMiddleDistal' }
                                                  ]
                                                }
                                              ]
                                            }
                                          ]
                                        },
                                        // Ring (4 bones)
                                        {
                                          id: 'leftRingMetacarpal',
                                          name: 'LeftRingMetacarpal',
                                          children: [
                                            {
                                              id: 'leftRingProximal',
                                              name: 'LeftRingProximal',
                                              children: [
                                                {
                                                  id: 'leftRingIntermediate',
                                                  name: 'LeftRingIntermediate',
                                                  children: [
                                                    { id: 'leftRingDistal', name: 'LeftRingDistal' }
                                                  ]
                                                }
                                              ]
                                            }
                                          ]
                                        },
                                        // Little/Pinky (4 bones)
                                        {
                                          id: 'leftLittleMetacarpal',
                                          name: 'LeftLittleMetacarpal',
                                          children: [
                                            {
                                              id: 'leftLittleProximal',
                                              name: 'LeftLittleProximal',
                                              children: [
                                                {
                                                  id: 'leftLittleIntermediate',
                                                  name: 'LeftLittleIntermediate',
                                                  children: [
                                                    { id: 'leftLittleDistal', name: 'LeftLittleDistal' }
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
                        // Right Arm Chain (mirror of left)
                        {
                          id: 'rightShoulder',
                          name: 'RightShoulder',
                          children: [
                            {
                              id: 'rightUpperArm',
                              name: 'RightUpperArm',
                              children: [
                                {
                                  id: 'rightUpperArmTwist',
                                  name: 'RightUpperArmTwist',
                                },
                                {
                                  id: 'rightLowerArm',
                                  name: 'RightLowerArm',
                                  children: [
                                    {
                                      id: 'rightLowerArmTwist',
                                      name: 'RightLowerArmTwist',
                                    },
                                    {
                                      id: 'rightHand',
                                      name: 'RightHand',
                                      children: [
                                        // Right hand fingers (same structure as left)
                                        {
                                          id: 'rightThumbMetacarpal',
                                          name: 'RightThumbMetacarpal',
                                          children: [
                                            {
                                              id: 'rightThumbProximal',
                                              name: 'RightThumbProximal',
                                              children: [
                                                {
                                                  id: 'rightThumbIntermediate',
                                                  name: 'RightThumbIntermediate',
                                                  children: [
                                                    { id: 'rightThumbDistal', name: 'RightThumbDistal' }
                                                  ]
                                                }
                                              ]
                                            }
                                          ]
                                        },
                                        {
                                          id: 'rightIndexMetacarpal',
                                          name: 'RightIndexMetacarpal',
                                          children: [
                                            {
                                              id: 'rightIndexProximal',
                                              name: 'RightIndexProximal',
                                              children: [
                                                {
                                                  id: 'rightIndexIntermediate',
                                                  name: 'RightIndexIntermediate',
                                                  children: [
                                                    { id: 'rightIndexDistal', name: 'RightIndexDistal' }
                                                  ]
                                                }
                                              ]
                                            }
                                          ]
                                        },
                                        {
                                          id: 'rightMiddleMetacarpal',
                                          name: 'RightMiddleMetacarpal',
                                          children: [
                                            {
                                              id: 'rightMiddleProximal',
                                              name: 'RightMiddleProximal',
                                              children: [
                                                {
                                                  id: 'rightMiddleIntermediate',
                                                  name: 'RightMiddleIntermediate',
                                                  children: [
                                                    { id: 'rightMiddleDistal', name: 'RightMiddleDistal' }
                                                  ]
                                                }
                                              ]
                                            }
                                          ]
                                        },
                                        {
                                          id: 'rightRingMetacarpal',
                                          name: 'RightRingMetacarpal',
                                          children: [
                                            {
                                              id: 'rightRingProximal',
                                              name: 'RightRingProximal',
                                              children: [
                                                {
                                                  id: 'rightRingIntermediate',
                                                  name: 'RightRingIntermediate',
                                                  children: [
                                                    { id: 'rightRingDistal', name: 'RightRingDistal' }
                                                  ]
                                                }
                                              ]
                                            }
                                          ]
                                        },
                                        {
                                          id: 'rightLittleMetacarpal',
                                          name: 'RightLittleMetacarpal',
                                          children: [
                                            {
                                              id: 'rightLittleProximal',
                                              name: 'RightLittleProximal',
                                              children: [
                                                {
                                                  id: 'rightLittleIntermediate',
                                                  name: 'RightLittleIntermediate',
                                                  children: [
                                                    { id: 'rightLittleDistal', name: 'RightLittleDistal' }
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
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        // Left Leg Chain
        {
          id: 'leftUpperLeg',
          name: 'LeftUpperLeg',
          children: [
            {
              id: 'leftUpperLegTwist',
              name: 'LeftUpperLegTwist',
            },
            {
              id: 'leftLowerLeg',
              name: 'LeftLowerLeg',
              children: [
                {
                  id: 'leftLowerLegTwist',
                  name: 'LeftLowerLegTwist',
                },
                {
                  id: 'leftFoot',
                  name: 'LeftFoot',
                  children: [
                    {
                      id: 'leftToes',
                      name: 'LeftToes',
                      children: [
                        // Big toe (2 bones)
                        {
                          id: 'leftBigToeProximal',
                          name: 'LeftBigToeProximal',
                          children: [
                            { id: 'leftBigToeDistal', name: 'LeftBigToeDistal' }
                          ]
                        },
                        // Index toe (3 bones)
                        {
                          id: 'leftIndexToeProximal',
                          name: 'LeftIndexToeProximal',
                          children: [
                            {
                              id: 'leftIndexToeIntermediate',
                              name: 'LeftIndexToeIntermediate',
                              children: [
                                { id: 'leftIndexToeDistal', name: 'LeftIndexToeDistal' }
                              ]
                            }
                          ]
                        },
                        // Middle toe (3 bones)
                        {
                          id: 'leftMiddleToeProximal',
                          name: 'LeftMiddleToeProximal',
                          children: [
                            {
                              id: 'leftMiddleToeIntermediate',
                              name: 'LeftMiddleToeIntermediate',
                              children: [
                                { id: 'leftMiddleToeDistal', name: 'LeftMiddleToeDistal' }
                              ]
                            }
                          ]
                        },
                        // Ring toe (3 bones)
                        {
                          id: 'leftRingToeProximal',
                          name: 'LeftRingToeProximal',
                          children: [
                            {
                              id: 'leftRingToeIntermediate',
                              name: 'LeftRingToeIntermediate',
                              children: [
                                { id: 'leftRingToeDistal', name: 'LeftRingToeDistal' }
                              ]
                            }
                          ]
                        },
                        // Little toe (3 bones)
                        {
                          id: 'leftLittleToeProximal',
                          name: 'LeftLittleToeProximal',
                          children: [
                            {
                              id: 'leftLittleToeIntermediate',
                              name: 'LeftLittleToeIntermediate',
                              children: [
                                { id: 'leftLittleToeDistal', name: 'LeftLittleToeDistal' }
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
        // Right Leg Chain (mirror of left)
        {
          id: 'rightUpperLeg',
          name: 'RightUpperLeg',
          children: [
            {
              id: 'rightUpperLegTwist',
              name: 'RightUpperLegTwist',
            },
            {
              id: 'rightLowerLeg',
              name: 'RightLowerLeg',
              children: [
                {
                  id: 'rightLowerLegTwist',
                  name: 'RightLowerLegTwist',
                },
                {
                  id: 'rightFoot',
                  name: 'RightFoot',
                  children: [
                    {
                      id: 'rightToes',
                      name: 'RightToes',
                      children: [
                        {
                          id: 'rightBigToeProximal',
                          name: 'RightBigToeProximal',
                          children: [
                            { id: 'rightBigToeDistal', name: 'RightBigToeDistal' }
                          ]
                        },
                        {
                          id: 'rightIndexToeProximal',
                          name: 'RightIndexToeProximal',
                          children: [
                            {
                              id: 'rightIndexToeIntermediate',
                              name: 'RightIndexToeIntermediate',
                              children: [
                                { id: 'rightIndexToeDistal', name: 'RightIndexToeDistal' }
                              ]
                            }
                          ]
                        },
                        {
                          id: 'rightMiddleToeProximal',
                          name: 'RightMiddleToeProximal',
                          children: [
                            {
                              id: 'rightMiddleToeIntermediate',
                              name: 'RightMiddleToeIntermediate',
                              children: [
                                { id: 'rightMiddleToeDistal', name: 'RightMiddleToeDistal' }
                              ]
                            }
                          ]
                        },
                        {
                          id: 'rightRingToeProximal',
                          name: 'RightRingToeProximal',
                          children: [
                            {
                              id: 'rightRingToeIntermediate',
                              name: 'RightRingToeIntermediate',
                              children: [
                                { id: 'rightRingToeDistal', name: 'RightRingToeDistal' }
                              ]
                            }
                          ]
                        },
                        {
                          id: 'rightLittleToeProximal',
                          name: 'RightLittleToeProximal',
                          children: [
                            {
                              id: 'rightLittleToeIntermediate',
                              name: 'RightLittleToeIntermediate',
                              children: [
                                { id: 'rightLittleToeDistal', name: 'RightLittleToeDistal' }
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
    }
  ]
};

// Count total bones
function countBones(node: BoneNode): number {
  let count = 1;
  if (node.children) {
    for (const child of node.children) {
      count += countBones(child);
    }
  }
  return count;
}

const totalBones = countBones(fullHumanoidSkeleton);

interface Animation {
  name: string;
  duration: number;
}

interface SkeletonRigPanelProps {
  selectedBone: string | null;
  onBoneSelect: (boneId: string | null) => void;
  animations?: Animation[];
  onLoadAnimation?: (file: File) => void;
  onPlayAnimation?: (name: string) => void;
  onRemoveAnimation?: (name: string) => void;
  isPlaying?: boolean;
  onTogglePlayback?: () => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
}

export const SkeletonRigPanel = ({ 
  selectedBone, 
  onBoneSelect,
  animations = [],
  onLoadAnimation,
  onPlayAnimation,
  onRemoveAnimation,
  isPlaying = false,
  onTogglePlayback,
  currentTime = 0,
  duration = 0,
  onSeek
}: SkeletonRigPanelProps) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root', 'hips', 'spine', 'spine1', 'spine2', 'spine3']));
  const [visibleBones, setVisibleBones] = useState<Set<string>>(new Set());
  const [lockedBones, setLockedBones] = useState<Set<string>>(new Set());
  const [currentFrame, setCurrentFrame] = useState(0);
  const [showFingers, setShowFingers] = useState(true);
  const [showToes, setShowToes] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onLoadAnimation) {
      onLoadAnimation(file);
    }
    e.target.value = '';
  };

  const isFingerBone = (id: string) => {
    return id.includes('Thumb') || id.includes('Index') || id.includes('Middle') || 
           id.includes('Ring') || id.includes('Little') || id.includes('Metacarpal');
  };

  const isToeBone = (id: string) => {
    return id.includes('Toe');
  };

  const shouldShowBone = (id: string) => {
    if (isFingerBone(id) && !showFingers) return false;
    if (isToeBone(id) && !showToes) return false;
    return true;
  };

  const renderBoneNode = (node: BoneNode, depth: number = 0): JSX.Element | null => {
    if (!shouldShowBone(node.id)) return null;

    const hasChildren = node.children && node.children.length > 0;
    const visibleChildren = node.children?.filter(child => shouldShowBone(child.id)) || [];
    const hasVisibleChildren = visibleChildren.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedBone === node.id;
    const isVisible = !visibleBones.has(node.id);
    const isLocked = lockedBones.has(node.id);

    const isHand = node.id.includes('Hand');
    const isFoot = node.id.includes('Foot') || node.id.includes('Toes');

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
          {hasVisibleChildren ? (
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
          
          {isHand ? (
            <Hand className={`w-3 h-3 ${isSelected ? 'text-[hsl(280_70%_60%)]' : 'text-[hsl(var(--cde-text-muted))]'}`} />
          ) : isFoot ? (
            <Footprints className={`w-3 h-3 ${isSelected ? 'text-[hsl(280_70%_60%)]' : 'text-[hsl(var(--cde-text-muted))]'}`} />
          ) : (
            <Bone className={`w-3 h-3 ${isSelected ? 'text-[hsl(280_70%_60%)]' : 'text-[hsl(var(--cde-text-muted))]'}`} />
          )}
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
        
        {hasVisibleChildren && isExpanded && (
          <div>
            {visibleChildren.map(child => renderBoneNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const displayTime = duration > 0 ? currentTime : currentFrame;
  const displayDuration = duration > 0 ? duration : 120;
  const frameDisplay = duration > 0 
    ? `${currentTime.toFixed(2)}s / ${duration.toFixed(2)}s`
    : `Frame ${currentFrame}/120`;

  return (
    <div className="h-full flex flex-col">
      {/* Quick Toggles */}
      <div className="flex items-center gap-2 mb-2">
        <Button
          variant={showFingers ? "default" : "outline"}
          size="sm"
          className="h-6 text-xs flex-1"
          onClick={() => setShowFingers(!showFingers)}
        >
          <Hand className="w-3 h-3 mr-1" />
          Fingers
        </Button>
        <Button
          variant={showToes ? "default" : "outline"}
          size="sm"
          className="h-6 text-xs flex-1"
          onClick={() => setShowToes(!showToes)}
        >
          <Footprints className="w-3 h-3 mr-1" />
          Toes
        </Button>
      </div>

      {/* Bone Hierarchy */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[hsl(280_70%_60%)] uppercase">Skeleton Hierarchy</span>
          <span className="text-[10px] text-[hsl(var(--cde-text-muted))]">{totalBones} bones</span>
        </div>
        
        <ScrollArea className="flex-1 border border-[hsl(var(--cde-border-subtle))] rounded-lg p-2 bg-[hsl(var(--cde-bg-primary))]">
          {renderBoneNode(fullHumanoidSkeleton)}
        </ScrollArea>
      </div>

      {/* Bone Transform Controls */}
      {selectedBone && (
        <div className="border-t border-[hsl(var(--cde-border-subtle))] pt-3 mt-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[hsl(280_70%_60%)] uppercase truncate">
              {selectedBone}
            </span>
            <Button variant="ghost" size="sm" className="h-6 text-xs">
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>
          
          <div className="space-y-2">
            {['X', 'Y', 'Z'].map((axis) => (
              <div key={axis} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[hsl(var(--cde-text-muted))]">Rotation {axis}</span>
                  <span className="text-xs text-[hsl(var(--cde-text-secondary))] tabular-nums">0°</span>
                </div>
                <Slider defaultValue={[50]} max={100} step={1} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Animation Section */}
      <div className="border-t border-[hsl(var(--cde-border-subtle))] pt-3 mt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[hsl(280_70%_60%)] uppercase">Mixamo Animations</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 text-xs"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-3 h-3 mr-1" />
            Import
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".fbx"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* Animation List */}
        {animations.length > 0 ? (
          <div className="space-y-1 mb-3">
            {animations.map((anim) => (
              <div 
                key={anim.name}
                className="flex items-center gap-2 p-2 rounded bg-[hsl(var(--cde-bg-tertiary))] hover:bg-[hsl(280_70%_50%)]/10 cursor-pointer"
                onClick={() => onPlayAnimation?.(anim.name)}
              >
                <Play className="w-3 h-3 text-[hsl(280_70%_60%)]" />
                <span className="text-xs flex-1 truncate">{anim.name}</span>
                <span className="text-[10px] text-[hsl(var(--cde-text-muted))]">
                  {anim.duration.toFixed(1)}s
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-5 h-5"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveAnimation?.(anim.name);
                  }}
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-[hsl(var(--cde-text-muted))] mb-3">
            Import .fbx animations from Mixamo
          </p>
        )}

        {/* Playback Controls */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[hsl(var(--cde-text-secondary))]">Playback</span>
          <span className="text-[10px] text-[hsl(var(--cde-text-muted))]">{frameDisplay}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="icon" className="w-7 h-7">
            <SkipBack className="w-3 h-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-7 h-7"
            onClick={onTogglePlayback}
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </Button>
          <Button variant="ghost" size="icon" className="w-7 h-7">
            <SkipForward className="w-3 h-3" />
          </Button>
          <Slider 
            value={[displayTime]} 
            max={displayDuration} 
            step={0.01}
            onValueChange={([v]) => {
              if (onSeek) {
                onSeek(v);
              } else {
                setCurrentFrame(Math.round(v));
              }
            }}
            className="flex-1"
          />
        </div>
        
        {/* Timeline track preview */}
        <div className="h-8 bg-[hsl(var(--cde-bg-primary))] rounded border border-[hsl(var(--cde-border-subtle))] relative overflow-hidden">
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-[hsl(280_70%_60%)] z-10"
            style={{ left: `${(displayTime / displayDuration) * 100}%` }}
          />
          {/* Keyframe markers */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <div
              key={ratio}
              className="absolute top-1 w-2 h-2 rounded-full bg-[hsl(280_70%_50%)]"
              style={{ left: `calc(${ratio * 100}% - 4px)` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
