import { useState, useCallback, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MagicWandSystem, AlgorithmType, BenchmarkResult, defaultConfig } from "@/lib/segmentation/MagicWandBenchmark";
import { MarchingSquaresContour } from "@/lib/segmentation/MarchingSquaresContour";
import { toast } from "sonner";
import { Wand2, Zap, Globe, Timer, FlaskConical } from "lucide-react";

interface MagicWandToolProps {
  canvas: FabricCanvas | null;
}

export const MagicWandTool = ({ canvas }: MagicWandToolProps) => {
  const [tolerance, setTolerance] = useState(defaultConfig.tolerance);
  const [colorSpace, setColorSpace] = useState<'rgb' | 'hsv' | 'lab'>(defaultConfig.colorSpace);
  const [connectivity, setConnectivity] = useState<4 | 8>(defaultConfig.connectivity);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>(defaultConfig.algorithm);
  const [contiguous, setContiguous] = useState(defaultConfig.contiguous);
  const [antiAlias, setAntiAlias] = useState(defaultConfig.antiAlias);
  const [featherRadius, setFeatherRadius] = useState(defaultConfig.featherRadius);
  const [benchmarkResults, setBenchmarkResults] = useState<BenchmarkResult[]>([]);
  const [lastResult, setLastResult] = useState<{ pixels: number; time: number } | null>(null);
  const [isActive, setIsActive] = useState(false);

  const handleCanvasClick = useCallback(async (e: MouseEvent) => {
    if (!canvas || !isActive) return;

    const canvasElement = canvas.getElement();
    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;

    const rect = canvasElement.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvasElement.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvasElement.height / rect.height));

    if (x < 0 || x >= canvasElement.width || y < 0 || y >= canvasElement.height) return;

    const imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
    const wandSystem = new MagicWandSystem(imageData);

    try {
      const result = await wandSystem.select(
        { x, y },
        { algorithm, tolerance, colorSpace, connectivity, contiguous, antiAlias, featherRadius }
      );

      setLastResult({
        pixels: result.pixels.length,
        time: result.metadata.executionTime
      });

      // Visualize selection with marching ants or overlay
      visualizeSelection(ctx, result.mask, canvasElement.width, canvasElement.height, result.contour);

      toast.success(
        `Selected ${result.pixels.length.toLocaleString()} pixels in ${result.metadata.executionTime.toFixed(2)}ms`,
        { description: `Algorithm: ${result.metadata.algorithm}` }
      );
    } catch (error) {
      toast.error('Selection failed');
      console.error(error);
    }
  }, [canvas, isActive, algorithm, tolerance, colorSpace, connectivity, contiguous, antiAlias, featherRadius]);

  const visualizeSelection = (
    ctx: CanvasRenderingContext2D,
    mask: Uint8ClampedArray,
    width: number,
    height: number,
    contour?: Point[][]
  ) => {
    // Draw semi-transparent overlay for selection
    const overlay = MagicWandSystem.maskToImageData(mask, width, height);
    
    // Create temp canvas for overlay
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.putImageData(overlay, 0, 0);
    
    // Draw overlay with blend mode
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 0.3;
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.restore();

    // Draw contour lines if available
    if (contour && contour.length > 0) {
      ctx.save();
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      
      contour.forEach(path => {
        if (path.length > 0) {
          ctx.beginPath();
          ctx.moveTo(path[0].x, path[0].y);
          path.forEach(p => ctx.lineTo(p.x, p.y));
          ctx.closePath();
          ctx.stroke();
        }
      });
      
      ctx.restore();
    }
  };

  const runBenchmark = async () => {
    if (!canvas) {
      toast.error('No canvas available');
      return;
    }

    const canvasElement = canvas.getElement();
    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
    const wandSystem = new MagicWandSystem(imageData);

    // Use center point for benchmark
    const centerX = Math.floor(canvasElement.width / 2);
    const centerY = Math.floor(canvasElement.height / 2);

    toast.loading('Running benchmark...');

    try {
      const results = await wandSystem.benchmark(
        { x: centerX, y: centerY },
        { tolerance, colorSpace, connectivity }
      );

      setBenchmarkResults(results);
      toast.success('Benchmark complete!');
    } catch (error) {
      toast.error('Benchmark failed');
      console.error(error);
    }
  };

  useEffect(() => {
    if (!canvas) return;
    
    const canvasElement = canvas.getElement();
    
    if (isActive) {
      canvasElement.addEventListener('click', handleCanvasClick);
      canvasElement.style.cursor = 'crosshair';
    }
    
    return () => {
      canvasElement.removeEventListener('click', handleCanvasClick);
      canvasElement.style.cursor = 'default';
    };
  }, [canvas, isActive, handleCanvasClick]);

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          <span className="font-medium">Magic Wand</span>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={setIsActive}
        />
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="benchmark">
            <FlaskConical className="h-4 w-4 mr-1" />
            Benchmark
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Algorithm</Label>
            <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as AlgorithmType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Auto (Smart)
                  </div>
                </SelectItem>
                <SelectItem value="scanline">Scanline (Fastest)</SelectItem>
                <SelectItem value="ultra-fast">Ultra Fast (Balanced)</SelectItem>
                <SelectItem value="global">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Global (Non-contiguous)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                <SelectItem value="rgb">RGB (Fast)</SelectItem>
                <SelectItem value="hsv">HSV (Perceptual)</SelectItem>
                <SelectItem value="lab">LAB (Accurate)</SelectItem>
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
                <SelectItem value="4">4-way (Cardinal)</SelectItem>
                <SelectItem value="8">8-way (Diagonal)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label>Contiguous</Label>
            <Switch checked={contiguous} onCheckedChange={setContiguous} />
          </div>

          <div className="flex items-center justify-between">
            <Label>Anti-Alias Edges</Label>
            <Switch checked={antiAlias} onCheckedChange={setAntiAlias} />
          </div>

          <div className="space-y-2">
            <Label>Feather: {featherRadius}px</Label>
            <Slider
              value={[featherRadius]}
              onValueChange={(v) => setFeatherRadius(v[0])}
              min={0}
              max={20}
              step={1}
            />
          </div>

          {lastResult && (
            <div className="p-3 rounded-lg bg-muted text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Timer className="h-4 w-4" />
                Last: {lastResult.pixels.toLocaleString()} px in {lastResult.time.toFixed(2)}ms
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="benchmark" className="space-y-4 mt-4">
          <Button onClick={runBenchmark} className="w-full">
            <FlaskConical className="h-4 w-4 mr-2" />
            Run Benchmark
          </Button>

          {benchmarkResults.length > 0 && (
            <div className="space-y-2">
              <Label>Results (center point)</Label>
              <div className="space-y-2">
                {benchmarkResults
                  .sort((a, b) => a.executionTime - b.executionTime)
                  .map((result, i) => (
                    <div
                      key={result.algorithm}
                      className={`p-3 rounded-lg border ${i === 0 ? 'border-primary bg-primary/10' : 'bg-muted'}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium capitalize">{result.algorithm}</span>
                        {i === 0 && <span className="text-xs text-primary">Fastest</span>}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        <span>{result.executionTime.toFixed(2)}ms</span>
                        <span className="mx-2">•</span>
                        <span>{result.pixelCount.toLocaleString()} pixels</span>
                        <span className="mx-2">•</span>
                        <span>{(result.confidence * 100).toFixed(0)}% conf</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface Point {
  x: number;
  y: number;
}
