import { useEffect, useState, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sun, Moon, RotateCcw } from "lucide-react";

interface DodgeBurnToolProps {
  canvas: FabricCanvas | null;
  isActive: boolean;
}

type ToolMode = 'dodge' | 'burn';
type RangeMode = 'shadows' | 'midtones' | 'highlights';

export const DodgeBurnTool = ({ canvas, isActive }: DodgeBurnToolProps) => {
  const [mode, setMode] = useState<ToolMode>('dodge');
  const [range, setRange] = useState<RangeMode>('midtones');
  const [exposure, setExposure] = useState(50);
  const [size, setSize] = useState(50);
  const [hardness, setHardness] = useState(50);
  const [protectTones, setProtectTones] = useState(true);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!canvas || !isActive) return;
    if (e.buttons !== 1) return;

    const canvasElement = canvas.getElement();
    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;

    const rect = canvasElement.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvasElement.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvasElement.height / rect.height));

    const radius = size / 2;
    const imageData = ctx.getImageData(
      Math.max(0, x - radius),
      Math.max(0, y - radius),
      Math.min(size, canvasElement.width - x + radius),
      Math.min(size, canvasElement.height - y + radius)
    );
    const data = imageData.data;

    const strength = (exposure / 100) * 0.05;
    const factor = mode === 'dodge' ? (1 + strength) : (1 - strength);

    for (let py = 0; py < imageData.height; py++) {
      for (let px = 0; px < imageData.width; px++) {
        const dx = px - radius;
        const dy = py - radius;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > radius) continue;

        // Hardness falloff
        let brushStrength = 1;
        if (hardness < 100) {
          const softEdge = 1 - (dist / radius);
          const hardnessNorm = hardness / 100;
          brushStrength = Math.pow(softEdge, 2 - hardnessNorm * 2);
        }

        const idx = (py * imageData.width + px) * 4;
        
        // Calculate luminosity
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const luminosity = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

        // Range filtering
        let rangeWeight = 1;
        if (range === 'shadows' && luminosity > 0.33) {
          rangeWeight = Math.max(0, 1 - (luminosity - 0.33) * 3);
        } else if (range === 'highlights' && luminosity < 0.67) {
          rangeWeight = Math.max(0, (luminosity - 0.33) * 3);
        } else if (range === 'midtones') {
          rangeWeight = 1 - Math.abs(luminosity - 0.5) * 2;
        }

        const effectiveStrength = brushStrength * rangeWeight;
        const effectiveFactor = 1 + (factor - 1) * effectiveStrength;

        // Apply dodge/burn
        for (let c = 0; c < 3; c++) {
          data[idx + c] = Math.min(255, Math.max(0, Math.round(data[idx + c] * effectiveFactor)));
        }
      }
    }

    ctx.putImageData(
      imageData,
      Math.max(0, x - radius),
      Math.max(0, y - radius)
    );
    canvas.requestRenderAll();
  }, [canvas, isActive, mode, range, exposure, size, hardness, protectTones]);

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
    setMode('dodge');
    setRange('midtones');
    setExposure(50);
    setSize(50);
    setHardness(50);
    setProtectTones(true);
  };

  if (!isActive) return null;

  return (
    <div className="h-full overflow-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        {mode === 'dodge' ? (
          <Sun className="w-5 h-5 text-[hsl(var(--cde-accent-warning))]" />
        ) : (
          <Moon className="w-5 h-5 text-[hsl(var(--cde-accent-purple))]" />
        )}
        <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
          Dodge & Burn
        </h3>
      </div>

      <div className="space-y-4">
        {/* Mode Toggle */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={mode === 'dodge' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('dodge')}
            className={mode === 'dodge' ? 'bg-[hsl(var(--cde-accent-warning))]' : ''}
          >
            <Sun className="w-4 h-4 mr-1" />
            Dodge
          </Button>
          <Button
            variant={mode === 'burn' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('burn')}
          >
            <Moon className="w-4 h-4 mr-1" />
            Burn
          </Button>
        </div>

        {/* Range */}
        <div>
          <Label className="text-xs text-[hsl(var(--cde-text-secondary))] mb-2 block">Range</Label>
          <Select value={range} onValueChange={(v) => setRange(v as RangeMode)}>
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

        {/* Exposure */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Exposure</Label>
            <span className="text-xs text-[hsl(var(--cde-text-muted))]">{exposure}%</span>
          </div>
          <Slider
            value={[exposure]}
            onValueChange={(values) => setExposure(values[0])}
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
            max={300}
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
            💡 Dodge lightens areas (like light hitting a surface). Burn darkens areas (like shadows). Use range to target specific tones.
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
