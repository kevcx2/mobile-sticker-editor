import React, { Component } from 'react';
import { fabric } from 'fabric';

import { setFabricCanvas, getCanvas, loadCanvasJson } from '../canvas';
import StaticCanvas from './StaticCanvas';
import DeleteSelectionPopup from './DeleteSelectionPopup';
import phoneSvg from '../img/phone.svg';

import './EditArea.css';

const BASE_CANVAS_WIDTH = 279;
const BASE_CANVAS_HEIGHT = 496;

class EditArea extends Component {
  componentDidMount() {
    setFabricCanvas(new fabric.Canvas('filter'));
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.width !== this.props.width) {
      const newSizing = this.getCanvasSizing(nextProps.width)
      const canvas = getCanvas();
      canvas.setWidth(newSizing.width);
      canvas.setHeight(newSizing.height);
      window.setTimeout(() => this.setCanvasZoom(), 250);
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.filter && this.props.filter) {
      loadCanvasJson(this.props.filter, this.onUpdateCanvasJSON)
    }
  }

  onUpdateCanvasJSON = () => {

    getCanvas().getObjects().forEach((obj) => {
      if (obj.type === 'i-text') {
        obj.fontSize = obj.fontSize - 1;
        getCanvas().renderAll();
        obj.fontSize = obj.fontSize + 1;
        getCanvas().renderAll();
        obj.fontSize = obj.fontSize + 1;
        getCanvas().renderAll();
      }
    });

    this.setCanvasZoom();
  }

  getCanvasSizing(width) {
    const canvasWidth = .875 * width;
    const canvasHeight = (canvasWidth * BASE_CANVAS_HEIGHT) / BASE_CANVAS_WIDTH;
    const sizingData = {
      width: canvasWidth,
      height: canvasHeight,
    };

    const scaleRatio =
      Math.min(sizingData.width / BASE_CANVAS_WIDTH, sizingData.height / BASE_CANVAS_HEIGHT);
    sizingData.scaleRatio = scaleRatio;

    return sizingData;
  }

  setCanvasZoom() {
    const canvas = getCanvas();
    if (canvas) {
      const canvasSizing = this.getCanvasSizing(this.props.width);
      canvas.setZoom(canvasSizing.scaleRatio);
      canvas.renderAll();
    }
  }

  render() {
    const canvasSizing = this.getCanvasSizing(this.props.width);
    return (
      <div className="EditArea" style={{width: this.props.width}}>
        <img src={phoneSvg}></img>
        <div 
          className="EditArea-canvas_shadow"
          style={{width: canvasSizing.width, height: canvasSizing.height}}
        ></div>
        <div className="EditArea-canvas_container">
          <StaticCanvas width={canvasSizing.width} height={canvasSizing.height} />
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
