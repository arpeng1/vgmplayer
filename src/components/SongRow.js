import React from 'react';

// let classNames = require('classnames');

function SongRow({song, index, selectSong, className}) {
  // const rowClicked = {
  //   border: 'solid',
  //   borderWidth: 1,
  //   backgroundColor: 'red'
  // };

  // const songRowClass = classNames({
  //   'rowClicked': true
  // })
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