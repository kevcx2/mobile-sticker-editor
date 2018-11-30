import React, { Component } from 'react';

import goldTexture from '../img/textures/gold.jpg';
import silverTexture from '../img/textures/silver.jpg';
import './GlitterPicker.css';

const GOLD_TEXTURE = 'gold';
const SILVER_TEXTURE = 'silver';
const NO_TEXTURE = 'none';

class GlitterPicker extends Component {
  state = {
    showGlitterPicker: false,
  }

  componentDidUpdate() {
    if (this.state.showGlitterPicker) {
      const glitterPickerBoundingRect =
        this.glitterPicker && this.glitterPicker.getBoundingClientRect();
      if (!glitterPickerBoundingRect) return;

      // Check if the glitterPicker is out the viewport on the top or right, and correct its
      // position if it is.
      if (glitterPickerBoundingRect.top < 0) {
        const currTop = parseInt(window.getComputedStyle(this.glitterPicker).top, 10);
        this.glitterPicker.style.top = `${currTop + (-1 * glitterPickerBoundingRect.top)}px`;
      }

      const viewWidth = document.documentElement.clientWidth;
      if (glitterPickerBoundingRect.right > viewWidth) {
        const currLeft = parseInt(window.getComputedStyle(this.glitterPicker).left, 10);
        this.glitterPicker.style.left =
          `${currLeft + (-1 * (glitterPickerBoundingRect.right - viewWidth))}px`;
      }
    }
  }

  onGlitterSelection = (texture) => {
    this.props.onChange(texture);
  }

  onGlitterOpen = () => {
    if (this.props.disabled) return;
    this.setState({
      showGlitterPicker: true,
    });
  }

  render() {
    const menuVisibilityClass =
      this.state.showGlitterPicker ? 'GlitterPicker-show' : ' GlitterPicker-hide';
    const disabledClass = this.props.disabled ? ' GlitterPicker-disabled' : '';
    const glitterColorClass =
      this.props.glitterType ? ` GlitterPicker-${this.props.glitterType}` : '';

    return (
      <div className={`GlitterPicker-container${disabledClass}`}>
        <div onClick={this.onGlitterOpen} className={`GlitterPicker-button${glitterColorClass}`}>
          T
        </div>
        <div className={menuVisibilityClass}>
          <div
            onClick={() => this.setState({ showGlitterPicker: false })}
            className="GlitterPicker-menu_cover"
          />
          <div
            ref={(glitterPicker) => { this.glitterPicker = glitterPicker; }}
            className="GlitterPicker-menu"
          >
            <div
              style={{ backgroundImage: `url("${goldTexture}")` }}
              className="GlitterPicker-menu_option"
              onClick={() => { this.onGlitterSelection(GOLD_TEXTURE); }}
            />
            <div
              style={{ backgroundImage: `url("${silverTexture}")` }}
              className="GlitterPicker-menu_option"
              onClick={() => { this.onGlitterSelection(SILVER_TEXTURE); }}
            />
            <div
              className="GlitterPicker-menu_option"
              onClick={() => { this.onGlitterSelection(NO_TEXTURE); }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default GlitterPicker;
