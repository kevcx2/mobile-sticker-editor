import React, { Component } from 'react';

import { onCanvasInitialized } from './canvas';
import EditArea from './components/EditArea';
import ToolArea from './components/ToolArea';
import { sampleFilterJSON } from './filterSamples';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    onCanvasInitialized(() => this.forceUpdate());
  }

  state = { width: 160, height: 284 }
  // state = {width: 480, height: 852} //1.5x

  render() {
    return (
      <div className="App">
        <EditArea
          width={this.state.width}
          height={this.state.height}
          filter={sampleFilterJSON}
        />
        <ToolArea />
      </div>
    );
  }
}

export default App;
