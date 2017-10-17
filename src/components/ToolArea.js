import React, { Component } from 'react';

import { addStickerToCanvas } from '../canvas';

import sticker1 from '../img/1f60b.svg';
import sticker2 from '../img/1f60c.svg';
import sticker3 from '../img/1f60d.svg';
import sticker4 from '../img/1f60e.svg';
import sticker5 from '../img/1f60f.svg';

import './ToolArea.css';

const TEST_STICKERS = {
  1: sticker1,
  2: sticker2,
  3: sticker3,
  4: sticker4,
  5: sticker5,
};

class ToolArea extends Component {
  state = {
    buttons: TEST_STICKERS,
  };

  // componentDidMount() {
  //   const parseIconList = icon => this.setState({
  //     buttons: {
  //       ...this.state.buttons,
  //       [icon.name]: icon.image,
  //     },
  //   });

  //   fetch('https://www.filterpop.com/api/icons', {
  //     method: 'get',
  //   }).then(response =>
  //     response.json()).then(json =>
  //     json.forEach(icon => parseIconList(icon)));
  // }

  onAddSticker(buttonName, evt) {
    addStickerToCanvas(evt.target);
  }

  render() {
    return (
      <div>
        {Object.keys(this.state.buttons).map((buttonName) => {
          const buttonImgSrc = this.state.buttons[buttonName];
          return (
            <button className="ToolArea-sticker_button" key={buttonName}>
              <img
                onClick={evt => this.onAddSticker(buttonName, evt)}
                width={50}
                height={50}
                src={buttonImgSrc}
              />
            </button>
          );
        })}
      </div>
    );
  }
}

export default ToolArea;
