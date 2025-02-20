
import { useState } from "react";
import { ImageArea } from "./ImageArea";
import { PartsList } from "./PartsList";
import { cn } from "@/lib/utils";

export interface PartMarker {
  id: number;
  x: number;
  y: number;
  name: string;
}

export const BikePartMapper = () => {
  const [markers, setMarkers] = useState<PartMarker[]>([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!e.currentTarget) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newMarker: PartMarker = {
      id: markers.length + 1,
      x,
      y,
      name: `Part ${markers.length + 1}`,
    };

    setMarkers([...markers, newMarker]);
  };

  const updateMarkerName = (id: number, name: string) => {
    setMarkers(
      markers.map((marker) =>
        marker.id === id ? { ...marker, name } : marker
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800 mb-2">Bike Part Mapper</h1>
      <p className="text-gray-600 mb-6">Click on the image to add numbered markers</p>
      
      <div className="grid md:grid-cols-[1fr,300px] gap-6">
        <ImageArea
          markers={markers}
          selectedMarkerId={selectedMarkerId}
          onImageClick={handleImageClick}
          onMarkerClick={setSelectedMarkerId}
        />
        <PartsList
          markers={markers}
          selectedMarkerId={selectedMarkerId}
          onMarkerSelect={setSelectedMarkerId}
          onUpdateName={updateMarkerName}
        />
      </div>
    </div>
  );
};
