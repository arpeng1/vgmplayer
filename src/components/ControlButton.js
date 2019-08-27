import React from 'react';

function ControlButton({img, click, color = null}) {
  const buttonStyle = {
    cursor: 'pointer',
    color: color,
    khtmlUserSelect: 'none',
    OUserSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    userSelect: 'none'
  }
  return (
    <div>
      <i className='material-icons' onClick={() => click()} style={buttonStyle}>{img}</i>
    </div>
  )
}

export default ControlButton;