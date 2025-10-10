import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Microscope, Grid3x3, Crosshair } from "lucide-react";

export const MicroscopePanel = () => {
  const [magnification, setMagnification] = useState([400]);
  const [showGrid, setShowGrid] = useState(true);
  const [showCrosshair, setShowCrosshair] = useState(true);

  return (
    <div className="h-full flex flex-col p-4 space-y-4 bg-[hsl(var(--cde-bg-secondary))]">
      <div className="flex items-center gap-2 text-[hsl(var(--cde-text-primary))]">
        <Microscope className="w-5 h-5 text-[hsl(var(--cde-accent-purple))]" />
        <h3 className="font-semibold">Microscope View</h3>
      </div>

      {/* Ultra-Zoom Preview */}
      <div className="flex-1 rounded-lg border-2 border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-tertiary))] relative overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          {/* Placeholder for ultra-zoomed pixel view */}
          <div className="grid grid-cols-8 gap-0.5">
            {Array.from({ length: 64 }).map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 border border-[hsl(var(--cde-border-subtle))]"
                style={{
                  backgroundColor: `hsl(${(i * 17) % 360}, 70%, ${40 + (i % 3) * 20}%)`,
                }}
              />
            ))}
          </div>
        </div>
        
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="hsl(var(--cde-accent-purple))"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        )}
        
        {showCrosshair && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-full h-0.5 bg-[hsl(var(--cde-accent-purple))]/50" />
            <div className="w-0.5 h-full bg-[hsl(var(--cde-accent-purple))]/50 absolute" />
          </div>
        )}
      </div>

      {/* Magnification Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-[hsl(var(--cde-text-secondary))]">Magnification</label>
          <Badge className="bg-[hsl(var(--cde-accent-purple))] font-mono">
            {magnification[0]}%
          </Badge>
        </div>
        <Slider
          value={magnification}
          onValueChange={setMagnification}
          min={200}
          max={1600}
          step={100}
          className="w-full"
        />
      </div>

      {/* Display Options */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-[hsl(var(--cde-text-primary))]">Display</h4>
        <div className="flex gap-2">
          <Button
            variant={showGrid ? "default" : "outline"}
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
            className="flex-1 gap-2"
          >
            <Grid3x3 className="w-4 h-4" />
            Grid
          </Button>
          <Button
            variant={showCrosshair ? "default" : "outline"}
            size="sm"
            onClick={() => setShowCrosshair(!showCrosshair)}
            className="flex-1 gap-2"
          >
            <Crosshair className="w-4 h-4" />
            Crosshair
          </Button>
        </div>
      </div>

      {/* Pixel Info */}
      <div className="space-y-2 pt-2 border-t border-[hsl(var(--cde-border-subtle))]">
        <h4 className="text-sm font-medium text-[hsl(var(--cde-text-primary))]">Pixel Info</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[hsl(var(--cde-text-muted))]">RGB:</span>
            <span className="ml-2 font-mono text-[hsl(var(--cde-text-primary))]">255, 128, 64</span>
          </div>
          <div>
            <span className="text-[hsl(var(--cde-text-muted))]">HSL:</span>
            <span className="ml-2 font-mono text-[hsl(var(--cde-text-primary))]">30°, 100%, 50%</span>
          </div>
          <div>
            <span className="text-[hsl(var(--cde-text-muted))]">Hex:</span>
            <span className="ml-2 font-mono text-[hsl(var(--cde-text-primary))]">#FF8040</span>
          </div>
          <div>
            <span className="text-[hsl(var(--cde-text-muted))]">Alpha:</span>
            <span className="ml-2 font-mono text-[hsl(var(--cde-text-primary))]">100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
