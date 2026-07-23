import type { Point } from "./algorithm/point";

// Process Algorithm types
export type Algorithm = "Graham Scan" | "Jarvis March" | "QuickHull";
export type GeneratorShape = "Random" | "Triangle" | "Rectangle" | "Cluster";

// Step phases for each algorithm
export enum StepPhase {
  SELECT_START = "SELECT_START",
  SORT = "SORT",
  CHECK = "CHECK",
  DISCARD = "DISCARD",
  ACCEPT = "ACCEPT",
  COMPLETE = "COMPLETE",
}

// Data for each step on every process algorithm
export type Step = {
  phase: StepPhase;
  message: string;
  hullPoints: Point[];
  persistentLines: Point[][]; // Two points that make one line
  currentPoint?: Point;
};
