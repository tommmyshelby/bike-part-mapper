
import { type PartMarker, type Part } from "./BikePartMapper";
import { cn } from "@/lib/utils";

interface PartsListProps {
  parts: Part[];
  currentPartIndex: number;
  markers: PartMarker[];
  selectedMarkerId: number | null;
  onMarkerSelect: (id: number) => void;
  onUpdateName: (id: number, name: string) => void;
  onUpdateValue: (id: number, value: string) => void;
  onRemoveMarker: (id: number) => void;
}

export const PartsList = ({
  parts,
  currentPartIndex,
  markers,
  selectedMarkerId,
  onMarkerSelect,
  onUpdateName,
  onUpdateValue,
  onRemoveMarker,
}: PartsListProps) => {
  // Get a list of mapped part names to highlight them
  const mappedPartNames = markers.map(m => m.name);
  
  return (
    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-gray-200 space-y-2 max-h-[600px] overflow-y-auto">
      <h2 className="text-lg font-medium text-gray-800 mb-4">Parts to Map</h2>
      
      {parts.length === 0 ? (
        <p className="text-gray-500 text-center">
          No parts available for the selected view.
        </p>
      ) : (
        <div className="space-y-2">
          {parts.map((part, index) => {
            const isMapped = mappedPartNames.includes(part.partName);
            const isActive = index === currentPartIndex;
            const matchingMarker = markers.find(m => m.name === part.partName);
            
            return (
              <div
                key={`${part.view}-${part.partNumber}`}
                className={cn(
                  "p-3 rounded-lg transition-all duration-200",
                  isMapped ? "bg-green-50 border border-green-200" : "bg-white border border-gray-200",
                  isActive && "ring-2 ring-blue-300"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                      isMapped ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700",
                      isActive && !isMapped && "bg-blue-500 text-white"
                    )}
                  >
                    <span className="text-sm font-medium">
                      {part.partNumber}
                    </span>
                  </div>
                  <span className={cn(
                    "flex-1 text-gray-700",
                    isActive && "font-medium"
                  )}>
                    {part.partName}
                  </span>
                  {isMapped && matchingMarker && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => onMarkerSelect(matchingMarker.id)}
                        className="p-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded border border-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onRemoveMarker(matchingMarker.id)}
                        className="p-1 text-xs bg-red-50 hover:bg-red-100 text-red-700 rounded border border-red-200"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                
                {matchingMarker && (
                  <div className="mt-2 pl-9 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <span>Value:</span>
                      <input
                        type="text"
                        value={matchingMarker.value}
                        onChange={(e) => onUpdateValue(matchingMarker.id, e.target.value)}
                        className="flex-1 border rounded px-2 py-1 text-gray-700"
                        placeholder="Enter value"
                      />
                    </div>
                    <div className="mt-1">
                      Position: ({matchingMarker.x}%, {matchingMarker.y}%)
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
