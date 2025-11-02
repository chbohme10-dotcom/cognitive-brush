import { useState } from "react";
import { Canvas as FabricCanvas, Rect } from "fabric";
import { LayersPanel } from "./panels/LayersPanel";
import { PropertiesPanel } from "./panels/PropertiesPanel";
import { ColorSphere } from "./panels/ColorSphere";
import { AIToolsPanel } from "./ai/AIToolsPanel";
import { MicroscopePanel } from "./panels/MicroscopePanel";
import { LayerStripPanel } from "./panels/LayerStripPanel";
import { Layers, Settings2, Palette, Sparkles, Microscope, X, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCanvasLayers } from "@/hooks/useCanvasLayers";

interface RightPanelProps {
  canvasLayers: ReturnType<typeof useCanvasLayers>;
  fabricCanvas: FabricCanvas | null;
}

export const RightPanel = ({ canvasLayers, fabricCanvas }: RightPanelProps) => {
  const [activePanel, setActivePanel] = useState<string>("layers");
  const [isOpen, setIsOpen] = useState(true);
  const [isActivatorHovered, setIsActivatorHovered] = useState(false);
  const [showMiniLayers, setShowMiniLayers] = useState(true);

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

  const panels = [
    { id: "layers", icon: Layers, label: "Layers" },
    { id: "properties", icon: Settings2, label: "Properties" },
    { id: "color", icon: Palette, label: "Color" },
    { id: "ai", icon: Sparkles, label: "AI Tools" },
    { id: "microscope", icon: Microscope, label: "Microscope" },
  ];

  return (
    <aside 
      className="flex border-l border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-secondary))] transition-all duration-300 ease-in-out relative"
    >
      {/* Mini Layers Strip - Left Edge */}
      {showMiniLayers && (
        <LayerStripPanel
          layers={canvasLayers.layers.map(l => ({
            id: l.id,
            name: l.name,
            visible: l.visible,
            locked: l.locked,
            thumbnail: undefined,
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
