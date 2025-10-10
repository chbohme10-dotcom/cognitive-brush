import { useState } from "react";
import { AssetMetadata } from "@/hooks/useAssets";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Download, Layers } from "lucide-react";

interface SpecializedAssetPageProps {
  asset: AssetMetadata;
  onFindSimilar: () => void;
}

export const SpecializedAssetPage = ({ asset, onFindSimilar }: SpecializedAssetPageProps) => {
  const [selectedPreview, setSelectedPreview] = useState<string>(asset.url);

  const renderContextualPreviews = () => {
    if (!asset.contextual_previews) return null;

    return Object.entries(asset.contextual_previews).map(([section, previews]) => {
      if (typeof previews === 'string') {
        return (
          <div key={section} className="space-y-2">
            <h4 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))] capitalize">
              {section.replace(/_/g, ' ')}
            </h4>
            <div
              className="w-24 h-24 rounded-lg overflow-hidden cursor-pointer border-2 border-[hsl(var(--cde-border-subtle))] hover:border-[hsl(var(--cde-accent-purple))] transition-colors"
              onClick={() => setSelectedPreview(previews)}
            >
              <img src={previews} alt={section} className="w-full h-full object-cover" />
            </div>
          </div>
        );
      }

      return (
        <div key={section} className="space-y-2">
          <h4 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))] capitalize">
            {section.replace(/_/g, ' ')}
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(previews).map(([variant, url]) => (
              <div
                key={variant}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer border-2 border-[hsl(var(--cde-border-subtle))] hover:border-[hsl(var(--cde-accent-purple))] transition-colors"
                onClick={() => setSelectedPreview(url as string)}
              >
                <img src={url as string} alt={variant} className="w-full h-full object-cover" />
                <p className="text-xs text-center mt-1 text-[hsl(var(--cde-text-muted))]">
                  {variant}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[hsl(var(--cde-text-primary))]">
            {asset.name}
          </h2>
          <div className="flex items-center gap-2">
            <Badge className="bg-[hsl(var(--cde-accent-purple))]">{asset.category}</Badge>
            <Badge variant="outline">{asset.complexity} complexity</Badge>
            {asset.recommendedTool && (
              <Badge variant="secondary">Recommended: {asset.recommendedTool}</Badge>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onFindSimilar}>
            <Sparkles className="w-4 h-4 mr-2" />
            Find Similar
          </Button>
          <Button variant="default" size="sm">
            <Layers className="w-4 h-4 mr-2" />
            Add to Canvas
          </Button>
        </div>
      </div>

      {/* Main Preview */}
      <div className="rounded-lg overflow-hidden border border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-tertiary))]">
        <img 
          src={selectedPreview} 
          alt={asset.name}
          className="w-full max-h-[60vh] object-contain"
        />
      </div>

      {/* Description */}
      {asset.description && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">Description</h3>
          <p className="text-sm text-[hsl(var(--cde-text-secondary))]">{asset.description}</p>
        </div>
      )}

      {/* Keywords */}
      {asset.imageHint.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {asset.imageHint.map(hint => (
              <Badge key={hint} variant="outline" className="text-xs">
                {hint}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Contextual Previews */}
      {asset.contextual_previews && (
        <div className="space-y-4 pt-6 border-t border-[hsl(var(--cde-border-subtle))]">
          <h3 className="text-lg font-semibold text-[hsl(var(--cde-text-primary))]">Variants & Views</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderContextualPreviews()}
          </div>
        </div>
      )}
    </div>
  );
};
