import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Eye, 
  Smile, 
  Circle, 
  Sparkles, 
  RotateCcw,
  Save,
  Download
} from "lucide-react";

interface FaceMorphPanelProps {
  morphValues: Record<string, number>;
  onMorphChange: (id: string, value: number) => void;
}

const faceMorphCategories = {
  structure: {
    label: "Face Structure",
    icon: User,
    morphs: [
      { id: 'faceWidth', label: 'Face Width', min: 0, max: 100, default: 50 },
      { id: 'faceLength', label: 'Face Length', min: 0, max: 100, default: 50 },
      { id: 'jawWidth', label: 'Jaw Width', min: 0, max: 100, default: 50 },
      { id: 'jawAngle', label: 'Jaw Angle', min: 0, max: 100, default: 50 },
      { id: 'chinLength', label: 'Chin Length', min: 0, max: 100, default: 50 },
      { id: 'chinWidth', label: 'Chin Width', min: 0, max: 100, default: 50 },
      { id: 'chinProtrusion', label: 'Chin Protrusion', min: 0, max: 100, default: 50 },
      { id: 'cheekbones', label: 'Cheekbones', min: 0, max: 100, default: 50 },
      { id: 'cheekFullness', label: 'Cheek Fullness', min: 0, max: 100, default: 50 },
      { id: 'foreheadHeight', label: 'Forehead Height', min: 0, max: 100, default: 50 },
      { id: 'foreheadWidth', label: 'Forehead Width', min: 0, max: 100, default: 50 },
      { id: 'templeWidth', label: 'Temple Width', min: 0, max: 100, default: 50 },
    ]
  },
  eyes: {
    label: "Eyes",
    icon: Eye,
    morphs: [
      { id: 'eyeSize', label: 'Eye Size', min: 0, max: 100, default: 50 },
      { id: 'eyeWidth', label: 'Eye Width', min: 0, max: 100, default: 50 },
      { id: 'eyeHeight', label: 'Eye Height', min: 0, max: 100, default: 50 },
      { id: 'eyeSpacing', label: 'Eye Spacing', min: 0, max: 100, default: 50 },
      { id: 'eyeDepth', label: 'Eye Depth', min: 0, max: 100, default: 50 },
      { id: 'eyeTilt', label: 'Eye Tilt', min: 0, max: 100, default: 50 },
      { id: 'eyelidFold', label: 'Eyelid Fold', min: 0, max: 100, default: 50 },
      { id: 'browHeight', label: 'Brow Height', min: 0, max: 100, default: 50 },
      { id: 'browThickness', label: 'Brow Thickness', min: 0, max: 100, default: 50 },
      { id: 'browArch', label: 'Brow Arch', min: 0, max: 100, default: 50 },
      { id: 'browSpacing', label: 'Brow Spacing', min: 0, max: 100, default: 50 },
      { id: 'irisSize', label: 'Iris Size', min: 0, max: 100, default: 50 },
      { id: 'irisColor', label: 'Iris Color', min: 0, max: 100, default: 50 },
    ]
  },
  nose: {
    label: "Nose",
    icon: Circle,
    morphs: [
      { id: 'noseSize', label: 'Nose Size', min: 0, max: 100, default: 50 },
      { id: 'noseWidth', label: 'Nose Width', min: 0, max: 100, default: 50 },
      { id: 'noseLength', label: 'Nose Length', min: 0, max: 100, default: 50 },
      { id: 'noseBridge', label: 'Nose Bridge', min: 0, max: 100, default: 50 },
      { id: 'noseBridgeWidth', label: 'Bridge Width', min: 0, max: 100, default: 50 },
      { id: 'noseTipSize', label: 'Tip Size', min: 0, max: 100, default: 50 },
      { id: 'noseTipAngle', label: 'Tip Angle', min: 0, max: 100, default: 50 },
      { id: 'nostrilSize', label: 'Nostril Size', min: 0, max: 100, default: 50 },
      { id: 'nostrilFlare', label: 'Nostril Flare', min: 0, max: 100, default: 50 },
      { id: 'noseProtrusion', label: 'Protrusion', min: 0, max: 100, default: 50 },
    ]
  },
  mouth: {
    label: "Mouth & Lips",
    icon: Smile,
    morphs: [
      { id: 'mouthWidth', label: 'Mouth Width', min: 0, max: 100, default: 50 },
      { id: 'mouthHeight', label: 'Mouth Position', min: 0, max: 100, default: 50 },
      { id: 'lipSize', label: 'Lip Size', min: 0, max: 100, default: 50 },
      { id: 'upperLipSize', label: 'Upper Lip Size', min: 0, max: 100, default: 50 },
      { id: 'lowerLipSize', label: 'Lower Lip Size', min: 0, max: 100, default: 50 },
      { id: 'lipProtrusion', label: 'Lip Protrusion', min: 0, max: 100, default: 50 },
      { id: 'lipCurvature', label: 'Lip Curvature', min: 0, max: 100, default: 50 },
      { id: 'philtrumWidth', label: 'Philtrum Width', min: 0, max: 100, default: 50 },
      { id: 'philtrumDepth', label: 'Philtrum Depth', min: 0, max: 100, default: 50 },
      { id: 'mouthCorners', label: 'Mouth Corners', min: 0, max: 100, default: 50 },
    ]
  }
};

