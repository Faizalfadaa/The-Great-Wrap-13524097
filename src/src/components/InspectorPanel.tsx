import type { Algorithm, Step } from "../types";

// Initialize properties for Inspector panel component
type InspectorPanelProps = {
  pointCount: number;
  hullCount: number;
  runtimeMs: number | null;
  benchmarkResults: Record<Algorithm, number | null>;
  animationStep: Step | null;
}

// Render Inspector panel section function
export function InspectorPanel({pointCount, hullCount, runtimeMs, benchmarkResults, animationStep}: InspectorPanelProps) {
  // Format current selected algorithm runtime
  const formattedRuntime = runtimeMs === null ? "-" : runtimeMs

  // Format benchmark runtime for each algorithm row.
  const formatRuntime = (runtime: number | null) =>runtime === null ? "-" : `${runtime} ms`

  return (
    <section className="inspector-panel" aria-label="Visualizer inspector">

      {/* Summary cards for current canvas and algorithm output */}
      <p className="sidebar-label">Algorithm Statistics</p>
      <div className="metric-grid">
        <article>
          <span>Points</span>
          <strong>{pointCount}</strong>
        </article>
        <article>
          <span>Hull</span>
          <strong>{hullCount > 0 ? hullCount : "-"}</strong>
        </article>
        <article>
          <span>Runtime</span>
          <strong>{formattedRuntime} ms</strong>
        </article>
      </div>

      {/* Create benchmark table that stores last measured runtime for each algorithm */}
      <div className="table-panel">
        <p className="sidebar-label">Benchmark Algorithm</p>
        <table>
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Points</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {(["Graham Scan", "Jarvis March", "QuickHull"] as Algorithm[]).map(
              (algorithm) => (
                <tr key={algorithm}>
                  <td>{algorithm}</td>
                  <td>{pointCount}</td>
                  <td>{formatRuntime(benchmarkResults[algorithm])}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      {/* Create logger that shows message from the current animation step */}
      <div className="logger-panel">
        <p className="sidebar-label">Logger</p>
        <div className="logger-output">
          {animationStep ? animationStep.message : "No algorithm process running"}
        </div>
      </div>
    </section>
  )
}
