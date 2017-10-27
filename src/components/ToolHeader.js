import React from 'react';

import './ToolHeader.css';

const ToolHeader = (props) => {
  const sizeClass = props.size ? (' ToolHeader-' + props.size) : '';
  return (
    <div className={"ToolHeader" + sizeClass}>{props.children}</div>
  );
};

export default ToolHeader;