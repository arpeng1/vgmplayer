import React from 'react';

function SongRow({song, index, selectSong, className}) {
  const rowStyle = {
    cursor: 'pointer'
  }

  return (
    <tr
      style={rowStyle}
      onClick={() => selectSong(song)} 
      className={className}
      >
      <td>{index} {song.creator} - {song.title}</td>
    </tr>
  )

}

export default SongRow;