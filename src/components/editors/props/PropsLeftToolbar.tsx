import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  MousePointer2,
  Box,
  Mountain,
  Building,
  Lamp,
  Trees,
  Car,
  Sofa,
  Move,
  Scale,
  RotateCcw,
  Wand2,
  Camera,
  Layers,
  Tag,
  Package,
  Warehouse,
  Copy,
  Trash2,
  Download
} from "lucide-react";

const propsTools = [
  { id: 'select', icon: MousePointer2, label: 'Select', shortcut: 'V' },
  { id: 'move', icon: Move, label: 'Move', shortcut: 'M' },
  { id: 'scale', icon: Scale, label: 'Scale', shortcut: 'S' },
  { id: 'rotate', icon: RotateCcw, label: 'Rotate', shortcut: 'R' },
  { id: 'separator1', type: 'separator' },
  { id: 'createProp', icon: Box, label: 'Create Prop', shortcut: 'N' },
  { id: 'createScene', icon: Mountain, label: 'Create Scene', shortcut: 'E' },
  { id: 'separator2', type: 'separator' },
  { id: 'buildings', icon: Building, label: 'Buildings', shortcut: 'B' },
  { id: 'lighting', icon: Lamp, label: 'Lighting Props', shortcut: 'L' },
  { id: 'nature', icon: Trees, label: 'Nature & Foliage', shortcut: 'T' },
  { id: 'vehicles', icon: Car, label: 'Vehicles', shortcut: 'C' },
  { id: 'furniture', icon: Sofa, label: 'Furniture', shortcut: 'F' },
  { id: 'separator3', type: 'separator' },
  { id: 'layers', icon: Layers, label: 'Scene Layers', shortcut: 'Y' },
  { id: 'camera', icon: Camera, label: 'Camera Angles', shortcut: 'K' },
  { id: 'separator4', type: 'separator' },
  { id: 'aiGenerate', icon: Wand2, label: 'AI Generate', shortcut: 'G' },
  { id: 'tag', icon: Tag, label: 'Tag & Categorize', shortcut: 'A' },
  { id: 'package', icon: Package, label: 'Package Asset', shortcut: 'P' },
  { id: 'library', icon: Warehouse, label: 'Asset Library', shortcut: 'I' },
  { id: 'separator5', type: 'separator' },
  { id: 'export', icon: Download, label: 'Export', shortcut: 'Ctrl+E' },
  { id: 'copy', icon: Copy, label: 'Duplicate', shortcut: 'Ctrl+D' },
  { id: 'delete', icon: Trash2, label: 'Delete', shortcut: 'Del' },
];

interface PropsLeftToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
}

export const PropsLeftToolbar = ({ activeTool, onToolChange }: PropsLeftToolbarProps) => {
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
            hsl(200 80% 50% / 0.2) 0px,
            hsl(200 80% 50% / 0.2) 1px,
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
            style={{ borderBottom: `1px solid ${i % 5 === 0 ? 'hsl(200 80% 50% / 0.4)' : 'hsl(var(--cde-border-subtle))'}` }}
          />
        ))}
      </div>
      
      {isHovered && (
        <div className="flex flex-col gap-1 pr-3 overflow-y-auto max-h-full scrollbar-thin">
          {propsTools.map((tool) => {
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
                        ? 'bg-[hsl(200_80%_50%)]/20 border border-[hsl(200_80%_50%)] text-[hsl(200_80%_50%)] shadow-[0_0_12px_hsl(200_80%_50%/0.3)]' 
                        : 'bg-[hsl(var(--cde-bg-tertiary))] hover:bg-[hsl(var(--cde-bg-secondary))] border border-transparent hover:border-[hsl(200_80%_50%/0.5)]'
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
