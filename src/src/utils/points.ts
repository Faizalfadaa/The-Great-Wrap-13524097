import type { CanvasPoint } from "../types";

export function createPoint(x: number, y: number): CanvasPoint {
  return {id: Date.now() + Math.random(), x, y,}
}

