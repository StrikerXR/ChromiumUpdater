import React from 'react';

const ActionButton = ({ onClick }) => (
  <button onClick={onClick}>
    {'Refresh Build'}
  </button>
);

export default ActionButton;
