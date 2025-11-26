import { useState } from "react";
import { EditorTopBar } from "@/components/editors/shared/EditorTopBar";
import { EditorBottomBar } from "@/components/editors/shared/EditorBottomBar";
import { StoryboardLeftToolbar } from "@/components/editors/storyboard/StoryboardLeftToolbar";
import { StoryboardRightPanel } from "@/components/editors/storyboard/StoryboardRightPanel";

const StoryboardEditor = () => {
  const [activeTool, setActiveTool] = useState('select');

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[hsl(var(--cde-bg-primary))]">
      <EditorTopBar projectName="Untitled Storyboard" projectExtension=".lstory" accentColor="hsl(142 71% 45%)" />
      <div className="flex-1 flex overflow-hidden">
        <StoryboardLeftToolbar activeTool={activeTool} onToolChange={setActiveTool} />
        <main className="flex-1 relative bg-[hsl(var(--cde-bg-primary))] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[hsl(142_71%_45%)] to-[hsl(142_71%_65%)] bg-clip-text text-transparent">StoryAI Canvas</h2>
            <p className="text-[hsl(var(--cde-text-muted))] mt-2">Visual Narrative Planning</p>
          </div>
        </main>
        <StoryboardRightPanel activeTool={activeTool} />
      </div>
      <EditorBottomBar accentColor="hsl(142 71% 45%)" statusMessage="StoryAI Ready" />
    </div>
  );
};

export default StoryboardEditor;
