import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Wand2, Upload } from "lucide-react";
import { useImageGeneration } from "@/hooks/useImageGeneration";

interface AIEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AIEditDialog = ({ open, onOpenChange }: AIEditDialogProps) => {
  const [prompt, setPrompt] = useState("");
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const { isGenerating, generatedImage, editImage } = useImageGeneration();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSourceImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = async () => {
    if (!sourceImage || !prompt.trim()) return;
    await editImage(sourceImage, prompt);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-[hsl(var(--cde-bg-secondary))] border-[hsl(var(--cde-border-emphasis))]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[hsl(var(--cde-text-primary))]">
            <Wand2 className="w-5 h-5 text-[hsl(var(--cde-accent-purple))]" />
            AI Image Editing & Inpainting
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-[hsl(var(--cde-text-primary))]">Source Image</Label>
            <div className="mt-2 flex gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))] rounded-lg text-[hsl(var(--cde-text-primary))] hover:bg-[hsl(var(--cde-bg-tertiary))]/80 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload Image
              </label>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <Label className="text-[hsl(var(--cde-text-primary))] mb-2">Original</Label>
              <div className="aspect-square rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border-2 border-[hsl(var(--cde-border-subtle))] flex items-center justify-center overflow-hidden">
                {sourceImage ? (
                  <img src={sourceImage} alt="Source" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-[hsl(var(--cde-text-muted))]">
                    <Upload className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Upload an image</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <Label className="text-[hsl(var(--cde-text-primary))] mb-2">Instructions</Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to change: 'make it rainy', 'change to sunset', 'add snow', 'remove the person', etc."
                className="flex-1 bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))] text-[hsl(var(--cde-text-primary))]"
              />
              <Button
                onClick={handleEdit}
                disabled={!sourceImage || !prompt.trim() || isGenerating}
                className="mt-2 cde-gradient-primary"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Apply Edit
                  </>
                )}
              </Button>
            </div>

            <div className="flex flex-col">
              <Label className="text-[hsl(var(--cde-text-primary))] mb-2">Result</Label>
              <div className="aspect-square rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border-2 border-[hsl(var(--cde-border-subtle))] flex items-center justify-center overflow-hidden">
                {generatedImage ? (
                  <img src={generatedImage} alt="Edited" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-[hsl(var(--cde-text-muted))]">
                    <Wand2 className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Edited image appears here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
