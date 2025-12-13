import { Point, Color, SegmentationResult, WandOptions } from '@/types/segmentation';

/**
 * Global Color Selection - selects all pixels matching color across entire image
 * Not limited to contiguous regions (like Photoshop's "Contiguous" unchecked)
 */
export class GlobalColorSelect {
  private imageData: ImageData;
  private width: number;
  private height: number;
  private data: Uint8ClampedArray;

  constructor(imageData: ImageData) {
    this.imageData = imageData;
    this.width = imageData.width;
    this.height = imageData.height;
    this.data = imageData.data;
  }

  async segment(
    seedPoint: Point,
    options: WandOptions
  ): Promise<SegmentationResult> {
    const startTime = performance.now();
    
    const { tolerance, colorSpace } = options;
    const seedColor = this.getPixelColor(seedPoint.x, seedPoint.y);
    const mask = new Uint8ClampedArray(this.width * this.height);
    const selected: number[] = [];
    
    const totalPixels = this.width * this.height;
    
    // Single pass through all pixels - highly parallelizable
    for (let i = 0; i < totalPixels; i++) {
      const x = i % this.width;
      const y = Math.floor(i / this.width);
      const color = this.getPixelColor(x, y);
      
      if (this.colorDistance(seedColor, color, colorSpace) <= tolerance) {
        mask[i] = 255;
        selected.push(i);
      }
    }
    
    const endTime = performance.now();
    
    return {
      pixels: selected,
      mask,
      confidence: this.calculateConfidence(selected, seedColor, options),
      metadata: {
        algorithm: 'global-color-select',
        executionTime: endTime - startTime,
        memoryUsage: 0,
        parameters: options
      }
    };
  }

  private getPixelColor(x: number, y: number): Color {
    const offset = (y * this.width + x) * 4;
    return {
      r: this.data[offset],
      g: this.data[offset + 1],
      b: this.data[offset + 2],
      a: this.data[offset + 3]
    };
  }

  private colorDistance(c1: Color, c2: Color, colorSpace: string): number {
    switch (colorSpace) {
      case 'hsv': return this.hsvDistance(c1, c2);
      case 'lab': return this.labDistance(c1, c2);
      default: return this.rgbDistance(c1, c2);
    }
  }

  private rgbDistance(c1: Color, c2: Color): number {
    const dr = c1.r - c2.r;
    const dg = c1.g - c2.g;
    const db = c1.b - c2.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  private hsvDistance(c1: Color, c2: Color): number {
    const hsv1 = this.rgbToHsv(c1);
    const hsv2 = this.rgbToHsv(c2);
    const dh = Math.min(Math.abs(hsv1.h - hsv2.h), 360 - Math.abs(hsv1.h - hsv2.h)) / 180;
    const ds = hsv1.s - hsv2.s;
    const dv = hsv1.v - hsv2.v;
    return Math.sqrt(dh * dh * 100 + ds * ds * 100 + dv * dv * 100);
  }

  private labDistance(c1: Color, c2: Color): number {
    const lab1 = this.rgbToLab(c1);
    const lab2 = this.rgbToLab(c2);
    return Math.sqrt(
      Math.pow(lab1.l - lab2.l, 2) +
      Math.pow(lab1.a - lab2.a, 2) +
      Math.pow(lab1.b - lab2.b, 2)
    );
  }

  private rgbToHsv(c: Color): { h: number; s: number; v: number } {
    const r = c.r / 255, g = c.g / 255, b = c.b / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const d = max - min;
    const v = max;
    const s = max === 0 ? 0 : d / max;
    let h = 0;
    if (d !== 0) {
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
      else if (max === g) h = ((b - r) / d + 2) * 60;
      else h = ((r - g) / d + 4) * 60;
    }
    return { h, s, v };
  }

  private rgbToLab(c: Color): { l: number; a: number; b: number } {
    let r = c.r / 255, g = c.g / 255, b = c.b / 255;
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    
    let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    let y = (r * 0.2126 + g * 0.7152 + b * 0.0722);
    let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
    
    x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
    y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
    z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
    
    return { l: (116 * y) - 16, a: 500 * (x - y), b: 200 * (y - z) };
  }

  private calculateConfidence(pixels: number[], seedColor: Color, options: WandOptions): number {
    if (pixels.length === 0) return 0;
    let totalDist = 0;
    const sampleSize = Math.min(100, pixels.length);
    for (let i = 0; i < sampleSize; i++) {
      const idx = pixels[Math.floor(i * pixels.length / sampleSize)];
      const x = idx % this.width;
      const y = Math.floor(idx / this.width);
      totalDist += this.colorDistance(seedColor, this.getPixelColor(x, y), options.colorSpace);
    }
    return Math.max(0, 1 - (totalDist / sampleSize) / options.tolerance);
  }
}
