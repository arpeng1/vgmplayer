import React from 'react';
import SongRow from './SongRow';

let classNames = require('classnames');

function SongTable({songs, selectSong, selectedSong = false}) {

  // const rowClicked = {
  //   border: 'solid',
  //   borderWidth: 1,
  //   backgroundColor: 'red'
  // };

  const songRowClass = classNames({
    'rowClicked': true
  })

  const tableStyle= {
    paddingBottom: '60px'
  }

  const rows = songs.map((song) => {
    const id = `${song.creator}-${song.title}`;
    return <SongRow 
              className={selectedSong === song ? songRowClass : ''}
              song={song}
              key={id} 
              selectSong={selectSong}/>
    // return <SongRow 
    //           className={selectedSong === id ? songRowClass : ''} 
    //           creator={song.creator} title={song.title} 
    //           key={id} 
    //           selectSong={selectSong}/>
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