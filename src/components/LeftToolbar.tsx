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
import { AIGenerateDialog } from "./ai/AIGenerateDialog";
import { AIEditDialog } from "./ai/AIEditDialog";

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
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleToolClick = (toolId: string) => {
    setActiveTool(toolId);
    if (toolId === 'ai') {
      setShowGenerateDialog(true);
    }
  };
  
  return (
    <>
      <AIGenerateDialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog} />
      <AIEditDialog open={showEditDialog} onOpenChange={setShowEditDialog} />
    <aside 
      className="border-r border-[hsl(var(--cde-border-subtle))] flex flex-col items-center relative overflow-hidden transition-all duration-300 ease-in-out"
      style={{
        width: isHovered ? '64px' : '10px',
        paddingTop: isHovered ? '16px' : '0',
        paddingBottom: isHovered ? '16px' : '0',
        background: `
          linear-gradient(to right, hsl(var(--cde-bg-secondary)) 0%, hsl(var(--cde-bg-secondary)) calc(100% - 10px), hsl(var(--cde-bg-tertiary)) calc(100% - 10px)),
          repeating-linear-gradient(
            0deg,
            hsl(var(--cde-border-subtle)) 0px,
            hsl(var(--cde-border-subtle)) 1px,
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
        {/* Ruler markings */}
        <div className="absolute right-0 top-0 bottom-0 w-[10px] flex flex-col pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 h-5 w-full border-b border-[hsl(var(--cde-border-subtle))] relative">
              {i % 5 === 0 && (
                <span 
                  className="absolute right-0 top-0.5 text-[8px] text-[hsl(var(--cde-text-muted))] font-mono"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  {i * 20}
                </span>
              )}
            </div>
          ))}
        </div>
        
        {/* Tools - only visible when hovered */}
        {isHovered && (
          <div className="flex flex-col gap-1 animate-fade-in">
            {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool.id)}
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
          </div>
        )}
    </aside>
    </>
  );
};
