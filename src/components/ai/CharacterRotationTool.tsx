import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { RotateCcw, Sparkles, Play, Pause, Image as ImageIcon, ChevronRight } from "lucide-react";

interface CharacterRotationToolProps {
  characterImage?: string;
  characterName?: string;
  onGenerate?: (angles: string[]) => void;
}

const ROTATION_ANGLES = [
  { id: "front", label: "Front", angle: 0, prompt: "front view, facing camera directly" },
  { id: "front-3/4", label: "Front 3/4", angle: 45, prompt: "3/4 front view, slightly turned" },
  { id: "side", label: "Side", angle: 90, prompt: "side profile view" },
  { id: "back-3/4", label: "Back 3/4", angle: 135, prompt: "3/4 back view" },
  { id: "back", label: "Back", angle: 180, prompt: "back view, facing away" },
];

export const CharacterRotationTool = ({ 
  characterImage, 
  characterName = "Character",
  onGenerate 
}: CharacterRotationToolProps) => {
  const [selectedAngles, setSelectedAngles] = useState<string[]>(["front", "front-3/4", "side"]);
  const [currentPreview, setCurrentPreview] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lightingStyle, setLightingStyle] = useState(50);

  const toggleAngle = (id: string) => {
    setSelectedAngles(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const generatePrompt = (angle: typeof ROTATION_ANGLES[0]) => {
    return `${characterName}, ${angle.prompt}, consistent character appearance, same outfit and styling, professional studio lighting at ${lightingStyle}% intensity, dark studio background, photorealistic, cinematic quality, character turnaround sheet style`;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    const prompts = selectedAngles.map(id => {
      const angle = ROTATION_ANGLES.find(a => a.id === id);
      return angle ? generatePrompt(angle) : "";
    });
    onGenerate?.(prompts);
    // Simulate generation time
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 rounded-lg bg-gradient-to-br from-[hsl(262_83%_58%/0.15)] to-transparent border border-[hsl(262_83%_58%/0.3)]">
        <RotateCcw className="w-6 h-6 text-[hsl(262_83%_58%)] mb-2" />
        <h4 className="font-semibold text-[hsl(var(--cde-text-primary))]">Character Rotation</h4>
        <p className="text-xs text-[hsl(var(--cde-text-muted))]">
          Generate multi-angle views with AI consistency
        </p>
      </div>

      {/* Source Image Preview */}
      {characterImage && (
        <div className="aspect-square rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))] overflow-hidden relative">
          <img 
            src={characterImage} 
            alt={characterName}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 text-xs text-white">
            Source: {characterName}
          </div>
        </div>
      )}

      {/* Angle Selection */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">
          Select Angles to Generate
        </label>
        <div className="flex flex-wrap gap-2">
          {ROTATION_ANGLES.map((angle) => (
            <button
              key={angle.id}
              onClick={() => toggleAngle(angle.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedAngles.includes(angle.id)
                  ? "bg-[hsl(262_83%_58%)] text-white"
                  : "bg-[hsl(var(--cde-bg-tertiary))] text-[hsl(var(--cde-text-secondary))] hover:bg-[hsl(var(--cde-bg-tertiary))]/80"
              }`}
            >
              {angle.label} ({angle.angle}°)
            </button>
          ))}
        </div>
      </div>

      {/* Lighting Control */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">
          Lighting Intensity: {lightingStyle}%
        </label>
        <Slider
          value={[lightingStyle]}
          onValueChange={([v]) => setLightingStyle(v)}
          max={100}
          step={5}
          className="w-full"
        />
      </div>

      {/* Generated Previews */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">
            Preview Rotation
          </label>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2"
            onClick={() => setIsAnimating(!isAnimating)}
          >
            {isAnimating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span className="ml-1 text-xs">Animate</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-5 gap-2">
          {ROTATION_ANGLES.map((angle, i) => (
            <div 
              key={angle.id}
              onClick={() => setCurrentPreview(i)}
              className={`aspect-square rounded-lg cursor-pointer transition-all ${
                selectedAngles.includes(angle.id)
                  ? currentPreview === i
                    ? "ring-2 ring-[hsl(262_83%_58%)] bg-[hsl(var(--cde-bg-tertiary))]"
                    : "bg-[hsl(var(--cde-bg-tertiary))] hover:bg-[hsl(var(--cde-bg-tertiary))]/80"
                  : "bg-[hsl(var(--cde-bg-primary))] opacity-40"
              } flex items-center justify-center`}
            >
              <span className="text-[10px] text-[hsl(var(--cde-text-muted))]">{angle.angle}°</span>
            </div>
          ))}
        </div>
      </div>

      {/* Generation Prompts Preview */}
      <ScrollArea className="h-24">
        <div className="text-xs text-[hsl(var(--cde-text-muted))] p-2 bg-[hsl(var(--cde-bg-primary))] rounded-lg font-mono">
          {selectedAngles.length > 0 && ROTATION_ANGLES.find(a => a.id === selectedAngles[0]) && (
            <span>
              {generatePrompt(ROTATION_ANGLES.find(a => a.id === selectedAngles[0])!)}
            </span>
          )}
        </div>
      </ScrollArea>

      {/* Generate Button */}
      <Button 
        className="w-full bg-[hsl(262_83%_58%)] hover:bg-[hsl(262_83%_48%)]"
        onClick={handleGenerate}
        disabled={selectedAngles.length === 0 || isGenerating}
      >
        {isGenerating ? (
          <>
            <Sparkles className="w-4 h-4 mr-2 animate-spin" />
            Generating {selectedAngles.length} Views...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate {selectedAngles.length} Rotation Views
          </>
        )}
      </Button>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 text-xs">
          <ImageIcon className="w-3 h-3 mr-1" />
          Build Sheet
        </Button>
        <Button variant="outline" size="sm" className="flex-1 text-xs">
          <ChevronRight className="w-3 h-3 mr-1" />
          To Timeline
        </Button>
      </div>
    </div>
  );
};
