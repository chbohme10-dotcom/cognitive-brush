import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  MousePointer2,
  Type,
  AlignLeft,
  MessageSquare,
  Users,
  Camera,
  Clock,
  Bookmark,
  Split,
  FileText,
  Sparkles,
  Scissors,
  CornerDownRight
} from "lucide-react";

interface ScriptLeftToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
}

const tools = [
  { id: 'select', icon: MousePointer2, label: 'Select', shortcut: 'V' },
  { id: 'text', icon: Type, label: 'Text Edit', shortcut: 'T' },
  { id: 'action', icon: AlignLeft, label: 'Action Line', shortcut: 'A' },
  { id: 'dialogue', icon: MessageSquare, label: 'Dialogue', shortcut: 'D' },
  { id: 'character', icon: Users, label: 'Character Cue', shortcut: 'C' },
  { id: 'shot', icon: Camera, label: 'Shot Description', shortcut: 'S' },
  { id: 'transition', icon: CornerDownRight, label: 'Transition', shortcut: 'R' },
  { id: 'scene', icon: FileText, label: 'Scene Heading', shortcut: 'H' },
];

const editTools = [
  { id: 'split', icon: Split, label: 'Split Scene' },
  { id: 'cut', icon: Scissors, label: 'Cut Selection' },
  { id: 'bookmark', icon: Bookmark, label: 'Add Bookmark' },
  { id: 'timing', icon: Clock, label: 'Timing Notes' },
  { id: 'ai-suggest', icon: Sparkles, label: 'AI Suggestions' },
];

export const ScriptLeftToolbar = ({ activeTool, onToolChange }: ScriptLeftToolbarProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="h-full flex flex-col bg-[hsl(var(--cde-bg-secondary))] border-r border-[hsl(var(--cde-border-subtle))] transition-all duration-300"
      style={{ width: isHovered ? '48px' : '12px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ruler edge when collapsed */}
      {!isHovered && (
        <div className="w-full h-full bg-[hsl(var(--cde-bg-tertiary))] flex items-center justify-center">
          <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[hsl(45_80%_55%/0.3)] to-transparent" />
        </div>
      )}

      {isHovered && (
        <div className="flex-1 flex flex-col p-1.5 gap-1">
          {/* Script Element Tools */}
          <div className="space-y-1">
            {tools.map((tool) => (
              <Tooltip key={tool.id} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`w-9 h-9 ${
                      activeTool === tool.id
                        ? 'bg-[hsl(45_80%_55%)]/20 text-[hsl(45_80%_55%)]'
                        : 'text-[hsl(var(--cde-text-muted))] hover:text-[hsl(var(--cde-text-primary))] hover:bg-[hsl(var(--cde-bg-tertiary))]'
                    }`}
                    onClick={() => onToolChange(tool.id)}
                  >
                    <tool.icon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-2">
                  <span>{tool.label}</span>
                  <kbd className="px-1.5 py-0.5 text-[10px] bg-[hsl(var(--cde-bg-tertiary))] rounded">{tool.shortcut}</kbd>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          <div className="w-full h-px bg-[hsl(var(--cde-border-subtle))] my-2" />

          {/* Edit Tools */}
          <div className="space-y-1">
            {editTools.map((tool) => (
              <Tooltip key={tool.id} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`w-9 h-9 ${
                      activeTool === tool.id
                        ? 'bg-[hsl(45_80%_55%)]/20 text-[hsl(45_80%_55%)]'
                        : 'text-[hsl(var(--cde-text-muted))] hover:text-[hsl(var(--cde-text-primary))] hover:bg-[hsl(var(--cde-bg-tertiary))]'
                    }`}
                    onClick={() => onToolChange(tool.id)}
                  >
                    <tool.icon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{tool.label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
