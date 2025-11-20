import { Point, Color, SegmentationResult, WandOptions } from '@/types/segmentation';

export class UltraFastFloodFill {
  private imageData: ImageData;
  private width: number;
  private height: number;

  constructor(imageData: ImageData) {
    this.imageData = imageData;
    this.width = imageData.width;
    this.height = imageData.height;
  }

  async segment(
    seedPoint: Point,
    options: WandOptions
  ): Promise<SegmentationResult> {
    const startTime = performance.now();
    const startMemory = 0;

    const seedIdx = seedPoint.y * this.width + seedPoint.x;
    const seedColor = this.getPixelColor(seedIdx);
    const selected: number[] = [];

    const visited = new Uint8Array((this.width * this.height + 7) >> 3);
    const queue = new Int32Array(this.width * this.height);
    let queueStart = 0, queueEnd = 0;

    queue[queueEnd++] = seedIdx;
    this.setVisited(visited, seedIdx);

    while (queueStart < queueEnd) {
      const idx = queue[queueStart++];

      if (this.colorDistance(seedColor, this.getPixelColor(idx), options.colorSpace) <= options.tolerance) {
        selected.push(idx);

        const neighbors = this.getNeighborsFast(idx, options.connectivity);
        for (let i = 0; i < neighbors.length; i++) {
          const nIdx = neighbors[i];
          if (!this.isVisited(visited, nIdx)) {
            this.setVisited(visited, nIdx);
            queue[queueEnd++] = nIdx;
          }
        }
      }
    }

    const endTime = performance.now();
    const endMemory = 0;

    const mask = new Uint8ClampedArray(this.width * this.height);
    selected.forEach(idx => mask[idx] = 255);

    return {
      pixels: selected,
      mask,
      confidence: this.calculateConfidence(selected, seedColor, options),
      metadata: {
        algorithm: 'ultra-fast-flood-fill',
        executionTime: endTime - startTime,
        memoryUsage: endMemory - startMemory,
        parameters: options
      }
    };
  }

  private setVisited(visited: Uint8Array, idx: number): void {
    visited[idx >> 3] |= 1 << (idx & 7);
  }

  private isVisited(visited: Uint8Array, idx: number): boolean {
    return (visited[idx >> 3] & (1 << (idx & 7))) !== 0;
  }

  private getNeighborsFast(idx: number, connectivity: number): number[] {
    const x = idx % this.width;
    const y = Math.floor(idx / this.width);
    const neighbors: number[] = [];

    if (y > 0) neighbors.push(idx - this.width);
    if (y < this.height - 1) neighbors.push(idx + this.width);
    if (x > 0) neighbors.push(idx - 1);
    if (x < this.width - 1) neighbors.push(idx + 1);

    if (connectivity === 8) {
      if (x > 0 && y > 0) neighbors.push(idx - this.width - 1);
      if (x < this.width - 1 && y > 0) neighbors.push(idx - this.width + 1);
      if (x > 0 && y < this.height - 1) neighbors.push(idx + this.width - 1);
      if (x < this.width - 1 && y < this.height - 1) neighbors.push(idx + this.width + 1);
    }

    return neighbors;
  }

  private getPixelColor(idx: number): Color {
    const offset = idx << 2;
    return {
      r: this.imageData.data[offset],
      g: this.imageData.data[offset + 1],
      b: this.imageData.data[offset + 2],
      a: this.imageData.data[offset + 3]
    };
  }

  private colorDistance(c1: Color, c2: Color, colorSpace: string): number {
    switch (colorSpace) {
      case 'rgb': return this.rgbDistance(c1, c2);
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
    const dh = Math.min(Math.abs(hsv1.h - hsv2.h), 360 - Math.abs(hsv1.h - hsv2.h));
    const ds = hsv1.s - hsv2.s;
    const dv = hsv1.v - hsv2.v;
    return Math.sqrt(dh * dh + ds * ds * 100 + dv * dv * 100);
  }

  private labDistance(c1: Color, c2: Color): number {
    const lab1 = this.rgbToLab(c1);
    const lab2 = this.rgbToLab(c2);
    const dl = lab1.l - lab2.l;
    const da = lab1.a - lab2.a;
    const db = lab1.b - lab2.b;
    return Math.sqrt(dl * dl + da * da + db * db);
  }

  private rgbToHsv(color: Color): { h: number; s: number; v: number } {
    const r = color.r / 255;
    const g = color.g / 255;
    const b = color.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
      if (max === r) h = ((g - b) / delta) % 6;
      else if (max === g) h = (b - r) / delta + 2;
      else h = (r - g) / delta + 4;
    }
    h = (h * 60 + 360) % 360;

    return { h, s: max === 0 ? 0 : delta / max, v: max };
  }

  private rgbToLab(color: Color): { l: number; a: number; b: number } {
    const r = color.r / 255;
    const g = color.g / 255;
    const b = color.b / 255;

    const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    const z = r * 0.0193 + g * 0.1192 + b * 0.9505;

    const fx = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x + 16/116);
    const fy = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y + 16/116);
    const fz = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z + 16/116);

    return {
      l: 116 * fy - 16,
      a: 500 * (fx - fy),
      b: 200 * (fy - fz)
    };
  }

  private calculateConfidence(pixels: number[], seedColor: Color, options: WandOptions): number {
    if (pixels.length === 0) return 0;

    let totalDistance = 0;
    for (const idx of pixels) {
      const pixelColor = this.getPixelColor(idx);
      totalDistance += this.colorDistance(seedColor, pixelColor, options.colorSpace);
    }

    const avgDistance = totalDistance / pixels.length;
    return Math.max(0, 1 - (avgDistance / options.tolerance));
  }
}
