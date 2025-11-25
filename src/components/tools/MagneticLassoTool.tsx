import { useState, useEffect, useCallback, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { computeEdgeMap, findEdgePath, simplifyPath, pathToSelection, Point, EdgeMapData } from "@/lib/segmentation/MagneticLassoUtils";
import { toast } from "sonner";
import { Undo2, Check, X } from "lucide-react";

interface MagneticLassoToolProps {
  canvas: FabricCanvas | null;
  isActive: boolean;
}

export const MagneticLassoTool = ({ canvas, isActive }: MagneticLassoToolProps) => {
  const [searchRadius, setSearchRadius] = useState(20);
  const [edgeStrength, setEdgeStrength] = useState(0.5);
  const [simplifyTolerance, setSimplifyTolerance] = useState(1.0);
  const [showNodes, setShowNodes] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [nodes, setNodes] = useState<Point[]>([]);
  const [previewPath, setPreviewPath] = useState<Point[]>([]);
  const [edgeMap, setEdgeMap] = useState<EdgeMapData | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>();

  // Initialize edge map when canvas is ready
  useEffect(() => {
    if (!canvas || !isActive) return;

    const canvasElement = canvas.getElement();
    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
    const computed = computeEdgeMap(imageData);
    setEdgeMap(computed);
  }, [canvas, isActive]);

  // Create overlay canvas for drawing
  useEffect(() => {
    if (!canvas || !isActive) return;

    const canvasElement = canvas.getElement();
    const container = canvasElement.parentElement;
    if (!container) return;

    const overlay = document.createElement('canvas');
    overlay.width = canvasElement.width;
    overlay.height = canvasElement.height;
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '1000';
    container.style.position = 'relative';
    container.appendChild(overlay);
    overlayCanvasRef.current = overlay;

    return () => {
      if (overlay.parentElement) {
        overlay.parentElement.removeChild(overlay);
      }
      overlayCanvasRef.current = null;
    };
  }, [canvas, isActive]);

  // Draw overlay
  useEffect(() => {
    if (!overlayCanvasRef.current) return;

    const ctx = overlayCanvasRef.current.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, overlayCanvasRef.current!.width, overlayCanvasRef.current!.height);

      if (isDrawing) {
        const allPoints = [...nodes, ...previewPath];

        // Draw path
        if (allPoints.length > 1) {
          ctx.strokeStyle = 'rgba(0, 217, 255, 0.9)';
          ctx.lineWidth = 2;
          ctx.lineJoin = 'round';
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(allPoints[0].x, allPoints[0].y);
          for (let i = 1; i < allPoints.length; i++) {
            ctx.lineTo(allPoints[i].x, allPoints[i].y);
          }
          ctx.stroke();
        }

        // Draw nodes
        if (showNodes && nodes.length > 0) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.lineWidth = 1;
          nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          });
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDrawing, nodes, previewPath, showNodes]);

  const handleCanvasMouseDown = useCallback((e: MouseEvent) => {
    if (!canvas || !isActive || !edgeMap) return;

    const canvasElement = canvas.getElement();
    const rect = canvasElement.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvasElement.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvasElement.height / rect.height));

    if (e.button === 0) { // Left click
      setIsDrawing(true);
      setNodes([{ x, y }]);
    }
  }, [canvas, isActive, edgeMap]);

  const handleCanvasMouseMove = useCallback((e: MouseEvent) => {
    if (!canvas || !isActive || !edgeMap || !isDrawing || nodes.length === 0) return;

    const canvasElement = canvas.getElement();
    const rect = canvasElement.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvasElement.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvasElement.height / rect.height));

    const lastNode = nodes[nodes.length - 1];
    const path = findEdgePath(lastNode, { x, y }, edgeMap, searchRadius);
    setPreviewPath(path);
  }, [canvas, isActive, edgeMap, isDrawing, nodes, searchRadius]);

  const handleCanvasClick = useCallback((e: MouseEvent) => {
    if (!canvas || !isActive || !edgeMap || !isDrawing) return;

    const canvasElement = canvas.getElement();
    const rect = canvasElement.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvasElement.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvasElement.height / rect.height));

    if (e.button === 0 && nodes.length > 0) { // Left click to add node
      const lastNode = nodes[nodes.length - 1];
      const path = findEdgePath(lastNode, { x, y }, edgeMap, searchRadius);
      setNodes(prev => [...prev, ...path.slice(1)]);
      setPreviewPath([]);
    }
  }, [canvas, isActive, edgeMap, isDrawing, nodes, searchRadius]);

  const handleComplete = useCallback(() => {
    if (!canvas || nodes.length < 3) {
      toast.error("Need at least 3 points to complete selection");
      return;
    }

    const canvasElement = canvas.getElement();
    const simplified = simplifyPath(nodes, simplifyTolerance);
    const selection = pathToSelection(simplified, canvasElement.width, canvasElement.height);

    toast.success(`Selection created with ${simplified.length} nodes`);
    setIsDrawing(false);
    setNodes([]);
    setPreviewPath([]);
  }, [canvas, nodes, simplifyTolerance]);

  const handleCancel = useCallback(() => {
    setIsDrawing(false);
    setNodes([]);
    setPreviewPath([]);
  }, []);

  const handleUndo = useCallback(() => {
    if (nodes.length > 1) {
      setNodes(prev => prev.slice(0, -1));
    }
  }, [nodes]);

  // Set up event listeners
  useEffect(() => {
    if (!canvas || !isActive) return;

    const canvasElement = canvas.getElement();
    canvasElement.addEventListener('mousedown', handleCanvasMouseDown);
    canvasElement.addEventListener('mousemove', handleCanvasMouseMove);
    canvasElement.addEventListener('click', handleCanvasClick);

    return () => {
      canvasElement.removeEventListener('mousedown', handleCanvasMouseDown);
      canvasElement.removeEventListener('mousemove', handleCanvasMouseMove);
      canvasElement.removeEventListener('click', handleCanvasClick);
    };
  }, [canvas, isActive, handleCanvasMouseDown, handleCanvasMouseMove, handleCanvasClick]);

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">
          Search Radius: {searchRadius}px
        </Label>
        <Slider
          value={[searchRadius]}
          onValueChange={(v) => setSearchRadius(v[0])}
          min={5}
          max={50}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">
          Edge Strength: {edgeStrength.toFixed(2)}
        </Label>
        <Slider
          value={[edgeStrength * 100]}
          onValueChange={(v) => setEdgeStrength(v[0] / 100)}
          min={0}
          max={100}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">
          Simplify Tolerance: {simplifyTolerance.toFixed(1)}
        </Label>
        <Slider
          value={[simplifyTolerance]}
          onValueChange={(v) => setSimplifyTolerance(v[0])}
          min={0}
          max={5}
          step={0.1}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Show Nodes</Label>
        <Switch checked={showNodes} onCheckedChange={setShowNodes} />
      </div>

      {isDrawing && (
        <div className="flex gap-2 pt-4 border-t border-[hsl(var(--cde-border-subtle))]">
          <Button
            size="sm"
            variant="outline"
            onClick={handleUndo}
            disabled={nodes.length <= 1}
            className="flex-1"
          >
            <Undo2 className="w-4 h-4 mr-1" />
            Undo
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleComplete}
            className="flex-1"
          >
            <Check className="w-4 h-4 mr-1" />
            Done
          </Button>
        </div>
      )}

      <div className="text-xs text-[hsl(var(--cde-text-muted))] pt-2 border-t border-[hsl(var(--cde-border-subtle))]">
        Click to place anchor points. Tool will snap to edges automatically.
      </div>
    </div>
  );
};
