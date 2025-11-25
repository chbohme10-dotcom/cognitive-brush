import { useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { TopBar } from "@/components/TopBar";
import { LeftToolbar } from "@/components/LeftToolbar";
import { Canvas } from "@/components/Canvas";
import { RightPanel } from "@/components/RightPanel";
import { BottomBar } from "@/components/BottomBar";
import { useCanvasLayers } from "@/hooks/useCanvasLayers";

const Index = () => {
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState('select');
  const canvasLayers = useCanvasLayers(fabricCanvas);

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
