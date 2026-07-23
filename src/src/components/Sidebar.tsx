import type { Point } from "../algorithm/point";
import type { Algorithm } from "../types";
import { AlgorithmSelector } from "./AlgorithmSelector";
import { DatasetGenerator } from "./DatasetGenerator";
import { FileUpload } from "./FileUpload";

type SidebarProps = {
  selectedAlgorithm: Algorithm;
  selectedFile: File | null;
  isLocked: boolean;
  onAlgorithmChange: (algorithm: Algorithm) => void;
  onFileChange: (file: File | null) => void;
  onImportPoints: (points: Point[]) => void;
  onGenerate: (points: Point[]) => void;
  onStart: () => void;
};

export function Sidebar({selectedAlgorithm, selectedFile, isLocked, onAlgorithmChange, onFileChange, onImportPoints, onGenerate, onStart }: SidebarProps) {
  return (
    <aside
      className={`input-sidebar ${isLocked ? "input-sidebar-locked" : ""}`}
      aria-disabled={isLocked}
      aria-label="Visualizer controls"
    >
      <div className="sidebar-lock-content">
        <FileUpload
          selectedFile={selectedFile}
          onFileChange={onFileChange}
          onImportPoints={onImportPoints}
        />
        <DatasetGenerator onGenerate={onGenerate} />
        <AlgorithmSelector
          selectedAlgorithm={selectedAlgorithm}
          onAlgorithmChange={onAlgorithmChange}
        />

        <section className="control-section">
          <button className="start-button" type="button" onClick={onStart}>
            Start
          </button>
        </section>
      </div>
    </aside>
  );
}
