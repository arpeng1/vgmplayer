import React, {useState, useEffect} from 'react';
import AersiaServices from './services/AersiaServices';
import SongTable from './components/SongTable';
import PlayerControls from './components/PlayerControls';

const parser = require('fast-xml-parser');

function App() {
  const [songs, setSongs] = useState([]);
  const [playlist, setPlaylist] = useState('mellow');
  const [selectedSong, setSelectedSong] = useState(null);

  // on initial load, grabs playlists
  useEffect((() => {
    AersiaServices
      .getPlaylist('mellow')
      .then(playlist => {
        if (!playlist || parser.validate(playlist)) {
          const jsonObj = parser.parse(playlist);
          const cleanSongs = cleanTracklist(jsonObj.playlist.trackList.track);
          setSongs(cleanSongs);
        } else {
          console.log('error, invalid playlist xml format', playlist);;
          throw new Error('invalid playlist');
        }
      })    
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  async function getPlaylist (event) {
    event.preventDefault();
    const name = event.target.value;
    try {
      setPlaylist(name);
      const response = await AersiaServices.getPlaylist(name);
      if (!response || parser.validate(response)) {
        const jsonObj = parser.parse(response);
        setSongs(cleanTracklist(jsonObj.playlist.trackList.track));
      } else {
        throw new Error('invalid playlist xml format');
      }
    } catch (exception) {
        console.log(exception);
    }
  }

  // ensures uniqueness, removes additional info from 
  function cleanTracklist(tracks) {
    tracks = tracks.slice(REMOVE_TRACKS_FROM_PLAYLIST_POS[playlist]);
    let songMap = new Map(); // used to ensure uniqueness
    const trackArrays = [];
    tracks.forEach(track => {
      let id = `${track.title}-${track.creator}`;
      if (!songMap.has(id)) {
        songMap.set(id, track);
        trackArrays.push(track);
      }
    })
    songMap = null;
    return trackArrays;
  }
  
  function selectSong(song) {
    setSelectedSong(song);
  }

  if (songs.length === 0) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div>
      <select value={playlist} onChange={(event) => getPlaylist(event)}>
        {PLAYLIST_OPTIONS.map(playlist => <option value={playlist} key={playlist}>{playlist}</option>)}
      </select>
      <SongTable songs={songs} selectSong={selectSong} selectedSong={selectedSong}/>
      <PlayerControls songs={songs} selectSong={selectSong} selectedSong={selectedSong} />
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
];

const REMOVE_TRACKS_FROM_PLAYLIST_POS = {
  VIP: 5,
  mellow: 3,
  source: 5,
  exiled: 1,
  WAP: 3,
  CPP: 1
}