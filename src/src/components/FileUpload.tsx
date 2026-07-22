type FileUploadProps = {
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
};

export function FileUpload({ selectedFile, onFileChange }: FileUploadProps) {
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
          onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
        />
      </label>
    </section>
  );
}

