import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2, Eraser, ImagePlus, Layers, Maximize2, Move, Star } from "lucide-react";
import { AIGenerateDialog } from "./AIGenerateDialog";
import { AIEditDialog } from "./AIEditDialog";
import { ICECanvas } from "./ICECanvas";
import { OutpaintingTool } from "./OutpaintingTool";
import { StructuralMorphingTool } from "./StructuralMorphingTool";
import { AIPresetLibrary } from "./AIPresetLibrary";
import { useImageGeneration } from "@/hooks/useImageGeneration";

export const AIToolsPanel = () => {
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { isGenerating, generateImage } = useImageGeneration();

  const handleICEGenerate = async (composedPrompt: any) => {
    // This would send the composed prompt to the generate-image function
    await generateImage(JSON.stringify(composedPrompt), 1024, 1024);
  };

  return (
    <>
      <AIGenerateDialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog} />
      <AIEditDialog open={showEditDialog} onOpenChange={setShowEditDialog} />

      <Tabs defaultValue="quick" className="h-full flex flex-col">
        <TabsList className="w-full grid grid-cols-5 bg-[hsl(var(--cde-bg-tertiary))] p-1 gap-1">
          <TabsTrigger value="quick">Quick</TabsTrigger>
          <TabsTrigger value="ice">ICE</TabsTrigger>
          <TabsTrigger value="outpaint">Outpaint</TabsTrigger>
          <TabsTrigger value="morph">Morph</TabsTrigger>
          <TabsTrigger value="presets">Presets</TabsTrigger>
        </TabsList>

        <TabsContent value="quick" className="flex-1 overflow-auto">
          <div className="p-4 space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[hsl(var(--cde-accent-purple))]" />
            AI Generation
          </h3>
          
          <Button
            onClick={() => setShowGenerateDialog(true)}
            className="w-full justify-start cde-gradient-primary"
          >
            <ImagePlus className="w-4 h-4 mr-2" />
            Generate New Image
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))] flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-[hsl(var(--cde-accent-purple))]" />
            AI Editing
          </h3>
          
          <Button
            onClick={() => setShowEditDialog(true)}
            className="w-full justify-start bg-[hsl(var(--cde-bg-tertiary))] hover:bg-[hsl(var(--cde-bg-tertiary))]/80"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Edit & Transform
          </Button>

          <Button
            className="w-full justify-start bg-[hsl(var(--cde-bg-tertiary))] hover:bg-[hsl(var(--cde-bg-tertiary))]/80"
            disabled
          >
            <Eraser className="w-4 h-4 mr-2" />
            Inpaint / Remove Objects
          </Button>
        </div>

            <div className="pt-4 border-t border-[hsl(var(--cde-border-subtle))]">
              <p className="text-xs text-[hsl(var(--cde-text-muted))]">
                Powered by Nano Banana (Gemini 2.5 Flash Image Preview)
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ice" className="flex-1 overflow-hidden">
          <ICECanvas onGenerate={handleICEGenerate} isGenerating={isGenerating} />
        </TabsContent>

        <TabsContent value="outpaint" className="flex-1 overflow-auto">
          <OutpaintingTool />
        </TabsContent>

        <TabsContent value="morph" className="flex-1 overflow-auto">
          <StructuralMorphingTool />
        </TabsContent>

        <TabsContent value="presets" className="flex-1 overflow-hidden">
          <AIPresetLibrary />
        </TabsContent>
      </Tabs>
    </>
  );
};
