import React, { Component } from 'react';

import EditArea from './components/EditArea';
import ToolArea from './components/ToolArea';
import { sampleFilterJSON } from './filterSamples';

import './App.css';

class App extends Component {
  state = { width: 320, height: 568 }
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
