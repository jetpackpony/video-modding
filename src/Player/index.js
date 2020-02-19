import React, { useRef, useEffect, useState } from 'react';
import HLS from 'hls.js';
import VideoSlider from './VideoSlider';

function Player({ video }) {
  const hlsURL = video.media.reddit_video.hls_url;
  const videoEl = useRef(null);
  const [videoData, setVideoData] = useState({ duration: 0 });

  useEffect(() => {
    console.log("Loading video");
    const vid = videoEl.current;
    const videoReady = () => {
      console.log("canplaythrough", videoEl.current.duration);
      setVideoData({
        duration: Math.floor(videoEl.current.duration * 100) / 100
      });
    };
    vid.addEventListener("canplaythrough", videoReady);

    const hls = new HLS();
    hls.loadSource(hlsURL);
    hls.attachMedia(videoEl.current);
    hls.on(HLS.Events.MANIFEST_PARSED, function () {
      console.log("Manifest parsed");
    });
    return () => {
      vid.removeEventListener("canplaythrough", videoReady);
    };
  }, [hlsURL]);

  return (
    <>
      <video ref={videoEl} controls width={1024} height={576}></video>
      {
        (videoData.duration > 0)
          ? (
            <VideoSlider
              duration={videoData.duration}
              onStartChange={(newStart) => console.log("Start changed: ", newStart)}
              onEndChange={(newEnd) => console.log("End changed: ", newEnd)}
            />
          )
          : null
      }
    </>
  );
};

export default Player;