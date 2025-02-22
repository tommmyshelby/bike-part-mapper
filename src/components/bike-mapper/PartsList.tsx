
import { type PartMarker } from "./BikePartMapper";
import { cn } from "@/lib/utils";

interface PartsListProps {
  markers: PartMarker[];
  selectedMarkerId: number | null;
  onMarkerSelect: (id: number) => void;
  onUpdateName: (id: number, name: string) => void;
  onUpdateValue: (id: number, value: string) => void;
  onRemoveMarker: (id: number) => void;
}

export const PartsList = ({
  markers,
  selectedMarkerId,
  onMarkerSelect,
  onUpdateName,
  onUpdateValue,
  onRemoveMarker,
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
            "p-3 rounded-lg transition-all duration-200 group/item",
            "hover:bg-gray-50",
            selectedMarkerId === marker.id && "bg-gray-50 ring-1 ring-green-200"
          )}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center shrink-0 cursor-pointer",
                  "bg-white border-2",
                  selectedMarkerId === marker.id
                    ? "border-green-500"
                    : "border-gray-300"
                )}
                onClick={() => onMarkerSelect(marker.id)}
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
              <button
                onClick={() => onRemoveMarker(marker.id)}
                className="opacity-0 group-hover/item:opacity-100 transition-opacity p-1 hover:text-red-500"
              >
                ×
              </button>
            </div>
            <div className="flex items-center gap-2 pl-9">
              <input
                type="text"
                value={marker.value}
                onChange={(e) => onUpdateValue(marker.id, e.target.value)}
                className={cn(
                  "flex-1 bg-transparent border rounded px-2 py-1",
                  "text-sm text-gray-700 placeholder-gray-400"
                )}
                placeholder="Enter part value"
              />
              <div className="text-xs text-gray-500 shrink-0">
                ({marker.x}%, {marker.y}%)
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
