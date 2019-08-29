import React, {useState, useEffect} from 'react';
import AersiaServices from './services/AersiaServices';
import SongTable from './components/SongTable';
import PlayerControls from './components/PlayerControls';

const parser = require('fast-xml-parser');

function App() {
  const [songs, setSongs] = useState([]);
  const [playlist, setPlaylist] = useState('mellow');
  const [selectedSong, setSelectedSong] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect((() => {
    AersiaServices
      .getPlaylist(playlist)
      .then(trackList => {
        if (!trackList || parser.validate(trackList)) {
          const jsonObj = parser.parse(trackList);
          const cleanSongs = cleanTracklist(jsonObj.playlist.trackList.track, playlist);
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
        setSongs(cleanTracklist(jsonObj.playlist.trackList.track, name));
      } else {
        throw new Error('invalid playlist xml format');
      }
    } catch (exception) {
        console.log(exception);
    }
  }

  // ensures uniqueness, removes additional info from 
  function cleanTracklist(tracks, p) {
    tracks = tracks.slice(REMOVE_TRACKS_FROM_PLAYLIST_POS[p][0], tracks.length-REMOVE_TRACKS_FROM_PLAYLIST_POS[p][1]);
    let songMap = new Map(); // used to ensure uniqueness
    const trackArrays = [];
    tracks.forEach(track => {
      let id = `${track.title}-${track.creator}`;
      if (!songMap.has(id) && track.creator !== 'All Tracks' && track.creator !== 'I have spoken with God') {
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

  function handleFilter(val) {
    setFilter(val);
  }

  function handleFilterSongs(songs) {
    return songs.filter(s => `${s.creator} - ${s.title}`.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
  }

  if (songs.length === 0) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    )
  }

  function header() {
    const headerStyle = {
      position: 'fixed',
      width: '100%',
      height: '53px',
      backgroundColor: '#262626',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
    const titleStyle = {
      display: (window.innerWidth < 800 && window.innerHeight < 600) ? 'none' : null,
      margin: '0 1rem' 
    }
    const itemsStyle = {
      margin: '0.5rem 1rem'
    }

    return (
      <div style={headerStyle}>
        <div>
          {/* <p>Video Game Music Player</p> */}
          <p style={titleStyle}>VGM</p>
        </div>
        <div>
          <input value={filter} placeholder='Search...' onChange={(e) => handleFilter(e.target.value)}/>
          <select value={playlist} onChange={(event) => getPlaylist(event)} style={itemsStyle}>
            {PLAYLIST_OPTIONS.map(playlist => <option value={playlist} key={playlist}>{playlist}</option>)}
          </select>
        </div>
      </div>
    )
  }

  return (
    <div>
      {header()}
      <SongTable songs={handleFilterSongs(songs)} 
        selectSong={selectSong} 
        selectedSong={selectedSong} 
      />
      <PlayerControls songs={handleFilterSongs(songs)}
        selectSong={selectSong} 
        selectedSong={selectedSong} 
      />
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
  VIP: [5,1],
  mellow: [3,2],
  source: [5,1],
  exiled: [1,0],
  WAP: [3,0],
  CPP: [1,0]
}