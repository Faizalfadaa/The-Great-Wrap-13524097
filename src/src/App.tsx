import { useState } from "react";
import "./App.css";
import { CanvasBoard } from "./components/CanvasBoard";
import { Header } from "./components/Header";
import { InspectorPanel } from "./components/InspectorPanel";
import { Sidebar } from "./components/Sidebar";
import type { Algorithm, CanvasPoint } from "./types";

function App() {
  const [points, setPoints] = useState<CanvasPoint[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>("Graham Scan");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showStepControls, setShowStepControls] = useState(false);

  return (
    <main className="visualizer-page">
      <Header />

      <div className="visualizer-workspace">
        <Sidebar
          selectedAlgorithm={selectedAlgorithm}
          selectedFile={selectedFile}
          onAlgorithmChange={setSelectedAlgorithm}
          onFileChange={setSelectedFile}
          onGenerate={setPoints}
          onStart={() => setShowStepControls(true)}
        />

        <CanvasBoard
          points={points}
          showStepControls={showStepControls}
          onPointsChange={setPoints}
        />

        <InspectorPanel pointCount={points.length} />
      </div>
    </main>
  );
}

export default App;
