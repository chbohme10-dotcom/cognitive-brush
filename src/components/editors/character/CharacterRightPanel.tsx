import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Layers,
  Palette,
  Wand2,
  FolderOpen,
  UserCircle,
  Shirt,
  Smile,
  Brain,
  Heart,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Plus,
  Camera
} from "lucide-react";

interface CharacterRightPanelProps {
  activeTool: string;
}

const panels = [
  { id: 'characters', icon: UserCircle, label: 'Characters' },
  { id: 'appearance', icon: Palette, label: 'Appearance' },
  { id: 'wardrobe', icon: Shirt, label: 'Wardrobe' },
  { id: 'expressions', icon: Smile, label: 'Expressions' },
  { id: 'personality', icon: Brain, label: 'Personality' },
  { id: 'ai', icon: Wand2, label: 'AI Character' },
  { id: 'assets', icon: FolderOpen, label: 'Assets' },
  { id: 'chat', icon: MessageSquare, label: 'AI Chat' },
];

const mockCharacters = [
  { id: 1, name: 'Alex Chen', role: 'Protagonist', thumbnail: '👨‍💼' },
  { id: 2, name: 'Maya Rivera', role: 'Supporting', thumbnail: '👩‍🔬' },
  { id: 3, name: 'Dr. James', role: 'Antagonist', thumbnail: '🧑‍⚕️' },
  { id: 4, name: 'Sarah Blake', role: 'Supporting', thumbnail: '👩‍🎨' },
];

const expressions = ['😊', '😢', '😠', '😲', '🤔', '😴', '😍', '😎'];

export const CharacterRightPanel = ({ activeTool }: CharacterRightPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activePanel, setActivePanel] = useState('characters');
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
            hsl(330 80% 60% / 0.2) 0px,
            hsl(330 80% 60% / 0.2) 1px,
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
            style={{ borderBottom: `1px solid ${i % 5 === 0 ? 'hsl(330 80% 60% / 0.4)' : 'hsl(var(--cde-border-subtle))'}` }}
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
                className={`w-8 h-8 ${activePanel === panel.id ? 'bg-[hsl(330_80%_60%)]/20 text-[hsl(330_80%_60%)]' : ''}`}
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
            {activePanel === 'characters' && (
              <div className="p-3 space-y-2">
                <Button variant="outline" size="sm" className="w-full gap-2 border-dashed">
                  <Plus className="w-4 h-4" />
                  Create Character
                </Button>
                
                {mockCharacters.map((character) => (
                  <div 
                    key={character.id}
                    className="p-3 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))] cursor-pointer hover:border-[hsl(330_80%_60%/0.5)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[hsl(var(--cde-bg-primary))] flex items-center justify-center text-2xl">
                        {character.thumbnail}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{character.name}</p>
                        <p className="text-xs text-[hsl(var(--cde-text-muted))]">{character.role}</p>
                      </div>
                      <Camera className="w-4 h-4 text-[hsl(var(--cde-text-muted))]" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activePanel === 'expressions' && (
              <div className="p-3 space-y-3">
                <p className="text-xs text-[hsl(var(--cde-text-muted))]">Select character expression</p>
                <div className="grid grid-cols-4 gap-2">
                  {expressions.map((exp, i) => (
                    <button 
                      key={i}
                      className="w-14 h-14 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))] hover:border-[hsl(330_80%_60%/0.5)] flex items-center justify-center text-2xl transition-all"
                    >
                      {exp}
                    </button>
                  ))}
                </div>
                
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Plus className="w-4 h-4" />
                  Generate Custom Expression
                </Button>
              </div>
            )}
            
            {activePanel === 'ai' && (
              <div className="p-3 space-y-3">
                <div className="p-4 rounded-lg bg-gradient-to-br from-[hsl(330_80%_60%/0.1)] to-transparent border border-[hsl(330_80%_60%/0.3)]">
                  <Wand2 className="w-8 h-8 text-[hsl(330_80%_60%)] mb-2" />
                  <h4 className="font-semibold mb-1">CastingAI</h4>
                  <p className="text-xs text-[hsl(var(--cde-text-muted))]">
                    Generate and customize characters with AI
                  </p>
                </div>
                
                <Button className="w-full bg-[hsl(330_80%_60%)] hover:bg-[hsl(330_80%_50%)]">
                  <UserCircle className="w-4 h-4 mr-2" />
                  Generate Character
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Smile className="w-4 h-4 mr-2" />
                  Generate Expression Sheet
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Shirt className="w-4 h-4 mr-2" />
                  Generate Wardrobe
                </Button>
              </div>
            )}
            
            {activePanel === 'chat' && (
              <div className="p-3 h-full flex flex-col">
                <div className="flex-1 bg-[hsl(var(--cde-bg-primary))] rounded-lg p-3 mb-3">
                  <p className="text-xs text-[hsl(var(--cde-text-muted))] text-center">
                    AI Assistant ready to help with character design
                  </p>
                </div>
                <input 
                  type="text"
                  placeholder="Ask about character design..."
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
