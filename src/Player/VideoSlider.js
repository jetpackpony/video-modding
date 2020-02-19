import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import React, { useRef } from 'react';
import Slider from 'rc-slider';
import styles from './Player.module.css';

const Range = Slider.createSliderWithTooltip(Slider.Range);

const debounce = (callback, timeout = 100) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(null, args), timeout);
  };
};

function VideoSlider({
  onStartChange,
  onEndChange,
  duration,
  startTime,
  endTime
}) {
  const start = 0;
  const end = duration;

  const onChange = debounce((e) => {
    const newStart = e[0];
    const newEnd = e[1];
    if (startTime !== newStart) {
      onStartChange(newStart);
    }
    if (endTime !== newEnd) {
      onEndChange(newEnd);
    }
  });
  return (
    <div className={styles.videoSlider}>
      <Range
        min={0}
        max={duration}
        defaultValue={[start, end]}
        tipFormatter={value => `${value}`}
        step={0.01}
        pushable={1}
        onChange={onChange}
      />
    </div>
  );
}

export default VideoSlider;