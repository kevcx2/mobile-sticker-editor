// Module for maintaining a globally accessabile reference to the fabricjs
// canvas object. The canvas object manages its internal state, and this module
// provides helpers for interacting with it in response to UI actions.
import { fabric } from 'fabric';

let canvas;// eslint-disable-line
let canvasInitializedCallbacks = [];// eslint-disable-line

const TEXT_TYPE_STRING = 'i-text';
const FADE_IN_DURATION = 100;
const FADE_OUT_DURATION = 100;
const SHADOW_SETTINGS = {
  color: 'rgba(0,0,0,1)',
  affectStroke: true,
};

export const setFabricCanvas = (fabricCanvas) => {
  canvas = fabricCanvas;

  canvasInitializedCallbacks.forEach(callback => callback());
  // Object specific customization that should apply to all objects
  // selected in the editor's canvas.
  canvas.on('object:selected', (evt) => {
    evt.target.centeredRotation = true;// eslint-disable-line
    evt.target.centeredScaling = true;// eslint-disable-line
    evt.target.setControlsVisibility({
      mb: false,
      ml: false,
      mr: false,
      mt: false,
    });
    evt.target.borderColor = 'rgba(175,175,175,1)';
    evt.target.cornerColor = 'rgba(255,255,255,1)';
    evt.target.cornerStrokeColor = 'rgba(175,175,175,1)';
    evt.target.transparentCorners = false;

    // Trigger a custom selection event when the target includes text.
    if (selectionIncludesText()) {
      canvas.trigger('text:selected', evt);
    }
    // Trigger a custom selection event when the target includes a shadow.
    if (selectionIncludesShadow()) {
      canvas.trigger('shadow:selected', evt);
    }
    // If a single object is selected, bring it to the front.
    if (canvas.getActiveObject()) {
      canvas.bringToFront(canvas.getActiveObject());
    }
  });
  return canvas;
};

const selectionIncludesText = (evt) => {
  const currentSelectionGroup = canvas.getActiveGroup();
  const currentSelectionObject = canvas.getActiveObject();

  if (currentSelectionGroup) {
    const groupSelectionObjects = currentSelectionGroup.getObjects();
    return groupSelectionObjects.some((object) => {
      return object.type === TEXT_TYPE_STRING;
    });
  } else if (currentSelectionObject) {
    return currentSelectionObject.type === TEXT_TYPE_STRING;
  }
}

const selectionIncludesShadow = () => {
  const currentSelectionGroup = canvas.getActiveGroup();
  const currentSelectionObject = canvas.getActiveObject();

  if (currentSelectionGroup) {
    const groupSelectionObjects = currentSelectionGroup.getObjects();
    return groupSelectionObjects.some((object) => {
      return !!object.shadow
    });
  } else if (currentSelectionObject) {
    return !!currentSelectionObject.shadow;
  }
}

export const onCanvasInitialized = (callback) => {
  canvasInitializedCallbacks.push(callback);
};

export const addTextToCanvas = (font) => {
  canvas.discardActiveGroup();
  canvas.discardActiveObject();
  canvas.renderAll();

  const text = new fabric.IText('Click To Edit');
  text.set({
    left: 20,
    top: 100,
    opacity: 0,
    fontFamily: font,
  });
  text.scaleToWidth(250);

  addWithFade(text);
}

export const applyTextStyle = (style) => {
  const currentSelectionGroup = canvas.getActiveGroup();
  const currentSelectionObject = canvas.getActiveObject();

  if (currentSelectionGroup) {
    currentSelectionGroup.objectCaching = false;
    const groupSelectionObjects = currentSelectionGroup.getObjects();
    groupSelectionObjects.forEach(object => setTextStyle(object, style));
  } else if (currentSelectionObject) {
    setTextStyle(currentSelectionObject, style);
  }
}

const setTextStyle = (object, style) => {
  if (object.type === TEXT_TYPE_STRING) {
    if (style.color) object.setColor(style.color);
    if (style.textAlign) object.textAlign = style.textAlign;
    if (style.fontFamily) object.fontFamily = style.fontFamily;
    canvas.renderAll();
  }
}

export const addStickerToCanvas = (imgEl) => {
  canvas.discardActiveGroup();
  canvas.discardActiveObject();
  canvas.renderAll();

  const stickerImage = new fabric.Image(imgEl.cloneNode());
  stickerImage.set({
    left: 100,
    top: 100,
    opacity: 0,
  });

  // TODO figure out initial sizing for custom images
  // stickerImage.scaleToHeight(100);
  stickerImage.scaleToWidth(100);
  addWithFade(stickerImage);
};

const addWithFade = (object) => {
  canvas.add(object);
  canvas.setActiveObject(object);
  object.animate(
    'opacity',
    '1',
    {
      duration: FADE_IN_DURATION,
      onChange: () => {
        canvas.renderAll();
      },
    }
  );
}

export const deleteSelection = () => {
  const currentSelectionGroup = canvas.getActiveGroup();
  const currentSelectionObject = canvas.getActiveObject();

  if (currentSelectionGroup) {
    // Clear selection group before removing selection objects 1 by 1.
    canvas.discardActiveGroup();

    const groupSelectionObjects = currentSelectionGroup.getObjects();
    groupSelectionObjects.forEach(object => removeWithFade(object));
  } else if (currentSelectionObject) {
    removeWithFade(currentSelectionObject);
  }

  canvas.renderAll();
};

const removeWithFade = (object) => {
  object.animate(
    'opacity',
    '0',
    {
      duration: FADE_OUT_DURATION,
      onChange: () => {
        canvas.renderAll();
      },
      onComplete: () => {
        canvas.remove(object);
      }
    }
  )
}

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
