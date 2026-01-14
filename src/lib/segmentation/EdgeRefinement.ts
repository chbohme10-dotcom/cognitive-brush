/**
 * Professional Edge Refinement System
 * Edge-aware feathering, anti-aliasing, and matting for selection quality
 */

import { Point, SegmentationResult } from '@/types/segmentation';

export interface EdgeRefinementOptions {
  featherRadius: number;        // 0-50 pixels
  edgeContrast: number;         // 0-100, edge detection sensitivity
  smoothing: number;            // 0-100, contour smoothing
  antiAliasing: boolean;        // Enable anti-aliased edges
  edgeAwareFeather: boolean;    // Respect image edges during feathering
  matteDecontamination: boolean; // Remove color fringing
}

export interface RefinedSelection {
  mask: Float32Array;           // 0.0-1.0 alpha values
  contour: Point[];             // Refined contour points
  edgeQuality: number;          // 0-1 edge quality score
  processingTime: number;
}

export class EdgeRefinement {
  private width: number;
  private height: number;
  private imageData: ImageData;
  private options: EdgeRefinementOptions;

  constructor(imageData: ImageData, options: Partial<EdgeRefinementOptions> = {}) {
    this.imageData = imageData;
    this.width = imageData.width;
    this.height = imageData.height;
    this.options = {
      featherRadius: 2,
      edgeContrast: 50,
      smoothing: 30,
      antiAliasing: true,
      edgeAwareFeather: true,
      matteDecontamination: false,
      ...options
    };
  }

  refine(selection: SegmentationResult): RefinedSelection {
    const startTime = performance.now();

    // Convert binary mask to float mask
    let floatMask = this.binaryToFloat(selection.mask);

    // Apply edge-aware feathering
    if (this.options.edgeAwareFeather && this.options.featherRadius > 0) {
      floatMask = this.applyEdgeAwareFeather(floatMask);
    } else if (this.options.featherRadius > 0) {
      floatMask = this.applyGaussianFeather(floatMask);
    }

    // Apply anti-aliasing
    if (this.options.antiAliasing) {
      floatMask = this.applyAntiAliasing(floatMask);
    }

    // Apply smoothing
    if (this.options.smoothing > 0) {
      floatMask = this.applyContourSmoothing(floatMask);
    }

    // Matte decontamination
    if (this.options.matteDecontamination) {
      floatMask = this.applyMatteDecontamination(floatMask);
    }

    // Extract refined contour
    const contour = this.extractContour(floatMask);

    const endTime = performance.now();

    return {
      mask: floatMask,
      contour,
      edgeQuality: this.calculateEdgeQuality(floatMask),
      processingTime: endTime - startTime
    };
  }

  private binaryToFloat(mask: Uint8ClampedArray): Float32Array {
    const floatMask = new Float32Array(mask.length);
    for (let i = 0; i < mask.length; i++) {
      floatMask[i] = mask[i] / 255;
    }
    return floatMask;
  }

