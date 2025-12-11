import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import {
  Bone,
  Wand2,
  Palette,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  Shirt,
  Sparkles,
  Globe,
  Package,
  ScanFace,
  PersonStanding,
  FileBox,
  Hand
} from "lucide-react";
import { FaceMorphPanel } from "./FaceMorphPanel";
import { SkeletonRigPanel } from "./SkeletonRigPanel";
import { AICharacterGenerator } from "./AICharacterGenerator";
import { VRMLoaderPanel } from "./VRMLoaderPanel";
import { FingerPosePanel } from "./FingerPosePanel";
import { useVRMLoader, LoadedVRM } from "@/hooks/useVRMLoader";
import { useMixamoAnimation } from "@/hooks/useMixamoAnimation";

type VRMLoaderReturn = ReturnType<typeof useVRMLoader>;

interface Character3DRightPanelProps {
  activeTool: string;
  morphValues: Record<string, number>;
  onMorphChange: (id: string, value: number) => void;
  vrmLoader?: VRMLoaderReturn;
}

const panels = [
  { id: 'face', icon: ScanFace, label: 'Face Morphs' },
  { id: 'body', icon: PersonStanding, label: 'Body Morphs' },
  { id: 'bones', icon: Bone, label: 'Skeleton Rig' },
  { id: 'fingers', icon: Hand, label: 'Hand Posing' },
  { id: 'vrm', icon: FileBox, label: 'VRM Loader' },
  { id: 'materials', icon: Palette, label: 'Materials' },
  { id: 'clothing', icon: Shirt, label: 'Clothing' },
  { id: 'library', icon: Package, label: 'Model Library' },
  { id: 'ai', icon: Wand2, label: 'AI Generator' },
  { id: 'export', icon: Download, label: 'Export' },
];

const bodyMorphCategories = [
  { 
    name: 'Proportions', 
    morphs: [
      { id: 'height', label: 'Height', value: 50 },
      { id: 'weight', label: 'Weight/Mass', value: 50 },
      { id: 'muscle', label: 'Muscle Definition', value: 50 },
      { id: 'bodyFat', label: 'Body Fat', value: 30 },
    ]
  },
  { 
    name: 'Upper Body', 
    morphs: [
      { id: 'shoulders', label: 'Shoulder Width', value: 50 },
      { id: 'chest', label: 'Chest Size', value: 50 },
      { id: 'torso', label: 'Torso Length', value: 50 },
      { id: 'waist', label: 'Waist Width', value: 50 },
      { id: 'arms', label: 'Arm Length', value: 50 },
      { id: 'armMuscle', label: 'Arm Muscle', value: 50 },
    ]
  },
  { 
    name: 'Lower Body', 
    morphs: [
      { id: 'hips', label: 'Hip Width', value: 50 },
      { id: 'legs', label: 'Leg Length', value: 50 },
      { id: 'thighs', label: 'Thigh Size', value: 50 },
      { id: 'calves', label: 'Calf Size', value: 50 },
    ]
  },
  {
    name: 'Age & Demographics',
    morphs: [
      { id: 'age', label: 'Age', value: 35 },
      { id: 'gender', label: 'Gender Mix', value: 50 },
      { id: 'ethnicity1', label: 'Asian', value: 0 },
      { id: 'ethnicity2', label: 'African', value: 0 },
      { id: 'ethnicity3', label: 'Caucasian', value: 100 },
    ]
  }
];

const modelLibrary = [
  { id: 'vrm-base', name: 'VRM Base Human', source: 'CharacterStudio', type: 'VRM', quality: 'High' },
  { id: 'makehuman-realistic', name: 'MakeHuman Realistic', source: 'MakeHuman', type: 'GLB', quality: 'High' },
  { id: 'rpm-male', name: 'Ready Player Me Male', source: 'RPM', type: 'GLB', quality: 'Medium' },
  { id: 'rpm-female', name: 'Ready Player Me Female', source: 'RPM', type: 'GLB', quality: 'Medium' },
  { id: 'mixamo-y', name: 'Mixamo Y-Bot', source: 'Mixamo', type: 'FBX', quality: 'Low' },
  { id: 'daz-genesis', name: 'DAZ Genesis 8', source: 'DAZ3D', type: 'FBX', quality: 'Ultra' },
];

