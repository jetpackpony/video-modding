import React, { useRef, useEffect, useState, useReducer } from 'react';
import HLS from 'hls.js';
import VideoSlider from './VideoSlider';
import ProgressBar from './ProgressBar';
import { actions, initialState, reducer } from './playerReducer';

function Player({ video }) {
  const hlsURL = video.media.reddit_video.hls_url;
  const videoEl = useRef(null);
  const [videoData, dispatch] = useReducer(reducer, initialState);
  const [currentTime, setCuttentTime] = useState(0);

  const play = () => { videoEl.current.play() };
  const pause = () => { videoEl.current.pause() };
  const changeTime = (time) => { videoEl.current.currentTime = time };
  const replay = () => {
    changeTime(videoData.start);
    play();
  };

  useEffect(() => {
    console.log("Creating listeners", videoData);
    const vid = videoEl.current;
    const onVideoReady = () => {
      // Only reset video data if it's the first time
      if (videoData.duration === 0) {
        const duration = Math.floor(videoEl.current.duration * 100) / 100;
        dispatch({
          type: actions.INIT_VIDEO,
          duration
        });
      }
    };
    const onTimeUpdate = () => {
      if (vid.currentTime < videoData.start) {
        vid.currentTime = videoData.start;
      }
      if (vid.currentTime > videoData.end) {
        pause();
        vid.currentTime = videoData.end;
      }
      setCuttentTime(vid.currentTime);
    };

    const onPlay = () => {
      dispatch({
        type: actions.SET_IS_PLAYING,
        isPlaying: true
      });
    };
    const onPause = () => {
      dispatch({
        type: actions.SET_IS_PLAYING,
        isPlaying: false
      });
    };

    vid.addEventListener("canplaythrough", onVideoReady);
    vid.addEventListener("timeupdate", onTimeUpdate);
    vid.addEventListener("play", onPlay);
    vid.addEventListener("pause", onPause);
    return () => {
      vid.removeEventListener("canplaythrough", onVideoReady);
      vid.removeEventListener("timeupdate", onTimeUpdate);
      vid.removeEventListener("play", onPlay);
      vid.removeEventListener("pause", onPause);
    };
  }, [videoData]);

  // Load HLS data into video element
  useEffect(() => {
    console.log("Loading video");
    const hls = new HLS();
    hls.loadSource(hlsURL);
    hls.attachMedia(videoEl.current);
    hls.on(HLS.Events.MANIFEST_PARSED, function () {
      console.log("Manifest parsed");
    });
  }, [hlsURL]);

  const onStartChange = (newStart) => {
    console.log("Start changed: ", newStart);
    changeTime(newStart);
    play();
    dispatch({
      type: actions.UPDATE_START,
      newStart
    });
  };
  const onEndChange = (newEnd) => {
    console.log("End changed: ", newEnd);
    changeTime(newEnd - 1);
    play();
    dispatch({
      type: actions.UPDATE_END,
      newEnd
    });
  };

  return (
    <>
      <video ref={videoEl} controls autoPlay width={1024} height={576}></video>
      {
        (videoData.duration > 0)
          ? (
            <>
              <VideoSlider
                duration={videoData.duration}
                startTime={videoData.start}
                endTime={videoData.end}
                onStartChange={onStartChange}
                onEndChange={onEndChange}
              />
              <ProgressBar
                duration={videoData.duration}
                isPlaying={videoData.isPlaying}
                changeTime={changeTime}
                play={play}
                pause={pause}
                replay={replay}
                currentTime={currentTime}
              />
            </>
          )
          : null
      }
    </>
  );
};

export default Player;