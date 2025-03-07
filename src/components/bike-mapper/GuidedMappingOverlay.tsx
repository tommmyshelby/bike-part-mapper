
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
        Click on the image to mark: {currentPart.partName}
      </div>
    </div>
  );
};
