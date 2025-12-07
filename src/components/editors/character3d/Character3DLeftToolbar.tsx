import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  MousePointer2,
  Move3D,
  RotateCcw,
  Scale3D,
  Bone,
  Brush,
  Eraser,
  Magnet,
  CircleDot,
  Grid3X3,
  Eye,
  Box,
  Cylinder,
  Circle,
  PersonStanding,
  Hand,
  Footprints,
  Crown,
  Shirt
} from "lucide-react";

interface Character3DLeftToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
}

const tools = [
  { id: 'select', icon: MousePointer2, label: 'Select', group: 'transform' },
  { id: 'move', icon: Move3D, label: 'Move (G)', group: 'transform' },
  { id: 'rotate', icon: RotateCcw, label: 'Rotate (R)', group: 'transform' },
  { id: 'scale', icon: Scale3D, label: 'Scale (S)', group: 'transform' },
  { id: 'divider1', icon: null, label: '', group: 'divider' },
  { id: 'bone', icon: Bone, label: 'Bone Tool', group: 'rigging' },
  { id: 'ik', icon: Magnet, label: 'IK Chain', group: 'rigging' },
  { id: 'joint', icon: CircleDot, label: 'Joint', group: 'rigging' },
  { id: 'divider2', icon: null, label: '', group: 'divider' },
  { id: 'sculpt', icon: Brush, label: 'Sculpt Brush', group: 'sculpt' },
  { id: 'smooth', icon: Eraser, label: 'Smooth', group: 'sculpt' },
  { id: 'divider3', icon: null, label: '', group: 'divider' },
  { id: 'box', icon: Box, label: 'Add Box', group: 'primitives' },
  { id: 'sphere', icon: Circle, label: 'Add Sphere', group: 'primitives' },
  { id: 'cylinder', icon: Cylinder, label: 'Add Cylinder', group: 'primitives' },
  { id: 'divider4', icon: null, label: '', group: 'divider' },
  { id: 'body', icon: PersonStanding, label: 'Body', group: 'parts' },
  { id: 'head', icon: Crown, label: 'Head', group: 'parts' },
  { id: 'hands', icon: Hand, label: 'Hands', group: 'parts' },
  { id: 'feet', icon: Footprints, label: 'Feet', group: 'parts' },
  { id: 'clothing', icon: Shirt, label: 'Clothing', group: 'parts' },
];

export const Character3DLeftToolbar = ({ activeTool, onToolChange }: Character3DLeftToolbarProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <div 
        className="relative h-full flex"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Ruler Edge */}
        <div className="w-[10px] h-full bg-[hsl(var(--cde-bg-secondary))] border-r border-[hsl(var(--cde-border-subtle))] flex flex-col">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="flex-1 border-b border-[hsl(var(--cde-border-subtle))]/30 relative">
              {i % 5 === 0 && (
                <span className="absolute right-1 top-0 text-[6px] text-[hsl(var(--cde-text-muted))]">
                  {i * 25}
                </span>
              )}
            </div>
          ))}
        </div>
        
        {/* Expandable Toolbar */}
        <div 
          className={`h-full bg-[hsl(var(--cde-bg-secondary))] border-r border-[hsl(var(--cde-border-subtle))] transition-all duration-300 overflow-hidden ${
            isHovered ? 'w-12 opacity-100' : 'w-0 opacity-0'
          }`}
        >
          <div className="p-1.5 space-y-1 overflow-y-auto h-full">
            {tools.map((tool) => {
              if (tool.group === 'divider') {
                return <div key={tool.id} className="h-px bg-[hsl(var(--cde-border-subtle))] my-2" />;
              }
              
              const Icon = tool.icon!;
              const isActive = activeTool === tool.id;
              
              return (
                <Tooltip key={tool.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`w-9 h-9 ${
                        isActive 
                          ? 'bg-[hsl(280_70%_50%)]/20 text-[hsl(280_70%_60%)] border border-[hsl(280_70%_50%)]/50' 
                          : 'text-[hsl(var(--cde-text-muted))] hover:text-[hsl(var(--cde-text-primary))] hover:bg-[hsl(var(--cde-bg-tertiary))]'
                      }`}
                      onClick={() => onToolChange(tool.id)}
                    >
                      <Icon className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))]">
                    <p className="text-xs">{tool.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
