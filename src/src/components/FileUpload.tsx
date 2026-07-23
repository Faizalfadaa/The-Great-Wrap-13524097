import { useState } from "react";
import { readFile } from "../algorithm/input";
import type { Point } from "../algorithm/point";

// Initialize properties for FileUpload component
type FileUploadProps = {
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
  onImportPoints: (points: Point[]) => void;
}

// Render File upload section
export function FileUpload({selectedFile,onFileChange,onImportPoints}: FileUploadProps) {
  // Store validation error for uploaded dataset file
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Read selected file and convert it into Point list
  async function handleFileChange(file: File | null) {
    onFileChange(file);
    setErrorMessage(null);

    if (!file) {
      onImportPoints([])
      return
    }

    try {
      const parsedPoints = await readFile(file);
      onImportPoints(parsedPoints)

    } catch (error) {
      console.error(error)
      setErrorMessage("[ERROR] Invalid File Format. Use x y coordinate for each line")
      onImportPoints([])
    }
  }

  return (
    <section className="sidebar-section">

      {/* File upload title and instructions*/}
      <p className="sidebar-label">Input Dataset</p>
      <h2>Upload File</h2>
      <p className="sidebar-copy">
        Accept CSV or TXT files containing point coordinates for visualization
      </p>

      {/* Create dropzone style for file upload */}
      <label className="file-dropzone" htmlFor="point-file">
        {selectedFile ? (
          <>
            <span className="file-dropzone-title">{selectedFile.name}</span>
            <span className="file-dropzone-copy">
              {(selectedFile.size / 1024).toFixed(1)} KB selected
            </span>
          </>
        ) : (
          <>
            <span className="file-dropzone-title">Pilih file</span>
            <span className="file-dropzone-copy">Format .csv atau .txt</span>
          </>
        )}
        <input
          id="point-file"
          type="file"
          accept=".csv,.txt,text/csv,text/plain"
          onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
        />
      </label>

      {/* Create error message appears when file content cannot be parsed */}
      {errorMessage ? <p className="file-error">{errorMessage}</p> : null}
    </section>
  );
}
