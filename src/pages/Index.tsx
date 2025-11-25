import { useState, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { TopBar } from "@/components/TopBar";
import { LeftToolbar } from "@/components/LeftToolbar";
import { Canvas } from "@/components/Canvas";
import { RightPanel } from "@/components/RightPanel";
import { BottomBar } from "@/components/BottomBar";
import { useCanvasLayers } from "@/hooks/useCanvasLayers";
import { useCanvasHistory } from "@/hooks/useCanvasHistory";

const Index = () => {
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState('select');
  const canvasLayers = useCanvasLayers(fabricCanvas);
  const { undo, redo } = useCanvasHistory(fabricCanvas);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Ctrl+Y or Ctrl+Shift+Z for redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[hsl(var(--cde-bg-primary))]">
      <TopBar fabricCanvas={fabricCanvas} />
      
      <div className="flex-1 flex overflow-hidden">
        <LeftToolbar activeTool={activeTool} onToolChange={setActiveTool} />
        <Canvas onCanvasReady={setFabricCanvas} fabricCanvas={fabricCanvas} />
        <RightPanel canvasLayers={canvasLayers} fabricCanvas={fabricCanvas} activeTool={activeTool} />
      </div>
      
      <BottomBar />
    </div>
  );
};

export default Index;
