import { useState } from "react";
import { Eye, EyeOff, Lock, Unlock, Trash2, Download, ChevronRight, ChevronDown, FolderPlus, FolderMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { useCanvasLayers } from "@/hooks/useCanvasLayers";
import { toast } from "sonner";

interface LayersPanelWithGroupsProps {
  canvasLayers: ReturnType<typeof useCanvasLayers>;
}

export const LayersPanelWithGroups = ({ canvasLayers }: LayersPanelWithGroupsProps) => {
  const {
    layers,
    activeLayerId,
    groups,
    toggleVisibility,
    toggleLock,
    selectLayer,
    deleteLayer,
    updateLayerName,
    updateLayerOpacity,
    exportLayer,
    createGroup,
    ungroupLayers,
    toggleGroupExpanded,
    updateGroupName,
  } = canvasLayers;

  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);

  const handleGroupSelected = () => {
    if (selectedLayers.length < 2) {
      toast.error("Select at least 2 layers to group");
      return;
    }
    createGroup(selectedLayers, `Group ${groups.length + 1}`);
    setSelectedLayers([]);
  };

  const handleLayerClick = (layerId: string, isCtrlKey: boolean) => {
    if (isCtrlKey) {
      setSelectedLayers(prev =>
        prev.includes(layerId) ? prev.filter(id => id !== layerId) : [...prev, layerId]
      );
    } else {
      selectLayer(layerId);
      setSelectedLayers([]);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b border-[hsl(var(--cde-border-subtle))] flex gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleGroupSelected}
          disabled={selectedLayers.length < 2}
          className="flex-1 h-7 text-xs"
        >
          <FolderPlus className="w-3 h-3 mr-1" />
          Group
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {groups.map((group) => (
            <div key={group.id} className="space-y-1">
              <div className="group flex items-center gap-2 p-2 rounded hover:bg-[hsl(var(--cde-bg-tertiary))] transition-colors">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => toggleGroupExpanded(group.id)}
                >
                  {group.expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </Button>

                <Input
                  value={group.name}
                  onChange={(e) => updateGroupName(group.id, e.target.value)}
                  className="h-6 text-xs font-semibold bg-transparent border-none focus-visible:ring-0 px-1 flex-1"
                />

                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                  onClick={() => ungroupLayers(group.id)}
                >
                  <FolderMinus className="w-3 h-3" />
                </Button>
              </div>

              {group.expanded && (
                <div className="ml-4 space-y-1">
                  {layers.filter(l => l.groupId === group.id).map((layer) => (
                    <div
                      key={layer.id}
                      className={`group flex items-center gap-2 p-2 rounded hover:bg-[hsl(var(--cde-bg-tertiary))] cursor-pointer transition-colors ${
                        activeLayerId === layer.id ? 'bg-[hsl(var(--cde-bg-tertiary))] ring-1 ring-[hsl(var(--cde-accent-purple))]' : ''
                      } ${
                        selectedLayers.includes(layer.id) ? 'ring-1 ring-[hsl(var(--cde-accent-blue))]' : ''
                      }`}
                      onClick={(e) => handleLayerClick(layer.id, e.ctrlKey || e.metaKey)}
                    >
                      {layer.thumbnail && (
                        <div className="w-8 h-8 rounded bg-[hsl(var(--cde-bg-primary))] flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img src={layer.thumbnail} alt={layer.name} className="w-full h-full object-contain" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="text-xs truncate text-[hsl(var(--cde-text-primary))]">{layer.name}</div>
                        <div className="text-[10px] text-[hsl(var(--cde-text-muted))]">{Math.round(layer.opacity)}%</div>
                      </div>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleVisibility(layer.id);
                          }}
                        >
                          {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLock(layer.id);
                          }}
                        >
                          {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (layer.fabricObject) exportLayer(layer.fabricObject, layer.name);
                          }}
                        >
                          <Download className="w-3 h-3" />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLayer(layer.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>

                      {activeLayerId === layer.id && (
                        <div className="absolute left-0 right-0 bottom-0 px-2 py-1 bg-[hsl(var(--cde-bg-tertiary))]/30">
                          <Slider
                            value={[layer.opacity]}
                            onValueChange={([value]) => updateLayerOpacity(layer.id, value)}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {layers.filter(l => !l.groupId).map((layer) => (
            <div
              key={layer.id}
              className={`group flex items-center gap-2 p-2 rounded hover:bg-[hsl(var(--cde-bg-tertiary))] cursor-pointer transition-colors ${
                activeLayerId === layer.id ? 'bg-[hsl(var(--cde-bg-tertiary))] ring-1 ring-[hsl(var(--cde-accent-purple))]' : ''
              } ${
                selectedLayers.includes(layer.id) ? 'ring-1 ring-[hsl(var(--cde-accent-blue))]' : ''
              }`}
              onClick={(e) => handleLayerClick(layer.id, e.ctrlKey || e.metaKey)}
            >
              {layer.thumbnail && (
                <div className="w-10 h-10 rounded bg-[hsl(var(--cde-bg-primary))] flex items-center justify-center overflow-hidden flex-shrink-0 border border-[hsl(var(--cde-border-subtle))]">
                  <img src={layer.thumbnail} alt={layer.name} className="w-full h-full object-contain" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <Input
                  value={layer.name}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateLayerName(layer.id, e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="h-7 text-xs bg-transparent border-none focus-visible:ring-0 px-1"
                />
                <div className="text-[10px] text-[hsl(var(--cde-text-muted))] px-1">{Math.round(layer.opacity)}%</div>
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVisibility(layer.id);
                  }}
                >
                  {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLock(layer.id);
                  }}
                >
                  {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (layer.fabricObject) exportLayer(layer.fabricObject, layer.name);
                  }}
                >
                  <Download className="w-3 h-3" />
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteLayer(layer.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>

              {activeLayerId === layer.id && (
                <div className="col-span-full px-2 py-1 bg-[hsl(var(--cde-bg-tertiary))]/30">
                  <div className="text-[10px] text-[hsl(var(--cde-text-muted))] mb-1">Opacity</div>
                  <Slider
                    value={[layer.opacity]}
                    onValueChange={([value]) => updateLayerOpacity(layer.id, value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
