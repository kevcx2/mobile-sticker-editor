import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getFilterJSON, updateFilter, addSticker } from './actions/filterActions';
import EditArea from './components/EditArea';
import ToolArea from './components/ToolArea';

import './App.css';

class App extends Component {
  state = {width: 320, height: 568}
  // state = {width: 480, height: 852} //1.5x

  render() {
    return (
      <div className="App">
        <EditArea width={this.state.width}
                  height={this.state.height}
                  filter={this.props.filter}
                  onUpdate={this.props.updateFilter}/>
        <ToolArea onAddSticker={this.props.addSticker}/>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  filter: state.filter.filterJSON,
});

const mapDispatchToProps = dispatch => ({
  receiveFilterJSON: filterJSON => dispatch(getFilterJSON(filterJSON)),
  updateFilter: filterJSON => dispatch(updateFilter(filterJSON)),
  addSticker: (name, imgSrcEl) => dispatch(addSticker(name, imgSrcEl)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
