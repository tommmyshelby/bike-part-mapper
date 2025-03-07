
import { Part } from "./BikePartMapper";

interface GuidedMappingOverlayProps {
  currentPart: Part;
  progress: number;
}

export const GuidedMappingOverlay = ({ 
  currentPart,
  progress 
}: GuidedMappingOverlayProps) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
      <div className="bg-blue-500/80 text-white px-4 py-2 rounded-full text-sm font-medium mb-2">
        Click on the image to mark: {currentPart.partName}
      </div>
    </div>
  );
};
