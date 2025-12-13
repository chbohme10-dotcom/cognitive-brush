import { Point } from '@/types/segmentation';

/**
 * Marching Squares Algorithm for extracting smooth selection contours
 * Converts binary mask to vector path for anti-aliased edges
 */
export class MarchingSquaresContour {
  private mask: Uint8ClampedArray;
  private width: number;
  private height: number;

  constructor(mask: Uint8ClampedArray, width: number, height: number) {
    this.mask = mask;
    this.width = width;
    this.height = height;
  }

  /**
   * Extract contour paths from binary mask
   * Returns array of closed paths (for multiple disconnected regions)
   */
  extractContours(): Point[][] {
    const contours: Point[][] = [];
    const visited = new Set<string>();
    
    // Find all contour starting points
    for (let y = 0; y < this.height - 1; y++) {
      for (let x = 0; x < this.width - 1; x++) {
        const cell = this.getCellType(x, y);
        
        // Look for cells that cross the boundary
        if (cell > 0 && cell < 15) {
          const key = `${x},${y}`;
          if (!visited.has(key)) {
            const contour = this.traceContour(x, y, visited);
            if (contour.length > 2) {
              contours.push(contour);
            }
          }
        }
      }
    }
    
    return contours;
  }

  private traceContour(startX: number, startY: number, visited: Set<string>): Point[] {
    const contour: Point[] = [];
    let x = startX;
    let y = startY;
    let prevDir = -1;
    
    const maxIterations = this.width * this.height;
    let iterations = 0;
    
    do {
      const key = `${x},${y}`;
      visited.add(key);
      
      const cell = this.getCellType(x, y);
      const edge = this.getEdgePoint(x, y, cell);
      
      if (edge) {
        contour.push(edge);
      }
      
      // Determine next cell based on cell type
      const nextDir = this.getNextDirection(cell, prevDir);
      
      switch (nextDir) {
        case 0: y--; break; // up
        case 1: x++; break; // right
        case 2: y++; break; // down
        case 3: x--; break; // left
      }
      
      prevDir = nextDir;
      iterations++;
      
      if (x < 0 || x >= this.width - 1 || y < 0 || y >= this.height - 1) {
        break;
      }
      
    } while ((x !== startX || y !== startY) && iterations < maxIterations);
    
    return contour;
  }

  private getCellType(x: number, y: number): number {
    const tl = this.getMaskValue(x, y) ? 8 : 0;
    const tr = this.getMaskValue(x + 1, y) ? 4 : 0;
    const br = this.getMaskValue(x + 1, y + 1) ? 2 : 0;
    const bl = this.getMaskValue(x, y + 1) ? 1 : 0;
    return tl | tr | br | bl;
  }

  private getMaskValue(x: number, y: number): boolean {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return false;
    }
    return this.mask[y * this.width + x] > 127;
  }

  private getEdgePoint(x: number, y: number, cell: number): Point | null {
    // Linear interpolation for smoother edges
    switch (cell) {
      case 1: case 14: return { x: x, y: y + 0.5 };
      case 2: case 13: return { x: x + 0.5, y: y + 1 };
      case 3: case 12: return { x: x, y: y + 0.5 };
      case 4: case 11: return { x: x + 1, y: y + 0.5 };
      case 5: return { x: x + 0.5, y: y };
      case 6: case 9: return { x: x + 0.5, y: y + 1 };
      case 7: case 8: return { x: x, y: y + 0.5 };
      case 10: return { x: x + 0.5, y: y };
      default: return null;
    }
  }

  private getNextDirection(cell: number, prevDir: number): number {
    // Direction: 0=up, 1=right, 2=down, 3=left
    const lookup: { [key: number]: number } = {
      1: 3, 2: 2, 3: 3, 4: 1, 5: 0, 6: 2, 7: 3,
      8: 0, 9: 0, 10: 1, 11: 1, 12: 0, 13: 2, 14: 1
    };
    
    // Handle ambiguous cases (saddle points)
    if (cell === 5 || cell === 10) {
      return prevDir >= 0 ? prevDir : lookup[cell];
    }
    
    return lookup[cell] ?? 0;
  }

  /**
   * Simplify contour using Douglas-Peucker algorithm
   */
  static simplifyContour(points: Point[], tolerance: number = 1.0): Point[] {
    if (points.length <= 2) return points;
    
    const sqTolerance = tolerance * tolerance;
    
    const getSqDist = (p: Point, p1: Point, p2: Point): number => {
      let x = p1.x, y = p1.y;
      let dx = p2.x - x, dy = p2.y - y;
      
      if (dx !== 0 || dy !== 0) {
        const t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);
        if (t > 1) { x = p2.x; y = p2.y; }
        else if (t > 0) { x += dx * t; y += dy * t; }
      }
      
      dx = p.x - x; dy = p.y - y;
      return dx * dx + dy * dy;
    };
    
    const simplify = (start: number, end: number): Point[] => {
      let maxDist = 0;
      let maxIdx = 0;
      
      for (let i = start + 1; i < end; i++) {
        const dist = getSqDist(points[i], points[start], points[end]);
        if (dist > maxDist) {
          maxDist = dist;
          maxIdx = i;
        }
      }
      
      if (maxDist > sqTolerance) {
        const left = simplify(start, maxIdx);
        const right = simplify(maxIdx, end);
        return [...left.slice(0, -1), ...right];
      }
      
      return [points[start], points[end]];
    };
    
    return simplify(0, points.length - 1);
  }

  /**
   * Convert contour to SVG path string
   */
  static toSVGPath(contour: Point[]): string {
    if (contour.length === 0) return '';
    
    let path = `M ${contour[0].x} ${contour[0].y}`;
    for (let i = 1; i < contour.length; i++) {
      path += ` L ${contour[i].x} ${contour[i].y}`;
    }
    path += ' Z';
    
    return path;
  }
}
