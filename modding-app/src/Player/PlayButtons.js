import React from 'react';
import styles from './Player.module.css';
import { PlayArrow, Replay, Pause } from '@material-ui/icons';

function PlayButtons({
  isPlaying,
  play,
  pause,
  replay,
}) {
  return (
    <div className={styles.playButtons}>
      {
        (isPlaying)
          ? <button onClick={pause}><Pause/></button>
          : <button onClick={play}><PlayArrow/></button>
      }
      <button onClick={replay}><Replay/></button>
    </div>
  );
}

export default PlayButtons;