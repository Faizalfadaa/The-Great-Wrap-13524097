import { useState } from "react";
import { readFile } from "../algorithm/input";
import type { Point } from "../algorithm/point";

type FileUploadProps = {
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
  onImportPoints: (points: Point[]) => void;
};

export function FileUpload({selectedFile,onFileChange,onImportPoints}: FileUploadProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
      <p className="sidebar-label">Input Dataset</p>
      <h2>Upload File</h2>
      <p className="sidebar-copy">
        Accept CSV or TXT files containing point coordinates for visualization
      </p>

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
      {errorMessage ? <p className="file-error">{errorMessage}</p> : null}
    </section>
  );
}
