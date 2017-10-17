import initialState from './initialState';
import { GET_FILTER_JSON, UPDATE_FILTER, ADD_STICKER } from '../actions/actionTypes';
import { sampleTextObj } from '../filterSamples';

import { fabric } from 'fabric';

const createStickerObj = (name, imageSrcEl) => {
  var stickerImage = new fabric.Image(imageSrcEl);
  stickerImage.set({
    left: 100,
    top: 100
  });

  stickerImage.scaleToHeight(100);

  return stickerImage;
}

const filter = (prevFilter = initialState.filter, action) => {
  switch (action.type) {
    case GET_FILTER_JSON:
      return {
        state: JSON.parse(action.payload),
        filterJSON: action.payload,
      }
    case UPDATE_FILTER:
      return {
        state: JSON.parse(action.payload),
        filterJSON: action.payload,
      }
    case ADD_STICKER:
      let newFilterState = {
        ...prevFilter.state,
      };

      let sticker = createStickerObj(
        action.payload.stickerName, action.payload.stickerImageSrcEl);
      newFilterState.objects.push(sticker);

      return {
        state: newFilterState,
        filterJSON: JSON.stringify(newFilterState),
      }
    default:
      return prevFilter;
  }
};

export default filter;
