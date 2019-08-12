import React from 'react';

let classNames = require('classnames');

function SongRow({creator, title, index, selectSong, className}) {
  const rowClicked = {
    border: 'solid',
    borderWidth: 1,
    backgroundColor: 'red'
  };

  // const songRowClass = classNames({
  //   'rowClicked': true
  // })
  return (
    <tr 
      onClick={() => selectSong(`${creator}-${title}`)} 
      className={className}
      >
      <td>{index} {creator} - {title}</td>
    </tr>
  )

}

export default SongRow;