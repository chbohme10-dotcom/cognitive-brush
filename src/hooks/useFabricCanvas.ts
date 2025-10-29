import { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, FabricObject, PencilBrush, Circle, Rect, Textbox, FabricImage } from 'fabric';
import { toast } from 'sonner';

export type ToolType = 
  | 'select' 
  | 'lasso' 
  | 'pen' 
  | 'brush' 
  | 'eraser' 
  | 'stamp' 
  | 'dodge' 
  | 'blur' 
  | 'fill' 
  | 'shape' 
  | 'text' 
  | 'ai' 
  | 'move' 
  | 'zoom';

export interface ToolSettings {
  brushSize: number;
  brushOpacity: number;
  brushHardness: number;
  eraserSize: number;
  color: string;
}

export const useFabricCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  activeTool: ToolType,
  toolSettings: ToolSettings
) => {
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 1920,
      height: 1080,
      backgroundColor: '#ffffff',
      selection: activeTool === 'select',
      renderOnAddRemove: true,
    });

    fabricCanvasRef.current = canvas;
    setIsReady(true);

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [canvasRef]);

  // Update tool behavior
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Reset all interactive modes
    canvas.isDrawingMode = false;
    canvas.selection = false;
    canvas.forEachObject((obj) => {
      obj.selectable = false;
      obj.evented = false;
    });

    switch (activeTool) {
      case 'select':
        canvas.selection = true;
        canvas.forEachObject((obj) => {
          obj.selectable = true;
          obj.evented = true;
        });
        break;

      case 'brush':
        canvas.isDrawingMode = true;
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = toolSettings.color;
          canvas.freeDrawingBrush.width = toolSettings.brushSize;
          if (canvas.freeDrawingBrush instanceof PencilBrush) {
            canvas.freeDrawingBrush.strokeLineCap = 'round';
            canvas.freeDrawingBrush.strokeLineJoin = 'round';
          }
        }
        break;

      case 'eraser':
        canvas.isDrawingMode = true;
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = '#ffffff';
          canvas.freeDrawingBrush.width = toolSettings.eraserSize;
        }
        break;

      case 'pen':
        canvas.isDrawingMode = true;
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = toolSettings.color;
          canvas.freeDrawingBrush.width = 2;
        }
        break;

      case 'text':
        // Text tool will be handled via click events
        canvas.defaultCursor = 'text';
        break;

      case 'shape':
        canvas.defaultCursor = 'crosshair';
        break;

      case 'fill':
        canvas.defaultCursor = 'cell';
        break;

      default:
        canvas.defaultCursor = 'default';
    }

    canvas.requestRenderAll();
  }, [activeTool, toolSettings]);

  // Tool functions
  const addText = (x: number = 100, y: number = 100) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const text = new Textbox('Double click to edit', {
      left: x,
      top: y,
      fontSize: 24,
      fill: toolSettings.color,
      fontFamily: 'Arial',
      width: 200,
      editable: true,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.requestRenderAll();
    toast.success('Text added - double click to edit');
  };

  const addShape = (type: 'rectangle' | 'circle', x: number = 100, y: number = 100) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    let shape: FabricObject;

    if (type === 'rectangle') {
      shape = new Rect({
        left: x,
        top: y,
        fill: toolSettings.color,
        width: 100,
        height: 100,
        stroke: '#000000',
        strokeWidth: 2,
      });
    } else {
      shape = new Circle({
        left: x,
        top: y,
        fill: toolSettings.color,
        radius: 50,
        stroke: '#000000',
        strokeWidth: 2,
      });
    }

    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.requestRenderAll();
    toast.success(`${type} added to canvas`);
  };

  const addImageToCanvas = async (imageUrl: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    try {
      const img = await FabricImage.fromURL(imageUrl, {
        crossOrigin: 'anonymous',
      });
      
      img.set({
        left: 50,
        top: 50,
        scaleX: 0.5,
        scaleY: 0.5,
      });

      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.requestRenderAll();
      toast.success('Image added to canvas');
    } catch (error) {
      console.error('Error adding image:', error);
      toast.error('Failed to add image');
    }
  };

  const clearCanvas = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    canvas.requestRenderAll();
    toast.success('Canvas cleared');
  };

  const deleteSelected = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 0) {
      canvas.remove(...activeObjects);
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      toast.success(`Deleted ${activeObjects.length} object(s)`);
    }
  };

  const exportCanvas = (format: 'png' | 'jpeg' = 'png') => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;

    return canvas.toDataURL({
      format: format,
      quality: 1,
      multiplier: 1,
    });
  };

  const fillBackground = (color: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.backgroundColor = color;
    canvas.requestRenderAll();
  };

  return {
    canvas: fabricCanvasRef.current,
    isReady,
    addText,
    addShape,
    addImageToCanvas,
    clearCanvas,
    deleteSelected,
    exportCanvas,
    fillBackground,
  };
};
