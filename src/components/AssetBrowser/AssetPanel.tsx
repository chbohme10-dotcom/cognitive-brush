import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid3x3, Image, User, Car, Mountain, Palette, X, ChevronLeft } from "lucide-react";
import { AssetGrid } from "./AssetGrid";
import { useAssets, AssetMetadata } from "@/hooks/useAssets";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Canvas as FabricCanvas } from "fabric";

interface AssetPanelProps {
  isOpen: boolean;
  onClose: () => void;
  fabricCanvas: FabricCanvas | null;
}

const categories = [
  { id: 'all', label: 'All', icon: Grid3x3 },
  { id: 'character', label: 'Characters', icon: User },
  { id: 'portrait', label: 'Portraits', icon: User },
  { id: 'landscape', label: 'Landscapes', icon: Mountain },
  { id: 'automotive', label: 'Automotive', icon: Car },
  { id: 'texture', label: 'Textures', icon: Palette },
  { id: 'product', label: 'Products', icon: Image },
];

export const AssetPanel = ({ isOpen, onClose, fabricCanvas }: AssetPanelProps) => {
  const { assets, searchAssets, filterByCategory, selectedCategory, searchQuery } = useAssets();
  const [draggedAsset, setDraggedAsset] = useState<AssetMetadata | null>(null);

  if (!isOpen) return null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-[hsl(var(--cde-border-subtle))] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">Assets</h3>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-[hsl(var(--cde-border-subtle))]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--cde-text-muted))]" />
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => searchAssets(e.target.value)}
            className="pl-10 bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))]"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="p-4 border-b border-[hsl(var(--cde-border-subtle))]">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => filterByCategory(cat.id)}
                className="gap-2"
              >
                <Icon className="w-3 h-3" />
                {cat.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Asset Grid */}
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-2 gap-2 p-3">
          {assets.map(asset => (
            <div
              key={asset.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/json', JSON.stringify(asset));
                e.dataTransfer.effectAllowed = 'copy';
                setDraggedAsset(asset);
              }}
              onDragEnd={() => setDraggedAsset(null)}
              className="cursor-grab active:cursor-grabbing hover:border-[hsl(var(--cde-accent-purple))] transition-all group overflow-hidden rounded-lg border border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-tertiary))]"
            >
              <div className="aspect-square bg-[hsl(var(--cde-bg-tertiary))] relative overflow-hidden">
                <img 
                  src={asset.url} 
                  alt={asset.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  draggable="false"
                />
              </div>
              <div className="p-2">
                <h4 className="text-xs font-medium truncate text-[hsl(var(--cde-text-primary))]">
                  {asset.name}
                </h4>
              </div>
            </div>
          ))}
          
          {assets.length === 0 && (
            <div className="col-span-full text-center py-12 text-[hsl(var(--cde-text-muted))]">
              No assets found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
