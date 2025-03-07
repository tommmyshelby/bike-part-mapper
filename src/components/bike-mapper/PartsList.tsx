
import { type PartMarker, type Part } from "./BikePartMapper";
import { Check, Pencil, Trash2 } from "lucide-react";
import "./PartsList.css";

interface PartsListProps {
  parts: Part[];
  currentPartIndex: number;
  markers: PartMarker[];
  selectedMarkerId: number | null;
  onMarkerSelect: (id: number) => void;
  onUpdateName: (id: number, name: string) => void;
  onUpdateValue: (id: number, value: string) => void;
  onRemoveMarker: (id: number) => void;
}

export const PartsList = ({
  parts,
  currentPartIndex,
  markers,
  selectedMarkerId,
  onMarkerSelect,
  onUpdateName,
  onUpdateValue,
  onRemoveMarker,
}: PartsListProps) => {
  // Get a list of mapped part names to highlight them
  const mappedPartNames = markers.map(m => m.name);
  const mappedCount = markers.length;
  const totalCount = parts.length;
  
  return (
    <div className="parts-list">
      <h2 className="parts-list-title">
        Bike Parts
        <span className="parts-mapped-count">
          {mappedCount} of {totalCount} parts mapped
        </span>
      </h2>
      
      {parts.length === 0 ? (
        <p className="empty-message">
          No parts available for the selected view.
        </p>
      ) : (
        <div className="parts-container">
          {parts.map((part, index) => {
            const isMapped = mappedPartNames.includes(part.partName);
            const isActive = index === currentPartIndex;
            const matchingMarker = markers.find(m => m.name === part.partName);
            
            return (
              <div
                key={`${part.view}-${part.partNumber}`}
                className={`part-item ${isMapped ? 'part-item-mapped' : ''} ${isActive ? 'part-item-active' : ''}`}
                onClick={() => matchingMarker && onMarkerSelect(matchingMarker.id)}
              >
                <div className="part-header">
                  <div className="part-status">
                    {isMapped ? (
                      <Check className="part-check" />
                    ) : null}
                  </div>
                  <span className={`part-name ${isActive ? 'part-name-active' : ''}`}>
                    {part.partName}
                  </span>
                  {isMapped && matchingMarker && (
                    <div className="part-actions">
                      <Pencil className="part-edit" onClick={(e) => {
                        e.stopPropagation();
                        onMarkerSelect(matchingMarker.id);
                      }} />
                    </div>
                  )}
                </div>
                
                {matchingMarker && selectedMarkerId === matchingMarker.id && (
                  <div className="part-details">
                    <div className="part-value">
                      <span>Value:</span>
                      <input
                        type="text"
                        value={matchingMarker.value}
                        onChange={(e) => onUpdateValue(matchingMarker.id, e.target.value)}
                        className="value-input"
                        placeholder="Enter value"
                      />
                    </div>
                    <div className="part-position">
                      Position: ({matchingMarker.x.toFixed(0)}%, {matchingMarker.y.toFixed(0)}%)
                    </div>
                    <div className="part-drag-hint">
                      You can drag the marker to reposition it
                    </div>
                    <button 
                      className="remove-marker-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveMarker(matchingMarker.id);
                      }}
                    >
                      <Trash2 size={14} />
                      Remove marker
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
