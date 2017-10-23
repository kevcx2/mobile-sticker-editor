import React, { Component } from 'react';

import { addStickerToCanvas } from '../canvas';
import ToolHeader from './ToolHeader';

import './StickerTool.css';

import sticker1 from '../img/1f60b.svg';
import sticker2 from '../img/1f60c.svg';
import sticker3 from '../img/1f60d.svg';
import sticker4 from '../img/1f60e.svg';
import sticker5 from '../img/1f60f.svg';

const TEST_STICKERS = {
  1: sticker1,
  2: sticker2,
  3: sticker3,
  4: sticker4,
  5: sticker5,
};

class StickerTool extends Component {
  state = {
    categories: TEST_STICKERS,
    stickers: {
      1: [{id: 1, src: sticker1},{id: 2, src: sticker1},{id: 3, src: sticker1},{id: 4, src: sticker1},{id: 5, src: sticker1},{id: 6, src: sticker1},{id: 7, src: sticker1},{id: 8, src: sticker1},{id: 9, src: sticker1},{id: 10, src: sticker1}],
      2: [{id: 1, src: sticker2},{id: 2, src: sticker2},{id: 3, src: sticker2},{id: 4, src: sticker2},{id: 5, src: sticker2},{id: 6, src: sticker2},{id: 7, src: sticker2},{id: 8, src: sticker2},{id: 9, src: sticker2},{id: 10, src: sticker2}],
      3: [{id: 1, src: sticker3},{id: 2, src: sticker3},{id: 3, src: sticker3},{id: 4, src: sticker3},{id: 5, src: sticker3},{id: 6, src: sticker3},{id: 7, src: sticker3},{id: 8, src: sticker3},{id: 9, src: sticker3},{id: 10, src: sticker3}],
      4: [{id: 1, src: sticker4},{id: 2, src: sticker4},{id: 3, src: sticker4},{id: 4, src: sticker4},{id: 5, src: sticker4},{id: 6, src: sticker4},{id: 7, src: sticker4},{id: 8, src: sticker4},{id: 9, src: sticker4},{id: 10, src: sticker4}],
      5: [{id: 1, src: sticker5},{id: 2, src: sticker5},{id: 3, src: sticker5},{id: 4, src: sticker5},{id: 5, src: sticker5},{id: 6, src: sticker5},{id: 7, src: sticker5},{id: 8, src: sticker5},{id: 9, src: sticker5},{id: 10, src: sticker5}],
    },
    activeCategory: 1,
  };

  selectStickerCategory = (categoryName) => {
    this.setState({
      activeCategory: categoryName,
    });
  }

  onAddSticker(evt) {
    addStickerToCanvas(evt.target);
  }

  render() {
    return (
      <div className="StickerTool">
        <ToolHeader>Add Stickers</ToolHeader>
        <div className="StickerTool-category_list_wrapper">
          <div className="StickerTool-category_list">
            {Object.keys(this.state.categories).map((stickerCategory) => {
              const stickerSrc = this.state.categories[stickerCategory];
              return (
                <img
                  key={stickerCategory}
                  className="StickerTool-category_image"
                  onClick={() => this.selectStickerCategory(stickerCategory)}
                  width={25}
                  height={25}
                  src={stickerSrc}
                  alt="sticker"
                />
              );
            })}
          </div>
        </div>
        <div className="StickerTool-sticker_list_wrapper">
        <div className="StickerTool-sticker_list">
          {this.state.stickers[this.state.activeCategory].map((sticker) => {
            return (
              <img
                key={sticker.id}
                className="StickerTool-sticker_image"
                onClick={this.onAddSticker}
                width={50}
                height={50}
                src={sticker.src}
                alt="sticker"
              />
            );
          })}
        </div>
        </div>
      </div>
    );
  }
}

export default StickerTool;
