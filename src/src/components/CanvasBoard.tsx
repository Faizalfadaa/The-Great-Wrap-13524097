import { useMemo, useState } from "react";
import { createPoint, type Point } from "../algorithm/point";
import { StepPhase, type Algorithm, type Step } from "../types";
import { PlaybackControls } from "./PlaybackControls";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 700;
const GRID_SIZE = 50;

type ViewBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type CanvasBoardProps = {
  points: Point[];
  hullPoints: Point[];
  animationStep: Step | null;
  selectedAlgorithm: Algorithm;
  showStepControls: boolean;
  isLocked: boolean;
  onPointsChange: (points: Point[]) => void;
  onClear: () => void;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onStop: () => void;
  isPlaying: boolean;
  currentStepIndex: number;
  totalSteps: number;
};

export function CanvasBoard({
  points,
  hullPoints,
  animationStep,
  selectedAlgorithm,
  showStepControls,
  isLocked,
  onPointsChange,
  onClear,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onStop,
  isPlaying,
  currentStepIndex,
  totalSteps,
}: CanvasBoardProps) {
  const [viewBox] = useState<ViewBox>({
    x: -CANVAS_WIDTH / 2,
    y: -CANVAS_HEIGHT / 2,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
  });

  const gridLines = useMemo(() => {
    const verticalLines: number[] = [];
    const horizontalLines: number[] = [];
    const startX = Math.floor(viewBox.x / GRID_SIZE) * GRID_SIZE;
    const endX = viewBox.x + viewBox.width;
    const startY = Math.floor(viewBox.y / GRID_SIZE) * GRID_SIZE;
    const endY = viewBox.y + viewBox.height;

    for (let x = startX; x <= endX; x += GRID_SIZE) {
      verticalLines.push(x);
    }

    for (let y = startY; y <= endY; y += GRID_SIZE) {
      horizontalLines.push(y);
    }

    return { verticalLines, horizontalLines };
  }, [viewBox]);

  const hullPointRefs = useMemo(() => new Set(hullPoints), [hullPoints])
  const hullPathPoints = hullPoints.map((point) => `${point.x},${-point.y}`).join(" ")
  const persistentLines = animationStep?.persistentLines ?? []
  const selectedPointRefs = useMemo(() => new Set(persistentLines.map((line) => line[1])), [persistentLines])
  const sortingStartPoint = persistentLines[0]?.[0] ?? null
  const currentPoint = animationStep?.currentPoint ?? null
  const shouldDrawProcessChain = selectedAlgorithm !== "QuickHull"

  const getCanvasPoint = (svg: SVGSVGElement,clientX: number, clientY: number) => {
    const screenCTM = svg.getScreenCTM();

    if (!screenCTM) {
      return null;
    }

    const svgPoint = svg.createSVGPoint();
    svgPoint.x = clientX;
    svgPoint.y = clientY;

    return svgPoint.matrixTransform(screenCTM.inverse());
  }

  const handleCanvasPointerUp = (event: React.PointerEvent<SVGSVGElement>) => {
    if (isLocked) {
      return;
    }

    if (event.target !== event.currentTarget) {
      return;
    }

    const canvasPoint = getCanvasPoint(
      event.currentTarget,
      event.clientX,
      event.clientY,
    );

    if (canvasPoint) {
      onPointsChange([...points, createPoint(canvasPoint.x, -canvasPoint.y)]);
    }
  };

  const clearCanvas = () => {
    if (isLocked) {
      return;
    }

    onClear()
  }

  const deletePoint = (pointToDelete: Point) => {
    if (isLocked) {
      return;
    }

    onPointsChange(points.filter((point) => point !== pointToDelete))
  }

  return (
    <section className={`visualization-board ${isLocked ? "visualization-board-locked" : ""}`}>
      <p className="canvas-instruction">
        Click canvas to insert point |
        Click point to delete
      </p>

      <div className="canvas-toolbar" aria-label="Canvas actions">
        <button
          type="button"
          disabled={points.length === 0 || isLocked}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={clearCanvas}
        >
          Clear
        </button>
      </div>

      <svg
        className="visualization-canvas"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Convex hull visualization board"
        onPointerUp={handleCanvasPointerUp}
      >
        <g className="canvas-grid">
          {gridLines.verticalLines.map((x) => (
            <line
              key={`vertical-${x}`}
              x1={x}
              x2={x}
              y1={viewBox.y}
              y2={viewBox.y + viewBox.height}
            />
          ))}

          {gridLines.horizontalLines.map((y) => (
            <line
              key={`horizontal-${y}`}
              x1={viewBox.x}
              x2={viewBox.x + viewBox.width}
              y1={y}
              y2={y}
            />
          ))}
        </g>

        <g className="canvas-axis">
          <line
            x1={viewBox.x}
            x2={viewBox.x + viewBox.width}
            y1="0"
            y2="0"
          />
          <line
            x1="0"
            x2="0"
            y1={viewBox.y}
            y2={viewBox.y + viewBox.height}
          />
        </g>

        {hullPoints.length >= 2 && animationStep?.phase === StepPhase.COMPLETE ? (
          <polygon className="canvas-hull" points={hullPathPoints} />
        ) : null}

        {shouldDrawProcessChain && hullPoints.length >= 2 && animationStep?.phase !== StepPhase.COMPLETE ? (
          <polyline className="canvas-hull-chain" points={hullPathPoints} />
        ) : null}

        {persistentLines.length > 0 ? (
          <g className="canvas-sorting-lines">
            {persistentLines.map((line) => (
              <line
                key={`persistent-${line[0].x}-${line[0].y}-${line[1].x}-${line[1].y}`}
                x1={line[0].x}
                y1={-line[0].y}
                x2={line[1].x}
                y2={-line[1].y}
              />
            ))}
          </g>
        ) : null}

        {selectedAlgorithm !== "QuickHull" && animationStep?.phase !== StepPhase.SORT && hullPoints.length > 0 && currentPoint ? (
          <line
            className="canvas-candidate-edge"
            x1={hullPoints[hullPoints.length - 1].x}
            y1={-hullPoints[hullPoints.length - 1].y}
            x2={currentPoint.x}
            y2={-currentPoint.y}
          />
        ) : null}

        {points.map((point, index) => (
          <circle
            className={
              [
                "canvas-point",
                hullPointRefs.has(point) ? "canvas-point-hull" : "",
                selectedPointRefs.has(point) ? "canvas-point-sorted" : "",
                point === sortingStartPoint ? "canvas-point-pivot" : "",
                point === currentPoint ? "canvas-point-current" : "",
              ]
                .filter(Boolean)
                .join(" ")
            }
            key={`${index}-${point.x}-${point.y}`}
            cx={point.x}
            cy={-point.y}
            r="7"
            onClick={() => deletePoint(point)}
          />
        ))}
      </svg>

      <div className="canvas-footer">
        <div className="legend">
          <span>
            <i className="legend-dot point" />
            Point
          </span>
          <span>
            <i className="legend-dot hull" />
            Hull Point
          </span>
          <span>
            <i className="legend-line" />
            Hull Edge
          </span>
        </div>
      </div>

      {showStepControls && (
        <PlaybackControls
          currentStepIndex={currentStepIndex}
          isPlaying={isPlaying}
          totalSteps={totalSteps}
          onNext={onNext}
          onPause={onPause}
          onPlay={onPlay}
          onPrevious={onPrevious}
          onStop={onStop}
        />
      )}
    </section>
  );
}

