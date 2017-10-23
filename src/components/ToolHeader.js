import React from 'react';

import './ToolHeader.css';

const ToolHeader = (props) => {
  return (
    <div className="ToolHeader">{props.children}</div>
  );
};

export default ToolHeader;