
import React, { useState, useRef, useEffect } from "react";
import { type PartMarker } from "./BikePartMapper";
import { Upload, Image as ImageIcon } from "lucide-react";
import "./ImageArea.css";

interface ImageAreaProps {
  markers: PartMarker[];
  selectedMarkerId: number | null;
  onImageClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMarkerClick: (id: number) => void;
  onStartMapping: () => void;
  onImageUpload: (imageUrl: string) => void;
  uploadedImage: string | null;
  onMarkerDrag: (id: number, x: number, y: number) => void;
}

export const ImageArea = ({
  markers,
  selectedMarkerId,
  onImageClick,
  onMarkerClick,
  onStartMapping,
  onImageUpload,
  uploadedImage,
  onMarkerDrag,
}: ImageAreaProps) => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [draggingMarkerId, setDraggingMarkerId] = useState<number | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onImageUpload(imageUrl);
      setShowWelcomeModal(true);
    }
  };

  const handleStartMapping = () => {
    setShowWelcomeModal(false);
    onStartMapping();
  };

  const handleMarkerMouseDown = (
    e: React.MouseEvent<HTMLButtonElement>,
    markerId: number
  ) => {
    e.stopPropagation();
    onMarkerClick(markerId);
    
    // Only allow dragging for selected marker
    if (selectedMarkerId === markerId) {
      setDraggingMarkerId(markerId);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingMarkerId !== null && imageContainerRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      
      // Calculate position as percentage of container
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Limit to container bounds
      const boundedX = Math.min(Math.max(0, x), 100);
      const boundedY = Math.min(Math.max(0, y), 100);
      
      onMarkerDrag(draggingMarkerId, boundedX, boundedY);
    }
  };

  const handleMouseUp = () => {
    setDraggingMarkerId(null);
  };

  // Add event listeners to handle mouse events outside component
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setDraggingMarkerId(null);
    };

    if (draggingMarkerId !== null) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [draggingMarkerId]);

  return (
    <div className="image-area">
      {!uploadedImage ? (
        <div className="upload-container">
          <label htmlFor="image-upload" className="upload-label">
            <div className="upload-icon-container">
              <Upload className="upload-icon" />
              <ImageIcon className="upload-icon" />
            </div>
            <span className="upload-text">Upload an image to start mapping</span>
            <span className="upload-hint">Click or drag and drop</span>
          </label>
          <input 
            type="file" 
            id="image-upload" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="upload-input"
          />
        </div>
      ) : (
        <div className="image-container">
          <div
            ref={imageContainerRef}
            className="image-click-area"
            onClick={onImageClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={uploadedImage}
              alt="Uploaded image"
              className="bike-image"
            />
            <div className="image-overlay"></div>
            {markers.map((marker) => {
              const isDragging = draggingMarkerId === marker.id;
              return (
                <button
                  key={marker.id}
                  className={`marker-pin ${selectedMarkerId === marker.id ? 'marker-pin-selected' : ''} ${isDragging ? 'marker-pin-dragging' : ''}`}
                  style={{ 
                    left: `${marker.x}%`, 
                    top: `${marker.y}%`,
                    cursor: selectedMarkerId === marker.id ? 'move' : 'pointer',
                  }}
                  onMouseDown={(e) => handleMarkerMouseDown(e, marker.id)}
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
                    {selectedMarkerId === marker.id && (
                      <div className="marker-drag-hint">Drag to reposition</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          {showWelcomeModal && (
            <div className="welcome-modal">
              <div className="welcome-modal-content">
                <h3 className="welcome-modal-title">Let's Map Your Bike Parts</h3>
                <p className="welcome-modal-text">
                  Click on the bike image to place markers for each part in sequence.
                </p>
                <button 
                  className="welcome-modal-button"
                  onClick={handleStartMapping}
                >
                  Start Mapping
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
