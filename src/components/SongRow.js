import React from 'react';

function SongRow({song, index, selectSong, hideShowSong, className, visible}) {
  const rowStyle = {
    cursor: 'pointer',
    display: 'flex',
  }
  const hiddenStyle = {
    fontSize: '16px',
    paddingBottom: '0',
    marginTop: '3px'
  }
  const visibleStyle = {
    fontSize: '16px',
    paddingBottom: '0',
    marginTop: '4px'
  }
  const hiddenTextStyle = {
    textDecoration: 'line-through'
  }

  return (
    <tr style={rowStyle} className={className}>
      {visible ? 
        <td onClick={() => hideShowSong(song)}>
          <i className='material-icons' style={visibleStyle}>clear</i>
        </td> :
        <td onClick={() => hideShowSong(song)}>
          <i className='material-icons' style={hiddenStyle}>add</i>
        </td>
      }
      <td onClick={() => selectSong(song)} style={visible ? null : hiddenTextStyle}>
        {index} {song.creator} - {song.title}
      </td>
    </tr>
  )

}

export default SongRow;