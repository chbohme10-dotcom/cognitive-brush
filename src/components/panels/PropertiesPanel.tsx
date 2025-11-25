import { Canvas as FabricCanvas } from "fabric";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MagicWandTool } from "@/components/tools/MagicWandTool";
import { MagneticLassoTool } from "@/components/tools/MagneticLassoTool";

interface PropertiesPanelProps {
  canvas: FabricCanvas | null;
  activeTool?: string;
}

export const PropertiesPanel = ({ canvas, activeTool }: PropertiesPanelProps) => {
  // Show tool-specific settings
  if (activeTool === 'magicWand') {
    return <MagicWandTool canvas={canvas} />;
  }

  if (activeTool === 'magneticLasso') {
    return <MagneticLassoTool canvas={canvas} isActive={true} />;
  }

  return (
    <div className="h-full overflow-auto p-4 space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))] border-b border-[hsl(var(--cde-border-subtle))] pb-2">
          Transform
        </h3>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">X</Label>
              <Input 
                type="number" 
                defaultValue="0" 
                className="h-8 bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))] text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Y</Label>
              <Input 
                type="number" 
                defaultValue="0" 
                className="h-8 bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))] text-sm"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Width</Label>
              <Input 
                type="number" 
                defaultValue="1920" 
                className="h-8 bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))] text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Height</Label>
              <Input 
                type="number" 
                defaultValue="1080" 
                className="h-8 bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))] text-sm"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))] border-b border-[hsl(var(--cde-border-subtle))] pb-2">
          Appearance
        </h3>
        
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Opacity</Label>
              <span className="text-xs text-[hsl(var(--cde-text-muted))]">100%</span>
            </div>
            <Slider 
              defaultValue={[100]} 
              max={100} 
              step={1}
              className="[&_[role=slider]]:bg-[hsl(var(--cde-accent-purple))]"
            />
          </div>
          
          <div>
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))] mb-2 block">Blend Mode</Label>
            <Select defaultValue="normal">
              <SelectTrigger className="h-8 bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="multiply">Multiply</SelectItem>
                <SelectItem value="screen">Screen</SelectItem>
                <SelectItem value="overlay">Overlay</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))] border-b border-[hsl(var(--cde-border-subtle))] pb-2">
          Effects
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Drop Shadow</Label>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Inner Glow</Label>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">AI Enhancement</Label>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  );
};
