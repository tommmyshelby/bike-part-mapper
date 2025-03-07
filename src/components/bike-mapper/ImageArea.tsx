
import { type PartMarker } from "./BikePartMapper";
import "./ImageArea.css";

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
    <div className="image-area">
      <div
        className="image-click-area"
        onClick={onImageClick}
      >
        <img
          src="/lovable-uploads/80d69c72-1b6c-432a-a82f-2320ca36e716.png"
          alt="Bike"
          className="bike-image"
        />
        {markers.map((marker) => (
          <button
            key={marker.id}
            className={`marker-pin ${selectedMarkerId === marker.id ? 'marker-pin-selected' : ''}`}
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            onClick={(e) => {
              e.stopPropagation();
              onMarkerClick(marker.id);
            }}
          >
            <span className="marker-number">
              {marker.id}
            </span>
            <div className="marker-tooltip">
              {marker.name}
              {marker.value && <> - {marker.value}</>}
              <div className="marker-position">x: {marker.x}%, y: {marker.y}%</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
