import React from 'react';

const AlignmentIcon = (props) => {
  let fillColor = props.active ? 'black' : '#CED0D4';
  fillColor = props.disabled ? '#CED0D4' : fillColor;
  if (props.value === 'left') {
    return (
      <svg
        fill={fillColor}
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="19"
        viewBox="0 0 24 24"
      >
        <path d="M24 3h-24v-2h24v2zm-12 3h-12v2h12v-2zm12 5h-24v2h24v-2zm-12 5h-12v2h12v-2zm12 5h-24v2h24v-2z" />{ /* eslint-disable-line */ }
      </svg>
    );
  } else if (props.value === 'center') {
    return (
      <svg
        fill={fillColor}
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="19"
        viewBox="0 0 24 24"
      >
        <path d="M24 3h-24v-2h24v2zm-6 3h-12v2h12v-2zm6 5h-24v2h24v-2zm-6 5h-12v2h12v-2zm6 5h-24v2h24v-2z" />{ /* eslint-disable-line */ }
      </svg>
    );
  } else if (props.value === 'right') {
    return (
      <svg
        fill={fillColor}
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="19"
        viewBox="0 0 24 24"
      >
        <path d="M0 1h24v2h-24v-2zm12 7h12v-2h-12v2zm-12 5h24v-2h-24v2zm12 5h12v-2h-12v2zm-12 5h24v-2h-24v2z" />{ /* eslint-disable-line */ }
      </svg>
    );
  }
  return null;
};

export default AlignmentIcon;
