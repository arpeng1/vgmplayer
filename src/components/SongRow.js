import React from 'react';

function SongRow({song, index, selectSong, className}) {
  return (
    <tr 
      onClick={() => selectSong(song)} 
      className={className}
      >
      <td>{index} {song.creator} - {song.title}</td>
    </tr>
  )

}

export default SongRow;