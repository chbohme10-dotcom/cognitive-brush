import { useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { TopBar } from "@/components/TopBar";
import { LeftToolbar } from "@/components/LeftToolbar";
import { Canvas } from "@/components/Canvas";
import { RightPanel } from "@/components/RightPanel";
import { BottomBar } from "@/components/BottomBar";
import { AssetPanel } from "@/components/AssetBrowser/AssetPanel";
import { useCanvasLayers } from "@/hooks/useCanvasLayers";

const Index = () => {
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [assetPanelOpen, setAssetPanelOpen] = useState(false);
  const canvasLayers = useCanvasLayers(fabricCanvas);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[hsl(var(--cde-bg-primary))]">
      <TopBar fabricCanvas={fabricCanvas} onToggleAssets={() => setAssetPanelOpen(!assetPanelOpen)} />
      
      <div className="flex-1 flex overflow-hidden">
        <LeftToolbar />
        <AssetPanel isOpen={assetPanelOpen} onClose={() => setAssetPanelOpen(false)} fabricCanvas={fabricCanvas} />
        <Canvas onCanvasReady={setFabricCanvas} fabricCanvas={fabricCanvas} />
        <RightPanel canvasLayers={canvasLayers} fabricCanvas={fabricCanvas} />
      </div>
      
      <BottomBar />
    </div>
  );
};

export default Index;
