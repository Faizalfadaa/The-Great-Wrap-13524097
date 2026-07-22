export function PlaybackControls() {
  return (
    <div
      className="playback-controls"
      aria-label="Step-by-step visualization controls"
    >
      <button type="button" title="Play" aria-label="Play">
        <span className="control-icon play-icon" aria-hidden="true" />
      </button>
      <button type="button" title="Pause" aria-label="Pause">
        <span className="control-icon pause-icon" aria-hidden="true" />
      </button>
      <button type="button" title="Next Step" aria-label="Next Step">
        <span className="control-icon next-icon" aria-hidden="true" />
      </button>
      <button type="button" title="Previous Step" aria-label="Previous Step">
        <span className="control-icon previous-icon" aria-hidden="true" />
      </button>
      <button type="button" title="Stop" aria-label="Stop">
        <span className="control-icon stop-icon" aria-hidden="true" />
      </button>
    </div>
  );
}

