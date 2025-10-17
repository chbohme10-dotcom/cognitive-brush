import { useState } from "react";
import { X, Settings2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface MiniSettingsStripProps {
  onClose: () => void;
}

export const MiniSettingsStrip = ({ onClose }: MiniSettingsStripProps) => {
  const [activeTool] = useState('brush'); // Default to brush for now
  const [brushSize, setBrushSize] = useState([50]);
  const [brushHardness, setBrushHardness] = useState([75]);
  const [brushOpacity, setBrushOpacity] = useState([100]);
  const [lassoSnap, setLassoSnap] = useState([20]);
  const [lassoFeather, setLassoFeather] = useState([5]);
  const [selectMode, setSelectMode] = useState("new");
  const [aiStrength, setAiStrength] = useState([80]);
  const [blendMode, setBlendMode] = useState("normal");

  const renderBrushSettings = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Settings2 className="w-4 h-4 text-[hsl(var(--cde-accent-purple))]" />
        <span className="text-xs font-semibold text-[hsl(var(--cde-text-primary))]">Brush Tool</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">Size</Label>
          <span className="text-[10px] font-mono text-[hsl(var(--cde-text-primary))]">{brushSize[0]}px</span>
        </div>
        <Slider value={brushSize} onValueChange={setBrushSize} max={500} step={1} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">Hardness</Label>
          <span className="text-[10px] font-mono text-[hsl(var(--cde-text-primary))]">{brushHardness[0]}%</span>
        </div>
        <Slider value={brushHardness} onValueChange={setBrushHardness} max={100} step={1} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">Opacity</Label>
          <span className="text-[10px] font-mono text-[hsl(var(--cde-text-primary))]">{brushOpacity[0]}%</span>
        </div>
        <Slider value={brushOpacity} onValueChange={setBrushOpacity} max={100} step={1} />
      </div>

      <Separator className="bg-[hsl(var(--cde-border-subtle))]" />

      <div className="space-y-2">
        <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">Blend Mode</Label>
        <Select value={blendMode} onValueChange={setBlendMode}>
          <SelectTrigger className="h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="multiply">Multiply</SelectItem>
            <SelectItem value="screen">Screen</SelectItem>
            <SelectItem value="overlay">Overlay</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">Pressure</Label>
        <Switch defaultChecked />
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">Smoothing</Label>
        <Switch />
      </div>
    </div>
  );

  const renderSelectSettings = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Settings2 className="w-4 h-4 text-[hsl(var(--cde-accent-blue))]" />
        <span className="text-xs font-semibold text-[hsl(var(--cde-text-primary))]">Select Tool</span>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">Mode</Label>
        <Select value={selectMode} onValueChange={setSelectMode}>
          <SelectTrigger className="h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New Selection</SelectItem>
            <SelectItem value="add">Add to Selection</SelectItem>
            <SelectItem value="subtract">Subtract</SelectItem>
            <SelectItem value="intersect">Intersect</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-[hsl(var(--cde-border-subtle))]" />

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">X</Label>
          <Input type="number" defaultValue="0" className="h-7 text-xs" />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">Y</Label>
          <Input type="number" defaultValue="0" className="h-7 text-xs" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">W</Label>
          <Input type="number" defaultValue="100" className="h-7 text-xs" />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">H</Label>
          <Input type="number" defaultValue="100" className="h-7 text-xs" />
        </div>
      </div>

      <Separator className="bg-[hsl(var(--cde-border-subtle))]" />

      <div className="flex items-center justify-between">
        <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">Anti-alias</Label>
        <Switch defaultChecked />
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">Snap to Grid</Label>
        <Switch />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">Feather</Label>
          <span className="text-[10px] font-mono text-[hsl(var(--cde-text-primary))]">{lassoFeather[0]}px</span>
        </div>
        <Slider value={lassoFeather} onValueChange={setLassoFeather} max={50} step={1} />
      </div>
    </div>
  );

  const renderLassoSettings = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Settings2 className="w-4 h-4 text-[hsl(var(--cde-accent-cyan))]" />
        <span className="text-xs font-semibold text-[hsl(var(--cde-text-primary))]">Lasso Tool</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">Snap Radius</Label>
          <span className="text-[10px] font-mono text-[hsl(var(--cde-text-primary))]">{lassoSnap[0]}px</span>
        </div>
        <Slider value={lassoSnap} onValueChange={setLassoSnap} max={100} step={5} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">Feather</Label>
          <span className="text-[10px] font-mono text-[hsl(var(--cde-text-primary))]">{lassoFeather[0]}px</span>
        </div>
        <Slider value={lassoFeather} onValueChange={setLassoFeather} max={50} step={1} />
      </div>

      <Separator className="bg-[hsl(var(--cde-border-subtle))]" />

      <div className="flex items-center justify-between">
        <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">Magnetic</Label>
        <Switch />
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">Anti-alias</Label>
        <Switch defaultChecked />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">Curve Tension</Label>
        <Slider defaultValue={[50]} max={100} step={5} />
      </div>
    </div>
  );

  const renderAISettings = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[hsl(var(--cde-accent-purple))]" />
        <span className="text-xs font-semibold text-[hsl(var(--cde-text-primary))]">AI Tools</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">Strength</Label>
          <span className="text-[10px] font-mono text-[hsl(var(--cde-text-primary))]">{aiStrength[0]}%</span>
        </div>
        <Slider value={aiStrength} onValueChange={setAiStrength} max={100} step={5} />
      </div>

      <Separator className="bg-[hsl(var(--cde-border-subtle))]" />

      <div className="flex items-center justify-between">
        <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">Auto-enhance</Label>
        <Switch defaultChecked />
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">Edge Detection</Label>
        <Switch />
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">Preserve Details</Label>
        <Switch defaultChecked />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-[hsl(var(--cde-text-secondary))]">Style Transfer</Label>
        <Select defaultValue="none">
          <SelectTrigger className="h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="artistic">Artistic</SelectItem>
            <SelectItem value="photographic">Photographic</SelectItem>
            <SelectItem value="cinematic">Cinematic</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div 
      className="fixed bottom-12 left-0 right-0 bg-[hsl(var(--cde-bg-secondary))] border-t border-[hsl(var(--cde-border-subtle))] z-50 animate-fade-in"
      style={{ height: '240px' }}
    >
      <div className="h-full overflow-y-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">Tool Settings</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Settings Content */}
        <div className="space-y-4">
          {activeTool === 'brush' && renderBrushSettings()}
          {activeTool === 'select' && renderSelectSettings()}
          {activeTool === 'lasso' && renderLassoSettings()}
          {activeTool === 'ai' && renderAISettings()}
          
          {/* Default message if no tool selected */}
          {!['brush', 'select', 'lasso', 'ai'].includes(activeTool) && (
            <div className="text-center text-[hsl(var(--cde-text-muted))] py-8">
              <Settings2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs">Select a tool to see settings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
