import { useEffect, useState, useCallback, useRef } from "react";
import { Canvas as FabricCanvas, Rect, Circle, Polygon, Ellipse, Line, Path, Triangle } from "fabric";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Square, 
  Circle as CircleIcon, 
  Triangle as TriangleIcon,
  Hexagon,
  Star,
  Minus,
  Pentagon,
  RotateCcw
} from "lucide-react";

interface ShapeToolProps {
  canvas: FabricCanvas | null;
  isActive: boolean;
}

type ShapeType = 'rectangle' | 'square' | 'circle' | 'ellipse' | 'triangle' | 'polygon' | 'star' | 'line';

export const ShapeTool = ({ canvas, isActive }: ShapeToolProps) => {
  const [shapeType, setShapeType] = useState<ShapeType>('rectangle');
  const [fillColor, setFillColor] = useState('#7c3aed');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [fillOpacity, setFillOpacity] = useState(100);
  const [filled, setFilled] = useState(true);
  const [stroked, setStroked] = useState(true);
  const [polygonSides, setPolygonSides] = useState(6);
  const [starPoints, setStarPoints] = useState(5);
  const [cornerRadius, setCornerRadius] = useState(0);
  
  const isDrawing = useRef(false);
  const startPoint = useRef({ x: 0, y: 0 });
  const currentShape = useRef<any>(null);

  const createShape = useCallback((x: number, y: number, width: number, height: number) => {
    const fill = filled ? fillColor : 'transparent';
    const stroke = stroked ? strokeColor : undefined;
    const alpha = fillOpacity / 100;
    
    const baseConfig = {
      left: x,
      top: y,
      fill: filled ? `${fillColor}${Math.round(alpha * 255).toString(16).padStart(2, '0')}` : 'transparent',
      stroke,
      strokeWidth: stroked ? strokeWidth : 0,
      selectable: true,
      hasControls: true,
    };

    switch (shapeType) {
      case 'rectangle':
      case 'square':
        return new Rect({
          ...baseConfig,
          width: shapeType === 'square' ? Math.min(Math.abs(width), Math.abs(height)) : Math.abs(width),
          height: shapeType === 'square' ? Math.min(Math.abs(width), Math.abs(height)) : Math.abs(height),
          rx: cornerRadius,
          ry: cornerRadius,
        });

      case 'circle':
        const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
        return new Circle({
          ...baseConfig,
          radius,
          left: x - radius,
          top: y - radius,
        });

      case 'ellipse':
        return new Ellipse({
          ...baseConfig,
          rx: Math.abs(width) / 2,
          ry: Math.abs(height) / 2,
        });

      case 'triangle':
        return new Triangle({
          ...baseConfig,
          width: Math.abs(width),
          height: Math.abs(height),
        });

      case 'line':
        return new Line([x, y, x + width, y + height], {
          stroke: strokeColor,
          strokeWidth,
          selectable: true,
        });

      case 'polygon':
        const polyPoints: { x: number; y: number }[] = [];
        const polyRadius = Math.min(Math.abs(width), Math.abs(height)) / 2;
        for (let i = 0; i < polygonSides; i++) {
          const angle = (i * 2 * Math.PI) / polygonSides - Math.PI / 2;
          polyPoints.push({
            x: polyRadius * Math.cos(angle),
            y: polyRadius * Math.sin(angle),
          });
        }
        return new Polygon(polyPoints, {
          ...baseConfig,
          left: x,
          top: y,
        });

      case 'star':
        const starPts: { x: number; y: number }[] = [];
        const outerRadius = Math.min(Math.abs(width), Math.abs(height)) / 2;
        const innerRadius = outerRadius * 0.4;
        for (let i = 0; i < starPoints * 2; i++) {
          const angle = (i * Math.PI) / starPoints - Math.PI / 2;
          const r = i % 2 === 0 ? outerRadius : innerRadius;
          starPts.push({
            x: r * Math.cos(angle),
            y: r * Math.sin(angle),
          });
        }
        return new Polygon(starPts, {
          ...baseConfig,
          left: x,
          top: y,
        });

      default:
        return null;
    }
  }, [shapeType, fillColor, strokeColor, strokeWidth, fillOpacity, filled, stroked, polygonSides, starPoints, cornerRadius]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!canvas || !isActive) return;

    const canvasElement = canvas.getElement();
    const rect = canvasElement.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvasElement.width / rect.width);
    const y = (e.clientY - rect.top) * (canvasElement.height / rect.height);

    isDrawing.current = true;
    startPoint.current = { x, y };
  }, [canvas, isActive]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!canvas || !isActive || !isDrawing.current) return;

    const canvasElement = canvas.getElement();
    const rect = canvasElement.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvasElement.width / rect.width);
    const y = (e.clientY - rect.top) * (canvasElement.height / rect.height);

    const width = x - startPoint.current.x;
    const height = y - startPoint.current.y;

    // Remove previous preview shape
    if (currentShape.current) {
      canvas.remove(currentShape.current);
    }

    // Create new preview shape
    const shape = createShape(
      Math.min(startPoint.current.x, x),
      Math.min(startPoint.current.y, y),
      width,
      height
    );

    if (shape) {
      shape.set({ opacity: 0.7 });
      canvas.add(shape);
      currentShape.current = shape;
      canvas.requestRenderAll();
    }
  }, [canvas, isActive, createShape]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!canvas || !isActive || !isDrawing.current) return;

    isDrawing.current = false;

    // Finalize the shape
    if (currentShape.current) {
      currentShape.current.set({ opacity: 1 });
      canvas.setActiveObject(currentShape.current);
      canvas.requestRenderAll();
      currentShape.current = null;
    }
  }, [canvas, isActive]);

  useEffect(() => {
    if (!canvas || !isActive) return;

    const canvasElement = canvas.getElement();
    canvasElement.addEventListener('mousedown', handleMouseDown);
    canvasElement.addEventListener('mousemove', handleMouseMove);
    canvasElement.addEventListener('mouseup', handleMouseUp);
    canvasElement.style.cursor = 'crosshair';

    return () => {
      canvasElement.removeEventListener('mousedown', handleMouseDown);
      canvasElement.removeEventListener('mousemove', handleMouseMove);
      canvasElement.removeEventListener('mouseup', handleMouseUp);
      canvasElement.style.cursor = 'default';
    };
  }, [canvas, isActive, handleMouseDown, handleMouseMove, handleMouseUp]);

  const resetToDefaults = () => {
    setShapeType('rectangle');
    setFillColor('#7c3aed');
    setStrokeColor('#000000');
    setStrokeWidth(2);
    setFillOpacity(100);
    setFilled(true);
    setStroked(true);
    setPolygonSides(6);
    setStarPoints(5);
    setCornerRadius(0);
  };

  const shapeButtons = [
    { type: 'rectangle', icon: Square, label: 'Rectangle' },
    { type: 'circle', icon: CircleIcon, label: 'Circle' },
    { type: 'triangle', icon: TriangleIcon, label: 'Triangle' },
    { type: 'polygon', icon: Hexagon, label: 'Polygon' },
    { type: 'star', icon: Star, label: 'Star' },
    { type: 'line', icon: Minus, label: 'Line' },
  ] as const;

  if (!isActive) return null;

  return (
    <div className="h-full overflow-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Square className="w-5 h-5 text-[hsl(var(--cde-accent-purple))]" />
        <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
          Shapes
        </h3>
      </div>

      <div className="space-y-4">
        {/* Shape Selection */}
        <div className="grid grid-cols-3 gap-2">
          {shapeButtons.map(({ type, icon: Icon, label }) => (
            <Button
              key={type}
              variant={shapeType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShapeType(type)}
              className="h-10 flex-col gap-1"
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px]">{label}</span>
            </Button>
          ))}
        </div>

        {/* Fill Color */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Fill</Label>
            <Switch checked={filled} onCheckedChange={setFilled} />
          </div>
          {filled && (
            <div className="flex gap-2">
              <Input
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="w-12 h-8 p-1 cursor-pointer bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))]"
              />
              <Input
                type="text"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="flex-1 h-8 bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))] text-sm font-mono"
              />
            </div>
          )}
        </div>

        {filled && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Fill Opacity</Label>
              <span className="text-xs text-[hsl(var(--cde-text-muted))]">{fillOpacity}%</span>
            </div>
            <Slider
              value={[fillOpacity]}
              onValueChange={(values) => setFillOpacity(values[0])}
              min={0}
              max={100}
              step={1}
              className="[&_[role=slider]]:bg-[hsl(var(--cde-accent-purple))]"
            />
          </div>
        )}

        {/* Stroke Color */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Stroke</Label>
            <Switch checked={stroked} onCheckedChange={setStroked} />
          </div>
          {stroked && (
            <div className="flex gap-2">
              <Input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="w-12 h-8 p-1 cursor-pointer bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))]"
              />
              <Input
                type="text"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="flex-1 h-8 bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))] text-sm font-mono"
              />
            </div>
          )}
        </div>

        {stroked && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Stroke Width</Label>
              <span className="text-xs text-[hsl(var(--cde-text-muted))]">{strokeWidth}px</span>
            </div>
            <Slider
              value={[strokeWidth]}
              onValueChange={(values) => setStrokeWidth(values[0])}
              min={0}
              max={50}
              step={1}
              className="[&_[role=slider]]:bg-[hsl(var(--cde-accent-purple))]"
            />
          </div>
        )}

        {/* Shape-specific options */}
        {(shapeType === 'rectangle' || shapeType === 'square') && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Corner Radius</Label>
              <span className="text-xs text-[hsl(var(--cde-text-muted))]">{cornerRadius}px</span>
            </div>
            <Slider
              value={[cornerRadius]}
              onValueChange={(values) => setCornerRadius(values[0])}
              min={0}
              max={100}
              step={1}
              className="[&_[role=slider]]:bg-[hsl(var(--cde-accent-purple))]"
            />
          </div>
        )}

        {shapeType === 'polygon' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Sides</Label>
              <span className="text-xs text-[hsl(var(--cde-text-muted))]">{polygonSides}</span>
            </div>
            <Slider
              value={[polygonSides]}
              onValueChange={(values) => setPolygonSides(values[0])}
              min={3}
              max={12}
              step={1}
              className="[&_[role=slider]]:bg-[hsl(var(--cde-accent-purple))]"
            />
          </div>
        )}

        {shapeType === 'star' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Points</Label>
              <span className="text-xs text-[hsl(var(--cde-text-muted))]">{starPoints}</span>
            </div>
            <Slider
              value={[starPoints]}
              onValueChange={(values) => setStarPoints(values[0])}
              min={3}
              max={12}
              step={1}
              className="[&_[role=slider]]:bg-[hsl(var(--cde-accent-purple))]"
            />
          </div>
        )}

        {/* Info */}
        <div className="p-3 bg-[hsl(var(--cde-bg-tertiary))] rounded-lg">
          <p className="text-xs text-[hsl(var(--cde-text-muted))]">
            💡 Click and drag to draw shapes. Hold Shift for constrained proportions.
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
