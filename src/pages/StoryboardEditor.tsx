import { useState } from "react";
import { EditorTopBar } from "@/components/editors/shared/EditorTopBar";
import { EditorBottomBar } from "@/components/editors/shared/EditorBottomBar";
import { StoryboardLeftToolbar } from "@/components/editors/storyboard/StoryboardLeftToolbar";
import { StoryboardRightPanel } from "@/components/editors/storyboard/StoryboardRightPanel";
import { Plus, ChevronLeft, ChevronRight, Sparkles, Camera, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const StoryboardEditor = () => {
  const [activeTool, setActiveTool] = useState('select');
  const [selectedPanel, setSelectedPanel] = useState(2);
  const accentColor = "hsl(142 71% 45%)";

  // Mock storyboard panels
  const panels = [
    { id: 1, shot: 'WIDE', duration: '3s', description: 'Establishing shot - forest clearing' },
    { id: 2, shot: 'MED', duration: '4s', description: 'Character enters frame from left' },
    { id: 3, shot: 'CU', duration: '2s', description: 'Close up on characters face - realization' },
    { id: 4, shot: 'OTS', duration: '3s', description: 'Over shoulder - reveals mysterious object' },
    { id: 5, shot: 'INSERT', duration: '2s', description: 'Detail shot of the ancient artifact' },
    { id: 6, shot: 'WIDE', duration: '4s', description: 'Character approaches artifact cautiously' },
  ];

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[hsl(var(--cde-bg-primary))]">
      <EditorTopBar 
        projectName="Untitled Storyboard" 
        projectExtension=".lstory" 
        accentColor={accentColor}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <StoryboardLeftToolbar activeTool={activeTool} onToolChange={setActiveTool} />
        
        {/* Main Storyboard Workspace */}
        <main className="flex-1 relative bg-[hsl(var(--cde-bg-primary))] flex flex-col overflow-hidden">
          {/* Main Panel View */}
          <div className="flex-1 relative p-4 flex items-center justify-center">
            <div className="relative w-full max-w-4xl aspect-video">
              {/* Navigation Arrows */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 bg-[hsl(var(--cde-bg-secondary))] hover:bg-[hsl(var(--cde-bg-tertiary))]"
                onClick={() => setSelectedPanel(Math.max(1, selectedPanel - 1))}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 bg-[hsl(var(--cde-bg-secondary))] hover:bg-[hsl(var(--cde-bg-tertiary))]"
                onClick={() => setSelectedPanel(Math.min(panels.length, selectedPanel + 1))}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>

              {/* Main Storyboard Panel */}
              <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-[hsl(142_71%_45%)]/50 bg-[hsl(var(--cde-bg-secondary))] shadow-2xl">
                {/* Panel Content */}
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--cde-bg-tertiary))] to-[hsl(var(--cde-bg-secondary))] flex items-center justify-center">
                  {/* Sketch Lines Effect */}
                  <div className="absolute inset-0 opacity-5">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute h-px bg-[hsl(var(--cde-text-primary))]"
                        style={{
                          top: `${(i + 1) * 5}%`,
                          left: '10%',
                          width: '80%',
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Placeholder Content */}
                  <div className="text-center z-10">
                    <div className="text-8xl mb-6 opacity-30">🎬</div>
                    <p className="text-lg text-[hsl(var(--cde-text-muted))]">
                      {panels[selectedPanel - 1]?.description}
                    </p>
                  </div>

                  {/* Shot Type Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-[hsl(142_71%_45%)]/20 border border-[hsl(142_71%_45%)]/40">
                    <span className="text-sm font-bold text-[hsl(142_71%_45%)]">
                      {panels[selectedPanel - 1]?.shot}
                    </span>
                  </div>

                  {/* Panel Number */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-[hsl(var(--cde-bg-tertiary))]">
                    <span className="text-sm font-mono text-[hsl(var(--cde-text-secondary))]">
                      Panel {selectedPanel} / {panels.length}
                    </span>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(var(--cde-bg-tertiary))]">
                    <Clock className="w-4 h-4 text-[hsl(var(--cde-text-muted))]" />
                    <span className="text-sm font-mono text-[hsl(var(--cde-text-secondary))]">
                      {panels[selectedPanel - 1]?.duration}
                    </span>
                  </div>

                  {/* AI Generate Badge */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(142_71%_45%)]/20 border border-[hsl(142_71%_45%)]/40">
                    <Sparkles className="w-4 h-4 text-[hsl(142_71%_45%)]" />
                    <span className="text-xs font-medium text-[hsl(142_71%_45%)]">StoryAI</span>
                  </div>

                  {/* Rule of Thirds Grid */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute left-1/3 top-0 bottom-0 w-px bg-[hsl(var(--cde-text-primary))]/10" />
                    <div className="absolute left-2/3 top-0 bottom-0 w-px bg-[hsl(var(--cde-text-primary))]/10" />
                    <div className="absolute top-1/3 left-0 right-0 h-px bg-[hsl(var(--cde-text-primary))]/10" />
                    <div className="absolute top-2/3 left-0 right-0 h-px bg-[hsl(var(--cde-text-primary))]/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel Strip */}
          <div className="h-36 border-t border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-secondary))]">
            <ScrollArea className="h-full">
              <div className="flex items-center gap-3 p-3">
                {panels.map((panel) => (
                  <button
                    key={panel.id}
                    onClick={() => setSelectedPanel(panel.id)}
                    className={`flex-shrink-0 w-40 h-28 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedPanel === panel.id
                        ? 'border-[hsl(142_71%_45%)] shadow-lg shadow-[hsl(142_71%_45%)]/30 scale-105'
                        : 'border-[hsl(var(--cde-border-subtle))] hover:border-[hsl(var(--cde-text-muted))]'
                    }`}
                  >
                    <div className="w-full h-full bg-[hsl(var(--cde-bg-tertiary))] relative flex items-center justify-center">
                      <span className="text-3xl opacity-30">🎬</span>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-white">{panel.shot}</span>
                          <span className="text-[10px] text-white/70">{panel.duration}</span>
                        </div>
                      </div>
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-[10px] font-mono text-white">
                        {panel.id}
                      </div>
                    </div>
                  </button>
                ))}
                
                {/* Add New Panel */}
                <button className="flex-shrink-0 w-40 h-28 rounded-xl border-2 border-dashed border-[hsl(var(--cde-border-subtle))] hover:border-[hsl(142_71%_45%)] transition-colors flex items-center justify-center group">
                  <Plus className="w-8 h-8 text-[hsl(var(--cde-text-muted))] group-hover:text-[hsl(142_71%_45%)] transition-colors" />
                </button>
              </div>
            </ScrollArea>
          </div>
        </main>
        
        <StoryboardRightPanel activeTool={activeTool} />
      </div>
      
      <EditorBottomBar accentColor={accentColor} statusMessage="StoryAI Ready" />
    </div>
  );
};

export default StoryboardEditor;
