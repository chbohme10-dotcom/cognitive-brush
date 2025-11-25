// Edge detection and path finding utilities for Magnetic Lasso Tool

export interface Point {
  x: number;
  y: number;
}

export interface EdgeMapData {
  data: Float32Array;
  width: number;
  height: number;
}

/**
 * Compute edge map using Sobel operator
 */
export function computeEdgeMap(imageData: ImageData): EdgeMapData {
  const { width, height, data } = imageData;
  const edgeMap = new Float32Array(width * height);
  
  // Sobel kernels
  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0, gy = 0;
      
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          const intensity = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
          const kernelIdx = (ky + 1) * 3 + (kx + 1);
          
          gx += intensity * sobelX[kernelIdx];
          gy += intensity * sobelY[kernelIdx];
        }
      }
      
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      edgeMap[y * width + x] = magnitude;
    }
  }
  
  // Normalize to 0-1 range
  let max = 0;
  for (let i = 0; i < edgeMap.length; i++) {
    if (edgeMap[i] > max) max = edgeMap[i];
  }
  if (max > 0) {
    for (let i = 0; i < edgeMap.length; i++) {
      edgeMap[i] /= max;
    }
  }
  
  return { data: edgeMap, width, height };
}

/**
 * Find edge path between two points using A* algorithm
 */
export function findEdgePath(
  start: Point,
  end: Point,
  edgeMap: EdgeMapData,
  searchRadius: number = 20
): Point[] {
  const { data, width, height } = edgeMap;
  
  // Clamp points to image bounds
  start = { x: Math.max(0, Math.min(width - 1, Math.floor(start.x))), y: Math.max(0, Math.min(height - 1, Math.floor(start.y))) };
  end = { x: Math.max(0, Math.min(width - 1, Math.floor(end.x))), y: Math.max(0, Math.min(height - 1, Math.floor(end.y))) };
  
  const dist = (a: Point, b: Point) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  
  if (dist(start, end) > searchRadius * 2) {
    return [start, end]; // Too far, return straight line
  }
  
  const getKey = (p: Point) => `${p.x},${p.y}`;
  
  const openSet = new Set<string>([getKey(start)]);
  const cameFrom = new Map<string, Point>();
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  
  gScore.set(getKey(start), 0);
  fScore.set(getKey(start), dist(start, end));
  
  const neighbors = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  
  while (openSet.size > 0) {
    // Find node with lowest fScore
    let current: Point | null = null;
    let lowestF = Infinity;
    for (const key of openSet) {
      const f = fScore.get(key) || Infinity;
      if (f < lowestF) {
        lowestF = f;
        const [x, y] = key.split(',').map(Number);
        current = { x, y };
      }
    }
    
    if (!current) break;
    
    if (dist(current, end) < 1.5) {
      // Reconstruct path
      const path: Point[] = [end];
      let key = getKey(current);
      while (cameFrom.has(key)) {
        const [x, y] = key.split(',').map(Number);
        path.unshift({ x, y });
        key = getKey(cameFrom.get(key)!);
      }
      return path;
    }
    
    openSet.delete(getKey(current));
    
    for (const [dx, dy] of neighbors) {
      const neighbor = { x: current.x + dx, y: current.y + dy };
      
      if (neighbor.x < 0 || neighbor.x >= width || neighbor.y < 0 || neighbor.y >= height) {
        continue;
      }
      
      const edgeStrength = data[neighbor.y * width + neighbor.x];
      const moveCost = (1.0 - edgeStrength) * Math.sqrt(dx * dx + dy * dy);
      const tentativeG = (gScore.get(getKey(current)) || Infinity) + moveCost;
      
      const nKey = getKey(neighbor);
      if (tentativeG < (gScore.get(nKey) || Infinity)) {
        cameFrom.set(nKey, current);
        gScore.set(nKey, tentativeG);
        fScore.set(nKey, tentativeG + dist(neighbor, end));
        openSet.add(nKey);
      }
    }
  }
  
  return [start, end]; // Fallback to straight line
}

/**
 * Simplify path using Douglas-Peucker algorithm
 */
export function simplifyPath(points: Point[], tolerance: number = 1.0): Point[] {
  if (points.length <= 2) return points;
  
  const perpendicularDistance = (point: Point, lineStart: Point, lineEnd: Point): number => {
    const dx = lineEnd.x - lineStart.x;
    const dy = lineEnd.y - lineStart.y;
    const mag = Math.sqrt(dx * dx + dy * dy);
    if (mag < 0.00001) return Math.sqrt((point.x - lineStart.x) ** 2 + (point.y - lineStart.y) ** 2);
    const u = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / (mag * mag);
    const closestX = lineStart.x + u * dx;
    const closestY = lineStart.y + u * dy;
    return Math.sqrt((point.x - closestX) ** 2 + (point.y - closestY) ** 2);
  };
  
  const douglasPeucker = (pts: Point[], eps: number): Point[] => {
    let maxDist = 0;
    let index = 0;
    const end = pts.length - 1;
    
    for (let i = 1; i < end; i++) {
      const dist = perpendicularDistance(pts[i], pts[0], pts[end]);
      if (dist > maxDist) {
        maxDist = dist;
        index = i;
      }
    }
    
    if (maxDist > eps) {
      const left = douglasPeucker(pts.slice(0, index + 1), eps);
      const right = douglasPeucker(pts.slice(index), eps);
      return [...left.slice(0, -1), ...right];
    }
    
    return [pts[0], pts[end]];
  };
  
  return douglasPeucker(points, tolerance);
}

/**
 * Convert path to selection mask
 */
export function pathToSelection(path: Point[], width: number, height: number): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);
  
  if (path.length < 3) return ctx.getImageData(0, 0, width, height);
  
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(path[i].x, path[i].y);
  }
  ctx.closePath();
  ctx.fill();
  
  return ctx.getImageData(0, 0, width, height);
}
