import type { Algorithm } from "../types";

type InspectorPanelProps = {
  pointCount: number;
  hullCount: number;
  runtimeMs: number | null;
  benchmarkResults: Record<Algorithm, number | null>;
};

export function InspectorPanel({pointCount, hullCount, runtimeMs, benchmarkResults}: InspectorPanelProps) {
  const formattedRuntime = runtimeMs === null ? "-" : runtimeMs.toFixed(2);
  const formatRuntime = (runtime: number | null) =>
    runtime === null ? "-" : `${runtime.toFixed(2)} ms`;

  return (
    <section className="inspector-panel" aria-label="Visualizer inspector">
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

      <div className="table-panel">
        <div className="panel-heading">
          <p className="sidebar-label">Benchmark</p>
          <span>UI placeholder</span>
        </div>
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
    </section>
  );
}
