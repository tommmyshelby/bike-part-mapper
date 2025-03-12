import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Circle, Image } from 'fabric';
import { ImageUploader } from './ImageUploader';
import { MarkersList } from './MarkersList';
import './ImageMapper.css';

// Define types for our markers
export interface Marker {
  id: string;
  normalizedX: number; // 0 to 1 (percentage of image width)
  normalizedY: number; // 0 to 1 (percentage of image height)
  label: string;
}

export const ImageMapper: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [fabricImage, setFabricImage] = useState<Image | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [nextMarkerLabel, setNextMarkerLabel] = useState<string>('1');
  const [imageWidth, setImageWidth] = useState<number>(0);
  const [imageHeight, setImageHeight] = useState<number>(0);
  
  // Initialize fabric canvas
  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new Canvas(canvasRef.current, {
        width: canvasRef.current.parentElement?.clientWidth || 800,
        height: 600,
        backgroundColor: '#f0f0f0',
      });
      
      setCanvas(fabricCanvas);
      
      // Handle window resize to maintain responsive canvas
      const handleResize = () => {
        const parent = canvasRef.current?.parentElement;
        if (parent && fabricCanvas) {
          fabricCanvas.setWidth(parent.clientWidth);
          updateMarkersPosition(fabricCanvas);
        }
      };
      
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        fabricCanvas.dispose();
      };
    }
  }, []);
  
  // Update markers when image changes
  useEffect(() => {
    if (canvas && imageUrl) {
      // Clear existing content
      canvas.clear();
      
      // Load new image
      Image.fromURL(imageUrl, (img) => {
        // Get parent container dimensions
        const containerWidth = canvasRef.current?.parentElement?.clientWidth || 800;
        const containerHeight = 600;
        
        // Store original image size
        const originalWidth = img.width || 100;
        const originalHeight = img.height || 100;
        setImageWidth(originalWidth);
        setImageHeight(originalHeight);
        
        // Scale image to fit container while maintaining aspect ratio
        const scale = Math.min(
          containerWidth / originalWidth,
          containerHeight / originalHeight
        );
        
        img.scale(scale);
        
        // Center the image in the canvas
        img.set({
          left: (canvas.width || 0) / 2,
          top: (canvas.height || 0) / 2,
          originX: 'center',
          originY: 'center',
          selectable: false,
          hoverCursor: 'pointer',
        });
        
        // Store reference to the image
        setFabricImage(img);
        
        // Add the image to the canvas
        canvas.add(img);
        canvas.renderAll();
        
        // Re-position markers if they exist
        if (markers.length > 0) {
          updateMarkersPosition(canvas);
        }
      });
    }
  }, [imageUrl, canvas]);

  // Function to update markers position based on current image size
  const updateMarkersPosition = (fabricCanvas: Canvas) => {
    if (!fabricImage) return;
    
    // Clear all markers from canvas (but keep the image)
    const objects = fabricCanvas.getObjects();
    for (let i = objects.length - 1; i >= 0; i--) {
      if (objects[i] !== fabricImage) {
        fabricCanvas.remove(objects[i]);
      }
    }
    
    // Get current image dimensions on canvas
    const imgElement = fabricImage.getElement();
    const currentImgWidth = imgElement.width * fabricImage.scaleX!;
    const currentImgHeight = imgElement.height * fabricImage.scaleY!;
    
    // Calculate image position
    const imgLeft = fabricImage.left || 0;
    const imgTop = fabricImage.top || 0;
    
    // Add all markers at their normalized positions
    markers.forEach((marker) => {
      // Convert normalized coordinates to actual canvas coordinates
      const markerLeft = imgLeft - (currentImgWidth / 2) + (marker.normalizedX * currentImgWidth);
      const markerTop = imgTop - (currentImgHeight / 2) + (marker.normalizedY * currentImgHeight);
      
      // Create marker
      const circle = new Circle({
        left: markerLeft,
        top: markerTop,
        radius: 8,
        fill: 'rgba(255, 0, 0, 0.7)',
        stroke: 'white',
        strokeWidth: 2,
        originX: 'center',
        originY: 'center',
        hasControls: false,
        hasBorders: false,
        data: { markerId: marker.id },
      });
      
      fabricCanvas.add(circle);
    });
    
    fabricCanvas.renderAll();
  };

  // Handle image upload
  const handleImageUpload = (file: File) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const result = e.target?.result as string;
      setImageUrl(result);
      // Reset markers when new image is uploaded
      setMarkers([]);
      setNextMarkerLabel('1');
    };
    fileReader.readAsDataURL(file);
  };

  // Handle canvas click to place marker
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvas || !fabricImage) return;
    
    // Get click coordinates relative to canvas
    const pointer = canvas.getPointer(e);
    
    // Get current image dimensions and position
    const imgElement = fabricImage.getElement();
    const imgLeft = fabricImage.left || 0;
    const imgTop = fabricImage.top || 0;
    const currentImgWidth = imgElement.width * fabricImage.scaleX!;
    const currentImgHeight = imgElement.height * fabricImage.scaleY!;
    
    // Calculate normalized coordinates (0-1) within the image
    const imageLeftBound = imgLeft - (currentImgWidth / 2);
    const imageTopBound = imgTop - (currentImgHeight / 2);
    const imageRightBound = imgLeft + (currentImgWidth / 2);
    const imageBottomBound = imgTop + (currentImgHeight / 2);
    
    // Check if click is within image bounds
    if (
      pointer.x >= imageLeftBound && 
      pointer.x <= imageRightBound && 
      pointer.y >= imageTopBound && 
      pointer.y <= imageBottomBound
    ) {
      // Calculate normalized coordinates (0-1) relative to image dimensions
      const normalizedX = (pointer.x - imageLeftBound) / currentImgWidth;
      const normalizedY = (pointer.y - imageTopBound) / currentImgHeight;
      
      // Create new marker
      const newMarker: Marker = {
        id: Date.now().toString(),
        normalizedX,
        normalizedY,
        label: nextMarkerLabel,
      };
      
      // Update next marker label
      setNextMarkerLabel((parseInt(nextMarkerLabel) + 1).toString());
      
      // Add to markers list
      setMarkers([...markers, newMarker]);
      
      // Add visual marker to canvas
      const circle = new Circle({
        left: pointer.x,
        top: pointer.y,
        radius: 8,
        fill: 'rgba(255, 0, 0, 0.7)',
        stroke: 'white',
        strokeWidth: 2,
        originX: 'center',
        originY: 'center',
        hasControls: false,
        hasBorders: false,
        data: { markerId: newMarker.id },
      });
      
      canvas.add(circle);
      canvas.renderAll();
    }
  };

  // Handle marker removal
  const handleRemoveMarker = (markerId: string) => {
    // Remove from markers state
    setMarkers(markers.filter(m => m.id !== markerId));
    
    // Remove from canvas
    if (canvas) {
      const objects = canvas.getObjects();
      const markerObject = objects.find(obj => obj.data?.markerId === markerId);
      if (markerObject) {
        canvas.remove(markerObject);
        canvas.renderAll();
      }
    }
  };

  // Export markers data
  const handleExportMarkers = () => {
    const exportData = {
      imageWidth,
      imageHeight,
      markers
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'image-markers.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="image-mapper-container">
      <div className="image-mapper-sidebar">
        <div className="upload-section">
          <h3>Upload Image</h3>
          <ImageUploader onImageUpload={handleImageUpload} />
        </div>
        
        <div className="markers-section">
          <h3>Markers ({markers.length})</h3>
          <MarkersList 
            markers={markers} 
            onRemoveMarker={handleRemoveMarker} 
          />
          
          {markers.length > 0 && (
            <button className="export-button" onClick={handleExportMarkers}>
              Export Markers Data
            </button>
          )}
        </div>
      </div>
      
      <div className="canvas-container">
        {!imageUrl && (
          <div className="empty-canvas-message">
            Please upload an image to start mapping
          </div>
        )}
        <canvas 
          ref={canvasRef} 
          onClick={handleCanvasClick}
          className="mapping-canvas"
        />
      </div>
    </div>
  );
};
