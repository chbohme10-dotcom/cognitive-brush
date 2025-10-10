import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Save, 
  Trash2, 
  Copy, 
  Star,
  Sparkles,
  ImagePlus,
  Wand2,
  Crop,
  Move
} from "lucide-react";
import { toast } from "sonner";

interface AIPreset {
  id: string;
  name: string;
  type: 'generate' | 'edit' | 'outpaint' | 'morph';
  config: any;
  isFavorite: boolean;
  useCount: number;
}

const defaultPresets: AIPreset[] = [
  {
    id: 'preset-1',
    name: 'Portrait Enhancement',
    type: 'edit',
    config: { prompt: 'Enhance facial details, improve skin tone, professional lighting' },
    isFavorite: true,
    useCount: 45
  },
  {
    id: 'preset-2',
    name: 'Background Removal',
    type: 'edit',
    config: { prompt: 'Remove background, transparent PNG output' },
    isFavorite: true,
    useCount: 89
  },
  {
    id: 'preset-3',
    name: 'Stylize Realistic',
    type: 'generate',
    config: { prompt: 'Photorealistic style, 8K, highly detailed' },
    isFavorite: false,
    useCount: 23
  },
  {
    id: 'preset-4',
    name: 'Extend Canvas',
    type: 'outpaint',
    config: { direction: 'all', amount: 512 },
    isFavorite: false,
    useCount: 12
  }
];

export const AIPresetLibrary = () => {
  const [presets, setPresets] = useState<AIPreset[]>(defaultPresets);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>('all');

  const filteredPresets = presets.filter(preset => {
    const matchesSearch = preset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || preset.type === filterType;
    return matchesSearch && matchesType;
  });

  const toggleFavorite = (id: string) => {
    setPresets(presets.map(p => 
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    ));
  };

  const deletePreset = (id: string) => {
    setPresets(presets.filter(p => p.id !== id));
    toast.success("Preset deleted");
  };

  const duplicatePreset = (preset: AIPreset) => {
    const newPreset = {
      ...preset,
      id: `preset-${Date.now()}`,
      name: `${preset.name} (Copy)`,
      useCount: 0
    };
    setPresets([newPreset, ...presets]);
    toast.success("Preset duplicated");
  };

  const applyPreset = (preset: AIPreset) => {
    setPresets(presets.map(p => 
      p.id === preset.id ? { ...p, useCount: p.useCount + 1 } : p
    ));
    toast.success(`Applied preset: ${preset.name}`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'generate': return <ImagePlus className="w-3 h-3" />;
      case 'edit': return <Wand2 className="w-3 h-3" />;
      case 'outpaint': return <Crop className="w-3 h-3" />;
      case 'morph': return <Move className="w-3 h-3" />;
      default: return <Sparkles className="w-3 h-3" />;
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 p-4">
      <div className="space-y-2">
        <Input
          placeholder="Search presets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
        
        <div className="flex gap-2">
          {['all', 'generate', 'edit', 'outpaint', 'morph'].map((type) => (
            <Button
              key={type}
              size="sm"
              variant={filterType === type ? 'default' : 'outline'}
              onClick={() => setFilterType(type)}
              className={filterType === type ? 'cde-gradient-primary' : ''}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="grid grid-cols-2 gap-3">
          {filteredPresets.map((preset) => (
            <div
              key={preset.id}
              className="p-3 border border-[hsl(var(--cde-border-subtle))] rounded-lg bg-[hsl(var(--cde-bg-tertiary))] hover:bg-[hsl(var(--cde-bg-tertiary))]/80 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(preset.type)}
                  <span className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
                    {preset.name}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleFavorite(preset.id)}
                  className="h-6 w-6 p-0"
                >
                  <Star 
                    className={`w-3 h-3 ${preset.isFavorite ? 'fill-[hsl(var(--cde-accent-yellow))] text-[hsl(var(--cde-accent-yellow))]' : ''}`}
                  />
                </Button>
              </div>

              <Badge variant="outline" className="text-xs mb-2">
                {preset.type}
              </Badge>

              <div className="text-xs text-[hsl(var(--cde-text-muted))] mb-3">
                Used {preset.useCount} times
              </div>

              <div className="flex gap-1">
                <Button
                  size="sm"
                  onClick={() => applyPreset(preset)}
                  className="flex-1 h-7 text-xs cde-gradient-primary"
                >
                  Apply
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => duplicatePreset(preset)}
                  className="h-7 w-7 p-0"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deletePreset(preset.id)}
                  className="h-7 w-7 p-0"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Button className="w-full cde-gradient-primary">
        <Save className="w-4 h-4 mr-2" />
        Save Current Settings as Preset
      </Button>
    </div>
  );
};
