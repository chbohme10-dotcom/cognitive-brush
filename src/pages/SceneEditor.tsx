import { useState } from "react";
import { EditorTopBar } from "@/components/editors/shared/EditorTopBar";
import { EditorBottomBar } from "@/components/editors/shared/EditorBottomBar";
import { SceneLeftToolbar } from "@/components/editors/scene/SceneLeftToolbar";
import { SceneRightPanel } from "@/components/editors/scene/SceneRightPanel";
import { Sun, Cloud, Mountain, Trees, Building2, Sparkles } from "lucide-react";

const SceneEditor = () => {
  const [activeTool, setActiveTool] = useState('select');
  const accentColor = "hsl(280 70% 55%)";

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[hsl(var(--cde-bg-primary))]">
      <EditorTopBar 
        projectName="Untitled Scene" 
        projectExtension=".lscene" 
        accentColor={accentColor}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <SceneLeftToolbar activeTool={activeTool} onToolChange={setActiveTool} />
        
        {/* Main Scene Canvas */}
        <main className="flex-1 relative bg-[hsl(var(--cde-bg-primary))] overflow-hidden">
          {/* Scene Viewport */}
          <div className="absolute inset-4 rounded-2xl overflow-hidden border border-[hsl(var(--cde-border-subtle))]">
            {/* Scene Background - Gradient Sky */}
            <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200_80%_70%)] via-[hsl(200_70%_80%)] to-[hsl(30_60%_85%)]" />
            
            {/* Scene Layers Visualization */}
            <div className="absolute inset-0">
              {/* Far Mountains */}
              <div className="absolute bottom-0 left-0 right-0 h-[40%]">
                <svg viewBox="0 0 1200 300" className="w-full h-full" preserveAspectRatio="none">
                  <path 
                    d="M0 300 L0 200 Q150 100 300 180 Q450 80 600 150 Q750 50 900 120 Q1050 90 1200 160 L1200 300 Z" 
                    fill="hsl(220 30% 60%)" 
                    opacity="0.5"
                  />
                  <path 
                    d="M0 300 L0 220 Q200 150 400 200 Q550 130 700 180 Q850 100 1000 150 Q1100 130 1200 170 L1200 300 Z" 
                    fill="hsl(220 25% 50%)" 
                    opacity="0.6"
                  />
                </svg>
              </div>
              
              {/* Midground Trees */}
              <div className="absolute bottom-0 left-0 right-0 h-[30%]">
                <svg viewBox="0 0 1200 200" className="w-full h-full" preserveAspectRatio="none">
                  <path 
                    d="M0 200 L0 120 Q100 80 200 100 Q300 60 400 90 Q500 50 600 80 Q700 40 800 70 Q900 50 1000 80 Q1100 60 1200 90 L1200 200 Z" 
                    fill="hsl(140 40% 30%)" 
                    opacity="0.8"
                  />
                </svg>
              </div>
              
              {/* Ground */}
              <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-gradient-to-t from-[hsl(140_30%_25%)] to-[hsl(140_35%_35%)]" />
            </div>
            
            {/* Scene Grid Overlay */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(to right, hsl(var(--cde-text-primary)) 1px, transparent 1px),
                  linear-gradient(to bottom, hsl(var(--cde-text-primary)) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
              }}
            />
            
            {/* Atmospheric Fog Layer */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent" />
            
            {/* Sun/Light Source */}
            <div className="absolute top-[15%] right-[25%]">
              <div 
                className="w-20 h-20 rounded-full blur-xl"
                style={{ 
                  background: 'radial-gradient(circle, hsl(45 100% 80%) 0%, hsl(45 100% 90%) 50%, transparent 70%)',
                  boxShadow: '0 0 60px 30px hsl(45 100% 85% / 0.5)'
                }}
              />
            </div>

            {/* Scene Info Overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
                <span className="text-xs font-mono text-white/80">SCENE VIEW</span>
              </div>
            </div>

            {/* Layer Indicators */}
            <div className="absolute top-4 right-4 flex flex-col gap-1">
              {[
                { icon: Sun, label: 'Lighting', color: 'hsl(45 100% 60%)' },
                { icon: Cloud, label: 'Atmosphere', color: 'hsl(200 80% 70%)' },
                { icon: Mountain, label: 'Terrain', color: 'hsl(220 30% 55%)' },
                { icon: Trees, label: 'Vegetation', color: 'hsl(140 40% 35%)' },
              ].map((layer, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-2 px-2 py-1 rounded bg-black/40 backdrop-blur-sm border border-white/10"
                >
                  <layer.icon className="w-3 h-3" style={{ color: layer.color }} />
                  <span className="text-[10px] text-white/70">{layer.label}</span>
                </div>
              ))}
            </div>

            {/* Camera View Indicator */}
            <div className="absolute bottom-4 left-4 flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-mono text-white/80">CAM 01</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
                <span className="text-xs font-mono text-white/80">16:9 | 1920×1080</span>
              </div>
            </div>

            {/* AI Status */}
            <div className="absolute bottom-4 right-4">
              <div className="px-3 py-1.5 rounded-lg bg-[hsl(280_70%_55%)]/30 backdrop-blur-sm border border-[hsl(280_70%_55%)]/50 flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-[hsl(280_70%_55%)]" />
                <span className="text-xs font-medium text-white/90">SceneForge Ready</span>
              </div>
            </div>
          </div>
        </main>
        
        <SceneRightPanel activeTool={activeTool} />
      </div>
      
      <EditorBottomBar 
        accentColor={accentColor} 
        statusMessage="SceneForge Ready"
      />
    </div>
  );
};

export default SceneEditor;
