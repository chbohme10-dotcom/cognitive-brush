import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Monitor,
  Smartphone,
  Tablet,
  Info,
  Clock,
  HardDrive,
  Cpu
} from "lucide-react";

interface EditorBottomBarProps {
  statusMessage?: string;
  leftControls?: ReactNode;
  centerControls?: ReactNode;
  rightControls?: ReactNode;
  accentColor?: string;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
}

export const EditorBottomBar = ({ 
  statusMessage = "Ready",
  leftControls,
  centerControls,
  rightControls,
  accentColor = "hsl(var(--cde-accent-purple))",
  zoom = 100,
  onZoomChange
}: EditorBottomBarProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <footer 
      className="border-t border-[hsl(var(--cde-border-subtle))] flex items-center justify-between relative overflow-hidden transition-all duration-300 ease-in-out"
      style={{ 
        height: isHovered ? '36px' : '10px',
        paddingLeft: isHovered ? '16px' : '0',
        paddingRight: isHovered ? '16px' : '0',
        background: `
          linear-gradient(to top, hsl(var(--cde-bg-secondary)) 0%, hsl(var(--cde-bg-secondary)) calc(100% - 10px), hsl(var(--cde-bg-tertiary)) calc(100% - 10px)),
          repeating-linear-gradient(
            90deg,
            hsl(var(--cde-border-subtle)) 0px,
            hsl(var(--cde-border-subtle)) 1px,
            transparent 1px,
            transparent 20px
          )
        `,
        backgroundPosition: '0 0, 0 0',
        backgroundSize: '100% 100%, 100px 10px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ruler markings at top */}
      <div className="absolute top-0 left-0 right-0 h-[10px] flex items-start pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <div 
            key={i} 
            className="flex-shrink-0 w-5 h-full relative"
            style={{ borderRight: `1px solid ${i % 5 === 0 ? accentColor + '40' : 'hsl(var(--cde-border-subtle))'}` }}
          >
            {i % 10 === 0 && (
              <span className="absolute top-0.5 left-0.5 text-[8px] text-[hsl(var(--cde-text-muted))] font-mono">
                {i * 20}
              </span>
            )}
          </div>
        ))}
      </div>
      
      {isHovered && (
        <>
          {/* Left Section - Status */}
          <div className="flex items-center gap-3">
            {leftControls || (
              <>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: accentColor }}
                  />
                  <span className="text-xs text-[hsl(var(--cde-text-secondary))]">
                    {statusMessage}
                  </span>
                </div>
                
                <div className="h-4 w-px bg-[hsl(var(--cde-border-subtle))]" />
                
                <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--cde-text-muted))]">
                  <HardDrive className="w-3 h-3" />
                  <span>Auto-saved</span>
                </div>
              </>
            )}
          </div>
          
          {/* Center Section - Timeline/Transport */}
          <div className="flex items-center gap-2">
            {centerControls || (
              <>
                <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--cde-text-muted))]">
                  <Clock className="w-3 h-3" />
                  <span className="font-mono">00:00:00:00</span>
                </div>
                
                <div className="h-4 w-px bg-[hsl(var(--cde-border-subtle))] mx-2" />
                
                <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--cde-text-muted))]">
                  <Cpu className="w-3 h-3" />
                  <span>AI: Idle</span>
                </div>
              </>
            )}
          </div>
          
          {/* Right Section - Zoom & View Controls */}
          <div className="flex items-center gap-2">
            {rightControls || (
              <>
                <div className="flex items-center gap-1 bg-[hsl(var(--cde-bg-tertiary))] rounded px-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-6 h-6"
                    onClick={() => onZoomChange?.(Math.max(10, zoom - 10))}
                  >
                    <ZoomOut className="w-3 h-3" />
                  </Button>
                  <span className="text-xs font-mono w-10 text-center">{zoom}%</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-6 h-6"
                    onClick={() => onZoomChange?.(Math.min(500, zoom + 10))}
                  >
                    <ZoomIn className="w-3 h-3" />
                  </Button>
                </div>
                
                <div className="h-4 w-px bg-[hsl(var(--cde-border-subtle))]" />
                
                <div className="flex items-center gap-0.5">
                  <Button variant="ghost" size="icon" className="w-6 h-6" title="Desktop">
                    <Monitor className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-6 h-6" title="Tablet">
                    <Tablet className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-6 h-6" title="Mobile">
                    <Smartphone className="w-3 h-3" />
                  </Button>
                </div>
                
                <Button variant="ghost" size="icon" className="w-6 h-6" title="Fit to Screen">
                  <Maximize2 className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </footer>
  );
};
