import { useState } from "react";
import { EditorTopBar } from "@/components/editors/shared/EditorTopBar";
import { EditorBottomBar } from "@/components/editors/shared/EditorBottomBar";
import { PropsLeftToolbar } from "@/components/editors/props/PropsLeftToolbar";
import { PropsRightPanel } from "@/components/editors/props/PropsRightPanel";
import { Sparkles, RotateCcw, Box, Lightbulb, Palette, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";

const PropsEditor = () => {
  const [activeTool, setActiveTool] = useState('select');
  const [selectedView, setSelectedView] = useState('perspective');
  const [selectedMaterial, setSelectedMaterial] = useState(1);
  const [lightIntensity, setLightIntensity] = useState([75]);
  const accentColor = "hsl(200 80% 50%)";

  const views = ['perspective', 'front', 'side', 'top'];
  const materials = [
    { id: 1, name: 'Wood', color: 'hsl(30 50% 40%)' },
    { id: 2, name: 'Metal', color: 'hsl(220 10% 50%)' },
    { id: 3, name: 'Fabric', color: 'hsl(280 30% 50%)' },
    { id: 4, name: 'Glass', color: 'hsl(200 80% 70%)' },
    { id: 5, name: 'Stone', color: 'hsl(30 10% 40%)' },
    { id: 6, name: 'Plastic', color: 'hsl(0 0% 80%)' },
  ];

  const propCategories = [
    { id: 'furniture', name: 'Furniture', icon: '🪑', count: 24 },
    { id: 'vehicles', name: 'Vehicles', icon: '🚗', count: 12 },
    { id: 'weapons', name: 'Weapons', icon: '⚔️', count: 18 },
    { id: 'electronics', name: 'Electronics', icon: '📱', count: 15 },
    { id: 'nature', name: 'Nature', icon: '🌿', count: 32 },
    { id: 'food', name: 'Food', icon: '🍎', count: 20 },
  ];

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[hsl(var(--cde-bg-primary))]">
      <EditorTopBar 
        projectName="Untitled Prop" 
        projectExtension=".lprop" 
        accentColor={accentColor}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <PropsLeftToolbar activeTool={activeTool} onToolChange={setActiveTool} />
        
        {/* Main Props Workspace */}
        <main className="flex-1 relative bg-[hsl(var(--cde-bg-primary))] flex overflow-hidden">
          {/* 3D Viewport */}
          <div className="flex-1 relative p-4">
            <div className="absolute inset-4 rounded-2xl overflow-hidden border border-[hsl(var(--cde-border-subtle))] bg-gradient-to-br from-[hsl(var(--cde-bg-secondary))] to-[hsl(var(--cde-bg-tertiary))]">
              {/* 3D Grid Floor */}
              <div className="absolute inset-0 flex items-end justify-center pb-[20%]">
                <div 
                  className="w-[80%] aspect-[2/1] opacity-20"
                  style={{
                    backgroundImage: `
                      linear-gradient(90deg, hsl(200 80% 50%) 1px, transparent 1px),
                      linear-gradient(hsl(200 80% 50%) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(60deg)',
                  }}
                />
              </div>

              {/* Prop Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-[hsl(200_80%_50%)]/20 to-[hsl(200_80%_30%)]/20 border border-[hsl(200_80%_50%)]/30 flex items-center justify-center backdrop-blur-sm">
                    <Box className="w-20 h-20 text-[hsl(200_80%_50%)]/50" />
                  </div>
                  {/* 3D Axis Indicator */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
                    <span className="text-xs font-bold text-red-400">X</span>
                    <span className="text-xs font-bold text-green-400">Y</span>
                    <span className="text-xs font-bold text-blue-400">Z</span>
                  </div>
                </div>
              </div>

              {/* View Mode Badge */}
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-[hsl(200_80%_50%)]/20 border border-[hsl(200_80%_50%)]/40">
                <span className="text-sm font-bold text-[hsl(200_80%_50%)] uppercase">{selectedView}</span>
              </div>

              {/* Dimensions Info */}
              <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(var(--cde-bg-tertiary))]">
                <span className="text-xs font-mono text-[hsl(var(--cde-text-secondary))]">1.0m × 1.5m × 0.8m</span>
              </div>

              {/* Light Control */}
              <div className="absolute bottom-4 left-4 flex items-center gap-3 px-3 py-2 rounded-lg bg-[hsl(var(--cde-bg-tertiary))]">
                <Lightbulb className="w-4 h-4 text-[hsl(var(--cde-text-muted))]" />
                <Slider 
                  value={lightIntensity} 
                  onValueChange={setLightIntensity} 
                  max={100} 
                  className="w-24"
                />
                <span className="text-xs font-mono text-[hsl(var(--cde-text-muted))]">{lightIntensity}%</span>
              </div>

              {/* AI Status */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(200_80%_50%)]/20 border border-[hsl(200_80%_50%)]/40">
                <Sparkles className="w-4 h-4 text-[hsl(200_80%_50%)]" />
                <span className="text-xs font-medium text-[hsl(200_80%_50%)]">PropForge</span>
              </div>

              {/* Rotation Control */}
              <div className="absolute bottom-16 right-4">
                <Button variant="ghost" size="icon" className="w-10 h-10 bg-[hsl(var(--cde-bg-tertiary))] hover:bg-[hsl(var(--cde-bg-secondary))]">
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* View Selector */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {views.map((view) => (
                <button
                  key={view}
                  onClick={() => setSelectedView(view)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    selectedView === view
                      ? 'bg-[hsl(200_80%_50%)] text-white shadow-lg shadow-[hsl(200_80%_50%)]/30'
                      : 'bg-[hsl(var(--cde-bg-secondary))] text-[hsl(var(--cde-text-muted))] hover:text-[hsl(var(--cde-text-primary))]'
                  }`}
                >
                  {view.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Side Panel - Materials & Library */}
          <div className="w-64 border-l border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-secondary))] flex flex-col">
            {/* Materials Section */}
            <div className="p-4 border-b border-[hsl(var(--cde-border-subtle))]">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4 text-[hsl(200_80%_50%)]" />
                <span className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">MATERIALS</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {materials.map((material) => (
                  <button
                    key={material.id}
                    onClick={() => setSelectedMaterial(material.id)}
                    className={`aspect-square rounded-xl transition-all ${
                      selectedMaterial === material.id
                        ? 'ring-2 ring-[hsl(200_80%_50%)] ring-offset-2 ring-offset-[hsl(var(--cde-bg-secondary))]'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: material.color }}
                    title={material.name}
                  />
                ))}
              </div>
            </div>

            {/* Prop Library */}
            <div className="flex-1 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-[hsl(200_80%_50%)]" />
                <span className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">PROP LIBRARY</span>
              </div>
              <ScrollArea className="h-[calc(100%-2rem)]">
                <div className="space-y-2">
                  {propCategories.map((category) => (
                    <button
                      key={category.id}
                      className="w-full p-3 rounded-xl bg-[hsl(var(--cde-bg-tertiary))] hover:bg-[hsl(200_80%_50%)]/10 transition-colors flex items-center gap-3"
                    >
                      <span className="text-xl">{category.icon}</span>
                      <div className="flex-1 text-left">
                        <p className="text-xs font-medium text-[hsl(var(--cde-text-primary))]">{category.name}</p>
                        <p className="text-[10px] text-[hsl(var(--cde-text-muted))]">{category.count} items</p>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </main>
        
        <PropsRightPanel activeTool={activeTool} />
      </div>
      
      <EditorBottomBar accentColor={accentColor} statusMessage="PropForge Ready" />
    </div>
  );
};

export default PropsEditor;
