import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid3x3, Image, User, Car, Mountain, Palette, Shirt, Box, Sparkles, Camera, Layers } from "lucide-react";
import { useAssets, AssetMetadata } from "@/hooks/useAssets";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Canvas as FabricCanvas } from "fabric";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AssetPanelProps {
  isOpen: boolean;
  onClose: () => void;
  fabricCanvas: FabricCanvas | null;
}

const categories = [
  { id: 'all', label: 'All', icon: Grid3x3 },
  { id: 'character', label: 'Characters', icon: User },
  { id: 'portrait', label: 'Portraits', icon: Camera },
  { id: 'landscape', label: 'Landscapes', icon: Mountain },
  { id: 'automotive', label: 'Automotive', icon: Car },
  { id: 'texture', label: 'Textures', icon: Palette },
  { id: 'product', label: 'Products', icon: Box },
  { id: 'props', label: 'Props', icon: Shirt },
  { id: 'effects', label: 'Effects', icon: Sparkles },
  { id: 'layers', label: 'Layers', icon: Layers },
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
      <div className="p-3 border-b border-[hsl(var(--cde-border-subtle))]">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[hsl(var(--cde-text-muted))]" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => searchAssets(e.target.value)}
            className="pl-8 h-8 text-xs bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))] focus:border-[hsl(var(--cde-accent-purple))]"
          />
        </div>
      </div>

      {/* Category Filters - Icon Grid */}
      <div className="p-3 border-b border-[hsl(var(--cde-border-subtle))]">
        <div className="grid grid-cols-5 gap-1">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <Tooltip key={cat.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => filterByCategory(cat.id)}
                    className={`
                      w-full aspect-square rounded-md flex items-center justify-center transition-all duration-200
                      ${isSelected 
                        ? 'bg-[hsl(var(--cde-accent-purple))] text-white shadow-lg shadow-[hsl(var(--cde-accent-purple)/0.3)]' 
                        : 'bg-[hsl(var(--cde-bg-tertiary))] text-[hsl(var(--cde-text-muted))] hover:bg-[hsl(var(--cde-bg-tertiary))/0.8] hover:text-[hsl(var(--cde-text-primary))]'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {cat.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="px-3 py-2 border-b border-[hsl(var(--cde-border-subtle))]">
        <span className="text-[10px] text-[hsl(var(--cde-text-muted))] uppercase tracking-wider">
          {assets.length} {assets.length === 1 ? 'asset' : 'assets'}
        </span>
      </div>

      {/* Asset Grid */}
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-3 gap-1.5 p-2">
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
              className="cursor-grab active:cursor-grabbing group relative"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="aspect-square rounded-md overflow-hidden border border-[hsl(var(--cde-border-subtle))] hover:border-[hsl(var(--cde-accent-purple))] transition-all duration-200 hover:shadow-lg hover:shadow-[hsl(var(--cde-accent-purple)/0.2)]">
                    <img 
                      src={asset.url} 
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      draggable="false"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs max-w-[150px]">
                  <p className="font-medium truncate">{asset.name}</p>
                  <p className="text-[hsl(var(--cde-text-muted))] capitalize">{asset.category}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
          
          {assets.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-[hsl(var(--cde-text-muted))]">
              <Image className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-xs">No assets found</span>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
