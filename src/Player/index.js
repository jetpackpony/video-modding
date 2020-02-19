import React, { useRef, useEffect, useState } from 'react';
import HLS from 'hls.js';
import VideoSlider from './VideoSlider';
import ProgressBar from './ProgressBar';

function Player({ video }) {
  const hlsURL = video.media.reddit_video.hls_url;
  const videoEl = useRef(null);
  const [videoData, setVideoData] = useState({ duration: 0, start: 0, end: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCuttentTime] = useState(0);

  const play = () => { videoEl.current.play() };
  const pause = () => { videoEl.current.pause() };
  const changeTime = (time) => { videoEl.current.currentTime = time };
  const replay = () => {
    changeTime(videoData.start);
    play();
  };

  useEffect(() => {
    const vid = videoEl.current;
    const onVideoReady = () => {
      // Only reset video data if it's the first time
      if (videoData.duration === 0) {
        const duration = Math.floor(videoEl.current.duration * 100) / 100;
        setVideoData({
          duration,
          start: 0,
          end: duration
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

    const onPlay = () => { setIsPlaying(true); };
    const onPause = () => { setIsPlaying(false); };

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
    setVideoData({
      ...videoData,
      start: newStart
    });
  };
  const onEndChange = (newEnd) => {
    console.log("End changed: ", newEnd);
    changeTime(newEnd - 1);
    play();
    setVideoData({
      ...videoData,
      end: newEnd
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
                onStartChange={onStartChange}
                onEndChange={onEndChange}
              />
              <ProgressBar
                duration={videoData.duration}
                isPlaying={isPlaying}
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