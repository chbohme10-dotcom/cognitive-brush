/**
 * Selection History System
 * Save, recall, and combine multiple selections
 */

import { Point, SegmentationResult } from '@/types/segmentation';

export type CombineMode = 'add' | 'subtract' | 'intersect' | 'xor';

export interface ContourData {
  paths: Point[][];
  boundingBox?: { x: number; y: number; width: number; height: number };
}

export interface SavedSelection {
  id: string;
  name: string;
  timestamp: number;
  mask: Uint8ClampedArray;
  width: number;
  height: number;
  pixelCount: number;
  contour?: ContourResult;
  thumbnail?: string;
  metadata: {
    algorithm: string;
    tolerance: number;
    seedPoint?: Point;
  };
}

export interface SelectionHistoryState {
  selections: SavedSelection[];
  activeSelectionId: string | null;
  maxHistory: number;
}

export class SelectionHistory {
  private state: SelectionHistoryState;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(maxHistory: number = 50) {
    this.state = {
      selections: [],
      activeSelectionId: null,
      maxHistory
    };

    // Create off-screen canvas for thumbnails
    this.canvas = document.createElement('canvas');
    this.canvas.width = 64;
    this.canvas.height = 64;
    this.ctx = this.canvas.getContext('2d')!;
  }

  /**
   * Save a selection to history
   */
  save(
    result: SegmentationResult,
    width: number,
    height: number,
    name?: string,
    contour?: ContourResult
  ): SavedSelection {
    const id = this.generateId();
    const timestamp = Date.now();

    // Create copy of mask
    const maskCopy = new Uint8ClampedArray(result.mask);

    // Generate thumbnail
    const thumbnail = this.generateThumbnail(maskCopy, width, height);

    const selection: SavedSelection = {
      id,
      name: name || `Selection ${this.state.selections.length + 1}`,
      timestamp,
      mask: maskCopy,
      width,
      height,
      pixelCount: result.pixels.length,
      contour,
      thumbnail,
      metadata: {
        algorithm: result.metadata.algorithm,
        tolerance: result.metadata.parameters.tolerance
      }
    };

    // Add to history
    this.state.selections.unshift(selection);

    // Trim if exceeds max
    if (this.state.selections.length > this.state.maxHistory) {
      this.state.selections = this.state.selections.slice(0, this.state.maxHistory);
    }

    this.state.activeSelectionId = id;

    return selection;
  }

  /**
   * Get a selection by ID
   */
  get(id: string): SavedSelection | undefined {
    return this.state.selections.find(s => s.id === id);
  }

  /**
   * Get all saved selections
   */
  getAll(): SavedSelection[] {
    return [...this.state.selections];
  }

  /**
   * Get active selection
   */
  getActive(): SavedSelection | undefined {
    if (!this.state.activeSelectionId) return undefined;
    return this.get(this.state.activeSelectionId);
  }

  /**
   * Set active selection
   */
  setActive(id: string): void {
    if (this.get(id)) {
      this.state.activeSelectionId = id;
    }
  }

  /**
   * Rename a selection
   */
  rename(id: string, name: string): void {
    const selection = this.get(id);
    if (selection) {
      selection.name = name;
    }
  }

  /**
   * Delete a selection
   */
  delete(id: string): void {
    const index = this.state.selections.findIndex(s => s.id === id);
    if (index !== -1) {
      this.state.selections.splice(index, 1);
      if (this.state.activeSelectionId === id) {
        this.state.activeSelectionId = this.state.selections[0]?.id || null;
      }
    }
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.state.selections = [];
    this.state.activeSelectionId = null;
  }

  /**
   * Combine two selections
   */
  combine(
    selection1: SavedSelection,
    selection2: SavedSelection,
    mode: CombineMode,
    name?: string
  ): SavedSelection {
    if (selection1.width !== selection2.width || selection1.height !== selection2.height) {
      throw new Error('Selections must have the same dimensions');
    }

    const resultMask = new Uint8ClampedArray(selection1.mask.length);
    let pixelCount = 0;

    for (let i = 0; i < selection1.mask.length; i++) {
      const v1 = selection1.mask[i] > 127;
      const v2 = selection2.mask[i] > 127;
      let result = false;

      switch (mode) {
        case 'add':
          result = v1 || v2;
          break;
        case 'subtract':
          result = v1 && !v2;
          break;
        case 'intersect':
          result = v1 && v2;
          break;
        case 'xor':
          result = v1 !== v2;
          break;
      }

      if (result) {
        resultMask[i] = 255;
        pixelCount++;
      }
    }

    const pixels = Array.from({ length: pixelCount }, (_, i) => i);
    const segmentationResult: SegmentationResult = {
      pixels,
      mask: resultMask,
      confidence: 1,
      metadata: {
        algorithm: `${mode}-combine`,
        executionTime: 0,
        memoryUsage: 0,
        parameters: { tolerance: 0, colorSpace: 'rgb', connectivity: 4 }
      }
    };

    return this.save(
      segmentationResult,
      selection1.width,
      selection1.height,
      name || `${selection1.name} ${mode} ${selection2.name}`
    );
  }

  /**
   * Invert a selection
   */
  invert(selection: SavedSelection, name?: string): SavedSelection {
    const resultMask = new Uint8ClampedArray(selection.mask.length);
    let pixelCount = 0;

    for (let i = 0; i < selection.mask.length; i++) {
      resultMask[i] = selection.mask[i] > 127 ? 0 : 255;
      if (resultMask[i] > 127) pixelCount++;
    }

    const pixels = Array.from({ length: pixelCount }, (_, i) => i);
    const segmentationResult: SegmentationResult = {
      pixels,
      mask: resultMask,
      confidence: 1,
      metadata: {
        algorithm: 'invert',
        executionTime: 0,
        memoryUsage: 0,
        parameters: { tolerance: 0, colorSpace: 'rgb', connectivity: 4 }
      }
    };

    return this.save(
      segmentationResult,
      selection.width,
      selection.height,
      name || `${selection.name} (Inverted)`
    );
  }

