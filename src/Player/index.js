import React, { useRef, useEffect, useState } from 'react';
import HLS from 'hls.js';
import VideoSlider from './VideoSlider';

function Player({ video }) {
  const hlsURL = video.media.reddit_video.hls_url;
  const videoEl = useRef(null);
  const [videoData, setVideoData] = useState({ duration: 0, start: 0, end: 0 });

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
        vid.pause();
        vid.currentTime = videoData.end;
      }
    };
    vid.addEventListener("canplaythrough", onVideoReady);
    vid.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      vid.removeEventListener("canplaythrough", onVideoReady);
      vid.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [videoData]);

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
    videoEl.current.currentTime = newStart;
    videoEl.current.play();
    setVideoData({
      ...videoData,
      start: newStart
    });
  };
  const onEndChange = (newEnd) => {
    console.log("End changed: ", newEnd);
    videoEl.current.currentTime = newEnd - 1;
    videoEl.current.play();
    setVideoData({
      ...videoData,
      end: newEnd
    });
  };

  return (
    <>
      <video ref={videoEl} controls width={1024} height={576}></video>
      {
        (videoData.duration > 0)
          ? (
            <VideoSlider
              duration={videoData.duration}
              onStartChange={onStartChange}
              onEndChange={onEndChange}
            />
          )
          : null
      }
    </>
  );
};

export default Player;