import React, { Component } from 'react';
import { fabric } from 'fabric';

import PhoneShape from './PhoneShape';

import './EditArea.css';

const BASE_CANVAS_WIDTH = 320;
const BASE_CANVAS_HEIGHT = 568;

const CONTEXT_MENU_WIDTH = 20;
const CONTEXT_MENU_HEIGHT = 20;
const CONTEXT_MENU_DISTANCE = 20;

class EditArea extends Component {
  state = {
    fabricCanvas: null,
    currentState: null,
    hasActiveSelection: false,
    selectionStartPosition: {
      left: 0,
      right: 0,
    },
    contextMenuStyle: {
      width: CONTEXT_MENU_WIDTH,
      height: CONTEXT_MENU_HEIGHT,
      left: 0,
      top: 0,
    },
  };

  componentDidMount() {
    const fabricCanvas = new fabric.Canvas('filter');
    this.setState({
      fabricCanvas,
    })

    fabricCanvas.loadFromJSON(this.props.filter, this.onUpdateCanvasJSON);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.filter && this.state.fabricCanvas) {
      if (nextProps.filter !== this.state.currentState) {
        this.state.fabricCanvas.loadFromJSON(nextProps.filter, this.onUpdateCanvasJSON);
      }
    }
  }

  getCanvasSizing() {
    let sizingData = {
      width: this.props.width || BASE_CANVAS_WIDTH,
      height: this.props.height || BASE_CANVAS_HEIGHT,
    };

    let scaleRatio = Math.min(
      sizingData.width/BASE_CANVAS_WIDTH, sizingData.height/BASE_CANVAS_HEIGHT);
    sizingData.scaleRatio = scaleRatio;

    return sizingData;
  }

  onUpdateCanvasJSON = () => {
    this.setCanvasZoom();
    this.updateCanvasState();
    this.setCanvasListeners();
  }

  updateCanvasState = () => {
    const currentStateJSON = JSON.stringify(this.state.fabricCanvas);
    this.setState({
      currentState: currentStateJSON,
    });

    this.props.onUpdate(currentStateJSON);
  }

  setCanvasZoom() {
    if (this.state.fabricCanvas) {
      const canvasSizing = this.getCanvasSizing();
      this.state.fabricCanvas.setZoom(canvasSizing.scaleRatio);
    }
  }

  setCanvasListeners() {
    const canvas = this.state.fabricCanvas;
    canvas.on('object:modified', this.updateCanvasState);
    canvas.on('object:modified', this.onObjectSelected);
    canvas.on('object:selected', this.onObjectSelected);
    canvas.on('object:moving', this.onObjectMoved);
    canvas.on('object:rotating', this.hideContextMenu);
    canvas.on('object:scaling', this.hideContextMenu);
    canvas.on('selection:cleared', this.onSelectionCleared);
  }

  onObjectSelected = (evt) => {
    const selectedRect = evt.target.getBoundingRect();
    this.setContextMenuPositionFromTargetRect(selectedRect);

    this.setState({
      hasActiveSelection: true,
      selectionStartPosition: {
        left: evt.target.left,
        top: evt.target.top,
      }
    });
  }

  onObjectMoved = (evt) => {
    const selectedRect = evt.target.getBoundingRect();
    const leftPosDelta = evt.target.left - this.state.selectionStartPosition.left;
    const topPosDelta = evt.target.top - this.state.selectionStartPosition.top;

    selectedRect.left = selectedRect.left + leftPosDelta;
    selectedRect.top = selectedRect.top + topPosDelta;
    this.setContextMenuPositionFromTargetRect(selectedRect);

  }

  onSelectionCleared = () => {
    this.setState({
      hasActiveSelection: false,
      selectionStartPosition: {
        left: 0,
        right: 0,
      },
      contextMenuStyle: {
        width: CONTEXT_MENU_WIDTH,
        height: CONTEXT_MENU_HEIGHT,
        left: 0,
        top: 0,
      },
    });
  }

  hideContextMenu = () => {
    this.setState({
      hasActiveSelection: false,
    });
  }

  setContextMenuPositionFromTargetRect(targetRect) {
    const newContextMenuPosition = {
      left: targetRect.left + (targetRect.width / 2) - (CONTEXT_MENU_WIDTH / 2),
      top: targetRect.top + targetRect.height + CONTEXT_MENU_DISTANCE,
    }

    this.setState({
      contextMenuStyle: {
        ...this.state.contextMenuStyle,
        left: newContextMenuPosition.left,
        top: newContextMenuPosition.top,
      },
    });
  }

  render() {
    const canvasSizing = this.getCanvasSizing();
    const contextVisibilityClass = this.state.hasActiveSelection ? ' show' : ' hide';
    return (
      <div className="EditArea">
        <div className="EditArea-canvas_container">
          <canvas id="filter" width={canvasSizing.width} height={canvasSizing.height} />
          <div className={"EditArea-context_menu" + contextVisibilityClass}
               style={this.state.contextMenuStyle}/>
        </div>
      </div>
    );
  }
}

export default EditArea;
