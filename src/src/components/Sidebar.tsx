import type { Algorithm, CanvasPoint } from "../types";
import { AlgorithmSelector } from "./AlgorithmSelector";
import { DatasetGenerator } from "./DatasetGenerator";
import { FileUpload } from "./FileUpload";

type SidebarProps = {
  selectedAlgorithm: Algorithm;
  selectedFile: File | null;
  onAlgorithmChange: (algorithm: Algorithm) => void;
  onFileChange: (file: File | null) => void;
  onImportPoints: (points: CanvasPoint[]) => void;
  onGenerate: (points: CanvasPoint[]) => void;
  onStart: () => void;
};

export function Sidebar({selectedAlgorithm, selectedFile, onAlgorithmChange, onFileChange, onImportPoints, onGenerate, onStart }: SidebarProps) {
  return (
    <aside className="input-sidebar" aria-label="Visualizer controls">
      <FileUpload
        selectedFile={selectedFile}
        onFileChange={onFileChange}
        onImportPoints={onImportPoints}
      />
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
