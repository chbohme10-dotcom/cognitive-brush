import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Layers,
  LayoutGrid,
  Wand2,
  FolderOpen,
  Film,
  Settings,
  Users,
  Camera,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock
} from "lucide-react";

interface StoryboardRightPanelProps {
  activeTool: string;
}

const panels = [
  { id: 'frames', icon: LayoutGrid, label: 'Frames' },
  { id: 'scenes', icon: Film, label: 'Scenes' },
  { id: 'characters', icon: Users, label: 'Characters' },
  { id: 'camera', icon: Camera, label: 'Camera Notes' },
  { id: 'ai', icon: Wand2, label: 'AI Storyboard' },
  { id: 'assets', icon: FolderOpen, label: 'Assets' },
  { id: 'chat', icon: MessageSquare, label: 'AI Chat' },
];

const mockFrames = [
  { id: 1, scene: 'Scene 1', frame: 'Frame 001', duration: '2s', notes: 'Wide establishing shot' },
  { id: 2, scene: 'Scene 1', frame: 'Frame 002', duration: '3s', notes: 'Close-up on character' },
  { id: 3, scene: 'Scene 1', frame: 'Frame 003', duration: '4s', notes: 'Over shoulder shot' },
  { id: 4, scene: 'Scene 2', frame: 'Frame 004', duration: '2s', notes: 'Action sequence begins' },
];

export const StoryboardRightPanel = ({ activeTool }: StoryboardRightPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activePanel, setActivePanel] = useState('frames');
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside 
      className="border-l border-[hsl(var(--cde-border-subtle))] flex relative overflow-hidden transition-all duration-300 ease-in-out"
      style={{ 
        width: isExpanded ? '320px' : isHovered ? '48px' : '10px',
        background: `
          linear-gradient(to left, hsl(var(--cde-bg-secondary)) 0%, hsl(var(--cde-bg-secondary)) calc(100% - 10px), hsl(var(--cde-bg-tertiary)) calc(100% - 10px)),
          repeating-linear-gradient(
            0deg,
            hsl(142 71% 45% / 0.2) 0px,
            hsl(142 71% 45% / 0.2) 1px,
            transparent 1px,
            transparent 20px
          )
        `,
        backgroundPosition: '0 0, 0 0',
        backgroundSize: '100% 100%, 10px 100px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ruler on left edge */}
      <div className="absolute top-0 bottom-0 left-0 w-[10px] flex flex-col items-start pointer-events-none z-10">
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={i} 
            className="flex-shrink-0 h-5 w-full relative"
            style={{ borderBottom: `1px solid ${i % 5 === 0 ? 'hsl(142 71% 45% / 0.4)' : 'hsl(var(--cde-border-subtle))'}` }}
          />
        ))}
      </div>

      {/* Activator Bar */}
      {(isHovered || isExpanded) && (
        <div className="w-10 flex flex-col items-center gap-1 py-2 ml-2 border-r border-[hsl(var(--cde-border-subtle))]">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 mb-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
          
          {panels.map((panel) => {
            const Icon = panel.icon;
            return (
              <Button
                key={panel.id}
                variant="ghost"
                size="icon"
                className={`w-8 h-8 ${activePanel === panel.id ? 'bg-[hsl(142_71%_45%)]/20 text-[hsl(142_71%_45%)]' : ''}`}
                onClick={() => {
                  setActivePanel(panel.id);
                  setIsExpanded(true);
                }}
                title={panel.label}
              >
                <Icon className="w-4 h-4" />
              </Button>
            );
          })}
        </div>
      )}

      {/* Main Panel Content */}
      {isExpanded && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[hsl(var(--cde-border-subtle))]">
            <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
              {panels.find(p => p.id === activePanel)?.label}
            </h3>
          </div>
          
          <ScrollArea className="flex-1">
            {activePanel === 'frames' && (
              <div className="p-3 space-y-2">
                <Button variant="outline" size="sm" className="w-full gap-2 border-dashed">
                  <Plus className="w-4 h-4" />
                  Add Frame
                </Button>
                
                {mockFrames.map((frame) => (
                  <div 
                    key={frame.id}
                    className="p-3 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))] cursor-pointer hover:border-[hsl(142_71%_45%/0.5)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded bg-[hsl(var(--cde-bg-primary))] border border-[hsl(var(--cde-border-subtle))]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{frame.frame}</p>
                        <p className="text-xs text-[hsl(var(--cde-text-muted))]">{frame.scene}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[hsl(var(--cde-text-muted))]">
                        <Clock className="w-3 h-3" />
                        {frame.duration}
                      </div>
                    </div>
                    <p className="text-xs text-[hsl(var(--cde-text-secondary))] mt-2 truncate">
                      {frame.notes}
                    </p>
                  </div>
                ))}
              </div>
            )}
            
            {activePanel === 'ai' && (
              <div className="p-3 space-y-3">
                <div className="p-4 rounded-lg bg-gradient-to-br from-[hsl(142_71%_45%/0.1)] to-transparent border border-[hsl(142_71%_45%/0.3)]">
                  <Wand2 className="w-8 h-8 text-[hsl(142_71%_45%)] mb-2" />
                  <h4 className="font-semibold mb-1">StoryAI</h4>
                  <p className="text-xs text-[hsl(var(--cde-text-muted))]">
                    Generate storyboard frames with AI
                  </p>
                </div>
                
                <Button className="w-full bg-[hsl(142_71%_45%)] hover:bg-[hsl(142_71%_35%)] text-black">
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Frame
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Film className="w-4 h-4 mr-2" />
                  Auto-sequence Frames
                </Button>
              </div>
            )}
            
            {activePanel === 'chat' && (
              <div className="p-3 h-full flex flex-col">
                <div className="flex-1 bg-[hsl(var(--cde-bg-primary))] rounded-lg p-3 mb-3">
                  <p className="text-xs text-[hsl(var(--cde-text-muted))] text-center">
                    AI Assistant ready to help with storyboarding
                  </p>
                </div>
                <input 
                  type="text"
                  placeholder="Ask about storyboarding..."
                  className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))] text-sm"
                />
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </aside>
  );
};
