import { useState } from "react";
import { EditorTopBar } from "@/components/editors/shared/EditorTopBar";
import { EditorBottomBar } from "@/components/editors/shared/EditorBottomBar";
import { Character3DLeftToolbar } from "@/components/editors/character3d/Character3DLeftToolbar";
import { Character3DRightPanel } from "@/components/editors/character3d/Character3DRightPanel";
import { Character3DViewport } from "@/components/editors/character3d/Character3DViewport";

const Character3DEditor = () => {
  const [activeTool, setActiveTool] = useState('select');
  const [morphValues, setMorphValues] = useState<Record<string, number>>({});
  
  const accentColor = "hsl(280 70% 50%)";

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[hsl(var(--cde-bg-primary))]">
      <EditorTopBar 
        projectName="Character Model" 
        projectExtension=".vrm" 
        accentColor={accentColor}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Character3DLeftToolbar activeTool={activeTool} onToolChange={setActiveTool} />
        
        <main className="flex-1 relative">
          <Character3DViewport morphValues={morphValues} />
        </main>
        
        <Character3DRightPanel activeTool={activeTool} />
      </div>
      
      <EditorBottomBar accentColor={accentColor} statusMessage="3D Studio Ready • WebGL2 Active" />
    </div>
  );
};

export default Character3DEditor;
