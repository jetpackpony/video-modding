import React from 'react';
import styles from './Player.module.css';

function ProgressBar({
  duration,
  changeTime,
  currentTime
}) {
  const progress = Math.round((currentTime / duration) * 100);
  const onProgressClick = (e) => {
    const pos = e.pageX - e.currentTarget.offsetLeft;
    const newTime = pos / e.currentTarget.offsetWidth * duration;
    changeTime(newTime);
  };

  return (
    <div className={styles.progressBar} onClick={onProgressClick}>
      <div className={styles.progressBarInner} style={{ width: `${progress}%` }}>
      </div>
    </div>
  );
}

export default ProgressBar;