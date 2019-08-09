import React from 'react';

function ControlButton({msg, click}) {
  return (
    <div>
      <button onClick={() => click()}>{msg}</button>
    </div>
  )
}

export default ControlButton;