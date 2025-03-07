
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
      <div className="guided-mapping-instruction">
        Click to place: {currentPart.partName}
        <span className="guided-mapping-progress">{Math.floor(progress)}%</span>
      </div>
    </div>
  );
};
