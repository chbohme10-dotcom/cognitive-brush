import { useEffect, useState, useRef, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Stamp, Target, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface CloneStampToolProps {
  canvas: FabricCanvas | null;
  isActive: boolean;
}

interface CloneSource {
  x: number;
  y: number;
  imageData: ImageData | null;
}

export const CloneStampTool = ({ canvas, isActive }: CloneStampToolProps) => {
  const [size, setSize] = useState(30);
  const [hardness, setHardness] = useState(80);
  const [opacity, setOpacity] = useState(100);
  const [aligned, setAligned] = useState(true);
  const [sampleAllLayers, setSampleAllLayers] = useState(true);
  const [source, setSource] = useState<CloneSource | null>(null);
  const [isSettingSource, setIsSettingSource] = useState(true);
  const lastPaintPos = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!canvas || !isActive) return;

    const canvasElement = canvas.getElement();
    const rect = canvasElement.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvasElement.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvasElement.height / rect.height));

    // Alt+Click to set source
    if (e.altKey || isSettingSource) {
      const ctx = canvasElement.getContext('2d');
      if (ctx) {
        setSource({
          x,
          y,
          imageData: ctx.getImageData(0, 0, canvasElement.width, canvasElement.height)
        });
        setIsSettingSource(false);
        toast.success('Clone source set');
      }
      return;
    }

    // Regular click to paint
    if (source && source.imageData) {
      lastPaintPos.current = { x, y };
      paintClone(x, y);
    }
  }, [canvas, isActive, source, isSettingSource]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!canvas || !isActive || !source || isSettingSource) return;
    if (e.buttons !== 1) return; // Only when left mouse is pressed

    const canvasElement = canvas.getElement();
    const rect = canvasElement.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvasElement.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvasElement.height / rect.height));

    paintClone(x, y);
    lastPaintPos.current = { x, y };
  }, [canvas, isActive, source, isSettingSource]);

  const paintClone = useCallback((targetX: number, targetY: number) => {
    if (!canvas || !source || !source.imageData) return;

    const canvasElement = canvas.getElement();
    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;

    const offsetX = targetX - source.x;
    const offsetY = targetY - source.y;
    const radius = size / 2;

    // Get current canvas state
    const currentData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
    const sourceData = source.imageData.data;
    const currentPixels = currentData.data;

    const alpha = opacity / 100;

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > radius) continue;

        // Hardness falloff
        let brushAlpha = alpha;
        if (hardness < 100) {
          const softEdge = 1 - (dist / radius);
          const hardnessNorm = hardness / 100;
          brushAlpha *= Math.pow(softEdge, 2 - hardnessNorm * 2);
        }

        const sourceX = aligned 
          ? source.x + dx 
          : source.x + (targetX - source.x) + dx;
        const sourceY = aligned 
          ? source.y + dy 
          : source.y + (targetY - source.y) + dy;

        const targetPx = targetX + dx;
        const targetPy = targetY + dy;

        if (sourceX < 0 || sourceX >= canvasElement.width) continue;
        if (sourceY < 0 || sourceY >= canvasElement.height) continue;
        if (targetPx < 0 || targetPx >= canvasElement.width) continue;
        if (targetPy < 0 || targetPy >= canvasElement.height) continue;

        const sourceIdx = (Math.floor(sourceY) * canvasElement.width + Math.floor(sourceX)) * 4;
        const targetIdx = (Math.floor(targetPy) * canvasElement.width + Math.floor(targetPx)) * 4;

        // Blend source into target
        for (let c = 0; c < 3; c++) {
          currentPixels[targetIdx + c] = Math.round(
            currentPixels[targetIdx + c] * (1 - brushAlpha) +
            sourceData[sourceIdx + c] * brushAlpha
          );
        }
      }
    }

    ctx.putImageData(currentData, 0, 0);
    canvas.requestRenderAll();
  }, [canvas, source, size, hardness, opacity, aligned]);

  useEffect(() => {
    if (!canvas || !isActive) return;

    const canvasElement = canvas.getElement();
    canvasElement.addEventListener('mousedown', handleMouseDown);
    canvasElement.addEventListener('mousemove', handleMouseMove);

    // Set cursor
    canvasElement.style.cursor = isSettingSource ? 'crosshair' : 'none';

    return () => {
      canvasElement.removeEventListener('mousedown', handleMouseDown);
      canvasElement.removeEventListener('mousemove', handleMouseMove);
      canvasElement.style.cursor = 'default';
    };
  }, [canvas, isActive, handleMouseDown, handleMouseMove, isSettingSource]);

  const resetSource = () => {
    setSource(null);
    setIsSettingSource(true);
  };

  const resetToDefaults = () => {
    setSize(30);
    setHardness(80);
    setOpacity(100);
    setAligned(true);
    setSampleAllLayers(true);
    resetSource();
  };

  if (!isActive) return null;

  return (
    <div className="h-full overflow-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Stamp className="w-5 h-5 text-[hsl(var(--cde-accent-purple))]" />
        <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
          Clone Stamp
        </h3>
      </div>

      <div className="space-y-4">
        {/* Source Status */}
        <div className={`p-3 rounded-lg border ${source ? 'bg-[hsl(var(--cde-accent-success))]/10 border-[hsl(var(--cde-accent-success))]/30' : 'bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))]'}`}>
          <div className="flex items-center gap-2">
            <Target className={`w-4 h-4 ${source ? 'text-[hsl(var(--cde-accent-success))]' : 'text-[hsl(var(--cde-text-muted))]'}`} />
            <span className="text-xs text-[hsl(var(--cde-text-secondary))]">
              {source ? `Source: (${source.x}, ${source.y})` : 'Alt+Click to set source point'}
            </span>
          </div>
          {source && (
            <Button onClick={resetSource} variant="ghost" size="sm" className="mt-2 h-6 text-xs">
              Reset Source
            </Button>
          )}
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
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Aligned</Label>
            <Switch checked={aligned} onCheckedChange={setAligned} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Sample All Layers</Label>
            <Switch checked={sampleAllLayers} onCheckedChange={setSampleAllLayers} />
          </div>
        </div>

        {/* Info */}
        <div className="p-3 bg-[hsl(var(--cde-bg-tertiary))] rounded-lg">
          <p className="text-xs text-[hsl(var(--cde-text-muted))]">
            💡 Hold Alt and click to set the clone source. Then paint to copy from that area.
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
