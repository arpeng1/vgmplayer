import React, {useState, useEffect, useRef} from 'react';
import ControlButton from './ControlButton';
import ProgressBar from './ProgressBar';

function PlayerControls({songs, selectSong, selectedSong}) {

  const player = useRef();
  const trackBar = useRef();
  const point = useRef();
  const dragging = useRef();

  const [currentTrackMoment, setCurrentTrackMoment] = useState(0);
  const [currentTrackDuration, setCurrentTrackDuration] = useState(0);
  const [progressBarWidth, setProgressBarWidth ] = useState(0);

  const [play, setPlay] = useState(false);
  const [shuffle, setShuffle] = useState(true);
  const [previousSongs, setPreviousSongs] = useState([]);
  const [volume, setVolume] = useState(100);
  const [showVolume, setShowVolume] = useState(false);

  useEffect(() => {
    setCurrentTrackMoment(0);
    setCurrentTrackDuration(0);
    setProgressBarWidth(0);
    handleNewSong();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[selectedSong])

  function randomSongPosition() {
    return Math.floor(Math.random() * songs.length - 1);
  }

  function handleNewSong() {
    if (selectedSong) {
      setPreviousSongs(previousSongs.concat(selectedSong));
      player.current.src = selectedSong.location;
      player.current.play();
      setPlay(true);
    }
  }

  function handlePlay() {
    if (selectedSong === null) {
      const songPosition = shuffle ? randomSongPosition() : 0;
      const randomSong = songs[songPosition];
      selectSong(randomSong);
    } else if (play === true) {
      player.current.pause();
      setPlay(false);
    } else {
      player.current.play()
      setPlay(true);
    }
  }

  function handleTimeUpdate() {
    setCurrentTrackMoment(Math.floor(player.current.currentTime));
    if (!dragging.current) {
      setProgressBarWidth(
        ((player.current.currentTime / player.current.duration) * 100) + '%'
      );
    }
  }

  function handleLoadedMetaData() {
    setCurrentTrackDuration(Math.floor(player.current.duration));
  }

  function handlePreviousSong() {
    if (previousSongs.length > 1) {
      const song = previousSongs[previousSongs.length - 2];
      setPreviousSongs(previousSongs.slice(0, previousSongs.length - 2));
      selectSong(song);
    }
  }

  function handleNextSong() {
    const songPosition = shuffle ? 
      randomSongPosition() :
      songs.findIndex(song => song === selectedSong) + 1;
    const nextSong = songs[songPosition];
    selectSong(nextSong);
  }

  function handleShuffle() {
    setShuffle(!shuffle);
  }

  function handleVolume(e) {
    setVolume(e.target.value);
    player.current.volume = e.target.value / 100;
  }

  function handleError() {
    handleNextSong();
  }

  function handleSecondsToMinutes(sec) {
    if (sec === 0 || isNaN(sec)) return '00:00'
    let minutes = Math.floor(sec / 60) + '';
    let seconds = sec - minutes * 60 + ''; 
    minutes = minutes.length === 1 ? '0' + minutes : minutes;
    seconds = seconds.length === 1 ? '0' + seconds : seconds;
    return `${minutes}:${seconds}`;
  }

  function handlePointPosition(position) {
    const trackBarWidth = trackBar.current.offsetWidth;
    const handleLeft = position - trackBar.current.offsetLeft;
    const pointPercent = ((handleLeft / trackBarWidth) * 100);

    if (handleLeft > 0 && handleLeft < trackBarWidth) {
      setProgressBarWidth(pointPercent + '%');
    } else if (handleLeft < 0) {
      setProgressBarWidth('0%');
    } else if (handleLeft > trackBarWidth) {
      setProgressBarWidth('100%');
    }
  }

  function handleMouseMove(e) {
    dragging.current = true;
    handlePointPosition(e.pageX);
  }

  function handleMouseUp(e) {
    const trackBarWidth = trackBar.current.offsetWidth;
    const handleLeft = e.pageX - trackBar.current.offsetLeft;
    const pointPercent = (handleLeft / trackBarWidth);

    if (selectedSong) {
      player.current.currentTime = (pointPercent * player.current.duration);
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

  function controlPlayer() {
    const playerStyle = {
      position: 'fixed',
      paddingBottom: '10px',
      bottom: '0',
      width: '100%',
      height: '50px',
      backgroundColor: '#262626'
    }
    
    const controlStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-evenly'
    }

    const progressStyle = {
      display: 'flex',
      alignItems: 'center',
    }

    const timeStyle = {
      margin: '0 1rem'
    }

    const testStyle = {
      display: 'grid',
      gridTemplateColumns: '40% auto 40%'
    }

    const selectedSongStyle = {
      margin: '0 1rem'
    }

    const volumeStyle = {
      width: '100%'
    }

    return (
      <div style={playerStyle}>
        <div style={progressStyle}>
          <p style={timeStyle}>{handleSecondsToMinutes(currentTrackMoment)}</p>
          <ProgressBar 
            progressPercent={progressBarWidth} 
            trackBarRef={trackBar} 
            pointRef={point} 
            mouseDown={handleMouseDown}
          />
          <p style={timeStyle}>{handleSecondsToMinutes(currentTrackDuration - currentTrackMoment)}</p>
        </div>
        <div style={testStyle}>
          <div style={selectedSongStyle}>
            {selectedSong ? `${selectedSong.title}` : ''}
          </div>
          <div style={controlStyle}>
            {shuffle ? 
              <ControlButton img='shuffle' click={handleShuffle} color={'#FF9148'} /> :
              <ControlButton img='shuffle' click={handleShuffle} />
            }
            <ControlButton img='skip_previous' click={handlePreviousSong} />
            {play ? 
              <ControlButton img='pause_circle_outline' click={handlePlay} /> :
              <ControlButton img='play_circle_outline' click={handlePlay} /> 
            }
            <ControlButton img='skip_next' click={handleNextSong}/>
            <ControlButton img='volume_up' click={() => setShowVolume(!showVolume)} />
          </div>
          <div>
            {showVolume ? 
              <div style={volumeStyle}>
                <input type='range' min='0' max='100' value={volume} onChange={(e) => handleVolume(e)}/>
              </div>
            : null}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <audio 
      ref={player}
      onTimeUpdate={() => handleTimeUpdate()}
      onLoadedMetadata={() => handleLoadedMetaData()}
      onEnded={() => handleNextSong()} 
      onError={() => handleError()}
      >
        Oops
      </audio>
      {controlPlayer()}
    </div>
  )
}

export default PlayerControls;