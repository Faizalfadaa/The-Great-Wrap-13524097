import { useEffect, useState } from "react";
import "./App.css";
import { grahamScan } from "./algorithm/grahamscan";
import { jarvisMarch } from "./algorithm/jarvismarch";
import { quickHull } from "./algorithm/quickhull";
import { Point } from "./algorithm/point";
import { CanvasBoard } from "./components/CanvasBoard";
import { Header } from "./components/Header";
import { InspectorPanel } from "./components/InspectorPanel";
import { Sidebar } from "./components/Sidebar";
import type { Algorithm, Step } from "./types";

// Main component of application
function App() {
  // Store all points that are displayed on the canvas
  const [points, setPoints] = useState<Point[]>([])

  // Store current selected algorithm from the sidebar
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>("Graham Scan");

  // Store selected upload file name/data state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Control whether playback controls are visible
  const [showStepControls, setShowStepControls] = useState(false);

  // Store hull points from the current animation step
  const [hullPoints, setHullPoints] = useState<Point[]>([]);

  // Store algorithm calculation time
  const [runtimeMs, setRuntimeMs] = useState<number | null>(null);

  // Store latest runtime result for each algorithm
  const [benchmarkResults, setBenchmarkResults] = useState<Record<Algorithm, number | null>>({"Graham Scan": null,"Jarvis March": null,QuickHull: null});

  // Force canvas remount when dataset is replaced
  const [canvasVersion, setCanvasVersion] = useState(0);

  // Store all animation steps returned by the selected algorithm
  const [animationSteps, setAnimationSteps] = useState<Step[]>([]);

  // Store current animation step index
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Store playback running state
  const [isPlaying, setIsPlaying] = useState(false);

  // Get active step data for canvas and logger
  const currentAnimationStep = animationSteps[currentStepIndex] ?? null;

  // Lock sidebar and canvas while animation is not finished
  const isAnimationLocked = showStepControls && animationSteps.length > 0 && currentStepIndex < animationSteps.length - 1;

  // Update point list and reset all derived visualization state
  const updatePoints = (nextPoints: Point[]) => {
    setPoints(nextPoints);
    setHullPoints([]);
    setRuntimeMs(null);
    setBenchmarkResults({"Graham Scan": null, "Jarvis March": null, QuickHull: null});
    setShowStepControls(false);
    setAnimationSteps([]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Replace whole dataset and remount canvas state
  const replacePoints = (nextPoints: Point[]) => {
    updatePoints(nextPoints);
    setCanvasVersion((currentVersion) => currentVersion + 1);
  };

  // Remove every point from the canvas
  const clearPoints = () => {
    replacePoints([]);
  };

  // Change algorithm and clear current animation state
  const handleAlgorithmChange = (algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm);
    setHullPoints([]);
    setRuntimeMs(benchmarkResults[algorithm]);
    setShowStepControls(false);
    setAnimationSteps([]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Run selected algorithm and start animation steps
  const handleStart = () => {
    setShowStepControls(true);
    setIsPlaying(false);

    const startTime = performance.now();
    let animationSteps: Step[] = []

    if (selectedAlgorithm === "Graham Scan") {
      animationSteps = grahamScan([...points])

    } else if (selectedAlgorithm === "Jarvis March") {
      animationSteps = jarvisMarch([...points])

    } else {
      animationSteps = quickHull([...points])

    }

    const endTime = performance.now();

    setAnimationSteps(animationSteps);
    setCurrentStepIndex(0);
    setHullPoints(animationSteps[0]?.hullPoints ?? []);
    setRuntimeMs(endTime - startTime);
    setBenchmarkResults((currentResults) => ({...currentResults, [selectedAlgorithm]: endTime - startTime}));
    setIsPlaying(true);
  };

  // Move playback to a specific step while keeping index in valid range
  const updateAnimationStep = (nextIndex: number) => {
    const boundedIndex = Math.min(Math.max(nextIndex, 0), Math.max(animationSteps.length - 1, 0));

    setCurrentStepIndex(boundedIndex);
    setHullPoints(animationSteps[boundedIndex]?.hullPoints ?? []);

    if (boundedIndex >= animationSteps.length - 1) {
      setIsPlaying(false);
    }
  };

  // Stop playback and clear current animation result
  const stopAnimation = () => {
    setIsPlaying(false);
    setShowStepControls(false);
    setAnimationSteps([]);
    setCurrentStepIndex(0);
    setHullPoints([]);
  };

  // Advance animation while playback is running
  useEffect(() => {
    if (!isPlaying || animationSteps.length === 0) {
      return
    }

    const timerId = window.setInterval(() => {
      setCurrentStepIndex((currentIndex) => {
        const nextIndex = currentIndex + 1;

        if (nextIndex >= animationSteps.length) {
          setIsPlaying(false);
          return currentIndex;
        }

        setHullPoints(animationSteps[nextIndex].hullPoints);
        return nextIndex;
      });
    }, 120);

    return () => window.clearInterval(timerId);

  }, [animationSteps, isPlaying]);

  return (
    <main className="visualizer-page">
      {/* Application title / header section */}
      <Header />

      {/* Input Sidebar */}
      <div className="visualizer-workspace">
        <Sidebar
          selectedAlgorithm={selectedAlgorithm}
          selectedFile={selectedFile}
          isLocked={isAnimationLocked}
          onAlgorithmChange={handleAlgorithmChange}
          onFileChange={setSelectedFile}
          onImportPoints={replacePoints}
          onGenerate={replacePoints}
          onStart={handleStart}
        />

        {/* Canvas Board */}
        <CanvasBoard
          key={canvasVersion}
          points={points}
          hullPoints={hullPoints}
          animationStep={currentAnimationStep}
          selectedAlgorithm={selectedAlgorithm}
          showStepControls={showStepControls}
          isLocked={isAnimationLocked}
          onPointsChange={updatePoints}
          onClear={clearPoints}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onNext={() => updateAnimationStep(currentStepIndex + 1)}
          onPrevious={() => updateAnimationStep(currentStepIndex - 1)}
          onStop={stopAnimation}
          isPlaying={isPlaying}
          currentStepIndex={currentStepIndex}
          totalSteps={animationSteps.length}
        />
        
        {/* Inspector Panel */}
        <InspectorPanel
          pointCount={points.length}
          hullCount={hullPoints.length}
          runtimeMs={runtimeMs}
          benchmarkResults={benchmarkResults}
          animationStep={currentAnimationStep}
        />
      </div>
    </main>
  );
}

export default App;