import { useEffect, useState, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Droplets, Sparkles, RotateCcw } from "lucide-react";

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

  const applyBlur = useCallback((
    data: Uint8ClampedArray,
    width: number,
    height: number,
    x: number,
    y: number,
    radius: number,
    blurStrength: number
  ) => {
    const blurRadius = Math.ceil(blurStrength * 3);
    
    for (let py = Math.max(0, y - radius); py < Math.min(height, y + radius); py++) {
      for (let px = Math.max(0, x - radius); px < Math.min(width, x + radius); px++) {
        const dist = Math.sqrt((px - x) ** 2 + (py - y) ** 2);
        if (dist > radius) continue;

        const brushWeight = 1 - (dist / radius);
        const idx = (py * width + px) * 4;

        // Box blur
        let rSum = 0, gSum = 0, bSum = 0, count = 0;
        for (let dy = -blurRadius; dy <= blurRadius; dy++) {
          for (let dx = -blurRadius; dx <= blurRadius; dx++) {
            const nx = px + dx;
            const ny = py + dy;
            if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
            
            const nIdx = (ny * width + nx) * 4;
            rSum += data[nIdx];
            gSum += data[nIdx + 1];
            bSum += data[nIdx + 2];
            count++;
          }
        }

        const blendWeight = brushWeight * (blurStrength / 100) * 0.5;
        data[idx] = Math.round(data[idx] * (1 - blendWeight) + (rSum / count) * blendWeight);
        data[idx + 1] = Math.round(data[idx + 1] * (1 - blendWeight) + (gSum / count) * blendWeight);
        data[idx + 2] = Math.round(data[idx + 2] * (1 - blendWeight) + (bSum / count) * blendWeight);
      }
    }
  }, []);

  const applySharpen = useCallback((
    data: Uint8ClampedArray,
    width: number,
    height: number,
    x: number,
    y: number,
    radius: number,
    sharpenStrength: number
  ) => {
    const factor = 1 + (sharpenStrength / 100);
    
    for (let py = Math.max(1, y - radius); py < Math.min(height - 1, y + radius); py++) {
      for (let px = Math.max(1, x - radius); px < Math.min(width - 1, x + radius); px++) {
        const dist = Math.sqrt((px - x) ** 2 + (py - y) ** 2);
        if (dist > radius) continue;

        const brushWeight = 1 - (dist / radius);
        const idx = (py * width + px) * 4;

        // Unsharp mask kernel
        for (let c = 0; c < 3; c++) {
          const center = data[idx + c];
          const neighbors = 
            data[((py - 1) * width + px) * 4 + c] +
            data[((py + 1) * width + px) * 4 + c] +
            data[(py * width + px - 1) * 4 + c] +
            data[(py * width + px + 1) * 4 + c];
          
          const laplacian = center * 4 - neighbors;
          const sharpened = center + laplacian * factor * brushWeight * 0.2;
          data[idx + c] = Math.min(255, Math.max(0, Math.round(sharpened)));
        }
      }
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!canvas || !isActive) return;
    if (e.buttons !== 1) return;

    const canvasElement = canvas.getElement();
    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;

    const rect = canvasElement.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvasElement.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvasElement.height / rect.height));

    const imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
    const radius = size / 2;

    if (mode === 'blur') {
      applyBlur(imageData.data, canvasElement.width, canvasElement.height, x, y, radius, strength);
    } else if (mode === 'sharpen') {
      applySharpen(imageData.data, canvasElement.width, canvasElement.height, x, y, radius, strength);
    }

    ctx.putImageData(imageData, 0, 0);
    canvas.requestRenderAll();
  }, [canvas, isActive, mode, strength, size, applyBlur, applySharpen]);

  useEffect(() => {
    if (!canvas || !isActive) return;

    const canvasElement = canvas.getElement();
    canvasElement.addEventListener('mousemove', handleMouseMove);
    canvasElement.style.cursor = 'crosshair';

    return () => {
      canvasElement.removeEventListener('mousemove', handleMouseMove);
      canvasElement.style.cursor = 'default';
    };
  }, [canvas, isActive, handleMouseMove]);

  const resetToDefaults = () => {
    setMode('blur');
    setStrength(50);
    setSize(30);
    setHardness(50);
  };

  if (!isActive) return null;

  return (
    <div className="h-full overflow-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        {mode === 'blur' ? (
          <Droplets className="w-5 h-5 text-[hsl(var(--cde-accent-cyan))]" />
        ) : (
          <Sparkles className="w-5 h-5 text-[hsl(var(--cde-accent-purple))]" />
        )}
        <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
          Blur & Sharpen
        </h3>
      </div>

      <div className="space-y-4">
        {/* Mode Selection */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={mode === 'blur' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('blur')}
            className={mode === 'blur' ? 'bg-[hsl(var(--cde-accent-cyan))]' : ''}
          >
            <Droplets className="w-4 h-4 mr-1" />
            Blur
          </Button>
          <Button
            variant={mode === 'sharpen' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('sharpen')}
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Sharpen
          </Button>
          <Button
            variant={mode === 'smudge' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('smudge')}
          >
            Smudge
          </Button>
        </div>

        {/* Strength */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Strength</Label>
            <span className="text-xs text-[hsl(var(--cde-text-muted))]">{strength}%</span>
          </div>
          <Slider
            value={[strength]}
            onValueChange={(values) => setStrength(values[0])}
            min={0}
            max={100}
            step={1}
            className="[&_[role=slider]]:bg-[hsl(var(--cde-accent-purple))]"
          />
        </div>

        {/* Size */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Size</Label>
            <span className="text-xs text-[hsl(var(--cde-text-muted))]">{size}px</span>
          </div>
          <Slider
            value={[size]}
            onValueChange={(values) => setSize(values[0])}
            min={1}
            max={200}
            step={1}
            className="[&_[role=slider]]:bg-[hsl(var(--cde-accent-purple))]"
          />
        </div>

        {/* Hardness */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Hardness</Label>
            <span className="text-xs text-[hsl(var(--cde-text-muted))]">{hardness}%</span>
          </div>
          <Slider
            value={[hardness]}
            onValueChange={(values) => setHardness(values[0])}
            min={0}
            max={100}
            step={1}
            className="[&_[role=slider]]:bg-[hsl(var(--cde-accent-purple))]"
          />
        </div>

        {/* Info */}
        <div className="p-3 bg-[hsl(var(--cde-bg-tertiary))] rounded-lg">
          <p className="text-xs text-[hsl(var(--cde-text-muted))]">
            💡 {mode === 'blur' ? 'Blur softens edges and reduces detail.' : mode === 'sharpen' ? 'Sharpen enhances edges and adds definition.' : 'Smudge blends colors as if finger painting.'}
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
