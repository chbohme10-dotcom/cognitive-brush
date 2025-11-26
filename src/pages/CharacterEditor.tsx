import { useState } from "react";
import { EditorTopBar } from "@/components/editors/shared/EditorTopBar";
import { EditorBottomBar } from "@/components/editors/shared/EditorBottomBar";
import { CharacterLeftToolbar } from "@/components/editors/character/CharacterLeftToolbar";
import { CharacterRightPanel } from "@/components/editors/character/CharacterRightPanel";

const CharacterEditor = () => {
  const [activeTool, setActiveTool] = useState('select');

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[hsl(var(--cde-bg-primary))]">
      <EditorTopBar projectName="Untitled Character" projectExtension=".lchar" accentColor="hsl(330 80% 60%)" />
      <div className="flex-1 flex overflow-hidden">
        <CharacterLeftToolbar activeTool={activeTool} onToolChange={setActiveTool} />
        <main className="flex-1 relative bg-[hsl(var(--cde-bg-primary))] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[hsl(330_80%_60%)] to-[hsl(330_80%_80%)] bg-clip-text text-transparent">CastingAI Studio</h2>
            <p className="text-[hsl(var(--cde-text-muted))] mt-2">Character DNA & Design</p>
          </div>
        </main>
        <CharacterRightPanel activeTool={activeTool} />
      </div>
      <EditorBottomBar accentColor="hsl(330 80% 60%)" statusMessage="CastingAI Ready" />
    </div>
  );
};

export default CharacterEditor;
