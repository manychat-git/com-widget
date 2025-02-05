interface GraphControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const GraphControls = ({ onZoomIn, onZoomOut, onReset }: GraphControlsProps) => {
  return (
    <div className="com-absolute com-bottom-6 com-left-6 com-flex com-gap-2">
      <button
        onClick={onZoomIn}
        className="com-bg-white/90 com-backdrop-blur-sm com-p-2 com-rounded-lg com-shadow-md hover:com-bg-white com-transition-colors"
        aria-label="Zoom in"
      >
        +
      </button>
      <button
        onClick={onZoomOut}
        className="com-bg-white/90 com-backdrop-blur-sm com-p-2 com-rounded-lg com-shadow-md hover:com-bg-white com-transition-colors"
        aria-label="Zoom out"
      >
        -
      </button>
      <button
        onClick={onReset}
        className="com-bg-white/90 com-backdrop-blur-sm com-px-3 com-py-2 com-rounded-lg com-shadow-md hover:com-bg-white com-transition-colors"
      >
        Reset
      </button>
    </div>
  );
};

export default GraphControls;