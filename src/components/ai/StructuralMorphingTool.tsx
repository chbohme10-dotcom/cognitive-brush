import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Move, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { useImageGeneration } from "@/hooks/useImageGeneration";

interface Line {
  start: { x: number; y: number };
  end: { x: number; y: number };
}

export const StructuralMorphingTool = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [sourceLine, setSourceLine] = useState<Line | null>(null);
  const [targetLine, setTargetLine] = useState<Line | null>(null);
  const [contextPrompt, setContextPrompt] = useState("");
  const { isGenerating, editImage, generatedImage } = useImageGeneration();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setStep(1);
    }
  };

  const handleMorph = async () => {
    if (!imageUrl || !sourceLine || !targetLine || !contextPrompt) {
      toast.error("Complete all steps before morphing");
      return;
    }

    // Multi-modal prompt with red/green line overlays
    const morphPrompt = `Structurally morph this object. Move the part indicated by the RED line (from [${sourceLine.start.x},${sourceLine.start.y}] to [${sourceLine.end.x},${sourceLine.end.y}]) to the position indicated by the GREEN line (from [${targetLine.start.x},${targetLine.start.y}] to [${targetLine.end.x},${targetLine.end.y}]). Context: ${contextPrompt}. Maintain natural appearance and proportions.`;

    const result = await editImage(imageUrl, morphPrompt, 'morph');
    
    if (result) {
      toast.success("Structural morphing complete!");
      // Reset for next use
      setStep(1);
      setSourceLine(null);
      setTargetLine(null);
    }
  };

  const nextStep = () => {
    if (step === 1 && !sourceLine) {
      toast.info("Draw source line first");
      return;
    }
    if (step === 2 && !targetLine) {
      toast.info("Draw target line first");
      return;
    }
    setStep((step + 1) as 1 | 2 | 3);
  };

  const resetStep = () => {
    if (step === 2) {
      setSourceLine(null);
      setStep(1);
    } else if (step === 3) {
      setTargetLine(null);
      setStep(2);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
          Step {step} of 3
        </Label>
        <div className="p-3 bg-[hsl(var(--cde-bg-tertiary))] rounded-lg">
          {step === 1 && (
            <p className="text-sm text-[hsl(var(--cde-text-secondary))]">
              Draw a <span className="text-[hsl(var(--cde-accent-red))] font-semibold">RED line</span> along the object part you want to move
            </p>
          )}
          {step === 2 && (
            <p className="text-sm text-[hsl(var(--cde-text-secondary))]">
              Draw a <span className="text-[hsl(var(--cde-accent-green))] font-semibold">GREEN line</span> to indicate the new target position
            </p>
          )}
          {step === 3 && (
            <p className="text-sm text-[hsl(var(--cde-text-secondary))]">
              Provide context prompt and generate
            </p>
          )}
        </div>
      </div>

      {!imageUrl ? (
        <div className="border-2 border-dashed border-[hsl(var(--cde-border-subtle))] rounded-lg p-8 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="morph-upload"
          />
          <label htmlFor="morph-upload" className="cursor-pointer">
            <Move className="w-12 h-12 mx-auto mb-2 text-[hsl(var(--cde-text-muted))]" />
            <p className="text-sm text-[hsl(var(--cde-text-muted))]">
              Click to upload image to morph
            </p>
          </label>
        </div>
      ) : (
        <>
          <div className="relative border-2 border-[hsl(var(--cde-border-subtle))] rounded-lg overflow-hidden">
            <img src={imageUrl} alt="Source" className="w-full h-auto" />
            {/* Overlay for line drawing - in production this would be a canvas */}
            <div className="absolute inset-0 pointer-events-none">
              {sourceLine && (
                <div className="absolute top-1/3 left-1/4 w-1/2 h-1 bg-[hsl(var(--cde-accent-red))]" />
              )}
              {targetLine && (
                <div className="absolute top-2/3 left-1/4 w-1/2 h-1 bg-[hsl(var(--cde-accent-green))]" />
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {step < 3 && (
              <Button
                onClick={() => {
                  // Simulate line drawing
                  if (step === 1) {
                    setSourceLine({ start: { x: 100, y: 100 }, end: { x: 300, y: 100 } });
                    toast.success("Source line drawn (RED)");
                  } else {
                    setTargetLine({ start: { x: 100, y: 200 }, end: { x: 300, y: 200 } });
                    toast.success("Target line drawn (GREEN)");
                  }
                }}
                className="flex-1"
                variant="outline"
              >
                <Move className="w-4 h-4 mr-2" />
                Simulate Draw Line
              </Button>
            )}
            {step > 1 && (
              <Button onClick={resetStep} variant="outline">
                <Undo2 className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            {step < 3 && (
              <Button onClick={nextStep} className="flex-1 cde-gradient-primary">
                Next Step
              </Button>
            )}
          </div>

          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label className="text-sm text-[hsl(var(--cde-text-secondary))]">
                  Context Prompt
                </Label>
                <Textarea
                  value={contextPrompt}
                  onChange={(e) => setContextPrompt(e.target.value)}
                  placeholder="Describe the object and desired morphing behavior..."
                  className="min-h-[80px]"
                />
              </div>

              <Button
                onClick={handleMorph}
                disabled={isGenerating}
                className="w-full cde-gradient-primary"
              >
                {isGenerating ? 'Morphing...' : 'Apply Structural Morph'}
              </Button>
            </>
          )}
        </>
      )}

      {generatedImage && (
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
            Morphed Result
          </Label>
          <img src={generatedImage} alt="Morphed" className="w-full rounded-lg border border-[hsl(var(--cde-border-subtle))]" />
        </div>
      )}
    </div>
  );
};
