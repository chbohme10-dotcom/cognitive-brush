import { useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas, FabricObject } from 'fabric';
import { toast } from 'sonner';

// Extend Fabric types to include custom data
declare module "fabric" {
  interface FabricObject {
    data?: {
      layerId: string;
      layerName: string;
    };
  }
}

export interface CanvasLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: string;
  thumbnail?: string;
  fabricObject?: FabricObject;
  groupId?: string;
  isGroup?: boolean;
  children?: string[];
}

export interface LayerGroup {
  id: string;
  name: string;
  expanded: boolean;
  layerIds: string[];
}

export const useCanvasLayers = (fabricCanvas: FabricCanvas | null) => {
  const [layers, setLayers] = useState<CanvasLayer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  const [groups, setGroups] = useState<LayerGroup[]>([]);

  // Generate thumbnail from Fabric object
  const generateThumbnail = useCallback((fabricObject: FabricObject): string => {
    try {
      const dataUrl = fabricObject.toDataURL({
        format: 'png',
        quality: 0.5,
        multiplier: 0.2,
      });
      return dataUrl;
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      return '';
    }
  }, []);

  // Sync Fabric.js objects with layers
  useEffect(() => {
    if (!fabricCanvas) return;

    const syncLayers = () => {
      const objects = fabricCanvas.getObjects();
      const newLayers: CanvasLayer[] = objects.map((obj, index) => ({
        id: obj.data?.layerId || `layer-${index}`,
        name: obj.data?.layerName || `Layer ${objects.length - index}`,
        visible: obj.visible !== false,
        locked: obj.selectable === false,
        opacity: (obj.opacity || 1) * 100,
        blendMode: 'Normal',
        thumbnail: generateThumbnail(obj),
        fabricObject: obj,
      })).reverse(); // Reverse to show top layer first

      setLayers(newLayers);
    };

    syncLayers();

    fabricCanvas.on('object:added', syncLayers);
    fabricCanvas.on('object:removed', syncLayers);
    fabricCanvas.on('object:modified', syncLayers);

    return () => {
      fabricCanvas.off('object:added', syncLayers);
      fabricCanvas.off('object:removed', syncLayers);
      fabricCanvas.off('object:modified', syncLayers);
    };
  }, [fabricCanvas, generateThumbnail]);

  const addLayer = useCallback((fabricObject: FabricObject, name?: string) => {
    if (!fabricCanvas) return;

    const layerId = `layer-${Date.now()}`;
    fabricObject.data = {
      layerId,
      layerName: name || `Layer ${layers.length + 1}`,
    };

    fabricCanvas.add(fabricObject);
    fabricCanvas.setActiveObject(fabricObject);
    fabricCanvas.requestRenderAll();
    setActiveLayerId(layerId);
    toast.success('Layer added');
  }, [fabricCanvas, layers.length]);

  const exportLayer = useCallback(async (fabricObject: FabricObject, name: string) => {
    try {
      const dataURL = fabricObject.toDataURL({ format: 'png' });
      const link = document.createElement('a');
      link.download = `${name}.png`;
      link.href = dataURL;
      link.click();
      toast.success(`Exported ${name}`);
    } catch (error) {
      toast.error('Failed to export layer');
      console.error(error);
    }
  }, []);

  const deleteLayer = useCallback((layerId: string) => {
    if (!fabricCanvas) return;

    const layer = layers.find(l => l.id === layerId);
    if (layer?.fabricObject) {
      fabricCanvas.remove(layer.fabricObject);
      fabricCanvas.requestRenderAll();
      toast.success('Layer deleted');
    }
  }, [fabricCanvas, layers]);

  const toggleVisibility = useCallback((layerId: string) => {
    if (!fabricCanvas) return;

    const layer = layers.find(l => l.id === layerId);
    if (layer?.fabricObject) {
      layer.fabricObject.visible = !layer.fabricObject.visible;
      fabricCanvas.requestRenderAll();
    }
  }, [fabricCanvas, layers]);

  const toggleLock = useCallback((layerId: string) => {
    if (!fabricCanvas) return;

    const layer = layers.find(l => l.id === layerId);
    if (layer?.fabricObject) {
      layer.fabricObject.selectable = !layer.fabricObject.selectable;
      layer.fabricObject.evented = !layer.fabricObject.evented;
      fabricCanvas.requestRenderAll();
    }
  }, [fabricCanvas, layers]);

  const selectLayer = useCallback((layerId: string) => {
    if (!fabricCanvas) return;

    const layer = layers.find(l => l.id === layerId);
    if (layer?.fabricObject) {
      fabricCanvas.setActiveObject(layer.fabricObject);
      fabricCanvas.requestRenderAll();
      setActiveLayerId(layerId);
    }
  }, [fabricCanvas, layers]);

  const updateLayerName = useCallback((layerId: string, name: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer?.fabricObject) {
      layer.fabricObject.data = {
        ...layer.fabricObject.data,
        layerName: name,
      };
      setLayers(prev => prev.map(l => 
        l.id === layerId ? { ...l, name } : l
      ));
    }
  }, [layers]);

  const updateLayerOpacity = useCallback((layerId: string, opacity: number) => {
    if (!fabricCanvas) return;

    const layer = layers.find(l => l.id === layerId);
    if (layer?.fabricObject) {
      layer.fabricObject.opacity = opacity / 100;
      fabricCanvas.requestRenderAll();
    }
  }, [fabricCanvas, layers]);

  const reorderLayers = useCallback((dragId: string, dropId: string) => {
    if (!fabricCanvas) return;

    const dragLayer = layers.find(l => l.id === dragId);
    const dropLayer = layers.find(l => l.id === dropId);

    if (dragLayer?.fabricObject && dropLayer?.fabricObject) {
      const objects = fabricCanvas.getObjects();
      const dragIndex = objects.indexOf(dragLayer.fabricObject);
      const dropIndex = objects.indexOf(dropLayer.fabricObject);

      const allObjects = fabricCanvas.getObjects();
      fabricCanvas.remove(dragLayer.fabricObject);
      // Re-insert at the correct position
      allObjects.splice(dropIndex, 0, dragLayer.fabricObject);
      fabricCanvas.clear();
      allObjects.forEach(obj => fabricCanvas.add(obj));
      fabricCanvas.requestRenderAll();
    }
  }, [fabricCanvas, layers]);

  const createGroup = useCallback((layerIds: string[], groupName: string = 'New Group') => {
    const groupId = `group-${Date.now()}`;
    const newGroup: LayerGroup = {
      id: groupId,
      name: groupName,
      expanded: true,
      layerIds,
    };

    setGroups(prev => [...prev, newGroup]);
    
    // Update layers to reference the group
    setLayers(prev => prev.map(layer => 
      layerIds.includes(layer.id) ? { ...layer, groupId } : layer
    ));

    toast.success(`Group "${groupName}" created`);
    return groupId;
  }, []);

  const ungroupLayers = useCallback((groupId: string) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
    setLayers(prev => prev.map(layer => 
      layer.groupId === groupId ? { ...layer, groupId: undefined } : layer
    ));
    toast.success('Group removed');
  }, []);

  const toggleGroupExpanded = useCallback((groupId: string) => {
    setGroups(prev => prev.map(g => 
      g.id === groupId ? { ...g, expanded: !g.expanded } : g
    ));
  }, []);

  const updateGroupName = useCallback((groupId: string, name: string) => {
    setGroups(prev => prev.map(g => 
      g.id === groupId ? { ...g, name } : g
    ));
  }, []);

  return {
    layers,
    activeLayerId,
    groups,
    addLayer,
    deleteLayer,
    toggleVisibility,
    toggleLock,
    selectLayer,
    updateLayerName,
    updateLayerOpacity,
    reorderLayers,
    exportLayer,
    createGroup,
    ungroupLayers,
    toggleGroupExpanded,
    updateGroupName,
  };
};
