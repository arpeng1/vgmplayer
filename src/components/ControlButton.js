import React from 'react';

function ControlButton({img, click}) {
  return (
    <div>
      <i class='material-icons' onClick={() => click()} style={{cursor:'pointer'}}>{img}</i>
    </div>
  )
}

export default ControlButton;