import React from 'react';

import { getCanvas } from '../canvas';
import TextTool from './TextTool';
import StickerTool from './StickerTool';
import ShadowTool from './ShadowTool';
import ImageUploadTool from './ImageUploadTool';
import SaveButton from './SaveButton';

import './ToolArea.css';

const ToolArea = () => {
  if (!getCanvas()) return null;
  return (
    <div className="ToolArea">
      <TextTool />
      <ShadowTool />
      <StickerTool />
      <ImageUploadTool />
      <SaveButton />
    </div>
  );
};

export default ToolArea;
