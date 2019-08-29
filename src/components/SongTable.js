import React from 'react';
import SongRow from './SongRow';

function SongTable({songs, selectSong, selectedSong = false}) {

  const tableStyle= {
    paddingBottom: '60px',
    paddingTop: '53px'
  }

  const rows = songs.map((song) => {
    const id = `${song.creator}-${song.title}`;
    return <SongRow 
              song={song}
              key={id} 
              selectSong={selectSong}/>
  })
  return (
    <table style={tableStyle}>
      <tbody>
        {rows}
      </tbody>
    </table>
  )
}

export default SongTable;