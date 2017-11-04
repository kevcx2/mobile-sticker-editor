import React, { Component } from 'react';

import {
  getCanvas,
  getSelectionShadows,
  applyShadowToSelection,
  removeShadowFromSelection,
  hexToRgbA
} from '../canvas';
import ColorPicker from './ColorPicker';
import ToolHeader from './ToolHeader';

import './ShadowTool.css';

const SHADOW_DEFAULTS = {
  color: 'rgba(0,0,0,1)',
  offsetX: 0,
  offsetY: 0,
  blur: 5,
};

class ShadowTool extends Component {
  state = {
    hasSelection: false,
    selectionHasShadow: false,
    ...SHADOW_DEFAULTS,
  };

  componentWillMount() {
    const canvas = getCanvas();
    canvas.on('object:selected', this.checkSelectionShadow);
    canvas.on('selection:cleared', this.clearShadowCheckbox);
  }

  componentWillUnmount() {
    const canvas = getCanvas();
    canvas.off('object:selected', this.checkSelectionShadow);
    canvas.off('selection:cleared', this.clearShadowCheckbox);
  }

  onShadowCheckboxChange = (evt) => {
    if (evt.target.checked) {
      this.applyShadow();
    } else {
      removeShadowFromSelection();
    }
    this.checkSelectionShadow();
  }

  onColorChange = (color) => {
    this.setState({
      color,
    }, () => this.applyShadow({
      color,
      offsetX: this.state.offsetX,
      offsetY: this.state.offsetY,
      blur: this.state.blur,
    }));
  }

  onColorOpen = () => {
    this.applyShadow({
      color: this.state.color,
      offsetX: this.state.offsetX,
      offsetY: this.state.offsetY,
      blur: this.state.blur,
    });
  }

  onShadowSettingsChange = (evt) => {
    const id = evt.target.id;
    const value = evt.target.value || 0;
    this.setState({
      [id]: value,
    }, () => {
      this.applyShadow(Object.assign({}, {
        color: this.state.color,
        offsetX: this.state.offsetX,
        offsetY: this.state.offsetY,
        blur: this.state.blur,
      }, {
        [id]: value,
      }));
    });
  }

  clearShadowCheckbox = () => {
    this.setState({
      hasSelection: false,
      selectionHasShadow: false,
      ...SHADOW_DEFAULTS,
    });
  }

  checkSelectionShadow = () => {
    const currentSelectionShadows = getSelectionShadows();

    const selectionHasShadow = currentSelectionShadows.length > 0;
    const offsetX =
      selectionHasShadow ? currentSelectionShadows[0].offsetX : SHADOW_DEFAULTS.offsetX;
    const offsetY =
      selectionHasShadow ? currentSelectionShadows[0].offsetY : SHADOW_DEFAULTS.offsetY;
    const color =
      selectionHasShadow ? hexToRgbA(currentSelectionShadows[0].color) : SHADOW_DEFAULTS.color;
    const blur =
      selectionHasShadow ? currentSelectionShadows[0].blur : SHADOW_DEFAULTS.blur;

    this.setState({
      hasSelection: true,
      selectionHasShadow,
      color,
      offsetX,
      offsetY,
      blur,
    });
  }

  applyShadow = (shadowStyle = {}) => {
    applyShadowToSelection({
      offsetX: shadowStyle.offsetX === undefined ? SHADOW_DEFAULTS.offsetX : shadowStyle.offsetX,
      offsetY: shadowStyle.offsetY === undefined ?  SHADOW_DEFAULTS.offsetY : shadowStyle.offsetY,
      blur: shadowStyle.blur === undefined ?  SHADOW_DEFAULTS.blur : shadowStyle.blur,
      color: shadowStyle.color === undefined ?  SHADOW_DEFAULTS.color : shadowStyle.color,
    });

    this.setState({
      selectionHasShadow: true,
    });
  }

  render() {
    return (
      <div>
        <ToolHeader>Shadow</ToolHeader>
        <div className="ShadowTool">
          <div className="ShadowTool-checkbox_container">
            <input
              className="ShadowTool-checkbox"
              name="selectionHasShadow"
              type="checkbox"
              checked={this.state.selectionHasShadow}
              onChange={this.onShadowCheckboxChange}
              disabled={this.state.hasSelection ? '' : 'disabled'}
            />
          </div>
          <div className="ShadowTool-color_picker_container">
            <ColorPicker
              color={this.state.color}
              onOpen={this.onColorOpen}
              onChange={this.onColorChange}
              disabled={!this.state.hasSelection}
            />
          </div>
          <div className="ShadowTool-input_group">
            <div className="ShadowTool-input_container">
              <input
                className="ShadowTool-input"
                type="number"
                id="offsetX"
                value={this.state.selectionHasShadow ? this.state.offsetX : 0}
                onChange={this.onShadowSettingsChange}
                disabled={this.state.selectionHasShadow ? '' : 'disabled'}
              />
              <div className="ShadowTool-input_label">X</div>
            </div>
            <div className="ShadowTool-input_container">
              <input
                className="ShadowTool-input"
                type="number"
                id="offsetY"
                value={this.state.selectionHasShadow ? this.state.offsetY : 0}
                onChange={this.onShadowSettingsChange}
                disabled={this.state.selectionHasShadow ? '' : 'disabled'}
              />
              <div className="ShadowTool-input_label">Y</div>
            </div>
            <div className="ShadowTool-input_container">
              <input
                className="ShadowTool-input"
                type="number"
                id="blur"
                value={this.state.selectionHasShadow ? this.state.blur : 0}
                onChange={this.onShadowSettingsChange}
                disabled={this.state.selectionHasShadow ? '' : 'disabled'}
              />
              <div className="ShadowTool-input_label">Blur Radius</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ShadowTool;
