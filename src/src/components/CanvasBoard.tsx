import { useEffect, useMemo, useRef, useState } from "react";
import { createPoint, type Point } from "../algorithm/point";
import { StepPhase, type Algorithm, type Step } from "../types";
import { PlaybackControls } from "./PlaybackControls";

// Inizialize canvas size, grid spacing, and point sizee
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 700;
const GRID_SIZE = 30;
const POINT_RADIUS = 7;

// Define viewbox for the canvas
type ViewBox = {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Initialize properties for canvas components
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
}

// Render canvas board function
export function CanvasBoard({points,hullPoints, animationStep, selectedAlgorithm, showStepControls, isLocked, onPointsChange, onClear, onPlay, onPause, onNext, onPrevious, onStop, isPlaying, currentStepIndex, totalSteps}: CanvasBoardProps) {
  // SVG element reference to measure rendered canvas scale
  const svgRef = useRef<SVGSVGElement | null>(null)

  // Fixed viewBox for coordinate system
  const [viewBox] = useState<ViewBox>({ x: -CANVAS_WIDTH / 2, y: -CANVAS_HEIGHT / 2, width: CANVAS_WIDTH, height: CANVAS_HEIGHT})

  // Vertical radius is adjusted so points stay visually circular
  const [pointRadiusY, setPointRadiusY] = useState(POINT_RADIUS)

  // Create grid line coordinates based on current viewBox
  const gridLines = useMemo(() => {
    const verticalLines: number[] = [];
    const horizontalLines: number[] = [];
    const startX = Math.floor(viewBox.x / GRID_SIZE) * GRID_SIZE;
    const endX = viewBox.x + viewBox.width;
    const startY = Math.floor(viewBox.y / GRID_SIZE) * GRID_SIZE;
    const endY = viewBox.y + viewBox.height;

    // Create vertical and horizontal line for the coordinate system
    for (let x = startX; x <= endX; x += GRID_SIZE) {
      verticalLines.push(x);
    }

    for (let y = startY; y <= endY; y += GRID_SIZE) {
      horizontalLines.push(y);
    }

    return { verticalLines, horizontalLines };
  }, [viewBox])

  // References used to decide point visual state
  const hullPointRefs = useMemo(() => new Set(hullPoints), [hullPoints])

  // Convert hull points to SVG polyline or polygon string
  const hullPathPoints = hullPoints.map((point) => `${point.x},${-point.y}`).join(" ")

  // Lines from current animation step
  const persistentLines = animationStep?.persistentLines ?? []

  // Points connected by persistent lines are highlighted
  const selectedPointRefs = useMemo(() => new Set(persistentLines.map((line) => line[1])), [persistentLines])

  // First point of persistent lines is treated as start marker
  const sortingStartPoint = persistentLines[0]?.[0] ?? null

  // Current point being processed by animation
  const currentPoint = animationStep?.currentPoint ?? null

  // QuickHull should not draw temporary hull chain before complete
  const shouldDrawProcessChain = selectedAlgorithm !== "QuickHull"

  // Keep points visually circular when the canvas is stretched
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) {
      return
    }

    const updatePointRadius = () => {
      const rect = svg.getBoundingClientRect()
      const scaleX = rect.width / viewBox.width
      const scaleY = rect.height / viewBox.height

      if (scaleY > 0) {
        setPointRadiusY(POINT_RADIUS * (scaleX / scaleY))
      }
    }

    updatePointRadius()
    const resizeObserver = new ResizeObserver(updatePointRadius)
    resizeObserver.observe(svg)

    return () => resizeObserver.disconnect()
  }, [viewBox])

  // Get clicked position inside the canvas
  const getCanvasPoint = (svg: SVGSVGElement, clientX: number, clientY: number) => {
    const screenCTM = svg.getScreenCTM()
    if (!screenCTM) {
      return null
    }

    const svgPoint = svg.createSVGPoint();
    svgPoint.x = clientX;
    svgPoint.y = clientY

    return svgPoint.matrixTransform(screenCTM.inverse());
  }

  // Add a new point when user clicks empty canvas.
  const handleCanvasPointerUp = (event: React.PointerEvent<SVGSVGElement>) => {
    // Cant insert point if its locked
    if (isLocked) {
      return
    }

    if (event.target !== event.currentTarget) {
      return
    }

    // Create point to canvas
    const canvasPoint = getCanvasPoint(event.currentTarget, event.clientX, event.clientY)
    if (canvasPoint) {
      onPointsChange([...points, createPoint(canvasPoint.x, -canvasPoint.y)]);
    }
  }

  // Clear all points from canvas
  const clearCanvas = () => {
    if (isLocked) {
      return
    }

    onClear()
  }

  // Delete a point when user clicks existing point
  const deletePoint = (pointToDelete: Point) => {
    if (isLocked) {
      return
    }

    onPointsChange(points.filter((point) => point !== pointToDelete))
  }

  return (
    <section className={`visualization-board ${isLocked ? "visualization-board-locked" : ""}`}>

      {/* Instruction text above canvas. */}
      <p className="canvas-instruction">
        Click canvas to insert point |
        Click point to delete
      </p>

      {/* Canvas actions on top of the canvas*/}
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

      {/* Canvas contains grid, axis, points, and algorithm visualization */}
      <svg
        ref={svgRef}
        className="visualization-canvas"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Convex hull visualization board"
        onPointerUp={handleCanvasPointerUp}
      >
        {/* Background grid lines on canvas*/}
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

        {/* Main X and Y axis on canvas */}
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

        {/* Final convex hull line when the hull only contains two points */}
        {hullPoints.length === 2 && animationStep?.phase === StepPhase.COMPLETE ? (
          <line
            className="canvas-hull-chain"
            x1={hullPoints[0].x}
            y1={-hullPoints[0].y}
            x2={hullPoints[1].x}
            y2={-hullPoints[1].y}
          />
        ) : null}

        {/* Final convex hull polygon after animation completes */}
        {hullPoints.length >= 3 && animationStep?.phase === StepPhase.COMPLETE ? (
          <polygon className="canvas-hull" points={hullPathPoints} />
        ) : null}

        {/* Temporary hull chain for algorithms that build hull in order */}
        {shouldDrawProcessChain && hullPoints.length >= 2 && animationStep?.phase !== StepPhase.COMPLETE ? (
          <polyline className="canvas-hull-chain" points={hullPathPoints} />
        ) : null}

        {/* Persistent process lines such as sorting rays or active QuickHull segments */}
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

        {/* Candidate edge used by Graham Scan and Jarvis March animation */}
        {selectedAlgorithm !== "QuickHull" && animationStep?.phase !== StepPhase.SORT && hullPoints.length > 0 && currentPoint ? (
          <line
            className="canvas-candidate-edge"
            x1={hullPoints[hullPoints.length - 1].x}
            y1={-hullPoints[hullPoints.length - 1].y}
            x2={currentPoint.x}
            y2={-currentPoint.y}
          />
        ) : null}

        {/* Render every input point and apply highlight classes based on current step */}
        {points.map((point, index) => (
          <ellipse
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
            rx={POINT_RADIUS}
            ry={pointRadiusY}
            onClick={() => deletePoint(point)}
          />
        ))}
      </svg>

      {/* Canvas legend */}
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

      {/* Playback controls for generated animation steps */}
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
  )
}

