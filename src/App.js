import React, {useState, useEffect, useRef} from 'react';
import AersiaServices from './services/AersiaServices';
import SongTable from './components/SongTable';
import ControlButton from './components/ControlButton';
import ProgressBar from './components/ProgressBar';

const parser = require('fast-xml-parser');

function App() {
  const player = useRef();
  const trackBar = useRef();
  const point = useRef();
  const dragging = useRef();

  const [songs, setSongs] = useState([]);
  const [playlist, setPlaylist] = useState('VIP');
  const [selectedSong, setSelectedSong] = useState(null);
  const [progressBarWidth, setProgressBarWidth] = useState(0);

  const [play, setPlay] = useState(false);
  const [shuffle, setShuffle] = useState(true);
  const [previousSongs, setPreviousSongs] = useState([]);

  // on initial load, grabs playlists
  useEffect((() => {
    AersiaServices
      .getPlaylist('VIP')
      .then(playlist => {
        if (!playlist || parser.validate(playlist)) {
          const jsonObj = parser.parse(playlist);
          console.log(jsonObj, jsonObj.playlist.trackList.track);
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

  function randomSongPosition() {
    return Math.floor(Math.random() * songs.length);
  }

  function selectSong(song) {
    if (selectedSong === null) {
      setSelectedSong(song);
    } else {
      setPreviousSongs(previousSongs.concat(selectedSong));
      setSelectedSong(song);
    }
    console.log('select song: ', song);
    player.current.src = song.location;
    player.current.play();
    setPlay(true);
  }

  function handlePlayPause() {
    if (selectedSong === null) { // init load, no song selected yet
      const songPosition = shuffle ? randomSongPosition() : 0;
      const randomSong = songs[songPosition];
      selectSong(randomSong);
    } else if (play === true) { // song currently playing, pause
      player.current.pause();
      setPlay(false);
    } else { // song currently paused, play
      player.current.play();
      setPlay(true);
    }
  }

  function handleTimeUpdate() {
    if (!dragging.current) {
      // console.log('updating width', player.current.currentTime / player.current.duration * 100)
      setProgressBarWidth(
        Math.round((player.current.currentTime / player.current.duration) * 100) + '%');
    }
  }

  function getPreviousSong() {
    if (previousSongs.length > 0) {
      const song = previousSongs[previousSongs.length - 1];
      setPreviousSongs(previousSongs.slice(0, previousSongs.length - 1));
      player.current.src = song.location;
      player.current.play();
    }
  }

  function getNextSong() {
    const songPosition = shuffle ? randomSongPosition() :
      songs.findIndex(song => song === selectedSong) + 1;
    const nextSong = songs[songPosition];
    selectSong(nextSong);
  }

  function handleShuffle() {
    setShuffle(!shuffle);
  }

  function handleVolume() {

  }

  function handlePointPosition(position) {
    // let trackBarWidth = trackBar.current.offsetWidth - point.current.offsetWidth;
    let trackBarWidth = trackBar.current.offsetWidth;
    let handleLeft = position - trackBar.current.offsetLeft;
    let pointPercent = Math.floor((handleLeft / trackBarWidth) * 100);

    if (handleLeft > 0 && handleLeft < trackBarWidth) {
      setProgressBarWidth(pointPercent + '%');
    } else if (handleLeft < 0) {
      setProgressBarWidth('0%');
    } else if (handleLeft > trackBarWidth) {
      setProgressBarWidth('100%');
    }
    
    // console.log('handle point position', pointPercent);
    // console.log(handleLeft, trackBarWidth, point.current.offsetWidth, (handleLeft / trackBarWidth) * 100);

  }

  function handleMouseMove(e) {
    dragging.current = true;
    handlePointPosition(e.pageX);
  }

  function handleMouseUp(e) {
    // dragging.current = false;
    // let trackBarWidth = trackBar.current.offsetWidth - point.current.offsetWidth;
    let trackBarWidth = trackBar.current.offsetWidth;
    let handleLeft = e.pageX - trackBar.current.offsetLeft;
    let pointPercent = (handleLeft / trackBarWidth)
    // console.log('mouse up', pointPercent)

    if (selectedSong) {
      player.current.currentTime = Math.floor(pointPercent * player.current.duration);
      // player.current.currentTime = Math.floor(((e.pageX - trackBar.current.offsetLeft) / (trackBar.current.offsetWidth - point.current.offsetWidth)) * player.current.duration);
    }
    dragging.current = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }

  function handleMouseDown(e) {
    dragging.current = true;
    handlePointPosition(e.pageX);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
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
      <p>playlist selected {playlist}</p>
      <p>Shuffle: {shuffle}</p>
      <p>Previous Songs: {previousSongs.map(s => s.title)}</p>
      {selectedSong ? 
      <p>Song selected: {selectedSong.title}</p> :
      <p>No song selected</p>
      }
      {/* {play ? <p>Playing song: {selectedSong}</p> : <p>Paused</p>}  */}
      {play ? 
        <ControlButton msg='pause' click={handlePlayPause} /> :
        <ControlButton msg='play' click={handlePlayPause} /> 
      }
      <ControlButton msg='prev' click={getPreviousSong} />
      <ControlButton msg='next' click={getNextSong}/>
      {shuffle ? 
        <ControlButton msg='linear' click={handleShuffle} /> :
        <ControlButton msg='shuffle' click={handleShuffle} />
      }
      <ControlButton msg='volume' click={handleVolume} />
      <ProgressBar 
        progressPercent={progressBarWidth} 
        trackBarRef={trackBar} 
        pointRef={point} 
        mouseDown={handleMouseDown}
        />
      <select value={playlist} onChange={(event) => getPlaylist(event)}>
        {PLAYLIST_OPTIONS.map(playlist => <option value={playlist} key={playlist}>{playlist}</option>)}
      </select>
      <SongTable songs={songs} selectSong={selectSong} selectedSong={selectedSong}/>
      <audio 
      ref={player}
      onTimeUpdate={() => handleTimeUpdate()}
      onEnded={() => getNextSong()} 
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
  VIP: 5,
  mellow: 3,
  source: 5,
  exiled: 1,
  WAP: 3,
  CPP: 1
}