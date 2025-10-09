import { Eye, EyeOff, Lock, Unlock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  thumbnail?: string;
  children?: Layer[];
}

export const LayersPanel = () => {
  const [layers, setLayers] = useState<Layer[]>([
    { 
      id: '1', 
      name: 'Background', 
      visible: true, 
      locked: false,
      thumbnail: '🏔️'
    },
    { 
      id: '2', 
      name: 'Main Content', 
      visible: true, 
      locked: false,
      thumbnail: '🎨',
      children: [
        { id: '2a', name: 'Effect Layer', visible: true, locked: false, thumbnail: '✨' },
        { id: '2b', name: 'Mask', visible: true, locked: true, thumbnail: '🎭' }
      ]
    },
    { 
      id: '3', 
      name: 'Foreground', 
      visible: true, 
      locked: false,
      thumbnail: '🌟'
    },
  ]);

  const toggleVisibility = (id: string) => {
    setLayers(layers.map(layer => 
      layer.id === id ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const toggleLock = (id: string) => {
    setLayers(layers.map(layer => 
      layer.id === id ? { ...layer, locked: !layer.locked } : layer
    ));
  };

  const LayerItem = ({ layer, depth = 0 }: { layer: Layer; depth?: number }) => (
    <div className="group">
      <div 
        className="flex items-center gap-2 px-3 py-2 hover:bg-[hsl(var(--cde-bg-tertiary))] transition-colors cursor-pointer border-l-2 border-transparent hover:border-[hsl(var(--cde-accent-purple))]"
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        {/* Thumbnail */}
        <div className="w-10 h-10 rounded bg-[hsl(var(--cde-bg-primary))] border border-[hsl(var(--cde-border-subtle))] flex items-center justify-center text-xl flex-shrink-0">
          {layer.thumbnail}
        </div>
        
        {/* Name */}
        <span className="flex-1 text-sm text-[hsl(var(--cde-text-primary))] truncate">
          {layer.name}
        </span>
        
        {/* Controls */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7"
            onClick={() => toggleVisibility(layer.id)}
          >
            {layer.visible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4 text-[hsl(var(--cde-text-muted))]" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7"
            onClick={() => toggleLock(layer.id)}
          >
            {layer.locked ? (
              <Lock className="w-4 h-4 text-[hsl(var(--cde-accent-warning))]" />
            ) : (
              <Unlock className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Children */}
      {layer.children?.map(child => (
        <LayerItem key={child.id} layer={child} depth={depth + 1} />
      ))}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-[hsl(var(--cde-border-subtle))] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
          Layers
        </h3>
        <Button size="icon" variant="ghost" className="w-7 h-7">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Layers List */}
      <ScrollArea className="flex-1">
        <div className="py-2">
          {layers.map(layer => (
            <LayerItem key={layer.id} layer={layer} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
