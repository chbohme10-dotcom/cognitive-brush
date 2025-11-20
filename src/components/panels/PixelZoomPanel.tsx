import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Minus, Plus, Settings } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';

interface PixelZoomPanelProps {
  mousePos: { x: number; y: number } | null;
  canvas: HTMLCanvasElement | null;
  onHoverChange?: (isHovered: boolean) => void;
  className?: string;
}

export function PixelZoomPanel({ mousePos, canvas, onHoverChange, className }: PixelZoomPanelProps) {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(8);
  const [isHovered, setIsHovered] = useState(false);
  const viewPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [deadZone, setDeadZone] = useState(80);
  const [panSpeed, setPanSpeed] = useState(0.1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    onHoverChange?.(isHovered);
  }, [isHovered, onHoverChange]);
  
  useEffect(() => {
    const previewCanvas = previewCanvasRef.current;
    if (!previewCanvas || !canvas || !mousePos || size.width === 0 || size.height === 0) return;
    
    const sourceSizeX = size.width / zoom;
    const sourceSizeY = size.height / zoom;
    
    const deadZoneSizeX = sourceSizeX * (deadZone / 100);
    const deadZoneSizeY = sourceSizeY * (deadZone / 100);

    const viewCenterX = viewPositionRef.current.x + sourceSizeX / 2;
    const viewCenterY = viewPositionRef.current.y + sourceSizeY / 2;

    const dx = mousePos.x - viewCenterX;
    const dy = mousePos.y - viewCenterY;

    if (Math.abs(dx) > deadZoneSizeX / 2) {
      viewPositionRef.current.x += (dx - (Math.sign(dx) * deadZoneSizeX / 2)) * panSpeed;
    }
    if (Math.abs(dy) > deadZoneSizeY / 2) {
      viewPositionRef.current.y += (dy - (Math.sign(dy) * deadZoneSizeY / 2)) * panSpeed;
    }
    
    viewPositionRef.current.x = Math.max(0, Math.min(canvas.width - sourceSizeX, viewPositionRef.current.x));
    viewPositionRef.current.y = Math.max(0, Math.min(canvas.height - sourceSizeY, viewPositionRef.current.y));

    const previewCtx = previewCanvas.getContext('2d');
    if (!previewCtx) return;

    previewCtx.imageSmoothingEnabled = false;
    previewCtx.clearRect(0, 0, size.width, size.height);
    
    previewCtx.fillStyle = 'hsl(var(--muted))';
    previewCtx.fillRect(0, 0, size.width, size.height);

    previewCtx.drawImage(
      canvas,
      viewPositionRef.current.x,
      viewPositionRef.current.y,
      sourceSizeX,
      sourceSizeY,
      0,
      0,
      size.width,
      size.height
    );
  }, [mousePos, canvas, size, zoom, deadZone, panSpeed]);

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const newZoom = zoom - e.deltaY / 100;
    setZoom(Math.max(1, Math.min(128, newZoom)));
  };

  const changeZoom = (amount: number) => {
    setZoom(prev => Math.max(1, Math.min(128, prev + amount)));
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onWheel={handleWheel}
      className={cn(
        "relative w-full h-full overflow-hidden rounded-md border-2 border-border shadow-inner bg-background",
        className
      )}
    >
      {size.width > 0 && size.height > 0 ? (
        <canvas ref={previewCanvasRef} width={size.width} height={size.height} className="w-full h-full" />
      ) : (
        <div className="w-full h-full bg-muted animate-pulse"></div>
      )}
      
      <div className="absolute bottom-2 right-2 flex gap-1">
        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => changeZoom(-4)}>
          <Minus className="w-4 h-4"/>
        </Button>
        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => changeZoom(4)}>
          <Plus className="w-4 h-4"/>
        </Button>
      </div>
      
      <div className="absolute top-2 left-2 flex gap-1">
        <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-6 w-6">
              <Settings className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4" side="bottom" align="start">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deadzone-slider">Dead Zone: {deadZone}%</Label>
                <Slider
                  id="deadzone-slider"
                  min={0}
                  max={100}
                  step={5}
                  value={[deadZone]}
                  onValueChange={(value) => setDeadZone(value[0])}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="panspeed-slider">Pan Speed: {panSpeed.toFixed(2)}</Label>
                <Slider
                  id="panspeed-slider"
                  min={0.01}
                  max={1.0}
                  step={0.01}
                  value={[panSpeed]}
                  onValueChange={(value) => setPanSpeed(value[0])}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="absolute top-2 right-2 bg-background/50 text-foreground text-xs px-2 py-1 rounded-md">
        {zoom.toFixed(1)}x
      </div>
    </div>
  );
}
