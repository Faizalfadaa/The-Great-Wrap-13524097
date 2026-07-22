import type { Algorithm } from "../types";

type InspectorPanelProps = {
  pointCount: number;
};

export function InspectorPanel({ pointCount }: InspectorPanelProps) {
  return (
    <section className="inspector-panel" aria-label="Visualizer inspector">
      <div className="metric-grid">
        <article>
          <span>Points</span>
          <strong>{pointCount}</strong>
        </article>
        <article>
          <span>Hull</span>
          <strong>-</strong>
        </article>
        <article>
          <span>Runtime</span>
          <strong>- ms</strong>
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
                  <td>-</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

