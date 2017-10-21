// Module for maintaining a globally accessabile reference to the fabricjs
// canvas object. The canvas object manages its internal state, and this module
// provides helpers for interacting with it in response to UI actions.
import { fabric } from 'fabric';

let canvas;// eslint-disable-line
let canvasInitializedCallbacks = [];// eslint-disable-line

const SHADOW_SETTINGS = {
  color: 'rgba(0,0,0,1)',
  affectStroke: true,
};

export const setFabricCanvas = (fabricCanvas) => {
  canvas = fabricCanvas;

  canvasInitializedCallbacks.forEach(callback => callback());
  canvas.on('object:selected', (evt) => {
    evt.target.centeredRotation = true;// eslint-disable-line
    evt.target.centeredScaling = true;// eslint-disable-line
  });
  return canvas;
};

export const onCanvasInitialized = (callback) => {
  canvasInitializedCallbacks.push(callback);
};

export const addStickerToCanvas = (imgEl) => {
  canvas.discardActiveGroup();
  canvas.renderAll();

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
  const currentSelectionObject = canvas.getActiveObject();

  if (currentSelectionGroup) {
    // Clear selection group before removing selection objects 1 by 1.
    canvas.discardActiveGroup();

    const groupSelectionObjects = currentSelectionGroup.getObjects();
    groupSelectionObjects.forEach(object => canvas.remove(object));
  } else if (currentSelectionObject) {
    canvas.getActiveObject().remove();
  }

  canvas.renderAll();
};

export const getSelectionShadows = () => {
  const currentSelectionGroup = canvas.getActiveGroup();
  const currentSelectionObject = canvas.getActiveObject();

  const currentSelectionShadows = [];
  if (currentSelectionGroup) {
    const groupSelectionObjects = currentSelectionGroup.getObjects();
    groupSelectionObjects.forEach((object) => {
      const shadow = object.getShadow();
      if (shadow) currentSelectionShadows.push(shadow);
    });
  } else if (currentSelectionObject) {
    const shadow = currentSelectionObject.getShadow();
    if (shadow) currentSelectionShadows.push(shadow);
  }

  return currentSelectionShadows;
};

const setShadow = (object, settings) => {
  object.setShadow(Object.assign(SHADOW_SETTINGS, settings));
  canvas.renderAll();
};

export const applyShadowToSelection = (settings) => {
  const currentSelectionGroup = canvas.getActiveGroup();
  const currentSelectionObject = canvas.getActiveObject();

  if (currentSelectionGroup) {
    const groupSelectionObjects = currentSelectionGroup.getObjects();
    groupSelectionObjects.forEach(object => setShadow(object, settings));
  } else if (currentSelectionObject) {
    setShadow(currentSelectionObject, settings);
  }
};

export const removeShadowFromSelection = () => {
  const currentSelectionGroup = canvas.getActiveGroup();
  const currentSelectionObject = canvas.getActiveObject();

  if (currentSelectionGroup) {
    const groupSelectionObjects = currentSelectionGroup.getObjects();
    // Hack to avoid issues caused by object caching where the
    // objects would dissapear after removing a group shadow.
    currentSelectionGroup.objectCaching = false;
    groupSelectionObjects.forEach((object) => {
      const shadow = object.getShadow();
      if (shadow) object.shadow = null; //eslint-disable-line
    });
  } else if (currentSelectionObject) {
    const shadow = currentSelectionObject.getShadow();
    if (shadow) currentSelectionObject.shadow = null;
  }

  canvas.renderAll();
};

// Returns a reference to the active fabricjs canvas object. This is not a
// canvas HTML element.
export const getCanvas = () => canvas;

export default canvas;
