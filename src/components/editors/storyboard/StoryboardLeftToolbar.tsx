import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  MousePointer2,
  LayoutGrid,
  Plus,
  Frame,
  ArrowRight,
  Link2,
  Type,
  StickyNote,
  Camera,
  Users,
  Clock,
  Wand2,
  Image,
  Clapperboard,
  Move,
  Trash2,
  Copy,
  Scissors
} from "lucide-react";

const storyboardTools = [
  { id: 'select', icon: MousePointer2, label: 'Select', shortcut: 'V' },
  { id: 'pan', icon: Move, label: 'Pan View', shortcut: 'H' },
  { id: 'separator1', type: 'separator' },
  { id: 'addFrame', icon: Plus, label: 'Add Frame', shortcut: 'N' },
  { id: 'frameTemplate', icon: Frame, label: 'Frame Template', shortcut: 'F' },
  { id: 'gridView', icon: LayoutGrid, label: 'Grid View', shortcut: 'G' },
  { id: 'separator2', type: 'separator' },
  { id: 'transition', icon: ArrowRight, label: 'Add Transition', shortcut: 'T' },
  { id: 'link', icon: Link2, label: 'Link Frames', shortcut: 'L' },
  { id: 'separator3', type: 'separator' },
  { id: 'text', icon: Type, label: 'Add Text', shortcut: 'E' },
  { id: 'note', icon: StickyNote, label: 'Add Note', shortcut: 'O' },
  { id: 'camera', icon: Camera, label: 'Camera Direction', shortcut: 'C' },
  { id: 'character', icon: Users, label: 'Character Marker', shortcut: 'U' },
  { id: 'timing', icon: Clock, label: 'Timing', shortcut: 'I' },
  { id: 'separator4', type: 'separator' },
  { id: 'aiGenerate', icon: Wand2, label: 'AI Generate Frame', shortcut: 'A' },
  { id: 'imageImport', icon: Image, label: 'Import Image', shortcut: 'M' },
  { id: 'scene', icon: Clapperboard, label: 'Scene Break', shortcut: 'S' },
  { id: 'separator5', type: 'separator' },
  { id: 'cut', icon: Scissors, label: 'Cut', shortcut: 'Ctrl+X' },
  { id: 'copy', icon: Copy, label: 'Copy', shortcut: 'Ctrl+C' },
  { id: 'delete', icon: Trash2, label: 'Delete', shortcut: 'Del' },
];

interface StoryboardLeftToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
}

export const StoryboardLeftToolbar = ({ activeTool, onToolChange }: StoryboardLeftToolbarProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside 
      className="border-r border-[hsl(var(--cde-border-subtle))] flex flex-col items-center relative overflow-hidden transition-all duration-300 ease-in-out"
      style={{ 
        width: isHovered ? '56px' : '10px',
        paddingTop: isHovered ? '8px' : '0',
        paddingBottom: isHovered ? '8px' : '0',
        background: `
          linear-gradient(to right, hsl(var(--cde-bg-secondary)) 0%, hsl(var(--cde-bg-secondary)) calc(100% - 10px), hsl(var(--cde-bg-tertiary)) calc(100% - 10px)),
          repeating-linear-gradient(
            0deg,
            hsl(142 71% 45% / 0.2) 0px,
            hsl(142 71% 45% / 0.2) 1px,
            transparent 1px,
            transparent 20px
          )
        `,
        backgroundPosition: '0 0, 100% 0',
        backgroundSize: '100% 100%, 10px 100px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ruler on right edge */}
      <div className="absolute top-0 bottom-0 right-0 w-[10px] flex flex-col items-start pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={i} 
            className="flex-shrink-0 h-5 w-full relative"
            style={{ borderBottom: `1px solid ${i % 5 === 0 ? 'hsl(142 71% 45% / 0.4)' : 'hsl(var(--cde-border-subtle))'}` }}
          />
        ))}
      </div>
      
      {isHovered && (
        <div className="flex flex-col gap-1 pr-3 overflow-y-auto max-h-full scrollbar-thin">
          {storyboardTools.map((tool) => {
            if (tool.type === 'separator') {
              return <div key={tool.id} className="h-px w-8 mx-auto bg-[hsl(var(--cde-border-subtle))] my-1" />;
            }
            
            const Icon = tool.icon!;
            const isActive = activeTool === tool.id;
            
            return (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`
                      w-10 h-10 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-[hsl(142_71%_45%)]/20 border border-[hsl(142_71%_45%)] text-[hsl(142_71%_45%)] shadow-[0_0_12px_hsl(142_71%_45%/0.3)]' 
                        : 'bg-[hsl(var(--cde-bg-tertiary))] hover:bg-[hsl(var(--cde-bg-secondary))] border border-transparent hover:border-[hsl(142_71%_45%/0.5)]'
                      }
                    `}
                    onClick={() => onToolChange(tool.id)}
                  >
                    <Icon className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-[hsl(var(--cde-bg-secondary))] border-[hsl(var(--cde-border-subtle))]">
                  <div className="flex items-center gap-2">
                    <span>{tool.label}</span>
                    <kbd className="px-1.5 py-0.5 text-xs bg-[hsl(var(--cde-bg-tertiary))] rounded">
                      {tool.shortcut}
                    </kbd>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      )}
    </aside>
  );
};
