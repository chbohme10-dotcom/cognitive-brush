import { AssetMetadata } from "@/hooks/useAssets";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AssetGridProps {
  assets: AssetMetadata[];
  onAssetClick: (asset: AssetMetadata) => void;
}

export const AssetGrid = ({ assets, onAssetClick }: AssetGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
      {assets.map(asset => (
        <Card
          key={asset.id}
          onClick={() => onAssetClick(asset)}
          className="cursor-pointer hover:border-[hsl(var(--cde-accent-purple))] transition-all group overflow-hidden"
        >
          <div className="aspect-square bg-[hsl(var(--cde-bg-tertiary))] relative overflow-hidden">
            <img 
              src={asset.url} 
              alt={asset.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              draggable="true"
            />
            <Badge className="absolute top-2 right-2 text-xs bg-[hsl(var(--cde-accent-purple))]/80">
              {asset.category}
            </Badge>
          </div>
          <div className="p-3 space-y-1">
            <h4 className="text-sm font-medium truncate text-[hsl(var(--cde-text-primary))]">
              {asset.name}
            </h4>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {asset.complexity}
              </Badge>
              {asset.recommendedTool && (
                <span className="text-xs text-[hsl(var(--cde-text-muted))]">
                  {asset.recommendedTool}
                </span>
              )}
            </div>
          </div>
        </Card>
      ))}
      
      {assets.length === 0 && (
        <div className="col-span-full text-center py-12 text-[hsl(var(--cde-text-muted))]">
          No assets found. Upload some to get started!
        </div>
      )}
    </div>
  );
};
