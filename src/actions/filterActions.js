import * as types from './actionTypes';

export const getFilterJSON = filterJSON => ({
  type: types.GET_FILTER_JSON,
  payload: filterJSON,
});

export const updateFilter = filterJSON => ({
  type: types.UPDATE_FILTER,
  payload: filterJSON,
});

export const addSticker = (stickerName, stickerImageSrcEl) => ({
  type: types.ADD_STICKER,
  payload: {
    stickerName,
    stickerImageSrcEl,
  },
});