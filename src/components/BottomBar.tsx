import { useState } from "react";
import { Info, MapPin, ZoomIn, Clock, Shield, Settings2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export const BottomBar = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <footer 
      className="border-t border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-secondary))] flex flex-col transition-all duration-300 ease-in-out overflow-hidden"
      style={{ height: isHovered ? '64px' : '10px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top row: Inspector/Tool Parameters */}
      <div className="h-10 flex items-center gap-6 px-4 border-b border-[hsl(var(--cde-border-subtle))]">
        <div className="flex items-center gap-2 text-[hsl(var(--cde-text-primary))]">
          <Settings2 className="w-3.5 h-3.5 text-[hsl(var(--cde-accent-purple))]" />
          <span className="text-xs font-medium">Inspector</span>
        </div>
        
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <label className="text-xs text-[hsl(var(--cde-text-muted))]">Size:</label>
            <Slider defaultValue={[50]} max={100} className="w-24" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-[hsl(var(--cde-text-muted))]">Opacity:</label>
            <Slider defaultValue={[100]} max={100} className="w-24" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-[hsl(var(--cde-text-muted))]">Hardness:</label>
            <Slider defaultValue={[75]} max={100} className="w-24" />
          </div>
        </div>
      </div>
      
      {/* Bottom row: Status & Hints */}
      <div className="h-6 flex items-center justify-between px-4 text-xs text-[hsl(var(--cde-text-secondary))]">
      {/* Left Section - Hints */}
      <div className="flex items-center gap-2">
        <Info className="w-3.5 h-3.5" />
        <span>Ctrl+Click-Drag to adjust pins | Shift for precision</span>
      </div>
      
      {/* Center Section - Status */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          <span className="font-mono">X: 854 Y: 312</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <ZoomIn className="w-3.5 h-3.5" />
          <span className="font-mono">125%</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>History: Layer Transform Applied</span>
        </div>
      </div>
      
      {/* Right Section - AI Status */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-[hsl(var(--cde-accent-success))]" />
          <span>Ethics: <span className="text-[hsl(var(--cde-accent-success))]">Low Bias</span></span>
        </div>
        
        <div className="w-2 h-2 rounded-full bg-[hsl(var(--cde-accent-success))] animate-pulse" />
        <span>AI Ready</span>
      </div>
      </div>
    </footer>
  );
};
