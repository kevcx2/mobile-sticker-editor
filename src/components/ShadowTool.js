import React, { Component } from 'react';

import {
  getCanvas,
  getSelectionShadows,
  applyShadowToSelection,
  removeShadowFromSelection,
} from '../canvas';
import ColorPicker from './ColorPicker';

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

  componentDidUpdate(prevProps, prevState) {
    const stateChanged = !(JSON.stringify(this.state) === JSON.stringify(prevState));
    if (this.state.selectionHasShadow && stateChanged) {
      this.applyShadow();
    }
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
    });
  }

  onShadowSettingsChange = (evt) => {
    this.setState({
      [evt.target.id]: evt.target.value,
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
      selectionHasShadow ? currentSelectionShadows[0].color : SHADOW_DEFAULTS.color;
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

  clearShadowCheckbox = () => {
    this.setState({
      hasSelection: false,
      selectionHasShadow: false,
      ...SHADOW_DEFAULTS,
    });
  }

  applyShadow = () => {
    applyShadowToSelection({
      offsetX: this.state.offsetX,
      offsetY: this.state.offsetY,
      blur: this.state.blur,
      color: this.state.color,
    });

    this.setState({
      selectionHasShadow: true,
    });
  }

  render() {
    return (
      <div>
        <input
          name="selectionHasShadow"
          type="checkbox"
          checked={this.state.selectionHasShadow}
          onChange={this.onShadowCheckboxChange}
          disabled={this.state.hasSelection ? '' : 'disabled'}
        />
        <ColorPicker
          color={this.state.color}
          onOpen={this.applyShadow}
          onChange={this.onColorChange}
          disabled={!this.state.hasSelection}
        />
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
