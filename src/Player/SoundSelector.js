import React, { useState, useEffect } from 'react';
import MusicSelector from './MusicSelector';

function SoundSelector({
  mute,
  unmute,
  selectedMusicFile,
  musicRangeValue,
  changeMusic,
  changeMusicRange
}) {
  const [selectedSetting, setSetting] = useState("original");
  const onSettingChange = (e) => {
    const val = e.target.value;
    switch(val) {
      case "mute":
      case "add-music":
        mute();
        break;
      case "original":
      default:
        unmute();
        break;
    }
    setSetting(val);
  };

  return (
    <div>
      <div>
        <input
          type="radio"
          id="original"
          name="sound-setting"
          value="original"
          checked={selectedSetting === "original"}
          onChange={onSettingChange}
        />
        <label htmlFor="original">keep original</label>
      </div>
      <div>
        <input
          type="radio"
          id="mute"
          name="sound-setting"
          value="mute"
          checked={selectedSetting === "mute"}
          onChange={onSettingChange}
        />
        <label htmlFor="mute">mute</label>
      </div>
      <div>
        <input
          type="radio"
          id="add-music"
          name="sound-setting"
          value="add-music"
          checked={selectedSetting === "add-music"}
          onChange={onSettingChange}
        />
        <label htmlFor="add-music">replace with music</label>
        {
          (selectedSetting === "add-music")
            ? <MusicSelector
              selectedMusicFile={selectedMusicFile}
              musicRangeValue={musicRangeValue}
              changeMusic={changeMusic}
              changeMusicRange={changeMusicRange}
            />
                  : null
              }
      </div>
    </div>
  );
}

export default SoundSelector;