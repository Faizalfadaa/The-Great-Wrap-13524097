import type { Algorithm } from "../types";

// Initialize properties for Algorithm selector component
type AlgorithmSelectorProps = {
  selectedAlgorithm: Algorithm;
  onAlgorithmChange: (algorithm: Algorithm) => void;
}

// Render algorithm selection using radio buttons
export function AlgorithmSelector({selectedAlgorithm, onAlgorithmChange }: AlgorithmSelectorProps) {
  return (
    <section className="control-section">

      {/* Create radio list for selecting which convex hull algorithm to run */}
      <p className="sidebar-label">Algorithm</p>
      <div className="algorithm-list">

        {/* List of algorithms */}
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
          )
        )}
      </div>
    </section>
  )
}