import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  MousePointer2,
  Move,
  Sun,
  Cloud,
  Mountain,
  Trees,
  Building2,
  Camera,
  Palette,
  Layers,
  Box,
  Grid3x3,
  Sparkles,
  Wand2,
  Download,
  Upload,
  Eye,
  Map,
  Compass,
  Globe,
  Sunrise,
  Moon
} from "lucide-react";

const tools = [
  { id: 'select', icon: MousePointer2, label: 'Select', category: 'basic' },
  { id: 'move', icon: Move, label: 'Transform', category: 'basic' },
  { id: 'camera', icon: Camera, label: 'Camera Setup', category: 'camera' },
  { id: 'view', icon: Eye, label: 'View Angles', category: 'camera' },
  { id: 'compass', icon: Compass, label: 'Perspective', category: 'camera' },
  { id: 'sun', icon: Sun, label: 'Daylight', category: 'lighting' },
  { id: 'sunrise', icon: Sunrise, label: 'Golden Hour', category: 'lighting' },
  { id: 'moon', icon: Moon, label: 'Night Scene', category: 'lighting' },
  { id: 'atmosphere', icon: Cloud, label: 'Atmosphere', category: 'environment' },
  { id: 'terrain', icon: Mountain, label: 'Terrain', category: 'environment' },
  { id: 'vegetation', icon: Trees, label: 'Vegetation', category: 'environment' },
  { id: 'architecture', icon: Building2, label: 'Architecture', category: 'environment' },
  { id: 'globe', icon: Globe, label: 'World Builder', category: 'environment' },
  { id: 'map', icon: Map, label: 'Layout Map', category: 'layout' },
  { id: 'grid', icon: Grid3x3, label: 'Scene Grid', category: 'layout' },
  { id: 'layers', icon: Layers, label: 'Scene Layers', category: 'layout' },
  { id: 'palette', icon: Palette, label: 'Color Mood', category: 'style' },
  { id: 'props', icon: Box, label: 'Place Props', category: 'assets' },
  { id: 'ai-generate', icon: Sparkles, label: 'AI Generate', category: 'ai' },
  { id: 'ai-enhance', icon: Wand2, label: 'AI Enhance', category: 'ai' },
  { id: 'import', icon: Upload, label: 'Import Scene', category: 'io' },
  { id: 'export', icon: Download, label: 'Export Scene', category: 'io' },
];

interface SceneLeftToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
}

export const SceneLeftToolbar = ({ activeTool, onToolChange }: SceneLeftToolbarProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const accentColor = "hsl(280 70% 55%)";

  return (
    <aside
      className="border-r border-[hsl(var(--cde-border-subtle))] flex flex-col relative overflow-hidden transition-all duration-300 ease-in-out"
      style={{
        width: isHovered ? '52px' : '10px',
        background: `
          linear-gradient(to right, hsl(var(--cde-bg-secondary)) 0%, hsl(var(--cde-bg-secondary)) calc(100% - 10px), hsl(var(--cde-bg-tertiary)) calc(100% - 10px)),
          repeating-linear-gradient(
            180deg,
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
      {/* Ruler */}
      <div className="absolute top-0 right-0 w-[10px] h-full flex flex-col items-end pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 h-5 w-full relative"
            style={{ borderBottom: `1px solid ${i % 5 === 0 ? accentColor + '40' : 'hsl(var(--cde-border-subtle))'}` }}
          >
            {i % 5 === 0 && (
              <span className="absolute right-1 top-0.5 text-[8px] text-[hsl(var(--cde-text-muted))] font-mono">
                {i * 20}
              </span>
            )}
          </div>
        ))}
      </div>

      {isHovered && (
        <div className="flex-1 flex flex-col py-2 px-1.5 gap-0.5 overflow-y-auto scrollbar-thin">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            const showSeparator = index > 0 && tools[index - 1].category !== tool.category;

            return (
              <div key={tool.id}>
                {showSeparator && (
                  <div className="h-px bg-[hsl(var(--cde-border-subtle))] my-1 mx-1" />
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`w-9 h-9 transition-all duration-200 ${
                        isActive
                          ? 'bg-[hsl(280_70%_55%)]/20 text-[hsl(280_70%_55%)] shadow-lg'
                          : 'text-[hsl(var(--cde-text-secondary))] hover:text-[hsl(var(--cde-text-primary))] hover:bg-[hsl(var(--cde-bg-tertiary))]'
                      }`}
                      style={isActive ? { boxShadow: `0 0 12px ${accentColor}40` } : {}}
                      onClick={() => onToolChange(tool.id)}
                    >
                      <Icon className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">
                    {tool.label}
                  </TooltipContent>
                </Tooltip>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
};
