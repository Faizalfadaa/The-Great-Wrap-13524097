type PlaybackControlsProps = {
  currentStepIndex: number;
  isPlaying: boolean;
  totalSteps: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onStop: () => void;
};

export function PlaybackControls({
  currentStepIndex,
  isPlaying,
  totalSteps,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onStop,
}: PlaybackControlsProps) {
  const isAtStart = currentStepIndex === 0;
  const isAtEnd = totalSteps === 0 || currentStepIndex >= totalSteps - 1;

  return (
    <div
      className="playback-controls"
      aria-label="Step-by-step visualization controls"
    >
      <button
        type="button"
        title={isPlaying ? "Pause" : "Play"}
        aria-label={isPlaying ? "Pause" : "Play"}
        disabled={totalSteps === 0}
        onClick={isPlaying ? onPause : onPlay}
      >
        <span
          className={`control-icon ${isPlaying ? "pause-icon" : "play-icon"}`}
          aria-hidden="true"
        />
      </button>
      <button
        type="button"
        title="Previous Step"
        aria-label="Previous Step"
        disabled={isAtStart}
        onClick={onPrevious}
      >
        <span className="control-icon previous-icon" aria-hidden="true" />
      </button>
      <button
        type="button"
        title="Next Step"
        aria-label="Next Step"
        disabled={isAtEnd}
        onClick={onNext}
      >
        <span className="control-icon next-icon" aria-hidden="true" />
      </button>
      <button type="button" title="Stop" aria-label="Stop" onClick={onStop}>
        <span className="control-icon stop-icon" aria-hidden="true" />
      </button>
      <span className="step-counter">
        {totalSteps > 0 ? `${currentStepIndex + 1}/${totalSteps}` : "0/0"}
      </span>
    </div>
  );
}
