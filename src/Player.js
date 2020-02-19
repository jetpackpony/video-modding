import React, { useRef, useEffect } from 'react';
import HLS from 'hls.js';

function Player({ video }) {
  const hlsURL = video.media.reddit_video.hls_url;
  const videoEl = useRef(null);

  useEffect(() => {
    const hls = new HLS();
    hls.loadSource(hlsURL);
    hls.attachMedia(videoEl.current);
    hls.on(HLS.Events.MANIFEST_PARSED, function () {
      // videoEl.current.play();
    });
  }, [hlsURL]);

  return (
    <video ref={videoEl} controls width={1024} height={576}></video>
  );
};

export default Player;