import { useState } from "react";
import { EditorTopBar } from "@/components/editors/shared/EditorTopBar";
import { EditorBottomBar } from "@/components/editors/shared/EditorBottomBar";
import { AudioLeftToolbar } from "@/components/editors/audio/AudioLeftToolbar";
import { AudioRightPanel } from "@/components/editors/audio/AudioRightPanel";

const AudioEditor = () => {
  const [activeTool, setActiveTool] = useState('select');

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[hsl(var(--cde-bg-primary))]">
      <EditorTopBar projectName="Untitled Audio" projectExtension=".laud" accentColor="hsl(38 92% 50%)" />
      <div className="flex-1 flex overflow-hidden">
        <AudioLeftToolbar activeTool={activeTool} onToolChange={setActiveTool} />
        <main className="flex-1 relative bg-[hsl(var(--cde-bg-primary))] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🎵</div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[hsl(38_92%_50%)] to-[hsl(38_92%_70%)] bg-clip-text text-transparent">AudioForge Studio</h2>
            <p className="text-[hsl(var(--cde-text-muted))] mt-2">AI-Powered Audio Production</p>
          </div>
        </main>
        <AudioRightPanel activeTool={activeTool} />
      </div>
      <EditorBottomBar accentColor="hsl(38 92% 50%)" statusMessage="AudioForge Ready" />
    </div>
  );
};

export default AudioEditor;
