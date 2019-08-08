import React from 'react';

function SongRow({creator, title}) {
  const id = `${creator} - ${title}`;
  return (
    <tr>
      <td key={id}>{creator} - {title}</td>
    </tr>
  )

}

export default SongRow;