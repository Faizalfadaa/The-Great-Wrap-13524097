import type { Algorithm, CanvasPoint } from "../types";
import { AlgorithmSelector } from "./AlgorithmSelector";
import { DatasetGenerator } from "./DatasetGenerator";
import { FileUpload } from "./FileUpload";

type SidebarProps = {
  selectedAlgorithm: Algorithm;
  selectedFile: File | null;
  onAlgorithmChange: (algorithm: Algorithm) => void;
  onFileChange: (file: File | null) => void;
  onGenerate: (points: CanvasPoint[]) => void;
  onStart: () => void;
};

export function Sidebar({selectedAlgorithm, selectedFile, onAlgorithmChange, onFileChange, onGenerate, onStart,}: SidebarProps) {
  return (
    <aside className="input-sidebar" aria-label="Visualizer controls">
      <FileUpload selectedFile={selectedFile} onFileChange={onFileChange} />
      <AlgorithmSelector
        selectedAlgorithm={selectedAlgorithm}
        onAlgorithmChange={onAlgorithmChange}
      />
      <DatasetGenerator onGenerate={onGenerate} />

      <section className="control-section">
        <button className="start-button" type="button" onClick={onStart}>
          Start
        </button>
      </section>
    </aside>
  );
}

