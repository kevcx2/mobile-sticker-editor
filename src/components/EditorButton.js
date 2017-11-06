import React from 'react';

import './EditorButton.css';

const EditorButton = props => (
  <button {...props} className={`${props.className} EditorButton`}>{props.children}</button>
);

export default EditorButton;
