import React, { Component } from 'react';

import {
  getCanvas,
  addTextToCanvas,
  applyTextStyle,
  applyTextTexture,
  hexToRgbA,
} from '../canvas';
import ColorPicker from './ColorPicker';
import GlitterPicker from './GlitterPicker';
import EditorButton from './EditorButton';
import ToolHeader from './ToolHeader';
import FontDropdown from './FontDropdown';
import FONTS from '../fonts/fontList';

import './TextTool.css';

const TEXT_DEFAULTS = {
  hasSelection: false,
  color: 'rgba(0,0,0,1)',
  fontFamily: Object.keys(FONTS)[0],
  glitterType: 'none',
};

class TextTool extends Component {
  state = TEXT_DEFAULTS;

  componentWillMount() {
    const canvas = getCanvas();
    canvas.on('text:selected', this.onTextSelected);
    canvas.on('selection:cleared', this.restoreDefaults);
  }

  componentWillUnmount() {
    const canvas = getCanvas();
    canvas.off('text:selected', this.onTextSelected);
    canvas.off('selection:cleared', this.restoreDefaults);
  }

  onTextSelected = (evt) => {
    const textObj = evt.target;
    let textColor;

    if (typeof textObj.fill === 'string' || textObj.fill instanceof String) {
      textColor = textObj.fill;
      // At this point we know the fill is a color string and there is no glitter on the selection
      this.setState({
        glitterType: 'none',
      });
    } else {
      // If the text has a texture applied, we need to use the saved pre-texture color if it
      // exists, or default to black.
      if (textObj.popEditorData && textObj.popEditorData.untexturedColor) {
        textColor = textObj.popEditorData.untexturedColor;
      } else {
        textColor = '#000000';
      }

      // If we are here it means there is a texture currently applied to the text.
      // Save what it is in local state so we can indicate that a texture is applied
      // in the glitterpicker tool.
      this.setState({
        glitterType: textObj.fill.source.id,
      });
    }

    this.setState({
      hasSelection: true,
      // Text color can be hex - converts to rgba if appropriate.
      color: hexToRgbA(textColor),
      fontFamily: textObj.fontFamily,
    });
  }

  onColorChange = (color) => {
    this.setState({
      color,
      glitterType: 'none',
    }, () => applyTextStyle({
      color,
    }));
  }

  onFontChange = (fontFamily) => {
    this.setState({
      fontFamily,
    }, () => applyTextStyle({
      fontFamily,
    }));
  }

  onGlitterChange = (glitterType) => {
    this.setState({
      glitterType,
    }, () => applyTextTexture(glitterType));
  }

  restoreDefaults = () => {
    this.setState(TEXT_DEFAULTS);
  }

  renderFontDropdown() {
    const dropdownOptions = Object.keys(FONTS).map(fontFamily => ({
      value: FONTS[fontFamily],
      label: fontFamily,
    }));

    const currentLabel = Object.keys(FONTS).find(key => FONTS[key] === this.state.fontFamily);

    const currentSelection = {
      value: this.state.fontFamily || dropdownOptions[0].value,
      label: currentLabel || dropdownOptions[0].label,
    };

    return (
      <FontDropdown
        options={dropdownOptions}
        onChange={this.onFontChange}
        currentSelection={currentSelection}
        disabled={!this.state.hasSelection}
      />
    );
  }

  render() {
    return (
      <div>
        <EditorButton className="TextTool-add_text_button" onClick={() => addTextToCanvas(this.state.fontFamily)}>
          + Add Text
        </EditorButton>
        <ToolHeader>Typeface</ToolHeader>
        {this.renderFontDropdown()}
        <ToolHeader>Text Effects</ToolHeader>
        <div className="TextTool-effects_container">
          <ColorPicker
            color={this.state.color}
            onChange={this.onColorChange}
            disabled={!this.state.hasSelection}
          />
          <GlitterPicker
            disabled={!this.state.hasSelection}
            glitterType={this.state.glitterType}
            onChange={this.onGlitterChange}
          />
        </div>
      </div>
    );
  }
}

export default TextTool;
