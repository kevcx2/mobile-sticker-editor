import React, { Component } from 'react';

import { onCanvasInitialized } from './canvas';
import EditArea from './components/EditArea';
import ToolArea from './components/ToolArea';

import './App.css';

// const filterSlug = "christmas_family";
const filterSlug = 'pool_party';


class App extends Component {
  constructor(props) {
    super(props);
    onCanvasInitialized(() => this.forceUpdate());
  }

  state = {
    width: 365.7,
    filterJSON: undefined,
  }
  // 279 x   497   base
  // 139.5 x 248   //.5x
  // 418.5 x 745.5 //1.5

  // 320 x 568 base
  // state = { width: 160, height: 284 } //.5x
  // state = {width: 480, height: 852} //1.5x

  componentDidMount() {
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

  render() {
    return (
      <div className="App">
        <ToolArea />
        <EditArea
          width={this.state.width}
          filter={this.state.filterJSON}
        />
      </div>
    );
  }
}

export default App;
