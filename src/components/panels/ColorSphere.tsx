import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pipette, Palette } from "lucide-react";

export const ColorSphere = () => {
  const [selectedColor, setSelectedColor] = useState("#9333EA");
  
  const recentColors = [
    "#9333EA", "#3B82F6", "#10B981", "#F59E0B", "#EF4444",
    "#8B5CF6", "#06B6D4", "#84CC16", "#F97316", "#EC4899"
  ];

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
          ColorSphere
        </h3>
        <Button size="icon" variant="ghost" className="w-7 h-7">
          <Pipette className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Main Color Picker - Sphere Visualization */}
      <div className="relative aspect-square rounded-lg overflow-hidden border border-[hsl(var(--cde-border-subtle))]">
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 50%),
              conic-gradient(from 0deg, 
                hsl(0, 100%, 50%), 
                hsl(60, 100%, 50%), 
                hsl(120, 100%, 50%), 
                hsl(180, 100%, 50%), 
                hsl(240, 100%, 50%), 
                hsl(300, 100%, 50%), 
                hsl(360, 100%, 50%)
              )
            `
          }}
        />
        
        {/* Cursor Indicator */}
        <div 
          className="absolute w-6 h-6 border-2 border-white rounded-full shadow-lg pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)'
          }}
        />
      </div>
      
      {/* Color Value Display */}
      <div className="flex items-center gap-2">
        <div 
          className="w-12 h-12 rounded-lg border-2 border-[hsl(var(--cde-border-subtle))] flex-shrink-0"
          style={{ backgroundColor: selectedColor }}
        />
        <Input 
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="flex-1 font-mono text-sm bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))]"
        />
      </div>
      
      {/* Color Mode Tabs */}
      <Tabs defaultValue="hsv" className="space-y-3">
        <TabsList className="grid w-full grid-cols-3 bg-[hsl(var(--cde-bg-tertiary))]">
          <TabsTrigger value="hsv" className="text-xs">HSV</TabsTrigger>
          <TabsTrigger value="rgb" className="text-xs">RGB</TabsTrigger>
          <TabsTrigger value="hex" className="text-xs">HEX</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hsv" className="space-y-2">
          <div className="space-y-1">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Hue</Label>
            <Input type="number" defaultValue="270" className="h-8 text-sm bg-[hsl(var(--cde-bg-tertiary))]" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Saturation</Label>
            <Input type="number" defaultValue="80" className="h-8 text-sm bg-[hsl(var(--cde-bg-tertiary))]" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Value</Label>
            <Input type="number" defaultValue="92" className="h-8 text-sm bg-[hsl(var(--cde-bg-tertiary))]" />
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Recent Colors */}
      <div className="space-y-2">
        <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Recent Colors</Label>
        <div className="grid grid-cols-5 gap-2">
          {recentColors.map((color, i) => (
            <button
              key={i}
              className="aspect-square rounded border border-[hsl(var(--cde-border-subtle))] hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
      </div>
      
      {/* Palette Library */}
      <Button variant="outline" className="w-full gap-2 border-[hsl(var(--cde-border-subtle))]">
        <Palette className="w-4 h-4" />
        Browse Palettes
      </Button>
    </div>
  );
};
