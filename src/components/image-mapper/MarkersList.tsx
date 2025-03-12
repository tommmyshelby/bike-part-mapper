
import React from 'react';
import { Marker } from './ImageMapper';
import './MarkersList.css';

interface MarkersListProps {
  markers: Marker[];
  onRemoveMarker: (id: string) => void;
}

export const MarkersList: React.FC<MarkersListProps> = ({ markers, onRemoveMarker }) => {
  if (markers.length === 0) {
    return <div className="no-markers">No markers placed yet. Click on the image to add markers.</div>;
  }

  return (
    <div className="markers-list">
      {markers.map((marker) => (
        <div key={marker.id} className="marker-item">
          <div className="marker-label">Marker {marker.label}</div>
          <div className="marker-coordinates">
            <span>X: {(marker.normalizedX * 100).toFixed(2)}%</span>
            <span>Y: {(marker.normalizedY * 100).toFixed(2)}%</span>
          </div>
          <button 
            className="remove-marker-button" 
            onClick={() => onRemoveMarker(marker.id)}
            title="Remove marker"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};
