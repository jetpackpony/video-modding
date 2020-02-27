import React from 'react';
import styles from './Player.module.css';

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
          ? <button onClick={pause}>Pause</button>
          : <button onClick={play}>Play</button>
      }
      <button onClick={replay}>Replay</button>
    </div>
  );
}

export default PlayButtons;