import { Eye, EyeOff, Lock, Unlock, Plus, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { CanvasLayer } from "@/hooks/useCanvasLayers";

interface LayersPanelProps {
  layers: CanvasLayer[];
  activeLayerId: string | null;
  onLayerClick: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onDeleteLayer: (id: string) => void;
  onUpdateName: (id: string, name: string) => void;
  onUpdateOpacity: (id: string, opacity: number) => void;
  onAddLayer: () => void;
  onExportLayer?: (layer: CanvasLayer) => void;
}

export const LayersPanel = ({
  layers = [],
  activeLayerId,
  onLayerClick,
  onToggleVisibility,
  onToggleLock,
  onDeleteLayer,
  onUpdateName,
  onUpdateOpacity,
  onAddLayer,
  onExportLayer,
}: LayersPanelProps) => {
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleStartEdit = (layer: CanvasLayer) => {
    setEditingLayerId(layer.id);
    setEditingName(layer.name);
  };

  const handleSaveEdit = (layerId: string) => {
    onUpdateName(layerId, editingName);
    setEditingLayerId(null);
  };

  const LayerItem = ({ layer }: { layer: CanvasLayer }) => {
    const isActive = activeLayerId === layer.id;
    const isEditing = editingLayerId === layer.id;

    return (
      <div className="select-none border-b border-[hsl(var(--cde-border-subtle))]/50">
        <div
          className={`
            flex items-center gap-2 px-3 py-2 transition-colors cursor-pointer
            border-l-2
            ${isActive
              ? "bg-[hsl(var(--cde-accent-purple))]/10 border-[hsl(var(--cde-accent-purple))]"
              : "border-transparent hover:bg-[hsl(var(--cde-bg-tertiary))] hover:border-[hsl(var(--cde-accent-blue))]"
            }
          `}
          onClick={() => onLayerClick(layer.id)}
        >
          {/* Thumbnail */}
          <div className="w-10 h-10 rounded bg-[hsl(var(--cde-bg-primary))] border border-[hsl(var(--cde-border-subtle))] flex items-center justify-center text-xs overflow-hidden flex-shrink-0">
            {layer.thumbnail ? (
              <img 
                src={layer.thumbnail} 
                alt={layer.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[hsl(var(--cde-text-muted))]">🎨</span>
            )}
          </div>

          {/* Name */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => handleSaveEdit(layer.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit(layer.id);
                  if (e.key === 'Escape') setEditingLayerId(null);
                }}
                className="h-7 text-sm"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div
                className="text-sm text-[hsl(var(--cde-text-primary))] truncate"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  handleStartEdit(layer);
                }}
              >
                {layer.name}
              </div>
            )}
            <div className="text-[10px] text-[hsl(var(--cde-text-muted))]">
              {Math.round(layer.opacity)}%
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7 opacity-60 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(layer.id);
              }}
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
              className="w-7 h-7 opacity-60 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onToggleLock(layer.id);
              }}
            >
              {layer.locked ? (
                <Lock className="w-4 h-4 text-[hsl(var(--cde-accent-warning))]" />
              ) : (
                <Unlock className="w-4 h-4" />
              )}
            </Button>

            {onExportLayer && (
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 opacity-60 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onExportLayer(layer);
                }}
              >
                <Download className="w-4 h-4" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7 opacity-60 hover:opacity-100 hover:text-[hsl(var(--cde-accent-error))]"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteLayer(layer.id);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Opacity Slider for Active Layer */}
        {isActive && (
          <div className="px-3 py-2 bg-[hsl(var(--cde-bg-tertiary))]/30">
            <div className="text-[10px] text-[hsl(var(--cde-text-muted))] mb-1">Opacity</div>
            <Slider
              value={[layer.opacity]}
              onValueChange={([value]) => onUpdateOpacity(layer.id, value)}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-[hsl(var(--cde-border-subtle))] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
          Layers ({layers.length})
        </h3>
        <Button size="icon" variant="ghost" className="w-7 h-7" onClick={onAddLayer}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Layers List */}
      <ScrollArea className="flex-1">
        {layers.length === 0 ? (
          <div className="p-6 text-center text-sm text-[hsl(var(--cde-text-muted))]">
            No layers yet. Add objects to the canvas to create layers.
          </div>
        ) : (
          <div>
            {layers.map((layer) => (
              <LayerItem key={layer.id} layer={layer} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
