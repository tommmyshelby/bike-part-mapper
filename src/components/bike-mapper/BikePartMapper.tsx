import { useState } from "react";
import { ImageArea } from "./ImageArea";
import { PartsList } from "./PartsList";
import { cn } from "@/lib/utils";

export interface PartMarker {
  id: number;
  x: number;
  y: number;
  name: string;
  value: string;
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
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      name: `Part ${markers.length + 1}`,
      value: "",
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

  const updateMarkerValue = (id: number, value: string) => {
    setMarkers(
      markers.map((marker) =>
        marker.id === id ? { ...marker, value } : marker
      )
    );
  };

  const removeMarker = (id: number) => {
    const filteredMarkers = markers.filter(m => m.id !== id);
    const reindexedMarkers = filteredMarkers.map((marker, index) => ({
      ...marker,
      id: index + 1,
      name: marker.name === `Part ${marker.id}` ? `Part ${index + 1}` : marker.name
    }));
    setMarkers(reindexedMarkers);
    setSelectedMarkerId(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800 mb-2">Bike Part Mapper</h1>
      <p className="text-gray-600 mb-6">Click on the image to add numbered markers</p>
      
      <div className="grid md:grid-cols-[1fr,400px] gap-6">
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
          onUpdateValue={updateMarkerValue}
          onRemoveMarker={removeMarker}
        />
      </div>
    </div>
  );
};
