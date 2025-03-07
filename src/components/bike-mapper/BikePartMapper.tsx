
import { useState, useEffect } from "react";
import { ImageArea } from "./ImageArea";
import { PartsList } from "./PartsList";
import { GuidedMappingOverlay } from "./GuidedMappingOverlay";
import { ViewSelector } from "./ViewSelector";
import { toast } from "@/components/ui/use-toast";
import "./BikePartMapper.css";

export interface PartMarker {
  id: number;
  x: number;
  y: number;
  name: string;
  value: string;
  view: "LHS" | "RHS" | "TOP";
  isDragging?: boolean;
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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

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
    { partNumber: 8, partName: "Frame", view: "RHS", Group: 6 },
    { partNumber: 9, partName: "Handlebars", view: "TOP", Group: 2 },
    { partNumber: 10, partName: "Stem", view: "TOP", Group: 2 },
    { partNumber: 11, partName: "Top Tube", view: "TOP", Group: 6 },
    { partNumber: 12, partName: "Seat Post", view: "TOP", Group: 1 }
  ];

  const filteredParts = parts.filter(part => part.view === currentView);
  const currentPart = filteredParts[currentPartIndex];
  
  // Handle view changes and auto-advancing to next view
  useEffect(() => {
    setCurrentPartIndex(0);
    setSelectedMarkerId(null);
  }, [currentView]);

  // Check if all parts in current view are mapped
  useEffect(() => {
    if (!isGuidedMode) return;
    
    const allPartsMapped = markersForCurrentView.length === filteredParts.length;
    if (allPartsMapped && isGuidedMode) {
      toast({
        title: "View complete!",
        description: "All parts in this view have been mapped. Moving to next view.",
      });
      
      // Auto advance to next view
      const views = ["LHS", "RHS", "TOP"] as const;
      const currentIndex = views.indexOf(currentView);
      const nextIndex = (currentIndex + 1) % views.length;
      setCurrentView(views[nextIndex]);
      setIsGuidedMode(false);
    }
  }, [markers, currentView, isGuidedMode]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!e.currentTarget || !isGuidedMode) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (isGuidedMode && currentPart) {
      const newMarker: PartMarker = {
        id: Date.now(), // Use timestamp for unique ID
        x: Number(x.toFixed(2)),
        y: Number(y.toFixed(2)),
        name: currentPart.partName,
        value: "",
        view: currentView,
      };

      const existingMarkerIndex = markers.findIndex(
        m => m.name === currentPart.partName && m.view === currentView
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
        toast({
          title: "View mapping complete!",
          description: "All parts in this view have been mapped.",
        });
      }
    }
  };

  const handleMarkerDrag = (id: number, x: number, y: number) => {
    setMarkers(prev => 
      prev.map(marker => 
        marker.id === id 
          ? { ...marker, x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) } 
          : marker
      )
    );
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

  const markersForCurrentView = markers.filter(marker => marker.view === currentView);

  const calculateProgress = () => {
    const totalPartsInView = filteredParts.length;
    const mappedPartsInView = markersForCurrentView.length;
    return (mappedPartsInView / totalPartsInView) * 100;
  };

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
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
            onImageUpload={handleImageUpload}
            uploadedImage={uploadedImage}
            onMarkerDrag={handleMarkerDrag}
          />
          
          {isGuidedMode && currentPart && (
            <GuidedMappingOverlay
              currentPart={currentPart}
              progress={(currentPartIndex / filteredParts.length) * 100}
            />
          )}
        </div>
      </div>
      
      {!isGuidedMode && markersForCurrentView.length > 0 && markersForCurrentView.length < filteredParts.length && (
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
