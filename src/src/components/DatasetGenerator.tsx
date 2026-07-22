import { useState } from "react"
import type { CanvasPoint, GeneratorShape } from "../types"
import { createPoint } from "../utils/points"

type DatasetGeneratorProps = {
  onGenerate: (points: CanvasPoint[]) => void
};

export function DatasetGenerator({ onGenerate }: DatasetGeneratorProps) {
  const [generatorShape, setGeneratorShape] = useState<GeneratorShape>("Random")
  const [generatorCount, setGeneratorCount] = useState(24)

  const generateDataset = () => {
    const generatedPoints: CanvasPoint[] = []
    const count = Math.max(3, generatorCount)

    for (let index = 0; index < count; index += 1) {
      if (generatorShape == "Circle") {
        const angle = (Math.PI * 2 * index) / count
        const radius = 180 + Math.random() * 90
        generatedPoints.push(createPoint(Math.cos(angle) * radius, Math.sin(angle) * radius))

      } else if (generatorShape == "Rectangle") {
        generatedPoints.push(createPoint(-360 + Math.random() * 720, -220 + Math.random() * 440))

      } else if (generatorShape == "Cluster") {
        const clusterX = index % 2 == 0 ? -180 : 180
        const clusterY = index % 3 == 0 ? -120 : 120
        generatedPoints.push(createPoint(clusterX + (Math.random() - 0.5) * 180, clusterY + (Math.random() - 0.5) * 160))

      } else {
        generatedPoints.push(createPoint(-500 + Math.random() * 1000,-300 + Math.random() * 600))

      }
    }

    onGenerate(generatedPoints)
  };

  return (
    <section className="control-section">
      <p className="sidebar-label">Dataset Generator</p>
      <div className="segmented-control">
        {(["Random", "Circle", "Rectangle", "Cluster"] as GeneratorShape[]).map(
          (shape) => (
            <button
              className={generatorShape == shape ? "active" : ""}
              key={shape}
              type="button"
              onClick={() => setGeneratorShape(shape)}
            >
              {shape}
            </button>
          ),
        )}
      </div>

      <label className="range-field">
        <span>Jumlah titik</span>
        <input
          max="120"
          min="3"
          type="range"
          value={generatorCount}
          onChange={(event) => setGeneratorCount(Number(event.target.value))}
        />
        <strong>{generatorCount}</strong>
      </label>

      <button className="primary-button" type="button" onClick={generateDataset}>
        Generate
      </button>
    </section>
  );
}

