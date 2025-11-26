import { useState } from "react";
import { EditorTopBar } from "@/components/editors/shared/EditorTopBar";
import { EditorBottomBar } from "@/components/editors/shared/EditorBottomBar";
import { VideoLeftToolbar } from "@/components/editors/video/VideoLeftToolbar";
import { VideoRightPanel } from "@/components/editors/video/VideoRightPanel";

const VideoEditor = () => {
  const [activeTool, setActiveTool] = useState('select');

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[hsl(var(--cde-bg-primary))]">
      <EditorTopBar projectName="Untitled Video" projectExtension=".lvid" accentColor="hsl(187 85% 53%)" />
      <div className="flex-1 flex overflow-hidden">
        <VideoLeftToolbar activeTool={activeTool} onToolChange={setActiveTool} />
        <main className="flex-1 relative bg-[hsl(var(--cde-bg-primary))] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[hsl(187_85%_53%)] to-[hsl(187_85%_73%)] bg-clip-text text-transparent">CineAI Studio</h2>
            <p className="text-[hsl(var(--cde-text-muted))] mt-2">Cinematic Video Production</p>
          </div>
        </main>
        <VideoRightPanel activeTool={activeTool} />
      </div>
      <EditorBottomBar accentColor="hsl(187 85% 53%)" statusMessage="CineAI Ready" />
    </div>
  );
};

export default VideoEditor;
