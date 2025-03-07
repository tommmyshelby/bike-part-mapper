
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
  const [isGuidedMode, setIsGuidedMode] = useState(true);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);

  // Hardcoded parts data for mapping
  const parts: Part[] = [
    { partNumber: 1, partName: "Front Disc Brake", view: "LHS", Group: 1 },
    { partNumber: 2, partName: "Front Tire", view: "LHS", Group: 1 },
    { partNumber: 3, partName: "Front Mudguard", view: "LHS", Group: 1 },
    { partNumber: 4, partName: "Front Suspension", view: "LHS", Group: 1 },
    { partNumber: 5, partName: "Left Handlebar", view: "LHS", Group: 2 },
    { partNumber: 6, partName: "Clutch Lever", view: "LHS", Group: 2 },
    { partNumber: 7, partName: "Gear Shifter", view: "LHS", Group: 3 },
    { partNumber: 8, partName: "Side Stand", view: "LHS", Group: 4 },
    { partNumber: 9, partName: "Left Foot Peg", view: "LHS", Group: 3 },
    { partNumber: 10, partName: "Rear Disc Brake", view: "LHS", Group: 5 },
    { partNumber: 11, partName: "Battery Compartment", view: "LHS", Group: 6 },
    { partNumber: 1, partName: "Front Brake Lever", view: "RHS", Group: 2 },
    { partNumber: 2, partName: "Right Handlebar", view: "RHS", Group: 2 },
    { partNumber: 3, partName: "Throttle Grip", view: "RHS", Group: 2 },
    { partNumber: 4, partName: "Exhaust Pipe", view: "RHS", Group: 6 },
    { partNumber: 5, partName: "Rear Brake Pedal", view: "RHS", Group: 3 },
    { partNumber: 6, partName: "Kick Starter", view: "RHS", Group: 3 },
    { partNumber: 7, partName: "Rear Suspension", view: "RHS", Group: 5 },
    { partNumber: 8, partName: "Rear Tire", view: "RHS", Group: 5 },
    { partNumber: 9, partName: "Rear Chain Sprocket", view: "RHS", Group: 3 },
    { partNumber: 10, partName: "Engine Block", view: "RHS", Group: 6 },
    { partNumber: 11, partName: "Oil Filter", view: "RHS", Group: 6 }
  ];

  // Filter parts by current view
  const filteredParts = parts.filter(part => part.view === currentView);
  const currentPart = filteredParts[currentPartIndex];
  
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!e.currentTarget) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (isGuidedMode && currentPart) {
      // In guided mode, add the current part from the sequence
      const newMarker: PartMarker = {
        id: currentPart.partNumber,
        x: Number(x.toFixed(2)),
        y: Number(y.toFixed(2)),
        name: currentPart.partName,
        value: "",
      };

      // Check if this part already exists
      const existingMarkerIndex = markers.findIndex(
        m => m.name === currentPart.partName && m.id === currentPart.partNumber
      );

      if (existingMarkerIndex >= 0) {
        // Update existing marker position
        const updatedMarkers = [...markers];
        updatedMarkers[existingMarkerIndex] = {
          ...updatedMarkers[existingMarkerIndex],
          x: Number(x.toFixed(2)),
          y: Number(y.toFixed(2)),
        };
        setMarkers(updatedMarkers);
      } else {
        // Add new marker
        setMarkers([...markers, newMarker]);
      }

      // Move to next part if available
      if (currentPartIndex < filteredParts.length - 1) {
        setCurrentPartIndex(currentPartIndex + 1);
      } else {
        // End of parts for this view
        setIsGuidedMode(false);
      }
    } else {
      // Standard mode - add new marker
      const newMarker: PartMarker = {
        id: markers.length + 1,
        x: Number(x.toFixed(2)),
        y: Number(y.toFixed(2)),
        name: `Part ${markers.length + 1}`,
        value: "",
      };

      setMarkers([...markers, newMarker]);
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
    const reindexedMarkers = filteredMarkers.map((marker, index) => ({
      ...marker,
      id: index + 1,
      name: marker.name === `Part ${marker.id}` ? `Part ${index + 1}` : marker.name
    }));
    setMarkers(reindexedMarkers);
    setSelectedMarkerId(null);
  };

  const startGuidedMode = () => {
    setIsGuidedMode(true);
    setCurrentPartIndex(0);
  };

  const switchView = (view: "LHS" | "RHS" | "TOP") => {
    setCurrentView(view);
    setCurrentPartIndex(0);
    setIsGuidedMode(true);
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
      <h1 className="bike-mapper-title">Bike Part Mapper</h1>
      <p className="bike-mapper-description">
        {isGuidedMode 
          ? "Click on the image to mark the highlighted part" 
          : "Click on the image to add custom markers"}
      </p>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-bar-fill"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
        <div className="action-buttons">
          <button className="action-button" onClick={() => setIsGuidedMode(false)}>
            Draft
          </button>
          <button className="action-button">
            Save
          </button>
        </div>
      </div>
      
      <ViewSelector currentView={currentView} onViewChange={switchView} />
      
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
          <ImageArea
            markers={markersForCurrentView}
            selectedMarkerId={selectedMarkerId}
            onImageClick={handleImageClick}
            onMarkerClick={setSelectedMarkerId}
          />
          {isGuidedMode && currentPart && (
            <GuidedMappingOverlay
              currentPart={currentPart}
              progress={(currentPartIndex / filteredParts.length) * 100}
            />
          )}
          <div className="progress-indicator">
            <div 
              className="progress-indicator-fill"
              style={{ width: `${(currentPartIndex / filteredParts.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {!isGuidedMode && (
        <button
          className="guided-mode-button"
          onClick={startGuidedMode}
        >
          Start Guided Mapping
        </button>
      )}
    </div>
  );
};

export default BikePartMapper;
