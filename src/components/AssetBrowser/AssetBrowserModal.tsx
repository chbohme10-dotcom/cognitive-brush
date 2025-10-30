import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetGrid } from "./AssetGrid";
import { AssetUploadButton } from "./AssetUploadButton";
import { useAssets } from "@/hooks/useAssets";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Canvas as FabricCanvas, FabricImage } from 'fabric';
import { toast } from 'sonner';

interface AssetBrowserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fabricCanvas?: FabricCanvas | null;
  onAddToCanvas?: (url: string) => void;
}

export const AssetBrowserModal = ({ open, onOpenChange, fabricCanvas, onAddToCanvas }: AssetBrowserModalProps) => {
  const { assets, isLoading, searchAssets, filterByCategory, selectedCategory, searchQuery } = useAssets();

  const handleAssetClick = async (assetUrl: string) => {
    if (fabricCanvas && onAddToCanvas) {
      onAddToCanvas(assetUrl);
      onOpenChange(false);
      toast.success('Asset added to canvas');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[80vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-[hsl(var(--cde-border-subtle))] pb-4">
          <DialogTitle className="text-[hsl(var(--cde-text-primary))]">Asset Library</DialogTitle>
          <AssetUploadButton />
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--cde-text-muted))]" />
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => searchAssets(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={selectedCategory} onValueChange={filterByCategory} className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="character">Characters</TabsTrigger>
            <TabsTrigger value="portrait">Portraits</TabsTrigger>
            <TabsTrigger value="landscape">Landscapes</TabsTrigger>
            <TabsTrigger value="automotive">Automotive</TabsTrigger>
            <TabsTrigger value="texture">Textures</TabsTrigger>
            <TabsTrigger value="product">Products</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="flex-1 overflow-auto">
            <AssetGrid 
              assets={assets}
              isLoading={isLoading}
              onAssetClick={(asset) => handleAssetClick(asset.url)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
