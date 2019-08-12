import React, {useState, useEffect} from 'react';
import AersiaServices from './services/AersiaServices';
import SongTable from './components/SongTable';
import ControlButton from './components/ControlButton';

const parser = require('fast-xml-parser');

function App() {

  const [songs, setSongs] = useState([]);
  const [playlist, setPlaylist] = useState('VIP');
  const [selectedSong, setSelectedSong] = useState(null);

  const [play, setPlay] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [previousSongs, setPreviousSongs] = useState([]);

  useEffect((() => {
    AersiaServices
      .getPlaylist('VIP')
      .then(playlist => {
        if (!playlist || parser.validate(playlist)) {
          const jsonObj = parser.parse(playlist);
          setSongs(cleanTracklist(jsonObj.playlist.trackList.track));
          // setSongs(jsonObj.playlist.trackList.track);
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
        // setSongs(jsonObj.playlist.trackList.track);
      } else {
        throw new Error('invalid playlist xml format');
      }
    } catch (exception) {
        console.log(exception);
    }

  }

  // ensures uniqueness
  function cleanTracklist(tracks) {
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


  function selectSong(songID) {
    setSelectedSong(songID);
    
  }

  function handlePlayPause() {
    setPlay(!play);
  }

  function getPreviousSong() {

  }

  function getNextSong() {

  }

  function handleShuffle() {

  }

  function handleVolume() {

  }

  return (
    <div>
      <p>playlist selected {playlist}</p>
      <p>Song selected {selectedSong}</p>
      {play === false ? 
        <ControlButton msg='play' click={() => handlePlayPause()} /> 
        : <ControlButton msg='pause' click={() => handlePlayPause()} />}
      <ControlButton msg='prev' click={() => getPreviousSong()} />
      <ControlButton msg='next' click={() => getNextSong()}/>
      <ControlButton msg='shuffle' click={() => handleShuffle()} />
      <ControlButton msg='volume' click={() => handleVolume()} />
      <select value={playlist} onChange={(event) => getPlaylist(event)}>
        {PLAYLIST_OPTIONS.map(playlist => <option value={playlist} key={playlist}>{playlist}</option>)}
      </select>
      <SongTable songs={songs} selectSong={selectSong} selectedSong={selectedSong}/>
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