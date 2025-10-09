import { useState } from "react";
import { 
  MousePointer2, 
  Lasso, 
  PenTool, 
  Paintbrush, 
  Eraser,
  Stamp,
  Sun,
  Droplets,
  PaintBucket,
  Square,
  Type,
  Wand2,
  Move,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";

const tools = [
  { id: 'select', icon: MousePointer2, label: 'Selection' },
  { id: 'lasso', icon: Lasso, label: 'Lasso' },
  { id: 'pen', icon: PenTool, label: 'Pen' },
  { id: 'brush', icon: Paintbrush, label: 'Brush' },
  { id: 'eraser', icon: Eraser, label: 'Eraser' },
  { id: 'stamp', icon: Stamp, label: 'Clone Stamp' },
  { id: 'dodge', icon: Sun, label: 'Dodge/Burn' },
  { id: 'blur', icon: Droplets, label: 'Blur' },
  { id: 'fill', icon: PaintBucket, label: 'Fill' },
  { id: 'shape', icon: Square, label: 'Shapes' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'ai', icon: Wand2, label: 'AI Tools' },
  { id: 'move', icon: Move, label: 'Move' },
  { id: 'zoom', icon: Search, label: 'Zoom' },
];

export const LeftToolbar = () => {
  const [activeTool, setActiveTool] = useState('select');
  
  return (
    <aside className="w-16 border-r border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-secondary))] flex flex-col items-center py-4 gap-1">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={cn(
              "cde-tool-button group relative",
              activeTool === tool.id && "active"
            )}
            title={tool.label}
          >
            <Icon className="w-5 h-5 text-[hsl(var(--cde-text-primary))]" />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))] rounded text-xs whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
              {tool.label}
            </div>
          </button>
        );
      })}
    </aside>
  );
};
