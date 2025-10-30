import { useState, useEffect } from 'react';
import { Canvas as FabricCanvas, FabricObject } from 'fabric';
import { toast } from 'sonner';

export interface CanvasLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  thumbnail?: string;
  opacity: number;
  fabricObject?: FabricObject;
}

export const useCanvasLayers = (canvas: FabricCanvas | null) => {
  const [layers, setLayers] = useState<CanvasLayer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);

  // Sync layers with canvas objects
  useEffect(() => {
    if (!canvas) return;

    const syncLayers = () => {
      const objects = canvas.getObjects();
      const newLayers: CanvasLayer[] = objects.map((obj, index) => {
        const existingLayer = layers.find(l => l.fabricObject === obj);
        return {
          id: existingLayer?.id || `layer-${Date.now()}-${index}`,
          name: existingLayer?.name || `Layer ${objects.length - index}`,
          visible: obj.visible ?? true,
          locked: !obj.selectable,
          opacity: obj.opacity ?? 1,
          fabricObject: obj,
          thumbnail: undefined,
        };
      }).reverse(); // Reverse to show top layer first

      setLayers(newLayers);
    };

    // Initial sync
    syncLayers();

    // Listen to canvas changes
    canvas.on('object:added', syncLayers);
    canvas.on('object:removed', syncLayers);
    canvas.on('object:modified', syncLayers);

    return () => {
      canvas.off('object:added', syncLayers);
      canvas.off('object:removed', syncLayers);
      canvas.off('object:modified', syncLayers);
    };
  }, [canvas]);

  const addLayer = (name: string = 'New Layer') => {
    // This will be handled by adding objects to canvas
    toast.info('Use tools to add objects to canvas');
  };

  const deleteLayer = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer?.fabricObject && canvas) {
      canvas.remove(layer.fabricObject);
      canvas.requestRenderAll();
      toast.success('Layer deleted');
    }
  };

  const toggleVisibility = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer?.fabricObject && canvas) {
      layer.fabricObject.visible = !layer.fabricObject.visible;
      canvas.requestRenderAll();
      setLayers(prev => prev.map(l => 
        l.id === layerId ? { ...l, visible: layer.fabricObject!.visible } : l
      ));
    }
  };

  const toggleLock = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer?.fabricObject && canvas) {
      layer.fabricObject.selectable = !layer.fabricObject.selectable;
      layer.fabricObject.evented = layer.fabricObject.selectable;
      canvas.requestRenderAll();
      setLayers(prev => prev.map(l => 
        l.id === layerId ? { ...l, locked: !layer.fabricObject!.selectable } : l
      ));
    }
  };

  const selectLayer = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer?.fabricObject && canvas) {
      canvas.setActiveObject(layer.fabricObject);
      canvas.requestRenderAll();
      setActiveLayerId(layerId);
    }
  };

  const updateLayerName = (layerId: string, newName: string) => {
    setLayers(prev => prev.map(l => 
      l.id === layerId ? { ...l, name: newName } : l
    ));
  };

  const updateLayerOpacity = (layerId: string, opacity: number) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer?.fabricObject && canvas) {
      layer.fabricObject.opacity = opacity;
      canvas.requestRenderAll();
      setLayers(prev => prev.map(l => 
        l.id === layerId ? { ...l, opacity } : l
      ));
    }
  };

  const reorderLayers = (fromIndex: number, toIndex: number) => {
    if (!canvas) return;
    
    const objects = canvas.getObjects();
    const actualFromIndex = objects.length - 1 - fromIndex;
    const actualToIndex = objects.length - 1 - toIndex;
    
    const obj = objects[actualFromIndex];
    canvas.remove(obj);
    canvas.insertAt(actualToIndex, obj);
    canvas.requestRenderAll();
  };

  return {
    layers,
    activeLayerId,
    addLayer,
    deleteLayer,
    toggleVisibility,
    toggleLock,
    selectLayer,
    updateLayerName,
    updateLayerOpacity,
    reorderLayers,
  };
};
