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

export const AssetUploadButton = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadAsset } = useAssets();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, mode: 'assets' | 'canvas' | 'layer') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      uploadAsset(file, {
        addToCanvas: mode === 'canvas',
        addToLayer: mode === 'layer',
      });
    });

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