const expressionPresets = [
  { id: 'neutral', label: 'Neutral', emoji: '😐' },
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'sad', label: 'Sad', emoji: '😢' },
  { id: 'angry', label: 'Angry', emoji: '😠' },
  { id: 'surprised', label: 'Surprised', emoji: '😮' },
  { id: 'fear', label: 'Fear', emoji: '😨' },
  { id: 'disgust', label: 'Disgust', emoji: '🤢' },
  { id: 'contempt', label: 'Contempt', emoji: '😏' },
];

const visemePresets = [
  { id: 'aa', label: 'AA', desc: '"ah" sound' },
  { id: 'ee', label: 'EE', desc: '"ee" sound' },
  { id: 'ih', label: 'IH', desc: '"ih" sound' },
  { id: 'oh', label: 'OH', desc: '"oh" sound' },
  { id: 'ou', label: 'OU', desc: '"oo" sound' },
  { id: 'ss', label: 'SS', desc: '"s/z" sound' },
  { id: 'th', label: 'TH', desc: '"th" sound' },
  { id: 'ff', label: 'FF', desc: '"f/v" sound' },
  { id: 'dd', label: 'DD', desc: '"d/t" sound' },
  { id: 'kk', label: 'KK', desc: '"k/g" sound' },
  { id: 'nn', label: 'NN', desc: '"n" sound' },
  { id: 'pp', label: 'PP', desc: '"p/b/m" sound' },
  { id: 'rr', label: 'RR', desc: '"r" sound' },
  { id: 'ch', label: 'CH', desc: '"ch/j" sound' },
];

export const FaceMorphPanel = ({ morphValues, onMorphChange }: FaceMorphPanelProps) => {
  const [activeTab, setActiveTab] = useState('structure');

  const resetCategory = (categoryKey: string) => {
    const category = faceMorphCategories[categoryKey as keyof typeof faceMorphCategories];
    category.morphs.forEach(morph => {
      onMorphChange(morph.id, morph.default);
    });
  };

  const resetAll = () => {
    Object.keys(faceMorphCategories).forEach(resetCategory);
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-4 gap-1 p-1 bg-[hsl(var(--cde-bg-tertiary))]">
          {Object.entries(faceMorphCategories).map(([key, cat]) => {
            const Icon = cat.icon;
            return (
              <TabsTrigger 
                key={key} 
                value={key}
                className="text-xs data-[state=active]:bg-[hsl(280_70%_50%)]/20 data-[state=active]:text-[hsl(280_70%_60%)]"
              >
                <Icon className="w-3 h-3 mr-1" />
                {cat.label.split(' ')[0]}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <ScrollArea className="flex-1 mt-2">
          {Object.entries(faceMorphCategories).map(([key, category]) => (
            <TabsContent key={key} value={key} className="mt-0 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[hsl(280_70%_60%)] uppercase">
                  {category.label}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs"
                  onClick={() => resetCategory(key)}
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset
                </Button>
              </div>
              
              <div className="space-y-3">
                {category.morphs.map((morph) => (
                  <div key={morph.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[hsl(var(--cde-text-muted))]">{morph.label}</span>
                      <span className="text-xs text-[hsl(var(--cde-text-secondary))] tabular-nums w-8 text-right">
                        {morphValues[morph.id] ?? morph.default}
                      </span>
                    </div>
                    <Slider
                      value={[morphValues[morph.id] ?? morph.default]}
                      onValueChange={([v]) => onMorphChange(morph.id, v)}
                      min={morph.min}
                      max={morph.max}
                      step={1}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </ScrollArea>
      </Tabs>

      {/* Expression Presets */}
      <div className="border-t border-[hsl(var(--cde-border-subtle))] pt-3 mt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[hsl(280_70%_60%)] uppercase">Expressions</span>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {expressionPresets.map((exp) => (
            <Button
              key={exp.id}
              variant="ghost"
              size="sm"
              className="h-10 flex-col gap-0.5 text-xs hover:bg-[hsl(280_70%_50%)]/20"
            >
              <span className="text-lg">{exp.emoji}</span>
              <span className="text-[9px] text-[hsl(var(--cde-text-muted))]">{exp.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Viseme Presets for Lipsync */}
      <div className="border-t border-[hsl(var(--cde-border-subtle))] pt-3 mt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[hsl(280_70%_60%)] uppercase">Visemes (Lipsync)</span>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {visemePresets.map((vis) => (
            <Button
              key={vis.id}
              variant="ghost"
              size="sm"
              className="h-8 text-[10px] font-mono hover:bg-[hsl(280_70%_50%)]/20"
              title={vis.desc}
            >
              {vis.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-[hsl(var(--cde-border-subtle))] pt-3 mt-3 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 text-xs">
          <Save className="w-3 h-3 mr-1" />
          Save Preset
        </Button>
        <Button variant="outline" size="sm" className="flex-1 text-xs">
          <Download className="w-3 h-3 mr-1" />
          Export
        </Button>
        <Button variant="ghost" size="sm" className="text-xs" onClick={resetAll}>
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset All
        </Button>
      </div>
    </div>
  );
};
