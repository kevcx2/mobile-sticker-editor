// Module for maintaining a globally accessabile reference to the fabricjs
// canvas object. The canvas object manages its internal state, and this module
// provides helpers for interacting with it in response to UI actions.
import { fabric } from 'fabric';

import goldTexture from './img/textures/gold.jpg';
import silverTexture from './img/textures/silver.jpg';

const TEXT_TEXTURES = {
  gold: goldTexture,
  silver: silverTexture,
}
const NO_TEXTURE = 'none';

let canvas;// eslint-disable-line
let canvasInitializedCallbacks = [];// eslint-disable-line

const TEXT_TYPE_STRING = 'i-text';
const FADE_IN_DURATION = 100;
const FADE_OUT_DURATION = 100;
const SHADOW_SETTINGS = {
  color: 'rgba(0,0,0,1)',
  affectStroke: true,
};

export const loadCanvasJson = (json, onComplete) => {
  if (!canvas) return;
  canvas.loadFromJSON(json, onComplete);
};

const selectionIncludesText = () => {
  const currentSelectionGroup = canvas.getActiveGroup();
  const currentSelectionObject = canvas.getActiveObject();

  if (currentSelectionGroup) {
    const groupSelectionObjects = currentSelectionGroup.getObjects();
    return groupSelectionObjects.some(object => object.type === TEXT_TYPE_STRING);
  } else if (currentSelectionObject) {
    return currentSelectionObject.type === TEXT_TYPE_STRING;
  }
  return false;
};

const selectionIncludesShadow = () => {
  const currentSelectionGroup = canvas.getActiveGroup();
  const currentSelectionObject = canvas.getActiveObject();

  if (currentSelectionGroup) {
    const groupSelectionObjects = currentSelectionGroup.getObjects();
    return groupSelectionObjects.some(object => !!object.shadow);
  } else if (currentSelectionObject) {
    return !!currentSelectionObject.shadow;
  }
  return false;
};

export const setFabricCanvas = (fabricCanvas) => {
  canvas = fabricCanvas;

  canvasInitializedCallbacks.forEach(callback => callback());
  // Object specific customization that should apply to all objects
  // selected in the editor's canvas.
  canvas.on('object:selected', (evt) => {
    evt.target.setControlsVisibility({
      mb: false,
      ml: false,
      mr: false,
      mt: false,
    });
    evt.target.set({
      centeredRotation: true,
      centeredScaling: true,
      borderColor: 'rgba(175,175,175,1)',
      cornerColor: 'rgba(255,255,255,1)',
      cornerStrokeColor: 'rgba(175,175,175,1)',
      transparentCorners: false,
    });

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

export const onCanvasInitialized = (callback) => {
  canvasInitializedCallbacks.push(callback);
};

const addWithFade = (object) => {
  object.cacheProperties.push('opacity');

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
      onComplete: () => {
        canvas.renderAll();
      },
    },
  );
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

  text.enterEditing();
  text.selectionStart = 0;
  text.selectionEnd = text.text.length;
};

const setTextStyle = (object, style) => {
  if (object.type === TEXT_TYPE_STRING) {
    if (style.color) object.setColor(style.color);
    if (style.textAlign) object.set({ textAlign: style.textAlign });
    if (style.fontFamily) object.set({ fontFamily: style.fontFamily });
    canvas.renderAll();
  }
};

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
};

const setTextTexture = (object, texture) => {
  // Remove the current texture - reset color back to the previous
  // color if we have it saved.
  if (texture === NO_TEXTURE) {
    if (object.popEditorData && object.popEditorData.untexturedColor) {
      object.set('fill', object.popEditorData.untexturedColor);
    } else {
      object.set('fill', '#000000');
    }
    canvas.renderAll();
  }

  // Add a custom property on the fabric object to store the
  // old color under a popEditorData namespace.
  if (!object.popEditorData) object.popEditorData = {};
  if (typeof object.fill === 'string' || object.fill instanceof String) {
    object.popEditorData.untexturedColor = object.fill;
  }

  const textureSrc = TEXT_TEXTURES[texture];
  if (!textureSrc) return;

  fabric.util.loadImage(textureSrc, (img) => {
    img.id = texture;
    object.set('fill', new fabric.Pattern({
      source: img,
      repeat: 'repeat',
    }));
    canvas.renderAll();
  });
} 

export const applyTextTexture = (texture) => {
  const currentSelectionGroup = canvas.getActiveGroup();
  const currentSelectionObject = canvas.getActiveObject();

  if (currentSelectionGroup) {
    currentSelectionGroup.objectCaching = false;
    const groupSelectionObjects = currentSelectionGroup.getObjects();
    groupSelectionObjects.forEach(object => setTextTexture(object, texture));
  } else if (currentSelectionObject) {
    setTextTexture(currentSelectionObject, texture);
  }
}

export const addSvgStickerToCanvas = (imgEl) => {
  canvas.discardActiveGroup();
  canvas.discardActiveObject();

  fabric.loadSVGFromURL(imgEl.src, (objects, options) => {
    const sticker = fabric.util.groupSVGElements(objects, options);
    sticker.set({
      left: 90,
      top: 100,
      opacity: 0,
      // Prevents blurriness during scaling for cached svgs.
      noScaleCache: false,
    });

    sticker.scaleToWidth(100);
    addWithFade(sticker);
  });
};

export const addStickerToCanvas = (imgEl) => {
  canvas.discardActiveGroup();
  canvas.discardActiveObject();

  const imgClone = imgEl.cloneNode();
  imgClone.onload = () => {
    new fabric.Image(
      imgClone,
      {
        left: 90,
        top: 100,
        opacity: 0,
      },
      (sticker) => {
        // TODO figure out initial sizing for custom images
        sticker.scaleToWidth(100);
        addWithFade(sticker);
      },
    );
  };
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
        canvas.renderAll();
      },
    },
  );
};

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

export const hexToRgbA = (hex) => {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = `0x${c.join('')}`;
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},1)`; //eslint-disable-line
  }
  return hex;
};

// Returns a reference to the active fabricjs canvas object. This is not a
// canvas HTML element.
export const getCanvas = () => canvas;

export default canvas;
