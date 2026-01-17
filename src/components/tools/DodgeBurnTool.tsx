import { useEffect, useState, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon, RotateCcw, Pen, Shield } from "lucide-react";
import { toast } from "sonner";

interface DodgeBurnToolProps {
  canvas: FabricCanvas | null;
  isActive: boolean;
}

type ToolMode = 'dodge' | 'burn';
type TonalRange = 'shadows' | 'midtones' | 'highlights';

export const DodgeBurnTool = ({ canvas, isActive }: DodgeBurnToolProps) => {
  const [mode, setMode] = useState<ToolMode>('dodge');
  const [range, setRange] = useState<TonalRange>('midtones');
  const [exposure, setExposure] = useState(50);
  const [size, setSize] = useState(30);
  const [hardness, setHardness] = useState(50);
  const [protectTones, setProtectTones] = useState(true);
  const [pressureSensitive, setPressureSensitive] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);

  // Apply dodge/burn effect based on mode and range
  const applyEffect = useCallback((
    data: Uint8ClampedArray,
    idx: number,
    strength: number
  ) => {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    
    // Calculate luminance to determine tonal range
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    
    // Range-based strength multiplier
    let rangeMultiplier = 1;
    switch (range) {
      case 'shadows':
        rangeMultiplier = luminance < 85 ? 1 : luminance < 128 ? 0.5 : 0.1;
        break;
      case 'midtones':
        rangeMultiplier = luminance > 64 && luminance < 192 ? 1 : 0.3;
        break;
      case 'highlights':
        rangeMultiplier = luminance > 170 ? 1 : luminance > 128 ? 0.5 : 0.1;
        break;
    }
    
    const effectStrength = strength * rangeMultiplier * (exposure / 100);
    
    // Apply dodge (lighten) or burn (darken)
    if (mode === 'dodge') {
      data[idx] = Math.min(255, r + (255 - r) * effectStrength);
      data[idx + 1] = Math.min(255, g + (255 - g) * effectStrength);
      data[idx + 2] = Math.min(255, b + (255 - b) * effectStrength);
    } else {
      data[idx] = Math.max(0, r - r * effectStrength);
      data[idx + 1] = Math.max(0, g - g * effectStrength);
      data[idx + 2] = Math.max(0, b - b * effectStrength);
    }
    
    // Protect tones - preserve saturation
    if (protectTones) {
      const newLuminance = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      const saturationFactor = luminance > 0 ? newLuminance / luminance : 1;
      // Mild saturation boost to counteract desaturation
      const satBoost = 1 + (1 - saturationFactor) * 0.3;
      const avgNew = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      data[idx] = Math.min(255, Math.max(0, avgNew + (data[idx] - avgNew) * satBoost));
      data[idx + 1] = Math.min(255, Math.max(0, avgNew + (data[idx + 1] - avgNew) * satBoost));
      data[idx + 2] = Math.min(255, Math.max(0, avgNew + (data[idx + 2] - avgNew) * satBoost));
    }
  }, [mode, range, exposure, protectTones]);

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

    const imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
    const { data, width, height } = imageData;

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const px = x + dx;
        const py = y + dy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > radius || px < 0 || py < 0 || px >= width || py >= height) continue;
        
        // Calculate hardness falloff
        let strength = 0.05;
        if (hardness < 100) {
          const softEdge = 1 - (dist / radius);
          strength *= Math.pow(softEdge, 2 - hardness / 50);
        }
        
        const idx = (py * width + px) * 4;
        applyEffect(data, idx, strength);
      }
    }

    ctx.putImageData(imageData, 0, 0);
    canvas.requestRenderAll();
  }, [canvas, isActive, isDrawing, size, hardness, applyEffect]);

  const handleMouseDown = useCallback(() => {
    setIsDrawing(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
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
    setMode('dodge');
    setRange('midtones');
    setExposure(50);
    setSize(30);
    setHardness(50);
    setProtectTones(true);
    setPressureSensitive(true);
    toast.success('Dodge/Burn settings reset');
  };

  if (!isActive) return null;

  return (
    <div className="h-full overflow-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        {mode === 'dodge' ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-[hsl(var(--cde-accent-purple))]" />
        )}
        <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
          Dodge & Burn
        </h3>
      </div>

      <div className="space-y-4">
        {/* Mode Selection */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={mode === 'dodge' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('dodge')}
            className="flex items-center gap-2"
          >
            <Sun className="w-4 h-4" />
            Dodge
          </Button>
          <Button
            variant={mode === 'burn' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('burn')}
            className="flex items-center gap-2"
          >
            <Moon className="w-4 h-4" />
            Burn
          </Button>
        </div>

        {/* Range Selection */}
        <div>
          <Label className="text-xs text-[hsl(var(--cde-text-secondary))] mb-2 block">Range</Label>
          <Select value={range} onValueChange={(v) => setRange(v as TonalRange)}>
            <SelectTrigger className="h-8 bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shadows">Shadows</SelectItem>
              <SelectItem value="midtones">Midtones</SelectItem>
              <SelectItem value="highlights">Highlights</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Exposure (0-100%) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Exposure</Label>
            <span className="text-xs font-mono text-[hsl(var(--cde-text-muted))]">{exposure}%</span>
          </div>
          <Slider
            value={[exposure]}
            onValueChange={(values) => setExposure(values[0])}
            min={0}
            max={100}
            step={1}
            className="[&_[role=slider]]:bg-yellow-500"
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

        {/* Options */}
        <div className="space-y-3 pt-4 border-t border-[hsl(var(--cde-border-subtle))]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[hsl(var(--cde-text-muted))]" />
              <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Protect Tones</Label>
            </div>
            <Switch checked={protectTones} onCheckedChange={setProtectTones} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pen className="w-4 h-4 text-[hsl(var(--cde-text-muted))]" />
              <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Pressure Sensitivity</Label>
            </div>
            <Switch checked={pressureSensitive} onCheckedChange={setPressureSensitive} />
          </div>
        </div>

        {/* Info */}
        <div className={`p-3 rounded-lg ${mode === 'dodge' ? 'bg-yellow-500/10' : 'bg-purple-500/10'}`}>
          <p className="text-xs text-[hsl(var(--cde-text-muted))]">
            {mode === 'dodge' 
              ? '☀️ Dodge lightens areas, great for adding highlights and lifting shadows.'
              : '🌙 Burn darkens areas, perfect for adding depth and creating shadows.'}
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
