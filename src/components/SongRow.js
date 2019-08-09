import React from 'react';

function SongRow({creator, title}) {
  return (
    <tr onClick={() => alert(`selected ${creator} - ${title}`)}>
      <td>{creator} - {title}</td>
    </tr>
  )

}

export default SongRow;