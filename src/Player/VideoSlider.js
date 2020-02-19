import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import React, { useRef } from 'react';
import Slider from 'rc-slider';
import styles from './Player.module.css';

const Range = Slider.createSliderWithTooltip(Slider.Range);

function VideoSlider({
  onStartChange,
  onEndChange,
  duration,
}) {
  const start = 0;
  const end = duration;

  const startTime = useRef(start);
  const endTime = useRef(end);
  return (
    <div className={styles.videoSlider}>
      <Range
        min={0}
        max={duration}
        defaultValue={[start, end]}
        tipFormatter={value => `${value}`}
        step={0.01}
        pushable={1}
        onChange={(e) => {
          const newStart = e[0];
          const newEnd = e[1];
          if (startTime.current !== newStart) {
            startTime.current = newStart;
            onStartChange(startTime.current);
          }
          if (endTime.current !== newEnd) {
            endTime.current = newEnd;
            onEndChange(endTime.current);
          }
        }}
      />
    </div>
  );
}

export default VideoSlider;