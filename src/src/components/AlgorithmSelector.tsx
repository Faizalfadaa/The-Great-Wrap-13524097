import type { Algorithm } from "../types";

type AlgorithmSelectorProps = {
  selectedAlgorithm: Algorithm;
  onAlgorithmChange: (algorithm: Algorithm) => void;
};

export function AlgorithmSelector({selectedAlgorithm, onAlgorithmChange }: AlgorithmSelectorProps) {
  return (
    <section className="control-section">
      <p className="sidebar-label">Algorithm</p>
      <div className="algorithm-list">
        {(["Graham Scan", "Jarvis March", "QuickHull"] as Algorithm[]).map(
          (algorithm) => (
            <label className="radio-card" key={algorithm}>
              <input
                checked={selectedAlgorithm == algorithm}
                name="algorithm"
                type="radio"
                onChange={() => onAlgorithmChange(algorithm)}
              />
              <span>{algorithm}</span>
            </label>
          ),
        )}
      </div>
    </section>
  );
}

