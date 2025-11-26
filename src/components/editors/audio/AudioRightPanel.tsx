import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import {
  Layers,
  Palette,
  Wand2,
  Settings,
  FolderOpen,
  Volume2,
  Waves,
  Music,
  ListMusic,
  Disc,
  Radio,
  Library,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react";

interface AudioRightPanelProps {
  activeTool: string;
}

const panels = [
  { id: 'tracks', icon: Layers, label: 'Tracks' },
  { id: 'mixer', icon: Volume2, label: 'Mixer' },
  { id: 'effects', icon: Waves, label: 'Effects' },
  { id: 'instruments', icon: Music, label: 'Instruments' },
  { id: 'library', icon: Library, label: 'Sound Library' },
  { id: 'ai', icon: Wand2, label: 'AI Audio' },
  { id: 'assets', icon: FolderOpen, label: 'Assets' },
  { id: 'chat', icon: MessageSquare, label: 'AI Chat' },
];

const mockTracks = [
  { id: 1, name: 'Master', type: 'master', volume: 0, color: 'hsl(38 92% 50%)' },
  { id: 2, name: 'Vocals', type: 'audio', volume: -3, color: 'hsl(330 80% 60%)' },
  { id: 3, name: 'Drums', type: 'audio', volume: -6, color: 'hsl(187 85% 53%)' },
  { id: 4, name: 'Bass', type: 'audio', volume: -4, color: 'hsl(142 71% 45%)' },
  { id: 5, name: 'Synth Pad', type: 'midi', volume: -8, color: 'hsl(262 83% 58%)' },
];

export const AudioRightPanel = ({ activeTool }: AudioRightPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activePanel, setActivePanel] = useState('tracks');
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
            hsl(38 92% 50% / 0.2) 0px,
            hsl(38 92% 50% / 0.2) 1px,
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
            style={{ borderBottom: `1px solid ${i % 5 === 0 ? 'hsl(38 92% 50% / 0.4)' : 'hsl(var(--cde-border-subtle))'}` }}
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
                className={`w-8 h-8 ${activePanel === panel.id ? 'bg-[hsl(38_92%_50%)]/20 text-[hsl(38_92%_50%)]' : ''}`}
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
            {activePanel === 'tracks' && (
              <div className="p-3 space-y-2">
                <Button variant="outline" size="sm" className="w-full gap-2 border-dashed">
                  <Plus className="w-4 h-4" />
                  Add Track
                </Button>
                
                {mockTracks.map((track) => (
                  <div 
                    key={track.id}
                    className="p-3 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))]"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: track.color }}
                      />
                      <span className="text-sm font-medium flex-1">{track.name}</span>
                      <span className="text-xs text-[hsl(var(--cde-text-muted))] uppercase">{track.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-3 h-3 text-[hsl(var(--cde-text-muted))]" />
                      <Slider 
                        defaultValue={[50 + track.volume * 2]} 
                        max={100} 
                        className="flex-1"
                      />
                      <span className="text-xs font-mono w-8 text-right">{track.volume}dB</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activePanel === 'mixer' && (
              <div className="p-3">
                <div className="grid grid-cols-4 gap-2">
                  {mockTracks.map((track) => (
                    <div key={track.id} className="flex flex-col items-center gap-2 p-2 rounded-lg bg-[hsl(var(--cde-bg-tertiary))]">
                      <div className="h-32 w-2 rounded-full bg-[hsl(var(--cde-bg-primary))] relative">
                        <div 
                          className="absolute bottom-0 left-0 right-0 rounded-full"
                          style={{ 
                            backgroundColor: track.color,
                            height: `${50 + track.volume * 2}%`
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-[hsl(var(--cde-text-muted))] truncate w-full text-center">{track.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activePanel === 'ai' && (
              <div className="p-3 space-y-3">
                <div className="p-4 rounded-lg bg-gradient-to-br from-[hsl(38_92%_50%/0.1)] to-transparent border border-[hsl(38_92%_50%/0.3)]">
                  <Wand2 className="w-8 h-8 text-[hsl(38_92%_50%)] mb-2" />
                  <h4 className="font-semibold mb-1">AudioForge AI</h4>
                  <p className="text-xs text-[hsl(var(--cde-text-muted))]">
                    Generate music, SFX, and voice with AI
                  </p>
                </div>
                
                <Button className="w-full bg-[hsl(38_92%_50%)] hover:bg-[hsl(38_92%_40%)]">
                  <Music className="w-4 h-4 mr-2" />
                  Generate Music
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Radio className="w-4 h-4 mr-2" />
                  Generate Sound Effects
                </Button>
              </div>
            )}
            
            {activePanel === 'chat' && (
              <div className="p-3 h-full flex flex-col">
                <div className="flex-1 bg-[hsl(var(--cde-bg-primary))] rounded-lg p-3 mb-3">
                  <p className="text-xs text-[hsl(var(--cde-text-muted))] text-center">
                    AI Assistant ready to help with audio production
                  </p>
                </div>
                <input 
                  type="text"
                  placeholder="Ask about audio editing..."
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
