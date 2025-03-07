
import { useState } from "react";
import { ImageArea } from "./ImageArea";
import { PartsList } from "./PartsList";
import { GuidedMappingOverlay } from "./GuidedMappingOverlay";
import { ViewSelector } from "./ViewSelector";
import "./BikePartMapper.css";

export interface PartMarker {
  id: number;
  x: number;
  y: number;
  name: string;
  value: string;
}

export interface Part {
  partNumber: number;
  partName: string;
  view: "LHS" | "RHS" | "TOP";
  Group: number;
}

const BikePartMapper = () => {
  const [markers, setMarkers] = useState<PartMarker[]>([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState<"LHS" | "RHS" | "TOP">("LHS");
  const [isGuidedMode, setIsGuidedMode] = useState(false);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);

  const parts: Part[] = [
    { partNumber: 1, partName: "Handlebar", view: "LHS", Group: 2 },
    { partNumber: 2, partName: "Saddle", view: "LHS", Group: 1 },
    { partNumber: 3, partName: "Front Wheel", view: "LHS", Group: 1 },
    { partNumber: 4, partName: "Rear Wheel", view: "LHS", Group: 1 },
    { partNumber: 5, partName: "Pedals", view: "LHS", Group: 3 },
    { partNumber: 6, partName: "Chain", view: "LHS", Group: 3 },
    { partNumber: 7, partName: "Brakes", view: "LHS", Group: 2 },
    { partNumber: 8, partName: "Frame", view: "LHS", Group: 6 },
    { partNumber: 1, partName: "Handlebar", view: "RHS", Group: 2 },
    { partNumber: 2, partName: "Saddle", view: "RHS", Group: 1 },
    { partNumber: 3, partName: "Front Wheel", view: "RHS", Group: 1 },
    { partNumber: 4, partName: "Rear Wheel", view: "RHS", Group: 1 },
    { partNumber: 5, partName: "Pedals", view: "RHS", Group: 3 },
    { partNumber: 6, partName: "Chain", view: "RHS", Group: 3 },
    { partNumber: 7, partName: "Brakes", view: "RHS", Group: 2 },
    { partNumber: 8, partName: "Frame", view: "RHS", Group: 6 }
  ];

  const filteredParts = parts.filter(part => part.view === currentView);
  const currentPart = filteredParts[currentPartIndex];
  
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!e.currentTarget || !isGuidedMode) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (isGuidedMode && currentPart) {
      const newMarker: PartMarker = {
        id: currentPart.partNumber,
        x: Number(x.toFixed(2)),
        y: Number(y.toFixed(2)),
        name: currentPart.partName,
        value: "",
      };

      const existingMarkerIndex = markers.findIndex(
        m => m.name === currentPart.partName && m.id === currentPart.partNumber
      );

      if (existingMarkerIndex >= 0) {
        const updatedMarkers = [...markers];
        updatedMarkers[existingMarkerIndex] = {
          ...updatedMarkers[existingMarkerIndex],
          x: Number(x.toFixed(2)),
          y: Number(y.toFixed(2)),
        };
        setMarkers(updatedMarkers);
      } else {
        setMarkers([...markers, newMarker]);
      }

      if (currentPartIndex < filteredParts.length - 1) {
        setCurrentPartIndex(currentPartIndex + 1);
      } else {
        setIsGuidedMode(false);
      }
    }
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
    setMarkers(filteredMarkers);
    setSelectedMarkerId(null);
  };

  const startGuidedMode = () => {
    setIsGuidedMode(true);
    setCurrentPartIndex(0);
  };

  const switchView = (view: "LHS" | "RHS" | "TOP") => {
    setCurrentView(view);
    setCurrentPartIndex(0);
    setIsGuidedMode(false);
  };

  const markersForCurrentView = markers.filter(marker => {
    const matchingPart = parts.find(
      part => part.partName === marker.name && part.view === currentView
    );
    return !!matchingPart;
  });

  const calculateProgress = () => {
    const totalPartsInView = filteredParts.length;
    const mappedPartsInView = markersForCurrentView.length;
    return (mappedPartsInView / totalPartsInView) * 100;
  };

  return (
    <div className="bike-part-mapper">
      <div className="main-content">
        <PartsList
          parts={filteredParts}
          currentPartIndex={currentPartIndex}
          markers={markersForCurrentView}
          selectedMarkerId={selectedMarkerId}
          onMarkerSelect={setSelectedMarkerId}
          onUpdateName={updateMarkerName}
          onUpdateValue={updateMarkerValue}
          onRemoveMarker={removeMarker}
        />
        <div className="image-container">
          <h1 className="bike-mapper-title">Bike Part Mapper</h1>
          <p className="bike-mapper-description">
            Click on the bike image to place markers for each part in sequence. You can edit marker positions at any time.
          </p>
          
          <ViewSelector currentView={currentView} onViewChange={switchView} />
          
          <ImageArea
            markers={markersForCurrentView}
            selectedMarkerId={selectedMarkerId}
            onImageClick={handleImageClick}
            onMarkerClick={setSelectedMarkerId}
            onStartMapping={startGuidedMode}
          />
          
          {isGuidedMode && currentPart && (
            <GuidedMappingOverlay
              currentPart={currentPart}
              progress={(currentPartIndex / filteredParts.length) * 100}
            />
          )}
        </div>
      </div>
      
      {!isGuidedMode && markersForCurrentView.length > 0 && (
        <button
          className="guided-mode-button"
          onClick={startGuidedMode}
        >
          Continue Guided Mapping
        </button>
      )}
    </div>
  );
};

export default BikePartMapper;
