import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { 
  Layers, Sparkles, Plus, X, Image as ImageIcon, 
  Sun, Move, Eye, Settings 
} from "lucide-react";

interface CompositionLayer {
  id: string;
  type: "character" | "background" | "prop";
  name: string;
  imagePath?: string;
  position: { x: number; y: number };
  scale: number;
  opacity: number;
}

interface SceneCompositionToolProps {
  characters?: { id: string; name: string; imagePath: string }[];
  backgrounds?: { id: string; name: string; imagePath: string }[];
  onCompose?: (layers: CompositionLayer[], settings: any) => void;
}

export const SceneCompositionTool = ({ 
  characters = [], 
  backgrounds = [],
  onCompose 
}: SceneCompositionToolProps) => {
  const [layers, setLayers] = useState<CompositionLayer[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [lightingDirection, setLightingDirection] = useState(45);
  const [ambientIntensity, setAmbientIntensity] = useState(60);
  const [isGenerating, setIsGenerating] = useState(false);

  const addLayer = (type: CompositionLayer["type"], item: { id: string; name: string; imagePath?: string }) => {
    const newLayer: CompositionLayer = {
      id: `${type}-${item.id}-${Date.now()}`,
      type,
      name: item.name,
      imagePath: item.imagePath,
      position: { x: 50, y: 50 },
      scale: 100,
      opacity: 100,
    };
    setLayers(prev => [...prev, newLayer]);
    setSelectedLayer(newLayer.id);
  };

  const removeLayer = (id: string) => {
    setLayers(prev => prev.filter(l => l.id !== id));
    if (selectedLayer === id) setSelectedLayer(null);
  };

  const updateLayer = (id: string, updates: Partial<CompositionLayer>) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const selectedLayerData = layers.find(l => l.id === selectedLayer);

  const generateCompositePrompt = () => {
    const bg = layers.find(l => l.type === "background");
    const chars = layers.filter(l => l.type === "character");
    const props = layers.filter(l => l.type === "prop");
    
    let prompt = "";
    if (bg) prompt += `Scene background: ${bg.name}. `;
    if (chars.length) prompt += `Characters: ${chars.map(c => c.name).join(", ")} positioned in scene. `;
    if (props.length) prompt += `Props: ${props.map(p => p.name).join(", ")}. `;
    prompt += `Lighting from ${lightingDirection}° angle, ${ambientIntensity}% ambient intensity. `;
    prompt += "Maintain consistent lighting across all elements, natural composition, cinematic quality, photorealistic.";
    
    return prompt;
  };

  const handleCompose = () => {
    setIsGenerating(true);
    const settings = {
      lightingDirection,
      ambientIntensity,
      prompt: generateCompositePrompt(),
    };
    onCompose?.(layers, settings);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 rounded-lg bg-gradient-to-br from-[hsl(38_92%_50%/0.15)] to-transparent border border-[hsl(38_92%_50%/0.3)]">
        <Layers className="w-6 h-6 text-[hsl(38_92%_50%)] mb-2" />
        <h4 className="font-semibold text-[hsl(var(--cde-text-primary))]">Scene Composition</h4>
        <p className="text-xs text-[hsl(var(--cde-text-muted))]">
          Combine characters with backgrounds using ICE consistency
        </p>
      </div>

      {/* Canvas Preview */}
      <div className="aspect-video rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))] overflow-hidden relative">
        {layers.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-[hsl(var(--cde-text-muted))]">
            <div className="text-center">
              <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">Add layers to compose scene</p>
            </div>
          </div>
        ) : (
          <>
            {/* Layer previews - simplified visual representation */}
            {layers.map((layer, i) => (
              <div
                key={layer.id}
                onClick={() => setSelectedLayer(layer.id)}
                className={`absolute w-12 h-12 rounded border-2 cursor-pointer transition-all ${
                  selectedLayer === layer.id 
                    ? "border-[hsl(38_92%_50%)] shadow-lg" 
                    : "border-[hsl(var(--cde-border-subtle))]"
                } ${
                  layer.type === "background" ? "bg-blue-500/30" :
                  layer.type === "character" ? "bg-green-500/30" : "bg-purple-500/30"
                }`}
                style={{
                  left: `${layer.position.x}%`,
                  top: `${layer.position.y}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: layer.type === "background" ? 1 : i + 2,
                }}
              >
                <span className="absolute inset-0 flex items-center justify-center text-[8px] text-white font-medium">
                  {layer.type.charAt(0).toUpperCase()}
                </span>
              </div>
            ))}
            {/* Lighting indicator */}
            <div 
              className="absolute w-6 h-6 flex items-center justify-center"
              style={{
                left: `${50 + Math.cos(lightingDirection * Math.PI / 180) * 40}%`,
                top: `${50 - Math.sin(lightingDirection * Math.PI / 180) * 30}%`,
              }}
            >
              <Sun className="w-4 h-4 text-yellow-400" />
            </div>
          </>
        )}
      </div>

      {/* Layer List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">
            Layers ({layers.length})
          </label>
        </div>
        
        <ScrollArea className="h-32">
          <div className="space-y-1">
            {layers.map((layer) => (
              <div
                key={layer.id}
                onClick={() => setSelectedLayer(layer.id)}
                className={`p-2 rounded-lg flex items-center gap-2 cursor-pointer transition-all ${
                  selectedLayer === layer.id
                    ? "bg-[hsl(38_92%_50%/0.2)] border border-[hsl(38_92%_50%/0.4)]"
                    : "bg-[hsl(var(--cde-bg-tertiary))] border border-transparent hover:border-[hsl(var(--cde-border-subtle))]"
                }`}
              >
                <div className={`w-3 h-3 rounded ${
                  layer.type === "background" ? "bg-blue-500" :
                  layer.type === "character" ? "bg-green-500" : "bg-purple-500"
                }`} />
                <span className="text-xs flex-1 truncate">{layer.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-5 h-5 opacity-50 hover:opacity-100"
                  onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Add Elements */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs gap-1"
          onClick={() => addLayer("background", { id: "bg", name: "Background" })}
        >
          <Plus className="w-3 h-3" />
          BG
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs gap-1"
          onClick={() => addLayer("character", { id: "char", name: "Character" })}
        >
          <Plus className="w-3 h-3" />
          Char
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs gap-1"
          onClick={() => addLayer("prop", { id: "prop", name: "Prop" })}
        >
          <Plus className="w-3 h-3" />
          Prop
        </Button>
      </div>

      {/* Layer Properties */}
      {selectedLayerData && (
        <div className="p-3 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] space-y-3">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-[hsl(var(--cde-text-muted))]" />
            <span className="text-xs font-medium">{selectedLayerData.name} Properties</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Move className="w-3 h-3 text-[hsl(var(--cde-text-muted))]" />
              <span className="text-[10px] w-8">X</span>
              <Slider
                value={[selectedLayerData.position.x]}
                onValueChange={([v]) => updateLayer(selectedLayerData.id, { position: { ...selectedLayerData.position, x: v } })}
                max={100}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Move className="w-3 h-3 text-[hsl(var(--cde-text-muted))]" />
              <span className="text-[10px] w-8">Y</span>
              <Slider
                value={[selectedLayerData.position.y]}
                onValueChange={([v]) => updateLayer(selectedLayerData.id, { position: { ...selectedLayerData.position, y: v } })}
                max={100}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-3 h-3 text-[hsl(var(--cde-text-muted))]" />
              <span className="text-[10px] w-8">α</span>
              <Slider
                value={[selectedLayerData.opacity]}
                onValueChange={([v]) => updateLayer(selectedLayerData.id, { opacity: v })}
                max={100}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Lighting Controls */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">
          Global Lighting
        </label>
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-[hsl(38_92%_50%)]" />
          <span className="text-[10px] w-10">Dir</span>
          <Slider
            value={[lightingDirection]}
            onValueChange={([v]) => setLightingDirection(v)}
            max={360}
            className="flex-1"
          />
          <span className="text-[10px] w-8">{lightingDirection}°</span>
        </div>
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[hsl(var(--cde-text-muted))]" />
          <span className="text-[10px] w-10">Amb</span>
          <Slider
            value={[ambientIntensity]}
            onValueChange={([v]) => setAmbientIntensity(v)}
            max={100}
            className="flex-1"
          />
          <span className="text-[10px] w-8">{ambientIntensity}%</span>
        </div>
      </div>

      {/* Compose Button */}
      <Button 
        className="w-full bg-[hsl(38_92%_50%)] hover:bg-[hsl(38_92%_40%)] text-black"
        onClick={handleCompose}
        disabled={layers.length === 0 || isGenerating}
      >
        {isGenerating ? (
          <>
            <Sparkles className="w-4 h-4 mr-2 animate-spin" />
            Composing Scene...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Compose with AI
          </>
        )}
      </Button>
    </div>
  );
};
