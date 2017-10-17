// Module for maintaining a globally accessabile reference to the fabricjs
// canvas object. The canvas object manages its internal state, and this module
// provides helpers for interacting with it in response to UI actions.
import { fabric } from 'fabric';

let canvas;// eslint-disable-line

export const setFabricCanvas = (fabricCanvas) => {
  canvas = fabricCanvas;
  return canvas;
};

export const addStickerToCanvas = (imgEl) => {
  const stickerImage = new fabric.Image(imgEl);
  stickerImage.set({
    left: 100,
    top: 100,
  });

  stickerImage.scaleToHeight(100);

  canvas.add(stickerImage);
  canvas.setActiveObject(stickerImage);
};

export const deleteSelection = () => {
  const currentSelectionGroup = canvas.getActiveGroup();

  if (currentSelectionGroup) {
    const selectionObjects = currentSelectionGroup.getObjects();
    selectionObjects.forEach(object => canvas.remove(object));
  } else {
    canvas.getActiveObject().remove();
  }
};

// Returns a reference to the active fabricjs canvas object. This is not a
// canvas HTML element.
export const getCanvas = () => canvas;

export default canvas;
