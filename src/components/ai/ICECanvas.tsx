import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  ImagePlus, 
  Lasso, 
  Wand2, 
  Pen, 
  Crop,
  Brain,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

interface PromptLayer {
  id: string;
  title: string;
  imageUrl: string;
  prompt: string;
  negativePrompt: string;
  markups: Markup[];
}

interface Markup {
  id: string;
  type: 'lasso' | 'wand' | 'pen' | 'crop';
  coordinates: any;
  prompt: string;
}

interface ICECanvasProps {
  onGenerate: (composedPrompt: any) => void;
  isGenerating: boolean;
}

export const ICECanvas = ({ onGenerate, isGenerating }: ICECanvasProps) => {
  const [promptLayers, setPromptLayers] = useState<PromptLayer[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [activeMarkupTool, setActiveMarkupTool] = useState<string | null>(null);
  const [cognitiveLoad, setCognitiveLoad] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addPromptLayer = async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    const newLayer: PromptLayer = {
      id: `layer-${Date.now()}`,
      title: file.name,
      imageUrl,
      prompt: "",
      negativePrompt: "",
      markups: []
    };
    setPromptLayers([...promptLayers, newLayer]);
    setSelectedLayer(newLayer.id);
    updateCognitiveLoad([...promptLayers, newLayer]);
  };

  const removeLayer = (layerId: string) => {
    const updated = promptLayers.filter(l => l.id !== layerId);
    setPromptLayers(updated);
    if (selectedLayer === layerId) setSelectedLayer(null);
    updateCognitiveLoad(updated);
  };

  const updateLayer = (layerId: string, updates: Partial<PromptLayer>) => {
    const updated = promptLayers.map(l => 
      l.id === layerId ? { ...l, ...updates } : l
    );
    setPromptLayers(updated);
    updateCognitiveLoad(updated);
  };

  const addMarkup = (type: 'lasso' | 'wand' | 'pen' | 'crop') => {
    if (!selectedLayer) {
      toast.error("Please select a layer first");
      return;
    }

    const layer = promptLayers.find(l => l.id === selectedLayer);
    if (!layer) return;

    const newMarkup: Markup = {
      id: `markup-${Date.now()}`,
      type,
      coordinates: {},
      prompt: ""
    };

    updateLayer(selectedLayer, {
      markups: [...layer.markups, newMarkup]
    });
    
    toast.info(`${type} markup added - draw on canvas to define area`);
  };

  const updateCognitiveLoad = (layers: PromptLayer[]) => {
    let load = 0;
    layers.forEach(layer => {
      load += layer.prompt.length / 100;
      load += layer.negativePrompt.length / 50;
      load += layer.markups.length * 2;
    });
    setCognitiveLoad(Math.min(100, load));
  };

  const analyzePrompt = async () => {
    toast.info("AI analyzing your prompt composition...");
    // This would call an edge function with AI analysis
    setTimeout(() => {
      toast.success("Suggestion: Add more specific details about lighting and mood");
    }, 2000);
  };

  const assemblePrompt = () => {
    const composedPrompt = {
      layers: promptLayers.map(layer => ({
        image: layer.imageUrl,
        prompt: layer.prompt,
        negativePrompt: layer.negativePrompt,
        markups: layer.markups
      })),
      metadata: {
        cognitiveLoad,
        timestamp: new Date().toISOString()
      }
    };
    return composedPrompt;
  };

  const handleGenerate = () => {
    if (promptLayers.length === 0) {
      toast.error("Add at least one reference image");
      return;
    }
    onGenerate(assemblePrompt());
  };

  const currentLayer = promptLayers.find(l => l.id === selectedLayer);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Cognitive Load Indicator */}
      <div className="flex items-center gap-2 p-3 bg-[hsl(var(--cde-bg-tertiary))] rounded-lg">
        <Brain className="w-4 h-4 text-[hsl(var(--cde-accent-purple))]" />
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[hsl(var(--cde-text-secondary))]">Prompt Complexity</span>
            <span className={cognitiveLoad > 80 ? "text-[hsl(var(--cde-accent-red))]" : "text-[hsl(var(--cde-text-primary))]"}>
              {Math.round(cognitiveLoad)}%
            </span>
          </div>
          <div className="h-2 bg-[hsl(var(--cde-bg-primary))] rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${cognitiveLoad > 80 ? 'bg-[hsl(var(--cde-accent-red))]' : 'cde-gradient-primary'}`}
              style={{ width: `${cognitiveLoad}%` }}
            />
          </div>
        </div>
        {cognitiveLoad > 80 && (
          <AlertTriangle className="w-4 h-4 text-[hsl(var(--cde-accent-red))]" />
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
        {/* Prompt Layers Panel */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
              Prompt Layers
            </h3>
            <Button
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="cde-gradient-primary h-8"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  addPromptLayer(e.target.files[0]);
                }
              }}
            />
          </div>

          <ScrollArea className="flex-1 border border-[hsl(var(--cde-border-subtle))] rounded-lg">
            <div className="p-2 space-y-2">
              {promptLayers.map((layer) => (
                <div
                  key={layer.id}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    selectedLayer === layer.id
                      ? "bg-[hsl(var(--cde-accent-purple))] text-white"
                      : "bg-[hsl(var(--cde-bg-tertiary))] hover:bg-[hsl(var(--cde-bg-tertiary))]/80"
                  }`}
                  onClick={() => setSelectedLayer(layer.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium truncate">{layer.title}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLayer(layer.id);
                      }}
                      className="h-5 w-5 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <img 
                    src={layer.imageUrl} 
                    alt={layer.title}
                    className="w-full h-20 object-cover rounded"
                  />
                  {layer.markups.length > 0 && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {layer.markups.length} markup{layer.markups.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Visual Prompting Canvas */}
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
            Visual Prompting Canvas
          </h3>
          
          <div className="flex gap-1 p-2 bg-[hsl(var(--cde-bg-tertiary))] rounded-lg">
            <Button
              size="sm"
              variant={activeMarkupTool === 'lasso' ? 'default' : 'ghost'}
              onClick={() => addMarkup('lasso')}
              className="flex-1"
            >
              <Lasso className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={activeMarkupTool === 'wand' ? 'default' : 'ghost'}
              onClick={() => addMarkup('wand')}
              className="flex-1"
            >
              <Wand2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={activeMarkupTool === 'pen' ? 'default' : 'ghost'}
              onClick={() => addMarkup('pen')}
              className="flex-1"
            >
              <Pen className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={activeMarkupTool === 'crop' ? 'default' : 'ghost'}
              onClick={() => addMarkup('crop')}
              className="flex-1"
            >
              <Crop className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 border-2 border-dashed border-[hsl(var(--cde-border-subtle))] rounded-lg flex items-center justify-center bg-[hsl(var(--cde-bg-secondary))]">
            {currentLayer ? (
              <img 
                src={currentLayer.imageUrl}
                alt="Canvas"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-center text-[hsl(var(--cde-text-muted))]">
                <ImagePlus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select a layer to start marking up</p>
              </div>
            )}
          </div>
        </div>

        {/* Prompt Details Panel */}
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
            Prompt Details
          </h3>

          {currentLayer ? (
            <ScrollArea className="flex-1">
              <div className="space-y-4 pr-2">
                <div>
                  <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Layer Title</Label>
                  <Input
                    value={currentLayer.title}
                    onChange={(e) => updateLayer(currentLayer.id, { title: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Main Prompt</Label>
                  <Textarea
                    value={currentLayer.prompt}
                    onChange={(e) => updateLayer(currentLayer.id, { prompt: e.target.value })}
                    placeholder="Describe what you want..."
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Negative Prompt</Label>
                  <Textarea
                    value={currentLayer.negativePrompt}
                    onChange={(e) => updateLayer(currentLayer.id, { negativePrompt: e.target.value })}
                    placeholder="What to avoid..."
                    className="mt-1 min-h-[60px]"
                  />
                </div>

                {currentLayer.markups.length > 0 && (
                  <div>
                    <Label className="text-xs text-[hsl(var(--cde-text-secondary))] mb-2 block">
                      Markup Prompts
                    </Label>
                    {currentLayer.markups.map((markup) => (
                      <div key={markup.id} className="mb-2 p-2 bg-[hsl(var(--cde-bg-tertiary))] rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {markup.type}
                          </Badge>
                        </div>
                        <Input
                          placeholder="Specific prompt for this area..."
                          className="text-xs"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[hsl(var(--cde-text-muted))] text-sm">
              Select a layer to edit prompts
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={analyzePrompt}
          variant="outline"
          disabled={promptLayers.length === 0}
          className="flex-1"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Analyze Prompt
        </Button>
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || promptLayers.length === 0}
          className="flex-1 cde-gradient-primary"
        >
          {isGenerating ? (
            <>Generating...</>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate from Composition
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
