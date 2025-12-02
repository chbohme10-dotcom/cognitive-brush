import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Layers,
  Palette,
  Wand2,
  FolderOpen,
  Film,
  Sparkles,
  Video,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Plus,
  Image as ImageIcon
} from "lucide-react";
import { VideoMediaBin } from "./VideoMediaBin";

interface VideoRightPanelProps {
  activeTool: string;
}

const panels = [
  { id: 'timeline', icon: Film, label: 'Timeline Layers' },
  { id: 'effects', icon: Sparkles, label: 'Effects' },
  { id: 'color', icon: Palette, label: 'Color Grading' },
  { id: 'media', icon: Video, label: 'Media Bin' },
  { id: 'ai', icon: Wand2, label: 'AI Video' },
  { id: 'assets', icon: FolderOpen, label: 'Assets' },
  { id: 'chat', icon: MessageSquare, label: 'AI Chat' },
];

export const VideoRightPanel = ({ activeTool }: VideoRightPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activePanel, setActivePanel] = useState('timeline');
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
            hsl(187 85% 53% / 0.2) 0px,
            hsl(187 85% 53% / 0.2) 1px,
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
            style={{ borderBottom: `1px solid ${i % 5 === 0 ? 'hsl(187 85% 53% / 0.4)' : 'hsl(var(--cde-border-subtle))'}` }}
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
                className={`w-8 h-8 ${activePanel === panel.id ? 'bg-[hsl(187_85%_53%)]/20 text-[hsl(187_85%_53%)]' : ''}`}
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
            {activePanel === 'timeline' && (
              <div className="p-3 space-y-2">
                <Button variant="outline" size="sm" className="w-full gap-2 border-dashed">
                  <Plus className="w-4 h-4" />
                  Add Video Track
                </Button>
                
                {['Video 1', 'Video 2', 'Audio 1', 'Audio 2', 'FX'].map((track, i) => (
                  <div 
                    key={track}
                    className="p-2 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))] flex items-center gap-2"
                  >
                    <div className={`w-2 h-8 rounded ${i < 2 ? 'bg-[hsl(187_85%_53%)]' : i < 4 ? 'bg-[hsl(38_92%_50%)]' : 'bg-[hsl(262_83%_58%)]'}`} />
                    <span className="text-sm flex-1">{track}</span>
                    <Layers className="w-4 h-4 text-[hsl(var(--cde-text-muted))]" />
                  </div>
                ))}
              </div>
            )}
            
            {activePanel === 'media' && (
              <div className="p-3">
                <VideoMediaBin onAddToTimeline={(item) => console.log('Add to timeline:', item)} />
              </div>
            )}
            
            {activePanel === 'ai' && (
              <div className="p-3 space-y-3">
                <div className="p-4 rounded-lg bg-gradient-to-br from-[hsl(187_85%_53%/0.1)] to-transparent border border-[hsl(187_85%_53%/0.3)]">
                  <Wand2 className="w-8 h-8 text-[hsl(187_85%_53%)] mb-2" />
                  <h4 className="font-semibold mb-1">CineAI Studio</h4>
                  <p className="text-xs text-[hsl(var(--cde-text-muted))]">
                    Generate and enhance video with AI
                  </p>
                </div>
                
                <Button className="w-full bg-[hsl(187_85%_53%)] hover:bg-[hsl(187_85%_43%)] text-black">
                  <Video className="w-4 h-4 mr-2" />
                  Generate Video
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Enhancement
                </Button>
                
                <Button variant="outline" className="w-full">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Image to Video
                </Button>
              </div>
            )}
            
            {activePanel === 'chat' && (
              <div className="p-3 h-full flex flex-col">
                <div className="flex-1 bg-[hsl(var(--cde-bg-primary))] rounded-lg p-3 mb-3">
                  <p className="text-xs text-[hsl(var(--cde-text-muted))] text-center">
                    AI Assistant ready to help with video production
                  </p>
                </div>
                <input 
                  type="text"
                  placeholder="Ask about video editing..."
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
