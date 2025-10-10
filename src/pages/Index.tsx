import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { LeftToolbar } from "@/components/LeftToolbar";
import { Canvas } from "@/components/Canvas";
import { RightPanel } from "@/components/RightPanel";
import { BottomBar } from "@/components/BottomBar";
import { MiniSettingsStrip } from "@/components/MiniSettingsStrip";

const Index = () => {
  const [activeTool, setActiveTool] = useState('select');
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[hsl(var(--cde-bg-primary))]">
      <TopBar />
      
      <div className="flex-1 flex overflow-hidden">
        <LeftToolbar />
        <MiniSettingsStrip 
          activeTool={activeTool} 
          isExpanded={settingsExpanded}
          onToggleExpand={() => setSettingsExpanded(!settingsExpanded)}
        />
        <Canvas />
        <RightPanel />
      </div>
      
      <BottomBar />
    </div>
  );
};

export default Index;
