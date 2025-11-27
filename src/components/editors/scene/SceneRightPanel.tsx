import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Layers,
  Settings,
  Palette,
  Sparkles,
  FolderOpen,
  MessageSquare,
  Sun,
  Cloud,
  Droplets,
  Wind,
  ThermometerSun,
  Clock,
  MapPin,
  Camera,
  Eye,
  Maximize2
} from "lucide-react";

const panelTabs = [
  { id: 'layers', icon: Layers, label: 'Scene Layers' },
  { id: 'environment', icon: Sun, label: 'Environment' },
  { id: 'properties', icon: Settings, label: 'Properties' },
  { id: 'mood', icon: Palette, label: 'Mood & Color' },
  { id: 'ai', icon: Sparkles, label: 'SceneAI' },
  { id: 'assets', icon: FolderOpen, label: 'Assets' },
  { id: 'chat', icon: MessageSquare, label: 'AI Chat' },
];

const sceneLayers = [
  { id: 1, name: 'Sky Dome', type: 'atmosphere', visible: true },
  { id: 2, name: 'Far Mountains', type: 'terrain', visible: true },
  { id: 3, name: 'Forest Midground', type: 'vegetation', visible: true },
  { id: 4, name: 'Main Building', type: 'architecture', visible: true },
  { id: 5, name: 'Foreground Props', type: 'props', visible: true },
  { id: 6, name: 'Atmospheric Fog', type: 'effect', visible: true },
  { id: 7, name: 'Lighting Rig', type: 'lighting', visible: true },
];

const weatherPresets = [
  { id: 'clear', label: 'Clear', icon: Sun },
  { id: 'cloudy', label: 'Cloudy', icon: Cloud },
  { id: 'rainy', label: 'Rainy', icon: Droplets },
  { id: 'windy', label: 'Windy', icon: Wind },
];

interface SceneRightPanelProps {
  activeTool: string;
}

