import React, {useState, useEffect} from 'react';
import AersiaServices from './services/AersiaServices';

const parser = require('fast-xml-parser');

function App() {

  const [songs, setSongs] = useState([]);
  const [playlist, setPlaylist] = useState('VIP');

  useEffect((() => {
    AersiaServices
      .getPlaylist('VIP')
      .then(playlist => {
        if (!playlist || parser.validate(playlist)) {
          const jsonObj = parser.parse(playlist);
          console.log(jsonObj, jsonObj.playlist.trackList.track);
          setSongs(jsonObj.playlist.trackList.track);
        } else {
          console.log('error, invalid playlist xml format', playlist);;
          throw new Error('invalid playlist');
        }
      })    
  }), []);


  async function getPlaylist (event) {
    event.preventDefault();
    const name = event.target.value;
    try {
      setPlaylist(name);
      const response = await AersiaServices.getPlaylist(name);
      if (!response || parser.validate(response)) {
        const jsonObj = parser.parse(response);
        setSongs(jsonObj.playlist.trackList.track);
      } else {
        throw new Error('invalid playlist xml format');
      }
    } catch (exception) {
        console.log(exception);
    }

  }

  return (
    <div>
      <p>playlist selected {playlist}</p>
      <select value={playlist} onChange={(event) => getPlaylist(event)}>
        {PLAYLIST_OPTIONS.map(playlist => <option value={playlist} key={playlist}>{playlist}</option>)}
      </select>
      {songs.map(song => <div key={song.location}>{song.creator} - {song.title}</div>)}
    </div>
  );
}

export default App;

const PLAYLIST_OPTIONS = [
  'VIP',
  'mellow',
  'source',
  'exiled',
  'WAP',
  'CPP'
]

const DEFAULT_PLAYLIST = 'VIP'
