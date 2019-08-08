import React from 'react';
import SongRow from './SongRow';

function SongTable({songs}) {
  const rows = songs.map(song => {
    const id = `${song.title} - ${song.creator}`;
    return <SongRow creator={song.creator} title={song.title} key={id}/>
  })
  return (
    <table>
      <tbody>
        {rows}
      </tbody>
    </table>
  )
}

export default SongTable;