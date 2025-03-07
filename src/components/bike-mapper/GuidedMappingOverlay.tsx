
import { Part } from "./BikePartMapper";
import "./GuidedMappingOverlay.css";

interface GuidedMappingOverlayProps {
  currentPart: Part;
  progress: number;
}

export const GuidedMappingOverlay = ({ 
  currentPart,
  progress 
}: GuidedMappingOverlayProps) => {
  return (
    <div className="guided-mapping-overlay">
      <div className="guided-mapping-content">
        <div className="guided-mapping-instruction">
          <span className="guided-instruction-label">Click to place:</span>
          <span className="guided-part-name">{currentPart.partName}</span>
        </div>
        <div className="guided-progress-container">
          <div className="guided-progress-bar">
            <div 
              className="guided-progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="guided-mapping-progress">{Math.floor(progress)}%</span>
        </div>
      </div>
    </div>
  );
};
