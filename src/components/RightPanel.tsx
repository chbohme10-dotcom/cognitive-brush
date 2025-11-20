import { useState } from "react";
import { Canvas as FabricCanvas, Rect, FabricImage } from "fabric";
import { LayersPanel } from "./panels/LayersPanel";
import { PropertiesPanel } from "./panels/PropertiesPanel";
import { ColorSphere } from "./panels/ColorSphere";
import { AIToolsPanel } from "./ai/AIToolsPanel";
import { MicroscopePanel } from "./panels/MicroscopePanel";
import { LayerStripPanel } from "./panels/LayerStripPanel";
import { AssetPanel } from "./AssetBrowser/AssetPanel";
import { Layers, Settings2, Palette, Sparkles, Microscope, X, LayoutList, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCanvasLayers } from "@/hooks/useCanvasLayers";
import { toast } from "sonner";
import { AssetMetadata } from "@/hooks/useAssets";

interface RightPanelProps {
  canvasLayers: ReturnType<typeof useCanvasLayers>;
  fabricCanvas: FabricCanvas | null;
}

export const RightPanel = ({ canvasLayers, fabricCanvas }: RightPanelProps) => {
  const [activePanel, setActivePanel] = useState<string>("layers");
  const [isOpen, setIsOpen] = useState(true);
  const [isActivatorHovered, setIsActivatorHovered] = useState(false);
  const [showMiniLayers, setShowMiniLayers] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleAddLayer = () => {
    if (!fabricCanvas) return;
    const rect = new Rect({
      left: 100,
      top: 100,
      fill: 'hsl(262, 83%, 58%)',
      width: 200,
      height: 200,
    });
    canvasLayers.addLayer(rect, 'New Rectangle');
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (!fabricCanvas) return;

    try {
      const data = e.dataTransfer.getData('application/json');
      if (!data) return;

      const asset: AssetMetadata = JSON.parse(data);
      
      const img = await FabricImage.fromURL(asset.url, { crossOrigin: 'anonymous' });
      
      const scale = Math.min(
        fabricCanvas.width! / 4 / img.width!,
        fabricCanvas.height! / 4 / img.height!
      );
      
      img.scale(scale);
      img.set({
        left: fabricCanvas.width! / 2 - (img.width! * scale) / 2,
        top: fabricCanvas.height! / 2 - (img.height! * scale) / 2,
      });

      canvasLayers.addLayer(img, asset.name);
      toast.success(`Added ${asset.name} to layers`);
    } catch (error) {
      console.error('Error adding asset to layers:', error);
      toast.error('Failed to add asset to layers');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const panels = [
    { id: "layers", icon: Layers, label: "Layers" },
    { id: "assets", icon: Image, label: "Assets" },
    { id: "properties", icon: Settings2, label: "Properties" },
    { id: "color", icon: Palette, label: "Color" },
    { id: "ai", icon: Sparkles, label: "AI Tools" },
    { id: "microscope", icon: Microscope, label: "Microscope" },
  ];

  return (
    <aside 
      className={`flex border-l border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-secondary))] transition-all duration-300 ease-in-out relative ${
        isDragOver ? 'ring-2 ring-[hsl(var(--cde-accent-purple))] ring-inset' : ''
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Mini Layers Strip - Left Edge */}
        {showMiniLayers && (
        <LayerStripPanel
          layers={canvasLayers.layers.map(l => ({
            id: l.id,
            name: l.name,
            visible: l.visible,
            locked: l.locked,
            thumbnail: l.thumbnail,
          }))}
          activeLayerId={canvasLayers.activeLayerId || undefined}
          onLayerClick={canvasLayers.selectLayer}
          onToggleVisibility={canvasLayers.toggleVisibility}
          onToggleLock={canvasLayers.toggleLock}
          onReorder={canvasLayers.reorderLayers}
        />
      )}

      {/* Main Panel Drawer */}
      {isOpen && (
        <div className="w-80 flex flex-col border-l border-[hsl(var(--cde-border-subtle))]">
          {activePanel === "layers" && (
            <LayersPanel
              layers={canvasLayers.layers}
              activeLayerId={canvasLayers.activeLayerId}
              onLayerClick={canvasLayers.selectLayer}
              onToggleVisibility={canvasLayers.toggleVisibility}
              onToggleLock={canvasLayers.toggleLock}
              onDeleteLayer={canvasLayers.deleteLayer}
              onUpdateName={canvasLayers.updateLayerName}
              onUpdateOpacity={canvasLayers.updateLayerOpacity}
              onAddLayer={handleAddLayer}
            />
          )}
          {activePanel === "assets" && (
            <AssetPanel 
              isOpen={true} 
              onClose={() => setActivePanel("layers")} 
              fabricCanvas={fabricCanvas} 
            />
          )}
          {activePanel === "properties" && <PropertiesPanel />}
          {activePanel === "color" && <ColorSphere />}
          {activePanel === "ai" && <AIToolsPanel />}
          {activePanel === "microscope" && <MicroscopePanel />}
        </div>
      )}

      {/* Activator Bar - Right Edge */}
      <div 
        className="flex flex-col items-center relative overflow-hidden transition-all duration-300 ease-in-out border-l border-[hsl(var(--cde-border-subtle))]"
        style={{
          width: isActivatorHovered || isOpen ? '48px' : '10px',
          paddingTop: (isActivatorHovered || isOpen) ? '8px' : '0',
          paddingBottom: (isActivatorHovered || isOpen) ? '8px' : '0',
          background: `
            linear-gradient(to right, hsl(var(--cde-bg-tertiary)) 0%, hsl(var(--cde-bg-tertiary)) 10px, hsl(var(--cde-bg-tertiary)) 100%),
            repeating-linear-gradient(
              0deg,
              hsl(var(--cde-border-subtle)) 0px,
              hsl(var(--cde-border-subtle)) 1px,
              transparent 1px,
              transparent 20px
            )
          `,
          backgroundPosition: '0 0, 0 0',
          backgroundSize: '100% 100%, 10px 100px'
        }}
        onMouseEnter={() => setIsActivatorHovered(true)}
        onMouseLeave={() => setIsActivatorHovered(false)}
      >
        {/* Ruler markings */}
        <div className="absolute left-0 top-0 bottom-0 w-[10px] flex flex-col pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 h-5 w-full border-b border-[hsl(var(--cde-border-subtle))] relative">
              {i % 5 === 0 && (
                <span 
                  className="absolute left-0 top-0.5 text-[8px] text-[hsl(var(--cde-text-muted))] font-mono"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  {i * 20}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Buttons - only visible when hovered or open */}
        {(isActivatorHovered || isOpen) && (
          <div className="flex flex-col gap-1 animate-fade-in">
        
        {panels.map((panel) => (
          <TooltipProvider key={panel.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`
                    w-10 h-10 rounded-lg transition-all
                    ${activePanel === panel.id && isOpen
                      ? "bg-[hsl(var(--cde-accent-purple))] text-white" 
                      : "text-[hsl(var(--cde-text-secondary))] hover:bg-[hsl(var(--cde-bg-secondary))] hover:text-[hsl(var(--cde-text-primary))]"
                    }
                  `}
                  onClick={() => {
                    if (activePanel === panel.id) {
                      setIsOpen(!isOpen);
                    } else {
                      setActivePanel(panel.id);
                      setIsOpen(true);
                    }
                  }}
                >
                  <panel.icon className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">{panel.label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Mini Layers Toggle Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`
                  w-10 h-10 rounded-lg transition-all
                  ${showMiniLayers
                    ? "bg-[hsl(var(--cde-accent-purple))] text-white" 
                    : "text-[hsl(var(--cde-text-secondary))] hover:bg-[hsl(var(--cde-bg-secondary))] hover:text-[hsl(var(--cde-text-primary))]"
                  }
                `}
                onClick={() => setShowMiniLayers(!showMiniLayers)}
              >
                <LayoutList className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Toggle Mini Layers</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Close Button */}
        {isOpen && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-lg text-[hsl(var(--cde-text-secondary))] hover:bg-[hsl(var(--cde-bg-secondary))] hover:text-[hsl(var(--cde-text-primary))]"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Close Panel</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
          </div>
        )}
      </div>
    </aside>
  );
};
