import { Point, SegmentationResult, WandOptions } from '@/types/segmentation';
import { UltraFastFloodFill } from './UltraFastFloodFill';
import { ScanlineFloodFill } from './ScanlineFloodFill';
import { GlobalColorSelect } from './GlobalColorSelect';
import { MarchingSquaresContour } from './MarchingSquaresContour';

export type AlgorithmType = 
  | 'ultra-fast' 
  | 'scanline' 
  | 'global'
  | 'auto';

export interface BenchmarkResult {
  algorithm: AlgorithmType;
  executionTime: number;
  pixelCount: number;
  confidence: number;
  contourPoints?: number;
}

export interface MagicWandConfig {
  algorithm: AlgorithmType;
  tolerance: number;
  colorSpace: 'rgb' | 'hsv' | 'lab';
  connectivity: 4 | 8;
  contiguous: boolean;
  antiAlias: boolean;
  featherRadius: number;
}

export const defaultConfig: MagicWandConfig = {
  algorithm: 'auto',
  tolerance: 32,
  colorSpace: 'rgb',
  connectivity: 4,
  contiguous: true,
  antiAlias: true,
  featherRadius: 0
};

/**
 * Unified Magic Wand system with multiple algorithm options and benchmarking
 */
export class MagicWandSystem {
  private imageData: ImageData;
  private width: number;
  private height: number;

  constructor(imageData: ImageData) {
    this.imageData = imageData;
    this.width = imageData.width;
    this.height = imageData.height;
  }

  /**
   * Run selection with specified configuration
   */
  async select(
    seedPoint: Point,
    config: Partial<MagicWandConfig> = {}
  ): Promise<SegmentationResult & { contour?: Point[][] }> {
    const fullConfig = { ...defaultConfig, ...config };
    
    const options: WandOptions = {
      tolerance: fullConfig.tolerance,
      colorSpace: fullConfig.colorSpace,
      connectivity: fullConfig.connectivity
    };

    // Choose algorithm
    let algorithm = fullConfig.algorithm;
    if (algorithm === 'auto') {
      algorithm = this.selectBestAlgorithm(fullConfig);
    }

    // Run segmentation
    let result: SegmentationResult;
    
    if (!fullConfig.contiguous) {
      const selector = new GlobalColorSelect(this.imageData);
      result = await selector.segment(seedPoint, options);
    } else {
      switch (algorithm) {
        case 'scanline':
          const scanline = new ScanlineFloodFill(this.imageData);
          result = await scanline.segment(seedPoint, options);
          break;
        case 'ultra-fast':
        default:
          const ultraFast = new UltraFastFloodFill(this.imageData);
          result = await ultraFast.segment(seedPoint, options);
          break;
      }
    }

    // Extract contours if anti-aliasing requested
    let contour: Point[][] | undefined;
    if (fullConfig.antiAlias && result.mask) {
      const contourExtractor = new MarchingSquaresContour(result.mask, this.width, this.height);
      contour = contourExtractor.extractContours().map(c => 
        MarchingSquaresContour.simplifyContour(c, 1.5)
      );
    }

    // Apply feathering if requested
    if (fullConfig.featherRadius > 0) {
      this.applyFeather(result.mask, fullConfig.featherRadius);
    }

    return { ...result, contour };
  }

  /**
   * Run all algorithms and return benchmark comparison
   */
  async benchmark(
    seedPoint: Point,
    config: Partial<MagicWandConfig> = {}
  ): Promise<BenchmarkResult[]> {
    const fullConfig = { ...defaultConfig, ...config };
    const options: WandOptions = {
      tolerance: fullConfig.tolerance,
      colorSpace: fullConfig.colorSpace,
      connectivity: fullConfig.connectivity
    };

    const results: BenchmarkResult[] = [];

    // Benchmark Ultra Fast
    const ultraFast = new UltraFastFloodFill(this.imageData);
    const ufResult = await ultraFast.segment(seedPoint, options);
    results.push({
      algorithm: 'ultra-fast',
      executionTime: ufResult.metadata.executionTime,
      pixelCount: ufResult.pixels.length,
      confidence: ufResult.confidence
    });

    // Benchmark Scanline
    const scanline = new ScanlineFloodFill(this.imageData);
    const slResult = await scanline.segment(seedPoint, options);
    results.push({
      algorithm: 'scanline',
      executionTime: slResult.metadata.executionTime,
      pixelCount: slResult.pixels.length,
      confidence: slResult.confidence
    });

    // Benchmark Global
    const global = new GlobalColorSelect(this.imageData);
    const gResult = await global.segment(seedPoint, options);
    results.push({
      algorithm: 'global',
      executionTime: gResult.metadata.executionTime,
      pixelCount: gResult.pixels.length,
      confidence: gResult.confidence
    });

    return results;
  }

  private selectBestAlgorithm(config: MagicWandConfig): AlgorithmType {
    const imageSize = this.width * this.height;
    
    // Scanline is generally faster for large contiguous regions
    if (imageSize > 1000000) {
      return 'scanline';
    }
    
    // Ultra-fast with 8-connectivity for complex shapes
    if (config.connectivity === 8) {
      return 'ultra-fast';
    }
    
    return 'scanline';
  }

  private applyFeather(mask: Uint8ClampedArray, radius: number): void {
    // Simple box blur for feathering
    const temp = new Uint8ClampedArray(mask.length);
    const r = Math.ceil(radius);
    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let sum = 0;
        let count = 0;
        
        for (let dy = -r; dy <= r; dy++) {
          for (let dx = -r; dx <= r; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
              sum += mask[ny * this.width + nx];
              count++;
            }
          }
        }
        
        temp[y * this.width + x] = Math.round(sum / count);
      }
    }
    
    mask.set(temp);
  }

  /**
   * Get mask as ImageData for visualization
   */
  static maskToImageData(mask: Uint8ClampedArray, width: number, height: number): ImageData {
    const data = new Uint8ClampedArray(width * height * 4);
    
    for (let i = 0; i < mask.length; i++) {
      const offset = i * 4;
      const val = mask[i];
      data[offset] = 255;     // R - red tint for selection
      data[offset + 1] = 0;   // G
      data[offset + 2] = 0;   // B
      data[offset + 3] = val; // A - use mask as alpha
    }
    
    return new ImageData(data, width, height);
  }
}
