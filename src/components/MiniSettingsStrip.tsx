import { X, Settings2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface MiniSettingsStripProps {
  isOpen: boolean;
  onClose: () => void;
  activeTool: string;
  toolSettings: any;
  onSettingsChange: (settings: any) => void;
}

export const MiniSettingsStrip = ({ 
  isOpen, 
  onClose, 
  activeTool, 
  toolSettings, 
  onSettingsChange 
}: MiniSettingsStripProps) => {
  const updateSetting = (key: string, value: any) => {
    onSettingsChange({ ...toolSettings, [key]: value });
  };

  if (!isOpen) return null;

  const renderBrushSettings = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Settings2 className="w-4 h-4 text-[hsl(var(--cde-accent-purple))]" />
        <span className="text-xs font-semibold text-[hsl(var(--cde-text-primary))]">Brush Tool</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">Size</Label>
          <span className="text-[10px] font-mono text-[hsl(var(--cde-text-primary))]">{toolSettings.brushSize}px</span>
        </div>
        <Slider 
          value={[toolSettings.brushSize]} 
          onValueChange={([value]) => updateSetting('brushSize', value)} 
          max={500} 
          step={1} 
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">Hardness</Label>
          <span className="text-[10px] font-mono text-[hsl(var(--cde-text-primary))]">{toolSettings.brushHardness}%</span>
        </div>
        <Slider 
          value={[toolSettings.brushHardness]} 
          onValueChange={([value]) => updateSetting('brushHardness', value)} 
          max={100} 
          step={1} 
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">Opacity</Label>
          <span className="text-[10px] font-mono text-[hsl(var(--cde-text-primary))]">{toolSettings.brushOpacity}%</span>
        </div>
        <Slider 
          value={[toolSettings.brushOpacity]} 
          onValueChange={([value]) => updateSetting('brushOpacity', value)} 
          max={100} 
          step={1} 
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">Color</Label>
        <Input
          type="color"
          value={toolSettings.color}
          onChange={(e) => updateSetting('color', e.target.value)}
          className="h-10 w-full"
        />
      </div>
    </div>
  );

  return (
    <div 
      className="fixed bottom-12 left-0 right-0 bg-[hsl(var(--cde-bg-secondary))] border-t border-[hsl(var(--cde-border-subtle))] z-50 animate-fade-in"
      style={{ height: '240px' }}
    >
      <div className="h-full overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">Tool Settings</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {(activeTool === 'brush' || activeTool === 'pen') && renderBrushSettings()}
          
          {!['brush', 'pen'].includes(activeTool) && (
            <div className="text-center text-[hsl(var(--cde-text-muted))] py-8">
              <Settings2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs">Select a tool to see settings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
