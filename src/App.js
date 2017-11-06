import React, { Component } from 'react';

import { onCanvasInitialized } from './canvas';
import EditArea from './components/EditArea';
import ToolArea from './components/ToolArea';
import StickerTool from './components/StickerTool';

import './App.css';

const filterSlug = 'christmas_family';
// const filterSlug = 'pool_party';

const EXTRA_SMALL_LAYOUT_BREAKPOINT = 475;
const SMALL_LAYOUT_BREAKPOINT = 625;
const LARGE_LAYOUT_EDITOR_WIDTH = 320;


class App extends Component {
  constructor(props) {
    super(props);
    onCanvasInitialized(() => this.forceUpdate());
  }

  state = {
    width: 0,
    filterJSON: undefined,
  }

  componentDidMount() {
    this.updateSize();
    window.addEventListener('resize', this.updateSize);

    // TODO remove this once we make this a standalone component
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

  // The editor sets its width based on the width of its parent.
  updateSize = () => {
    this.setState({
      width: this.appEl.parentElement.clientWidth,
    });
  }

  render() {
    const isExSmallLayout = this.state.width < EXTRA_SMALL_LAYOUT_BREAKPOINT;
    const isSmallLayout = this.state.width < SMALL_LAYOUT_BREAKPOINT;
    let editWidth = isSmallLayout ? this.state.width - 190 : LARGE_LAYOUT_EDITOR_WIDTH;
    editWidth = isExSmallLayout ? this.state.width - 150 : editWidth;

    const layoutClass = (isSmallLayout ? 'SmallLayout ' : '') + (isExSmallLayout ? 'ExSmallLayout' : '');

    // Positioning login gets a little messy... unfortunately its what is needed to accomodate
    // the large differences in desktop and mobile design. One hing to note is that there are two
    // copies of the sticker tool, one in the ToolArea, and one rendered here. The one in the
    // tool area will be shown on large screen layouts, and the one here will be shown on small
    // screen layouts.
    return (
      <div
        ref={(appEl) => { this.appEl = appEl; }}
        className={layoutClass}
      >
        <EditArea
          width={editWidth}
          filter={this.state.filterJSON}
        />
        <div
          className="App-small_sticker_container"
          style={{ height: 1.78 * (editWidth) }}
        >
          <StickerTool smallLayout />
        </div>
        <ToolArea />
      </div>
    );
  }
}

export default App;
