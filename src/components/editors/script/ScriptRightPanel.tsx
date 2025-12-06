import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Layers,
  Wand2,
  FolderOpen,
  FileText,
  Users,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Plus,
  BookOpen,
  Clock,
  BarChart3,
  Sparkles
} from "lucide-react";

interface ScriptRightPanelProps {
  activeTool: string;
}

const panels = [
  { id: 'outline', icon: FileText, label: 'Outline' },
  { id: 'characters', icon: Users, label: 'Characters' },
  { id: 'dialogue', icon: MessageSquare, label: 'Dialogue' },
  { id: 'notes', icon: BookOpen, label: 'Notes' },
  { id: 'stats', icon: BarChart3, label: 'Statistics' },
  { id: 'ai', icon: Wand2, label: 'AI Writer' },
  { id: 'assets', icon: FolderOpen, label: 'Assets' },
];

const mockScenes = [
  { id: 1, heading: 'INT. TUNNEL - NIGHT', page: 1 },
  { id: 2, heading: 'EXT. CITY SKYLINE - NIGHT', page: 3 },
  { id: 3, heading: 'INT. LAB FACILITY - DAY', page: 5 },
  { id: 4, heading: 'EXT. RAINY STREET - NIGHT', page: 8 },
  { id: 5, heading: 'INT. CONTROL ROOM - CONTINUOUS', page: 10 },
];

const mockCharacters = [
  { name: 'MOTOKO', lines: 42, scenes: 8 },
  { name: 'BATOU', lines: 28, scenes: 6 },
  { name: 'TOGUSA', lines: 15, scenes: 4 },
  { name: 'PUPPET MASTER', lines: 12, scenes: 3 },
];

export const ScriptRightPanel = ({ activeTool }: ScriptRightPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activePanel, setActivePanel] = useState('outline');
  const [isHovered, setIsHovered] = useState(false);

  const shouldShow = isExpanded || isHovered;

  return (
    <div 
      className="h-full flex bg-[hsl(var(--cde-bg-secondary))] border-l border-[hsl(var(--cde-border-subtle))] transition-all duration-300"
      style={{ width: shouldShow ? '280px' : '12px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Collapsed ruler edge */}
      {!shouldShow && (
        <div className="w-full h-full bg-[hsl(var(--cde-bg-tertiary))] flex items-center justify-center">
          <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[hsl(45_80%_55%/0.3)] to-transparent" />
        </div>
      )}

      {shouldShow && (
        <>
          {/* Panel Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="h-10 flex items-center justify-between px-3 border-b border-[hsl(var(--cde-border-subtle))]">
              <span className="text-xs font-medium text-[hsl(var(--cde-text-secondary))] uppercase tracking-wide">
                {panels.find(p => p.id === activePanel)?.label}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
            </div>

            {/* Panel Content Area */}
            <ScrollArea className="flex-1">
              {activePanel === 'outline' && (
                <div className="p-3 space-y-2">
                  {mockScenes.map((scene) => (
                    <button
                      key={scene.id}
                      className="w-full p-3 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] hover:bg-[hsl(45_80%_55%)]/10 border border-[hsl(var(--cde-border-subtle))] text-left transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-mono text-[hsl(45_80%_55%)]">{scene.heading}</span>
                        <span className="text-[10px] text-[hsl(var(--cde-text-muted))] shrink-0">p.{scene.page}</span>
                      </div>
                    </button>
                  ))}
                  <Button variant="outline" size="sm" className="w-full gap-2 mt-2">
                    <Plus className="w-4 h-4" />
                    Add Scene
                  </Button>
                </div>
              )}

              {activePanel === 'characters' && (
                <div className="p-3 space-y-2">
                  {mockCharacters.map((char) => (
                    <button
                      key={char.name}
                      className="w-full p-3 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] hover:bg-[hsl(45_80%_55%)]/10 border border-[hsl(var(--cde-border-subtle))] text-left transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[hsl(var(--cde-text-primary))]">{char.name}</span>
                        <div className="flex gap-2 text-[10px] text-[hsl(var(--cde-text-muted))]">
                          <span>{char.lines} lines</span>
                          <span>•</span>
                          <span>{char.scenes} scenes</span>
                        </div>
                      </div>
                    </button>
                  ))}
                  <Button variant="outline" size="sm" className="w-full gap-2 mt-2">
                    <Plus className="w-4 h-4" />
                    Add Character
                  </Button>
                </div>
              )}

              {activePanel === 'stats' && (
                <div className="p-3 space-y-4">
                  <div className="p-3 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))]">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-[hsl(45_80%_55%)]" />
                      <span className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">ESTIMATED RUNTIME</span>
                    </div>
                    <span className="text-2xl font-bold text-[hsl(var(--cde-text-primary))]">1h 42min</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] text-center">
                      <span className="text-xl font-bold text-[hsl(45_80%_55%)]">5</span>
                      <span className="text-[10px] text-[hsl(var(--cde-text-muted))] block">Scenes</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] text-center">
                      <span className="text-xl font-bold text-[hsl(45_80%_55%)]">97</span>
                      <span className="text-[10px] text-[hsl(var(--cde-text-muted))] block">Dialogue Lines</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] text-center">
                      <span className="text-xl font-bold text-[hsl(45_80%_55%)]">4</span>
                      <span className="text-[10px] text-[hsl(var(--cde-text-muted))] block">Characters</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] text-center">
                      <span className="text-xl font-bold text-[hsl(45_80%_55%)]">12</span>
                      <span className="text-[10px] text-[hsl(var(--cde-text-muted))] block">Pages</span>
                    </div>
                  </div>
                </div>
              )}

              {activePanel === 'ai' && (
                <div className="p-3 space-y-3">
                  <div className="p-3 rounded-lg bg-[hsl(45_80%_55%)]/10 border border-[hsl(45_80%_55%)]/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-[hsl(45_80%_55%)]" />
                      <span className="text-xs font-medium text-[hsl(45_80%_55%)]">AI WRITER</span>
                    </div>
                    <p className="text-xs text-[hsl(var(--cde-text-muted))]">Get AI suggestions for dialogue, action lines, and scene descriptions.</p>
                  </div>
                  <Button size="sm" className="w-full bg-[hsl(45_80%_55%)] hover:bg-[hsl(45_80%_45%)] text-black">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Dialogue
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Wand2 className="w-4 h-4 mr-2" />
                    Improve Scene
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Analyze Pacing
                  </Button>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Panel Icons */}
          <div className="w-10 flex flex-col items-center py-2 gap-1 border-l border-[hsl(var(--cde-border-subtle))]">
            {panels.map((panel) => (
              <Button
                key={panel.id}
                variant="ghost"
                size="icon"
                className={`w-8 h-8 ${
                  activePanel === panel.id
                    ? 'bg-[hsl(45_80%_55%)]/20 text-[hsl(45_80%_55%)]'
                    : 'text-[hsl(var(--cde-text-muted))] hover:text-[hsl(var(--cde-text-primary))]'
                }`}
                onClick={() => setActivePanel(panel.id)}
              >
                <panel.icon className="w-4 h-4" />
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
