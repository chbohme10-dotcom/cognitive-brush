import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2, Eraser, ImagePlus } from "lucide-react";
import { AIGenerateDialog } from "./AIGenerateDialog";
import { AIEditDialog } from "./AIEditDialog";

export const AIToolsPanel = () => {
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <>
      <AIGenerateDialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog} />
      <AIEditDialog open={showEditDialog} onOpenChange={setShowEditDialog} />

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
    </>
  );
};
