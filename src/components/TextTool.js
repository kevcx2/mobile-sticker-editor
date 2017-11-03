import React, { Component } from 'react';

import { getCanvas, addTextToCanvas, applyTextStyle, hexToRgbA } from '../canvas';
import ColorPicker from './ColorPicker';
import EditorButton from './EditorButton';
import AlignmentIcon from './AlignmentIcon';
import ToolHeader from './ToolHeader';
import FontDropdown from './FontDropdown';
import FONTS from '../fonts/fontList';

import './TextTool.css';

const TEXT_ALIGN_OPTIONS = ['left', 'center', 'right'];

const TEXT_DEFAULTS = {
  hasSelection: false,
  color: 'rgba(0,0,0,1)',
  textAlign: TEXT_ALIGN_OPTIONS[0],
  fontFamily: Object.keys(FONTS)[0],
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
    // Text color can be hex - converts to rgba if appropriate.
    this.setState({
      hasSelection: true,
      color: hexToRgbA(evt.target.fill),
      textAlign: evt.target.textAlign,
      fontFamily: evt.target.fontFamily,
    });
  }

  onColorChange = (color) => {
    this.setState({
      color,
    }, () => applyTextStyle({
      color,
    }));
  }

  onAlignChange = (textAlign) => {
    this.setState({
      textAlign,
    }, () => applyTextStyle({
      textAlign,
    }));
  }

  onFontChange = (fontFamily) => {
    this.setState({
      fontFamily,
    }, () => applyTextStyle({
      fontFamily,
    }));
  }

  restoreDefaults = () => {
    this.setState(TEXT_DEFAULTS);
  }

  renderFontDropdown() {
    const dropdownOptions = Object.keys(FONTS).map(fontFamily => ({
      value: FONTS[fontFamily],
      label: fontFamily,
    }));

    const currentLabel = Object.keys(FONTS).find((key) => {
      return FONTS[key] === this.state.fontFamily
    });

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
        <ToolHeader>Text Color</ToolHeader>
        <div className="TextTool-color_container">
          <ColorPicker
            color={this.state.color}
            onChange={this.onColorChange}
            disabled={!this.state.hasSelection}
          />
        </div>
      </div>
    );
  }
}

export default TextTool;
