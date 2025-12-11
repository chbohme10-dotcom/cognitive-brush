import { useState } from "react";
import { EditorTopBar } from "@/components/editors/shared/EditorTopBar";
import { EditorBottomBar } from "@/components/editors/shared/EditorBottomBar";
import { Character3DLeftToolbar } from "@/components/editors/character3d/Character3DLeftToolbar";
import { Character3DRightPanel } from "@/components/editors/character3d/Character3DRightPanel";
import { Character3DViewport } from "@/components/editors/character3d/Character3DViewport";
import { useVRMLoader } from "@/hooks/useVRMLoader";

const Character3DEditor = () => {
  const [activeTool, setActiveTool] = useState('select');
  const [morphValues, setMorphValues] = useState<Record<string, number>>({});
  
  // Lift VRM loader state to share between viewport and right panel
  const vrmLoader = useVRMLoader();
  
  const accentColor = "hsl(280 70% 50%)";

  const handleMorphChange = (id: string, value: number) => {
    setMorphValues(prev => ({ ...prev, [id]: value }));
  };

  const boneCount = vrmLoader.loadedVRM?.bones.length || 65;
  const morphCount = vrmLoader.loadedVRM?.blendShapes.length || 52;

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
          <Character3DViewport 
            morphValues={morphValues} 
            onMorphChange={handleMorphChange}
            loadedVRM={vrmLoader.loadedVRM}
          />
        </main>
        
        <Character3DRightPanel 
          activeTool={activeTool} 
          morphValues={morphValues}
          onMorphChange={handleMorphChange}
          vrmLoader={vrmLoader}
        />
      </div>
      
      <EditorBottomBar 
        accentColor={accentColor} 
        statusMessage={`3D Character Studio • WebGL2 Active • ${morphCount} Morphs • ${boneCount} Bones${vrmLoader.loadedVRM ? ' • VRM Loaded' : ''}`} 
      />
    </div>
  );
};

export default Character3DEditor;
