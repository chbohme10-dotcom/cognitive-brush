import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MiniSettingsStrip } from "./MiniSettingsStrip";

export const BottomBar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      {showSettings && <MiniSettingsStrip onClose={() => setShowSettings(false)} />}
      
      <footer 
        className="border-t border-[hsl(var(--cde-border-subtle))] relative overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          height: isHovered ? '44px' : '10px',
          paddingLeft: isHovered ? '16px' : '0',
          paddingRight: isHovered ? '16px' : '0',
          background: `
            linear-gradient(to bottom, hsl(var(--cde-bg-tertiary)) 0%, hsl(var(--cde-bg-tertiary)) 10px, hsl(var(--cde-bg-secondary)) 10px),
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
        {/* Ruler markings */}
        <div className="absolute top-0 left-0 right-0 h-[10px] flex pointer-events-none">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-5 h-full border-r border-[hsl(var(--cde-border-subtle))] relative">
              {i % 5 === 0 && (
                <span className="absolute top-0 left-0.5 text-[8px] text-[hsl(var(--cde-text-muted))] font-mono">
                  {i * 20}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Content - only visible when hovered */}
        {isHovered && (
          <div className="flex items-center justify-between h-full animate-fade-in">
            {/* Left Section with Settings Toggle */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className={showSettings ? "bg-[hsl(var(--cde-accent-purple))] text-white" : ""}
              >
                <Settings className="w-4 h-4 mr-2" />
                Tool Settings
              </Button>
            </div>
            
            {/* Center Status */}
            <div className="flex items-center gap-4 text-sm text-[hsl(var(--cde-text-secondary))]">
              <span>Canvas: 1920 × 1080</span>
              <div className="h-4 w-px bg-[hsl(var(--cde-border-subtle))]" />
              <span>Layer: Background</span>
              <div className="h-4 w-px bg-[hsl(var(--cde-border-subtle))]" />
              <span>Memory: 2.4 GB</span>
            </div>
            
            {/* Right placeholder */}
            <div className="w-24" />
          </div>
        )}
      </footer>
    </>
  );
};
