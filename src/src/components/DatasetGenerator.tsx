import { useState } from "react"
import { createPoint, type Point } from "../algorithm/point"
import type { GeneratorShape } from "../types"

// Initialize properties for Dataset Generator component
type DatasetGeneratorProps = {
  onGenerate: (points: Point[]) => void
}

export function DatasetGenerator({ onGenerate }: DatasetGeneratorProps) {
  // Store selected generator shape
  const [generatorShape, setGeneratorShape] = useState<GeneratorShape>("Random")

  // Store number of points to generate (Default 24 Points)
  const [generatorCount, setGeneratorCount] = useState(24)

  // Create point dataset based on selected generator shape.
  const generateDataset = () => {
    const generatedPoints: Point[] = []
    const count = Math.max(3, generatorCount)

    // Create dataset generator Rectangle 
    if (generatorShape == "Rectangle") {
      let left = -360
      let right = 360
      let bottom = -220
      let top = 220

      generatedPoints.push(createPoint(left, bottom))
      generatedPoints.push(createPoint(right, bottom))
      generatedPoints.push(createPoint(right, top))
      generatedPoints.push(createPoint(left, top))

      for (let i = 0; i < generatorCount; i++) {
        let side = Math.floor(Math.random() * 4)
        let t = Math.random()

        if (side == 0) {
          generatedPoints.push(createPoint(left + (right - left) * t, bottom))
        } else if (side == 1) {
          generatedPoints.push(createPoint(right, bottom + (top - bottom) * t))
        } else if (side == 2) {
          generatedPoints.push(createPoint(left + (right - left) * t, top))
        } else {
          generatedPoints.push(createPoint(left, bottom + (top - bottom) * t))
        }
      }

      onGenerate(generatedPoints)
      return
    }

    // Create dataset generator Triangle with 3 fixed corners
    if (generatorShape == "Triangle") {
      let p1 = createPoint(0, 240)
      let p2 = createPoint(-360, -220)
      let p3 = createPoint(360, -220)

      generatedPoints.push(p1)
      generatedPoints.push(p2)
      generatedPoints.push(p3)

      for (let i = 0; i < generatorCount; i++) {
        let side = Math.floor(Math.random() * 3)
        let t = Math.random()

        if (side == 0) {
          generatedPoints.push(createPoint(p1.x + (p2.x - p1.x) * t, p1.y + (p2.y - p1.y) * t))
        } else if (side == 1) {
          generatedPoints.push(createPoint(p2.x + (p3.x - p2.x) * t, p2.y + (p3.y - p2.y) * t))
        } else {
          generatedPoints.push(createPoint(p3.x + (p1.x - p3.x) * t, p3.y + (p1.y - p3.y) * t))
        }
      }

      onGenerate(generatedPoints)
      return
    }

    for (let i = 0; i < count; i ++) {
      // Create dataset generator Cluster
      if (generatorShape == "Cluster") {
        const clusterX = i % 2 == 0 ? -180 : 180
        const clusterY = i % 3 == 0 ? -120 : 120

        generatedPoints.push(createPoint(clusterX + (Math.random() - 0.5) * 180, clusterY + (Math.random() - 0.5) * 160))
        
        // Create dataset generator random
      } else {
        generatedPoints.push(createPoint(-500 + Math.random() * 1000,-300 + Math.random() * 600))

      }
    }

    onGenerate(generatedPoints)
  };

  return (
    <section className="control-section">

      {/* Create dataset shape selection buttons */}
      <p className="sidebar-label">Dataset Generator</p>
      <div className="segmented-control">
        {(["Random", "Triangle", "Rectangle", "Cluster"] as GeneratorShape[]).map(
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

      {/* Create slider controls to set how many points will be generated */}
      <label className="range-field">
        <span>Points Count</span>
        <input
          max="120"
          min="3"
          type="range"
          value={generatorCount}
          onChange={(event) => setGeneratorCount(Number(event.target.value))}
        />
        <strong>{generatorCount}</strong>
      </label>

      {/* Generate button replaces current canvas points */}
      <button className="primary-button" type="button" onClick={generateDataset}>
        Generate
      </button>
    </section>
  );
}
