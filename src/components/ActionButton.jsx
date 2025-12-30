import React from 'react';

const ActionButton = ({ onClick, disabled, cooldown }) => (
  <button onClick={onClick} disabled={disabled}>
    {cooldown > 0 ? `Wait ${cooldown}s` : 'Refresh Build'}
  </button>
);

export default ActionButton;
