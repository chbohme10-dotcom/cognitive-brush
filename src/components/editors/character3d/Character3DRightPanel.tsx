import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import {
  Layers,
  Bone,
  Wand2,
  FolderOpen,
  Settings,
  Palette,
  Box,
  Download,
  Upload,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  User,
  Shirt,
  Eye,
  Sparkles,
  Globe,
  Package
} from "lucide-react";

interface Character3DRightPanelProps {
  activeTool: string;
}

const panels = [
  { id: 'hierarchy', icon: Layers, label: 'Hierarchy' },
  { id: 'bones', icon: Bone, label: 'Bones' },
  { id: 'morphs', icon: User, label: 'Morphs' },
  { id: 'materials', icon: Palette, label: 'Materials' },
  { id: 'clothing', icon: Shirt, label: 'Clothing' },
  { id: 'library', icon: Package, label: 'Model Library' },
  { id: 'ai', icon: Wand2, label: 'AI Tools' },
  { id: 'export', icon: Download, label: 'Export' },
];

const morphCategories = [
  { 
    name: 'Body', 
    morphs: [
      { id: 'height', label: 'Height', value: 50 },
      { id: 'weight', label: 'Weight', value: 50 },
      { id: 'muscle', label: 'Muscle', value: 50 },
      { id: 'shoulders', label: 'Shoulder Width', value: 50 },
      { id: 'hips', label: 'Hip Width', value: 50 },
      { id: 'torso', label: 'Torso Length', value: 50 },
      { id: 'legs', label: 'Leg Length', value: 50 },
    ]
  },
  { 
    name: 'Face', 
    morphs: [
      { id: 'faceWidth', label: 'Face Width', value: 50 },
      { id: 'jawWidth', label: 'Jaw Width', value: 50 },
      { id: 'cheekbones', label: 'Cheekbones', value: 50 },
      { id: 'noseSize', label: 'Nose Size', value: 50 },
      { id: 'noseWidth', label: 'Nose Width', value: 50 },
      { id: 'lipSize', label: 'Lip Size', value: 50 },
      { id: 'eyeSize', label: 'Eye Size', value: 50 },
      { id: 'eyeSpacing', label: 'Eye Spacing', value: 50 },
      { id: 'browHeight', label: 'Brow Height', value: 50 },
    ]
  },
  {
    name: 'Age & Gender',
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
  { id: 'vrm-base', name: 'VRM Base Model', source: 'CharacterStudio', type: 'VRM' },
  { id: 'makehuman', name: 'MakeHuman Base', source: 'MakeHuman', type: 'FBX' },
  { id: 'mixamo-y', name: 'Mixamo Y-Bot', source: 'Mixamo', type: 'FBX' },
  { id: 'rpm-male', name: 'Ready Player Me Male', source: 'RPM', type: 'GLB' },
  { id: 'rpm-female', name: 'Ready Player Me Female', source: 'RPM', type: 'GLB' },
];

export const Character3DRightPanel = ({ activeTool }: Character3DRightPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activePanel, setActivePanel] = useState('morphs');
  const [isHovered, setIsHovered] = useState(false);
  const [morphValues, setMorphValues] = useState<Record<string, number>>({});

  const updateMorph = (id: string, value: number) => {
    setMorphValues(prev => ({ ...prev, [id]: value }));
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
          <ScrollArea className="flex-1">
            {activePanel === 'morphs' && (
              <div className="p-3 space-y-4">
                {morphCategories.map((category) => (
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
                            onValueChange={([v]) => updateMorph(morph.id, v)}
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
            )}

            {activePanel === 'library' && (
              <div className="p-3 space-y-3">
                <p className="text-xs text-[hsl(var(--cde-text-muted))]">
                  Open source character models and assets
                </p>
                
                <div className="space-y-2">
                  {modelLibrary.map((model) => (
                    <div 
                      key={model.id}
                      className="p-3 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))] hover:border-[hsl(280_70%_50%/0.5)] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[hsl(var(--cde-text-primary))]">{model.name}</p>
                          <p className="text-xs text-[hsl(var(--cde-text-muted))]">{model.source}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[hsl(280_70%_50%)]/20 text-[hsl(280_70%_60%)]">
                          {model.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[hsl(var(--cde-border-subtle))] space-y-2">
                  <p className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">External Resources</p>
                  <a 
                    href="https://github.com/m3-org/characterstudio" 
                    target="_blank" 
                    rel="noopener"
                    className="flex items-center gap-2 p-2 rounded-lg bg-[hsl(var(--cde-bg-primary))] hover:bg-[hsl(280_70%_50%)]/10 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-[hsl(280_70%_60%)]" />
                    <span className="text-xs text-[hsl(var(--cde-text-muted))]">CharacterStudio (VRM)</span>
                  </a>
                  <a 
                    href="https://www.makehumancommunity.org/" 
                    target="_blank" 
                    rel="noopener"
                    className="flex items-center gap-2 p-2 rounded-lg bg-[hsl(var(--cde-bg-primary))] hover:bg-[hsl(280_70%_50%)]/10 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-[hsl(280_70%_60%)]" />
                    <span className="text-xs text-[hsl(var(--cde-text-muted))]">MakeHuman Community</span>
                  </a>
                  <a 
                    href="https://www.mixamo.com/" 
                    target="_blank" 
                    rel="noopener"
                    className="flex items-center gap-2 p-2 rounded-lg bg-[hsl(var(--cde-bg-primary))] hover:bg-[hsl(280_70%_50%)]/10 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-[hsl(280_70%_60%)]" />
                    <span className="text-xs text-[hsl(var(--cde-text-muted))]">Mixamo Animations</span>
                  </a>
                </div>
              </div>
            )}

            {activePanel === 'bones' && (
              <div className="p-3 space-y-3">
                <div className="p-3 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))]">
                  <h4 className="text-xs font-medium text-[hsl(var(--cde-text-secondary))] mb-2">Skeleton</h4>
                  <div className="space-y-1 text-xs text-[hsl(var(--cde-text-muted))]">
                    <div className="flex items-center gap-2">
                      <Bone className="w-3 h-3" />
                      <span>Root</span>
                    </div>
                    <div className="ml-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <Bone className="w-3 h-3" />
                        <span>Hips</span>
                      </div>
                      <div className="ml-4 space-y-1">
                        <div className="flex items-center gap-2"><Bone className="w-3 h-3" /><span>Spine</span></div>
                        <div className="ml-4">
                          <div className="flex items-center gap-2"><Bone className="w-3 h-3" /><span>Chest</span></div>
                          <div className="ml-4">
                            <div className="flex items-center gap-2"><Bone className="w-3 h-3" /><span>Neck</span></div>
                            <div className="flex items-center gap-2"><Bone className="w-3 h-3" /><span>Head</span></div>
                            <div className="flex items-center gap-2"><Bone className="w-3 h-3" /><span>LeftShoulder</span></div>
                            <div className="flex items-center gap-2"><Bone className="w-3 h-3" /><span>RightShoulder</span></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2"><Bone className="w-3 h-3" /><span>LeftUpLeg</span></div>
                        <div className="flex items-center gap-2"><Bone className="w-3 h-3" /><span>RightUpLeg</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePanel === 'export' && (
              <div className="p-3 space-y-3">
                <p className="text-xs text-[hsl(var(--cde-text-muted))]">Export your character</p>
                
                <div className="space-y-2">
                  {['VRM', 'GLB/GLTF', 'FBX', 'OBJ'].map((format) => (
                    <Button key={format} variant="outline" className="w-full justify-start gap-2">
                      <Download className="w-4 h-4" />
                      Export as {format}
                    </Button>
                  ))}
                </div>

                <div className="pt-3 border-t border-[hsl(var(--cde-border-subtle))]">
                  <p className="text-xs font-medium text-[hsl(var(--cde-text-secondary))] mb-2">Export Options</p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs text-[hsl(var(--cde-text-muted))]">
                      <input type="checkbox" defaultChecked className="rounded" />
                      Include animations
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[hsl(var(--cde-text-muted))]">
                      <input type="checkbox" defaultChecked className="rounded" />
                      Embed textures
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[hsl(var(--cde-text-muted))]">
                      <input type="checkbox" className="rounded" />
                      Optimize for web
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activePanel === 'ai' && (
              <div className="p-3 space-y-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-[hsl(280_70%_50%)]/20 to-[hsl(280_70%_30%)]/20 border border-[hsl(280_70%_50%)]/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-[hsl(280_70%_60%)]" />
                    <span className="text-sm font-medium text-[hsl(280_70%_60%)]">AI Character Gen</span>
                  </div>
                  <p className="text-xs text-[hsl(var(--cde-text-muted))] mb-3">
                    Generate character morphs from text description
                  </p>
                  <textarea 
                    placeholder="Describe your character..."
                    className="w-full h-20 p-2 rounded-lg bg-[hsl(var(--cde-bg-primary))] border border-[hsl(var(--cde-border-subtle))] text-xs resize-none"
                  />
                  <Button className="w-full mt-2 bg-[hsl(280_70%_50%)] hover:bg-[hsl(280_70%_40%)]" size="sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Character
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
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