export const Character3DRightPanel = ({ activeTool, morphValues, onMorphChange, vrmLoader }: Character3DRightPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activePanel, setActivePanel] = useState('face');
  const [isHovered, setIsHovered] = useState(false);
  const [selectedBone, setSelectedBone] = useState<string | null>(null);
  
  // Use passed vrmLoader or create fallback (for backward compatibility)
  const internalVrmLoader = useVRMLoader();
  const { isLoading: vrmLoading, loadedVRM, loadVRM, applyExpression, resetExpressions, clearVRM } = vrmLoader || internalVrmLoader;
  
  // Mixamo Animation
  const mixamo = useMixamoAnimation(loadedVRM?.scene);

  // Handle AI-generated morphs
  const handleAIMorphsGenerated = (morphs: Record<string, number>) => {
    Object.entries(morphs).forEach(([id, value]) => {
      onMorphChange(id, value);
    });
  };

  return (
    <div 
      className="relative h-full flex"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Panel Content */}
      <div 
        className={`h-full bg-[hsl(var(--cde-bg-secondary))] border-l border-[hsl(var(--cde-border-subtle))] transition-all duration-300 overflow-hidden ${
          isExpanded && isHovered ? 'w-80 opacity-100' : 'w-0 opacity-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Panel Header */}
          <div className="p-3 border-b border-[hsl(var(--cde-border-subtle))] flex items-center justify-between">
            <span className="text-sm font-medium text-[hsl(var(--cde-text-primary))]">
              {panels.find(p => p.id === activePanel)?.label}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-6 h-6"
              onClick={() => setIsExpanded(false)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden">
            {activePanel === 'face' && (
              <div className="h-full p-3">
                <FaceMorphPanel morphValues={morphValues} onMorphChange={onMorphChange} />
              </div>
            )}

            {activePanel === 'body' && (
              <ScrollArea className="h-full p-3">
                <div className="space-y-4">
                  {bodyMorphCategories.map((category) => (
                    <div key={category.name}>
                      <h4 className="text-xs font-semibold text-[hsl(280_70%_60%)] mb-2 uppercase tracking-wider">
                        {category.name}
                      </h4>
                      <div className="space-y-3">
                        {category.morphs.map((morph) => (
                          <div key={morph.id} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-[hsl(var(--cde-text-muted))]">{morph.label}</span>
                              <span className="text-xs text-[hsl(var(--cde-text-secondary))] tabular-nums">
                                {morphValues[morph.id] ?? morph.value}
                              </span>
                            </div>
                            <Slider
                              value={[morphValues[morph.id] ?? morph.value]}
                              onValueChange={([v]) => onMorphChange(morph.id, v)}
                              max={100}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            {activePanel === 'bones' && (
              <div className="h-full p-3">
                <SkeletonRigPanel 
                  selectedBone={selectedBone} 
                  onBoneSelect={setSelectedBone}
                  animations={mixamo.animations.map(a => ({ name: a.name, duration: a.duration }))}
                  onLoadAnimation={mixamo.loadAnimation}
                  onPlayAnimation={mixamo.playAnimation}
                  onRemoveAnimation={mixamo.removeAnimation}
                  isPlaying={mixamo.isPlaying}
                  onTogglePlayback={mixamo.togglePlayback}
                  currentTime={mixamo.currentTime}
                  duration={mixamo.duration}
                  onSeek={mixamo.seekTo}
                />
              </div>
            )}

            {activePanel === 'fingers' && (
              <div className="h-full p-3">
                <FingerPosePanel />
              </div>
            )}

            {activePanel === 'vrm' && (
              <div className="h-full p-3">
                <VRMLoaderPanel
                  isLoading={vrmLoading}
                  loadedVRM={loadedVRM}
                  onLoadVRM={loadVRM}
                  onApplyExpression={applyExpression}
                  onResetExpressions={resetExpressions}
                  onClearVRM={clearVRM}
                />
              </div>
            )}

            {activePanel === 'library' && (
              <ScrollArea className="h-full p-3">
                <div className="space-y-3">
                  <div className="p-2 rounded-lg bg-[hsl(280_70%_50%)]/10 border border-[hsl(280_70%_50%)]/30">
                    <p className="text-xs text-[hsl(280_70%_60%)]">
                      High-quality open source character models and rigs
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {modelLibrary.map((model) => (
                      <div 
                        key={model.id}
                        className="p-3 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))] hover:border-[hsl(280_70%_50%/0.5)] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-[hsl(var(--cde-text-primary))]">{model.name}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded ${
                            model.quality === 'Ultra' ? 'bg-purple-500/20 text-purple-400' :
                            model.quality === 'High' ? 'bg-green-500/20 text-green-400' :
                            model.quality === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {model.quality}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-[hsl(var(--cde-text-muted))]">{model.source}</p>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[hsl(280_70%_50%)]/20 text-[hsl(280_70%_60%)]">
                            {model.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[hsl(var(--cde-border-subtle))] space-y-2">
                    <p className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">Open Source Resources</p>
                    <a 
                      href="https://github.com/m3-org/characterstudio" 
                      target="_blank" 
                      rel="noopener"
                      className="flex items-center gap-2 p-2 rounded-lg bg-[hsl(var(--cde-bg-primary))] hover:bg-[hsl(280_70%_50%)]/10 transition-colors"
                    >
                      <Globe className="w-4 h-4 text-[hsl(280_70%_60%)]" />
                      <div className="flex-1">
                        <span className="text-xs text-[hsl(var(--cde-text-primary))]">CharacterStudio</span>
                        <p className="text-[10px] text-[hsl(var(--cde-text-muted))]">VRM avatar creator</p>
                      </div>
                    </a>
                    <a 
                      href="https://www.makehumancommunity.org/" 
                      target="_blank" 
                      rel="noopener"
                      className="flex items-center gap-2 p-2 rounded-lg bg-[hsl(var(--cde-bg-primary))] hover:bg-[hsl(280_70%_50%)]/10 transition-colors"
                    >
                      <Globe className="w-4 h-4 text-[hsl(280_70%_60%)]" />
                      <div className="flex-1">
                        <span className="text-xs text-[hsl(var(--cde-text-primary))]">MakeHuman</span>
                        <p className="text-[10px] text-[hsl(var(--cde-text-muted))]">Parametric humans</p>
                      </div>
                    </a>
                    <a 
                      href="https://www.mixamo.com/" 
                      target="_blank" 
                      rel="noopener"
                      className="flex items-center gap-2 p-2 rounded-lg bg-[hsl(var(--cde-bg-primary))] hover:bg-[hsl(280_70%_50%)]/10 transition-colors"
                    >
                      <Globe className="w-4 h-4 text-[hsl(280_70%_60%)]" />
                      <div className="flex-1">
                        <span className="text-xs text-[hsl(var(--cde-text-primary))]">Mixamo</span>
                        <p className="text-[10px] text-[hsl(var(--cde-text-muted))]">Free animations</p>
                      </div>
                    </a>
                    <a 
                      href="https://readyplayer.me/" 
                      target="_blank" 
                      rel="noopener"
                      className="flex items-center gap-2 p-2 rounded-lg bg-[hsl(var(--cde-bg-primary))] hover:bg-[hsl(280_70%_50%)]/10 transition-colors"
                    >
                      <Globe className="w-4 h-4 text-[hsl(280_70%_60%)]" />
                      <div className="flex-1">
                        <span className="text-xs text-[hsl(var(--cde-text-primary))]">Ready Player Me</span>
                        <p className="text-[10px] text-[hsl(var(--cde-text-muted))]">Avatar SDK</p>
                      </div>
                    </a>
                  </div>
                </div>
              </ScrollArea>
            )}

            {activePanel === 'export' && (
              <ScrollArea className="h-full p-3">
                <div className="space-y-3">
                  <p className="text-xs text-[hsl(var(--cde-text-muted))]">Export your character with all morphs and rig</p>
                  
                  <div className="space-y-2">
                    {[
                      { format: 'VRM', desc: 'VRChat/VTuber compatible' },
                      { format: 'GLB/GLTF', desc: 'Web & real-time apps' },
                      { format: 'FBX', desc: 'Game engines & DCC' },
                      { format: 'USD', desc: 'Pixar Universal Scene' },
                    ].map((exp) => (
                      <Button key={exp.format} variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        <div className="text-left">
                          <span className="text-sm">{exp.format}</span>
                          <p className="text-[10px] text-[hsl(var(--cde-text-muted))]">{exp.desc}</p>
                        </div>
                      </Button>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[hsl(var(--cde-border-subtle))]">
                    <p className="text-xs font-medium text-[hsl(var(--cde-text-secondary))] mb-2">Export Options</p>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs text-[hsl(var(--cde-text-muted))]">
                        <input type="checkbox" defaultChecked className="rounded" />
                        Include skeleton rig
                      </label>
                      <label className="flex items-center gap-2 text-xs text-[hsl(var(--cde-text-muted))]">
                        <input type="checkbox" defaultChecked className="rounded" />
                        Bake morph targets
                      </label>
                      <label className="flex items-center gap-2 text-xs text-[hsl(var(--cde-text-muted))]">
                        <input type="checkbox" defaultChecked className="rounded" />
                        Embed textures
                      </label>
                      <label className="flex items-center gap-2 text-xs text-[hsl(var(--cde-text-muted))]">
                        <input type="checkbox" className="rounded" />
                        Draco compression
                      </label>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            )}

            {activePanel === 'ai' && (
              <div className="h-full p-3">
                <AICharacterGenerator onMorphsGenerated={handleAIMorphsGenerated} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Button Bar */}
      <div 
        className={`h-full bg-[hsl(var(--cde-bg-secondary))] border-l border-[hsl(var(--cde-border-subtle))] transition-all duration-300 ${
          isHovered ? 'w-12 opacity-100' : 'w-[10px] opacity-100'
        }`}
      >
        {isHovered ? (
          <div className="p-1.5 space-y-1">
            {!isExpanded && (
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 mb-2"
                onClick={() => setIsExpanded(true)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            
            {panels.map((panel) => {
              const Icon = panel.icon;
              const isActive = activePanel === panel.id;
              return (
                <Button
                  key={panel.id}
                  variant="ghost"
                  size="icon"
                  className={`w-9 h-9 ${
                    isActive 
                      ? 'bg-[hsl(280_70%_50%)]/20 text-[hsl(280_70%_60%)] border border-[hsl(280_70%_50%)]/50' 
                      : 'text-[hsl(var(--cde-text-muted))] hover:text-[hsl(var(--cde-text-primary))]'
                  }`}
                  onClick={() => {
                    setActivePanel(panel.id);
                    setIsExpanded(true);
                  }}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              );
            })}
          </div>
        ) : (
          <div className="w-full h-full bg-[hsl(var(--cde-bg-tertiary))]" />
        )}
      </div>
    </div>
  );
};
