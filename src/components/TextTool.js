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

// var fonts = {};

// document.querySelectorAll('.dropdown-menu')[0].querySelectorAll('li').forEach((liEl) => {
//   var aEl = liEl.querySelector('a');
//   fonts[aEl.innerText] = aEl.style.fontFamily;te
// });
// const FONTS = {
//   "Aleo-bold": "aleobold",
//   "Aleo-light": "aleolight",
//   "Alex Brush": "alex_brushregular",
//   "Alghifari": "_mj_alghifariregular",
//   "Antiquabold": "inknut_antiquabold",
//   "Antiquaregular": "inknut_antiquaregular",
//   "Atzurbold": "atzurbold",
//   "Badhead": "badhead",
//   "Blenny": "blenny",
//   "Boston Traffic": "boston_trafficregular",
//   "Brushbear": "swistblnk_duwhoers_brushRg",
//   "Bukhariscript": "bukhari_script",
//   "Capture": "capture_it_2regular",
//   "Capture It": "capture_itregular",
//   "Chivobold": "chivobold",
//   "Choplinelight": "choplinextralight",
//   "Choplinmedium": "choplinmedium",
//   "Courgette": "courgette",
//   "Debbyscript": "debbyscript",
//   "Geomanist": "geomanist",
//   "Grand Hotel": "grand_hotelregular",
//   "Handmade": "nexa_rust_handmadeextended",
//   "Homiziolight": "homiziolight",
//   "Kaushanscript": "KaushanScript-Regular",
//   "Kinescope": "kinescope",
//   "King Basil": "king_basil_literegular",
//   "Liberalhand": "liberal_handbold",
//   "Luthierbold": "luthierbold",
//   "Luthierregular": "luthierregular",
//   "Malua": "swistblnk_moalang_melintangRg",
//   "Melo": "meloregular",
//   "Moabear": "swistblnk_moabhoers_bold",
//   "Modum": "modumregular",
//   "Nickainley": "nickainley",
//   "Niconne": "niconne",
//   "Norwester": "norwester",
//   "Proxima": "proxima-nova",
//   "Reefbold": "Reefbold",
//   "Rhodium": "rhodium",
//   "Rubikbitalic": "rubikbold_italic",
//   "Rubikitalic": "rubikblack_italic",
//   "Rubikregular": "rubikregular",
//   "Rustscript": "nexa_rust_script_l0regular",
//   "Sansitabold": "sansitablack",
//   "Sansitareg": "sansitabold",
//   "Santelia": "santelia",
//   "Santeliarough": "santelia_roughline_two",
//   "Slablack": "nexa_rust_slabblack_shadow_01",
//   "Sortdecai": "sortdecai",
//   "Sortdecaibrush": "sortdecaibrush",
//   "Streetwear": "streetwear",
//   "Swistblnk": "swistblnk",
//   "Variane": "variane",
//   "Worksansbold": "work_sansbold",
//   "Worksanshairline": "work_sanshairline",
//   "Worksansregular": "work_sansregular",
//   "Worksansthin": "work_sansthin",
//   "Xplorer": "xplor_boldregular",
// };

