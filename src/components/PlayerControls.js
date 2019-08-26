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

  function handleVolume() {
    
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
      backgroundColor: 'white'
    }
    
    const controlStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
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
      gridTemplateColumns: '30% auto 30%'
    }

    const selectedSongStyle = {
      margin: '0 1rem'
    }
    const playlistsStyle = {
      textAlign: 'right',
      margin: '0 1rem'
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
              <ControlButton msg='linear' click={handleShuffle} /> :
              <ControlButton msg='shuffle' click={handleShuffle} />
            }
            <ControlButton msg='prev' click={handlePreviousSong} />
            {play ? 
              <ControlButton msg='pause' click={handlePlay} /> :
              <ControlButton msg='play' click={handlePlay} /> 
            }
            <ControlButton msg='next' click={handleNextSong}/>
            <ControlButton msg='volume' click={handleVolume} />
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
      >
        Oops
      </audio>
      {controlPlayer()}
    </div>
  )
}

export default PlayerControls;