import React, { Component } from 'react';
import { fabric } from 'fabric';

import { setFabricCanvas, getCanvas } from '../canvas';
import DeleteSelectionPopup from './DeleteSelectionPopup';

import './EditArea.css';

const BASE_CANVAS_WIDTH = 279;
const BASE_CANVAS_HEIGHT = 496;

class EditArea extends Component {
  componentDidMount() {
    setFabricCanvas(new fabric.Canvas('filter'));
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.filter && this.props.filter) {
      getCanvas().loadFromJSON(this.props.filter, this.onUpdateCanvasJSON);
    }
  }

  onUpdateCanvasJSON = () => {
    this.setCanvasZoom();
  }

  getCanvasSizing() {
    const sizingData = {
      width: this.props.width || BASE_CANVAS_WIDTH,
      height: this.props.height || BASE_CANVAS_HEIGHT,
    };

    const scaleRatio =
      Math.min(sizingData.width / BASE_CANVAS_WIDTH, sizingData.height / BASE_CANVAS_HEIGHT);
    sizingData.scaleRatio = scaleRatio;

    return sizingData;
  }

  setCanvasZoom() {
    const canvas = getCanvas();
    if (canvas) {
      const canvasSizing = this.getCanvasSizing();
      canvas.setZoom(canvasSizing.scaleRatio);
    }
  }

  render() {
    const canvasSizing = this.getCanvasSizing();
    return (
      <div className="EditArea">
        <div className="EditArea-canvas_container">
          <canvas id="filter" width={canvasSizing.width} height={canvasSizing.height} />
          {getCanvas() ? (
            <DeleteSelectionPopup
              canvasSizing={canvasSizing}
              scaleRatio={canvasSizing.scaleRatio}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default EditArea;
