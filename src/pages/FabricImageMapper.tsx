
import React from 'react';
import { ImageMapper } from '@/components/image-mapper/ImageMapper';
import './FabricImageMapper.css';

const FabricImageMapperPage = () => {
  return (
    <div className="fabric-image-mapper-page">
      <h1>Image Mapping POC</h1>
      <p className="description">
        Upload an image and click to place markers. Markers will maintain their relative position regardless of screen size.
      </p>
      <ImageMapper />
    </div>
  );
};

export default FabricImageMapperPage;
