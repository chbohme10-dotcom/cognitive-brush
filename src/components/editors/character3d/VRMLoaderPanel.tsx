import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  FileBox, 
  User, 
  Smile, 
  Frown, 
  Meh,
  Eye,
  Loader2,
  X,
  RefreshCw,
  Bookmark
} from "lucide-react";
import { LoadedVRM } from "@/hooks/useVRMLoader";
import { ExpressionPresets } from "./ExpressionPresets";

interface VRMLoaderPanelProps {
  isLoading: boolean;
  loadedVRM: LoadedVRM | null;
  onLoadVRM: (file: File) => void;
  onApplyExpression: (name: string, value: number) => void;
  onResetExpressions: () => void;
  onClearVRM: () => void;
}

const expressionIcons: Record<string, React.ReactNode> = {
  happy: <Smile className="w-3 h-3" />,
  sad: <Frown className="w-3 h-3" />,
  neutral: <Meh className="w-3 h-3" />,
  blink: <Eye className="w-3 h-3" />,
};

export const VRMLoaderPanel = ({
  isLoading,
  loadedVRM,
  onLoadVRM,
  onApplyExpression,
  onResetExpressions,
  onClearVRM
}: VRMLoaderPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expressionValues, setExpressionValues] = useState<Record<string, number>>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLoadVRM(file);
    }
    e.target.value = '';
  };

  const handleExpressionChange = (name: string, value: number) => {
    setExpressionValues(prev => ({ ...prev, [name]: value }));
    onApplyExpression(name, value);
  };

  const handleLoadPreset = (values: Record<string, number>) => {
    onResetExpressions();
    setExpressionValues({});
    
    Object.entries(values).forEach(([name, value]) => {
      handleExpressionChange(name, value);
    });
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-3 p-1">
        {/* Upload Section */}
        <div className="p-3 rounded-lg bg-gradient-to-br from-[hsl(200_70%_50%)]/20 to-[hsl(200_70%_30%)]/20 border border-[hsl(200_70%_50%)]/30">
          <div className="flex items-center gap-2 mb-2">
            <FileBox className="w-4 h-4 text-[hsl(200_70%_60%)]" />
            <span className="text-sm font-medium text-[hsl(200_70%_60%)]">VRM Model Loader</span>
          </div>
          <p className="text-xs text-[hsl(var(--cde-text-muted))] mb-3">
            Import .vrm character files to apply morphs and animations
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".vrm"
            className="hidden"
            onChange={handleFileChange}
          />
          
          <Button 
            className="w-full bg-[hsl(200_70%_50%)] hover:bg-[hsl(200_70%_40%)]" 
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            {isLoading ? 'Loading...' : 'Load VRM File'}
          </Button>
        </div>

        {/* Loaded Model Info */}
        {loadedVRM && (
          <>
            <div className="p-3 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[hsl(280_70%_60%)]" />
                  <span className="text-xs font-medium text-[hsl(var(--cde-text-primary))]">
                    Model Loaded
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6"
                  onClick={onClearVRM}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-[hsl(var(--cde-text-muted))]">
                  Blend Shapes: {loadedVRM.blendShapes.length}
                </p>
                <p className="text-[10px] text-[hsl(var(--cde-text-muted))]">
                  Bones: {loadedVRM.bones.length}
                </p>
              </div>
            </div>

            {/* Expression Controls with Tabs */}
            {loadedVRM.blendShapes.length > 0 && (
              <div className="p-3 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))]">
                <Tabs defaultValue="sliders" className="w-full">
                  <TabsList className="w-full h-8 mb-3">
                    <TabsTrigger value="sliders" className="flex-1 text-xs h-7">
                      <Smile className="w-3 h-3 mr-1" /> Expressions
                    </TabsTrigger>
                    <TabsTrigger value="presets" className="flex-1 text-xs h-7">
                      <Bookmark className="w-3 h-3 mr-1" /> Presets
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="sliders" className="mt-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">
                        Active Expressions
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={() => {
                          onResetExpressions();
                          setExpressionValues({});
                        }}
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Reset
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {loadedVRM.blendShapes.slice(0, 12).map((name) => (
                        <div key={name} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              {expressionIcons[name.toLowerCase()] || <Meh className="w-3 h-3" />}
                              <span className="text-xs text-[hsl(var(--cde-text-muted))] capitalize">
                                {name}
                              </span>
                            </div>
                            <span className="text-[10px] text-[hsl(var(--cde-text-secondary))] tabular-nums">
                              {Math.round((expressionValues[name] || 0) * 100)}%
                            </span>
                          </div>
                          <Slider
                            value={[expressionValues[name] || 0]}
                            max={1}
                            step={0.01}
                            onValueChange={([v]) => handleExpressionChange(name, v)}
                          />
                        </div>
                      ))}
                    </div>
                    {loadedVRM.blendShapes.length > 12 && (
                      <p className="text-[10px] text-[hsl(var(--cde-text-muted))] mt-2">
                        +{loadedVRM.blendShapes.length - 12} more expressions available
                      </p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="presets" className="mt-0">
                    <ExpressionPresets
                      currentValues={expressionValues}
                      onLoadPreset={handleLoadPreset}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Bone List Preview */}
            <div className="p-3 rounded-lg bg-[hsl(var(--cde-bg-primary))] border border-[hsl(var(--cde-border-subtle))]">
              <h4 className="text-xs font-medium text-[hsl(var(--cde-text-secondary))] mb-2">
                Detected Bones
              </h4>
              <div className="flex flex-wrap gap-1">
                {loadedVRM.bones.slice(0, 12).map((bone) => (
                  <span 
                    key={bone}
                    className="text-[10px] px-2 py-0.5 rounded bg-[hsl(var(--cde-bg-tertiary))] text-[hsl(var(--cde-text-muted))]"
                  >
                    {bone}
                  </span>
                ))}
                {loadedVRM.bones.length > 12 && (
                  <span className="text-[10px] px-2 py-0.5 text-[hsl(var(--cde-text-muted))]">
                    +{loadedVRM.bones.length - 12} more
                  </span>
                )}
              </div>
            </div>
          </>
        )}

        {/* Supported Formats */}
        {!loadedVRM && (
          <div className="p-3 rounded-lg bg-[hsl(var(--cde-bg-primary))] border border-[hsl(var(--cde-border-subtle))]">
            <h4 className="text-xs font-medium text-[hsl(var(--cde-text-secondary))] mb-2">
              Supported Sources
            </h4>
            <ul className="text-[10px] text-[hsl(var(--cde-text-muted))] space-y-1">
              <li>• VRoid Studio exports (.vrm)</li>
              <li>• Ready Player Me avatars</li>
              <li>• CharacterStudio exports</li>
              <li>• VRChat-compatible models</li>
              <li>• Any VRM 0.x or 1.0 file</li>
            </ul>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};