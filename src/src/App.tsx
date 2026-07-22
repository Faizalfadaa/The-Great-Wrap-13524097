import { useState } from "react";
import "./App.css";
import { grahamScan } from "./algorithm/grahamscan";
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
  const [hullPoints, setHullPoints] = useState<CanvasPoint[]>([]);
  const [runtimeMs, setRuntimeMs] = useState<number | null>(null);

  const updatePoints = (nextPoints: CanvasPoint[]) => {
    setPoints(nextPoints);
    setHullPoints([]);
    setRuntimeMs(null);
    setShowStepControls(false);
  };

  const handleAlgorithmChange = (algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm);
    setHullPoints([]);
    setRuntimeMs(null);
    setShowStepControls(false);
  };

  const handleStart = () => {
    setShowStepControls(true);

    if (selectedAlgorithm !== "Graham Scan" || points.length < 3) {
      setHullPoints([]);
      setRuntimeMs(null);
      return;
    }

    const startTime = performance.now();
    const computedHull = grahamScan([...points]);
    const endTime = performance.now();

    setHullPoints(computedHull as CanvasPoint[]);
    setRuntimeMs(endTime - startTime);
  };

  return (
    <main className="visualizer-page">
      <Header />

      <div className="visualizer-workspace">
        <Sidebar
          selectedAlgorithm={selectedAlgorithm}
          selectedFile={selectedFile}
          onAlgorithmChange={handleAlgorithmChange}
          onFileChange={setSelectedFile}
          onImportPoints={updatePoints}
          onGenerate={updatePoints}
          onStart={handleStart}
        />

        <CanvasBoard
          points={points}
          hullPoints={hullPoints}
          showStepControls={showStepControls}
          onPointsChange={updatePoints}
        />

        <InspectorPanel
          pointCount={points.length}
          hullCount={hullPoints.length}
          runtimeMs={runtimeMs}
        />
      </div>
    </main>
  );
}

export default App;
