import { useEffect, useState, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RotateCcw, Droplets, Focus, Fingerprint, Pen } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface BlurSharpenToolProps {
  canvas: FabricCanvas | null;
  isActive: boolean;
}

type ToolMode = 'blur' | 'sharpen' | 'smudge';

export const BlurSharpenTool = ({ canvas, isActive }: BlurSharpenToolProps) => {
  const [mode, setMode] = useState<ToolMode>('blur');
  const [strength, setStrength] = useState(50);
  const [size, setSize] = useState(30);
  const [hardness, setHardness] = useState(50);
  const [pressureSensitive, setPressureSensitive] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);

  // Apply box blur to a region
  const applyBlur = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    intensity: number
  ) => {
    const { width, height } = ctx.canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const tempData = new Uint8ClampedArray(data);
    
    const blurRadius = Math.max(1, Math.floor(intensity / 25));
    
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const px = x + dx;
        const py = y + dy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > radius || px < 0 || py < 0 || px >= width || py >= height) continue;
        
        const idx = (py * width + px) * 4;
        let r = 0, g = 0, b = 0, count = 0;
        
        // Sample surrounding pixels for blur
        for (let bdy = -blurRadius; bdy <= blurRadius; bdy++) {
          for (let bdx = -blurRadius; bdx <= blurRadius; bdx++) {
            const bpx = px + bdx;
            const bpy = py + bdy;
            if (bpx >= 0 && bpy >= 0 && bpx < width && bpy < height) {
              const bidx = (bpy * width + bpx) * 4;
              r += tempData[bidx];
              g += tempData[bidx + 1];
              b += tempData[bidx + 2];
              count++;
            }
          }
        }
        
        // Blend based on hardness falloff
        const softEdge = 1 - (dist / radius);
        const blend = Math.pow(softEdge, 2 - hardness / 50) * (strength / 100);
        
        data[idx] = Math.round(data[idx] * (1 - blend) + (r / count) * blend);
        data[idx + 1] = Math.round(data[idx + 1] * (1 - blend) + (g / count) * blend);
        data[idx + 2] = Math.round(data[idx + 2] * (1 - blend) + (b / count) * blend);
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }, [strength, hardness]);

  // Apply sharpening using unsharp mask
  const applySharpen = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number
  ) => {
    const { width, height } = ctx.canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const tempData = new Uint8ClampedArray(data);
    
    const sharpenAmount = strength / 50;
    
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const px = x + dx;
        const py = y + dy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > radius || px < 0 || py < 0 || px >= width || py >= height) continue;
        
        const idx = (py * width + px) * 4;
        
        // Get surrounding pixels for edge detection
        let sumR = 0, sumG = 0, sumB = 0;
        const neighbors = [
          [-1, -1], [0, -1], [1, -1],
          [-1, 0], [1, 0],
          [-1, 1], [0, 1], [1, 1]
        ];
        
        for (const [ndx, ndy] of neighbors) {
          const npx = px + ndx;
          const npy = py + ndy;
          if (npx >= 0 && npy >= 0 && npx < width && npy < height) {
            const nidx = (npy * width + npx) * 4;
            sumR += tempData[nidx];
            sumG += tempData[nidx + 1];
            sumB += tempData[nidx + 2];
          }
        }
        
        const avgR = sumR / 8;
        const avgG = sumG / 8;
        const avgB = sumB / 8;
        
        // Unsharp mask formula
        const softEdge = 1 - (dist / radius);
        const blend = Math.pow(softEdge, 2 - hardness / 50);
        
        data[idx] = Math.min(255, Math.max(0, tempData[idx] + (tempData[idx] - avgR) * sharpenAmount * blend));
        data[idx + 1] = Math.min(255, Math.max(0, tempData[idx + 1] + (tempData[idx + 1] - avgG) * sharpenAmount * blend));
        data[idx + 2] = Math.min(255, Math.max(0, tempData[idx + 2] + (tempData[idx + 2] - avgB) * sharpenAmount * blend));
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }, [strength, hardness]);

  // Apply smudge effect
  const applySmudge = useCallback((
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    radius: number
  ) => {
    const { width, height } = ctx.canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    const smudgeStrength = strength / 100;
    
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > radius) continue;
        
        const srcX = fromX + dx;
        const srcY = fromY + dy;
        const dstX = toX + dx;
        const dstY = toY + dy;
        
        if (srcX < 0 || srcY < 0 || srcX >= width || srcY >= height) continue;
        if (dstX < 0 || dstY < 0 || dstX >= width || dstY >= height) continue;
        
        const srcIdx = (Math.floor(srcY) * width + Math.floor(srcX)) * 4;
        const dstIdx = (Math.floor(dstY) * width + Math.floor(dstX)) * 4;
        
        const softEdge = 1 - (dist / radius);
        const blend = smudgeStrength * Math.pow(softEdge, 2 - hardness / 50);
        
        data[dstIdx] = Math.round(data[dstIdx] * (1 - blend) + data[srcIdx] * blend);
        data[dstIdx + 1] = Math.round(data[dstIdx + 1] * (1 - blend) + data[srcIdx + 1] * blend);
        data[dstIdx + 2] = Math.round(data[dstIdx + 2] * (1 - blend) + data[srcIdx + 2] * blend);
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }, [strength, hardness]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!canvas || !isActive || !isDrawing) return;
    if (e.buttons !== 1) return;

    const canvasElement = canvas.getElement();
    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;

    const rect = canvasElement.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvasElement.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvasElement.height / rect.height));
    const radius = size / 2;

    switch (mode) {
      case 'blur':
        applyBlur(ctx, x, y, radius, strength);
        break;
      case 'sharpen':
        applySharpen(ctx, x, y, radius);
        break;
      case 'smudge':
        if (lastPos) {
          applySmudge(ctx, lastPos.x, lastPos.y, x, y, radius);
        }
        setLastPos({ x, y });
        break;
    }

    canvas.requestRenderAll();
  }, [canvas, isActive, isDrawing, mode, size, strength, lastPos, applyBlur, applySharpen, applySmudge]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!canvas || !isActive) return;
    
    const canvasElement = canvas.getElement();
    const rect = canvasElement.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvasElement.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvasElement.height / rect.height));
    
    setIsDrawing(true);
    setLastPos({ x, y });
  }, [canvas, isActive]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
    setLastPos(null);
  }, []);

  useEffect(() => {
    if (!canvas || !isActive) return;

    const canvasElement = canvas.getElement();
    canvasElement.style.cursor = 'crosshair';
    canvasElement.addEventListener('mousemove', handleMouseMove);
    canvasElement.addEventListener('mousedown', handleMouseDown);
    canvasElement.addEventListener('mouseup', handleMouseUp);
    canvasElement.addEventListener('mouseleave', handleMouseUp);

    return () => {
      canvasElement.style.cursor = 'default';
      canvasElement.removeEventListener('mousemove', handleMouseMove);
      canvasElement.removeEventListener('mousedown', handleMouseDown);
      canvasElement.removeEventListener('mouseup', handleMouseUp);
      canvasElement.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [canvas, isActive, handleMouseMove, handleMouseDown, handleMouseUp]);

  const resetToDefaults = () => {
    setMode('blur');
    setStrength(50);
    setSize(30);
    setHardness(50);
    setPressureSensitive(true);
    toast.success('Blur/Sharpen settings reset');
  };

  const modeButtons = [
    { id: 'blur', icon: Droplets, label: 'Blur', description: 'Softens and reduces detail' },
    { id: 'sharpen', icon: Focus, label: 'Sharpen', description: 'Enhances edge contrast' },
    { id: 'smudge', icon: Fingerprint, label: 'Smudge', description: 'Blends colors along stroke' },
  ] as const;

  if (!isActive) return null;

  return (
    <div className="h-full overflow-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        {mode === 'blur' && <Droplets className="w-5 h-5 text-blue-500" />}
        {mode === 'sharpen' && <Focus className="w-5 h-5 text-orange-500" />}
        {mode === 'smudge' && <Fingerprint className="w-5 h-5 text-purple-500" />}
        <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
          Blur / Sharpen / Smudge
        </h3>
      </div>

      <div className="space-y-4">
        {/* Mode Selection */}
        <div className="grid grid-cols-3 gap-2">
          {modeButtons.map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              variant={mode === id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode(id)}
              className="flex flex-col items-center gap-1 h-14"
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs">{label}</span>
            </Button>
          ))}
        </div>

        {/* Mode Description */}
        <div className="p-2 bg-[hsl(var(--cde-bg-tertiary))] rounded text-xs text-[hsl(var(--cde-text-muted))]">
          {modeButtons.find(m => m.id === mode)?.description}
        </div>

        {/* Strength (0-100%) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Strength</Label>
            <span className="text-xs font-mono text-[hsl(var(--cde-text-muted))]">{strength}%</span>
          </div>
          <Slider
            value={[strength]}
            onValueChange={(values) => setStrength(values[0])}
            min={0}
            max={100}
            step={1}
            className={`[&_[role=slider]]:${mode === 'blur' ? 'bg-blue-500' : mode === 'sharpen' ? 'bg-orange-500' : 'bg-purple-500'}`}
          />
        </div>

        {/* Size (1-500px) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Size</Label>
            <span className="text-xs font-mono text-[hsl(var(--cde-text-muted))]">{size}px</span>
          </div>
          <Slider
            value={[size]}
            onValueChange={(values) => setSize(values[0])}
            min={1}
            max={500}
            step={1}
            className="[&_[role=slider]]:bg-blue-500"
          />
        </div>

        {/* Hardness (0-100%) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Hardness</Label>
            <span className="text-xs font-mono text-[hsl(var(--cde-text-muted))]">{hardness}%</span>
          </div>
          <Slider
            value={[hardness]}
            onValueChange={(values) => setHardness(values[0])}
            min={0}
            max={100}
            step={1}
            className="[&_[role=slider]]:bg-green-500"
          />
        </div>

        {/* Pressure Sensitivity */}
        <div className="flex items-center justify-between pt-4 border-t border-[hsl(var(--cde-border-subtle))]">
          <div className="flex items-center gap-2">
            <Pen className="w-4 h-4 text-[hsl(var(--cde-text-muted))]" />
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Pressure Sensitivity</Label>
          </div>
          <Switch checked={pressureSensitive} onCheckedChange={setPressureSensitive} />
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
