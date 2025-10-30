import { useState } from "react";
import { FunctionalLayersPanel } from "./panels/FunctionalLayersPanel";
import { PropertiesPanel } from "./panels/PropertiesPanel";
import { ColorSphere } from "./panels/ColorSphere";
import { AIToolsPanel } from "./ai/AIToolsPanel";
import { MicroscopePanel } from "./panels/MicroscopePanel";
import { LayerStripPanel } from "./panels/LayerStripPanel";
import { Layers, Settings2, Palette, Sparkles, Microscope, X, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Canvas as FabricCanvas } from 'fabric';

interface RightPanelProps {
  canvasLayers: ReturnType<typeof import("@/hooks/useCanvasLayers").useCanvasLayers>;
  fabricCanvas: FabricCanvas | null;
}

export const RightPanel = ({ canvasLayers }: RightPanelProps) => {
  const [activePanel, setActivePanel] = useState<string>("layers");
  const [isOpen, setIsOpen] = useState(true);
  const [isActivatorHovered, setIsActivatorHovered] = useState(false);
  const [showMiniLayers, setShowMiniLayers] = useState(true);

  const panels = [
    { id: "layers", icon: Layers, label: "Layers" },
    { id: "properties", icon: Settings2, label: "Properties" },
    { id: "color", icon: Palette, label: "Color" },
    { id: "ai", icon: Sparkles, label: "AI Tools" },
    { id: "microscope", icon: Microscope, label: "Microscope" },
  ];

  const handleLayerClick = (id: string) => {
    canvasLayers.selectLayer(id);
  };

  const handleToggleVisibility = (id: string) => {
    canvasLayers.toggleVisibility(id);
  };

  const handleToggleLock = (id: string) => {
    canvasLayers.toggleLock(id);
  };

  const handleReorder = (dragId: string, dropId: string) => {
    const dragIndex = canvasLayers.layers.findIndex(l => l.id === dragId);
    const dropIndex = canvasLayers.layers.findIndex(l => l.id === dropId);
    canvasLayers.reorderLayers(dragIndex, dropIndex);
  };

  return (
    <aside 
      className="flex border-l border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-secondary))] transition-all duration-300 ease-in-out relative"
    >
      {/* Mini Layers Strip - Left Edge */}
      {showMiniLayers && (
        <LayerStripPanel
        layers={canvasLayers.layers}
        activeLayerId={canvasLayers.activeLayerId || undefined}
        onLayerClick={handleLayerClick}
        onToggleVisibility={handleToggleVisibility}
        onToggleLock={handleToggleLock}
        onReorder={handleReorder}
      />
      )}

      {/* Main Panel Drawer */}
      {isOpen && (
        <div className="w-80 flex flex-col border-l border-[hsl(var(--cde-border-subtle))]">
          {activePanel === "layers" && (
            <FunctionalLayersPanel
              layers={canvasLayers.layers}
              activeLayerId={canvasLayers.activeLayerId}
              onSelectLayer={canvasLayers.selectLayer}
              onToggleVisibility={canvasLayers.toggleVisibility}
              onToggleLock={canvasLayers.toggleLock}
              onDeleteLayer={canvasLayers.deleteLayer}
              onUpdateName={canvasLayers.updateLayerName}
              onUpdateOpacity={canvasLayers.updateLayerOpacity}
              onAddLayer={canvasLayers.addLayer}
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
          width: '48px',
          paddingTop: '8px',
          paddingBottom: '8px',
          background: 'hsl(var(--cde-bg-tertiary))'
        }}
        onMouseEnter={() => setIsActivatorHovered(true)}
        onMouseLeave={() => setIsActivatorHovered(false)}
      >
        {/* Ruler markings - Left edge */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-[10px] pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                to bottom,
                hsl(var(--cde-border-subtle)) 0px,
                hsl(var(--cde-border-subtle)) 1px,
                transparent 1px,
                transparent 20px
              )
            `,
            backgroundSize: '100% 20px'
          }}
        >
          {Array.from({ length: Math.floor(window.innerHeight / 100) }).map((_, i) => (
            <span 
              key={i}
              className="absolute left-0 text-[8px] text-[hsl(var(--cde-text-muted))] font-mono"
              style={{ 
                top: `${i * 100}px`,
                writingMode: 'vertical-rl', 
                transform: 'rotate(180deg)' 
              }}
            >
              {i * 100}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-1">
        
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
      </div>
    </aside>
  );
};
