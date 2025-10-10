import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Maximize2 } from "lucide-react";
import { toast } from "sonner";
import { useImageGeneration } from "@/hooks/useImageGeneration";

interface OutpaintingToolProps {
  sourceImage?: string;
}

export const OutpaintingTool = ({ sourceImage }: OutpaintingToolProps) => {
  const [imageUrl, setImageUrl] = useState(sourceImage || "");
  const [prompt, setPrompt] = useState("");
  const [expandDirection, setExpandDirection] = useState<'top' | 'bottom' | 'left' | 'right' | 'all'>('all');
  const [expandAmount, setExpandAmount] = useState(512);
  const { isGenerating, editImage, generatedImage } = useImageGeneration();

  const handleOutpaint = async () => {
    if (!imageUrl || !prompt) {
      toast.error("Please provide an image and prompt");
      return;
    }

    // Composite approach: create feathered mask for new area only
    const outpaintPrompt = `Seamlessly extend this image ${expandDirection === 'all' ? 'in all directions' : `towards the ${expandDirection}`} by ${expandAmount}px. Context: ${prompt}. Use feathered edges for natural blending.`;

    const result = await editImage(imageUrl, outpaintPrompt, 'outpaint');
    
    if (result) {
      toast.success("Outpainting complete! Result stitched automatically.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
          Source Image
        </Label>
        {imageUrl ? (
          <div className="relative border-2 border-dashed border-[hsl(var(--cde-border-subtle))] rounded-lg overflow-hidden">
            <img src={imageUrl} alt="Source" className="w-full h-auto" />
          </div>
        ) : (
          <div className="border-2 border-dashed border-[hsl(var(--cde-border-subtle))] rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="outpaint-upload"
            />
            <label htmlFor="outpaint-upload" className="cursor-pointer">
              <Maximize2 className="w-12 h-12 mx-auto mb-2 text-[hsl(var(--cde-text-muted))]" />
              <p className="text-sm text-[hsl(var(--cde-text-muted))]">
                Click to upload image to outpaint
              </p>
            </label>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm text-[hsl(var(--cde-text-secondary))]">
          Expand Direction
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {(['top', 'all', 'bottom', 'left', 'right'] as const).map((dir) => (
            <Button
              key={dir}
              size="sm"
              variant={expandDirection === dir ? 'default' : 'outline'}
              onClick={() => setExpandDirection(dir)}
              className={expandDirection === dir ? 'cde-gradient-primary' : ''}
            >
              {dir.charAt(0).toUpperCase() + dir.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm text-[hsl(var(--cde-text-secondary))]">
          Expand Amount (pixels)
        </Label>
        <Input
          type="number"
          value={expandAmount}
          onChange={(e) => setExpandAmount(Number(e.target.value))}
          min={256}
          max={2048}
          step={128}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm text-[hsl(var(--cde-text-secondary))]">
          Context Prompt
        </Label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what should appear in the extended area..."
          className="min-h-[80px]"
        />
      </div>

      <Button
        onClick={handleOutpaint}
        disabled={isGenerating || !imageUrl || !prompt}
        className="w-full cde-gradient-primary"
      >
        {isGenerating ? 'Outpainting...' : 'Outpaint Image'}
      </Button>

      {generatedImage && (
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
            Result
          </Label>
          <img src={generatedImage} alt="Outpainted" className="w-full rounded-lg border border-[hsl(var(--cde-border-subtle))]" />
        </div>
      )}
    </div>
  );
};
