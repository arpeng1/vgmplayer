import React from 'react';

function ProgressBar({progressPercent, mouseDown, trackBarRef, pointRef}) {

  const track = {
    position: 'relative',
    width: '100%',
    height: '10px',
    background: '#7f6157',
  }

  const progress = {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: '10px',
    height: '10px',
    width: `${progressPercent}`,
    background: '#FF9148'
  }

  const point = {
    position: 'absolute',
    left : `${progressPercent}`,
    top: '50%',
    bottom: '10px',
    height: '12px',
    width: '12px',
    background: 'black',
    transform: `translate(-50%, -50%)`
  }

  return (
    <div style={track} onMouseDown={(e) => mouseDown(e)} ref={trackBarRef}>
      <div style={progress} />
      {/* <div style={point} ref={pointRef} /> */}
      <div style={point} onMouseDown={(e) => mouseDown(e)} ref={pointRef} />
    </div>
  )
}

export default ProgressBar;