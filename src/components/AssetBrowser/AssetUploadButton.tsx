import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Upload, FolderPlus, Layers, ImagePlus } from "lucide-react";
import { useAssets } from "@/hooks/useAssets";
import { Canvas as FabricCanvas, FabricImage } from "fabric";
import { toast } from "sonner";

export const AssetUploadButton = ({ fabricCanvas }: { fabricCanvas: FabricCanvas | null }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadAsset } = useAssets();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, mode: 'assets' | 'canvas' | 'layer') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      const asset = await uploadAsset(file, {
        addToCanvas: mode === 'canvas',
        addToLayer: mode === 'layer',
      });
      
      // If adding to canvas and we have the canvas and asset, add it
      if (mode === 'canvas' && fabricCanvas && asset) {
        try {
          const img = await FabricImage.fromURL(asset.url, { crossOrigin: 'anonymous' });
          
          const scale = Math.min(
            fabricCanvas.width! / 4 / img.width!,
            fabricCanvas.height! / 4 / img.height!
          );
          
          img.scale(scale);
          img.set({
            left: fabricCanvas.width! / 2 - (img.width! * scale) / 2,
            top: fabricCanvas.height! / 2 - (img.height! * scale) / 2,
          });

          img.data = {
            layerId: `layer-${Date.now()}`,
            layerName: asset.name,
          };

          fabricCanvas.add(img);
          fabricCanvas.setActiveObject(img);
          fabricCanvas.requestRenderAll();
          toast.success(`Added ${asset.name} to canvas`);
        } catch (error) {
          console.error('Error adding to canvas:', error);
          toast.error('Failed to add image to canvas');
        }
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerUpload = (mode: 'assets' | 'canvas' | 'layer') => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('data-mode', mode);
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const mode = e.target.getAttribute('data-mode') as 'assets' | 'canvas' | 'layer';
          handleFileSelect(e, mode);
        }}
      />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 text-[hsl(var(--cde-text-secondary))] hover:text-[hsl(var(--cde-text-primary))]">
            <Upload className="w-4 h-4" />
            Upload
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))]">
          <DropdownMenuItem onClick={() => triggerUpload('assets')} className="gap-2">
            <FolderPlus className="w-4 h-4" />
            Add to Assets
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => triggerUpload('canvas')} className="gap-2">
            <ImagePlus className="w-4 h-4" />
            Add to Canvas (New Layer)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => triggerUpload('layer')} className="gap-2">
            <Layers className="w-4 h-4" />
            Add to Selected Layer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
