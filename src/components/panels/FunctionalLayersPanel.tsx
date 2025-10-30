import { useState } from "react";
import { Eye, EyeOff, Lock, Unlock, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { CanvasLayer } from "@/hooks/useCanvasLayers";

interface FunctionalLayersPanelProps {
  layers: CanvasLayer[];
  activeLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onDeleteLayer: (id: string) => void;
  onUpdateName: (id: string, name: string) => void;
  onUpdateOpacity: (id: string, opacity: number) => void;
  onAddLayer: () => void;
}

export const FunctionalLayersPanel = ({
  layers,
  activeLayerId,
  onSelectLayer,
  onToggleVisibility,
  onToggleLock,
  onDeleteLayer,
  onUpdateName,
  onUpdateOpacity,
  onAddLayer,
}: FunctionalLayersPanelProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full bg-[hsl(var(--cde-bg-secondary))]">
      {/* Header */}
      <div className="p-4 border-b border-[hsl(var(--cde-border-subtle))] flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">Layers</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onAddLayer}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Layers List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {layers.length === 0 ? (
            <div className="text-center py-8 text-[hsl(var(--cde-text-muted))] text-sm">
              No layers yet. Use tools to add objects to canvas.
            </div>
          ) : (
            layers.map((layer) => (
              <div
                key={layer.id}
                className={`
                  group p-2 rounded-lg transition-colors cursor-pointer
                  ${activeLayerId === layer.id 
                    ? 'bg-[hsl(var(--cde-accent-purple)/0.2)] border border-[hsl(var(--cde-accent-purple))]' 
                    : 'hover:bg-[hsl(var(--cde-bg-tertiary))] border border-transparent'
                  }
                `}
                onClick={() => onSelectLayer(layer.id)}
              >
                {/* Layer Header */}
                <div className="flex items-center gap-2 mb-2">
                  {/* Thumbnail */}
                  <div className="w-10 h-10 rounded bg-[hsl(var(--cde-bg-tertiary))] flex-shrink-0 border border-[hsl(var(--cde-border-subtle))]">
                    {layer.thumbnail && (
                      <img src={layer.thumbnail} alt={layer.name} className="w-full h-full object-cover rounded" />
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    {editingId === layer.id ? (
                      <Input
                        value={layer.name}
                        onChange={(e) => onUpdateName(layer.id, e.target.value)}
                        onBlur={() => setEditingId(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setEditingId(null);
                        }}
                        className="h-6 text-xs"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div
                        className="text-xs font-medium text-[hsl(var(--cde-text-primary))] truncate"
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setEditingId(layer.id);
                        }}
                      >
                        {layer.name}
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleVisibility(layer.id);
                      }}
                    >
                      {layer.visible ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3 text-[hsl(var(--cde-text-muted))]" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLock(layer.id);
                      }}
                    >
                      {layer.locked ? (
                        <Lock className="w-3 h-3" />
                      ) : (
                        <Unlock className="w-3 h-3 text-[hsl(var(--cde-text-muted))]" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteLayer(layer.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Opacity Slider */}
                {activeLayerId === layer.id && (
                  <div className="flex items-center gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                    <span className="text-xs text-[hsl(var(--cde-text-secondary))]">Opacity</span>
                    <Slider
                      value={[layer.opacity * 100]}
                      onValueChange={([value]) => onUpdateOpacity(layer.id, value / 100)}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-[hsl(var(--cde-text-secondary))] w-8">
                      {Math.round(layer.opacity * 100)}%
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
