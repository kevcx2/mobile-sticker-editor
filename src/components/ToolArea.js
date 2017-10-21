import React from 'react';

import { getCanvas } from '../canvas';
import StickerTool from './StickerTool';
import ShadowTool from './ShadowTool';
import ImageUploadTool from './ImageUploadTool';

import './ToolArea.css';

const ToolArea = () => {
  if (!getCanvas()) return null;

  return (
    <div>
      <StickerTool />
      <ShadowTool />
      <ImageUploadTool />
    </div>
  );
};

export default ToolArea;
