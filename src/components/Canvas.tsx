import { useRef, useState, MouseEvent, WheelEvent } from "react";
import { useFabricCanvas, ToolType, ToolSettings } from "@/hooks/useFabricCanvas";

interface CanvasProps {
  activeTool: ToolType;
  toolSettings: ToolSettings;
  onAddImage?: (imageUrl: string) => void;
}

export const Canvas = ({ activeTool, toolSettings }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });

  const {
    canvas,
    isReady,
  } = useFabricCanvas(canvasRef, activeTool, toolSettings);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isPanning && e.buttons === 2) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      setPanOffset({
        x: panStartRef.current.offsetX + dx,
        y: panStartRef.current.offsetY + dy
      });
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button === 2) {
      setIsPanning(true);
      panStartRef.current = { 
        x: e.clientX, 
        y: e.clientY,
        offsetX: panOffset.x,
        offsetY: panOffset.y
      };
      e.preventDefault();
    }
  };

  const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button === 2) {
      setIsPanning(false);
      setIsZooming(false);
    }
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (isZooming || e.buttons === 2) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      setZoom(prev => Math.max(0.25, Math.min(4, prev + delta)));
    }
  };

  const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsZooming(true);
  };

  return (
    <main 
      ref={containerRef}
      className="flex-1 relative overflow-hidden bg-[hsl(var(--cde-bg-primary))]"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        setIsPanning(false);
        setIsZooming(false);
      }}
      onWheel={handleWheel}
      onContextMenu={handleContextMenu}
      style={{ cursor: isPanning ? 'grabbing' : 'default' }}
    >
      {/* Canvas Grid Background */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--cde-border-subtle) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--cde-border-subtle) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 0'
        }}
      />
      
      {/* Main Canvas Content */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div 
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`
          }}
        >
          <canvas ref={canvasRef} className="shadow-2xl border-2 border-[hsl(var(--cde-border-emphasis))]" />
        </div>
      </div>
    </main>
  );
};
