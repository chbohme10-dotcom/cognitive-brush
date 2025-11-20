import { useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UltraFastFloodFill } from "@/lib/segmentation/UltraFastFloodFill";
import { toast } from "sonner";

interface MagicWandToolProps {
  canvas: FabricCanvas | null;
}

export const MagicWandTool = ({ canvas }: MagicWandToolProps) => {
  const [tolerance, setTolerance] = useState(30);
  const [colorSpace, setColorSpace] = useState<'rgb' | 'hsv' | 'lab'>('rgb');
  const [connectivity, setConnectivity] = useState<4 | 8>(4);

  const handleCanvasClick = async (e: MouseEvent) => {
    if (!canvas) return;

    const canvasElement = canvas.getElement();
    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;

    const rect = canvasElement.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    const imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
    const floodFill = new UltraFastFloodFill(imageData);

    try {
      const result = await floodFill.segment(
        { x, y },
        { tolerance, colorSpace, connectivity }
      );

      toast.success(`Selected ${result.pixels.length} pixels in ${result.metadata.executionTime.toFixed(2)}ms`);
    } catch (error) {
      toast.error('Selection failed');
      console.error(error);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label>Tolerance: {tolerance}</Label>
        <Slider
          value={[tolerance]}
          onValueChange={(v) => setTolerance(v[0])}
          min={0}
          max={255}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <Label>Color Space</Label>
        <Select value={colorSpace} onValueChange={(v) => setColorSpace(v as 'rgb' | 'hsv' | 'lab')}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rgb">RGB</SelectItem>
            <SelectItem value="hsv">HSV</SelectItem>
            <SelectItem value="lab">LAB</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Connectivity</Label>
        <Select value={connectivity.toString()} onValueChange={(v) => setConnectivity(Number(v) as 4 | 8)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4">4-way</SelectItem>
            <SelectItem value="8">8-way</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
