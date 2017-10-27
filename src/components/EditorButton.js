import React from 'react';

import './EditorButton.css';

const EditorButton = (props) => {
  return (
    <button {...props} className="EditorButton">{props.children}</button>
  );
}

export default EditorButton;