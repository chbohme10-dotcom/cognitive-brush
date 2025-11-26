import { useState } from "react";
import { EditorTopBar } from "@/components/editors/shared/EditorTopBar";
import { EditorBottomBar } from "@/components/editors/shared/EditorBottomBar";
import { PropsLeftToolbar } from "@/components/editors/props/PropsLeftToolbar";
import { PropsRightPanel } from "@/components/editors/props/PropsRightPanel";

const PropsEditor = () => {
  const [activeTool, setActiveTool] = useState('select');

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[hsl(var(--cde-bg-primary))]">
      <EditorTopBar projectName="Untitled Props" projectExtension=".lprops" accentColor="hsl(200 80% 50%)" />
      <div className="flex-1 flex overflow-hidden">
        <PropsLeftToolbar activeTool={activeTool} onToolChange={setActiveTool} />
        <main className="flex-1 relative bg-[hsl(var(--cde-bg-primary))] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🎪</div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[hsl(200_80%_50%)] to-[hsl(200_80%_70%)] bg-clip-text text-transparent">PropForge Studio</h2>
            <p className="text-[hsl(var(--cde-text-muted))] mt-2">Props & Scenes Creation</p>
          </div>
        </main>
        <PropsRightPanel activeTool={activeTool} />
      </div>
      <EditorBottomBar accentColor="hsl(200 80% 50%)" statusMessage="PropForge Ready" />
    </div>
  );
};

export default PropsEditor;
