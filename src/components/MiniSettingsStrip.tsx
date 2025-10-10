import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface MiniSettingsStripProps {
  activeTool: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const MiniSettingsStrip = ({ activeTool, isExpanded, onToggleExpand }: MiniSettingsStripProps) => {
  if (isExpanded) return null;

  return (
    <div className="w-48 border-r border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-secondary))] flex flex-col p-3 gap-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-[hsl(var(--cde-text-primary))] uppercase">
          Quick Settings
        </h4>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleExpand}
          className="w-6 h-6"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Dynamic settings based on active tool */}
      {activeTool === 'brush' && (
        <>
          <div className="space-y-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Size</Label>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Opacity</Label>
            <Slider defaultValue={[100]} max={100} step={1} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Pressure</Label>
            <Switch defaultChecked />
          </div>
        </>
      )}

      {activeTool === 'select' && (
        <>
          <div className="space-y-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Feather</Label>
            <Slider defaultValue={[0]} max={100} step={1} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Anti-alias</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Snap</Label>
            <Switch />
          </div>
        </>
      )}

      {activeTool === 'lasso' && (
        <>
          <div className="space-y-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Snap Radius</Label>
            <Slider defaultValue={[20]} max={50} step={1} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Tension</Label>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">AI Enhance</Label>
            <Switch />
          </div>
        </>
      )}

      {activeTool === 'ai' && (
        <>
          <div className="space-y-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Strength</Label>
            <Slider defaultValue={[75]} max={100} step={1} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Auto-enhance</Label>
            <Switch defaultChecked />
          </div>
        </>
      )}
    </div>
  );
};
