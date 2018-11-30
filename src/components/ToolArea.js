import React from 'react';

import { getCanvas } from '../canvas';
import TextTool from './TextTool';
import StickerTool from './StickerTool';
import ShadowTool from './ShadowTool';
import ImageUploadTool from './ImageUploadTool';
import SaveButton from './SaveButton';

import './ToolArea.css';

const ToolArea = (props) => {
  if (!getCanvas()) return null;
  return (
    <div className="ToolArea">
      <TextTool />
      <ShadowTool />
      <StickerTool />
      <ImageUploadTool />
      <SaveButton onSave={props.onSave} />
    </div>
  );
};

export default ToolArea;
