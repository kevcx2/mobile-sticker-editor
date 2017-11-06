import React, { Component } from 'react';

// This component is responsible for rendering the canvas onto the DOM once, and never
// re-rendering again. Once the canvas is initially rendered and passed to fabric.js,
// canvas resizing and any other changes will be controlled by fabric, and not react.
// This is necesarry to resize the canvas dynamically without breaking fabric.
class StaticCanvas extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <canvas id="filter" width={this.props.width} height={this.props.height} />
    );
  }
}

export default StaticCanvas;
