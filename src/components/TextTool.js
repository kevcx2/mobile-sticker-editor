import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import { getCanvas, addTextToCanvas, applyTextStyle, hexToRgbA } from '../canvas';
import ColorPicker from './ColorPicker';
import EditorButton from './EditorButton';
import AlignmentIcon from './AlignmentIcon';
import ToolHeader from './ToolHeader';

import './TextTool.css';

const TEXT_ALIGN_OPTIONS = ['left', 'center', 'right'];
const FONTS = {
  Arial: 'Arial',
  'Times New Roman': 'Times New Roman',
  Courier: 'Courier',
};
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

  onFontChange = (evt) => {
    const fontFamily = evt.value;
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
      value: fontFamily,
      label: FONTS[fontFamily],
    }));

    const currentSelection = {
      value: this.state.fontFamily || dropdownOptions[0].value,
      label: FONTS[this.state.fontFamily] || dropdownOptions[0].label,
    };

    return (
      <Dropdown
        options={dropdownOptions}
        onChange={this.onFontChange}
        value={currentSelection}
        disabled={!this.state.hasSelection}
        className="TextTool-dropdown"
      />
    );
  }

  renderTextAlignOption(option, isDisabled) {
    const isActive = option === this.state.textAlign;
    return (
      <div
        key={option}
        onClick={() => this.onAlignChange(option)}
        className={`TextTool-align_icon${isDisabled ? ' TextTool-align_icon_disabled' : ''}`}
      >
        <AlignmentIcon value={option} active={isActive} disabled={isDisabled} />
      </div>
    );
  }

  render() {
    return (
      <div>
        <EditorButton onClick={() => addTextToCanvas(this.state.fontFamily)}>
          + Add Text
        </EditorButton>
        <ToolHeader>Typeface</ToolHeader>
        {this.renderFontDropdown()}
        <ToolHeader>Text Alignment</ToolHeader>
        <div className="TextTool-align_icon_container">
          {TEXT_ALIGN_OPTIONS.map(
            option => this.renderTextAlignOption(option, !this.state.hasSelection),
          )}
        </div>
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
