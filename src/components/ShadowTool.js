import React, { Component } from 'react';
import { ChromePicker } from 'react-color';

import {
  getCanvas,
  getSelectionShadows,
  applyShadowToSelection,
  removeShadowFromSelection,
} from '../canvas';

import './ShadowTool.css';

const SHADOW_DEFAULTS = {
  color: 'rgba(1,20,30,1)',
  offsetX: 0,
  offsetY: 0,
  blur: 5,
};

class ShadowTool extends Component {
  state = {
    showColorPicker: false,
    selectionHasShadow: false,
    ...SHADOW_DEFAULTS,
  };

  componentWillMount() {
    const canvas = getCanvas();
    canvas.on('object:selected', this.checkSelectionShadow);
    canvas.on('selection:cleared', this.clearShadowCheckbox);
  }

  componentDidUpdate() {
    if (this.state.selectionHasShadow) {
      this.applyShadow();
    }
  }

  componentWillUnmount() {
    const canvas = getCanvas();
    canvas.off('object:selected', this.checkSelectionShadow);
    canvas.off('selection:cleared', this.clearShadowCheckbox);
  }

  checkSelectionShadow = () => {
    const currentSelectionShadows = getSelectionShadows();

    const selectionHasShadow = currentSelectionShadows.length > 0;
    const offsetX =
      selectionHasShadow ? currentSelectionShadows[0].offsetX : SHADOW_DEFAULTS.offsetX;
    const offsetY =
      selectionHasShadow ? currentSelectionShadows[0].offsetY : SHADOW_DEFAULTS.offsetY;

    this.setState({
      selectionHasShadow,
      offsetX,
      offsetY,
    });
  }

  clearShadowCheckbox = () => {
    this.setState({
      selectionHasShadow: false,
      ...SHADOW_DEFAULTS,
    });
  }

  onShadowCheckboxChange = (evt) => {
    if (evt.target.checked) {
      this.applyShadow();
    } else {
      removeShadowFromSelection();
    }
    this.checkSelectionShadow();
  }

  showColorPicker = () => {
    this.setState({
      showColorPicker: true,
    });
  }

  closeColorPicker = () => {
    this.setState({
      showColorPicker: false,
    });
  }

  onColorChange = (color) => {
    this.setState({
      color: this.colorObjToString(color),
    });
  }

  onShadowSettingsChange = (evt) => {
    this.setState({
      [evt.target.id]: evt.target.value,
    });
  }

  applyShadow() {
    applyShadowToSelection({
      offsetX: this.state.offsetX,
      offsetY: this.state.offsetY,
      blur: this.state.blur,
      color: this.state.color,
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
    return (
      <div>
        <input
          name="selectionHasShadow"
          type="checkbox"
          checked={this.state.selectionHasShadow}
          onChange={this.onShadowCheckboxChange}
        />
        <div className="ShadowTool-color_picker_container">
          <div
            className="ShadowTool-color_preview"
            style={{ backgroundColor: this.state.color }}
            onClick={this.showColorPicker}
          />
          {this.state.showColorPicker ? (
            <div className="ShadowTool-color_picker">
              <div className="ShadowTool-color_picker_cover" onClick={this.closeColorPicker} />
              <ChromePicker
                color={this.stringToColorObj(this.state.color)}
                onChangeComplete={this.onColorChange}
              />
            </div>) : null
            }
        </div>
        <div>X Offset:
          <input
            type="number"
            id="offsetX"
            value={this.state.selectionHasShadow ? this.state.offsetX : 0}
            onChange={this.onShadowSettingsChange}
            disabled={this.state.selectionHasShadow ? '' : 'disabled'}
          />
        </div>
        <div>Y Offset:
          <input
            type="number"
            id="offsetY"
            value={this.state.selectionHasShadow ? this.state.offsetY : 0}
            onChange={this.onShadowSettingsChange}
            disabled={this.state.selectionHasShadow ? '' : 'disabled'}
          />
        </div>
        <div>Blur:
          <input
            type="number"
            id="blur"
            value={this.state.selectionHasShadow ? this.state.blur : 0}
            onChange={this.onShadowSettingsChange}
            disabled={this.state.selectionHasShadow ? '' : 'disabled'}
          />
        </div>
      </div>
    );
  }
}

export default ShadowTool;
