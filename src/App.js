import React, { Component } from 'react';

import { onCanvasInitialized } from './canvas';
import EditArea from './components/EditArea';
import ToolArea from './components/ToolArea';
import StickerTool from './components/StickerTool';

import './App.css';

const filterSlug = "christmas_family";
// const filterSlug = 'pool_party';

const EXTRA_SMALL_LAYOUT_BREAKPOINT = 475;
const SMALL_LAYOUT_BREAKPOINT = 625;
const LARGE_LAYOUT_EDITOR_WIDTH = 320;
  // 279 x   497   base
  // 139.5 x 248   //.5x
  // 418.5 x 745.5 //1.5

  // 320 x 568 base
  // state = { width: 160, height: 284 } //.5x
  // state = {width: 480, height: 852} //1.5x

class App extends Component {
  constructor(props) {
    super(props);
    onCanvasInitialized(() => this.forceUpdate());
  }

  state = {
    width: 320,
    filterJSON: undefined,
    smallLayout: false,
  }

  resizeTimer = undefined

  componentDidMount() {
    this.updateSize();
    window.addEventListener('resize', this.updateSize);

    const parseFilterResponse = (response) => {
      this.setState({
        filterJSON: response.design_json,
      });
    };

    fetch(`https://www.dev.filterpop.com/api/design/${filterSlug}`, {
      method: 'get',
    }).then(response => response.json())
      .then(json => parseFilterResponse(json));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize);
  }

  updateSize = () => {
    this.setState({
      width: this.appEl.parentElement.clientWidth,
    });
  }

  render() {
    const isExSmallLayout = this.state.width < EXTRA_SMALL_LAYOUT_BREAKPOINT;
    const inSmallLayout = this.state.width < SMALL_LAYOUT_BREAKPOINT;
    let editWidth = inSmallLayout ? this.state.width - 190 : LARGE_LAYOUT_EDITOR_WIDTH;
    editWidth = isExSmallLayout ? this.state.width - 150 : editWidth;


    // Positioning login gets a little messy... unfortunately its what is needed to accomodate
    // the large differences in desktop and mobile design.
    return (
      <div
        ref={(appEl) => this.appEl = appEl}
        className={inSmallLayout ? "SmallLayout" : ""}
      >
        <EditArea
          width={editWidth}
          filter={this.state.filterJSON}
        />
        <div
          className={"App-small_sticker_container" + (isExSmallLayout ? ' ExSmallLayout' : '')}
          style={{height: 1.78 * (editWidth)}}
        >
          <StickerTool smallLayout={true}/>
        </div>
        <ToolArea/>
      </div>
    );
  }
}

export default App;
