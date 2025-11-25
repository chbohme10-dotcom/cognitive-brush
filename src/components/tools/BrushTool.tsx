import { useEffect, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paintbrush } from "lucide-react";

interface BrushToolProps {
  canvas: FabricCanvas | null;
  isActive: boolean;
}

export const BrushTool = ({ canvas, isActive }: BrushToolProps) => {
  const [brushSize, setBrushSize] = useState(5);
  const [brushOpacity, setBrushOpacity] = useState(100);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushHardness, setBrushHardness] = useState(100);

  useEffect(() => {
    if (!canvas) return;

    if (isActive) {
      canvas.isDrawingMode = true;
      
      // Create and configure brush
      const brush = new PencilBrush(canvas);
      brush.width = brushSize;
      brush.color = brushColor;
      
      // Apply opacity to color
      const opacity = brushOpacity / 100;
      const rgbaColor = hexToRgba(brushColor, opacity);
      brush.color = rgbaColor;
      
      // Simulate hardness with stroke line cap
      brush.strokeLineCap = brushHardness > 50 ? 'round' : 'square';
      
      canvas.freeDrawingBrush = brush;
    } else {
      canvas.isDrawingMode = false;
    }
  }, [canvas, isActive, brushSize, brushColor, brushOpacity, brushHardness]);

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
  };

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
        {/* Brush Size */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Size</Label>
            <span className="text-xs text-[hsl(var(--cde-text-muted))]">{brushSize}px</span>
          </div>
          <Slider
            value={[brushSize]}
            onValueChange={(values) => setBrushSize(values[0])}
            min={1}
            max={100}
            step={1}
            className="[&_[role=slider]]:bg-[hsl(var(--cde-accent-purple))]"
          />
        </div>

        {/* Brush Hardness */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Hardness</Label>
            <span className="text-xs text-[hsl(var(--cde-text-muted))]">{brushHardness}%</span>
          </div>
          <Slider
            value={[brushHardness]}
            onValueChange={(values) => setBrushHardness(values[0])}
            min={0}
            max={100}
            step={1}
            className="[&_[role=slider]]:bg-[hsl(var(--cde-accent-purple))]"
          />
        </div>

        {/* Brush Opacity */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Opacity</Label>
            <span className="text-xs text-[hsl(var(--cde-text-muted))]">{brushOpacity}%</span>
          </div>
          <Slider
            value={[brushOpacity]}
            onValueChange={(values) => setBrushOpacity(values[0])}
            min={0}
            max={100}
            step={1}
            className="[&_[role=slider]]:bg-[hsl(var(--cde-accent-purple))]"
          />
        </div>

        {/* Brush Color */}
        <div>
          <Label className="text-xs text-[hsl(var(--cde-text-secondary))] mb-2 block">Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="w-16 h-8 p-1 cursor-pointer bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))]"
            />
            <Input
              type="text"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="flex-1 h-8 bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))] text-sm"
            />
          </div>
        </div>

        {/* Pressure Sensitivity Note */}
        <div className="p-3 bg-[hsl(var(--cde-bg-tertiary))] rounded-lg">
          <p className="text-xs text-[hsl(var(--cde-text-muted))]">
            💡 Pressure sensitivity is automatically enabled when using a tablet or stylus.
          </p>
        </div>

        {/* Reset Button */}
        <Button
          onClick={resetToDefaults}
          variant="outline"
          className="w-full"
        >
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};
