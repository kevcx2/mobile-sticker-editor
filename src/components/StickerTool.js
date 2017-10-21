import React, { Component } from 'react';

import { addStickerToCanvas } from '../canvas';

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
    stickers: TEST_STICKERS,
  };

  onAddSticker(stickerName, evt) {
    addStickerToCanvas(evt.target);
  }

  renderCustomStickers() {
    if (this.props.customStickers.length < 1) return null;
    return this.props.customStickers.map((stickerSrc, idx) => {
      const stickerName = `custom-sticker-${idx}`;
      return (
        <button className="StickerTool-button" key={stickerName}>
          <img
            onClick={evt => this.onAddSticker(stickerName, evt)}
            width={50}
            height={50}
            src={stickerSrc}
            alt="sticker"
          />
        </button>
      );
    });
  }

  render() {
    return (
      <div className="StickerTool">
        {Object.keys(this.state.stickers).map((stickerName) => {
          const stickerSrc = this.state.stickers[stickerName];
          return (
            <button className="StickerTool-button" key={stickerName}>
              <img
                onClick={evt => this.onAddSticker(stickerName, evt)}
                width={50}
                height={50}
                src={stickerSrc}
                alt="sticker"
              />
            </button>
          );
        })}
        {this.renderCustomStickers()}
      </div>
    );
  }
}

export default StickerTool;
