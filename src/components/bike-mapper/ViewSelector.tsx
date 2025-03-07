
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="flex items-center justify-center gap-2">
      <button 
        className="p-2 rounded-full hover:bg-gray-100"
        onClick={goToPrevView}
      >
        <ChevronLeft size={20} />
      </button>
      
      {views.map((view) => (
        <button
          key={view}
          className={cn(
            "px-4 py-2 rounded-lg transition-colors",
            currentView === view 
              ? "bg-blue-500 text-white" 
              : "bg-white border border-gray-300 hover:bg-gray-50"
          )}
          onClick={() => onViewChange(view)}
        >
          {view}
        </button>
      ))}
      
      <button 
        className="p-2 rounded-full hover:bg-gray-100"
        onClick={goToNextView}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
