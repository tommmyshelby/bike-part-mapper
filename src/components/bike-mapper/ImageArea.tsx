
import { type PartMarker } from "./BikePartMapper";
import { cn } from "@/lib/utils";

interface ImageAreaProps {
  markers: PartMarker[];
  selectedMarkerId: number | null;
  onImageClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMarkerClick: (id: number) => void;
}

export const ImageArea = ({
  markers,
  selectedMarkerId,
  onImageClick,
  onMarkerClick,
}: ImageAreaProps) => {
  return (
    <div className="relative aspect-video bg-white rounded-lg shadow-lg overflow-hidden">
      <div
        className="absolute inset-0 cursor-crosshair"
        onClick={onImageClick}
      >
        <img
          src="/lovable-uploads/2129e43c-f1ef-4739-b7d1-110c78340e31.png"
          alt="Bike"
          className="w-full h-full object-contain"
        />
        {markers.map((marker) => (
          <button
            key={marker.id}
            className={cn(
              "absolute w-6 h-6 -ml-3 -mt-3 rounded-full flex items-center justify-center",
              "bg-white shadow-lg border-2 transition-all duration-200",
              "hover:scale-110 hover:border-green-500",
              selectedMarkerId === marker.id
                ? "border-green-500 ring-2 ring-green-200"
                : "border-gray-300"
            )}
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            onClick={(e) => {
              e.stopPropagation();
              onMarkerClick(marker.id);
            }}
          >
            <span className="text-sm font-medium text-gray-700">
              {marker.id}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
