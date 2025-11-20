export interface Point {
  x: number;
  y: number;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Hole {
  points: Point[];
  area: number;
  boundingBox: Rectangle;
  centroid: Point;
  perimeter: number;
  isInterior: boolean;
  aspectRatio: number;
  circularity: number;
  solidity: number;
}

export interface WandOptions {
  tolerance: number;
  colorSpace: 'rgb' | 'hsv' | 'lab';
  connectivity: 4 | 8;
}

export interface SegmentationResult {
  pixels: number[];
  mask: Uint8ClampedArray;
  confidence: number;
  metadata: {
    algorithm: string;
    executionTime: number;
    memoryUsage: number;
    parameters: WandOptions;
  };
}
