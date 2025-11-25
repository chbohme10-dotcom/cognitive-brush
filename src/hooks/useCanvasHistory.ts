import { useState, useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';

interface HistoryState {
  json: string;
  timestamp: number;
}

export const useCanvasHistory = (fabricCanvas: FabricCanvas | null) => {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isNavigating, setIsNavigating] = useState(false);

  // Save current canvas state to history
  const saveState = useCallback(() => {
    if (!fabricCanvas || isNavigating) return;

    const json = JSON.stringify(fabricCanvas.toJSON());
    const newState: HistoryState = {
      json,
      timestamp: Date.now(),
    };

    setHistory(prev => {
      // Remove any states after current index (when user made new action after undo)
      const newHistory = prev.slice(0, currentIndex + 1);
      // Add new state
      newHistory.push(newState);
      // Limit history to 50 states
      if (newHistory.length > 50) {
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });

    setCurrentIndex(prev => {
      const newIndex = prev + 1;
      return newIndex >= 50 ? 49 : newIndex;
    });
  }, [fabricCanvas, currentIndex, isNavigating]);

  // Undo operation
  const undo = useCallback(async () => {
    if (!fabricCanvas || currentIndex <= 0) {
      toast.info('Nothing to undo');
      return;
    }

    setIsNavigating(true);
    const previousState = history[currentIndex - 1];
    
    try {
      await fabricCanvas.loadFromJSON(JSON.parse(previousState.json));
      fabricCanvas.requestRenderAll();
      setCurrentIndex(prev => prev - 1);
      toast.success('Undo');
    } catch (error) {
      console.error('Undo error:', error);
      toast.error('Failed to undo');
    } finally {
      setIsNavigating(false);
    }
  }, [fabricCanvas, currentIndex, history]);

  // Redo operation
  const redo = useCallback(async () => {
    if (!fabricCanvas || currentIndex >= history.length - 1) {
      toast.info('Nothing to redo');
      return;
    }

    setIsNavigating(true);
    const nextState = history[currentIndex + 1];
    
    try {
      await fabricCanvas.loadFromJSON(JSON.parse(nextState.json));
      fabricCanvas.requestRenderAll();
      setCurrentIndex(prev => prev + 1);
      toast.success('Redo');
    } catch (error) {
      console.error('Redo error:', error);
      toast.error('Failed to redo');
    } finally {
      setIsNavigating(false);
    }
  }, [fabricCanvas, currentIndex, history]);

  // Listen to canvas changes and save state
  useEffect(() => {
    if (!fabricCanvas) return;

    let timeout: NodeJS.Timeout;
    const handleChange = () => {
      // Debounce state saves
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        saveState();
      }, 500);
    };

    fabricCanvas.on('object:added', handleChange);
    fabricCanvas.on('object:removed', handleChange);
    fabricCanvas.on('object:modified', handleChange);

    // Save initial state
    if (history.length === 0) {
      saveState();
    }

    return () => {
      clearTimeout(timeout);
      fabricCanvas.off('object:added', handleChange);
      fabricCanvas.off('object:removed', handleChange);
      fabricCanvas.off('object:modified', handleChange);
    };
  }, [fabricCanvas, saveState, history.length]);

  return {
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  };
};
