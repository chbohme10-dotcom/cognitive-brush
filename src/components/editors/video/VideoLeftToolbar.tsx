import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  MousePointer2,
  Slice,
  Film,
  Clapperboard,
  Video,
  Camera,
  Move,
  RotateCcw,
  Maximize,
  Layers,
  Type,
  Sparkles,
  Wand2,
  Palette,
  Timer,
  Scissors,
  Copy,
  Eraser
} from "lucide-react";

const videoTools = [
  { id: 'select', icon: MousePointer2, label: 'Select', shortcut: 'V' },
  { id: 'razor', icon: Slice, label: 'Razor Tool', shortcut: 'C' },
  { id: 'slip', icon: Film, label: 'Slip Tool', shortcut: 'Y' },
  { id: 'slide', icon: Clapperboard, label: 'Slide Tool', shortcut: 'U' },
  { id: 'separator1', type: 'separator' },
  { id: 'generate', icon: Video, label: 'AI Video Generate', shortcut: 'G' },
  { id: 'camera', icon: Camera, label: 'Camera Control', shortcut: 'K' },
  { id: 'motion', icon: Move, label: 'Motion Path', shortcut: 'M' },
  { id: 'rotate', icon: RotateCcw, label: 'Rotation Tool', shortcut: 'R' },
  { id: 'scale', icon: Maximize, label: 'Scale Tool', shortcut: 'S' },
  { id: 'separator2', type: 'separator' },
  { id: 'layers', icon: Layers, label: 'Layer Editor', shortcut: 'L' },
  { id: 'text', icon: Type, label: 'Text & Titles', shortcut: 'T' },
  { id: 'effects', icon: Sparkles, label: 'Visual Effects', shortcut: 'E' },
  { id: 'ai', icon: Wand2, label: 'AI Enhancement', shortcut: 'A' },
  { id: 'color', icon: Palette, label: 'Color Grading', shortcut: 'P' },
  { id: 'separator3', type: 'separator' },
  { id: 'speed', icon: Timer, label: 'Speed Control', shortcut: 'D' },
  { id: 'cut', icon: Scissors, label: 'Cut', shortcut: 'Ctrl+X' },
  { id: 'copy', icon: Copy, label: 'Copy', shortcut: 'Ctrl+C' },
  { id: 'erase', icon: Eraser, label: 'Delete', shortcut: 'Del' },
];

interface VideoLeftToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
}

export const VideoLeftToolbar = ({ activeTool, onToolChange }: VideoLeftToolbarProps) => {
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
            hsl(187 85% 53% / 0.2) 0px,
            hsl(187 85% 53% / 0.2) 1px,
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
            style={{ borderBottom: `1px solid ${i % 5 === 0 ? 'hsl(187 85% 53% / 0.4)' : 'hsl(var(--cde-border-subtle))'}` }}
          />
        ))}
      </div>
      
      {isHovered && (
        <div className="flex flex-col gap-1 pr-3 overflow-y-auto max-h-full scrollbar-thin">
          {videoTools.map((tool) => {
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
                        ? 'bg-[hsl(187_85%_53%)]/20 border border-[hsl(187_85%_53%)] text-[hsl(187_85%_53%)] shadow-[0_0_12px_hsl(187_85%_53%/0.3)]' 
                        : 'bg-[hsl(var(--cde-bg-tertiary))] hover:bg-[hsl(var(--cde-bg-secondary))] border border-transparent hover:border-[hsl(187_85%_53%/0.5)]'
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