  /**
   * Expand selection by pixels
   */
  expand(selection: SavedSelection, pixels: number, name?: string): SavedSelection {
    const resultMask = this.morphOperation(selection, pixels, 'expand');
    
    let pixelCount = 0;
    for (let i = 0; i < resultMask.length; i++) {
      if (resultMask[i] > 127) pixelCount++;
    }

    const pixelArray = Array.from({ length: pixelCount }, (_, i) => i);
    const segmentationResult: SegmentationResult = {
      pixels: pixelArray,
      mask: resultMask,
      confidence: 1,
      metadata: {
        algorithm: 'expand',
        executionTime: 0,
        memoryUsage: 0,
        parameters: { tolerance: 0, colorSpace: 'rgb', connectivity: 4 }
      }
    };

    return this.save(
      segmentationResult,
      selection.width,
      selection.height,
      name || `${selection.name} (Expanded ${pixels}px)`
    );
  }

  /**
   * Contract selection by pixels
   */
  contract(selection: SavedSelection, pixels: number, name?: string): SavedSelection {
    const resultMask = this.morphOperation(selection, pixels, 'contract');
    
    let pixelCount = 0;
    for (let i = 0; i < resultMask.length; i++) {
      if (resultMask[i] > 127) pixelCount++;
    }

    const pixelArray = Array.from({ length: pixelCount }, (_, i) => i);
    const segmentationResult: SegmentationResult = {
      pixels: pixelArray,
      mask: resultMask,
      confidence: 1,
      metadata: {
        algorithm: 'contract',
        executionTime: 0,
        memoryUsage: 0,
        parameters: { tolerance: 0, colorSpace: 'rgb', connectivity: 4 }
      }
    };

    return this.save(
      segmentationResult,
      selection.width,
      selection.height,
      name || `${selection.name} (Contracted ${pixels}px)`
    );
  }

  /**
   * Export selection as JSON
   */
  export(selection: SavedSelection): string {
    return JSON.stringify({
      ...selection,
      mask: Array.from(selection.mask)
    });
  }

  /**
   * Import selection from JSON
   */
  import(json: string): SavedSelection {
    const data = JSON.parse(json);
    const selection: SavedSelection = {
      ...data,
      id: this.generateId(),
      timestamp: Date.now(),
      mask: new Uint8ClampedArray(data.mask)
    };

    this.state.selections.unshift(selection);
    return selection;
  }

  /**
   * Export all selections
   */
  exportAll(): string {
    return JSON.stringify(
      this.state.selections.map(s => ({
        ...s,
        mask: Array.from(s.mask)
      }))
    );
  }

  /**
   * Import multiple selections
   */
  importAll(json: string): SavedSelection[] {
    const data = JSON.parse(json);
    const imported: SavedSelection[] = [];

    for (const item of data) {
      const selection: SavedSelection = {
        ...item,
        id: this.generateId(),
        timestamp: Date.now(),
        mask: new Uint8ClampedArray(item.mask)
      };
      this.state.selections.unshift(selection);
      imported.push(selection);
    }

    return imported;
  }

  private generateId(): string {
    return `sel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateThumbnail(mask: Uint8ClampedArray, width: number, height: number): string {
    // Scale factor
    const scale = Math.min(64 / width, 64 / height);
    const thumbWidth = Math.floor(width * scale);
    const thumbHeight = Math.floor(height * scale);

    this.canvas.width = thumbWidth;
    this.canvas.height = thumbHeight;

    const imageData = this.ctx.createImageData(thumbWidth, thumbHeight);

    for (let ty = 0; ty < thumbHeight; ty++) {
      for (let tx = 0; tx < thumbWidth; tx++) {
        const sx = Math.floor(tx / scale);
        const sy = Math.floor(ty / scale);
        const sourceIdx = sy * width + sx;
        const targetIdx = (ty * thumbWidth + tx) * 4;

        const alpha = mask[sourceIdx];
        imageData.data[targetIdx] = 100;     // R
        imageData.data[targetIdx + 1] = 150; // G
        imageData.data[targetIdx + 2] = 255; // B
        imageData.data[targetIdx + 3] = alpha;
      }
    }

    this.ctx.putImageData(imageData, 0, 0);
    return this.canvas.toDataURL('image/png');
  }

  private morphOperation(
    selection: SavedSelection,
    radius: number,
    operation: 'expand' | 'contract'
  ): Uint8ClampedArray {
    const { mask, width, height } = selection;
    const result = new Uint8ClampedArray(mask.length);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        let found = operation === 'expand' ? false : true;

        for (let dy = -radius; dy <= radius && (operation === 'expand' ? !found : found); dy++) {
          for (let dx = -radius; dx <= radius && (operation === 'expand' ? !found : found); dx++) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > radius) continue;

            const ny = y + dy;
            const nx = x + dx;
            if (ny < 0 || ny >= height || nx < 0 || nx >= width) continue;

            const nIdx = ny * width + nx;
            if (operation === 'expand') {
              if (mask[nIdx] > 127) found = true;
            } else {
              if (mask[nIdx] <= 127) found = false;
            }
          }
        }

        result[idx] = found ? 255 : 0;
      }
    }

    return result;
  }
}

// Singleton instance
let historyInstance: SelectionHistory | null = null;

export function getSelectionHistory(): SelectionHistory {
  if (!historyInstance) {
    historyInstance = new SelectionHistory();
  }
  return historyInstance;
}
