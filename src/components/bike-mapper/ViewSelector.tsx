
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./ViewSelector.css";

interface ViewSelectorProps {
  currentView: "LHS" | "RHS" | "TOP";
  onViewChange: (view: "LHS" | "RHS" | "TOP") => void;
}

export const ViewSelector = ({ 
  currentView, 
  onViewChange 
}: ViewSelectorProps) => {
  const views = ["LHS", "RHS", "TOP"] as const;
  
  const goToNextView = () => {
    const currentIndex = views.indexOf(currentView);
    const nextIndex = (currentIndex + 1) % views.length;
    onViewChange(views[nextIndex]);
  };
  
  const goToPrevView = () => {
    const currentIndex = views.indexOf(currentView);
    const prevIndex = (currentIndex - 1 + views.length) % views.length;
    onViewChange(views[prevIndex]);
  };
  
  return (
    <div className="view-selector">
      <button 
        className="nav-button"
        onClick={goToPrevView}
      >
        <ChevronLeft size={20} />
      </button>
      
      {views.map((view) => (
        <button
          key={view}
          className={`view-button ${currentView === view ? 'view-button-active' : ''}`}
          onClick={() => onViewChange(view)}
        >
          {view}
        </button>
      ))}
      
      <button 
        className="nav-button"
        onClick={goToNextView}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
