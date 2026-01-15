import { useEffect, useState, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PaintBucket, RotateCcw, Palette } from "lucide-react";
import { toast } from "sonner";

interface FillToolProps {
  canvas: FabricCanvas | null;
  isActive: boolean;
}

type FillMode = 'solid' | 'gradient' | 'pattern';

export const FillTool = ({ canvas, isActive }: FillToolProps) => {
  const [color, setColor] = useState('#7c3aed');
  const [secondaryColor, setSecondaryColor] = useState('#3b82f6');
  const [tolerance, setTolerance] = useState(32);
  const [opacity, setOpacity] = useState(100);
  const [mode, setMode] = useState<FillMode>('solid');
  const [contiguous, setContiguous] = useState(true);
  const [antiAlias, setAntiAlias] = useState(true);

  const hexToRgb = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  const colorMatch = useCallback((
    data: Uint8ClampedArray,
    idx: number,
    targetR: number,
    targetG: number,
    targetB: number,
    tolerance: number
  ): boolean => {
    const dr = Math.abs(data[idx] - targetR);
    const dg = Math.abs(data[idx + 1] - targetG);
    const db = Math.abs(data[idx + 2] - targetB);
    return (dr + dg + db) / 3 <= tolerance;
  }, []);

  const floodFill = useCallback((
    imageData: ImageData,
    startX: number,
    startY: number,
    fillR: number,
    fillG: number,
    fillB: number,
    fillA: number
  ) => {
    const { width, height, data } = imageData;
    const startIdx = (startY * width + startX) * 4;
    const targetR = data[startIdx];
    const targetG = data[startIdx + 1];
    const targetB = data[startIdx + 2];

    // Don't fill if clicking on same color
    if (Math.abs(targetR - fillR) < 5 && Math.abs(targetG - fillG) < 5 && Math.abs(targetB - fillB) < 5) {
      return;
    }

    const visited = new Uint8Array(width * height);
    const stack: number[] = [startX, startY];
    let filledPixels = 0;

    while (stack.length > 0) {
      const y = stack.pop()!;
      const x = stack.pop()!;
      
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      
      const pixelIdx = y * width + x;
      if (visited[pixelIdx]) continue;
      
      const idx = pixelIdx * 4;
      if (!colorMatch(data, idx, targetR, targetG, targetB, tolerance)) continue;

      visited[pixelIdx] = 1;
      filledPixels++;

      // Apply fill with alpha blending
      const alpha = fillA / 255;
      data[idx] = Math.round(data[idx] * (1 - alpha) + fillR * alpha);
      data[idx + 1] = Math.round(data[idx + 1] * (1 - alpha) + fillG * alpha);
      data[idx + 2] = Math.round(data[idx + 2] * (1 - alpha) + fillB * alpha);

      // Add neighbors
      if (contiguous) {
        stack.push(x - 1, y);
        stack.push(x + 1, y);
        stack.push(x, y - 1);
        stack.push(x, y + 1);
      }
    }

    // Non-contiguous mode - fill all matching pixels
    if (!contiguous) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          if (colorMatch(data, idx, targetR, targetG, targetB, tolerance)) {
            const alpha = fillA / 255;
            data[idx] = Math.round(data[idx] * (1 - alpha) + fillR * alpha);
            data[idx + 1] = Math.round(data[idx + 1] * (1 - alpha) + fillG * alpha);
            data[idx + 2] = Math.round(data[idx + 2] * (1 - alpha) + fillB * alpha);
            filledPixels++;
          }
        }
      }
    }

    return filledPixels;
  }, [tolerance, contiguous, colorMatch]);

  const handleClick = useCallback((e: MouseEvent) => {
    if (!canvas || !isActive) return;

    const canvasElement = canvas.getElement();
    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;

    const rect = canvasElement.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvasElement.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvasElement.height / rect.height));

    if (x < 0 || x >= canvasElement.width || y < 0 || y >= canvasElement.height) return;

    const imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
    const [r, g, b] = hexToRgb(color);
    const a = Math.round(opacity * 2.55);

    const startTime = performance.now();
    const filledPixels = floodFill(imageData, x, y, r, g, b, a);
    const duration = performance.now() - startTime;

    ctx.putImageData(imageData, 0, 0);
    canvas.requestRenderAll();

    if (filledPixels && filledPixels > 0) {
      toast.success(`Filled ${filledPixels.toLocaleString()} pixels in ${duration.toFixed(1)}ms`);
    }
  }, [canvas, isActive, color, opacity, floodFill]);

  useEffect(() => {
    if (!canvas || !isActive) return;

    const canvasElement = canvas.getElement();
    canvasElement.addEventListener('click', handleClick);
    canvasElement.style.cursor = 'crosshair';

    return () => {
      canvasElement.removeEventListener('click', handleClick);
      canvasElement.style.cursor = 'default';
    };
  }, [canvas, isActive, handleClick]);

  const resetToDefaults = () => {
    setColor('#7c3aed');
    setSecondaryColor('#3b82f6');
    setTolerance(32);
    setOpacity(100);
    setMode('solid');
    setContiguous(true);
    setAntiAlias(true);
  };

  // Preset colors
  const presetColors = [
    '#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
    '#ec4899', '#8b5cf6', '#06b6d4', '#000000', '#ffffff'
  ];

  if (!isActive) return null;

  return (
    <div className="h-full overflow-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <PaintBucket className="w-5 h-5 text-[hsl(var(--cde-accent-purple))]" />
        <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
          Paint Bucket Fill
        </h3>
      </div>

      <div className="space-y-4">
        {/* Fill Mode */}
        <div>
          <Label className="text-xs text-[hsl(var(--cde-text-secondary))] mb-2 block">Fill Type</Label>
          <Select value={mode} onValueChange={(v) => setMode(v as FillMode)}>
            <SelectTrigger className="h-8 bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">Solid Color</SelectItem>
              <SelectItem value="gradient">Gradient</SelectItem>
              <SelectItem value="pattern">Pattern</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Color Picker */}
        <div>
          <Label className="text-xs text-[hsl(var(--cde-text-secondary))] mb-2 block">Fill Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-8 p-1 cursor-pointer bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))]"
            />
            <Input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 h-8 bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))] text-sm font-mono"
            />
          </div>
        </div>

        {/* Color Presets */}
        <div>
          <Label className="text-xs text-[hsl(var(--cde-text-secondary))] mb-2 block">Presets</Label>
          <div className="grid grid-cols-5 gap-1.5">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                onClick={() => setColor(presetColor)}
                className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                  color === presetColor 
                    ? 'border-[hsl(var(--cde-accent-purple))] ring-2 ring-[hsl(var(--cde-accent-purple))]/30' 
                    : 'border-[hsl(var(--cde-border-subtle))]'
                }`}
                style={{ backgroundColor: presetColor }}
              />
            ))}
          </div>
        </div>

        {mode === 'gradient' && (
          <div>
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))] mb-2 block">Secondary Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-12 h-8 p-1 cursor-pointer bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))]"
              />
              <Input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="flex-1 h-8 bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))] text-sm font-mono"
              />
            </div>
          </div>
        )}

        {/* Tolerance */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Tolerance</Label>
            <span className="text-xs text-[hsl(var(--cde-text-muted))]">{tolerance}</span>
          </div>
          <Slider
            value={[tolerance]}
            onValueChange={(values) => setTolerance(values[0])}
            min={0}
            max={255}
            step={1}
            className="[&_[role=slider]]:bg-[hsl(var(--cde-accent-purple))]"
          />
        </div>

        {/* Opacity */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Opacity</Label>
            <span className="text-xs text-[hsl(var(--cde-text-muted))]">{opacity}%</span>
          </div>
          <Slider
            value={[opacity]}
            onValueChange={(values) => setOpacity(values[0])}
            min={0}
            max={100}
            step={1}
            className="[&_[role=slider]]:bg-[hsl(var(--cde-accent-purple))]"
          />
        </div>

        {/* Options */}
        <div className="space-y-3 pt-4 border-t border-[hsl(var(--cde-border-subtle))]">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Contiguous</Label>
            <Switch checked={contiguous} onCheckedChange={setContiguous} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Anti-alias</Label>
            <Switch checked={antiAlias} onCheckedChange={setAntiAlias} />
          </div>
        </div>

        {/* Info */}
        <div className="p-3 bg-[hsl(var(--cde-bg-tertiary))] rounded-lg">
          <p className="text-xs text-[hsl(var(--cde-text-muted))]">
            💡 Click to fill areas with similar colors. Adjust tolerance to control how similar colors need to be.
          </p>
        </div>

        {/* Reset Button */}
        <Button onClick={resetToDefaults} variant="outline" className="w-full" size="sm">
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset Settings
        </Button>
      </div>
    </div>
  );
};
