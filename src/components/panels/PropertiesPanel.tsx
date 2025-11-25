import { Canvas as FabricCanvas } from "fabric";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MagicWandTool } from "@/components/tools/MagicWandTool";
import { MagneticLassoTool } from "@/components/tools/MagneticLassoTool";
import { BrushTool } from "@/components/tools/BrushTool";
import { SelectionTool } from "@/components/tools/SelectionTool";
import { useCanvasLayers } from "@/hooks/useCanvasLayers";

interface PropertiesPanelProps {
  canvas: FabricCanvas | null;
  activeTool?: string;
}

export const PropertiesPanel = ({ canvas, activeTool }: PropertiesPanelProps) => {
  const { layers, updateLayerBlendMode, activeLayerId } = useCanvasLayers(canvas);
  const activeLayer = layers.find(l => l.id === activeLayerId);

  // Show tool-specific settings
  if (activeTool === 'magicWand') {
    return <MagicWandTool canvas={canvas} />;
  }

  if (activeTool === 'magneticLasso') {
    return <MagneticLassoTool canvas={canvas} isActive={true} />;
  }

  if (activeTool === 'brush') {
    return <BrushTool canvas={canvas} isActive={true} />;
  }

  if (activeTool === 'select') {
    return <SelectionTool canvas={canvas} isActive={true} />;
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
            <Select 
              value={activeLayer?.blendMode || 'source-over'} 
              onValueChange={(value) => activeLayer && updateLayerBlendMode(activeLayer.id, value as any)}
            >
              <SelectTrigger className="h-8 bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="source-over">Normal</SelectItem>
                <SelectItem value="multiply">Multiply</SelectItem>
                <SelectItem value="screen">Screen</SelectItem>
                <SelectItem value="overlay">Overlay</SelectItem>
                <SelectItem value="darken">Darken</SelectItem>
                <SelectItem value="lighten">Lighten</SelectItem>
                <SelectItem value="color-dodge">Color Dodge</SelectItem>
                <SelectItem value="color-burn">Color Burn</SelectItem>
                <SelectItem value="hard-light">Hard Light</SelectItem>
                <SelectItem value="soft-light">Soft Light</SelectItem>
                <SelectItem value="difference">Difference</SelectItem>
                <SelectItem value="exclusion">Exclusion</SelectItem>
                <SelectItem value="hue">Hue</SelectItem>
                <SelectItem value="saturation">Saturation</SelectItem>
                <SelectItem value="color">Color</SelectItem>
                <SelectItem value="luminosity">Luminosity</SelectItem>
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
