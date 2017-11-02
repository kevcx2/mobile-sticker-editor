import React, { Component } from 'react';
import { ChromePicker } from 'react-color';

import './ColorPicker.css';

class ColorPicker extends Component {
  state = {
    showColorPicker: false,
  }

  componentDidUpdate() {
    if (this.state.showColorPicker) {
      const colorPickerBoundingRect =
        this.colorPicker && this.colorPicker.getBoundingClientRect();
      if (!colorPickerBoundingRect) return;

      if (colorPickerBoundingRect.top < 0) {
        const currTop = parseInt(window.getComputedStyle(this.colorPicker).top, 10);
        this.colorPicker.style.top = `${currTop + (-1 * colorPickerBoundingRect.top)}px`;
      }
    }
  }

  showColorPicker = () => {
    if (!this.props.disabled) {
      this.props.onOpen && this.props.onOpen();

      this.setState({
        showColorPicker: true,
      });
    }
  }

  closeColorPicker = () => {
    this.setState({
      showColorPicker: false,
    });
  }

  colorObjToString(color) {
    return `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
  }

  stringToColorObj(colorString) {
    const colorVals =
      colorString.substring(colorString.indexOf('(') + 1, colorString.lastIndexOf(')'))
        .split(/,\s*/);
    return {
      r: parseInt(colorVals[0], 10),
      g: parseInt(colorVals[1], 10),
      b: parseInt(colorVals[2], 10),
      a: parseFloat(colorVals[3]),
    };
  }

  render() {
    const disabledClass = this.props.disabled ? ' ColorPicker-disabled' : '';
    return (
      <div className="ColorPicker-color_picker_container">
        <div
          className={`ColorPicker-color_preview_container${disabledClass}`}
          onClick={this.showColorPicker}
        >
          <div
            className="ColorPicker-color_preview"
            style={{ backgroundColor: this.props.color }}
          />
        </div>
        {this.state.showColorPicker ? (
          <div 
            ref={colorPicker => this.colorPicker = colorPicker}
            className="ColorPicker-color_picker"
          >
            <div className="ColorPicker-color_picker_cover" onClick={this.closeColorPicker} />
            <ChromePicker
              color={this.stringToColorObj(this.props.color)}
              onChangeComplete={color => this.props.onChange(this.colorObjToString(color))}
            />
          </div>) : null
          }
      </div>
    );
  }
}

export default ColorPicker;

