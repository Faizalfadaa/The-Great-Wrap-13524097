import { useMemo, useState } from "react";
import type { CanvasPoint } from "../types";
import { createPoint } from "../utils/points";
import { PlaybackControls } from "./PlaybackControls";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 700;
const GRID_SIZE = 50;
const PAN_THRESHOLD = 4;

type ViewBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type PanState = {
  startClientX: number;
  startClientY: number;
  startViewBoxX: number;
  startViewBoxY: number;
  hasMoved: boolean;
};

type CanvasBoardProps = {
  points: CanvasPoint[];
  hullPoints: CanvasPoint[];
  showStepControls: boolean;
  onPointsChange: (points: CanvasPoint[]) => void;
};

export function CanvasBoard({points, hullPoints, showStepControls, onPointsChange}: CanvasBoardProps) {
  const [draggingPointId, setDraggingPointId] = useState<number | null>(null);
  const [viewBox, setViewBox] = useState<ViewBox>({
    x: -CANVAS_WIDTH / 2,
    y: -CANVAS_HEIGHT / 2,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
  });
  const [panState, setPanState] = useState<PanState | null>(null);

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

  const hullPointIds = useMemo(() => new Set(hullPoints.map((point) => point.id)), [hullPoints])
  const hullPathPoints = hullPoints.map((point) => `${point.x},${point.y}`).join(" ")
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

  const handleCanvasPointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    setPanState({startClientX: event.clientX, startClientY: event.clientY,startViewBoxX: viewBox.x, startViewBoxY: viewBox.y, hasMoved: false})
  }

  const handleCanvasPointerMove = (event: React.PointerEvent<SVGSVGElement>,) => {
    if (draggingPointId !== null) {
      const canvasPoint = getCanvasPoint(event.currentTarget,event.clientX,event.clientY);

      if (!canvasPoint) {
        return;
      }

      onPointsChange(
        points.map((point) =>
          point.id === draggingPointId
            ? { ...point, x: canvasPoint.x, y: canvasPoint.y }
            : point,
        ),
      );
      return;
    }

    if (!panState) {
      return;
    }

    const svgRect = event.currentTarget.getBoundingClientRect();
    const clientDeltaX = event.clientX - panState.startClientX;
    const clientDeltaY = event.clientY - panState.startClientY;
    const hasMoved =
      panState.hasMoved ||
      Math.hypot(clientDeltaX, clientDeltaY) > PAN_THRESHOLD;

    if (!hasMoved) {
      return;
    }

    setViewBox((currentViewBox) => ({
      ...currentViewBox,
      x:
        panState.startViewBoxX -
        (clientDeltaX * currentViewBox.width) / svgRect.width,
      y:
        panState.startViewBoxY -
        (clientDeltaY * currentViewBox.height) / svgRect.height,
    }));

    if (hasMoved !== panState.hasMoved) {
      setPanState((currentPanState) =>
        currentPanState ? { ...currentPanState, hasMoved } : null,
      );
    }
  };

  const handleCanvasPointerUp = (event: React.PointerEvent<SVGSVGElement>) => {
    if (panState && !panState.hasMoved) {
      const canvasPoint = getCanvasPoint(
        event.currentTarget,
        event.clientX,
        event.clientY,
      );

      if (canvasPoint) {
        onPointsChange([...points, createPoint(canvasPoint.x, canvasPoint.y)]);
      }
    }

    setPanState(null);
    setDraggingPointId(null);
  };

  const resetView = () => {
    setViewBox({
      x: -CANVAS_WIDTH / 2,
      y: -CANVAS_HEIGHT / 2,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
    });
  };

  return (
    <section className="visualization-board">
      <p className="canvas-instruction">
        Klik canvas untuk menambah titik.
      </p>

      <div className="canvas-toolbar" aria-label="Canvas actions">
        <button type="button" onClick={resetView}>
          Reset View
        </button>
        <button
          type="button"
          disabled={points.length === 0}
          onClick={() => onPointsChange([])}
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
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        onPointerLeave={() => {
          setPanState(null);
          setDraggingPointId(null);
        }}
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

        {hullPoints.length >= 2 ? (
          <polygon className="canvas-hull" points={hullPathPoints} />
        ) : null}

        {points.map((point) => (
          <circle
            className={
              hullPointIds.has(point.id)
                ? "canvas-point canvas-point-hull"
                : "canvas-point"
            }
            key={point.id}
            cx={point.x}
            cy={point.y}
            r="7"
            onPointerDown={(event) => {
              event.stopPropagation();
              event.currentTarget.setPointerCapture(event.pointerId);
              setDraggingPointId(point.id);
            }}
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
        <p>
          {hullPoints.length > 0
            ? `Convex Hull Graham Scan menghasilkan ${hullPoints.length} titik hull.`
            : "Convex Hull output belum dihitung."}
        </p>
      </div>

      {showStepControls && <PlaybackControls />}
    </section>
  );
}