  /**
   * Edge-aware feathering using guided filter approach
   * Respects image edges for natural-looking selections
   */
  private applyEdgeAwareFeather(mask: Float32Array): Float32Array {
    const radius = Math.ceil(this.options.featherRadius);
    const edgeStrength = this.options.edgeContrast / 100;
    const result = new Float32Array(mask.length);

    // Compute edge map from image
    const edgeMap = this.computeEdgeMap();

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = y * this.width + x;
        
        let sum = 0;
        let weightSum = 0;

        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const ny = y + dy;
            const nx = x + dx;

            if (ny < 0 || ny >= this.height || nx < 0 || nx >= this.width) continue;

            const nIdx = ny * this.width + nx;
            
            // Gaussian weight
            const dist = Math.sqrt(dx * dx + dy * dy);
            const gaussWeight = Math.exp(-(dist * dist) / (2 * radius * radius));
            
            // Edge-aware weight (reduce feathering across edges)
            const edgeDiff = Math.abs(edgeMap[idx] - edgeMap[nIdx]);
            const edgeWeight = Math.exp(-edgeDiff * edgeStrength * 10);
            
            const weight = gaussWeight * edgeWeight;
            sum += mask[nIdx] * weight;
            weightSum += weight;
          }
        }

        result[idx] = weightSum > 0 ? sum / weightSum : mask[idx];
      }
    }

    return result;
  }

  /**
   * Simple Gaussian feathering for non-edge-aware mode
   */
  private applyGaussianFeather(mask: Float32Array): Float32Array {
    const radius = Math.ceil(this.options.featherRadius);
    const sigma = radius / 3;
    const result = new Float32Array(mask.length);

    // Create Gaussian kernel
    const kernelSize = radius * 2 + 1;
    const kernel: number[] = [];
    let kernelSum = 0;

    for (let i = 0; i < kernelSize; i++) {
      const x = i - radius;
      const value = Math.exp(-(x * x) / (2 * sigma * sigma));
      kernel.push(value);
      kernelSum += value;
    }

    // Normalize kernel
    for (let i = 0; i < kernelSize; i++) {
      kernel[i] /= kernelSum;
    }

    // Horizontal pass
    const temp = new Float32Array(mask.length);
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let sum = 0;
        for (let i = 0; i < kernelSize; i++) {
          const nx = Math.min(Math.max(x + i - radius, 0), this.width - 1);
          sum += mask[y * this.width + nx] * kernel[i];
        }
        temp[y * this.width + x] = sum;
      }
    }

    // Vertical pass
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let sum = 0;
        for (let i = 0; i < kernelSize; i++) {
          const ny = Math.min(Math.max(y + i - radius, 0), this.height - 1);
          sum += temp[ny * this.width + x] * kernel[i];
        }
        result[y * this.width + x] = sum;
      }
    }

    return result;
  }

  /**
   * Anti-aliasing using sub-pixel sampling
   */
  private applyAntiAliasing(mask: Float32Array): Float32Array {
    const result = new Float32Array(mask.length);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = y * this.width + x;
        const value = mask[idx];

        // Only process edge pixels (between 0.1 and 0.9)
        if (value > 0.1 && value < 0.9) {
          // Sample neighbors for sub-pixel blending
          let sum = value;
          let count = 1;

          const neighbors = [
            [-1, 0], [1, 0], [0, -1], [0, 1],
            [-1, -1], [1, -1], [-1, 1], [1, 1]
          ];

          for (const [dx, dy] of neighbors) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
              const nIdx = ny * this.width + nx;
              sum += mask[nIdx] * 0.5;
              count += 0.5;
            }
          }

          result[idx] = sum / count;
        } else {
          result[idx] = value;
        }
      }
    }

    return result;
  }

  /**
   * Contour smoothing using bilateral filter
   */
  private applyContourSmoothing(mask: Float32Array): Float32Array {
    const strength = this.options.smoothing / 100;
    const radius = Math.ceil(strength * 3) + 1;
    const result = new Float32Array(mask.length);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = y * this.width + x;
        const centerValue = mask[idx];

        // Only smooth edge regions
        if (centerValue > 0.05 && centerValue < 0.95) {
          let sum = 0;
          let weightSum = 0;

          for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
              const ny = y + dy;
              const nx = x + dx;

              if (ny < 0 || ny >= this.height || nx < 0 || nx >= this.width) continue;

              const nIdx = ny * this.width + nx;
              const nValue = mask[nIdx];

              // Spatial weight
              const spatialDist = Math.sqrt(dx * dx + dy * dy);
              const spatialWeight = Math.exp(-(spatialDist * spatialDist) / (2 * radius * radius));

              // Range weight
              const rangeDiff = Math.abs(nValue - centerValue);
              const rangeWeight = Math.exp(-(rangeDiff * rangeDiff) / (2 * strength * strength));

              const weight = spatialWeight * rangeWeight;
              sum += nValue * weight;
              weightSum += weight;
            }
          }

          result[idx] = weightSum > 0 ? sum / weightSum : centerValue;
        } else {
          result[idx] = centerValue;
        }
      }
    }

    return result;
  }

  /**
   * Matte decontamination to remove color fringing
   */
  private applyMatteDecontamination(mask: Float32Array): Float32Array {
    // For now, apply edge contrast enhancement
    const result = new Float32Array(mask.length);

    for (let i = 0; i < mask.length; i++) {
      const value = mask[i];
      
      // Apply sigmoid contrast curve to sharpen edges
      if (value > 0 && value < 1) {
        const shifted = value - 0.5;
        const contrast = 2.0;
        result[i] = 1 / (1 + Math.exp(-contrast * shifted * 10));
      } else {
        result[i] = value;
      }
    }

    return result;
  }

  /**
   * Compute edge map from image using Sobel operator
   */
  private computeEdgeMap(): Float32Array {
    const edgeMap = new Float32Array(this.width * this.height);
    const data = this.imageData.data;

    for (let y = 1; y < this.height - 1; y++) {
      for (let x = 1; x < this.width - 1; x++) {
        const idx = y * this.width + x;

        // Compute luminance gradient using Sobel
        let gx = 0;
        let gy = 0;

        // Sobel kernels applied to luminance
        const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
        const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const pIdx = ((y + dy) * this.width + (x + dx)) * 4;
            const lum = (data[pIdx] * 0.299 + data[pIdx + 1] * 0.587 + data[pIdx + 2] * 0.114) / 255;
            
            gx += lum * sobelX[dy + 1][dx + 1];
            gy += lum * sobelY[dy + 1][dx + 1];
          }
        }

        edgeMap[idx] = Math.sqrt(gx * gx + gy * gy);
      }
    }

    return edgeMap;
  }

  /**
   * Extract contour points from refined mask
   */
  private extractContour(mask: Float32Array): Point[] {
    const contour: Point[] = [];
    const threshold = 0.5;

    for (let y = 1; y < this.height - 1; y++) {
      for (let x = 1; x < this.width - 1; x++) {
        const idx = y * this.width + x;
        const value = mask[idx];

        // Check if this is an edge pixel
        if (value >= threshold) {
          const neighbors = [
            mask[idx - 1],                    // left
            mask[idx + 1],                    // right
            mask[idx - this.width],           // top
            mask[idx + this.width]            // bottom
          ];

          // If any neighbor is below threshold, this is a contour point
          if (neighbors.some(n => n < threshold)) {
            contour.push({ x, y });
          }
        }
      }
    }

    return contour;
  }

  /**
   * Calculate edge quality score
   */
  private calculateEdgeQuality(mask: Float32Array): number {
    let edgePixels = 0;
    let smoothEdgePixels = 0;

    for (let i = 0; i < mask.length; i++) {
      const value = mask[i];
      if (value > 0.1 && value < 0.9) {
        edgePixels++;
        // Check if edge is smooth (gradual transition)
        if (value > 0.3 && value < 0.7) {
          smoothEdgePixels++;
        }
      }
    }

    return edgePixels > 0 ? smoothEdgePixels / edgePixels : 1;
  }
}

/**
 * Quick edge refinement for real-time preview
 */
export function quickFeather(mask: Uint8ClampedArray, width: number, height: number, radius: number): Float32Array {
  const result = new Float32Array(mask.length);
  
  // Simple box blur for speed
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let count = 0;

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            sum += mask[ny * width + nx];
            count++;
          }
        }
      }

      result[y * width + x] = sum / (count * 255);
    }
  }

  return result;
}
