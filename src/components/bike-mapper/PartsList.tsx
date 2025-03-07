
import { type PartMarker, type Part } from "./BikePartMapper";
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
  
  return (
    <div className="parts-list">
      <h2 className="parts-list-title">Parts to Map</h2>
      
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
              >
                <div className="part-header">
                  <div
                    className={`part-number ${isMapped ? 'part-number-mapped' : ''} ${isActive && !isMapped ? 'part-number-active' : ''}`}
                  >
                    <span>
                      {part.partNumber}
                    </span>
                  </div>
                  <span className={`part-name ${isActive ? 'part-name-active' : ''}`}>
                    {part.partName}
                  </span>
                  {isMapped && matchingMarker && (
                    <div className="part-actions">
                      <button
                        onClick={() => onMarkerSelect(matchingMarker.id)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onRemoveMarker(matchingMarker.id)}
                        className="remove-button"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                
                {matchingMarker && (
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
                      Position: ({matchingMarker.x}%, {matchingMarker.y}%)
                    </div>
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
