import React, { Component } from 'react';

import { getCanvas } from '../canvas';
import StickerTool from './StickerTool';
import ShadowTool from './ShadowTool';
import ImageUploadTool from './ImageUploadTool';

import './ToolArea.css';

class ToolArea extends Component {
  state = {
    customStickers: [],
  }

  onUploadCustomImage = (dataUrl) => {
    const customStickerList = this.state.customStickers;
    customStickerList.push(dataUrl)
    this.setState({
      customStickers: customStickerList,
    });
  }

  render() {
    if (!getCanvas()) return null;

    return (
      <div>
        <StickerTool customStickers={this.state.customStickers}/>
        <ShadowTool />
        <ImageUploadTool onUpload={this.onUploadCustomImage}/>
      </div>
    );
  }
};

export default ToolArea;
