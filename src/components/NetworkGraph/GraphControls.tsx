interface GraphControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const GraphControls = ({ onZoomIn, onZoomOut, onReset }: GraphControlsProps) => {
  return (
    <div className="absolute bottom-6 left-6 flex gap-2">
      <button
        onClick={onZoomIn}
        className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md hover:bg-white transition-colors"
        aria-label="Zoom in"
      >
        +
      </button>
      <button
        onClick={onZoomOut}
        className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md hover:bg-white transition-colors"
        aria-label="Zoom out"
      >
        -
      </button>
      <button
        onClick={onReset}
        className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md hover:bg-white transition-colors"
      >
        Reset
      </button>
    </div>
  );
};

export default GraphControls;