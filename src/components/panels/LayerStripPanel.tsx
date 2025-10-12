import { Eye, EyeOff, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  thumbnail?: string;
}

interface LayerStripPanelProps {
  layers: Layer[];
  activeLayerId?: string;
  onLayerClick: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onReorder: (dragId: string, dropId: string) => void;
}

export const LayerStripPanel = ({
  layers,
  activeLayerId,
  onLayerClick,
  onToggleVisibility,
  onToggleLock,
  onReorder,
}: LayerStripPanelProps) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  return (
    <div className="w-16 border-r border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-tertiary))] flex flex-col overflow-y-auto">
      <div className="p-2 border-b border-[hsl(var(--cde-border-subtle))]">
        <div className="text-xs font-medium text-[hsl(var(--cde-text-secondary))] text-center">
          Layers
        </div>
      </div>
      
      <div className="flex-1 space-y-1 p-1">
        {layers.map((layer) => (
          <Popover key={layer.id}>
            <PopoverTrigger asChild>
              <div
                draggable
                onDragStart={() => setDraggedId(layer.id)}
                onDragEnd={() => setDraggedId(null)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggedId && draggedId !== layer.id) {
                    onReorder(draggedId, layer.id);
                  }
                }}
                className={`
                  relative group cursor-pointer rounded border
                  ${activeLayerId === layer.id 
                    ? "border-[hsl(var(--cde-accent-purple))] bg-[hsl(var(--cde-accent-purple))]/20" 
                    : "border-transparent hover:border-[hsl(var(--cde-border-subtle))]"
                  }
                  ${draggedId === layer.id ? "opacity-50" : ""}
                `}
                onClick={() => onLayerClick(layer.id)}
              >
                <div className="aspect-square w-full bg-[hsl(var(--cde-bg-secondary))] rounded flex items-center justify-center overflow-hidden">
                  {layer.thumbnail ? (
                    <img 
                      src={layer.thumbnail} 
                      alt={layer.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-xs text-[hsl(var(--cde-text-muted))]">
                      {layer.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                
                {/* Status indicators */}
                <div className="absolute top-0.5 right-0.5 flex gap-0.5">
                  {!layer.visible && (
                    <div className="w-3 h-3 rounded-full bg-[hsl(var(--cde-bg-primary))] flex items-center justify-center">
                      <EyeOff className="w-2 h-2 text-[hsl(var(--cde-text-muted))]" />
                    </div>
                  )}
                  {layer.locked && (
                    <div className="w-3 h-3 rounded-full bg-[hsl(var(--cde-bg-primary))] flex items-center justify-center">
                      <Lock className="w-2 h-2 text-[hsl(var(--cde-text-muted))]" />
                    </div>
                  )}
                </div>
              </div>
            </PopoverTrigger>
            
            <PopoverContent side="right" className="w-64 p-3 bg-[hsl(var(--cde-bg-secondary))] border-[hsl(var(--cde-border-subtle))]">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[hsl(var(--cde-text-primary))]">
                    {layer.name}
                  </span>
                </div>
                
                <div className="aspect-video w-full bg-[hsl(var(--cde-bg-tertiary))] rounded overflow-hidden">
                  {layer.thumbnail ? (
                    <img 
                      src={layer.thumbnail} 
                      alt={layer.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[hsl(var(--cde-text-muted))]">
                      No preview
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleVisibility(layer.id);
                          }}
                        >
                          {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Toggle Visibility</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleLock(layer.id);
                          }}
                        >
                          {layer.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Toggle Lock</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </div>
  );
};
