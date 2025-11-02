import { useState, useRef, useEffect } from "react";
import { useFabricCanvas } from "@/hooks/useFabricCanvas";
import { Canvas as FabricCanvas } from "fabric";
import { AssetMetadata } from "@/hooks/useAssets";

interface CanvasProps {
  onCanvasReady?: (canvas: FabricCanvas | null) => void;
  fabricCanvas?: FabricCanvas | null;
}

export const Canvas = ({ onCanvasReady }: CanvasProps) => {
  const [zoom, setZoom] = useState(125);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const { fabricCanvas, addImageToCanvas } = useFabricCanvas(canvasElRef.current);

  useEffect(() => {
    if (fabricCanvas && onCanvasReady) {
      onCanvasReady(fabricCanvas);
    }
  }, [fabricCanvas, onCanvasReady]);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const assetData = e.dataTransfer.getData('application/json');
      if (assetData) {
        const asset: AssetMetadata = JSON.parse(assetData);
        await addImageToCanvas(asset.url, asset.name);
      }
    } catch (error) {
      console.error('Error dropping asset:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoordinates({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top)
    });

    if (isPanning && e.buttons === 2) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      setPanOffset(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));
      panStartRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.button === 2) {
      setIsPanning(false);
      setIsZooming(false);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (isZooming || e.buttons === 2) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -5 : 5;
      setZoom(prev => Math.max(25, Math.min(400, prev + delta)));
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsZooming(true);
  };

  return (
    <main 
      className="flex-1 relative overflow-hidden bg-[hsl(var(--cde-bg-primary))]"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onContextMenu={handleContextMenu}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
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
          className="relative bg-white rounded-lg shadow-2xl border-2 border-[hsl(var(--cde-accent-purple))]"
          style={{
            width: `${zoom}%`,
            aspectRatio: '16/9',
            boxShadow: '0 0 60px hsl(262 83% 58% / 0.3)',
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`
          }}
        >
          {/* Fabric.js Canvas */}
          <canvas ref={canvasElRef} className="w-full h-full" />
          
          {/* Corner Coordinates Display */}
          <div className="absolute top-2 left-2 px-2 py-1 bg-[hsl(var(--cde-bg-tertiary))]/90 backdrop-blur-sm rounded text-xs font-mono text-[hsl(var(--cde-text-secondary))]">
            {coordinates.x}, {coordinates.y}
          </div>
        </div>
      </div>
      
    </main>
  );
};
