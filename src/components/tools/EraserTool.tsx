import { useEffect, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush, FabricObject } from "fabric";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Eraser, RotateCcw, Trash2, MousePointer, Pen } from "lucide-react";
import { toast } from "sonner";

interface EraserToolProps {
  canvas: FabricCanvas | null;
  isActive: boolean;
}

type EraserMode = 'brush' | 'object' | 'background';

export const EraserTool = ({ canvas, isActive }: EraserToolProps) => {
  // Per documentation: Size, Opacity, Hardness, Flow, Smoothing, Pressure
  const [size, setSize] = useState(20);
  const [hardness, setHardness] = useState(100);
  const [opacity, setOpacity] = useState(100);
  const [flow, setFlow] = useState(100);
  const [smoothing, setSmoothing] = useState(50);
  const [mode, setMode] = useState<EraserMode>('brush');
  const [pressureSensitive, setPressureSensitive] = useState(true);

  useEffect(() => {
    if (!canvas) return;

    if (isActive && mode === 'brush') {
      canvas.isDrawingMode = true;
      
      const brush = new PencilBrush(canvas);
      brush.width = size;
      
      // Use white color to "erase" with flow and opacity combined
      const effectiveAlpha = (opacity / 100) * (flow / 100);
      brush.color = `rgba(255, 255, 255, ${effectiveAlpha})`;
      brush.strokeLineCap = hardness > 50 ? 'round' : 'square';
      brush.strokeLineJoin = 'round';
      brush.decimate = smoothing > 0 ? Math.max(0.5, smoothing / 100 * 5) : 0;
      
      canvas.freeDrawingBrush = brush;
    } else {
      canvas.isDrawingMode = false;
    }
  }, [canvas, isActive, size, hardness, opacity, flow, smoothing, mode]);

  // Handle object deletion in object mode
  useEffect(() => {
    if (!canvas || !isActive || mode !== 'object') return;

    const handleClick = () => {
      const activeObjects = canvas.getActiveObjects();
      if (activeObjects.length > 0) {
        activeObjects.forEach(obj => canvas.remove(obj));
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        toast.success(`Removed ${activeObjects.length} object(s)`);
      }
    };

    canvas.on('mouse:down', handleClick);
    return () => {
      canvas.off('mouse:down', handleClick);
    };
  }, [canvas, isActive, mode]);

  const resetToDefaults = () => {
    setSize(20);
    setHardness(100);
    setOpacity(100);
    setFlow(100);
    setSmoothing(50);
    setMode('brush');
    setPressureSensitive(true);
    toast.success('Eraser settings reset');
  };

  const eraseAll = () => {
    if (!canvas) return;
    const objects = canvas.getObjects();
    objects.forEach(obj => canvas.remove(obj));
    canvas.requestRenderAll();
    toast.success('Canvas cleared');
  };

  if (!isActive) return null;

  return (
    <div className="h-full overflow-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Eraser className="w-5 h-5 text-[hsl(var(--cde-accent-purple))]" />
        <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
          Eraser Settings
        </h3>
      </div>

      <div className="space-y-4">
        {/* Mode Selection */}
        <div>
          <Label className="text-xs text-[hsl(var(--cde-text-secondary))] mb-2 block">Mode</Label>
          <Select value={mode} onValueChange={(v) => setMode(v as EraserMode)}>
            <SelectTrigger className="h-8 bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="brush">
                <div className="flex items-center gap-2">
                  <Eraser className="w-4 h-4" />
                  Brush Eraser
                </div>
              </SelectItem>
              <SelectItem value="object">
                <div className="flex items-center gap-2">
                  <MousePointer className="w-4 h-4" />
                  Object Eraser
                </div>
              </SelectItem>
              <SelectItem value="background">
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Background Eraser
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {mode === 'brush' && (
          <>
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

            {/* Opacity (0-100%) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Opacity</Label>
                <span className="text-xs font-mono text-[hsl(var(--cde-text-muted))]">{opacity}%</span>
              </div>
              <Slider
                value={[opacity]}
                onValueChange={(values) => setOpacity(values[0])}
                min={0}
                max={100}
                step={1}
                className="[&_[role=slider]]:bg-purple-500"
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

            {/* Flow (1-100%) */}
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
            </div>

            {/* Smoothing (0-100%) */}
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
            </div>

            {/* Pressure Sensitivity */}
            <div className="flex items-center justify-between pt-4 border-t border-[hsl(var(--cde-border-subtle))]">
              <div className="flex items-center gap-2">
                <Pen className="w-4 h-4 text-[hsl(var(--cde-text-muted))]" />
                <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Pressure Sensitivity</Label>
              </div>
              <Switch checked={pressureSensitive} onCheckedChange={setPressureSensitive} />
            </div>

            {/* Eraser Preview */}
            <div className="p-3 bg-[hsl(var(--cde-bg-tertiary))] rounded-lg flex items-center justify-center">
              <div 
                className="rounded-full border-2 border-dashed border-[hsl(var(--cde-border-subtle))] transition-all"
                style={{
                  width: Math.min(size, 80),
                  height: Math.min(size, 80),
                  opacity: opacity / 100,
                }}
              />
            </div>
          </>
        )}

        {mode === 'object' && (
          <div className="p-3 bg-[hsl(var(--cde-bg-tertiary))] rounded-lg">
            <p className="text-xs text-[hsl(var(--cde-text-muted))]">
              💡 Click on objects to delete them. Use Shift+Click to select multiple objects.
            </p>
          </div>
        )}

        {mode === 'background' && (
          <div className="p-3 bg-[hsl(var(--cde-bg-tertiary))] rounded-lg">
            <p className="text-xs text-[hsl(var(--cde-text-muted))]">
              💡 Background eraser uses AI to intelligently remove backgrounds while preserving foreground subjects.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2 pt-4 border-t border-[hsl(var(--cde-border-subtle))]">
          <Button onClick={eraseAll} variant="destructive" className="w-full" size="sm">
            <Trash2 className="w-4 h-4 mr-1" />
            Erase Everything
          </Button>
          <Button onClick={resetToDefaults} variant="outline" className="w-full" size="sm">
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset Settings
          </Button>
        </div>
      </div>
    </div>
  );
};
