import { useEffect, useState } from "react";
import { Canvas as FabricCanvas, FabricObject } from "fabric";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MousePointer, FlipHorizontal, FlipVertical, RotateCw } from "lucide-react";
import { toast } from "sonner";

interface SelectionToolProps {
  canvas: FabricCanvas | null;
  isActive: boolean;
}

export const SelectionTool = ({ canvas, isActive }: SelectionToolProps) => {
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [featherAmount, setFeatherAmount] = useState(0);
  const [antiAliasing, setAntiAliasing] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [scaleX, setScaleX] = useState(100);
  const [scaleY, setScaleY] = useState(100);
  const [skewX, setSkewX] = useState(0);
  const [skewY, setSkewY] = useState(0);

  useEffect(() => {
    if (!canvas) return;

    const handleSelection = () => {
      const active = canvas.getActiveObject();
      setSelectedObject(active || null);
      
      if (active) {
        setRotation(Math.round(active.angle || 0));
        setScaleX(Math.round((active.scaleX || 1) * 100));
        setScaleY(Math.round((active.scaleY || 1) * 100));
        setSkewX(Math.round(active.skewX || 0));
        setSkewY(Math.round(active.skewY || 0));
      }
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', () => setSelectedObject(null));
    canvas.on('object:modified', handleSelection);

    return () => {
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared');
      canvas.off('object:modified', handleSelection);
    };
  }, [canvas]);

  const applyRotation = (angle: number) => {
    if (!canvas || !selectedObject) return;
    selectedObject.rotate(angle);
    canvas.requestRenderAll();
    setRotation(angle);
  };

  const applyScale = (sx: number, sy: number) => {
    if (!canvas || !selectedObject) return;
    selectedObject.set({
      scaleX: sx / 100,
      scaleY: sy / 100,
    });
    canvas.requestRenderAll();
  };

  const applySkew = (sx: number, sy: number) => {
    if (!canvas || !selectedObject) return;
    selectedObject.set({
      skewX: sx,
      skewY: sy,
    });
    canvas.requestRenderAll();
  };

  const flipHorizontal = () => {
    if (!canvas || !selectedObject) return;
    selectedObject.set({ flipX: !selectedObject.flipX });
    canvas.requestRenderAll();
    toast.success('Flipped horizontally');
  };

  const flipVertical = () => {
    if (!canvas || !selectedObject) return;
    selectedObject.set({ flipY: !selectedObject.flipY });
    canvas.requestRenderAll();
    toast.success('Flipped vertically');
  };

  const resetTransform = () => {
    if (!canvas || !selectedObject) return;
    selectedObject.set({
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      skewX: 0,
      skewY: 0,
      flipX: false,
      flipY: false,
    });
    canvas.requestRenderAll();
    setRotation(0);
    setScaleX(100);
    setScaleY(100);
    setSkewX(0);
    setSkewY(0);
    toast.success('Transform reset');
  };

  if (!isActive) return null;

  return (
    <div className="h-full overflow-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <MousePointer className="w-5 h-5 text-[hsl(var(--cde-accent-purple))]" />
        <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
          Selection & Transform
        </h3>
      </div>

      {!selectedObject ? (
        <div className="p-4 bg-[hsl(var(--cde-bg-tertiary))] rounded-lg text-center">
          <p className="text-xs text-[hsl(var(--cde-text-muted))]">
            Select an object on the canvas to see transform options
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Selection Options */}
          <div className="space-y-3 pb-4 border-b border-[hsl(var(--cde-border-subtle))]">
            <h4 className="text-xs font-semibold text-[hsl(var(--cde-text-secondary))]">
              Selection Options
            </h4>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Feather</Label>
                <span className="text-xs text-[hsl(var(--cde-text-muted))]">{featherAmount}px</span>
              </div>
              <Slider
                value={[featherAmount]}
                onValueChange={(values) => setFeatherAmount(values[0])}
                min={0}
                max={50}
                step={1}
                className="[&_[role=slider]]:bg-[hsl(var(--cde-accent-purple))]"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Anti-aliasing</Label>
              <Switch checked={antiAliasing} onCheckedChange={setAntiAliasing} />
            </div>
          </div>

          {/* Transform Controls */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[hsl(var(--cde-text-secondary))]">
              Transform
            </h4>

            {/* Rotation */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Rotation</Label>
                <span className="text-xs text-[hsl(var(--cde-text-muted))]">{rotation}°</span>
              </div>
              <Slider
                value={[rotation]}
                onValueChange={(values) => applyRotation(values[0])}
                min={-180}
                max={180}
                step={1}
                className="[&_[role=slider]]:bg-[hsl(var(--cde-accent-purple))]"
              />
            </div>

            {/* Scale */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Scale X</Label>
                <span className="text-xs text-[hsl(var(--cde-text-muted))]">{scaleX}%</span>
              </div>
              <Slider
                value={[scaleX]}
                onValueChange={(values) => {
                  setScaleX(values[0]);
                  applyScale(values[0], scaleY);
                }}
                min={10}
                max={300}
                step={1}
                className="[&_[role=slider]]:bg-[hsl(var(--cde-accent-purple))]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Scale Y</Label>
                <span className="text-xs text-[hsl(var(--cde-text-muted))]">{scaleY}%</span>
              </div>
              <Slider
                value={[scaleY]}
                onValueChange={(values) => {
                  setScaleY(values[0]);
                  applyScale(scaleX, values[0]);
                }}
                min={10}
                max={300}
                step={1}
                className="[&_[role=slider]]:bg-[hsl(var(--cde-accent-purple))]"
              />
            </div>

            {/* Skew */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Skew X</Label>
                <span className="text-xs text-[hsl(var(--cde-text-muted))]">{skewX}°</span>
              </div>
              <Slider
                value={[skewX]}
                onValueChange={(values) => {
                  setSkewX(values[0]);
                  applySkew(values[0], skewY);
                }}
                min={-45}
                max={45}
                step={1}
                className="[&_[role=slider]]:bg-[hsl(var(--cde-accent-purple))]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Skew Y</Label>
                <span className="text-xs text-[hsl(var(--cde-text-muted))]">{skewY}°</span>
              </div>
              <Slider
                value={[skewY]}
                onValueChange={(values) => {
                  setSkewY(values[0]);
                  applySkew(skewX, values[0]);
                }}
                min={-45}
                max={45}
                step={1}
                className="[&_[role=slider]]:bg-[hsl(var(--cde-accent-purple))]"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2 pt-4 border-t border-[hsl(var(--cde-border-subtle))]">
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={flipHorizontal} variant="outline" size="sm">
                <FlipHorizontal className="w-4 h-4 mr-1" />
                Flip H
              </Button>
              <Button onClick={flipVertical} variant="outline" size="sm">
                <FlipVertical className="w-4 h-4 mr-1" />
                Flip V
              </Button>
            </div>
            <Button onClick={resetTransform} variant="outline" className="w-full" size="sm">
              <RotateCw className="w-4 h-4 mr-1" />
              Reset Transform
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
