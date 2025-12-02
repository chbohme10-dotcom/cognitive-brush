import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  Film, Sparkles, Play, Pause, CheckCircle2, 
  Circle, Clock, AlertCircle, ChevronRight 
} from "lucide-react";
import { tunnelInfiltrationStoryboard } from "@/data/tunnelStoryboard";

interface GenerationStatus {
  panelId: number;
  status: "pending" | "generating" | "complete" | "error";
  progress: number;
}

interface BatchStoryboardGeneratorProps {
  onGenerateAll?: (panels: typeof tunnelInfiltrationStoryboard) => void;
  onExportToTimeline?: (panels: typeof tunnelInfiltrationStoryboard) => void;
}

export const BatchStoryboardGenerator = ({ 
  onGenerateAll, 
  onExportToTimeline 
}: BatchStoryboardGeneratorProps) => {
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus[]>(
    tunnelInfiltrationStoryboard.map(p => ({ panelId: p.id, status: "pending", progress: 0 }))
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPanel, setCurrentPanel] = useState<number | null>(null);
  const [selectedPanels, setSelectedPanels] = useState<number[]>(
    tunnelInfiltrationStoryboard.map(p => p.id)
  );

  const togglePanel = (id: number) => {
    setSelectedPanels(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedPanels(tunnelInfiltrationStoryboard.map(p => p.id));
  const selectNone = () => setSelectedPanels([]);

  const completedCount = generationStatus.filter(s => s.status === "complete").length;
  const overallProgress = (completedCount / tunnelInfiltrationStoryboard.length) * 100;

  const simulateGeneration = async () => {
    setIsGenerating(true);
    
    for (const panelId of selectedPanels) {
      setCurrentPanel(panelId);
      
      // Update to generating
      setGenerationStatus(prev => 
        prev.map(s => s.panelId === panelId ? { ...s, status: "generating", progress: 0 } : s)
      );
      
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(r => setTimeout(r, 100));
        setGenerationStatus(prev => 
          prev.map(s => s.panelId === panelId ? { ...s, progress: i } : s)
        );
      }
      
      // Complete
      setGenerationStatus(prev => 
        prev.map(s => s.panelId === panelId ? { ...s, status: "complete", progress: 100 } : s)
      );
    }
    
    setIsGenerating(false);
    setCurrentPanel(null);
    onGenerateAll?.(tunnelInfiltrationStoryboard.filter(p => selectedPanels.includes(p.id)));
  };

  const getStatusIcon = (status: GenerationStatus["status"]) => {
    switch (status) {
      case "complete": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "generating": return <Sparkles className="w-4 h-4 text-[hsl(142_71%_45%)] animate-spin" />;
      case "error": return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Circle className="w-4 h-4 text-[hsl(var(--cde-text-muted))]" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 rounded-lg bg-gradient-to-br from-[hsl(142_71%_45%/0.15)] to-transparent border border-[hsl(142_71%_45%/0.3)]">
        <Film className="w-6 h-6 text-[hsl(142_71%_45%)] mb-2" />
        <h4 className="font-semibold text-[hsl(var(--cde-text-primary))]">Batch Storyboard Generator</h4>
        <p className="text-xs text-[hsl(var(--cde-text-muted))]">
          Generate all tunnel infiltration frames automatically
        </p>
      </div>

      {/* Overall Progress */}
      <div className="p-3 rounded-lg bg-[hsl(var(--cde-bg-tertiary))]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium">Overall Progress</span>
        <span className="text-xs text-[hsl(var(--cde-text-muted))]">
            {completedCount} / {tunnelInfiltrationStoryboard.length} frames
          </span>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>

      {/* Selection Controls */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={selectAll} className="flex-1 text-xs">
          Select All
        </Button>
        <Button variant="outline" size="sm" onClick={selectNone} className="flex-1 text-xs">
          Clear
        </Button>
      </div>

      {/* Panel List */}
      <ScrollArea className="h-64">
        <div className="space-y-2">
          {tunnelInfiltrationStoryboard.map((panel) => {
            const status = generationStatus.find(s => s.panelId === panel.id);
            const isSelected = selectedPanels.includes(panel.id);
            
            return (
              <div
                key={panel.id}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[hsl(142_71%_45%/0.1)] border-[hsl(142_71%_45%/0.3)]"
                    : "bg-[hsl(var(--cde-bg-tertiary))] border-transparent"
                } ${currentPanel === panel.id ? "ring-2 ring-[hsl(142_71%_45%)]" : ""}`}
                onClick={() => togglePanel(panel.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getStatusIcon(status?.status || "pending")}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-[hsl(142_71%_45%)]">
                        {String(panel.id).padStart(2, '0')}
                      </span>
                      <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-[hsl(var(--cde-bg-primary))]">
                        {panel.shotType}
                      </span>
                      <span className="text-xs text-[hsl(var(--cde-text-muted))] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {panel.duration}
                      </span>
                    </div>
                    
                    <p className="text-xs text-[hsl(var(--cde-text-secondary))] line-clamp-2">
                      {panel.description}
                    </p>
                    
                    {status?.status === "generating" && (
                      <Progress value={status.progress} className="h-1 mt-2" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Current Generation Info */}
      {currentPanel && (
        <div className="p-3 rounded-lg bg-[hsl(142_71%_45%/0.1)] border border-[hsl(142_71%_45%/0.3)]">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[hsl(142_71%_45%)] animate-pulse" />
            <span className="text-xs font-medium">Generating Panel {currentPanel}</span>
          </div>
          <p className="text-[10px] text-[hsl(var(--cde-text-muted))] font-mono line-clamp-3">
            {tunnelInfiltrationStoryboard.find(p => p.id === currentPanel)?.aiPrompt}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button 
          className="w-full bg-[hsl(142_71%_45%)] hover:bg-[hsl(142_71%_35%)] text-black"
          onClick={simulateGeneration}
          disabled={selectedPanels.length === 0 || isGenerating}
        >
          {isGenerating ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Generating... ({completedCount}/{selectedPanels.length})
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Generate {selectedPanels.length} Frames
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onExportToTimeline?.(tunnelInfiltrationStoryboard.filter(p => selectedPanels.includes(p.id)))}
          disabled={completedCount === 0}
        >
          <ChevronRight className="w-4 h-4 mr-2" />
          Export to Video Timeline
        </Button>
      </div>
    </div>
  );
};
