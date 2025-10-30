import { useState } from "react";
import { Canvas } from "@/components/Canvas";
import { LeftToolbar } from "@/components/LeftToolbar";
import { TopBar } from "@/components/TopBar";
import { RightPanel } from "@/components/RightPanel";
import { BottomBar } from "@/components/BottomBar";
import { AssetBrowserModal } from "@/components/AssetBrowser/AssetBrowserModal";
import { MiniSettingsStrip } from "@/components/MiniSettingsStrip";
import { ToolType, ToolSettings } from "@/hooks/useFabricCanvas";
import { useCanvasLayers } from "@/hooks/useCanvasLayers";
import { Canvas as FabricCanvas } from 'fabric';

const Index = () => {
  const [showAssetBrowser, setShowAssetBrowser] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [toolSettings, setToolSettings] = useState<ToolSettings>({
    brushSize: 10,
    brushOpacity: 100,
    brushHardness: 50,
    eraserSize: 20,
    color: '#000000',
  });

  const canvasLayers = useCanvasLayers(fabricCanvas);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[hsl(var(--cde-bg-primary))]">
      <TopBar />
      
      <div className="flex flex-1 min-h-0 relative">
        <LeftToolbar 
          activeTool={activeTool}
          onToolChange={(tool) => setActiveTool(tool as ToolType)}
        />
        
        <div className="flex-1 flex flex-col min-w-0 relative">
      <Canvas 
        activeTool={activeTool} 
        toolSettings={toolSettings}
        onCanvasReady={setFabricCanvas}
      />
          <BottomBar 
            onOpenAssetBrowser={() => setShowAssetBrowser(true)}
            onToggleSettings={() => setShowSettings(!showSettings)}
          />
          
          {showSettings && (
            <MiniSettingsStrip 
              isOpen={showSettings}
              onClose={() => setShowSettings(false)}
              activeTool={activeTool}
              toolSettings={toolSettings}
              onSettingsChange={setToolSettings}
            />
          )}
        </div>
        
        <RightPanel canvasLayers={canvasLayers} fabricCanvas={fabricCanvas} />
      </div>

      <AssetBrowserModal 
        open={showAssetBrowser} 
        onOpenChange={setShowAssetBrowser}
        fabricCanvas={fabricCanvas}
        onAddToCanvas={(url) => {
          if (fabricCanvas) {
            import('fabric').then(({ FabricImage }) => {
              FabricImage.fromURL(url, { crossOrigin: 'anonymous' }).then((img) => {
                img.set({ left: 50, top: 50, scaleX: 0.5, scaleY: 0.5 });
                fabricCanvas.add(img);
                fabricCanvas.requestRenderAll();
              });
            });
          }
        }}
      />
    </div>
  );
};

export default Index;
