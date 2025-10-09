import { Info, MapPin, ZoomIn, Clock, Shield } from "lucide-react";

export const BottomBar = () => {
  return (
    <footer className="h-8 border-t border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-secondary))] flex items-center justify-between px-4 text-xs text-[hsl(var(--cde-text-secondary))]">
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
    </footer>
  );
};
