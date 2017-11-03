import React, { Component } from 'react';

import { getCanvas } from '../canvas';

import './SaveButton.css'

const SAVED_FILTER_WIDTH = 1080;
const SAVED_FILTER_HEIGHT = 1920;
const SAVED_FILTER_SCALE_FACTOR = 3.870967741935484;

class SaveButton extends Component {
  onCanvasSave = () => {
    const canvas = getCanvas();
    const startingWidth = canvas.width;
    const startingHeight = canvas.height;
    const startingZoom = canvas.getZoom();

    const filterJSON = canvas.toJSON();

    canvas.setWidth(SAVED_FILTER_WIDTH);
    canvas.setHeight(SAVED_FILTER_HEIGHT);
    canvas.setZoom(SAVED_FILTER_SCALE_FACTOR);

    const filterDataUrl = canvas.toDataURL();

    // For demo & testing purposes:
    const demoImg = new Image();
    demoImg.src = filterDataUrl;
    demoImg.style.position = 'absolute';
    demoImg.style.top = '20px';
    demoImg.style.height = '95vh';
    demoImg.style.left = '20px';
    demoImg.style.border = '1px solid grey';
    demoImg.style.backgroundColor = 'lightgrey';
    demoImg.style.zIndex = '1000';

    demoImg.onclick = () => {document.body.removeChild(demoImg)}
    document.body.appendChild(demoImg);

    canvas.setWidth(startingWidth);
    canvas.setHeight(startingHeight);
    canvas.setZoom(startingZoom);

    // Call provided onsave callback with json and dataUrl
  }

  render() {
    return (
      <button onClick={this.onCanvasSave} className="SaveButton">SAVE DESIGN AND CONTINUE</button>
    );
  }
}

export default SaveButton;