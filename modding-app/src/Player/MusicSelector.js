import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import React, { useState, useRef, useEffect } from 'react';
import Slider from 'rc-slider';
import styles from './Player.module.css';
import { debounce } from '../shared/utils';
const fs = window.require('fs');

const Range = Slider.createSliderWithTooltip(Slider.Range);

const musicDirectory = "/Users/pony/Projects/videos/music";
let musicFiles = [];
fs.readdir(musicDirectory, (err, files) => {
  if (err) {
    console.error("Couldn't read the music directory", err);
    throw Error("Couldn't read the music directory");
  }
  musicFiles = [
    ...files
  ];
});

function MusicSelector({
  selectedMusicFile,
  musicRangeValue,
  changeMusic,
  changeMusicRange
}) {
  const audioEl = useRef(null);
  const [duration, setDuration] = useState(0);

  const onMusicChanged = (e) => {
    console.log("Music changed: ", e.target.value);
    changeMusic(`${musicDirectory}/${e.target.value}`);
  };
  const onMusicRangeChange = debounce((e) => {
    console.log("Music Range changed: ", e);
    audioEl.current.currentTime = e[0];
    changeMusicRange(e[0]);
  });

  useEffect(() => {
    const aud = audioEl.current;
    if (!aud) return;
    const onAudioReady = () => {
      const duration = Math.floor(aud.duration * 100) / 100;
      aud.play();
      setDuration(duration);
    };
    aud.addEventListener("canplaythrough", onAudioReady);
    return () => {
      aud.removeEventListener("canplaythrough", onAudioReady);
    };
  }, [selectedMusicFile]);

  return (
    <>
      <select
        name="music"
        onChange={onMusicChanged}
      >
        <option value="">--- choose a song ---</option>
        {
          musicFiles.map((file) => (
            <option key={file} value={file}>
              {file}
            </option>
          ))
        }
      </select>
      {
        (selectedMusicFile !== "")
          ? (
            <>
              <audio
                ref={audioEl}
                controls
                src={`file://${selectedMusicFile}`}
              />
              <div className={styles.audioSlider}>
                <Range
                  min={0}
                  max={duration}
                  defaultValue={[0]}
                  tipFormatter={value => `${value}`}
                  step={0.01}
                  onChange={onMusicRangeChange}
                />
              </div>
            </>
          )
          : null
      }
    </>
  );
}

export default MusicSelector;