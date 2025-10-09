import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Download } from "lucide-react";
import { useImageGeneration } from "@/hooks/useImageGeneration";

interface AIGenerateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const aspectRatios = [
  { label: "Square (1:1)", width: 1024, height: 1024 },
  { label: "Portrait (9:16)", width: 768, height: 1365 },
  { label: "Landscape (16:9)", width: 1365, height: 768 },
  { label: "Widescreen (21:9)", width: 1536, height: 655 }
];

export const AIGenerateDialog = ({ open, onOpenChange }: AIGenerateDialogProps) => {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState(0);
  const { isGenerating, generatedImage, generateImage } = useImageGeneration();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    const ratio = aspectRatios[aspectRatio];
    await generateImage(prompt, ratio.width, ratio.height);
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'ai-generated-image.png';
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-[hsl(var(--cde-bg-secondary))] border-[hsl(var(--cde-border-emphasis))]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[hsl(var(--cde-text-primary))]">
            <Sparkles className="w-5 h-5 text-[hsl(var(--cde-accent-purple))]" />
            AI Image Generation
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt" className="text-[hsl(var(--cde-text-primary))]">
                Describe your image
              </Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A serene mountain landscape at sunset with pine trees..."
                className="min-h-[120px] mt-2 bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))] text-[hsl(var(--cde-text-primary))]"
              />
            </div>

            <div>
              <Label htmlFor="aspect" className="text-[hsl(var(--cde-text-primary))]">
                Aspect Ratio
              </Label>
              <Select value={aspectRatio.toString()} onValueChange={(v) => setAspectRatio(parseInt(v))}>
                <SelectTrigger className="mt-2 bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))] text-[hsl(var(--cde-text-primary))]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {aspectRatios.map((ratio, idx) => (
                    <SelectItem key={idx} value={idx.toString()}>
                      {ratio.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full cde-gradient-primary"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Image
                </>
              )}
            </Button>
          </div>

          <div className="flex flex-col">
            <Label className="text-[hsl(var(--cde-text-primary))] mb-2">Preview</Label>
            <div className="flex-1 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border-2 border-[hsl(var(--cde-border-subtle))] flex items-center justify-center overflow-hidden">
              {generatedImage ? (
                <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center text-[hsl(var(--cde-text-muted))]">
                  <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>Your generated image will appear here</p>
                </div>
              )}
            </div>
            {generatedImage && (
              <Button
                onClick={downloadImage}
                variant="outline"
                className="mt-4"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Image
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
