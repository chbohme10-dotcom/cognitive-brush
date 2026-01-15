import { useEffect, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush, FabricObject } from "fabric";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Eraser, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface EraserToolProps {
  canvas: FabricCanvas | null;
  isActive: boolean;
}

type EraserMode = 'brush' | 'object' | 'background';

export const EraserTool = ({ canvas, isActive }: EraserToolProps) => {
  const [size, setSize] = useState(20);
  const [hardness, setHardness] = useState(100);
  const [opacity, setOpacity] = useState(100);
  const [mode, setMode] = useState<EraserMode>('brush');
  const [pressureSensitive, setPressureSensitive] = useState(true);

  useEffect(() => {
    if (!canvas) return;

    if (isActive && mode === 'brush') {
      canvas.isDrawingMode = true;
      
      const brush = new PencilBrush(canvas);
      brush.width = size;
      // Use white color to "erase" (works on white backgrounds)
      const alpha = opacity / 100;
      brush.color = `rgba(255, 255, 255, ${alpha})`;
      brush.strokeLineCap = hardness > 50 ? 'round' : 'square';
      
      canvas.freeDrawingBrush = brush;
    } else {
      canvas.isDrawingMode = false;
    }
  }, [canvas, isActive, size, hardness, opacity, mode]);

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
    setMode('brush');
    setPressureSensitive(true);
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
              <SelectItem value="brush">Brush Eraser</SelectItem>
              <SelectItem value="object">Object Eraser</SelectItem>
              <SelectItem value="background">Background Eraser</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {mode === 'brush' && (
          <>
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

            {/* Pressure Sensitivity */}
            <div className="flex items-center justify-between">
              <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Pressure Sensitivity</Label>
              <Switch checked={pressureSensitive} onCheckedChange={setPressureSensitive} />
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
