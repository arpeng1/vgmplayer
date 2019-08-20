import React from 'react';

function ProgressBar({progressPercent}) {

  const track = {
    position: 'relative',
    width: '100%',
    height: '5px',
    background: '#7f6157'
  }

  const progress = {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: '10px',
    height: '5px',
    width: `${progressPercent}`,
    background: '#FF9148'
  }

  const point = {
    position: 'absolute',
    left : `${progressPercent}`,
    top: '50%'
  }

  return (
    <div style={track}>
      <div style={progress} />
      <div style={point} />
    </div>
  )
}

export default ProgressBar;