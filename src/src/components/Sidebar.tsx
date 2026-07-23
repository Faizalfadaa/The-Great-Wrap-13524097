import type { Point } from "../algorithm/point";
import type { Algorithm } from "../types";
import { AlgorithmSelector } from "./AlgorithmSelector";
import { DatasetGenerator } from "./DatasetGenerator";
import { FileUpload } from "./FileUpload";

// Initialize properties for sidebar seciton
type SidebarProps = {
  selectedAlgorithm: Algorithm;
  selectedFile: File | null;
  isLocked: boolean;
  onAlgorithmChange: (algorithm: Algorithm) => void;
  onFileChange: (file: File | null) => void;
  onImportPoints: (points: Point[]) => void;
  onGenerate: (points: Point[]) => void;
  onStart: () => void;
}

// Render Sidebar section
export function Sidebar({selectedAlgorithm, selectedFile, isLocked, onAlgorithmChange, onFileChange, onImportPoints, onGenerate, onStart }: SidebarProps) {
  return (
    <aside
      className={`input-sidebar ${isLocked ? "input-sidebar-locked" : ""}`}
      aria-disabled={isLocked}
      aria-label="Visualizer controls"
    >
      {/* Create all input controls for dataset and algorithm selection in the sidebar */}
      <div className="sidebar-lock-content">

        {/* Upload dataset from CSV or TXT file section */}
        <FileUpload
          selectedFile={selectedFile}
          onFileChange={onFileChange}
          onImportPoints={onImportPoints}
        />

        {/* Generate sample points from selected dataset shape */}
        <DatasetGenerator onGenerate={onGenerate} />

        {/* Choose convex hull algorithm */}
        <AlgorithmSelector
          selectedAlgorithm={selectedAlgorithm}
          onAlgorithmChange={onAlgorithmChange}
        />

        {/* Create start button to start selected algorithm animation */}
        <section className="control-section">
          <button className="start-button" type="button" onClick={onStart}>
            Start
          </button>
        </section>
      </div>
    </aside>
  )
}
