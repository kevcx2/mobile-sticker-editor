import React, { Component } from 'react';

import { addSvgStickerToCanvas } from '../canvas';
import ToolHeader from './ToolHeader';
import arrowIcon from '../img/arrow.svg'

import './StickerTool.css';

const importAll = (r) => {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}
const CATEGORY_ICONS = importAll(require.context('../img/icons', false, /\.png$/));
const SMILES_STICKERS = importAll(require.context('../img/stickers/Smiles', false, /\.svg$/));
const ANIMALS_STICKERS = importAll(require.context('../img/stickers/Animals', false, /\.svg$/));
const BUSINESS_STICKERS = importAll(require.context('../img/stickers/Business', false, /\.svg$/));
const FLAGS_STICKERS = importAll(require.context('../img/stickers/Flags', false, /\.svg$/));
const FOOD_STICKERS = importAll(require.context('../img/stickers/Food', false, /\.svg$/));
const PEOPLE_STICKERS = importAll(require.context('../img/stickers/People', false, /\.svg$/));
const RANDOM_STICKERS = importAll(require.context('../img/stickers/Random', false, /\.svg$/));
const SPORTS_STICKERS = importAll(require.context('../img/stickers/Sports', false, /\.svg$/));
const TRAVEL_STICKERS = importAll(require.context('../img/stickers/Travel', false, /\.svg$/));

const STICKERS = {
  Smiles: SMILES_STICKERS,
  Animals: ANIMALS_STICKERS,
  Business: BUSINESS_STICKERS,
  Flags: FLAGS_STICKERS,
  Food: FOOD_STICKERS,
  People: PEOPLE_STICKERS,
  Random: RANDOM_STICKERS,
  Sports: SPORTS_STICKERS,
  Travel: TRAVEL_STICKERS,
}

const CATEGORY_SCROLL_POSITIONS = [0, 42, 84, 126, 168, 210, 252, 294];

class StickerTool extends Component {
  state = {
    stickers: STICKERS,
    activeCategory: 'Smiles',
  };

  onAddSticker(evt) {
    addSvgStickerToCanvas(evt.target);
  }

  selectStickerCategory = (categoryName) => {
    this.setState({
      activeCategory: categoryName,
    });
  }

  scrollCategories = (direction) => {
    let newScrollPos = 0;
    if (direction === 'left') {
      CATEGORY_SCROLL_POSITIONS.sort((a, b) => b-a)
      newScrollPos = CATEGORY_SCROLL_POSITIONS.find((scrollPos) => {
        return (scrollPos < this.categoryScrollEl.scrollLeft)
      });
    } else {
      CATEGORY_SCROLL_POSITIONS.sort((a, b) => a-b)
      newScrollPos = CATEGORY_SCROLL_POSITIONS.find((scrollPos) => {
        return (scrollPos > this.categoryScrollEl.scrollLeft)
      });
    }

    this.categoryScrollEl.scrollLeft =
      newScrollPos === undefined ? this.categoryScrollEl.scrollLeft : newScrollPos;
  }

  render() {
    return (
      <div className={"StickerTool" + (this.props.smallLayout ? " SmallStickerTool" : "")}>
        <ToolHeader size="large">Add Stickers</ToolHeader>
        <div className="StickerTool-category_list_wrapper">
          <div 
            className="StickerTool-category_list-scroll_button left"
            onClick={() => this.scrollCategories('left')}
          >
            <img
              className="StickerTool-arrow"
              src={arrowIcon}
            />
          </div>
          <div 
            className="StickerTool-category_list-scroll_button right"
            onClick={() => this.scrollCategories('right')}
          >
            <img
              className="StickerTool-arrow"
              src={arrowIcon}
            />
          </div>
          <div 
            ref={(scrollEl) => this.categoryScrollEl = scrollEl}
            className="StickerTool-category_list_overflow_wrapper"
          >
            <div className="StickerTool-category_list">
              {Object.keys(this.state.stickers).map((stickerCategory) => {
                return (
                  <img
                    key={stickerCategory}
                    className="StickerTool-category_image"
                    onClick={() => this.selectStickerCategory(stickerCategory)}
                    src={CATEGORY_ICONS[`${stickerCategory}.png`]}
                    alt="sticker"
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className="StickerTool-sticker_list_wrapper">
          <div className="StickerTool-sticker_list">
            {Object.values(this.state.stickers[this.state.activeCategory]).map((stickerSrc, idx) => (
              <img
                key={idx}
                className="StickerTool-sticker_image"
                onClick={this.onAddSticker}
                src={stickerSrc}
                alt="sticker"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}


export default StickerTool;
