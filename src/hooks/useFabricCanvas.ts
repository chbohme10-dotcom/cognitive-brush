import { useEffect, useState } from "react";
import { Canvas as FabricCanvas, FabricImage } from "fabric";

// Extend Fabric types to include custom data
declare module "fabric" {
  interface FabricObject {
    data?: {
      layerId: string;
      layerName: string;
    };
  }
}

export const useFabricCanvas = (canvasEl: HTMLCanvasElement | null) => {
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);

  useEffect(() => {
    if (!canvasEl) return;

    const canvas = new FabricCanvas(canvasEl, {
      width: 1920,
      height: 1080,
      backgroundColor: '#ffffff',
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [canvasEl]);

  const addImageToCanvas = async (imageUrl: string, layerName?: string) => {
    if (!fabricCanvas) return;

    try {
      const img = await FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' });
      
      // Scale image to fit canvas nicely
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
        layerName: layerName || 'New Layer',
      };

      fabricCanvas.add(img);
      fabricCanvas.setActiveObject(img);
      fabricCanvas.requestRenderAll();
    } catch (error) {
      console.error('Error adding image to canvas:', error);
    }
  };

  return {
    fabricCanvas,
    addImageToCanvas,
  };
};
