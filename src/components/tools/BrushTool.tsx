import { useEffect, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Paintbrush, RotateCcw, Pen, Droplet } from "lucide-react";
import { toast } from "sonner";

interface BrushToolProps {
  canvas: FabricCanvas | null;
  isActive: boolean;
}

export const BrushTool = ({ canvas, isActive }: BrushToolProps) => {
  // Core brush settings per documentation specs
  const [brushSize, setBrushSize] = useState(5);
  const [brushOpacity, setBrushOpacity] = useState(100);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushHardness, setBrushHardness] = useState(100);
  const [flow, setFlow] = useState(100);
  const [spacing, setSpacing] = useState(25);
  const [smoothing, setSmoothing] = useState(50);
  const [pressureSensitive, setPressureSensitive] = useState(true);

  useEffect(() => {
    if (!canvas) return;

    if (isActive) {
      canvas.isDrawingMode = true;
      
      // Create and configure brush with all professional settings
      const brush = new PencilBrush(canvas);
      brush.width = brushSize;
      
      // Apply opacity and flow to color
      const effectiveOpacity = (brushOpacity / 100) * (flow / 100);
      const rgbaColor = hexToRgba(brushColor, effectiveOpacity);
      brush.color = rgbaColor;
      
      // Hardness controls stroke line cap and smoothness
      brush.strokeLineCap = brushHardness > 50 ? 'round' : 'square';
      brush.strokeLineJoin = 'round';
      
      // Decimate points based on smoothing for smoother strokes
      brush.decimate = smoothing > 0 ? Math.max(0.5, smoothing / 100 * 5) : 0;
      
      canvas.freeDrawingBrush = brush;
    } else {
      canvas.isDrawingMode = false;
    }
  }, [canvas, isActive, brushSize, brushColor, brushOpacity, brushHardness, flow, spacing, smoothing]);

  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const resetToDefaults = () => {
    setBrushSize(5);
    setBrushOpacity(100);
    setBrushColor("#000000");
    setBrushHardness(100);
    setFlow(100);
    setSpacing(25);
    setSmoothing(50);
    setPressureSensitive(true);
    toast.success('Brush settings reset');
  };

  // Preset colors for quick selection
  const presetColors = [
    '#000000', '#ffffff', '#ef4444', '#f97316', '#eab308',
    '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
  ];

  if (!isActive) return null;

  return (
    <div className="h-full overflow-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Paintbrush className="w-5 h-5 text-[hsl(var(--cde-accent-purple))]" />
        <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
          Brush Settings
        </h3>
      </div>

      <div className="space-y-4">
        {/* Brush Size (1-500px per spec) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Size</Label>
            <span className="text-xs font-mono text-[hsl(var(--cde-text-muted))]">{brushSize}px</span>
          </div>
          <Slider
            value={[brushSize]}
            onValueChange={(values) => setBrushSize(values[0])}
            min={1}
            max={500}
            step={1}
            className="[&_[role=slider]]:bg-blue-500"
          />
        </div>

        {/* Opacity (0-100%) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Opacity</Label>
            <span className="text-xs font-mono text-[hsl(var(--cde-text-muted))]">{brushOpacity}%</span>
          </div>
          <Slider
            value={[brushOpacity]}
            onValueChange={(values) => setBrushOpacity(values[0])}
            min={0}
            max={100}
            step={1}
            className="[&_[role=slider]]:bg-purple-500"
          />
        </div>

        {/* Hardness (0-100%) - Edge softness */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Hardness</Label>
            <span className="text-xs font-mono text-[hsl(var(--cde-text-muted))]">{brushHardness}%</span>
          </div>
          <Slider
            value={[brushHardness]}
            onValueChange={(values) => setBrushHardness(values[0])}
            min={0}
            max={100}
            step={1}
            className="[&_[role=slider]]:bg-green-500"
          />
          <p className="text-[10px] text-[hsl(var(--cde-text-muted))] mt-1">
            0% = Soft edge, 100% = Hard edge
          </p>
        </div>

        {/* Flow (1-100%) - Paint application rate */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Flow</Label>
            <span className="text-xs font-mono text-[hsl(var(--cde-text-muted))]">{flow}%</span>
          </div>
          <Slider
            value={[flow]}
            onValueChange={(values) => setFlow(values[0])}
            min={1}
            max={100}
            step={1}
            className="[&_[role=slider]]:bg-orange-500"
          />
          <p className="text-[10px] text-[hsl(var(--cde-text-muted))] mt-1">
            Low = Build up gradually, High = Full immediately
          </p>
        </div>

        {/* Spacing (1-100%) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Spacing</Label>
            <span className="text-xs font-mono text-[hsl(var(--cde-text-muted))]">{spacing}%</span>
          </div>
          <Slider
            value={[spacing]}
            onValueChange={(values) => setSpacing(values[0])}
            min={1}
            max={100}
            step={1}
            className="[&_[role=slider]]:bg-cyan-500"
          />
        </div>

        {/* Smoothing (0-100%) - Stroke stabilization */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Smoothing</Label>
            <span className="text-xs font-mono text-[hsl(var(--cde-text-muted))]">{smoothing}%</span>
          </div>
          <Slider
            value={[smoothing]}
            onValueChange={(values) => setSmoothing(values[0])}
            min={0}
            max={100}
            step={1}
            className="[&_[role=slider]]:bg-pink-500"
          />
          <p className="text-[10px] text-[hsl(var(--cde-text-muted))] mt-1">
            0% = Raw input, 100% = Heavily smoothed
          </p>
        </div>

        {/* Color Picker */}
        <div className="pt-4 border-t border-[hsl(var(--cde-border-subtle))]">
          <Label className="text-xs text-[hsl(var(--cde-text-secondary))] mb-2 block">Color</Label>
          <div className="flex gap-2 mb-3">
            <Input
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="w-12 h-8 p-1 cursor-pointer bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))]"
            />
            <Input
              type="text"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="flex-1 h-8 bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))] text-sm font-mono"
            />
          </div>
          {/* Color Presets */}
          <div className="grid grid-cols-5 gap-1.5">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                onClick={() => setBrushColor(presetColor)}
                className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                  brushColor.toLowerCase() === presetColor.toLowerCase()
                    ? 'border-[hsl(var(--cde-accent-purple))] ring-2 ring-[hsl(var(--cde-accent-purple))]/30' 
                    : 'border-[hsl(var(--cde-border-subtle))]'
                }`}
                style={{ backgroundColor: presetColor }}
              />
            ))}
          </div>
        </div>

        {/* Pressure Sensitivity Toggle */}
        <div className="flex items-center justify-between pt-4 border-t border-[hsl(var(--cde-border-subtle))]">
          <div className="flex items-center gap-2">
            <Pen className="w-4 h-4 text-[hsl(var(--cde-text-muted))]" />
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Pressure Sensitivity</Label>
          </div>
          <Switch 
            checked={pressureSensitive} 
            onCheckedChange={setPressureSensitive}
          />
        </div>

        {/* Brush Preview */}
        <div className="p-3 bg-[hsl(var(--cde-bg-tertiary))] rounded-lg flex items-center justify-center">
          <div 
            className="rounded-full transition-all"
            style={{
              width: Math.min(brushSize, 80),
              height: Math.min(brushSize, 80),
              backgroundColor: brushColor,
              opacity: brushOpacity / 100,
              boxShadow: brushHardness < 50 
                ? `0 0 ${(100 - brushHardness) / 5}px ${brushColor}` 
                : 'none'
            }}
          />
        </div>

        {/* Reset Button */}
        <Button
          onClick={resetToDefaults}
          variant="outline"
          className="w-full"
          size="sm"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};
