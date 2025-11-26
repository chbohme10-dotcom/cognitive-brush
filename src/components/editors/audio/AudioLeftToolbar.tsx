import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  MousePointer2,
  Slice,
  Volume2,
  Waves,
  Music,
  Mic,
  Timer,
  AudioWaveform,
  Headphones,
  Radio,
  Disc3,
  Piano,
  Guitar,
  Drum,
  Eraser,
  Copy,
  Scissors
} from "lucide-react";

const audioTools = [
  { id: 'select', icon: MousePointer2, label: 'Select', shortcut: 'V' },
  { id: 'slice', icon: Slice, label: 'Slice Tool', shortcut: 'S' },
  { id: 'volume', icon: Volume2, label: 'Volume Envelope', shortcut: 'E' },
  { id: 'fade', icon: Waves, label: 'Fade Tool', shortcut: 'F' },
  { id: 'separator1', type: 'separator' },
  { id: 'generate', icon: Music, label: 'AI Music Generate', shortcut: 'G' },
  { id: 'voice', icon: Mic, label: 'Voice Synthesis', shortcut: 'M' },
  { id: 'sfx', icon: AudioWaveform, label: 'Sound Effects', shortcut: 'X' },
  { id: 'separator2', type: 'separator' },
  { id: 'tempo', icon: Timer, label: 'Tempo Tool', shortcut: 'T' },
  { id: 'eq', icon: Headphones, label: 'EQ & Mastering', shortcut: 'Q' },
  { id: 'spatial', icon: Radio, label: 'Spatial Audio', shortcut: 'A' },
  { id: 'separator3', type: 'separator' },
  { id: 'synth', icon: Disc3, label: 'Synthesizer', shortcut: '1' },
  { id: 'piano', icon: Piano, label: 'Piano Roll', shortcut: '2' },
  { id: 'guitar', icon: Guitar, label: 'Guitar Tab', shortcut: '3' },
  { id: 'drums', icon: Drum, label: 'Drum Machine', shortcut: '4' },
  { id: 'separator4', type: 'separator' },
  { id: 'cut', icon: Scissors, label: 'Cut', shortcut: 'Ctrl+X' },
  { id: 'copy', icon: Copy, label: 'Copy', shortcut: 'Ctrl+C' },
  { id: 'erase', icon: Eraser, label: 'Erase', shortcut: 'Del' },
];

interface AudioLeftToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
}

export const AudioLeftToolbar = ({ activeTool, onToolChange }: AudioLeftToolbarProps) => {
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
            hsl(38 92% 50% / 0.2) 0px,
            hsl(38 92% 50% / 0.2) 1px,
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
            style={{ borderBottom: `1px solid ${i % 5 === 0 ? 'hsl(38 92% 50% / 0.4)' : 'hsl(var(--cde-border-subtle))'}` }}
          >
            {i % 5 === 0 && (
              <span className="absolute left-0.5 top-0.5 text-[8px] text-[hsl(var(--cde-text-muted))] font-mono writing-mode-vertical">
                {i * 20}
              </span>
            )}
          </div>
        ))}
      </div>
      
      {isHovered && (
        <div className="flex flex-col gap-1 pr-3 overflow-y-auto max-h-full scrollbar-thin">
          {audioTools.map((tool) => {
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
                        ? 'bg-[hsl(38_92%_50%)]/20 border border-[hsl(38_92%_50%)] text-[hsl(38_92%_50%)] shadow-[0_0_12px_hsl(38_92%_50%/0.3)]' 
                        : 'bg-[hsl(var(--cde-bg-tertiary))] hover:bg-[hsl(var(--cde-bg-secondary))] border border-transparent hover:border-[hsl(38_92%_50%/0.5)]'
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
