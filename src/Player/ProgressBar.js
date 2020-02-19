import React from 'react';
import styles from './Player.module.css';

function ProgressBar({
  duration,
  isPlaying,
  changeTime,
  play,
  pause,
  replay,
  currentTime
}) {
  const progress = Math.round((currentTime / duration) * 100);
  const onProgressClick = (e) => {
    const pos = e.pageX - e.currentTarget.offsetLeft;
    const newTime = pos / e.currentTarget.offsetWidth * duration;
    changeTime(newTime);
  };

  return (
    <div>
      <div className={styles.progressBar} onClick={onProgressClick}>
        <div className={styles.progressBarInner} style={{ width: `${progress}%`}}>
        </div>
      </div>
      {
        (isPlaying)
          ? <button onClick={pause}>Pause</button>
          : <button onClick={play}>Play</button>
      }
      <button onClick={replay}>Replay</button>
    </div>
  );
}

export default ProgressBar;