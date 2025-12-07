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

  const handleMorphChange = (id: string, value: number) => {
    setMorphValues(prev => ({ ...prev, [id]: value }));
  };

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
          <Character3DViewport morphValues={morphValues} onMorphChange={handleMorphChange} />
        </main>
        
        <Character3DRightPanel 
          activeTool={activeTool} 
          morphValues={morphValues}
          onMorphChange={handleMorphChange}
        />
      </div>
      
      <EditorBottomBar accentColor={accentColor} statusMessage="3D Character Studio • WebGL2 Active • 52 Morphs • 65 Bones" />
    </div>
  );
};

export default Character3DEditor;
