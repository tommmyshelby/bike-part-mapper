
import React, { useState } from "react";
import { type PartMarker } from "./BikePartMapper";
import { Upload, Image as ImageIcon } from "lucide-react";
import "./ImageArea.css";

interface ImageAreaProps {
  markers: PartMarker[];
  selectedMarkerId: number | null;
  onImageClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMarkerClick: (id: number) => void;
  onStartMapping: () => void;
}

export const ImageArea = ({
  markers,
  selectedMarkerId,
  onImageClick,
  onMarkerClick,
  onStartMapping,
}: ImageAreaProps) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setShowWelcomeModal(true);
    }
  };

  const handleStartMapping = () => {
    setShowWelcomeModal(false);
    onStartMapping();
  };

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
            className="image-click-area"
            onClick={onImageClick}
          >
            <img
              src={uploadedImage}
              alt="Uploaded image"
              className="bike-image"
            />
            <div className="image-overlay"></div>
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
