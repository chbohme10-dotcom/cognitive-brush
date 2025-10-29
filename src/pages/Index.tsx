import { useState } from "react";
import { Canvas } from "@/components/Canvas";
import { LeftToolbar } from "@/components/LeftToolbar";
import { TopBar } from "@/components/TopBar";
import { RightPanel } from "@/components/RightPanel";
import { BottomBar } from "@/components/BottomBar";
import { AssetBrowserModal } from "@/components/AssetBrowser/AssetBrowserModal";
import { MiniSettingsStrip } from "@/components/MiniSettingsStrip";
import { ToolType, ToolSettings } from "@/hooks/useFabricCanvas";

const Index = () => {
  const [showAssetBrowser, setShowAssetBrowser] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [toolSettings, setToolSettings] = useState<ToolSettings>({
    brushSize: 10,
    brushOpacity: 100,
    brushHardness: 50,
    eraserSize: 20,
    color: '#000000',
  });

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
        
        <RightPanel />
      </div>

      <AssetBrowserModal 
        open={showAssetBrowser} 
        onOpenChange={setShowAssetBrowser} 
      />
    </div>
  );
};

export default Index;
