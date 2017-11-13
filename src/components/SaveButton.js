import React, { Component } from 'react';

import { getCanvas } from '../canvas';

import './SaveButton.css';

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

    canvas.setWidth(startingWidth);
    canvas.setHeight(startingHeight);
    canvas.setZoom(startingZoom);

    this.props.onSave(filterJSON, filterDataUrl);
  }

  render() {
    return (
      <button onClick={this.onCanvasSave} className="SaveButton">SAVE DESIGN AND CONTINUE</button>
    );
  }
}

export default SaveButton;
