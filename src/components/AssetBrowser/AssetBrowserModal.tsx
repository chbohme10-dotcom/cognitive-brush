import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Grid3x3, Image, User, Car, Mountain, Palette, X } from "lucide-react";
import { AssetGrid } from "./AssetGrid";
import { SpecializedAssetPage } from "./SpecializedAssetPage";
import { useAssets, AssetMetadata } from "@/hooks/useAssets";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AssetBrowserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export const AssetBrowserModal = ({ open, onOpenChange }: AssetBrowserModalProps) => {
  const { assets, searchAssets, filterByCategory, selectedCategory, searchQuery, findSimilar } = useAssets();
  const [openTabs, setOpenTabs] = useState<AssetMetadata[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  const handleAssetClick = (asset: AssetMetadata) => {
    if (!openTabs.find(t => t.id === asset.id)) {
      setOpenTabs([...openTabs, asset]);
    }
    setActiveTabId(asset.id);
  };

  const handleCloseTab = (assetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenTabs(openTabs.filter(t => t.id !== assetId));
    if (activeTabId === assetId) {
      setActiveTabId(openTabs[0]?.id || null);
    }
  };

  const activeAsset = openTabs.find(t => t.id === activeTabId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] p-0 bg-[hsl(var(--cde-bg-primary))]">
        <div className="flex flex-col h-full">
          {/* Top: Search & Tabs */}
          <div className="border-b border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-secondary))]">
            <div className="flex items-center gap-4 p-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--cde-text-muted))]" />
                <Input
                  placeholder="Search assets by name, keywords, or click 'Find Similar' on any asset..."
                  value={searchQuery}
                  onChange={(e) => searchAssets(e.target.value)}
                  className="pl-10 bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))]"
                />
              </div>
            </div>
            
            {/* Asset Tabs */}
            {openTabs.length > 0 && (
              <ScrollArea className="w-full">
                <div className="flex gap-1 px-4 pb-2">
                  {openTabs.map(tab => (
                    <Button
                      key={tab.id}
                      variant={activeTabId === tab.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveTabId(tab.id)}
                      className="gap-2 relative pr-8"
                    >
                      <Image className="w-3 h-3" />
                      <span className="max-w-[120px] truncate">{tab.name}</span>
                      <X
                        className="w-3 h-3 absolute right-2 hover:text-[hsl(var(--cde-accent-error))]"
                        onClick={(e) => handleCloseTab(tab.id, e)}
                      />
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Left: Category Filters */}
            <div className="w-20 border-r border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-secondary))] flex flex-col gap-2 p-2">
              {categories.map(cat => {
                const Icon = cat.icon;
                return (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "ghost"}
                    size="icon"
                    onClick={() => filterByCategory(cat.id)}
                    title={cat.label}
                    className="w-full h-14 flex flex-col gap-1 text-xs"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px]">{cat.label.slice(0, 4)}</span>
                  </Button>
                );
              })}
            </div>

            {/* Main Area: Grid or Specialized Page */}
            <div className="flex-1 overflow-auto">
              {activeAsset ? (
                <SpecializedAssetPage 
                  asset={activeAsset} 
                  onFindSimilar={() => findSimilar(activeAsset.id)}
                />
              ) : (
                <AssetGrid assets={assets} onAssetClick={handleAssetClick} />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
