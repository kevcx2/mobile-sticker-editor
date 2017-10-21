import React, { Component } from 'react';

import { getCanvas, deleteSelection } from '../canvas';

import './DeleteSelectionPopup.css';

const POPUP_WIDTH = 25;
const POPUP_HEIGHT = 25;
const POPUP_DISTANCE = 25;

class DeleteSelectionPopup extends Component {
  state = {
    showPopup: false,
    popupStyle: {
      width: POPUP_WIDTH,
      height: POPUP_HEIGHT,
      left: 0,
      top: 0,
    },
    selectionStartPosition: {
      left: 0,
      right: 0,
    },
  };

  componentWillMount() {
    const canvas = getCanvas();
    canvas.on('object:modified', this.onObjectSelected);
    canvas.on('object:selected', this.onObjectSelected);
    canvas.on('object:moving', this.onObjectMoved);
    canvas.on('object:rotating', this.hideContextMenu);
    canvas.on('object:scaling', this.hideContextMenu);
    canvas.on('selection:cleared', this.onSelectionCleared);
  }

  componentWillUnmount() {
    const canvas = getCanvas();
    canvas.off('object:modified', this.onObjectSelected);
    canvas.off('object:selected', this.onObjectSelected);
    canvas.off('object:moving', this.onObjectMoved);
    canvas.off('object:rotating', this.hideContextMenu);
    canvas.off('object:scaling', this.hideContextMenu);
    canvas.off('selection:cleared', this.onSelectionCleared);
  }

  // When an object is selected, show the popup, set its initial
  // position and record the selected object's starting position.
  onObjectSelected = (evt) => {
    const selectedRect = evt.target.getBoundingRect();
    this.setContextMenuPositionFromTargetRect(selectedRect);

    this.setState({
      showPopup: true,
      selectionStartPosition: {
        left: evt.target.left,
        top: evt.target.top,
      },
    });
  }

  // When an obect moves, we need to update the popup's position. Unfortunately, the bounding rect
  // provded by the fabric canvas method getBoundingRect does not update until the object has
  // finished moving. The left and top object properties are the only position attributes that
  // update while the object is moving. However, because they refer to the distance to an object's
  // center, and the center can be arbitrarilty set, we cant rely on top and left measurements to
  // position the popup. To figure out where to postion the popup, we look calculate the delta
  // from its starting position to its current position using top and left, and then apply that
  // delta to the starting top-left coordinate provided by the object's bounding rect.
  onObjectMoved = (evt) => {
    const selectedRect = evt.target.getBoundingRect();
    const leftPosDelta =
      (evt.target.left - this.state.selectionStartPosition.left) * this.props.scaleRatio;
    const topPosDelta =
      (evt.target.top - this.state.selectionStartPosition.top) * this.props.scaleRatio;

    selectedRect.left += leftPosDelta;
    selectedRect.top += topPosDelta;
    this.setContextMenuPositionFromTargetRect(selectedRect);
  }

  onSelectionCleared = () => {
    this.setState({
      showPopup: false,
      selectionStartPosition: {
        left: 0,
        right: 0,
      },
      popupStyle: {
        width: POPUP_WIDTH,
        height: POPUP_HEIGHT,
        left: 0,
        top: 0,
      },
    });
  }

  // Given a rectangle object ({top, left, width, height}), calculate the popup's position.
  setContextMenuPositionFromTargetRect(targetRect) {
    const newContextMenuPosition = {
      left: (targetRect.left + (targetRect.width / 2)) - (POPUP_WIDTH / 2),
      top: targetRect.top + targetRect.height + POPUP_DISTANCE,
    };

    this.setState({
      popupStyle: {
        ...this.state.popupStyle,
        left: newContextMenuPosition.left,
        top: newContextMenuPosition.top,
      },
    });
  }

  // For scaling and rotating we just want to hide the popup while maintianing our selection
  // related state,
  hideContextMenu = () => {
    this.setState({
      showPopup: false,
    });
  }

  render() {
    const visibilityClass =
      this.state.showPopup ? ' DeleteSelectionPopup-show' : ' DeleteSelectionPopup-hide';
    return (
      <div
        onClick={deleteSelection}
        className={`DeleteSelectionPopup${visibilityClass}`}
        style={this.state.popupStyle}
      />
    );
  }
}

export default DeleteSelectionPopup;
