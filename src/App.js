import React, { Component } from 'react';

import PopEditor from './PopEditor';

const onSave = (filterJSON, filterDataUrl) => {
  const demoImg = new Image();
  demoImg.src = filterDataUrl;
  demoImg.style.position = 'absolute';
  demoImg.style.top = '20px';
  demoImg.style.height = '95vh';
  demoImg.style.left = '20px';
  demoImg.style.border = '1px solid grey';
  demoImg.style.backgroundColor = 'lightgrey';
  demoImg.style.zIndex = '1000';

  demoImg.onclick = () => { document.body.removeChild(demoImg); };
  document.body.appendChild(demoImg);
};

class App extends Component {
  state = {
    filterJSON: undefined,
  }

  constructor(props) {
    super(props);
    this.getFilterJSON();
  }

  getFilterJSON = () => {
    const filterSlug = 'pool_party';

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
      <div style={{ width: '100%' }}>
        <div style={{
 width: '80%', maxWidth: 625, minWidth: 375, margin: '0 auto',
}}
        >
          <PopEditor filterJSON={this.state.filterJSON} onSave={onSave} />
        </div>
      </div>
    );
  }
}

export default App;
