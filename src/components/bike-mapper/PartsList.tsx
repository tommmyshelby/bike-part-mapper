
import { type PartMarker } from "./BikePartMapper";
import { cn } from "@/lib/utils";

interface PartsListProps {
  markers: PartMarker[];
  selectedMarkerId: number | null;
  onMarkerSelect: (id: number) => void;
  onUpdateName: (id: number, name: string) => void;
}

export const PartsList = ({
  markers,
  selectedMarkerId,
  onMarkerSelect,
  onUpdateName,
}: PartsListProps) => {
  if (markers.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm p-6 rounded-lg border border-gray-200">
        <p className="text-gray-500 text-center">
          No parts marked yet. Click on the image to add markers.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-gray-200 space-y-2">
      <h2 className="text-lg font-medium text-gray-800 mb-4">Marked Parts</h2>
      {markers.map((marker) => (
        <div
          key={marker.id}
          className={cn(
            "p-3 rounded-lg transition-all duration-200",
            "hover:bg-gray-50 cursor-pointer",
            selectedMarkerId === marker.id && "bg-gray-50 ring-1 ring-green-200"
          )}
          onClick={() => onMarkerSelect(marker.id)}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center",
                "bg-white border-2",
                selectedMarkerId === marker.id
                  ? "border-green-500"
                  : "border-gray-300"
              )}
            >
              <span className="text-sm font-medium text-gray-700">
                {marker.id}
              </span>
            </div>
            <input
              type="text"
              value={marker.name}
              onChange={(e) => onUpdateName(marker.id, e.target.value)}
              className={cn(
                "flex-1 bg-transparent border-none focus:outline-none",
                "text-gray-700 placeholder-gray-400"
              )}
              placeholder="Enter part name"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
