import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, Loader2, Wand2, Eraser, Image as ImageIcon, Download, X } from "lucide-react";
import { useImageGeneration } from "@/hooks/useImageGeneration";

interface AIEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AIEditDialog = ({ open, onOpenChange }: AIEditDialogProps) => {
  const [mode, setMode] = useState<"edit" | "inpaint">("edit");
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [strength, setStrength] = useState([80]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize] = useState(20);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isGenerating, generatedImage, editImage } = useImageGeneration();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      setSourceImage(url);
      
      if (mode === "inpaint") {
        setTimeout(() => initializeCanvas(url), 100);
      }
    };
    reader.readAsDataURL(file);
  };

  const initializeCanvas = (imageUrl: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const maxWidth = 600;
      const scale = maxWidth / img.width;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = imageUrl;
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== "inpaint") return;
    setIsDrawing(true);
    draw(e);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || mode !== "inpaint") return;
    draw(e);
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const clearMask = () => {
    if (sourceImage) {
      initializeCanvas(sourceImage);
    }
  };

  const getMaskDataUrl = (): string => {
    const canvas = canvasRef.current;
    if (!canvas) return "";
    return canvas.toDataURL();
  };

  const handleEdit = async () => {
    if (!sourceImage || !prompt.trim()) return;
    
    const maskUrl = mode === "inpaint" ? getMaskDataUrl() : undefined;
    await editImage(sourceImage, prompt, maskUrl);
  };

  const downloadResult = () => {
    if (!generatedImage) return;
    
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `ai-edited-${Date.now()}.png`;
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col bg-[hsl(var(--cde-bg-secondary))] border-[hsl(var(--cde-border-emphasis))]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[hsl(var(--cde-text-primary))]">
            <Wand2 className="w-5 h-5 text-[hsl(var(--cde-accent-purple))]" />
            AI Image Editing & Inpainting
          </DialogTitle>
          <DialogDescription className="text-[hsl(var(--cde-text-secondary))]">
            Edit images with AI or paint over specific areas to modify them
          </DialogDescription>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(v) => setMode(v as "edit" | "inpaint")} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-[hsl(var(--cde-bg-tertiary))]">
            <TabsTrigger value="edit" className="gap-2 data-[state=active]:bg-[hsl(var(--cde-accent-purple))] data-[state=active]:text-white">
              <ImageIcon className="w-4 h-4" />
              Full Image Edit
            </TabsTrigger>
            <TabsTrigger value="inpaint" className="gap-2 data-[state=active]:bg-[hsl(var(--cde-accent-purple))] data-[state=active]:text-white">
              <Eraser className="w-4 h-4" />
              Inpaint (Paint to Edit)
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto space-y-4">
            {/* Image Upload Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">Source Image</Label>
                {sourceImage && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSourceImage(null)}
                    className="h-7"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                <input
                  id="edit-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="edit-image-input"
                  className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))] rounded-lg text-[hsl(var(--cde-text-primary))] hover:bg-[hsl(var(--cde-bg-tertiary))]/80 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  {sourceImage ? "Change Image" : "Upload Image"}
                </label>
              </div>
            </div>

            {/* Image Preview / Canvas Area */}
            {sourceImage && (
              <div className="border-2 border-[hsl(var(--cde-border-subtle))] rounded-lg overflow-hidden bg-[hsl(var(--cde-bg-tertiary))]">
                <TabsContent value="edit" className="m-0 p-4">
                  <img 
                    src={sourceImage} 
                    alt="Preview" 
                    className="max-w-full max-h-96 mx-auto rounded"
                  />
                </TabsContent>

                <TabsContent value="inpaint" className="m-0 p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[hsl(var(--cde-text-secondary))]">
                        Paint over areas you want to modify (red = edit area)
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearMask}
                        className="h-7"
                      >
                        <Eraser className="w-3 h-3 mr-1" />
                        Clear Mask
                      </Button>
                    </div>
                    <canvas
                      ref={canvasRef}
                      onMouseDown={handleCanvasMouseDown}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseUp={handleCanvasMouseUp}
                      onMouseLeave={handleCanvasMouseUp}
                      className="max-w-full border border-[hsl(var(--cde-border-subtle))] rounded cursor-crosshair mx-auto bg-black"
                    />
                  </div>
                </TabsContent>
              </div>
            )}

            <Separator className="bg-[hsl(var(--cde-border-subtle))]" />

            {/* Prompt Section */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
                  {mode === "edit" ? "Editing Instructions" : "What to paint in the masked area"}
                </Label>
                <Textarea
                  placeholder={
                    mode === "edit"
                      ? "Describe how you want to edit the image... (e.g., 'Change the sky to sunset', 'Make it look like a painting')"
                      : "Describe what should appear in the painted area... (e.g., 'A bright blue sky with fluffy clouds', 'A modern building')"
                  }
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[80px] resize-none bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))] text-[hsl(var(--cde-text-primary))]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-[hsl(var(--cde-text-primary))]">Negative Prompt (Optional)</Label>
                <Textarea
                  placeholder="What to avoid... (e.g., 'blurry, low quality, artifacts')"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  className="min-h-[60px] resize-none bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))] text-[hsl(var(--cde-text-primary))]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-[hsl(var(--cde-text-primary))]">Edit Strength</Label>
                  <Badge variant="outline" className="font-mono bg-[hsl(var(--cde-accent-purple))]/10 border-[hsl(var(--cde-accent-purple))] text-[hsl(var(--cde-accent-purple))]">
                    {strength[0]}%
                  </Badge>
                </div>
                <Slider
                  value={strength}
                  onValueChange={setStrength}
                  min={10}
                  max={100}
                  step={5}
                />
                <div className="flex justify-between text-xs text-[hsl(var(--cde-text-muted))]">
                  <span>Subtle</span>
                  <span>Strong</span>
                </div>
              </div>
            </div>

            {/* Generated Result */}
            {generatedImage && (
              <>
                <Separator className="bg-[hsl(var(--cde-border-subtle))]" />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">Result</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadResult}
                      className="h-7"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                  <div className="border-2 border-[hsl(var(--cde-accent-purple))] rounded-lg p-4 bg-[hsl(var(--cde-bg-tertiary))]">
                    <img 
                      src={generatedImage} 
                      alt="Generated" 
                      className="max-w-full max-h-96 mx-auto rounded"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-[hsl(var(--cde-border-subtle))]">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button 
              onClick={handleEdit}
              disabled={isGenerating || !prompt.trim() || !sourceImage}
              className="gap-2 cde-gradient-primary"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  {mode === "edit" ? "Apply Edit" : "Inpaint Area"}
                </>
              )}
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
