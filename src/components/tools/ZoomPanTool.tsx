import { useEffect, useState, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Move, 
  RotateCcw,
  Grid,
  Focus
} from "lucide-react";
import { toast } from "sonner";

interface ZoomPanToolProps {
  canvas: FabricCanvas | null;
  isActive: boolean;
  mode: 'zoom' | 'move';
}

export const ZoomPanTool = ({ canvas, isActive, mode }: ZoomPanToolProps) => {
  const [zoom, setZoom] = useState(100);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [gridSize, setGridSize] = useState(10);

  const updateZoom = useCallback((newZoom: number) => {
    if (!canvas) return;
    const clampedZoom = Math.max(10, Math.min(400, newZoom));
    setZoom(clampedZoom);
    
    const center = canvas.getCenter();
    canvas.zoomToPoint(
      new (canvas as any).constructor.Point(center.left, center.top),
      clampedZoom / 100
    );
    canvas.requestRenderAll();
  }, [canvas]);

  const zoomIn = () => updateZoom(zoom + 25);
  const zoomOut = () => updateZoom(zoom - 25);

  const fitToScreen = useCallback(() => {
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    if (objects.length === 0) {
      updateZoom(100);
      return;
    }

    // Get bounding box of all objects
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    objects.forEach(obj => {
      const bounds = obj.getBoundingRect();
      minX = Math.min(minX, bounds.left);
      minY = Math.min(minY, bounds.top);
      maxX = Math.max(maxX, bounds.left + bounds.width);
      maxY = Math.max(maxY, bounds.top + bounds.height);
    });

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    const scaleX = canvasWidth / contentWidth * 0.9;
    const scaleY = canvasHeight / contentHeight * 0.9;
    const newZoom = Math.min(scaleX, scaleY) * 100;

    updateZoom(newZoom);
    toast.success('Fit to screen');
  }, [canvas, updateZoom]);

  const resetView = useCallback(() => {
    if (!canvas) return;
    updateZoom(100);
    setPanX(0);
    setPanY(0);
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.requestRenderAll();
    toast.success('View reset');
  }, [canvas, updateZoom]);

  const centerOnSelection = useCallback(() => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) {
      toast.error('No object selected');
      return;
    }

    const center = activeObject.getCenterPoint();
    const canvasCenter = canvas.getCenter();
    
    canvas.setViewportTransform([
      canvas.getZoom(), 0, 0, canvas.getZoom(),
      canvasCenter.left - center.x * canvas.getZoom(),
      canvasCenter.top - center.y * canvas.getZoom()
    ]);
    canvas.requestRenderAll();
    toast.success('Centered on selection');
  }, [canvas]);

  useEffect(() => {
    if (!canvas) return;

    // Set current zoom from canvas
    const currentZoom = canvas.getZoom() * 100;
    setZoom(Math.round(currentZoom));
  }, [canvas]);

  // Zoom presets
  const zoomPresets = [25, 50, 100, 150, 200, 300, 400];

  if (!isActive) return null;

  return (
    <div className="h-full overflow-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        {mode === 'zoom' ? (
          <ZoomIn className="w-5 h-5 text-[hsl(var(--cde-accent-purple))]" />
        ) : (
          <Move className="w-5 h-5 text-[hsl(var(--cde-accent-purple))]" />
        )}
        <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
          {mode === 'zoom' ? 'Zoom & View' : 'Pan & Navigate'}
        </h3>
      </div>

      <div className="space-y-4">
        {/* Zoom Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Zoom Level</Label>
            <span className="text-xs font-mono text-[hsl(var(--cde-text-muted))]">{zoom}%</span>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={zoomOut}
              disabled={zoom <= 10}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Slider
              value={[zoom]}
              onValueChange={(values) => updateZoom(values[0])}
              min={10}
              max={400}
              step={5}
              className="flex-1 [&_[role=slider]]:bg-[hsl(var(--cde-accent-purple))]"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={zoomIn}
              disabled={zoom >= 400}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Zoom Presets */}
        <div>
          <Label className="text-xs text-[hsl(var(--cde-text-secondary))] mb-2 block">Presets</Label>
          <div className="grid grid-cols-4 gap-1.5">
            {zoomPresets.map(preset => (
              <Button
                key={preset}
                variant={zoom === preset ? 'default' : 'outline'}
                size="sm"
                className="h-7 text-xs"
                onClick={() => updateZoom(preset)}
              >
                {preset}%
              </Button>
            ))}
          </div>
        </div>

        {/* View Actions */}
        <div className="space-y-2 pt-4 border-t border-[hsl(var(--cde-border-subtle))]">
          <Button onClick={fitToScreen} variant="outline" className="w-full" size="sm">
            <Maximize className="w-4 h-4 mr-2" />
            Fit to Screen
          </Button>
          <Button onClick={centerOnSelection} variant="outline" className="w-full" size="sm">
            <Focus className="w-4 h-4 mr-2" />
            Center on Selection
          </Button>
          <Button onClick={resetView} variant="outline" className="w-full" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset View
          </Button>
        </div>

        {/* Grid Snapping */}
        <div className="space-y-3 pt-4 border-t border-[hsl(var(--cde-border-subtle))]">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Snap to Grid</Label>
            <Switch checked={snapToGrid} onCheckedChange={setSnapToGrid} />
          </div>
          
          {snapToGrid && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Grid Size</Label>
                <span className="text-xs text-[hsl(var(--cde-text-muted))]">{gridSize}px</span>
              </div>
              <Slider
                value={[gridSize]}
                onValueChange={(values) => setGridSize(values[0])}
                min={5}
                max={100}
                step={5}
                className="[&_[role=slider]]:bg-[hsl(var(--cde-accent-purple))]"
              />
            </div>
          )}
        </div>

        {/* Keyboard Shortcuts */}
        <div className="p-3 bg-[hsl(var(--cde-bg-tertiary))] rounded-lg space-y-1">
          <p className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">Shortcuts</p>
          <div className="grid grid-cols-2 gap-1 text-xs text-[hsl(var(--cde-text-muted))]">
            <span>Ctrl + +</span><span>Zoom In</span>
            <span>Ctrl + -</span><span>Zoom Out</span>
            <span>Ctrl + 0</span><span>Reset Zoom</span>
            <span>Space + Drag</span><span>Pan Canvas</span>
          </div>
        </div>
      </div>
    </div>
  );
};