export const SceneRightPanel = ({ activeTool }: SceneRightPanelProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState('environment');
  const [timeOfDay, setTimeOfDay] = useState([12]);
  const [fogDensity, setFogDensity] = useState([25]);
  const [temperature, setTemperature] = useState([20]);
  const [selectedWeather, setSelectedWeather] = useState('clear');
  const accentColor = "hsl(280 70% 55%)";

  const renderTabContent = () => {
    switch (activeTab) {
      case 'layers':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">SCENE LAYERS</span>
              <Button variant="ghost" size="icon" className="w-6 h-6">
                <Layers className="w-3 h-3" />
              </Button>
            </div>
            <div className="space-y-1">
              {sceneLayers.map((layer) => (
                <div
                  key={layer.id}
                  className="flex items-center gap-2 p-2 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] hover:bg-[hsl(var(--cde-bg-tertiary))]/80 cursor-pointer group"
                >
                  <Button variant="ghost" size="icon" className="w-5 h-5">
                    <Eye className="w-3 h-3" />
                  </Button>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[hsl(var(--cde-text-primary))] truncate">{layer.name}</p>
                    <p className="text-[10px] text-[hsl(var(--cde-text-muted))] capitalize">{layer.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'environment':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <span className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">TIME OF DAY</span>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[hsl(var(--cde-text-muted))]" />
                <Slider
                  value={timeOfDay}
                  onValueChange={setTimeOfDay}
                  min={0}
                  max={24}
                  step={0.5}
                  className="flex-1"
                />
                <span className="text-xs font-mono w-12 text-right">{timeOfDay[0]}:00</span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">WEATHER</span>
              <div className="grid grid-cols-4 gap-1">
                {weatherPresets.map((preset) => {
                  const Icon = preset.icon;
                  const isSelected = selectedWeather === preset.id;
                  return (
                    <Tooltip key={preset.id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setSelectedWeather(preset.id)}
                          className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-[hsl(280_70%_55%)] text-white shadow-lg'
                              : 'bg-[hsl(var(--cde-bg-tertiary))] text-[hsl(var(--cde-text-muted))] hover:text-[hsl(var(--cde-text-primary))]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">{preset.label}</TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">ATMOSPHERE</span>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Cloud className="w-4 h-4 text-[hsl(var(--cde-text-muted))]" />
                  <span className="text-xs w-16">Fog</span>
                  <Slider value={fogDensity} onValueChange={setFogDensity} max={100} className="flex-1" />
                  <span className="text-xs font-mono w-8 text-right">{fogDensity}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <ThermometerSun className="w-4 h-4 text-[hsl(var(--cde-text-muted))]" />
                  <span className="text-xs w-16">Temp</span>
                  <Slider value={temperature} onValueChange={setTemperature} min={-20} max={45} className="flex-1" />
                  <span className="text-xs font-mono w-8 text-right">{temperature}°C</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">LOCATION</span>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[hsl(var(--cde-text-muted))]" />
                <Input
                  placeholder="Enter location or coordinates..."
                  className="flex-1 h-8 text-xs bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))]"
                />
              </div>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-[hsl(280_70%_55%)]/20 to-[hsl(280_70%_35%)]/20 border border-[hsl(280_70%_55%)]/30">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-[hsl(280_70%_55%)]" />
                <span className="font-semibold text-sm">SceneForge AI</span>
              </div>
              <p className="text-xs text-[hsl(var(--cde-text-muted))] mb-3">
                Generate complete environments with AI-powered scene composition.
              </p>
              <Input
                placeholder="Describe your scene..."
                className="mb-2 text-xs bg-[hsl(var(--cde-bg-secondary))] border-[hsl(var(--cde-border-subtle))]"
              />
              <Button className="w-full bg-[hsl(280_70%_55%)] hover:bg-[hsl(280_70%_45%)] text-white text-xs">
                Generate Scene
              </Button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">AI QUICK ACTIONS</span>
              {['Enhance Lighting', 'Add Atmosphere', 'Populate Scene', 'Match Reference'].map((action) => (
                <Button key={action} variant="outline" size="sm" className="w-full justify-start text-xs">
                  <Sparkles className="w-3 h-3 mr-2" />
                  {action}
                </Button>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-40 text-[hsl(var(--cde-text-muted))]">
            <Settings className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-xs">Select a panel</span>
          </div>
        );
    }
  };

  return (
    <aside
      className="border-l border-[hsl(var(--cde-border-subtle))] flex relative overflow-hidden transition-all duration-300 ease-in-out"
      style={{
        width: isHovered ? '320px' : '10px',
        background: `
          linear-gradient(to left, hsl(var(--cde-bg-secondary)) 0%, hsl(var(--cde-bg-secondary)) calc(100% - 10px), hsl(var(--cde-bg-tertiary)) calc(100% - 10px)),
          repeating-linear-gradient(
            180deg,
            hsl(var(--cde-border-subtle)) 0px,
            hsl(var(--cde-border-subtle)) 1px,
            transparent 1px,
            transparent 20px
          )
        `,
        backgroundPosition: '0 0, 0 0',
        backgroundSize: '100% 100%, 10px 100px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ruler */}
      <div className="absolute top-0 left-0 w-[10px] h-full flex flex-col items-start pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 h-5 w-full relative"
            style={{ borderBottom: `1px solid ${i % 5 === 0 ? accentColor + '40' : 'hsl(var(--cde-border-subtle))'}` }}
          >
            {i % 5 === 0 && (
              <span className="absolute left-1 top-0.5 text-[8px] text-[hsl(var(--cde-text-muted))] font-mono">
                {i * 20}
              </span>
            )}
          </div>
        ))}
      </div>

      {isHovered && (
        <div className="flex flex-1 ml-[10px]">
          {/* Tab buttons */}
          <div className="w-12 flex flex-col py-2 border-r border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-tertiary))]">
            {panelTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Tooltip key={tab.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full aspect-square flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-[hsl(280_70%_55%)]/20 text-[hsl(280_70%_55%)] border-r-2 border-[hsl(280_70%_55%)]'
                          : 'text-[hsl(var(--cde-text-muted))] hover:text-[hsl(var(--cde-text-primary))] hover:bg-[hsl(var(--cde-bg-secondary))]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="text-xs">{tab.label}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          {/* Panel content */}
          <ScrollArea className="flex-1 p-3">
            {renderTabContent()}
          </ScrollArea>
        </div>
      )}
    </aside>
  );
};


