import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Upload, Loader2, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AICharacterGeneratorProps {
  onMorphsGenerated: (morphs: Record<string, number>) => void;
}

const quickPresets = [
  { 
    name: 'Heroic Male', 
    description: 'Athletic male, mid-30s, strong jawline, determined expression, military build' 
  },
  { 
    name: 'Elegant Female', 
    description: 'Graceful female, late 20s, high cheekbones, almond eyes, slender athletic build' 
  },
  { 
    name: 'Wise Elder', 
    description: 'Elderly person, 70s, weathered features, kind eyes, slightly stooped posture' 
  },
  { 
    name: 'Young Hero', 
    description: 'Young adult, early 20s, youthful features, athletic build, bright eyes' 
  },
  { 
    name: 'Cyberpunk', 
    description: 'Androgynous, angular features, sharp cheekbones, lean muscular build' 
  },
  { 
    name: 'Fantasy Warrior', 
    description: 'Muscular build, strong features, battle-hardened, broad shoulders' 
  },
];

export const AICharacterGenerator = ({ onMorphsGenerated }: AICharacterGeneratorProps) => {
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastReasoning, setLastReasoning] = useState<string | null>(null);

  const generateMorphs = async (text: string) => {
    if (!text.trim()) {
      toast.error('Please enter a character description');
      return;
    }

    setIsGenerating(true);
    setLastReasoning(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-character-morphs', {
        body: { description: text }
      });

      if (error) {
        console.error('Edge function error:', error);
        toast.error(error.message || 'Failed to generate character');
        return;
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      const { morphs, reasoning } = data;
      
      if (morphs && typeof morphs === 'object') {
        onMorphsGenerated(morphs);
        setLastReasoning(reasoning);
        toast.success('Character morphs generated!');
      } else {
        toast.error('Invalid response from AI');
      }
    } catch (err) {
      console.error('Generate morphs error:', err);
      toast.error('Failed to generate character morphs');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePresetClick = (preset: typeof quickPresets[0]) => {
    setDescription(preset.description);
    generateMorphs(preset.description);
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-3 p-1">
        {/* Main Generator Card */}
        <div className="p-3 rounded-lg bg-gradient-to-br from-[hsl(280_70%_50%)]/20 to-[hsl(280_70%_30%)]/20 border border-[hsl(280_70%_50%)]/30">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[hsl(280_70%_60%)]" />
            <span className="text-sm font-medium text-[hsl(280_70%_60%)]">AI Character Generator</span>
          </div>
          <p className="text-xs text-[hsl(var(--cde-text-muted))] mb-3">
            Generate character morph values from text description using Nano Banana AI
          </p>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your character... e.g., 'Athletic female, early 30s, East Asian features, high cheekbones, almond eyes, determined expression'"
            className="w-full h-24 p-2 rounded-lg bg-[hsl(var(--cde-bg-primary))] border border-[hsl(var(--cde-border-subtle))] text-xs resize-none focus:border-[hsl(280_70%_50%)] focus:outline-none text-[hsl(var(--cde-text-primary))]"
            disabled={isGenerating}
          />
          <div className="flex gap-2 mt-2">
            <Button 
              className="flex-1 bg-[hsl(280_70%_50%)] hover:bg-[hsl(280_70%_40%)]" 
              size="sm"
              onClick={() => generateMorphs(description)}
              disabled={isGenerating || !description.trim()}
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4 mr-2" />
              )}
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
            <Button variant="outline" size="sm" disabled={isGenerating}>
              <Upload className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* AI Reasoning */}
        {lastReasoning && (
          <div className="p-3 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))]">
            <h4 className="text-xs font-medium text-[hsl(280_70%_60%)] mb-2">AI Interpretation</h4>
            <p className="text-xs text-[hsl(var(--cde-text-muted))] leading-relaxed">
              {lastReasoning}
            </p>
          </div>
        )}

        {/* Quick Presets */}
        <div className="p-3 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))]">
          <h4 className="text-xs font-medium text-[hsl(var(--cde-text-secondary))] mb-2">Quick Presets</h4>
          <div className="grid grid-cols-2 gap-2">
            {quickPresets.map((preset) => (
              <Button 
                key={preset.name} 
                variant="ghost" 
                size="sm" 
                className="text-xs justify-start h-auto py-2"
                onClick={() => handlePresetClick(preset)}
                disabled={isGenerating}
              >
                <span className="truncate">{preset.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="p-3 rounded-lg bg-[hsl(var(--cde-bg-primary))] border border-[hsl(var(--cde-border-subtle))]">
          <h4 className="text-xs font-medium text-[hsl(var(--cde-text-secondary))] mb-2">Tips for Best Results</h4>
          <ul className="text-[10px] text-[hsl(var(--cde-text-muted))] space-y-1">
            <li>• Include age, gender, and build type</li>
            <li>• Describe facial features specifically</li>
            <li>• Mention ethnicity for accurate skin tones</li>
            <li>• Add personality traits for expressions</li>
            <li>• Reference known characters for clarity</li>
          </ul>
        </div>
      </div>
    </ScrollArea>
  );
};
