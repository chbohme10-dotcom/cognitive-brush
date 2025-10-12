import { Eye, EyeOff, Lock, Unlock, Plus, ChevronDown, ChevronRight, Layers3, Wand2, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Modifier {
  id: string;
  type: 'mask' | 'warp' | 'color' | 'effect';
  name: string;
  visible: boolean;
  thumbnail?: string;
}

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  thumbnail?: string;
  opacity?: number;
  blendMode?: string;
  modifiers?: Modifier[];
  children?: Layer[];
}

export const LayersPanel = () => {
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set(['2']));
  const [expandedModifiers, setExpandedModifiers] = useState<Set<string>>(new Set());
  const [activeLayerId, setActiveLayerId] = useState<string>('2');

  const [layers, setLayers] = useState<Layer[]>([
    { 
      id: '1', 
      name: 'Background', 
      visible: true, 
      locked: false,
      thumbnail: '🏔️',
      opacity: 100,
      blendMode: 'Normal',
      modifiers: []
    },
    { 
      id: '2', 
      name: 'Main Content', 
      visible: true, 
      locked: false,
      thumbnail: '🎨',
      opacity: 100,
      blendMode: 'Normal',
      modifiers: [
        { id: 'm1', type: 'mask', name: 'Transparency Mask', visible: true, thumbnail: '🎭' },
        { id: 'm2', type: 'warp', name: 'Warp Modifier', visible: true, thumbnail: '〰️' },
        { id: 'm3', type: 'effect', name: 'Glow Effect', visible: false, thumbnail: '✨' }
      ],
      children: [
        { id: '2a', name: 'Effect Layer', visible: true, locked: false, thumbnail: '✨', opacity: 80, blendMode: 'Screen' },
        { id: '2b', name: 'Adjustment', visible: true, locked: true, thumbnail: '🎛️', opacity: 100, blendMode: 'Overlay' }
      ]
    },
    { 
      id: '3', 
      name: 'Foreground', 
      visible: true, 
      locked: false,
      thumbnail: '🌟',
      opacity: 100,
      blendMode: 'Normal',
      modifiers: [
        { id: 'm4', type: 'mask', name: 'Layer Mask', visible: true, thumbnail: '⬜' }
      ]
    },
  ]);

  const toggleLayerExpansion = (id: string) => {
    setExpandedLayers(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleModifierExpansion = (id: string) => {
    setExpandedModifiers(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

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

  const toggleModifierVisibility = (layerId: string, modifierId: string) => {
    setLayers(layers.map(layer => {
      if (layer.id === layerId && layer.modifiers) {
        return {
          ...layer,
          modifiers: layer.modifiers.map(mod =>
            mod.id === modifierId ? { ...mod, visible: !mod.visible } : mod
          )
        };
      }
      return layer;
    }));
  };

  const getModifierIcon = (type: Modifier['type']) => {
    switch (type) {
      case 'mask': return Scissors;
      case 'warp': return Wand2;
      case 'effect': return Layers3;
      default: return Layers3;
    }
  };

  const LayerItem = ({ layer, depth = 0 }: { layer: Layer; depth?: number }) => {
    const hasChildren = layer.children && layer.children.length > 0;
    const hasModifiers = layer.modifiers && layer.modifiers.length > 0;
    const isExpanded = expandedLayers.has(layer.id);
    const isModifiersExpanded = expandedModifiers.has(layer.id);
    const isActive = activeLayerId === layer.id;

    return (
      <div className="select-none">
        {/* Main Layer */}
        <div 
          className={`
            flex items-center gap-2 px-2 py-2 transition-colors cursor-pointer
            border-l-2
            ${isActive 
              ? "bg-[hsl(var(--cde-accent-purple))]/10 border-[hsl(var(--cde-accent-purple))]" 
              : "border-transparent hover:bg-[hsl(var(--cde-bg-tertiary))] hover:border-[hsl(var(--cde-accent-blue))]"
            }
          `}
          style={{ paddingLeft: `${8 + depth * 16}px` }}
          onClick={() => setActiveLayerId(layer.id)}
        >
          {/* Expand/Collapse Button */}
          {hasChildren && (
            <Button
              variant="ghost"
              size="icon"
              className="w-5 h-5 p-0 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleLayerExpansion(layer.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </Button>
          )}
          
          {/* Spacer if no children */}
          {!hasChildren && <div className="w-5" />}
          
          {/* Thumbnail */}
          <div className="w-8 h-8 rounded bg-[hsl(var(--cde-bg-primary))] border border-[hsl(var(--cde-border-subtle))] flex items-center justify-center text-base flex-shrink-0">
            {layer.thumbnail}
          </div>
          
          {/* Name and Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[hsl(var(--cde-text-primary))] truncate">
                {layer.name}
              </span>
              {hasModifiers && (
                <Badge 
                  variant="outline" 
                  className="h-4 px-1 text-[10px] bg-[hsl(var(--cde-accent-cyan))]/10 border-[hsl(var(--cde-accent-cyan))] text-[hsl(var(--cde-accent-cyan))]"
                >
                  {layer.modifiers.length}M
                </Badge>
              )}
            </div>
            {layer.opacity !== undefined && layer.opacity < 100 && (
              <div className="text-[10px] text-[hsl(var(--cde-text-muted))]">
                {layer.opacity}% · {layer.blendMode}
              </div>
            )}
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 opacity-60 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                toggleVisibility(layer.id);
              }}
            >
              {layer.visible ? (
                <Eye className="w-3.5 h-3.5" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-[hsl(var(--cde-text-muted))]" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 opacity-60 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                toggleLock(layer.id);
              }}
            >
              {layer.locked ? (
                <Lock className="w-3.5 h-3.5 text-[hsl(var(--cde-accent-warning))]" />
              ) : (
                <Unlock className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Modifier Stack */}
        {hasModifiers && (
          <div className="bg-[hsl(var(--cde-bg-tertiary))]/30" style={{ paddingLeft: `${24 + depth * 16}px` }}>
            <div 
              className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-[hsl(var(--cde-bg-tertiary))]"
              onClick={() => toggleModifierExpansion(layer.id)}
            >
              {isModifiersExpanded ? (
                <ChevronDown className="w-3 h-3 text-[hsl(var(--cde-text-muted))]" />
              ) : (
                <ChevronRight className="w-3 h-3 text-[hsl(var(--cde-text-muted))]" />
              )}
              <Layers3 className="w-3 h-3 text-[hsl(var(--cde-accent-cyan))]" />
              <span className="text-[11px] text-[hsl(var(--cde-text-secondary))] font-medium">
                Modifier Stack ({layer.modifiers.length})
              </span>
            </div>
            
            {isModifiersExpanded && layer.modifiers.map((modifier) => {
              const ModIcon = getModifierIcon(modifier.type);
              return (
                <div 
                  key={modifier.id}
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-[hsl(var(--cde-bg-tertiary))] cursor-pointer"
                  style={{ paddingLeft: `${32 + depth * 16}px` }}
                >
                  <div className="w-6 h-6 rounded bg-[hsl(var(--cde-bg-secondary))] border border-[hsl(var(--cde-border-subtle))] flex items-center justify-center text-xs flex-shrink-0">
                    {modifier.thumbnail}
                  </div>
                  <ModIcon className="w-3 h-3 text-[hsl(var(--cde-text-muted))]" />
                  <span className="flex-1 text-xs text-[hsl(var(--cde-text-secondary))]">
                    {modifier.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-5 h-5 opacity-60 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleModifierVisibility(layer.id, modifier.id);
                    }}
                  >
                    {modifier.visible ? (
                      <Eye className="w-3 h-3" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-[hsl(var(--cde-text-muted))]" />
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Children Layers */}
        {hasChildren && isExpanded && layer.children!.map(child => (
          <LayerItem key={child.id} layer={child} depth={depth + 1} />
        ))}
      </div>
    );
  };

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
